import { seededRange } from './seed';
import { computeFacultyMetrics } from './metricsEngine';

export const alumniCohorts = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

export function facultyAlumniSummary(facultyId, yearIndex) {
  const fac = computeFacultyMetrics(facultyId, yearIndex);
  const totalAlumni = Math.round(fac.enrollment * 3.6);

  const employed = clamp(fac.graduation - 5 + seededRange(`${facultyId}-emp`, -3, 5), 60, 94);
  const further = clamp(10 + seededRange(`${facultyId}-further`, -3, 4), 3, 18);
  const entrepreneur = clamp(5 + seededRange(`${facultyId}-entre`, -2, 3), 1, 10);
  const seeking = clamp(100 - employed - further - entrepreneur, 0, 20);

  return {
    totalAlumni,
    employmentRate: round1(employed),
    furtherStudies: round1(further),
    entrepreneurship: round1(entrepreneur),
    seekingEmployment: round1(seeking),
    satisfaction: round1(clamp(76 + seededRange(`${facultyId}-sat`, -6, 10), 55, 96)),
    engagement: round1(clamp(38 + seededRange(`${facultyId}-eng`, -8, 14), 15, 70)),
    donations: Math.round(totalAlumni * seededRange(`${facultyId}-don`, 8, 40)),
    geographic: [
      { region: 'Greater Cairo', pct: Math.round(52 + seededRange(`${facultyId}-g1`, -6, 6)) },
      { region: 'Other Egypt Governorates', pct: Math.round(28 + seededRange(`${facultyId}-g2`, -5, 5)) },
      { region: 'Gulf & MENA', pct: Math.round(13 + seededRange(`${facultyId}-g3`, -4, 4)) },
      { region: 'International (Other)', pct: 0 },
    ].map((r, i, arr) => (i === arr.length - 1 ? { ...r, pct: Math.max(2, 100 - arr.slice(0, -1).reduce((s, a) => s + a.pct, 0)) } : r)),
  };
}

export function cohortEmploymentByFaculty(facultyId, cohort) {
  const seed = `${facultyId}-${cohort}`;
  const employed = clamp(72 + seededRange(seed + 'e', -8, 14), 55, 95);
  const further = clamp(9 + seededRange(seed + 'f', -3, 5), 2, 18);
  const entrepreneur = clamp(4 + seededRange(seed + 'x', -2, 3), 1, 9);
  const seeking = clamp(100 - employed - further - entrepreneur, 0, 20);
  return { cohort, employed: round1(employed), further: round1(further), entrepreneur: round1(entrepreneur), seeking: round1(seeking) };
}

export const alumniInsight = {
  title: 'Alumni Insight',
  text: 'Graduates from selected programs show increasing employment in emerging technology sectors.',
};

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function round1(v) { return Math.round(v * 10) / 10; }
