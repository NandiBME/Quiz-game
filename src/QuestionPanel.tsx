import { h } from 'preact';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import './styles/QuestionPanel.css';

/**
 * Props for the QuestionPanel component.
 */
type Props = {
  /** The question text to display (already HTML-decoded) */
  question: string;
  /** Countdown timer value in seconds (10 to 0) */
  countdown?: number;
  /** Whether the question has been answered */
  answered?: boolean;
};

/**
 * QuestionPanel displays the current quiz question text with a countdown timer.
 * 
 * This component renders the question text with appropriate styling and spacing,
 * along with a circular countdown timer displayed on a separate surface.
 * 
 * Timer Behavior:
 * - Circular progress indicator (10 to 0 seconds)
 * - Changes color based on time left:
 *   - Green: >5 seconds
 *   - Orange: 3-5 seconds
 *   - Red: ≤2 seconds
 * - Remains visible even after reaching zero
 * - Displayed on separate Paper surface next to question
 * 
 * @param props - Component props
 * @param props.question - Decoded question text to display
 * @param props.countdown - Seconds remaining (0-10)
 * @param props.answered - Whether question has been answered
 * 
 * @example
 * ```tsx
 * <QuestionPanel 
 *   question="What is the capital of France?" 
 *   countdown={7}
 *   answered={false}
 * />
 * ```
 */
export function QuestionPanel({ question, countdown = 10, answered = false }: Props) {
  const progress = (countdown / 10) * 100;
  const progressColor = countdown > 5 ? '#4caf50' : countdown > 2 ? '#FFA726' : '#dc4e4e';

  return (
    <div className="question-panel">
      <div className="question-panel__container">
        <div className="question-panel__content">
          <p className="question-panel__text">{question}</p>
        </div>

        <Paper elevation={4} className="question-panel__timer">
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={80}
              thickness={3.5}
              sx={{
                color: progressColor,
                '& .MuiCircularProgress-circle': {
                  transition: 'stroke-dashoffset 0.5s linear',
                }
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{ 
                  color: progressColor,
                  fontWeight: 700,
                }}
              >
                {countdown}
              </Typography>
              <Typography
                variant="caption"
                sx={{ 
                  color: 'var(--muted)',
                  fontSize: '0.65rem',
                }}
              >
                seconds
              </Typography>
            </Box>
          </Box>
        </Paper>
      </div>
    </div>
  );
}