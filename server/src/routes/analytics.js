const express = require('express');
const router = express.Router();
const Analytics = require('../database/analyticsSchema');

// Get analytics for a specific feature
router.get('/feature/:featureName', async (req, res) => {
  try {
    const analytics = await Analytics.find({ featureName: req.params.featureName }).sort({ date: -1 });
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics for a date range
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, featureName } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    if (featureName) {
      query.featureName = featureName;
    }
    
    const analytics = await Analytics.find(query).sort({ date: -1 });
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record analytics event
router.post('/', async (req, res) => {
  try {
    const analytics = new Analytics(req.body);
    await analytics.save();
    res.status(201).json(analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get dashboard summary (all features)
router.get('/dashboard/summary', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const summary = await Analytics.aggregate([
      { $match: { date: { $gte: today } } },
      {
        $group: {
          _id: '$featureName',
          totalUsers: { $sum: '$totalUsers' },
          activeUsers: { $sum: '$activeUsers' },
          totalRequests: { $sum: '$totalRequests' },
          successfulRequests: { $sum: '$successfulRequests' },
          failedRequests: { $sum: '$failedRequests' },
        },
      },
    ]);
    
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
