import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Users, Shield, Zap, X, Crosshair, BrainCircuit, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCbtStore } from '@/store/cbtStore';
import { useTestHydration } from '@/hooks/useTestHydration';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function Kurukshetra({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<'idle' | 'seeking' | 'matched' | 'active'>('idle');
  const [opponent, setOpponent] = useState<{ name: string, elo: number, isBot: boolean } | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [streak, setStreak] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);

  const storeQs = useCbtStore(s => s.questions);
  const { loading } = useTestHydration('JEE_MAIN', false, storeQs.length > 0);
  const currentQ = storeQs.length > 0 ? storeQs[0] : null;

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (status === 'seeking') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // 10-Second Bot Fallback
            setOpponent({ name: 'Kurukshetra AI Combatant', elo: 1850, isBot: true });
            setStatus('matched');
            setTimeout(() => setStatus('active'), 2500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  const seekMatch = () => {
    setStatus('seeking');
    setCountdown(10);
    // In a full implementation, we'd broadcast presence to Supabase here.
  };

  const getEloTitle = (elo: number) => {
    if (elo >= 2500) return 'Paramveer';
    if (elo >= 2000) return 'Atirathi';
    if (elo >= 1500) return 'Maharathi';
    return 'Yoddha';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col font-sans text-white">
      <header className="flex justify-between items-center p-6 border-b border-amber-500/20 bg-slate-900/80 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition">
          <X size={24} />
        </button>
        <div className="font-black text-lg tracking-widest text-amber-500 uppercase flex items-center gap-2" style={{ textShadow: '0 0 20px rgba(245, 158, 11, 0.5)' }}>
          <Swords size={20} /> Kurukshetra
        </div>
        <div className="w-6" /> {/* Spacer for centering */}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* War-Room Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full mix-blend-screen blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full mix-blend-screen blur-[120px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
                <Crosshair size={80} className="text-amber-500 relative z-10" />
              </div>
              <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Enter The Arena</h2>
              <p className="text-amber-500/70 max-w-sm mx-auto mb-10 font-bold tracking-wide">ZERO-LAG ESPORTS ENGINE</p>
              
              <button onClick={seekMatch} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-14 py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-[0_0_40px_rgba(245,158,11,0.4)] transition hover:scale-105 hover:shadow-[0_0_60px_rgba(245,158,11,0.6)]">
                Seek Opponent
              </button>
            </motion.div>
          )}

          {status === 'seeking' && (
            <motion.div key="seeking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin" />
                <span className="text-3xl font-black text-amber-500">{countdown}s</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Broadcasting Signal...</h3>
              <p className="text-slate-400">Matchmaking within ELO ±50</p>
            </motion.div>
          )}

          {status === 'matched' && opponent && (
            <motion.div key="matched" initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -50 }} className="flex flex-col items-center w-full max-w-2xl">
              <div className="text-amber-500 font-black tracking-[0.3em] uppercase text-sm mb-12 animate-pulse">Match Found</div>
              
              <div className="flex items-center justify-between w-full gap-8">
                {/* You */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg mb-4 transform -rotate-3">
                    YOU
                  </div>
                  <div className="font-bold text-lg">Student</div>
                  <div className="text-emerald-400 text-sm font-bold">{getEloTitle(1800)} (1800)</div>
                </div>

                <div className="text-4xl font-black text-slate-700 italic">VS</div>

                {/* Opponent */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-4 transform rotate-3 ${opponent.isBot ? 'bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700' : 'bg-gradient-to-br from-rose-500 to-orange-600'}`}>
                    {opponent.isBot ? <BrainCircuit className="text-slate-500" size={40} /> : 'OPP'}
                  </div>
                  <div className="font-bold text-lg flex items-center gap-2">
                    {opponent.name} {opponent.isBot && <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-400 uppercase">AI</span>}
                  </div>
                  <div className="text-rose-400 text-sm font-bold">{getEloTitle(opponent.elo)} ({opponent.elo})</div>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'active' && (
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col w-full h-full text-left">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-bold uppercase">Your Score</span>
                    <span className="text-2xl font-black text-emerald-400">0</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-bold uppercase">Streak</span>
                    <span className="text-2xl font-black text-amber-500 flex items-center gap-1"><Flame size={20} />{streak}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShieldActive(true)}
                  disabled={shieldActive}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${shieldActive ? 'bg-slate-800 text-slate-600' : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border border-indigo-500/30'}`}
                >
                  <Shield size={16} /> 50/50 Lifeline
                </button>
              </div>

                <div className="flex-1 bg-slate-900/50 rounded-3xl border border-slate-800 p-8 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <span className="bg-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">Q1 • {currentQ?.subject || 'Combat'}</span>
                    <span className="font-mono text-xl text-slate-300">00:45</span>
                  </div>
                  <div className="text-lg mb-10 leading-relaxed overflow-y-auto max-h-[150px]">
                    <Latex>{currentQ?.question_latex || 'Synchronizing with Kurukshetra Engine...'}</Latex>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                    {(currentQ?.options || []).map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => {
                          if (i === currentQ?.correct_index) {
                            setStreak(s => s + 1);
                            alert('You answered correctly! Duel won.');
                            onBack();
                          } else {
                            setStreak(0);
                            alert('Incorrect! The opponent scored a hit.');
                          }
                        }}
                        className={`p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-slate-500 transition text-left font-semibold ${shieldActive && currentQ && i !== currentQ.correct_index && i !== ((currentQ.correct_index + 1) % 4) ? 'opacity-20 pointer-events-none' : ''}`}
                      >
                        <Latex>{opt}</Latex>
                      </button>
                    ))}
                  </div>
                </div>

              {/* Opponent Progress Bar */}
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>{opponent?.name}</span>
                  <span>Solving...</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '60%' }} 
                    transition={{ duration: 10, ease: 'linear' }}
                    className="h-full bg-rose-500" 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
