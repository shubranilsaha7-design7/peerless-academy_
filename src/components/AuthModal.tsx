import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Phone, ShieldCheck, User, X } from 'lucide-react';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: unknown) => void;
};

const DEMO_CODE = '123456';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 transition hover:text-white" aria-label="Close">
          <X size={24} />
        </button>

        <div className="mb-6 mt-4 flex flex-col items-center">
          <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500/10">
            <span className="relative z-10 text-5xl">🤖</span>
            <AnimatePresence>
              {isPasswordFocused && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"
                >
                  <span className="text-3xl">🙈</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <h2 className="text-center text-3xl font-bold text-white">
            {mode === 'phone' ? 'Phone Login' : isLogin ? 'Welcome Back' : 'Join Peerless Academy'}
          </h2>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-slate-700 bg-slate-800/60 p-1">
          {(['email', 'phone'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError(null);
                setNotice(null);
              }}
              className={`rounded-lg py-2.5 text-xs font-black uppercase tracking-wider transition ${
                mode === m ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {m === 'email' ? 'Email' : 'Phone / OTP'}
            </button>
          ))}
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/20 p-3 text-sm text-red-200">{error}</div>}
        {notice && <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-3 text-sm text-emerald-200">{notice}</div>}

        {mode === 'email' ? (
          <>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-white outline-none transition focus:ring-2 focus:ring-orange-500" />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-white outline-none transition focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)} placeholder="Password" className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-white outline-none transition focus:ring-2 focus:ring-orange-500" />
              </div>
              <button type="submit" disabled={loading} className="mt-2 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-4 font-bold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-600 hover:to-orange-700 disabled:opacity-60">
                {loading ? 'Authenticating...' : isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              {isLogin ? "Don't have an account? " : 'Already enrolled? '}
              <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-orange-400 underline hover:text-orange-300">
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </>
        ) : (
          <form onSubmit={handlePhone} className="space-y-4">
            <div className="flex gap-2">
              <span className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm font-bold text-slate-300">+91</span>
              <div className="relative flex-1">
                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={otpSent}
                  placeholder="Mobile number"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-white outline-none transition focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
                />
              </div>
            </div>

            {otpSent && (
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 tracking-[0.4em] text-white outline-none transition focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}

            <button type="submit" className="mt-2 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-4 font-bold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-600 hover:to-orange-700">
              {otpSent ? 'Verify & Continue' : 'Send Code'}
            </button>

            {otpSent && (
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setNotice(null);
                  setError(null);
                }}
                className="w-full text-center text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300"
              >
                Change number
              </button>
            )}
            <p className="text-center text-[11px] text-slate-500">Demo verification code: 123456</p>
          </form>
        )}

        <div className="mt-6 border-t border-slate-700/50 pt-6">
          <button
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 hover:shadow"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

      </motion.div>
    </div>
  );
}
