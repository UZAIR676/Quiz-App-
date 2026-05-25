import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password) return setError('All fields required');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', form);
      login(res.data.user, res.data.token);
      // Admin ko seedha admin panel pe bhejo
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ocean-bg grid-overlay min-h-screen flex items-center justify-center px-4">
      <div className="glass w-full max-w-md p-8 fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Orbitron' }}>WELCOME BACK</h2>
          <p className="text-white/40 text-sm">Login to your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                className="input-field pl-11"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                className="input-field pl-11"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
          {loading ? 'Logging in...' : <><FiLogIn /> Login</>}
        </button>

        <p className="text-center text-white/40 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
