import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  universityId: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  batch: string;
  section: string;
  semester: number;
  cgpa: number;
  totalCredits: number;
  completedCredits: number;
  enrolledCourses: Array<{
    courseCode: string;
    section: string;
    semester: string;
    academicYear: string;
  }>;
  academicStanding: 'Good' | 'Warning' | 'Probation';
  status: 'Active' | 'Graduated' | 'Suspended' | 'On Leave';
  bloodGroup?: string;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
  dateOfBirth?: Date;
  admissionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
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
    batch: {
      type: String,
      required: [true, 'Batch is required'],
      trim: true
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
      uppercase: true
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    cgpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 4.0
    },
    totalCredits: {
      type: Number,
      default: 0,
      min: 0
    },
    completedCredits: {
      type: Number,
      default: 0,
      min: 0
    },
    enrolledCourses: [{
      courseCode: { type: String, required: true },
      section: { type: String, required: true },
      semester: { type: String, required: true },
      academicYear: { type: String, required: true }
    }],
    academicStanding: {
      type: String,
      enum: ['Good', 'Warning', 'Probation'],
      default: 'Good'
    },
    status: {
      type: String,
      enum: ['Active', 'Graduated', 'Suspended', 'On Leave'],
      default: 'Active'
    },
    bloodGroup: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      trim: true
    },
    guardianName: {
      type: String,
      trim: true
    },
    guardianPhone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    admissionDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes for performance
StudentSchema.index({ universityId: 1 });
StudentSchema.index({ batch: 1, section: 1 });
StudentSchema.index({ status: 1 });
StudentSchema.index({ email: 1 });

// Update academic standing based on CGPA
StudentSchema.pre('save', function(next) {
  if (this.cgpa >= 2.5) {
    this.academicStanding = 'Good';
  } else if (this.cgpa >= 2.0) {
    this.academicStanding = 'Warning';
  } else {
    this.academicStanding = 'Probation';
  }
  next();
});

export default mongoose.model<IStudent>('Student', StudentSchema);
