import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import Routine from '../models/Routine';
import Attendance from '../models/Attendance';
import Section from '../models/Section';
import Student from '../models/Student';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

// All teacher routes require authentication
router.use(authenticate);

// Get teacher's assigned courses
router.get('/courses', async (req: AuthRequest, res: Response) => {
  try {
    const sections = await Section.find({ assignedTeacher: req.userId })
      .populate('courseCode')
      .populate('enrolledStudents', 'universityId name email');
    
    res.status(200).json({
      success: true,
      data: sections
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch courses'
    });
  }
});

// Get routine for teacher
router.get('/routine', async (req: AuthRequest, res: Response) => {
  try {
    const routines = await Routine.find({
      'schedule.teacherId': req.userId,
      status: 'Active'
    });
    
    res.status(200).json({
      success: true,
      data: routines
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch routine'
    });
  }
});

// Attendance Management
router.post('/attendance', async (req: AuthRequest, res: Response) => {
  try {
    const attendance = await Attendance.create({
      ...req.body,
      markedBy: req.userId
    });

    res.status(201).json({
      success: true,
      data: attendance,
      message: 'Attendance marked successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to mark attendance'
    });
  }
});

router.get('/attendance', async (req: AuthRequest, res: Response) => {
  try {
    const { courseCode, section, startDate, endDate } = req.query;
    const query: any = { markedBy: req.userId };

    if (courseCode) query.courseCode = courseCode;
    if (section) query.section = section;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch attendance'
    });
  }
});

router.put('/attendance/:id', async (req: AuthRequest, res: Response) => {
  try {
    const attendance = await Attendance.findOneAndUpdate(
      { _id: req.params.id, markedBy: req.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Attendance updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update attendance'
    });
  }
});

// Get students in a course
router.get('/students/:courseCode/:section', async (req: AuthRequest, res: Response) => {
  try {
    const section = await Section.findOne({
      courseCode: req.params.courseCode,
      section: req.params.section,
      assignedTeacher: req.userId
    }).populate('enrolledStudents');

    if (!section) {
      return res.status(404).json({
        success: false,
        error: 'Section not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      data: section.enrolledStudents
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch students'
    });
  }
});

export default router;
