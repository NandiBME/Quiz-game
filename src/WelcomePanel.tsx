import { h } from 'preact';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import './styles/WelcomePanel.css';

type Props = {
  onStart: () => void;
};

export function WelcomePanel({ onStart }: Props) {
  return (
    <div className="welcome-panel">
      <Paper elevation={10} className="welcome-panel__surface">
        <Stack spacing={3} className="welcome-panel__stack">
          <Typography variant="h3" className="welcome-panel__title">
            Quiz Game
          </Typography>

          <Typography variant="body1" className="welcome-panel__description">
            Test your knowledge with this interactive quiz game. Answer multiple choice and true/false questions from various categories. Higher difficulties give more points!
          </Typography>

          <Typography variant="body2" className="welcome-panel__subtitle">
            Are you sure you're ready?
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => onStart()}
            className="welcome-panel__btn"
          >
            Start Quiz
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
