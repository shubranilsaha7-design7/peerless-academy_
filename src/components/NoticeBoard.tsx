import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

type Notice = { date: string; tag: string; body: string };

const notices: Notice[] = [
  { date: '18 Aug', tag: 'Admissions', body: '**Batch 2026–27 admissions open** for Class V–XII, NEET, JEE Main & TBJEE. Limited seats per batch.' },
  { date: '16 Aug', tag: 'Mega Test', body: 'Mega Test for **Madhyamik candidates** this Sunday, 10:00 AM. Carry your admit slip and blue/black pen.' },
  { date: '14 Aug', tag: 'DPP', body: 'Chapter 4 Physics DPP released. Request it on WhatsApp with a single tap from the *Study Hub*.' },
  { date: '10 Aug', tag: 'Event', body: '**Kurukshetra — A Cultural Saga** rehearsals begin. All batches welcome after evening classes.' },
];

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <b key={i} className="text-white">{p.slice(2, -2)}</b>;
    if (p.startsWith('*') && p.endsWith('*')) return <i key={i} className="text-coral">{p.slice(1, -1)}</i>;
    return <span key={i}>{p}</span>;
  });
}

export default function NoticeBoard() {
  return (
    <section id="notices" className="relative bg-[#0d1b32] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="section-kicker text-coral">Notice board / Low bandwidth</div>
            <h2 className="mt-4 text-4xl font-black tracking-[-.05em] sm:text-5xl">
              Announcements, <span className="text-coral">text-first.</span>
            </h2>
          </div>
          <p className="max-w-[340px] text-sm leading-6 text-slate-400">
            Loads instantly even on weak network — pure text updates, no heavy media.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {notices.map((n, i) => (
            <motion.article
              key={n.date + n.tag}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="flex gap-4 rounded-[1.25rem] border border-white/10 bg-white/[.05] p-5 backdrop-blur-xl transition hover:border-coral/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-coral/10 text-coral">
                <Megaphone size={18} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wider">
                  <span className="rounded-full bg-coral px-2 py-0.5 text-white">{n.tag}</span>
                  <span className="text-slate-500">{n.date}</span>
                </div>
                <p className="mt-2.5 text-sm leading-6 text-slate-400">{renderInline(n.body)}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
