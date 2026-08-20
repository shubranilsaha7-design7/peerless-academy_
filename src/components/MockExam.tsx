import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye, EyeOff, Send, X } from 'lucide-react';
import { pickQuestions, questionBank, type Question } from '@/data/questions';

type Props = {
  onClose: () => void;
  onSubmit: (result: { score: number; correct: number; wrong: number; skipped: number; mistakes: Question[]; perQuestionSeconds: number[] }) => void;
  durationMinutes?: number;
};

export default function MockExam({ onClose, onSubmit, durationMinutes = 10 }: Props) {
  const questions = useMemo<Question[]>(() => {
    const set = [
      ...pickQuestions(11, 'Physics', 3),
      ...pickQuestions(11, 'Chemistry', 3),
      ...pickQuestions(12, 'Mathematics', 2),
      ...pickQuestions(12, 'Biology', 2),
    ];
    return set.length ? set : questionBank.slice(0, 10);
  }, []);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [visited, setVisited] = useState<boolean[]>(() => questions.map((_, i) => i === 0));
  const [times, setTimes] = useState<number[]>(() => questions.map(() => 0));
  const [left, setLeft] = useState(durationMinutes * 60);
  const [vision, setVision] = useState(false);
  const [distractions, setDistractions] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setLeft((s) => s - 1);
      setTimes((arr) => arr.map((v, i) => (i === current ? v + 1 : v)));
    }, 1000);
    return () => clearInterval(t);
  }, [current]);

  const finish = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const mistakes: Question[] = [];
    questions.forEach((q, i) => {
      if (answers[i] === null) skipped += 1;
      else if (answers[i] === q.answer) correct += 1;
      else {
        wrong += 1;
        mistakes.push(q);
      }
    });
    onSubmit({ score: correct * 4 - wrong, correct, wrong, skipped, mistakes, perQuestionSeconds: times });
  };

  useEffect(() => {
    if (left <= 0) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  useEffect(() => {
    if (!vision) return;
    const onBlur = () => setDistractions((d) => d + 1);
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [vision]);

  const goto = (i: number) => {
    setCurrent(i);
    setVisited((v) => v.map((x, idx) => (idx === i ? true : x)));
  };

  const mm = String(Math.max(0, Math.floor(left / 60))).padStart(2, '0');
  const ss = String(Math.max(0, left % 60)).padStart(2, '0');
  const q = questions[current];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex flex-col bg-slate-950">
      <header className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="text-xs font-black uppercase tracking-wider text-white">Peerless CBT · Mock Test</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setVision((v) => !v)}
            className={`hidden items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-wider sm:flex ${
              vision ? 'border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-400'
            }`}
          >
            {vision ? <Eye size={13} /> : <EyeOff size={13} />} Focus monitor {vision ? `· ${distractions}` : 'off'}
          </button>
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-black ${left < 60 ? 'bg-red-500/20 text-red-300' : 'bg-slate-800 text-white'}`}>
            <Clock size={15} /> {mm}:{ss}
          </div>
          <button onClick={onClose} aria-label="Exit test" className="rounded-xl border border-slate-700 p-2 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          <div className="mx-auto max-w-[760px]">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500">
              <span>Question {current + 1} / {questions.length}</span>
              <span className="text-coral">{q.subject} · {q.topic}</span>
            </div>
            <h2 className="mt-4 text-lg font-bold leading-7 text-white sm:text-xl">{q.question}</h2>

            <div className="mt-6 space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => setAnswers((a) => a.map((v, idx) => (idx === current ? i : v)))}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                    answers[current] === i
                      ? 'border-coral bg-coral/10 text-white'
                      : 'border-slate-800 bg-slate-900/70 text-slate-300 backdrop-blur-md hover:border-slate-600'
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-700 text-[11px] font-black">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setAnswers((a) => a.map((v, idx) => (idx === current ? null : v)))} className="rounded-xl border border-slate-700 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-slate-300 hover:text-white">
                Clear response
              </button>
              <button onClick={() => goto(Math.max(0, current - 1))} disabled={current === 0} className="rounded-xl border border-slate-700 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-slate-300 disabled:opacity-40">
                Previous
              </button>
              {current < questions.length - 1 ? (
                <button onClick={() => goto(current + 1)} className="rounded-xl bg-coral px-5 py-3 text-[11px] font-black uppercase tracking-wider text-white">
                  Save & Next
                </button>
              ) : (
                <button onClick={finish} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-white">
                  <Send size={13} /> Submit test
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="border-t border-slate-800 bg-slate-900/70 px-5 py-5 backdrop-blur-md lg:w-[280px] lg:border-l lg:border-t-0">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Question palette</div>
          <div className="mt-4 grid grid-cols-8 gap-2 lg:grid-cols-5">
            {questions.map((_, i) => {
              const answered = answers[i] !== null;
              const seen = visited[i];
              return (
                <button
                  key={i}
                  onClick={() => goto(i)}
                  className={`h-9 rounded-lg text-[11px] font-black transition ${
                    i === current
                      ? 'bg-coral text-white'
                      : answered
                        ? 'bg-emerald-500/80 text-white'
                        : seen
                          ? 'bg-red-500/70 text-white'
                          : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <ul className="mt-5 space-y-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-emerald-500/80" /> Answered</li>
            <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-red-500/70" /> Visited, not answered</li>
            <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-slate-800" /> Not visited</li>
          </ul>
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[10px] leading-5 text-slate-400">
            Marking scheme: <b className="text-emerald-400">+4</b> correct, <b className="text-red-400">−1</b> wrong, 0 unattempted.
          </div>
          <button onClick={finish} className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-white">
            Submit test
          </button>
        </aside>
      </div>
    </motion.div>
  );
}
