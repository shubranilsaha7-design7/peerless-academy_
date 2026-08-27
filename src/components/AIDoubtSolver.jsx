import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, ChevronRight, Lightbulb, MessageCircle,
  Share2, Sparkles, X, BookOpen, Camera, Send, Search, Video, Globe, Image as ImageIcon, Bot
} from 'lucide-react';
import { getFacultyWhatsAppLink } from '../utils/faculty';

export default function AIDoubtSolver({ isOpen, onClose, question, userAnswer }) {
  const [mode, setMode]         = useState('hint');  // 'hint' | 'full'
  const [step, setStep]         = useState(0);
  const [shared, setShared]     = useState(false);

  // Standalone Chat State
  const [chatMode, setChatMode] = useState('academic'); // 'academic' | 'non-academic'
  const [messages, setMessages] = useState([
    { role: 'ai', type: 'text', content: 'Hi! I am the Peerless AI Agent. Ask me an academic doubt or switch to non-academic for general queries. You can type or use the scan button to upload a question!' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isScanning]);

  if (!isOpen) return null;

  const q = question;
  const userOpt   = q && userAnswer != null ? q.options[userAnswer]   : null;
  const correctOpt = q ? q.options[q.correct_option_index] : null;
  const isCorrect  = q && userAnswer === q.correct_option_index;

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

  const handleSendChat = (e) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = inputVal.trim();
    setMessages(prev => [...prev, { role: 'user', type: 'text', content: userMsg }]);
    setInputVal('');

    setTimeout(() => {
      let aiResponse;
      if (chatMode === 'academic') {
        if (userMsg.toLowerCase().includes('video') || userMsg.toLowerCase().includes('youtube')) {
          aiResponse = { role: 'ai', type: 'video', content: 'Here is the best video solution I found for this concept from YouTube:', url: 'https://www.youtube.com/embed/ScMzIvxBSi4' };
        } else {
          aiResponse = { role: 'ai', type: 'text', content: `Based on your academic query regarding "${userMsg}", the core concept involves applying the standard formula. Let me break it down step-by-step for you...` };
        }
      } else {
        aiResponse = { role: 'ai', type: 'text', content: `As a non-academic query, here is what I found on the web regarding "${userMsg}": It is generally recommended to balance your schedule with proper sleep and nutrition for peak performance.` };
      }
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setMessages(prev => [...prev, { role: 'user', type: 'image', content: 'Scanned image uploaded.' }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', type: 'video', content: 'I scanned the question from your image. It matches a JEE Main 2022 Physics question. Here is a detailed video solution:', url: 'https://www.youtube.com/embed/ScMzIvxBSi4' }]);
      }, 1500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed right-0 top-0 z-[85] flex flex-col h-full w-full max-w-[420px] bg-slate-950 border-l border-cyan-500/20 shadow-[−20px_0_60px_rgba(0,255,255,.06)]"
          >
            {/* Header */}
            <div className="flex-none sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-5 py-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Peerless AI Agent</h3>
                  <p className="text-[10px] text-slate-500">Academic & Web Doubt Solver</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-5">
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
                  <>
                    {/* Standalone Chat Mode */}
                    <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 mb-6">
                      <button 
                        onClick={() => setChatMode('academic')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition ${chatMode === 'academic' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                      >
                        Academic
                      </button>
                      <button 
                        onClick={() => setChatMode('non-academic')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition ${chatMode === 'non-academic' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        <Globe size={13} /> Web / General
                      </button>
                    </div>

                    <div className="space-y-4">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-cyan-500/20 border border-cyan-500/30 text-white rounded-br-none' : 'bg-slate-900 border border-slate-700 text-slate-300 rounded-bl-none'}`}>
                            {msg.type === 'text' && (
                              <p className="text-xs leading-5 whitespace-pre-wrap">{msg.content}</p>
                            )}
                            {msg.type === 'image' && (
                              <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase">
                                <ImageIcon size={16} /> {msg.content}
                              </div>
                            )}
                            {msg.type === 'video' && (
                              <div className="space-y-2">
                                <p className="text-xs leading-5 text-white">{msg.content}</p>
                                <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 mt-2">
                                  <iframe src={msg.url} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {isScanning && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] rounded-2xl p-4 bg-slate-900 border border-slate-700 rounded-bl-none flex flex-col items-center justify-center space-y-3">
                            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin"></div>
                              <Camera size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 animate-pulse">Scanning Image & Searching Web...</span>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex-none p-4 bg-slate-950/90 border-t border-slate-800 backdrop-blur-md">
              {!q && (
                <form onSubmit={handleSendChat} className="flex gap-2 mb-2">
                  <button 
                    type="button"
                    onClick={handleScan}
                    disabled={isScanning}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 hover:bg-slate-800 transition disabled:opacity-50"
                  >
                    <Camera size={18} />
                  </button>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder="Type your doubt or question..."
                    className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={!inputVal.trim() || isScanning}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition disabled:opacity-50"
                  >
                    <Send size={18} className="ml-1" />
                  </button>
                </form>
              )}
              {q && (
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
              )}
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
