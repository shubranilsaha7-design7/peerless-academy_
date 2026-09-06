import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function IntroVideo({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('hasSeenIntro');
  });
  const [fading, setFading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch the dynamic startup video URL
  useEffect(() => {
    if (!show) return;
    
    const fetchVideo = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('site_media')
          .select('url')
          .eq('type', 'startup_video')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (!error && data && data.length > 0) {
          setVideoUrl(data[0].url);
        } else {
          // If no video is configured in DB, just skip the intro
          dismiss();
        }
      } catch (err) {
        console.error("Failed to fetch intro video:", err);
        dismiss();
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideo();
  }, [show]);

  // Attempt explicit playback once video is loaded
  useEffect(() => {
    let fallbackTimer: ReturnType<typeof setTimeout>;
    
    if (show && videoUrl && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay prevented or video failed:", error);
          dismiss();
        });
      }
      
      // Safety fallback: if video loops or hangs, dismiss after 12 seconds
      fallbackTimer = setTimeout(() => {
         dismiss();
      }, 12000);
    }
    
    return () => {
       if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [show, videoUrl]);

  // If already seen this session, immediately report done
  useEffect(() => {
    if (!show && typeof onDone === 'function') {
      onDone();
    }
  }, [show, onDone]);

  const dismiss = () => {
    setFading(true);
    sessionStorage.setItem('hasSeenIntro', '1');
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
      setShow(false);
      if (typeof onDone === 'function') {
        onDone();
      }
    }, 500);
  };

  const handleVideoError = () => {
    console.warn('Intro video failed to load. Skipping intro.');
    dismiss();
  };

  if (!show) return null;
  
  // If still fetching the DB, show a black screen to prevent flashing
  if (loading || !videoUrl) {
    return (
      <div className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`} />
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        preload="metadata"
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        onError={handleVideoError}
        className="h-full w-full object-cover"
      />

      <button
        onClick={dismiss}
        className="absolute bottom-10 right-10 rounded-full border border-white/20 bg-black/50 px-6 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition hover:bg-white hover:text-black"
      >
        Skip Intro
      </button>
    </div>
  );
}
