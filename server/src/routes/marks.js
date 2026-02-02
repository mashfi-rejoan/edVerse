const express = require('express');
const router = express.Router();
const Marks = require('../models/Marks');

// Get marks for a specific course, section, and evaluation type
router.get('/:courseCode/:section/:evaluationType', async (req, res) => {
  try {
    const { courseCode, section, evaluationType } = req.params;
    
    const marks = await Marks.findOne({
      courseCode,
      section,
      evaluationType
    }).sort({ updatedAt: -1 });

    if (!marks) {
      return res.json({ 
        success: true, 
        data: null,
        message: 'No marks found for this combination'
      });
    }

    res.json({ success: true, data: marks });
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch marks',
      error: error.message 
    });
  }
});

// Save or update marks
router.post('/', async (req, res) => {
  try {
    const {
      courseCode,
      courseName,
      section,
      teacherId,
      teacherName,
      evaluationType,
      maxMarks,
      records,
      statistics
    } = req.body;

    // Validate required fields
    if (!courseCode || !section || !evaluationType || !records || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if marks already exist for this combination
    let existingMarks = await Marks.findOne({
      courseCode,
      section,
      evaluationType
    });

    if (existingMarks) {
      // Update existing marks
      existingMarks.courseName = courseName;
      existingMarks.teacherId = teacherId;
      existingMarks.teacherName = teacherName;
      existingMarks.maxMarks = maxMarks;
      existingMarks.records = records;
      existingMarks.statistics = statistics;
      
      await existingMarks.save();
      
      return res.json({
        success: true,
        message: 'Marks updated successfully',
        data: existingMarks
      });
    } else {
      // Create new marks entry
      const newMarks = new Marks({
        courseCode,
        courseName,
        section,
        teacherId,
        teacherName,
        evaluationType,
        maxMarks,
        records,
        statistics
      });

      await newMarks.save();

      return res.json({
        success: true,
        message: 'Marks saved successfully',
        data: newMarks
      });
    }
  } catch (error) {
    console.error('Error saving marks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save marks',
      error: error.message
    });
  }
});

// Get all marks for a teacher
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const marks = await Marks.find({ teacherId }).sort({ updatedAt: -1 });

    res.json({ success: true, data: marks });
  } catch (error) {
    console.error('Error fetching teacher marks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marks',
      error: error.message
    });
  }
});

// Get marks for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const marks = await Marks.find({
      'records.studentId': studentId
    }).sort({ updatedAt: -1 });

    // Extract only the relevant student's marks from each document
    const studentMarks = marks.map(mark => {
      const studentRecord = mark.records.find(r => r.studentId === studentId);
      return {
        courseCode: mark.courseCode,
        courseName: mark.courseName,
        section: mark.section,
        evaluationType: mark.evaluationType,
        maxMarks: mark.maxMarks,
        marksObtained: studentRecord?.marksObtained,
        percentage: studentRecord?.percentage,
        updatedAt: mark.updatedAt
      };
    });

    res.json({ success: true, data: studentMarks });
  } catch (error) {
    console.error('Error fetching student marks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student marks',
      error: error.message
    });
  }
});

// Delete marks entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Marks.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Marks not found'
      });
    }

    res.json({
      success: true,
      message: 'Marks deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting marks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete marks',
      error: error.message
    });
  }
});

module.exports = router;
