import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';
import scoreRoutes from './routes/scores.js';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/scores', scoreRoutes);

app.get('/', (req, res) => res.json({ message: 'Maritime Cyber Range API Running ✅' }));

// Connect to MongoDB and start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB Error:', err.message));
