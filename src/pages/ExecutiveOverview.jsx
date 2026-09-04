import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot,
} from 'recharts';
import { Calendar, ChevronRight, Users2, Wallet, FlaskConical } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { trendMeta } from '../data/dummyData';
import { academicYears, yearById } from '../data/academicYears';
import { asuFaculties } from '../data/asuFaculties';
import { computeMetrics, trendSeries, facultyRows, enrollmentGrowth, departmentRows } from '../data/metricsEngine';
import { generateInsights, generateAlerts } from '../data/insightsEngine';
import { universityHrKpis, facultyPersonnelFinance } from '../data/hrEngine';
import KpiCard from '../components/KpiCard';
import HeatMap from '../components/HeatMap';
import InsightDetailModal from '../components/InsightDetailModal';
import AlertDetailModal from '../components/AlertDetailModal';

export default function ExecutiveOverview() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [metric, setMetric] = useState('enrollment');
  const [facultyId, setFacultyId] = useState('all');
  const [yearId, setYearId] = useState('2026-2027');
  const [activeInsight, setActiveInsight] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);

  const yearIndex = yearById(yearId).index;
  const isProjection = yearById(yearId).projection;

  const metrics = useMemo(() => computeMetrics(facultyId, yearIndex), [facultyId, yearIndex]);
  const prevMetrics = useMemo(() => (yearIndex > 0 ? computeMetrics(facultyId, yearIndex - 1) : null), [facultyId, yearIndex]);
  const trend = useMemo(() => trendSeries(facultyId), [facultyId]);
  const insights = useMemo(() => generateInsights(facultyId, yearIndex), [facultyId, yearIndex]);
  const alerts = useMemo(() => generateAlerts(facultyId, yearIndex), [facultyId, yearIndex]);
  const facultyName = facultyId === 'all' ? null : asuFaculties.find((f) => f.id === facultyId)?.name;

  function pctDelta(cur, prev) {
    if (prev === undefined || prev === null) return { text: 'Baseline year', trend: 'flat' };
    const diff = cur - prev;
    const trendDir = diff > 0.05 ? 'up' : diff < -0.05 ? 'down' : 'flat';
    const sign = diff > 0 ? '+' : '';
    return { text: `${sign}${round1(diff)} vs prior year`, trend: trendDir };
  }

  const kpiCards = [
    { id: 'enrollment', label: 'Total Enrollment', value: metrics.enrollment.toLocaleString(), ...pctDeltaPct(metrics.enrollment, prevMetrics?.enrollment) },
    { id: 'retention', label: 'Retention Rate', value: `${metrics.retention}%`, ...pctDelta(metrics.retention, prevMetrics?.retention) },
    { id: 'graduation', label: 'Graduation Rate', value: `${metrics.graduation}%`, ...pctDelta(metrics.graduation, prevMetrics?.graduation) },
    { id: 'research', label: 'Research Output Index', value: metrics.research.toFixed(1), ...pctDelta(metrics.research, prevMetrics?.research) },
    { id: 'budget', label: 'Budget Execution', value: `${metrics.budgetExec}%`, ...pctDelta(metrics.budgetExec, prevMetrics?.budgetExec) },
  ];

  // Heat Map 1 — Faculty Performance (only meaningful at the university-wide level)
  const heatRows = facultyRows(yearIndex).map((f) => ({ ...f, enrollmentGrowth: enrollmentGrowth(f.id, yearIndex) }));
  const heatCols = [
    { key: 'enrollmentGrowth', label: 'Enrollment Growth', format: (v) => `${v > 0 ? '+' : ''}${v}%` },
    { key: 'retention', label: 'Retention', format: (v) => `${v}%` },
    { key: 'graduation', label: 'Graduation', format: (v) => `${v}%` },
    { key: 'research', label: 'Research Output', format: (v) => v.toFixed(1) },
    { key: 'budgetExec', label: 'Budget Execution', format: (v) => `${v}%` },
  ];

  const deptRows = facultyId !== 'all' ? departmentRows(facultyId, yearIndex) : [];
  const deptCols = [
    { key: 'enrollment', label: 'Enrollment', format: (v) => v.toLocaleString() },
    { key: 'retention', label: 'Retention', format: (v) => `${v}%` },
    { key: 'graduation', label: 'Graduation', format: (v) => `${v}%` },
    { key: 'research', label: 'Research Output', format: (v) => v.toFixed(1) },
  ];

  const hrSummary = universityHrKpis(yearIndex);
  const personnel = facultyPersonnelFinance(facultyId === 'all' ? 'engineering' : facultyId, yearIndex);

  return (
    <div>
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-eyebrow">ASU Data Center · Executive Overview</div>
            <h1 className="page-title">{t.greeting}</h1>
            <p className="page-desc">
              {t.overviewHeading}{facultyName ? ` — ${facultyName}` : ''}
              {isProjection && <span className="badge badge-gold" style={{ marginInlineStart: 8 }}>Projected</span>}
            </p>
          </div>
          <div className="selectors">
            <div className="selector">
              <Calendar size={14} />
              <span className="muted">{t.academicYear}</span>
              <select value={yearId} onChange={(e) => setYearId(e.target.value)}>
                {academicYears.map((y) => <option key={y.id} value={y.id}>{y.label}{y.projection ? ' (Projected)' : ''}</option>)}
              </select>
            </div>
            <div className="selector">
              <span className="muted">Faculty</span>
              <select value={facultyId} onChange={(e) => setFacultyId(e.target.value)}>
                <option value="all">All Faculties</option>
                {asuFaculties.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div className="status-pill"><span className="status-dot" />{t.refreshed}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-5">
        {kpiCards.map((k) => (
          <KpiCard key={k.id} label={k.label} value={k.value} delta={k.text} trend={k.trend}
            onClick={() => k.id === 'research' ? navigate('/research') : k.id === 'budget' ? navigate('/finance') : null} />
        ))}
      </div>

      <div className="section-gap grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Trend chart */}
        <div className="card card-pad">
          <div className="flex-between">
            <div>
              <div className="card-title">University Performance — 2022–2026{facultyName ? ` · ${facultyName}` : ''}</div>
              <div className="card-subtitle">Sample multi-year trend; 2026/27 is an illustrative projection</div>
            </div>
            <div className="tag-row">
              {Object.entries(trendMeta).map(([key, m]) => (
                <button
                  key={key}
                  className="chip"
                  style={metric === key ? { background: 'var(--asu-accent)', color: '#fff', borderColor: 'var(--asu-accent)' } : undefined}
                  onClick={() => setMetric(key)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: 280, marginTop: 14 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => trendMeta[metric].format(v)} width={70} />
                <Tooltip
                  formatter={(v) => trendMeta[metric].format(v)}
                  contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }}
                />
                <Line type="monotone" dataKey={metric} stroke={trendMeta[metric].color} strokeWidth={2.5}
                  dot={{ r: 4, fill: trendMeta[metric].color }} activeDot={{ r: 6 }} />
                <ReferenceDot x={trend[yearIndex].year} y={trend[yearIndex][metric]} r={7} fill="var(--asu-accent)" stroke="#fff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts */}
        <div className="card card-pad">
          <div className="card-title">Strategic Attention Required</div>
          <div className="card-subtitle" style={{ marginBottom: 12 }}>Click an alert for detail</div>
          {alerts.map((a) => (
            <div key={a.id} className="alert-item" onClick={() => setActiveAlert(a)}>
              <span className={`alert-dot ${a.level}`} />
              <span className="alert-text">{a.text}</span>
              <ChevronRight size={15} className="muted" />
            </div>
          ))}
        </div>
      </div>

      {/* Heat map / drill-down */}
      <div className="section-gap">
        {facultyId === 'all' ? (
          <HeatMap
            title="Faculty Performance Heat Map"
            subtitle="Click a column to sort · darker shading = stronger relative performance"
            rowLabel="Faculty"
            columns={heatCols}
            rows={heatRows}
          />
        ) : (
          <HeatMap
            title={`${facultyName} — Department Breakdown`}
            subtitle="Department-level detail for the selected faculty"
            rowLabel="Department"
            columns={deptCols}
            rows={deptRows}
          />
        )}
      </div>

      {/* AI Insights */}
      <div className="section-gap">
        <div className="flex-between">
          <div>
            <div className="card-title" style={{ fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
              AI-Powered Insights
              <span className="badge badge-gold">Predictive Analytics</span>
            </div>
          </div>
          <button className="btn btn-sm" onClick={() => navigate('/ai-insights')}>View all</button>
        </div>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {insights.slice(0, 3).map((ins) => (
            <div className="insight-card" key={ins.id}>
              <span className="badge badge-slate" style={{ alignSelf: 'flex-start' }}>{ins.category}</span>
              <div className="insight-title">{ins.title}</div>
              <div className="insight-delta">{ins.delta}</div>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
                onClick={() => setActiveInsight(ins)}>
                {ins.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* HR / Finance / Research summary strip */}
      <div className="card card-pad section-gap">
        <div className="card-title">Integrated Snapshot — HR · Finance · Research</div>
        <div className="card-subtitle">A single record connects academic, workforce, and financial data for this selection</div>
        <div className="grid grid-3" style={{ marginTop: 14 }}>
          <div className="org-role-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/hr')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users2 size={15} color="var(--asu-accent)" />
              <span className="org-role-title">Workforce</span>
            </div>
            <div className="org-role-count">{hrSummary[0].value}</div>
            <div className="small muted">{hrSummary[0].label}, university-wide</div>
          </div>
          <div className="org-role-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/finance')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Wallet size={15} color="var(--asu-accent)" />
              <span className="org-role-title">Personnel Budget Execution</span>
            </div>
            <div className="org-role-count">{personnel.executionPct}%</div>
            <div className="small muted">{facultyId === 'all' ? 'Sample: Faculty of Engineering' : facultyName}</div>
          </div>
          <div className="org-role-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/research')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FlaskConical size={15} color="var(--asu-accent)" />
              <span className="org-role-title">Research Output Index</span>
            </div>
            <div className="org-role-count">{metrics.research.toFixed(1)}</div>
            <div className="small muted">{facultyName || 'University-wide'}, {yearById(yearId).label}</div>
          </div>
        </div>
      </div>

      {activeInsight && <InsightDetailModal insight={activeInsight} onClose={() => setActiveInsight(null)} />}
      {activeAlert && <AlertDetailModal alert={activeAlert} onClose={() => setActiveAlert(null)} />}
    </div>
  );
}

function round1(v) { return Math.round(v * 10) / 10; }
function pctDeltaPct(cur, prev) {
  if (prev === undefined || prev === null) return { text: 'Baseline year', trend: 'flat' };
  const pct = ((cur - prev) / prev) * 100;
  const trendDir = pct > 0.1 ? 'up' : pct < -0.1 ? 'down' : 'flat';
  const sign = pct > 0 ? '+' : '';
  return { text: `${sign}${round1(pct)}% vs prior year`, trend: trendDir };
}
