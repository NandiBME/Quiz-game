import { render } from 'preact';
import { useEffect, useMemo, useState, useCallback } from 'preact/hooks';
import './styles/style.css';
import { MainPanel } from './MainPanel';
import { WelcomePanel } from './WelcomePanel';
import { SidePanel } from './SidePanel';
import { OptionsPanel, GameOptions } from './OptionsPanel';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { BottomPanel } from './BottomPanel';
import { ErrorPanel } from './ErrorPanel';
import './styles/ErrorPanel.css';
import { LeaderboardPanel } from './LeaderboardPanel';
import './styles/LeaderboardPanel.css';

/**
 * Raw question data returned from the Open Trivia Database API.
 */
type ApiQuestion = {
    /** Question type ('multiple' or 'boolean') */
    type: string;
    /** Difficulty level ('easy', 'medium', or 'hard') */
    difficulty: string;
    /** Question category name */
    category: string;
    /** HTML-encoded question text */
    question: string;
    /** HTML-encoded correct answer */
    correct_answer: string;
    /** Array of HTML-encoded incorrect answers */
    incorrect_answers: string[];
};

/**
 * API response structure from Open Trivia Database.
 */
type ApiResponse = {
    /** Response code (0 = success, 1 = no results, 2 = invalid parameter, etc.) */
    response_code: number;
    /** Array of question objects */
    results: ApiQuestion[];
};

/**
 * Options for configuring API requests to Open Trivia Database.
 */
type ApiOptions = {
    /** Number of questions to fetch */
    amount: number;
    /** Category ID (0 = any category) */
    category: number;
    /** Difficulty level or 'any' for mixed difficulties */
    difficulty: 'easy' | 'medium' | 'hard' | 'any';
    /** Question type filter (optional) */
    type?: 'multiple' | 'boolean';
};

/**
 * Processed quiz question with decoded HTML and shuffled options.
 */
type QuizQuestion = {
    /** Question type ('multiple' or 'boolean') */
    type: string;
    /** Decoded question text */
    question: string;
    /** Decoded correct answer (always first in options array) */
    correctAnswer: string;
    /** Array of all answer options with correct answer first */
    options: string[];
    /** Question category name */
    category: string;
    /** Difficulty level */
    difficulty: string;
};

/**
 * Leaderboard entry storing player score and metadata.
 */
type LeaderboardEntry = {
    /** Player name */
    name: string;
    /** Number of correct answers */
    score: number;
    /** Weighted score accounting for difficulty and time */
    trueScore: number;
    /** ISO timestamp of when the score was achieved */
    date: string;
};

/**
 * Decodes HTML entities in a string.
 * 
 * Uses DOMParser to convert HTML-encoded text (e.g., "&quot;" to '"')
 * back to plain text for display.
 * 
 * @param html - HTML-encoded string
 * @returns Decoded plain text string
 * 
 * @example
 * ```tsx
 * decodeHtml("What&rsquo;s the capital?")
 * // Returns: "What's the capital?"
 * ```
 */
function decodeHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent || html;
}

/**
 * Main application component managing the quiz game state and flow.
 * 
 * Handles:
 * - Fetching questions from Open Trivia Database API
 * - Managing game state (welcome, playing, finished, error)
 * - Theme switching (light/dark mode)
 * - Timer tracking during gameplay
 * - Leaderboard persistence in localStorage
 * - Score calculation with difficulty weighting
 * 
 * State Flow:
 * 1. WelcomePanel - Initial screen with start button
 * 2. Loading - CircularProgress while fetching questions
 * 3. MainPanel - Active quiz gameplay
 * 4. LeaderboardPanel - Results and high scores
 * 5. ErrorPanel - Shown on API failures (e.g., 429 rate limit)
 * 
 * @example
 * ```tsx
 * render(<App />, document.getElementById('app'));
 * ```
 */
function App() {
    /** Current quiz questions or null if not loaded */
    const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
    /** Error message or null if no error */
    const [error, setError] = useState<string | null>(null);
    /** Leaderboard entries loaded from localStorage */
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
        const raw = localStorage.getItem('quiz:leaderboard');
        try {
            const parsed = raw ? (JSON.parse(raw) as any[]) : [];
            return parsed.map((e) => ({
                name: e.name,
                score: e.score,
                trueScore: e.trueScore ?? e.score ?? 0,
                date: e.date,
            }));
        } catch {
            return [];
        }
    });
    /** Current theme ('light' or 'dark') */
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    /** Whether the side panel (options) is open */
    const [sideOpen, setSideOpen] = useState(false);
    /** Whether a game session has started */
    const [gameStarted, setGameStarted] = useState(false);
    /** Elapsed time in seconds since game start */
    const [elapsed, setElapsed] = useState(0);
    /** Active game options (currently being used) */
    const [gameOptions, setGameOptions] = useState<GameOptions>({
        amount: 5,
        category: 0,
        difficulty: 'any',
        type: 'any',
    });
    /** Pending game options (user selections not yet applied) */
    const [pendingOptions, setPendingOptions] = useState<GameOptions>(gameOptions);
    /** Final score stats when quiz completes, or null during gameplay */
    const [finishedStats, setFinishedStats] = useState<{ score: number; trueScore: number } | null>(null);

    /**
     * Constructs the API URL with query parameters based on game options.
     * 
     * @param opts - Game configuration options
     * @returns Full API URL with encoded parameters
     */
    const buildApiUrl = useCallback((opts: GameOptions) => {
        const params = new URLSearchParams();
        params.set('amount', String(opts.amount));
        if (opts.category > 0) params.set('category', String(opts.category));
        if (opts.difficulty !== 'any') params.set('difficulty', opts.difficulty);
        if (opts.type !== 'any') params.set('type', opts.type);
        return `https://opentdb.com/api.php?${params.toString()}`;
    }, []);

    /**
     * Fetches questions from the Open Trivia Database API.
     * 
     * Handles decoding HTML entities and constructing QuizQuestion objects
     * with the correct answer always placed first in the options array.
     * 
     * @param opts - Game configuration options for the API request
     */
    const fetchQuestions = useCallback(
        async (opts: GameOptions) => {
            setError(null);
            setQuestions(null);
            try {
                const res = await fetch(buildApiUrl(opts));
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = (await res.json()) as ApiResponse;
                const parsed = data.results.map((q) => ({
                    type: q.type,
                    question: decodeHtml(q.question),
                    correctAnswer: decodeHtml(q.correct_answer),
                    options: [decodeHtml(q.correct_answer), ...q.incorrect_answers.map(decodeHtml)],
                    category: q.category,
                    difficulty: q.difficulty,
                })) as QuizQuestion[];
                setQuestions(parsed);
            } catch (e: any) {
                setError(e.message || 'Fetch error');
            }
        },
        [buildApiUrl]
    );

    /**
     * Updates pending options when user changes settings in side panel.
     * 
     * @param opts - New game options selected by user
     */
    const handleOptionsChange = (opts: GameOptions) => {
        setPendingOptions(opts);
    };

    /**
     * Applies options and initiates a new question fetch.
     * 
     * @param opts - Game options to apply and use for fetching
     */
    const applyOptionsAndFetch = (opts: GameOptions) => {
        setGameOptions(opts);
        fetchQuestions(opts);
    };

    /**
     * Retries fetching questions after an error (e.g., 429 rate limit).
     */
    const handleRetry = () => {
        setError(null);
        setSideOpen(false);
        setGameStarted(true);
        setElapsed(0);
        applyOptionsAndFetch(pendingOptions);
    };

    /**
     * Restarts the game with current pending options.
     */
    const handleRestart = () => {
        setSideOpen(false);
        setGameStarted(true);
        applyOptionsAndFetch(pendingOptions);
        setElapsed(0);
    };

    /**
     * Starts a new game from the welcome screen.
     */
    const handleStart = () => {
        setGameStarted(true);
        applyOptionsAndFetch(pendingOptions);
        setElapsed(0);
    };

    /**
     * Saves a completed game score to the leaderboard in localStorage.
     * 
     * Sorts entries by trueScore (weighted), then by score (correct answers),
     * and keeps only the top 10 entries.
     * 
     * @param name - Player name
     * @param correct - Number of correct answers
     * @param trueScore - Weighted score accounting for difficulty and time
     */
    function saveToLeaderboard(name: string, correct: number, trueScore: number) {
        const entry: LeaderboardEntry = {
            name,
            score: correct,
            trueScore,
            date: new Date().toISOString(),
        };
        setLeaderboard((prev) => {
            const next = [entry, ...prev]
                .sort((a, b) => b.trueScore - a.trueScore || b.score - a.score)
                .slice(0, 10);
            try {
                localStorage.setItem('quiz:leaderboard', JSON.stringify(next));
            } catch {}
            return next;
        });
    }

    /**
     * Handles quiz completion, storing final score and trueScore.
     * 
     * @param score - Number of correct answers
     * @param trueScore - Weighted score with difficulty and time adjustments
     */
    const handleComplete = (score: number, trueScore: number) => {
        setFinishedStats({ score, trueScore });
    };

    /**
     * Saves the current score with player name to leaderboard.
     * 
     * @param name - Player name to associate with the score
     */
    const handleSaveScore = (name: string) => {
        if (!finishedStats) return;
        saveToLeaderboard(name, finishedStats.score, finishedStats.trueScore);
    };

    /**
     * Resets state to play another game.
     */
    const handlePlayAgain = () => {
        setFinishedStats(null);
        setGameStarted(false);
        setElapsed(0);
    };

    /**
     * Formatted time string (MM:SS) computed from elapsed seconds.
     */
    const timeText = useMemo(() => {
        const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const s = (elapsed % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }, [elapsed]);

    // Apply theme class to document root
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('theme-transition');
        root.setAttribute('data-theme', theme);
    }, [theme]);

    /** Whether questions are currently being loaded */
    const loading = gameStarted && !error && !questions;

    // Timer tick effect (runs during active gameplay)
    useEffect(() => {
        if (!gameStarted || error || finishedStats !== null || loading) return;
        const id = setInterval(() => setElapsed((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, [gameStarted, error, finishedStats, loading]);

    const errorCode = error?.match?.(/^HTTP\s+(\d+)/)?.[1] || error;

    return (
        <div className={`app theme-${theme}`}>
            <div className="app-shell">
                {error ? (
                    <ErrorPanel code={errorCode} message={error} onRetry={handleRetry} />
                ) : !gameStarted ? (
                    <WelcomePanel onStart={handleStart} />
                ) : finishedStats !== null ? (
                    <LeaderboardPanel
                        score={finishedStats.score}
                        trueScore={finishedStats.trueScore}
                        entries={leaderboard}
                        onSave={handleSaveScore}
                        onPlayAgain={handlePlayAgain}
                    />
                ) : loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '100vh',
                            background: 'var(--app-bg)',
                        }}
                    >
                        <CircularProgress size={60} sx={{ color: 'var(--accent)' }} />
                    </Box>
                ) : (
                    <MainPanel
                        questions={questions}
                        onFinish={(name, sc) => saveToLeaderboard(name, sc, sc)}
                        onComplete={handleComplete}
                        time={timeText}
                        theme={theme}
                        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                        onToggleSidePanel={() => setSideOpen(true)}
                        elapsedSeconds={elapsed}
                    />
                )}
                <SidePanel
                    open={sideOpen}
                    onClose={() => setSideOpen(false)}
                    onOptionsChange={handleOptionsChange}
                    onRestart={handleRestart}
                />
            </div>
            <BottomPanel />
        </div>
    );
}

render(<App />, document.getElementById('app'));