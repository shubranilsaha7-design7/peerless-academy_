import React, { useState } from 'react';
import { BrainCircuit, Play, Sparkles, CheckCircle2, ChevronLeft } from 'lucide-react';
import Latex from 'react-latex-next';
import { motion } from 'framer-motion';

export default function ErrorNotebook({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'due' | 'all'>('due');
  const [studying, setStudying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Mock data for the Error Notebook
  const mockErrors = [
    {
      id: 'err-1',
      source: 'Kurukshetra (vs AI)',
      question: 'A particle moves along the x-axis with velocity $v = 4t - t^2$ m/s. Calculate the total distance covered before it comes to rest.',
      options: ['$\\frac{16}{3}$ m', '$\\frac{32}{3}$ m', '$16$ m', '$\\frac{64}{3}$ m'],
      correctIndex: 1,
      explanation: 'Velocity becomes zero when $v = 4t - t^2 = 0 \\implies t = 4$s. Distance $s = \\int_0^4 (4t - t^2) dt = [2t^2 - \\frac{t^3}{3}]_0^4 = 32 - \\frac{64}{3} = \\frac{32}{3}$ m.',
      next_review: 'Today',
      interval: 1, // days
      ease_factor: 2.5
    },
    {
      id: 'err-2',
      source: 'CBT Full Mock',
      question: 'For the cell reaction $Cu(s) + 2Ag^+(aq) \\rightarrow Cu^{2+}(aq) + 2Ag(s)$, standard cell potential is 0.46 V. Calculate the equilibrium constant at 298 K. (Take $\\frac{2.303 RT}{F} = 0.059$ V)',
      options: ['$4.0 \\times 10^{15}$', '$3.9 \\times 10^{15}$', '$4.0 \\times 10^{16}$', '$1.0 \\times 10^{15}$'],
      correctIndex: 1,
      explanation: '$\\log K_c = \\frac{n E^{\\circ}}{0.059} = \\frac{2 \\times 0.46}{0.059} = 15.59$. So, $K_c = 10^{15.59} \\approx 3.9 \\times 10^{15}$.',
      next_review: 'Today',
      interval: 3,
      ease_factor: 2.3
    }
  ];

  const handleSM2 = (quality: number) => {
    // Standard SM-2 math would go here, updating DB.
    setShowAnswer(false);
    setStudying(false); 
  };

  if (studying) {
    const q = mockErrors[0];
    return (
      <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden p-6">
        <header className="flex justify-between items-center mb-8">
          <div className="text-cyan-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><BrainCircuit size={16} /> Memory Imprint Phase</div>
          <div className="text-slate-400 font-mono text-sm">Card 1 / {mockErrors.length}</div>
        </header>
        
        <main className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
            <div className="absolute -top-3 -right-3 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
              {q.source}
            </div>
            
            <p className="text-lg leading-relaxed mb-8"><Latex>{q.question}</Latex></p>
            
            {!showAnswer ? (
              <button onClick={() => setShowAnswer(true)} className="w-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl py-4 font-bold tracking-wide hover:bg-cyan-500/20 transition">
                Reveal Answer
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 overflow-hidden">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <div className="text-xs text-emerald-400 font-black uppercase mb-1">Correct Answer</div>
                  <Latex>{q.options[q.correctIndex]}</Latex>
                </div>
                
                <div className="p-4 bg-slate-800/50 rounded-xl text-slate-300 text-sm leading-relaxed">
                  <div className="text-xs text-slate-500 font-black uppercase mb-2">Explanation</div>
                  <Latex>{q.explanation}</Latex>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-center text-xs text-slate-500 font-bold uppercase mb-4">How hard was this to recall?</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleSM2(1)} className="flex-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-lg py-3 text-sm font-bold hover:bg-rose-500/20">Blackout</button>
                    <button onClick={() => handleSM2(3)} className="flex-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg py-3 text-sm font-bold hover:bg-amber-500/20">Hard</button>
                    <button onClick={() => handleSM2(4)} className="flex-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg py-3 text-sm font-bold hover:bg-emerald-500/20">Good</button>
                    <button onClick={() => handleSM2(5)} className="flex-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg py-3 text-sm font-bold hover:bg-cyan-500/20">Easy</button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden p-6 pb-28">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition"><ChevronLeft size={24} /></button>
        <div>
          <h1 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">Error Notebook</h1>
          <p className="text-slate-400">SM-2 Spaced Repetition Algorithm</p>
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 flex items-center justify-between">
        <div>
          <div className="text-4xl font-black text-rose-500 mb-1">{mockErrors.length}</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Due for Review Today</div>
        </div>
        <button onClick={() => setStudying(true)} className="bg-gradient-to-r from-rose-500 to-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)] transition hover:scale-110">
          <Play size={24} className="ml-1" />
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-800 pb-2">
        <button className="px-4 py-2 text-sm font-bold border-b-2 border-rose-500 text-rose-500">Due Today</button>
        <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-300">All Errors</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {mockErrors.map(err => (
          <div key={err.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-1 rounded">{err.source}</span>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12} /> Lvl {err.interval}</span>
            </div>
            <p className="text-sm text-slate-300 line-clamp-2"><Latex>{err.question}</Latex></p>
          </div>
        ))}
      </div>
    </div>
  );
}
