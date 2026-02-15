import { Response } from 'express';
import Attendance from '../models/Attendance';
import { AuthRequest } from '../middleware/auth';

export const createAttendance = async (req: AuthRequest, res: Response) => {
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
};

export const getAttendance = async (req: AuthRequest, res: Response) => {
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
};

export const updateAttendance = async (req: AuthRequest, res: Response) => {
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
};
