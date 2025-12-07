import { h } from 'preact';
import { useState } from 'preact/hooks';
import { AnswerButton } from './AnswerButton';
import './styles/AnswerPanel.css';

type Props = {
    answers: string[];
    type: 'multiple' | 'boolean';
    onAnswer: (isCorrect: boolean) => void;
};

export function AnswerPanel({ answers, type, onAnswer }: Props) {
    const [answered, setAnswered] = useState(false);
    const [correctIndex, setCorrectIndex] = useState(0); // first answer is correct
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    function handleClick(index: number) {
        if (answered) return;

        const isCorrect = index === correctIndex;
        setSelectedIndex(index);
        setAnswered(true);
        onAnswer(isCorrect);
    }

    return (
        <ul className="answer-list">
            {answers.map((answer, i) => {
                let state: 'neutral' | 'correct' | 'wrong' = 'neutral';
                if (answered) {
                    if (i === correctIndex) {
                        state = 'correct';
                    } else if (i === selectedIndex) {
                        state = 'wrong';
                    }
                }

                return (
                    <li key={`${i}-answer`} className="answer-item">
                        <AnswerButton
                            onClick={() => handleClick(i)}
                            disabled={answered}
                            state={state}
                        >
                            {answer}
                        </AnswerButton>
                    </li>
                );
            })}
        </ul>
    );
}