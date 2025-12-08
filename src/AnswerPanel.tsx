import { MultipleChoice } from './MultipleChoice';
import { TrueOrFalse } from './TrueOrFalse';
import './styles/AnswerPanel.css';

/**
 * Props for the AnswerPanel component.
 */
type Props = {
    /** Array of answer options where the first element is the correct answer */
    answers: string[];
    /** Type of question determining which answer component to render */
    type: 'multiple' | 'boolean';
    /** Callback invoked when an answer is selected, receives whether the answer was correct */
    onAnswer: (isCorrect: boolean) => void;
};

/**
 * AnswerPanel is a router component that delegates to the appropriate answer component
 * based on the question type.
 *
 * For boolean questions (true/false), it renders the TrueOrFalse component.
 * For multiple choice questions, it renders the MultipleChoice component which
 * shuffles the answers to randomize their display order.
 *
 * @param props - Component props
 * @param props.answers - Array of answer choices with correct answer first
 * @param props.type - Question type ('multiple' or 'boolean')
 * @param props.onAnswer - Function called with true/false when user selects an answer
 *
 * @example
 * ```tsx
 * <AnswerPanel
 *   answers={['Paris', 'London', 'Berlin', 'Madrid']}
 *   type="multiple"
 *   onAnswer={(correct) => handleAnswer(correct)}
 * />
 * ```
 */
export function AnswerPanel({ answers, type, onAnswer }: Props) {
    if (type === 'boolean') {
        return <TrueOrFalse answers={answers} onAnswer={onAnswer} />;
    }
    return <MultipleChoice answers={answers} onAnswer={onAnswer} />;
}