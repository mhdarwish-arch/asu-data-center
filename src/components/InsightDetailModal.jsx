import { useState } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import FollowUpModal from './FollowUpModal';

export default function InsightDetailModal({ insight, onClose }) {
  const [showFollowUp, setShowFollowUp] = useState(false);

  if (showFollowUp) {
    return (
      <FollowUpModal
        issue={insight.title}
        onClose={() => { setShowFollowUp(false); onClose(); }}
        onBack={() => setShowFollowUp(false)}
      />
    );
  }

  return (
    <Modal
      title="Why did the system flag this?"
      onClose={onClose}
      width={560}
      footer={(
        <>
          <button className="btn" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => setShowFollowUp(true)}>Flag for Follow-up</button>
        </>
      )}
    >
      <div>
        <div className="badge badge-gold" style={{ marginBottom: 8 }}>{insight.category}</div>
        <h3 style={{ fontSize: 16, lineHeight: 1.4 }}>{insight.title}</h3>
        <p className="muted small" style={{ marginTop: 6 }}>Scope: {insight.scope}</p>
      </div>

      <div className="divider" />

      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>
          Detected indicators
        </div>
        <ul className="list-clean" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {insight.indicators.map((ind) => (
            <li key={ind} className="small" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--asu-accent)', flexShrink: 0 }} />
              {ind}
            </li>
          ))}
        </ul>
      </div>

      <div className="divider" />

      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>
          Recommended leadership action
        </div>
        <p className="small" style={{ lineHeight: 1.6, fontStyle: 'italic', color: 'var(--text)' }}>
          "{insight.recommendation}"
        </p>
      </div>

      <div className="flex-between" style={{ marginTop: 4 }}>
        <div className="chip"><CheckCircle2 size={13} style={{ marginInlineEnd: 5 }} />Model confidence: {insight.confidence}%</div>
        <div className="chip" style={{ color: 'var(--asu-accent)', borderColor: 'var(--border)', background: 'var(--asu-accent-tint)' }}>
          <ShieldAlert size={13} style={{ marginInlineEnd: 5 }} />Human review required
        </div>
      </div>

      <div className="privacy-note">
        AI insights support human decision-making and do not automatically trigger institutional actions.
      </div>
    </Modal>
  );
}
