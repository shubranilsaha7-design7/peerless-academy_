import React, { useState } from 'react';
import { Target, Clock, BookOpen, Layers, X, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomTestBuilder({ onBack, onStart }: { onBack: () => void, onStart: () => void }) {
  const [subjects, setSubjects] = useState<string[]>(['Physics']);
  const [source, setSource] = useState('PYQ Only');
  const [questionCount, setQuestionCount] = useState(30);
  const [timeLimit, setTimeLimit] = useState(60);

  const toggleSubject = (s: string) => {
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans text-white pb-[env(safe-area-inset-bottom)]">
      <header className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
        <div className="font-black text-lg tracking-widest text-emerald-400 uppercase flex items-center gap-2">
          <Target size={20} /> Test Builder
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"><BookOpen size={14}/> 1. Subjects</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Physics', 'Chemistry', 'Mathematics', 'Biology'].map(s => (
              <button 
                key={s} 
                onClick={() => toggleSubject(s)}
                className={`p-4 rounded-xl border font-bold text-sm transition ${subjects.includes(s) ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"><Layers size={14}/> 2. Question Source</h3>
          <div className="grid grid-cols-3 gap-2">
            {['PYQ Only', 'Mock Only', 'Mixed'].map(s => (
              <button 
                key={s} 
                onClick={() => setSource(s)}
                className={`p-3 rounded-lg border text-xs font-bold transition ${source === s ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"><Target size={14}/> 3. Question Count ({questionCount})</h3>
          <input 
            type="range" min="10" max="90" step="10" 
            value={questionCount} 
            onChange={e => setQuestionCount(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-xs font-mono text-slate-500 mt-2">
            <span>10 Qs</span>
            <span>90 Qs</span>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"><Clock size={14}/> 4. Time Limit ({timeLimit} mins)</h3>
          <input 
            type="range" min="15" max="180" step="15" 
            value={timeLimit} 
            onChange={e => setTimeLimit(Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-xs font-mono text-slate-500 mt-2">
            <span>15m</span>
            <span>180m</span>
          </div>
        </section>
      </main>

      <footer className="p-6 bg-slate-900 border-t border-slate-800">
        <button 
          onClick={onStart} 
          disabled={subjects.length === 0}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition disabled:opacity-50"
        >
          GENERATE DRILL <ChevronRight size={20} />
        </button>
      </footer>
    </div>
  );
}
