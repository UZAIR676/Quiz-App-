import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  option1:  { type: String, required: true },
  option2:  { type: String, required: true },
  option3:  { type: String, required: true },
  option4:  { type: String, required: true },
  ans:      { type: Number, required: true, min: 1, max: 4 }, // 1-4
  createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt:{ type: Date, default: Date.now }
});

export default mongoose.model('Quiz', quizSchema);
