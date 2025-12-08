import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconButton } from './IconButton';

/**
 * Props for the ErrorPanel component.
 */
type Props = {
  /** HTTP error code or custom error identifier to display */
  code?: number | string;
  /** Detailed error message explaining what went wrong */
  message?: string;
  /** Callback invoked when the user clicks the retry button */
  onRetry?: () => void;
};

/**
 * ErrorPanel displays error information with optional retry functionality.
 *
 * For HTTP 429 (rate limit) errors, it shows a countdown timer that must
 * reach zero before the retry button becomes enabled. For other errors,
 * the retry button is immediately available.
 *
 * @param props - Component props
 * @param props.code - Error code to display (defaults to "Error")
 * @param props.message - Error message to display (defaults to generic message)
 * @param props.onRetry - Function called when retry button is clicked
 *
 * @example
 * ```tsx
 * <ErrorPanel
 *   code={429}
 *   message="Too many requests"
 *   onRetry={() => fetchData()}
 * />
 * ```
 */
export function ErrorPanel({
  code = 'Error',
  message = 'Something went wrong while loading the quiz.',
  onRetry = () => {},
}: Props) {
  const isRateLimited = String(code) === '429';
  const [seconds, setSeconds] = useState(isRateLimited ? 6 : 0);

  // Countdown timer for rate-limited errors
  useEffect(() => {
    if (!isRateLimited) return;
    setSeconds(6);
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRateLimited]);

  const canRetry = !isRateLimited || seconds === 0;

  return (
    <div className="error-panel">
      <Paper elevation={10} className="error-panel__surface">
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h3" sx={{ color: 'var(--accent)' }} aria-hidden>
            🙁
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text)' }}>
            {code}
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--muted)' }}>
            {message}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
            {isRateLimited
              ? 'Too many requests. Please wait before retrying.'
              : 'The server responded with an error. Please try again.'}
          </Typography>

          {isRateLimited && (
            <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
              Retry available in {seconds}s
            </Typography>
          )}

          <IconButton
            label="Retry"
            onClick={canRetry ? onRetry : undefined}
            disabled={!canRetry}
            sx={{
              color: canRetry
                ? 'var(--icon-color)'
                : 'color-mix(in srgb, var(--icon-color) 45%, transparent)',
            }}
          >
            ⟳
          </IconButton>
        </Stack>
      </Paper>
    </div>
  );
}