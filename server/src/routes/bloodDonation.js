const express = require('express');
const router = express.Router();
const BloodDonation = require('../database/bloodDonationSchema');

// Get all blood donors
router.get('/', async (req, res) => {
  try {
    const donors = await BloodDonation.find();
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register a blood donor
router.post('/', async (req, res) => {
  try {
    const donation = new BloodDonation(req.body);
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get available donors by blood type
router.get('/available/:bloodType', async (req, res) => {
  try {
    const donors = await BloodDonation.find({
      bloodType: req.params.bloodType,
      status: 'Available',
    });
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update donation status
router.patch('/:id', async (req, res) => {
  try {
    const donation = await BloodDonation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
