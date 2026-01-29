const mongoose = require('mongoose');

// Moderation Schema for Resources, Events, and Complaints
const moderationSchema = new mongoose.Schema({
  itemType: { type: String, enum: ['Resource', 'Event', 'Complaint'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String }, // For rejections
  content: { type: String }, // Stores the content to be moderated
  flags: [{ type: String }], // ['Inappropriate', 'Spam', 'Offensive', etc.]
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
});

module.exports = mongoose.model('Moderation', moderationSchema);
