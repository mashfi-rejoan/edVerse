export type UserRole = 'admin' | 'student' | 'teacher' | 'moderator' | 'cafeteria-manager' | 'librarian';

export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F';

export interface GradeBand {
  minPercent: number;
  maxPercent: number | null;
  letter: LetterGrade;
  gpa: number;
}

export const GRADE_RUBRIC: GradeBand[] = [
  { minPercent: 80, maxPercent: null, letter: 'A+', gpa: 4.0 },
  { minPercent: 75, maxPercent: 80, letter: 'A', gpa: 3.75 },
  { minPercent: 70, maxPercent: 75, letter: 'A-', gpa: 3.5 },
  { minPercent: 65, maxPercent: 70, letter: 'B+', gpa: 3.25 },
  { minPercent: 60, maxPercent: 65, letter: 'B', gpa: 3.0 },
  { minPercent: 55, maxPercent: 60, letter: 'B-', gpa: 2.75 },
  { minPercent: 50, maxPercent: 55, letter: 'C+', gpa: 2.5 },
  { minPercent: 45, maxPercent: 50, letter: 'C', gpa: 2.25 },
  { minPercent: 40, maxPercent: 45, letter: 'D', gpa: 2.0 },
  { minPercent: 0, maxPercent: 40, letter: 'F', gpa: 0 }
];

export interface AttendanceBand {
  minPercent: number;
  maxPercent: number;
  marks: number;
}

export const ATTENDANCE_MARKS: AttendanceBand[] = [
  { minPercent: 91, maxPercent: 100, marks: 5 },
  { minPercent: 86, maxPercent: 90, marks: 4 },
  { minPercent: 81, maxPercent: 85, marks: 3 },
  { minPercent: 76, maxPercent: 80, marks: 2 },
  { minPercent: 70, maxPercent: 75, marks: 1 }
];

export const getGradeFromPercent = (percent: number): GradeBand => {
  const bounded = Math.max(0, Math.min(100, percent));
  const band = GRADE_RUBRIC.find(({ minPercent, maxPercent }) => {
    const aboveMin = bounded >= minPercent;
    const belowMax = maxPercent === null ? true : bounded < maxPercent;
    return aboveMin && belowMax;
  });
  return band ?? GRADE_RUBRIC[GRADE_RUBRIC.length - 1];
};

export const getAttendanceMarks = (percent: number): number => {
  const bounded = Math.max(0, Math.min(100, percent));
  const band = ATTENDANCE_MARKS.find(({ minPercent, maxPercent }) => bounded >= minPercent && bounded <= maxPercent);
  return band ? band.marks : 0;
};
