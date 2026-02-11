const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    category: {
      type: String,
      enum: ['Event', 'Holiday', 'Exam', 'Academic', 'Notice', 'Deadline'],
      default: 'Event'
    },
    location: { type: String, trim: true },
    allDay: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

calendarEventSchema.index({ startDate: 1, endDate: 1 });
calendarEventSchema.index({ category: 1, startDate: 1 });

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

module.exports = CalendarEvent;
