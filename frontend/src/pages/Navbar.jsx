import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiAnchor, FiLogOut, FiUser, FiShield } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <FiAnchor className="text-white text-lg" />
        </div>
        <span className="brand text-sm font-bold tracking-wider text-white group-hover:text-cyan-400 transition-colors">
          MARITIME <span className="text-cyan-400">CYBER</span>
        </span>
      </Link>

      {/* Center links */}
      <div className="flex items-center gap-6">
        <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-cyan-400' : 'text-white/60 hover:text-white'}`}>
          Home
        </Link>
        {user && (
          <Link to="/quiz" className={`text-sm font-medium transition-colors ${isActive('/quiz') ? 'text-cyan-400' : 'text-white/60 hover:text-white'}`}>
            Quiz
          </Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/admin') ? 'text-amber-400' : 'text-white/60 hover:text-amber-400'}`}>
            <FiShield className="text-xs" /> Admin
          </Link>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="flex items-center gap-2 glass-light px-3 py-1.5">
              <FiUser className="text-cyan-400 text-sm" />
              <span className="text-sm font-medium text-white/80">{user.username}</span>
              <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                {user.role}
              </span>
            </div>
            <button onClick={handleLogout} className="btn-ghost flex items-center gap-2 text-sm py-1.5">
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2">
              Login
            </Link>
            <Link to="/signup" className="btn-primary py-2 px-5 text-xs">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
