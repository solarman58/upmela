import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMapStore } from '../../store/useMapStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiUser, FiArrowRight, FiArrowLeft, FiLoader, FiShield, FiCheckCircle } from 'react-icons/fi';
import RequestDemoModal from '../LandingPage/RequestDemoModal';

import { Turnstile } from '@marsidev/react-turnstile';

// ── Login Form ─────────────────────────────────────────────────────────────────
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [modalMode, setModalMode] = useState(null);  
  // Track failed attempts for rate-limiting feedback
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);

  const navigate = useNavigate();

  const isLocked = lockedUntil && Date.now() < lockedUntil;
  const [lockCountdown, setLockCountdown] = useState(0);

  useEffect(() => {
    if (!isLocked) return;
    const iv = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        clearInterval(iv);
      } else {
        setLockCountdown(remaining);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [isLocked, lockedUntil]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!turnstileToken) {
      setError('Please complete the security check first.');
      return;
    }
    if (isLocked) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, turnstileToken })
      });

      // Safe JSON parse — server might return HTML on crash
      const contentType = res.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        // Server returned HTML (Vercel error page, 500, etc.)
        const text = await res.text();
        console.error('[Login] Non-JSON server response:', text.substring(0, 200));
        throw new Error('Server error. Please try again in a moment.');
      }

      if (!res.ok) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 5) {
          setLockedUntil(Date.now() + 30_000);
          setLockCountdown(30);
          throw new Error('Too many failed attempts. Locked for 30 seconds.');
        }
        throw new Error(data.error || 'Invalid credentials');
      }

      // Save token and state
      localStorage.setItem('ap_token', data.token);
      localStorage.setItem('ap_user', JSON.stringify(data.user));
      useMapStore.setState({ user: data.user, token: data.token, isAdminMode: true });

      if (data.user.role === 'superadmin') {
        navigate('/superadmin', { replace: true });
      } else {
        navigate(`/app?project=${data.user.project_id}&mode=admin`, { replace: true });
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#F8FAFC] p-4 relative overflow-hidden font-sans">

      {/* Premium Light Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-200/40 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200/40 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-100/40 blur-[100px] rounded-full pointer-events-none" />

      {/* Grid pattern background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #0F172A 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] bg-white/70 backdrop-blur-2xl border border-white p-8 rounded-[32px] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05),0_0_0_1px_rgba(226,232,240,0.8)] relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <div className="flex items-center gap-2">
              <img src="/margyaan-icon.png" alt="Margyaan" className="w-[48px] h-[48px] object-contain mix-blend-multiply transition-all" />
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center text-[1.35rem] font-black tracking-[0.05em] leading-none">
                  <span className="text-[#1E293B]">MAR</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#6D28D9] to-[#D946EF] text-[1.45em] mx-[2px] translate-y-[1px]">G</span>
                  <span className="text-[#2563EB]">YAAN</span>
                </div>
                <span className="text-[0.55rem] font-extrabold tracking-[0.15em] text-[#475569] mt-[2px]">INDOOR NAVIGATION SYSTEM</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-2">Sign in to manage your spaces and routes.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Username */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiUser className="text-slate-400 group-focus-within:text-sky-500 transition-colors" />
            </div>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="username"
              disabled={isLocked}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 text-slate-800 placeholder:text-slate-400 rounded-xl focus:bg-white focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all disabled:opacity-50 font-medium"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiLock className="text-slate-400 group-focus-within:text-sky-500 transition-colors" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              disabled={isLocked}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 text-slate-800 placeholder:text-slate-400 rounded-xl focus:bg-white focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all disabled:opacity-50 font-medium"
            />
          </div>

          {/* ── CAPTCHA ── */}
          <div className="flex justify-center">
            <Turnstile 
              siteKey="0x4AAAAAAD5PE6dpjBYOtq9m" 
              onSuccess={(token) => setTurnstileToken(token)} 
              options={{ theme: 'light' }}
            />
          </div>

          {/* Attempts indicator */}
          {attempts > 0 && attempts < 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-[12px] font-semibold text-amber-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200"
            >
              <span>⚠️</span>
              <span>{5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining before lockout</span>
            </motion.div>
          )}

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                key="err"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[13px] font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Locked state */}
          {isLocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-3.5 px-4 bg-rose-50 border border-rose-200 rounded-xl"
            >
              <p className="text-rose-600 font-bold text-sm flex items-center justify-center gap-2">
                <FiLock /> Account locked
              </p>
              <p className="text-rose-500/80 text-xs mt-1 font-medium">Try again in <span className="font-black text-rose-600">{lockCountdown}s</span></p>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || isLocked || !turnstileToken}
            className="w-full mt-2 bg-gradient-to-r from-violet-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_8px_20px_-6px_rgba(109,40,217,0.4)] flex items-center justify-center gap-2 transition-all hover:-translate-y-[1px] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0"
          >
            {loading ? <FiLoader className="animate-spin text-xl" /> : (
              <><FiArrowRight className="stroke-[2.5px]" /> Sign In Securely</>
            )}
          </button>

          {/* Security badge */}
          <p className="text-center text-[11px] font-semibold text-slate-400 flex items-center justify-center gap-1.5 mt-2">
            <FiShield size={12} className="text-slate-400" />
            Protected by Cloudflare Turnstile
          </p>
          
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 font-semibold text-[12px] transition-colors"
            >
              <FiArrowLeft size={14} /> Back to Home
            </button>

            <div className="text-[12px] font-medium text-slate-500">
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => setModalMode('trial')}
                className="text-sky-600 font-bold hover:text-sky-500 transition-colors"
              >
                Join now!
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      <RequestDemoModal isOpen={!!modalMode} mode={modalMode} onClose={() => setModalMode(null)} />
    </div>
  );
}
