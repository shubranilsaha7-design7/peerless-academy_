import { Award, Star } from 'lucide-react';

const rankers = [
  { name: 'Debjani Bhowmik', class: 'Mathematics', score: '100/100', scoreLabel: 'Maths score', accent: 'coral' },
  { name: 'Debadatta Bhowmik', class: 'Mathematics', score: '100/100', scoreLabel: 'Maths score', accent: 'blue' },
  { name: 'Satarupa Shil', class: 'Mathematics', score: '100/100', scoreLabel: 'Maths score', accent: 'gold' },
  { name: 'Titas Saha', class: 'Mathematics', score: '98/100', scoreLabel: 'Maths score', accent: 'coral' },
];

const accentRing: Record<string, string> = {
  coral: 'from-coral/30 to-transparent text-coral',
  blue: 'from-sky-500/30 to-transparent text-sky-400',
  gold: 'from-amber-500/30 to-transparent text-amber-400',
};

export default function WallOfFame() {
  return (
    <section id="fame" className="relative overflow-hidden bg-ink px-5 py-24 lg:px-8 lg:py-32">
      <div className="arena-glow absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-coral/15 blur-[120px]" />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="section-kicker text-coral">Results / Wall of fame</div>
            <h2 className="mt-4 max-w-[620px] text-4xl font-black tracking-[-.05em] sm:text-6xl">
              Where hard work<br />
              <span className="text-coral">becomes a scorecard.</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-sm leading-6 text-slate-400">
            Real students. Real ranks. The kind of results that make the late nights worth it.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rankers.map((r) => (
            <article
              key={r.name}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[.045] p-6 backdrop-blur-md transition hover:-translate-y-2 hover:border-coral/40 hover:bg-white/[.07]"
            >
              <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.16em] text-coral"><Award size={14} /> Official result highlight</div>
              <p className="min-h-[110px] text-sm leading-6 text-slate-300">Featured on Peerless Academy's published student achievement board.</p>

              <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-5">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accentRing[r.accent]} text-lg font-black`}>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-black text-white">{r.name}</div>
                  <div className="text-[11px] font-bold uppercase tracking-[.12em] text-slate-400">{r.class}</div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-coral/10 px-4 py-3">
                <div>
                  <div className="text-2xl font-black text-coral">{r.score}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{r.scoreLabel}</div>
                </div>
                <Award size={22} className="text-coral" />
              </div>

              <div className="mt-3 flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
