import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getStudentAnnouncements,
  getStudentAttendance,
  getStudentCourses,
  getStudentGrades
} from '../controllers/studentController';
import { getStudentRoutine } from '../controllers/routineController';
import { uploadProfilePhoto } from '../middleware/upload';
import {
  getStudentProfile,
  updateStudentProfile,
  changeStudentPassword,
  uploadStudentPhoto
} from '../controllers/profileController';

const router = Router();

// All student routes require authentication
router.use(authenticate);

// Profile & Settings
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.post('/change-password', changeStudentPassword);
router.post('/upload-photo', uploadProfilePhoto.single('photo'), uploadStudentPhoto);

// Get enrolled courses
router.get('/courses', getStudentCourses);

// Get routine
router.get('/routine', getStudentRoutine);

// Get attendance records
router.get('/attendance', getStudentAttendance);

// Get grades
router.get('/grades', getStudentGrades);

// Get announcements for student
router.get('/announcements', getStudentAnnouncements);

export default router;
