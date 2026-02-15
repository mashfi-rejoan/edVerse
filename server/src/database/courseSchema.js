// Course Management Schemas
const mongoose = require('mongoose');

// Course Schema
const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instructorName: { type: String },
  credits: { type: Number, required: true, default: 3 },
  department: { type: String },
  description: { type: String },
  category: { type: String },
  courseType: { type: String, enum: ['Theory', 'Lab'], default: 'Theory' },
  prerequisite: { type: String },
  bnqfCode: { type: String },
  level: { type: Number },
  term: { type: Number },
  semester: { 
    type: String, 
    required: true,
    enum: ['Spring', 'Summer', 'Fall']
  },
  year: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Enrollment Schema - tracks student course registrations
const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { 
    type: String, 
    required: true,
    enum: ['Spring', 'Summer', 'Fall']
  },
  year: { type: Number, required: true },
  grade: { type: String, enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'W', 'I', 'P', ''], default: '' },
  status: { 
    type: String, 
    enum: ['Enrolled', 'Dropped', 'Completed', 'Retake'], 
    default: 'Enrolled' 
  },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

// Course Material Schema
const courseMaterialSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['Lecture', 'Assignment', 'Quiz', 'Exam', 'Reading', 'Video', 'Other'],
    default: 'Lecture'
  },
  fileUrl: { type: String },
  dueDate: { type: Date },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

// Assignment Submission Schema
const assignmentSubmissionSchema = new mongoose.Schema({
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseMaterial', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submissionText: { type: String },
  fileUrl: { type: String },
  grade: { type: Number, min: 0, max: 100 },
  feedback: { type: String },
  submittedAt: { type: Date, default: Date.now },
  gradedAt: { type: Date },
});

// Add indexes for better query performance
courseSchema.index({ semester: 1, year: 1, isActive: 1 });
enrollmentSchema.index({ student: 1, semester: 1, year: 1 });
enrollmentSchema.index({ course: 1 });
courseMaterialSchema.index({ course: 1, createdAt: -1 });
assignmentSubmissionSchema.index({ material: 1, student: 1 });

module.exports = {
  Course: mongoose.models.Course || mongoose.model('Course', courseSchema),
  Enrollment: mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema),
  CourseMaterial: mongoose.models.CourseMaterial || mongoose.model('CourseMaterial', courseMaterialSchema),
  AssignmentSubmission: mongoose.models.AssignmentSubmission || mongoose.model('AssignmentSubmission', assignmentSubmissionSchema),
};
