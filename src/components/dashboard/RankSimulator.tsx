import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, X, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { xp: 0, percentile: 10 },
  { xp: 500, percentile: 30 },
  { xp: 1200, percentile: 60 },
  { xp: 2500, percentile: 85 },
  { xp: 4000, percentile: 95 },
  { xp: 6000, percentile: 99.9 },
];

export default function RankSimulator({ onBack, userXp = 2750 }: { onBack: () => void, userXp?: number }) {
  const [projectedAir, setProjectedAir] = useState(0);
  
  useEffect(() => {
    // Fake algorithm for AIR projection
    const baseCandidates = 1500000;
    const estimatedPercentile = Math.min(99.99, (userXp / 6000) * 100);
    const air = Math.max(1, Math.floor(((100 - estimatedPercentile) / 100) * baseCandidates));
    setProjectedAir(air);
  }, [userXp]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans text-white">
      <header className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
        <div className="font-black text-lg tracking-widest text-emerald-500 uppercase flex items-center gap-2">
          <TrendingUp size={20} /> AIR Simulator
        </div>
      </header>
      
      <main className="flex-1 p-6 flex flex-col items-center justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl glass-panel p-8 rounded-3xl relative z-10 text-center">
          <Trophy size={48} className="text-yellow-400 mx-auto mb-4" />
          <h2 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Estimated All India Rank</h2>
          <div className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-8">
            {projectedAir.toLocaleString()}
          </div>
          
          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="xp" stroke="#475569" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="percentile" stroke="#10b981" fillOpacity={1} fill="url(#colorPct)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-slate-400 text-sm">
            Based on real-time comparative analysis of <span className="text-white font-bold">1,500,000+</span> aspirants.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
