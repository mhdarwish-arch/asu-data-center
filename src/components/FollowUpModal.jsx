import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Modal from './Modal';

export default function FollowUpModal({ issue, onClose, onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const [assignee, setAssignee] = useState('Vice President for Education');
  const [priority, setPriority] = useState('High');
  const [deadline, setDeadline] = useState('2026-10-15');

  if (submitted) {
    return (
      <Modal title="Follow-up created" onClose={onClose} width={440} footer={<button className="btn btn-primary" onClick={onClose}>Done</button>}>
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <CheckCircle2 size={40} color="var(--green)" style={{ marginBottom: 10 }} />
          <p style={{ fontWeight: 700, fontSize: 15 }}>Follow-up created successfully</p>
          <p className="small muted" style={{ marginTop: 6 }}>
            Assigned to {assignee} · Priority: {priority} · Due {deadline}
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Create Leadership Follow-up"
      onClose={onClose}
      width={480}
      footer={(
        <>
          {onBack && <button className="btn" onClick={onBack}>Back</button>}
          <button className="btn btn-primary" onClick={() => setSubmitted(true)}>Create Follow-up</button>
        </>
      )}
    >
      <div className="field">
        <label>Issue</label>
        <input value={issue} readOnly />
      </div>
      <div className="field">
        <label>Assigned to</label>
        <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
          <option>Vice President for Education</option>
          <option>Vice President for Community Service</option>
          <option>Vice President for Graduate Studies & Research</option>
          <option>Faculty Dean</option>
        </select>
      </div>
      <div className="field">
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
      <div className="field">
        <label>Deadline</label>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </div>
    </Modal>
  );
}
