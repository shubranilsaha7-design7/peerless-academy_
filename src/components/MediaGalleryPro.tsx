import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Play, Sparkles } from 'lucide-react';

type MediaItem = {
  id: string;
  type: 'photo' | 'video';
  src: string;
  poster?: string;
  title: string;
  caption: string;
  category: 'mentors' | 'exams' | 'fests' | 'quizzes' | 'classes';
};

const categories = [
  { id: 'all', label: 'All' },
  { id: 'mentors', label: 'Teachers & Mentors' },
  { id: 'exams', label: 'Tests & Exams' },
  { id: 'fests', label: 'Fests & Events' },
  { id: 'quizzes', label: 'Science Quizzes' },
  { id: 'classes', label: 'Daily Classes' },
] as const;

const items: MediaItem[] = [
  { id: 'mentors-banner', type: 'photo', src: '/images/gallery/mentors-banner.jpeg', title: 'Our Expert Guidance', caption: 'Rahul Sir, Tanima Mam, Prasenjit Sir & Dipjoy Sir', category: 'mentors' },
  { id: 'admission', type: 'photo', src: '/images/gallery/admission-poster.jpeg', title: 'Batch 2026–27', caption: 'Courses for Class V–XII, NEET, JEE Main & TBJEE', category: 'mentors' },
  { id: 'exam-session', type: 'photo', src: '/images/gallery/exam-session.jpeg', title: 'Written Test Drill', caption: 'Focused, invigilated practice tests every week', category: 'exams' },
  { id: 'mega-test', type: 'photo', src: '/images/gallery/mega-test.png', title: 'Mega Test — Madhyamik', caption: 'Full-length exam-hall simulation for board candidates', category: 'exams' },
  { id: 'fame', type: 'photo', src: '/images/gallery/wall-of-fame.jpeg', title: 'Wall of Fame', caption: 'Published scorecards of our 2026 achievers', category: 'exams' },
  { id: 'kurukshetra', type: 'photo', src: '/images/gallery/kurukshetra.png', title: 'Kurukshetra — A Cultural Saga', caption: 'Our annual fest honouring the past, inspiring the future', category: 'fests' },
  { id: 'celebration', type: 'photo', src: '/images/gallery/celebration.jpeg', title: 'Celebration Day', caption: 'Small wins, big cheers — the Peerless way', category: 'fests' },
  { id: 'g20-visit', type: 'photo', src: '/images/gallery/class-hall.jpeg', title: 'Science Quiz Squad', caption: 'Quiz and exhibition teams before a session', category: 'quizzes' },
  { id: 'class-hall', type: 'photo', src: '/images/gallery/class-hall.jpeg', title: 'Daily Class — Main Hall', caption: 'Concept-first teaching with full-batch attention', category: 'classes' },
  { id: 'class-reel', type: 'video', src: '/videos/daily-class.mp4', poster: '/images/gallery/class-hall.jpeg', title: 'Inside a Live Class', caption: 'Drop daily-class.mp4 into /public/videos to play', category: 'classes' },
  { id: 'fest-reel', type: 'video', src: '/videos/kurukshetra.mp4', poster: '/images/gallery/kurukshetra.png', title: 'Kurukshetra Highlights', caption: 'Drop kurukshetra.mp4 into /public/videos to play', category: 'fests' },
];

function VideoCard({ item }: { item: MediaItem }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="relative flex h-[260px] w-full items-center justify-center overflow-hidden rounded-xl bg-white/[.04]">
        {item.poster && <img src={item.poster} alt={item.title} className="absolute inset-0 h-full w-full object-cover opacity-30" />}
        <div className="relative flex flex-col items-center gap-2 rounded-2xl border border-white/15 bg-ink/70 px-6 py-5 text-center backdrop-blur-md">
          <Play size={22} className="text-coral" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">Video coming soon</span>
        </div>
      </div>
    );
  }

  return (
    <video
      controls
      preload="metadata"
      poster={item.poster}
      onError={() => setFailed(true)}
      className="h-[260px] w-full rounded-xl bg-black object-cover"
    >
      <source src={item.src} type="video/mp4" />
    </video>
  );
}

export default function MediaGalleryPro() {
  const [tab, setTab] = useState<string>('all');
  const visible = tab === 'all' ? items : items.filter((i) => i.category === tab);

  return (
    <section id="media" className="relative overflow-hidden bg-ink px-5 py-24 lg:px-8 lg:py-32">
      <div className="arena-glow absolute -left-24 bottom-0 h-[380px] w-[380px] rounded-full bg-coral/15 blur-[120px]" />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="section-kicker text-coral">Media / Campus life</div>
            <h2 className="mt-4 max-w-[620px] text-4xl font-black tracking-[-.05em] sm:text-6xl">
              Photos, reels and<br />
              <span className="text-coral">proud moments.</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-sm leading-6 text-slate-400">
            Mentors, mega tests, fests, quizzes and everyday classes — filtered the way you want to see them.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setTab(c.id)}
              className={`rounded-full border px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                tab === c.id
                  ? 'border-coral bg-coral text-white shadow-[0_10px_25px_rgba(255,107,0,.25)]'
                  : 'border-white/10 bg-white/[.04] text-slate-300 backdrop-blur-md hover:border-coral/40 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.figure
                key={item.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28 }}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-xl border border-white/10 bg-white/[.045] p-3 shadow-md backdrop-blur-md transition hover:border-coral/40 hover:shadow-[0_18px_45px_rgba(255,107,0,.14)]"
              >
                <div className="relative overflow-hidden rounded-xl">
                  {item.type === 'photo' ? (
                    <>
                      <img src={item.src} alt={item.title} loading="lazy" className="h-[260px] w-full object-cover transition duration-700 group-hover:scale-105" />
                      <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/75 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-slate-200 backdrop-blur-md">
                        <Camera size={11} /> Photo
                      </span>
                    </>
                  ) : (
                    <>
                      <VideoCard item={item} />
                      <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-coral/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                        <Play size={11} /> Video
                      </span>
                    </>
                  )}
                </div>
                <figcaption className="px-2 py-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.16em] text-coral">
                    <Sparkles size={12} /> {categories.find((c) => c.id === item.category)?.label}
                  </div>
                  <div className="mt-2 text-base font-black text-white">{item.title}</div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{item.caption}</p>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
