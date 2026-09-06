import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, X, Crosshair, Users, Trophy, Play, Loader2, Zap, ShieldAlert, Skull, Flame, ArrowRight, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Latex from 'react-latex-next';
import MythicBattlefield from './battle/MythicBattlefield';
import 'katex/dist/katex.min.css';
import { MASTER_QUESTIONS } from '@/data/mockQuestionsPool';

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

  // Combat State
  const [myHp, setMyHp] = useState(MAX_HP);
  const [oppHp, setOppHp] = useState(MAX_HP);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(1.0);
  const [qIndex, setQIndex] = useState(0);
  const [combatLog, setCombatLog] = useState<{msg: string, isCrit?: boolean}[]>([]);
  const [shake, setShake] = useState(false);
  const [attackAnimation, setAttackAnimation] = useState<'none' | 'player' | 'enemy'>('none');
  
  // Direct DB Fetch for PYQs
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        supabase.from('profiles').select('full_name').eq('id', user.id).single()
          .then(({ data }) => setUserName(data?.full_name || 'Warrior'));
      } else {
        setUserId('local-user-' + Math.floor(Math.random()*1000));
        setUserName('Arjuna (Guest)');
      }
    });

    const fetchQuestions = async () => {
      try {
        const { data, error } = await (supabase as any).from('pyqs').select('*').limit(30);
        if (data && data.length >= 5) {
          setQuestions(data.sort(() => 0.5 - Math.random()));
        } else {
          setQuestions(MASTER_QUESTIONS.slice(0, 10)); // Fallback
        }
      } catch (err) {
        setQuestions(MASTER_QUESTIONS.slice(0, 10)); // Fallback
      }
    };
    fetchQuestions();
  }, []);

  
  const loadEmergencyQuestions = () => {
    setQuestions(MASTER_QUESTIONS.slice(0, 10).sort(() => 0.5 - Math.random()));
  };
  const currentQ = questions.length > qIndex ? questions[qIndex] : (questions.length > 0 ? questions[0] : null);

  // --- Realtime Subscription ---
  useEffect(() => {
    if (!roomData?.id) return;
    const channel = supabase.channel(`room_${roomData.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'arena_participants', filter: `room_id=eq.${roomData.id}` }, () => fetchParticipants(roomData.id))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'arena_rooms', filter: `id=eq.${roomData.id}` }, (payload) => {
        if (payload.new.status === 'in_progress') setView('battle');
        if (payload.new.status === 'completed') setView('podium');
      }).subscribe();
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
      const { data, error } = await (supabase as any).from('arena_rooms').insert({ room_code: code, host_user_id: userId, status: 'waiting', settings_json: { target: 'PYQ', time: 30, count: 10 } }).select().single();
      if (error) throw error;
      await (supabase as any).from('arena_participants').insert({ room_id: data.id, user_id: userId, user_name: userName, avatar: 'default' });
      setRoomData(data);
      setRoomCode(code);
      fetchParticipants(data.id);
      setView('lobby');
    } catch (e) {
      setRoomData({ id: 'mock-room', host_user_id: userId, status: 'waiting' });
      setRoomCode('LOCAL1');
      setParticipants([{ user_id: userId, user_name: userName, avatar: 'default', is_ready: false, score: 0 }]);
      setView('lobby');
    }
    setLoading(false);
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.toUpperCase() === 'LOCAL1') { setView('lobby'); return; }
    setLoading(true);
    try {
      const { data: room, error: findErr } = await (supabase as any).from('arena_rooms').select('*').eq('room_code', joinCode.toUpperCase()).single();
      if (findErr || !room) throw new Error("Room not found");
      await (supabase as any).from('arena_participants').upsert({ room_id: room.id, user_id: userId, user_name: userName, avatar: 'default' });
      setRoomData(room);
      setRoomCode(room.room_code);
      fetchParticipants(room.id);
      setView('lobby');
    } catch (e: any) { alert(e.message || "Failed to join room"); }
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
    if (roomData?.id === 'mock-room') { setView('battle'); return; }
    await (supabase as any).from('arena_rooms').update({ status: 'in_progress' }).eq('id', roomData.id);
  };

  // --- MYTHIC COMBAT LOGIC ---
  useEffect(() => {
    let aiTimer: ReturnType<typeof setInterval>;
    if (view === 'battle' && oppHp > 0 && myHp > 0) {
      aiTimer = setInterval(() => {
        const dmg = Math.floor((BASE_DMG * 0.8) + (Math.random() * 50));
        setAttackAnimation('enemy');
        setTimeout(() => {
          setMyHp(h => { const newHp = Math.max(0, h - dmg); if (newHp === 0) endGame(false); return newHp; });
          setStreak(0); setCombo(1.0); triggerShake();
          addLog(`Karna's Counter-Attack! -${dmg} Dharma`, false);
          setAttackAnimation('none');
        }, 600);
      }, 8000 + (Math.random() * 6000));
    }
    return () => clearInterval(aiTimer);
  }, [view, oppHp, myHp]);

  const addLog = (msg: string, isCrit: boolean = false) => { setCombatLog(prev => [{msg, isCrit}, ...prev].slice(0, 3)); };
  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 500); };

  const endGame = async (playerWon: boolean) => {
    if (playerWon) setOppHp(0); else setMyHp(0);
    if (roomData?.id !== 'mock-room') {
      await (supabase as any).from('arena_participants').update({ score: myHp }).eq('room_id', roomData.id).eq('user_id', userId);
      if (roomData.host_user_id === userId) await (supabase as any).from('arena_rooms').update({ status: 'completed' }).eq('id', roomData.id);
    }
    setTimeout(() => setView('podium'), 2000);
  };

  const handleAnswer = (selectedIndex: number) => {
    if (!currentQ) return;
    if (selectedIndex === (currentQ.correct_option !== undefined ? currentQ.correct_option : currentQ.correct_index)) {
      const isCrit = combo >= 1.5;
      const dmg = Math.floor(BASE_DMG * combo);
      setAttackAnimation('player');
      setTimeout(() => {
        setOppHp(h => { const newHp = Math.max(0, h - dmg); if (newHp === 0) endGame(true); return newHp; });
        setStreak(s => s + 1); setCombo(c => Math.min(2.5, c + 0.2));
        addLog(`Divine Astra Strike! -${dmg} Karma`, isCrit);
        setAttackAnimation('none');
        setQIndex(i => i + 1);
      }, 600);
    } else {
      const selfDmg = Math.floor(BASE_DMG * 0.5);
      setAttackAnimation('enemy');
      setTimeout(() => {
        setMyHp(h => { const newHp = Math.max(0, h - selfDmg); if (newHp === 0) endGame(false); return newHp; });
        setStreak(0); setCombo(1.0); triggerShake();
        addLog(`Illusion broken! Shield damaged -${selfDmg}`, false);
        setAttackAnimation('none');
        setQIndex(i => i + 1);
      }, 600);
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col overflow-x-hidden bg-[#090D16] text-white ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      {/* Dynamic Battle Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-[#050510] to-[#050510] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-screen pointer-events-none animate-[pulse_4s_ease-in-out_infinite]" />
      
      <div className="sticky top-0 z-50 p-6 flex justify-between items-center border-b border-amber-500/20 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-500 rounded-xl border border-amber-500/30"><Swords size={20} /></div>
          <div>
            <h2 className="font-black text-xl leading-none tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">KURUKSHETRA</h2>
            <div className="text-[10px] text-amber-500/70 uppercase tracking-widest font-bold mt-1">Mythic Multiplayer Arena</div>
          </div>
        </div>
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full transition border border-slate-700">
          <X size={20} />
        </button>
      </div>

      <div className="relative flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center z-10">
        {view === 'menu' && (
          <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-500">
            <button onClick={handleCreateRoom} disabled={loading} className="w-full group relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-800 rounded-3xl p-8 border-2 border-amber-500 hover:scale-[1.02] transition shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] text-left">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black mb-1 text-white drop-shadow-md">Create Room</h3>
                  <p className="text-amber-200 font-bold text-sm">Host a Divine Match</p>
                </div>
                <div className="bg-black/30 p-4 rounded-full text-amber-400 group-hover:rotate-12 transition border border-amber-500/30">
                  {loading ? <Loader2 className="animate-spin" size={32} /> : <Crosshair size={32} />}
                </div>
              </div>
            </button>
            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-slate-500 font-black text-xs uppercase tracking-widest">OR</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>
            <form onSubmit={handleJoinRoom} className="bg-black/60 border border-slate-800 rounded-3xl p-8 space-y-4 backdrop-blur-sm">
              <h3 className="text-xl font-black text-white text-center">Join with PIN</h3>
              <input required value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="6-DIGIT PIN" maxLength={6} className="w-full bg-slate-900 border-2 border-slate-800 focus:border-amber-500 rounded-xl px-4 py-4 text-center text-2xl font-black text-white uppercase tracking-widest transition outline-none" />
              <button disabled={loading} type="submit" className="w-full bg-slate-800 hover:bg-amber-600 text-white font-black py-4 rounded-xl transition uppercase tracking-widest text-sm border border-slate-700 hover:border-amber-400">Join Match</button>
            </form>
          </div>
        )}

        {view === 'lobby' && (
          <div className="w-full max-w-4xl animate-in zoom-in-95 fade-in duration-500">
            <div className="bg-black/60 border border-amber-500/20 rounded-[2rem] p-8 shadow-[0_0_50px_-15px_rgba(245,158,11,0.2)] relative overflow-hidden backdrop-blur-md">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-800 pb-8 mb-8">
                <div>
                  <h1 className="text-4xl font-black text-white mb-2">PIN: <span className="text-amber-500 tracking-widest drop-shadow-md">{roomCode}</span></h1>
                  <p className="text-slate-400 font-bold">Summoning Warriors...</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                  <div className="text-center px-4 border-r border-slate-800">
                    <div className="text-2xl font-black text-white">{participants.length}/10</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Warriors</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-2xl font-black text-emerald-400">{participants.filter(p => p.is_ready).length}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ready</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
                {participants.map((p, i) => (
                  <div key={i} className={`p-4 rounded-2xl text-center border transition-all ${p.is_ready ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)]' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-950 border border-slate-800 mb-3 flex items-center justify-center relative overflow-hidden">
                      <div className={`absolute inset-0 border-4 border-dashed rounded-full ${p.is_ready ? 'border-amber-500 animate-[spin_4s_linear_infinite]' : 'border-slate-700'}`} />
                      <Users size={24} className={p.is_ready ? "text-amber-400" : "text-slate-500"} />
                    </div>
                    <div className="text-xs font-bold text-white truncate">{p.user_name}</div>
                    <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${p.is_ready ? 'text-amber-400' : 'text-slate-500'}`}>{p.is_ready ? 'READY' : 'WAITING'}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={toggleReady} className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest transition border ${participants.find(p => p.user_id === userId)?.is_ready ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600' : 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400 shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)]'}`}>
                  {participants.find(p => p.user_id === userId)?.is_ready ? 'Cancel' : 'Prepare for Battle'}
                </button>
                {(roomData.host_user_id === userId || roomData.id === 'mock-room') && (
                  <button onClick={startBattle} className="flex-1 bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-xl transition flex items-center justify-center gap-2 uppercase tracking-widest border border-red-500 shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)]">
                    <Play size={18} /> START BATTLE
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'battle' && (
          <div className="w-full max-w-5xl h-full flex flex-col gap-6 relative">
            
            {/* Advanced Mythic Battlefield */}
            <MythicBattlefield playerHp={myHp} oppHp={oppHp} maxHp={MAX_HP} attackAnimation={attackAnimation} />

            {/* RPG Health Bars */}
            <div className="flex justify-between items-center gap-4 bg-black/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md z-10">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="font-black text-cyan-400 drop-shadow-md">ARJUNA (You)</span>
                  <span className="font-bold text-slate-300">{myHp} DHARMA</span>
                </div>
                <div className="h-5 bg-slate-900 rounded-full overflow-hidden shadow-inner flex justify-end border border-slate-700">
                  <motion.div initial={false} animate={{ width: `${(myHp/MAX_HP)*100}%` }} className={`h-full transition-all duration-300 ${myHp < 300 ? 'bg-red-500' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]'}`} />
                </div>
              </div>
              
              <div className="w-16 h-16 bg-slate-950 rounded-full border-4 border-amber-500/50 flex items-center justify-center shrink-0 shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)] z-20">
                <Swords size={28} className="text-amber-500" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-slate-300">{oppHp} KARMA</span>
                  <span className="font-black text-rose-500 drop-shadow-md">KARNA (Rival)</span>
                </div>
                <div className="h-5 bg-slate-900 rounded-full overflow-hidden shadow-inner border border-slate-700">
                  <motion.div initial={false} animate={{ width: `${(oppHp/MAX_HP)*100}%` }} className={`h-full transition-all duration-300 ${oppHp < 300 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-orange-600'}`} />
                </div>
              </div>
            </div>

            {/* Combat Stats & Logs */}
            <div className="flex justify-between items-end px-2 z-10">
              <div className="flex gap-4">
                <div className="bg-black/60 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2 backdrop-blur-sm">
                  <Flame size={16} className={streak > 2 ? 'text-amber-500 animate-pulse' : 'text-slate-500'} />
                  <span className="font-black tracking-widest">{streak} STREAK</span>
                </div>
                <div className="bg-black/60 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2 backdrop-blur-sm">
                  <Zap size={16} className={combo > 1 ? 'text-cyan-400 drop-shadow-md' : 'text-slate-500'} />
                  <span className="font-black tracking-widest">{combo.toFixed(1)}x DMG</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 items-end pointer-events-none absolute right-8 top-48 z-50">
                <AnimatePresence>
                  {combatLog.map((log, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: -20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className={`px-4 py-2 rounded-lg font-black text-sm uppercase tracking-widest border ${log.isCrit ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-slate-900/80 border-slate-700 text-white'}`}>
                      {log.msg}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Question UI */}
            {currentQ ? (
              <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-end md:justify-center p-4 pb-12 bg-black/70 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md z-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500 opacity-50" />
                <div className="flex-1 overflow-y-auto mb-6 pr-4 custom-scrollbar">
                  <div className="relative z-20 bg-slate-900/90 rounded-xl p-6 mb-4 text-white text-lg md:text-xl font-medium max-w-none leading-relaxed [&_.katex]:text-white shadow-xl">
                    <Latex>{currentQ.question_latex}</Latex>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Array.isArray(currentQ?.options_json) ? currentQ.options_json : (typeof currentQ?.options_json === 'string' ? JSON.parse(currentQ.options_json) : (currentQ?.options || []))).map((opt: string, i: number) => (
                    <button key={i} onClick={() => handleAnswer(i)} className="bg-slate-800 border border-slate-700 text-white p-4 rounded-xl hover:bg-slate-700 active:bg-blue-600 text-left transition-all group">
                      <div className="flex gap-4 items-center">
                        <span className="font-black text-xl text-slate-600 group-hover:text-amber-400 drop-shadow-md">{['A','B','C','D'][i]}</span>
                        <span className="text-white text-lg font-medium"><Latex>{opt}</Latex></span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : questions.length === 0 ? (
              <div className="flex-1 bg-black/70 border border-slate-800 rounded-3xl flex flex-col items-center justify-center z-10 p-8 text-center">
                <Loader2 size={48} className="animate-spin text-amber-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Summoning Questions...</h3>
                <p className="text-slate-400">If this takes too long, no questions were found for this class/subject. Check back soon or switch filters!</p>
              </div>
            ) : (
              <div className="flex-1 bg-black/70 border border-slate-800 rounded-3xl flex items-center justify-center z-10">
                <Loader2 size={48} className="animate-spin text-amber-500" />
              </div>
            )}
            
          </div>
        )}

        {view === 'podium' && (
          <div className="w-full max-w-3xl animate-in zoom-in-95 fade-in duration-700 space-y-8 z-10">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 text-center drop-shadow-2xl">BATTLE CONCLUDED</h1>
            
            <div className="bg-black/80 border border-amber-500/30 rounded-3xl p-12 text-center shadow-[0_0_50px_-10px_rgba(245,158,11,0.3)] backdrop-blur-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
              
              {myHp > oppHp ? (
                <div className="relative z-10">
                  <div className="inline-block relative">
                    <Trophy size={100} className="mx-auto text-amber-400 mb-6 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-4 border-dashed border-amber-500/30 rounded-full scale-150" />
                  </div>
                  <h2 className="text-5xl font-black text-emerald-400 mb-2 tracking-widest">VICTORY</h2>
                  <p className="text-amber-200/70 font-serif italic text-xl">Dharma prevails. +45 XP</p>
                </div>
              ) : (
                <div className="relative z-10">
                  <Skull size={100} className="mx-auto text-rose-600 mb-6 drop-shadow-[0_0_20px_rgba(225,29,72,0.8)]" />
                  <h2 className="text-5xl font-black text-rose-500 mb-2 tracking-widest">DEFEAT</h2>
                  <p className="text-rose-200/70 font-serif italic text-xl">You have fallen. Rise again.</p>
                </div>
              )}
            </div>

            <button onClick={() => setView('menu')} className="mx-auto block bg-slate-900 hover:bg-slate-800 text-white font-black px-10 py-5 rounded-2xl transition uppercase tracking-widest text-sm border border-slate-700 hover:border-amber-500 hover:text-amber-400">
              Return to Camp
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
