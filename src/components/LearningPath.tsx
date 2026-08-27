import { useState } from 'react';
import { BrainCircuit, Check, Circle, Lock, Sparkles, Wand2, Target, X, Code2, AlertTriangle, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const nodes = [
  { title: 'Physics', subtitle: 'Mechanics', done: true, pyq: '120 PYQs solved' },
  { title: 'Optics', subtitle: 'Ray diagrams', weak: true, pyq: '25 PYQs solved' },
  { title: 'Electrostatics', subtitle: 'Fields & charge', done: false, pyq: '0 PYQs solved' },
  { title: 'Current Electricity', subtitle: 'Circuits', locked: true, pyq: 'Locked' },
];

export default function LearningPath() {
  const [loading, setLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiStage, setAiStage] = useState(0);

  const generate = () => {
    setShowAiModal(true);
    setAiStage(0);
    setLoading(true);
    
    // Simulate AI Agent thought process
    setTimeout(() => setAiStage(1), 1500);
    setTimeout(() => setAiStage(2), 3000);
    setTimeout(() => setAiStage(3), 4500);
    setTimeout(() => {
      setLoading(false);
      setAiStage(4);
    }, 6000);
  };

  return (
    <section id="learning-path" className="bg-[#0d1b32] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="section-kicker text-coral flex items-center gap-2">
              <Sparkles size={14} /> Autonomous AI Agent Active
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-[-.05em] sm:text-6xl">
              Your syllabus,<br /><span className="text-coral">but smarter.</span>
            </h2>
          </div>
          
          <button 
            onClick={generate} 
            className="flex w-fit items-center gap-3 rounded-full bg-gradient-to-r from-coral to-orange-500 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-coral/20 transition hover:scale-105"
          >
            <Wand2 size={18} /> Deep-Scan & Generate AI Plan
          </button>
        </div>

        <div className="mt-14 rounded-[2rem] border border-white/10 bg-ink p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle bg glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-coral/5 blur-3xl" />

          <div className="mb-8 flex items-center gap-3 relative z-10">
            <div className="rounded-xl bg-coral/10 p-3 text-coral">
              <BrainCircuit size={22} />
            </div>
            <div>
              <div className="text-sm font-black text-white">Physics Skill Tree · AI Blueprint</div>
              <div className="text-xs text-slate-500">Class 12 • Live-calibrated to your mock performance</div>
            </div>
          </div>

          <div className="grid gap-6 md:gap-3 md:grid-cols-4 md:items-center relative z-10">
            {nodes.map((node, i) => (
              <div key={node.title} className="relative flex items-center md:block">
                
                <div className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  node.done ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400 shadow-[0_0_26px_rgba(52,211,153,.25)]' 
                  : node.weak ? 'border-coral bg-coral/10 text-coral shadow-[0_0_28px_rgba(255,107,0,.35)] animate-pulse' 
                  : node.locked ? 'border-white/10 bg-white/[.03] text-slate-600' 
                  : 'border-sky-400/60 bg-sky-400/10 text-sky-400'
                }`}>
                  {node.done ? <Check size={22} /> : node.locked ? <Lock size={19} /> : <Circle size={19} />}
                </div>
                
                <div className="ml-4 md:ml-0 md:mt-5">
                  <div className="text-sm font-black text-white">{node.title}</div>
                  <div className="mt-1 text-[11px] text-slate-400">{node.subtitle}</div>
                  <div className="mt-1.5 text-[9px] font-mono text-slate-500">{node.pyq}</div>
                  
                  <div className={`mt-2.5 inline-block rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-wider ${
                    node.done ? 'bg-emerald-500/10 text-emerald-400' 
                    : node.weak ? 'bg-coral/10 text-coral' 
                    : node.locked ? 'bg-white/5 text-slate-500' 
                    : 'bg-sky-500/10 text-sky-400'
                  }`}>
                    {node.done ? 'Mastered' : node.weak ? 'Critical Focus Area' : node.locked ? 'Locked' : 'In progress'}
                  </div>
                </div>
                
                {i < nodes.length - 1 && (
                  <div className={`mx-5 h-8 w-px md:absolute md:left-16 md:right-[-3rem] md:top-8 md:mx-0 md:h-px md:w-auto ${
                    node.done ? 'bg-emerald-500/50' : 'bg-gradient-to-b md:bg-gradient-to-r from-coral/50 to-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex flex-wrap items-center gap-5 border-t border-white/10 pt-5 text-[10px] font-black uppercase tracking-wider text-slate-500 relative z-10">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Mastered</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-coral animate-pulse" /> AI Flagged Weakness</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> In progress</span>
          </div>
        </div>
      </div>

      {/* ── AUTONOMOUS AI AGENT MODAL ── */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-coral/30 bg-slate-900 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-coral/10 via-transparent to-transparent" />
              
              <div className="relative border-b border-white/10 p-6 flex justify-between items-center">
                <div className="flex items-center gap-3 text-coral">
                  <BrainCircuit size={24} className={loading ? "animate-pulse" : ""} />
                  <div>
                    <h3 className="text-sm font-black text-white">Peerless Autonomous AI Agent</h3>
                    <p className="text-[10px] font-mono text-coral/80 tracking-widest mt-0.5">SYLLABUS ENGINE V2.0</p>
                  </div>
                </div>
                <button onClick={() => setShowAiModal(false)} className="text-slate-500 hover:text-white transition">
                  <X size={20} />
                </button>
              </div>

              <div className="relative p-6 space-y-6">
                
                <div className="space-y-4">
                  <div className={`flex items-start gap-3 transition-opacity duration-500 ${aiStage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="mt-0.5 h-4 w-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                    <div>
                      <p className="text-xs font-bold text-emerald-400">Scanning 50,000+ Question Bank...</p>
                      <p className="text-[10px] text-slate-400 mt-1">Cross-referencing your recent Mock Exam errors in Optics.</p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 transition-opacity duration-500 ${aiStage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                    <Code2 size={16} className="mt-0.5 text-cyan-400" />
                    <div>
                      <p className="text-xs font-bold text-cyan-400">Extracting PYQs (2018-2023)</p>
                      <p className="text-[10px] text-slate-400 mt-1">Found 42 high-frequency Ray Diagram questions from JEE Mains.</p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 transition-opacity duration-500 ${aiStage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    <AlertTriangle size={16} className="mt-0.5 text-amber-400 animate-pulse" />
                    <div>
                      <p className="text-xs font-bold text-amber-400">Critical Weakness Detected</p>
                      <p className="text-[10px] text-slate-400 mt-1">You score 20% lower on 'Total Internal Reflection' concepts.</p>
                    </div>
                  </div>
                </div>

                <div className={`pt-4 border-t border-white/10 transition-opacity duration-500 ${aiStage >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="rounded-2xl border border-coral/20 bg-coral/5 p-5">
                    <h4 className="text-sm font-black text-white flex items-center gap-2 mb-2">
                      <Target size={16} className="text-coral" /> Custom AI Test Ready
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">
                      I have compiled a customized 30-question CBT Mock Test focusing strictly on Optics PYQs to patch your weaknesses.
                    </p>
                    <a 
                      href="/dashboard"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-coral py-3 text-xs font-black text-white shadow-lg shadow-coral/20 transition hover:bg-orange-500"
                    >
                      <Play size={15} /> Launch AI Custom CBT
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
