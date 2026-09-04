export const academicYears = [
  { id: '2022-2023', label: '2022 / 2023', index: 0, projection: false },
  { id: '2023-2024', label: '2023 / 2024', index: 1, projection: false },
  { id: '2024-2025', label: '2024 / 2025', index: 2, projection: false },
  { id: '2025-2026', label: '2025 / 2026', index: 3, projection: false },
  { id: '2026-2027', label: '2026 / 2027', index: 4, projection: true },
];

export const defaultYearId = '2026-2027';

export function yearById(yearId) {
  return academicYears.find((y) => y.id === yearId) || academicYears[academicYears.length - 1];
}
