import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconButton } from './IconButton';

type Props = {
  code?: number | string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorPanel({
  code = 'Error',
  message = 'Something went wrong while loading the quiz.',
  onRetry = () => {},
}: Props) {
  const isRateLimited = String(code) === '429';
  const [seconds, setSeconds] = useState(isRateLimited ? 6 : 0);

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