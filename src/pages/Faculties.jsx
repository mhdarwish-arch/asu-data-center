import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, ChevronRight } from 'lucide-react';
import { faculties } from '../data/dummyData';
import { asuFaculties } from '../data/asuFaculties';
import { academicYears } from '../data/academicYears';
import { overallPerformanceIndex } from '../data/metricsEngine';
import { useSearch } from '../context/SearchContext';
import HeatMap from '../components/HeatMap';

const trendRows = asuFaculties.map((f) => {
  const row = { id: f.id, name: f.name };
  academicYears.forEach((y) => { row[y.id] = overallPerformanceIndex(f.id, y.index); });
  return row;
});
const trendCols = academicYears.map((y) => ({ key: y.id, label: y.label, format: (v) => v.toFixed(1) }));

export default function Faculties() {
  const navigate = useNavigate();
  const { query } = useSearch();
  const filtered = faculties.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Institution</div>
        <h1 className="page-title">Faculties</h1>
        <p className="page-desc">Ain Shams University's faculties, each with its own dean, departments, and performance profile. Select a faculty to open its detailed dashboard.</p>
      </div>

      <div className="grid grid-3">
        {filtered.map((f) => (
          <div key={f.id} className="card card-pad" style={{ cursor: 'pointer' }} onClick={() => navigate(`/faculties/${f.id}`)}>
            <div className="flex-between">
              <div className="card-title">{f.name}</div>
              <ChevronRight size={16} className="muted" />
            </div>
            <div className="small muted" style={{ marginTop: 4 }}>{f.dean}</div>
            <div className="divider" />
            <div style={{ display: 'flex', gap: 18 }}>
              <div>
                <div className="small muted" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={13} />Enrollment</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 3 }}>{f.enrollment.toLocaleString()}</div>
              </div>
              <div>
                <div className="small muted" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><TrendingUp size={13} />Retention</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 3 }}>{f.retention}%</div>
              </div>
            </div>
            <div className="tag-row" style={{ marginTop: 14 }}>
              <span className="chip">Graduation {f.graduation}%</span>
              <span className="chip">{f.departments.length} departments</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="muted">No faculties match "{query}".</p>}
      </div>

      <div className="section-gap">
        <HeatMap
          title="Performance Trend by Academic Year"
          subtitle="Overall Performance Index (average of retention, graduation, research, and budget execution) — click a column to sort"
          rowLabel="Faculty"
          columns={trendCols}
          rows={trendRows}
        />
      </div>
    </div>
  );
}
