import { h } from 'preact';
import MuiIconButton from '@mui/material/IconButton';
import { ComponentChildren } from 'preact';
import './styles/IconButton.css';

type Props = {
  children: ComponentChildren;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  sx?: any;
};

export function IconButton({ children, label, onClick, disabled = false, sx }: Props) {
  return (
    <MuiIconButton
      aria-label={label}
      onClick={onClick}
      className="mui-icon-button"
      size="medium"
      disabled={disabled}
      sx={{ color: 'var(--icon-color)', ...sx }}
    >
      {children}
    </MuiIconButton>
  );
}