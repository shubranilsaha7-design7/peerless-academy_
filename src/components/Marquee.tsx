import { AlertCircle } from 'lucide-react';

const tickerText = 'Admissions Open for Session 2026-27  |  Limited Seats for Classes 9-12  |  Call +91 87941 30855 for Early Bird Discounts!';

export default function Marquee() {
  const items = Array.from({ length: 6 }, (_, i) => i);
  return (
    <div className="marquee relative z-[60] flex items-center gap-2 overflow-hidden bg-coral py-2 text-ink">
      <div className="marquee-track">
        {items.concat(items).map((i, index) => (
          <span key={`${i}-${index}`} className="mx-6 flex items-center gap-3 text-[11px] font-black uppercase tracking-[.12em] text-[#0a192f] sm:text-xs">

            <AlertCircle size={13} className="shrink-0 text-[#0a192f]" strokeWidth={2.5} />
            {tickerText}
          </span>
        ))}
      </div>
    </div>
  );
}
