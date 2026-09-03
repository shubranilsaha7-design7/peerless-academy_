import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Send, Camera, Zap, Loader2 } from 'lucide-react';
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
  image?: string; // base64 string
};

const VISION_PROMPT = `You are an elite AI vision module for Peerless Academy. 
Analyze the provided image of a math/science question. 
Output exactly this 4-step structure:
1. **Question Transcription**: Extract all text exactly.
2. **Core Concept & Formula**: Identify the physics/chemistry/math principles.
3. **Step-by-Step Derivation**: Work through it sequentially. Use LaTeX wrapped in $ or $$ for math.
4. **Final Answer**: The concluding verified answer.`;

export default function AIDoubtSolver({ isOpen, onClose, q }: AIDoubtSolverProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [aiName, setAiName] = useState('Elite AI Mentor');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI tutor.');

  useEffect(() => {
    fetchAiConfig();
  }, []);

  const fetchAiConfig = async () => {
    try {
      const { data } = await (supabase as any).from('platform_settings').select('*').eq('id', 'GLOBAL').single();
      if (data) {
        setAiName(data.ai_name);
        setSystemPrompt(data.system_prompt);
        if (messages.length === 0) setMessages([{ id: 'init', sender: 'ai', text: data.ai_greeting }]);
      }
    } catch (e) {
      if (messages.length === 0) setMessages([{ id: 'init', sender: 'ai', text: 'Hello! I am your AI Mentor.' }]);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, imagePreview]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !imagePreview) return;
    
    const userMsg = input.trim();
    const sentImage = imagePreview; // capture current state
    
    setInput('');
    setImagePreview(null);
    setImageFile(null);
    
    const newMessages = [...messages, { id: Date.now().toString(), sender: 'user' as const, text: userMsg, image: sentImage || undefined }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Missing Gemini API Key");

      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Select model and system instructions based on whether an image is attached
      const finalSystemPrompt = sentImage ? VISION_PROMPT : systemPrompt;
      const model = genAI.getGenerativeModel({
        model: "gemini-3.6-flash",
        systemInstruction: finalSystemPrompt
      });

      // Construct history and payload
      const apiMessages = [];
      for (const m of newMessages) {
        const parts: any[] = [{ text: m.text || "Analyze this image." }];
        
        if (m.image) {
          // Extract base64 and mime type from data URL
          const base64Data = m.image.split(',')[1];
          const mimeType = m.image.match(/data:(.*?);/)?.[1] || "image/jpeg";
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType
            }
          });
        }
        
        apiMessages.push({
          role: m.sender === 'ai' ? 'model' : 'user',
          parts
        });
      }

      // Inject CBT Context if it's the very first message
      if (q && newMessages.length === 2 && !sentImage) {
         apiMessages[apiMessages.length - 1].parts[0].text = `Context: Question: ${q.question_latex}nUser: ${userMsg}`;
      }

      const result = await model.generateContent({ contents: apiMessages });
      const reply = result.response.text();

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: reply }]);
    } catch (err: any) {
      console.error("AI API Error:", err);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: `Error: ${err.message || 'Network error'}` }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-6"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-lg h-[90vh] sm:h-[80vh] flex flex-col bg-slate-900 sm:rounded-[2rem] rounded-t-[2rem] border border-white/10 shadow-2xl overflow-hidden">
          
          <div className="p-4 border-b border-white/10 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{aiName}</h3>
                <div className="text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> GEMINI VISION 3.6
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition rounded-full hover:bg-slate-800">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
                  {m.image && (
                    <img src={m.image} alt="Upload" className="w-full max-h-48 object-cover rounded-xl mb-3 border border-white/10" />
                  )}
                  <div className="text-sm prose prose-invert max-w-none">
                    <Latex>{m.text}</Latex>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-200 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin text-indigo-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analyzing Visual Data...</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="p-4 bg-slate-950 border-t border-white/10">
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-xl border-2 border-indigo-500" />
                <button 
                  onClick={() => { setImagePreview(null); setImageFile(null); }}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 hover:scale-110 transition"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="relative flex items-center">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                capture="environment"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-3 p-2 text-slate-400 hover:text-indigo-400 transition"
              >
                <Camera size={20} />
              </button>
              
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask or snap a photo..."
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
              <button 
                onClick={handleSend}
                disabled={loading || (!input.trim() && !imagePreview)}
                className="absolute right-3 p-2 text-indigo-400 disabled:opacity-50 hover:text-indigo-300 transition"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="mt-2 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
              <Zap size={10} className="text-amber-500" /> Powered by Google Vertex AI
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
