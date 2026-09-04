// ============================================================================
// ASU Data Center — Demonstration Prototype
// ALL DATA IN THIS FILE IS FICTIONAL SAMPLE DATA FOR DEMONSTRATION PURPOSES ONLY.
// This module is a compatibility/default-view layer: most figures are computed by
// the deterministic engines in metricsEngine.js / hrEngine.js / alumniEngine.js /
// insightsEngine.js for the latest academic year (2026/27, index 4), so that pages
// which don't have their own Academic Year selector still show internally
// consistent numbers that match the Executive Overview at that year.
// ============================================================================

import { asuFaculties, facultyDepartments, anonDean } from './asuFaculties';
import { computeFacultyMetrics, departmentRows, trendSeries } from './metricsEngine';

const LATEST_YEAR_INDEX = 4;

export const trendMeta = {
  enrollment: { label: 'Enrollment', color: 'var(--asu-accent)', format: (v) => v.toLocaleString() },
  retention: { label: 'Retention', color: 'var(--gold)', format: (v) => `${v}%` },
  graduation: { label: 'Graduation', color: 'var(--slate)', format: (v) => `${v}%` },
  research: { label: 'Research Output', color: 'var(--green)', format: (v) => v.toFixed(1) },
};

// ---- Faculties (real ASU faculties, latest-year snapshot + anonymized dean) ----
export const faculties = asuFaculties.map((f) => {
  const m = computeFacultyMetrics(f.id, LATEST_YEAR_INDEX);
  return {
    ...m,
    dean: anonDean(f.id),
    departments: departmentRows(f.id, LATEST_YEAR_INDEX),
  };
});

export const facultyKpiKeys = [
  { key: 'retention', label: 'Retention', format: (v) => `${v}%` },
  { key: 'graduation', label: 'Graduation', format: (v) => `${v}%` },
  { key: 'research', label: 'Research Output', format: (v) => v.toFixed(1) },
  { key: 'budgetExec', label: 'Budget Execution', format: (v) => `${v}%` },
];

// ---- Research ----
export const researchTrend = trendSeries('all').map((r) => ({
  year: r.year,
  publications: Math.round(r.research * 37.8),
  citations: Math.round(r.research * 390),
  grants: Math.round(r.research * 5.2),
}));

export const researchKpis = [
  { label: 'Publications', value: researchTrend.at(-1).publications.toLocaleString(), delta: '+10.8%' },
  { label: 'Citations', value: researchTrend.at(-1).citations.toLocaleString(), delta: '+16.7%' },
  { label: 'Research Output Index', value: computeFacultyMetrics('cis', LATEST_YEAR_INDEX).research.toFixed(1), delta: '+8.7%' },
  { label: 'Funded Projects', value: researchTrend.at(-1).grants.toLocaleString(), delta: '+9.2%' },
  { label: 'Research Grants (EGP)', value: '612M', delta: '+11.4%' },
  { label: 'Patents', value: '27', delta: '+3' },
];

export const topResearchFaculties = [...faculties]
  .sort((a, b) => b.research - a.research)
  .slice(0, 5)
  .map((f) => ({ name: f.name, index: f.research }));

export const researchOpportunities = [
  { faculty: 'Faculty of Agriculture', note: 'Grant applications are rising but funded-project conversion lags the university average — a proposal-writing support program could close the gap.' },
  { faculty: 'Faculty of Law', note: 'Citation growth is accelerating in comparative law — a strong candidate for a dedicated research cluster.' },
  { faculty: 'Faculty of Arts', note: 'Postgraduate thesis output is rising sharply in Sociology — consider expanding supervision capacity.' },
];

// ---- Finance ----
export const financeKpis = [
  { label: 'Total Budget', value: 'EGP 4.82B' },
  { label: 'Budget Executed', value: 'EGP 3.97B (82.4%)' },
  { label: 'Remaining Budget', value: 'EGP 0.85B' },
  { label: 'Tuition Revenue', value: 'EGP 2.61B' },
  { label: 'Research Grants', value: 'EGP 612M' },
  { label: 'Procurement (YTD)', value: 'EGP 940M' },
];

export const budgetVsActual = [
  { month: 'Jan', budget: 380, actual: 352 }, { month: 'Feb', budget: 380, actual: 361 },
  { month: 'Mar', budget: 390, actual: 379 }, { month: 'Apr', budget: 400, actual: 388 },
  { month: 'May', budget: 400, actual: 397 }, { month: 'Jun', budget: 410, actual: 402 },
  { month: 'Jul', budget: 400, actual: 379 }, { month: 'Aug', budget: 390, actual: 355 },
  { month: 'Sep', budget: 410, actual: 401 }, { month: 'Oct', budget: 410, actual: 396 },
  { month: 'Nov', budget: 410, actual: 388 }, { month: 'Dec', budget: 420, actual: 379 },
];

export const facultyBudget = faculties.map((f) => ({ id: f.id, name: f.name, execution: f.budgetExec }));

// ---- Operations ----
export const operationsKpis = [
  { label: 'Classroom Utilization', value: '74%' },
  { label: 'Laboratory Utilization', value: '68%' },
  { label: 'Open Maintenance Tickets', value: '132' },
  { label: 'Equipment Items Tracked', value: '18,940' },
  { label: 'Energy Usage (YTD)', value: '41.2 GWh' },
];

export const maintenanceAssets = [
  { id: 'AST-2201', type: 'HVAC Unit', location: 'Faculty of Engineering — Building C', age: 11, risk: 92, history: '4 tickets in the last 6 months', recommendation: 'Schedule full inspection before next semester' },
  { id: 'AST-1187', type: 'Lab Fume Hood', location: 'Faculty of Science — Chemistry Wing', age: 9, risk: 87, history: '3 tickets in the last 3 months', recommendation: 'Replace filtration unit' },
  { id: 'AST-3054', type: 'Elevator', location: 'Faculty of Medicine — Main Building', age: 14, risk: 85, history: '5 tickets in the last year', recommendation: 'Priority mechanical review' },
  { id: 'AST-0876', type: 'Generator', location: 'Central Campus', age: 8, risk: 81, history: '2 tickets in the last 6 months', recommendation: 'Preventive service' },
  { id: 'AST-4410', type: 'Server Room Cooling', location: 'Faculty of Computer and Information Sciences — Data Center', age: 6, risk: 78, history: '3 tickets in the last 3 months', recommendation: 'Redundancy check' },
  { id: 'AST-2679', type: 'Water Pump', location: 'Faculty of Agriculture — Field Station', age: 13, risk: 75, history: '2 tickets in the last 6 months', recommendation: 'Replace bearing assembly' },
  { id: 'AST-3392', type: 'Classroom Projector Bank', location: 'Faculty of Business — Building A', age: 5, risk: 71, history: '4 tickets in the last 6 months', recommendation: 'Bulk lamp replacement' },
];

// ---- Reports ----
export const reports = [
  { id: 'r1', title: 'University Performance Report', updated: 'Updated today' },
  { id: 'r2', title: 'Academic Performance Report', updated: 'Updated yesterday' },
  { id: 'r3', title: 'Research Report', updated: 'Updated this week' },
  { id: 'r4', title: 'Financial Performance Report', updated: 'Updated this month' },
];

// ---- Data Governance ----
export const dataSources = [
  { name: 'Student Information System (SIS)', status: 'Connected', freshness: '99% within 24h' },
  { name: 'HR / Payroll', status: 'Connected', freshness: '96% within 24h' },
  { name: 'ERP / Finance', status: 'Connected', freshness: '94% within 24h' },
  { name: 'Learning Management System (LMS)', status: 'Connected', freshness: '99% within 24h' },
  { name: 'Library System', status: 'Connected', freshness: '88% within 24h' },
  { name: 'Admissions Portal', status: 'Connected', freshness: '97% within 24h' },
  { name: 'Research Portal', status: 'Connected', freshness: '82% within 24h' },
  { name: 'Facilities Management', status: 'Connected', freshness: '90% within 24h' },
];

export const governanceRoles = [
  { role: 'Data Governance Committee', detail: 'Approves data use, resolves ownership disputes, reviews AI models for fairness' },
  { role: 'Data Protection Officer', detail: 'PDPL compliance, breach response, data-subject requests' },
  { role: 'Faculty Data Stewards', detail: 'One per faculty — validates and submits local data' },
  { role: 'Role-Based Access Control', detail: 'Every dashboard and table is scoped to what a role needs' },
  { role: 'Audit Logging', detail: 'Every access to personal data in the warehouse is logged' },
];

export const privacyControls = [
  'Role-based access', 'Data minimization', 'De-identification', 'Small-cell suppression',
  'Encryption in transit & at rest', 'Audit logging', 'Data-subject rights', 'Predictive-model fairness review',
];

// ---- Academic Performance ----
export const attendanceFactors = [
  { factor: 'Course performance', impact: 32 },
  { factor: 'Attendance', impact: 27 },
  { factor: 'LMS engagement', impact: 19 },
  { factor: 'Academic standing', impact: 14 },
  { factor: 'Financial holds', impact: 8 },
];

export const academicByFaculty = faculties.map((f) => ({
  name: f.name, enrollment: f.enrollment, retention: f.retention, graduation: f.graduation,
}));

export const passFailDistribution = [
  { term: "Fall '24", pass: 84.1, fail: 15.9 },
  { term: "Spring '25", pass: 85.4, fail: 14.6 },
  { term: "Fall '25", pass: 86.0, fail: 14.0 },
  { term: "Spring '26", pass: 87.3, fail: 12.7 },
];

export const academicStandingDist = [
  { name: 'Good Standing', value: 82.4, color: 'var(--asu-accent)' },
  { name: 'Warning', value: 12.1, color: 'var(--gold)' },
  { name: 'Probation', value: 5.5, color: 'var(--red)' },
];

// ---- Student Success ----
const totalAtRisk = faculties.reduce((s, f) => s + f.riskStudents, 0);
export const riskDistribution = [
  { name: 'Low Risk', value: faculties.reduce((s, f) => s + f.enrollment, 0) - totalAtRisk, color: '#C9C4BE' },
  { name: 'Medium Risk', value: Math.round(totalAtRisk * 0.77), color: 'var(--gold)' },
  { name: 'High Risk', value: Math.round(totalAtRisk * 0.23), color: 'var(--red)' },
];

export const riskStudentGroups = [
  { id: 'A-1042', risk: 'High', faculty: 'Faculty of Engineering', indicators: ['Attendance decline', 'GPA decline', 'Low LMS engagement'] },
  { id: 'A-1187', risk: 'High', faculty: 'Faculty of Science', indicators: ['Financial hold', 'Attendance decline', 'Missed assessments'] },
  { id: 'A-1298', risk: 'Medium', faculty: 'Faculty of Business', indicators: ['GPA decline', 'Low LMS engagement'] },
  { id: 'A-1355', risk: 'Medium', faculty: 'Faculty of Arts', indicators: ['Attendance decline'] },
  { id: 'A-1402', risk: 'High', faculty: 'Faculty of Education', indicators: ['Academic hold', 'GPA decline', 'Attendance decline'] },
  { id: 'A-1467', risk: 'Medium', faculty: 'Faculty of Engineering', indicators: ['Low LMS engagement', 'Missed assessments'] },
];

export { asuFaculties, facultyDepartments };
