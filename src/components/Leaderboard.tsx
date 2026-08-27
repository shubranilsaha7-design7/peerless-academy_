import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, ChevronLeft, Shield, Zap } from 'lucide-react';

export default function Leaderboard({ onBack }: { onBack: () => void }) {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, xp, level')
        .order('xp', { ascending: false })
        .limit(10);
        
      if (!error && data) {
        setLeaders(data);
      }
    } catch (err) {
      console.error('Leaderboard error', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (index: number) => {
    if (index === 0) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    if (index === 1) return 'text-slate-300 bg-slate-300/10 border-slate-300/30';
    if (index === 2) return 'text-amber-600 bg-amber-600/10 border-amber-600/30';
    return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col font-sans text-white overflow-y-auto">
      <header className="sticky top-0 z-10 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center px-6">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition flex items-center gap-1">
          <ChevronLeft size={20} /> Back
        </button>
        <div className="h-6 w-px bg-slate-800 mx-4" />
        <h1 className="text-lg font-black text-white flex items-center gap-2">
          <Trophy size={18} className="text-yellow-400" /> Global Leaderboard
        </h1>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 lg:p-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 inline-flex items-center gap-3">
            Hall of Legends
          </h2>
          <p className="text-slate-400 mt-4 max-w-lg mx-auto">Top students competing for mastery. Earn XP by watching lectures, completing CBT tests, and dominating the Arena.</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-12 text-slate-500">Loading rankings...</div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-2 sm:p-6 shadow-2xl">
            <div className="flex flex-col gap-3">
              {leaders.map((student, idx) => {
                const rankColorClass = getRankColor(idx);
                const isTop3 = idx < 3;
                
                return (
                  <div 
                    key={student.id} 
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition hover:bg-white/[0.02] ${isTop3 ? rankColorClass : 'border-slate-800 bg-slate-950/50'}`}
                  >
                    <div className="flex-shrink-0 w-10 text-center font-black text-xl opacity-80">
                      {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white truncate text-lg">
                          {student.full_name || student.username || 'Anonymous Peerless Scholar'}
                        </h3>
                        {idx === 0 && <Shield size={14} className="text-yellow-400" />}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 font-medium tracking-wider uppercase">
                        Level {student.level || 1}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <div className="text-lg sm:text-2xl font-black flex items-center gap-1.5 justify-end">
                        <Zap size={16} className={isTop3 ? rankColorClass.split(' ')[0] : 'text-cyan-500'} />
                        {student.xp || 0}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Total XP</div>
                    </div>
                  </div>
                );
              })}
              
              {leaders.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  No rankings available yet. Start the competition!
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
