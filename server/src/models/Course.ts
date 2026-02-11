import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  courseCode: string;
  courseName: string;
  credits: number;
  semester: number;
  department: string;
  courseType: 'Theory' | 'Lab' | 'Theory + Lab' | 'Project';
  prerequisites: string[];
  description?: string;
  syllabus?: string;
  isOffering: boolean;
  maxStudents: number;
  academicYear: string;
  createdBy: mongoose.Types.ObjectId;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: 1,
      max: 4
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 12
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    courseType: {
      type: String,
      required: [true, 'Course type is required'],
      enum: ['Theory', 'Lab', 'Theory + Lab', 'Project'],
      default: 'Theory'
    },
    prerequisites: [{
      type: String,
      uppercase: true,
      trim: true
    }],
    description: {
      type: String,
      trim: true
    },
    syllabus: {
      type: String,
      trim: true
    },
    isOffering: {
      type: Boolean,
      default: true
    },
    maxStudents: {
      type: Number,
      default: 40,
      min: 1
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    archived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes for performance
CourseSchema.index({ courseCode: 1 });
CourseSchema.index({ semester: 1 });
CourseSchema.index({ department: 1 });
CourseSchema.index({ isOffering: 1 });
CourseSchema.index({ archived: 1 });

export default mongoose.model<ICourse>('Course', CourseSchema);
