import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { Bookmark, ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, AlertTriangle, Send } from 'lucide-react';
import { useCbtStore, QuestionStatus } from '@/store/cbtStore';
import { useTestHydration } from '@/hooks/useTestHydration';
import BottomSheet from '../ui/BottomSheet';
import CbtDiagnostics from './CbtDiagnostics';

export default function CbtSimulator() {
  const [examType, setExamType] = useState<'JEE Main' | 'NEET'>('JEE Main');
  const [showPalette, setShowPalette] = useState(false);
  
  const { loading } = useTestHydration(examType, false);
  
  const { 
    questions, currentQuestionId, currentIndex, 
    statuses, answers, timeSpentMs,
    isTestActive, isTestSubmitted,
    startTest, tickTimer, nextQuestion, prevQuestion, 
    jumpToQuestion, selectOption, markReview, clearResponse, submitTest 
  } = useCbtStore();

  // The Timer Tick
  useEffect(() => {
    if (!isTestActive) return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isTestActive, tickTimer]);

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center text-slate-400">Hydrating Adaptive Payload...</div>;
  }

  if (isTestSubmitted) {
    return <CbtDiagnostics />;
  }

  if (!isTestActive) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-6">
        <h2 className="text-3xl font-black text-white">NTA CBT Simulator</h2>
        <p className="text-slate-400 text-sm">Offline resilience enabled. Activity tracking active.</p>
        <button 
          onClick={startTest}
          className="bg-coral text-white px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,107,0,0.4)] transition hover:scale-105"
        >
          Initialize Engine
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const currentStatus = statuses[currentQ.id] || 'notAnswered';
  const currentAnswer = answers[currentQ.id];

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case 'answered': return 'bg-emerald-500 border-emerald-500 text-white';
      case 'notAnswered': return 'bg-rose-500 border-rose-500 text-white';
      case 'review': return 'bg-amber-500 border-amber-500 text-white';
      case 'answeredReview': return 'bg-indigo-500 border-indigo-500 text-white';
      case 'unseen': default: return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  return (
    <div className="relative h-full flex flex-col font-sans">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-md p-4 border-b border-slate-800 shrink-0">
        <div className="font-bold text-slate-300">
          Q. {currentIndex + 1} <span className="text-slate-600">/ {questions.length}</span>
        </div>
        <div className="text-coral font-black animate-pulse flex items-center gap-2">
          {Math.floor((timeSpentMs[currentQ.id] || 0) / 1000)}s spent here
        </div>
        <button onClick={() => setShowPalette(true)} className="text-sm font-black bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
          Palette
        </button>
      </div>

      {/* Main Question Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-5 pb-32">
        <div className="glass-panel bg-slate-900/40 border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{currentQ.subject} • {currentQ.chapter}</span>
            <span className={`text-[10px] uppercase font-black px-2 py-1 rounded ${currentQ.difficulty === 'hard' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {currentQ.difficulty}
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-base sm:text-lg">
            <Latex>{currentQ.question_latex}</Latex>
          </div>

          <div className="mt-8 space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = currentAnswer === idx;
              return (
                <button
                  key={idx}
                  onClick={() => selectOption(currentQ.id, idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected 
                      ? 'bg-cyan-500/10 border-cyan-500 text-white' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span className="font-bold text-slate-500 mr-3">{String.fromCharCode(65 + idx)}.</span>
                  <Latex>{opt}</Latex>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Action Bar (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 p-4 safe-pb flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
          <button onClick={() => markReview(currentQ.id)} className="p-3 rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition">
            <Bookmark size={20} />
          </button>
          <button onClick={() => clearResponse(currentQ.id)} className="p-3 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 transition">
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prevQuestion} disabled={currentIndex === 0} className="p-3 rounded-full bg-slate-800 text-white disabled:opacity-30">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextQuestion} disabled={currentIndex === questions.length - 1} className="p-3 rounded-full bg-cyan-500 text-slate-900 font-black px-6 shadow-lg shadow-cyan-500/20 disabled:opacity-30">
            SAVE & NEXT
          </button>
        </div>
      </div>

      {/* Question Palette Bottom Sheet */}
      <BottomSheet isOpen={showPalette} onClose={() => setShowPalette(false)} >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-xl text-white">Question Palette</h3>
            <button onClick={submitTest} className="flex items-center gap-2 bg-coral text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-coral/30">
              <Send size={16} /> Submit Exam
            </button>
          </div>
          <div className="grid grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto pb-10">
            {questions.map((q, i) => {
              const status = statuses[q.id] || 'unseen';
              const isCurrent = currentIndex === i;
              return (
                <button
                  key={q.id}
                  onClick={() => { jumpToQuestion(i); setShowPalette(false); }}
                  className={`h-12 w-full rounded-xl flex items-center justify-center font-black border-2 transition ${getStatusColor(status)} ${isCurrent ? 'ring-2 ring-white scale-110 z-10' : ''}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </BottomSheet>

    </div>
  );
}
