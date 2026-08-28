import { useState } from 'react';
import { Settings, Play, X, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MiniTestGenerator({ onBack, onStart }: { onBack: () => void, onStart: () => void }) {
  const [questions, setQuestions] = useState(15);
  const [difficulty, setDifficulty] = useState('Medium');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans text-white">
      <header className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
        <div className="font-black text-lg tracking-widest text-amber-500 uppercase flex items-center gap-2">
          <Settings size={20} /> Custom Mini-Test
        </div>
      </header>
      
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl">
          <div className="w-16 h-16 mx-auto bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-full mb-6">
            <SlidersHorizontal size={32} />
          </div>
          <h2 className="text-2xl font-black text-center mb-8">Configure Payload</h2>

          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">
                <span>Question Count</span>
                <span className="text-amber-500">{questions}</span>
              </label>
              <input 
                type="range" min="5" max="50" step="5" 
                value={questions} onChange={(e) => setQuestions(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Target Difficulty</label>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map(lvl => (
                  <button 
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`flex-1 py-3 rounded-xl font-bold transition ${difficulty === lvl ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={onStart}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 text-slate-950 font-black py-4 rounded-xl uppercase tracking-widest hover:bg-amber-400 transition"
            >
              <Play size={20} /> Generate & Start
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
