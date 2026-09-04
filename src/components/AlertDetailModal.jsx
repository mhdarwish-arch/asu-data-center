import Modal from './Modal';

const levelLabel = { red: 'Critical', amber: 'Watch', green: 'On Track' };

export default function AlertDetailModal({ alert, onClose }) {
  return (
    <Modal title="Alert Detail" onClose={onClose} width={480} footer={<button className="btn btn-primary" onClick={onClose}>Close</button>}>
      <span className={`badge badge-${alert.level === 'red' ? 'red' : alert.level === 'amber' ? 'gold' : 'green'}`}>
        {levelLabel[alert.level]}
      </span>
      <h3 style={{ fontSize: 15.5, marginTop: 8 }}>{alert.text}</h3>
      <p className="small" style={{ lineHeight: 1.6, color: 'var(--text-muted)', marginTop: 6 }}>{alert.detail}</p>
    </Modal>
  );
}
