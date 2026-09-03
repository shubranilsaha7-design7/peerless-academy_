import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Send, Zap, Loader2 } from 'lucide-react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { supabase } from '../integrations/supabase/client';

export interface AIDoubtSolverProps {
  isOpen: boolean;
  onClose: () => void;
  q?: any; // Context from CBT
}

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
};

export default function AIDoubtSolver({ isOpen, onClose, q }: AIDoubtSolverProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  
  // Dynamic AI Settings
  const [aiName, setAiName] = useState('Elite AI Mentor');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI tutor.');
  const [modelTier, setModelTier] = useState('gemini-2.5-flash');

  useEffect(() => {
    fetchAiConfig();
  }, []);

  const fetchAiConfig = async () => {
    try {
      const { data } = await (supabase as any).from('platform_settings').select('*').eq('id', 'GLOBAL').single();
      if (data) {
        setAiName(data.ai_name);
        setSystemPrompt(data.system_prompt);
        setModelTier(data.model_tier);
        if (messages.length === 0) {
          setMessages([{ id: 'init', sender: 'ai', text: data.ai_greeting }]);
        }
      }
    } catch (e) {
      console.error('Failed to load AI config', e);
      if (messages.length === 0) {
        setMessages([{ id: 'init', sender: 'ai', text: 'Hello! I am your AI Mentor.' }]);
      }
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { id: Date.now().toString(), sender: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const contextText = q ? `Context: Question: ${q.question_latex}` : '';
      const prompt = contextText ? `${contextText}\nUser: ${userMsg}` : userMsg;

      const apiMessages = newMessages.map(m => ({
        role: m.sender === 'ai' ? 'model' : 'user',
        content: m.id === newMessages[newMessages.length - 1].id ? prompt : m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt,
          modelTier
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch AI response');
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: data.reply }]);
    } catch (err: any) {
      console.error("AI API Error:", err);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: `Error: ${err.message || 'Network error connecting to the AI core.'}` }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full sm:max-w-lg h-[90vh] sm:h-[80vh] bg-slate-900 border border-slate-700/50 sm:rounded-3xl flex flex-col shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Brain size={20} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="font-black text-white flex items-center gap-2">{aiName} <Zap size={14} className="text-amber-400 fill-current" /></h3>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Dynamic GEMINI-2.5-FLASH Engine</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          {/* Chat Area - Fixed Flexbox */}
          <div className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" style={{ backgroundBlendMode: 'overlay' }}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'self-end bg-blue-600 text-white rounded-br-none shadow-lg' 
                    : 'self-start bg-gray-800 text-slate-200 border border-slate-700 rounded-bl-none shadow-md'
                }`}
              >
                <Latex>{msg.text}</Latex>
              </motion.div>
            ))}
            {loading && (
              <div className="self-start bg-gray-800 border border-slate-700 p-4 rounded-2xl rounded-bl-none flex gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur z-10">
            <div className="relative flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask your AI Mentor..."
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-sm text-white resize-none max-h-32 focus:outline-none focus:border-cyan-500 transition-colors"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-12 h-12 flex-shrink-0 bg-cyan-500 text-slate-950 rounded-2xl flex items-center justify-center hover:bg-cyan-400 transition shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:shadow-none"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
