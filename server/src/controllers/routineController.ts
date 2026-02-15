import { Response } from 'express';
import Routine from '../models/Routine';
import Student from '../models/Student';
import { AuthRequest } from '../middleware/auth';

export const getTeacherRoutine = async (req: AuthRequest, res: Response) => {
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
};

export const getStudentRoutine = async (req: AuthRequest, res: Response) => {
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
};
