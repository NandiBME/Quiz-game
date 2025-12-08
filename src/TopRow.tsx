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
 * - Elapsed time timer with pulsing color effect that transitions through colors
 * - Theme toggle button (sun/moon icon)
 * - Options menu button (hamburger icon)
 *
 * Timer Behavior:
 * - Displays time in MM:SS format
 * - Color transitions based on elapsed time:
 *   - Green: <60 seconds
 *   - Yellow: ~60 seconds (1 minute)
 *   - Orange-Red gradient: 60-120 seconds
 *   - Red: ≥120 seconds (2 minutes)
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
  
  /**
   * Calculate timer color based on elapsed time with smooth transition.
   * Green (0-60s) → Yellow (60s) → Orange/Red (60-120s) → Red (120s+)
   */
  const getTimerColor = () => {
    if (elapsedSeconds < 60) {
      return '#4caf50'; // Green
    } else if (elapsedSeconds < 120) {
      // Interpolate between yellow (#fdd835) and red (#dc4e4e) over 60 seconds
      const progress = (elapsedSeconds - 60) / 60; // 0 to 1
      const r = Math.round(253 + (220 - 253) * progress);
      const g = Math.round(216 + (78 - 216) * progress);
      const b = Math.round(53 + (78 - 53) * progress);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return '#dc4e4e'; // Red
    }
  };

  const timerColor = getTimerColor();
  
  /** Theme toggle icon (moon for light mode, sun for dark mode) */
  const themeIcon = theme === 'light' ? '🌙' : '☀️';
  /** Accessible label for theme toggle button */
  const themeLabel = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <div className="top-row">
      <div className="top-row__left">
        <span className="top-row__timer" style={{ color: timerColor }}>{showTime}</span>
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