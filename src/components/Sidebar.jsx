import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  LayoutGrid, GraduationCap, Building2, FlaskConical, Wallet, HeartPulse,
  Sparkles, Settings2, FileBarChart, ShieldCheck, Settings, HelpCircle, Users2, X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import logo from '../assets/asu-logo.png';

const navItems = [
  { to: '/overview', key: 'overview', icon: LayoutGrid },
  { to: '/academic', key: 'academic', icon: GraduationCap },
  { to: '/faculties', key: 'faculties', icon: Building2 },
  { to: '/hr', key: 'hr', icon: Users2 },
  { to: '/research', key: 'research', icon: FlaskConical },
  { to: '/finance', key: 'finance', icon: Wallet },
  { to: '/student-success', key: 'studentSuccess', icon: HeartPulse },
  { to: '/ai-insights', key: 'aiInsights', icon: Sparkles },
  { to: '/operations', key: 'operations', icon: Settings2 },
  { to: '/reports', key: 'reports', icon: FileBarChart },
  { to: '/governance', key: 'governance', icon: ShieldCheck },
];

export default function Sidebar() {
  const { t, mobileNavOpen, setMobileNavOpen } = useApp();
  const location = useLocation();

  // Auto-close the mobile drawer whenever the route changes
  useEffect(() => { setMobileNavOpen(false); }, [location.pathname]);

  return (
    <>
      {mobileNavOpen && <div className="sidebar-backdrop" onClick={() => setMobileNavOpen(false)} />}
      <aside className={`sidebar${mobileNavOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <img src={logo} alt="ASU Data Center" className="brand-mark-img" />
          <div className="brand-text">
            <div className="brand-title">{t.appName}</div>
            <div className="brand-sub">{t.appSubtitle}</div>
          </div>
          <button className="icon-btn sidebar-close-btn" onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
            <X size={16} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{t.nav[key]}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/settings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Settings size={17} strokeWidth={1.8} /><span>{t.navFooter.settings}</span>
          </NavLink>
          <NavLink to="/help" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <HelpCircle size={17} strokeWidth={1.8} /><span>{t.navFooter.help}</span>
          </NavLink>
          <div className="sidebar-user">
            <div className="user-avatar">MD</div>
            <div>
              <div className="user-name">Prof. Mohamed Diaa Zain El-Abedeen</div>
              <div className="user-role">President — Ain Shams University</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
