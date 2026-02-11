import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  studentId: mongoose.Types.ObjectId;
  courseCode: string;
  section: string;
  semester: string;
  academicYear: string;
  enrollmentDate: Date;
  status: 'Active' | 'Dropped' | 'Completed' | 'Withdrawn';
  grade?: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F' | 'I' | 'W';
  gradePoint?: number;
  attendance: number;
  midtermMarks?: number;
  finalMarks?: number;
  totalMarks?: number;
  droppedDate?: Date;
  completedDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required']
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      uppercase: true,
      trim: true,
      ref: 'Course'
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      uppercase: true,
      trim: true
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
      trim: true
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Active', 'Dropped', 'Completed', 'Withdrawn'],
      default: 'Active'
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'I', 'W']
    },
    gradePoint: {
      type: Number,
      min: 0,
      max: 4.0
    },
    attendance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    midtermMarks: {
      type: Number,
      min: 0,
      max: 100
    },
    finalMarks: {
      type: Number,
      min: 0,
      max: 100
    },
    totalMarks: {
      type: Number,
      min: 0,
      max: 100
    },
    droppedDate: {
      type: Date
    },
    completedDate: {
      type: Date
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for unique enrollment
EnrollmentSchema.index({ studentId: 1, courseCode: 1, semester: 1, academicYear: 1 }, { unique: true });
EnrollmentSchema.index({ studentId: 1 });
EnrollmentSchema.index({ courseCode: 1, section: 1 });
EnrollmentSchema.index({ status: 1 });

// Calculate grade point based on grade
EnrollmentSchema.pre('save', function(next) {
  if (this.grade) {
    const gradePoints: Record<string, number> = {
      'A+': 4.0, 'A': 3.75, 'A-': 3.5,
      'B+': 3.25, 'B': 3.0, 'B-': 2.75,
      'C+': 2.5, 'C': 2.25, 'C-': 2.0,
      'D+': 1.75, 'D': 1.5, 'F': 0, 'I': 0, 'W': 0
    };
    this.gradePoint = gradePoints[this.grade] || 0;
  }
  next();
});

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
