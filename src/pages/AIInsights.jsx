import { useState } from 'react';
import { generateInsights } from '../data/insightsEngine';
import InsightDetailModal from '../components/InsightDetailModal';

const insights = generateInsights('all', 4);

export default function AIInsights() {
  const [active, setActive] = useState(null);

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Predictive Analytics</div>
        <h1 className="page-title">AI-Powered Insights</h1>
        <p className="page-desc">
          Demonstration predictions only — these do not represent actual Ain Shams University data. Every insight requires human review
          before any institutional action is taken.
        </p>
      </div>

      <div className="grid grid-3">
        {insights.map((ins) => (
          <div className="insight-card" key={ins.id}>
            <span className="badge badge-slate" style={{ alignSelf: 'flex-start' }}>{ins.category}</span>
            <div className="insight-title">{ins.title}</div>
            <div className="insight-delta">{ins.delta}</div>
            <div className="small muted">Confidence: {ins.confidence}%</div>
            <button className="btn btn-outline btn-sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }} onClick={() => setActive(ins)}>
              {ins.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="privacy-note section-gap">
        AI insights support human decision-making and do not automatically trigger institutional actions.
      </div>

      {active && <InsightDetailModal insight={active} onClose={() => setActive(null)} />}
    </div>
  );
}
