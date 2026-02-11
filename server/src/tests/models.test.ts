import mongoose from 'mongoose';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import Course from '../models/Course';
import Section from '../models/Section';
import Enrollment from '../models/Enrollment';
import User from '../models/User';

describe('Database Model Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/edverse-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Course.deleteMany({});
    await Section.deleteMany({});
    await Enrollment.deleteMany({});
  });

  describe('Student Model', () => {
    it('should create a student with required fields', async () => {
      const user = await User.create({
        name: 'Test Student',
        email: 'student@test.com',
        password: 'password123',
        role: 'student'
      });

      const student = await Student.create({
        universityId: 'S-2024-001',
        userId: user._id,
        name: 'Test Student',
        email: 'student@test.com',
        batch: '2024',
        section: 'A',
        semester: 1
      });

      expect(student.universityId).toBe('S-2024-001');
      expect(student.cgpa).toBe(0);
      expect(student.status).toBe('Active');
      expect(student.academicStanding).toBe('Good');
    });

    it('should update academic standing based on CGPA', async () => {
      const user = await User.create({
        name: 'Test Student',
        email: 'student2@test.com',
        password: 'password123',
        role: 'student'
      });

      const student = await Student.create({
        universityId: 'S-2024-002',
        userId: user._id,
        name: 'Test Student',
        email: 'student2@test.com',
        batch: '2024',
        section: 'A',
        semester: 1,
        cgpa: 2.2
      });

      expect(student.academicStanding).toBe('Warning');

      student.cgpa = 1.8;
      await student.save();
      expect(student.academicStanding).toBe('Probation');
    });

    it('should fail without required fields', async () => {
      await expect(
        Student.create({
          name: 'Test Student',
          email: 'student3@test.com'
        })
      ).rejects.toThrow();
    });
  });

  describe('Teacher Model', () => {
    it('should create a teacher with required fields', async () => {
      const user = await User.create({
        name: 'Test Teacher',
        email: 'teacher@test.com',
        password: 'password123',
        role: 'teacher'
      });

      const teacher = await Teacher.create({
        universityId: 'T-2024-001',
        userId: user._id,
        name: 'Test Teacher',
        email: 'teacher@test.com',
        designation: 'Assistant Professor',
        department: 'Computer Science'
      });

      expect(teacher.universityId).toBe('T-2024-001');
      expect(teacher.workload).toBe(0);
      expect(teacher.maxWorkload).toBe(12);
      expect(teacher.status).toBe('Active');
    });

    it('should validate workload does not exceed maxWorkload', async () => {
      const user = await User.create({
        name: 'Test Teacher',
        email: 'teacher2@test.com',
        password: 'password123',
        role: 'teacher'
      });

      const teacher = await Teacher.create({
        universityId: 'T-2024-002',
        userId: user._id,
        name: 'Test Teacher',
        email: 'teacher2@test.com',
        designation: 'Lecturer',
        department: 'Mathematics',
        maxWorkload: 10
      });

      teacher.workload = 15;
      await expect(teacher.save()).rejects.toThrow();
    });
  });

  describe('Course Model', () => {
    it('should create a course with required fields', async () => {
      const user = await User.create({
        name: 'Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      });

      const course = await Course.create({
        courseCode: 'CSE101',
        courseName: 'Introduction to Programming',
        credits: 3,
        semester: 1,
        department: 'Computer Science',
        academicYear: '2024',
        createdBy: user._id
      });

      expect(course.courseCode).toBe('CSE101');
      expect(course.isOffering).toBe(true);
      expect(course.archived).toBe(false);
    });

    it('should enforce unique course code', async () => {
      const user = await User.create({
        name: 'Admin',
        email: 'admin2@test.com',
        password: 'password123',
        role: 'admin'
      });

      await Course.create({
        courseCode: 'CSE102',
        courseName: 'Data Structures',
        credits: 3,
        semester: 2,
        department: 'Computer Science',
        academicYear: '2024',
        createdBy: user._id
      });

      await expect(
        Course.create({
          courseCode: 'CSE102',
          courseName: 'Algorithms',
          credits: 3,
          semester: 3,
          department: 'Computer Science',
          academicYear: '2024',
          createdBy: user._id
        })
      ).rejects.toThrow();
    });
  });

  describe('Section Model', () => {
    it('should create a section with schedule', async () => {
      const section = await Section.create({
        courseCode: 'CSE101',
        section: 'A',
        semester: 'Spring 2024',
        academicYear: '2024',
        maxCapacity: 40,
        schedule: [
          {
            day: 'Monday',
            startTime: '10:00',
            endTime: '11:30',
            room: 'Room 301'
          }
        ]
      });

      expect(section.section).toBe('A');
      expect(section.capacity).toBe(0);
      expect(section.status).toBe('Active');
    });

    it('should update status when capacity reaches max', async () => {
      const users = await User.insertMany([
        { name: 'Student 1', email: 's1@test.com', password: 'pass', role: 'student' },
        { name: 'Student 2', email: 's2@test.com', password: 'pass', role: 'student' }
      ]);

      const section = await Section.create({
        courseCode: 'CSE101',
        section: 'B',
        semester: 'Spring 2024',
        academicYear: '2024',
        maxCapacity: 2,
        enrolledStudents: users.map(u => u._id)
      });

      expect(section.status).toBe('Full');
      expect(section.capacity).toBe(2);
    });
  });

  describe('Enrollment Model', () => {
    it('should create an enrollment record', async () => {
      const user = await User.create({
        name: 'Student',
        email: 'student@test.com',
        password: 'password123',
        role: 'student'
      });

      const student = await Student.create({
        universityId: 'S-2024-001',
        userId: user._id,
        name: 'Student',
        email: 'student@test.com',
        batch: '2024',
        section: 'A',
        semester: 1
      });

      const enrollment = await Enrollment.create({
        studentId: student._id,
        courseCode: 'CSE101',
        section: 'A',
        semester: 'Spring 2024',
        academicYear: '2024'
      });

      expect(enrollment.status).toBe('Active');
      expect(enrollment.attendance).toBe(0);
    });

    it('should calculate grade points from grade', async () => {
      const user = await User.create({
        name: 'Student',
        email: 'student2@test.com',
        password: 'password123',
        role: 'student'
      });

      const student = await Student.create({
        universityId: 'S-2024-002',
        userId: user._id,
        name: 'Student',
        email: 'student2@test.com',
        batch: '2024',
        section: 'A',
        semester: 1
      });

      const enrollment = await Enrollment.create({
        studentId: student._id,
        courseCode: 'CSE102',
        section: 'A',
        semester: 'Spring 2024',
        academicYear: '2024',
        grade: 'A'
      });

      expect(enrollment.gradePoint).toBe(3.75);

      enrollment.grade = 'B+';
      await enrollment.save();
      expect(enrollment.gradePoint).toBe(3.25);
    });

    it('should enforce unique enrollment per student-course-semester', async () => {
      const user = await User.create({
        name: 'Student',
        email: 'student3@test.com',
        password: 'password123',
        role: 'student'
      });

      const student = await Student.create({
        universityId: 'S-2024-003',
        userId: user._id,
        name: 'Student',
        email: 'student3@test.com',
        batch: '2024',
        section: 'A',
        semester: 1
      });

      await Enrollment.create({
        studentId: student._id,
        courseCode: 'CSE103',
        section: 'A',
        semester: 'Spring 2024',
        academicYear: '2024'
      });

      await expect(
        Enrollment.create({
          studentId: student._id,
          courseCode: 'CSE103',
          section: 'A',
          semester: 'Spring 2024',
          academicYear: '2024'
        })
      ).rejects.toThrow();
    });
  });
});
