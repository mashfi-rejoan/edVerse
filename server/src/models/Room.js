const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  roomName: {
    type: String,
    required: true
  },
  building: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['classroom', 'lab', 'seminar', 'auditorium'],
    default: 'classroom'
  },
  facilities: [{
    type: String,
    default: []
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  maintenanceStatus: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for faster queries
roomSchema.index({ building: 1, floor: 1 });
roomSchema.index({ type: 1, isAvailable: 1 });

module.exports = mongoose.model('Room', roomSchema);
