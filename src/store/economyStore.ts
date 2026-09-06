import { create } from 'zustand';

interface EconomyState {
  elo: number;
  appCoins: number;
  currentStreak: number;
  focusMinutes: number;
  isLoaded: boolean;
  
  // Actions
  hydrateStats: (elo: number, coins: number, streak: number, focusMinutes: number) => void;
  awardCoins: (amount: number) => void;
  deductCoins: (amount: number) => boolean; // returns false if insufficient
  addElo: (amount: number) => void;
  addFocusTime: (minutes: number) => void;
}

export const useEconomyStore = create<EconomyState>((set, get) => ({
  elo: 1200,
  appCoins: 100,
  currentStreak: 0,
  focusMinutes: 0,
  isLoaded: false,

  hydrateStats: (elo, coins, streak, focusMinutes) => set({
    elo, appCoins: coins, currentStreak: streak, focusMinutes, isLoaded: true
  }),

  awardCoins: (amount) => set((s) => ({ appCoins: s.appCoins + amount })),

  deductCoins: (amount) => {
    const { appCoins } = get();
    if (appCoins >= amount) {
      set({ appCoins: appCoins - amount });
      return true;
    }
    return false;
  },

  addElo: (amount) => set((s) => ({ elo: s.elo + amount })),

  addFocusTime: (minutes) => set((s) => ({ focusMinutes: s.focusMinutes + minutes })),
}));

// Utility to derive rank from ELO
export function getRankTier(elo: number) {
  if (elo < 1400) return { name: 'Bronze', color: 'text-amber-700' };
  if (elo < 1800) return { name: 'Silver', color: 'text-slate-300' };
  if (elo < 2200) return { name: 'Gold', color: 'text-yellow-400' };
  if (elo < 2500) return { name: 'Platinum', color: 'text-cyan-400' };
  return { name: 'Grandmaster', color: 'text-rose-500' };
}
