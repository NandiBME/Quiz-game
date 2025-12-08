import { h } from 'preact';
import { MultipleChoice } from './MultipleChoice';
import { TrueOrFalse } from './TrueOrFalse';
import './styles/AnswerPanel.css';

type Props = {
    answers: string[];
    type: 'multiple' | 'boolean';
    onAnswer: (isCorrect: boolean) => void;
};

export function AnswerPanel({ answers, type, onAnswer }: Props) {
    if (type === 'boolean') {
        return <TrueOrFalse answers={answers} onAnswer={onAnswer} />;
    }
    return <MultipleChoice answers={answers} onAnswer={onAnswer} />;
}