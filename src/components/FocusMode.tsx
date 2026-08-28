import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEconomyStore } from '@/store/economyStore';
import { ShieldAlert, Zap, Coins, X } from 'lucide-react';

export default function FocusMode({ onBack }: { onBack: () => void }) {
  const { appCoins, deductCoins, awardCoins } = useEconomyStore();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins default
  const [wager, setWager] = useState(10);
  const [status, setStatus] = useState<'idle' | 'focusing' | 'failed' | 'success'>('idle');

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      handleSuccess();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Anti-Distraction sandbox logic
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        handleFail();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive]);

  const handleStart = () => {
    if (deductCoins(wager)) {
      setIsActive(true);
      setStatus('focusing');
    } else {
      alert("Not enough coins to wager!");
    }
  };

  const handleFail = () => {
    setIsActive(false);
    setStatus('failed');
    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]); // Heavy haptic error
  };

  const handleSuccess = () => {
    setIsActive(false);
    setStatus('success');
    awardCoins(wager * 2); // 2x payout
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]); // Success haptic
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-slate-900/50 backdrop-blur-md">
        <button onClick={onBack} disabled={isActive} className="text-slate-400 hover:text-white transition disabled:opacity-30">
          <X size={24} />
        </button>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-500 font-black text-sm">
          <Coins size={16} /> {appCoins}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <AnimatePresence mode="wait">
          
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-sm w-full glass-panel bg-slate-900/80 p-8 rounded-3xl"
            >
              <div className="w-16 h-16 mx-auto bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 text-cyan-400">
                <Zap size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2">Deep Focus Sandbox</h2>
              <p className="text-sm text-slate-400 mb-8">Wager coins. If you leave this app, your core shatters and you lose your wager.</p>
              
              <div className="flex items-center justify-between bg-slate-950 rounded-2xl p-4 mb-6 border border-slate-800">
                <span className="font-bold text-slate-400">Wager Amount</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setWager(Math.max(5, wager - 5))} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold">-</button>
                  <span className="font-black text-amber-500">{wager}</span>
                  <button onClick={() => setWager(Math.min(appCoins, wager + 5))} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold">+</button>
                </div>
              </div>

              <button 
                onClick={handleStart}
                className="w-full py-4 rounded-full bg-cyan-500 text-slate-900 font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:scale-105"
              >
                Enter Deep Focus
              </button>
            </motion.div>
          )}

          {status === 'focusing' && (
            <motion.div 
              key="focusing"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              {/* Neon Core visual */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], rotate: 360 }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/50"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-48 h-48 rounded-full bg-cyan-500/20 blur-xl"
                />
                <div className="text-6xl font-black text-white relative z-10 font-mono tracking-tighter">
                  {formatTime(timeLeft)}
                </div>
              </div>
              <h3 className="text-xl font-black text-cyan-400 mt-12 animate-pulse">Do not switch apps.</h3>
              <p className="text-slate-500 mt-2 text-sm">Your wager is currently locked.</p>
            </motion.div>
          )}

          {status === 'failed' && (
            <motion.div 
              key="failed"
              initial={{ opacity: 0, scale: 1.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.6 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto bg-rose-500/10 rounded-full flex items-center justify-center mb-6 text-rose-500">
                <ShieldAlert size={48} />
              </div>
              <h2 className="text-4xl font-black text-rose-500 mb-4">Focus Broken</h2>
              <p className="text-slate-400 max-w-xs mx-auto mb-8">You left the sandbox. The neon core shattered and you lost {wager} coins.</p>
              <button onClick={() => { setStatus('idle'); setTimeLeft(1500); }} className="px-8 py-3 rounded-full bg-slate-800 font-bold hover:bg-slate-700">Try Again</button>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-32 h-32 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 text-emerald-400 relative">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-emerald-500/30 rounded-full border-dashed" />
                <Coins size={48} />
              </div>
              <h2 className="text-4xl font-black text-emerald-400 mb-4">Focus Complete!</h2>
              <p className="text-slate-400 max-w-xs mx-auto mb-8">Excellent discipline. You earned a 2x payout of {wager * 2} coins.</p>
              <button onClick={() => { setStatus('idle'); setTimeLeft(1500); }} className="px-8 py-3 rounded-full bg-emerald-500 text-emerald-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.4)]">Claim & Continue</button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
