import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, ChevronRight, Lightbulb, MessageCircle,
  Share2, Sparkles, X, BookOpen,
} from 'lucide-react';
import { getFacultyWhatsAppLink } from '../utils/faculty';

/**
 * AIDoubtSolver
 * ─────────────
 * Slide-over panel for step-by-step doubt solving.
 * Props:
 *  isOpen       – boolean
 *  onClose      – () => void
 *  question     – Question | null
 *  userAnswer   – number | null  (option index the user selected)
 */
export default function AIDoubtSolver({ isOpen, onClose, question, userAnswer }) {
  const [mode, setMode]         = useState('hint');  // 'hint' | 'full'
  const [step, setStep]         = useState(0);
  const [shared, setShared]     = useState(false);

  if (!isOpen) return null;

  const q = question;
  const userOpt   = q && userAnswer != null ? q.options[userAnswer]   : null;
  const correctOpt = q ? q.options[q.correct_option_index] : null;
  const isCorrect  = q && userAnswer === q.correct_option_index;

  // ── Hint Steps (progressive disclosure) ──────────────────────
  const hintSteps = q ? [
    {
      label: 'Understand the Concept',
      text: `This question is about ${q.subject} — specifically related to ${q.question_text.split(' ').slice(0, 8).join(' ')}...`,
      icon: BookOpen,
    },
    {
      label: 'Key Principle',
      text: isCorrect
        ? '✅ You got it right! The principle you applied is correct. Review the full explanation below to reinforce it.'
        : `⚠️ The answer you picked ("${userOpt}") is not correct. Think about the core formula or concept that governs this type of problem.`,
      icon: BrainCircuit,
    },
    {
      label: 'Direction to Solution',
      text: `Hint: The correct answer is "${correctOpt}". Try to work backwards — why does this specific option satisfy the conditions of the question?`,
      icon: Lightbulb,
    },
  ] : [];

  // ── WhatsApp Doubt Share ──────────────────────────────────────
  const buildWhatsAppText = () => {
    if (!q) return '';
    const lines = [
      `📚 *Peerless Academy — Doubt Request*`,
      ``,
      `*Question:* ${q.question_text}`,
      ``,
      `*Options:*`,
      ...q.options.map((o, i) => `   ${String.fromCharCode(65 + i)}. ${o}`),
      ``,
      `*My Answer:* ${userOpt ? `${userOpt}` : 'Not answered'}`,
      `*Correct Answer:* ${correctOpt}`,
      `*Subject:* ${q.subject} | Class ${q.class_level} | ${q.exam_type}`,
      ``,
      `Please help me understand this concept! 🙏`,
    ];
    return encodeURIComponent(lines.join('\n'));
  };

  const handleWhatsAppDoubt = () => {
    const subject = q?.subject;
    const link = getFacultyWhatsAppLink(subject, buildWhatsAppText());
    window.open(link, '_blank');
    setShared(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed right-0 top-0 z-[85] h-full w-full max-w-[420px] overflow-y-auto
                       bg-slate-950 border-l border-cyan-500/20 shadow-[−20px_0_60px_rgba(0,255,255,.06)]"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-5 py-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">AI Doubt Solver</h3>
                  <p className="text-[10px] text-slate-500">Powered by Peerless AI</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Question display */}
              {q ? (
                <>
                  <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-cyan-400 mb-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      {q.subject} · Class {q.class_level} · {q.exam_type} · {q.difficulty}
                    </div>
                    <p className="text-sm font-semibold text-white leading-6">{q.question_text}</p>
                    <div className="mt-3 space-y-1.5">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition
                            ${i === q.correct_option_index
                              ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300'
                              : i === userAnswer && i !== q.correct_option_index
                              ? 'bg-red-500/10 border border-red-500/40 text-red-300'
                              : 'bg-slate-800 border border-slate-700 text-slate-400'}`}
                        >
                          <span className="font-black">{String.fromCharCode(65 + i)}.</span>
                          {opt}
                          {i === q.correct_option_index && <span className="ml-auto text-emerald-400">✓</span>}
                          {i === userAnswer && i !== q.correct_option_index && <span className="ml-auto text-red-400">✗</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mode toggle */}
                  <div className="flex rounded-xl border border-slate-700 p-1 bg-slate-900">
                    {['hint', 'full'].map(m => (
                      <button
                        key={m}
                        onClick={() => { setMode(m); setStep(0); }}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black uppercase tracking-wider transition
                          ${mode === m ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                      >
                        {m === 'hint' ? <><Lightbulb size={13} /> Hint Mode</> : <><BrainCircuit size={13} /> Full Solution</>}
                      </button>
                    ))}
                  </div>

                  {/* Hint Mode — progressive steps */}
                  {mode === 'hint' && (
                    <div className="space-y-3">
                      {hintSteps.slice(0, step + 1).map((hs, i) => {
                        const Icon = hs.icon;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Icon size={14} className="text-cyan-400" />
                              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Step {i + 1}: {hs.label}</span>
                            </div>
                            <p className="text-xs leading-5 text-slate-300">{hs.text}</p>
                          </motion.div>
                        );
                      })}

                      {step < hintSteps.length - 1 && (
                        <button
                          onClick={() => setStep(s => s + 1)}
                          className="w-full flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 py-3 text-xs font-black text-cyan-400 hover:bg-cyan-500/10 transition"
                        >
                          Next Hint <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Full Solution Mode */}
                  {mode === 'full' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <BrainCircuit size={14} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Full Explanation</span>
                      </div>
                      <p className="text-sm leading-6 text-slate-200">{q.explanation}</p>
                      <div className="mt-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                        <p className="text-xs font-black text-emerald-300">✅ Correct Answer: {correctOpt}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* WhatsApp Doubt Trigger */}
                  <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Still Confused? Ask Your Tutor</p>
                    <button
                      onClick={handleWhatsAppDoubt}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1dba58] py-3 text-sm font-black text-white transition active:scale-95"
                    >
                      <MessageCircle size={16} />
                      {shared ? 'WhatsApp Opened ✓' : '1-Click Send to Tutor via WhatsApp'}
                    </button>
                    <p className="text-[10px] text-center text-slate-500">
                      Sends question, your answer & error analysis pre-filled
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Sparkles size={40} className="text-cyan-400/40 mb-4" />
                  <p className="text-slate-400 text-sm">Select a question during a quiz<br />to get AI-powered doubt solving.</p>
                </div>
              )}
            </div>

            {/* WhatsApp Score Share (shown below doubt section always) */}
            {q && (
              <div className="sticky bottom-0 border-t border-slate-800 bg-slate-950/90 px-5 py-4 backdrop-blur-md">
                <button
                  onClick={() => {
                    const text = encodeURIComponent(
                      `🏆 *Peerless Academy — Practice Result*\n\nSubject: ${q.subject}\nClass ${q.class_level} · ${q.exam_type}\n\nStatus: ${isCorrect ? '✅ Got it right!' : '❌ Got it wrong'}\nCorrect Answer: ${correctOpt}\n\nKeep solving! 💪 — Peerless Academy`
                    );
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-xs font-black text-slate-300 hover:border-[#25D366] hover:text-[#25D366] transition"
                >
                  <Share2 size={14} /> Share Score on WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
