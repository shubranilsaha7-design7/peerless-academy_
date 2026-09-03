import { useEffect, useRef, useState } from 'react';
import { Award, GraduationCap, Swords, Trophy, Users } from 'lucide-react';

const stats = [
  { icon: Users, value: 1500, suffix: '+', label: 'Students Mentored' },
  { icon: GraduationCap, value: 10000, suffix: '+', label: 'Doubts Solved' },
  { icon: Swords, value: 50, suffix: '+', label: 'Mock Arenas Conducted' },
  { icon: Trophy, value: 100, suffix: '%', label: 'Board Pass Rate' },
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function useCountUp(target: number, start: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return count;
}

function StatItem({ stat, start }: { stat: (typeof stats)[number]; start: boolean }) {
  const Icon = stat.icon;
  const count = useCountUp(stat.value, start);
  const display = stat.value >= 1000 ? `${Math.round(count / 100) / 10}k` : count.toString();
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.045] p-6 text-center backdrop-blur-md transition hover:-translate-y-1.5 hover:border-coral/40 hover:bg-white/[.07]">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-coral/15 text-coral transition group-hover:bg-coral group-hover:text-white">
        <Icon size={22} />
      </div>
      <div className="counter-glow text-4xl font-black text-white sm:text-5xl">
        {display}
        <span className="text-coral">{stat.suffix}</span>
      </div>
      <div className="mt-2 text-[11px] font-bold uppercase tracking-[.14em] text-slate-400">{stat.label}</div>
    </div>
  );
}

export default function TrustCounters() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section className="relative bg-ink px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1240px]">
        <div ref={ref} className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} start={inView} />
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[.15em] text-slate-500">
          <Award size={14} className="text-coral" /> Numbers that build trust
        </div>
      </div>
    </section>
  );
}
