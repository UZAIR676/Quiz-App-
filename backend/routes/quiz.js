import express from 'express';
import Quiz from '../models/Quiz.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET all quizzes (any logged in user)
router.get('/', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD quiz (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { question, option1, option2, option3, option4, ans } = req.body;
    if (!question || !option1 || !option2 || !option3 || !option4 || !ans)
      return res.status(400).json({ message: 'All fields required' });
    const quiz = await Quiz.create({ question, option1, option2, option3, option4, ans, createdBy: req.user.id });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE quiz (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE quiz (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
