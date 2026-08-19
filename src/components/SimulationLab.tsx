import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Atom, Beaker, Dna, Sigma } from 'lucide-react';

const subjects = [
  { id: 'physics', label: 'Physics', icon: Atom },
  { id: 'maths', label: 'Maths', icon: Sigma },
  { id: 'chemistry', label: 'Chemistry', icon: Beaker },
  { id: 'biology', label: 'Biology', icon: Dna },
] as const;

function Slider({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
        <span className="text-coral">{value}{unit}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[#ff6b00]"
      />
    </label>
  );
}

function ProjectileSim() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [speed, setSpeed] = useState(28);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.8);

  const stats = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    const t = (2 * speed * Math.sin(rad)) / gravity;
    const range = speed * Math.cos(rad) * t;
    const height = (speed * Math.sin(rad)) ** 2 / (2 * gravity);
    return { t, range, height };
  }, [speed, angle, gravity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let raf = 0;
    const rad = (angle * Math.PI) / 180;
    const scale = Math.min(canvas.width / (stats.range * 1.15 || 1), canvas.height / (stats.height * 2.4 || 1));

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,.08)';
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,255,255,.2)';
      ctx.beginPath();
      ctx.moveTo(0, h - 20);
      ctx.lineTo(w, h - 20);
      ctx.stroke();

      const tMax = stats.t;
      const tNow = Math.min((frame / 60) * 1.1, tMax);

      ctx.strokeStyle = '#ff6b00';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let t = 0; t <= tNow; t += tMax / 200) {
        const x = speed * Math.cos(rad) * t * scale;
        const y = h - 20 - (speed * Math.sin(rad) * t - 0.5 * gravity * t * t) * scale;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const bx = speed * Math.cos(rad) * tNow * scale;
      const by = h - 20 - (speed * Math.sin(rad) * tNow - 0.5 * gravity * tNow * tNow) * scale;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(bx, by, 6, 0, Math.PI * 2);
      ctx.fill();

      frame = tNow >= tMax ? 0 : frame + 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [speed, angle, gravity, stats]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <canvas ref={canvasRef} width={720} height={340} className="w-full rounded-xl border border-white/10 bg-ink/60" />
      <div className="space-y-5 rounded-xl border border-white/10 bg-white/[.05] p-5 backdrop-blur-xl">
        <Slider label="Launch speed" value={speed} min={5} max={60} step={1} unit=" m/s" onChange={setSpeed} />
        <Slider label="Angle" value={angle} min={5} max={85} step={1} unit="°" onChange={setAngle} />
        <Slider label="Gravity" value={gravity} min={1.6} max={24.8} step={0.1} unit=" m/s²" onChange={setGravity} />
        <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-slate-300">
          <div className="flex justify-between"><span className="text-slate-500">Range</span><b>{stats.range.toFixed(1)} m</b></div>
          <div className="flex justify-between"><span className="text-slate-500">Max height</span><b>{stats.height.toFixed(1)} m</b></div>
          <div className="flex justify-between"><span className="text-slate-500">Time of flight</span><b>{stats.t.toFixed(2)} s</b></div>
        </div>
      </div>
    </div>
  );
}

function GraphSim() {
  const [a, setA] = useState(1.5);
  const [b, setB] = useState(2);
  const [c, setC] = useState(0);

  const path = useMemo(() => {
    const pts: string[] = [];
    for (let px = 0; px <= 720; px += 4) {
      const x = (px - 360) / 60;
      const y = a * Math.sin(b * x + c);
      pts.push(`${px},${170 - y * 55}`);
    }
    return `M${pts.join(' L')}`;
  }, [a, b, c]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <svg viewBox="0 0 720 340" className="w-full rounded-xl border border-white/10 bg-ink/60">
        <line x1="0" y1="170" x2="720" y2="170" stroke="rgba(255,255,255,.2)" />
        <line x1="360" y1="0" x2="360" y2="340" stroke="rgba(255,255,255,.2)" />
        <path d={path} fill="none" stroke="#ff6b00" strokeWidth="2.5" />
      </svg>
      <div className="space-y-5 rounded-xl border border-white/10 bg-white/[.05] p-5 backdrop-blur-xl">
        <div className="text-sm font-black text-white">y = a · sin(bx + c)</div>
        <Slider label="Amplitude a" value={a} min={0.2} max={2.8} step={0.1} unit="" onChange={setA} />
        <Slider label="Frequency b" value={b} min={0.2} max={6} step={0.1} unit="" onChange={setB} />
        <Slider label="Phase c" value={c} min={-3.1} max={3.1} step={0.1} unit=" rad" onChange={setC} />
        <p className="border-t border-white/10 pt-4 text-xs leading-5 text-slate-400">
          Period = 2π / b = {(6.283 / b).toFixed(2)}. Move the sliders to see how amplitude, frequency and phase reshape the wave.
        </p>
      </div>
    </div>
  );
}

function MoleculeSim() {
  const [molecule, setMolecule] = useState<'water' | 'methane' | 'co2'>('water');
  const [spin, setSpin] = useState(true);

  const data = {
    water: { title: 'H₂O — Water', shape: 'Bent, 104.5°', atoms: [{ x: 0, y: 0, r: 26, c: '#ef4444', l: 'O' }, { x: -52, y: 38, r: 17, c: '#e2e8f0', l: 'H' }, { x: 52, y: 38, r: 17, c: '#e2e8f0', l: 'H' }] },
    methane: { title: 'CH₄ — Methane', shape: 'Tetrahedral, 109.5°', atoms: [{ x: 0, y: 0, r: 26, c: '#334155', l: 'C' }, { x: 0, y: -58, r: 16, c: '#e2e8f0', l: 'H' }, { x: -54, y: 32, r: 16, c: '#e2e8f0', l: 'H' }, { x: 54, y: 32, r: 16, c: '#e2e8f0', l: 'H' }, { x: 0, y: 58, r: 16, c: '#e2e8f0', l: 'H' }] },
    co2: { title: 'CO₂ — Carbon dioxide', shape: 'Linear, 180°', atoms: [{ x: 0, y: 0, r: 24, c: '#334155', l: 'C' }, { x: -64, y: 0, r: 22, c: '#ef4444', l: 'O' }, { x: 64, y: 0, r: 22, c: '#ef4444', l: 'O' }] },
  }[molecule];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="flex h-[340px] items-center justify-center rounded-xl border border-white/10 bg-ink/60">
        <motion.svg viewBox="-140 -140 280 280" className="h-[300px] w-[300px]" animate={spin ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 14, repeat: spin ? Infinity : 0, ease: 'linear' }}>
          {data.atoms.slice(1).map((a, i) => (
            <line key={i} x1="0" y1="0" x2={a.x} y2={a.y} stroke="rgba(255,255,255,.35)" strokeWidth="5" />
          ))}
          {data.atoms.map((a, i) => (
            <g key={i}>
              <circle cx={a.x} cy={a.y} r={a.r} fill={a.c} />
              <text x={a.x} y={a.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={a.l === 'H' ? '#0f172a' : '#fff'}>{a.l}</text>
            </g>
          ))}
        </motion.svg>
      </div>
      <div className="space-y-4 rounded-xl border border-white/10 bg-white/[.05] p-5 backdrop-blur-xl">
        <div className="text-sm font-black text-white">{data.title}</div>
        <div className="text-xs text-slate-400">Geometry: {data.shape}</div>
        <div className="flex flex-col gap-2">
          {(['water', 'methane', 'co2'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMolecule(m)}
              className={`rounded-xl px-4 py-2.5 text-[11px] font-black uppercase tracking-wider transition ${
                molecule === m ? 'bg-coral text-white' : 'border border-white/15 text-slate-300 hover:border-coral'
              }`}
            >
              {m === 'co2' ? 'CO₂' : m}
            </button>
          ))}
        </div>
        <button onClick={() => setSpin(!spin)} className="w-full rounded-xl border border-white/15 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-white hover:border-coral">
          {spin ? 'Pause rotation' : 'Resume rotation'}
        </button>
      </div>
    </div>
  );
}

const bioParts = [
  { id: 'nucleus', label: 'Nucleus', text: 'Holds DNA; controls all cell activity and division.', cx: 360, cy: 170, r: 42, color: '#6366f1' },
  { id: 'mitochondria', label: 'Mitochondria', text: 'Powerhouse — produces ATP through respiration.', cx: 250, cy: 110, r: 26, color: '#ef4444' },
  { id: 'chloroplast', label: 'Chloroplast', text: 'Site of photosynthesis in plant cells.', cx: 470, cy: 230, r: 26, color: '#22c55e' },
  { id: 'ribosome', label: 'Ribosome', text: 'Assembles proteins from mRNA instructions.', cx: 470, cy: 105, r: 16, color: '#f59e0b' },
  { id: 'vacuole', label: 'Vacuole', text: 'Stores water, ions and waste; maintains turgor.', cx: 245, cy: 235, r: 32, color: '#38bdf8' },
];

function CellSim() {
  const [active, setActive] = useState(bioParts[0]);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <svg viewBox="0 0 720 340" className="w-full rounded-xl border border-white/10 bg-ink/60">
        <ellipse cx="360" cy="170" rx="290" ry="140" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
        {bioParts.map((p) => (
          <g key={p.id} onClick={() => setActive(p)} className="cursor-pointer">
            <circle cx={p.cx} cy={p.cy} r={p.r} fill={p.color} opacity={active.id === p.id ? 0.95 : 0.55} />
            <text x={p.cx} y={p.cy + p.r + 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="#cbd5e1">{p.label}</text>
          </g>
        ))}
      </svg>
      <div className="rounded-xl border border-white/10 bg-white/[.05] p-5 backdrop-blur-xl">
        <div className="text-[10px] font-black uppercase tracking-wider text-coral">Tap any organelle</div>
        <div className="mt-3 text-lg font-black text-white">{active.label}</div>
        <p className="mt-2 text-xs leading-6 text-slate-400">{active.text}</p>
      </div>
    </div>
  );
}

export default function SimulationLab() {
  const [subject, setSubject] = useState<string>('physics');

  return (
    <section id="simulations" className="relative overflow-hidden bg-ink px-5 py-24 lg:px-8 lg:py-32">
      <div className="arena-glow absolute -right-24 top-10 h-[380px] w-[380px] rounded-full bg-coral/15 blur-[120px]" />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="section-kicker text-coral">Simulation lab / Learn by doing</div>
            <h2 className="mt-4 max-w-[620px] text-4xl font-black tracking-[-.05em] sm:text-6xl">
              Play with the<br />
              <span className="text-coral">concept itself.</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-sm leading-6 text-slate-400">
            Projectile motion, wave functions, molecular geometry and cell structure — interactive, offline-friendly and built for Class 5–12 plus NEET/JEE.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {subjects.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setSubject(s.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                  subject === s.id
                    ? 'border-coral bg-coral text-white'
                    : 'border-white/10 bg-white/[.04] text-slate-300 backdrop-blur-md hover:border-coral/40 hover:text-white'
                }`}
              >
                <Icon size={14} /> {s.label}
              </button>
            );
          })}
        </div>

        <motion.div key={subject} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[.035] p-5 backdrop-blur-xl sm:p-7">
          {subject === 'physics' && <ProjectileSim />}
          {subject === 'maths' && <GraphSim />}
          {subject === 'chemistry' && <MoleculeSim />}
          {subject === 'biology' && <CellSim />}
        </motion.div>
      </div>
    </section>
  );
}
