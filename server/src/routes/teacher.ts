import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getStudentsByCourseSection,
  getTeacherCourses
} from '../controllers/teacherController';
import {
  createAttendance,
  getAttendance,
  updateAttendance
} from '../controllers/attendanceController';
import { getTeacherRoutine } from '../controllers/routineController';
import { uploadProfilePhoto } from '../middleware/upload';
import {
  getTeacherProfile,
  updateTeacherProfile,
  changeTeacherPassword,
  uploadTeacherPhoto
} from '../controllers/profileController';

const router = Router();

// All teacher routes require authentication
router.use(authenticate);

// Profile & Settings
router.get('/profile', getTeacherProfile);
router.put('/profile', updateTeacherProfile);
router.post('/change-password', changeTeacherPassword);
router.post('/upload-photo', uploadProfilePhoto.single('photo'), uploadTeacherPhoto);

// Get teacher's assigned courses
router.get('/courses', getTeacherCourses);

// Get routine for teacher
router.get('/routine', getTeacherRoutine);

// Attendance Management
router.post('/attendance', createAttendance);

router.get('/attendance', getAttendance);

router.put('/attendance/:id', updateAttendance);

// Get students in a course
router.get('/students/:courseCode/:section', getStudentsByCourseSection);

export default router;
