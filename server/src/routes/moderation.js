const express = require('express');
const router = express.Router();
const Moderation = require('../database/moderationSchema');
const Notification = require('../database/notificationSchema');

// Get all pending moderation items
router.get('/pending', async (req, res) => {
  try {
    const pendingItems = await Moderation.find({ status: 'Pending' }).sort({ submittedAt: -1 });
    res.status(200).json(pendingItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get moderation items by type
router.get('/type/:itemType', async (req, res) => {
  try {
    const items = await Moderation.find({ itemType: req.params.itemType }).sort({ submittedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit item for moderation
router.post('/', async (req, res) => {
  try {
    const moderation = new Moderation(req.body);
    await moderation.save();
    
    // Create notification for moderators
    // In production, you'd fetch actual moderator IDs from user database
    // For now, we'll create a placeholder notification
    
    res.status(201).json(moderation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Approve item
router.patch('/:id/approve', async (req, res) => {
  try {
    const moderation = await Moderation.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Approved',
        reviewedBy: req.body.reviewedBy,
        reviewedAt: new Date(),
      },
      { new: true }
    );
    res.status(200).json(moderation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reject item
router.patch('/:id/reject', async (req, res) => {
  try {
    const moderation = await Moderation.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Rejected',
        reason: req.body.reason,
        reviewedBy: req.body.reviewedBy,
        reviewedAt: new Date(),
      },
      { new: true }
    );
    res.status(200).json(moderation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
