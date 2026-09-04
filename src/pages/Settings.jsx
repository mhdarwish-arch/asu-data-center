import { useApp } from '../context/AppContext';

export default function Settings() {
  const { lang, setLang, darkMode, setDarkMode } = useApp();
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Preferences</div>
        <h1 className="page-title">Settings</h1>
        <p className="page-desc">Interface preferences for this demonstration prototype.</p>
      </div>

      <div className="card card-pad" style={{ maxWidth: 480 }}>
        <div className="field">
          <label>Interface language</label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        <div className="divider" />
        <div className="field">
          <label>Appearance</label>
          <select value={darkMode ? 'dark' : 'light'} onChange={(e) => setDarkMode(e.target.value === 'dark')}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </div>
  );
}
