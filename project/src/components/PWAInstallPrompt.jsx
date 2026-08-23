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
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed bottom-6 left-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0"
          role="dialog"
          aria-label="Install Peerless Academy app"
        >
          <div className="relative flex items-center gap-4 rounded-2xl border border-orange-500/30 bg-slate-900/95 p-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {/* App icon */}
            <div className="flex-shrink-0 rounded-xl bg-orange-500/15 p-3 text-orange-400">
              <Smartphone size={22} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white leading-tight">
                Install Peerless Academy
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">
                Add to home screen for offline access & faster loads.
              </p>
            </div>

            {/* Install CTA */}
            <button
              onClick={handleInstall}
              className="flex-shrink-0 flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-black text-white transition hover:bg-orange-600 active:scale-95"
            >
              <Download size={13} />
              Install
            </button>

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-slate-300 transition hover:bg-slate-600 hover:text-white"
              aria-label="Dismiss install prompt"
            >
              <X size={12} />
            </button>
          </div>

          {/* Subtle glow */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-orange-500/10 blur-xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
