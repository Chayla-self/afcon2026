/**
 * Stats Page - Team Power Rankings
 * 
 * WHAT: Displays 6 stat cards with team rankings
 * DATA: Pulls from app/data/teamStats.ts (update there for new data)
 * 
 * FEATURES:
 * - Clickable Asc/Desc toggle per card
 * - Bar charts showing relative performance
 * - Gold styling for top 3 teams
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Shield, Activity, Users, AlertTriangle, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { getRankings, StatKey, TeamStats } from '../data/teamStats';
import { FlagImage } from '@/components/FlagImage';

interface MetricConfig {
    title: string;
    icon: React.ComponentType<{ size?: number }>;
    statKey: StatKey;
    defaultAscending: boolean; // Default sort order
    suffix?: string;
    formatValue?: (val: number) => string;
}

const METRICS: MetricConfig[] = [
    { title: 'AVG Goals', icon: Target, statKey: 'avgGoals', defaultAscending: false, suffix: ' goals' },
    { title: 'Expected Goals (AVG)', icon: TrendingUp, statKey: 'avgXG', defaultAscending: false },
    { title: 'Possession', icon: Users, statKey: 'possession', defaultAscending: false, suffix: '%' },
    { title: 'AVG Goals Against', icon: Shield, statKey: 'avgGoalsConceded', defaultAscending: true, suffix: ' conceded' },
    { title: 'Expected Goals Against (AVG)', icon: Activity, statKey: 'avgXGA', defaultAscending: true },
    { title: 'AVG Yellows', icon: AlertTriangle, statKey: 'avgYellowCards', defaultAscending: false, suffix: ' cards' },
];

export default function StatsPage() {
    // Track sort direction for each metric
    const [sortDirections, setSortDirections] = useState<Record<StatKey, boolean>>(
        METRICS.reduce((acc, m) => ({ ...acc, [m.statKey]: m.defaultAscending }), {} as Record<StatKey, boolean>)
    );

    const toggleSort = (statKey: StatKey) => {
        setSortDirections(prev => ({ ...prev, [statKey]: !prev[statKey] }));
    };

    const StatGrid = ({ config, delay }: { config: MetricConfig; delay: number }) => {
        const isAscending = sortDirections[config.statKey];
        const rankings = getRankings(config.statKey, isAscending);
        const maxValue = Math.max(...rankings.map(t => t[config.statKey]));

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors group"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 text-yellow-400 group-hover:text-yellow-300 transition-colors">
                            <config.icon size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-white group-hover:text-yellow-200 transition-colors">{config.title}</h3>
                    </div>
                    {/* Sort Toggle Button */}
                    <button
                        onClick={() => toggleSort(config.statKey)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white transition-all text-xs"
                        title={isAscending ? 'Sorted: Low to High (click to flip)' : 'Sorted: High to Low (click to flip)'}
                    >
                        {isAscending ? (
                            <>
                                <ArrowUp size={14} />
                                <span>Asc</span>
                            </>
                        ) : (
                            <>
                                <ArrowDown size={14} />
                                <span>Desc</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Ranking Rows */}
                <div className="space-y-2.5">
                    {rankings.map((team, index) => {
                        const value = team[config.statKey];
                        const barWidth = (value / maxValue) * 100;
                        const formattedValue = config.formatValue ? config.formatValue(value) : value.toFixed(2);

                        return (
                            <div key={team.team} className="flex items-center justify-between text-sm gap-3">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <span className={`font-mono font-bold w-5 text-center ${index < 3 ? 'text-yellow-500' : 'text-white/30'}`}>
                                        {index + 1}
                                    </span>
                                    <div className="shrink-0">
                                        <FlagImage code={team.iso} name={team.team} size={20} />
                                    </div>
                                    <span className="text-white/80 truncate">{team.team}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-white/60 text-xs w-12 text-right">{formattedValue}{config.suffix || ''}</span>
                                    <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${index === 0 ? 'bg-yellow-500' : index < 3 ? 'bg-yellow-500/60' : 'bg-white/30'}`}
                                            style={{ width: `${barWidth}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        );
    };

    return (
        <main className="min-h-screen w-full bg-black text-white pt-24 pb-20 px-4">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-900/20 blur-[100px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/20 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
                        Team Power Rankings
                    </h1>
                    <p className="text-white/50 max-w-lg mx-auto">
                        Top 8 teams analyzed across 6 key performance metrics. Based on AFCON 2025 latest statistics.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {METRICS.map((metric, i) => (
                        <StatGrid key={metric.statKey} config={metric} delay={0.1 + i * 0.1} />
                    ))}
                </div>
            </div>
        </main>
    );
}
