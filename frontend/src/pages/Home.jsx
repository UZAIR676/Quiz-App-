import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiAnchor, FiShield, FiZap, FiAward } from 'react-icons/fi';

export default function Home() {
  const { user } = useAuth();

  const features = [
    { icon: <FiShield size={24} />, title: 'Cyber Threats', desc: 'Learn to identify and defend against real maritime cyber attacks' },
    { icon: <FiZap size={24} />, title: 'Live Scenarios', desc: 'Interactive quiz scenarios based on real-world maritime incidents' },
    { icon: <FiAward size={24} />, title: 'Track Progress', desc: 'Monitor your scores and improvement over time' },
  ];

  return (
    <div className="ocean-bg grid-overlay min-h-screen">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 fade-in">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 glass-light px-5 py-2 rounded-full mb-8">
            <FiAnchor className="text-cyan-400" />
            <span className="text-sm text-white/70 font-medium tracking-wider">NAUTICAL NAVIGATORS</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-white">MARITIME</span><br />
            <span className="text-cyan-400 glow">CYBER RANGE</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Test your knowledge of maritime cybersecurity. From GPS spoofing to ransomware defense — 
            are you ready to protect the seas?
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {user ? (
              <Link to="/quiz" className="btn-primary text-sm">
                Start Quiz Now →
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary text-sm">
                  Get Started Free →
                </Link>
                <Link to="/login" className="btn-ghost text-sm">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <div key={i} className="glass p-6 fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="glass p-8">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[
              { num: '10+', label: 'Questions' },
              { num: '100%', label: 'Free to Play' },
              { num: '∞', label: 'Attempts' },
            ].map((s, i) => (
              <div key={i} className="text-center px-6">
                <div className="text-3xl font-black text-cyan-400 glow mb-1" style={{ fontFamily: 'Orbitron' }}>{s.num}</div>
                <div className="text-white/50 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
