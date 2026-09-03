import React, { useState, useRef } from 'react';
import { Download, Target, Calendar, BrainCircuit, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import html2canvas from 'html2canvas';

export default function AiRoadmapArchitect() {
  const [classTarget, setClassTarget] = useState('Class 10');
  const [duration, setDuration] = useState('6 Months');
  const [weakAreas, setWeakAreas] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  
  const roadmapRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AQ.Ab8RN6IMIMPGsZDc_dKFiz8-pQP_DX-yzAwu2x1XdobUYwf-ng";
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-3.6-flash",
        generationConfig: {
          responseMimeType: "application/json"
        },
        systemInstruction: "You are an elite academic planner. Output a JSON object matching this schema: { title: string, description: string, phases: [{ phase_name: string, duration: string, milestones: [{ title: string, objective: string, difficulty: 'Easy'|'Medium'|'Hard' }] }] }"
      });

      const prompt = `Generate a highly structured study roadmap for a student aiming for ${classTarget}. They have ${duration} available. Their self-reported weak areas are: ${weakAreas}. Break it down into clear chronological phases.`;
      
      const result = await model.generateContent(prompt);
      setRoadmap(JSON.parse(result.response.text()));
    } catch (e) {
      console.error(e);
      alert('Failed to generate roadmap. Check API key or quotas.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!roadmapRef.current) return;
    const canvas = await html2canvas(roadmapRef.current, { backgroundColor: '#090D16' });
    const link = document.createElement('a');
    link.download = 'peerless-roadmap.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
          <BrainCircuit size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">AI Roadmap Architect</h2>
          <p className="text-sm text-slate-400 mt-1">Personalized tactical planning powered by Gemini 3.6</p>
        </div>
      </div>

      {!roadmap ? (
        <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Target size={14} /> Exam Target</label>
              <select value={classTarget} onChange={e => setClassTarget(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition">
                {['Class 8 Foundation', 'Class 9 Foundation', 'Class 10 Boards', 'JEE Main', 'JEE Advanced', 'NEET'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Calendar size={14} /> Available Duration</label>
              <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition">
                {['1 Month (Crash)', '3 Months', '6 Months', '1 Year (Standard)', '2 Years (Integrated)'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Self-Reported Weak Areas</label>
              <textarea required rows={3} value={weakAreas} onChange={e => setWeakAreas(e.target.value)} placeholder="e.g., Organic Chemistry mechanisms, rotational mechanics..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl transition disabled:opacity-50">
            {loading ? <><Loader2 size={18} className="animate-spin" /> ARCHITECTING PATH...</> : 'GENERATE ROADMAP'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={handleDownload} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition">
              <Download size={16} /> Export as Image
            </button>
          </div>
          
          <div ref={roadmapRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <h1 className="text-4xl font-black text-white mb-2">{roadmap.title}</h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed mb-10">{roadmap.description}</p>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
              {roadmap.phases.map((phase: any, pIdx: number) => (
                <div key={pIdx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-indigo-500 text-white font-black text-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-indigo-500/40 z-10">
                    {pIdx + 1}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-white text-lg">{phase.phase_name}</h3>
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded uppercase tracking-wider">{phase.duration}</span>
                    </div>
                    <div className="space-y-3">
                      {phase.milestones.map((m: any, mIdx: number) => (
                        <div key={mIdx} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-200 text-sm">{m.title}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${m.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-400' : m.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{m.difficulty}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{m.objective}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center border-t border-slate-800 pt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Generated by Peerless AI Architect</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
