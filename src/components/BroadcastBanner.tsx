import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Megaphone, ArrowRight, X, Sparkles } from 'lucide-react';

interface BannerData {
  message: string;
  badge?: string;
  linkText?: string;
  linkUrl?: string;
  theme?: 'coral' | 'cyan' | 'emerald' | 'gold';
  marqueeEnabled?: boolean;
  marqueeSpeed?: string;
}

export default function BroadcastBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('site_media')
          .select('*')
          .eq('type', 'announcement_banner')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          const item = data[0];
          let parsedData: BannerData = { message: '' };
          try {
            parsedData = JSON.parse(item.embed_code || '{}');
          } catch {
            parsedData = { message: item.embed_code || item.url || '' };
          }
          if (item.url && !parsedData.linkUrl) {
            parsedData.linkUrl = item.url;
          }
          if (parsedData.message) {
            setBanner(parsedData);
          }
        } else {
          // Fallback if none in DB
          setBanner({
            message: "NEW: The Kurukshetra Engine is LIVE. 1v1 Ranked Duels active. ELO matching enabled.",
            badge: "LIVE",
            theme: "gold",
            marqueeEnabled: true
          });
        }
      } catch (err) {
        console.error('Error loading broadcast banner:', err);
      }
    };

    fetchBanner();

    const channel = supabase
      .channel('public:site_media_banner')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_media', filter: "type=eq.announcement_banner" }, () => {
        fetchBanner();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!banner || dismissed) return null;

  const content = (
    <>
      {banner.badge && (
        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest text-white shadow-sm flex-shrink-0 flex items-center gap-1">
          <Sparkles size={10} className="text-amber-200" /> {banner.badge}
        </span>
      )}
      <span className="font-bold text-sm text-white tracking-wide flex items-center gap-2">
        {banner.message}
      </span>
      {banner.linkText && (
        <span className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-white bg-black/20 px-3 py-1 rounded-full hover:bg-black/30 transition-colors ml-2 flex-shrink-0">
          {banner.linkText} <ArrowRight size={14} />
        </span>
      )}
    </>
  );

  return (
    <>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: scroll 15s linear infinite;
        }
      `}</style>
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 border-b border-orange-400/50 shadow-md">
        <button 
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1.5 transition-colors"
        >
          <X size={16} />
        </button>
        
        <div className="flex h-12 w-full max-w-full overflow-hidden relative z-10 items-center pl-4 pr-12">
          {banner.marqueeEnabled ? (
            <div className="overflow-hidden w-full flex items-center">
              <div className="animate-marquee items-center gap-8 whitespace-nowrap">
                {/* Duplicate spans for seamless loop */}
                <div className="flex items-center gap-8 shrink-0">{content}</div>
                <div className="flex items-center gap-8 shrink-0">{content}</div>
                <div className="flex items-center gap-8 shrink-0">{content}</div>
                <div className="flex items-center gap-8 shrink-0">{content}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full gap-3">
              {content}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
