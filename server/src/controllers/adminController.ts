import { Request, Response } from 'express';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import Course from '../models/Course';
import Section from '../models/Section';
import Enrollment from '../models/Enrollment';
import Exam from '../models/Exam';
import Announcement from '../models/Announcement';
import Routine from '../models/Routine';
import User from '../models/User';
import bcryptjs from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';

const { Complaint } = require('../database/schemas');

const extractYear = (value?: string | number | Date) => {
  if (!value) return new Date().getFullYear();
  if (value instanceof Date) return value.getFullYear();
  const match = String(value).match(/\d{4}/);
  return match ? Number(match[0]) : new Date().getFullYear();
};

const resolveDeptId = (deptId?: string | number) => {
  if (deptId === undefined || deptId === null || `${deptId}`.trim() === '') {
    return null;
  }
  return String(deptId).replace(/\D/g, '');
};

const generateStudentUniversityId = async (year: number, deptId: string) => {
  const prefix = `${year}${deptId}`;
  const count = await Student.countDocuments({
    universityId: { $regex: `^${prefix}` }
  });
  return `${prefix}${count + 1}`;
};

const generateTeacherUniversityId = async (year: number, deptId: string) => {
  const deptIdPadded = deptId.padStart(2, '0');
  const prefix = `${year}${deptIdPadded}`;
  const count = await Teacher.countDocuments({
    universityId: { $regex: `^${prefix}` }
  });
  const serial = String(count + 1).padStart(2, '0');
  return `${prefix}${serial}`;
};

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
      deptId,
      departmentId,
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

    let resolvedUniversityId = universityId as string | undefined;
    if (!resolvedUniversityId) {
      const resolvedDeptId = resolveDeptId(deptId ?? departmentId);
      if (!resolvedDeptId) {
        return res.status(400).json({
          success: false,
          error: 'departmentId is required to generate teacher ID'
        });
      }
      const year = extractYear(dateOfJoining);
      resolvedUniversityId = await generateTeacherUniversityId(year, resolvedDeptId);
    }

    // Create user account first
    const user = await User.create({
      name,
      email,
      universityId: resolvedUniversityId,
      password: password || 'teacher123',
      role: 'teacher'
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      universityId: resolvedUniversityId,
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

export const createTeachersBulk = async (req: Request, res: Response) => {
  try {
    const teachers = Array.isArray(req.body.teachers) ? req.body.teachers : [];

    if (teachers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'teachers array is required'
      });
    }

    const prefixCounts = new Map<string, number>();
    const created: any[] = [];

    for (const payload of teachers) {
      const {
        universityId,
        name,
        email,
        password,
        phone,
        deptId,
        departmentId,
        designation,
        department,
        specialization,
        qualifications,
        officeRoom,
        officeHours,
        bloodGroup,
        dateOfJoining,
        experience
      } = payload;

      let resolvedUniversityId = universityId as string | undefined;
      if (!resolvedUniversityId) {
        const resolvedDeptId = resolveDeptId(deptId ?? departmentId);
        if (!resolvedDeptId) {
          return res.status(400).json({
            success: false,
            error: 'departmentId is required to generate teacher ID'
          });
        }
        const year = extractYear(dateOfJoining);
        const deptIdPadded = resolvedDeptId.padStart(2, '0');
        const prefix = `${year}${deptIdPadded}`;
        let count = prefixCounts.get(prefix);
        if (count === undefined) {
          count = await Teacher.countDocuments({ universityId: { $regex: `^${prefix}` } });
        }
        count += 1;
        prefixCounts.set(prefix, count);
        const serial = String(count).padStart(2, '0');
        resolvedUniversityId = `${prefix}${serial}`;
      }

      const user = await User.create({
        name,
        email,
        universityId: resolvedUniversityId,
        password: password || 'teacher123',
        role: 'teacher'
      });

      const teacher = await Teacher.create({
        universityId: resolvedUniversityId,
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

      created.push(teacher);
    }

    res.status(201).json({
      success: true,
      data: created,
      message: 'Teachers created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create teachers'
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
      deptId,
      departmentId,
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

    let resolvedUniversityId = universityId as string | undefined;
    if (!resolvedUniversityId) {
      const resolvedDeptId = resolveDeptId(deptId ?? departmentId);
      if (!resolvedDeptId) {
        return res.status(400).json({
          success: false,
          error: 'departmentId is required to generate student ID'
        });
      }
      const year = extractYear(batch || admissionDate);
      resolvedUniversityId = await generateStudentUniversityId(year, resolvedDeptId);
    }

    // Create user account first
    const user = await User.create({
      name,
      email,
      universityId: resolvedUniversityId,
      password: password || 'student123',
      role: 'student'
    });

    // Create student profile
    const student = await Student.create({
      universityId: resolvedUniversityId,
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

export const createStudentsBulk = async (req: Request, res: Response) => {
  try {
    const students = Array.isArray(req.body.students) ? req.body.students : [];

    if (students.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'students array is required'
      });
    }

    const prefixCounts = new Map<string, number>();
    const created: any[] = [];

    for (const payload of students) {
      const {
        universityId,
        name,
        email,
        password,
        phone,
        deptId,
        departmentId,
        batch,
        section,
        semester,
        bloodGroup,
        guardianName,
        guardianPhone,
        address,
        dateOfBirth,
        admissionDate
      } = payload;

      let resolvedUniversityId = universityId as string | undefined;
      if (!resolvedUniversityId) {
        const resolvedDeptId = resolveDeptId(deptId ?? departmentId);
        if (!resolvedDeptId) {
          return res.status(400).json({
            success: false,
            error: 'departmentId is required to generate student ID'
          });
        }
        const year = extractYear(batch || admissionDate);
        const prefix = `${year}${resolvedDeptId}`;
        let count = prefixCounts.get(prefix);
        if (count === undefined) {
          count = await Student.countDocuments({ universityId: { $regex: `^${prefix}` } });
        }
        count += 1;
        prefixCounts.set(prefix, count);
        resolvedUniversityId = `${prefix}${count}`;
      }

      const user = await User.create({
        name,
        email,
        universityId: resolvedUniversityId,
        password: password || 'student123',
        role: 'student'
      });

      const student = await Student.create({
        universityId: resolvedUniversityId,
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

      created.push(student);
    }

    res.status(201).json({
      success: true,
      data: created,
      message: 'Students created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create students'
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

// Sections
export const getSections = async (_req: Request, res: Response) => {
  try {
    const sections = await Section.find()
      .populate('assignedTeacher', 'universityId name designation department')
      .populate('enrolledStudents', 'universityId name email batch section')
      .sort({ courseCode: 1, section: 1 });

    res.status(200).json({
      success: true,
      data: sections
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch sections'
    });
  }
};

export const createSection = async (req: Request, res: Response) => {
  try {
    const section = await Section.create(req.body);

    res.status(201).json({
      success: true,
      data: section,
      message: 'Section created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create section'
    });
  }
};

export const updateSection = async (req: Request, res: Response) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate('assignedTeacher', 'universityId name designation department')
      .populate('enrolledStudents', 'universityId name email batch section');

    if (!section) {
      return res.status(404).json({
        success: false,
        error: 'Section not found'
      });
    }

    Object.assign(section, req.body);
    await section.save();

    res.status(200).json({
      success: true,
      data: section,
      message: 'Section updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update section'
    });
  }
};

export const getSectionStudents = async (req: Request, res: Response) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate('enrolledStudents', 'universityId name email batch section');

    if (!section) {
      return res.status(404).json({
        success: false,
        error: 'Section not found'
      });
    }

    res.status(200).json({
      success: true,
      data: section.enrolledStudents
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch section students'
    });
  }
};

// Routines
export const getRoutines = async (_req: Request, res: Response) => {
  try {
    const routines = await Routine.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: routines
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch routines'
    });
  }
};

export const createRoutine = async (req: AuthRequest, res: Response) => {
  try {
    const routine = await Routine.create({
      ...req.body,
      createdBy: req.user?._id,
      lastModifiedBy: req.user?._id
    });

    res.status(201).json({
      success: true,
      data: routine,
      message: 'Routine created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create routine'
    });
  }
};

export const updateRoutine = async (req: AuthRequest, res: Response) => {
  try {
    const routine = await Routine.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, lastModifiedBy: req.user?._id } },
      { new: true, runValidators: true }
    );

    if (!routine) {
      return res.status(404).json({
        success: false,
        error: 'Routine not found'
      });
    }

    res.status(200).json({
      success: true,
      data: routine,
      message: 'Routine updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update routine'
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

export const createRegistration = async (req: Request, res: Response) => {
  try {
    const registration = await Enrollment.create(req.body);

    res.status(201).json({
      success: true,
      data: registration,
      message: 'Registration created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create registration'
    });
  }
};

export const createRegistrationsBulk = async (req: Request, res: Response) => {
  try {
    const registrations = Array.isArray(req.body.registrations)
      ? req.body.registrations
      : [];

    if (registrations.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'registrations array is required'
      });
    }

    const created = await Enrollment.insertMany(registrations, { ordered: false });

    res.status(201).json({
      success: true,
      data: {
        created: created.length
      },
      message: 'Registrations created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create registrations'
    });
  }
};

// Exams
export const getExams = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const exams = await Exam.find()
      .populate('createdBy', 'name email')
      .populate('assignedTeacher', 'universityId name')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Exam.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        exams,
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
      error: error.message || 'Failed to fetch exams'
    });
  }
};

export const createExam = async (req: AuthRequest, res: Response) => {
  try {
    const exam = await Exam.create({
      ...req.body,
      createdBy: req.user?._id
    });

    res.status(201).json({
      success: true,
      data: exam,
      message: 'Exam created successfully'
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
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found'
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
      message: 'Exam updated successfully'
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

    const announcements = await Announcement.find()
      .populate('createdBy', 'name email')
      .sort({ publishedDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Announcement.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        announcements,
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
      error: error.message || 'Failed to fetch announcements'
    });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      createdBy: req.user?._id
    });

    res.status(201).json({
      success: true,
      data: announcement,
      message: 'Announcement created successfully'
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
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: announcement,
      message: 'Announcement updated successfully'
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
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    // Soft delete - mark as archived
    announcement.status = 'Archived';
    await announcement.save();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete announcement'
    });
  }
};

// Complaints
export const getComplaints = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const complaints = await Complaint.find()
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Complaint.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        complaints,
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
      error: error.message || 'Failed to fetch complaints'
    });
  }
};

export const updateComplaint = async (req: Request, res: Response) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
      message: 'Complaint updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update complaint'
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

    const user = await User.findById(req.userId).select('+password');
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
    user.password = newPassword;
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
    const authReq = req as AuthRequest;
    if (!authReq.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const user = await User.findById(authReq.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.photoUrl = `/uploads/profile-photos/${authReq.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        photoUrl: user.photoUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload photo'
    });
  }
};
