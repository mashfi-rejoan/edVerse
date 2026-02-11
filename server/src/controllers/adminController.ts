import { Request, Response } from 'express';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import Course from '../models/Course';
import Section from '../models/Section';
import Enrollment from '../models/Enrollment';
import User from '../models/User';
import bcryptjs from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';

// Dashboard Stats
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [totalStudents, totalTeachers, totalCourses, activeEnrollments] = await Promise.all([
      Student.countDocuments({ status: 'Active' }),
      Teacher.countDocuments({ status: 'Active' }),
      Course.countDocuments({ isOffering: true, archived: false }),
      Enrollment.countDocuments({ status: 'Active' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalCourses,
        activeEnrollments
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch dashboard stats'
    });
  }
};

// Teachers
export const getTeachers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const teachers = await Teacher.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Teacher.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        teachers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch teachers'
    });
  }
};

export const getTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('userId', 'name email role');
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch teacher'
    });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const {
      universityId,
      name,
      email,
      password,
      phone,
      designation,
      department,
      specialization,
      qualifications,
      officeRoom,
      officeHours,
      bloodGroup,
      dateOfJoining,
      experience
    } = req.body;

    // Create user account first
    const hashedPassword = await bcryptjs.hash(password || 'teacher123', 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'teacher'
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      universityId,
      userId: user._id,
      name,
      email,
      phone,
      designation,
      department,
      specialization,
      qualifications: qualifications || [],
      officeRoom,
      officeHours,
      bloodGroup,
      dateOfJoining: dateOfJoining || new Date(),
      experience: experience || 0
    });

    res.status(201).json({
      success: true,
      data: teacher,
      message: 'Teacher created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create teacher'
    });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('userId', 'name email role');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher,
      message: 'Teacher updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update teacher'
    });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }

    // Soft delete - mark as inactive
    teacher.status = 'Retired';
    await teacher.save();

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete teacher'
    });
  }
};

// Students
export const getStudents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        students,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch students'
    });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email role');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch student'
    });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const {
      universityId,
      name,
      email,
      password,
      phone,
      batch,
      section,
      semester,
      bloodGroup,
      guardianName,
      guardianPhone,
      address,
      dateOfBirth,
      admissionDate
    } = req.body;

    // Create user account first
    const hashedPassword = await bcryptjs.hash(password || 'student123', 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student'
    });

    // Create student profile
    const student = await Student.create({
      universityId,
      userId: user._id,
      name,
      email,
      phone,
      batch,
      section,
      semester,
      bloodGroup,
      guardianName,
      guardianPhone,
      address,
      dateOfBirth,
      admissionDate: admissionDate || new Date()
    });

    res.status(201).json({
      success: true,
      data: student,
      message: 'Student created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create student'
    });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('userId', 'name email role');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student,
      message: 'Student updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update student'
    });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Soft delete - mark as inactive
    student.status = 'Suspended';
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete student'
    });
  }
};

// Courses
export const getCourses = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const courses = await Course.find({ archived: false })
      .populate('createdBy', 'name email')
      .sort({ semester: 1, courseCode: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments({ archived: false });

    res.status(200).json({
      success: true,
      data: {
        courses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch courses'
    });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch course'
    });
  }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.create({
      ...req.body,
      createdBy: req.user?._id
    });

    res.status(201).json({
      success: true,
      data: course,
      message: 'Course created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create course'
    });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course,
      message: 'Course updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update course'
    });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Soft delete - mark as archived
    course.archived = true;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete course'
    });
  }
};

// Registrations (Enrollments)
export const getRegistrations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const registrations = await Enrollment.find()
      .populate('studentId', 'universityId name email batch section')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Enrollment.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        registrations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch registrations'
    });
  }
};

export const getRegistration = async (req: Request, res: Response) => {
  try {
    const registration = await Enrollment.findById(req.params.id)
      .populate('studentId', 'universityId name email batch section');
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch registration'
    });
  }
};

export const updateRegistration = async (req: Request, res: Response) => {
  try {
    const registration = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('studentId', 'universityId name email batch section');

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      data: registration,
      message: 'Registration updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update registration'
    });
  }
};

// Exams
export const getExams = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // For now, return empty array as Exam model will be created later
    res.status(200).json({
      success: true,
      data: {
        exams: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch exams'
    });
  }
};

export const createExam = async (req: Request, res: Response) => {
  try {
    // Placeholder - will implement after creating Exam model
    res.status(501).json({
      success: false,
      error: 'Exam creation not implemented yet'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create exam'
    });
  }
};

export const updateExam = async (req: Request, res: Response) => {
  try {
    // Placeholder - will implement after creating Exam model
    res.status(501).json({
      success: false,
      error: 'Exam update not implemented yet'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update exam'
    });
  }
};

// Announcements
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Placeholder - will implement after creating Announcement model
    res.status(200).json({
      success: true,
      data: {
        announcements: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch announcements'
    });
  }
};

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    // Placeholder - will implement after creating Announcement model
    res.status(501).json({
      success: false,
      error: 'Announcement creation not implemented yet'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create announcement'
    });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    // Placeholder - will implement after creating Announcement model
    res.status(501).json({
      success: false,
      error: 'Announcement update not implemented yet'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update announcement'
    });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    // Placeholder - will implement after creating Announcement model
    res.status(501).json({
      success: false,
      error: 'Announcement deletion not implemented yet'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete announcement'
    });
  }
};

// Profile & Settings
export const getAdminProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch profile'
    });
  }
};

export const updateAdminProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update profile'
    });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify old password
    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash and save new password
    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to change password'
    });
  }
};

export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    // Placeholder - will implement file upload later
    res.status(501).json({
      success: false,
      error: 'Photo upload not implemented yet'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload photo'
    });
  }
};
