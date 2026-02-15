// Database schemas for shared modules and role-specific features

const mongoose = require('mongoose');

// Complaints Schema
const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Academic', 'Facility', 'Lost and Found', 'Faculty', 'Administration', 'Technical', 'Harassment', 'Other'], 
    default: 'Other'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Withdrawn', 'Pending'],
    default: 'Open'
  },
  isAnonymous: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedByName: { type: String },
  submittedRole: { type: String, enum: ['Student', 'Teacher', 'Staff'], default: 'Student' },
  assignedTo: { type: String },
  assignedAt: { type: Date },
  resolution: { type: String },
  resolvedAt: { type: Date },
  comments: [
    {
      author: { type: String, required: true },
      time: { type: Date, default: Date.now },
      text: { type: String, required: true }
    }
  ],
  withdrawnAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add middleware to handle timestamps
complaintSchema.pre('save', function(next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

// Library Schema
const librarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String },
  availableCopies: { type: Number, default: 1 },
  totalCopies: { type: Number, required: true },
});

// Add middleware to handle validation logic
librarySchema.pre('save', function(next) {
  if (this.availableCopies > this.totalCopies) {
    return next(new Error('Available copies cannot exceed total copies'));
  }
  next();
});

module.exports = {
  Complaint: mongoose.model('Complaint', complaintSchema),
  Library: mongoose.model('Library', librarySchema),
};