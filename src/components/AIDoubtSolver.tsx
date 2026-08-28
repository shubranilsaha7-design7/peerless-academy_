import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Zap, Brain, Camera, HelpCircle, FileSearch, Lightbulb } from 'lucide-react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { supabase } from '../integrations/supabase/client';

export interface AIDoubtSolverProps {
  isOpen: boolean;
  onClose: () => void;
  q?: any; // The question context if called from CBT Simulator
}

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isStreaming?: boolean;
};

export default function AIDoubtSolver({ isOpen, onClose, q }: AIDoubtSolverProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial', sender: 'ai', text: 'Hello! I am your Elite Socratic AI Mentor. Ask me any conceptual doubt, paste a problem, or ask for a study strategy.' }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'academic' | 'non-academic'>('academic');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (q && isOpen) {
      setMessages([{
        id: 'ctx',
        sender: 'ai',
        text: `I see you are stuck on:\n\n**${q.question}**\n\nWould you like a Socratic Hint, or a Full Conceptual Breakdown?`
      }]);
    }
  }, [q, isOpen]);

  const handleSend = async (text: string, forceMode?: 'academic' | 'non-academic') => {
    const activeMode = forceMode || mode;
    const val = text.trim();
    if (!val) return;

    setInput('');
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: val };
    setMessages(prev => [...prev, newMsg]);
    setLoading(true);

    try {
      // 1. We construct the history payload
      const history = [...messages, newMsg].map(m => ({
        role: m.sender,
        content: m.text
      }));

      // 2. Call Supabase Edge Function with SSE
      const { data, error } = await supabase.functions.invoke('ai-doubt-solver', {
        body: { messages: history, mode: activeMode }
      });
      // NOTE: supabase.functions.invoke doesn't support streaming natively well yet, but we will mock the stream or wait for full response
      // For a real production streaming setup, we would use fetch() directly to the edge function URL
      
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      // Real fetch for SSE Stream:
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-doubt-solver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messages: history, mode: activeMode })
      });

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiFullText = "";
      
      const streamId = Date.now().toString() + "_ai";
      setMessages(prev => [...prev, { id: streamId, sender: 'ai', text: '', isStreaming: true }]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value);
          // Split by SSE events
          const lines = chunk.split('\\n\\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                aiFullText += parsed.text;
                setMessages(prev => prev.map(m => m.id === streamId ? { ...m, text: aiFullText } : m));
              } catch (e) {}
            }
          }
        }
      }
      setMessages(prev => prev.map(m => m.id === streamId ? { ...m, isStreaming: false } : m));
    } catch (err: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: `An error occurred: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[9999] flex h-[600px] w-full max-w-[400px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-slate-900 to-slate-950 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Elite AI Mentor</h3>
              <p className="text-[10px] font-bold tracking-widest text-emerald-400">GEMINI 1.5 PRO</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 p-3 bg-slate-900 border-b border-white/5">
          <button
            onClick={() => setMode('academic')}
            className={`flex-1 rounded-lg py-2 text-[10px] font-black uppercase tracking-wider transition ${mode === 'academic' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Brain size={12} className="inline mr-1" /> Academic
          </button>
          <button
            onClick={() => setMode('non-academic')}
            className={`flex-1 rounded-lg py-2 text-[10px] font-black uppercase tracking-wider transition ${mode === 'non-academic' ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Lightbulb size={12} className="inline mr-1" /> Mentor
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-[85%] rounded-2xl p-4 shadow-xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'border border-white/10 bg-slate-900 text-slate-200'}`}>
                {msg.sender === 'ai' && (
                  <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20">
                    <Sparkles size={12} />
                  </div>
                )}
                <div className="text-sm font-medium leading-relaxed prose prose-invert max-w-none">
                  {/* KaTeX Renderer */}
                  <Latex strict={false}>{msg.text}</Latex>
                  {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-white animate-pulse" />}
                </div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="border-t border-white/10 bg-slate-900 p-4">
          {q && mode === 'academic' && (
            <div className="mb-3 flex gap-2">
              <button
                onClick={() => handleSend('Give me a Socratic hint without revealing the answer.', 'academic')}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 py-2 text-[10px] font-bold text-amber-400 transition hover:bg-amber-500/20"
              >
                <HelpCircle size={12} /> Hint
              </button>
              <button
                onClick={() => handleSend('Provide a full step-by-step conceptual breakdown.', 'academic')}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 py-2 text-[10px] font-bold text-indigo-400 transition hover:bg-indigo-500/20"
              >
                <FileSearch size={12} /> Full Breakdown
              </button>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950 p-2 focus-within:border-indigo-500"
          >
            <button type="button" className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white">
              <Camera size={18} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'academic' ? "Ask a physics/math doubt..." : "Ask about strategy & time..."}
              className="flex-1 bg-transparent px-2 text-sm text-white focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <Send size={16} className={loading ? 'animate-pulse' : ''} />
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
