import { Response } from 'express';
import Announcement from '../models/Announcement';
import Attendance from '../models/Attendance';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import { AuthRequest } from '../middleware/auth';

export const getStudentCourses = async (req: AuthRequest, res: Response) => {
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
};


export const getStudentAttendance = async (req: AuthRequest, res: Response) => {
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
};

export const getStudentGrades = async (req: AuthRequest, res: Response) => {
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
};

export const getStudentAnnouncements = async (req: AuthRequest, res: Response) => {
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
};
