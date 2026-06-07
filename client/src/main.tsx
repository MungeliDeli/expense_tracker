import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { getThemeById, DEFAULT_THEME_ID } from './lib/themes';
import { applyThemeTokens } from './lib/themeUtils';
import './index.css';

try {
  const stored = localStorage.getItem('theme-engine');
  const themeId = stored ? JSON.parse(stored).activeThemeId : DEFAULT_THEME_ID;
  applyThemeTokens(getThemeById(themeId).tokens, themeId);
} catch {
  applyThemeTokens(getThemeById(DEFAULT_THEME_ID).tokens, DEFAULT_THEME_ID);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
