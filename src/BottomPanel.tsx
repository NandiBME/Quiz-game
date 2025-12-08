import { h } from 'preact';
import './styles/BottomPanel.css';

export function BottomPanel() {
  return (
    <footer className="bottom-panel">
      <span className="bottom-panel__text">
        Made by Nándor Kanyicska
        
      </span>
      <nav className="bottom-panel__links">
        <span aria-hidden="true">•</span>
        <a href="https://www.placeholder.com" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <span aria-hidden="true">•</span>
        <a href="https://placeholder.com" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </footer>
  );
}