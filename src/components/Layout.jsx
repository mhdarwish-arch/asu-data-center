import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useApp } from '../context/AppContext';

export default function Layout() {
  const { t } = useApp();
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
      <div className="demo-tag">{t.demoLabel}</div>
    </div>
  );
}
