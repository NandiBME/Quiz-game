import './styles/QuestionPanel.css';

/**
 * Props for the QuestionPanel component.
 */
type Props = {
  /** The question text to display (already HTML-decoded) */
  question: string;
};

/**
 * QuestionPanel displays the current quiz question text in a styled container.
 *
 * This is a simple presentational component that renders the question text
 * with appropriate styling and spacing. The question text should already be
 * decoded from HTML entities before being passed to this component.
 *
 * The component automatically handles text wrapping and responsive sizing
 * through CSS classes defined in QuestionPanel.css.
 *
 * @param props - Component props
 * @param props.question - Decoded question text to display
 *
 * @example
 * ```tsx
 * <QuestionPanel question="What is the capital of France?" />
 * ```
 */
export function QuestionPanel({ question }: Props) {
  return (
    <div className="question-panel">
      <p className="question-panel__text">{question}</p>
    </div>
  );
}