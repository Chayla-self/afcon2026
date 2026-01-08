/**
 * teamStats.ts - Stats data for the Rankings page
 * 
 * SOURCE: Converted from CSV (update this when you have new data)
 * USAGE: Stats page uses getRankings() to sort teams per metric
 */

export interface TeamStats {
    team: string;
    iso: string;            // For FlagImage
    avgGoals: number;       // Goals scored per game
    avgGoalsConceded: number;
    avgXG: number;          // Expected goals
    avgXGA: number;         // Expected goals against
    possession: number;     // 0-100 percentage
    avgYellowCards: number;
}

// === TEAM DATA ===
// Update this array when you get new statistics
export const TEAM_STATS: TeamStats[] = [
    { team: 'Nigeria', iso: 'ng', avgGoals: 3.00, avgGoalsConceded: 1.00, avgXG: 2.33, avgXGA: 1.05, possession: 63, avgYellowCards: 1.50 },
    { team: 'Senegal', iso: 'sn', avgGoals: 2.50, avgGoalsConceded: 0.50, avgXG: 2.15, avgXGA: 0.65, possession: 62, avgYellowCards: 1.25 },
    { team: 'Algeria', iso: 'dz', avgGoals: 2.00, avgGoalsConceded: 0.25, avgXG: 1.85, avgXGA: 0.55, possession: 56, avgYellowCards: 1.50 },
    { team: 'Ivory Coast', iso: 'ci', avgGoals: 2.00, avgGoalsConceded: 0.75, avgXG: 1.60, avgXGA: 0.95, possession: 58, avgYellowCards: 2.25 },
    { team: 'Morocco', iso: 'ma', avgGoals: 1.75, avgGoalsConceded: 0.25, avgXG: 1.90, avgXGA: 0.45, possession: 65, avgYellowCards: 1.25 },
    { team: 'Egypt', iso: 'eg', avgGoals: 1.50, avgGoalsConceded: 0.50, avgXG: 1.45, avgXGA: 0.85, possession: 57, avgYellowCards: 1.75 },
    { team: 'Cameroon', iso: 'cm', avgGoals: 1.50, avgGoalsConceded: 0.75, avgXG: 1.30, avgXGA: 1.05, possession: 48, avgYellowCards: 2.00 },
    { team: 'Mali', iso: 'ml', avgGoals: 0.75, avgGoalsConceded: 0.75, avgXG: 1.35, avgXGA: 0.90, possession: 53, avgYellowCards: 3.25 },
];

// Type for accessing stat columns
export type StatKey = 'avgGoals' | 'avgGoalsConceded' | 'avgXG' | 'avgXGA' | 'possession' | 'avgYellowCards';

/**
 * Get teams sorted by a specific stat
 * @param statKey - Which stat to sort by
 * @param ascending - true = lowest first (good for goals conceded), false = highest first
 */
export function getRankings(statKey: StatKey, ascending: boolean = false): TeamStats[] {
    return [...TEAM_STATS].sort((a, b) => {
        const diff = a[statKey] - b[statKey];
        return ascending ? diff : -diff;
    });
}
