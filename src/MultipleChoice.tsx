import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { AnswerButton } from './AnswerButton'; 
import './styles/AnswerPanel.css';

type Props = { answers: string[]; onAnswer?: (isCorrect: boolean) => void };

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MultipleChoice({ answers, onAnswer }: Props) {
  const [sel, setSel] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const shuffled = useMemo(
    () => shuffle(answers.map((t, i) => ({ t, i }))),
    [answers]
  );
  const correctIndex = shuffled.findIndex((s) => s.i === 0);

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