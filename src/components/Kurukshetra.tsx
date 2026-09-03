import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, X, Crosshair, BrainCircuit, Flame, Zap, Skull, ShieldAlert, Trophy } from 'lucide-react';
import { useCbtStore } from '@/store/cbtStore';
import { useTestHydration } from '@/hooks/useTestHydration';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

const MAX_HP = 1000;
const BASE_DMG = 250;

export default function Kurukshetra({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<'idle' | 'seeking' | 'matched' | 'active' | 'gameover'>('idle');
  const [opponent, setOpponent] = useState<{ name: string, elo: number, isBot: boolean } | null>(null);
  const [countdown, setCountdown] = useState(10);
  
  // Dual Engine Combat State
  const [myHp, setMyHp] = useState(MAX_HP);
  const [oppHp, setOppHp] = useState(MAX_HP);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(1.0);
  const [shieldActive, setShieldActive] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [combatLog, setCombatLog] = useState<{msg: string, isCrit?: boolean}[]>([]);
  const [shake, setShake] = useState(false);

  const storeQs = useCbtStore(s => s.questions);
  useTestHydration('JEE_MAIN', false, storeQs.length > 0);
  const currentQ = storeQs.length > qIndex ? storeQs[qIndex] : (storeQs.length > 0 ? storeQs[0] : null);

  // Matchmaking logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (status === 'seeking') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
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

  // AI Opponent Damage Logic (Simulates the dual engine)
  useEffect(() => {
    let aiTimer: ReturnType<typeof setInterval>;
    if (status === 'active' && oppHp > 0 && myHp > 0) {
      // AI attacks randomly every 8-15 seconds
      aiTimer = setInterval(() => {
        const dmg = Math.floor((BASE_DMG * 0.8) + (Math.random() * 50));
        setMyHp(h => {
          const newHp = Math.max(0, h - dmg);
          if (newHp === 0) endGame(false);
          return newHp;
        });
        setStreak(0);
        setCombo(1.0);
        triggerShake();
        addLog(`AI scored a hit! -${dmg} HP`, false);
      }, 8000 + (Math.random() * 7000));
    }
    return () => clearInterval(aiTimer);
  }, [status, oppHp, myHp]);

  const addLog = (msg: string, isCrit: boolean = false) => {
    setCombatLog(prev => [{msg, isCrit}, ...prev].slice(0, 3));
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const endGame = (playerWon: boolean) => {
    setStatus('gameover');
    if (playerWon) setOppHp(0);
    else setMyHp(0);
  };

  const handleAnswer = (selectedIndex: number) => {
    if (!currentQ) return;
    
    if (selectedIndex === currentQ.correct_index) {
      // Hit Opponent!
      const isCrit = combo >= 1.5;
      const dmg = Math.floor(BASE_DMG * combo);
      setOppHp(h => {
        const newHp = Math.max(0, h - dmg);
        if (newHp === 0) endGame(true);
        return newHp;
      });
      setStreak(s => s + 1);
      setCombo(c => Math.min(2.5, c + 0.2)); // Max combo 2.5x
      addLog(`Direct Hit! -${dmg} HP`, isCrit);
    } else {
      // Missed! Recoil Damage!
      const recoil = Math.floor(BASE_DMG * 0.5);
      setMyHp(h => {
        const newHp = Math.max(0, h - recoil);
        if (newHp === 0) endGame(false);
        return newHp;
      });
      setStreak(0);
      setCombo(1.0);
      triggerShake();
      addLog(`Missed! Recoil Damage -${recoil} HP`);
    }

    setShieldActive(false);
    
    // Cycle to next question smoothly
    if (qIndex + 1 < storeQs.length) {
      setQIndex(qIndex + 1);
    } else {
      setQIndex(0); // wrap around if out of qs
    }
  };

  const seekMatch = () => {
    setStatus('seeking');
    setCountdown(10);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] bg-slate-950 flex flex-col font-sans text-white ${shake ? 'animate-bounce' : ''}`}
    >
      <header className="flex justify-between items-center p-6 border-b border-amber-500/20 bg-slate-900/80 backdrop-blur-md relative z-10">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition">
          <X size={24} />
        </button>
        <div className="font-black text-lg tracking-widest text-amber-500 uppercase flex items-center gap-2" style={{ textShadow: '0 0 20px rgba(245, 158, 11, 0.5)' }}>
          <Swords size={20} /> Kurukshetra Dual Engine
        </div>
        <div className="w-6" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center relative overflow-hidden">
        {/* Arena Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full mix-blend-screen blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full mix-blend-screen blur-[120px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
                <Crosshair size={80} className="text-amber-500 relative z-10" />
              </div>
              <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Enter The Arena</h2>
              <p className="text-amber-500/70 max-w-sm mx-auto mb-10 font-bold tracking-wide">GAMIFICATION BATTLE ENGINE v2.0</p>
              
              <button onClick={seekMatch} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-14 py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-[0_0_40px_rgba(245,158,11,0.4)] transition hover:scale-105">
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
              <p className="text-slate-400">Matchmaking algorithm engaged</p>
            </motion.div>
          )}

          {status === 'matched' && opponent && (
            <motion.div key="matched" initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -50 }} className="flex flex-col items-center w-full max-w-2xl">
              <div className="text-amber-500 font-black tracking-[0.3em] uppercase text-sm mb-12 animate-pulse">Match Found</div>
              <div className="flex items-center justify-between w-full gap-8">
                {/* You */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg mb-4 transform -rotate-3">YOU</div>
                  <div className="font-bold text-lg">Challenger</div>
                </div>
                <div className="text-4xl font-black text-slate-700 italic">VS</div>
                {/* Opponent */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-4 transform rotate-3">
                    <BrainCircuit className="text-slate-500" size={40} />
                  </div>
                  <div className="font-bold text-lg flex items-center gap-2">AI Boss</div>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'active' && (
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col w-full h-full max-w-4xl text-left">
              
              {/* Dual Health Bars */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                {/* Player Stats */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-end mb-2">
                    <div className="font-black text-lg flex items-center gap-2"><Zap className="text-indigo-400" size={18}/> YOU</div>
                    <div className="text-xs font-bold text-indigo-400">{myHp}/{MAX_HP} HP</div>
                  </div>
                  <div className="h-4 bg-slate-900 rounded-full border border-slate-800 overflow-hidden shadow-inner relative">
                    <motion.div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-indigo-400" 
                      animate={{ width: `${(myHp / MAX_HP) * 100}%` }} 
                      transition={{ type: 'spring', bounce: 0.2 }}
                    />
                  </div>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1"><Flame size={14}/> {streak} Streak</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><Crosshair size={14}/> {combo.toFixed(1)}x DMG</span>
                  </div>
                </div>

                {/* Opponent Stats */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-xs font-bold text-rose-500">{oppHp}/{MAX_HP} HP</div>
                    <div className="font-black text-lg flex items-center gap-2">AI BOSS <Skull className="text-rose-500" size={18}/></div>
                  </div>
                  <div className="h-4 bg-slate-900 rounded-full border border-slate-800 overflow-hidden shadow-inner relative flex justify-end">
                    <motion.div 
                      className="absolute inset-y-0 right-0 bg-gradient-to-l from-rose-600 to-rose-400" 
                      animate={{ width: `${(oppHp / MAX_HP) * 100}%` }} 
                      transition={{ type: 'spring', bounce: 0.2 }}
                    />
                  </div>
                </div>
              </div>

              {/* Combat Log */}
              <div className="h-16 mb-4 flex flex-col justify-end text-center pointer-events-none">
                <AnimatePresence>
                  {combatLog.map((log, i) => (
                    <motion.div key={i} initial={{opacity:0, y:10}} animate={{opacity:1-i*0.3, y:0}} exit={{opacity:0}} className={`text-sm font-bold ${log.isCrit ? 'text-amber-400 text-lg uppercase drop-shadow-md' : 'text-slate-400'}`}>
                      {log.msg}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Main Duel Interface */}
              <div className="flex-1 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 flex flex-col shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-amber-500 to-rose-500" />
                
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">Duel Active</span>
                  <button onClick={() => setShieldActive(true)} disabled={shieldActive} className={`flex items-center gap-2 px-3 py-1 rounded font-bold text-xs transition ${shieldActive ? 'bg-slate-800 text-slate-600' : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'}`}>
                    <ShieldAlert size={14} /> 50/50 Shield
                  </button>
                </div>

                <div className="text-lg md:text-xl font-medium mb-10 leading-relaxed overflow-y-auto max-h-[200px]">
                  <Latex>{currentQ?.question_latex || 'Synchronizing with CBT Engine...'}</Latex>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                  {(currentQ?.options || []).map((opt, i) => {
                    const isFiltered = shieldActive && i !== currentQ?.correct_index && i !== (((currentQ?.correct_index || 0) + 1) % 4);
                    return (
                      <button 
                        key={i} 
                        onClick={() => handleAnswer(i)}
                        className={`p-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:border-slate-500 transition text-left font-semibold relative overflow-hidden group ${isFiltered ? 'opacity-10 pointer-events-none' : ''}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
                        <Latex>{opt}</Latex>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {status === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
              <Trophy size={100} className={`mb-8 ${myHp > 0 ? 'text-amber-500' : 'text-slate-600'}`} />
              <h2 className="text-5xl font-black mb-4 uppercase">
                {myHp > 0 ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">VICTORY</span> : <span className="text-slate-500">DEFEAT</span>}
              </h2>
              <p className="text-slate-400 mb-8 font-bold">
                {myHp > 0 ? '+150 XP Earned | Boss Defeated' : 'You were crushed by the AI. Try again.'}
              </p>
              <button onClick={() => { setStatus('idle'); setMyHp(MAX_HP); setOppHp(MAX_HP); setStreak(0); setCombo(1.0); }} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-slate-700 transition">
                Return to Hub
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
