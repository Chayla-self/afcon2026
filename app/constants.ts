/**
 * constants.ts - Team data for the bracket
 * 
 * STRUCTURE: Maps team name -> Team object
 * ISO CODES: Used by FlagImage for flag rendering
 * 
 * To add/change teams: Update this file and the bracket layout in page.tsx
 */

import { Team } from '@/components/MatchCard';

// === AFCON 2025 TOP 8 TEAMS ===
export const TEAMS: Record<string, Team> = {
    'Mali': { name: 'Mali', flag: '🇲🇱', iso: 'ml' },
    'Senegal': { name: 'Senegal', flag: '🇸🇳', iso: 'sn' },
    'Egypt': { name: 'Egypt', flag: '🇪🇬', iso: 'eg' },
    'Ivory Coast': { name: 'Ivory Coast', flag: '🇨🇮', iso: 'ci' },
    'Cameroon': { name: 'Cameroon', flag: '🇨🇲', iso: 'cm' },
    'Morocco': { name: 'Morocco', flag: '🇲🇦', iso: 'ma' },
    'Algeria': { name: 'Algeria', flag: '🇩🇿', iso: 'dz' },
    'Nigeria': { name: 'Nigeria', flag: '🇳🇬', iso: 'ng' },
};
