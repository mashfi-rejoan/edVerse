import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
  courseCode: string;
  section: string;
  semester: string;
  academicYear: string;
  assignedTeacher?: mongoose.Types.ObjectId;
  enrolledStudents: mongoose.Types.ObjectId[];
  capacity: number;
  maxCapacity: number;
  schedule: Array<{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string;
    endTime: string;
    room: string;
  }>;
  status: 'Active' | 'Full' | 'Closed';
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema = new Schema<ISection>(
  {
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
    assignedTeacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    enrolledStudents: [{
      type: Schema.Types.ObjectId,
      ref: 'Student'
    }],
    capacity: {
      type: Number,
      default: 0,
      min: 0
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Max capacity is required'],
      default: 40,
      min: 1
    },
    schedule: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      room: {
        type: String,
        required: true,
        trim: true
      }
    }],
    status: {
      type: String,
      enum: ['Active', 'Full', 'Closed'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

// Compound index for unique section per course/semester
SectionSchema.index({ courseCode: 1, section: 1, semester: 1, academicYear: 1 }, { unique: true });
SectionSchema.index({ assignedTeacher: 1 });
SectionSchema.index({ status: 1 });

// Update status based on capacity
SectionSchema.pre('save', function(next) {
  this.capacity = this.enrolledStudents.length;
  
  if (this.status === 'Closed') {
    return next();
  }
  
  if (this.capacity >= this.maxCapacity) {
    this.status = 'Full';
  } else {
    this.status = 'Active';
  }
  
  next();
});

export default mongoose.model<ISection>('Section', SectionSchema);
