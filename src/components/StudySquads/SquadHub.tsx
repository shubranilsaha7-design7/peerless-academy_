import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Zap, X, Trophy } from 'lucide-react';

const mockSquad = [
  { id: 1, name: 'Quantum Elite', members: 48, elo: 85400, rank: 1 },
  { id: 2, name: "Newton's Apples", members: 50, elo: 82100, rank: 2 },
  { id: 3, name: 'Integration Masters', members: 35, elo: 61000, rank: 3 },
];

export default function SquadHub({ onBack }: { onBack: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans text-white">
      <header className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
        <div className="font-black text-lg tracking-widest text-indigo-500 uppercase flex items-center gap-2">
          <Shield size={20} /> Study Squads
        </div>
      </header>
      
      <main className="flex-1 p-6 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="text-center py-10">
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Guild Leaderboards</h1>
            <p className="text-slate-400">Join a 50-member squad. Pool your ELO. Dominate the ranks.</p>
            <div className="mt-8 flex gap-4 justify-center">
              <button className="bg-indigo-500 text-white px-8 py-3 rounded-full font-black shadow-lg shadow-indigo-500/30 hover:scale-105 transition">Create Squad</button>
              <button className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-700 transition">Find Guild</button>
            </div>
          </div>

          <div className="space-y-4">
            {mockSquad.map((squad, i) => (
              <motion.div 
                key={squad.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="text-3xl font-black text-slate-600 w-8">#{squad.rank}</div>
                  <div>
                    <h3 className="text-xl font-bold">{squad.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Users size={14} /> {squad.members}/50</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-400">{squad.elo.toLocaleString()}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Guild ELO</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
