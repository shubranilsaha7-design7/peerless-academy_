const fs = require('fs');

const kurukshetraCode = `import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, X, Crosshair, Users, Trophy, Play, Loader2, Zap, ShieldAlert, Skull, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCbtStore } from '@/store/cbtStore';
import { useTestHydration } from '@/hooks/useTestHydration';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

const MAX_HP = 1000;
const BASE_DMG = 250;

export default function Kurukshetra({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'menu' | 'lobby' | 'battle' | 'podium'>('menu');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [roomData, setRoomData] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

  // Dual Engine Combat State
  const [myHp, setMyHp] = useState(MAX_HP);
  const [oppHp, setOppHp] = useState(MAX_HP);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(1.0);
  const [qIndex, setQIndex] = useState(0);
  const [combatLog, setCombatLog] = useState<{msg: string, isCrit?: boolean}[]>([]);
  const [shake, setShake] = useState(false);
  
  // Hydrate with Real Questions (Default to JEE_MAIN for now)
  const storeQs = useCbtStore(s => s.questions);
  useTestHydration('JEE_MAIN', false, storeQs.length > 0);
  const currentQ = storeQs.length > qIndex ? storeQs[qIndex] : (storeQs.length > 0 ? storeQs[0] : null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        supabase.from('profiles').select('full_name').eq('id', user.id).single()
          .then(({ data }) => setUserName(data?.full_name || 'Anonymous Player'));
      } else {
        // Mock User if offline/not logged in
        setUserId('local-user-' + Math.floor(Math.random()*1000));
        setUserName('Guest Warrior');
      }
    });
  }, []);

  // --- Realtime Subscription Logic ---
  useEffect(() => {
    if (!roomData?.id) return;
    
    const channel = supabase.channel(\`room_\${roomData.id}\`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'arena_participants', filter: \`room_id=eq.\${roomData.id}\` }, () => {
        fetchParticipants(roomData.id);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'arena_rooms', filter: \`id=eq.\${roomData.id}\` }, (payload) => {
        if (payload.new.status === 'in_progress') setView('battle');
        if (payload.new.status === 'completed') setView('podium');
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [roomData?.id]);

  const fetchParticipants = async (roomId: string) => {
    const { data } = await (supabase as any).from('arena_participants').select('*').eq('room_id', roomId).order('score', { ascending: false });
    if (data) setParticipants(data);
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      const { data, error } = await (supabase as any).from('arena_rooms').insert({
        room_code: code,
        host_user_id: userId,
        status: 'waiting',
        settings_json: { target: 'PYQ', time: 30, count: 10 }
      }).select().single();
      
      if (error) throw error;
      
      await (supabase as any).from('arena_participants').insert({
        room_id: data.id,
        user_id: userId,
        user_name: userName,
        avatar: 'default'
      });
      
      setRoomData(data);
      setRoomCode(code);
      fetchParticipants(data.id);
      setView('lobby');
    } catch (e) {
      console.warn("DB Failed. Entering Offline Mock Mode.");
      // MOCK MODE FALLBACK
      setRoomData({ id: 'mock-room', host_user_id: userId, status: 'waiting' });
      setRoomCode('LOCAL1');
      setParticipants([{ user_id: userId, user_name: userName, avatar: 'default', is_ready: false, score: 0 }]);
      setView('lobby');
    }
    setLoading(false);
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.toUpperCase() === 'LOCAL1') {
      setView('lobby');
      return;
    }
    setLoading(true);
    try {
      const { data: room, error: findErr } = await (supabase as any).from('arena_rooms').select('*').eq('room_code', joinCode.toUpperCase()).single();
      if (findErr || !room) throw new Error("Room not found");
      
      await (supabase as any).from('arena_participants').upsert({
        room_id: room.id,
        user_id: userId,
        user_name: userName,
        avatar: 'default'
      });
      
      setRoomData(room);
      setRoomCode(room.room_code);
      fetchParticipants(room.id);
      setView('lobby');
    } catch (e: any) {
      alert(e.message || "Failed to join room");
    }
    setLoading(false);
  };

  const toggleReady = async () => {
    if (roomData?.id === 'mock-room') {
      setParticipants(p => p.map(x => x.user_id === userId ? { ...x, is_ready: !x.is_ready } : x));
      return;
    }
    const me = participants.find(p => p.user_id === userId);
    if (!me) return;
    await (supabase as any).from('arena_participants').update({ is_ready: !me.is_ready }).eq('room_id', roomData.id).eq('user_id', userId);
  };

  const startBattle = async () => {
    if (roomData?.id === 'mock-room') {
      setView('battle');
      return;
    }
    await (supabase as any).from('arena_rooms').update({ status: 'in_progress' }).eq('id', roomData.id);
  };

  // --- COMBAT LOGIC ---
  useEffect(() => {
    let aiTimer: ReturnType<typeof setInterval>;
    if (view === 'battle' && oppHp > 0 && myHp > 0) {
      aiTimer = setInterval(() => {
        const dmg = Math.floor((BASE_DMG * 0.8) + (Math.random() * 50));
        setMyHp(h => {
          const newHp = Math.max(0, h - dmg);
          if (newHp === 0) endGame(false);
          return newHp;
        });
        setStreak(0);
        setCombo(1.0);
        triggerShake();
        addLog(\`Rival struck! -\${dmg} HP\`, false);
      }, 7000 + (Math.random() * 5000));
    }
    return () => clearInterval(aiTimer);
  }, [view, oppHp, myHp]);

  const addLog = (msg: string, isCrit: boolean = false) => {
    setCombatLog(prev => [{msg, isCrit}, ...prev].slice(0, 3));
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const endGame = async (playerWon: boolean) => {
    if (playerWon) setOppHp(0);
    else setMyHp(0);
    
    // Sync final score to DB if not mock
    if (roomData?.id !== 'mock-room') {
      await (supabase as any).from('arena_participants').update({ score: myHp }).eq('room_id', roomData.id).eq('user_id', userId);
      if (roomData.host_user_id === userId) {
        await (supabase as any).from('arena_rooms').update({ status: 'completed' }).eq('id', roomData.id);
      }
    }
    
    setTimeout(() => setView('podium'), 2000);
  };

  const handleAnswer = (selectedIndex: number) => {
    if (!currentQ) return;
    
    if (selectedIndex === currentQ.correct_index) {
      const isCrit = combo >= 1.5;
      const dmg = Math.floor(BASE_DMG * combo);
      setOppHp(h => {
        const newHp = Math.max(0, h - dmg);
        if (newHp === 0) endGame(true);
        return newHp;
      });
      setStreak(s => s + 1);
      setCombo(c => Math.min(2.5, c + 0.2));
      addLog(\`Direct Hit! -\${dmg} HP\`, isCrit);
    } else {
      const selfDmg = Math.floor(BASE_DMG * 0.5);
      setMyHp(h => {
        const newHp = Math.max(0, h - selfDmg);
        if (newHp === 0) endGame(false);
        return newHp;
      });
      setStreak(0);
      setCombo(1.0);
      triggerShake();
      addLog(\`Missed! Backfired -\${selfDmg} HP\`, false);
    }
    
    setTimeout(() => setQIndex(i => i + 1), 600);
  };

  return (
    <div className={\`fixed inset-0 z-50 bg-[#090D16] text-white flex flex-col \${shake ? 'animate-[shake_0.4s_ease-in-out]' : ''}\`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      <div className="relative p-6 flex justify-between items-center border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/20 text-rose-500 rounded-xl"><Swords size={20} /></div>
          <div>
            <h2 className="font-black text-xl leading-none">KURUKSHETRA</h2>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Multiplayer Arena</div>
          </div>
        </div>
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition">
          <X size={20} />
        </button>
      </div>

      <div className="relative flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center">
        {view === 'menu' && (
          <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-500">
            <button onClick={handleCreateRoom} disabled={loading} className="w-full group relative overflow-hidden bg-rose-600 rounded-3xl p-8 border-2 border-rose-500 hover:scale-[1.02] transition shadow-2xl shadow-rose-600/30 text-left">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black mb-1 text-white">Create Room</h3>
                  <p className="text-rose-200 font-bold text-sm">Host a private lobby</p>
                </div>
                <div className="bg-rose-950 p-4 rounded-full text-rose-400 group-hover:rotate-12 transition">
                  {loading ? <Loader2 className="animate-spin" size={32} /> : <Crosshair size={32} />}
                </div>
              </div>
            </button>

            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-slate-500 font-black text-xs uppercase tracking-widest">OR</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            <form onSubmit={handleJoinRoom} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
              <h3 className="text-xl font-black text-white text-center">Join with Code</h3>
              <input 
                required 
                value={joinCode} 
                onChange={e => setJoinCode(e.target.value)} 
                placeholder="Enter 6-digit Code" 
                maxLength={6}
                className="w-full bg-slate-950 border-2 border-slate-800 focus:border-rose-500 rounded-xl px-4 py-4 text-center text-2xl font-black text-white uppercase tracking-widest transition outline-none" 
              />
              <button disabled={loading} type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-xl transition uppercase tracking-widest text-sm">
                Join Match
              </button>
            </form>
          </div>
        )}

        {view === 'lobby' && (
          <div className="w-full max-w-4xl animate-in zoom-in-95 fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-800 pb-8 mb-8">
                <div>
                  <h1 className="text-4xl font-black text-white mb-2">Room Code: <span className="text-rose-500 tracking-widest">{roomCode}</span></h1>
                  <p className="text-slate-400 font-bold">Waiting for players to ready up...</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                  <div className="text-center px-4 border-r border-slate-800">
                    <div className="text-2xl font-black text-white">{participants.length}/10</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Players</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-2xl font-black text-emerald-400">{participants.filter(p => p.is_ready).length}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ready</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
                {participants.map((p, i) => (
                  <div key={i} className={\`p-4 rounded-2xl text-center border transition-all \${p.is_ready ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950 border-slate-800'}\`}>
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 mb-3 flex items-center justify-center">
                      <Users size={24} className="text-slate-500" />
                    </div>
                    <div className="text-xs font-bold text-white truncate">{p.user_name}</div>
                    <div className={\`text-[10px] font-black uppercase tracking-widest mt-1 \${p.is_ready ? 'text-emerald-400' : 'text-slate-500'}\`}>
                      {p.is_ready ? 'READY' : 'WAITING'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={toggleReady} className={\`flex-1 py-4 rounded-xl font-black uppercase tracking-widest transition \${participants.find(p => p.user_id === userId)?.is_ready ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}\`}>
                  {participants.find(p => p.user_id === userId)?.is_ready ? 'Cancel Ready' : 'Ready Up'}
                </button>
                {(roomData.host_user_id === userId || roomData.id === 'mock-room') && (
                  <button onClick={startBattle} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-xl transition flex items-center justify-center gap-2 uppercase tracking-widest">
                    <Play size={18} /> Start Battle
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'battle' && (
          <div className="w-full max-w-4xl h-full flex flex-col gap-6">
            
            {/* Dual Health Bars */}
            <div className="flex justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="font-black text-emerald-400">{userName}</span>
                  <span className="font-bold text-slate-400">{myHp} HP</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden shadow-inner flex justify-end">
                  <motion.div initial={false} animate={{ width: \`\${(myHp/MAX_HP)*100}%\` }} className={\`h-full transition-all duration-300 \${myHp < 300 ? 'bg-rose-500' : 'bg-emerald-500'}\`} />
                </div>
              </div>
              
              <div className="w-12 h-12 bg-slate-950 rounded-full border-2 border-slate-800 flex items-center justify-center shrink-0">
                <Swords size={20} className="text-rose-500" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-slate-400">{oppHp} HP</span>
                  <span className="font-black text-rose-500">Rival</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div initial={false} animate={{ width: \`\${(oppHp/MAX_HP)*100}%\` }} className={\`h-full transition-all duration-300 \${oppHp < 300 ? 'bg-rose-500' : 'bg-rose-600'}\`} />
                </div>
              </div>
            </div>

            {/* Combat Stats & Logs */}
            <div className="flex justify-between items-end px-2">
              <div className="flex gap-4">
                <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Flame size={16} className={streak > 2 ? 'text-amber-500' : 'text-slate-500'} />
                  <span className="font-black">{streak} Streak</span>
                </div>
                <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Zap size={16} className={combo > 1 ? 'text-cyan-400' : 'text-slate-500'} />
                  <span className="font-black">{combo.toFixed(1)}x DMG</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 items-end pointer-events-none absolute right-8 top-40 z-50">
                <AnimatePresence>
                  {combatLog.map((log, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className={\`px-3 py-1 rounded-lg font-black text-sm \${log.isCrit ? 'bg-amber-500 text-slate-900 scale-110' : 'bg-slate-800 text-white'}\`}>
                      {log.msg}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Question UI */}
            {currentQ ? (
              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
                <div className="flex-1 overflow-y-auto mb-6">
                  <div className="prose prose-invert prose-lg max-w-none">
                    <Latex>{currentQ.question_latex}</Latex>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQ.options.map((opt: string, i: number) => (
                    <button key={i} onClick={() => handleAnswer(i)} className="bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/10 p-4 rounded-xl text-left transition group">
                      <div className="flex gap-4">
                        <span className="font-black text-slate-500 group-hover:text-indigo-400">{['A','B','C','D'][i]}</span>
                        <span className="text-white"><Latex>{opt}</Latex></span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-indigo-500" />
              </div>
            )}
            
          </div>
        )}

        {view === 'podium' && (
          <div className="w-full max-w-3xl animate-in zoom-in-95 fade-in duration-700 space-y-8">
            <h1 className="text-5xl font-black text-white text-center">MATCH RESULTS</h1>
            
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-2xl">
              {myHp > oppHp ? (
                <div>
                  <Trophy size={80} className="mx-auto text-amber-400 mb-6" />
                  <h2 className="text-4xl font-black text-emerald-400 mb-2">VICTORY</h2>
                  <p className="text-slate-400">You dominated the Arena. +45 XP</p>
                </div>
              ) : (
                <div>
                  <Skull size={80} className="mx-auto text-rose-500 mb-6" />
                  <h2 className="text-4xl font-black text-rose-500 mb-2">DEFEAT</h2>
                  <p className="text-slate-400">You were bested in combat. Try again.</p>
                </div>
              )}
            </div>

            <button onClick={() => setView('menu')} className="mx-auto block bg-slate-800 hover:bg-slate-700 text-white font-black px-8 py-4 rounded-xl transition uppercase tracking-widest text-sm">
              Return to Hub
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/Kurukshetra.tsx', kurukshetraCode);
console.log('Kurukshetra upgraded with combat engine and mock fallback');
