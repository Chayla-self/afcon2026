'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Trophy, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const NavLink = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => {
        const isActive = pathname === href;

        return (
            <Link
                href={href}
                className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all relative overflow-hidden",
                    isActive
                        ? "text-black"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setIsOpen(false)}
            >
                {isActive && (
                    <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <span className="relative z-10 flex items-center gap-2">
                    <Icon size={18} />
                    {children}
                </span>
            </Link>
        );
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-[60] px-4 py-4 md:py-6">
                <div className="max-w-xl mx-auto">
                    {/* Desktop/Laptop Tabs */}
                    <div className="hidden md:flex items-center justify-center p-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                        <NavLink href="/" icon={Trophy}>Brackets</NavLink>
                        <NavLink href="/stats" icon={BarChart2}>Stats</NavLink>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden flex justify-end">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white shadow-lg active:scale-95 transition-transform"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-xl md:hidden flex items-center justify-center"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="flex flex-col gap-4 p-8 w-full max-w-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-6 right-6 p-2 text-white/50 hover:text-white"
                            >
                                <X size={32} />
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                                    AFCON 2025
                                </h2>
                                <p className="text-white/40 text-xs tracking-widest uppercase">Select View</p>
                            </div>

                            <Link
                                href="/"
                                className={cn(
                                    "flex items-center justify-center gap-4 p-6 rounded-2xl border text-xl font-bold transition-all",
                                    pathname === '/'
                                        ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                <Trophy size={24} />
                                Brackets
                            </Link>

                            <Link
                                href="/stats"
                                className={cn(
                                    "flex items-center justify-center gap-4 p-6 rounded-2xl border text-xl font-bold transition-all",
                                    pathname === '/stats'
                                        ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                <BarChart2 size={24} />
                                Stats Hub
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
