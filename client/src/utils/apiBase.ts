
const rawBase = import.meta.env.VITE_API_URL || '';
const API_BASE = rawBase.replace(/\/$/, '');

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
};

// --- Course Management API functions ---
export async function getSemesterCourses(semesterId: string, studentId?: string) {
  const url = apiUrl(`/courses/semester/${semesterId}`) + (studentId ? `?studentId=${studentId}` : '');
  const res = await fetch(url);
  return res.json();
}

export async function addCourse(studentId: string, courseId: string, semesterId: string) {
  const res = await fetch(apiUrl('/courses/add'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, courseId, semesterId })
  });
  return res.json();
}

export async function dropCourse(studentId: string, courseId: string, semesterId: string) {
  const res = await fetch(apiUrl('/courses/drop'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, courseId, semesterId })
  });
  return res.json();
}

export async function retakeCourse(studentId: string, courseId: string, semesterId: string) {
  const res = await fetch(apiUrl('/courses/retake'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, courseId, semesterId })
  });
  return res.json();
}

export async function getEnrollmentHistory(studentId: string) {
  const res = await fetch(apiUrl(`/courses/history/${studentId}`));
  return res.json();
}

export async function getCourseCapacity(courseId: string, semesterId: string) {
  const res = await fetch(apiUrl(`/courses/capacity/${courseId}/${semesterId}`));
  return res.json();
}
