import React, { useState } from 'react';
import { Target, Clock, BookOpen, Layers, X, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useCbtStore } from '@/store/cbtStore';
import { Loader2 } from 'lucide-react';
import { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function CustomTestBuilder({ onBack, onStart }: { onBack: () => void, onStart: () => void }) {
  const [subjects, setSubjects] = useState<string[]>(['Physics']);
  const [source, setSource] = useState('PYQ Only');
  const [questionCount, setQuestionCount] = useState(30);
  const [timeLimit, setTimeLimit] = useState(60);

  const [loading, setLoading] = useState(false);
  const toggleSubject = (s: string) => {
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  
  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Fetch a random chunk based on questionCount
      const maxOffset = 2000;
      const randomOffset = Math.floor(Math.random() * maxOffset);
      const { data: settings } = await (supabase as any).from('platform_settings').select('full_pyq_access').eq('id', 'GLOBAL').single();
      const hasAccess = settings?.full_pyq_access || false;

      let query = (supabase as any).from('cbt_questions').select('*');
      if (!hasAccess) {
        query = query.eq('is_sample', true).limit(questionCount);
      } else {
        query = query.in('subject', subjects).range(randomOffset, randomOffset + questionCount - 1);
      }

      const { data, error } = await query;
        
      if (data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          ...d,
          question_latex: d.question_text || d.question_latex,
          correct_index: d.options ? (d.options.findIndex((o: string) => o === d.correct_answer) === -1 ? 0 : d.options.findIndex((o: string) => o === d.correct_answer)) : (d.correct_option || 0),
          explanation_latex: d.explanation || d.solution_latex || 'Standard derivation applied.'
        }));
        useCbtStore.getState().hydrateQuestions(mapped);
        onStart();
      } else {
        // Fallback to MASTER_QUESTIONS
        const localFiltered = MASTER_QUESTIONS.filter(q => subjects.includes(q.subject));
        const finalQs = localFiltered.length > 0 ? localFiltered : MASTER_QUESTIONS.slice(0, 30);
        const mapped = finalQs.map((d: any) => ({
          ...d,
          correct_index: d.correct_option || 0,
          explanation_latex: d.solution_latex || 'Standard derivation applied.'
        }));
        useCbtStore.getState().hydrateQuestions(mapped);
        onStart();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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
      
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"><Layers size={14}/> 5. Preview Pool</h3>
          <div className="space-y-3">
            {MASTER_QUESTIONS.slice(0, 10).map((q, idx) => (
              <div key={idx} className="text-white bg-slate-800 p-4 rounded-lg shadow-lg">
                <Latex>{q.question_latex}</Latex>
              </div>
            ))}
          </div>
        </section>
      </main>


      <footer className="p-6 bg-slate-900 border-t border-slate-800">
        <button 
          onClick={handleGenerate} 
          disabled={subjects.length === 0}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <>GENERATE DRILL <ChevronRight size={20} /></>}
        </button>
      </footer>
    </div>
  );
}
