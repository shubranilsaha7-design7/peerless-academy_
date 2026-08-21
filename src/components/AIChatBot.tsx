import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';

type Msg = { id: number; role: 'user' | 'assistant'; text: string };

const GREETING =
  "Hi! I'm the Peerless AI Assistant. Need help with courses, DPPs, or admissions?";

const KB: { match: RegExp; reply: string }[] = [
  { match: /(fee|fees|price|cost|charge)/i, reply: 'Fees depend on the class and batch. Class V–VIII starts at ₹800/month, IX–X at ₹1,200/month, and XI–XII (with NEET/JEE modules) at ₹1,800/month. Tap "Chat on WhatsApp Business" for the exact 2026–27 fee sheet.' },
  { match: /(admission|enroll|join|register|seat)/i, reply: 'Admissions for the 2026–27 batch are open for Classes V–XII, NEET, JEE Main and TBJEE. Seats are capped per batch — share your class and preferred timing and our team will reserve one for you.' },
  { match: /(dpp|practice|worksheet|question)/i, reply: 'DPPs (Daily Practice Problems) are released every evening. Open the Study Hub, pick your class and subject, and you get 5 fresh MCQs with instant solutions. Wrong answers move automatically to your Mistake Vault.' },
  { match: /(mock|test|exam|cbt|nta)/i, reply: 'Our NTA-style mock engine gives you a fullscreen CBT layout, a countdown timer, a question palette and +4/−1 scoring. Start one from the Study Hub → Mock Exam tab.' },
  { match: /(neet|jee|entrance)/i, reply: 'For NEET/JEE we run concept classes, weekly full-length mocks and a rank-projection dashboard. The Target 2027 countdown in the Study Hub keeps your daily plan honest.' },
  { match: /(teacher|faculty|mentor|doubt)/i, reply: 'Prasenjit Sir (Maths), Rahul Sir (Physics), Tanima Mam (Biology) and Dipjoy Sir (Chemistry) each keep a fixed doubt window. See the Faculty section to email or WhatsApp them directly.' },
  { match: /(location|address|where|map|agartala)/i, reply: 'We are at Indranagar, Agartala, Tripura West — 799006. The Visit Us section has a live map with one-click directions.' },
  { match: /(timing|schedule|batch|time)/i, reply: 'Batches run morning (6:30–8:30 AM) and evening (4:00–8:30 PM), six days a week. Tell me your class and we will suggest the best slot.' },
];

function kbReply(input: string): string {
  const hit = KB.find((k) => k.match.test(input));
  return (
    hit?.reply ??
    "I can help with courses, batches, fees, DPPs, mock exams, faculty doubt windows and admissions. Ask me any of those — or tap the WhatsApp button and a mentor will reply personally."
  );
}

/** Academy FAQs answer instantly offline; anything academic goes to the AI doubt solver. */
async function getReply(input: string): Promise<string> {
  const hit = KB.find((k) => k.match.test(input));
  if (hit) return hit.reply;
  try {
    return await askDoubtSolver(input);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (/402|credit/i.test(message)) {
      return 'The AI tutor is out of credits right now. Ping us on WhatsApp and a mentor will solve your doubt personally.';
    }
    if (/429|rate/i.test(message)) {
      return 'A lot of students are asking right now — please try again in a few seconds.';
    }
    return kbReply(input);
  }
}


export default function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, role: 'assistant', text: GREETING }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [streamed, setStreamed] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, streamed]);

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput('');
    setMessages((m) => [...m, { id: Date.now(), role: 'user', text }]);
    setTyping(true);
    const reply = await mockReply(text);
    setTyping(false);

    // simulate token streaming
    const words = reply.split(' ');
    let acc = '';
    for (let i = 0; i < words.length; i++) {
      acc += (i ? ' ' : '') + words[i];
      setStreamed(acc);
      await new Promise((r) => setTimeout(r, 22));
    }
    setStreamed('');
    setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', text: reply }]);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 18 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="fixed bottom-24 right-4 z-[90] flex h-[520px] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md sm:right-6"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-coral/15 p-2 text-coral"><Bot size={18} /></div>
                <div>
                  <div className="text-sm font-black text-white">Peerless AI Assistant</div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close assistant" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-6 ${
                      m.role === 'user'
                        ? 'rounded-br-md bg-coral text-white'
                        : 'rounded-bl-md border border-slate-800 bg-slate-800/70 text-slate-200'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {streamed && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-slate-800 bg-slate-800/70 px-4 py-2.5 text-[13px] leading-6 text-slate-200">
                    {streamed}
                    <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-coral align-middle" />
                  </div>
                </div>
              )}

              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-800 bg-slate-800/70 px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                        className="h-1.5 w-1.5 rounded-full bg-coral"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 px-4 py-3">
              <a
                href={`https://wa.me/918794130855?text=${encodeURIComponent('Hi Peerless Academy, I would like to enrol for the 2026–27 batch. My class: ')}`}
                target="_blank"
                rel="noreferrer"
                className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-white transition hover:brightness-110"
              >
                <MessageCircle size={14} /> Chat on WhatsApp Business
              </a>
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Ask about courses, DPPs, admissions…"
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-800/60 px-4 py-3 text-[13px] text-white outline-none placeholder:text-slate-500 focus:border-coral"
                />
                <button
                  onClick={send}
                  disabled={typing || !input.trim()}
                  aria-label="Send message"
                  className="rounded-xl bg-coral p-3 text-white transition hover:brightness-110 disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Peerless AI Assistant"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={{ boxShadow: ['0 0 0 0 rgba(255,107,0,.45)', '0 0 0 14px rgba(255,107,0,0)'] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="fixed bottom-24 right-6 z-[85] flex h-14 w-14 items-center justify-center rounded-full bg-coral text-white shadow-[0_10px_30px_rgba(255,107,0,.4)]"
      >
        {open ? <X size={24} /> : <Sparkles size={24} />}
      </motion.button>
    </>
  );
}
