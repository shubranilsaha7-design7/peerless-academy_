import { FormEvent, useState } from 'react';
import { Check, Download, FileText, Lock, X } from 'lucide-react';

import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const resources = [
  { title: 'CBSE Class 10 PYQs', subtitle: 'Last 5 years, solved', tag: 'PYQ', icon: FileText, link: 'https://example.com/pyq10.pdf' },
  { title: 'ICSE Class 12 Formula Sheets', subtitle: 'Physics • Chem • Math', tag: 'Formula', icon: FileText, link: 'https://example.com/formula12.pdf' },
  { title: 'NEET Physics Quick Notes', subtitle: 'Rapid revision pack', tag: 'Notes', icon: FileText, link: 'https://example.com/neet-physics.pdf' },
  { title: 'Class 12 Math DPP Set', subtitle: 'Daily practice problems', tag: 'DPP', icon: FileText, link: 'https://example.com/dpp12.pdf' },
];

export default function ResourceCenter({ 
  user, 
  addToast,
  onDownloadSuccess
}: { 
  user: User | null; 
  addToast?: (msg: string, type: 'success'|'error') => void;
  onDownloadSuccess?: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!active) return;
    setLoading(true);

    try {
      const selectedResource = resources.find(r => r.title === active);
      
      const { data, error } = await supabase.functions.invoke('request-download', {
        body: {
          phone,
          resource_name: active,
          resource_link: selectedResource?.link || 'https://example.com/resource.pdf',
          user_id: user?.id || null
        }
      });

      if (error) throw error;
      
      setDone(true);
      if (addToast) addToast(data?.message || 'Resource sent to your WhatsApp!', 'success');
      if (onDownloadSuccess) onDownloadSuccess();
    } catch (err: any) {
      console.error('Download request failed:', err);
      if (addToast) addToast(err?.message || 'Failed to request resource. You might be rate-limited.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setActive(null);
    setPhone('');
    setDone(false);
  };

  return (
    <section id="resources" className="relative overflow-hidden bg-ink px-5 py-24 lg:px-8 lg:py-32">
      <div className="arena-glow absolute -right-20 bottom-10 h-[380px] w-[380px] rounded-full bg-coral/15 blur-[120px]" />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="section-kicker text-coral">Free / Resource center</div>
            <h2 className="mt-4 max-w-[620px] text-4xl font-black tracking-[-.05em] sm:text-6xl">
              Grab free study<br />
              <span className="text-coral">material & PYQs.</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-sm leading-6 text-slate-400">
            Enter your phone number once and unlock our entire resource vault. No spam, ever.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((r) => {
            const Icon = r.icon;
            return (
              <article
                key={r.title}
                className="group flex flex-col rounded-[1.5rem] border border-white/10 bg-white/[.045] p-6 backdrop-blur-md transition hover:-translate-y-2 hover:border-coral/40 hover:bg-white/[.07]"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-coral/10 p-3 text-coral transition group-hover:bg-coral group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    {r.tag}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-black leading-tight">{r.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{r.subtitle}</p>
                <button
                  onClick={() => setActive(r.title)}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:border-coral hover:bg-coral"
                >
                  <Download size={15} /> Download PDF
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {active && (
        <div
          className="modal-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="modal-panel relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-7 text-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className="absolute right-4 top-4 text-slate-400 hover:text-ink" aria-label="Close">
              <X size={20} />
            </button>

            {done ? (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="rounded-full bg-emerald-50 p-4 text-emerald-600">
                  <Check size={28} />
                </div>
                <h3 className="mt-5 text-2xl font-black">Unlock successful!</h3>
                <p className="mt-2 max-w-[300px] text-sm text-slate-500">
                  Your download link for <span className="font-bold text-ink">{active}</span> has been sent to your WhatsApp.
                </p>
                <button onClick={closeModal} className="mt-6 rounded-xl bg-coral px-5 py-3 text-sm font-black text-white">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-coral">
                  <Lock size={12} /> Quick unlock
                </div>
                <h3 className="text-2xl font-black">Get {active}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Enter your phone number and we'll send the PDF straight to your WhatsApp.
                </p>
                <form onSubmit={handleUnlock} className="mt-6 space-y-4">
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 phone number"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-ink outline-none transition focus:border-coral focus:bg-white focus:ring-2 focus:ring-coral/20"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#ff7b20] disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <Download size={16} /> Unlock & Download
                      </>
                    )}
                  </button>
                </form>
                <p className="mt-4 text-center text-[11px] text-slate-400">
                  We only use your number to share the resource. No spam.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
