import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, X, Crosshair, Users, Trophy, Play, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function Kurukshetra({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'menu' | 'lobby' | 'battle' | 'podium'>('menu');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [roomData, setRoomData] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        supabase.from('profiles').select('full_name').eq('id', user.id).single()
          .then(({ data }) => setUserName(data?.full_name || 'Anonymous Player'));
      }
    });
  }, []);

  // --- Realtime Subscription Logic ---
  useEffect(() => {
    if (!roomData?.id) return;
    
    // Subscribe to participant updates
    const channel = supabase.channel(`room_${roomData.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'arena_participants', filter: `room_id=eq.${roomData.id}` }, (payload) => {
        fetchParticipants(roomData.id);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'arena_rooms', filter: `id=eq.${roomData.id}` }, (payload) => {
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
      
      // Join self
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
      alert("Error creating room");
    }
    setLoading(false);
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
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
    const me = participants.find(p => p.user_id === userId);
    if (!me) return;
    await (supabase as any).from('arena_participants').update({ is_ready: !me.is_ready }).eq('room_id', roomData.id).eq('user_id', userId);
  };

  const startBattle = async () => {
    await (supabase as any).from('arena_rooms').update({ status: 'in_progress' }).eq('id', roomData.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090D16] text-white flex flex-col">
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

      <div className="relative flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-center">
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
              
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
                {participants.map(p => (
                  <div key={p.user_id} className={`p-4 rounded-2xl text-center border transition-all ${p.is_ready ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 mb-3 flex items-center justify-center">
                      <Users size={24} className="text-slate-500" />
                    </div>
                    <div className="text-xs font-bold text-white truncate">{p.user_name}</div>
                    <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${p.is_ready ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {p.is_ready ? 'READY' : 'WAITING'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={toggleReady} className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest transition ${participants.find(p => p.user_id === userId)?.is_ready ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>
                  {participants.find(p => p.user_id === userId)?.is_ready ? 'Cancel Ready' : 'Ready Up'}
                </button>
                {roomData.host_user_id === userId && (
                  <button onClick={startBattle} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-xl transition flex items-center justify-center gap-2 uppercase tracking-widest">
                    <Play size={18} /> Start Battle
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'battle' && (
          <div className="w-full max-w-4xl text-center space-y-6">
            <h1 className="text-5xl font-black text-rose-500 animate-pulse">BATTLE IN PROGRESS</h1>
            <p className="text-slate-400">Match engine syncing live over Supabase Realtime...</p>
            <button onClick={() => setView('podium')} className="bg-slate-800 px-6 py-3 rounded-xl font-bold text-sm mt-8">Simulate Match End</button>
          </div>
        )}

        {view === 'podium' && (
          <div className="w-full max-w-3xl animate-in zoom-in-95 fade-in duration-700 space-y-8">
            <h1 className="text-4xl font-black text-white text-center">MATCH RESULTS</h1>
            <div className="flex items-end justify-center gap-4 h-64">
              {participants.slice(0,3).map((p, i) => (
                <div key={p.user_id} className={`flex flex-col items-center ${i===0 ? 'order-2' : i===1 ? 'order-1' : 'order-3'}`}>
                  <div className="text-xs font-bold text-slate-400 mb-2 truncate max-w-[100px]">{p.user_name}</div>
                  <div className={`w-24 rounded-t-xl bg-gradient-to-t border border-white/10 flex flex-col items-center justify-end pb-4 ${
                    i===0 ? 'h-48 from-amber-500 to-amber-300' : 
                    i===1 ? 'h-32 from-slate-400 to-slate-300' : 
                    'h-24 from-orange-700 to-orange-500'
                  }`}>
                    <div className="font-black text-slate-900 text-3xl">{i+1}</div>
                  </div>
                </div>
              ))}
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
