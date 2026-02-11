import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin authorization
router.use(authenticate);
router.use(authorizeAdmin);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// Teachers
router.get('/teachers', adminController.getTeachers);
router.get('/teachers/:id', adminController.getTeacher);
router.post('/teachers', adminController.createTeacher);
router.put('/teachers/:id', adminController.updateTeacher);
router.delete('/teachers/:id', adminController.deleteTeacher);

// Students
router.get('/students', adminController.getStudents);
router.get('/students/:id', adminController.getStudent);
router.post('/students', adminController.createStudent);
router.put('/students/:id', adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);

// Courses
router.get('/courses', adminController.getCourses);
router.get('/courses/:id', adminController.getCourse);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

// Registrations (Enrollments)
router.get('/registrations', adminController.getRegistrations);
router.get('/registrations/:id', adminController.getRegistration);
router.put('/registrations/:id', adminController.updateRegistration);

// Exams
router.get('/exams', adminController.getExams);
router.post('/exams', adminController.createExam);
router.put('/exams/:id', adminController.updateExam);

// Announcements
router.get('/announcements', adminController.getAnnouncements);
router.post('/announcements', adminController.createAnnouncement);
router.put('/announcements/:id', adminController.updateAnnouncement);
router.delete('/announcements/:id', adminController.deleteAnnouncement);

// Profile & Settings
router.get('/profile', adminController.getAdminProfile);
router.put('/profile', adminController.updateAdminProfile);
router.post('/change-password', adminController.changePassword);
router.post('/upload-photo', adminController.uploadProfilePhoto);

export default router;
