import { h } from 'preact';
import './styles/QuestionPanel.css';

type Props = {
  question: string;
};

export function QuestionPanel({ question }: Props) {
  return (
    <div className="question-panel">
      <p className="question-panel__text">{question}</p>
    </div>
  );
}