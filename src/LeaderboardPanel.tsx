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

/**
 * Leaderboard entry structure storing player performance data.
 */
type LeaderboardEntry = {
  /** Player's display name */
  name: string;
  /** Number of correct answers */
  score: number;
  /** Weighted score accounting for difficulty and time taken */
  trueScore: number;
  /** ISO timestamp of when the score was achieved */
  date: string;
};

/**
 * Props for the LeaderboardPanel component.
 */
type Props = {
  /** Current player's number of correct answers */
  score: number;
  /** Current player's weighted score with difficulty and time adjustments */
  trueScore: number;
  /** Array of all leaderboard entries (sorted by trueScore) */
  entries: LeaderboardEntry[];
  /** Callback invoked when player saves their score with a name */
  onSave: (name: string) => void;
  /** Optional callback invoked when player wants to start a new game */
  onPlayAgain?: () => void;
};

/**
 * LeaderboardPanel displays quiz results and high scores with a two-stage flow.
 *
 * Stage 1 (Before Save):
 * - Shows "Quiz Finished" title
 * - Displays player's current score and trueScore
 * - Provides text input for player name
 * - Shows "Save" button to record the score
 *
 * Stage 2 (After Save):
 * - Shows "Leaderboard" title
 * - Displays top 3 scores with gold/silver/bronze gradient backgrounds
 * - Shows current player's score in a dashed border section
 * - Includes "Play again" button to restart
 *
 * Visual Features:
 * - Top 3 entries have distinctive gradient backgrounds (gold, silver, bronze)
 * - Player's score is highlighted with a dashed accent border
 * - Each entry shows: rank, name, correct answers, trueScore, and timestamp
 * - Adapts to light/dark theme automatically
 *
 * @param props - Component props
 * @param props.score - Current player's correct answer count
 * @param props.trueScore - Current player's weighted score
 * @param props.entries - Sorted leaderboard entries (highest first)
 * @param props.onSave - Function called with player name when saving score
 * @param props.onPlayAgain - Optional function called when restarting game
 *
 * @example
 * ```tsx
 * <LeaderboardPanel
 *   score={8}
 *   trueScore={12.4}
 *   entries={leaderboardData}
 *   onSave={(name) => saveScore(name)}
 *   onPlayAgain={() => restartGame()}
 * />
 * ```
 */
export function LeaderboardPanel({ score, trueScore, entries, onSave, onPlayAgain }: Props) {
  /** Player name input value */
  const [name, setName] = useState('');
  /** Whether the player has saved their score */
  const [saved, setSaved] = useState(false);

  /** Top 3 leaderboard entries for display */
  const top3 = entries.slice(0, 3);
  /** Display name for current player (uses input or "You" as fallback) */
  const youName = name.trim() || 'You';

  /**
   * Handles save button click, storing the score with player's name.
   * Uses "Anonymous" if no name is provided.
   */
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