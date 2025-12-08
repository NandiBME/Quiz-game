import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { AnswerButton } from './AnswerButton'; 
import './styles/AnswerPanel.css';

/**
 * Props for the MultipleChoice component.
 */
type Props = { 
  /** Array of answer options where the first element is the correct answer */
  answers: string[]; 
  /** Callback invoked when an answer is selected, receives whether the answer was correct */
  onAnswer?: (isCorrect: boolean) => void 
};

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * Creates a new array without mutating the original.
 * 
 * @template T - Type of array elements
 * @param arr - Array to shuffle
 * @returns New shuffled array
 * 
 * @example
 * ```tsx
 * shuffle([1, 2, 3, 4])
 * // Returns: [3, 1, 4, 2] (random order)
 * ```
 */
function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * MultipleChoice displays a shuffled list of answer options for multiple-choice questions.
 * 
 * The component expects the correct answer to be the first element in the answers array.
 * It shuffles the options on mount to randomize their display order while tracking
 * which shuffled position corresponds to the correct answer.
 * 
 * Features:
 * - Shuffles answer options using Fisher-Yates algorithm
 * - Locks selection after first click to prevent multiple answers
 * - Highlights correct answer in green and incorrect selection in red
 * - Tracks original answer indices to identify correctness after shuffling
 * 
 * @param props - Component props
 * @param props.answers - Array of answer strings with correct answer first
 * @param props.onAnswer - Callback fired with true/false when user selects an answer
 * 
 * @example
 * ```tsx
 * <MultipleChoice 
 *   answers={['Paris', 'London', 'Berlin', 'Madrid']}
 *   onAnswer={(correct) => handleAnswer(correct)}
 * />
 * ```
 */
export function MultipleChoice({ answers, onAnswer }: Props) {
  /** Selected answer index in shuffled array, or null if none selected */
  const [sel, setSel] = useState<number | null>(null);
  /** Whether an answer has been selected and further selections are locked */
  const [locked, setLocked] = useState(false);

  /** Shuffled answers with original indices preserved for correctness checking */
  const shuffled = useMemo(
    () => shuffle(answers.map((t, i) => ({ t, i }))),
    [answers]
  );
  
  /** Index of correct answer in shuffled array */
  const correctIndex = shuffled.findIndex((s) => s.i === 0);

  /**
   * Handles answer selection, locking further choices and notifying parent.
   * 
   * @param i - Index of selected answer in shuffled array
   */
  function handle(i: number) {
    if (locked) return;
    setSel(i);
    setLocked(true);
    onAnswer?.(i === correctIndex);
  }

  return (
    <ul className="answer-list">
      {shuffled.map((item, i) => {
        const correct = locked && i === correctIndex;
        const wrong = locked && sel === i && i !== correctIndex;
        const state = correct ? 'correct' : wrong ? 'wrong' : 'neutral';
        return (
          <li key={i} className="answer-item">
            <AnswerButton
              onClick={() => handle(i)}
              disabled={locked}
              state={state}
              className=""
            >
              {item.t}
            </AnswerButton>
          </li>
        );
      })}
    </ul>
  );
}