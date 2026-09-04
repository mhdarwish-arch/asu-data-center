import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { translations } from '../data/translations';

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [authed, setAuthed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = translations[lang].dir;
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const t = translations[lang];

  const value = useMemo(() => ({
    lang, setLang, t, authed, setAuthed, darkMode, setDarkMode, mobileNavOpen, setMobileNavOpen,
  }), [lang, t, authed, darkMode, mobileNavOpen]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
