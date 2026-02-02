const express = require('express');
const Room = require('../models/Room');
const RoomBooking = require('../models/RoomBooking');

const router = express.Router();

// Middleware to check for conflicts
const checkRoomConflict = async (roomNumber, date, startTime, endTime, excludeId = null) => {
  const query = {
    roomNumber,
    date: {
      $gte: new Date(date),
      $lt: new Date(new Date(date).getTime() + 86400000)
    },
    status: { $ne: 'cancelled' }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const bookings = await RoomBooking.find(query);
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  for (const booking of bookings) {
    const [bStartHour, bStartMin] = booking.startTime.split(':').map(Number);
    const [bEndHour, bEndMin] = booking.endTime.split(':').map(Number);
    const bStartMinutes = bStartHour * 60 + bStartMin;
    const bEndMinutes = bEndHour * 60 + bEndMin;

    // Check overlap
    if (startMinutes < bEndMinutes && endMinutes > bStartMinutes) {
      return true; // Conflict exists
    }
  }

  return false; // No conflict
};

// GET all rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true, maintenanceStatus: 'active' }).sort('roomNumber');
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET available rooms for specific date and time
router.get('/rooms/available', async (req, res) => {
  try {
    const { date, startTime, endTime } = req.query;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'Date, startTime, and endTime are required'
      });
    }

    const rooms = await Room.find({ isAvailable: true, maintenanceStatus: 'active' });
    
    const availableRooms = [];
    for (const room of rooms) {
      const hasConflict = await checkRoomConflict(room.roomNumber, date, startTime, endTime);
      if (!hasConflict) {
        availableRooms.push(room);
      }
    }

    res.json({ success: true, data: availableRooms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST check room availability
router.post('/rooms/check-availability', async (req, res) => {
  try {
    const { roomNumber, date, startTime, endTime } = req.body;

    if (!roomNumber || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'roomNumber, date, startTime, and endTime are required'
      });
    }

    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    const hasConflict = await checkRoomConflict(roomNumber, date, startTime, endTime);

    res.json({
      success: true,
      available: !hasConflict,
      message: hasConflict ? 'Room is already booked for this time' : 'Room is available'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create room booking
router.post('/room-booking', async (req, res) => {
  try {
    const { roomNumber, roomName, date, startTime, endTime, duration, purpose, courseCode, courseName, notes, bookedBy, teacherName } = req.body;

    // Validation
    if (!roomNumber || !date || !startTime || !endTime || !purpose) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check room exists
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    // Check for conflicts
    const hasConflict = await checkRoomConflict(roomNumber, date, startTime, endTime);
    if (hasConflict) {
      return res.status(409).json({
        success: false,
        error: 'Room is already booked for this time slot'
      });
    }

    // Create booking
    const booking = new RoomBooking({
      roomNumber,
      roomName,
      bookedBy,
      teacherName,
      date: new Date(date),
      startTime,
      endTime,
      duration,
      purpose,
      courseCode,
      courseName,
      notes
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Room booked successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET teacher's bookings
router.get('/room-booking', async (req, res) => {
  try {
    const { bookedBy } = req.query;

    if (!bookedBy) {
      return res.status(400).json({ success: false, error: 'bookedBy parameter is required' });
    }

    const bookings = await RoomBooking.find({ bookedBy }).sort({ date: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single booking
router.get('/room-booking/:id', async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH update booking
router.patch('/room-booking/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateData = {};

    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const booking = await RoomBooking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE cancel booking
router.delete('/room-booking/:id', async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Set status to cancelled instead of deleting
    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST initialize mock rooms (only for development)
router.post('/rooms/init-mock-data', async (req, res) => {
  try {
    // Check if rooms already exist
    const existingRooms = await Room.countDocuments();
    if (existingRooms > 0) {
      return res.json({ success: true, message: 'Mock data already initialized' });
    }

    const mockRooms = [
      {
        roomNumber: '301',
        roomName: 'Computer Lab A',
        building: 'Building A',
        floor: 3,
        capacity: 40,
        type: 'lab',
        facilities: ['Computers', 'Projector', 'AC', 'WiFi'],
        isAvailable: true,
        maintenanceStatus: 'active'
      },
      {
        roomNumber: '204',
        roomName: 'Classroom B',
        building: 'Building A',
        floor: 2,
        capacity: 50,
        type: 'classroom',
        facilities: ['Projector', 'Whiteboard', 'AC'],
        isAvailable: true,
        maintenanceStatus: 'active'
      },
      {
        roomNumber: '105',
        roomName: 'Seminar Hall',
        building: 'Building B',
        floor: 1,
        capacity: 25,
        type: 'seminar',
        facilities: ['Projector', 'AC', 'WiFi', 'Video Conference'],
        isAvailable: true,
        maintenanceStatus: 'active'
      },
      {
        roomNumber: '401',
        roomName: 'Auditorium',
        building: 'Building C',
        floor: 4,
        capacity: 200,
        type: 'auditorium',
        facilities: ['Sound System', 'Projector', 'Stage', 'AC'],
        isAvailable: true,
        maintenanceStatus: 'active'
      }
    ];

    await Room.insertMany(mockRooms);

    res.json({
      success: true,
      message: 'Mock rooms initialized successfully',
      data: mockRooms
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
