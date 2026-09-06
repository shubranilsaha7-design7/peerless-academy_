import { useState } from 'react';
import { Flame, Medal, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ladder = [
  ['01', 'Riya S.', '2,840 XP'],
  ['02', 'Aarav D.', '2,690 XP'],
  ['03', 'Satarupa S.', '2,420 XP'],
  ['04', 'Debadatta B.', '2,110 XP'],
  ['05', 'You', '1,860 XP'],
];

const containerVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
  }
};

const itemVariants: import("framer-motion").Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

export default function ProgressionHub() {
  const [studentMode, setStudentMode] = useState(true);
  
  if (!studentMode) return <div className="bg-ink px-5 py-5 text-center lg:px-8"><button onClick={() => setStudentMode(true)} className="rounded-full border border-coral/40 px-5 py-2 text-xs font-black uppercase tracking-wider text-orange-200 transition hover:scale-105">Enter Student Mode</button></div>;
  
  return (
    <section id="student-hub" className="bg-ink px-5 pb-20 pt-8 lg:px-8 lg:pb-28 relative overflow-hidden">
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-10 left-20 w-64 h-64 bg-coral/20 rounded-full ambient-glow pointer-events-none" />
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-indigo-500/10 rounded-full ambient-glow pointer-events-none" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="mx-auto max-w-[1240px] rounded-[2rem] glass-panel bg-noise bg-[#101f38]/60 p-6 shadow-[0_0_70px_rgba(255,107,0,.15)] sm:p-8 relative z-10"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="section-kicker text-coral">Student mode / Progression hub</div>
            <h2 className="mt-2 text-fluid-h3 font-black text-white">Your next level is closer than you think.</h2>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setStudentMode(false)} 
            className="w-fit rounded-full border border-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 transition hover:border-coral hover:text-white"
          >
            Exit Student Mode
          </motion.button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-4 lg:grid-cols-[.8fr_1.3fr_1fr]"
        >
          {/* Streak Card */}
          <motion.div variants={itemVariants} className="rounded-2xl border border-coral/30 bg-coral/10 p-6 glass-panel relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10"><Flame size={26} className="text-coral" fill="currentColor" /><span className="rounded-full bg-coral px-2.5 py-1 text-[10px] font-black text-white shadow-lg shadow-coral/50">ON FIRE</span></div>
            <div className="mt-9 text-4xl font-black text-white relative z-10">5 <span className="text-lg text-orange-200">days</span></div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[.14em] text-slate-300 relative z-10">Current streak</div>
            <div className="mt-5 flex gap-1.5 relative z-10">{Array.from({ length: 7 }).map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < 5 ? 'bg-coral shadow-sm shadow-coral' : 'bg-white/15'}`} />)}</div>
            <div className="mt-3 text-[11px] text-slate-400 relative z-10">2 more days to unlock a bonus</div>
          </motion.div>

          {/* XP Card */}
          <motion.div variants={itemVariants} className="rounded-2xl border border-white/10 bg-white/[.02] p-6 glass-panel relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10"><div className="flex items-center gap-2 text-sm font-black text-white"><Zap size={16} className="text-coral" /> XP progression</div><span className="text-xs font-bold text-coral">Level 04</span></div>
            <div className="mt-8 flex items-end justify-between relative z-10"><div><div className="text-2xl font-black text-white">1,860 <span className="text-sm text-slate-400">XP</span></div><div className="mt-1 text-xs text-slate-400">Novice ➔ <span className="font-bold text-white">Scholar</span></div></div><div className="text-right text-[11px] font-bold text-slate-400">2,500 XP</div></div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10 relative z-10"><motion.div initial={{ width: 0 }} whileInView={{ width: '74%' }} transition={{ duration: 1.5, ease: 'easeOut' }} viewport={{ once: true }} className="h-full rounded-full bg-gradient-to-r from-coral to-orange-300 shadow-[0_0_20px_rgba(255,107,0,.8)]" /></div>
            <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 relative z-10"><span>Keep solving</span><span>640 XP to go</span></div>
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.05] px-4 py-3 text-xs text-slate-300 relative z-10 backdrop-blur-md"><Medal size={17} className="text-amber-400" /> Top 8% in your class</div>
          </motion.div>

          {/* Ladder Card */}
          <motion.div variants={itemVariants} className="rounded-2xl border border-white/10 bg-white/[.02] p-6 glass-panel relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10"><div className="flex items-center gap-2 text-sm font-black text-white"><Trophy size={16} className="text-amber-400" /> Class ladder</div><span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Top 5</span></div>
            <div className="mt-4 space-y-2 relative z-10">
              {ladder.map(([rank, name, xp], i) => (
                <motion.div 
                  key={rank} 
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-3 rounded-lg px-2.5 py-2 ${name === 'You' ? 'bg-coral/20 text-white border border-coral/30' : 'text-slate-400'}`}
                >
                  <span className="w-5 text-[10px] font-black text-slate-500">{rank}</span><span className="flex-1 text-xs font-bold">{name}</span><span className="text-[10px] font-black text-coral">{xp}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </motion.div>
    </section>
  );
}
