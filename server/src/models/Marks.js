const mongoose = require('mongoose');

const marksRecordSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  percentage: { type: Number, required: true }
});

const marksSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, index: true },
  courseName: { type: String, required: true },
  section: { type: String, required: true, index: true },
  teacherId: { type: String, required: true, index: true },
  teacherName: { type: String, required: true },
  evaluationType: { 
    type: String, 
    required: true,
    enum: ['ct', 'assignment', 'mid', 'final'],
    index: true
  },
  maxMarks: { type: Number, required: true },
  records: [marksRecordSchema],
  statistics: {
    totalStudents: Number,
    totalEntered: Number,
    average: Number,
    highest: Number,
    lowest: Number,
    passCount: Number,
    passRate: Number
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
marksSchema.index({ courseCode: 1, section: 1, evaluationType: 1 });

const Marks = mongoose.model('Marks', marksSchema);

module.exports = Marks;
