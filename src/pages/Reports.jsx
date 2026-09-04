import { useState } from 'react';
import { FileText, Download, Eye, FileBarChart } from 'lucide-react';
import { reports } from '../data/dummyData';
import Modal from '../components/Modal';
import logo from '../assets/asu-logo.png';

export default function Reports() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  function generate() {
    setReady(false);
    setGenerating(true);
    setProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      p += 20;
      setProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setGenerating(false);
        setReady(true);
      }
    }, 260);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Reporting</div>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logo} alt="ASU Data Center" className="report-brand-img" />
          Leadership Reports
        </h1>
        <p className="page-desc">Standing reports and on-demand executive report generation.</p>
      </div>

      <div className="grid grid-4">
        {reports.map((r) => (
          <div className="card card-pad" key={r.id}>
            <FileText size={22} color="var(--asu-accent)" />
            <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 10 }}>{r.title}</div>
            <div className="small muted" style={{ marginTop: 4 }}>{r.updated}</div>
            <button className="btn btn-sm" style={{ marginTop: 14 }}><Eye size={13} /> Preview</button>
          </div>
        ))}
      </div>

      <div className="card card-pad section-gap" style={{ textAlign: 'center', padding: '36px 20px' }}>
        <FileBarChart size={30} color="var(--gold)" style={{ margin: '0 auto' }} />
        <div style={{ fontWeight: 700, fontSize: 15, marginTop: 10 }}>Generate a custom executive report</div>
        <p className="small muted" style={{ maxWidth: 440, margin: '6px auto 0' }}>
          Compiles the latest KPIs, faculty comparisons, and AI insights into a leadership-ready document.
        </p>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={generate}>Generate Executive Report</button>
      </div>

      {generating && (
        <Modal title="Generating report…" onClose={() => {}} width={420}>
          <p className="small muted">Compiling KPIs, faculty comparisons, and AI insights…</p>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        </Modal>
      )}

      {ready && (
        <Modal
          title="Report Ready"
          onClose={() => setReady(false)}
          width={420}
          footer={(
            <>
              <button className="btn"><Eye size={14} /> Preview PDF</button>
              <button className="btn"><Download size={14} /> Export PDF</button>
              <button className="btn btn-primary"><Download size={14} /> Export PowerPoint</button>
            </>
          )}
        >
          <p style={{ fontSize: 13.5 }}>Your executive report has been compiled and is ready to preview or export.</p>
          <p className="small muted">(Simulated for this demonstration prototype — no file is generated.)</p>
        </Modal>
      )}
    </div>
  );
}
