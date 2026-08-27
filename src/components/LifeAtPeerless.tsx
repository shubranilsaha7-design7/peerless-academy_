import React, { useEffect, useState } from 'react';
import { Instagram } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function LifeAtPeerless() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [embedHtml, setEmbedHtml] = useState<string | null>(null);
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
          const gallery = data.filter((m: any) => m.type === 'gallery_photo').map((m: any) => m.url);
          const instagram = data.find((m: any) => m.type === 'instagram_embed')?.embed_code;
          
          setPhotos(gallery);
          if (instagram) setEmbedHtml(instagram);
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

  return (
    <section className="bg-slate-950 px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black text-white sm:text-4xl">Media Gallery & Announcements</h2>
          <p className="mt-4 text-sm text-slate-400">Glimpses of our students, events, and culture.</p>
        </div>

        {/* Dynamic Gallery Photos */}
        {photos.length > 0 && (
          <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((src, idx) => (
              <div key={idx} className="group relative aspect-square overflow-hidden rounded-[2rem] bg-slate-900 shadow-xl border border-white/5">
                <img 
                  src={src} 
                  alt={`Peerless Gallery ${idx + 1}`} 
                  className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Instagram / Media Embed */}
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
          
          <div className="relative w-full overflow-hidden rounded-xl bg-slate-800/50 min-h-[400px] flex items-center justify-center border border-white/5">
            {embedHtml ? (
              <div 
                className="w-full h-full flex justify-center items-center overflow-auto"
                dangerouslySetInnerHTML={{ __html: embedHtml }} 
              />
            ) : (
              <div className="text-center p-6">
                <Instagram size={40} className="mx-auto text-slate-500 mb-4 opacity-50" />
                <p className="text-sm font-medium text-slate-400">Instagram Feed Widget Container</p>
                <p className="text-xs text-slate-500 mt-2 max-w-sm">
                  Add your embed code in the Admin Control Panel.
                </p>
              </div>
            )}
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
