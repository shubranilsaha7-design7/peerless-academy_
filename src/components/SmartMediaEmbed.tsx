import React from 'react';
import { Instagram, Video, ExternalLink, Play, Sparkles } from 'lucide-react';

interface SmartMediaEmbedProps {
  content: string; // URL or raw embed HTML/iframe
  className?: string;
}

export default function SmartMediaEmbed({ content, className = '' }: SmartMediaEmbedProps) {
  if (!content || !content.trim()) return null;

  const trimmed = content.trim();

  // Extract advanced parameters
  const hideHeader = trimmed.includes('hide_header=true') || trimmed.includes('hide_ig_header=true');
  const hideFooter = trimmed.includes('hide_footer=true');
  const fullFrame = trimmed.includes('full_frame=true');

  const baseWrapperStyles = fullFrame 
    ? 'w-full h-full object-cover rounded-none' 
    : 'relative w-full overflow-hidden rounded-2xl bg-transparent shadow-xl';

  // 1. Check if it's already an <iframe> HTML code snippet
  if (trimmed.toLowerCase().includes('<iframe') || trimmed.toLowerCase().includes('</iframe>')) {
    return (
      <div 
        className={`w-full flex justify-center items-center overflow-hidden ${fullFrame ? 'rounded-none' : 'rounded-2xl'} ${className}`}
        dangerouslySetInnerHTML={{ __html: trimmed }} 
      />
    );
  }

  // Helper to extract Instagram Shortcode
  const igMatch = trimmed.match(/instagram\.com\/(?:[a-zA-Z0-9_.]+\/)?(reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch) {
    const type = igMatch[1]; // reel or p
    const code = igMatch[2];
    const embedUrl = `https://www.instagram.com/${type}/${code}/embed/`;

    // Calculate margins based on toggles
    let marginClass = "-mx-[2px]";
    if (hideHeader) marginClass += " -mt-[58px]";
    if (hideFooter) marginClass += " -mb-[58px]";

    return (
      <div className={`w-full flex flex-col items-center justify-center ${className}`}>
        <div className={`relative w-full max-w-[340px] overflow-hidden ${fullFrame ? 'rounded-none' : 'rounded-[2rem]'} bg-transparent shadow-xl`}>
          <div className={marginClass}>
            <iframe
              src={embedUrl}
              title={`Instagram ${type}`}
              className="w-full min-h-[620px] border-0"
              frameBorder="0"
              scrolling="no"
              allowTransparency
              allow="encrypted-media"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );
  }

  // Helper to extract YouTube Video ID
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch) {
    const videoId = ytMatch[1];
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;

    return (
      <div className={`${baseWrapperStyles} aspect-video ${className}`}>
        <iframe
          src={embedUrl}
          title="YouTube Video Embed"
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  // Check if it's a Direct Video file (.mp4, .webm, .ogg, .mov)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    // Strip our injected query params so the video src works natively
    const cleanUrl = trimmed.split('?')[0];
    return (
      <div className={`${baseWrapperStyles} ${className}`}>
        <video
          src={cleanUrl}
          controls
          playsInline
          className={`h-full w-full object-cover ${fullFrame ? 'rounded-none max-h-none' : 'rounded-2xl max-h-[550px]'}`}
        />
      </div>
    );
  }

  // Check if it's a Direct Image (.jpg, .jpeg, .png, .webp, .gif, .svg)
  if (/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(trimmed)) {
    const cleanUrl = trimmed.split('?')[0];
    return (
      <div className={`${baseWrapperStyles} ${className}`}>
        <img
          src={cleanUrl}
          alt="Visual Media"
          loading="lazy"
          className={`h-full w-full object-cover transition duration-500 hover:scale-105 ${fullFrame ? 'rounded-none' : 'rounded-2xl'}`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Fallback for general web URLs (e.g. an Instagram account URL or article)
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 p-8 text-center shadow-xl ${className}`}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white shadow-lg">
        <Instagram size={28} />
      </div>
      <h4 className="text-base font-black text-white">Interactive Social Link</h4>
      <p className="mt-1 max-w-md text-xs text-slate-400 truncate">{trimmed}</p>
      <a
        href={trimmed}
        target="_blank"
        rel="noreferrer"
        className="mt-5 flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-pink-500/25 transition hover:scale-105"
      >
        <ExternalLink size={14} /> Open Live on Instagram
      </a>
    </div>
  );
}
