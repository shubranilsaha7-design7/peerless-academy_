import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { Bookmark, ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, ShieldAlert, Send } from 'lucide-react';
import { useCbtStore, QuestionStatus } from '@/store/cbtStore';
import { useTestHydration } from '@/hooks/useTestHydration';
import { useProctoring } from '@/hooks/useProctoring';
import BottomSheet from '../ui/BottomSheet';
import CbtDiagnostics from './CbtDiagnostics';

export default function CbtSimulator() {
  const [examType, setExamType] = useState<'JEE_MAIN' | 'NEET'>('JEE_MAIN');
  const [showPalette, setShowPalette] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(0); // 1 for next, -1 for prev
  
  const storeQs = useCbtStore(s => s.questions);
  const [shouldSkip] = useState(storeQs.length > 0);
  const { loading } = useTestHydration(examType, false, shouldSkip);
  
  const { 
    questions, currentQuestionId, currentIndex, 
    statuses, answers, timeSpentMs,
    isTestActive, isTestSubmitted,
    startTest, tickTimer, nextQuestion, prevQuestion, 
    jumpToQuestion, selectOption, markReview, clearResponse, submitTest 
  } = useCbtStore();
  
  const { infractions } = useProctoring('temp-user-id', 'temp-session-id', isTestActive);
  useEffect(() => { if (!isTestActive) startTest(); }, [isTestActive, startTest]);
  
  useEffect(() => {
    if (!isTestActive) return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isTestActive, tickTimer]);

  if (loading) return null;

  if (isTestSubmitted) {
    return <CbtDiagnostics />;
  }

  if (!isTestActive) return null;

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const currentStatus = statuses[currentQ.id] || 'unseen';
  const currentAnswer = answers[currentQ.id];

  const handleNext = () => { setSwipeDirection(1); nextQuestion(); };
  const handlePrev = () => { setSwipeDirection(-1); prevQuestion(); };

  // Helper for animated OLED status styling
  const getStatusColor = (status: QuestionStatus) => {
    switch(status) {
      case 'answered': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      case 'review': return 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
      case 'answeredReview': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]';
      case 'notAnswered': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const msToTime = (ms: number) => {
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor((ms / (1000 * 60)) % 60);
    const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 overflow-hidden relative">
      {/* HUD Telemetry Bar */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center font-black text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            {currentIndex + 1}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Physics</span>
            <span className="text-xs font-bold">{currentQ.chapter || 'Assessment'}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {infractions > 0 && (
            <div className="flex items-center gap-1 text-rose-500 text-xs font-black animate-pulse">
              <ShieldAlert size={14} /> WARN: {infractions}
            </div>
          )}
          <div className="font-mono text-cyan-400 text-lg shadow-[0_0_10px_rgba(6,182,212,0.2)] bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20">
            {msToTime(timeSpentMs[currentQ.id] || 0)}
          </div>
        </div>
      </header>

      {/* OLED Liquid Container */}
      <main className="flex-1 relative overflow-hidden flex flex-col p-4">
        <AnimatePresence initial={false} custom={swipeDirection} mode="popLayout">
          <motion.div key={currentQ.id}
            custom={swipeDirection}
            initial={{ opacity: 0, x: swipeDirection > 0 ? 50 : -50, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: swipeDirection > 0 ? -50 : 50, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex-1 flex flex-col cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x;
              if (swipe < -50) {
                if (currentIndex < questions.length - 1) handleNext();
              } else if (swipe > 50) {
                if (currentIndex > 0) handlePrev();
              }
            }}
          >
            {/* Question Text */}
            <div className="relative z-20 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl text-white text-lg md:text-xl font-medium leading-relaxed select-none [&_.katex]:text-white">
              <Latex>{currentQ.question_latex}</Latex>
            </div>
            
            {/* Options */}
            <div className="flex-1 overflow-y-auto overscroll-y-contain pb-24 space-y-4">
              {(currentQ.options || (currentQ as any).options_json || []).map((opt, i) => {
                const isSelected = currentAnswer === i;
                return (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    key={i}
                    onClick={() => selectOption(currentQ.id, i)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex gap-5 items-center ${isSelected ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 active:bg-blue-600'}`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-sm sm:text-base transition-colors ${isSelected ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="flex-1 text-base select-none text-slate-100 [&_.katex]:text-slate-100">
                      <Latex>{opt}</Latex>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Control Deck */}
      <footer className="flex-shrink-0 grid grid-cols-4 gap-2 p-3 bg-slate-900 border-t border-slate-800 pb-[env(safe-area-inset-bottom)] z-20">
        <button onClick={handlePrev} disabled={currentIndex === 0} className="flex flex-col items-center justify-center py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30 transition">
          <ChevronLeft size={20} /> <span className="text-[10px] font-bold uppercase mt-1">Prev</span>
        </button>
        <button onClick={() => markReview(currentQ.id)} className={`flex flex-col items-center justify-center py-2 rounded-lg transition ${currentStatus.toLowerCase().includes('review') ? 'text-purple-400 bg-purple-500/10 shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <Bookmark size={20} fill={currentStatus.toLowerCase().includes('review') ? 'currentColor' : 'none'} /> <span className="text-[10px] font-bold uppercase mt-1">Mark</span>
        </button>
        <button onClick={() => clearResponse(currentQ.id)} disabled={currentAnswer === undefined} className="flex flex-col items-center justify-center py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30 transition">
          <RotateCcw size={20} /> <span className="text-[10px] font-bold uppercase mt-1">Clear</span>
        </button>
        <button onClick={handleNext} disabled={currentIndex === questions.length - 1} className="flex flex-col items-center justify-center py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30 transition">
          <ChevronRight size={20} /> <span className="text-[10px] font-bold uppercase mt-1">Next</span>
        </button>
      </footer>
      
      {/* Absolute Submit / Grid Button */}
      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+70px)] left-0 w-full px-4 flex justify-between pointer-events-none z-30">
        <button onClick={() => setShowPalette(true)} className="pointer-events-auto bg-slate-800 border border-slate-700 text-white rounded-full px-4 py-2 text-xs font-bold uppercase shadow-lg backdrop-blur-md hover:bg-slate-700 flex gap-2 items-center">
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          Grid
        </button>
        <button onClick={submitTest} className="pointer-events-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 rounded-full px-5 py-2 text-xs font-black uppercase shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-1.5 transition hover:scale-105">
          <CheckCircle2 size={14} /> Submit
        </button>
      </div>

      {/* OLED Grid Palette - Using CSS Containment for 120FPS scrolling */}
      <BottomSheet isOpen={showPalette} onClose={() => setShowPalette(false)}>
        <div className="p-5 max-h-[70vh] flex flex-col">
          <h3 className="font-black text-lg mb-4 text-white uppercase tracking-wider">Nav Grid</h3>
          <div className="flex-1 overflow-y-auto overscroll-y-contain pb-10" style={{ contain: 'strict' }}>
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, i) => {
                const s = statuses[q.id] || 'unseen';
                const isActive = i === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSwipeDirection(i > currentIndex ? 1 : -1);
                      jumpToQuestion(i);
                      setShowPalette(false);
                    }}
                    className={`h-12 w-full rounded-xl flex items-center justify-center font-black text-sm transition-all border ${getStatusColor(s)} ${isActive ? 'ring-2 ring-white scale-110 z-10' : ''}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
