import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShield, FiLogOut, FiUsers, FiBook, FiHome } from 'react-icons/fi';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="admin-navbar">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="admin-navbar-logo">
          <FiShield className="text-amber-900 text-lg" />
        </div>
        <div>
          <span className="admin-brand">ADMIN</span>
          <span className="text-amber-500/60 text-xs ml-2 font-mono">CONTROL PANEL</span>
        </div>
      </div>

      {/* Center links */}
      <div className="flex items-center gap-2">
        {[
          { to: '/admin', label: 'Dashboard', icon: <FiHome size={14} /> },
          { to: '/admin#users', label: 'Users', icon: <FiUsers size={14} /> },
          { to: '/admin#quiz', label: 'Questions', icon: <FiBook size={14} /> },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`admin-nav-link ${isActive('/admin') ? 'admin-nav-link-active' : ''}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="admin-user-chip">
          <FiShield className="text-amber-400 text-sm" />
          <span className="text-sm font-semibold text-amber-100">{user?.username}</span>
          <span className="badge-admin-nav">ADMIN</span>
        </div>
        <button onClick={handleLogout} className="admin-logout-btn">
          <FiLogOut size={14} /> Logout
        </button>
      </div>
    </nav>
  );
}
