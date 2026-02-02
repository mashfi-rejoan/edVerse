const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userRole: { type: String, required: true, enum: ['student', 'teacher'] },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const attachmentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number },
  fileType: { type: String }
});

const submissionSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  files: [attachmentSchema],
  isLate: { type: Boolean, default: false }
});

const classroomPostSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, index: true },
  teacherName: { type: String, required: true },
  courseCode: { type: String, required: true, index: true },
  courseName: { type: String, required: true },
  sections: [{ type: String }], // ['A', 'B'] or ['All']
  type: { 
    type: String, 
    required: true,
    enum: ['announcement', 'material', 'assignment'],
    index: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  attachments: [attachmentSchema],
  dueDate: { type: Date },
  isPinned: { type: Boolean, default: false },
  viewedBy: [{ type: String }], // studentIds who viewed
  submissions: [submissionSchema], // Student submissions for assignments
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for efficient queries
classroomPostSchema.index({ courseCode: 1, createdAt: -1 });
classroomPostSchema.index({ isPinned: 1, createdAt: -1 });

const ClassroomPost = mongoose.model('ClassroomPost', classroomPostSchema);

module.exports = ClassroomPost;
