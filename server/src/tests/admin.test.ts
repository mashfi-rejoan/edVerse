import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import adminRoutes from '../routes/admin';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import Course from '../models/Course';
import User from '../models/User';

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

describe('Admin API Tests', () => {
  let adminToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/edverse-test');
    
    // Create admin user and get token
    const adminUser = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    });
    testUserId = adminUser._id.toString();
    
    // Mock JWT token
    adminToken = 'Bearer test-token';
  });

  afterAll(async () => {
    // Cleanup and close connection
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Course.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Dashboard Stats', () => {
    it('should return dashboard statistics', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalStudents');
      expect(response.body.data).toHaveProperty('totalTeachers');
      expect(response.body.data).toHaveProperty('totalCourses');
    });
  });

  describe('Teachers', () => {
    let teacherId: string;

    it('should create a new teacher', async () => {
      const teacherData = {
        universityId: 'T-2024-001',
        name: 'John Doe',
        email: 'john.doe@university.edu',
        password: 'teacher123',
        designation: 'Assistant Professor',
        department: 'Computer Science'
      };

      const response = await request(app)
        .post('/api/admin/teachers')
        .set('Authorization', adminToken)
        .send(teacherData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('universityId', 'T-2024-001');
      teacherId = response.body.data._id;
    });

    it('should get all teachers with pagination', async () => {
      const response = await request(app)
        .get('/api/admin/teachers?page=1&limit=10')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('teachers');
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should get a specific teacher', async () => {
      const response = await request(app)
        .get(`/api/admin/teachers/${teacherId}`)
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('universityId');
    });

    it('should update a teacher', async () => {
      const updateData = {
        designation: 'Associate Professor',
        experience: 5
      };

      const response = await request(app)
        .put(`/api/admin/teachers/${teacherId}`)
        .set('Authorization', adminToken)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.designation).toBe('Associate Professor');
    });

    it('should delete a teacher', async () => {
      const response = await request(app)
        .delete(`/api/admin/teachers/${teacherId}`)
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Students', () => {
    let studentId: string;

    it('should create a new student', async () => {
      const studentData = {
        universityId: 'S-2024-001',
        name: 'Jane Smith',
        email: 'jane.smith@student.edu',
        password: 'student123',
        batch: '2024',
        section: 'A',
        semester: 1
      };

      const response = await request(app)
        .post('/api/admin/students')
        .set('Authorization', adminToken)
        .send(studentData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('universityId', 'S-2024-001');
      studentId = response.body.data._id;
    });

    it('should get all students with pagination', async () => {
      const response = await request(app)
        .get('/api/admin/students?page=1&limit=10')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('students');
    });

    it('should update a student', async () => {
      const updateData = {
        semester: 2,
        cgpa: 3.5
      };

      const response = await request(app)
        .put(`/api/admin/students/${studentId}`)
        .set('Authorization', adminToken)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Courses', () => {
    let courseId: string;

    it('should create a new course', async () => {
      const courseData = {
        courseCode: 'CSE101',
        courseName: 'Introduction to Programming',
        credits: 3,
        semester: 1,
        department: 'Computer Science',
        courseType: 'Theory',
        academicYear: '2024',
        isOffering: true
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', adminToken)
        .send(courseData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('courseCode', 'CSE101');
      courseId = response.body.data._id;
    });

    it('should get all courses', async () => {
      const response = await request(app)
        .get('/api/admin/courses?page=1&limit=10')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('courses');
    });

    it('should update a course', async () => {
      const updateData = {
        credits: 4,
        isOffering: true
      };

      const response = await request(app)
        .put(`/api/admin/courses/${courseId}`)
        .set('Authorization', adminToken)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Authorization', () => {
    it('should reject requests without token', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard/stats');

      expect(response.status).toBe(401);
    });

    it('should reject requests with invalid token', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});
