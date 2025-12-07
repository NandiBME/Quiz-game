import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import './styles/style.css';
import { MainPanel } from './MainPanel';

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
    type: string;               // <-- added: question type ('multiple' | 'boolean')
    question: string;
    correctAnswer: string;
    options: string[];
    category: string;
    difficulty: string;
};

type LeaderboardEntry = {
    name: string;
    score: number;
    date: string; // ISO timestamp
};


function decodeHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent || html;
}

export function App() {
    const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [score, setScore] = useState<number>(0);

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
        const raw = localStorage.getItem('quiz:leaderboard');
        try {
            return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
        } catch {
            return [];
        }
    });

    function saveToLeaderboard(name: string, finalScore: number) {
        const entry: LeaderboardEntry = { name, score: finalScore, date: new Date().toISOString() };
        setLeaderboard((prev) => {
            const next = [entry, ...prev].sort((a, b) => b.score - a.score).slice(0, 10);
            try {
                localStorage.setItem('quiz:leaderboard', JSON.stringify(next));
            } catch {
                // ignore localStorage errors
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
                        type: q.type,            // include the question type
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

    if (error) return <div>Error: {error}</div>;
    if (!questions) return <div>Loading...</div>;

    return (
        <MainPanel questions={questions} onFinish={(name) => saveToLeaderboard(name, score)} />
        // <SidePanel/>
        //<TopBar></TopBar>
    );
}

render(<App />, document.getElementById('app'));