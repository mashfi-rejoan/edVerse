const express = require('express');
const router = express.Router();
const { Complaint, Library } = require('../database/schemas');

// Complaints Endpoints
router.post('/complaints', async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Withdraw complaint endpoint
router.patch('/complaints/:id/withdraw', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    if (complaint.status === 'Resolved') {
      return res.status(400).json({ error: 'Cannot withdraw resolved complaint' });
    }
    
    // Use findByIdAndUpdate to bypass validation for old complaints without category
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Withdrawn',
        withdrawnAt: new Date(),
        updatedAt: new Date(),
        // Set category to 'Other' if it doesn't exist
        $setOnInsert: { category: 'Other' }
      },
      { new: true, runValidators: false }
    );
    
    res.status(200).json({ message: 'Complaint withdrawn successfully', complaint: updatedComplaint });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Library Endpoints
router.post('/library', async (req, res) => {
  try {
    const book = new Library(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/library', async (req, res) => {
  try {
    const books = await Library.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;