import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'Do you provide recorded lectures?',
    a: 'Yes. Every live class is recorded and uploaded to the student portal the same evening, so you can revisit any concept anytime. The upcoming Arena app will also host short revision clips for quick refreshers.',
  },
  {
    q: 'How does the 1v1 Arena work?',
    a: 'The Arena pairs you with a classmate at a similar skill level for a live MCQ battle. You both answer the same questions under a timer, and the winner gains Elo points on the leaderboard. It is designed to make revision feel competitive and fun.',
  },
  {
    q: 'Can I switch batches?',
    a: 'Absolutely. If a batch timing or level does not fit, you can request a switch within the first two weeks at no extra cost. Our team will help you find a slot that works for your schedule.',
  },
  {
    q: 'Are there doubt-clearing sessions?',
    a: 'Yes, daily. Every batch includes dedicated doubt-clearing windows, and students can also raise questions through the portal for written explanations from mentors.',
  },
  {
    q: 'What boards do you cover?',
    a: 'We cover both CBSE and ICSE for Classes 5 to 12, with subject-specific tracks in Physics, Chemistry, Mathematics, and Biology. Entrance-focused tracks (NEET/JEE) are built into the Class 11 and 12 programs.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white px-5 py-24 text-ink lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.42fr_.58fr] lg:items-start">
        <div>
          <div className="section-kicker text-coral">Help / FAQs</div>
          <h2 className="mt-4 text-4xl font-black tracking-[-.05em] sm:text-5xl">
            Questions,<br />
            <span className="text-slate-400">answered.</span>
          </h2>
          <p className="mt-6 max-w-[340px] text-sm leading-6 text-slate-500">
            Still curious about something? Call us at{' '}
            <a href="tel:+918794130855" className="font-bold text-coral">
              +91 87941 30855
            </a>{' '}
            and we'll happily clear it up.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-slate-50 p-5">
            <HelpCircle size={22} className="text-coral" />
            <div className="text-sm font-bold text-ink">More questions? Reach out anytime.</div>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.q}
                className={`overflow-hidden rounded-2xl border transition ${
                  isOpen ? 'border-coral/30 bg-orange-50/40' : 'border-slate-200 bg-white'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-black tracking-[-.01em] text-ink">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-coral' : 'text-slate-400'}`}
                  />
                </button>
                <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                  <div className="faq-answer-inner">
                    <p className="px-6 pb-5 text-sm leading-6 text-slate-600">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
