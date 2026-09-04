import { ArrowUpRight, ArrowRight, ArrowDownRight } from 'lucide-react';

export default function KpiCard({ label, value, delta, trend = 'up', onClick }) {
  const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : ArrowRight;
  return (
    <div className="kpi-card" onClick={onClick} role={onClick ? 'button' : undefined}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-delta ${trend}`}>
        <Icon size={13} />
        {delta}
      </div>
    </div>
  );
}
