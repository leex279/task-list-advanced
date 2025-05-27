import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const LIGHT_THEME = 'material-custom';
const DARK_THEME = 'material-custom-dark';
const THEME_STORAGE_KEY = 'app-theme';

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme || LIGHT_THEME; // Default to light theme
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => 
      prevTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME
    );
  };

  const isDark = currentTheme === DARK_THEME;

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
