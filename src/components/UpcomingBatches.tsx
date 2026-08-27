import React, { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, Check, Clock3, Repeat, Users, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface BatchItem {
  id?: string;
  tag: string;
  title: string;
  target: string;
  start: string;
  days: string;
  time: string;
  features: string[];
  seats_total?: number;
  seats_left?: number;
  featured?: boolean;
}

const DEFAULT_BATCHES: BatchItem[] = [
  {
    tag: 'Most Popular',
    title: 'Class 10 Board Booster',
    target: 'CBSE & ICSE • Science & Maths',
    start: 'Sep 02, 2026',
    days: 'Mon, Wed, Fri',
    time: '5:30 — 7:00 PM',
    features: ['Daily DPPs & Concept Drills', 'Weekly full-length mock tests', '1-on-1 Doubt solving sessions', 'Exclusive 10-year board pyq archives'],
    seats_total: 25,
    seats_left: 4,
    featured: true,
  },
  {
    tag: 'NEET & JEE Target',
    title: 'Class 12 Science Masterclass',
    target: 'Physics · Chemistry · Mathematics',
    start: 'Sep 09, 2026',
    days: 'Tue, Thu, Sat',
    time: '6:00 — 8:00 PM',
    features: ['Board + Competitive entrance prep', 'Chapter-wise Arena showdowns', 'Previous 15-year solving sprints', 'Mentorship & study analytics'],
    seats_total: 30,
    seats_left: 7,
    featured: false,
  },
  {
    tag: 'Foundation Track',
    title: 'Class 9 Foundation Builder',
    target: 'CBSE & ICSE • Concept Clarity',
    start: 'Sep 16, 2026',
    days: 'Mon — Fri',
    time: '4:00 — 5:30 PM',
    features: ['Concept-first interactive lectures', 'Daily gamified practice sets', 'Monthly Arena tournaments', 'Regular parent progress briefings'],
    seats_total: 20,
    seats_left: 9,
    featured: false,
  },
];

export default function UpcomingBatches() {
  const [batches, setBatches] = useState<BatchItem[]>(DEFAULT_BATCHES);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        // Try fetching from batches table or site_media
        const { data: batchData, error } = await (supabase as any)
          .from('batches')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (!error && batchData && batchData.length > 0) {
          const parsed = batchData.map((b: any) => ({
            id: b.id,
            tag: b.tag || 'Standard',
            title: b.title,
            target: b.target || b.subject || 'All Subjects',
            start: b.start_date || b.start || 'Admissions Open',
            days: b.days || 'Mon, Wed, Fri',
            time: b.time || 'Evening Batch',
            features: Array.isArray(b.features) ? b.features : (b.features ? b.features.split(',').map((s: string) => s.trim()) : ['Comprehensive syllabus coverage', 'Daily practice sheets', 'Weekly evaluations']),
            seats_total: b.seats_total || 25,
            seats_left: b.seats_left !== undefined ? b.seats_left : 6,
            featured: b.is_featured ?? false
          }));
          setBatches(parsed);
        } else {
          // Check if saved under site_media as batch_item
          const { data: mediaBatches } = await (supabase as any)
            .from('site_media')
            .select('*')
            .eq('type', 'batch_item')
            .eq('is_active', true);

          if (mediaBatches && mediaBatches.length > 0) {
            const parsedMedia = mediaBatches.map((m: any) => {
              try {
                return JSON.parse(m.embed_code);
              } catch {
                return null;
              }
            }).filter(Boolean);

            if (parsedMedia.length > 0) {
              setBatches(parsedMedia);
            }
          }
        }
      } catch (err) {
        console.warn('Using default batches fallback:', err);
      }
    };

    fetchBatches();
  }, []);

  return (
    <section id="batches" className="bg-[#f6f7f9] px-5 py-24 text-ink lg:px-8 lg:py-32 dark:bg-[#080e1a] dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-[1240px]">
        
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="section-kicker text-coral flex items-center gap-2">
              <Sparkles size={14} /> Schedule & Timings
            </div>
            <h2 className="mt-4 max-w-[620px] text-4xl font-black tracking-[-.05em] sm:text-6xl">
              Upcoming target<br />
              <span className="text-slate-400">batches.</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-sm leading-6 text-slate-500 dark:text-slate-400">
            Pick a batch. Lock your seat. Batch sizes are strictly capped so every student gets dedicated mentorship.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch, index) => {
            const isPopular = batch.featured;
            const seatsRemaining = batch.seats_left !== undefined ? batch.seats_left : 5;

            return (
              <article
                key={batch.id || batch.title || index}
                className={`relative flex flex-col justify-between overflow-hidden rounded-[2rem] border p-7 sm:p-8 transition duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  isPopular
                    ? 'border-orange-500/40 bg-slate-900 text-white shadow-2xl shadow-orange-500/10'
                    : 'border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white'
                }`}
              >
                {isPopular && (
                  <div className="absolute -right-12 top-7 rotate-45 bg-gradient-to-r from-orange-500 to-amber-500 px-12 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                    Featured
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                      isPopular 
                        ? 'bg-orange-500 text-white shadow-sm' 
                        : 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300'
                    }`}>
                      {batch.tag}
                    </div>

                    {seatsRemaining <= 5 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 animate-pulse">
                        <AlertCircle size={12} /> Only {seatsRemaining} seats left!
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black tracking-tight">{batch.title}</h3>
                  <div className={`mt-1.5 text-sm font-bold ${isPopular ? 'text-orange-200' : 'text-orange-600 dark:text-orange-400'}`}>
                    {batch.target}
                  </div>

                  {/* Timings & Schedule Box */}
                  <div className={`mt-6 space-y-3.5 border-y py-5 text-xs sm:text-sm ${
                    isPopular ? 'border-white/10' : 'border-slate-100 dark:border-slate-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      <CalendarDays size={16} className={isPopular ? 'text-orange-400' : 'text-orange-500'} />
                      <span className="font-semibold">Starts {batch.start}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Repeat size={16} className={isPopular ? 'text-orange-400' : 'text-orange-500'} />
                      <span className="font-semibold">{batch.days}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock3 size={16} className={isPopular ? 'text-orange-400' : 'text-orange-500'} />
                      <span className="font-semibold">{batch.time}</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-6 space-y-3">
                    {batch.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <Check size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className={isPopular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <a
                    href="#contact"
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-black uppercase tracking-wider transition hover:scale-[1.02] active:scale-95 ${
                      isPopular
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600'
                        : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                    }`}
                  >
                    Enroll / Book Demo <ArrowRight size={15} />
                  </a>
                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
