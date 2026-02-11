import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceRecord {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  universityId: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  markedAt: Date;
  remarks?: string;
}

export interface IAttendance extends Document {
  courseCode: string;
  courseName: string;
  section: string;
  date: Date;
  semester: string;
  academicYear: string;
  classType: 'Lecture' | 'Lab' | 'Tutorial';
  students: IAttendanceRecord[];
  markedBy: mongoose.Types.ObjectId;
  markedByName: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
  isFinalized: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    studentName: {
      type: String,
      required: true,
      trim: true
    },
    universityId: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ['Present', 'Absent', 'Late', 'Excused'],
      default: 'Absent'
    },
    markedAt: {
      type: Date,
      default: Date.now
    },
    remarks: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const AttendanceSchema = new Schema<IAttendance>(
  {
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
      required: [true, 'Date is required']
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
    classType: {
      type: String,
      required: [true, 'Class type is required'],
      enum: ['Lecture', 'Lab', 'Tutorial'],
      default: 'Lecture'
    },
    students: [AttendanceRecordSchema],
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true
    },
    markedByName: {
      type: String,
      required: true,
      trim: true
    },
    totalPresent: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAbsent: {
      type: Number,
      default: 0,
      min: 0
    },
    totalLate: {
      type: Number,
      default: 0,
      min: 0
    },
    totalExcused: {
      type: Number,
      default: 0,
      min: 0
    },
    isFinalized: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes for performance
AttendanceSchema.index({ courseCode: 1, section: 1 });
AttendanceSchema.index({ date: 1 });
AttendanceSchema.index({ semester: 1, academicYear: 1 });
AttendanceSchema.index({ markedBy: 1 });

// Compound index for unique attendance per course-section-date
AttendanceSchema.index({ courseCode: 1, section: 1, date: 1, classType: 1 }, { unique: true });

// Calculate totals before saving
AttendanceSchema.pre('save', function(next) {
  this.totalPresent = this.students.filter(s => s.status === 'Present').length;
  this.totalAbsent = this.students.filter(s => s.status === 'Absent').length;
  this.totalLate = this.students.filter(s => s.status === 'Late').length;
  this.totalExcused = this.students.filter(s => s.status === 'Excused').length;
  next();
});

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
