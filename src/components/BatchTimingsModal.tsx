import { useEffect } from 'react';
import { X } from 'lucide-react';
import Latex from 'react-latex-next';

export default function BatchTimingsModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      id="batchModal"
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/85 z-[9999] animate-fade-in"
      style={{
        display: 'flex',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0f172a] text-[#f8fafc] shadow-xl backdrop-blur-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white z-50 p-2"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Glowing Indian tricolor border */}
        <div className="absolute inset-0 rounded-xl border-4 border-transparent bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] opacity-50 bg-clip-border pointer-events-none" style={{ mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />

        {/* Content */}
        <div className="relative p-6 sm:p-8 space-y-4 text-base sm:text-lg">
          <h2 className="text-2xl font-black text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] to-[#FFFFFF]">
            Batch Timings (Science &amp; Mathematics)
          </h2>

          <div className="space-y-4">
            <p className="font-medium bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <span className="font-bold text-cyan-400">Class V:</span> Thu (7-8:30 AM), Sun (10-11:30 AM), Mon (6:30-8 AM)
            </p>
            <p className="font-medium bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <span className="font-bold text-cyan-400">Class VI:</span> Thu (7 AM), Sun (10 AM), Sat (3:30 PM)
            </p>
            <p className="font-medium bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <span className="font-bold text-cyan-400">Class VII:</span> Mon (7-8:30 AM), Wed (7-8:30 AM), Sat (3:30-5 PM)
            </p>
            <p className="font-medium bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <span className="font-bold text-cyan-400">Class VIII:</span> Sun (8:30-10 AM), Tue (6:45-8:30 AM), Thu (5:45-7:15 PM)
            </p>

            <div className="font-medium bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <span className="font-bold text-cyan-400 block mb-1">Class IX:</span>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-slate-300 ml-2">
                <li><span className="text-white">Math:</span> Sun (7-8:30 AM), Thu (7:15-8:45 PM)</li>
                <li><span className="text-white">Phy/Chem:</span> Mon (5:30-7:15 PM Chem), Tue (5:30-7 PM Phy)</li>
                <li><span className="text-white">Bio:</span> Sun (8:30-10 AM), Sat (6-7:30 PM)</li>
              </ul>
            </div>

            <div className="font-medium bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <span className="font-bold text-cyan-400 block mb-1">Class X:</span>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-slate-300 ml-2">
                <li><span className="text-white">Math:</span> Wed (5:30-7 PM), Fri (7:30-9 PM), Sat (7-8:30 AM)</li>
                <li><span className="text-white">Phy/Chem:</span> Mon (7-8:30 PM Chem), Sat (8:40-10 AM Phy)</li>
                <li><span className="text-white">Bio:</span> Sun (7-8:30 AM), Sat (4-5:30 PM)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
