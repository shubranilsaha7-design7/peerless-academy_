import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Clock, Send, Share2 } from 'lucide-react';
import { pickQuestions, questionBank, type Question, type Subject } from '@/data/questions';
import { shareDppOnWhatsApp } from '@/lib/whatsapp';

const SUBJECTS: Subject[] = ['Physics', 'Chemistry', 'Biology'];

type Status = 'unseen' | 'answered' | 'notAnswered' | 'review';

function poolFor(subject: Subject): Question[] {
  const set = [...pickQuestions(11, subject, 6), ...pickQuestions(12, subject, 6)];
  const unique = Array.from(new Map(set.map((q) => [q.id, q])).values());
  return unique.length >= 5 ? unique.slice(0, 10) : questionBank.filter((q) => q.subject === subject).slice(0, 10);
}

export default function CbtSimulator() {
  const [subject, setSubject] = useState<Subject>('Physics');
  const questions = useMemo(() => poolFor(subject), [subject]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [choice, setChoice] = useState<number | null>(null);
  const [left, setLeft] = useState(30 * 60);
  const [result, setResult] = useState<{ correct: number; wrong: number; skipped: number; score: number } | null>(null);

  useEffect(() => {
    setCurrent(0);
    setChoice(null);
  }, [subject]);

  useEffect(() => {
    const q = questions[current];
    if (!q) return;
    setChoice(answers[q.id] ?? null);
    setStatus((s) => (s[q.id] ? s : { ...s, [q.id]: 'notAnswered' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, questions]);

  useEffect(() => {
    if (result) return;
    const t = setInterval(() => setLeft((v) => (v <= 0 ? 0 : v - 1)), 1000);
    return () => clearInterval(t);
  }, [result]);

  const q = questions[current];
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

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
    setCurrent((c) => Math.min(questions.length - 1, c + 1));
  };

  const markReview = () => {
    if (!q) return;
    if (choice !== null) setAnswers((a) => ({ ...a, [q.id]: choice }));
    mark('review');
    setCurrent((c) => Math.min(questions.length - 1, c + 1));
  };

  const submit = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    questions.forEach((item) => {
      const a = answers[item.id];
      if (a === undefined) skipped += 1;
      else if (a === item.answer) correct += 1;
      else wrong += 1;
    });
    setResult({ correct, wrong, skipped, score: correct * 4 - wrong });
  };

  const reset = () => {
    setResult(null);
    setAnswers({});
    setStatus({});
    setChoice(null);
    setCurrent(0);
    setLeft(30 * 60);
  };

  const paletteClass = (st: Status | undefined, isCurrent: boolean) => {
    const ring = isCurrent ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black' : '';
    if (st === 'answered') return `bg-emerald-500 text-black ${ring}`;
    if (st === 'review') return `bg-purple-500 text-white ${ring}`;
    if (st === 'notAnswered') return `bg-red-500/80 text-white ${ring}`;
    return `bg-zinc-900 text-zinc-500 border border-zinc-800 ${ring}`;
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-black p-5 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">NTA CBT Exam Simulator</div>
          <h3 className="mt-2 text-xl font-black text-white">Full-screen style computer based test</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-zinc-800 bg-zinc-950 p-1">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={`rounded-lg px-3 py-2 text-[11px] font-black uppercase tracking-wider transition ${
                  subject === s ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black tabular-nums ${left < 60 ? 'bg-red-500/15 text-red-300' : 'bg-zinc-900 text-amber-300'}`}>
            <Clock size={15} /> {mm}:{ss}
          </div>
        </div>
      </div>

      {result ? (
        <div className="grid gap-4 py-10 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Test submitted</div>
          <div className="text-5xl font-black text-amber-400">{result.score}</div>
          <div className="mx-auto flex flex-wrap justify-center gap-3 text-[11px] font-black uppercase tracking-wider">
            <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-300">{result.correct} correct</span>
            <span className="rounded-full bg-red-500/15 px-4 py-2 text-red-300">{result.wrong} wrong</span>
            <span className="rounded-full bg-zinc-900 px-4 py-2 text-zinc-400">{result.skipped} skipped</span>
          </div>
          <button onClick={reset} className="mx-auto mt-4 rounded-xl bg-amber-400 px-6 py-3 text-[11px] font-black uppercase tracking-wider text-black transition hover:brightness-110">
            Retake test
          </button>
        </div>
      ) : (
        <div className="grid gap-6 pt-6 lg:grid-cols-[1fr_260px]">
          <motion.div key={q?.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 sm:p-6">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-500">
              <span>Question {current + 1} / {questions.length}</span>
              <span className="text-amber-400">{q?.topic}</span>
            </div>
            <h4 className="mt-4 text-lg font-bold leading-7 text-white">{q?.question}</h4>
            <div className="mt-5 space-y-3">
              {q?.options.map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => setChoice(i)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                    choice === i ? 'border-amber-400 bg-amber-400/10 text-white' : 'border-zinc-800 bg-black text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${choice === i ? 'bg-amber-400 text-black' : 'border border-zinc-700 text-zinc-400'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={saveAndNext} className="rounded-xl bg-amber-400 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-black transition hover:brightness-110">
                Save &amp; Next
              </button>
              <button onClick={markReview} className="flex items-center gap-2 rounded-xl border border-purple-500/60 bg-purple-500/10 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-purple-300 transition hover:bg-purple-500/20">
                <Bookmark size={13} /> Mark for Review
              </button>
              <button onClick={submit} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-black transition hover:brightness-110">
                <Send size={13} /> Submit Test
              </button>
              <button
                onClick={() => shareDppOnWhatsApp({ title: `Peerless CBT · ${subject} drill`, subject, questions })}
                className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-zinc-300 transition hover:text-white"
              >
                <Share2 size={13} /> Share via WhatsApp
              </button>
            </div>
          </motion.div>

          <aside className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
            <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Question status</div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {questions.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setCurrent(i)}
                  className={`h-9 rounded-lg text-[11px] font-black transition ${paletteClass(status[item.id], i === current)}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <ul className="mt-5 space-y-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Answered</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-red-500/80" /> Not answered</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-purple-500" /> Marked for review</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded border border-zinc-700 bg-zinc-900" /> Not visited</li>
            </ul>
            <div className="mt-5 rounded-xl border border-zinc-800 bg-black p-3 text-[10px] leading-5 text-zinc-500">
              Marking scheme: <b className="text-emerald-400">+4</b> correct, <b className="text-red-400">−1</b> wrong, 0 unattempted.
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
