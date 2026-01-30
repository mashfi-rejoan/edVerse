// Course Management Routes
const express = require('express');
const router = express.Router();
const { Course, Enrollment, CourseMaterial, AssignmentSubmission } = require('../database/courseSchema');

// Helper function to get current semester
const getCurrentSemester = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();
  
  let semester;
  if (month >= 1 && month <= 4) {
    semester = 'Spring';
  } else if (month >= 5 && month <= 8) {
    semester = 'Summer';
  } else {
    semester = 'Fall';
  }
  
  return { semester, year };
};

// Get available semesters (current and past)
router.get('/semesters', async (req, res) => {
  try {
    const semesters = await Course.distinct('semester');
    const years = await Course.distinct('year');
    const current = getCurrentSemester();
    
    // Generate list of available semesters
    const availableSemesters = [];
    years.sort((a, b) => b - a); // Most recent first
    
    years.forEach(year => {
      ['Spring', 'Summer', 'Fall'].forEach(semester => {
        const semesterData = { semester, year };
        // Only include past and current semesters
        if (year < current.year || 
            (year === current.year && 
             (['Spring', 'Summer', 'Fall'].indexOf(semester) <= ['Spring', 'Summer', 'Fall'].indexOf(current.semester)))) {
          availableSemesters.push(semesterData);
        }
      });
    });
    
    res.json({
      current,
      available: availableSemesters,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student's enrolled courses for a semester
router.get('/student/:studentId/courses', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semester, year, status } = req.query;
    
    // Use current semester if not specified
    const currentSemester = getCurrentSemester();
    const querySemester = semester || currentSemester.semester;
    const queryYear = year ? parseInt(year) : currentSemester.year;
    
    const query = {
      student: studentId,
    };
    
    // Add status filter if provided
    if (status) {
      query.status = status.charAt(0).toUpperCase() + status.slice(1); // Capitalize status
    } else {
      // If no status, filter by semester and year
      query.semester = querySemester;
      query.year = queryYear;
    }
    
    const enrollments = await Enrollment.find(query).populate('course');
    
    const courses = enrollments.map(enrollment => ({
      ...enrollment.course.toObject(),
      enrollmentId: enrollment._id,
      enrollmentStatus: enrollment.status,
      grade: enrollment.grade || '',
    }));
    
    res.json({ courses, semester: querySemester, year: queryYear });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all available courses for enrollment
router.get('/courses/available', async (req, res) => {
  try {
    const { semester, year } = req.query;
    const current = getCurrentSemester();
    
    const courses = await Course.find({
      semester: semester || current.semester,
      year: year ? parseInt(year) : current.year,
      isActive: true,
    }).populate('instructor', 'name email');
    
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll in a course
router.post('/enroll', async (req, res) => {
  try {
    const { studentId, courseId, semester, year } = req.body;
    
    // Check if already enrolled
    const existing = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      semester,
      year,
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }
    
    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
      semester,
      year,
    });
    
    await enrollment.save();
    await enrollment.populate('course');
    
    res.status(201).json({ enrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Drop a course
router.post('/drop', async (req, res) => {
  try {
    const { enrollmentId } = req.body;
    
    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { status: 'Dropped' },
      { new: true }
    );
    
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    
    res.json({ enrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retake a course
router.post('/retake', async (req, res) => {
  try {
    const { studentId, courseId, semester, year } = req.body;
    
    // Check if already enrolled in this course for the target semester
    const existing = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      semester,
      year,
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this course for the selected semester' });
    }
    
    // Create new enrollment with Retake status
    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
      semester,
      year,
      status: 'Retake',
      enrolledAt: new Date()
    });
    
    await enrollment.save();
    await enrollment.populate('course');
    
    res.status(201).json({ enrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course materials
router.get('/course/:courseId/materials', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const materials = await CourseMaterial.find({ course: courseId })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name');
    
    res.json({ materials });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit assignment
router.post('/assignment/submit', async (req, res) => {
  try {
    const { materialId, studentId, submissionText, fileUrl } = req.body;
    
    // Check if already submitted
    let submission = await AssignmentSubmission.findOne({
      material: materialId,
      student: studentId,
    });
    
    if (submission) {
      // Update existing submission
      submission.submissionText = submissionText;
      submission.fileUrl = fileUrl;
      submission.submittedAt = new Date();
      await submission.save();
    } else {
      // Create new submission
      submission = new AssignmentSubmission({
        material: materialId,
        student: studentId,
        submissionText,
        fileUrl,
      });
      await submission.save();
    }
    
    res.json({ submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student's assignment submissions for a course
router.get('/course/:courseId/submissions/:studentId', async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    
    const materials = await CourseMaterial.find({ course: courseId });
    const materialIds = materials.map(m => m._id);
    
    const submissions = await AssignmentSubmission.find({
      material: { $in: materialIds },
      student: studentId,
    }).populate('material');
    
    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new course (for teachers/admin)
router.post('/courses', async (req, res) => {
  try {
    const { courseCode, courseName, instructor, instructorName, credits, department, description, semester, year } = req.body;
    
    const course = new Course({
      courseCode,
      courseName,
      instructor,
      instructorName,
      credits,
      department,
      description,
      semester: semester || getCurrentSemester().semester,
      year: year || getCurrentSemester().year,
    });
    
    await course.save();
    res.status(201).json({ course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add course material (for teachers)
router.post('/course/:courseId/materials', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, type, fileUrl, dueDate, uploadedBy } = req.body;
    
    const material = new CourseMaterial({
      course: courseId,
      title,
      description,
      type,
      fileUrl,
      dueDate,
      uploadedBy,
    });
    
    await material.save();
    res.status(201).json({ material });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
