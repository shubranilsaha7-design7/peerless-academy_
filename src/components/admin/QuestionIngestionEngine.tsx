import React, { useState } from 'react';
import { Database, FileText, Type, UploadCloud, CheckCircle, AlertTriangle, Loader2, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function QuestionIngestionEngine() {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  
  // Manual State
  const [form, setForm] = useState({
    subject: 'Physics',
    class_level: '11',
    chapter: '',
    difficulty: 'Standard',
    exam_target: 'JEE_MAIN',
    question_text: '',
    optA: '', optB: '', optC: '', optD: '',
    correct_answer: '',
    explanation: ''
  });
  const [manualLoading, setManualLoading] = useState(false);
  const [manualMessage, setManualMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  // AI State
  const [file, setFile] = useState<File | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any[] | null>(null);
  const [aiMessage, setAiMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualLoading(true);
    setManualMessage(null);
    
    try {
      const options = [form.optA, form.optB, form.optC, form.optD];
      if (!options.includes(form.correct_answer)) {
        throw new Error("Correct answer must exactly match one of the 4 options.");
      }

      const payload = {
        exam_target: form.exam_target,
        class_level: parseInt(form.class_level),
        subject: form.subject,
        chapter: form.chapter,
        difficulty: form.difficulty,
        question_type: 'Single_Correct',
        question_text: form.question_text,
        options: options,
        correct_answer: form.correct_answer,
        explanation: form.explanation,
        exam_year_tag: 'Admin UI Ingestion'
      };

      const { error } = await (supabase as any).from('cbt_questions').insert([payload]);
      if (error) throw error;
      
      setManualMessage({ type: 'success', text: 'Question successfully ingested into CBT Engine.' });
      setForm(prev => ({ ...prev, question_text: '', optA: '', optB: '', optC: '', optD: '', correct_answer: '', explanation: '' }));
    } catch (err: any) {
      setManualMessage({ type: 'error', text: err.message });
    } finally {
      setManualLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processAI = async () => {
    if (!file) {
      setAiMessage({ type: 'error', text: 'Please upload a file first.' });
      return;
    }
    
    setAiLoading(true);
    setAiMessage(null);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key is not configured.");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      await new Promise(resolve => reader.onload = resolve);
      const base64Data = (reader.result as string).split(',')[1];
      const mimeType = file.type;

      const prompt = `You are an expert exam parser. Read the attached document and extract the multiple choice questions.
Return EXACTLY a JSON array of objects. Do NOT wrap in markdown block (no \`\`\`json). Just the raw array.
Each object must match this schema:
{
  "subject": "Physics" | "Chemistry" | "Mathematics" | "Biology",
  "chapter": "Name of chapter",
  "question_text": "The question text (use standard LaTeX for math wrapped in $...$)",
  "options": ["opt A", "opt B", "opt C", "opt D"],
  "correct_answer": "The exact string of the correct option",
  "explanation": "Detailed explanation (use LaTeX)"
}
Parse up to 10 questions. Ensure exact math rendering formats.`;

      const result = await model.generateContent([
        { inlineData: { data: base64Data, mimeType } },
        prompt
      ]);

      const text = result.response.text();
      // Safely parse the JSON response
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanText);
      setAiResult(parsed);
      setAiMessage({ type: 'success', text: `Successfully extracted ${parsed.length} questions.` });
    } catch (err: any) {
      console.error(err);
      setAiMessage({ type: 'error', text: err.message || "Failed to process document. Please ensure it's a readable PDF or Image." });
    } finally {
      setAiLoading(false);
    }
  };

  const commitAIQuestions = async () => {
    if (!aiResult || aiResult.length === 0) return;
    setAiLoading(true);
    try {
      const payload = aiResult.map(q => ({
        exam_target: 'JEE_MAIN',
        class_level: 12,
        subject: q.subject || 'Physics',
        chapter: q.chapter || 'Unknown',
        difficulty: 'Standard',
        question_type: 'Single_Correct',
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        exam_year_tag: 'AI Document Parsing'
      }));

      const { error } = await (supabase as any).from('cbt_questions').insert(payload);
      if (error) throw error;
      
      setAiMessage({ type: 'success', text: 'All extracted questions have been committed to the database!' });
      setAiResult(null);
      setFile(null);
    } catch (err: any) {
      setAiMessage({ type: 'error', text: err.message });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Database size={24} className="text-indigo-500" /> Question Ingestion Engine
        </h2>
        <p className="text-xs text-slate-400">
          Inject raw questions into the CBT and Kurukshetra databanks via manual rich-text or AI automated parsing.
        </p>
      </div>

      <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
        <button onClick={() => setMode('manual')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${mode === 'manual' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <Type size={14} /> Manual Entry
        </button>
        <button onClick={() => setMode('ai')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${mode === 'ai' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <Bot size={14} /> Automated Parsing
        </button>
      </div>

      {mode === 'manual' && (
        <form onSubmit={handleManualSubmit} className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
              <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white">
                <option>Physics</option><option>Chemistry</option><option>Mathematics</option><option>Biology</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Target</label>
              <select value={form.exam_target} onChange={e => setForm({...form, exam_target: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white">
                <option>JEE_MAIN</option><option>JEE_ADVANCED</option><option>NEET</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Class</label>
              <select value={form.class_level} onChange={e => setForm({...form, class_level: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white">
                <option>11</option><option>12</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white">
                <option>Standard</option><option>Advanced</option><option>Challenger</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Chapter</label>
            <input type="text" required value={form.chapter} onChange={e => setForm({...form, chapter: e.target.value})} placeholder="e.g. Kinematics" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Question Text (LaTeX Supported)</label>
            <textarea required value={form.question_text} onChange={e => setForm({...form, question_text: e.target.value})} rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono text-sm" placeholder="A particle moves with velocity $v = 4t$..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-bold text-slate-400 mb-1">Option A</label><input required value={form.optA} onChange={e => setForm({...form, optA: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono text-sm" /></div>
            <div><label className="block text-[10px] font-bold text-slate-400 mb-1">Option B</label><input required value={form.optB} onChange={e => setForm({...form, optB: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono text-sm" /></div>
            <div><label className="block text-[10px] font-bold text-slate-400 mb-1">Option C</label><input required value={form.optC} onChange={e => setForm({...form, optC: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono text-sm" /></div>
            <div><label className="block text-[10px] font-bold text-slate-400 mb-1">Option D</label><input required value={form.optD} onChange={e => setForm({...form, optD: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono text-sm" /></div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Correct Answer String (Must match option exactly)</label>
            <input required value={form.correct_answer} onChange={e => setForm({...form, correct_answer: e.target.value})} className="w-full bg-emerald-950/20 border border-emerald-900/50 rounded-xl px-4 py-2 text-emerald-400 font-mono text-sm" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Explanation</label>
            <textarea required value={form.explanation} onChange={e => setForm({...form, explanation: e.target.value})} rows={2} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono text-sm" />
          </div>

          {manualMessage && (
            <div className={`p-3 rounded-xl text-xs font-bold ${manualMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {manualMessage.text}
            </div>
          )}

          <button disabled={manualLoading} type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-bold transition disabled:opacity-50">
            {manualLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            Commit to Database
          </button>
        </form>
      )}

      {mode === 'ai' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl space-y-6">
          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-slate-950/50 hover:bg-slate-900/50 transition cursor-pointer relative">
            <input type="file" onChange={handleFileUpload} accept="application/pdf,image/*,.txt" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud size={48} className="text-indigo-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Drop Question Paper Here</h3>
            <p className="text-xs text-slate-400 max-w-sm">Upload a PDF, Image, or Text file. Gemini 1.5 Flash will automatically extract and format the questions into the CBT schema.</p>
            {file && <div className="mt-4 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg text-xs font-bold">{file.name}</div>}
          </div>

          <button onClick={processAI} disabled={!file || aiLoading} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition border border-slate-700 disabled:opacity-50">
            {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Bot size={16} />}
            Process with Gemini AI
          </button>

          {aiMessage && (
            <div className={`p-3 rounded-xl text-xs font-bold ${aiMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {aiMessage.text}
            </div>
          )}

          {aiResult && aiResult.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Extracted Preview ({aiResult.length} items)</h3>
              <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                {aiResult.map((q, i) => (
                  <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="text-[10px] uppercase font-bold text-indigo-400">Q{i+1} • {q.subject} • {q.chapter}</div>
                    <div className="text-sm text-slate-200"><Latex>{q.question_text}</Latex></div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {q.options.map((opt: string, idx: number) => (
                        <div key={idx} className={`p-2 text-xs rounded border ${opt === q.correct_answer ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                          <Latex>{opt}</Latex>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={commitAIQuestions} disabled={aiLoading} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-black uppercase tracking-widest transition shadow-[0_0_20px_rgba(5,150,105,0.3)] disabled:opacity-50 mt-4">
                {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Confirm & Commit to Database
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
