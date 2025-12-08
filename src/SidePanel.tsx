import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { OptionsPanel, GameOptions } from './OptionsPanel';
import './styles/SidePanel.css';

/**
 * Props for the SidePanel component.
 */
type Props = {
  /** Whether the side panel is open and visible */
  open: boolean;
  /** Callback invoked when the panel should close (e.g., backdrop click) */
  onClose?: () => void;
  /** Callback invoked when game options are changed in the OptionsPanel */
  onOptionsChange?: (options: GameOptions) => void;
  /** Callback invoked when the Restart Game button is clicked */
  onRestart?: () => void;
};

/**
 * SidePanel is a slide-out drawer component that displays game options.
 *
 * The panel slides in from the right side of the screen with a smooth animation
 * and includes a semi-transparent backdrop. Clicking the backdrop closes the panel.
 *
 * Features:
 * - Smooth slide-in animation (swingIn) when opening
 * - Smooth slide-out animation (swingOut) when closing
 * - Semi-transparent backdrop with fade effect
 * - Click outside to close functionality
 * - Prevents backdrop clicks from propagating to panel content
 * - Delayed unmount to allow exit animations to complete
 *
 * Animation Flow:
 * 1. Opening: visible=true → backdrop & surface fade/slide in
 * 2. Closing: closing=true → backdrop & surface fade/slide out → visible=false after 320ms
 *
 * @param props - Component props
 * @param props.open - Controls whether the panel is open
 * @param props.onClose - Function called when user clicks backdrop to close
 * @param props.onOptionsChange - Function called when options are modified
 * @param props.onRestart - Function called when restart button is clicked
 *
 * @example
 * ```tsx
 * <SidePanel
 *   open={isPanelOpen}
 *   onClose={() => setIsPanelOpen(false)}
 *   onOptionsChange={(opts) => updateOptions(opts)}
 *   onRestart={() => restartGame()}
 * />
 * ```
 */
export function SidePanel({ open, onClose, onOptionsChange, onRestart }: Props) {
  /** Whether the panel is mounted in the DOM (tracks visibility lifecycle) */
  const [visible, setVisible] = useState(open);
  /** Whether the panel is currently in closing animation phase */
  const [closing, setClosing] = useState(false);

  /**
   * Manages panel visibility and closing animation lifecycle.
   *
   * When opened: immediately shows panel with entry animation
   * When closed: triggers exit animation, then unmounts after 320ms delay
   */
  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
      return;
    }
    if (visible) {
      setClosing(true);
      const t = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 320); // match swingOut duration
      return () => clearTimeout(t);
    }
  }, [open, visible]);

  if (!visible) return null;

  return (
    <div
      className={`sidepanel__backdrop${closing ? ' sidepanel__backdrop--closing' : ''}`}
      onClick={onClose}
    >
      <div
        className={`sidepanel__surface${closing ? ' sidepanel__surface--closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <OptionsPanel
          onOptionsChange={onOptionsChange || (() => {})}
          onRestart={onRestart || (() => {})}
        />
      </div>
    </div>
  );
}