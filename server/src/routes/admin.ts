import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { uploadProfilePhoto } from '../middleware/upload';

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
router.post('/teachers/bulk', adminController.createTeachersBulk);
router.put('/teachers/:id', adminController.updateTeacher);
router.delete('/teachers/:id', adminController.deleteTeacher);

// Students
router.get('/students', adminController.getStudents);
router.get('/students/:id', adminController.getStudent);
router.post('/students', adminController.createStudent);
router.post('/students/bulk', adminController.createStudentsBulk);
router.put('/students/:id', adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);

// Courses
router.get('/courses', adminController.getCourses);
router.get('/courses/:id', adminController.getCourse);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

// Sections
router.get('/sections', adminController.getSections);
router.post('/sections', adminController.createSection);
router.put('/sections/:id', adminController.updateSection);
router.get('/sections/:id/students', adminController.getSectionStudents);

// Routines
router.get('/routines', adminController.getRoutines);
router.post('/routines', adminController.createRoutine);
router.put('/routines/:id', adminController.updateRoutine);

// Registrations (Enrollments)
router.get('/registrations', adminController.getRegistrations);
router.get('/registrations/:id', adminController.getRegistration);
router.post('/registrations', adminController.createRegistration);
router.post('/registrations/bulk', adminController.createRegistrationsBulk);
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

// Complaints
router.get('/complaints', adminController.getComplaints);
router.put('/complaints/:id', adminController.updateComplaint);

// Profile & Settings
router.get('/profile', adminController.getAdminProfile);
router.put('/profile', adminController.updateAdminProfile);
router.post('/change-password', adminController.changePassword);
router.post('/upload-photo', uploadProfilePhoto.single('photo'), adminController.uploadProfilePhoto);

export default router;
