import { Trophy, Swords, Zap, X, Gamepad2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCbtStore } from '@/store/cbtStore';

export default function KurukshetraHub({ onBack, onDuel, onCbt, onMiniTest }: { onBack: () => void, onDuel: () => void, onCbt: () => void, onMiniTest: () => void }) {
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
      
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <h2 className="text-3xl font-black mb-6">Choose Your Battle</h2>

        <button onClick={onDuel} className="w-full relative overflow-hidden group p-6 rounded-3xl border border-coral/30 bg-gradient-to-br from-slate-900 to-slate-950 text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-coral/10 rounded-full blur-2xl group-hover:bg-coral/20 transition" />
          <Swords size={32} className="text-coral mb-4" />
          <h3 className="text-xl font-bold mb-2">Ranked 1v1 Duels</h3>
          <p className="text-slate-400 text-sm">Wager your ELO. Race against real opponents to solve PYQs. Winner takes all.</p>
        </button>

        <button onClick={handleCbtClick} className="w-full relative overflow-hidden group p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 to-slate-950 text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition" />
          <FileText size={32} className="text-emerald-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Full NTA CBT Exam</h3>
          <p className="text-slate-400 text-sm">Take a complete 3-hour adaptive mock test with granular mistake taxonomy.</p>
        </button>

        <button onClick={onMiniTest} className="w-full relative overflow-hidden group p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-950 text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition" />
          <Zap size={32} className="text-amber-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Custom Mini-Test</h3>
          <p className="text-slate-400 text-sm">Select a subject and question count for a rapid-fire revision burst.</p>
        </button>
      </main>
    </div>
  );
}
