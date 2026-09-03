import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Users, Crosshair, Radar, Loader2, X, Trophy, Swords, Zap, Timer, Bot } from 'lucide-react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function QuickMatchArena({ onBack }: { onBack?: () => void }) {
  const [view, setView] = useState<'menu' | 'searching' | 'battle' | 'results'>('menu');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [searchTimer, setSearchTimer] = useState(10);
  
  // Opponent Data
  const [oppId, setOppId] = useState('');
  const [oppName, setOppName] = useState('');
  const [isBot, setIsBot] = useState(false);
  
  // Battle State
  const [questions, setQuestions] = useState<any[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const id = user?.id || 'guest-' + Math.floor(Math.random()*10000);
      setUserId(id);
      if (user) {
        supabase.from('profiles').select('full_name').eq('id', id).single()
          .then(({ data }) => setUserName(data?.full_name || 'Competitor'));
      } else {
        setUserName('Guest Challenger');
      }
    });
  }, []);

  useEffect(() => {
    let interval: any;
    let channel: any;

    if (view === 'searching') {
      channel = supabase.channel('room:quickmatch');

      channel
        .on('presence', { event: 'sync' }, async () => {
          const newState = channel.presenceState();
          const activeUsers = Object.values(newState).flat() as any[];
          const searchingUsers = activeUsers.filter(u => u.status === 'searching');

          if (searchingUsers.length >= 2) {
            // We have a match
            // Sort by joined_at to determine host deterministically
            searchingUsers.sort((a, b) => a.joined_at - b.joined_at);
            const host = searchingUsers[0];
            const client = searchingUsers[1];

            const amIHost = host.user_id === userId;
            const amIClient = client.user_id === userId;

            if (amIHost || amIClient) {
              const opponent = amIHost ? client : host;
              setOppId(opponent.user_id);
              setOppName(opponent.user_name);
              setIsBot(false);

              if (amIHost) {
                // Host fetches questions and broadcasts
                const { data, error } = await (supabase as any).from('pyqs').select('*').limit(20);
                if (data && data.length >= 5) {
                  const selected = data.sort(() => 0.5 - Math.random()).slice(0, 5);
                  channel.send({
                    type: 'broadcast',
                    event: 'start_match',
                    payload: { questions: selected, hostId: host.user_id, clientId: client.user_id }
                  });
                  setQuestions(selected);
                  setTimeout(() => setView('battle'), 1500);
                } else {
                  console.warn("DB empty. Using fallback.");
                  const selected = [
  { id: '1', question_latex: 'Calculate the force required to accelerate a 5kg mass at 2m/s^2.', options_json: ['10 N', '5 N', '2.5 N', '20 N'], correct_option: 0, subject: 'Physics' },
  { id: '2', question_latex: 'What is the powerhouse of the cell?', options_json: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'], correct_option: 1, subject: 'Biology' },
  { id: '3', question_latex: 'Integration of $x^2 dx$ is?', options_json: ['$x^3/3
              }
            }
          }
        })
        .on('broadcast', { event: 'start_match' }, (payload: any) => {
          if (payload.payload.clientId === userId || payload.payload.hostId === userId) {
            setQuestions(payload.payload.questions);
            setTimeout(() => setView('battle'), 1500);
          }
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: userId,
              user_name: userName,
              status: 'searching',
              joined_at: Date.now()
            });
          }
        });

      interval = setInterval(async () => {
        setSearchTimer(t => {
          if (t <= 1) {
            clearInterval(interval);
            // Fallback to Bot
            if (channel) {
              channel.untrack();
              supabase.removeChannel(channel);
            }
            startBotMatch();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (channel) {
        channel.untrack();
        supabase.removeChannel(channel);
      }
    };
  }, [view, userId, userName]);

  const startBotMatch = async () => {
    setOppId('ai-bot');
    setOppName('AI Scholar [Level 8]');
    setIsBot(true);
    const { data, error } = await (supabase as any).from('pyqs').select('*').limit(20);
    if (data && data.length >= 5) {
      setQuestions(data.sort(() => 0.5 - Math.random()).slice(0, 5));
      setTimeout(() => setView('battle'), 1000);
    } else {
       console.error("Supabase Sync Error:", error);
    }
  };

  const startSearch = () => {
    setSearchTimer(10);
    setView('searching');
  };

  useEffect(() => {
    let timer: any;
    if (view === 'battle' && qIndex < 5) {
      setTimeLeft(30);
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { handleNextQuestion(); return 30; }
          return t - 1;
        });
      }, 1000);
      
      if (isBot) {
        const botDelay = Math.floor(Math.random() * 5000) + 4000;
        setTimeout(() => {
          const isCorrect = Math.random() < 0.8;
          if (isCorrect) setOppScore(s => s + 4);
          else setOppScore(s => Math.max(0, s - 1));
        }, botDelay);
      }
    } else if (view === 'battle' && qIndex >= 5) {
      setView('results');
    }
    return () => clearInterval(timer);
  }, [view, qIndex, isBot]);

  const handleAnswer = (selectedIndex: number) => {
    const currentQ = questions[qIndex];
    if (selectedIndex === (currentQ.correct_option !== undefined ? currentQ.correct_option : currentQ.correct_index)) {
      setMyScore(s => s + 4);
    } else {
      setMyScore(s => Math.max(0, s - 1));
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setQIndex(prev => prev + 1);
  };

  const currentQ = questions[qIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19] text-white flex flex-col font-sans">
      <div className="p-4 flex justify-between items-center bg-[#13192B] border-b border-indigo-500/20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><Crosshair size={20} /></div>
          <div>
            <h2 className="font-bold text-lg leading-tight tracking-wide">QUICKMATCH</h2>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">1v1 PvP Arena</div>
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-white bg-[#1A2235] rounded-full transition">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4">
        {view === 'menu' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
            <div className="bg-[#13192B] border border-indigo-500/30 rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Swords size={48} className="text-indigo-500" />
              </div>
              <h1 className="text-2xl font-black mb-2">Ranked 1v1 Duel</h1>
              <p className="text-slate-400 text-sm mb-8">Test your speed and accuracy in a 5-question sprint against live players or AI Scholars.</p>
              
              <button onClick={startSearch} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2">
                <Radar size={20} /> Find Match
              </button>
            </div>
          </motion.div>
        )}

        {view === 'searching' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-ping" />
              <div className="absolute inset-4 border-2 border-indigo-500/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-8 bg-indigo-500/20 rounded-full animate-pulse" />
              <Radar size={48} className="text-indigo-400 relative z-10 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">
              {oppId ? 'Match Found!' : 'Searching for Opponent...'}
            </h2>
            <p className="text-indigo-400 font-mono text-xl mb-4">
              {oppId ? 'Connecting...' : searchTimer + 's'}
            </p>
            
            {oppId && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#13192B] border border-emerald-500/50 rounded-xl p-4 inline-flex items-center gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-lg"><Users className="text-emerald-400" /></div>
                <div className="text-left">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Opponent</div>
                  <div className="font-bold text-lg">{oppName}</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {view === 'battle' && !currentQ && (
          <div className="w-full max-w-lg text-center bg-[#13192B] border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <Loader2 size={48} className="animate-spin text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Loading Battle Data...</h3>
            <p className="text-slate-400">If this takes too long, no questions were found. Check back soon!</p>
          </div>
        )}

        {view === 'battle' && currentQ && (
          <div className="w-full max-w-4xl h-full flex flex-col gap-4">
            <div className="flex justify-between items-center bg-[#13192B] border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">You</div>
                <div>
                  <div className="text-xs text-slate-400 uppercase">Score</div>
                  <div className="font-black text-xl text-white">{myScore} <span className="text-xs text-slate-500 font-normal">pts</span></div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Time Left</div>
                <div className={'text-3xl font-mono font-black ' + (timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-emerald-400')}>
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-500 font-bold mt-1">Q {qIndex + 1} / 5</div>
              </div>
              
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-xs text-slate-400 uppercase">{isBot ? 'AI Bot' : 'Rival'}</div>
                  <div className="font-black text-xl text-white">{oppScore} <span className="text-xs text-slate-500 font-normal">pts</span></div>
                </div>
                <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-500 font-bold">
                  {isBot ? <Bot size={20} /> : <Users size={20} />}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#13192B] border border-slate-800 rounded-3xl p-6 md:p-10 flex flex-col shadow-xl">
              <div className="flex-1 overflow-y-auto mb-8 custom-scrollbar">
                <div className="prose prose-invert prose-lg max-w-none">
                  <Latex>{currentQ.question_latex}</Latex>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Array.isArray(currentQ.options_json) ? currentQ.options_json : (typeof currentQ.options_json === 'string' ? JSON.parse(currentQ.options_json) : (currentQ.options || []))).map((opt: string, i: number) => (
                  <button key={i} onClick={() => handleAnswer(i)} className="bg-[#0B0F19] border-2 border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/10 p-5 rounded-2xl text-left transition-all group shadow-sm">
                    <div className="flex gap-4 items-center">
                      <span className="font-black text-xl text-slate-600 group-hover:text-indigo-400">{['A','B','C','D'][i]}</span>
                      <span className="text-white text-md font-medium"><Latex>{opt}</Latex></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'results' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg text-center">
            <h1 className="text-4xl font-black mb-8 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">MATCH OVER</h1>
            
            <div className="bg-[#13192B] border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
              
              <div className={'flex-1 z-10 ' + (myScore >= oppScore ? 'scale-110' : 'opacity-70')}>
                <div className="text-sm text-slate-400 mb-2">You</div>
                <div className={'text-5xl font-black ' + (myScore >= oppScore ? 'text-emerald-400' : 'text-white')}>{myScore}</div>
              </div>
              
              <div className="w-16 h-16 bg-[#0B0F19] rounded-full border border-slate-700 flex items-center justify-center shrink-0 z-10">
                <span className="font-black text-slate-500">VS</span>
              </div>
              
              <div className={'flex-1 z-10 ' + (oppScore > myScore ? 'scale-110' : 'opacity-70')}>
                <div className="text-sm text-slate-400 mb-2">{oppName}</div>
                <div className={'text-5xl font-black ' + (oppScore > myScore ? 'text-rose-500' : 'text-white')}>{oppScore}</div>
              </div>
            </div>

            <div className="mb-8">
              {myScore > oppScore ? (
                <div className="inline-flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-full border border-emerald-500/20 font-bold">
                  <Trophy size={20} /> VICTORY! +25 ELO
                </div>
              ) : myScore === oppScore ? (
                <div className="inline-flex items-center gap-3 bg-slate-800 text-slate-300 px-6 py-3 rounded-full border border-slate-700 font-bold">
                  DRAW. +5 ELO
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 bg-rose-500/10 text-rose-500 px-6 py-3 rounded-full border border-rose-500/20 font-bold">
                  DEFEAT. -15 ELO
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => { if(onBack) onBack() }} className="flex-1 bg-[#13192B] hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition border border-slate-700">
                Leave Arena
              </button>
              <button onClick={startSearch} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
, '$2x
              }
            }
          }
        })
        .on('broadcast', { event: 'start_match' }, (payload: any) => {
          if (payload.payload.clientId === userId || payload.payload.hostId === userId) {
            setQuestions(payload.payload.questions);
            setTimeout(() => setView('battle'), 1500);
          }
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: userId,
              user_name: userName,
              status: 'searching',
              joined_at: Date.now()
            });
          }
        });

      interval = setInterval(async () => {
        setSearchTimer(t => {
          if (t <= 1) {
            clearInterval(interval);
            // Fallback to Bot
            if (channel) {
              channel.untrack();
              supabase.removeChannel(channel);
            }
            startBotMatch();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (channel) {
        channel.untrack();
        supabase.removeChannel(channel);
      }
    };
  }, [view, userId, userName]);

  const startBotMatch = async () => {
    setOppId('ai-bot');
    setOppName('AI Scholar [Level 8]');
    setIsBot(true);
    const { data, error } = await (supabase as any).from('pyqs').select('*').limit(20);
    if (data && data.length >= 5) {
      setQuestions(data.sort(() => 0.5 - Math.random()).slice(0, 5));
      setTimeout(() => setView('battle'), 1000);
    } else {
       console.error("Supabase Sync Error:", error);
    }
  };

  const startSearch = () => {
    setSearchTimer(10);
    setView('searching');
  };

  useEffect(() => {
    let timer: any;
    if (view === 'battle' && qIndex < 5) {
      setTimeLeft(30);
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { handleNextQuestion(); return 30; }
          return t - 1;
        });
      }, 1000);
      
      if (isBot) {
        const botDelay = Math.floor(Math.random() * 5000) + 4000;
        setTimeout(() => {
          const isCorrect = Math.random() < 0.8;
          if (isCorrect) setOppScore(s => s + 4);
          else setOppScore(s => Math.max(0, s - 1));
        }, botDelay);
      }
    } else if (view === 'battle' && qIndex >= 5) {
      setView('results');
    }
    return () => clearInterval(timer);
  }, [view, qIndex, isBot]);

  const handleAnswer = (selectedIndex: number) => {
    const currentQ = questions[qIndex];
    if (selectedIndex === (currentQ.correct_option !== undefined ? currentQ.correct_option : currentQ.correct_index)) {
      setMyScore(s => s + 4);
    } else {
      setMyScore(s => Math.max(0, s - 1));
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setQIndex(prev => prev + 1);
  };

  const currentQ = questions[qIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19] text-white flex flex-col font-sans">
      <div className="p-4 flex justify-between items-center bg-[#13192B] border-b border-indigo-500/20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><Crosshair size={20} /></div>
          <div>
            <h2 className="font-bold text-lg leading-tight tracking-wide">QUICKMATCH</h2>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">1v1 PvP Arena</div>
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-white bg-[#1A2235] rounded-full transition">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4">
        {view === 'menu' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
            <div className="bg-[#13192B] border border-indigo-500/30 rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Swords size={48} className="text-indigo-500" />
              </div>
              <h1 className="text-2xl font-black mb-2">Ranked 1v1 Duel</h1>
              <p className="text-slate-400 text-sm mb-8">Test your speed and accuracy in a 5-question sprint against live players or AI Scholars.</p>
              
              <button onClick={startSearch} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2">
                <Radar size={20} /> Find Match
              </button>
            </div>
          </motion.div>
        )}

        {view === 'searching' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-ping" />
              <div className="absolute inset-4 border-2 border-indigo-500/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-8 bg-indigo-500/20 rounded-full animate-pulse" />
              <Radar size={48} className="text-indigo-400 relative z-10 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">
              {oppId ? 'Match Found!' : 'Searching for Opponent...'}
            </h2>
            <p className="text-indigo-400 font-mono text-xl mb-4">
              {oppId ? 'Connecting...' : searchTimer + 's'}
            </p>
            
            {oppId && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#13192B] border border-emerald-500/50 rounded-xl p-4 inline-flex items-center gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-lg"><Users className="text-emerald-400" /></div>
                <div className="text-left">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Opponent</div>
                  <div className="font-bold text-lg">{oppName}</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {view === 'battle' && !currentQ && (
          <div className="w-full max-w-lg text-center bg-[#13192B] border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <Loader2 size={48} className="animate-spin text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Loading Battle Data...</h3>
            <p className="text-slate-400">If this takes too long, no questions were found. Check back soon!</p>
          </div>
        )}

        {view === 'battle' && currentQ && (
          <div className="w-full max-w-4xl h-full flex flex-col gap-4">
            <div className="flex justify-between items-center bg-[#13192B] border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">You</div>
                <div>
                  <div className="text-xs text-slate-400 uppercase">Score</div>
                  <div className="font-black text-xl text-white">{myScore} <span className="text-xs text-slate-500 font-normal">pts</span></div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Time Left</div>
                <div className={'text-3xl font-mono font-black ' + (timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-emerald-400')}>
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-500 font-bold mt-1">Q {qIndex + 1} / 5</div>
              </div>
              
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-xs text-slate-400 uppercase">{isBot ? 'AI Bot' : 'Rival'}</div>
                  <div className="font-black text-xl text-white">{oppScore} <span className="text-xs text-slate-500 font-normal">pts</span></div>
                </div>
                <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-500 font-bold">
                  {isBot ? <Bot size={20} /> : <Users size={20} />}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#13192B] border border-slate-800 rounded-3xl p-6 md:p-10 flex flex-col shadow-xl">
              <div className="flex-1 overflow-y-auto mb-8 custom-scrollbar">
                <div className="prose prose-invert prose-lg max-w-none">
                  <Latex>{currentQ.question_latex}</Latex>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Array.isArray(currentQ.options_json) ? currentQ.options_json : (typeof currentQ.options_json === 'string' ? JSON.parse(currentQ.options_json) : (currentQ.options || []))).map((opt: string, i: number) => (
                  <button key={i} onClick={() => handleAnswer(i)} className="bg-[#0B0F19] border-2 border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/10 p-5 rounded-2xl text-left transition-all group shadow-sm">
                    <div className="flex gap-4 items-center">
                      <span className="font-black text-xl text-slate-600 group-hover:text-indigo-400">{['A','B','C','D'][i]}</span>
                      <span className="text-white text-md font-medium"><Latex>{opt}</Latex></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'results' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg text-center">
            <h1 className="text-4xl font-black mb-8 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">MATCH OVER</h1>
            
            <div className="bg-[#13192B] border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
              
              <div className={'flex-1 z-10 ' + (myScore >= oppScore ? 'scale-110' : 'opacity-70')}>
                <div className="text-sm text-slate-400 mb-2">You</div>
                <div className={'text-5xl font-black ' + (myScore >= oppScore ? 'text-emerald-400' : 'text-white')}>{myScore}</div>
              </div>
              
              <div className="w-16 h-16 bg-[#0B0F19] rounded-full border border-slate-700 flex items-center justify-center shrink-0 z-10">
                <span className="font-black text-slate-500">VS</span>
              </div>
              
              <div className={'flex-1 z-10 ' + (oppScore > myScore ? 'scale-110' : 'opacity-70')}>
                <div className="text-sm text-slate-400 mb-2">{oppName}</div>
                <div className={'text-5xl font-black ' + (oppScore > myScore ? 'text-rose-500' : 'text-white')}>{oppScore}</div>
              </div>
            </div>

            <div className="mb-8">
              {myScore > oppScore ? (
                <div className="inline-flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-full border border-emerald-500/20 font-bold">
                  <Trophy size={20} /> VICTORY! +25 ELO
                </div>
              ) : myScore === oppScore ? (
                <div className="inline-flex items-center gap-3 bg-slate-800 text-slate-300 px-6 py-3 rounded-full border border-slate-700 font-bold">
                  DRAW. +5 ELO
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 bg-rose-500/10 text-rose-500 px-6 py-3 rounded-full border border-rose-500/20 font-bold">
                  DEFEAT. -15 ELO
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => { if(onBack) onBack() }} className="flex-1 bg-[#13192B] hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition border border-slate-700">
                Leave Arena
              </button>
              <button onClick={startSearch} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
, '$x^2/2
              }
            }
          }
        })
        .on('broadcast', { event: 'start_match' }, (payload: any) => {
          if (payload.payload.clientId === userId || payload.payload.hostId === userId) {
            setQuestions(payload.payload.questions);
            setTimeout(() => setView('battle'), 1500);
          }
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: userId,
              user_name: userName,
              status: 'searching',
              joined_at: Date.now()
            });
          }
        });

      interval = setInterval(async () => {
        setSearchTimer(t => {
          if (t <= 1) {
            clearInterval(interval);
            // Fallback to Bot
            if (channel) {
              channel.untrack();
              supabase.removeChannel(channel);
            }
            startBotMatch();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (channel) {
        channel.untrack();
        supabase.removeChannel(channel);
      }
    };
  }, [view, userId, userName]);

  const startBotMatch = async () => {
    setOppId('ai-bot');
    setOppName('AI Scholar [Level 8]');
    setIsBot(true);
    const { data, error } = await (supabase as any).from('pyqs').select('*').limit(20);
    if (data && data.length >= 5) {
      setQuestions(data.sort(() => 0.5 - Math.random()).slice(0, 5));
      setTimeout(() => setView('battle'), 1000);
    } else {
       console.error("Supabase Sync Error:", error);
    }
  };

  const startSearch = () => {
    setSearchTimer(10);
    setView('searching');
  };

  useEffect(() => {
    let timer: any;
    if (view === 'battle' && qIndex < 5) {
      setTimeLeft(30);
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { handleNextQuestion(); return 30; }
          return t - 1;
        });
      }, 1000);
      
      if (isBot) {
        const botDelay = Math.floor(Math.random() * 5000) + 4000;
        setTimeout(() => {
          const isCorrect = Math.random() < 0.8;
          if (isCorrect) setOppScore(s => s + 4);
          else setOppScore(s => Math.max(0, s - 1));
        }, botDelay);
      }
    } else if (view === 'battle' && qIndex >= 5) {
      setView('results');
    }
    return () => clearInterval(timer);
  }, [view, qIndex, isBot]);

  const handleAnswer = (selectedIndex: number) => {
    const currentQ = questions[qIndex];
    if (selectedIndex === (currentQ.correct_option !== undefined ? currentQ.correct_option : currentQ.correct_index)) {
      setMyScore(s => s + 4);
    } else {
      setMyScore(s => Math.max(0, s - 1));
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setQIndex(prev => prev + 1);
  };

  const currentQ = questions[qIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19] text-white flex flex-col font-sans">
      <div className="p-4 flex justify-between items-center bg-[#13192B] border-b border-indigo-500/20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><Crosshair size={20} /></div>
          <div>
            <h2 className="font-bold text-lg leading-tight tracking-wide">QUICKMATCH</h2>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">1v1 PvP Arena</div>
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-white bg-[#1A2235] rounded-full transition">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4">
        {view === 'menu' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
            <div className="bg-[#13192B] border border-indigo-500/30 rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Swords size={48} className="text-indigo-500" />
              </div>
              <h1 className="text-2xl font-black mb-2">Ranked 1v1 Duel</h1>
              <p className="text-slate-400 text-sm mb-8">Test your speed and accuracy in a 5-question sprint against live players or AI Scholars.</p>
              
              <button onClick={startSearch} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2">
                <Radar size={20} /> Find Match
              </button>
            </div>
          </motion.div>
        )}

        {view === 'searching' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-ping" />
              <div className="absolute inset-4 border-2 border-indigo-500/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-8 bg-indigo-500/20 rounded-full animate-pulse" />
              <Radar size={48} className="text-indigo-400 relative z-10 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">
              {oppId ? 'Match Found!' : 'Searching for Opponent...'}
            </h2>
            <p className="text-indigo-400 font-mono text-xl mb-4">
              {oppId ? 'Connecting...' : searchTimer + 's'}
            </p>
            
            {oppId && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#13192B] border border-emerald-500/50 rounded-xl p-4 inline-flex items-center gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-lg"><Users className="text-emerald-400" /></div>
                <div className="text-left">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Opponent</div>
                  <div className="font-bold text-lg">{oppName}</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {view === 'battle' && !currentQ && (
          <div className="w-full max-w-lg text-center bg-[#13192B] border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <Loader2 size={48} className="animate-spin text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Loading Battle Data...</h3>
            <p className="text-slate-400">If this takes too long, no questions were found. Check back soon!</p>
          </div>
        )}

        {view === 'battle' && currentQ && (
          <div className="w-full max-w-4xl h-full flex flex-col gap-4">
            <div className="flex justify-between items-center bg-[#13192B] border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">You</div>
                <div>
                  <div className="text-xs text-slate-400 uppercase">Score</div>
                  <div className="font-black text-xl text-white">{myScore} <span className="text-xs text-slate-500 font-normal">pts</span></div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Time Left</div>
                <div className={'text-3xl font-mono font-black ' + (timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-emerald-400')}>
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-500 font-bold mt-1">Q {qIndex + 1} / 5</div>
              </div>
              
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-xs text-slate-400 uppercase">{isBot ? 'AI Bot' : 'Rival'}</div>
                  <div className="font-black text-xl text-white">{oppScore} <span className="text-xs text-slate-500 font-normal">pts</span></div>
                </div>
                <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-500 font-bold">
                  {isBot ? <Bot size={20} /> : <Users size={20} />}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#13192B] border border-slate-800 rounded-3xl p-6 md:p-10 flex flex-col shadow-xl">
              <div className="flex-1 overflow-y-auto mb-8 custom-scrollbar">
                <div className="prose prose-invert prose-lg max-w-none">
                  <Latex>{currentQ.question_latex}</Latex>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Array.isArray(currentQ.options_json) ? currentQ.options_json : (typeof currentQ.options_json === 'string' ? JSON.parse(currentQ.options_json) : (currentQ.options || []))).map((opt: string, i: number) => (
                  <button key={i} onClick={() => handleAnswer(i)} className="bg-[#0B0F19] border-2 border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/10 p-5 rounded-2xl text-left transition-all group shadow-sm">
                    <div className="flex gap-4 items-center">
                      <span className="font-black text-xl text-slate-600 group-hover:text-indigo-400">{['A','B','C','D'][i]}</span>
                      <span className="text-white text-md font-medium"><Latex>{opt}</Latex></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'results' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg text-center">
            <h1 className="text-4xl font-black mb-8 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">MATCH OVER</h1>
            
            <div className="bg-[#13192B] border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
              
              <div className={'flex-1 z-10 ' + (myScore >= oppScore ? 'scale-110' : 'opacity-70')}>
                <div className="text-sm text-slate-400 mb-2">You</div>
                <div className={'text-5xl font-black ' + (myScore >= oppScore ? 'text-emerald-400' : 'text-white')}>{myScore}</div>
              </div>
              
              <div className="w-16 h-16 bg-[#0B0F19] rounded-full border border-slate-700 flex items-center justify-center shrink-0 z-10">
                <span className="font-black text-slate-500">VS</span>
              </div>
              
              <div className={'flex-1 z-10 ' + (oppScore > myScore ? 'scale-110' : 'opacity-70')}>
                <div className="text-sm text-slate-400 mb-2">{oppName}</div>
                <div className={'text-5xl font-black ' + (oppScore > myScore ? 'text-rose-500' : 'text-white')}>{oppScore}</div>
              </div>
            </div>

            <div className="mb-8">
              {myScore > oppScore ? (
                <div className="inline-flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-full border border-emerald-500/20 font-bold">
                  <Trophy size={20} /> VICTORY! +25 ELO
                </div>
              ) : myScore === oppScore ? (
                <div className="inline-flex items-center gap-3 bg-slate-800 text-slate-300 px-6 py-3 rounded-full border border-slate-700 font-bold">
                  DRAW. +5 ELO
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 bg-rose-500/10 text-rose-500 px-6 py-3 rounded-full border border-rose-500/20 font-bold">
                  DEFEAT. -15 ELO
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => { if(onBack) onBack() }} className="flex-1 bg-[#13192B] hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition border border-slate-700">
                Leave Arena
              </button>
              <button onClick={startSearch} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
, '$x^3
              }
            }
          }
        })
        .on('broadcast', { event: 'start_match' }, (payload: any) => {
          if (payload.payload.clientId === userId || payload.payload.hostId === userId) {
            setQuestions(payload.payload.questions);
            setTimeout(() => setView('battle'), 1500);
          }
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: userId,
              user_name: userName,
              status: 'searching',
              joined_at: Date.now()
            });
          }
        });

      interval = setInterval(async () => {
        setSearchTimer(t => {
          if (t <= 1) {
            clearInterval(interval);
            // Fallback to Bot
            if (channel) {
              channel.untrack();
              supabase.removeChannel(channel);
            }
            startBotMatch();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (channel) {
        channel.untrack();
        supabase.removeChannel(channel);
      }
    };
  }, [view, userId, userName]);

  const startBotMatch = async () => {
    setOppId('ai-bot');
    setOppName('AI Scholar [Level 8]');
    setIsBot(true);
    const { data, error } = await (supabase as any).from('pyqs').select('*').limit(20);
    if (data && data.length >= 5) {
      setQuestions(data.sort(() => 0.5 - Math.random()).slice(0, 5));
      setTimeout(() => setView('battle'), 1000);
    } else {
       console.error("Supabase Sync Error:", error);
    }
  };

  const startSearch = () => {
    setSearchTimer(10);
    setView('searching');
  };

  useEffect(() => {
    let timer: any;
    if (view === 'battle' && qIndex < 5) {
      setTimeLeft(30);
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { handleNextQuestion(); return 30; }
          return t - 1;
        });
      }, 1000);
      
      if (isBot) {
        const botDelay = Math.floor(Math.random() * 5000) + 4000;
        setTimeout(() => {
          const isCorrect = Math.random() < 0.8;
          if (isCorrect) setOppScore(s => s + 4);
          else setOppScore(s => Math.max(0, s - 1));
        }, botDelay);
      }
    } else if (view === 'battle' && qIndex >= 5) {
      setView('results');
    }
    return () => clearInterval(timer);
  }, [view, qIndex, isBot]);

  const handleAnswer = (selectedIndex: number) => {
    const currentQ = questions[qIndex];
    if (selectedIndex === (currentQ.correct_option !== undefined ? currentQ.correct_option : currentQ.correct_index)) {
      setMyScore(s => s + 4);
    } else {
      setMyScore(s => Math.max(0, s - 1));
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setQIndex(prev => prev + 1);
  };

  const currentQ = questions[qIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19] text-white flex flex-col font-sans">
      <div className="p-4 flex justify-between items-center bg-[#13192B] border-b border-indigo-500/20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><Crosshair size={20} /></div>
          <div>
            <h2 className="font-bold text-lg leading-tight tracking-wide">QUICKMATCH</h2>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">1v1 PvP Arena</div>
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-white bg-[#1A2235] rounded-full transition">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4">
        {view === 'menu' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
            <div className="bg-[#13192B] border border-indigo-500/30 rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Swords size={48} className="text-indigo-500" />
              </div>
              <h1 className="text-2xl font-black mb-2">Ranked 1v1 Duel</h1>
              <p className="text-slate-400 text-sm mb-8">Test your speed and accuracy in a 5-question sprint against live players or AI Scholars.</p>
              
              <button onClick={startSearch} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2">
                <Radar size={20} /> Find Match
              </button>
            </div>
          </motion.div>
        )}

        {view === 'searching' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-ping" />
              <div className="absolute inset-4 border-2 border-indigo-500/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-8 bg-indigo-500/20 rounded-full animate-pulse" />
              <Radar size={48} className="text-indigo-400 relative z-10 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">
              {oppId ? 'Match Found!' : 'Searching for Opponent...'}
            </h2>
            <p className="text-indigo-400 font-mono text-xl mb-4">
              {oppId ? 'Connecting...' : searchTimer + 's'}
            </p>
            
            {oppId && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#13192B] border border-emerald-500/50 rounded-xl p-4 inline-flex items-center gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-lg"><Users className="text-emerald-400" /></div>
                <div className="text-left">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Opponent</div>
                  <div className="font-bold text-lg">{oppName}</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {view === 'battle' && !currentQ && (
          <div className="w-full max-w-lg text-center bg-[#13192B] border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <Loader2 size={48} className="animate-spin text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Loading Battle Data...</h3>
            <p className="text-slate-400">If this takes too long, no questions were found. Check back soon!</p>
          </div>
        )}

        {view === 'battle' && currentQ && (
          <div className="w-full max-w-4xl h-full flex flex-col gap-4">
            <div className="flex justify-between items-center bg-[#13192B] border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">You</div>
                <div>
                  <div className="text-xs text-slate-400 uppercase">Score</div>
                  <div className="font-black text-xl text-white">{myScore} <span className="text-xs text-slate-500 font-normal">pts</span></div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Time Left</div>
                <div className={'text-3xl font-mono font-black ' + (timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-emerald-400')}>
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-500 font-bold mt-1">Q {qIndex + 1} / 5</div>
              </div>
              
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-xs text-slate-400 uppercase">{isBot ? 'AI Bot' : 'Rival'}</div>
                  <div className="font-black text-xl text-white">{oppScore} <span className="text-xs text-slate-500 font-normal">pts</span></div>
                </div>
                <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-500 font-bold">
                  {isBot ? <Bot size={20} /> : <Users size={20} />}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#13192B] border border-slate-800 rounded-3xl p-6 md:p-10 flex flex-col shadow-xl">
              <div className="flex-1 overflow-y-auto mb-8 custom-scrollbar">
                <div className="prose prose-invert prose-lg max-w-none">
                  <Latex>{currentQ.question_latex}</Latex>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Array.isArray(currentQ.options_json) ? currentQ.options_json : (typeof currentQ.options_json === 'string' ? JSON.parse(currentQ.options_json) : (currentQ.options || []))).map((opt: string, i: number) => (
                  <button key={i} onClick={() => handleAnswer(i)} className="bg-[#0B0F19] border-2 border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/10 p-5 rounded-2xl text-left transition-all group shadow-sm">
                    <div className="flex gap-4 items-center">
                      <span className="font-black text-xl text-slate-600 group-hover:text-indigo-400">{['A','B','C','D'][i]}</span>
                      <span className="text-white text-md font-medium"><Latex>{opt}</Latex></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'results' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg text-center">
            <h1 className="text-4xl font-black mb-8 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">MATCH OVER</h1>
            
            <div className="bg-[#13192B] border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
              
              <div className={'flex-1 z-10 ' + (myScore >= oppScore ? 'scale-110' : 'opacity-70')}>
                <div className="text-sm text-slate-400 mb-2">You</div>
                <div className={'text-5xl font-black ' + (myScore >= oppScore ? 'text-emerald-400' : 'text-white')}>{myScore}</div>
              </div>
              
              <div className="w-16 h-16 bg-[#0B0F19] rounded-full border border-slate-700 flex items-center justify-center shrink-0 z-10">
                <span className="font-black text-slate-500">VS</span>
              </div>
              
              <div className={'flex-1 z-10 ' + (oppScore > myScore ? 'scale-110' : 'opacity-70')}>
                <div className="text-sm text-slate-400 mb-2">{oppName}</div>
                <div className={'text-5xl font-black ' + (oppScore > myScore ? 'text-rose-500' : 'text-white')}>{oppScore}</div>
              </div>
            </div>

            <div className="mb-8">
              {myScore > oppScore ? (
                <div className="inline-flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-full border border-emerald-500/20 font-bold">
                  <Trophy size={20} /> VICTORY! +25 ELO
                </div>
              ) : myScore === oppScore ? (
                <div className="inline-flex items-center gap-3 bg-slate-800 text-slate-300 px-6 py-3 rounded-full border border-slate-700 font-bold">
                  DRAW. +5 ELO
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 bg-rose-500/10 text-rose-500 px-6 py-3 rounded-full border border-rose-500/20 font-bold">
                  DEFEAT. -15 ELO
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => { if(onBack) onBack() }} className="flex-1 bg-[#13192B] hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition border border-slate-700">
                Leave Arena
              </button>
              <button onClick={startSearch} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
], correct_option: 0, subject: 'Math' },
  { id: '4', question_latex: 'Chemical formula for water?', options_json: ['HO', 'H2O2', 'H2O', 'OH'], correct_option: 2, subject: 'Chemistry' },
  { id: '5', question_latex: 'Which planet is known as the Red Planet?', options_json: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correct_option: 1, subject: 'Physics' }
];
                  channel.send({
                    type: 'broadcast',
                    event: 'start_match',
                    payload: { questions: selected, hostId: host.user_id, clientId: client.user_id }
                  });
                  setQuestions(selected);
                  setTimeout(() => setView('battle'), 1500);
                }
              }
            }
          }
        })
        .on('broadcast', { event: 'start_match' }, (payload: any) => {
          if (payload.payload.clientId === userId || payload.payload.hostId === userId) {
            setQuestions(payload.payload.questions);
            setTimeout(() => setView('battle'), 1500);
          }
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: userId,
              user_name: userName,
              status: 'searching',
              joined_at: Date.now()
            });
          }
        });

      interval = setInterval(async () => {
        setSearchTimer(t => {
          if (t <= 1) {
            clearInterval(interval);
            // Fallback to Bot
            if (channel) {
              channel.untrack();
              supabase.removeChannel(channel);
            }
            startBotMatch();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (channel) {
        channel.untrack();
        supabase.removeChannel(channel);
      }
    };
  }, [view, userId, userName]);

  const startBotMatch = async () => {
    setOppId('ai-bot');
    setOppName('AI Scholar [Level 8]');
    setIsBot(true);
    const { data, error } = await (supabase as any).from('pyqs').select('*').limit(20);
    if (data && data.length >= 5) {
      setQuestions(data.sort(() => 0.5 - Math.random()).slice(0, 5));
      setTimeout(() => setView('battle'), 1000);
    } else {
       console.error("Supabase Sync Error:", error);
    }
  };

  const startSearch = () => {
    setSearchTimer(10);
    setView('searching');
  };

  useEffect(() => {
    let timer: any;
    if (view === 'battle' && qIndex < 5) {
      setTimeLeft(30);
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { handleNextQuestion(); return 30; }
          return t - 1;
        });
      }, 1000);
      
      if (isBot) {
        const botDelay = Math.floor(Math.random() * 5000) + 4000;
        setTimeout(() => {
          const isCorrect = Math.random() < 0.8;
          if (isCorrect) setOppScore(s => s + 4);
          else setOppScore(s => Math.max(0, s - 1));
        }, botDelay);
      }
    } else if (view === 'battle' && qIndex >= 5) {
      setView('results');
    }
    return () => clearInterval(timer);
  }, [view, qIndex, isBot]);

  const handleAnswer = (selectedIndex: number) => {
    const currentQ = questions[qIndex];
    if (selectedIndex === (currentQ.correct_option !== undefined ? currentQ.correct_option : currentQ.correct_index)) {
      setMyScore(s => s + 4);
    } else {
      setMyScore(s => Math.max(0, s - 1));
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setQIndex(prev => prev + 1);
  };

  const currentQ = questions[qIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19] text-white flex flex-col font-sans">
      <div className="p-4 flex justify-between items-center bg-[#13192B] border-b border-indigo-500/20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><Crosshair size={20} /></div>
          <div>
            <h2 className="font-bold text-lg leading-tight tracking-wide">QUICKMATCH</h2>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">1v1 PvP Arena</div>
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-white bg-[#1A2235] rounded-full transition">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4">
        {view === 'menu' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
            <div className="bg-[#13192B] border border-indigo-500/30 rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Swords size={48} className="text-indigo-500" />
              </div>
              <h1 className="text-2xl font-black mb-2">Ranked 1v1 Duel</h1>
              <p className="text-slate-400 text-sm mb-8">Test your speed and accuracy in a 5-question sprint against live players or AI Scholars.</p>
              
              <button onClick={startSearch} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2">
                <Radar size={20} /> Find Match
              </button>
            </div>
          </motion.div>
        )}

        {view === 'searching' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-ping" />
              <div className="absolute inset-4 border-2 border-indigo-500/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-8 bg-indigo-500/20 rounded-full animate-pulse" />
              <Radar size={48} className="text-indigo-400 relative z-10 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">
              {oppId ? 'Match Found!' : 'Searching for Opponent...'}
            </h2>
            <p className="text-indigo-400 font-mono text-xl mb-4">
              {oppId ? 'Connecting...' : searchTimer + 's'}
            </p>
            
            {oppId && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#13192B] border border-emerald-500/50 rounded-xl p-4 inline-flex items-center gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-lg"><Users className="text-emerald-400" /></div>
                <div className="text-left">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Opponent</div>
                  <div className="font-bold text-lg">{oppName}</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {view === 'battle' && !currentQ && (
          <div className="w-full max-w-lg text-center bg-[#13192B] border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <Loader2 size={48} className="animate-spin text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Loading Battle Data...</h3>
            <p className="text-slate-400">If this takes too long, no questions were found. Check back soon!</p>
          </div>
        )}

        {view === 'battle' && currentQ && (
          <div className="w-full max-w-4xl h-full flex flex-col gap-4">
            <div className="flex justify-between items-center bg-[#13192B] border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">You</div>
                <div>
                  <div className="text-xs text-slate-400 uppercase">Score</div>
                  <div className="font-black text-xl text-white">{myScore} <span className="text-xs text-slate-500 font-normal">pts</span></div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Time Left</div>
                <div className={'text-3xl font-mono font-black ' + (timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-emerald-400')}>
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-500 font-bold mt-1">Q {qIndex + 1} / 5</div>
              </div>
              
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-xs text-slate-400 uppercase">{isBot ? 'AI Bot' : 'Rival'}</div>
                  <div className="font-black text-xl text-white">{oppScore} <span className="text-xs text-slate-500 font-normal">pts</span></div>
                </div>
                <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-500 font-bold">
                  {isBot ? <Bot size={20} /> : <Users size={20} />}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#13192B] border border-slate-800 rounded-3xl p-6 md:p-10 flex flex-col shadow-xl">
              <div className="flex-1 overflow-y-auto mb-8 custom-scrollbar">
                <div className="prose prose-invert prose-lg max-w-none">
                  <Latex>{currentQ.question_latex}</Latex>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Array.isArray(currentQ.options_json) ? currentQ.options_json : (typeof currentQ.options_json === 'string' ? JSON.parse(currentQ.options_json) : (currentQ.options || []))).map((opt: string, i: number) => (
                  <button key={i} onClick={() => handleAnswer(i)} className="bg-[#0B0F19] border-2 border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/10 p-5 rounded-2xl text-left transition-all group shadow-sm">
                    <div className="flex gap-4 items-center">
                      <span className="font-black text-xl text-slate-600 group-hover:text-indigo-400">{['A','B','C','D'][i]}</span>
                      <span className="text-white text-md font-medium"><Latex>{opt}</Latex></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'results' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg text-center">
            <h1 className="text-4xl font-black mb-8 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">MATCH OVER</h1>
            
            <div className="bg-[#13192B] border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
              
              <div className={'flex-1 z-10 ' + (myScore >= oppScore ? 'scale-110' : 'opacity-70')}>
                <div className="text-sm text-slate-400 mb-2">You</div>
                <div className={'text-5xl font-black ' + (myScore >= oppScore ? 'text-emerald-400' : 'text-white')}>{myScore}</div>
              </div>
              
              <div className="w-16 h-16 bg-[#0B0F19] rounded-full border border-slate-700 flex items-center justify-center shrink-0 z-10">
                <span className="font-black text-slate-500">VS</span>
              </div>
              
              <div className={'flex-1 z-10 ' + (oppScore > myScore ? 'scale-110' : 'opacity-70')}>
                <div className="text-sm text-slate-400 mb-2">{oppName}</div>
                <div className={'text-5xl font-black ' + (oppScore > myScore ? 'text-rose-500' : 'text-white')}>{oppScore}</div>
              </div>
            </div>

            <div className="mb-8">
              {myScore > oppScore ? (
                <div className="inline-flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-full border border-emerald-500/20 font-bold">
                  <Trophy size={20} /> VICTORY! +25 ELO
                </div>
              ) : myScore === oppScore ? (
                <div className="inline-flex items-center gap-3 bg-slate-800 text-slate-300 px-6 py-3 rounded-full border border-slate-700 font-bold">
                  DRAW. +5 ELO
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 bg-rose-500/10 text-rose-500 px-6 py-3 rounded-full border border-rose-500/20 font-bold">
                  DEFEAT. -15 ELO
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => { if(onBack) onBack() }} className="flex-1 bg-[#13192B] hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition border border-slate-700">
                Leave Arena
              </button>
              <button onClick={startSearch} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
