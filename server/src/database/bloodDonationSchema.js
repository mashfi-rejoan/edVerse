const mongoose = require('mongoose');

// Blood Donation Schema
const bloodDonationSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  donorName: { type: String, required: true },
  bloodType: { type: String, enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'], required: true },
  contact: { type: String, required: true },
  currentAddress: { type: String, required: true },
  lastDonationDate: { type: Date },
  nextEligibleDate: { type: Date },
  quantity: { type: Number, default: 450 }, // in ml
  isAvailable: { type: Boolean, default: true },
  status: { type: String, enum: ['Available', 'Used', 'Expired'], default: 'Available' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

bloodDonationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.lastDonationDate) {
    const nextDate = new Date(this.lastDonationDate);
    nextDate.setDate(nextDate.getDate() + 56); // 56 days for blood donation eligibility
    this.nextEligibleDate = nextDate;
  }
  next();
});

module.exports = mongoose.model('BloodDonation', bloodDonationSchema);
