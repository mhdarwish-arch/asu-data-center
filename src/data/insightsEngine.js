import { seededRange } from './seed';
import { asuFaculties } from './asuFaculties';
import { computeMetrics, facultyRows, enrollmentGrowth } from './metricsEngine';

export function generateInsights(facultyId, yearIndex) {
  const m = computeMetrics(facultyId, yearIndex);
  const scope = facultyId === 'all' ? 'University-wide' : m.name;
  const growth = enrollmentGrowth(facultyId === 'all' ? asuFaculties[0].id : facultyId, yearIndex);

  const sections = Math.max(2, Math.round(m.riskStudents / 40));
  const yieldPct = Math.round(clamp(84 + seededRange(`${facultyId}-${yearIndex}-yield`, -4, 4), 72, 94));

  return [
    {
      id: 'student-risk',
      category: 'Student Success',
      title: `${m.riskStudents.toLocaleString()} students have been flagged as potentially at risk this term.`,
      delta: `${Math.round(seededRange(`${facultyId}-${yearIndex}-riskdelta`, 4, 16))}% vs previous term`,
      cta: 'View Insight',
      confidence: Math.round(clamp(78 + seededRange(`${facultyId}-${yearIndex}-conf1`, -6, 10), 65, 94)),
      indicators: [
        `Attendance ↓ ${round1(seededRange(`${facultyId}-${yearIndex}-a1`, 3, 8))}%`,
        `Average GPA ↓ ${round1(seededRange(`${facultyId}-${yearIndex}-a2`, 0.1, 0.4))}`,
        `LMS engagement ↓ ${Math.round(seededRange(`${facultyId}-${yearIndex}-a3`, 6, 15))}%`,
        `Academic holds ↑ ${Math.round(seededRange(`${facultyId}-${yearIndex}-a4`, 2, 6))}%`,
      ],
      recommendation: `Review the affected departments with ${facultyId === 'all' ? 'Faculty leadership' : `${m.name}'s leadership`} and evaluate targeted student-support interventions.`,
      scope,
    },
    {
      id: 'course-demand',
      category: 'Course Demand',
      title: `${sections} course sections are projected to require additional capacity next semester.`,
      delta: 'Based on 3-year enrollment trend',
      cta: 'View Forecast',
      confidence: Math.round(clamp(75 + seededRange(`${facultyId}-${yearIndex}-conf2`, -6, 10), 60, 92)),
      indicators: [`Enrollment growth ${growth >= 0 ? '↑' : '↓'} ${Math.abs(growth)}%`, 'Waitlist volume trending upward', 'Historical section utilization above 90%'],
      recommendation: 'Coordinate with the scheduling committee to approve additional sections for the highest-demand courses.',
      scope,
    },
    {
      id: 'facilities-risk',
      category: 'Facilities',
      title: `${Math.max(2, Math.round(m.classroomUtil / 13))} facilities have elevated maintenance-risk scores.`,
      delta: 'Reviewed weekly',
      cta: 'View Risks',
      confidence: Math.round(clamp(84 + seededRange(`${facultyId}-${yearIndex}-conf3`, -5, 8), 70, 95)),
      indicators: ['Equipment age above threshold', 'Rising ticket frequency', 'Preventive maintenance overdue'],
      recommendation: 'Schedule preventive maintenance for the top-risk assets before the new semester begins.',
      scope,
    },
    {
      id: 'admissions-yield',
      category: 'Admissions',
      title: `Expected enrollment yield is projected at ${yieldPct}%.`,
      delta: `${growth >= 0 ? '+' : ''}${growth}pp vs last cycle`,
      cta: 'View Forecast',
      confidence: Math.round(clamp(80 + seededRange(`${facultyId}-${yearIndex}-conf4`, -6, 8), 66, 92)),
      indicators: ['Application volume trending upward', 'Historical yield pattern', 'Scholarship-offer acceptance rising'],
      recommendation: 'Confirm incoming class sizing with Admissions and pre-allocate housing and section capacity accordingly.',
      scope,
    },
    {
      id: 'research-growth',
      category: 'Research',
      title: `Research output is projected to ${m.research > 75 ? 'exceed' : 'approach'} its annual target${m.research > 75 ? ` by ${Math.round(m.research - 75)}%` : ''}.`,
      delta: m.research > 75 ? 'Trending above forecast' : 'Trending toward forecast',
      cta: 'View Forecast',
      confidence: Math.round(clamp(74 + seededRange(`${facultyId}-${yearIndex}-conf5`, -6, 10), 60, 90)),
      indicators: ['Publication rate trending upward', 'Grant applications increasing', 'Postgraduate thesis completions rising'],
      recommendation: 'Highlight this trend to the Board and consider reinforcing funding for the fastest-growing research groups.',
      scope,
    },
  ];
}

export function generateAlerts(facultyId, yearIndex) {
  const rows = facultyRows(yearIndex);
  const sorted = [...rows].sort((a, b) => a.retention - b.retention);
  const lowest = sorted[0];
  const highest = [...rows].sort((a, b) => b.research - a.research)[0];
  const overUtilized = [...rows].sort((a, b) => b.classroomUtil - a.classroomUtil)[0];

  const scopeRow = facultyId === 'all' ? null : rows.find((r) => r.id === facultyId);

  const alerts = [
    {
      id: 'a1', level: lowest.retention < 87 ? 'red' : 'amber',
      text: `${lowest.name} retention below target`,
      detail: `Retention in ${lowest.name} has fallen to ${lowest.retention}%, below this year's target. The decline is concentrated in second-year cohorts.`,
    },
    {
      id: 'a2', level: 'amber',
      text: `${overUtilized.name} classroom utilization above forecast`,
      detail: `Classroom utilization in ${overUtilized.name} is tracking at ${overUtilized.classroomUtil}%, above the planning forecast. Facilities capacity should be reviewed ahead of next term.`,
    },
    {
      id: 'a3', level: 'amber',
      text: '7 facilities require maintenance review',
      detail: 'Seven campus facilities show elevated maintenance-risk scores based on equipment age and rising ticket frequency. See Operations for the full list.',
    },
    {
      id: 'a4', level: 'green',
      text: `${highest.name} research output exceeds target`,
      detail: `${highest.name} leads university-wide research output at an index of ${highest.research}, ahead of the annual target.`,
    },
  ];

  if (scopeRow) {
    alerts.unshift({
      id: 'a0', level: scopeRow.retention < 88 ? 'red' : scopeRow.retention < 91 ? 'amber' : 'green',
      text: `${scopeRow.name}: retention at ${scopeRow.retention}%, graduation at ${scopeRow.graduation}%`,
      detail: `Selected faculty snapshot — ${scopeRow.riskStudents.toLocaleString()} students flagged at risk, budget execution at ${scopeRow.budgetExec}%, classroom utilization at ${scopeRow.classroomUtil}%.`,
    });
  }

  return alerts;
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function round1(v) { return Math.round(v * 10) / 10; }
