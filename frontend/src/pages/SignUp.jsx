import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiShield, FiAnchor } from 'react-icons/fi';

export default function SignUp() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', adminCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/signup', {
        username: form.username,
        email: form.email,
        password: form.password,
        adminCode: form.adminCode,
      });
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/quiz');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const f = (key) => ({ value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div className="ocean-bg grid-overlay min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30 mb-4">
            <FiAnchor className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Orbitron' }}>CREATE ACCOUNT</h2>
          <p className="text-white/50 text-sm mt-1">Join the Maritime Cyber Range</p>
        </div>

        <div className="glass p-8">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Username</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" className="input-field pl-11" placeholder="navyuser" required {...f('username')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" className="input-field pl-11" placeholder="you@example.com" required {...f('email')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="password" className="input-field pl-11" placeholder="••••••••" required {...f('password')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="password" className="input-field pl-11" placeholder="••••••••" required {...f('confirmPassword')} />
              </div>
            </div>

            {/* Admin code toggle */}
            <div>
            
              {showAdmin && (
                <div className="mt-3 relative">
                  <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/50" />
                  <input type="text" className="input-field pl-11" placeholder="Admin code" {...f('adminCode')} />
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary w-full text-sm mt-2" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
