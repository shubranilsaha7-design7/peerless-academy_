import React from 'react';
import { Cpu, Zap, DollarSign, AlertTriangle } from 'lucide-react';

export default function AiQuotaMonitor() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Cpu className="text-cyan-400" size={28} />
        <h2 className="text-3xl font-black text-white">AI Quota & Cost Monitor</h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Gemini 3.6 Flash Core</h3>
            <p className="text-sm text-slate-400">Current Billing Cycle: Sept 2026</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full font-bold text-sm">
            <Zap size={16} /> API Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-slate-400">Monthly Token Usage</span>
              <span className="text-white">4.2M / 10M</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 w-[42%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-slate-400">Rate Limit (RPM)</span>
              <span className="text-white">45 / 60</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 w-[75%]" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 p-6 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <DollarSign size={32} />
          </div>
          <div>
            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Estimated Bill</div>
            <div className="text-3xl font-black text-white">$12.45</div>
            <div className="text-xs text-slate-500 mt-1">Google Cloud Project: peerless-ai-core</div>
          </div>
        </div>
      </div>
    </div>
  );
}
