import { h } from 'preact';
import './styles/AnswerPanel.css';
import { MultipleChoice } from './MultipleChoice';
import { TrueOrFalse } from './TrueOrFalse';

type Props = {
  answers: string[]; // convention: answers[0] is the correct answer
  type: 'multiple' | 'boolean';
  onAnswer?: (isCorrect: boolean) => void;
};

export function AnswerPanel({ answers, type, onAnswer }: Props) {
  const isBoolean = type === 'boolean';

  return isBoolean ? (
    <TrueOrFalse answers={answers} onAnswer={onAnswer} />
  ) : (
    <MultipleChoice answers={answers} onAnswer={onAnswer} />
  );
}