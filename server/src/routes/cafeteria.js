const express = require('express');
const router = express.Router();
const CafeteriaItem = require('../database/cafeteriaSchema');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await CafeteriaItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get items by category
router.get('/category/:category', async (req, res) => {
  try {
    const items = await CafeteriaItem.find({ category: req.params.category });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new menu item
router.post('/', async (req, res) => {
  try {
    const item = new CafeteriaItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add review and rating
router.post('/:id/review', async (req, res) => {
  try {
    const item = await CafeteriaItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.reviews.push({ ...req.body, date: new Date() });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update item details
router.patch('/:id', async (req, res) => {
  try {
    const item = await CafeteriaItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
