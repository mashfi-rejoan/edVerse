const mongoose = require('mongoose');

const roomBookingSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    index: true
  },
  roomName: {
    type: String,
    required: true
  },
  bookedBy: {
    type: String,
    required: true,
    index: true
  },
  teacherName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  purpose: {
    type: String,
    enum: ['Extra Class', 'Meeting', 'Lab Session', 'Project Work', 'Guest Lecture', 'Exam', 'Other'],
    required: true
  },
  courseCode: {
    type: String,
    default: null
  },
  courseName: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  notes: {
    type: String,
    default: ''
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

// Compound index for finding bookings by room and date
roomBookingSchema.index({ roomNumber: 1, date: 1 });
// Index for finding teacher's bookings
roomBookingSchema.index({ bookedBy: 1, date: 1 });

module.exports = mongoose.model('RoomBooking', roomBookingSchema);
