import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import './style.css';
import { QuestionPanel } from './MainPanel';

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
    question: string;
    correctAnswer: string;
    options: string[];
    category: string;
    difficulty: string;
};

function decodeHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent || html;
}

export function App() {
    const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
    const [error, setError] = useState<string | null>(null);

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
                        question,
                        correctAnswer,
                        options,
                        category: q.category,
                        difficulty: q.difficulty,
                    };
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
        <QuestionPanel questions={questions} />
    );
}

render(<App />, document.getElementById('app'));