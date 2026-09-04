import { Search, Moon, Sun, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';

export default function Topbar() {
  const { t, lang, setLang, darkMode, setDarkMode } = useApp();
  const { query, setQuery } = useSearch();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={15} />
        <input
          placeholder="Search dashboards, faculties, reports…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="topbar-right">
        <div className="status-pill">
          <span className="status-dot" />
          {t.refreshed}
        </div>
        <div className="lang-toggle">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')}>العربية</button>
        </div>
        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button className="icon-btn" title="Notifications">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
