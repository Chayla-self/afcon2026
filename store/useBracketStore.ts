/**
 * useBracketStore.ts - Zustand store for bracket state
 * 
 * WHAT: Manages all bracket predictions (QF -> SF -> Final)
 * WHY Zustand: Simple, fast, persists to localStorage automatically
 * 
 * KEY LOGIC: Cascading reset - changing a QF winner clears dependent SF and Final
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BracketState {
  winners: {
    q1: string | null;  // Left QF top
    q4: string | null;  // Left QF bottom
    q2: string | null;  // Right QF top
    q3: string | null;  // Right QF bottom
    sf1: string | null; // Left SF (winner of q1 vs q4)
    sf2: string | null; // Right SF (winner of q2 vs q3)
    final: string | null;
  };
  setWinner: (matchId: keyof BracketState['winners'], team: string) => void;
  reset: () => void;
}

export const useBracketStore = create<BracketState>()(
  persist(
    (set) => ({
      winners: { q1: null, q4: null, q2: null, q3: null, sf1: null, sf2: null, final: null },

      // Clears entire bracket
      reset: () => set({ winners: { q1: null, q4: null, q2: null, q3: null, sf1: null, sf2: null, final: null } }),

      setWinner: (matchId, team) => set((state) => {
        const newWinners = { ...state.winners, [matchId]: team };

        // CASCADING RESET: Prevents impossible bracket states
        // If user changes QF winner, clear SF and Final that depended on it
        if (matchId === 'q1' || matchId === 'q4') { newWinners.sf1 = null; newWinners.final = null; }
        if (matchId === 'q2' || matchId === 'q3') { newWinners.sf2 = null; newWinners.final = null; }
        if (matchId === 'sf1' || matchId === 'sf2') { newWinners.final = null; }

        return { winners: newWinners };
      }),
    }),
    { name: 'afcon-2025-session' } // localStorage key
  )
);
