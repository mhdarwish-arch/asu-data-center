import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { ChevronDown, ChevronUp, Wallet, Sparkles } from 'lucide-react';
import { asuFaculties } from '../data/asuFaculties';
import { academicYears, defaultYearId, yearById } from '../data/academicYears';
import { universityHierarchy, universityHrKpis, facultyHrBreakdown, facultyPersonnelFinance } from '../data/hrEngine';
import { facultyAlumniSummary, alumniInsight, alumniCohorts, cohortEmploymentByFaculty } from '../data/alumniEngine';

const PIE_COLORS = ['var(--asu-accent)', 'var(--gold)', 'var(--slate)', 'var(--green)'];

function fmtEGP(v) {
  if (v >= 1e9) return `EGP ${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `EGP ${(v / 1e6).toFixed(1)}M`;
  return `EGP ${v.toLocaleString()}`;
}

export default function HRFaculty() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('workforce');
  const [facultyId, setFacultyId] = useState('all');
  const [yearId, setYearId] = useState(defaultYearId);
  const [cohort, setCohort] = useState('2024');
  const [openTiers, setOpenTiers] = useState({ leadership: true, 'faculty-leadership': false, academic: true, assisting: false, administrative: false, support: false });

  const yearIndex = yearById(yearId).index;
  const facultyName = facultyId === 'all' ? null : asuFaculties.find((f) => f.id === facultyId)?.name;

  const hierarchy = useMemo(() => universityHierarchy(yearIndex), [yearIndex]);
  const uniKpis = useMemo(() => universityHrKpis(yearIndex), [yearIndex]);
  const facHr = useMemo(() => (facultyId !== 'all' ? facultyHrBreakdown(facultyId, yearIndex) : null), [facultyId, yearIndex]);
  const personnel = useMemo(() => (facultyId !== 'all' ? facultyPersonnelFinance(facultyId, yearIndex) : null), [facultyId, yearIndex]);
  const alumni = useMemo(() => facultyAlumniSummary(facultyId === 'all' ? 'engineering' : facultyId, yearIndex), [facultyId, yearIndex]);
  const cohortData = useMemo(() => cohortEmploymentByFaculty(facultyId === 'all' ? 'engineering' : facultyId, cohort), [facultyId, cohort]);

  function toggleTier(key) { setOpenTiers((s) => ({ ...s, [key]: !s[key] })); }

  return (
    <div>
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-eyebrow">Human Resources</div>
            <h1 className="page-title">HR & Faculty</h1>
            <p className="page-desc">University workforce hierarchy, connected to faculty performance, finance, and alumni outcomes.</p>
          </div>
          <div className="selectors">
            <div className="selector">
              <span className="muted">Academic Year</span>
              <select value={yearId} onChange={(e) => setYearId(e.target.value)}>
                {academicYears.map((y) => <option key={y.id} value={y.id}>{y.label}</option>)}
              </select>
            </div>
            <div className="selector">
              <span className="muted">Faculty</span>
              <select value={facultyId} onChange={(e) => setFacultyId(e.target.value)}>
                <option value="all">All Faculties (University-wide)</option>
                {asuFaculties.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-row">
        <button className={`tab-btn${tab === 'workforce' ? ' active' : ''}`} onClick={() => setTab('workforce')}>Workforce</button>
        <button className={`tab-btn${tab === 'alumni' ? ' active' : ''}`} onClick={() => setTab('alumni')}>Alumni</button>
      </div>

      {tab === 'workforce' && (
        <>
          <div className="grid grid-5">
            {uniKpis.slice(0, 5).map((k) => (
              <div className="kpi-card" key={k.label}><div className="kpi-label">{k.label}</div><div className="kpi-value" style={{ fontSize: 22 }}>{k.value}</div></div>
            ))}
          </div>
          <div className="grid grid-5 section-gap">
            {uniKpis.slice(5).map((k) => (
              <div className="kpi-card" key={k.label}><div className="kpi-label">{k.label}</div><div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div></div>
            ))}
          </div>

          {facultyId === 'all' ? (
            <div className="card card-pad section-gap">
              <div className="card-title">University Organizational Hierarchy</div>
              <div className="card-subtitle">University Leadership → Faculty Leadership → Academic Staff → Assisting Academic Staff → Administrative Staff → Support Staff</div>
              <div style={{ marginTop: 16 }}>
                {hierarchy.tiers.map((tier, i) => (
                  <div key={tier.key}>
                    <div className="org-tier">
                      <div className="org-tier-head" onClick={() => toggleTier(tier.key)}>
                        <div className="org-tier-title">
                          {tier.title}
                          <span className="org-tier-count">{tier.count.toLocaleString()}</span>
                        </div>
                        {openTiers[tier.key] ? <ChevronUp size={16} className="muted" /> : <ChevronDown size={16} className="muted" />}
                      </div>
                      {openTiers[tier.key] && (
                        <div className="org-roles">
                          {tier.roles.map((r) => (
                            <div className="org-role-card" key={r.title}>
                              <div className="org-role-title">{r.title}</div>
                              <div className="org-role-count">{r.count.toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {i < hierarchy.tiers.length - 1 && <div className="org-connector" />}
                  </div>
                ))}
              </div>
              <p className="small muted" style={{ marginTop: 6 }}>Individual names are not shown at the President level. Select a specific faculty above to view its detailed workforce breakdown.</p>
            </div>
          ) : (
            <>
              <div className="card card-pad section-gap">
                <div className="flex-between">
                  <div>
                    <div className="card-title">{facultyName} — Human Resources</div>
                    <div className="card-subtitle">Headcount and share by role</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => navigate('/finance', { state: { faculty: facultyId } })}>
                    <Wallet size={14} /> View Financial Impact
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
<table className="data-table" style={{ marginTop: 12 }}>
                  <thead><tr><th>Role</th><th>Headcount</th><th>% of Faculty Workforce</th></tr></thead>
                  <tbody>
                    {facHr.rows.map((r) => (
                      <tr key={r.title} style={{ cursor: 'default' }}>
                        <td style={{ fontWeight: 600 }}>{r.title}</td>
                        <td>{r.count.toLocaleString()}</td>
                        <td>{r.pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
</div>
              </div>

              {personnel && (
                <div className="card card-pad section-gap">
                  <div className="card-title">Personnel Financial Snapshot</div>
                  <div className="card-subtitle">HR ↔ Finance connection — {facultyName}</div>
                  <div className="grid grid-4" style={{ marginTop: 12 }}>
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

              <div className="grid grid-2 section-gap">
                <div className="card card-pad">
                  <div className="card-title">Academic Rank Distribution</div>
                  <div style={{ height: 240, marginTop: 12 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={facHr.rankDistribution} dataKey="value" nameKey="name" innerRadius={56} outerRadius={86} paddingAngle={2}>
                          {facHr.rankDistribution.map((d, i) => <Cell key={d.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
                        <Legend wrapperStyle={{ fontSize: 11.5 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="card card-pad">
                  <div className="card-title">Age Distribution</div>
                  <div style={{ height: 240, marginTop: 12 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={facHr.ageDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                        <XAxis dataKey="bucket" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="%" />
                        <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
                        <Bar dataKey="pct" fill="var(--asu-accent)" radius={[6, 6, 0, 0]} name="Share of staff" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-2 section-gap">
                <div className="card card-pad">
                  <div className="card-title">Years of Service</div>
                  <div style={{ height: 220, marginTop: 12 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={facHr.yearsOfService} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                        <XAxis dataKey="bucket" tick={{ fontSize: 11.5, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="%" />
                        <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
                        <Bar dataKey="pct" fill="var(--gold)" radius={[6, 6, 0, 0]} name="Share of staff" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="card card-pad">
                  <div className="card-title">Gender Distribution (Aggregate)</div>
                  <div className="card-subtitle">Aggregate figures only — no individual records</div>
                  <div style={{ height: 220, marginTop: 12 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={facHr.genderSplit} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                          {facHr.genderSplit.map((d, i) => <Cell key={d.name} fill={i === 0 ? 'var(--asu-accent)' : 'var(--slate)'} />)}
                        </Pie>
                        <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
                        <Legend wrapperStyle={{ fontSize: 11.5 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="card card-pad section-gap">
                <div className="card-title">Faculty Staffing Trend</div>
                <div className="card-subtitle">Academic staff headcount, 2022/23–2026/27 · Avg. teaching load: {facHr.avgWorkload} hrs/week</div>
                <div style={{ height: 220, marginTop: 12 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={facHr.staffingTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                      <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
                      <Line type="monotone" dataKey="headcount" stroke="var(--asu-accent)" strokeWidth={2.4} dot={{ r: 3 }} name="Academic staff" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {tab === 'alumni' && (
        <>
          <div className="privacy-note" style={{ marginBottom: 18 }}>
            Students → Graduates → Alumni. Figures below are aggregate, sample data for {facultyName || 'Faculty of Engineering (sample)'}.
          </div>
          <div className="grid grid-4">
            <div className="kpi-card"><div className="kpi-label">Total Alumni</div><div className="kpi-value" style={{ fontSize: 22 }}>{alumni.totalAlumni.toLocaleString()}</div></div>
            <div className="kpi-card"><div className="kpi-label">Employment Rate</div><div className="kpi-value" style={{ fontSize: 22 }}>{alumni.employmentRate}%</div></div>
            <div className="kpi-card"><div className="kpi-label">Alumni Satisfaction</div><div className="kpi-value" style={{ fontSize: 22 }}>{alumni.satisfaction}%</div></div>
            <div className="kpi-card"><div className="kpi-label">Alumni Engagement</div><div className="kpi-value" style={{ fontSize: 22 }}>{alumni.engagement}%</div></div>
          </div>

          <div className="grid grid-2 section-gap">
            <div className="card card-pad">
              <div className="flex-between">
                <div>
                  <div className="card-title">Employment Outcomes by Cohort</div>
                  <div className="card-subtitle">Students → Graduates → Alumni → Employment Outcomes</div>
                </div>
                <div className="selector">
                  <span className="muted">Cohort</span>
                  <select value={cohort} onChange={(e) => setCohort(e.target.value)}>
                    {alumniCohorts.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="tag-row" style={{ marginTop: 16 }}>
                <span className="chip">Employment rate: {cohortData.employed}%</span>
                <span className="chip">Further studies: {cohortData.further}%</span>
                <span className="chip">Entrepreneurship: {cohortData.entrepreneur}%</span>
                <span className="chip">Seeking employment: {cohortData.seeking}%</span>
              </div>
            </div>

            <div className="card card-pad">
              <div className="card-title">Geographic Distribution</div>
              <div style={{ height: 220, marginTop: 12 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={alumni.geographic} dataKey="pct" nameKey="region" innerRadius={54} outerRadius={84} paddingAngle={2}>
                      {alumni.geographic.map((d, i) => <Cell key={d.region} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
                    <Legend wrapperStyle={{ fontSize: 10.5 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card card-pad section-gap" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <Sparkles size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div className="card-title" style={{ fontSize: 14 }}>{alumniInsight.title}</div>
              <p className="small muted" style={{ marginTop: 4, lineHeight: 1.6 }}>{alumniInsight.text}</p>
              <p className="small muted" style={{ marginTop: 6, fontStyle: 'italic' }}>Demonstration insight based on sample data — not an actual university finding.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
