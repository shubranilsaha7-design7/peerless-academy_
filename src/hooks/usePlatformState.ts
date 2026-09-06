import { useState, useEffect } from 'react';

export function usePlatformState() {
  const [isAppMode, setIsAppMode] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check Standalone / PWA Mode
    const checkIsStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      // @ts-ignore - iOS Safari fallback
      const isStandaloneNavigator = window.navigator.standalone === true;
      return isStandaloneMedia || isStandaloneNavigator;
    };

    setIsAppMode(checkIsStandalone());

    // Listen to media query changes (e.g. if user installs mid-session or resizes in some browsers)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => setIsAppMode(e.matches);
    
    // Modern vs deprecated listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    // Detect OS
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(ua)) {
      setIsAndroid(true);
    }
    if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
      setIsIOS(true);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  // Sync to HTML class for global CSS overrides
  useEffect(() => {
    if (isAppMode) {
      document.documentElement.classList.add('app-mode');
    } else {
      document.documentElement.classList.remove('app-mode');
    }
  }, [isAppMode]);

  return { isAppMode, isIOS, isAndroid };
}
