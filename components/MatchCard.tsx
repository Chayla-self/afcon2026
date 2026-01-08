/**
 * MatchCard.tsx - The core bracket UI component
 * 
 * WHAT: Displays a single match with two teams, handles selection
 * STYLING: Glassmorphism (backdrop-blur), green highlight for winner, dim for loser
 * ANIMATION: Framer Motion for entry/selection effects
 */

'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { FlagImage } from './FlagImage';

// Team data structure - used throughout the app
export interface Team {
    name: string;
    flag: string; // Emoji fallback (not used anymore)
    iso: string;  // ISO code for FlagImage (e.g., 'ng' for Nigeria)
}

interface MatchCardProps {
    id: string;
    title: string;        // e.g., "Quarter Final 1"
    team1: Team | null;   // null = waiting for opponent
    team2: Team | null;
    winner: string | null;
    onSelect: (team: string) => void;
    className?: string;
    disabled?: boolean;   // true when previous round not decided
}

export const MatchCard = ({
    id,
    title,
    team1,
    team2,
    winner,
    onSelect,
    className,
    disabled
}: MatchCardProps) => {
    return (
        <motion.div
            id={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex flex-col gap-2 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl w-full max-w-[320px] mx-auto",
                className
            )}
        >
            {/* Match title */}
            <div className="text-xs font-bold text-white/50 uppercase tracking-widest text-center mb-1">
                {title}
            </div>

            {/* Team rows */}
            <div className="flex flex-col gap-2">
                <TeamRow
                    team={team1}
                    isWinner={winner === team1?.name}
                    isLost={!!winner && winner !== team1?.name}
                    onClick={() => team1 && !disabled && onSelect(team1.name)}
                />

                <TeamRow
                    team={team2}
                    isWinner={winner === team2?.name}
                    isLost={!!winner && winner !== team2?.name}
                    onClick={() => team2 && !disabled && onSelect(team2.name)}
                />
            </div>
        </motion.div>
    );
};

/**
 * TeamRow - Individual team button within a MatchCard
 * 
 * States:
 * - null team: Shows "Waiting for Opponent..." placeholder
 * - isWinner: Green background + check icon
 * - isLost: Dimmed (opacity 40%)
 * - default: Hoverable white/5 background
 */
const TeamRow = ({ team, isWinner, isLost, onClick }: { team: Team | null, isWinner: boolean, isLost: boolean, onClick: () => void }) => {
    // Placeholder for undecided matches
    if (!team) return (
        <div className="h-14 rounded-lg bg-white/5 border border-white/5 animate-pulse flex items-center justify-center text-white/20 text-xs">
            Waiting for Opponent...
        </div>
    );

    return (
        <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={onClick}
            className={cn(
                "relative flex items-center gap-3 p-3 rounded-lg transition-all duration-300 w-full text-left group overflow-hidden",
                isWinner
                    ? "bg-gradient-to-r from-green-900/40 to-green-600/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    : isLost
                        ? "opacity-40 bg-black/20 border-transparent"  // No grayscale - keeps flag colors
                        : "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30"
            )}
        >
            {/* Flag image - uses FlagCDN */}
            <div className="text-3xl filter drop-shadow-md select-none shrink-0 w-[40px] flex justify-center">
                <FlagImage code={team.iso} name={team.name} size={40} />
            </div>

            {/* Team name */}
            <span className={cn(
                "font-bold text-sm tracking-wide transition-colors truncate pr-6",
                isWinner ? "text-green-100" : "text-gray-100"
            )}>
                {team.name}
            </span>

            {/* Winner checkmark */}
            {isWinner && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: -10 }}
                    className="absolute right-3 text-green-400"
                >
                    <Check size={18} strokeWidth={3} />
                </motion.div>
            )}
        </motion.button>
    )
}
