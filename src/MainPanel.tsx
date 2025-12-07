import { useState, useRef, useEffect } from 'preact/hooks';
import './styles/MainPanel.css';
import { AnswerPanel } from './AnswerPanel';
import { QuestionPanel } from './QuestionPanel';
import { TopRow } from './TopRow';
import Paper from '@mui/material/Paper';

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
    onFinish?: (name: string, score: number) => void;
    onComplete?: (score: number, trueScore: number) => void;
    time?: string;
    theme?: 'light' | 'dark';
    onToggleTheme?: () => void;
    onToggleSidePanel?: () => void;
    elapsedSeconds: number;
};

export function MainPanel({
    questions,
    onFinish,
    onComplete,
    time = '',
    theme = 'light',
    onToggleTheme,
    onToggleSidePanel,
    elapsedSeconds,
}: Props) {
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [trueScore, setTrueScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [name, setName] = useState('');
    const [saved, setSaved] = useState(false);
    const [answered, setAnswered] = useState(false);
    const surfaceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (surfaceRef.current) {
            const height = surfaceRef.current.scrollHeight;
            surfaceRef.current.style.setProperty('--surface-height', `${height}px`);
        }
    }, [index, finished, name, saved]);

    if (!questions || questions.length === 0) {
        return <div>No questions available.</div>;
    }

    const q = questions[index];

    function weight(difficulty: string) {
        if (difficulty === 'hard') return 1.7;
        if (difficulty === 'medium') return 1.3;
        return 1;
    }

    function handleAnswer(isCorrect: boolean) {
        if (answered) return;
        setAnswered(true);
        if (isCorrect) {
            const w = weight(questions[index].difficulty);
            setScore((s) => s + 1);
            setTrueScore((t) => t + w);
        }
    }

    function handleNext() {
        if (index < questions.length - 1) {
            setIndex((n) => n + 1);
            setAnswered(false);
            return;
        }
        setFinished(true);
        const timeFactor = 60 / Math.max(60, elapsedSeconds || 1); // <=60s keeps full value, slower lowers score
        const adjustedTrueScore = trueScore * timeFactor;
        onComplete?.(score, adjustedTrueScore);
    }

    function handleSave() {
        if (saved) return;
        if (onFinish) onFinish(name || 'Anonymous', score);
        setSaved(true);
    }

    const diffClass = `difficulty--${(q.difficulty || 'medium').toString().toLowerCase()}`;

    if (finished) {
        return (
            <div className={`main-panel ${diffClass}`}>
                <div className="main-panel__inner">
                    <TopRow
                        time={time}
                        elapsedSeconds={elapsedSeconds}
                        theme={theme}
                        onToggleTheme={onToggleTheme}
                        onToggleSidePanel={onToggleSidePanel}
                    />
                    <Paper ref={surfaceRef} elevation={10} className="main-panel__surface mp-finished">
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
                    </Paper>
                </div>
             </div>
        );
    }
    return (
        <div className={`main-panel ${diffClass}`}>
            <div className="main-panel__inner">
                <TopRow
                    time={time}
                    elapsedSeconds={elapsedSeconds}
                    theme={theme}
                    onToggleTheme={onToggleTheme}
                    onToggleSidePanel={onToggleSidePanel}
                />
                <Paper ref={surfaceRef} elevation={10} className="main-panel__surface">
                     <div className="mp-header">
                         <strong>
                             Question {index + 1} / {questions.length}
                         </strong>
                         <div className="mp-score">Score: {score}</div>
                     </div>
                     <QuestionPanel key={`q-${index}`} question={q.question} />
                     <AnswerPanel
                         key={`a-${index}`}
                         answers={q.options}
                         type={q.type as 'multiple' | 'boolean'}
                         onAnswer={handleAnswer}
                     />
                     <div className="mp-actions">
                         <button className="main-panel__button" onClick={handleNext} disabled={!answered}>
                             {index < questions.length - 1 ? 'Next' : 'Finish'}
                         </button>
                     </div>
                </Paper>
            </div>
         </div>
    );
}