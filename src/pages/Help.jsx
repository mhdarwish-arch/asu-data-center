export default function Help() {
  const items = [
    { q: 'What is the ASU Data Center?', a: 'A centralized, governed university-wide platform that integrates data from faculties and administrative units and presents it through role-based dashboards.' },
    { q: 'Is this connected to real university data?', a: 'No. This is a demonstration prototype using fictional sample data to illustrate what the platform could look like once implemented.' },
    { q: 'Who can see individual student records?', a: 'Individual, identifiable student data is restricted by role. Leadership dashboards show aggregated and anonymized indicators only.' },
    { q: 'How do AI insights work?', a: 'Predictive models flag patterns in the data. Every flag requires human review before any institutional action is taken — see the AI Insights page.' },
  ];
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Support</div>
        <h1 className="page-title">Help</h1>
        <p className="page-desc">Common questions about this demonstration prototype.</p>
      </div>
      <div className="card card-pad" style={{ maxWidth: 720 }}>
        {items.map((item, i) => (
          <div key={item.q} style={{ marginBottom: i < items.length - 1 ? 18 : 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>{item.q}</div>
            <p className="small muted" style={{ marginTop: 5, lineHeight: 1.6 }}>{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
