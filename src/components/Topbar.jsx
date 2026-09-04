import { Search, Moon, Sun, Bell, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';

export default function Topbar() {
  const { t, lang, setLang, darkMode, setDarkMode, setMobileNavOpen } = useApp();
  const { query, setQuery } = useSearch();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <button className="icon-btn mobile-menu-btn" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
          <Menu size={18} />
        </button>
        <div className="topbar-search">
          <Search size={15} />
          <input
            placeholder="Search dashboards, faculties, reports…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="topbar-right">
        <div className="status-pill refresh-pill">
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
        <button className="icon-btn notif-btn" title="Notifications">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
