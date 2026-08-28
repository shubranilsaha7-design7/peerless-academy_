// A lightweight wrapper around the standard Vibration API
// Falls back gracefully on iOS Safari or unsupported environments

export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const Haptics = {
  vibrate: (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignore errors (e.g., user hasn't interacted with page yet)
      }
    }
  },

  trigger: (type: HapticFeedbackType) => {
    switch (type) {
      case 'light':
        // Quick subtle tick for switches/tabs
        Haptics.vibrate(10);
        break;
      case 'medium':
        // Solid confirmation tap for saving/submitting
        Haptics.vibrate(30);
        break;
      case 'heavy':
        // Strong tactile feeling
        Haptics.vibrate(60);
        break;
      case 'success':
        // Two quick pulses
        Haptics.vibrate([20, 50, 20]);
        break;
      case 'warning':
        // One long, one short
        Haptics.vibrate([40, 80, 20]);
        break;
      case 'error':
        // Three distinct pulses (Error pattern)
        Haptics.vibrate([50, 100, 50, 100, 50]);
        break;
      default:
        Haptics.vibrate(10);
    }
  }
};
