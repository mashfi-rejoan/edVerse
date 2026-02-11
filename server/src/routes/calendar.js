const express = require('express');
const CalendarEvent = require('../models/CalendarEvent');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// Get events for a date range (students/teachers/admin: read-only)
router.get('/events', authenticate, async (req, res) => {
  try {
    const fromDate = parseDate(req.query.from);
    const toDate = parseDate(req.query.to);

    const query = {};

    if (fromDate && toDate) {
      query.$and = [
        { startDate: { $lte: toDate } },
        {
          $or: [
            { endDate: { $gte: fromDate } },
            { $and: [{ endDate: { $exists: false } }, { startDate: { $gte: fromDate } }] },
            { $and: [{ endDate: null }, { startDate: { $gte: fromDate } }] }
          ]
        }
      ];
    } else if (fromDate) {
      query.startDate = { $gte: fromDate };
    } else if (toDate) {
      query.startDate = { $lte: toDate };
    }

    const events = await CalendarEvent.find(query).sort({ startDate: 1 });
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch calendar events' });
  }
});

// Create event (admin only)
router.post('/events', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, description, startDate, endDate, category, location, allDay } = req.body;

    if (!title || !startDate) {
      return res.status(400).json({ success: false, message: 'Title and start date are required.' });
    }

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start) {
      return res.status(400).json({ success: false, message: 'Invalid start date.' });
    }

    if (end && end < start) {
      return res.status(400).json({ success: false, message: 'End date cannot be earlier than start date.' });
    }

    const event = new CalendarEvent({
      title,
      description,
      startDate: start,
      endDate: end || undefined,
      category,
      location,
      allDay: allDay !== false,
      createdBy: req.userId
    });

    await event.save();
    res.json({ success: true, data: event });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ success: false, message: 'Failed to create calendar event' });
  }
});

// Update event (admin only)
router.put('/events/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, category, location, allDay } = req.body;

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!title || !start) {
      return res.status(400).json({ success: false, message: 'Title and start date are required.' });
    }

    if (end && end < start) {
      return res.status(400).json({ success: false, message: 'End date cannot be earlier than start date.' });
    }

    const updated = await CalendarEvent.findByIdAndUpdate(
      id,
      {
        title,
        description,
        startDate: start,
        endDate: end || undefined,
        category,
        location,
        allDay: allDay !== false,
        updatedBy: req.userId
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({ success: false, message: 'Failed to update calendar event' });
  }
});

// Delete event (admin only)
router.delete('/events/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CalendarEvent.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ success: false, message: 'Failed to delete calendar event' });
  }
});

module.exports = router;
