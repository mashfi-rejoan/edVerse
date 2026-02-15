const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

// Semester Schema
const SemesterSchema = new Schema({
  name: { type: String, required: true }, // e.g., "Fall 2025"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  addDropDeadline: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
}, { timestamps: true });

// Course Schema
const CourseSchema = new Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  credits: { type: Number, required: true },
  department: { type: String, required: true },
  instructor: { type: String },
  capacity: { type: Number, required: true },
  prerequisites: [{ type: String }], // Array of course codes
  prerequisiteType: { type: String, enum: ['All', 'Any'], default: 'All' }, // All or any prerequisites required
  retakeAllowed: { type: Boolean, default: true }, // For retake eligibility
  retakeLimit: { type: Number, default: 2 }, // Max retakes allowed per course
  minGradeForRetake: { type: String, default: 'F' }, // Grade threshold for retake eligibility
  semester: { type: Types.ObjectId, ref: 'Semester', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Student Schema
const StudentSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  currentSemester: { type: Types.ObjectId, ref: 'Semester' },
  totalCreditsThisSemester: { type: Number, default: 0 }, // For credit limit validation
  maxCreditsPerSemester: { type: Number, default: 24 }, // Configurable per student if needed
}, { timestamps: true });

// Enrollment Schema
const EnrollmentSchema = new Schema({
  student: { type: Types.ObjectId, ref: 'Student', required: true },
  course: { type: Types.ObjectId, ref: 'Course', required: true },
  semester: { type: Types.ObjectId, ref: 'Semester', required: true },
  status: { type: String, enum: ['Enrolled', 'Dropped', 'Retake', 'Improve', 'Completed'], default: 'Enrolled' },
  grade: { type: String },
  requestType: { type: String, enum: ['Add', 'Drop', 'Retake', 'Improve'], required: true },
  requestStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  requestedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  retakeCount: { type: Number, default: 0 }, // Track how many times retaken
  prerequisiteStatus: { type: String, enum: ['Met', 'Not Met'], default: 'Not Met' }, // For prerequisite validation
}, { timestamps: true });

// Retake History Schema
const RetakeHistorySchema = new Schema({
  student: { type: Types.ObjectId, ref: 'Student', required: true },
  course: { type: Types.ObjectId, ref: 'Course', required: true },
  semester: { type: Types.ObjectId, ref: 'Semester', required: true },
  originalGrade: { type: String, required: true },
  retakeGrade: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
  requestedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = {
  Semester: mongoose.models.Semester || mongoose.model('Semester', SemesterSchema),
  Course: mongoose.models.Course || mongoose.model('Course', CourseSchema),
  Student: mongoose.models.Student || mongoose.model('Student', StudentSchema),
  Enrollment: mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema),
  RetakeHistory: mongoose.models.RetakeHistory || mongoose.model('RetakeHistory', RetakeHistorySchema),
};
