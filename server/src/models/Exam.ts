import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  examType: 'Midterm' | 'Final' | 'Quiz' | 'Assignment';
  courseCode: string;
  courseName: string;
  section: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  room: string;
  semester: string;
  academicYear: string;
  totalMarks: number;
  assignedTeacher?: mongoose.Types.ObjectId;
  instructions?: string;
  status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    examType: {
      type: String,
      required: [true, 'Exam type is required'],
      enum: ['Midterm', 'Final', 'Quiz', 'Assignment']
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      uppercase: true,
      trim: true,
      ref: 'Course'
    },
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      uppercase: true,
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Exam date is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: 15,
      max: 300
    },
    room: {
      type: String,
      required: [true, 'Room is required'],
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
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      min: 0
    },
    assignedTeacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    instructions: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Scheduled'
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for performance
ExamSchema.index({ courseCode: 1, section: 1 });
ExamSchema.index({ date: 1 });
ExamSchema.index({ semester: 1, academicYear: 1 });
ExamSchema.index({ status: 1 });

// Compound index for unique exam per course-section-type-semester
ExamSchema.index({ courseCode: 1, section: 1, examType: 1, semester: 1, academicYear: 1 }, { unique: true });

export default mongoose.model<IExam>('Exam', ExamSchema);
