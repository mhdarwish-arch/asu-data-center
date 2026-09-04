import { seededRange } from './seed';
import { asuFaculties } from './asuFaculties';
import { computeFacultyMetrics, computeAllMetrics } from './metricsEngine';

// Tier definitions for the university-wide organizational hierarchy.
// Headcounts are illustrative, derived from total enrollment for internal consistency.
export function universityHierarchy(yearIndex) {
  const { enrollment } = computeAllMetrics(yearIndex);
  const academicStaff = Math.round(enrollment / 17.5);
  const assistingAcademic = Math.round(academicStaff * 0.62);
  const administrative = Math.round(enrollment / 42);
  const support = Math.round(enrollment / 55);
  const leadership = 1 + 6 + 24; // President + VPs + Board/leadership members
  const facultyLeadership = asuFaculties.length * 3; // Dean + 2 Vice Deans per faculty

  return {
    tiers: [
      {
        key: 'leadership', title: 'University Leadership', count: leadership,
        roles: [
          { title: 'University President', count: 1 },
          { title: 'Vice Presidents', count: 6 },
          { title: 'University Board / University Leadership', count: 24 },
        ],
      },
      {
        key: 'faculty-leadership', title: 'Faculty Leadership', count: facultyLeadership,
        roles: [
          { title: 'Faculty Deans', count: asuFaculties.length },
          { title: 'Vice Deans', count: asuFaculties.length * 2 },
        ],
      },
      {
        key: 'academic', title: 'Academic Staff', count: academicStaff,
        roles: [
          { title: 'Professors', count: Math.round(academicStaff * 0.18) },
          { title: 'Associate Professors', count: Math.round(academicStaff * 0.24) },
          { title: 'Assistant Professors', count: Math.round(academicStaff * 0.29) },
          { title: 'Lecturers', count: Math.round(academicStaff * 0.29) },
        ],
      },
      {
        key: 'assisting', title: 'Assisting Academic Staff', count: assistingAcademic,
        roles: [
          { title: 'Teaching Assistants', count: Math.round(assistingAcademic * 0.58) },
          { title: 'Demonstrators', count: Math.round(assistingAcademic * 0.42) },
        ],
      },
      {
        key: 'administrative', title: 'Administrative Staff', count: administrative,
        roles: [
          { title: 'Administrative Managers', count: Math.round(administrative * 0.08) },
          { title: 'Administrative Employees', count: Math.round(administrative * 0.52) },
          { title: 'Finance Staff', count: Math.round(administrative * 0.12) },
          { title: 'HR Staff', count: Math.round(administrative * 0.09) },
          { title: 'Technical / IT Staff', count: Math.round(administrative * 0.13) },
          { title: 'Other Administrative Personnel', count: Math.round(administrative * 0.06) },
        ],
      },
      {
        key: 'support', title: 'Support / Service Staff', count: support,
        roles: [
          { title: 'Cleaning Employees', count: Math.round(support * 0.36) },
          { title: 'Maintenance Employees', count: Math.round(support * 0.27) },
          { title: 'Security Employees', count: Math.round(support * 0.27) },
          { title: 'Other Support Employees', count: Math.round(support * 0.10) },
        ],
      },
    ],
    total: leadership + facultyLeadership + academicStaff + assistingAcademic + administrative + support,
  };
}

export function universityHrKpis(yearIndex) {
  const h = universityHierarchy(yearIndex);
  const academic = h.tiers.find((t) => t.key === 'academic').count;
  const assisting = h.tiers.find((t) => t.key === 'assisting').count;
  const administrative = h.tiers.find((t) => t.key === 'administrative').count;
  const support = h.tiers.find((t) => t.key === 'support').count;

  return [
    { label: 'Total University Employees', value: h.total.toLocaleString() },
    { label: 'Academic Staff', value: academic.toLocaleString() },
    { label: 'Assisting Academic Staff', value: assisting.toLocaleString() },
    { label: 'Administrative Employees', value: administrative.toLocaleString() },
    { label: 'Support Employees', value: support.toLocaleString() },
    { label: 'Vacancies', value: Math.round(h.total * 0.034).toLocaleString() },
    { label: 'Staff Turnover', value: `${round1(3.1 + seededRange('turnover', -0.4, 0.6))}%` },
    { label: 'Average Years of Service', value: `${round1(9.5 + seededRange('yos', -1, 1.4))} yrs` },
    { label: 'Training Completion', value: `${Math.round(74 + seededRange('training', -3, 8))}%` },
    { label: 'Avg. Teaching Load', value: `${round1(14.2 + seededRange('load', -1.2, 1.6))} hrs/wk` },
  ];
}

export function facultyHrBreakdown(facultyId, yearIndex) {
  const fac = computeFacultyMetrics(facultyId, yearIndex);
  const academicStaff = Math.round(fac.enrollment / 17.5);
  const professors = Math.round(academicStaff * 0.18);
  const associate = Math.round(academicStaff * 0.24);
  const assistant = Math.round(academicStaff * 0.29);
  const lecturers = academicStaff - professors - associate - assistant;
  const ta = Math.round(academicStaff * 0.36);
  const demo = Math.round(academicStaff * 0.26);
  const admin = Math.round(fac.enrollment / 42);
  const technical = Math.round(fac.enrollment / 90);
  const cleaning = Math.round(fac.enrollment / 130);
  const maintenance = Math.round(fac.enrollment / 160);

  const rows = [
    { title: 'Dean', count: 1 },
    { title: 'Vice Deans', count: 2 },
    { title: 'Professors', count: professors },
    { title: 'Associate Professors', count: associate },
    { title: 'Assistant Professors', count: assistant },
    { title: 'Lecturers', count: lecturers },
    { title: 'Teaching Assistants', count: ta },
    { title: 'Demonstrators', count: demo },
    { title: 'Administrative Employees', count: admin },
    { title: 'Technical Employees', count: technical },
    { title: 'Cleaning Employees', count: cleaning },
    { title: 'Maintenance Employees', count: maintenance },
  ];
  const total = rows.reduce((s, r) => s + r.count, 0);

  const ageDistribution = [
    { bucket: '25–34', pct: Math.round(22 + seededRange(`${facultyId}-age1`, -3, 4)) },
    { bucket: '35–44', pct: Math.round(31 + seededRange(`${facultyId}-age2`, -3, 4)) },
    { bucket: '45–54', pct: Math.round(28 + seededRange(`${facultyId}-age3`, -3, 4)) },
    { bucket: '55+', pct: 0 },
  ];
  ageDistribution[3].pct = Math.max(6, 100 - ageDistribution.slice(0, 3).reduce((s, a) => s + a.pct, 0));

  const yearsOfService = [
    { bucket: '0–5 yrs', pct: Math.round(26 + seededRange(`${facultyId}-yos1`, -4, 4)) },
    { bucket: '6–10 yrs', pct: Math.round(24 + seededRange(`${facultyId}-yos2`, -4, 4)) },
    { bucket: '11–20 yrs', pct: Math.round(30 + seededRange(`${facultyId}-yos3`, -4, 4)) },
    { bucket: '20+ yrs', pct: 0 },
  ];
  yearsOfService[3].pct = Math.max(8, 100 - yearsOfService.slice(0, 3).reduce((s, a) => s + a.pct, 0));

  const genderSplit = [
    { name: 'Female', value: Math.round(41 + seededRange(`${facultyId}-gender`, -8, 12)) },
    { name: 'Male', value: 0 },
  ];
  genderSplit[1].value = 100 - genderSplit[0].value;

  const staffingTrend = [0, 1, 2, 3, 4].map((yi) => ({
    year: ['2022/23', '2023/24', '2024/25', '2025/26', '2026/27'][yi],
    headcount: Math.round(Math.round(computeFacultyMetrics(facultyId, yi).enrollment / 17.5) * 1.9),
  }));

  return {
    rows: rows.map((r) => ({ ...r, pct: round1((r.count / total) * 100) })),
    total,
    rankDistribution: [
      { name: 'Professors', value: professors },
      { name: 'Associate Professors', value: associate },
      { name: 'Assistant Professors', value: assistant },
      { name: 'Lecturers', value: lecturers },
    ],
    ageDistribution, yearsOfService, genderSplit, staffingTrend,
    avgWorkload: fac.workload,
  };
}

// HR ↔ Finance link — personnel expenditure for a faculty
export function facultyPersonnelFinance(facultyId, yearIndex) {
  const hr = facultyHrBreakdown(facultyId, yearIndex);
  const fac = computeFacultyMetrics(facultyId, yearIndex);
  const avgAcademicCost = 640000; // EGP / year, illustrative
  const avgAdminCost = 210000;
  const avgSupportCost = 130000;

  const academicCount = hr.rows.filter((r) => ['Dean', 'Vice Deans', 'Professors', 'Associate Professors', 'Assistant Professors', 'Lecturers', 'Teaching Assistants', 'Demonstrators'].includes(r.title)).reduce((s, r) => s + r.count, 0);
  const adminCount = hr.rows.filter((r) => ['Administrative Employees', 'Technical Employees'].includes(r.title)).reduce((s, r) => s + r.count, 0);
  const supportCount = hr.rows.filter((r) => ['Cleaning Employees', 'Maintenance Employees'].includes(r.title)).reduce((s, r) => s + r.count, 0);

  const academicCost = academicCount * avgAcademicCost;
  const adminCost = adminCount * avgAdminCost;
  const supportCost = supportCount * avgSupportCost;
  const totalPersonnelBudget = Math.round((academicCost + adminCost + supportCost) * 1.08);
  const executed = totalPersonnelBudget * (fac.budgetExec / 100);

  return {
    totalEmployees: hr.total,
    personnelBudget: totalPersonnelBudget,
    executed: Math.round(executed),
    executionPct: fac.budgetExec,
    avgCost: Math.round((academicCost + adminCost + supportCost) / hr.total),
    academicCost, adminCost, supportCost,
  };
}

function round1(v) { return Math.round(v * 10) / 10; }
