import { useState, useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';

// value -> color intensity, sequential white/light -> accent scale, normalized per column
function cellStyle(value, min, max) {
  const t = max === min ? 0.5 : (value - min) / (max - min);
  const alpha = 0.12 + t * 0.72; // 0.12 -> 0.84
  return {
    background: `color-mix(in srgb, var(--asu-accent) ${Math.round(alpha * 100)}%, var(--surface))`,
    color: t > 0.55 ? 'var(--heat-text-on)' : 'var(--text)',
    fontWeight: 700,
  };
}

export default function HeatMap({ title, subtitle, rowLabel = 'Faculty', columns, rows, highlightRowId }) {
  const [sortKey, setSortKey] = useState(columns[0].key);
  const [sortDir, setSortDir] = useState('desc');

  const bounds = useMemo(() => {
    const b = {};
    columns.forEach((c) => {
      const vals = rows.map((r) => r[c.key]);
      b[c.key] = { min: Math.min(...vals), max: Math.max(...vals) };
    });
    return b;
  }, [rows, columns]);

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => (sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]));
    return arr;
  }, [rows, sortKey, sortDir]);

  function onSort(key) {
    if (key === sortKey) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  return (
    <div className="card card-pad">
      <div className="card-title">{title}</div>
      {subtitle && <div className="card-subtitle">{subtitle}</div>}
      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <table className="data-table heatmap-table">
          <thead>
            <tr>
              <th>{rowLabel}</th>
              {columns.map((c) => (
                <th key={c.key} onClick={() => onSort(c.key)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {c.label}
                    {sortKey === c.key && <ArrowUpDown size={11} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className={highlightRowId && r.id === highlightRowId ? 'row-highlight' : ''} style={{ cursor: 'default' }}>
                <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{r.name}</td>
                {columns.map((c) => {
                  const v = r[c.key];
                  const { min, max } = bounds[c.key];
                  return (
                    <td key={c.key}>
                      <span className="heat-cell" style={cellStyle(v, min, max)}>
                        {c.format ? c.format(v) : v}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
