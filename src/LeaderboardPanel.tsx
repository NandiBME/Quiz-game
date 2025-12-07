import { h } from 'preact';
import { useState } from 'preact/hooks';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './styles/LeaderboardPanel.css';

type LeaderboardEntry = {
  name: string;
  score: number;
  trueScore: number;
  date: string;
};

type Props = {
  score: number;
  trueScore: number;
  entries: LeaderboardEntry[];
  onSave: (name: string) => void;
  onPlayAgain?: () => void;
};

export function LeaderboardPanel({ score, trueScore, entries, onSave, onPlayAgain }: Props) {
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  const top3 = entries.slice(0, 3);
  const youName = name.trim() || 'You';

  const handleSave = () => {
    const finalName = name.trim() || 'Anonymous';
    onSave(finalName);
    setSaved(true);
  };

  return (
    <div className="leaderboard-panel">
      <Paper elevation={10} className="leaderboard-panel__surface">
        <Stack spacing={3}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text)' }}>
            {saved ? 'Leaderboard' : 'Quiz Finished'}
          </Typography>

          {!saved && (
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                label="Your name"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                className="lb-input"
              />
              <Button variant="contained" onClick={handleSave} className="lb-btn">
                Save
              </Button>
            </Stack>
          )}

          {saved && (
            <List dense>
              {top3.length === 0 ? (
                <ListItem className="lb-item">
                  <ListItemText
                    primary="No records yet."
                    slotProps={{ primary: { sx: { color: 'var(--muted)' } } }}
                  />
                </ListItem>
              ) : (
                top3.map((entry, i) => (
                  <ListItem key={`${entry.name}-${entry.date}-${i}`} className={`lb-item lb-top-${i + 1}`} divider>
                    <ListItemText
                      primary={`${i + 1}. ${entry.name}`}
                      secondary={`Correct: ${entry.score} • TrueScore: ${entry.trueScore.toFixed(1)} • ${new Date(entry.date).toLocaleString()}`}
                      slotProps={{
                        primary: { sx: { color: 'var(--text)', fontWeight: 700 } },
                        secondary: { sx: { color: 'var(--text)', opacity: 0.8 } },
                      }}
                    />
                  </ListItem>
                ))
              )}

              <ListItem className="lb-item lb-you">
                <ListItemText
                  primary={`${youName} (you)`}
                  secondary={`Correct: ${score} • TrueScore: ${trueScore.toFixed(1)} • Current run`}
                  slotProps={{
                    primary: { sx: { color: 'var(--text)', fontWeight: 700 } },
                    secondary: { sx: { color: 'var(--text)', opacity: 0.8 } },
                  }}
                />
              </ListItem>
            </List>
          )}

          {onPlayAgain && (
            <Button variant="contained" onClick={onPlayAgain} className="lb-btn">
              Play again
            </Button>
          )}
        </Stack>
      </Paper>
    </div>
  );
}