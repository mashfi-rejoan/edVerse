import mongoose, { Schema, Document } from 'mongoose';

export interface IBloodDonor extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  bloodType: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
  userType: 'Student' | 'Teacher' | 'Staff';
  universityId?: string;
  batch?: string;
  department?: string;
  lastDonated?: Date;
  availableForDonation: boolean;
  willingToDonate: boolean;
  location: string;
  emergencyContact: string;
  medicalConditions?: string;
  donationHistory: Array<{
    date: Date;
    location: string;
    recipient?: string;
    notes?: string;
  }>;
  totalDonations: number;
  registeredDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BloodDonorSchema = new Schema<IBloodDonor>(
  {
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
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true
    },
    bloodType: {
      type: String,
      required: [true, 'Blood type is required'],
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
    },
    userType: {
      type: String,
      required: [true, 'User type is required'],
      enum: ['Student', 'Teacher', 'Staff']
    },
    universityId: {
      type: String,
      trim: true
    },
    batch: {
      type: String,
      trim: true
    },
    department: {
      type: String,
      trim: true
    },
    lastDonated: {
      type: Date
    },
    availableForDonation: {
      type: Boolean,
      default: true
    },
    willingToDonate: {
      type: Boolean,
      default: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    emergencyContact: {
      type: String,
      required: [true, 'Emergency contact is required'],
      trim: true
    },
    medicalConditions: {
      type: String,
      trim: true
    },
    donationHistory: [{
      date: {
        type: Date,
        required: true
      },
      location: {
        type: String,
        required: true,
        trim: true
      },
      recipient: {
        type: String,
        trim: true
      },
      notes: {
        type: String,
        trim: true
      }
    }],
    totalDonations: {
      type: Number,
      default: 0,
      min: 0
    },
    registeredDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes for performance
BloodDonorSchema.index({ bloodType: 1 });
BloodDonorSchema.index({ availableForDonation: 1, willingToDonate: 1 });
BloodDonorSchema.index({ userType: 1 });
BloodDonorSchema.index({ userId: 1 });

// Update availability based on last donation date (must wait 3 months)
BloodDonorSchema.pre('save', function(next) {
  if (this.lastDonated) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    if (this.lastDonated > threeMonthsAgo) {
      this.availableForDonation = false;
    } else if (this.willingToDonate) {
      this.availableForDonation = true;
    }
  }
  
  this.totalDonations = this.donationHistory.length;
  next();
});

export default mongoose.model<IBloodDonor>('BloodDonor', BloodDonorSchema);
