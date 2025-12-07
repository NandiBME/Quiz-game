import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { OptionsPanel, GameOptions } from './OptionsPanel';
import './styles/SidePanel.css';

type Props = {
  open: boolean;
  onClose?: () => void;
  onOptionsChange?: (options: GameOptions) => void;
  onRestart?: () => void;
};

export function SidePanel({ open, onClose, onOptionsChange, onRestart }: Props) {
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);

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