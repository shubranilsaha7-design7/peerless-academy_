import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  Check,
  Clock,
  Flame,
  Layers3,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  Trophy,
  X,
} from 'lucide-react';
import MockExam from '@/components/MockExam';
import { classes, pickQuestions, subjects, type Question, type Subject } from '@/data/questions';
import { addProfileXp, saveTestSubmission } from '@/lib/backend';

/* ---------- local persistence (works offline) ---------- */
function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

type ExamResult = {
  score: number;
  correct: number;
  wrong: number;
  skipped: number;
  perQuestionSeconds: number[];
  at: string;
};

/* ---------- Target countdown ---------- */
const TARGETS = [
  { label: 'NEET UG 2027', date: '2027-05-02T14:00:00+05:30' },
  { label: 'JEE Main 2027 (Session 1)', date: '2027-01-22T09:00:00+05:30' },
];

function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {TARGETS.map((t) => {
        const diff = Math.max(0, new Date(t.date).getTime() - now);
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        return (
          <div key={t.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-coral">
              <Target size={12} /> {t.label}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              {[
                ['Days', d],
                ['Hrs', h],
                ['Min', m],
                ['Sec', s],
              ].map(([label, v]) => (
                <div key={label as string} className="rounded-xl bg-slate-950/60 py-3">
                  <div className="text-xl font-black text-white">{String(v).padStart(2, '0')}</div>
                  <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- DPP generator ---------- */
function DppGenerator({ onWrong, onXp }: { onWrong: (q: Question) => void; onXp: (n: number) => void }) {
  const [klass, setKlass] = useState<string | number>('11');
  const [subject, setSubject] = useState<Subject>('Physics');
  const [set, setSet] = useState<Question[]>(() => pickQuestions('11', 'Physics'));
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [reveal, setReveal] = useState<Question | null>(null);
  const [cached, setCached] = useLocal<string[]>('pa-cached-dpp', []);

  const generate = () => {
    setSet(pickQuestions(klass, subject));
    setPicked({});
  };

  const choose = (q: Question, i: number) => {
    if (picked[q.id] !== undefined) return;
    setPicked((p) => ({ ...p, [q.id]: i }));
    if (i === q.answer) onXp(10);
    else onWrong(q);
    setReveal(q);
  };

  const cacheSheet = () => {
    const tag = `Class ${klass} · ${subject} · ${new Date().toLocaleDateString()}`;
    setCached((c) => (c.includes(tag) ? c : [tag, ...c].slice(0, 6)));
  };

  const shareOnWhatsApp = () => {
    const header = `*Peerless Academy · Daily Practice Problems*\nClass ${klass} · ${subject} · ${new Date().toLocaleDateString()}\n`;
    const body = set
      .map((q, i) => {
        const opts = q.options.map((o, j) => `${String.fromCharCode(65 + j)}) ${o}`).join('\n');
        return `\nQ${i + 1}. ${q.question}\n${opts}`;
      })
      .join('\n');
    const answers = `\n\n*Answer key:* ${set
      .map((q, i) => `${i + 1}-${String.fromCharCode(65 + q.answer)}`)
      .join(', ')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(header + body + answers)}`, '_blank');
  };


  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          Class
          <select value={klass} onChange={(e) => setKlass(e.target.value)} className="mt-2 block rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm font-bold text-white outline-none focus:border-coral">
            {classes.map((c) => (
              <option key={c} value={c}>{String(c).match(/^[0-9]+$/) ? `Class ${c}` : c}</option>
            ))}
          </select>
        </label>
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          Subject
          <select value={subject} onChange={(e) => setSubject(e.target.value as Subject)} className="mt-2 block rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm font-bold text-white outline-none focus:border-coral">
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <button onClick={generate} className="rounded-xl bg-coral px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-white transition hover:brightness-110">
          Generate DPP
        </button>
        <button onClick={cacheSheet} className="rounded-xl border border-slate-700 px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-slate-300 hover:text-white">
          Save offline
        </button>
        <button onClick={shareOnWhatsApp} className="rounded-xl border border-emerald-600/60 bg-emerald-500/10 px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">
          Send on WhatsApp
        </button>
      </div>

      {cached.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {cached.map((c) => (
            <span key={c} className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-[10px] font-bold text-slate-400">
              Offline · {c}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {set.map((q, idx) => (
          <article key={q.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500">
              <span>Q{idx + 1} · Class {q.klass}</span>
              <span className="text-coral">{q.topic}</span>
            </div>
            <p className="mt-3 text-sm font-bold leading-6 text-white">{q.question}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, i) => {
                const chosen = picked[q.id];
                const done = chosen !== undefined;
                const isRight = i === q.answer;
                return (
                  <button
                    key={opt}
                    onClick={() => choose(q, i)}
                    className={`rounded-xl border px-4 py-3 text-left text-xs transition ${
                      done && isRight
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : done && chosen === i
                          ? 'border-red-500 bg-red-500/10 text-red-300'
                          : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <b className="mr-2">{String.fromCharCode(65 + i)}.</b>
                    {opt}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <AnimatePresence>
        {reveal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
            <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-[1.5rem] border border-slate-800 bg-slate-900/95 p-6">
              <div className="flex items-start justify-between">
                <div className={`text-xs font-black uppercase tracking-wider ${picked[reveal.id] === reveal.answer ? 'text-emerald-400' : 'text-red-400'}`}>
                  {picked[reveal.id] === reveal.answer ? 'Correct · +10 XP' : 'Incorrect · added to Mistake Vault'}
                </div>
                <button onClick={() => setReveal(null)} aria-label="Close solution" className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="mt-4 text-sm font-bold text-white">Answer: {reveal.options[reveal.answer]}</div>
              <p className="mt-3 text-xs leading-6 text-slate-400">{reveal.solution}</p>
              <button onClick={() => setReveal(null)} className="mt-6 w-full rounded-xl bg-coral py-3 text-[11px] font-black uppercase tracking-wider text-white">Continue</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Pomodoro ---------- */
function Pomodoro({ onSession }: { onSession: (minutes: number) => void }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          onSession(25);
          return 25 * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const pct = 1 - seconds / (25 * 60);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-coral"><Timer size={12} /> Focus Pomodoro</div>
      <div className="mt-5 text-5xl font-black tabular-nums text-white">
        {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-coral transition-all" style={{ width: `${pct * 100}%` }} />
      </div>
      <div className="mt-5 flex gap-2">
        <button onClick={() => setRunning((r) => !r)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-coral py-3 text-[11px] font-black uppercase tracking-wider text-white">
          {running ? <Pause size={13} /> : <Play size={13} />} {running ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => { setRunning(false); setSeconds(25 * 60); }} aria-label="Reset timer" className="rounded-xl border border-slate-700 px-4 text-slate-300 hover:text-white">
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}

/* ---------- main hub ---------- */
const TABS = [
  { id: 'dpp', label: 'DPP Generator', icon: Layers3 },
  { id: 'exam', label: 'Mock Exam', icon: Clock },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'focus', label: 'Focus & Vault', icon: Flame },
  { id: 'ranks', label: 'Leaderboard', icon: Trophy },
] as const;

const SUBJECT_TARGET = 65; // hours per subject

export default function StudyHub() {
  const [tab, setTab] = useState<string>('dpp');
  const [examOpen, setExamOpen] = useState(false);
  const [xp, setXp] = useLocal<number>('pa-xp', 120);
  const [streak, setStreak] = useLocal<number>('pa-streak', 3);
  const [hours, setHours] = useLocal<Record<string, number>>('pa-hours', { Physics: 12, Chemistry: 9, Mathematics: 18, Biology: 6 });
  const [mistakes, setMistakes] = useLocal<Question[]>('pa-mistakes', []);
  const [results, setResults] = useLocal<ExamResult[]>('pa-results', []);
  const [flashIndex, setFlashIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const addMistake = (q: Question) => setMistakes((m) => (m.some((x) => x.id === q.id) ? m : [q, ...m]));

  const latest = results[0];
  const accuracy = latest && latest.correct + latest.wrong > 0 ? Math.round((latest.correct / (latest.correct + latest.wrong)) * 100) : 0;
  const avgTime = latest?.perQuestionSeconds.length
    ? Math.round(latest.perQuestionSeconds.reduce((a, b) => a + b, 0) / latest.perQuestionSeconds.length)
    : 0;
  const percentile = latest ? Math.min(99.9, Math.max(20, 40 + accuracy * 0.6)).toFixed(1) : '—';

  const leaderboard = useMemo(() => {
    const peers = [
      { name: 'Karnajit S.', xp: 980 },
      { name: 'Debjani B.', xp: 910 },
      { name: 'Satarupa S.', xp: 870 },
      { name: 'Titas S.', xp: 760 },
      { name: 'Rajdip C.', xp: 690 },
      { name: 'Shivam D.', xp: 640 },
      { name: 'Subhranil S.', xp: 580 },
      { name: 'Bibek B.', xp: 520 },
      { name: 'Snigdha M.', xp: 470 },
    ];
    return [...peers, { name: 'You', xp }].sort((a, b) => b.xp - a.xp).slice(0, 10);
  }, [xp]);

  return (
    <section id="studyhub" className="relative overflow-hidden bg-[#0b1526] px-5 py-24 lg:px-8 lg:py-32">
      <div className="relative mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="section-kicker text-coral">Study hub / Exam engine</div>
            <h2 className="mt-4 max-w-[620px] text-4xl font-black tracking-[-.05em] sm:text-6xl">
              Practice, test,<br /><span className="text-coral">then out-rank.</span>
            </h2>
          </div>
          <div className="flex gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500"><Sparkles size={11} /> XP</div>
              <div className="mt-1 text-2xl font-black text-coral">{xp}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500"><Flame size={11} /> Streak</div>
              <div className="mt-1 text-2xl font-black text-white">{streak}d</div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Countdown />
        </div>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                  tab === t.id ? 'border-coral bg-coral text-white' : 'border-slate-800 bg-slate-900/70 text-slate-300 backdrop-blur-md hover:text-white'
                }`}
              >
                <Icon size={13} /> {t.label}
              </button>
            );
          })}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-8 rounded-[1.75rem] border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md sm:p-7">
          {tab === 'dpp' && <DppGenerator onWrong={addMistake} onXp={(n) => setXp((x) => x + n)} />}

          {tab === 'exam' && (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <h3 className="text-2xl font-black text-white">NTA-style CBT mock</h3>
                <p className="mt-3 max-w-[460px] text-sm leading-6 text-slate-400">
                  10 questions across Physics, Chemistry, Maths and Biology. Fullscreen layout, 10-minute timer, question palette, +4 / −1 scoring and an optional focus monitor that logs when you leave the tab.
                </p>
                <button onClick={() => setExamOpen(true)} className="mt-6 rounded-xl bg-coral px-6 py-4 text-[11px] font-black uppercase tracking-wider text-white transition hover:brightness-110">
                  Start mock test
                </button>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Recent attempts</div>
                {results.length === 0 ? (
                  <p className="mt-4 text-xs text-slate-500">No attempts yet — your first score appears here.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {results.slice(0, 5).map((r, i) => (
                      <li key={i} className="flex items-center justify-between text-xs text-slate-300">
                        <span>{new Date(r.at).toLocaleString()}</span>
                        <b className="text-coral">{r.score} marks</b>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {tab === 'analytics' && (
            <div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ['Accuracy', latest ? `${accuracy}%` : '—'],
                  ['Avg time / question', latest ? `${avgTime}s` : '—'],
                  ['Projected percentile', percentile],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">{label}</div>
                    <div className="mt-2 text-3xl font-black text-coral">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">65-hour deep-study matrix</div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {subjects.map((s) => {
                    const done = hours[s] ?? 0;
                    const pct = Math.min(100, Math.round((done / SUBJECT_TARGET) * 100));
                    return (
                      <div key={s} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                        <div className="flex items-center justify-between text-xs font-black text-white">{s}<span className="text-coral">{pct}%</span></div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-coral" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">{done} / {SUBJECT_TARGET} hrs</div>
                        <button onClick={() => setHours((h) => ({ ...h, [s]: (h[s] ?? 0) + 1 }))} className="mt-4 w-full rounded-xl border border-slate-700 py-2 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white">
                          + Log 1 hour
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'focus' && (
            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <Pomodoro
                onSession={(m) => {
                  setXp((x) => x + 25);
                  setHours((h) => ({ ...h, Physics: (h.Physics ?? 0) + m / 60 }));
                }}
              />
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-coral"><Award size={12} /> Mistake vault · spaced repetition</div>
                {mistakes.length === 0 ? (
                  <p className="mt-5 text-xs leading-6 text-slate-500">Nothing here yet. Wrong answers from DPPs and mock tests turn into flashcards automatically.</p>
                ) : (
                  <div className="mt-5">
                    <div
                      onClick={() => setFlipped((f) => !f)}
                      className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center transition hover:border-coral/50"
                    >
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Card {flashIndex + 1} / {mistakes.length} · tap to flip
                      </div>
                      <div className="mt-4 text-sm font-bold leading-6 text-white">
                        {flipped
                          ? `${mistakes[flashIndex % mistakes.length].options[mistakes[flashIndex % mistakes.length].answer]} — ${mistakes[flashIndex % mistakes.length].solution}`
                          : mistakes[flashIndex % mistakes.length].question}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => { setFlipped(false); setFlashIndex((i) => (i + 1) % mistakes.length); }}
                        className="flex-1 rounded-xl bg-coral py-3 text-[11px] font-black uppercase tracking-wider text-white"
                      >
                        Next card
                      </button>
                      <button
                        onClick={() => {
                          const id = mistakes[flashIndex % mistakes.length].id;
                          setMistakes((m) => m.filter((q) => q.id !== id));
                          setFlipped(false);
                          setFlashIndex(0);
                          setXp((x) => x + 5);
                        }}
                        className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 text-[11px] font-black uppercase tracking-wider text-slate-300 hover:text-white"
                      >
                        <Check size={13} /> Mastered
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'ranks' && (
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <div className="overflow-hidden rounded-2xl border border-slate-800">
                {leaderboard.map((row, i) => (
                  <div key={row.name} className={`flex items-center justify-between px-5 py-3.5 text-sm ${row.name === 'You' ? 'bg-coral/10 text-white' : 'bg-slate-950/40 text-slate-300'}`}>
                    <div className="flex items-center gap-4">
                      <span className={`w-6 text-center text-xs font-black ${i < 3 ? 'text-amber-400' : 'text-slate-500'}`}>{i + 1}</span>
                      <span className="font-bold">{row.name}</span>
                    </div>
                    <b className="text-coral">{row.xp} XP</b>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Earn XP</div>
                <ul className="mt-4 space-y-2 text-xs text-slate-400">
                  <li>+10 · correct DPP answer</li>
                  <li>+25 · completed Pomodoro block</li>
                  <li>+5 · flashcard mastered</li>
                  <li>+50 · mock test submitted</li>
                </ul>
                <button onClick={() => { setStreak((s) => s + 1); setXp((x) => x + 15); }} className="mt-5 w-full rounded-xl bg-coral py-3 text-[11px] font-black uppercase tracking-wider text-white">
                  Claim daily streak (+15)
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {examOpen && (
          <MockExam
            onClose={() => setExamOpen(false)}
            onSubmit={(r) => {
              setResults((prev) => [{ score: r.score, correct: r.correct, wrong: r.wrong, skipped: r.skipped, perQuestionSeconds: r.perQuestionSeconds, at: new Date().toISOString() }, ...prev].slice(0, 10));
              r.mistakes.forEach(addMistake);
              setXp((x) => x + 50);
              const spent = r.perQuestionSeconds.reduce((a, b) => a + b, 0);
              void saveTestSubmission({
                score: r.score,
                total: r.correct + r.wrong + r.skipped,
                correct: r.correct,
                wrong: r.wrong,
                skipped: r.skipped,
                timeSpentSeconds: spent,
                details: { perQuestionSeconds: r.perQuestionSeconds },
              });
              void addProfileXp(50);
              setExamOpen(false);
              setTab('analytics');
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
