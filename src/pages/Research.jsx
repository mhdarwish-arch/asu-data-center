import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sparkles } from 'lucide-react';
import { researchKpis, researchTrend, topResearchFaculties, researchOpportunities } from '../data/dummyData';

export default function Research() {
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Research</div>
        <h1 className="page-title">Research & Innovation</h1>
        <p className="page-desc">University-wide research output, funding, and five-year growth trend.</p>
      </div>

      <div className="grid grid-3">
        {researchKpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 24 }}>{k.value}</div>
            <div className="kpi-delta up" style={{ marginTop: 6 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="card card-pad section-gap">
        <div className="card-title">Five-Year Research Output Trend</div>
        <div style={{ height: 280, marginTop: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={researchTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="publications" stroke="var(--asu-accent)" strokeWidth={2.4} name="Publications" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="grants" stroke="var(--gold)" strokeWidth={2.4} name="Funded Projects" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-2 section-gap">
        <div className="card card-pad">
          <div className="card-title">Top Performing Faculties</div>
          <ul className="list-clean" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topResearchFaculties.sort((a, b) => b.index - a.index).map((f, i) => (
              <li key={f.name} className="flex-between" style={{ fontSize: 13 }}>
                <span><strong>{i + 1}.</strong> &nbsp;{f.name}</span>
                <span className="badge badge-green">{f.index}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card card-pad">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={15} color="var(--gold)" /> Research Growth Opportunities
          </div>
          <div className="card-subtitle">AI-assisted trend forecast (demonstration)</div>
          <ul className="list-clean" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {researchOpportunities.map((o) => (
              <li key={o.faculty}>
                <div style={{ fontWeight: 700, fontSize: 12.8 }}>{o.faculty}</div>
                <div className="small muted" style={{ marginTop: 3, lineHeight: 1.5 }}>{o.note}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
