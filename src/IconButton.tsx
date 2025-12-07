import { h } from 'preact';
import MuiIconButton from '@mui/material/IconButton';
import { ComponentChildren } from 'preact';
import './styles/IconButton.css';

type Props = {
  children: ComponentChildren;
  label?: string;
  onClick?: () => void;
};

export function IconButton({ children, label, onClick }: Props) {
  return (
    <MuiIconButton
      aria-label={label}
      onClick={onClick}
      className="mui-icon-button"
      size="medium"
      sx={{
        color: 'var(--icon-color)',
      }}
    >
      {children}
    </MuiIconButton>
  );
}