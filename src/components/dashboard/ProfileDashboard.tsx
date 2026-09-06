import { User, Shield, BrainCircuit, Target, Network, Settings, X, LogOut, Clock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

export default function ProfileDashboard({ 
  onBack, onNavigate, onSignOut 
}: { 
  onBack: () => void, 
  onNavigate: (route: string) => void,
  onSignOut: () => void 
}) {
  const tools = [
    { id: 'focus', label: 'Focus Mode', icon: Target, color: 'text-rose-500' },
    { id: 'error_notebook', label: 'Error Notebook', icon: BrainCircuit, color: 'text-amber-500' },
    { id: 'squads', label: 'Study Squads', icon: Shield, color: 'text-indigo-500' },
    { id: 'rank', label: 'Rank Simulator', icon: Trophy, color: 'text-emerald-500' },
    { id: 'roadmap', label: 'Concept Roadmap', icon: Network, color: 'text-fuchsia-500' },
    { id: 'parent', label: 'Parent Portal', icon: Clock, color: 'text-blue-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans text-white pb-[env(safe-area-inset-bottom)]">
      <header className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
        <div className="font-black text-lg tracking-widest text-slate-300 uppercase flex items-center gap-2">
          <User size={20} /> Profile
        </div>
      </header>
      
      <main className="flex-1 p-6 overflow-y-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-black shadow-lg">
            S
          </div>
          <div>
            <h2 className="text-2xl font-black">Student</h2>
            <p className="text-slate-400 text-sm">ELO: 2750 | Level 12</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Phase 3 Tools</h3>
          <div className="grid grid-cols-2 gap-4">
            {tools.map(t => {
              const Icon = t.icon;
              return (
                <button 
                  key={t.id}
                  onClick={() => onNavigate(t.id)}
                  className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-slate-800 transition"
                >
                  <Icon size={28} className={t.color} />
                  <span className="text-xs font-bold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={onSignOut} className="w-full py-4 rounded-xl border border-rose-500/30 text-rose-500 font-bold hover:bg-rose-500/10 transition flex items-center justify-center gap-2">
          <LogOut size={18} /> Sign Out
        </button>
      </main>
    </div>
  );
}
// Fix Trophy import
