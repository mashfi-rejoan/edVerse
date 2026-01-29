const express = require('express');
const router = express.Router();
const ChatbotInteraction = require('../database/chatbotSchema');

// Get chatbot history for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const interactions = await ChatbotInteraction.find({ userId: req.params.userId });
    res.status(200).json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message to chatbot
router.post('/message', async (req, res) => {
  try {
    const { userId, userMessage, category } = req.body;
    
    // Simple chatbot response logic - can be expanded with NLP/AI later
    let botResponse = 'Thank you for your message. Our support team will respond shortly.';
    
    if (category === 'Library') {
      botResponse = 'For library queries, you can check available books or request a resource.';
    } else if (category === 'Cafeteria') {
      botResponse = 'Check our menu for today\'s offerings and provide feedback on items.';
    } else if (category === 'Complaint') {
      botResponse = 'Your complaint has been noted. A moderator will review it shortly.';
    }

    const interaction = new ChatbotInteraction({
      userId,
      userMessage,
      botResponse,
      category: category || 'General',
    });
    
    await interaction.save();
    res.status(201).json(interaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark interaction as resolved
router.patch('/:id/resolve', async (req, res) => {
  try {
    const interaction = await ChatbotInteraction.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    res.status(200).json(interaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
