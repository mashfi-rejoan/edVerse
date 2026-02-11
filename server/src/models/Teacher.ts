import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  universityId: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer' | 'Senior Lecturer';
  department: string;
  specialization?: string;
  qualifications: string[];
  assignedCourses: Array<{
    courseCode: string;
    section: string;
    semester: string;
    academicYear: string;
  }>;
  workload: number; // Number of credit hours
  maxWorkload: number;
  officeRoom?: string;
  officeHours?: string;
  status: 'Active' | 'On Leave' | 'Retired';
  bloodGroup?: string;
  dateOfJoining: Date;
  experience: number; // Years of experience
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    universityId: {
      type: String,
      required: [true, 'University ID is required'],
      unique: true,
      trim: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Senior Lecturer']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    specialization: {
      type: String,
      trim: true
    },
    qualifications: [{
      type: String,
      trim: true
    }],
    assignedCourses: [{
      courseCode: { type: String, required: true },
      section: { type: String, required: true },
      semester: { type: String, required: true },
      academicYear: { type: String, required: true }
    }],
    workload: {
      type: Number,
      default: 0,
      min: 0
    },
    maxWorkload: {
      type: Number,
      default: 12,
      min: 0
    },
    officeRoom: {
      type: String,
      trim: true
    },
    officeHours: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Retired'],
      default: 'Active'
    },
    bloodGroup: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      trim: true
    },
    dateOfJoining: {
      type: Date,
      default: Date.now
    },
    experience: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for performance
TeacherSchema.index({ universityId: 1 });
TeacherSchema.index({ department: 1 });
TeacherSchema.index({ status: 1 });
TeacherSchema.index({ email: 1 });

// Validate workload doesn't exceed max
TeacherSchema.pre('save', function(next) {
  if (this.workload > this.maxWorkload) {
    return next(new Error('Workload cannot exceed maximum workload'));
  }
  next();
});

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);
