import { h } from 'preact';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import './styles/WelcomePanel.css';

/**
 * Props for the WelcomePanel component.
 */
type Props = {
  /** Callback invoked when the user clicks the Start Quiz button */
  onStart: () => void;
};

/**
 * WelcomePanel is the initial landing screen displayed before starting a quiz.
 *
 * The panel provides an introduction to the quiz game and prompts the user
 * to begin. It features:
 * - Large title ("Quiz Game")
 * - Description of game features and mechanics
 * - Prominent "Start Quiz" button
 *
 * The component uses Material-UI components for consistent styling and
 * elevation effects, with custom CSS classes for theme integration.
 * All text uses the Roboto font family for consistency.
 *
 * Visual Design:
 * - Centered layout with maximum width constraint
 * - Elevated Paper surface with rounded corners
 * - Vertical stack spacing for content hierarchy
 * - Accent-colored call-to-action button
 * - Adapts to light/dark theme automatically
 *
 * @param props - Component props
 * @param props.onStart - Function called when Start Quiz button is clicked
 *
 * @example
 * ```tsx
 * <WelcomePanel onStart={() => initializeQuiz()} />
 * ```
 */
export function WelcomePanel({ onStart }: Props) {
  return (
    <div className="welcome-panel">
      <Paper elevation={10} className="welcome-panel__surface">
        <Stack spacing={3} className="welcome-panel__stack">
          <Typography variant="h3" className="welcome-panel__title">
            🔥Nándi's Trivia 🔥
          </Typography>

          <Typography variant="body1" className="welcome-panel__description">
            Test your knowledge with this interactive quiz game. Answer multiple choice and true/false questions from various categories. Higher difficulties give more points!
          </Typography>
            I'm watching you 😉
          <Typography variant="body2" className="welcome-panel__subtitle">
            
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
