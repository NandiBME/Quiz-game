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
        <Stack spacing={3} sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'var(--text)',
              mb: 1,
            }}
          >
            Quiz Game
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'var(--muted)',
              lineHeight: 1.6,
              fontSize: '1.1rem',
            }}
          >
            Test your knowledge with our interactive quiz game. Answer multiple choice and true/false questions from various categories. Customize your experience with difficulty levels and question types. Higher difficulties give more points!
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'var(--muted)',
              fontStyle: 'italic',
            }}
          >
            Ready to challenge yourself?
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => onStart()}
            sx={{
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-text)',
              fontWeight: 700,
              py: 1.5,
              fontSize: '1.1rem',
              mt: 2,
              '&:hover': {
                backgroundColor: 'color-mix(in srgb, var(--accent) 85%, black 15%)',
              },
            }}
          >
            Start Quiz
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
