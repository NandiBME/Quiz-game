import { h } from 'preact';
import { IconButton } from './IconButton';
import './styles/TopRow.css';

type Props = {
  time?: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onToggleSidePanel?: () => void;
};

export function TopRow({ 
  time = '00:00', 
  theme = 'light', 
  onToggleTheme = () => {}, 
  onToggleSidePanel = () => {} 
}: Props) {
  return (
    <div className="top-row">
      <div className="top-row__timer">{time}</div>
      <div className="top-row__actions">
        <IconButton
          label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          onClick={onToggleTheme}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </IconButton>
        <IconButton label="Settings & leaderboard" onClick={onToggleSidePanel}>
          ☰
        </IconButton>
      </div>
    </div>
  );
}