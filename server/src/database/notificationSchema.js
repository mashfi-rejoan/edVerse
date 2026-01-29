const mongoose = require('mongoose');

// Notifications Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Complaint', 'Resource', 'Event', 'System'], required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // Reference to complaint, resource, or event
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // 30 days
});

module.exports = mongoose.model('Notification', notificationSchema);
