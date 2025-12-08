import './styles/AnswerButton.css';

/**
 * Props for the AnswerButton component.
 */
type Props = {
  /** Content to display inside the button (typically answer text) */
  children: preact.ComponentChildren;
  /** Callback invoked when the button is clicked */
  onClick?: (e?: any) => void;
  /** Whether the button is disabled (typically after an answer is selected) */
  disabled?: boolean;
  /** Visual state determining the button's appearance and glow effect */
  state?: 'neutral' | 'correct' | 'wrong';
  /** Additional CSS class names to apply */
  className?: string;
};

/**
 * AnswerButton is a styled button component for quiz answer choices.
 * 
 * It supports three visual states:
 * - `neutral`: Default appearance before an answer is selected
 * - `correct`: Green glow effect indicating the correct answer
 * - `wrong`: Red glow effect indicating an incorrect answer
 * 
 * The button can be disabled after selection to prevent multiple answers.
 * 
 * @param props - Component props
 * @param props.children - Content to render inside the button
 * @param props.onClick - Click handler function
 * @param props.disabled - Whether the button is disabled
 * @param props.state - Visual state ('neutral', 'correct', or 'wrong')
 * @param props.className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <AnswerButton 
 *   onClick={() => handleAnswer(true)} 
 *   state="correct"
 *   disabled={true}
 * >
 *   Paris
 * </AnswerButton>
 * ```
 */
export function AnswerButton({ children, onClick, disabled, state = 'neutral', className = '' }: Props) {
  const stateClass =
    state === 'correct' ? 'answer-button--correct answer-button--glow-correct'
    : state === 'wrong' ? 'answer-button--wrong answer-button--glow-wrong'
    : '';

  return (
    <button
      type="button"
      className={['answer-button', stateClass, className].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={disabled}
    >
      {children}
    </button>
  );
}