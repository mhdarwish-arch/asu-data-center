import { Database, Layers, Server, BarChart3, LayoutDashboard } from 'lucide-react';
import { dataSources, governanceRoles, privacyControls } from '../data/dummyData';
import logo from '../assets/asu-logo.png';

const pipeline = [
  { icon: Server, label: 'Source Systems' },
  { icon: Layers, label: 'Staging' },
  { icon: Database, label: 'Data Warehouse' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: LayoutDashboard, label: 'Dashboards' },
];

export default function DataGovernance() {
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Governance</div>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logo} alt="ASU Data Center" className="report-brand-img" />
          Data Governance
        </h1>
        <p className="page-desc">How data flows into the platform, and who is accountable for it at every stage.</p>
      </div>

      <div className="grid grid-3">
        <div className="kpi-card"><div className="kpi-label">Data Quality</div><div className="kpi-value" style={{ fontSize: 24 }}>94.8%</div><div className="small muted" style={{ marginTop: 6 }}>records passing validation</div></div>
        <div className="kpi-card"><div className="kpi-label">Data Freshness</div><div className="kpi-value" style={{ fontSize: 24 }}>91%</div><div className="small muted" style={{ marginTop: 6 }}>refreshed within 24 hours</div></div>
        <div className="kpi-card"><div className="kpi-label">Connected Sources</div><div className="kpi-value" style={{ fontSize: 24 }}>{dataSources.length}</div><div className="small muted" style={{ marginTop: 6 }}>university systems integrated</div></div>
      </div>

      <div className="card card-pad section-gap">
        <div className="card-title">Data Pipeline</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
          {pipeline.map((s, i) => (
            <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                padding: '14px 18px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--surface-2)', minWidth: 110,
              }}>
                <s.icon size={20} color="var(--asu-accent)" />
                <span style={{ fontSize: 12, fontWeight: 700, textAlign: 'center' }}>{s.label}</span>
              </span>
              {i < pipeline.length - 1 && <span className="muted" style={{ fontSize: 18 }}>→</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-2 section-gap">
        <div className="card card-pad">
          <div className="card-title">Connected Data Sources</div>
          <div style={{ overflowX: 'auto' }}>
<table className="data-table" style={{ marginTop: 10 }}>
            <thead><tr><th>System</th><th>Status</th><th>Freshness</th></tr></thead>
            <tbody>
              {dataSources.map((s) => (
                <tr key={s.name} style={{ cursor: 'default' }}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td><span className="badge badge-green">{s.status}</span></td>
                  <td className="small muted">{s.freshness}</td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
        </div>

        <div className="card card-pad">
          <div className="card-title">Governance Structure</div>
          <ul className="list-clean" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {governanceRoles.map((g) => (
              <li key={g.role}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{g.role}</div>
                <div className="small muted" style={{ marginTop: 3, lineHeight: 1.5 }}>{g.detail}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card card-pad section-gap">
        <div className="card-title">Privacy & Security</div>
        <div className="card-subtitle">Your access level: University President</div>
        <div className="tag-row" style={{ marginTop: 14 }}>
          {privacyControls.map((p) => <span className="chip" key={p}>{p}</span>)}
        </div>
        <div className="privacy-note" style={{ marginTop: 16 }}>
          You can view university-wide aggregate indicators and drill down to authorized faculty-level information.
          Individual sensitive records remain restricted.
        </div>
      </div>
    </div>
  );
}
