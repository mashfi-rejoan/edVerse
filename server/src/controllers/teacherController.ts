import { Response } from 'express';
import Section from '../models/Section';
import { AuthRequest } from '../middleware/auth';

export const getTeacherCourses = async (req: AuthRequest, res: Response) => {
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
};


export const getStudentsByCourseSection = async (req: AuthRequest, res: Response) => {
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
};
