import './styles/BottomPanel.css';

/**
 * BottomPanel is a fixed footer component displaying attribution and social links.
 * 
 * 
 * Features:
 * - Attribution text with creator name
 * - Links to LinkedIn and GitHub profiles
 * - Semi-transparent background with backdrop blur
 * - Fixed positioning at viewport bottom
 * 
 * @example
 * ```tsx
 * <BottomPanel />
 * ```
 */
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