import express from 'express';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Submit score (logged in user)
router.post('/submit', protect, async (req, res) => {
  try {
    const { score, total } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { scores: { score, total } } },
      { new: true }
    );
    res.json({ message: 'Score saved', scores: user.scores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my scores
router.get('/my', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('scores username');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get ALL users with scores
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete user
router.delete('/user/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
