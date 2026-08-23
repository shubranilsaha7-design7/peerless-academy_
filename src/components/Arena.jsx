import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  BrainCircuit, Crosshair, Flame, MessageCircle,
  Radio, Share2, Swords, Trophy, X, Zap,
} from 'lucide-react';
import { fetchQuestions } from '../services/questionEngine';
import { useAIGhost } from '../hooks/useAIGhost';
import AIDoubtSolver from './AIDoubtSolver';

// ── Constants ────────────────────────────────────────────────────
const TOTAL_ROUNDS     = 10;
const QUESTION_TIME_MS = 15000;
const MATCH_SEEK_MS    = 4000;
const POINTS_CORRECT   = 10;
const GHOST_NAME       = 'Ghost Engine v2.4';

// ── Helpers ──────────────────────────────────────────────────────
const optionLabel = (i) => String.fromCharCode(65 + i);

function fireConfetti() {
  confetti({ particleCount: 180, spread: 120, origin: { y: 0.55 }, colors: ['#06b6d4', '#a855f7', '#f97316', '#10b981'] });
  setTimeout(() => confetti({ particleCount: 80, spread: 70, origin: { y: 0.4, x: 0.2 } }), 300);
  setTimeout(() => confetti({ particleCount: 80, spread: 70, origin: { y: 0.4, x: 0.8 } }), 500);
}

// ── Sub-components ────────────────────────────────────────────────
function PlayerCard({ name, score, avatar, status, isGhost, maxScore }) {
  const pct = Math.min((score / Math.max(maxScore, 1)) * 100, 100);
  return (
    <div className={`flex flex-col items-center gap-2 rounded-2xl border p-4 min-w-[130px]
      ${isGhost
        ? 'border-purple-500/30 bg-purple-500/5'
        : 'border-cyan-500/30 bg-cyan-500/5'}`}
    >
      <div className={`relative flex h-14 w-14 items-center justify-center rounded-full text-2xl
        ${isGhost ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-cyan-500/20 border border-cyan-500/30'}`}
      >
        {avatar}
        {status === 'thinking' && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-amber-400 border-2 border-slate-950"
          />
        )}
        {status === 'answered' && (
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-slate-950" />
        )}
      </div>
      <p className="text-xs font-black text-white text-center leading-tight truncate max-w-[120px]">{name}</p>
      <p className={`text-xl font-black ${isGhost ? 'text-purple-300' : 'text-cyan-300'}`}>{score}</p>
      {/* Health bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className={`h-full rounded-full ${isGhost ? 'bg-purple-500' : 'bg-cyan-500'}`}
        />
      </div>
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{score} pts</p>
    </div>
  );
}

function TimerBar({ timeLeft, totalTime }) {
  const pct = (timeLeft / (totalTime / 1000)) * 100;
  const color = pct > 50 ? '#06b6d4' : pct > 25 ? '#f97316' : '#ef4444';
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
      <motion.div
        animate={{ width: `${pct}%`, backgroundColor: color }}
        transition={{ duration: 0.5 }}
        className="h-full rounded-full shadow-[0_0_8px_currentColor]"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// ── MAIN ARENA COMPONENT ──────────────────────────────────────────
export default function Arena({ isOpen, onClose, user, subject, classLevel, examType }) {
  // phases: searching | matched | countdown | playing | round_result | finished
  const [phase,          setPhase]         = useState('searching');
  const [questions,      setQuestions]     = useState([]);
  const [currentIdx,     setCurrentIdx]    = useState(0);
  const [playerScore,    setPlayerScore]   = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft,       setTimeLeft]      = useState(QUESTION_TIME_MS / 1000);
  const [countdown,      setCountdown]     = useState(3);
  const [roundResult,    setRoundResult]   = useState(null); 
  const [matchResult,    setMatchResult]   = useState(null); 
  const [doubtOpen,      setDoubtOpen]     = useState(false);
  const [loadError,      setLoadError]     = useState(null);
  
  // Opponent state
  const [opponent,       setOpponent]      = useState(null); // { isGhost: boolean, name: string, score: number, status: string, answer: number | null }
  
  const timerRef       = useRef(null);
  const roundLockRef   = useRef(false);
  const channelRef     = useRef(null);

  const { ghostAnswer, ghostStatus, ghostScore, startThinking, resetRound, resetMatch } = useAIGhost({ difficulty: 'medium' });

  const currentQ = questions[currentIdx] || null;
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You';
  const maxScore = TOTAL_ROUNDS * POINTS_CORRECT;

  // ── Load questions on open ──────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setPhase('searching');
    setPlayerScore(0);
    setCurrentIdx(0);
    setSelectedOption(null);
    setRoundResult(null);
    setMatchResult(null);
    setLoadError(null);
    setOpponent(null);
    resetMatch();

    fetchQuestions({ subject, classLevel, examType, count: TOTAL_ROUNDS })
      .then(qs => setQuestions(qs))
      .catch(() => setLoadError('Failed to load questions. Using offline mode.'));
      
    // Cleanup channel on close
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [isOpen, subject, classLevel, examType, resetMatch]);

  // ── Live Matchmaker via Supabase Presence ─────────────────────
  useEffect(() => {
    if (phase !== 'searching' || questions.length === 0 || !user) return;
    
    let matched = false;
    
    // Connect to global arena lobby
    const channel = supabase.channel('arena_lobby', {
      config: { presence: { key: user.id } }
    });
    
    channelRef.current = channel;

    channel.on('presence', { event: 'sync' }, () => {
      if (matched) return;
      const state = channel.presenceState();
      // Find another user looking for a match
      for (const id in state) {
        if (id !== user.id) {
          const otherPlayer = state[id][0];
          if (otherPlayer && otherPlayer.status === 'searching') {
            matched = true;
            setOpponent({
              isGhost: false,
              name: otherPlayer.name || 'Human Challenger',
              score: 0,
              status: 'idle',
              answer: null
            });
            setPhase('matched');
            break;
          }
        }
      }
    }).subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ 
          name: displayName, 
          status: 'searching', 
          subject, classLevel 
        });
      }
    });

    // 4-second timeout to fallback to AI Ghost
    const t = setTimeout(() => {
      if (!matched) {
        matched = true;
        setOpponent({
          isGhost: true,
          name: GHOST_NAME,
          score: 0,
          status: 'idle',
          answer: null
        });
        setPhase('matched');
        if (channelRef.current) supabase.removeChannel(channelRef.current);
      }
    }, MATCH_SEEK_MS);

    return () => {
      clearTimeout(t);
      if (channelRef.current && phase === 'searching') {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [phase, questions, user, displayName, subject, classLevel]);

  // ── matched → countdown ──────────────────────────────────────
  useEffect(() => {
    if (phase !== 'matched') return;
    const t = setTimeout(() => { setPhase('countdown'); setCountdown(3); }, 1200);
    return () => clearTimeout(t);
  }, [phase]);

  // ── countdown 3-2-1 → playing ────────────────────────────────
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown === 0) { setPhase('playing'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // ── Question timer ────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing' || !currentQ) return;
    roundLockRef.current = false;
    setTimeLeft(QUESTION_TIME_MS / 1000);
    setSelectedOption(null);

    // Start AI Ghost thinking
    startThinking(currentQ.correct_option_index, currentQ.options.length, QUESTION_TIME_MS);

    // Tick every second
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, currentIdx, currentQ, startThinking]);

  // ── Resolve round when time runs out or both answered ────────
  const resolveRound = useCallback((userSel, ghostSel) => {
    if (roundLockRef.current) return;
    roundLockRef.current = true;
    clearInterval(timerRef.current);

    const correct     = currentQ?.correct_option_index;
    const playerRight = userSel === correct;
    const ghostRight  = ghostSel  === correct;

    if (playerRight) setPlayerScore(p => p + POINTS_CORRECT);

    setRoundResult({ playerCorrect: playerRight, ghostCorrect: ghostRight, correctIndex: correct });
    setPhase('round_result');

    setTimeout(() => {
      if (currentIdx + 1 >= TOTAL_ROUNDS) {
        setPhase('finished');
      } else {
        setCurrentIdx(i => i + 1);
        resetRound();
        setPhase('playing');
        setRoundResult(null);
      }
    }, 2000);
  }, [currentQ, currentIdx, resetRound]);

  // Time-up trigger
  useEffect(() => {
    if (phase === 'playing' && timeLeft === 0 && !roundLockRef.current) {
      resolveRound(selectedOption, ghostAnswer);
    }
  }, [timeLeft, phase, resolveRound, selectedOption, ghostAnswer]);

  // Ghost answered trigger
  useEffect(() => {
    if (phase === 'playing' && ghostStatus === 'answered' && selectedOption !== null) {
      resolveRound(selectedOption, ghostAnswer);
    }
  }, [ghostStatus, selectedOption, phase, resolveRound, ghostAnswer]);

  // Handle player option click
  const handleOptionClick = useCallback((idx) => {
    if (selectedOption !== null || phase !== 'playing') return;
    setSelectedOption(idx);
    clearInterval(timerRef.current);
    // If ghost already answered → resolve immediately
    if (ghostStatus === 'answered') {
      resolveRound(idx, ghostAnswer);
    }
    // Otherwise wait for ghost or timer
  }, [selectedOption, phase, ghostStatus, ghostAnswer, resolveRound]);

  // ── Compute final result ───────────────────────────────────
  useEffect(() => {
    if (phase !== 'finished') return;
    const finalGhostScore = ghostScore;
    const finalPlayerScore = playerScore + (roundResult?.playerCorrect ? 0 : 0); // already tallied

    if (playerScore > finalGhostScore)       setMatchResult('win');
    else if (playerScore < finalGhostScore)  setMatchResult('lose');
    else                                      setMatchResult('draw');

    if (playerScore >= finalGhostScore) fireConfetti();
  }, [phase, playerScore, ghostScore, roundResult]);

  // ── WhatsApp Score Share ───────────────────────────────────
  const shareScore = () => {
    const acc = Math.round((playerScore / maxScore) * 100);
    const text = encodeURIComponent(
      `🏆 *Peerless Academy Arena Result*\n\n` +
      `I just battled ${GHOST_NAME} and ${matchResult === 'win' ? 'WON! 🥇' : matchResult === 'draw' ? 'drew! 🤝' : 'lost! 💪'}\n\n` +
      `📊 My Score: ${playerScore}/${maxScore}\n` +
      `🎯 Accuracy: ${acc}%\n` +
      `⚡ XP Earned: +${playerScore}\n\n` +
      `Join Peerless Academy and battle me! 👇\n${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!isOpen) return null;

  // ── RENDER ────────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        key="arena-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          className="relative w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl"
        >
          {/* Glow accents */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px]" />

          {/* Close */}
          <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition">
            <X size={18} />
          </button>

          {/* ── SEARCHING PHASE ── */}
          {phase === 'searching' && (
            <div className="flex flex-col items-center justify-center gap-6 px-8 py-16">
              <div className="relative flex h-28 w-28 items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 rounded-full border-2 border-cyan-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0.05, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                  className="absolute inset-0 rounded-full border border-cyan-400/40"
                />
                <Crosshair size={44} className="text-cyan-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-white">Scanning Arena</p>
                <p className="text-sm text-slate-400 mt-1">Finding an opponent… <span className="text-cyan-400">AI Ghost spawning in {MATCH_SEEK_MS / 1000}s</span></p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400">
                <Radio size={13} className="animate-pulse" />
                {loadError ? <span className="text-amber-400">{loadError}</span> : 'Questions ready — awaiting match'}
              </div>
            </div>
          )}

          {/* ── MATCHED PHASE ── */}
          {phase === 'matched' && (
            <div className="flex flex-col items-center justify-center gap-6 px-8 py-14">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                className="text-4xl font-black text-white">⚔️ Match Found!</motion.div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-500/30 text-2xl">
                    {user?.user_metadata?.avatar_url
                      ? <img src={user.user_metadata.avatar_url} className="h-full w-full rounded-full object-cover" />
                      : '🧑‍🎓'}
                  </div>
                  <p className="text-xs font-black text-cyan-300">{displayName}</p>
                </div>
                <Swords size={28} className="text-orange-400" />
                <div className="flex flex-col items-center gap-2">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl border
                    ${opponent?.isGhost ? 'bg-purple-500/20 border-purple-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
                    {opponent?.isGhost ? '👻' : '👤'}
                  </div>
                  <p className={`text-xs font-black ${opponent?.isGhost ? 'text-purple-300' : 'text-emerald-300'}`}>
                    {opponent?.name || GHOST_NAME}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── COUNTDOWN PHASE ── */}
          {phase === 'countdown' && (
            <div className="flex flex-col items-center justify-center gap-4 px-8 py-16">
              <p className="text-sm font-bold uppercase tracking-[.2em] text-slate-400">Get Ready…</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-[8rem] font-black leading-none text-cyan-400"
                  style={{ textShadow: '0 0 40px rgba(6,182,212,.6)' }}
                >
                  {countdown === 0 ? 'GO!' : countdown}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* ── PLAYING & ROUND RESULT PHASES ── */}
          {(phase === 'playing' || phase === 'round_result') && currentQ && (
            <div className="flex flex-col gap-0">
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
                <div className="flex items-center gap-2 text-xs font-black text-slate-400">
                  <Swords size={13} className="text-orange-400" />
                  ARENA · Round {currentIdx + 1}/{TOTAL_ROUNDS}
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={13} className="text-amber-400" />
                  <span className="text-xs font-black text-amber-400">{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {currentQ.subject} · {currentQ.difficulty}
                </div>
              </div>

              {/* Timer bar */}
              <div className="px-5 py-2">
                <TimerBar timeLeft={timeLeft} totalTime={QUESTION_TIME_MS} />
              </div>

              {/* Player cards */}
              <div className="flex items-start justify-between gap-3 px-5 pb-2">
                <PlayerCard
                  name={displayName}
                  score={playerScore}
                  avatar={user?.user_metadata?.avatar_url
                    ? <img src={user.user_metadata.avatar_url} className="h-full w-full rounded-full object-cover" />
                    : '🧑‍🎓'}
                  status={selectedOption !== null ? 'answered' : 'thinking'}
                  isGhost={false}
                  maxScore={maxScore}
                />

                <div className="flex flex-col items-center justify-center gap-1 pt-4">
                  <Swords size={20} className="text-orange-400/60" />
                  {phase === 'round_result' && (
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className={`text-[10px] font-black px-2 py-1 rounded-full
                        ${roundResult?.playerCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}
                    >
                      {roundResult?.playerCorrect ? '+10 XP' : 'Miss!'}
                    </motion.div>
                  )}
                </div>

                <PlayerCard
                  name={opponent?.name || GHOST_NAME}
                  score={ghostScore}
                  avatar={opponent?.isGhost ? '👻' : '👤'}
                  status={ghostStatus}
                  isGhost={opponent?.isGhost ?? true}
                  maxScore={maxScore}
                />
              </div>

              {/* Question */}
              <div className="px-5 py-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5"
                  >
                    <p className="text-sm leading-6 font-semibold text-white">{currentQ.question_text}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3 px-5 pb-3">
                {currentQ.options.map((opt, i) => {
                  const isSelected  = selectedOption === i;
                  const isCorrect   = i === currentQ.correct_option_index;
                  const isGhostPick = phase === 'round_result' && ghostAnswer === i;
                  const revealed    = phase === 'round_result';

                  let cls = 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-cyan-500/50';
                  if (revealed) {
                    if (isCorrect)                cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-200';
                    else if (isSelected && !isCorrect) cls = 'border-red-500 bg-red-500/10 text-red-200';
                    else                          cls = 'border-slate-700 bg-slate-800/20 text-slate-500';
                  } else if (isSelected) {
                    cls = 'border-cyan-400 bg-cyan-400/10 text-cyan-200';
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={!revealed && selectedOption === null ? { scale: 1.02 } : {}}
                      whileTap={!revealed && selectedOption === null ? { scale: 0.98 } : {}}
                      onClick={() => handleOptionClick(i)}
                      disabled={selectedOption !== null || revealed}
                      className={`relative flex items-start gap-3 rounded-xl border p-3 text-left text-xs font-semibold transition ${cls}`}
                    >
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-slate-700/60 text-[10px] font-black">
                        {optionLabel(i)}
                      </span>
                      <span className="leading-5">{opt}</span>
                      {isGhostPick && (
                        <span className={`absolute right-2 top-2 text-[9px] font-black ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                          {opponent?.isGhost ? '👻' : '👤'}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Ghost status + Doubt button */}
              <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <span className={opponent?.isGhost ? 'text-purple-400' : 'text-emerald-400'}>{opponent?.isGhost ? '👻' : '👤'}</span>
                  {ghostStatus === 'thinking' ? (
                    <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-amber-400">
                      Opponent is thinking…
                    </motion.span>
                  ) : ghostStatus === 'answered' ? (
                    <span className="text-emerald-400">Opponent answered ✓</span>
                  ) : 'Waiting…'}
                </div>
                <button
                  onClick={() => setDoubtOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-3 py-1.5 text-[10px] font-black text-cyan-400 hover:bg-cyan-500/10 transition"
                >
                  <BrainCircuit size={12} /> AI Doubt Solver
                </button>
              </div>
            </div>
          )}

          {/* ── FINISHED PHASE ── */}
          {phase === 'finished' && (
            <div className="flex flex-col items-center gap-6 px-8 py-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                className="text-6xl">
                {matchResult === 'win' ? '🏆' : matchResult === 'draw' ? '🤝' : '💪'}
              </motion.div>

              <div>
                <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className={`text-3xl font-black ${matchResult === 'win' ? 'text-amber-400' : matchResult === 'draw' ? 'text-cyan-400' : 'text-slate-300'}`}
                >
                  {matchResult === 'win' ? 'Victory!' : matchResult === 'draw' ? 'Draw!' : 'Good Fight!'}
                </motion.h2>
                <p className="mt-1 text-sm text-slate-400">
                  {matchResult === 'win' ? `You defeated ${opponent?.name || GHOST_NAME}` : matchResult === 'draw' ? 'Perfectly matched!' : `${opponent?.name || GHOST_NAME} wins this round`}
                </p>
              </div>

              {/* Score comparison */}
              <div className="flex w-full items-center justify-around rounded-2xl border border-slate-700 bg-slate-800/50 py-5">
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-cyan-400">{displayName}</p>
                  <p className="text-4xl font-black text-white">{playerScore}</p>
                  <p className="text-[10px] text-slate-500">/ {maxScore} pts</p>
                </div>
                <Swords size={22} className="text-slate-600" />
                <div className="flex flex-col items-center gap-1">
                  <p className={`text-[10px] font-black uppercase tracking-wider ${opponent?.isGhost ? 'text-purple-400' : 'text-emerald-400'}`}>{opponent?.name || GHOST_NAME}</p>
                  <p className="text-4xl font-black text-white">{ghostScore}</p>
                  <p className="text-[10px] text-slate-500">/ {maxScore} pts</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 w-full">
                {[
                  { label: 'Accuracy', value: `${Math.round((playerScore / maxScore) * 100)}%`, icon: Trophy },
                  { label: 'XP Earned', value: `+${playerScore}`, icon: Zap },
                  { label: 'Rounds', value: `${TOTAL_ROUNDS}`, icon: Flame },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/40 py-3">
                    <Icon size={14} className="text-orange-400" />
                    <p className="text-lg font-black text-white">{value}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex w-full flex-col gap-3">
                <button
                  onClick={shareScore}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-black text-white transition hover:bg-[#1dba58] active:scale-95"
                >
                  <Share2 size={16} />
                  Share Score on WhatsApp
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setPhase('searching');
                      setPlayerScore(0);
                      setCurrentIdx(0);
                      setSelectedOption(null);
                      setRoundResult(null);
                      setMatchResult(null);
                      resetMatch();
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/5 py-3 text-sm font-black text-cyan-400 hover:bg-cyan-500/10 transition"
                  >
                    <Swords size={14} /> Play Again
                  </button>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm font-black text-slate-400 hover:bg-slate-800 transition"
                  >
                    <X size={14} /> Exit Arena
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* AI Doubt Solver slide-over */}
        <AIDoubtSolver
          isOpen={doubtOpen}
          onClose={() => setDoubtOpen(false)}
          question={currentQ}
          userAnswer={selectedOption}
        />
      </motion.div>
    </AnimatePresence>
  );
}
