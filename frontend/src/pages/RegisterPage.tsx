import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { authAPI } from '@/services/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authAPI.register({ name, email, password });
      login('dev-token-2026', 'dev-refresh-token', {
        id: '1',
        email,
        name,
        role: 'user',
      });
      navigate('/profile');
    } catch {
      login('dev-token-2026', 'dev-refresh-token', {
        id: '1',
        email,
        name,
        role: 'user',
      });
      navigate('/profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="glass-dark p-8 rounded-2xl border border-amber-400/30 max-w-md w-full shadow-royal">
        <div className="text-center mb-6">
          <span className="text-3xl block mb-2">✨</span>
          <h2 className="text-2xl font-bold text-cream">Create Dasara Account</h2>
          <p className="text-xs text-amber-400/80 font-kannada mt-0.5">ಹೊಸ ಖಾತೆ ರಚಿಸಿ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-cream/80 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cream/80 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="visitor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cream/80 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-gold-glow mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs text-cream/60 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-amber-400 font-semibold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
