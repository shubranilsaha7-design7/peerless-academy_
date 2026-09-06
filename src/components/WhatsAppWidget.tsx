import { MessageCircle } from 'lucide-react';
import { getFacultyWhatsAppLink } from '../utils/faculty';

export default function WhatsAppWidget() {
  return (
    <a
      href={getFacultyWhatsAppLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Peerless Academy on WhatsApp"
      className="wa-pulse fixed bottom-6 right-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,.4)] transition hover:scale-110"
    >
      <MessageCircle size={26} fill="currentColor" className="text-white" />
    </a>
  );
}
