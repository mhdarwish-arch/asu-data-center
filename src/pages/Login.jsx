import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import logo from '../assets/asu-logo.png';

export default function Login() {
  const { t, setAuthed, lang, setLang } = useApp();
  const navigate = useNavigate();

  function enter() {
    setAuthed(true);
    navigate('/overview');
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <img src={logo} alt="ASU Data Center" className="login-mark-img" />
        <h1 className="login-title">{t.loginTitle}</h1>
        <div className="login-sub1">{t.loginSubtitle1}</div>
        <p className="login-sub2">{t.loginSubtitle2}</p>

        <div className="login-role-box">
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 0.4, textTransform: 'uppercase' }}>Role</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{t.loginRole}</div>
          <div className="small muted" style={{ marginTop: 2 }}>{t.loginName}</div>
        </div>

        <button className="btn btn-primary btn-block" style={{ marginTop: 22, padding: '12px 16px', fontSize: 13.5 }} onClick={enter}>
          {t.loginButton}
        </button>

        <div className="lang-toggle" style={{ marginTop: 20, justifyContent: 'center', display: 'inline-flex' }}>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')}>العربية</button>
        </div>

        <p className="small muted" style={{ marginTop: 18 }}>DEMO PROTOTYPE — SAMPLE DATA ONLY</p>
      </div>
    </div>
  );
}
