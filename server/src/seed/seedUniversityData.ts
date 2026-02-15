import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import mongoose from 'mongoose';
import User from '../models/User';
import Teacher from '../models/Teacher';
import Student from '../models/Student';

const { Course } = require('../database/courseSchema');

dotenv.config();

const BASE_URL = process.env.SEED_BASE_URL || 'http://localhost:4000';
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/edverse';

const DEPARTMENTS = [
  { code: 'CSE', deptId: '1' },
  { code: 'EEE', deptId: '2' },
  { code: 'CE', deptId: '3' }
];

const SPRING_PLAN = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];
const FALL_PLAN = ['1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];

const COHORTS = [
  { year: 2022, term: 'Spring', count: 38 },
  { year: 2022, term: 'Fall', count: 37 },
  { year: 2023, term: 'Spring', count: 38 },
  { year: 2023, term: 'Fall', count: 37 },
  { year: 2024, term: 'Spring', count: 38 },
  { year: 2024, term: 'Fall', count: 37 },
  { year: 2025, term: 'Spring', count: 38 },
  { year: 2025, term: 'Fall', count: 37 }
];

const FIRST_NAMES = ['Amin', 'Nadia', 'Rafi', 'Rina', 'Sadia', 'Tahmid', 'Imran', 'Nusrat', 'Hasan', 'Mehedi', 'Sabbir', 'Farzana', 'Sami', 'Anika', 'Arif', 'Tanvir', 'Fahim', 'Ritu', 'Ishrat', 'Sakib'];
const LAST_NAMES = ['Hossain', 'Rahman', 'Ahmed', 'Chowdhury', 'Khan', 'Islam', 'Sarker', 'Das', 'Roy', 'Saha', 'Miah', 'Talukder', 'Kabir', 'Noman', 'Jahan'];

const DESIGNATIONS = ['Lecturer', 'Assistant Professor', 'Associate Professor', 'Senior Lecturer', 'Professor'] as const;

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const makeName = (index: number) => {
  const first = FIRST_NAMES[index % FIRST_NAMES.length];
  const last = LAST_NAMES[(index * 3) % LAST_NAMES.length];
  return `${first} ${last}`;
};

const makePhone = (index: number) => `+8801${(700000000 + index).toString().slice(0, 9)}`;

const makeEmail = (prefix: string, id: string) => `${prefix}.${id}@edverse.edu`;

const admissionDateFor = (year: number, term: string) => {
  return term === 'Spring' ? `${year}-02-05` : `${year}-09-05`;
};

const nextTerm = (term: string) => (term === 'Spring' ? 'Fall' : 'Spring');

const getTermByOffset = (year: number, term: string, offset: number) => {
  let currentYear = year;
  let currentTerm = term;
  for (let i = 0; i < offset; i += 1) {
    currentTerm = nextTerm(currentTerm);
    if (currentTerm === 'Spring') {
      currentYear += 1;
    }
  }
  return { academicYear: String(currentYear), semester: currentTerm };
};

const getPlanKey = (startTerm: string, offset: number) => {
  if (startTerm === 'Spring') {
    return SPRING_PLAN[offset] || null;
  }
  return FALL_PLAN[offset] || null;
};

const gradeFromScore = (score: number) => {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  if (score >= 45) return 'D+';
  if (score >= 40) return 'D';
  return 'F';
};

const scoreForStudent = (index: number) => {
  const base = 55 + (index % 35);
  return Math.min(95, base + Math.floor(Math.random() * 6));
};

const ensureAdminUsers = async () => {
  await User.deleteMany({});
  await Teacher.deleteMany({});
  await Student.deleteMany({});

  const admins = [
    { name: 'System Administrator', email: 'admin@edverse.edu', universityId: 'A-0001', password: 'admin123', role: 'admin', isActive: true },
    { name: 'Academic Admin', email: 'academic.admin@edverse.edu', universityId: 'A-0002', password: 'admin123', role: 'admin', isActive: true }
  ];

  for (const admin of admins) {
    const user = new User(admin);
    await user.save();
  }
};

const loginAdmin = async () => {
  const response = await axios.post(`${BASE_URL}/api/auth/login`, {
    username: 'admin@edverse.edu',
    password: 'admin123'
  });
  return response.data.accessToken as string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const postWithRetry = async (api: any, url: string, data: any, attempts = 5) => {
  let lastError: any = null;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await api.post(url, data);
    } catch (error: any) {
      lastError = error;
      if (error?.response?.status === 429 && i < attempts - 1) {
        await sleep(800 * (i + 1));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

const main = async () => {
  await mongoose.connect(MONGODB_URI);
  await mongoose.connection.db.dropDatabase();
  await ensureAdminUsers();
  await mongoose.connection.close();

  const courseSeed = path.resolve(__dirname, '..', 'seedCourses.js');
  if (fs.existsSync(courseSeed)) {
    execSync(`node "${courseSeed}"`, { stdio: 'inherit' });
  }

  await mongoose.connect(MONGODB_URI);
  const courses = await Course.find({});
  await mongoose.connection.close();

  const courseMap = new Map<string, any[]>();
  courses.forEach((course: any) => {
    const key = `${course.level || 1}-${course.term || 1}`;
    if (!courseMap.has(key)) {
      courseMap.set(key, []);
    }
    courseMap.get(key)!.push(course);
  });

  const token = await loginAdmin();
  const api = axios.create({
    baseURL: `${BASE_URL}/api/admin`,
    headers: { Authorization: `Bearer ${token}` }
  });

  const teacherCredentials: string[] = ['teacherId,name,email,password,department,designation,joinDate'];
  const studentCredentials: string[] = ['studentId,name,email,password,department,batch,section,admissionTerm'];

  const teacherByDept: Record<string, any[]> = { CSE: [], EEE: [], CE: [] };
  const teachers: any[] = [];

  const teacherPayloads: any[] = [];
  for (let i = 0; i < 50; i += 1) {
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const name = makeName(i + 1);
    const email = makeEmail('teacher', `${i + 1}`);
    const phone = makePhone(1000 + i);
    const designation = DESIGNATIONS[i % DESIGNATIONS.length];
    const joinYear = 2022 + (i % 4);
    const joinTerm = i % 2 === 0 ? 'Spring' : 'Fall';
    const dateOfJoining = joinTerm === 'Spring' ? `${joinYear}-02-10` : `${joinYear}-09-10`;
    const password = `edverse@${phone.replace(/\D/g, '').slice(-6)}`;

    const payload = {
      name,
      email,
      phone,
      deptId: dept.deptId,
      department: dept.code,
      designation,
      specialization: 'Computer Science',
      status: 'Active',
      dateOfJoining,
      password
    };

    teacherPayloads.push(payload);
  }

  const teacherResponse = await postWithRetry(api, '/teachers/bulk', { teachers: teacherPayloads });
  const createdTeachers = teacherResponse.data.data || [];
  createdTeachers.forEach((teacher: any, index: number) => {
    const payload = teacherPayloads[index];
    teachers.push(teacher);
    teacherByDept[payload.department].push(teacher);
    teacherCredentials.push(`${teacher.universityId},${payload.name},${payload.email},${payload.password},${payload.department},${payload.designation},${payload.dateOfJoining}`);
  });

  const students: any[] = [];
  const cohortStudents: Record<string, any[]> = {};

  let studentIndex = 0;
  const studentPayloads: any[] = [];
  for (const cohort of COHORTS) {
    const cohortKey = `${cohort.year}-${cohort.term}`;
    cohortStudents[cohortKey] = [];
    for (let i = 0; i < cohort.count; i += 1) {
      const dept = DEPARTMENTS[(studentIndex + i) % DEPARTMENTS.length];
      const name = makeName(200 + studentIndex + i);
      const email = makeEmail('student', `${cohort.year}${cohort.term}${i + 1}`.replace(/\s+/g, ''));
      const phone = makePhone(5000 + studentIndex + i);
      const section = ['A', 'B', 'C'][i % 3];
      const password = `edverse@${phone.replace(/\D/g, '').slice(-6)}`;
      const admissionDate = admissionDateFor(cohort.year, cohort.term);

      const startIndex = (cohort.year - 2022) * 2 + (cohort.term === 'Fall' ? 1 : 0);
      const currentIndex = (2026 - 2022) * 2;
      const semesterNumber = Math.min(8, Math.max(1, currentIndex - startIndex + 1));

      const payload = {
        name,
        email,
        phone,
        deptId: dept.deptId,
        batch: String(cohort.year),
        section,
        semester: semesterNumber,
        status: 'Active',
        bloodGroup: ['A+', 'B+', 'O+', 'AB+'][i % 4],
        admissionDate,
        password
      };
      studentPayloads.push({ payload, cohortKey, deptCode: dept.code, admissionTerm: cohort.term });
    }
    studentIndex += cohort.count;
  }

  const studentResponse = await postWithRetry(api, '/students/bulk', { students: studentPayloads.map((item) => item.payload) });
  const createdStudents = studentResponse.data.data || [];
  createdStudents.forEach((student: any, index: number) => {
    const meta = studentPayloads[index];
    students.push(student);
    cohortStudents[meta.cohortKey].push(student);
    studentCredentials.push(`${student.universityId},${meta.payload.name},${meta.payload.email},${meta.payload.password},${meta.deptCode},${meta.payload.batch},${meta.payload.section},${meta.admissionTerm}`);
  });

  const sectionMap = new Map<string, { id: string; enrolled: string[]; teacher: any }>();

  const createSectionIfMissing = async (courseCode: string, section: string, semester: string, academicYear: string, teacher: any) => {
    const key = `${courseCode}-${section}-${semester}-${academicYear}`;
    if (sectionMap.has(key)) return sectionMap.get(key)!;

    const response = await api.post('/sections', {
      courseCode,
      section,
      semester,
      academicYear,
      assignedTeacher: teacher._id,
      enrolledStudents: [],
      maxCapacity: 60,
      schedule: [
        { day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Room 101' }
      ]
    });

    const created = response.data.data;
    const entry = { id: created._id, enrolled: [], teacher };
    sectionMap.set(key, entry);
    return entry;
  };

  const registrationApi = axios.create({
    baseURL: `${BASE_URL}/api/admin/registrations`,
    headers: { Authorization: `Bearer ${token}` }
  });

  const marksApi = axios.create({ baseURL: `${BASE_URL}/api/marks` });

  const currentYear = 2026;
  const currentTerm = 'Spring';
  const currentIndex = (currentYear - 2022) * 2;

  for (const cohort of COHORTS) {
    const cohortKey = `${cohort.year}-${cohort.term}`;
    const cohortList = cohortStudents[cohortKey];
    const startIndex = (cohort.year - 2022) * 2 + (cohort.term === 'Fall' ? 1 : 0);
    const completedTerms = Math.max(0, Math.min(8, currentIndex - startIndex));
    const planLength = cohort.term === 'Spring' ? SPRING_PLAN.length : FALL_PLAN.length;

    for (let offset = 0; offset < completedTerms; offset += 1) {
      const planKey = getPlanKey(cohort.term, offset);
      if (!planKey) continue;
      const [level, term] = planKey.split('-').map(Number);
      const termCourses = courseMap.get(`${level}-${term}`) || [];
      const termInfo = getTermByOffset(cohort.year, cohort.term, offset);

      const registrations: any[] = [];

      for (const course of termCourses) {
        const teacherPool = teacherByDept[course.department] || teachers;
        const teacher = teacherPool[offset % teacherPool.length];

        for (const student of cohortList) {
          const score = scoreForStudent(offset + Number(student._id.toString().slice(-2)));
          const grade = gradeFromScore(score);
          registrations.push({
            studentId: student._id,
            courseCode: course.courseCode,
            section: student.section || 'A',
            semester: termInfo.semester,
            academicYear: termInfo.academicYear,
            status: 'Completed',
            grade,
            totalMarks: score,
            completedDate: `${termInfo.academicYear}-${termInfo.semester === 'Spring' ? '06' : '12'}-15`
          });
        }

        const sectionEntry = await createSectionIfMissing(course.courseCode, cohortList[0]?.section || 'A', termInfo.semester, termInfo.academicYear, teacher);
        sectionEntry.enrolled.push(...cohortList.map((s) => s._id.toString()));

        await postWithRetry(marksApi, '/', {
          courseCode: course.courseCode,
          courseName: course.courseName,
          section: cohortList[0]?.section || 'A',
          teacherId: teacher.universityId,
          teacherName: teacher.name,
          evaluationType: 'final',
          maxMarks: 100,
          records: cohortList.map((student: any, idx: number) => {
            const score = scoreForStudent(offset + idx);
            return {
              studentId: student.universityId,
              studentName: student.name,
              marksObtained: score,
              percentage: score
            };
          }),
          statistics: {
            totalStudents: cohortList.length,
            totalEntered: cohortList.length,
            average: 75,
            highest: 96,
            lowest: 45,
            passCount: Math.floor(cohortList.length * 0.9),
            passRate: 90
          }
        });
      }

      if (registrations.length > 0) {
        await postWithRetry(registrationApi, '/bulk', { registrations });
      }
    }

    if (completedTerms >= planLength) {
      for (const student of cohortList) {
        await api.put(`/students/${student._id}`, { status: 'Graduated' });
      }
    }

    if (currentIndex >= startIndex) {
      const activeOffset = Math.min(7, completedTerms);
      const activePlanKey = getPlanKey(cohort.term, activeOffset);
      if (activePlanKey) {
        const [level, term] = activePlanKey.split('-').map(Number);
        const termCourses = courseMap.get(`${level}-${term}`) || [];
        const termInfo = getTermByOffset(cohort.year, cohort.term, activeOffset);

        const activeRegistrations: any[] = [];

        for (const course of termCourses) {
          const teacherPool = teacherByDept[course.department] || teachers;
          const teacher = teacherPool[activeOffset % teacherPool.length];

          for (const student of cohortList) {
            activeRegistrations.push({
              studentId: student._id,
              courseCode: course.courseCode,
              section: student.section || 'A',
              semester: termInfo.semester,
              academicYear: termInfo.academicYear,
              status: 'Active'
            });
          }

          const sectionEntry = await createSectionIfMissing(course.courseCode, cohortList[0]?.section || 'A', termInfo.semester, termInfo.academicYear, teacher);
          sectionEntry.enrolled.push(...cohortList.map((s) => s._id.toString()));

          await postWithRetry(marksApi, '/', {
            courseCode: course.courseCode,
            courseName: course.courseName,
            section: cohortList[0]?.section || 'A',
            teacherId: teacher.universityId,
            teacherName: teacher.name,
            evaluationType: 'mid',
            maxMarks: 50,
            records: cohortList.map((student: any, idx: number) => {
              const score = Math.min(50, Math.floor(scoreForStudent(activeOffset + idx) / 2));
              return {
                studentId: student.universityId,
                studentName: student.name,
                marksObtained: score,
                percentage: (score / 50) * 100
              };
            }),
            statistics: {
              totalStudents: cohortList.length,
              totalEntered: cohortList.length,
              average: 35,
              highest: 48,
              lowest: 18,
              passCount: Math.floor(cohortList.length * 0.9),
              passRate: 90
            }
          });
        }

        if (activeRegistrations.length > 0) {
          await postWithRetry(registrationApi, '/bulk', { registrations: activeRegistrations });
        }
      }
    }
  }

  for (const entry of sectionMap.values()) {
    await api.put(`/sections/${entry.id}`, {
      enrolledStudents: Array.from(new Set(entry.enrolled))
    });
  }

  const outputDir = path.resolve(process.cwd(), 'seed-output');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'teacher-credentials.csv'), teacherCredentials.join('\n'));
  fs.writeFileSync(path.join(outputDir, 'student-credentials.csv'), studentCredentials.join('\n'));

  const spring2022Teacher = teacherCredentials[1] || '';
  const spring2022Student = studentCredentials.find((line) => line.includes(',2022,')) || '';

  console.log('Seeding complete.');
  console.log('Spring 2022 teacher:', spring2022Teacher);
  console.log('Spring 2022 student:', spring2022Student);
};

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
