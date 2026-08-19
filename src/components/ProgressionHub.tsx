import { useState } from 'react';
import { Flame, Medal, Trophy, Zap } from 'lucide-react';

const ladder = [
  ['01', 'Riya S.', '2,840 XP'],
  ['02', 'Aarav D.', '2,690 XP'],
  ['03', 'Satarupa S.', '2,420 XP'],
  ['04', 'Debadatta B.', '2,110 XP'],
  ['05', 'You', '1,860 XP'],
];

export default function ProgressionHub() {
  const [studentMode, setStudentMode] = useState(true);
  if (!studentMode) return <div className="bg-ink px-5 py-5 text-center lg:px-8"><button onClick={() => setStudentMode(true)} className="rounded-full border border-coral/40 px-5 py-2 text-xs font-black uppercase tracking-wider text-orange-200 transition hover:scale-105">Enter Student Mode</button></div>;
  return (
    <section id="student-hub" className="bg-ink px-5 pb-20 pt-8 lg:px-8 lg:pb-28">
      <div className="mx-auto max-w-[1240px] rounded-[2rem] border border-coral/20 bg-[#101f38] p-6 shadow-[0_0_70px_rgba(255,107,0,.08)] sm:p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><div className="section-kicker text-coral">Student mode / Progression hub</div><h2 className="mt-2 text-2xl font-black sm:text-3xl">Your next level is closer than you think.</h2></div><button onClick={() => setStudentMode(false)} className="w-fit rounded-full border border-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 transition hover:scale-105 hover:border-coral hover:text-white">Exit Student Mode</button></div>
        <div className="grid gap-4 lg:grid-cols-[.8fr_1.3fr_1fr]">
          <div className="rounded-2xl border border-coral/20 bg-coral/10 p-6"><div className="flex items-center justify-between"><Flame size={26} className="text-coral" fill="currentColor" /><span className="rounded-full bg-coral px-2.5 py-1 text-[10px] font-black text-white">ON FIRE</span></div><div className="mt-9 text-4xl font-black">5 <span className="text-lg text-orange-200">days</span></div><div className="mt-1 text-xs font-bold uppercase tracking-[.14em] text-slate-300">Current streak</div><div className="mt-5 flex gap-1.5">{Array.from({ length: 7 }).map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < 5 ? 'bg-coral' : 'bg-white/15'}`} />)}</div><div className="mt-3 text-[11px] text-slate-400">2 more days to unlock a bonus</div></div>
          <div className="rounded-2xl border border-white/10 bg-white/[.035] p-6"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-black"><Zap size={16} className="text-coral" /> XP progression</div><span className="text-xs font-bold text-coral">Level 04</span></div><div className="mt-8 flex items-end justify-between"><div><div className="text-2xl font-black">1,860 <span className="text-sm text-slate-400">XP</span></div><div className="mt-1 text-xs text-slate-400">Novice → <span className="font-bold text-white">Scholar</span></div></div><div className="text-right text-[11px] font-bold text-slate-400">2,500 XP</div></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[74%] rounded-full bg-gradient-to-r from-coral to-orange-300 shadow-[0_0_16px_rgba(255,107,0,.6)]" /></div><div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500"><span>Keep solving</span><span>640 XP to go</span></div><div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] px-4 py-3 text-xs text-slate-300"><Medal size={17} className="text-amber-400" /> Top 8% in your class</div></div>
          <div className="rounded-2xl border border-white/10 bg-white/[.035] p-6"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-black"><Trophy size={16} className="text-amber-400" /> Class ladder</div><span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Top 5</span></div><div className="mt-4 space-y-2">{ladder.map(([rank, name, xp]) => <div key={rank} className={`flex items-center gap-3 rounded-lg px-2.5 py-2 ${name === 'You' ? 'bg-coral/15 text-white' : 'text-slate-400'}`}><span className="w-5 text-[10px] font-black text-slate-500">{rank}</span><span className="flex-1 text-xs font-bold">{name}</span><span className="text-[10px] font-black text-coral">{xp}</span></div>)}</div></div>
        </div>
      </div>
    </section>
  );
}
