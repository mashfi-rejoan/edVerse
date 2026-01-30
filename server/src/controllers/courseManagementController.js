
const express = require('express');
const router = express.Router();
const courseService = require('../services/courseManagementService');
const retakeService = require('../services/retakeCourseService');
const enrollmentHistoryService = require('../services/enrollmentHistoryService');
const gradeService = require('../services/gradeManagementService');
const capacityService = require('../services/courseCapacityAnalyticsService');
const { Enrollment } = require('../models/courseManagement');
// POST /courses/retake
router.post('/retake', async (req, res) => {
  try {
    const { studentId, courseId, semesterId } = req.body;
    if (!studentId || !courseId || !semesterId) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    const result = await retakeService.retakeCourse(studentId, courseId, semesterId);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// GET /courses/history/:studentId
router.get('/history/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Missing student id.' });
    }
    const result = await enrollmentHistoryService.getStudentEnrollmentHistory(studentId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// POST /courses/grade
router.post('/grade', async (req, res) => {
  try {
    const { enrollmentId, grade } = req.body;
    if (!enrollmentId || !grade) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    const result = await gradeService.assignGrade(enrollmentId, grade);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// POST /courses/grade/publish
router.post('/grade/publish', async (req, res) => {
  try {
    const { enrollmentId } = req.body;
    if (!enrollmentId) {
      return res.status(400).json({ success: false, message: 'Missing enrollment id.' });
    }
    const result = await gradeService.publishGrade(enrollmentId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// POST /courses/retake/grade
router.post('/retake/grade', async (req, res) => {
  try {
    const { enrollmentId, grade } = req.body;
    if (!enrollmentId || !grade) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    const result = await gradeService.assignRetakeGrade(enrollmentId, grade);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// GET /courses/capacity/:courseId/:semesterId
router.get('/capacity/:courseId/:semesterId', async (req, res) => {
  try {
    const { courseId, semesterId } = req.params;
    if (!courseId || !semesterId) {
      return res.status(400).json({ success: false, message: 'Missing course or semester id.' });
    }
    const result = await capacityService.getCourseCapacityAnalytics(courseId, semesterId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// POST /courses/add
router.post('/add', async (req, res) => {
  try {
    const { studentId, courseId, semesterId } = req.body;
    if (!studentId || !courseId || !semesterId) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    const result = await courseService.addCourse(studentId, courseId, semesterId);
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// POST /courses/drop
router.post('/drop', async (req, res) => {
  try {
    const { studentId, courseId, semesterId } = req.body;
    if (!studentId || !courseId || !semesterId) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    const result = await courseService.dropCourse(studentId, courseId, semesterId);
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// GET /courses/semester/:id
router.get('/semester/:id', async (req, res) => {
  try {
    const semesterId = req.params.id;
    if (!semesterId) {
      return res.status(400).json({ success: false, message: 'Missing semester id.' });
    }
    // Optionally filter by studentId if provided as query param
    const { studentId } = req.query;
    let filter = { semester: semesterId };
    if (studentId) {
      filter.student = studentId;
    }
    // Only return approved enrollments
    filter.requestStatus = 'Approved';
    const enrollments = await Enrollment.find(filter)
      .populate('course')
      .populate('semester')
      .populate('student');
    return res.status(200).json({ success: true, enrollments });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

module.exports = router;
