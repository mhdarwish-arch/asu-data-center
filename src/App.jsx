import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { SearchProvider } from './context/SearchContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import ExecutiveOverview from './pages/ExecutiveOverview';
import AcademicPerformance from './pages/AcademicPerformance';
import Faculties from './pages/Faculties';
import FacultyDetail from './pages/FacultyDetail';
import DepartmentDetail from './pages/DepartmentDetail';
import HRFaculty from './pages/HRFaculty';
import Research from './pages/Research';
import Finance from './pages/Finance';
import StudentSuccess from './pages/StudentSuccess';
import AIInsights from './pages/AIInsights';
import Operations from './pages/Operations';
import Reports from './pages/Reports';
import DataGovernance from './pages/DataGovernance';
import Settings from './pages/Settings';
import Help from './pages/Help';

function Protected({ children }) {
  const { authed } = useApp();
  return authed ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/overview" element={<ExecutiveOverview />} />
        <Route path="/academic" element={<AcademicPerformance />} />
        <Route path="/faculties" element={<Faculties />} />
        <Route path="/faculties/:facultyId" element={<FacultyDetail />} />
        <Route path="/faculties/:facultyId/:deptId" element={<DepartmentDetail />} />
        <Route path="/hr" element={<HRFaculty />} />
        <Route path="/research" element={<Research />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/student-success" element={<StudentSuccess />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/operations" element={<Operations />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/governance" element={<DataGovernance />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <SearchProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </SearchProvider>
    </AppProvider>
  );
}
