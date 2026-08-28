import { useMemo, useState } from 'react';
import { useCbtStore } from '@/store/cbtStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, Clock, Zap, FileSearch, ArrowRight, BrainCircuit } from 'lucide-react';
import Latex from 'react-latex-next';
import AIDoubtSolver from '../AIDoubtSolver';

export default function CbtDiagnostics() {
  const { questions, answers, timeSpentMs, endSession } = useCbtStore();
  const [reviewQ, setReviewQ] = useState<any>(null);

  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let totalTime = 0;
    let guessCount = 0;
    let timeSinks = 0;
    
    const subjectMap: Record<string, { total: number, correct: number }> = {};

    questions.forEach((q) => {
      const ans = answers[q.id];
      const timeMs = timeSpentMs[q.id] || 0;
      totalTime += timeMs;

      if (!subjectMap[q.subject]) {
        subjectMap[q.subject] = { total: 0, correct: 0 };
      }
      subjectMap[q.subject].total++;

      if (ans === undefined) {
        skipped++;
      } else if (ans === q.correct_index) {
        correct++;
        subjectMap[q.subject].correct++;
        // Guess detection: Correct but under 5 seconds
        if (timeMs > 0 && timeMs < 5000) guessCount++;
      } else {
        wrong++;
        // Time sink: Wrong and over 2 minutes (120000ms)
        if (timeMs > 120000) timeSinks++;
      }
    });

    const subjectPerformance = Object.keys(subjectMap).map(subj => ({
      name: subj,
      accuracy: Math.round((subjectMap[subj].correct / subjectMap[subj].total) * 100)
    }));

    return { correct, wrong, skipped, totalTime, guessCount, timeSinks, subjectPerformance };
  }, [questions, answers, timeSpentMs]);

  const score = (stats.correct * 4) - (stats.wrong * 1);
  const maxScore = questions.length * 4;

  const handleAnalyzeMistake = (q: any) => {
    // We launch the AI Doubt Solver pre-filled with this mistake context
    setReviewQ(q);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-y-auto p-5 pb-32">
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="text-coral font-black tracking-widest text-[10px] uppercase mb-2">Deep Diagnostics</div>
            <h1 className="text-4xl sm:text-5xl font-black">Performance Analysis</h1>
          </div>
          <button onClick={endSession} className="px-6 py-3 rounded-full bg-slate-800 font-bold hover:bg-slate-700 transition">
            Exit to Dashboard
          </button>
        </div>

        {/* High-Level Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel bg-cyan-500/10 border-cyan-500/20 p-6 rounded-[2rem] text-center">
            <div className="text-4xl font-black text-cyan-400">{score}</div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase">Out of {maxScore}</div>
          </div>
          <div className="glass-panel bg-emerald-500/10 border-emerald-500/20 p-6 rounded-[2rem] text-center">
            <div className="text-4xl font-black text-emerald-400">{stats.correct}</div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase">Correct</div>
          </div>
          <div className="glass-panel bg-rose-500/10 border-rose-500/20 p-6 rounded-[2rem] text-center">
            <div className="text-4xl font-black text-rose-400">{stats.wrong}</div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase">Incorrect</div>
          </div>
          <div className="glass-panel bg-slate-800 border-slate-700 p-6 rounded-[2rem] text-center">
            <div className="text-4xl font-black text-slate-300">{stats.skipped}</div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase">Skipped</div>
          </div>
        </div>

        {/* Behavioral Flags */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-panel bg-amber-500/10 border-amber-500/20 p-6 rounded-[2rem] flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-500"><Zap size={24} /></div>
            <div>
              <h3 className="font-black text-lg text-amber-400">Likely Guesses</h3>
              <p className="text-sm text-slate-400 mt-1">You answered <strong className="text-white">{stats.guessCount}</strong> correct questions in under 5 seconds. Ensure you actually know the concept.</p>
            </div>
          </div>
          <div className="glass-panel bg-rose-500/10 border-rose-500/20 p-6 rounded-[2rem] flex items-start gap-4">
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-500"><Clock size={24} /></div>
            <div>
              <h3 className="font-black text-lg text-rose-400">Time Sinks</h3>
              <p className="text-sm text-slate-400 mt-1">You spent over 2 minutes on <strong className="text-white">{stats.timeSinks}</strong> questions that you got wrong. Practice skipping!</p>
            </div>
          </div>
        </div>

        {/* Subject Accuracy Chart */}
        <div className="glass-panel bg-slate-900/60 p-6 sm:p-8 rounded-[2rem]">
          <h3 className="font-black text-xl mb-6 flex items-center gap-2"><Target size={20} className="text-cyan-400" /> Subject Mastery</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.subjectPerformance}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                  {stats.subjectPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.accuracy > 70 ? '#10b981' : entry.accuracy > 40 ? '#f59e0b' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Log Review */}
        <div className="glass-panel bg-slate-900/60 p-6 sm:p-8 rounded-[2rem]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-xl flex items-center gap-2"><FileSearch size={20} className="text-coral" /> Error Log Review</h3>
            <button className="bg-coral/20 text-coral px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-coral hover:text-white transition">
              Generate Correction Test
            </button>
          </div>
          
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const ans = answers[q.id];
              if (ans === undefined || ans === q.correct_index) return null; // Only show mistakes

              return (
                <div key={q.id} className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-rose-400">Q. {idx + 1}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase">{q.subject} • {q.chapter}</span>
                  </div>
                  <div className="prose prose-invert text-sm max-w-none text-slate-300">
                    <Latex>{q.question_latex}</Latex>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-sm">
                      Your answer: <span className="font-bold text-rose-400"><Latex>{q.options[ans]}</Latex></span> <br/>
                      Correct: <span className="font-bold text-emerald-400"><Latex>{q.options[q.correct_index]}</Latex></span>
                    </div>
                    <button 
                      onClick={() => handleAnalyzeMistake(q)}
                      className="shrink-0 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition"
                    >
                      <BrainCircuit size={16} className="text-cyan-400" /> Analyze Mistake
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <AIDoubtSolver 
        isOpen={reviewQ !== null} 
        onClose={() => setReviewQ(null)} 
        q={reviewQ} 
      />
    </div>
  );
}
