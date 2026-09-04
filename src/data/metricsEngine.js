import { seededRange } from './seed';
import { asuFaculties, facultyBaseEnrollment, facultyDepartments } from './asuFaculties';
import { academicYears, yearById } from './academicYears';

export { yearById };

// University-wide baseline curves across the 5 academic years (index 0..4).
// These anchor every faculty's trend so improvements look coherent rather than random.
const UNIV = {
  enrollment: [161200, 166900, 171050, 172860, 178420],
  retention: [85.1, 86.9, 88.4, 89.5, 91.4],
  graduation: [71.0, 73.2, 75.1, 75.4, 78.6],
  research: [61.4, 67.8, 73.5, 77.5, 84.2],
  budgetExec: [77.0, 79.0, 80.5, 81.5, 82.4],
};

function facultyOffset(facultyId, key, spread) {
  // stable per-faculty offset so a faculty's relative ranking is consistent across years
  return (seededRange(`${facultyId}-${key}-offset`, -1, 1)) * spread;
}

export function computeFacultyMetrics(facultyId, yearIndex) {
  const faculty = asuFaculties.find((f) => f.id === facultyId);
  if (!faculty) return computeAllMetrics(yearIndex);

  const enrollmentRatio = UNIV.enrollment[yearIndex] / UNIV.enrollment[UNIV.enrollment.length - 1];
  const baseEnrollment = facultyBaseEnrollment(facultyId);
  const enrollment = Math.round(baseEnrollment * enrollmentRatio * (1 + seededRange(`${facultyId}-${yearIndex}-enrj`, -0.02, 0.02)));

  const retention = clamp(UNIV.retention[yearIndex] + facultyOffset(facultyId, 'retention', 5.5), 78, 98);
  const graduation = clamp(UNIV.graduation[yearIndex] + facultyOffset(facultyId, 'graduation', 6), 65, 96);
  const research = clamp(UNIV.research[yearIndex] * (faculty.baseResearch / 75), 35, 99);
  const budgetExec = clamp(UNIV.budgetExec[yearIndex] + (faculty.baseBudget - 80) * 0.55 + facultyOffset(facultyId, 'budget', 2), 62, 96);

  const riskRate = clamp(0.018 + (95 - retention) * 0.0075, 0.006, 0.09);
  const riskStudents = Math.round(enrollment * riskRate);

  const classroomUtil = Math.round(clamp(58 + facultyOffset(facultyId, 'util', 20) + yearIndex * 1.6, 45, 96));
  const workload = Math.round((16 + facultyOffset(facultyId, 'workload', 9) + yearIndex * 0.3) * 10) / 10;

  return {
    id: facultyId, name: faculty.name, enrollment, retention: round1(retention), graduation: round1(graduation),
    research: round1(research), budgetExec: round1(budgetExec), riskStudents, classroomUtil, workload,
  };
}

export function computeAllMetrics(yearIndex) {
  const rows = asuFaculties.map((f) => computeFacultyMetrics(f.id, yearIndex));
  const totalEnrollment = rows.reduce((s, r) => s + r.enrollment, 0);
  const wavg = (key) => rows.reduce((s, r) => s + r[key] * r.enrollment, 0) / totalEnrollment;
  const avg = (key) => rows.reduce((s, r) => s + r[key], 0) / rows.length;

  return {
    id: 'all', name: 'All Faculties',
    enrollment: totalEnrollment,
    retention: round1(wavg('retention')),
    graduation: round1(wavg('graduation')),
    research: round1(avg('research')),
    budgetExec: round1(wavg('budgetExec')),
    riskStudents: rows.reduce((s, r) => s + r.riskStudents, 0),
    classroomUtil: Math.round(wavg('classroomUtil')),
    workload: round1(avg('workload')),
  };
}

export function computeMetrics(facultyId, yearIndex) {
  return facultyId === 'all' ? computeAllMetrics(yearIndex) : computeFacultyMetrics(facultyId, yearIndex);
}

export function trendSeries(facultyId) {
  return academicYears.map((y) => ({
    year: y.label.replace(' / ', '/'),
    projection: y.projection,
    ...computeMetrics(facultyId, y.index),
  }));
}

export function facultyRows(yearIndex) {
  return asuFaculties.map((f) => computeFacultyMetrics(f.id, yearIndex));
}

export function departmentRows(facultyId, yearIndex) {
  const facMetrics = computeFacultyMetrics(facultyId, yearIndex);
  const depts = facultyDepartments[facultyId] || [];
  const totalWeight = depts.reduce((s, d) => s + d.weight, 0) || 1;
  return depts.map((d) => {
    const share = d.weight / totalWeight;
    return {
      id: d.id, name: d.name,
      enrollment: Math.round(facMetrics.enrollment * share),
      retention: round1(clamp(facMetrics.retention + facultyOffset(`${facultyId}-${d.id}`, 'dret', 3), 65, 99)),
      graduation: round1(clamp(facMetrics.graduation + facultyOffset(`${facultyId}-${d.id}`, 'dgrad', 3), 60, 98)),
      research: round1(clamp(facMetrics.research + facultyOffset(`${facultyId}-${d.id}`, 'dres', 6), 30, 99)),
    };
  });
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function round1(v) { return Math.round(v * 10) / 10; }

// ---- Heat Map 2: Academic Performance (GPA, pass rate, attendance) ----
export function computeAcademicQuality(facultyId, yearIndex) {
  const m = computeFacultyMetrics(facultyId, yearIndex);
  const avgGPA = round1(clamp(2.6 + (m.retention - 85) * 0.03 + facultyOffset(facultyId, 'gpa', 0.25), 2.2, 3.9));
  const passRate = round1(clamp(m.graduation + 6 + facultyOffset(facultyId, 'pass', 4), 70, 98));
  const attendance = round1(clamp(80 + facultyOffset(facultyId, 'attend', 9) + yearIndex * 0.6, 68, 98));
  return { ...m, avgGPA, passRate, attendance };
}

// ---- Heat Map 4: Resource / Operational Utilization ----
export function computeResourceUtilization(facultyId, yearIndex) {
  const m = computeFacultyMetrics(facultyId, yearIndex);
  const labUtil = Math.round(clamp(m.classroomUtil - 6 + facultyOffset(facultyId, 'lab', 12), 30, 97));
  const staffUtil = Math.round(clamp(70 + facultyOffset(facultyId, 'staffutil', 16) + yearIndex * 1.2, 45, 98));
  const facilityUtil = Math.round(clamp((m.classroomUtil + labUtil) / 2 + facultyOffset(facultyId, 'facility', 6), 35, 97));
  return {
    ...m,
    classroomUtil: m.classroomUtil, labUtil, staffUtil, budgetUtil: m.budgetExec, facilityUtil,
  };
}

// ---- Heat Map 3: composite Overall Performance Index, for trend-by-year comparison ----
export function overallPerformanceIndex(facultyId, yearIndex) {
  const m = computeFacultyMetrics(facultyId, yearIndex);
  return round1((m.retention + m.graduation + m.research + m.budgetExec) / 4);
}

export function enrollmentGrowth(facultyId, yearIndex) {
  if (yearIndex === 0) return 0;
  const cur = computeFacultyMetrics(facultyId, yearIndex).enrollment;
  const prev = computeFacultyMetrics(facultyId, yearIndex - 1).enrollment;
  return round1(((cur - prev) / prev) * 100);
}
