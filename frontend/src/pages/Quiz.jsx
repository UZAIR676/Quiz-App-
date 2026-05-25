import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiCheckCircle, FiXCircle, FiArrowRight, FiRotateCcw, FiAward } from 'react-icons/fi';

export default function Quiz() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/quiz');
      // Shuffle
      const shuffled = [...res.data].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    } catch {
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (optNum) => {
    if (locked) return;
    setSelected(optNum);
    setLocked(true);
    if (optNum === questions[index].ans) {
      setScore(s => s + 1);
    }
  };

  const handleNext = async () => {
    if (!locked) return;
    if (index === questions.length - 1) {
      setResult(true);
      // Save score
      if (!saved) {
        try {
          await axios.post('/api/scores/submit', { score: score + (selected === questions[index].ans ? 0 : 0), total: questions.length });
          setSaved(true);
        } catch {}
      }
    } else {
      setIndex(i => i + 1);
      setSelected(null);
      setLocked(false);
    }
  };

  const handleReset = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setLocked(false);
    setResult(false);
    setSaved(false);
  };

  const pct = Math.round((score / questions.length) * 100);

  if (loading) return (
    <div className="ocean-bg grid-overlay min-h-screen flex items-center justify-center">
      <div className="text-center fade-in">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60">Loading questions...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="ocean-bg grid-overlay min-h-screen flex items-center justify-center">
      <div className="glass p-8 text-center max-w-md fade-in">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchQuestions} className="btn-primary text-sm">Retry</button>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="ocean-bg grid-overlay min-h-screen flex items-center justify-center">
      <div className="glass p-8 text-center max-w-md fade-in">
        <p className="text-white/60 mb-2">No questions available yet.</p>
        <p className="text-white/40 text-sm">Ask an admin to add questions.</p>
      </div>
    </div>
  );

  if (result) return (
    <div className="ocean-bg grid-overlay min-h-screen flex items-center justify-center px-4">
      <div className="glass p-10 text-center max-w-md w-full fade-in">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border-2 border-cyan-400/40 flex items-center justify-center mx-auto mb-6">
          <FiAward className="text-cyan-400 text-4xl" />
        </div>
        <h2 className="text-3xl font-black mb-2 glow" style={{ fontFamily: 'Orbitron', color: '#00f5ff' }}>
          QUIZ COMPLETE
        </h2>
        <p className="text-white/50 mb-8">Well done, {user?.username}!</p>

        <div className="glass-light p-6 rounded-2xl mb-8">
          <div className="text-6xl font-black mb-2" style={{ fontFamily: 'Orbitron', color: pct >= 70 ? '#22c55e' : pct >= 40 ? '#f0a500' : '#ef4444' }}>
            {score}/{questions.length}
          </div>
          <div className="text-white/50 text-sm mb-4">{pct}% score</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }}></div>
          </div>
        </div>

        <p className="text-sm text-white/50 mb-6">
          {pct >= 70 ? '🎉 Excellent! You are a maritime cyber expert!' : pct >= 40 ? '👍 Good effort! Keep practicing.' : '💪 Keep studying. You\'ll get there!'}
        </p>

        {saved && <p className="text-xs text-cyan-400/60 mb-4">Score saved to your profile ✓</p>}

        <button onClick={handleReset} className="btn-primary flex items-center gap-2 mx-auto text-sm">
          <FiRotateCcw /> Play Again
        </button>
      </div>
    </div>
  );

  const q = questions[index];
  const options = [q.option1, q.option2, q.option3, q.option4];

  return (
    <div className="ocean-bg grid-overlay min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-sm font-bold text-white/40 tracking-widest" style={{ fontFamily: 'Orbitron' }}>MARITIME QUIZ</h2>
            <p className="text-white/60 text-sm mt-1">Question {index + 1} of {questions.length}</p>
          </div>
          <div className="glass-light px-4 py-2">
            <span className="text-cyan-400 font-bold text-lg" style={{ fontFamily: 'Orbitron' }}>{score}</span>
            <span className="text-white/40 text-sm"> / {questions.length}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-bar mb-8">
          <div className="progress-fill" style={{ width: `${((index) / questions.length) * 100}%` }}></div>
        </div>

        {/* Question card */}
        <div className="glass p-8 mb-6">
          <h3 className="text-xl font-bold text-white leading-relaxed mb-8">
            <span className="text-cyan-400/60 mr-2">Q{index + 1}.</span>
            {q.question}
          </h3>

          <div>
            {options.map((opt, i) => {
              const optNum = i + 1;
              let cls = 'quiz-option';
              if (locked) {
                if (optNum === q.ans) cls += ' correct';
                else if (optNum === selected && selected !== q.ans) cls += ' wrong';
                else cls += ' disabled';
              }
              return (
                <div key={i} className={cls} onClick={() => handleSelect(optNum)}>
                  <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-sm font-bold flex-shrink-0 opacity-60">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {locked && optNum === q.ans && <FiCheckCircle className="text-green-400 flex-shrink-0" />}
                  {locked && optNum === selected && selected !== q.ans && <FiXCircle className="text-red-400 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!locked}
          className={`btn-primary w-full flex items-center justify-center gap-2 text-sm ${!locked ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {index === questions.length - 1 ? 'See Results' : 'Next Question'}
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
