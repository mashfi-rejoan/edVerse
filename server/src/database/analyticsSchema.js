const mongoose = require('mongoose');

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  featureName: { type: String, required: true }, // 'Complaints', 'Library', 'BloodDonation', 'Cafeteria', etc.
  totalUsers: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  totalRequests: { type: Number, default: 0 },
  successfulRequests: { type: Number, default: 0 },
  failedRequests: { type: Number, default: 0 },
  averageResponseTime: { type: Number, default: 0 }, // in milliseconds
  customMetrics: { type: Map, of: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
