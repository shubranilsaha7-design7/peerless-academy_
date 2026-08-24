import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import introAsset from '@/assets/peerless-intro.mp4.asset.json';

/**
 * Full-screen intro animation shown once per browser session.
 * Tries to play with sound; browsers that block unmuted autoplay get a
 * muted playback plus a one-tap "Enable sound" control.
 */
export default function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem('peerless_intro_played') !== '1';
    } catch {
      return true;
    }
  });
  const [muted, setMuted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const el = videoRef.current;
    if (!el) return;

    el.muted = false;
    el.volume = 1;
    el.play().catch(() => {
      // Autoplay with audio blocked — fall back to muted playback.
      el.muted = true;
      setMuted(true);
      el.play().catch(() => undefined);
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const finish = () => {
    try {
      sessionStorage.setItem('peerless_intro_played', '1');
    } catch {
      /* private mode */
    }
    setClosing(true);
    window.setTimeout(() => setVisible(false), 600);
  };

  const enableSound = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 1;
    setMuted(false);
    el.play().catch(() => undefined);
  };

  if (!visible) return null;

  return (
    <div
      onClick={muted ? enableSound : undefined}
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-black transition-opacity duration-700 ${
        closing ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src={introAsset.url}
        className="h-full w-full object-contain"
        playsInline
        autoPlay
        preload="auto"
        onEnded={finish}
        onError={finish}
      />


      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-3 px-6">
        {muted && (
          <button
            onClick={enableSound}
            className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/20 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-amber-200 backdrop-blur-md transition hover:bg-amber-500/30"
          >
            <VolumeX size={15} /> Tap for sound
          </button>
        )}
        {!muted && (
          <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-200 backdrop-blur-md">
            <Volume2 size={13} /> Sound on
          </span>
        )}
        <button
          onClick={finish}
          className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white backdrop-blur-md transition hover:bg-white/20"
        >
          Skip intro
        </button>
      </div>
    </div>
  );
}
