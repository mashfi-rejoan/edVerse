import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  scope: 'All' | 'Students' | 'Teachers' | 'Department' | 'Batch' | 'Section';
  targetDepartment?: string;
  targetBatch?: string;
  targetSection?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Draft' | 'Published' | 'Archived';
  createdBy: mongoose.Types.ObjectId;
  publishedDate?: Date;
  expiryDate?: Date;
  attachments?: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    scope: {
      type: String,
      required: [true, 'Scope is required'],
      enum: ['All', 'Students', 'Teachers', 'Department', 'Batch', 'Section'],
      default: 'All'
    },
    targetDepartment: {
      type: String,
      trim: true
    },
    targetBatch: {
      type: String,
      trim: true
    },
    targetSection: {
      type: String,
      uppercase: true,
      trim: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft'
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    publishedDate: {
      type: Date
    },
    expiryDate: {
      type: Date
    },
    attachments: [{
      type: String,
      trim: true
    }],
    views: {
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
AnnouncementSchema.index({ status: 1, publishedDate: -1 });
AnnouncementSchema.index({ scope: 1 });
AnnouncementSchema.index({ priority: 1 });
AnnouncementSchema.index({ createdBy: 1 });
AnnouncementSchema.index({ expiryDate: 1 });

// Auto-set publishedDate when status changes to Published
AnnouncementSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'Published' && !this.publishedDate) {
    this.publishedDate = new Date();
  }
  next();
});

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
