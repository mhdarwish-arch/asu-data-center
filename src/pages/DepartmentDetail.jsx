import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { faculties } from '../data/dummyData';

export default function DepartmentDetail() {
  const { facultyId, deptId } = useParams();
  const navigate = useNavigate();
  const faculty = faculties.find((f) => f.id === facultyId);
  const dept = faculty?.departments.find((d) => d.id === deptId);

  if (!faculty || !dept) return <p>Department not found.</p>;

  const metrics = [
    { label: 'Enrollment', value: dept.enrollment.toLocaleString() },
    { label: 'Retention', value: `${dept.retention}%` },
    { label: 'Graduation', value: `${dept.graduation}%` },
    { label: 'Research Output', value: dept.research.toFixed(1) },
  ];

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/faculties">Faculties</Link><ChevronRight size={13} />
        <Link to={`/faculties/${faculty.id}`}>{faculty.name}</Link><ChevronRight size={13} />
        <span className="crumb-active">{dept.name}</span>
      </div>

      <div className="page-header">
        <div className="page-eyebrow">Department Dashboard</div>
        <h1 className="page-title">{dept.name}</h1>
        <p className="page-desc">Faculty of {faculty.name}</p>
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
        <div className="card-title">Sample courses</div>
        <div className="card-subtitle">Illustrative course-level breakdown for this department (demonstration data)</div>
        <table className="data-table" style={{ marginTop: 12 }}>
          <thead>
            <tr><th>Course</th><th>Enrolled</th><th>Pass rate</th><th>Section utilization</th></tr>
          </thead>
          <tbody>
            {['Introductory', 'Core', 'Advanced', 'Capstone'].map((level, i) => (
              <tr key={level}>
                <td style={{ fontWeight: 600 }}>{level} coursework</td>
                <td>{Math.round(dept.enrollment / (4 - i * 0.4)).toLocaleString()}</td>
                <td>{(dept.graduation + i * 1.4).toFixed(1)}%</td>
                <td>{(74 + i * 6)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-sm section-gap" onClick={() => navigate(`/faculties/${faculty.id}`)}>
        Back to {faculty.name}
      </button>
    </div>
  );
}
