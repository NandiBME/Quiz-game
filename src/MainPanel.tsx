import { useState, useRef, useEffect } from 'preact/hooks';
import './styles/MainPanel.css';
import { AnswerPanel } from './AnswerPanel';
import { QuestionPanel } from './QuestionPanel';
import { TopRow } from './TopRow';
import Paper from '@mui/material/Paper';

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

/**
 * MainPanel is the primary quiz gameplay interface displaying questions and managing progression.
 * 
 * Features:
 * - Displays one question at a time with its answer options
 * - Tracks correct answers and calculates weighted score based on difficulty
 * - Shows question progress (e.g., "Question 3 / 10")
 * - Disables answer selection after first choice, requires Next button to proceed
 * - Applies time-based score adjustment (finishing within 60s keeps full score)
 * - Animates surface height changes between questions
 * - Difficulty-based visual theming (CSS class per difficulty level)
 * 
 * Score Calculation:
 * - Easy questions: 1.0 points
 * - Medium questions: 1.3 points
 * - Hard questions: 1.7 points
 * - Final trueScore adjusted by time: scores are reduced if completion takes >60s
 * 
 * @param props - Component props
 * @param props.questions - Array of quiz questions to present
 * @param props.onFinish - Legacy callback for quiz completion
 * @param props.onComplete - Callback with final score and trueScore
 * @param props.time - Formatted elapsed time string
 * @param props.theme - Current UI theme
 * @param props.onToggleTheme - Function to switch themes
 * @param props.onToggleSidePanel - Function to open options panel
 * @param props.elapsedSeconds - Raw elapsed seconds for score calculation
 * 
 * @example
 * ```tsx
 * <MainPanel
 *   questions={quizQuestions}
 *   onComplete={(score, trueScore) => handleFinish(score, trueScore)}
 *   time="02:30"
 *   theme="dark"
 *   onToggleTheme={toggleTheme}
 *   onToggleSidePanel={openOptions}
 *   elapsedSeconds={150}
 * />
 * ```
 */
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
    /** Current question index (0-based) */
    const [index, setIndex] = useState(0);
    /** Number of correct answers */
    const [score, setScore] = useState(0);
    /** Weighted score accounting for difficulty */
    const [trueScore, setTrueScore] = useState(0);
    /** Whether the quiz has been completed */
    const [finished, setFinished] = useState(false);
    /** Player name input (used in finished state, legacy) */
    const [name, setName] = useState('');
    /** Whether score has been saved (legacy) */
    const [saved, setSaved] = useState(false);
    /** Whether the current question has been answered */
    const [answered, setAnswered] = useState(false);
    /** Reference to the Paper surface element for height animations */
    const surfaceRef = useRef<HTMLDivElement>(null);

    /**
     * Updates CSS custom property for surface height to enable smooth transitions.
     * Runs whenever question index, finished state, or name input changes.
     */
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

    /**
     * Calculates score weight multiplier based on difficulty level.
     * 
     * @param difficulty - Question difficulty ('easy', 'medium', or 'hard')
     * @returns Weight multiplier (1.0 for easy, 1.3 for medium, 1.7 for hard)
     */
    function weight(difficulty: string) {
        if (difficulty === 'hard') return 1.7;
        if (difficulty === 'medium') return 1.3;
        return 1;
    }

    /**
     * Handles answer selection, updating score if correct.
     * Locks further answers until Next is pressed.
     * 
     * @param isCorrect - Whether the selected answer was correct
     */
    function handleAnswer(isCorrect: boolean) {
        if (answered) return;
        setAnswered(true);
        if (isCorrect) {
            const w = weight(questions[index].difficulty);
            setScore((s) => s + 1);
            setTrueScore((t) => t + w);
        }
    }

    /**
     * Advances to the next question or finishes the quiz.
     * Applies time-based score adjustment on completion.
     */
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


    /** CSS class name based on current question difficulty */
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