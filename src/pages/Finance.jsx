import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { financeKpis, budgetVsActual, facultyBudget } from '../data/dummyData';
import { defaultYearId, yearById, academicYears } from '../data/academicYears';
import { facultyPersonnelFinance } from '../data/hrEngine';
import { asuFaculties } from '../data/asuFaculties';
import ReallocationModal from '../components/ReallocationModal';

function fmtEGP(v) {
  if (v >= 1e9) return `EGP ${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `EGP ${(v / 1e6).toFixed(1)}M`;
  return `EGP ${v.toLocaleString()}`;
}

export default function Finance() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [yearId, setYearId] = useState(defaultYearId);

  useEffect(() => {
    if (location.state?.faculty) setFacultyFilter(location.state.faculty);
  }, [location.state]);

  const yearIndex = yearById(yearId).index;
  const facultyName = facultyFilter === 'all' ? null : asuFaculties.find((f) => f.id === facultyFilter)?.name;
  const personnel = facultyFilter !== 'all' ? facultyPersonnelFinance(facultyFilter, yearIndex) : null;

  return (
    <div>
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-eyebrow">Finance</div>
            <h1 className="page-title">University Financial Intelligence</h1>
            <p className="page-desc">Budget execution, revenue, and faculty-level financial comparison.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Request Resource Reallocation</button>
        </div>
      </div>

      <div className="grid grid-3">
        {financeKpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 22 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {personnel && (
        <div className="card card-pad section-gap">
          <div className="flex-between">
            <div>
              <div className="card-title">Personnel Expenditure — {facultyName}</div>
              <div className="card-subtitle">HR ↔ Finance connection · linked from HR & Faculty</div>
            </div>
            <div className="selector">
              <span className="muted">Academic Year</span>
              <select value={yearId} onChange={(e) => setYearId(e.target.value)}>
                {academicYears.map((y) => <option key={y.id} value={y.id}>{y.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-4" style={{ marginTop: 14 }}>
            <div className="org-role-card"><div className="org-role-title">Total Employees</div><div className="org-role-count">{personnel.totalEmployees.toLocaleString()}</div></div>
            <div className="org-role-card"><div className="org-role-title">Personnel Budget</div><div className="org-role-count">{fmtEGP(personnel.personnelBudget)}</div></div>
            <div className="org-role-card"><div className="org-role-title">Executed</div><div className="org-role-count">{personnel.executionPct}%</div></div>
            <div className="org-role-card"><div className="org-role-title">Average Personnel Cost</div><div className="org-role-count">{fmtEGP(personnel.avgCost)}</div></div>
          </div>
          <div className="tag-row" style={{ marginTop: 12 }}>
            <span className="chip">Academic Staff Cost: {fmtEGP(personnel.academicCost)}</span>
            <span className="chip">Administrative Staff Cost: {fmtEGP(personnel.adminCost)}</span>
            <span className="chip">Support Staff Cost: {fmtEGP(personnel.supportCost)}</span>
          </div>
        </div>
      )}

      <div className="card card-pad section-gap">
        <div className="flex-between">
          <div>
            <div className="card-title">Budget vs Actual (EGP millions)</div>
            <div className="card-subtitle">Monthly, current fiscal year</div>
          </div>
        </div>
        <div style={{ height: 280, marginTop: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={budgetVsActual} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="budget" stroke="var(--slate)" strokeDasharray="5 4" strokeWidth={2} name="Budget" dot={false} />
              <Line type="monotone" dataKey="actual" stroke="var(--asu-accent)" strokeWidth={2.4} name="Actual" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card card-pad section-gap">
        <div className="flex-between">
          <div>
            <div className="card-title">Faculty Budget Execution</div>
            <div className="card-subtitle">Percentage of allocated budget executed, current fiscal year</div>
          </div>
          <div className="selector">
            <select value={facultyFilter} onChange={(e) => setFacultyFilter(e.target.value)}>
              <option value="all">All Faculties</option>
              {facultyBudget.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ height: 320, marginTop: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={facultyFilter === 'all' ? facultyBudget : facultyBudget.filter((f) => f.id === facultyFilter)}
              margin={{ top: 10, right: 10, left: -10, bottom: 60 }}
            >
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                interval={0} angle={-38} textAnchor="end" />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} formatter={(v) => `${v}%`} />
              <Bar dataKey="execution" fill="var(--gold)" radius={[6, 6, 0, 0]} name="Budget Execution" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showModal && <ReallocationModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
