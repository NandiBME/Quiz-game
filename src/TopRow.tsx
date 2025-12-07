import { h } from 'preact';
import './styles/TopRow.css';
import { IconButton } from './IconButton';

type Props = {
  time?: string;
  elapsedSeconds?: number;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onToggleSidePanel?: () => void;
};

export function TopRow({
  time,
  elapsedSeconds = 0,
  theme = 'dark',
  onToggleTheme = () => {},
  onToggleSidePanel = () => {},
}: Props) {
  const showTime = time ?? '--:--';
  const timerClass = elapsedSeconds < 60 ? 'top-row__timer pulse-green' : 'top-row__timer pulse-red';
  const themeIcon = theme === 'light' ? '🌙' : '☀️';
  const themeLabel = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <div className="top-row">
      <div className="top-row__left">
        <span className={timerClass}>{showTime}</span>
      </div>
      <div className="top-row__right">
        <IconButton label={themeLabel} onClick={onToggleTheme}>
          {themeIcon}
        </IconButton>
        <IconButton label="Options" onClick={onToggleSidePanel}>
          ☰
        </IconButton>
      </div>
    </div>
  );
}