import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { academicByFaculty, passFailDistribution, academicStandingDist, attendanceFactors } from '../data/dummyData';
import { asuFaculties } from '../data/asuFaculties';
import { computeAcademicQuality } from '../data/metricsEngine';
import { defaultYearId, yearById, academicYears } from '../data/academicYears';
import HeatMap from '../components/HeatMap';
import { useState } from 'react';

export default function AcademicPerformance() {
  const [yearId, setYearId] = useState(defaultYearId);
  const yearIndex = yearById(yearId).index;
  const heatRows = asuFaculties.map((f) => computeAcademicQuality(f.id, yearIndex));
  const heatCols = [
    { key: 'avgGPA', label: 'Average GPA', format: (v) => v.toFixed(2) },
    { key: 'passRate', label: 'Pass Rate', format: (v) => `${v}%` },
    { key: 'retention', label: 'Retention', format: (v) => `${v}%` },
    { key: 'graduation', label: 'Graduation', format: (v) => `${v}%` },
    { key: 'attendance', label: 'Attendance', format: (v) => `${v}%` },
  ];
  return (
    <div>
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-eyebrow">Academics</div>
            <h1 className="page-title">Academic Performance</h1>
            <p className="page-desc">University-wide academic indicators across enrollment, retention, graduation, and academic standing.</p>
          </div>
          <div className="selector">
            <span className="muted">Academic Year</span>
            <select value={yearId} onChange={(e) => setYearId(e.target.value)}>
              {academicYears.map((y) => <option key={y.id} value={y.id}>{y.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="section-gap">
        <HeatMap
          title="Academic Performance by Faculty"
          subtitle="Average GPA, pass rate, retention, graduation, and attendance — click a column to sort"
          rowLabel="Faculty"
          columns={heatCols}
          rows={heatRows}
        />
      </div>

      <div className="grid grid-2 section-gap">
        <div className="card card-pad">
          <div className="card-title">Retention & Graduation by Faculty</div>
          <div style={{ height: 300, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={academicByFaculty} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
                <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                  interval={0} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="retention" fill="var(--asu-accent)" name="Retention %" radius={[5, 5, 0, 0]} />
                <Bar dataKey="graduation" fill="var(--gold)" name="Graduation %" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title">Academic Standing Distribution</div>
          <div className="card-subtitle">University-wide, current term</div>
          <div style={{ height: 260, marginTop: 12, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={academicStandingDist} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={2}>
                  {academicStandingDist.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-2 section-gap">
        <div className="card card-pad">
          <div className="card-title">Pass / Fail Distribution</div>
          <div className="card-subtitle">Last four terms, university-wide</div>
          <div style={{ height: 260, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passFailDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                <XAxis dataKey="term" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="pass" stackId="a" fill="var(--green)" name="Pass %" radius={[0, 0, 0, 0]} />
                <Bar dataKey="fail" stackId="a" fill="var(--red)" name="Fail %" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title">Why is retention changing?</div>
          <div className="card-subtitle">Diagnostic — relative contribution of each factor</div>
          <div style={{ height: 260, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceFactors} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid stroke="var(--border-soft)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="%" />
                <YAxis type="category" dataKey="factor" tick={{ fontSize: 11.5, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={130} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} formatter={(v) => `${v}% relative impact`} />
                <Bar dataKey="impact" fill="var(--slate)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
