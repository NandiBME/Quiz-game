import { render } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import './styles/style.css';
import { MainPanel } from './MainPanel';
import { SidePanel } from './SidePanel';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

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
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setElapsed((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        document.documentElement.classList.add('theme-transition');
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    function saveToLeaderboard(name: string, finalScore: number) {
        const entry: LeaderboardEntry = { name, score: finalScore, date: new Date().toISOString() };
        setLeaderboard((prev) => {
            const next = [entry, ...prev].sort((a, b) => b.score - a.score).slice(0, 10);
            try {
                localStorage.setItem('quiz:leaderboard', JSON.stringify(next));
            } catch {
                /* ignore */
            }
            return next;
        });
    }

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch('https://opentdb.com/api.php?amount=3');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = (await res.json()) as ApiResponse;
                const parsed = data.results.map((q) => {
                    const question = decodeHtml(q.question);
                    const correctAnswer = decodeHtml(q.correct_answer);
                    const incorrect = q.incorrect_answers.map(decodeHtml);
                    const options = [correctAnswer, ...incorrect];
                    return {
                        type: q.type,
                        question,
                        correctAnswer,
                        options,
                        category: q.category,
                        difficulty: q.difficulty,
                    } as QuizQuestion;
                });
                setQuestions(parsed);
            } catch (e: any) {
                setError(e.message || 'Fetch error');
            }
        };
        fetchQuestions();
    }, []);

    const timeText = useMemo(() => {
        const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const s = (elapsed % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }, [elapsed]);

    if (error) return <div>Error: {error}</div>;
    if (!questions) return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'var(--app-bg)',
            }}
        >
            <CircularProgress
                size={60}
                sx={{
                    color: 'var(--accent)',
                }}
            />
        </Box>
    );

    return (
        <div className={`app theme-${theme}`}>
            <div className="app-shell">
                <MainPanel
                    questions={questions}
                    onFinish={(name, sc) => saveToLeaderboard(name, sc)}
                    time={timeText}
                    theme={theme}
                    onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                    onToggleSidePanel={() => setSideOpen(true)}
                />
                <SidePanel open={sideOpen} onClose={() => setSideOpen(false)} />
            </div>
        </div>
    );
}

render(<App />, document.getElementById('app'));