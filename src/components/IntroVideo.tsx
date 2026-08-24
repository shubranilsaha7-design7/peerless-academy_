import { useEffect, useRef, useState } from 'react';

/**
 * IntroVideo — High-performance, non-blocking intro splash.
 *
 * • Only plays once per browser session (sessionStorage gate).
 * • Uses preload="metadata" + muted + playsInline to avoid main-thread lag.
 * • "Skip Intro" button always visible; also auto-advances on `onEnded`.
 * • On dismiss the <video> element is fully unmounted to release GPU memory.
 */
export default function IntroVideo({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('hasSeenIntro');
  });
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // If already seen this session, immediately report done
  useEffect(() => {
    if (!show && typeof onDone === 'function') {
      onDone();
    }
  }, [show, onDone]);

  const dismiss = () => {
    setFading(true);
    sessionStorage.setItem('hasSeenIntro', '1');
    // Let the CSS fade complete before unmounting
    setTimeout(() => {
      // Fully release the video element
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load(); // forces resource release
      }
      setShow(false);
      if (typeof onDone === 'function') {
        onDone();
      }
    }, 500);
  };

  const handleVideoError = () => {
    console.warn('Intro video failed to load or threw a 404. Skipping intro.');
    dismiss();
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src="/videos/intro.mp4"
        preload="metadata"
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        onError={handleVideoError}
        className="h-full w-full object-cover"
      />

      {/* Skip button — always accessible */}
      <button
        onClick={dismiss}
        className="absolute bottom-8 right-8 z-10 rounded-full border border-white/30 bg-black/60 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white backdrop-blur transition hover:bg-white/20"
      >
        Skip Intro →
      </button>

      {/* Gradient overlay at bottom for readability */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
