import { useState, useEffect } from 'react';

const DEFAULT_SETTINGS = {
  service: 'Google',
  model: 'gemini-2.0-flash-exp',
  googleApiKey: ''
};

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage.getItem('settings');
    try {
      const parsed = storedSettings ? JSON.parse(storedSettings) : null;
      return parsed || DEFAULT_SETTINGS;
    } catch (e) {
      console.error('Error parsing stored settings:', e);
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  return [settings, setSettings] as const;
} 