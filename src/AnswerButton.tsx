import { h } from 'preact';
import './styles/AnswerButton.css';

type Props = {
  children: preact.ComponentChildren;
  onClick?: (e?: any) => void;
  disabled?: boolean;
  state?: 'neutral' | 'correct' | 'wrong'; // determines glow color after answer
  className?: string;
};

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