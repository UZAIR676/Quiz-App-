import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  FiUsers, FiBook, FiPlus, FiEdit2, FiTrash2,
  FiX, FiCheck, FiShield, FiTrendingUp, FiAward,
  FiChevronDown, FiChevronUp, FiClock, FiBarChart2,
  FiRefreshCw
} from 'react-icons/fi';

// ─── Quiz Modal ───────────────────────────────────────────────────────────────
function QuizModal({ quiz, onClose, onSave }) {
  const blank = { question: '', option1: '', option2: '', option3: '', option4: '', ans: 1 };
  const [form, setForm] = useState(quiz || blank);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    for (const k of ['question', 'option1', 'option2', 'option3', 'option4']) {
      if (!form[k].trim()) return setError('All fields are required');
    }
    setLoading(true);
    try {
      await axios.put(`/api/quiz/${quiz._id}`, form);
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const f = (key) => ({ value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal w-full max-w-2xl p-8 fade-in" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-amber-300" style={{ fontFamily: 'Orbitron' }}>✏️ EDIT QUESTION</h3>
          <button onClick={onClose} className="text-amber-500/40 hover:text-amber-300 transition-colors">
            <FiX size={20} />
          </button>
        </div>
        {error && <div className="alert alert-error mb-4">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-amber-300/60 mb-2">Question</label>
            <textarea className="admin-input resize-none" rows={3} placeholder="Enter your question..." {...f('question')} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: form.ans === n ? 'rgba(240,165,0,0.2)' : 'rgba(255,255,255,0.05)',
                    color: form.ans === n ? '#f0a500' : '#94a3b8',
                    border: `1px solid ${form.ans === n ? '#f0a500' : 'transparent'}`
                  }}>
                  {String.fromCharCode(64 + n)}
                </span>
                <input type="text" className="admin-input flex-1" placeholder={`Option ${n}`} {...f(`option${n}`)} />
                <button type="button" onClick={() => setForm({ ...form, ans: n })}
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${form.ans === n ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-white/30 hover:text-amber-400'}`}>
                  <FiCheck size={14} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-500/40">✓ Correct answer: Option {String.fromCharCode(64 + form.ans)}</p>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="admin-btn-ghost flex-1 text-sm">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="admin-btn-primary flex-1 text-sm">
            {loading ? 'Saving...' : 'Update Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── User Row ─────────────────────────────────────────────────────────────────
function UserRow({ user, index, onDelete, onReset }) {
  const [expanded, setExpanded] = useState(false);
  const [resetting, setResetting] = useState(false);

  const getBestScore = (scores) => {
    if (!scores?.length) return null;
    return Math.max(...scores.map(s => Math.round((s.score / s.total) * 100)));
  };

  const getAvgScore = (scores) => {
    if (!scores?.length) return null;
    const avg = scores.reduce((a, s) => a + Math.round((s.score / s.total) * 100), 0) / scores.length;
    return Math.round(avg);
  };

  const best = getBestScore(user.scores);
  const avg = getAvgScore(user.scores);

  const scoreColor = (pct) => {
    if (pct >= 80) return '#22c55e';
    if (pct >= 50) return '#f0a500';
    return '#ef4444';
  };

  const handleReset = async (e) => {
    e.stopPropagation();
    setResetting(true);
    await onReset(user._id);
    setResetting(false);
  };

  return (
    <>
      <tr className="admin-table-row" onClick={() => user.scores?.length && setExpanded(!expanded)}
        style={{ cursor: user.scores?.length ? 'pointer' : 'default' }}>
        <td className="text-amber-500/40 font-mono text-sm px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-100">{user.username}</span>
            {/* ✅ Show terminated badge */}
            {user.quizTerminated && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                Terminated
              </span>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-amber-300/50 text-sm">{user.email}</td>
        <td className="px-4 py-3">
          <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{user.role}</span>
        </td>
        <td className="px-4 py-3 text-center">
          <span className="font-bold text-amber-200">{user.scores?.length || 0}</span>
        </td>
        <td className="px-4 py-3 text-center">
          {best !== null ? <span className="font-black text-lg" style={{ color: scoreColor(best) }}>{best}%</span> : <span className="text-amber-500/30">—</span>}
        </td>
        <td className="px-4 py-3 text-center">
          {avg !== null ? <span className="font-semibold" style={{ color: scoreColor(avg) }}>{avg}%</span> : <span className="text-amber-500/30">—</span>}
        </td>
        <td className="px-4 py-3 text-amber-500/40 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {user.scores?.length > 0 && (
              <button className="admin-btn-icon text-amber-400">
                {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
              </button>
            )}
            {/* ✅ Reset button — only show if terminated */}
            {user.quizTerminated && (
              <button
                onClick={handleReset}
                disabled={resetting}
                className="text-xs py-1 px-2 flex items-center gap-1 rounded-lg transition-all"
                style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
              >
                <FiRefreshCw size={11} className={resetting ? 'animate-spin' : ''} />
                {resetting ? '...' : 'Reset'}
              </button>
            )}
            <button onClick={(e) => { e.stopPropagation(); onDelete(user); }}
              className="admin-btn-danger text-xs py-1 px-2">
              Remove
            </button>
          </div>
        </td>
      </tr>
      {expanded && user.scores?.length > 0 && (
        <tr>
          <td colSpan={9} className="px-4 py-0">
            <div className="admin-expanded-row">
              <div className="flex items-center gap-2 mb-3">
                <FiBarChart2 className="text-amber-400" size={14} />
                <span className="text-xs font-bold text-amber-400 tracking-wider">ALL ATTEMPTS — {user.username}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[...user.scores].reverse().map((s, i) => {
                  const pct = Math.round((s.score / s.total) * 100);
                  return (
                    <div key={i} className="admin-attempt-card">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-amber-500/50 font-mono">#{user.scores.length - i}</span>
                        <FiClock size={10} className="text-amber-500/30" />
                      </div>
                      <div className="text-xl font-black" style={{ color: scoreColor(pct) }}>{pct}%</div>
                      <div className="text-xs text-amber-500/50">{s.score}/{s.total} correct</div>
                      <div className="text-xs text-amber-500/30 mt-1">{new Date(s.playedAt).toLocaleDateString()}</div>
                      <div className="mt-2 h-1 rounded-full" style={{ background: 'rgba(240,165,0,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: scoreColor(pct) }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
export default function AdminPanel() {
  const { token, loading: authLoading } = useAuth();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [msg, setMsg] = useState('');

  const blankForm = { question: '', option1: '', option2: '', option3: '', option4: '', ans: 1 };
  const [addForm, setAddForm] = useState(blankForm);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addMsg, setAddMsg] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchUsers();
    fetchQuizzes();
  }, [authLoading, token]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await axios.get('/api/scores/all');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err.response?.data?.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoadingQuiz(true);
      const res = await axios.get('/api/quiz');
      setQuizzes(res.data);
    } catch {
    } finally {
      setLoadingQuiz(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/scores/user/${id}`);
      setUsers(u => u.filter(x => x._id !== id));
      showMsg('User removed successfully');
    } catch {
      showMsg('Failed to delete user');
    }
    setDeleteConfirm(null);
  };

  // ✅ Reset user quiz
  const resetUserQuiz = async (id) => {
    try {
      await axios.post(`/api/scores/reset/${id}`);
      setUsers(u => u.map(x => x._id === id ? { ...x, quizTerminated: false } : x));
      showMsg('Quiz reset successfully — user can retake now');
    } catch {
      showMsg('Failed to reset quiz');
    }
  };

  const deleteQuiz = async (id) => {
    try {
      await axios.delete(`/api/quiz/${id}`);
      setQuizzes(q => q.filter(x => x._id !== id));
      showMsg('Question deleted successfully');
    } catch {
      showMsg('Failed to delete question');
    }
    setDeleteConfirm(null);
  };

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const handleAddQuestion = async () => {
    setAddError('');
    for (const k of ['question', 'option1', 'option2', 'option3', 'option4']) {
      if (!addForm[k].trim()) return setAddError('All fields are required');
    }
    setAddLoading(true);
    try {
      await axios.post('/api/quiz', addForm);
      setAddForm(blankForm);
      setAddMsg('Question added successfully! ✅');
      fetchQuizzes();
      setTimeout(() => setAddMsg(''), 3000);
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add question');
    } finally {
      setAddLoading(false);
    }
  };

  const totalAttempts = users.reduce((a, u) => a + (u.scores?.length || 0), 0);
  const playersWithScores = users.filter(u => u.scores?.length);
  const avgScore = playersWithScores.length > 0
    ? Math.round(playersWithScores.reduce((a, u) =>
        a + u.scores.reduce((s, x) => s + Math.round((x.score / x.total) * 100), 0) / u.scores.length, 0
      ) / playersWithScores.length)
    : 0;

  const topScorer = users.reduce((top, u) => {
    if (!u.scores?.length) return top;
    const best = Math.max(...u.scores.map(s => Math.round((s.score / s.total) * 100)));
    return best > (top?.best || 0) ? { name: u.username, best } : top;
  }, null);

  if (authLoading) return (
    <div className="admin-bg min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-amber-500/60 text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-bg min-h-screen">

      {modal && <QuizModal quiz={modal} onClose={() => setModal(null)} onSave={fetchQuizzes} />}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="admin-modal p-8 max-w-sm w-full text-center fade-in">
            <FiTrash2 className="text-red-400 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-bold text-amber-100 mb-2">Confirm Delete</h3>
            <p className="text-amber-500/50 text-sm mb-6">{deleteConfirm.msg}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="admin-btn-ghost flex-1 text-sm">Cancel</button>
              <button onClick={deleteConfirm.action} className="btn-danger flex-1 text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 fade-in">

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl admin-icon-box flex items-center justify-center">
                <FiShield className="text-amber-400" />
              </div>
              <h1 className="text-2xl font-black text-amber-300" style={{ fontFamily: 'Orbitron' }}>ADMIN DASHBOARD</h1>
            </div>
            <p className="text-amber-500/50 text-sm">Manage users, questions, and track all results</p>
          </div>
          {msg && <div className="alert alert-success py-2 px-4 text-sm">{msg}</div>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: users.length, icon: <FiUsers />, color: '#f0a500' },
            { label: 'Questions', value: quizzes.length, icon: <FiBook />, color: '#60a5fa' },
            { label: 'Total Attempts', value: totalAttempts, icon: <FiTrendingUp />, color: '#34d399' },
            { label: 'Avg Score', value: `${isNaN(avgScore) ? 0 : avgScore}%`, icon: <FiCheck />, color: '#a78bfa' },
            { label: 'Top Scorer', value: topScorer ? `${topScorer.best}%` : '—', icon: <FiAward />, sublabel: topScorer?.name, color: '#fb923c' },
          ].map((s, i) => (
            <div key={i} className="admin-stat-card fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="text-2xl mb-2" style={{ color: s.color }}>{s.icon}</div>
              <div className="text-2xl font-black mb-0.5" style={{ fontFamily: 'Orbitron', color: s.color }}>{s.value}</div>
              {s.sublabel && <div className="text-xs text-amber-400/70 mb-0.5">{s.sublabel}</div>}
              <div className="text-amber-500/50 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { id: 'users', label: 'Users & Results', icon: <FiUsers size={14} /> },
            { id: 'quiz', label: 'Quiz Questions', icon: <FiBook size={14} /> },
            { id: 'add', label: 'Add Question', icon: <FiPlus size={14} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'admin-tab-active' : 'admin-tab'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ─── Users Tab ─── */}
        {tab === 'users' && (
          <div className="admin-card overflow-hidden">
            <div className="p-5 border-b border-amber-500/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-amber-300 text-sm tracking-wide">ALL USERS & RESULTS</h3>
                <p className="text-amber-500/40 text-xs mt-0.5">Click on a row to expand attempts</p>
              </div>
              <span className="text-amber-500/40 text-sm">{users.length} users</span>
            </div>
            {loadingUsers ? (
              <div className="p-10 text-center text-amber-500/40">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-10 text-center text-amber-500/40">No users registered yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="admin-table-head">
                      {['#', 'Username', 'Email', 'Role', 'Attempts', 'Best', 'Avg', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold tracking-wider text-amber-500/60"
                          style={{ fontFamily: 'Orbitron' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <UserRow key={u._id} user={u} index={i}
                        onDelete={(u) => setDeleteConfirm({ msg: `Remove user "${u.username}"?`, action: () => deleteUser(u._id) })}
                        onReset={resetUserQuiz}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── Quiz Questions Tab ─── */}
        {tab === 'quiz' && (
          <div className="admin-card overflow-hidden">
            <div className="p-5 border-b border-amber-500/10 flex items-center justify-between">
              <h3 className="font-bold text-amber-300 text-sm tracking-wide">QUIZ QUESTIONS</h3>
              <span className="text-amber-500/40 text-sm">{quizzes.length} questions</span>
            </div>
            {loadingQuiz ? (
              <div className="p-10 text-center text-amber-500/40">Loading...</div>
            ) : quizzes.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-amber-500/40 mb-4">No questions added yet.</p>
                <button onClick={() => setTab('add')} className="admin-btn-primary text-sm">Add First Question</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="admin-table-head">
                      {['#', 'Question', 'Options', 'Correct', 'Added', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold tracking-wider text-amber-500/60"
                          style={{ fontFamily: 'Orbitron' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((q, i) => (
                      <tr key={q._id} className="admin-table-row">
                        <td className="px-4 py-3 text-amber-500/40 font-mono text-sm">{i + 1}</td>
                        <td className="px-4 py-3 text-amber-100 font-medium max-w-xs">
                          <span className="line-clamp-2">{q.question}</span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-0.5">
                            {[q.option1, q.option2, q.option3, q.option4].map((o, oi) => (
                              <div key={oi} className={oi + 1 === q.ans ? 'text-amber-400 font-semibold' : 'text-amber-500/40'}>
                                {String.fromCharCode(65 + oi)}. {o.length > 28 ? o.slice(0, 28) + '…' : o}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-amber-400 font-bold text-sm">Option {String.fromCharCode(64 + q.ans)}</span>
                        </td>
                        <td className="px-4 py-3 text-amber-500/40 text-sm">{new Date(q.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => setModal(q)} className="admin-btn-edit text-xs py-1.5 px-3 flex items-center gap-1">
                              <FiEdit2 size={11} /> Edit
                            </button>
                            <button onClick={() => setDeleteConfirm({ msg: 'Delete this question?', action: () => deleteQuiz(q._id) })}
                              className="admin-btn-danger text-xs py-1.5 px-3 flex items-center gap-1">
                              <FiTrash2 size={11} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── Add Question Tab ─── */}
        {tab === 'add' && (
          <div className="admin-card p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl admin-icon-box flex items-center justify-center">
                <FiPlus className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-black text-amber-300 text-lg" style={{ fontFamily: 'Orbitron' }}>ADD NEW QUESTION</h3>
                <p className="text-amber-500/40 text-xs">Write the question, add options, mark the correct answer</p>
              </div>
            </div>
            {addMsg && <div className="alert alert-success mb-5">{addMsg}</div>}
            {addError && <div className="alert alert-error mb-5">{addError}</div>}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-amber-300/70 mb-2">Question *</label>
                <textarea className="admin-input resize-none" rows={4} placeholder="Enter your question here..."
                  value={addForm.question} onChange={e => setAddForm({ ...addForm, question: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-amber-300/70 mb-3">
                  Options — <span className="text-amber-500/50 font-normal">click ✓ to mark correct answer</span>
                </label>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all"
                        style={{
                          background: addForm.ans === n ? 'rgba(240,165,0,0.2)' : 'rgba(255,255,255,0.05)',
                          color: addForm.ans === n ? '#f0a500' : '#6b7280',
                          border: `2px solid ${addForm.ans === n ? '#f0a500' : 'rgba(255,255,255,0.1)'}`
                        }}>
                        {String.fromCharCode(64 + n)}
                      </span>
                      <input type="text" className="admin-input flex-1" placeholder={`Option ${String.fromCharCode(64 + n)}...`}
                        value={addForm[`option${n}`]} onChange={e => setAddForm({ ...addForm, [`option${n}`]: e.target.value })} />
                      <button onClick={() => setAddForm({ ...addForm, ans: n })}
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all border ${addForm.ans === n ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'text-white/20 border-white/10 hover:text-amber-400 hover:border-amber-500/30'}`}>
                        <FiCheck size={15} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-amber-500/40 mt-3">
                  ✅ Correct answer: <span className="text-amber-400 font-bold">Option {String.fromCharCode(64 + addForm.ans)}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setAddForm(blankForm)} className="admin-btn-ghost flex-1">Reset</button>
              <button onClick={handleAddQuestion} disabled={addLoading} className="admin-btn-primary flex-1 flex items-center justify-center gap-2">
                {addLoading ? 'Saving...' : <><FiPlus size={15} /> Add Question</>}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}