import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  universityId: string;
  password: string;
  role: 'admin' | 'student' | 'teacher' | 'moderator' | 'cafeteria-manager' | 'librarian';
  phone?: string;
  photoUrl?: string;
  bloodGroup?: string;
  isBloodDonor: boolean;
  bloodDonorAvailable: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
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
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    universityId: {
      type: String,
      required: [true, 'University ID is required'],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'teacher', 'moderator', 'cafeteria-manager', 'librarian'],
      default: 'student'
    },
    phone: {
      type: String,
      trim: true
    },
    photoUrl: {
      type: String,
      trim: true
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
    },
    isBloodDonor: {
      type: Boolean,
      default: false
    },
    bloodDonorAvailable: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Set blood donor flags based on blood group
UserSchema.pre('save', function (next) {
  if (this.bloodGroup && this.bloodGroup !== '') {
    this.isBloodDonor = true;
  }
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
