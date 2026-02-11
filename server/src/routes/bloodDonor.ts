import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import BloodDonor from '../models/BloodDonor';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

// All blood donation routes require authentication
router.use(authenticate);

// Get all blood donors
router.get('/donors', async (req: AuthRequest, res: Response) => {
  try {
    const { bloodType, availableOnly } = req.query;
    const query: any = {};

    if (bloodType) {
      query.bloodType = bloodType;
    }

    if (availableOnly === 'true') {
      query.availableForDonation = true;
      query.willingToDonate = true;
    }

    const donors = await BloodDonor.find(query)
      .select('-donationHistory') // Don't send full history
      .sort({ totalDonations: -1 });

    res.status(200).json({
      success: true,
      data: donors
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch donors'
    });
  }
});

// Register as blood donor
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    // Check if already registered
    const existing = await BloodDonor.findOne({ userId: req.userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Already registered as blood donor'
      });
    }

    const donor = await BloodDonor.create({
      ...req.body,
      userId: req.userId
    });

    res.status(201).json({
      success: true,
      data: donor,
      message: 'Registered as blood donor successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to register as donor'
    });
  }
});

// Update donor profile
router.put('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const donor = await BloodDonor.findOneAndUpdate(
      { userId: req.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: donor,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update profile'
    });
  }
});

// Get my donor profile
router.get('/my-profile', async (req: AuthRequest, res: Response) => {
  try {
    const donor = await BloodDonor.findOne({ userId: req.userId });

    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch profile'
    });
  }
});

// Record a donation
router.post('/record-donation', async (req: AuthRequest, res: Response) => {
  try {
    const donor = await BloodDonor.findOne({ userId: req.userId });

    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor profile not found'
      });
    }

    donor.donationHistory.push({
      date: req.body.date || new Date(),
      location: req.body.location,
      recipient: req.body.recipient,
      notes: req.body.notes
    });

    donor.lastDonated = req.body.date || new Date();
    await donor.save();

    res.status(200).json({
      success: true,
      data: donor,
      message: 'Donation recorded successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to record donation'
    });
  }
});

// Search donors by blood type
router.get('/search/:bloodType', async (req: AuthRequest, res: Response) => {
  try {
    const donors = await BloodDonor.find({
      bloodType: req.params.bloodType,
      availableForDonation: true,
      willingToDonate: true
    }).select('-donationHistory');

    res.status(200).json({
      success: true,
      data: donors
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to search donors'
    });
  }
});

export default router;
