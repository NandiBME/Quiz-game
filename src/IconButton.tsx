import { h } from 'preact';
import MuiIconButton from '@mui/material/IconButton';
import { ComponentChildren } from 'preact';
import './styles/IconButton.css';

/**
 * Props for the IconButton component.
 */
type Props = {
  /** Content to display inside the button (typically an icon or emoji) */
  children: ComponentChildren;
  /** Accessible label for screen readers describing the button's purpose */
  label?: string;
  /** Callback invoked when the button is clicked */
  onClick?: () => void;
  /** Whether the button is disabled and cannot be interacted with */
  disabled?: boolean;
  /** Additional Material-UI sx prop for custom styling */
  sx?: any;
  /** Additional CSS class names to apply */
  className?: string;
};

/**
 * IconButton is a wrapper around Material-UI's IconButton component with
 * consistent theming and styling for the quiz application.
 *
 * It uses CSS variables for theming, making it automatically adapt to
 * light and dark modes. The button is sized as "medium" by default and
 * includes proper accessibility attributes.
 *
 * @param props - Component props
 * @param props.children - Icon or content to render inside the button
 * @param props.label - Accessible label for screen readers
 * @param props.onClick - Click handler function
 * @param props.disabled - Whether the button is disabled
 * @param props.sx - Material-UI sx prop for additional styling
 * @param props.className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <IconButton label="Toggle theme" onClick={handleThemeToggle}>
 *   🌙
 * </IconButton>
 * ```
 */
export function IconButton({ children, label, onClick, disabled = false, sx, className }: Props) {
  return (
    <MuiIconButton
      aria-label={label}
      onClick={onClick}
      className={`mui-icon-button ${className || ''}`}
      size="medium"
      disabled={disabled}
      sx={{ color: 'var(--icon-color)', ...sx }}
    >
      {children}
    </MuiIconButton>
  );
}