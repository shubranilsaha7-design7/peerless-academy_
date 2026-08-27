import React, { useEffect, useState } from 'react';
import { Instagram, Sparkles, Image as ImageIcon, Video, Film } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SmartMediaEmbed from '@/components/SmartMediaEmbed';

export default function LifeAtPeerless() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('site_media')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setMediaItems(data);
        }
      } catch (err) {
        console.error("Failed to fetch site media:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedia();
  }, []);

  if (loading) return null;

  const photos = mediaItems.filter(m => m.type === 'gallery_photo' && m.url);
  const socialEmbeds = mediaItems.filter(m => (m.type === 'instagram_embed' || m.type === 'social_embed') && (m.embed_code || m.url));
  const announcementVideos = mediaItems.filter(m => m.type === 'announcement_video' && m.url);

  // Default photos fallback if none added yet
  const defaultPhotos = [
    '/images/WhatsApp_Image_2026-08-17_at_21.04.26.jpeg',
    '/images/WhatsApp_Image_2026-08-17_at_21.03.36.jpeg',
    '/images/WhatsApp_Image_2026-08-17_at_21.03.11.jpeg',
  ];

  const displayPhotos = photos.length > 0 ? photos.map(p => p.url) : defaultPhotos;

  return (
    <section className="bg-slate-950 px-5 py-20 lg:px-8 border-b border-white/5">
      <div className="mx-auto max-w-[1240px]">
        
        {/* Section Header */}
        <div className="mb-14 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-pink-300">
            <Sparkles size={13} className="text-pink-400" /> Life At Peerless
          </div>
          <h2 className="text-3xl font-black text-white sm:text-5xl tracking-tight">
            Media Gallery & Announcements
          </h2>
          <p className="mt-4 text-sm text-slate-400 max-w-xl mx-auto">
            Experience our interactive lectures, student milestones, campus events, and real-time community updates.
          </p>
        </div>

        {/* ── 1. PHOTO GALLERY GRID ── */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6 text-xs font-black uppercase tracking-wider text-slate-400">
            <ImageIcon size={16} className="text-cyan-400" /> Curated Moments
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayPhotos.map((src, idx) => (
              <div 
                key={idx} 
                className="group relative aspect-square overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl border border-white/10 transition duration-500 hover:border-pink-500/40 hover:-translate-y-1.5"
              >
                <img 
                  src={src} 
                  alt={`Life at Peerless ${idx + 1}`} 
                  className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                  onError={(e) => {
                    // Fallback to placeholder if a bad URL was entered
                    e.currentTarget.src = defaultPhotos[idx % defaultPhotos.length];
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100 flex items-end p-6">
                  <span className="text-xs font-bold text-white tracking-wide">Peerless Academy Campus</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. DYNAMIC SOCIAL & REEL VISUAL EMBEDS ── */}
        <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white shadow-xl shadow-pink-500/20">
                <Instagram size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">@peerlessacademyofficial</h3>
                <p className="text-xs text-slate-400 mt-0.5">Official Instagram Feed & Community Reels</p>
              </div>
            </div>
            <a 
              href="https://instagram.com/peerlessacademyofficial" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-xs font-black text-white shadow-lg shadow-pink-500/25 transition hover:scale-105"
            >
              <Instagram size={15} /> Follow on Instagram
            </a>
          </div>

          {/* Render Rich Visual Embeds */}
          {socialEmbeds.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 items-center justify-center">
              {socialEmbeds.map((embedItem, idx) => (
                <div key={embedItem.id || idx} className="w-full flex justify-center">
                  <SmartMediaEmbed 
                    content={embedItem.embed_code || embedItem.url} 
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-white/10 bg-slate-950/50">
              <Instagram size={40} className="text-pink-400 mb-3 opacity-60 animate-bounce" />
              <h4 className="text-base font-bold text-white">Instagram Media Hub Active</h4>
              <p className="mt-1 text-xs text-slate-400 max-w-md">
                Paste any Instagram Reel, Post URL, or embed code in the Admin Control Panel to display it as an interactive visual player here!
              </p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
