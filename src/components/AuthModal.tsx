import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Phone, ShieldCheck, User, X, Sparkles, Shield } from 'lucide-react';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: unknown) => void;
};

const DEMO_CODE = '123456';
const EMBLEM_LOGO = '/images/peerless_emblem.png';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // phone login
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (onLoginSuccess) onLoginSuccess(data.user);
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setNotice('Account created. Check your email to confirm, then log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
    }
  };

  const handlePhone = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!otpSent) {
      const digits = phone.replace(/\D/g, '');
      if (digits.length !== 10) {
        setError('Enter a valid 10-digit mobile number.');
        return;
      }
      setOtpSent(true);
      setNotice(`Demo mode: use code ${DEMO_CODE} to continue.`);
      return;
    }

    if (otp.trim() !== DEMO_CODE) {
      setError('Incorrect code. For this demo, use 123456.');
      return;
    }
    if (onLoginSuccess) onLoginSuccess({ phone: `+91${phone.replace(/\D/g, '')}`, demo: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl">
      <div className="flex min-h-full items-center justify-center p-4 pt-32 sm:pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-md rounded-[2.5rem] border border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 shadow-[0_0_60px_rgba(245,158,11,0.15)] overflow-hidden"
        >
        {/* Background ambient lighting */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-44 w-44 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-44 w-44 rounded-full bg-orange-500/15 blur-3xl" />

        <button 
          onClick={onClose} 
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white" 
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* ── PEERLESS GOLDEN EMBLEM WITH FLOATING ANIMATION ── */}
        <div className="mb-6 mt-2 flex flex-col items-center">
          <motion.div
            animate={{ 
              y: [0, -6, 0],
              rotate: [0, 1.5, -1.5, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5,
              ease: "easeInOut"
            }}
            className="relative mb-4 flex h-28 w-28 items-center justify-center rounded-3xl p-1 shadow-2xl"
          >
            {/* Glowing Aura Ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-500/40 via-yellow-400/20 to-orange-500/40 blur-md animate-pulse" />
            
            <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-[1.4rem] border border-amber-500/40 bg-slate-950 p-2 shadow-inner">
              <img 
                src={EMBLEM_LOGO} 
                alt="Peerless Academy" 
                className="h-full w-full object-contain filter drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)] transition duration-500 hover:scale-110"
              />
            </div>

            {/* Password Protection Badge Animation */}
            <AnimatePresence>
              {isPasswordFocused && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.4, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.4, y: 15 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 text-slate-950 shadow-2xl shadow-amber-500/60"
                >
                  <ShieldCheck size={38} className="animate-bounce" />
                  <span className="mt-1 text-[9px] font-black uppercase tracking-wider">Protected</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <h2 className="text-center text-2xl sm:text-3xl font-black text-white tracking-tight">
            {mode === 'phone' ? 'Phone Login' : isLogin ? 'Welcome Back' : 'Join Peerless Academy'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Unlock your learning arena & live lectures</p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-2xl border border-white/10 bg-slate-950/80 p-1.5 backdrop-blur-md">
          {(['email', 'phone'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError(null);
                setNotice(null);
              }}
              className={`rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition duration-300 ${
                mode === m 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {m === 'email' ? 'Email / Password' : 'Phone / OTP'}
            </button>
          ))}
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-4 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs font-bold text-rose-300"
          >
            {error}
          </motion.div>
        )}

        {notice && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs font-bold text-emerald-300"
          >
            {notice}
          </motion.div>
        )}

        {/* ── EMAIL FORM ── */}
        {mode === 'email' && (
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Roy"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="scholar@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-orange-500/25 transition hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <div className="pt-2 text-center text-xs text-slate-400">
              {isLogin ? "Don't have an account?" : 'Already registered?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setNotice(null);
                }}
                className="ml-1 font-bold text-amber-400 hover:underline"
              >
                {isLogin ? 'Register now' : 'Sign in here'}
              </button>
            </div>
          </form>
        )}

        {/* ── PHONE FORM ── */}
        {mode === 'phone' && (
          <form onSubmit={handlePhone} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Number</label>
              <div className="flex gap-2">
                <div className="flex items-center rounded-2xl border border-white/10 bg-slate-950 px-4 text-xs font-mono font-bold text-slate-400">
                  +91
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                  <input
                    type="tel"
                    required
                    disabled={otpSent}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition focus:border-amber-500 focus:outline-none disabled:opacity-50 font-mono"
                  />
                </div>
              </div>
            </div>

            {otpSent && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Enter OTP Code</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full rounded-2xl border border-amber-500/50 bg-slate-950 py-3.5 px-4 text-center text-xl tracking-[0.4em] font-mono text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="mt-1.5 text-center text-[10px] text-slate-500">Demo verification code: <strong className="text-amber-400">123456</strong></p>
              </motion.div>
            )}

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-orange-500/25 transition hover:scale-[1.02] active:scale-95"
            >
              {otpSent ? 'Verify & Continue' : 'Send OTP Code'}
            </button>
          </form>
        )}

        {/* Divider & Google Sign-In */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <span className="relative bg-slate-900 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Or continue with</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-slate-950 py-3.5 text-xs font-bold text-white transition hover:bg-white/5 hover:border-white/20 active:scale-95"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

      </motion.div>
      </div>
    </div>
  );
}
