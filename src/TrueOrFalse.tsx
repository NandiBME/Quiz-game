import { h } from 'preact';
import { useState } from 'preact/hooks';
import { AnswerButton } from './AnswerButton';
import './styles/AnswerPanel.css';

type Props = { answers: string[]; onAnswer?: (isCorrect: boolean) => void };

// Always show True on the left and False on the right.
// Determine which side is correct from answers[0] (convention: answers[0] is correct).
export function TrueOrFalse({ answers, onAnswer }: Props) {
  const [sel, setSel] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const correctIndex = (answers[0] || '').toLowerCase().includes('true') ? 0 : 1;
  const labels = ['True', 'False'];

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