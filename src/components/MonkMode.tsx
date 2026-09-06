import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Play, Pause, Square, Music, Volume2, ChevronLeft } from 'lucide-react';

export default function MonkMode({ onBack }: { onBack: () => void }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setStreak((s) => s + 1);
      setTimeLeft(5 * 60); // 5 min break
    }
    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col font-sans text-white">
      <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-900">
        <button onClick={onBack} className="text-zinc-500 hover:text-white transition flex items-center gap-2 text-sm font-bold">
          <ChevronLeft size={18} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2 text-amber-500 text-sm font-black uppercase tracking-wider">
          <Flame size={18} /> Monk Mode Active
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">
            Deep Work Session
          </div>

          <motion.div 
            animate={{ scale: isActive ? 1.05 : 1 }} 
            transition={{ duration: 1, repeat: isActive ? Infinity : 0, repeatType: 'reverse' }}
            className="text-[8rem] sm:text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500"
          >
            {mm}:{ss}
          </motion.div>

          <div className="flex items-center gap-6 mt-12">
            <button 
              onClick={toggleTimer} 
              className="w-16 h-16 rounded-full bg-amber-500 text-black flex items-center justify-center hover:scale-105 transition shadow-[0_0_30px_rgba(245,158,11,.3)]"
            >
              {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button 
              onClick={stopTimer} 
              className="w-12 h-12 rounded-full border border-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-zinc-900 transition"
            >
              <Square size={18} />
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
              <Flame className="text-orange-500" size={24} />
              <div className="text-2xl font-black">{streak}</div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Focus Streak</div>
            </div>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition ${soundEnabled ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}
            >
              {soundEnabled ? <Volume2 size={24} /> : <Music size={24} />}
              <div className="text-sm font-black">{soundEnabled ? 'Lo-Fi On' : 'Lo-Fi Off'}</div>
              <div className="text-[10px] uppercase tracking-wider font-bold">Ambient Audio</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
