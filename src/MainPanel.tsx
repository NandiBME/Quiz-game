import { useState, useRef, useEffect } from 'preact/hooks';
import './styles/MainPanel.css';
import { AnswerPanel } from './AnswerPanel';
import { QuestionPanel } from './QuestionPanel';
import { TopRow } from './TopRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';

/**
 * Quiz question structure with decoded content and answer options.
 */
type QuizQuestion = {
    /** Question type ('multiple' or 'boolean') */
    type: string;
    /** Decoded question text */
    question: string;
    /** Correct answer (always first in options array) */
    correctAnswer: string;
    /** Array of all answer options */
    options: string[];
    /** Question category name */
    category: string;
    /** Difficulty level ('easy', 'medium', or 'hard') */
    difficulty: string;
};

/**
 * Props for the MainPanel component.
 */
type Props = {
    /** Array of quiz questions to display */
    questions: QuizQuestion[];
    /** Optional callback when quiz finishes (legacy, prefer onComplete) */
    onFinish?: (name: string, score: number) => void;
    /** Callback invoked when quiz completes with final scores */
    onComplete?: (score: number, trueScore: number) => void;
    /** Formatted time string (MM:SS) to display in top row */
    time?: string;
    /** Current theme ('light' or 'dark') */
    theme?: 'light' | 'dark';
    /** Callback to toggle between light and dark themes */
    onToggleTheme?: () => void;
    /** Callback to open the side panel (options menu) */
    onToggleSidePanel?: () => void;
    /** Elapsed time in seconds since quiz started */
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
    /** Countdown timer in seconds (10 to 0) */
    const [countdown, setCountdown] = useState(10);
    /** Whether the timer has expired */
    const [timeExpired, setTimeExpired] = useState(false);
    const surfaceRef = useRef<HTMLDivElement>(null);

    // Reset countdown when question changes
    useEffect(() => {
        setCountdown(10);
        setTimeExpired(false);
    }, [index]);

    // Countdown timer effect
    useEffect(() => {
        if (answered || timeExpired || finished) return;
        
        if (countdown <= 0) {
            setTimeExpired(true);
            setAnswered(true);
            return;
        }

        const id = setInterval(() => {
            setCountdown((c) => c - 1);
        }, 1000);

        return () => clearInterval(id);
    }, [countdown, answered, timeExpired, finished]);

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
        const timeFactor = 60 / Math.max(60, elapsedSeconds || 1);
        const adjustedTrueScore = trueScore * timeFactor;
        onComplete?.(score, adjustedTrueScore);
    }

    const diffClass = `difficulty--${(q.difficulty || 'medium').toString().toLowerCase()}`;

    const difficultyColors = {
        easy: '#4caf50',
        medium: '#ff9800',
        hard: '#f44336',
    };

    const difficultyColor = q.difficulty ? difficultyColors[q.difficulty as 'easy' | 'medium' | 'hard'] : '#9e9e9e';

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
                         <div className="mp-header__left">
                             <span className="mp-question-count">
                                 Question {index + 1} / {questions.length}
                             </span>
                             <div className="mp-header__badges">
                                 {q.category && (
                                     <Chip
                                         label={q.category}
                                         variant="outlined"
                                         size="medium"
                                         sx={{
                                             backgroundColor: 'transparent',
                                             borderColor: 'var(--accent)',
                                             color: 'var(--accent)',
                                             borderWidth: '2px',
                                             fontWeight: 700,
                                             fontSize: '0.875rem',
                                             height: '32px',
                                             fontFamily: '"Inter", "Roboto", sans-serif',
                                             letterSpacing: '0.02em',
                                         }}
                                     />
                                 )}
                                 {q.difficulty && (
                                     <Chip
                                         label={q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                                         variant="outlined"
                                         size="medium"
                                         sx={{
                                             backgroundColor: 'transparent',
                                             borderColor: difficultyColor,
                                             color: difficultyColor,
                                             borderWidth: '2px',
                                             fontWeight: 700,
                                             fontSize: '0.875rem',
                                             height: '32px',
                                             fontFamily: '"Inter", "Roboto", sans-serif',
                                             letterSpacing: '0.02em',
                                         }}
                                     />
                                 )}
                             </div>
                         </div>
                         <div className="mp-score">Score: {score}</div>
                     </div>
                     <QuestionPanel 
                         key={`q-${index}`} 
                         question={q.question}
                         countdown={countdown}
                         answered={answered}
                     />
                     <AnswerPanel
                         key={`a-${index}`}
                         answers={q.options}
                         type={q.type as 'multiple' | 'boolean'}
                         onAnswer={handleAnswer}
                         disabled={timeExpired}
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