import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Phone, User, X, Loader2 } from 'lucide-react';

// Google logo SVG
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// Auth modes: 'email' | 'phone' | 'otp'
export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('email'); // 'email' | 'phone' | 'otp'
  const [isLogin, setIsLogin] = useState(true);

  // email/password fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // phone / OTP fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  if (!isOpen) return null;

  const clearMessages = () => { setError(null); setInfo(null); };

  /* ── Google OAuth ── */
  const handleGoogle = async () => {
    clearMessages();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  /* ── Email / Password ── */
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        if (data?.user) {
          await supabase
            .from('profiles')
            .upsert([{ id: data.user.id, full_name: fullName, xp: 0 }]);
        }
        setInfo('Account created! Check your email to confirm, then log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Send OTP ── */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!phoneNumber.trim()) { setError('Please enter a valid phone number.'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: phoneNumber });
      if (error) throw error;
      setOtpSent(true);
      setMode('otp');
      setInfo(`OTP sent to ${phoneNumber}. Check your messages.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Verify OTP ── */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!otpCode.trim()) { setError('Please enter the OTP you received.'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otpCode,
        type: 'sms',
      });
      if (error) throw error;
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchToPhoneFlow = () => {
    clearMessages();
    setOtpSent(false);
    setOtpCode('');
    setMode('phone');
  };

  const switchToEmailFlow = () => {
    clearMessages();
    setMode('email');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 relative border border-slate-700"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6 mt-2">
          <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center relative mb-4">
            <span className="text-4xl relative z-10">🤖</span>
            <AnimatePresence>
              {isPasswordFocused && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center bg-orange-500 rounded-full z-20 shadow-lg shadow-orange-500/50"
                >
                  <span className="text-3xl">🙈</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {mode === 'otp'
              ? 'Enter OTP'
              : isLogin
              ? 'Welcome Back'
              : 'Join Peerless Academy'}
          </h2>
          {mode !== 'otp' && (
            <p className="text-slate-400 text-sm mt-1">Sign in to unlock student features</p>
          )}
        </div>

        {/* Error / Info banners */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-xl">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-sm rounded-xl">
            {info}
          </div>
        )}

        {/* ── GOOGLE BUTTON (always visible unless in OTP step) ── */}
        {mode !== 'otp' && (
          <>
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl transition shadow-md mb-4 disabled:opacity-60"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>
          </>
        )}

        {/* ── EMAIL / PASSWORD FORM ── */}
        {mode === 'email' && (
          <>
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/30 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                {loading ? 'Please wait…' : isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-4 text-center text-slate-400 text-sm">
              {isLogin ? "Don't have an account? " : 'Already enrolled? '}
              <button
                onClick={() => { setIsLogin(!isLogin); clearMessages(); }}
                className="text-orange-400 hover:text-orange-300 font-semibold underline"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>

            {/* Switch to Phone */}
            <button
              onClick={switchToPhoneFlow}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 border border-slate-700 hover:border-orange-500 text-slate-400 hover:text-orange-400 font-semibold rounded-xl transition text-sm"
            >
              <Phone size={15} /> Use phone number instead
            </button>
          </>
        )}

        {/* ── PHONE NUMBER FORM ── */}
        {mode === 'phone' && (
          <>
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  autoFocus
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/30 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                {loading ? 'Sending OTP…' : 'Send OTP'}
              </button>
            </form>

            <button
              onClick={switchToEmailFlow}
              className="mt-4 w-full text-center text-slate-400 hover:text-white text-sm transition"
            >
              ← Use email instead
            </button>
          </>
        )}

        {/* ── OTP VERIFICATION FORM ── */}
        {mode === 'otp' && (
          <>
            <p className="text-slate-400 text-sm text-center mb-4">
              Enter the 6-digit code sent to{' '}
              <span className="text-white font-semibold">{phoneNumber}</span>
            </p>
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <input
                type="text"
                required
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit OTP"
                autoFocus
                className="w-full text-center text-2xl tracking-[0.5em] py-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 outline-none transition font-bold"
              />
              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/30 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                {loading ? 'Verifying…' : 'Verify & Sign In'}
              </button>
            </form>

            <div className="mt-4 flex flex-col gap-2 items-center">
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="text-orange-400 hover:text-orange-300 text-sm font-semibold transition disabled:opacity-50"
              >
                Resend OTP
              </button>
              <button
                onClick={switchToPhoneFlow}
                className="text-slate-400 hover:text-white text-sm transition"
              >
                ← Change phone number
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
