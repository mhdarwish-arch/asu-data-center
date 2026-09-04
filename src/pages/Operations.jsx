import { useState } from 'react';
import { operationsKpis, maintenanceAssets } from '../data/dummyData';
import { asuFaculties } from '../data/asuFaculties';
import { computeResourceUtilization } from '../data/metricsEngine';
import { defaultYearId, yearById, academicYears } from '../data/academicYears';
import Modal from '../components/Modal';
import HeatMap from '../components/HeatMap';

function riskColor(risk) {
  if (risk >= 85) return { bg: 'var(--red-tint)', fg: 'var(--red)' };
  if (risk >= 75) return { bg: 'var(--gold-tint)', fg: '#8A631E' };
  return { bg: 'var(--green-tint)', fg: 'var(--green)' };
}

export default function Operations() {
  const [selected, setSelected] = useState(null);
  const [yearId, setYearId] = useState(defaultYearId);
  const yearIndex = yearById(yearId).index;

  const utilRows = asuFaculties.map((f) => computeResourceUtilization(f.id, yearIndex));
  const utilCols = [
    { key: 'classroomUtil', label: 'Classroom Utilization', format: (v) => `${v}%` },
    { key: 'labUtil', label: 'Laboratory Utilization', format: (v) => `${v}%` },
    { key: 'staffUtil', label: 'Staff Utilization', format: (v) => `${v}%` },
    { key: 'budgetUtil', label: 'Budget Utilization', format: (v) => `${v}%` },
    { key: 'facilityUtil', label: 'Facility Utilization', format: (v) => `${v}%` },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-eyebrow">Operations</div>
            <h1 className="page-title">University Operations</h1>
            <p className="page-desc">Facilities utilization, maintenance risk, and equipment inventory.</p>
          </div>
          <div className="selector">
            <span className="muted">Academic Year</span>
            <select value={yearId} onChange={(e) => setYearId(e.target.value)}>
              {academicYears.map((y) => <option key={y.id} value={y.id}>{y.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-5">
        {operationsKpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 22 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="section-gap">
        <HeatMap
          title="Resource Utilization"
          subtitle="Classroom, laboratory, staff, budget, and facility utilization by faculty"
          rowLabel="Faculty"
          columns={utilCols}
          rows={utilRows}
        />
      </div>

      <div className="card card-pad section-gap">
        <div className="card-title">Maintenance-Risk Assets</div>
        <div className="card-subtitle">7 assets with elevated failure probability — click for detail</div>
        <div style={{ overflowX: 'auto' }}>
<table className="data-table" style={{ marginTop: 12 }}>
          <thead>
            <tr><th>Asset</th><th>Type</th><th>Location</th><th>Age (yrs)</th><th>Risk Score</th><th></th></tr>
          </thead>
          <tbody>
            {maintenanceAssets.map((a) => {
              const c = riskColor(a.risk);
              return (
                <tr key={a.id} onClick={() => setSelected(a)}>
                  <td style={{ fontWeight: 600 }}>{a.id}</td>
                  <td>{a.type}</td>
                  <td>{a.location}</td>
                  <td>{a.age}</td>
                  <td><span className="heat-cell" style={{ background: c.bg, color: c.fg }}>{a.risk}</span></td>
                  <td><button className="btn btn-sm">Review</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
</div>
      </div>

      {selected && (
        <Modal title={selected.id} onClose={() => setSelected(null)} width={460}
          footer={<button className="btn btn-primary" onClick={() => setSelected(null)}>Close</button>}>
          <div className="grid grid-2" style={{ gap: 10 }}>
            <div><div className="small muted">Asset type</div><div style={{ fontWeight: 600 }}>{selected.type}</div></div>
            <div><div className="small muted">Location</div><div style={{ fontWeight: 600 }}>{selected.location}</div></div>
            <div><div className="small muted">Age</div><div style={{ fontWeight: 600 }}>{selected.age} years</div></div>
            <div><div className="small muted">Risk score</div><div style={{ fontWeight: 600 }}>{selected.risk} / 100</div></div>
          </div>
          <div className="divider" />
          <div><div className="small muted">Maintenance history</div><div style={{ marginTop: 4 }}>{selected.history}</div></div>
          <div style={{ marginTop: 10 }}><div className="small muted">Recommended review</div><div style={{ marginTop: 4, fontWeight: 600 }}>{selected.recommendation}</div></div>
        </Modal>
      )}
    </div>
  );
}
