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
        }
      } catch (err) {
        console.error('Error loading broadcast banner:', err);
      }
    };

    fetchBanner();
  }, []);

  if (!banner || dismissed || !banner.message) return null;

  const getThemeClasses = () => {
    switch (banner.theme) {
      case 'cyan':
        return {
          bg: 'bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-cyan-500/30 text-cyan-200',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
          btn: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
        };
      case 'emerald':
        return {
          bg: 'bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-emerald-500/30 text-emerald-200',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
          btn: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
        };
      case 'gold':
        return {
          bg: 'bg-gradient-to-r from-amber-950 via-slate-900 to-yellow-950 border-yellow-500/30 text-amber-200',
          badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
          btn: 'bg-yellow-400 text-slate-950 hover:bg-yellow-300',
        };
      case 'coral':
      default:
        return {
          bg: 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 border-orange-400 text-white shadow-[0_4px_20px_rgba(249,115,22,0.4)]',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
          btn: 'bg-orange-500 text-white hover:bg-orange-600',
        };
    }
  };

  const themeStyles = getThemeClasses();

  return (
      <div className={`relative z-40 w-full border-b px-4 py-3.5 md:py-4 min-h-[56px] md:min-h-[64px] shadow-lg backdrop-blur-md transition-all ${themeStyles.bg}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-xs sm:text-sm">
          
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 relative z-10">
            <Sparkles size={13} className="animate-pulse" />
          </div>

          <div className="flex flex-1 items-center gap-2.5 overflow-hidden relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
            
            {banner.badge && (
              <span className={`hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider relative z-10 ${themeStyles.badge}`}>
                {banner.badge}
              </span>
            )}
  
            <div className="flex-1 overflow-hidden">
              {banner.marqueeEnabled ? (
                <div 
                  className="animate-marquee-track cursor-default text-sm md:text-base font-extrabold tracking-wider"
                  style={{ animationDuration: banner.marqueeSpeed || '25s' }}
                >
                  <span className="pr-12">{banner.message}</span>
                  <span className="pr-12">{banner.message}</span>
                </div>
              ) : (
                <p className="truncate cursor-default text-sm md:text-base font-extrabold tracking-wider">
                  {banner.message}
                </p>
              )}
            </div>
          </div>
  
          <div className="flex items-center gap-2 flex-shrink-0 relative z-10 bg-slate-900/50 backdrop-blur pl-2 rounded-l-2xl">
            {banner.linkUrl && (
              <a
                href={banner.linkUrl}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black shadow-sm transition hover:scale-105 ${themeStyles.btn}`}
              >
                {banner.linkText || 'Learn More'}
                <ArrowRight size={12} />
              </a>
            )}
  
            <button
              onClick={() => setDismissed(true)}
              className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Dismiss banner"
            >
              <X size={15} />
            </button>
          </div>
  
        </div>
      </div>
    );
  }
