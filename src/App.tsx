import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  Atom,
  Award,
  BarChart3,
  Beaker,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  Flame,
  Instagram,
  Layers3,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react';
import Marquee from '@/components/Marquee';
import TrustCounters from '@/components/TrustCounters';
import WallOfFame from '@/components/WallOfFame';
import UpcomingBatches from '@/components/UpcomingBatches';
import ResourceCenter from '@/components/ResourceCenter';
import FAQ from '@/components/FAQ';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import ProgressionHub from '@/components/ProgressionHub';
import DailyBites from '@/components/DailyBites';
import ChallengeHub from '@/components/ChallengeHub';
import LearningPath from '@/components/LearningPath';
import PracticeLab from '@/components/PracticeLab';
import MediaGallery from '@/components/MediaGallery';
import Mentors from '@/components/Mentors';
import Gallery from '@/components/Gallery';
import AuthModal from '@/components/AuthModal';
import MediaGalleryPro from '@/components/MediaGalleryPro';
import TeacherHub from '@/components/TeacherHub';
import HallOfFame from '@/components/HallOfFame';
import SimulationLab from '@/components/SimulationLab';
import NoticeBoard from '@/components/NoticeBoard';
import LocationMap from '@/components/LocationMap';
import StudyHub from '@/components/StudyHub';
import AIChatBot from '@/components/AIChatBot';
const logoImage = '/images/WhatsApp_Image_2026-08-17_at_21.04.26.jpeg';
const admissionImage = '/images/WhatsApp_Image_2026-08-19_at_05.30.17.jpeg';
const founderImage = '/images/WhatsApp_Image_2026-08-19_at_05.30.16.jpeg';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Programs', href: '#programs' },
  { label: 'The Arena', href: '#arena' },
  { label: 'Faculty', href: '#faculty' },
  { label: 'Contact', href: '#contact' },
  { label: 'Practice', href: '#practice' },
  { label: 'Resources', href: '#resources' },
  { label: 'Study Hub', href: '#study-hub' },
  { label: 'Media', href: '#media' },
];

const programs = [
  {
    number: '01',
    eyebrow: 'Classes 05—08',
    title: 'Middle School',
    description: 'Building the Foundation',
    detail: 'Curiosity-led learning that makes every concept feel like an unlock.',
    color: 'coral',
    icon: Layers3,
  },
  {
    number: '02',
    eyebrow: 'Classes 09—10',
    title: 'Secondary',
    description: 'Board Exam Mastery',
    detail: 'Structured practice, sharp revision, and the confidence to ace boards.',
    color: 'blue',
    icon: Target,
  },
  {
    number: '03',
    eyebrow: 'Classes 11—12',
    title: 'Higher Secondary',
    description: 'Board & Entrance Prep',
    detail: 'Go beyond the syllabus with an exam-ready mind and a winning rhythm.',
    color: 'gold',
    icon: Trophy,
  },
];

const arenaFeatures = [
  { icon: Swords, title: 'Live 1v1 MCQ Battles', text: 'Challenge classmates. Think fast. Earn your rank.' },
  { icon: BrainCircuit, title: 'AI-Powered Study Roadmaps', text: 'A smarter route from where you are to where you want to be.' },
  { icon: Flame, title: 'Daily Solving Streaks', text: 'Small wins every day build unstoppable momentum.' },
  { icon: BarChart3, title: 'Real-Time Elo Leaderboards', text: 'See your progress, celebrate the climb, own your arena.' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-ink text-white">
      <div className="fixed inset-x-0 top-0 z-[60]">
        <Marquee />
        <header className="border-b border-white/10 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <a href="#home" className="flex items-center gap-3" aria-label="Peerless Academy home">
            <div className="logo-frame h-11 w-11 overflow-hidden rounded-xl bg-white">
              <img src={logoImage} alt="Peerless Academy logo" className="h-full w-full object-cover" />
            </div>
            <div className="hidden leading-none sm:block">
              <span className="block text-[15px] font-black tracking-[0.16em] text-white">PEERLESS</span>
              <span className="mt-1 block text-[9px] font-semibold tracking-[0.35em] text-coral">ACADEMY</span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="nav-link text-[13px] font-semibold text-slate-300 transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <a href="tel:+918794130855" className="hidden items-center gap-2 rounded-full bg-coral px-5 py-3 text-xs font-black tracking-wide text-white shadow-[0_8px_24px_rgba(255,107,0,.2)] transition hover:-translate-y-0.5 hover:bg-[#ff7b20] sm:flex">
            <Phone size={14} strokeWidth={2.5} /> Call Now: +91 87941 30855
          </a>
          <button 
  onClick={() => setIsAuthOpen(true)}
  className="ml-4 px-6 py-2 border-2 border-orange-600 text-orange-500 hover:bg-orange-600 hover:text-white rounded-full font-bold transition-all duration-300 shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.6)]"
>
  Sign In / Register
</button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-white lg:hidden" aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-white/10 bg-ink px-5 py-5 lg:hidden">
            <div className="mx-auto flex max-w-[1240px] flex-col gap-1">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5">{item.label}</a>
              ))}
              <a href="tel:+918794130855" className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-coral px-4 py-3 text-sm font-bold">Call Now: +91 87941 30855</a>
            </div>
          </div>
        )}
      </header>
      </div>

      <main>
        <section id="home" className="hero-grid relative flex min-h-[760px] items-center px-5 pb-24 pt-36 lg:min-h-[820px] lg:px-8 lg:pt-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(255,107,0,.14),transparent_28%),radial-gradient(circle_at_14%_70%,rgba(39,91,159,.16),transparent_25%)]" />
          <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-coral/30 bg-coral/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-200"><Sparkles size={13} className="text-coral" /> Agartala's new standard in learning</div>
              <h1 className="max-w-[720px] text-[clamp(3.2rem,7.5vw,6.5rem)] font-black leading-[.94] tracking-[-.065em]">You don't rise<br /><span className="text-coral">by watching.</span><br />You rise by solving.</h1>
              <p className="mt-8 max-w-[600px] text-base leading-7 text-slate-300 sm:text-lg">Agartala's premier science & math coaching for Classes 5 to 12. Master your CBSE & ICSE boards and dominate competitive exams with our gamified learning approach.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#contact" className="group flex items-center justify-center gap-3 rounded-full bg-coral px-7 py-4 text-sm font-black text-white shadow-[0_12px_35px_rgba(255,107,0,.22)] transition hover:-translate-y-1 hover:bg-[#ff7b20]">Book a Free Demo <ArrowRight size={17} className="transition group-hover:translate-x-1" /></a>
                <a href="#programs" className="flex items-center justify-center gap-3 rounded-full border border-white/25 px-7 py-4 text-sm font-black text-white transition hover:border-coral hover:text-orange-200">Explore Programs <ChevronDown size={16} /></a>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-5 border-t border-white/10 pt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                <span className="flex items-center gap-2"><Check size={15} className="text-coral" /> Classes 5—12</span><span className="flex items-center gap-2"><Check size={15} className="text-coral" /> CBSE & ICSE</span><span className="flex items-center gap-2"><Check size={15} className="text-coral" /> 100% Concept Clarity</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[475px] lg:ml-auto">
              <div className="absolute -inset-5 rounded-[2.5rem] border border-coral/20 bg-coral/5 blur-sm" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-navy shadow-2xl">
                <img src={admissionImage} alt="Peerless Academy admission open" className="h-[480px] w-full object-cover object-top opacity-90 transition duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7"><div className="mb-2 text-xs font-black uppercase tracking-[.2em] text-coral">2026—27 Admissions Open</div><div className="text-2xl font-black">Your edge starts here.</div></div>
              </div>
              <div className="float-card absolute -bottom-7 -left-7 hidden items-center gap-3 rounded-2xl border border-white/15 bg-[#152541]/90 px-4 py-3 shadow-xl backdrop-blur-md sm:flex"><div className="rounded-xl bg-coral/15 p-2.5 text-coral"><Award size={21} /></div><div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trusted mentorship</div><div className="text-sm font-black">Learn. Solve. Lead.</div></div></div>
              <div className="absolute -right-4 top-10 rounded-2xl border border-white/15 bg-[#152541]/90 px-4 py-3 shadow-xl backdrop-blur-md"><div className="flex items-center gap-2 text-xs font-black"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> Arena is loading</div><div className="mt-1 text-[10px] text-slate-400">Your next challenge awaits</div></div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0d1b32] px-5 py-6 lg:px-8"><div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex items-center gap-3 text-xs font-black uppercase tracking-[.15em] text-slate-300"><span className="h-2 w-2 rounded-full bg-coral" /> Built for the curious</div><div className="flex flex-wrap gap-5 text-sm font-bold text-white/80 sm:gap-10"><span>01 / Deep concepts</span><span>02 / Daily practice</span><span>03 / Visible progress</span></div><a href="#arena" className="flex items-center gap-2 text-xs font-black uppercase tracking-[.15em] text-coral">Enter the arena <ArrowRight size={14} /></a></div></section>

        <ProgressionHub />

        <TrustCounters />

        <WallOfFame />

        <section id="programs" className="bg-[#f6f7f9] px-5 py-24 text-ink lg:px-8 lg:py-32"><div className="mx-auto max-w-[1240px]"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><div className="section-kicker text-coral">01 / The academics</div><h2 className="mt-4 max-w-[620px] text-4xl font-black tracking-[-.05em] sm:text-6xl">A stronger base.<br /><span className="text-slate-400">A higher ceiling.</span></h2></div><p className="max-w-[360px] text-sm leading-6 text-slate-500">No shortcuts. No noise. Just a clear path from first principles to fearless problem solving.</p></div><div className="mt-14 grid gap-5 lg:grid-cols-3">{programs.map((program) => { const Icon = program.icon; return <article key={program.number} className={`program-card ${program.color} group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-2xl`}><div className="flex items-start justify-between"><span className="text-sm font-black text-slate-300">{program.number}</span><div className="rounded-xl bg-slate-100 p-3 transition group-hover:bg-ink group-hover:text-white"><Icon size={22} /></div></div><div className="mt-16 text-[10px] font-black uppercase tracking-[.2em] text-slate-400">{program.eyebrow}</div><h3 className="mt-3 text-3xl font-black tracking-[-.04em]">{program.title}</h3><div className="mt-2 text-lg font-bold text-coral">{program.description}</div><p className="mt-5 max-w-[290px] text-sm leading-6 text-slate-500">{program.detail}</p><a href="#contact" className="mt-8 flex w-fit items-center gap-2 text-xs font-black uppercase tracking-[.15em] text-ink">View program <ArrowRight size={15} className="transition group-hover:translate-x-1" /></a><div className="program-orb absolute -bottom-20 -right-14 h-44 w-44 rounded-full opacity-20 transition group-hover:scale-125" /></article>; })}</div></div></section>

        <UpcomingBatches />

        <DailyBites />

        <ChallengeHub />

        <LearningPath />

        <section id="arena" className="relative overflow-hidden bg-ink px-5 py-24 lg:px-8 lg:py-32"><div className="arena-glow absolute -right-20 top-20 h-[420px] w-[420px] rounded-full bg-coral/20 blur-[120px]" /><div className="relative mx-auto max-w-[1240px]"><div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><div className="section-kicker text-coral">03 / The arena</div><h2 className="mt-4 max-w-[680px] text-4xl font-black tracking-[-.05em] sm:text-6xl">Learning is a<br /><span className="text-coral">competitive sport.</span></h2></div><div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"><div className="rounded-lg bg-coral/15 p-2 text-coral"><Zap size={18} /></div><div><div className="text-xs font-black">Coming soon</div><div className="text-[11px] text-slate-400">Peerless mobile app</div></div></div></div><p className="mt-8 max-w-[530px] text-sm leading-6 text-slate-400">A fresh way to practice, compete, and stay consistent. Turn your study time into a game you can't wait to play.</p><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{arenaFeatures.map((feature, index) => { const Icon = feature.icon; return <article key={feature.title} className="arena-card group rounded-[1.5rem] border border-white/10 bg-white/[.045] p-6 transition hover:-translate-y-2 hover:border-coral/40 hover:bg-white/[.08]"><div className="flex items-start justify-between"><div className="rounded-xl bg-coral/10 p-3 text-coral transition group-hover:bg-coral group-hover:text-white"><Icon size={21} /></div><span className="text-[10px] font-black text-slate-600">0{index + 1}</span></div><h3 className="mt-12 text-lg font-black leading-tight">{feature.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{feature.text}</p></article>; })}</div></div></section>

        <ResourceCenter />

        <PracticeLab />

        <MediaGalleryPro />

        <TeacherHub />

        <HallOfFame />

        <SimulationLab />

        <StudyHub />

        <NoticeBoard />

        <LocationMap />

        <MediaGallery />

        <FAQ />

        <section id="contact" className="bg-[#f6f7f9] px-5 py-24 text-ink lg:px-8 lg:py-32"><div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-start"><div><div className="section-kicker text-coral">04 / Your next move</div><h2 className="mt-4 text-4xl font-black tracking-[-.05em] sm:text-6xl">Start your<br /><span className="text-slate-400">rise today.</span></h2><p className="mt-6 max-w-[400px] text-sm leading-6 text-slate-500">Tell us a little about your goals. Our team will call you back to find the right fit.</p><div className="mt-10 space-y-5"><a href="tel:+918794130855" className="flex items-center gap-4 text-sm font-bold hover:text-coral"><span className="rounded-xl bg-white p-3 text-coral shadow-sm"><Phone size={18} /></span>+91 87941 30855</a><a href="https://instagram.com/peerlessacademyofficial" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-sm font-bold hover:text-coral"><span className="rounded-xl bg-white p-3 text-coral shadow-sm"><Instagram size={18} /></span>@peerlessacademyofficial</a><div className="flex items-center gap-4 text-sm font-bold"><span className="rounded-xl bg-white p-3 text-coral shadow-sm"><BookOpen size={18} /></span>Indranagar, Agartala, Tripura</div></div></div><div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,.08)] sm:p-10">{submitted ? <div className="flex min-h-[410px] flex-col items-center justify-center text-center"><div className="rounded-full bg-emerald-50 p-5 text-emerald-600"><Check size={34} /></div><h3 className="mt-6 text-3xl font-black">You're on your way.</h3><p className="mt-3 max-w-[340px] text-sm leading-6 text-slate-500">Thanks for reaching out. A Peerless Academy mentor will call you shortly to arrange your free demo.</p><button onClick={() => setSubmitted(false)} className="mt-8 text-xs font-black uppercase tracking-wider text-coral">Send another enquiry</button></div> : <form onSubmit={handleSubmit}><div className="mb-8 flex items-center justify-between"><div><div className="text-xs font-black uppercase tracking-[.2em] text-coral">Free counselling</div><h3 className="mt-2 text-2xl font-black">Make an enquiry</h3></div><MessageCircle className="text-slate-200" size={30} /></div><div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Student name<input required name="studentName" type="text" placeholder="Your child's name" /></label><label className="field-label">Guardian name<input required name="guardianName" type="text" placeholder="Parent / guardian name" /></label><label className="field-label">Phone number<input required name="phone" type="tel" placeholder="+91" /></label><label className="field-label">Class<select required name="class"><option value="">Select class</option>{[5, 6, 7, 8, 9, 10, 11, 12].map((grade) => <option key={grade} value={grade}>Class {grade}</option>)}</select></label><label className="field-label sm:col-span-2">Message<textarea name="message" rows={3} placeholder="What would you like to know?" /></label></div><button type="submit" className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-coral px-5 py-4 text-sm font-black text-white transition hover:bg-[#ff7b20]">Submit Enquiry <ArrowRight size={17} /></button><p className="mt-4 text-center text-[11px] text-slate-400">No pressure. Just a conversation about your child's next step.</p></form>}</div></div></section>
      </main>

      <AIChatBot />

      <WhatsAppWidget />

      <footer className="border-t border-white/10 bg-ink px-5 py-12 lg:px-8"><div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-10 md:flex-row md:items-end"><div><a href="#home" className="flex items-center gap-3"><div className="h-10 w-10 overflow-hidden rounded-xl bg-white"><img src={logoImage} alt="Peerless Academy logo" className="h-full w-full object-cover" /></div><div className="leading-none"><span className="block text-sm font-black tracking-[.15em]">PEERLESS</span><span className="mt-1 block text-[8px] font-semibold tracking-[.32em] text-coral">ACADEMY</span></div></a><p className="mt-6 max-w-[290px] text-xs leading-5 text-slate-500">Choose us, be a step ahead. Building better minds and brighter futures in Agartala.</p></div><div className="grid gap-8 text-xs text-slate-400 sm:grid-cols-3"><div><div className="mb-3 font-black uppercase tracking-wider text-white">Visit</div><div>Indranagar, Agartala</div><div>Tripura, India</div></div><div><div className="mb-3 font-black uppercase tracking-wider text-white">Connect</div><a href="tel:+918794130855" className="block hover:text-coral">+91 87941 30855</a><a href="mailto:hello@peerlessacademy.in" className="mt-1 block hover:text-coral">hello@peerlessacademy.in</a></div><div><div className="mb-3 font-black uppercase tracking-wider text-white">Follow</div><a href="https://instagram.com/peerlessacademyofficial" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-coral"><Instagram size={14} /> Instagram</a></div></div></div><div className="mx-auto mt-10 max-w-[1240px] border-t border-white/10 pt-5 text-[10px] uppercase tracking-wider text-slate-600">© 2026 Peerless Academy. Made for the next breakthrough.</div></footer>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} /></div>
  );
}

export default App;
