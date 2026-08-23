import { motion } from 'framer-motion';
import { Atom, Beaker, Dna, Mail, MessageCircle, Sigma } from 'lucide-react';

const mentors = [
  {
    name: 'Prasenjit Sir',
    role: 'Mathematics Mentor',
    lead: 'Founder & Head Mentor',
    qualification: 'M.Sc. Mathematics · 12+ yrs board & JEE mentoring',
    focus: ['Algebra & Calculus', 'JEE Main / TBJEE', 'Class V–XII Maths'],
    email: 'prasenjit@peerlessacademy.in',
    icon: Sigma,
    slots: 'Doubt window: Mon–Sat, 6:00–7:30 PM',
  },
  {
    name: 'Rahul Sir',
    role: 'Physics Mentor',
    lead: 'Concept clarity specialist',
    qualification: 'M.Sc. Physics · NEET & JEE problem-solving coach',
    focus: ['Mechanics & Optics', 'Numerical drilling', 'Class IX–XII Physics'],
    email: 'rahul@peerlessacademy.in',
    icon: Atom,
    slots: 'Doubt window: Mon–Fri, 7:30–8:30 PM',
  },
  {
    name: 'Tanima Mam',
    role: 'Biology Mentor',
    lead: 'NEET biology strategist',
    qualification: 'M.Sc. Zoology · NCERT-line-by-line specialist',
    focus: ['Human Physiology', 'Genetics & Ecology', 'NEET Biology'],
    email: 'tanima@peerlessacademy.in',
    icon: Dna,
    slots: 'Doubt window: Tue & Thu, 5:00–6:30 PM',
  },
  {
    name: 'Dipjoy Sir',
    role: 'Chemistry Mentor',
    lead: 'Organic & physical chemistry',
    qualification: 'M.Sc. Chemistry · Olympiad & board mentor',
    focus: ['Organic mechanisms', 'Mole concept', 'Class XI–XII Chemistry'],
    email: 'dipjoy@peerlessacademy.in',
    icon: Beaker,
    slots: 'Doubt window: Wed & Sat, 6:00–7:00 PM',
  },
];

const WA_NUMBER = '918794130855';

export default function TeacherHub() {
  return (
    <section id="faculty" className="relative overflow-hidden bg-[#0d1b32] px-5 py-24 lg:px-8 lg:py-32">
      <div className="relative mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="section-kicker text-coral">Faculty / Ask a doubt</div>
            <h2 className="mt-4 max-w-[620px] text-4xl font-black tracking-[-.05em] sm:text-6xl">
              Mentors who<br />
              <span className="text-coral">answer back.</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-sm leading-6 text-slate-400">
            Every mentor keeps a fixed doubt window. Reach them on WhatsApp with a pre-filled subject, or email directly.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mentors.map((m, i) => {
            const Icon = m.icon;
            const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
              `Hi Peerless Academy, I have a doubt for ${m.name} (${m.role}). Topic: `,
            )}`;
            return (
              <motion.article
                key={m.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -8 }}
                className="flex flex-col rounded-[1.5rem] border border-white/10 bg-white/[.05] p-6 backdrop-blur-xl transition hover:border-coral/40 hover:shadow-[0_20px_50px_rgba(255,107,0,.15)]"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-coral/10 p-3 text-coral transition group-hover:bg-coral">
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">0{i + 1}</span>
                </div>

                <h3 className="mt-6 text-xl font-black">{m.name}</h3>
                <div className="mt-1 text-xs font-black uppercase tracking-[.14em] text-coral">{m.role}</div>
                <p className="mt-3 text-xs leading-5 text-slate-400">{m.lead}</p>
                <p className="mt-3 text-xs leading-5 text-slate-300">{m.qualification}</p>

                <ul className="mt-4 space-y-1.5 text-[11px] text-slate-400">
                  {m.focus.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-coral" /> {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-xl border border-white/10 bg-ink/40 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {m.slots}
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-[11px] font-black uppercase tracking-wider text-white transition hover:brightness-110"
                  >
                    <MessageCircle size={14} /> Ask on WhatsApp
                  </a>
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent(`Doubt for ${m.name} — ${m.role}`)}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-white transition hover:border-coral hover:bg-coral"
                  >
                    <Mail size={14} /> Email mentor
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
