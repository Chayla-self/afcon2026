/**
 * Bracket Page - Main interactive tournament bracket
 * 
 * LAYOUT: 3-column (Left QF/SF | Final | Right QF/SF)
 * 
 * KEY SECTIONS:
 * - Header: Title + Reset button
 * - Mobile Overview: Zoom-out view with "Tap to Predict" overlay
 * - Left Section: QF1, QF4 -> SF1
 * - Center Section: Grand Final + Champion display + Share button
 * - Right Section: QF2, QF3 -> SF2
 * - Hidden Export Layout: 1920x1080 image for social sharing (off-screen)
 * 
 * STATE: Uses useBracketStore (Zustand) for winner tracking
 * EXPORT: html-to-image library converts hidden div to JPEG
 */

'use client';

import { useBracketStore, BracketState } from '@/store/useBracketStore';
import { TEAMS } from '@/app/constants';
import { MatchCard, Team } from '@/components/MatchCard';
import { useEffect, useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { Share2, Download, Trophy, RotateCcw } from 'lucide-react';
import { FlagImage } from '@/components/FlagImage';
import { motion, AnimatePresence } from 'framer-motion';

export default function BracketPage() {
  const { winners, setWinner, reset } = useBracketStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isMobileOverview, setIsMobileOverview] = useState(false);

  // Scroll to center on mount for mobile
  // Scroll to center on mount for mobile
  useEffect(() => {
    // Check if mobile
    if (window.innerWidth < 768) {
      setIsMobileOverview(true);
    } else {
      // Desktop: Center immediately
      scrollToCenter();
    }
  }, []);

  const scrollToCenter = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const centerSection = container.children[1] as HTMLElement;
      if (centerSection) {
        const scrollX = centerSection.offsetLeft - (window.innerWidth / 2) + (centerSection.clientWidth / 2);
        container.scrollTo({ left: scrollX, behavior: 'smooth' });
      }
    }
  };

  const handleStartPrediction = () => {
    setIsMobileOverview(false);
    // Add a slight delay to allow layout to snap back before scrolling
    setTimeout(scrollToCenter, 100);
  };

  const handleWinner = (matchId: keyof BracketState['winners'], teamName: string) => {
    setWinner(matchId, teamName);
  };

  const getTeam = (name: string | null): Team | null => {
    if (!name) return null;
    return TEAMS[name] || { name, flag: '🏳️', iso: '' };
  };

  /**
   * Wait for all images in container to be fully loaded
   */
  const waitForImages = async (container: HTMLElement): Promise<void> => {
    const images = container.querySelectorAll('img');
    console.log(`[Export] Waiting for ${images.length} images to load...`);

    const promises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Don't block on errors
      });
    });
    await Promise.all(promises);
    console.log('[Export] All images loaded');
  };

  const handleExport = async () => {
    if (!shareRef.current || !winners.final) return;
    setIsExporting(true);

    // Get the wrapper div (parent of shareRef)
    const wrapper = shareRef.current.parentElement;

    try {
      // Temporarily make the export div visible so browser loads images
      if (wrapper) {
        wrapper.style.left = '0';
        wrapper.style.top = '-9999px';
        wrapper.style.visibility = 'visible';
      }

      // Wait for React to render and images to load
      await new Promise(resolve => setTimeout(resolve, 200));
      await waitForImages(shareRef.current);
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toJpeg(shareRef.current, {
        quality: 0.95,
        backgroundColor: '#000',
        fontEmbedCSS: '',
      });

      const link = document.createElement('a');
      link.download = `afcon-2025-my-champion-${winners.final}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export', err);
    } finally {
      // Restore hidden state
      if (wrapper) {
        wrapper.style.left = '-9999px';
        wrapper.style.top = '0';
      }
      setIsExporting(false);
    }
  };

  return (
    <main className="h-screen w-full flex flex-col relative overflow-hidden pt-20">
      {/* Header / Title */}
      <header className="w-full p-4 z-50 text-center bg-gradient-to-b from-black/80 to-transparent flex-shrink-0 relative flex items-center justify-center">
        <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
          The Road to Final
        </h1>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset your bracket?')) {
              reset();
            }
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all"
          title="Reset Bracket"
        >
          <RotateCcw size={20} />
        </button>
      </header>

      {/* Mobile Overview Overlay */}
      <AnimatePresence>
        {isMobileOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm md:hidden"
            onClick={handleStartPrediction}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-black font-black uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-pulse"
            >
              Tap to Predict
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Scrollable Area */}
      <motion.div
        ref={scrollContainerRef}
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory overflow-y-auto md:overflow-x-hidden md:justify-center py-20 no-scrollbar touch-pan-x"
        animate={isMobileOverview ? {
          scale: 0.33,
          width: '300%', // Triple width to fit 3 screens
          x: '-33.33%', // Center the 300% width
          overflowX: 'hidden'
        } : {
          scale: 1,
          width: '100%',
          x: 0,
          overflowX: 'auto'
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* LEFT SECTION (QF1, QF4 -> SF1) */}
        {/* LEFT SECTION (QF1, QF4 -> SF1) */}
        <section className="snap-center min-w-[100vw] md:min-w-fit min-h-full flex flex-col md:flex-row justify-center items-center p-4 md:p-2 py-12 relative">
          <div className="md:hidden absolute top-4 left-4 text-white/20 text-xs font-bold rotate-90 origin-top-left">LEFT BRACKET</div>

          {/* Desktop Wrapper: Flex Row */}
          <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-sm md:max-w-none">

            {/* Column 1: Quarter Finals */}
            <div className="flex flex-col gap-8 md:gap-12">
              <MatchCard
                id="q1"
                title="Quarter Final 1"
                team1={TEAMS['Mali']}
                team2={TEAMS['Senegal']}
                winner={winners.q1}
                onSelect={(t) => handleWinner('q1', t)}
                className="md:max-w-[200px]"
              />
              <MatchCard
                id="q4"
                title="Quarter Final 4"
                team1={TEAMS['Egypt']}
                team2={TEAMS['Ivory Coast']}
                winner={winners.q4}
                onSelect={(t) => handleWinner('q4', t)}
                className="md:max-w-[200px]"
              />
            </div>

            {/* Desktop Connector Logic */}
            {/* Desktop Connector Logic */}
            <div className="hidden md:block w-4 border-t-2 border-white/10 relative">
              <div className="absolute top-[-7rem] left-0 w-[1px] h-[14rem] bg-white/10" />
              <div className="absolute top-[-7rem] left-0 w-4 border-t border-white/10" />
              <div className="absolute bottom-[-7rem] left-0 w-4 border-t border-white/10" />
            </div>

            {/* Column 2: Semi Final 1 */}
            <div className="flex flex-col justify-center">
              <div className="md:hidden text-center text-xs text-yellow-500/50 mb-2 font-bold uppercase tracking-widest">Semi Final 1</div>
              <MatchCard
                id="sf1"
                title="Semi Final 1"
                team1={getTeam(winners.q1)}
                team2={getTeam(winners.q4)}
                winner={winners.sf1}
                onSelect={(t) => handleWinner('sf1', t)}
                disabled={!winners.q1 || !winners.q4}
                className="border-yellow-500/20 bg-yellow-900/10 md:max-w-[200px]"
              />
            </div>
          </div>
        </section>

        {/* CENTER SECTION (FINAL) */}
        <section className="snap-center min-w-[100vw] md:min-w-[380px] min-h-full flex flex-col justify-center items-center p-6 py-12 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key="final-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md relative"
            >
              {/* Trophy Glow */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none" />


              <MatchCard
                id="final"
                title="Grand Final"
                team1={getTeam(winners.sf1)}
                team2={getTeam(winners.sf2)}
                winner={winners.final}
                onSelect={(t) => handleWinner('final', t)}
                disabled={!winners.sf1 || !winners.sf2}
                className="bg-gradient-to-br from-white/10 to-transparent border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)] scale-110"
              />

              {winners.final && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 flex flex-col gap-4"
                >
                  <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-900/20 border border-yellow-500/30 p-4 rounded-xl text-center">
                    <p className="text-yellow-200 text-xs font-bold uppercase tracking-widest mb-1">Your Champion</p>
                    <div className="text-5xl mb-2 flex justify-center">
                      <FlagImage code={getTeam(winners.final)?.iso || ''} name={getTeam(winners.final)?.name || ''} size={80} />
                    </div>
                    <div className="text-2xl font-black text-white">{getTeam(winners.final)?.name}</div>
                  </div>

                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full py-4 bg-white text-black font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    {isExporting ? 'Generating...' : <><Share2 size={20} /> Share Prediction</>}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* RIGHT SECTION (QF2, QF3 -> SF2) */}
        {/* RIGHT SECTION (QF2, QF3 -> SF2) */}
        <section className="snap-center min-w-[100vw] md:min-w-fit min-h-full flex flex-col md:flex-row-reverse justify-center items-center p-4 md:p-2 py-12 relative">
          <div className="md:hidden absolute top-4 right-4 text-white/20 text-xs font-bold -rotate-90 origin-top-right">RIGHT BRACKET</div>

          {/* Desktop Wrapper: Flex Row Reverse */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-4 w-full max-w-sm md:max-w-none">

            {/* Column 1 (Rightmost): Quarter Finals */}
            <div className="flex flex-col gap-8 md:gap-12">
              <MatchCard
                id="q2"
                title="Quarter Final 2"
                team1={TEAMS['Cameroon']}
                team2={TEAMS['Morocco']}
                winner={winners.q2}
                onSelect={(t) => handleWinner('q2', t)}
                className="md:max-w-[200px]"
              />
              <MatchCard
                id="q3"
                title="Quarter Final 3"
                team1={TEAMS['Algeria']}
                team2={TEAMS['Nigeria']}
                winner={winners.q3}
                onSelect={(t) => handleWinner('q3', t)}
                className="md:max-w-[200px]"
              />
            </div>

            {/* Desktop Connector Logic */}
            <div className="hidden md:block w-4 border-t-2 border-white/10 relative">
              <div className="absolute top-[-7rem] right-0 w-[1px] h-[14rem] bg-white/10" />
              <div className="absolute top-[-7rem] right-0 w-4 border-t border-white/10" />
              <div className="absolute bottom-[-7rem] right-0 w-4 border-t border-white/10" />
            </div>

            {/* Column 2: Semi Final 2 */}
            <div className="flex flex-col justify-center">
              <div className="md:hidden text-center text-xs text-yellow-500/50 mb-2 font-bold uppercase tracking-widest">Semi Final 2</div>
              <MatchCard
                id="sf2"
                title="Semi Final 2"
                team1={getTeam(winners.q2)}
                team2={getTeam(winners.q3)}
                winner={winners.sf2}
                onSelect={(t) => handleWinner('sf2', t)}
                disabled={!winners.q2 || !winners.q3}
                className="border-yellow-500/20 bg-yellow-900/10 md:max-w-[200px]"
              />
            </div>
          </div>
        </section>
      </motion.div>

      {/* Hidden Export Layout (1920x1080 Landscape Full Bracket) */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none">
        <div
          ref={shareRef}
          className="w-[1920px] h-[1080px] bg-black text-white flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            background: 'radial-gradient(circle at top left, #014421, transparent 60%), radial-gradient(circle at bottom right, #8B0000, transparent 60%), #000'
          }}
        >
          {/* Header */}
          <div className="absolute top-8 w-full text-center z-10">
            <h1 className="text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 drop-shadow-2xl">
              AFCON 2025 PREDICTOR
            </h1>
            <p className="text-3xl text-white/60 mt-2 font-bold tracking-[0.3em] uppercase">My Road to the Final</p>
          </div>

          {/* Full Bracket Tree - OPTIMIZED READABILITY & FIT */}
          <div className="flex items-center gap-4 transform scale-115 translate-y-8">

            {/* Left Side (QF1, QF4 -> SF1) */}
            <div className="flex items-center gap-8">
              {/* QF Column */}
              <div className="flex flex-col gap-24">
                <MatchCard id="q1" title="Quarter Final 1" team1={TEAMS['Mali']} team2={TEAMS['Senegal']} winner={winners.q1} onSelect={() => { }} className="w-[280px] shadow-2xl" />
                <MatchCard id="q4" title="Quarter Final 4" team1={TEAMS['Egypt']} team2={TEAMS['Ivory Coast']} winner={winners.q4} onSelect={() => { }} className="w-[280px] shadow-2xl" />
              </div>
              {/* SF Column */}
              <div className="flex flex-col gap-24 relative">
                {/* Connectors */}
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 border-t-[4px] border-white/20 h-[360px] border-l-[4px]">
                  <div className="absolute top-0 left-0 w-full border-t-[4px] border-white/20" />
                  <div className="absolute bottom-0 left-0 w-full border-t-[4px] border-white/20" />
                </div>

                <MatchCard id="sf1" title="Semi Final 1" team1={getTeam(winners.q1)} team2={getTeam(winners.q4)} winner={winners.sf1} onSelect={() => { }} className="w-[280px] shadow-2xl" />
              </div>
            </div>

            {/* Center (Final) */}
            <div className="flex flex-col items-center gap-8 mx-6">
              <div className="scale-[1.5]">
                <Trophy className="text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.6)]" />
              </div>
              <MatchCard
                id="final" title="GRAND FINAL"
                team1={getTeam(winners.sf1)} team2={getTeam(winners.sf2)}
                winner={winners.final} onSelect={() => { }}
                className="w-[380px] scale-110 bg-gradient-to-br from-yellow-900/60 to-black border-yellow-500 shadow-[0_0_80px_rgba(234,179,8,0.3)]"
              />
              {winners.final && (
                <div className="bg-yellow-500/20 border-2 border-yellow-500 px-8 py-4 rounded-2xl text-center backdrop-blur-md min-w-[300px]">
                  <div className="text-yellow-400 font-bold tracking-[0.2em] text-xl mb-2 uppercase">Champion</div>
                  <div className="flex flex-col items-center">
                    <div className="mb-2 drop-shadow-xl">
                      <FlagImage code={getTeam(winners.final)?.iso || ''} name={getTeam(winners.final)?.name || ''} size={160} />
                    </div>
                    <div className="text-5xl font-black text-white drop-shadow-md whitespace-nowrap">{getTeam(winners.final)?.name}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side (QF2, QF3 -> SF2) */}
            <div className="flex items-center gap-8 flex-row-reverse">
              {/* QF Column */}
              <div className="flex flex-col gap-24">
                <MatchCard id="q2" title="Quarter Final 2" team1={TEAMS['Cameroon']} team2={TEAMS['Morocco']} winner={winners.q2} onSelect={() => { }} className="w-[280px] shadow-2xl" />
                <MatchCard id="q3" title="Quarter Final 3" team1={TEAMS['Algeria']} team2={TEAMS['Nigeria']} winner={winners.q3} onSelect={() => { }} className="w-[280px] shadow-2xl" />
              </div>
              {/* SF Column */}
              <div className="flex flex-col gap-24 relative">
                {/* Connectors */}
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 border-t-[4px] border-white/20 h-[360px] border-r-[4px]">
                  <div className="absolute top-0 right-0 w-full border-t-[4px] border-white/20" />
                  <div className="absolute bottom-0 right-0 w-full border-t-[4px] border-white/20" />
                </div>

                <MatchCard id="sf2" title="Semi Final 2" team1={getTeam(winners.q2)} team2={getTeam(winners.q3)} winner={winners.sf2} onSelect={() => { }} className="w-[280px] shadow-2xl" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 text-white/30 text-3xl font-bold tracking-widest uppercase">
            can2026.xyz
          </div>
        </div>
      </div>
    </main>
  );
}
