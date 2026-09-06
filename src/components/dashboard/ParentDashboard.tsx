import { motion } from 'framer-motion';
import { Eye, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ParentDashboard({ onBack }: { onBack: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col font-sans text-slate-900 overflow-y-auto">
      <header className="flex justify-between items-center p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <ShieldCheck size={28} className="text-emerald-600" />
          <h1 className="font-black text-xl text-slate-800 tracking-tight">Parent Portal</h1>
        </div>
        <button onClick={onBack} className="text-sm font-bold text-slate-500 hover:text-slate-800">Close</button>
      </header>
      
      <main className="flex-1 max-w-3xl mx-auto w-full p-6 space-y-6 pt-10">
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=student" alt="Student" className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900">Weekly Performance Digest</h2>
          <p className="text-slate-500 mt-1">Generated securely for the parent/mentor of <strong className="text-slate-800">John Doe</strong></p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <Clock size={24} className="text-blue-500 mb-3" />
            <div className="text-3xl font-black text-slate-900">14.5<span className="text-lg text-slate-500 font-bold">hrs</span></div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Focus Time</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <CheckCircle2 size={24} className="text-emerald-500 mb-3" />
            <div className="text-3xl font-black text-slate-900">82<span className="text-lg text-slate-500 font-bold">%</span></div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Avg Accuracy</div>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl flex items-start gap-4">
          <AlertTriangle size={24} className="text-rose-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-rose-900 text-lg">Attention Required</h3>
            <p className="text-rose-700 mt-1 text-sm">John has skipped reviewing the <strong>Organic Chemistry</strong> error log for 3 consecutive days. A gentle nudge is recommended.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
