import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';
import Routine from '../models/Routine';
import Attendance from '../models/Attendance';
import Announcement from '../models/Announcement';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

// All student routes require authentication
router.use(authenticate);

// Get student profile
router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId })
      .populate('userId', 'name email role');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch profile'
    });
  }
});

// Get enrolled courses
router.get('/courses', async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const enrollments = await Enrollment.find({
      studentId: student._id,
      status: 'Active'
    });

    res.status(200).json({
      success: true,
      data: enrollments
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch courses'
    });
  }
});

// Get routine
router.get('/routine', async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const routine = await Routine.findOne({
      batch: student.batch,
      section: student.section,
      status: 'Active'
    });

    res.status(200).json({
      success: true,
      data: routine
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch routine'
    });
  }
});

// Get attendance records
router.get('/attendance', async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const { courseCode, startDate, endDate } = req.query;
    const query: any = {
      'students.studentId': student._id
    };

    if (courseCode) query.courseCode = courseCode;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const attendanceRecords = await Attendance.find(query).sort({ date: -1 });

    // Filter to only show this student's records
    const studentAttendance = attendanceRecords.map(record => ({
      courseCode: record.courseCode,
      courseName: record.courseName,
      date: record.date,
      classType: record.classType,
      status: record.students.find(s => s.studentId.toString() === student._id.toString())?.status,
      markedAt: record.students.find(s => s.studentId.toString() === student._id.toString())?.markedAt
    }));

    res.status(200).json({
      success: true,
      data: studentAttendance
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch attendance'
    });
  }
});

// Get grades
router.get('/grades', async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const enrollments = await Enrollment.find({
      studentId: student._id
    }).sort({ semester: -1, academicYear: -1 });

    res.status(200).json({
      success: true,
      data: enrollments
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch grades'
    });
  }
});

// Get announcements for student
router.get('/announcements', async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const announcements = await Announcement.find({
      status: 'Published',
      $and: [
        {
          $or: [
            { scope: 'All' },
            { scope: 'Students' },
            { scope: 'Batch', targetBatch: student.batch },
            { scope: 'Section', targetBatch: student.batch, targetSection: student.section }
          ]
        },
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: { $gte: new Date() } }
          ]
        }
      ]
    }).sort({ publishedDate: -1 });

    res.status(200).json({
      success: true,
      data: announcements
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch announcements'
    });
  }
});

export default router;
