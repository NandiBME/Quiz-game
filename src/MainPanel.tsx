import { useState } from 'preact/hooks';
import './styles/MainPanel.css';
import { AnswerPanel } from './AnswerPanel';
import { QuestionPanel } from './QuestionPanel';

type QuizQuestion = {
    type: string;
    question: string;
    correctAnswer: string;
    options: string[];
    category: string;
    difficulty: string;
};

type Props = {
    questions: QuizQuestion[];
    // now onFinish receives both name and final score
    onFinish?: (name: string, score: number) => void;
};

export function MainPanel({ questions, onFinish }: Props) {
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [name, setName] = useState('');
    const [saved, setSaved] = useState(false); // <- new: track if score was saved

    if (!questions || questions.length === 0) {
        return <div>No questions available.</div>;
    }

    const q = questions[index];

    function handleAnswer(isCorrect: boolean) {
        if (isCorrect) setScore((s) => s + 1);
    }

    function handleNext() {
        if (index < questions.length - 1) {
            setIndex((n) => n + 1);
            return;
        }
        // Quiz finished
        setFinished(true);
    }

    // do not reset quiz on save — just call parent's onFinish and mark saved
    function handleSave() {
        if (saved) return;
        if (onFinish) onFinish(name || 'Anonymous', score);
        setSaved(true);
    }

    if (finished) {
        return (
            <div className="main-panel__surface mp-finished">
                <h3 className="main-panel__question">Quiz finished</h3>
                <p className="mp-finished-score">
                    Your score: <strong>{score}</strong> / {questions.length}
                </p>

                <div className="mp-finished-controls">
                    <input
                        className="mp-name-input"
                        value={name}
                        onInput={(e: any) => setName(e.target.value)}
                        placeholder="Your name"
                        disabled={saved}
                    />
                    <button className="main-panel__button" onClick={handleSave} disabled={saved}>
                        {saved ? 'Saved' : 'Save score'}
                    </button>
                </div>
            </div>
        );
    }

    // map difficulty to a css class (defaults to medium)
    const diffClass = `difficulty--${(q.difficulty || 'medium').toString().toLowerCase()}`;

    return (
        <div className={`main-panel__surface ${diffClass}`}>
            <div className="mp-header">
                <strong>
                    Question {index + 1} / {questions.length}
                </strong>
                <div className="mp-score">Score: {score}</div>
            </div>

            {/* Question panel component */}
            <QuestionPanel key={index} question={q.question} />

            {/* Answer panel */}
            <AnswerPanel
              key={index}
              answers={q.options}
              type={q.type as 'multiple' | 'boolean'}
              onAnswer={handleAnswer}
            />

            <div className="mp-actions">
                <button
                    className="main-panel__button"
                    onClick={handleNext}
                >
                    {index < questions.length - 1 ? 'Next' : 'Finish'}
                </button>
            </div>
        </div>
    );
}