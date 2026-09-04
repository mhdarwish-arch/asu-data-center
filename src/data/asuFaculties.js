import { seededRange } from './seed';

// Official Ain Shams University faculties (reference: asu.edu.eg/45/page/asu-faculties).
// Baseline metrics are illustrative starting points for the demo data engine —
// larger, older faculties get a bigger enrollment base; more clinical/technical
// faculties get a higher baseline research index. All numbers are fictional.
export const asuFaculties = [
  { id: 'medicine', name: 'Faculty of Medicine', size: 'large', baseResearch: 90, baseBudget: 88 },
  { id: 'engineering', name: 'Faculty of Engineering', size: 'large', baseResearch: 86, baseBudget: 84 },
  { id: 'commerce', name: 'Faculty of Business', size: 'xlarge', baseResearch: 66, baseBudget: 83 },
  { id: 'arts', name: 'Faculty of Arts', size: 'large', baseResearch: 58, baseBudget: 75 },
  { id: 'education', name: 'Faculty of Education', size: 'large', baseResearch: 55, baseBudget: 76 },
  { id: 'law', name: 'Faculty of Law', size: 'medium', baseResearch: 61, baseBudget: 80 },
  { id: 'science', name: 'Faculty of Science', size: 'large', baseResearch: 80, baseBudget: 78 },
  { id: 'cis', name: 'Faculty of Computer and Information Sciences', size: 'medium', baseResearch: 89, baseBudget: 85 },
  { id: 'pharmacy', name: 'Faculty of Pharmacy', size: 'medium', baseResearch: 82, baseBudget: 81 },
  { id: 'dentistry', name: 'Faculty of Dentistry', size: 'medium', baseResearch: 78, baseBudget: 80 },
  { id: 'women', name: 'Faculty of Women', size: 'large', baseResearch: 60, baseBudget: 77 },
  { id: 'agriculture', name: 'Faculty of Agriculture', size: 'medium', baseResearch: 73, baseBudget: 78 },
  { id: 'alalsun', name: 'Faculty of Al-Alsun', size: 'medium', baseResearch: 54, baseBudget: 74 },
  { id: 'specific-education', name: 'Faculty of Specific Education', size: 'medium', baseResearch: 50, baseBudget: 73 },
  { id: 'veterinary', name: 'Faculty of Veterinary Medicine', size: 'small', baseResearch: 75, baseBudget: 79 },
  { id: 'nursing', name: 'Faculty of Nursing', size: 'medium', baseResearch: 62, baseBudget: 76 },
  { id: 'archaeology', name: 'Faculty of Archaeology', size: 'small', baseResearch: 57, baseBudget: 72 },
  { id: 'media', name: 'Faculty of Media and Mass Communication', size: 'small', baseResearch: 59, baseBudget: 75 },
];

const sizeEnrollment = { xlarge: 31000, large: 21000, medium: 13500, small: 7800 };

// Sample illustrative departments per faculty. Kept short for the demo —
// not an exhaustive academic catalog.
const deptTemplates = {
  medicine: ['Clinical Medicine', 'Surgery', 'Basic Medical Sciences'],
  engineering: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Architecture', 'Computer Engineering'],
  commerce: ['Accounting', 'Business Administration', 'Economics'],
  arts: ['Languages & Translation', 'History', 'Sociology', 'Geography'],
  education: ['Curriculum & Instruction', 'Educational Psychology', 'Special Education'],
  law: ['Public Law', 'Private Law'],
  science: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
  cis: ['Computer Science', 'Information Systems', 'AI & Data Science'],
  pharmacy: ['Pharmaceutics', 'Pharmacology', 'Pharmaceutical Chemistry'],
  dentistry: ['Oral Surgery', 'Orthodontics', 'Restorative Dentistry'],
  women: ["Women's Studies", 'Home Economics', 'Education (Women)'],
  agriculture: ['Agricultural Economics', 'Crop Science', 'Animal Production'],
  alalsun: ['English Language', 'French Language', 'Translation Studies'],
  'specific-education': ['Art Education', 'Music Education', 'Educational Technology'],
  veterinary: ['Veterinary Medicine', 'Animal Husbandry'],
  nursing: ['Medical-Surgical Nursing', 'Community Health Nursing'],
  archaeology: ['Egyptology', 'Islamic Archaeology'],
  media: ['Journalism', 'Public Relations', 'Broadcasting'],
};

export const facultyDepartments = Object.fromEntries(
  asuFaculties.map((f) => [
    f.id,
    (deptTemplates[f.id] || ['Department A', 'Department B']).map((name) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      weight: 0.7 + seededRange(`${f.id}-${name}-w`, 0, 0.6),
    })),
  ]),
);

export function facultyBaseEnrollment(facultyId) {
  const f = asuFaculties.find((x) => x.id === facultyId);
  if (!f) return 15000;
  const jitter = seededRange(`${facultyId}-enr`, 0.85, 1.15);
  return Math.round(sizeEnrollment[f.size] * jitter);
}

// Anonymized leadership placeholders (per project requirement — no real names)
export function anonDean(facultyId) {
  const titles = ['Prof. Name Name', 'Dr. Name Name'];
  return titles[Math.round(seededRange(`${facultyId}-dean`, 0, 1))];
}
export function anonVice(facultyId, i) {
  return ['Prof. Name Name', 'Dr. Name Name'][Math.round(seededRange(`${facultyId}-vice-${i}`, 0, 1))];
}
