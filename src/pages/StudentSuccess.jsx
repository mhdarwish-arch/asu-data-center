import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ShieldCheck } from 'lucide-react';
import { riskDistribution, riskStudentGroups } from '../data/dummyData';
import Modal from '../components/Modal';

const riskBadge = { High: 'badge-red', Medium: 'badge-gold' };

export default function StudentSuccess() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Student Success</div>
        <h1 className="page-title">Student Success Intelligence</h1>
        <p className="page-desc">Predictive risk monitoring, aggregated for university leadership.</p>
      </div>

      <div className="privacy-note" style={{ marginBottom: 18 }}>
        <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        Leadership view — individual student identifiers are restricted by role. Groups shown below are anonymized.
      </div>

      <div className="grid grid-4">
        <div className="kpi-card"><div className="kpi-label">At-Risk Students</div><div className="kpi-value">420</div></div>
        <div className="kpi-card"><div className="kpi-label">High Risk</div><div className="kpi-value" style={{ color: 'var(--red)' }}>96</div></div>
        <div className="kpi-card"><div className="kpi-label">Medium Risk</div><div className="kpi-value" style={{ color: 'var(--gold)' }}>324</div></div>
        <div className="kpi-card"><div className="kpi-label">Intervention Rate</div><div className="kpi-value">68%</div></div>
      </div>

      <div className="grid section-gap" style={{ gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
        <div className="card card-pad">
          <div className="card-title">Risk Distribution</div>
          <div className="card-subtitle">University-wide, current term</div>
          <div style={{ height: 260, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={2}>
                  {riskDistribution.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title">Flagged Student Groups (Anonymized)</div>
          <div className="card-subtitle">Sample cases — click to review indicators</div>
          <div style={{ overflowX: 'auto' }}>
<table className="data-table" style={{ marginTop: 10 }}>
            <thead><tr><th>Group ID</th><th>Risk</th><th>Faculty</th><th></th></tr></thead>
            <tbody>
              {riskStudentGroups.map((s) => (
                <tr key={s.id} onClick={() => setSelected(s)}>
                  <td style={{ fontWeight: 600 }}>Student Group {s.id}</td>
                  <td><span className={`badge ${riskBadge[s.risk]}`}>{s.risk}</span></td>
                  <td>{s.faculty}</td>
                  <td><button className="btn btn-sm">Review Case</button></td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
        </div>
      </div>

      <div className="card card-pad section-gap">
        <div className="card-title">Workflow: prediction to action</div>
        <div className="tag-row" style={{ marginTop: 14 }}>
          {['AI Flag', 'Human Review', 'Intervention', 'Outcome Logged'].map((step, i, arr) => (
            <span key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="chip" style={{ background: 'var(--asu-accent-tint)', color: 'var(--asu-accent)', fontWeight: 700 }}>{step}</span>
              {i < arr.length - 1 && <span className="muted">→</span>}
            </span>
          ))}
        </div>
      </div>

      {selected && (
        <Modal title={`Student Group ${selected.id}`} onClose={() => setSelected(null)} width={460}
          footer={<button className="btn btn-primary" onClick={() => setSelected(null)}>Close</button>}>
          <span className={`badge ${riskBadge[selected.risk]}`}>{selected.risk} Risk</span>
          <p className="small muted" style={{ marginTop: 8 }}>Faculty: {selected.faculty}</p>
          <div className="divider" />
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>
            Primary indicators
          </div>
          <ul className="list-clean" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {selected.indicators.map((i) => (
              <li key={i} className="small" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--asu-accent)' }} />{i}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  );
}
