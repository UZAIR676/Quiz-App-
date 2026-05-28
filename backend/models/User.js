import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  quizTerminated: { type: Boolean, default: false },
  scores: [
    {
      score:     { type: Number },
      total:     { type: Number },
      playedAt:  { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now }

});

export default mongoose.model('User', userSchema);
