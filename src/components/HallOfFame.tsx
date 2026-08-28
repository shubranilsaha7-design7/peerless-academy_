import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, GraduationCap, Trophy } from 'lucide-react';

type Topper = { name: string; score: string; detail: string; group: 'maths' | 'boards' };

const toppers: Topper[] = [
  { name: 'Debjani Bhowmik', score: '100/100', detail: 'Mathematics', group: 'maths' },
  { name: 'Debadatta Bhowmik', score: '100/100', detail: 'Mathematics', group: 'maths' },
  { name: 'Satarupa Shil', score: '100/100', detail: 'Mathematics', group: 'maths' },
  { name: 'Titas Saha', score: '98/100', detail: 'Mathematics', group: 'maths' },
  { name: 'Rajdip Chakraborty', score: '98/100', detail: 'Mathematics', group: 'maths' },
  { name: 'Shivam Das', score: '98/100', detail: 'Mathematics', group: 'maths' },
  { name: 'Karnajit Saha', score: '99%', detail: 'Ramkrishna Mission School', group: 'boards' },
  { name: 'Dhrubajit Saha', score: '97%', detail: 'Sri Sri Ravishankar Vidya Mandir', group: 'boards' },
  { name: 'Debajit Dey', score: '98%', detail: 'SHIKSHA NIKETAN HS SCHOOL', group: 'boards' },
  { name: 'Shubranil Saha', score: '98%', detail: 'SHIKSHA NIKETAN HS SCHOOL', group: 'boards' },
  { name: 'Bibek Baidya', score: '94%', detail: 'Henry Derozio Academy', group: 'boards' },
  { name: 'Snigdha Majumder', score: '92%', detail: 'Sri Krishna Mission School', group: 'boards' },
];

const tabs = [
  { id: 'all', label: 'All Toppers' },
  { id: 'maths', label: 'Maths 100s' },
  { id: 'boards', label: 'Board Percentages' },
] as const;

export default function HallOfFame() {
  const [tab, setTab] = useState<string>('all');
  const list = tab === 'all' ? toppers : toppers.filter((t) => t.group === tab);

  return (
    <section id="toppers" className="relative overflow-hidden bg-[#f6f7f9] px-5 py-24 text-ink lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="section-kicker text-coral">Hall of fame / Toppers 2026</div>
            <h2 className="mt-4 max-w-[620px] text-4xl font-black tracking-[-.05em] sm:text-6xl">
              Names on the<br />
              <span className="text-slate-400">scoreboard.</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-sm leading-6 text-slate-500">
            Perfect 100s in Mathematics and board toppers across Agartala schools — published exactly as on our result board.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                tab === t.id ? 'bg-ink text-white' : 'bg-white text-slate-500 shadow-sm hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t, i) => (
            <motion.article
              key={t.name}
              layout
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: (i % 6) * 0.05 }}
              whileHover={{ y: -6 }}
              className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:shadow-2xl"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-coral/10 text-lg font-black text-coral">
                {t.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-black">{t.name}</div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {t.group === 'maths' ? <Trophy size={12} className="text-coral" /> : <GraduationCap size={12} className="text-coral" />}
                  <span className="truncate">{t.detail}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xl font-black text-coral">{t.score}</div>
                <Crown size={14} className="ml-auto mt-1 text-amber-400" />
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {[
            ['/images/gallery/wall-of-fame.jpeg', 'Official Wall of Fame board'],
            ['/images/gallery/mega-test.png', 'Mega Test for Madhyamik candidates'],
          ].map(([src, alt]) => (
            <figure key={src} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
              <img src={src} alt={alt} loading="lazy" className="w-full object-cover" />
              <figcaption className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">{alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
