import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Swords, Trophy, Users, Shield, Zap, X } from 'lucide-react';

export default function Arena({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<'idle' | 'seeking' | 'matched' | 'active'>('idle');
  const [matchId, setMatchId] = useState<string | null>(null);

  // Future logic for Supabase Realtime goes here
  const seekMatch = () => {
    setStatus('seeking');
    // Mock matchmaking
    setTimeout(() => {
      setStatus('matched');
      setTimeout(() => setStatus('active'), 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col font-sans text-white">
      <header className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition">
          <X size={24} />
        </button>
        <div className="font-black text-lg tracking-widest text-cyan-500 uppercase flex items-center gap-2">
          <Swords size={20} /> The Arena
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        
        {/* Ambient Lights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-screen blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full mix-blend-screen blur-[100px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
              <Shield size={64} className="text-slate-700 mx-auto mb-6" />
              <h2 className="text-4xl font-black mb-4">Ranked 1v1 Duels</h2>
              <p className="text-slate-400 max-w-sm mx-auto mb-8">Wager your ELO. Race against real opponents to solve PYQs. Winner takes all.</p>
              
              <button onClick={seekMatch} className="bg-cyan-500 text-slate-900 px-12 py-4 rounded-full font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.5)] transition hover:scale-105">
                Find Match
              </button>
            </motion.div>
          )}

          {status === 'seeking' && (
            <motion.div key="seeking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative w-32 h-32 mx-auto mb-8">
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 rounded-full border-4 border-cyan-500" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} className="absolute inset-0 rounded-full border-4 border-cyan-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={32} className="text-cyan-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-cyan-400">Scanning Lobby...</h3>
              <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest">Looking for opponents near your ELO</p>
            </motion.div>
          )}

          {status === 'matched' && (
            <motion.div key="matched" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ type: 'spring', bounce: 0.5 }}>
              <div className="flex items-center gap-8 mb-8">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-cyan-500/20 border-2 border-cyan-500 mx-auto mb-4 flex items-center justify-center"><Users size={32} className="text-cyan-400" /></div>
                  <div className="font-bold">You</div>
                  <div className="text-cyan-400 text-sm">ELO 1240</div>
                </div>
                <div className="text-4xl font-black text-slate-700 italic">VS</div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-rose-500/20 border-2 border-rose-500 mx-auto mb-4 flex items-center justify-center"><Users size={32} className="text-rose-400" /></div>
                  <div className="font-bold">Ghost_99</div>
                  <div className="text-rose-400 text-sm">ELO 1265</div>
                </div>
              </div>
              <h3 className="text-2xl font-black text-white animate-pulse">Match Found!</h3>
            </motion.div>
          )}

          {status === 'active' && (
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl">
              {/* CBT Simulator logic goes here */}
              <div className="glass-panel p-8 rounded-3xl text-center">
                <h3 className="text-2xl font-black mb-4">Duel in Progress</h3>
                <p className="text-slate-400 mb-6">Integration with CBT Simulator Engine in progress...</p>
                <button onClick={() => setStatus('idle')} className="px-6 py-2 bg-slate-800 rounded-full font-bold">Resign</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
