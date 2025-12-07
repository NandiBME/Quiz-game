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

type ApiQuestion = {
    type: string;
    difficulty: string;
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
};

type ApiResponse = {
    response_code: number;
    results: ApiQuestion[];
};
type ApiOptions = {
    amount: number;
    category: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'any';
    type?: 'multiple' | 'boolean';
};

type QuizQuestion = {
    type: string;
    question: string;
    correctAnswer: string;
    options: string[];
    category: string;
    difficulty: string;
};

type LeaderboardEntry = {
    name: string;
    score: number;
    date: string;
};

function decodeHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent || html;
}

function App() {
    const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
        const raw = localStorage.getItem('quiz:leaderboard');
        try {
            return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
        } catch {
            return [];
        }
    });
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [sideOpen, setSideOpen] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [gameOptions, setGameOptions] = useState<GameOptions>({
        amount: 5,
        category: 0,
        difficulty: 'any',
        type: 'any',
    });
    const [pendingOptions, setPendingOptions] = useState<GameOptions>(gameOptions);

    const buildApiUrl = useCallback((opts: GameOptions) => {
        const params = new URLSearchParams();
        params.set('amount', String(opts.amount));
        if (opts.category > 0) params.set('category', String(opts.category));
        if (opts.difficulty !== 'any') params.set('difficulty', opts.difficulty);
        if (opts.type !== 'any') params.set('type', opts.type);
        return `https://opentdb.com/api.php?${params.toString()}`;
    }, []);

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

    const handleOptionsChange = (opts: GameOptions) => {
        setPendingOptions(opts); // only store, don’t fetch yet
    };

    const applyOptionsAndFetch = (opts: GameOptions) => {
        setGameOptions(opts);
        fetchQuestions(opts);
    };

    const handleRestart = () => {
        setSideOpen(false);
        setGameStarted(true);
        applyOptionsAndFetch(pendingOptions);
        setElapsed(0);
    };

    const handleStart = () => {
        setGameStarted(true);
        applyOptionsAndFetch(pendingOptions);
        setElapsed(0);
    };

    const timeText = useMemo(() => {
        const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const s = (elapsed % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }, [elapsed]);

    function saveToLeaderboard(name: string, finalScore: number) {
        const entry: LeaderboardEntry = { name, score: finalScore, date: new Date().toISOString() };
        setLeaderboard((prev) => {
            const next = [entry, ...prev].sort((a, b) => b.score - a.score).slice(0, 10);
            try {
                localStorage.setItem('quiz:leaderboard', JSON.stringify(next));
            } catch {
                /* ignore storage errors */
            }
            return next;
        });
    }

    // ensure CSS variables switch when theme changes
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('theme-transition');
        root.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className={`app theme-${theme}`}>
            <div className="app-shell">
                {!gameStarted ? (
                    <WelcomePanel onStart={handleStart} />
                ) : (
                    <MainPanel
                        questions={questions}
                        onFinish={(name, sc) => saveToLeaderboard(name, sc)}
                        time={timeText}
                        theme={theme}
                        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                        onToggleSidePanel={() => setSideOpen(true)}
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