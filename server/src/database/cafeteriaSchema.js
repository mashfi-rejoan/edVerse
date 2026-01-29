const mongoose = require('mongoose');

// Cafeteria Schema
const cafeteriaSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: ['Breakfast', 'Lunch', 'Snacks', 'Beverages'], required: true },
  availableQuantity: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{ user: String, rating: Number, comment: String, date: Date }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

cafeteriaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.reviews.length > 0) {
    const avgRating = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
    this.rating = Math.round(avgRating * 10) / 10;
  }
  next();
});

module.exports = mongoose.model('CafeteriaItem', cafeteriaSchema);
