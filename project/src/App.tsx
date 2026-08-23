import { FormEvent, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  ArrowRight, Atom, Award, BarChart3, Beaker, BookOpen,
  BrainCircuit, Check, ChevronDown, Flame, Instagram,
  Layers3, Lock, MessageCircle, Phone, Sparkles,
  Swords, Target, Trophy, X, Zap,
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { supabase } from './supabaseClient';
import type { Subject, ExamType } from './services/questionEngine';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Components
import Navbar         from '@/components/Navbar';
import Marquee        from '@/components/Marquee';
import TrustCounters  from '@/components/TrustCounters';
import WallOfFame     from '@/components/WallOfFame';
import UpcomingBatches from '@/components/UpcomingBatches';
import ResourceCenter from '@/components/ResourceCenter';
import FAQ            from '@/components/FAQ';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import ProgressionHub from '@/components/ProgressionHub';
import DailyBites     from '@/components/DailyBites';
import ChallengeHub   from '@/components/ChallengeHub';
import LearningPath   from '@/components/LearningPath';
import PracticeLab    from '@/components/PracticeLab';
import MediaGallery   from '@/components/MediaGallery';
import Mentors        from '@/components/Mentors';
import Gallery        from '@/components/Gallery';
// @ts-ignore
import AuthModal        from '@/components/AuthModal';
// @ts-ignore
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
// @ts-ignore
import Arena            from '@/components/Arena';
// @ts-ignore
import AIDoubtSolver    from '@/components/AIDoubtSolver';
// @ts-ignore
import AdminVideoUpload from '@/components/admin/AdminVideoUpload';
// @ts-ignore
import VideoLectures    from '@/components/VideoLectures';

// ── Static assets ────────────────────────────────────────────────
const logoImage      = '/images/WhatsApp_Image_2026-08-17_at_21.04.26.jpeg';
const admissionImage = '/images/WhatsApp_Image_2026-08-19_at_05.30.17.jpeg';

// ── Data ────────────────────────────────────────────────────────
const programs = [
  { number: '01', eyebrow: 'Classes 05—08', title: 'Middle School',    description: 'Building the Foundation',  detail: 'Curiosity-led learning that makes every concept feel like an unlock.', color: 'coral', icon: Layers3 },
  { number: '02', eyebrow: 'Classes 09—10', title: 'Secondary',        description: 'Board Exam Mastery',       detail: 'Structured practice, sharp revision, and the confidence to ace boards.',  color: 'blue',  icon: Target  },
  { number: '03', eyebrow: 'Classes 11—12', title: 'Higher Secondary', description: 'Board & Entrance Prep',   detail: 'Go beyond the syllabus with an exam-ready mind and a winning rhythm.',   color: 'gold',  icon: Trophy  },
];

const arenaFeatures = [
  { icon: Swords,      title: 'Live 1v1 MCQ Battles',      text: 'Challenge classmates. Think fast. Earn your rank.'                    },
  { icon: BrainCircuit,title: 'AI-Powered Study Roadmaps', text: 'A smarter route from where you are to where you want to be.'           },
  { icon: Flame,       title: 'Daily Solving Streaks',     text: 'Small wins every day build unstoppable momentum.'                      },
  { icon: BarChart3,   title: 'Real-Time Elo Leaderboards',text: 'See your progress, celebrate the climb, own your arena.'               },
];

const LOCKED_FEATURES = [
  { id: 'sim-lab',  label: '3D Simulation Lab',   icon: Atom     },
  { id: 'cbt',      label: 'NTA CBT Simulator',   icon: Beaker   },
  { id: 'monk',     label: 'Monk Mode Tracker',   icon: Flame    },
  { id: 'ai-doubt', label: 'AI Doubt Solver',     icon: Sparkles },
];

const SUBJECTS:    Subject[]  = ['Physics', 'Chemistry', 'Maths', 'Biology'];
const EXAM_TYPES:  ExamType[] = ['NCERT', 'JEE', 'NEET', 'General'];
const CLASS_LEVELS = [7, 8, 9, 10, 11, 12];

// ── Inner App (has access to ThemeContext) ────────────────────────
function AppInner() {
  const { isDark, toggleTheme } = useTheme();

  // ── Auth state ──────────────────────────────────────────────
  const [user,    setUser]    = useState<User | null>(null);
  const [xp,      setXp]      = useState(0);
  const [streak,  setStreak]  = useState(0);
  const [level,   setLevel]   = useState(1);

  // ── Modal/panel state ────────────────────────────────────────
  const [isAuthOpen,   setIsAuthOpen]   = useState(false);
  const [isArenaOpen,  setIsArenaOpen]  = useState(false);
  const [isDoubtOpen,  setIsDoubtOpen]  = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [activeRoute,  setActiveRoute]  = useState('home');

  // ── Arena filters ─────────────────────────────────────────
  const [arenaSubject,    setArenaSubject]    = useState<Subject | undefined>(undefined);
  const [arenaClass,      setArenaClass]      = useState<number | undefined>(undefined);
  const [arenaExamType,   setArenaExamType]   = useState<ExamType | undefined>(undefined);
  const [showArenaConfig, setShowArenaConfig] = useState(false);

  // ── Supabase auth listener ───────────────────────────────
  useEffect(() => {
    (supabase as any).auth.getSession().then(({ data }: { data: { session: { user: User } | null } }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) fetchUserStats(u.id);
    });

    const { data: { subscription } } = (supabase as any).auth.onAuthStateChange(
      (_event: string, session: { user: User } | null) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          setIsAuthOpen(false);
          fetchUserStats(u.id);
        } else {
          setXp(0); setStreak(0); setLevel(1);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserStats(userId: string) {
    try {
      const { data } = await (supabase as any)
        .from('profiles')
        .select('xp, streak, level')
        .eq('id', userId)
        .single();
      if (data) { setXp(data.xp || 0); setStreak(data.streak || 0); setLevel(data.level || 1); }
    } catch { /* profile may not exist yet */ }
  }

  const handleSignOut = async () => (supabase as any).auth.signOut();

  const openArena = () => {
    if (!user) { setIsAuthOpen(true); return; }
    setShowArenaConfig(true);
  };

  const startArena = () => {
    setShowArenaConfig(false);
    setIsArenaOpen(true);
  };

  const handleLockedFeatureClick = (featureId: string) => {
    if (!user) { setIsAuthOpen(true); return; }
    if (featureId === 'ai-doubt') setIsDoubtOpen(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await (supabase as any).from('contact_inquiries').insert([{
        student_name: formData.get('studentName'),
        guardian_name: formData.get('guardianName'),
        phone: formData.get('phone'),
        class_level: formData.get('class'),
        message: formData.get('message') || null
      }]);
    } catch (err) {
      console.error('Failed to submit inquiry', err);
    }
    
    setSubmitted(true);
  };

  // Apply dark bg to body
  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#020617' : '#f8fafc';
    document.body.style.color = isDark ? '#f1f5f9' : '#0f172a';
  }, [isDark]);

  if (activeRoute === 'lectures') {
    if (!user) {
      setIsAuthOpen(true);
      setActiveRoute('home');
      return null;
    }
    return <VideoLectures onBack={() => setActiveRoute('home')} />;
  }

  if (activeRoute === 'admin_upload') {
    if (!user) {
      setIsAuthOpen(true);
      setActiveRoute('home');
      return null;
    }
    return <AdminVideoUpload user={user} onBack={() => setActiveRoute('home')} />;
  }

  return (
    <div className={`min-h-screen overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* ── NAVBAR ── */}
      <Navbar
        user={user}
        xp={xp}
        streak={streak}
        level={level}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onSignIn={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
        onEnterArena={openArena}
      />

      <main>
        {/* ── HERO ── */}
        <section id="home" className="hero-grid relative flex min-h-[760px] items-center px-5 pb-24 pt-36 lg:min-h-[820px] lg:px-8 lg:pt-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(255,107,0,.14),transparent_28%),radial-gradient(circle_at_14%_70%,rgba(39,91,159,.16),transparent_25%)]" />
          <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-coral/30 bg-coral/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-200">
                <Sparkles size={13} className="text-coral" /> Agartala's new standard in learning
              </div>
              <h1 className="max-w-[720px] text-[clamp(3.2rem,7.5vw,6.5rem)] font-black leading-[.94] tracking-[-.065em]">
                You don't rise<br /><span className="text-coral">by watching.</span><br />You rise by solving.
              </h1>
              <p className={`mt-8 max-w-[600px] text-base leading-7 sm:text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Agartala's premier science & math coaching for Classes 5 to 12. Master your CBSE & ICSE boards and dominate competitive exams with our gamified learning approach.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#contact" className="group flex items-center justify-center gap-3 rounded-full bg-coral px-7 py-4 text-sm font-black text-white shadow-[0_12px_35px_rgba(255,107,0,.22)] transition hover:-translate-y-1 hover:bg-[#ff7b20]">
                  Book a Free Demo <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                </a>
                <button
                  onClick={openArena}
                  className="flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-7 py-4 text-sm font-black text-white shadow-[0_12px_35px_rgba(6,182,212,.3)] transition hover:-translate-y-1"
                >
                  <Swords size={16} /> Enter the Arena
                </button>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-5 border-t border-white/10 pt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                <span className="flex items-center gap-2"><Check size={15} className="text-coral" /> Classes 5—12</span>
                <span className="flex items-center gap-2"><Check size={15} className="text-coral" /> CBSE & ICSE</span>
                <span className="flex items-center gap-2"><Check size={15} className="text-coral" /> 100% Concept Clarity</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[475px] lg:ml-auto">
              <div className="absolute -inset-5 rounded-[2.5rem] border border-coral/20 bg-coral/5 blur-sm" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-navy shadow-2xl">
                <img src={admissionImage} alt="Peerless Academy" className="h-[480px] w-full object-cover object-top opacity-90 transition duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="mb-2 text-xs font-black uppercase tracking-[.2em] text-coral">2026—27 Admissions Open</div>
                  <div className="text-2xl font-black">Your edge starts here.</div>
                </div>
              </div>
              <div className="float-card absolute -bottom-7 -left-7 hidden items-center gap-3 rounded-2xl border border-white/15 bg-[#152541]/90 px-4 py-3 shadow-xl backdrop-blur-md sm:flex">
                <div className="rounded-xl bg-coral/15 p-2.5 text-coral"><Award size={21} /></div>
                <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trusted mentorship</div><div className="text-sm font-black">Learn. Solve. Lead.</div></div>
              </div>
              <div className="absolute -right-4 top-10 rounded-2xl border border-white/15 bg-[#152541]/90 px-4 py-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-black">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> Arena is live
                </div>
                <div className="mt-1 text-[10px] text-slate-400">1,284 students online</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TICKER STRIP ── */}
        <section className={`border-y px-5 py-6 lg:px-8 ${isDark ? 'border-white/10 bg-[#0d1b32]' : 'border-slate-200 bg-slate-100'}`}>
          <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[.15em] text-slate-400"><span className="h-2 w-2 rounded-full bg-coral" /> Built for the curious</div>
            <div className="flex flex-wrap gap-5 text-sm font-bold text-white/80 sm:gap-10"><span>01 / Deep concepts</span><span>02 / Daily practice</span><span>03 / Visible progress</span></div>
            <button onClick={openArena} className="flex items-center gap-2 text-xs font-black uppercase tracking-[.15em] text-cyan-400 hover:text-cyan-300 transition">
              Enter the arena <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* ── LOCKED STUDENT FEATURES ── */}
        <section className={`border-b px-5 py-12 lg:px-8 ${isDark ? 'bg-[#0a1628] border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="mx-auto max-w-[1240px]">
            <div className="flex flex-col items-center gap-2 mb-8">
              <div className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-500">Student Features</div>
              <h3 className="text-2xl font-black text-center">
                {user ? `Welcome back, ${user.user_metadata?.full_name?.split(' ')[0] || 'Student'}! 🎉` : 'Sign in to unlock premium tools'}
              </h3>
              {!user && <p className={`text-sm text-center max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Free account required for 3D Simulation Lab, NTA CBT Simulator, Monk Mode Tracker & AI Doubt Solver.</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {LOCKED_FEATURES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleLockedFeatureClick(id)}
                  className={`group relative flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition
                    ${user
                      ? 'border-cyan-500/30 bg-cyan-500/5 cursor-default'
                      : isDark
                      ? 'border-white/10 bg-white/[.03] hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer'
                      : 'border-slate-200 bg-slate-50 hover:border-cyan-400 hover:bg-cyan-50 cursor-pointer'}`}
                >
                  <div className={`rounded-xl p-3 ${user ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-slate-400 group-hover:text-cyan-400'}`}>
                    <Icon size={22} />
                  </div>
                  <span className={`text-sm font-bold ${user ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{label}</span>
                  {user
                    ? <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Unlocked ✓</span>
                    : <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-cyan-400"><Lock size={10} /> Sign in</span>}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── ARENA CONFIG (filter selector) ── */}
        {showArenaConfig && (
          <div className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div className={`w-full max-w-md rounded-3xl border p-8 shadow-2xl ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-white">⚔️ Configure Match</h2>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Filter questions (optional)</p>
                </div>
                <button onClick={() => setShowArenaConfig(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </div>

              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Subject</p>
                  <div className="grid grid-cols-4 gap-2">
                    {['Any', ...SUBJECTS].map(s => (
                      <button key={s} onClick={() => setArenaSubject(s === 'Any' ? undefined : s as Subject)}
                        className={`rounded-xl py-2 text-xs font-black transition
                          ${(s === 'Any' && !arenaSubject) || arenaSubject === s
                            ? 'bg-cyan-500 text-slate-950'
                            : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>

                {/* Class Level */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Class Level</p>
                  <div className="grid grid-cols-7 gap-2">
                    {['Any', ...CLASS_LEVELS].map(c => (
                      <button key={c} onClick={() => setArenaClass(c === 'Any' ? undefined : Number(c))}
                        className={`rounded-xl py-2 text-xs font-black transition
                          ${(c === 'Any' && !arenaClass) || arenaClass === c
                            ? 'bg-purple-500 text-white'
                            : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >{c}</button>
                    ))}
                  </div>
                </div>

                {/* Exam Type */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Exam Type</p>
                  <div className="grid grid-cols-5 gap-2">
                    {['Any', ...EXAM_TYPES].map(e => (
                      <button key={e} onClick={() => setArenaExamType(e === 'Any' ? undefined : e as ExamType)}
                        className={`rounded-xl py-2 text-xs font-black transition
                          ${(e === 'Any' && !arenaExamType) || arenaExamType === e
                            ? 'bg-orange-500 text-white'
                            : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >{e}</button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={startArena}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-4 text-sm font-black text-white shadow-lg hover:-translate-y-0.5 transition"
              >
                <Swords size={16} /> Start Arena Battle
              </button>
            </div>
          </div>
        )}

        <ProgressionHub />

        {/* ── VIDEO LECTURES HUB ACCESS ── */}
        <section className="bg-ink px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-[1240px]">
            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-slate-900 p-8 sm:p-12">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]" />
              <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-cyan-400">
                    <BookOpen size={16} /> Premium Curriculum
                  </div>
                  <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                    Master any subject at <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">your own pace.</span>
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                    Dive into our structured video lecture library. Track your progress against the 65-hour mastery target for each subject.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveRoute('lectures')}
                  className="flex w-fit items-center gap-3 rounded-2xl bg-cyan-500 px-8 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-400 hover:scale-105"
                >
                  <BookOpen size={18} /> Open Lectures Hub
                </button>
              </div>
            </div>
          </div>
        </section>

        <TrustCounters />
        <WallOfFame />

        {/* ── PROGRAMS ── */}
        <section id="programs" className={`px-5 py-24 lg:px-8 lg:py-32 ${isDark ? 'bg-[#0d1b32]' : 'bg-[#f6f7f9] text-ink'}`}>
          <div className="mx-auto max-w-[1240px]">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="section-kicker text-coral">01 / The academics</div>
                <h2 className="mt-4 max-w-[620px] text-4xl font-black tracking-[-.05em] sm:text-6xl">A stronger base.<br /><span className="text-slate-400">A higher ceiling.</span></h2>
              </div>
              <p className={`max-w-[360px] text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No shortcuts. No noise. Just a clear path from first principles to fearless problem solving.</p>
            </div>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {programs.map((prog) => {
                const Icon = prog.icon;
                return (
                  <article key={prog.number} className={`program-card ${prog.color} group relative overflow-hidden rounded-[1.75rem] border p-7 transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-start justify-between">
                      <span className={`text-sm font-black ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>{prog.number}</span>
                      <div className={`rounded-xl p-3 transition group-hover:bg-coral group-hover:text-white ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}><Icon size={22} /></div>
                    </div>
                    <div className={`mt-16 text-[10px] font-black uppercase tracking-[.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{prog.eyebrow}</div>
                    <h3 className="mt-3 text-3xl font-black tracking-[-.04em]">{prog.title}</h3>
                    <div className="mt-2 text-lg font-bold text-coral">{prog.description}</div>
                    <p className={`mt-5 max-w-[290px] text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{prog.detail}</p>
                    <a href="#contact" className="mt-8 flex w-fit items-center gap-2 text-xs font-black uppercase tracking-[.15em]">
                      View program <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                    </a>
                    <div className="program-orb absolute -bottom-20 -right-14 h-44 w-44 rounded-full opacity-20 transition group-hover:scale-125" />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <UpcomingBatches />
        <DailyBites />
        <ChallengeHub />
        <LearningPath />

        {/* ── ARENA SECTION ── */}
        <section id="arena" className="relative overflow-hidden bg-ink px-5 py-24 lg:px-8 lg:py-32">
          <div className="arena-glow absolute -right-20 top-20 h-[420px] w-[420px] rounded-full bg-coral/20 blur-[120px]" />
          <div className="pointer-events-none absolute -left-20 bottom-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="relative mx-auto max-w-[1240px]">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div>
                <div className="section-kicker text-coral">03 / The arena</div>
                <h2 className="mt-4 max-w-[680px] text-4xl font-black tracking-[-.05em] sm:text-6xl">Learning is a<br /><span className="text-coral">competitive sport.</span></h2>
              </div>
              <button
                onClick={openArena}
                className="flex w-fit items-center gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-4 text-sm font-black text-cyan-300 transition hover:bg-cyan-500/20"
              >
                <Swords size={18} className="text-cyan-400" /> Enter Arena Now
              </button>
            </div>
            <p className="mt-8 max-w-[530px] text-sm leading-6 text-slate-400">
              A fresh way to practice, compete, and stay consistent. Turn your study time into a game you can't wait to play.
            </p>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {arenaFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="arena-card group rounded-[1.5rem] border border-white/10 bg-white/[.045] p-6 transition hover:-translate-y-2 hover:border-coral/40 hover:bg-white/[.08]">
                    <div className="flex items-start justify-between">
                      <div className="rounded-xl bg-coral/10 p-3 text-coral transition group-hover:bg-coral group-hover:text-white"><Icon size={21} /></div>
                      <span className="text-[10px] font-black text-slate-600">0{index + 1}</span>
                    </div>
                    <h3 className="mt-12 text-lg font-black leading-tight">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{feature.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <ResourceCenter />
        <PracticeLab />
        <MediaGallery />
        <FAQ />

        {/* ── CONTACT ── */}
        <section id="contact" className={`px-5 py-24 lg:px-8 lg:py-32 ${isDark ? 'bg-[#0d1b32]' : 'bg-[#f6f7f9] text-ink'}`}>
          <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div>
              <div className="section-kicker text-coral">04 / Your next move</div>
              <h2 className="mt-4 text-4xl font-black tracking-[-.05em] sm:text-6xl">Start your<br /><span className="text-slate-400">rise today.</span></h2>
              <p className={`mt-6 max-w-[400px] text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tell us a little about your goals. Our team will call you back to find the right fit.</p>
              <div className="mt-10 space-y-5">
                <a href="tel:+918794130855" className="flex items-center gap-4 text-sm font-bold hover:text-coral">
                  <span className={`rounded-xl p-3 text-coral shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}><Phone size={18} /></span>+91 87941 30855
                </a>
                <a href="https://instagram.com/peerlessacademyofficial" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-sm font-bold hover:text-coral">
                  <span className={`rounded-xl p-3 text-coral shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}><Instagram size={18} /></span>@peerlessacademyofficial
                </a>
                <div className="flex items-center gap-4 text-sm font-bold">
                  <span className={`rounded-xl p-3 text-coral shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}><BookOpen size={18} /></span>Indranagar, Agartala, Tripura
                </div>
              </div>
            </div>
            <div className={`rounded-[2rem] p-6 shadow-[0_20px_70px_rgba(15,23,42,.08)] sm:p-10 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              {submitted ? (
                <div className="flex min-h-[410px] flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-emerald-50 p-5 text-emerald-600"><Check size={34} /></div>
                  <h3 className="mt-6 text-3xl font-black">You're on your way.</h3>
                  <p className={`mt-3 max-w-[340px] text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Thanks for reaching out. A Peerless mentor will call you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 text-xs font-black uppercase tracking-wider text-coral">Send another enquiry</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black uppercase tracking-[.2em] text-coral">Free counselling</div>
                      <h3 className="mt-2 text-2xl font-black">Make an enquiry</h3>
                    </div>
                    <MessageCircle className="text-slate-300" size={30} />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="field-label">Student name<input required name="studentName" type="text" placeholder="Your child's name" /></label>
                    <label className="field-label">Guardian name<input required name="guardianName" type="text" placeholder="Parent / guardian name" /></label>
                    <label className="field-label">Phone number<input required name="phone" type="tel" placeholder="+91" /></label>
                    <label className="field-label">Class<select required name="class"><option value="">Select class</option>{[5,6,7,8,9,10,11,12].map(g => <option key={g} value={g}>Class {g}</option>)}</select></label>
                    <label className="field-label sm:col-span-2">Message<textarea name="message" rows={3} placeholder="What would you like to know?" /></label>
                  </div>
                  <button type="submit" className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-coral px-5 py-4 text-sm font-black text-white transition hover:bg-[#ff7b20]">
                    Submit Enquiry <ArrowRight size={17} />
                  </button>
                  <p className={`mt-4 text-center text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No pressure. Just a conversation about your child's next step.</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <WhatsAppWidget />

      {/* ── FOOTER ── */}
      <footer className={`border-t px-5 py-12 lg:px-8 ${isDark ? 'border-white/10 bg-slate-950' : 'border-slate-200 bg-slate-900'}`}>
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <a href="#home" className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-xl bg-white"><img src={logoImage} alt="Peerless Academy" className="h-full w-full object-cover" /></div>
              <div className="leading-none"><span className="block text-sm font-black tracking-[.15em] text-white">PEERLESS</span><span className="mt-1 block text-[8px] font-semibold tracking-[.32em] text-coral">ACADEMY</span></div>
            </a>
            <p className="mt-6 max-w-[290px] text-xs leading-5 text-slate-500">Choose us, be a step ahead. Building better minds and brighter futures in Agartala.</p>
          </div>
          <div className="grid gap-8 text-xs text-slate-400 sm:grid-cols-3">
            <div><div className="mb-3 font-black uppercase tracking-wider text-white">Visit</div><div>Indranagar, Agartala</div><div>Tripura, India</div></div>
            <div><div className="mb-3 font-black uppercase tracking-wider text-white">Connect</div><a href="tel:+918794130855" className="block hover:text-coral">+91 87941 30855</a><a href="mailto:hello@peerlessacademy.in" className="mt-1 block hover:text-coral">hello@peerlessacademy.in</a></div>
            <div><div className="mb-3 font-black uppercase tracking-wider text-white">Follow</div><a href="https://instagram.com/peerlessacademyofficial" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-coral"><Instagram size={14} /> Instagram</a></div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-[1240px] border-t border-white/10 pt-5 text-[10px] uppercase tracking-wider text-slate-600 flex justify-between items-center">
          <span>© 2026 Peerless Academy. Made for the next breakthrough.</span>
          <button onClick={() => setActiveRoute('admin_upload')} className="hover:text-white transition">Admin Upload</button>
        </div>
      </footer>

      {/* ── MODALS & PANELS ── */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <Arena
        isOpen={isArenaOpen}
        onClose={() => setIsArenaOpen(false)}
        user={user}
        subject={arenaSubject}
        classLevel={arenaClass}
        examType={arenaExamType}
      />

      <AIDoubtSolver
        isOpen={isDoubtOpen}
        onClose={() => setIsDoubtOpen(false)}
        question={null}
        userAnswer={null}
      />

      <PWAInstallPrompt />
    </div>
  );
}

// ── Root export with ThemeProvider wrapper ────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
