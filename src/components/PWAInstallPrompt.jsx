import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

/**
 * PWAInstallPrompt
 * ─────────────────
 * Listens to the browser's `beforeinstallprompt` event and surfaces
 * a floating banner that lets the user install the app natively.
 *
 * Rules:
 *  - Banner only shows when the browser fires `beforeinstallprompt`
 *    (i.e. the PWA install criteria are met and it isn't already installed).
 *  - Dismissed state is persisted in sessionStorage so it doesn't
 *    reappear within the same browsing session.
 *  - "Install" calls `prompt()` on the deferred event object.
 */
export default function PWAInstallPrompt() {
  // The deferred BeforeInstallPromptEvent captured from the browser
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('pwa-prompt-dismissed') === '1') return;

    const handler = (e) => {
      // Prevent the default mini-infobar from appearing on mobile Chrome
      e.preventDefault();
      setDeferredPrompt(e);
      // Small delay so the banner doesn't flash immediately on page load
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If the app is already installed, hide the banner
    window.addEventListener('appinstalled', () => {
      setVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('pwa-prompt-dismissed', '1');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="pwa-banner"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6 pointer-events-none"
          role="dialog"
          aria-label="Install Peerless Academy app"
        >
          <div className="w-full max-w-sm pointer-events-auto relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-md mx-auto">
            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white"
              aria-label="Dismiss install prompt"
            >
              <X size={14} />
            </button>
            
            <div className="flex items-center gap-4">
              {/* App icon */}
              <div className="flex-shrink-0 rounded-xl bg-orange-500/15 p-3 text-orange-400">
                <Smartphone size={24} />
              </div>

              {/* Text */}
              <div className="flex-1 pr-6">
                <p className="text-base font-black text-white leading-tight">
                  Install Peerless Academy
                </p>
                <p className="mt-1 text-xs text-slate-400 leading-snug">
                  Add to home screen for offline access & faster loads.
                </p>
              </div>
            </div>

            {/* Install CTA */}
            <button
              onClick={handleInstall}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white transition hover:bg-orange-600 active:scale-95"
            >
              <Download size={16} />
              Install App
            </button>
          </div>

          {/* Subtle glow */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-orange-500/10 blur-xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
