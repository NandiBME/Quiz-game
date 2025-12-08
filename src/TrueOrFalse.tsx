import { h } from 'preact';
import { useState } from 'preact/hooks';
import { AnswerButton } from './AnswerButton';
import './styles/AnswerPanel.css';

/**
 * Props for the TrueOrFalse component.
 */
type Props = {
  /** Array of answer options where the first element is the correct answer */
  answers: string[];
  /** Callback invoked when an answer is selected, receives whether the answer was correct */
  onAnswer?: (isCorrect: boolean) => void;
};

/**
 * TrueOrFalse displays a fixed two-button layout for boolean questions.
 *
 * The component always shows "True" on the left and "False" on the right,
 * regardless of the answer order in the props. This provides a consistent
 * user experience for true/false questions without shuffling.
 *
 * Correctness Determination:
 * - Checks if the first element in the answers array contains "true" (case-insensitive)
 * - If yes, the True button (index 0) is correct
 * - If no, the False button (index 1) is correct
 *
 * Features:
 * - Fixed button order (True always left, False always right)
 * - No shuffling (unlike MultipleChoice)
 * - Locks selection after first click
 * - Highlights correct answer in green and incorrect selection in red
 * - Simple two-option layout optimized for boolean questions
 *
 * @param props - Component props
 * @param props.answers - Array with correct answer first (e.g., ['True', 'False'])
 * @param props.onAnswer - Callback fired with true/false when user selects an answer
 *
 * @example
 * ```tsx
 * <TrueOrFalse
 *   answers={['True', 'False']}
 *   onAnswer={(correct) => handleAnswer(correct)}
 * />
 * ```
 */
export function TrueOrFalse({ answers, onAnswer }: Props) {
  /** Selected answer index (0=True, 1=False), or null if none selected */
  const [sel, setSel] = useState<number | null>(null);
  /** Whether an answer has been selected and further selections are locked */
  const [locked, setLocked] = useState(false);

  /** Index of correct answer (0=True, 1=False) determined by checking if answers[0] contains "true" */
  const correctIndex = (answers[0] || '').toLowerCase().includes('true') ? 0 : 1;
  /** Fixed button labels always in True/False order */
  const labels = ['True', 'False'];

  /**
   * Handles answer selection, locking further choices and notifying parent.
   *
   * @param i - Index of selected answer (0=True, 1=False)
   */
  function handle(i: number) {
    if (locked) return;
    setSel(i);
    setLocked(true);
    onAnswer?.(i === correctIndex);
  }

  return (
    <ul className="answer-list">
      {labels.map((label, i) => {
        const correct = locked && i === correctIndex;
        const wrong = locked && sel === i && i !== correctIndex;
        const state = correct ? 'correct' : wrong ? 'wrong' : 'neutral';
        return (
          <li key={i} className="answer-item">
            <AnswerButton onClick={() => handle(i)} disabled={locked} state={state}>
              {label}
            </AnswerButton>
          </li>
        );
      })}
    </ul>
  );
}