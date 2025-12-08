import { h } from 'preact';
import './styles/TopRow.css';
import { IconButton } from './IconButton';

/**
 * Props for the TopRow component.
 */
type Props = {
  /** Formatted elapsed time string (MM:SS) to display */
  time?: string;
  /** Raw elapsed seconds for determining timer color (green <60s, red ≥60s) */
  elapsedSeconds?: number;
  /** Current UI theme ('light' or 'dark') */
  theme?: 'light' | 'dark';
  /** Callback to toggle between light and dark themes */
  onToggleTheme?: () => void;
  /** Callback to open the side panel (options menu) */
  onToggleSidePanel?: () => void;
};

/**
 * TopRow is a fixed header component displaying the timer and action buttons.
 *
 * The row spans the top of the game panel and includes:
 * - Elapsed time timer with pulsing color effect (green <60s, red after)
 * - Theme toggle button (sun/moon icon)
 * - Options menu button (hamburger icon)
 *
 * Timer Behavior:
 * - Displays time in MM:SS format
 * - Pulses green when elapsed time is under 60 seconds
 * - Pulses red when elapsed time is 60 seconds or more
 * - Shows '--:--' as fallback when time is unavailable
 *
 * Theme Icons:
 * - Light mode: 🌙 (moon) - suggests switching to dark
 * - Dark mode: ☀️ (sun) - suggests switching to light
 *
 * @param props - Component props
 * @param props.time - Formatted time string to display
 * @param props.elapsedSeconds - Seconds elapsed for color determination
 * @param props.theme - Current theme mode
 * @param props.onToggleTheme - Function to switch themes
 * @param props.onToggleSidePanel - Function to open options panel
 *
 * @example
 * ```tsx
 * <TopRow
 *   time="02:30"
 *   elapsedSeconds={150}
 *   theme="dark"
 *   onToggleTheme={() => toggleTheme()}
 *   onToggleSidePanel={() => openPanel()}
 * />
 * ```
 */
export function TopRow({
  time,
  elapsedSeconds = 0,
  theme = 'dark',
  onToggleTheme = () => {},
  onToggleSidePanel = () => {},
}: Props) {
  /** Display time with fallback to '--:--' */
  const showTime = time ?? '--:--';
  /** CSS class name for timer including pulse animation (green <60s, red ≥60s) */
  const timerClass = elapsedSeconds < 60 ? 'top-row__timer pulse-green' : 'top-row__timer pulse-red';
  /** Theme toggle icon (moon for light mode, sun for dark mode) */
  const themeIcon = theme === 'light' ? '🌙' : '☀️';
  /** Accessible label for theme toggle button */
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