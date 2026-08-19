import { ArrowRight, CalendarDays, Check, Clock3, Repeat } from 'lucide-react';

const batches = [
  {
    tag: 'Most Popular',
    title: 'Class 10 Board Booster',
    target: 'CBSE & ICSE',
    start: 'Sep 02, 2026',
    days: 'Mon, Wed, Fri',
    time: '5:30 — 7:00 PM',
    features: ['Daily DPPs', 'Weekly mock tests', 'Doubt-clearing sessions', 'Board pattern drills'],
    featured: true,
  },
  {
    tag: 'New',
    title: 'Class 12 Science Masterclass',
    target: 'Physics · Chem · Math',
    start: 'Sep 09, 2026',
    days: 'Tue, Thu, Sat',
    time: '6:00 — 8:00 PM',
    features: ['Board + entrance prep', 'Chapter-wise Arenas', 'Previous year solving', 'Mentor 1-on-1s'],
    featured: false,
  },
  {
    tag: 'Foundation',
    title: 'Class 9 Foundation Builder',
    target: 'CBSE & ICSE',
    start: 'Sep 16, 2026',
    days: 'Mon — Fri',
    time: '4:00 — 5:30 PM',
    features: ['Concept-first lectures', 'Daily practice sets', 'Monthly Arenas', 'Parent updates'],
    featured: false,
  },
];

export default function UpcomingBatches() {
  return (
    <section id="batches" className="bg-[#f6f7f9] px-5 py-24 text-ink lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="section-kicker text-coral">Schedule / Enrollments</div>
            <h2 className="mt-4 max-w-[620px] text-4xl font-black tracking-[-.05em] sm:text-6xl">
              Upcoming target<br />
              <span className="text-slate-400">batches.</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-sm leading-6 text-slate-500">
            Pick a batch. Lock your seat. Seats are limited so every student gets heard.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {batches.map((batch) => (
            <article
              key={batch.title}
              className={`relative flex flex-col overflow-hidden rounded-[1.75rem] border p-7 transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                batch.featured
                  ? 'border-coral/30 bg-ink text-white shadow-xl'
                  : 'border-slate-200 bg-white text-ink'
              }`}
            >
              {batch.featured && (
                <div className="absolute -right-12 top-6 rotate-45 bg-coral px-12 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  Popular
                </div>
              )}

              <div className={`mb-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${batch.featured ? 'bg-coral text-white' : 'bg-coral/10 text-coral'}`}>
                {batch.tag}
              </div>

              <h3 className="text-2xl font-black tracking-[-.03em]">{batch.title}</h3>
              <div className={`mt-1 text-sm font-bold ${batch.featured ? 'text-orange-200' : 'text-slate-500'}`}>{batch.target}</div>

              <div className={`mt-6 space-y-3 border-y py-5 text-sm ${batch.featured ? 'border-white/10' : 'border-slate-100'}`}>
                <div className="flex items-center gap-3">
                  <CalendarDays size={16} className={batch.featured ? 'text-coral' : 'text-slate-400'} />
                  <span className="font-semibold">Starts {batch.start}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Repeat size={16} className={batch.featured ? 'text-coral' : 'text-slate-400'} />
                  <span className="font-semibold">{batch.days}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock3 size={16} className={batch.featured ? 'text-coral' : 'text-slate-400'} />
                  <span className="font-semibold">{batch.time}</span>
                </div>
              </div>

              <ul className="mt-5 space-y-2.5">
                {batch.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check size={15} className={batch.featured ? 'text-coral' : 'text-coral'} />
                    <span className={batch.featured ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-7 flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black transition hover:-translate-y-0.5 ${
                  batch.featured ? 'bg-coral text-white hover:bg-[#ff7b20]' : 'bg-ink text-white hover:bg-[#152541]'
                }`}
              >
                Enroll in Batch <ArrowRight size={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
