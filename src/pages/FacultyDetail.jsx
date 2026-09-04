import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { faculties } from '../data/dummyData';
import { useApp } from '../context/AppContext';

export default function FacultyDetail() {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const { t } = useApp();
  const faculty = faculties.find((f) => f.id === facultyId);
  const BackIcon = t.dir === 'rtl' ? ChevronRight : ChevronLeft;

  if (!faculty) return <p>Faculty not found.</p>;

  const metrics = [
    { label: 'Enrollment', value: faculty.enrollment.toLocaleString() },
    { label: 'Retention', value: `${faculty.retention}%` },
    { label: 'Graduation', value: `${faculty.graduation}%` },
    { label: 'Research Output', value: faculty.research.toFixed(1) },
    { label: 'Budget Execution', value: `${faculty.budgetExec}%` },
    { label: 'Faculty Workload (avg. hrs)', value: faculty.workload },
    { label: 'Students Flagged At-Risk', value: faculty.riskStudents },
    { label: 'Classroom Utilization', value: `${faculty.classroomUtil}%` },
  ];

  return (
    <div>
      <button className="btn btn-sm" style={{ marginBottom: 14 }} onClick={() => navigate('/faculties')}>
        <BackIcon size={14} /> All Faculties
      </button>

      <div className="breadcrumb">
        <Link to="/faculties">Faculties</Link><ChevronRight size={13} />
        <span className="crumb-active">{faculty.name}</span>
      </div>

      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-eyebrow">Faculty Dashboard</div>
            <h1 className="page-title">Faculty of {faculty.name}</h1>
            <p className="page-desc">{faculty.dean}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-4">
        {metrics.map((m) => (
          <div className="kpi-card" key={m.label}>
            <div className="kpi-label">{m.label}</div>
            <div className="kpi-value" style={{ fontSize: 24 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card card-pad section-gap">
        <div className="card-title">Departments</div>
        <div className="card-subtitle">University → Faculty → Department → Course. Select a department to drill further.</div>
        <div style={{ height: 240, marginTop: 14 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={faculty.departments} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                interval={0} angle={-12} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
              <Bar dataKey="enrollment" fill="var(--asu-accent)" radius={[6, 6, 0, 0]} name="Enrollment" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ overflowX: 'auto' }}>
<table className="data-table" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Department</th><th>Enrollment</th><th>Retention</th><th>Graduation</th><th>Research</th><th />
            </tr>
          </thead>
          <tbody>
            {faculty.departments.map((d) => (
              <tr key={d.id} onClick={() => navigate(`/faculties/${faculty.id}/${d.id}`)}>
                <td style={{ fontWeight: 600 }}>{d.name}</td>
                <td>{d.enrollment.toLocaleString()}</td>
                <td>{d.retention}%</td>
                <td>{d.graduation}%</td>
                <td>{d.research.toFixed(1)}</td>
                <td><ChevronRight size={15} className="muted" /></td>
              </tr>
            ))}
          </tbody>
        </table>
</div>
      </div>

      <div className="privacy-note section-gap">
        This view shows aggregate faculty and department indicators only. Individual student records are not displayed at the leadership level.
      </div>
    </div>
  );
}
