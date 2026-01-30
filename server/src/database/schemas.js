// Database schemas for shared modules and role-specific features

const mongoose = require('mongoose');

// Complaints Schema
const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Academic', 'Facility', 'Faculty', 'Administration', 'Technical', 'Harassment', 'Other'], 
    default: 'Other'
  },
  status: { type: String, enum: ['Pending', 'Resolved', 'Withdrawn'], default: 'Pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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