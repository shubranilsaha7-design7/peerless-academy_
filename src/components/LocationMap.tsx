import { Facebook, Instagram, Mail, MapPin, MessageCircle, Navigation } from 'lucide-react';

const WA_NUMBER = '918794130855';
const MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=Indranagar,+Agartala,+Tripura';

export default function LocationMap() {
  return (
    <section id="location" className="relative bg-ink px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <div className="section-kicker text-coral">Visit us / Agartala</div>
            <h2 className="mt-4 text-4xl font-black tracking-[-.05em] sm:text-5xl">
              Indranagar Hub,<br />
              <span className="text-coral">Agartala, Tripura.</span>
            </h2>
            <p className="mt-5 max-w-[420px] text-sm leading-7 text-slate-400">
              Walk in for a counselling session, collect a printed DPP, or sit a diagnostic test — our doors are open six days a week.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 text-coral" /> Indranagar, Agartala, Tripura West — 799006</li>
              <li className="flex items-start gap-3"><MessageCircle size={16} className="mt-0.5 text-coral" /> +91 87941 30855 (WhatsApp preferred)</li>
              <li className="flex items-start gap-3"><Mail size={16} className="mt-0.5 text-coral" /> peerlessacademy.official@gmail.com</li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={MAPS_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl bg-coral px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-white transition hover:brightness-110">
                <Navigation size={14} /> Get directions
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Peerless Academy, I would like to visit the Indranagar centre. Please share timings.')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-white transition hover:brightness-110"
              >
                <MessageCircle size={14} /> WhatsApp us
              </a>
              <a href="https://www.facebook.com/peerlessacademyofficial" target="_blank" rel="noreferrer" aria-label="Peerless Academy on Facebook" className="flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-white transition hover:border-[#1877F2] hover:bg-[#1877F2]">
                <Facebook size={14} /> Facebook
              </a>
              <a href="https://www.instagram.com/peerlessacademyofficial" target="_blank" rel="noreferrer" aria-label="Peerless Academy on Instagram" className="flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-white transition hover:border-coral hover:bg-coral">
                <Instagram size={14} /> Instagram
              </a>
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-white/[.04] shadow-md backdrop-blur-md">
            <div className="aspect-video w-full">
              <iframe
                title="Peerless Academy — Indranagar Hub, Agartala, Tripura"
                src="https://www.google.com/maps?q=Indranagar,+Agartala,+Tripura&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
