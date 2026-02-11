import mongoose, { Schema, Document } from 'mongoose';

export interface IRoutineEntry {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  room: string;
  teacherId?: mongoose.Types.ObjectId;
  teacherName?: string;
}

export interface IRoutine extends Document {
  batch: string;
  section: string;
  department: string;
  semester: string;
  academicYear: string;
  schedule: IRoutineEntry[];
  status: 'Draft' | 'Active' | 'Archived';
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdBy: mongoose.Types.ObjectId;
  lastModifiedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RoutineEntrySchema = new Schema<IRoutineEntry>(
  {
    day: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    courseCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    courseName: {
      type: String,
      required: true,
      trim: true
    },
    room: {
      type: String,
      required: true,
      trim: true
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    teacherName: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const RoutineSchema = new Schema<IRoutine>(
  {
    batch: {
      type: String,
      required: [true, 'Batch is required'],
      trim: true
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      uppercase: true,
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
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
    schedule: [RoutineEntrySchema],
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Archived'],
      default: 'Draft'
    },
    effectiveFrom: {
      type: Date,
      required: [true, 'Effective from date is required']
    },
    effectiveTo: {
      type: Date
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lastModifiedBy: {
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
RoutineSchema.index({ batch: 1, section: 1 });
RoutineSchema.index({ semester: 1, academicYear: 1 });
RoutineSchema.index({ status: 1 });
RoutineSchema.index({ effectiveFrom: 1, effectiveTo: 1 });

// Compound index for unique routine per batch-section-semester
RoutineSchema.index({ batch: 1, section: 1, semester: 1, academicYear: 1, status: 1 }, { unique: true });

export default mongoose.model<IRoutine>('Routine', RoutineSchema);
