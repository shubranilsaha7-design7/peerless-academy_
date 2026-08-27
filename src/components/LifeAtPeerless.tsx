import React from 'react';
import { Instagram } from 'lucide-react';

const permanentImages = [
  '/images/WhatsApp_Image_2026-08-17_at_21.04.26.jpeg',
  '/images/WhatsApp_Image_2026-08-17_at_21.03.36.jpeg',
  '/images/WhatsApp_Image_2026-08-17_at_21.03.11.jpeg',
];

export default function LifeAtPeerless() {
  return (
    <section className="bg-slate-950 px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black text-white sm:text-4xl">Life at Peerless</h2>
          <p className="mt-4 text-sm text-slate-400">Glimpses of our students, events, and culture.</p>
        </div>

        {/* Curated Permanent Images */}
        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {permanentImages.map((src, idx) => (
            <div key={idx} className="group relative aspect-square overflow-hidden rounded-[2rem] bg-slate-900 shadow-xl border border-white/5">
              <img 
                src={src} 
                alt={`Life at Peerless ${idx + 1}`} 
                className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
            </div>
          ))}
        </div>

        {/* Instagram Auto-Updating Feed */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-6 sm:p-10 shadow-2xl">
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white">
                <Instagram size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">@peerlessacademyofficial</h3>
                <p className="text-sm text-slate-400">Follow us on Instagram</p>
              </div>
            </div>
            <a 
              href="https://instagram.com/peerlessacademyofficial" 
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex rounded-full bg-white/10 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Follow
            </a>
          </div>
          
          {/* 
            Instagram Embed Container 
            Using a responsive iframe or a third-party widget (like Elfsight or Curator.io).
            Since we don't have a specific widget ID, we leave a responsive placeholder 
            that clearly acts as the embed container.
          */}
          <div className="relative w-full overflow-hidden rounded-xl bg-slate-800/50 min-h-[400px] flex items-center justify-center border border-white/5">
            <div className="text-center p-6">
              <Instagram size={40} className="mx-auto text-slate-500 mb-4 opacity-50" />
              <p className="text-sm font-medium text-slate-400">Instagram Feed Widget Container</p>
              <p className="text-xs text-slate-500 mt-2 max-w-sm">
                Insert your Instagram embed script (e.g., Elfsight, SnapWidget, or Curator.io) here.
              </p>
            </div>
          </div>
          
          <a 
            href="https://instagram.com/peerlessacademyofficial" 
            target="_blank" 
            rel="noreferrer"
            className="mt-6 flex w-full justify-center sm:hidden rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
          >
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
