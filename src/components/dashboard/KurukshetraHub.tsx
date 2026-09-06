import { Trophy, Swords, Zap, X, Gamepad2, FileText, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCbtStore } from '@/store/cbtStore';

interface KurukshetraHubProps {
  onBack: () => void;
  onDuel: () => void;
  onCbt: () => void;
  onMiniTest: () => void;
  onQuickMatch?: () => void;
}

export default function KurukshetraHub({ onBack, onDuel, onCbt, onMiniTest, onQuickMatch }: KurukshetraHubProps) {
  const handleCbtClick = () => {
    useCbtStore.getState().hydrateQuestions([]);
    onCbt();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans text-white pb-[env(safe-area-inset-bottom)]">
      <header className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
        <div className="font-black text-lg tracking-widest text-coral uppercase flex items-center gap-2">
          <Gamepad2 size={20} /> Kurukshetra
        </div>
      </header>
      
      <main className="flex-1 p-6 overflow-y-auto space-y-6 pb-28 relative z-10">
        <h2 className="text-3xl font-black mb-6">Choose Your Battle</h2>

        <button onClick={onDuel} className="w-full relative z-20 cursor-pointer overflow-hidden group p-6 rounded-3xl border border-coral/30 hover:border-blue-500 bg-gradient-to-br from-slate-900 to-slate-950 hover:bg-slate-800/80 transition-all text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-coral/10 rounded-full blur-2xl group-hover:bg-coral/20 transition" />
          <Swords size={32} className="text-coral mb-4" />
          <h3 className="text-xl font-bold mb-2">Mythic Custom Lobbies</h3>
          <p className="text-slate-400 text-sm">Create a private room with a PIN and summon up to 10 warriors for an epic Mythic battle.</p>
        </button>

        <button onClick={onQuickMatch} className="w-full relative z-20 cursor-pointer overflow-hidden group p-6 rounded-3xl border border-indigo-500/30 hover:border-blue-500 bg-gradient-to-br from-slate-900 to-slate-950 hover:bg-slate-800/80 transition-all text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition" />
          <Zap size={32} className="text-indigo-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">QuickMatch 1v1 PvP</h3>
          <p className="text-slate-400 text-sm">Instantly find a 5-question ranked duel against a live opponent or an AI Scholar.</p>
        </button>

        <button onClick={handleCbtClick} className="w-full relative z-20 cursor-pointer overflow-hidden group p-6 rounded-3xl border border-emerald-500/30 hover:border-blue-500 bg-gradient-to-br from-slate-900 to-slate-950 hover:bg-slate-800/80 transition-all text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition" />
          <FileText size={32} className="text-emerald-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Full NTA CBT Exam</h3>
          <p className="text-slate-400 text-sm">Take a complete 3-hour adaptive mock test with granular mistake taxonomy.</p>
        </button>

        <button onClick={onMiniTest} className="w-full relative z-20 cursor-pointer overflow-hidden group p-6 rounded-3xl border border-amber-500/30 hover:border-blue-500 bg-gradient-to-br from-slate-900 to-slate-950 hover:bg-slate-800/80 transition-all text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition" />
          <Zap size={32} className="text-amber-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Custom Mini-Test</h3>
          <p className="text-slate-400 text-sm">Select a subject and question count for a rapid-fire revision burst.</p>
        </button>
      </main>
    </div>
  );
}
