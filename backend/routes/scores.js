import express from 'express';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Submit score + mark terminated if cheating
router.post('/submit', protect, async (req, res) => {
  try {
    const { score, total, terminated } = req.body;
    const update = { $push: { scores: { score, total } } };
    if (terminated) update.$set = { quizTerminated: true };
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true });
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

// Admin: reset user quiz so they can retake
router.post('/reset/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { $set: { quizTerminated: false } });
    res.json({ message: 'Quiz reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;