import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import { faculties } from '../data/dummyData';

export default function ReallocationModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [from, setFrom] = useState('Science');
  const [to, setTo] = useState('Engineering');
  const [amount, setAmount] = useState('5,000,000');
  const [reason, setReason] = useState('Infrastructure capacity requirement');

  if (submitted) {
    return (
      <Modal title="Request submitted" onClose={onClose} width={440} footer={<button className="btn btn-primary" onClick={onClose}>Done</button>}>
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <CheckCircle2 size={40} color="var(--green)" style={{ marginBottom: 10 }} />
          <p style={{ fontWeight: 700, fontSize: 15 }}>Reallocation request submitted for review</p>
          <p className="small muted" style={{ marginTop: 6 }}>
            This is a demonstration workflow only — no funds have been transferred.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Request Resource Reallocation"
      onClose={onClose}
      width={480}
      footer={<button className="btn btn-primary" onClick={() => setSubmitted(true)}>Submit Request</button>}
    >
      <div className="field">
        <label>From</label>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {faculties.map((f) => <option key={f.id}>{f.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label>To</label>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {faculties.map((f) => <option key={f.id}>{f.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Amount (EGP)</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div className="field">
        <label>Reason</label>
        <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>
      <p className="small muted">This creates a demonstration workflow only and does not transfer any funds.</p>
    </Modal>
  );
}
