const mongoose = require('mongoose');

// Chatbot Schema
const chatbotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userMessage: { type: String, required: true },
  botResponse: { type: String, required: true },
  category: { type: String, enum: ['General', 'Academic', 'Complaint', 'Library', 'Cafeteria'], default: 'General' },
  resolved: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatbotInteraction', chatbotSchema);
