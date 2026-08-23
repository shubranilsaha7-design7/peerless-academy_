import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, CheckCircle2, ChevronLeft, ChevronRight, Clock, RotateCcw, Send, Share2, Target } from 'lucide-react';
import {
  buildPaper, PAPER_CONFIG,
  type ExamPaper, type ExamQuestion, type ExamSubject,
} from '@/data/examBank';
import { shareOnWhatsApp } from '@/lib/whatsapp';

type Status = 'unseen' | 'answered' | 'notAnswered' | 'review' | 'answeredReview';

type Analysis = {
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxScore: number;
  accuracy: number;
  bySubject: { subject: ExamSubject; correct: number; wrong: number; skipped: number; score: number; attempted: number }[];
  weakTopics: string[];
};

const PAPERS: ExamPaper[] = ['JEE Main', 'JEE Advanced', 'NEET'];

export default function CbtSimulator() {
  const [paper, setPaper] = useState<ExamPaper>('NEET');
  const [seed, setSeed] = useState(0);
  const cfg = PAPER_CONFIG[paper];

  const questions = useMemo(() => buildPaper(paper), [paper, seed]);
  const [subject, setSubject] = useState<ExamSubject>(cfg.subjects[0]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [choice, setChoice] = useState<number | null>(null);
  const [left, setLeft] = useState(cfg.minutes * 60);
  const [result, setResult] = useState<Analysis | null>(null);

  const sectionQuestions = useMemo(
    () => questions.filter((item) => item.subject === subject),
    [questions, subject],
  );
  const q: ExamQuestion | undefined = sectionQuestions[current];

  // reset when paper changes
  useEffect(() => {
    setSubject(PAPER_CONFIG[paper].subjects[0]);
    setCurrent(0);
    setAnswers({});
    setStatus({});
    setChoice(null);
    setResult(null);
    setLeft(PAPER_CONFIG[paper].minutes * 60);
  }, [paper, seed]);

  useEffect(() => {
    setCurrent(0);
  }, [subject]);

  useEffect(() => {
    if (!q) return;
    setChoice(answers[q.id] ?? null);
    setStatus((s) => (s[q.id] ? s : { ...s, [q.id]: 'notAnswered' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q?.id]);

  useEffect(() => {
    if (result) return;
    const t = setInterval(() => setLeft((v) => (v <= 1 ? 0 : v - 1)), 1000);
    return () => clearInterval(t);
  }, [result]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  const analyse = (): Analysis => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const weak: string[] = [];
    const bySubject = cfg.subjects.map((s) => {
      let c = 0;
      let w = 0;
      let sk = 0;
      questions.filter((item) => item.subject === s).forEach((item) => {
        const a = answers[item.id];
        if (a === undefined) sk += 1;
        else if (a === item.answer) c += 1;
        else {
          w += 1;
          if (!weak.includes(item.topic)) weak.push(item.topic);
        }
      });
      correct += c;
      wrong += w;
      skipped += sk;
      return { subject: s, correct: c, wrong: w, skipped: sk, score: c * cfg.positive - w * cfg.negative, attempted: c + w };
    });
    const attempted = correct + wrong;
    return {
      correct,
      wrong,
      skipped,
      score: correct * cfg.positive - wrong * cfg.negative,
      maxScore: questions.length * cfg.positive,
      accuracy: attempted ? Math.round((correct / attempted) * 100) : 0,
      bySubject,
      weakTopics: weak.slice(0, 6),
    };
  };

  useEffect(() => {
    if (left === 0 && !result) setResult(analyse());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  const mark = (st: Status) => {
    if (!q) return;
    setStatus((s) => ({ ...s, [q.id]: st }));
  };

  const saveAndNext = () => {
    if (!q) return;
    if (choice === null) mark('notAnswered');
    else {
      setAnswers((a) => ({ ...a, [q.id]: choice }));
      mark('answered');
    }
    setCurrent((c) => Math.min(sectionQuestions.length - 1, c + 1));
  };

  const markReview = () => {
    if (!q) return;
    if (choice !== null) {
      setAnswers((a) => ({ ...a, [q.id]: choice }));
      mark('answeredReview');
    } else mark('review');
    setCurrent((c) => Math.min(sectionQuestions.length - 1, c + 1));
  };

  const clearResponse = () => {
    if (!q) return;
    setChoice(null);
    setAnswers((a) => {
      const next = { ...a };
      delete next[q.id];
      return next;
    });
    mark('notAnswered');
  };

  const reset = () => setSeed((s) => s + 1);

  const paletteClass = (st: Status | undefined, isCurrent: boolean) => {
    const ring = isCurrent ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black' : '';
    if (st === 'answered') return `bg-emerald-500 text-black ${ring}`;
    if (st === 'review' || st === 'answeredReview') return `bg-purple-500 text-white ${ring}`;
    if (st === 'notAnswered') return `bg-red-500/80 text-white ${ring}`;
    return `bg-zinc-900 text-zinc-500 border border-zinc-800 ${ring}`;
  };

  const attemptedInSection = sectionQuestions.filter((item) => answers[item.id] !== undefined).length;

  return (
    <div className="rounded-3xl border border-zinc-800 bg-black p-5 sm:p-7">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">NTA CBT Exam Simulator</div>
          <h3 className="mt-2 text-xl font-black text-white">{paper} · full paper mode</h3>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            {questions.length} questions · +{cfg.positive} / −{cfg.negative} · {cfg.minutes} min
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-zinc-800 bg-zinc-950 p-1">
            {PAPERS.map((p) => (
              <button
                key={p}
                onClick={() => setPaper(p)}
                className={`rounded-lg px-3 py-2 text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                  paper === p ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,.35)]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <motion.div
            animate={left < 60 ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ repeat: left < 60 ? Infinity : 0, duration: 1 }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black tabular-nums ${
              left < 60 ? 'bg-red-500/15 text-red-300' : 'bg-zinc-900 text-amber-300'
            }`}
          >
            <Clock size={15} /> {mm}:{ss}
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-8">
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Score analysis · {paper}</div>
              <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220 }} className="mt-3 text-6xl font-black text-amber-400">
                {result.score}
                <span className="text-2xl text-zinc-600"> / {result.maxScore}</span>
              </motion.div>
              <div className="mt-4 flex flex-wrap justify-center gap-3 text-[11px] font-black uppercase tracking-wider">
                <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-300">{result.correct} correct</span>
                <span className="rounded-full bg-red-500/15 px-4 py-2 text-red-300">{result.wrong} wrong</span>
                <span className="rounded-full bg-zinc-900 px-4 py-2 text-zinc-400">{result.skipped} skipped</span>
                <span className="rounded-full bg-amber-400/15 px-4 py-2 text-amber-300">{result.accuracy}% accuracy</span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {result.bySubject.map((s, i) => {
                const max = questions.filter((item) => item.subject === s.subject).length * cfg.positive;
                const pct = max ? Math.max(0, Math.round((s.score / max) * 100)) : 0;
                return (
                  <motion.div
                    key={s.subject}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-white">{s.subject}</span>
                      <span className="text-sm font-black text-amber-400">{s.score}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }} className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                    </div>
                    <div className="mt-3 flex gap-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      <span className="text-emerald-400">{s.correct}C</span>
                      <span className="text-red-400">{s.wrong}W</span>
                      <span>{s.skipped}S</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {result.weakTopics.length > 0 && (
              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-red-400">
                  <Target size={14} /> Revise these topics first
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.weakTopics.map((t) => (
                    <span key={t} className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold text-red-300">{t}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Solutions</div>
              <div className="mt-4 space-y-4">
                {questions.map((item, i) => {
                  const a = answers[item.id];
                  const ok = a === item.answer;
                  return (
                    <div key={item.id} className="rounded-xl border border-zinc-800 bg-black p-4">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        <span>{item.subject} · {item.topic}</span>
                        <span className={a === undefined ? 'text-zinc-500' : ok ? 'text-emerald-400' : 'text-red-400'}>
                          {a === undefined ? 'Skipped' : ok ? 'Correct' : 'Wrong'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-white">Q{i + 1}. {item.question}</p>
                      <p className="mt-2 text-xs text-emerald-300">Answer: {String.fromCharCode(65 + item.answer)}) {item.options[item.answer]}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-400">{item.solution}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={reset} className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-[11px] font-black uppercase tracking-wider text-black transition hover:brightness-110">
                <RotateCcw size={14} /> Retake with new set
              </button>
              <button
                onClick={() =>
                  shareOnWhatsApp(
                    `*Peerless Academy · ${paper} Mock Result*\nScore: ${result.score}/${result.maxScore}\nAccuracy: ${result.accuracy}%\nCorrect: ${result.correct} · Wrong: ${result.wrong} · Skipped: ${result.skipped}\n\n${result.bySubject
                      .map((s) => `${s.subject}: ${s.score}`)
                      .join('\n')}\n\nPeerless Academy · Indranagar, Agartala`,
                  )
                }
                className="flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-[11px] font-black uppercase tracking-wider text-zinc-300 transition hover:text-white"
              >
                <Share2 size={14} /> Share result
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="exam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 pt-6 lg:grid-cols-[1fr_280px]">
            <div>
              {/* section tabs */}
              <div className="mb-4 flex flex-wrap gap-2">
                {cfg.subjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={`rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                      subject === s ? 'bg-white text-black' : 'border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={q?.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    <span>Question {current + 1} / {sectionQuestions.length}</span>
                    <span className="text-amber-400">{q?.topic} · {q?.difficulty}</span>
                  </div>
                  <h4 className="mt-4 text-lg font-bold leading-7 text-white">{q?.question}</h4>
                  <div className="mt-5 space-y-3">
                    {q?.options.map((opt, i) => (
                      <motion.button
                        key={opt}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setChoice(i)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                          choice === i ? 'border-amber-400 bg-amber-400/10 text-white' : 'border-zinc-800 bg-black text-zinc-300 hover:border-zinc-600'
                        }`}
                      >
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${choice === i ? 'bg-amber-400 text-black' : 'border border-zinc-700 text-zinc-400'}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={saveAndNext} className="rounded-xl bg-amber-400 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-black transition hover:brightness-110">
                      Save &amp; Next
                    </button>
                    <button onClick={markReview} className="flex items-center gap-2 rounded-xl border border-purple-500/60 bg-purple-500/10 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-purple-300 transition hover:bg-purple-500/20">
                      <Bookmark size={13} /> Mark for Review
                    </button>
                    <button onClick={clearResponse} className="rounded-xl border border-zinc-700 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-zinc-400 transition hover:text-white">
                      Clear
                    </button>
                    <button onClick={() => setResult(analyse())} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-black transition hover:brightness-110">
                      <Send size={13} /> Submit Test
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4">
                    <button
                      onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                      className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-zinc-500 transition hover:text-white"
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>
                    <button
                      onClick={() => setCurrent((c) => Math.min(sectionQuestions.length - 1, c + 1))}
                      className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-zinc-500 transition hover:text-white"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <aside className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-500">
                <span>{subject} palette</span>
                <span className="text-emerald-400">{attemptedInSection}/{sectionQuestions.length}</span>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {sectionQuestions.map((item, i) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrent(i)}
                    className={`h-9 rounded-lg text-[11px] font-black transition ${paletteClass(status[item.id], i === current)}`}
                  >
                    {i + 1}
                  </motion.button>
                ))}
              </div>
              <ul className="mt-5 space-y-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Answered</li>
                <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-red-500/80" /> Not answered</li>
                <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-purple-500" /> Marked for review</li>
                <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded border border-zinc-700 bg-zinc-900" /> Not visited</li>
              </ul>

              <div className="mt-5 space-y-2">
                {cfg.subjects.map((s) => {
                  const list = questions.filter((item) => item.subject === s);
                  const done = list.filter((item) => answers[item.id] !== undefined).length;
                  return (
                    <div key={s} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      <CheckCircle2 size={12} className={done === list.length ? 'text-emerald-400' : 'text-zinc-700'} />
                      {s} {done}/{list.length}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl border border-zinc-800 bg-black p-3 text-[10px] leading-5 text-zinc-500">
                Marking scheme: <b className="text-emerald-400">+{cfg.positive}</b> correct, <b className="text-red-400">−{cfg.negative}</b> wrong, 0 unattempted.
              </div>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
