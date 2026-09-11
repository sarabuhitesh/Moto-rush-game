import React, { useState, useEffect } from 'react';
import { Bike, GameMode, ScreenType } from '../types';
import { sounds } from '../utils/audio';
import { Play, Sparkles, Trophy, ChevronRight, CheckCircle2, Lock, Wrench, Edit3, User } from 'lucide-react';

interface LobbyViewProps {
  activeBike: Bike;
  modes: GameMode[];
  selectedModeId: string;
  onSelectMode: (modeId: 'endless' | 'traffic' | 'time') => void;
  onLaunchRace: () => void;
  onNavigate: (screen: ScreenType) => void;
  onClaimCrate: () => void;
  crateClaimed: boolean;
  tunesReadyCount: number;
  playerName?: string;
  playerLevel?: number;
  onOpenEditName?: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  activeBike,
  modes,
  selectedModeId,
  onSelectMode,
  onLaunchRace,
  onNavigate,
  onClaimCrate,
  crateClaimed,
  tunesReadyCount,
  playerName = 'ApexRider',
  playerLevel = 14,
  onOpenEditName
}) => {
  // Countdown timer for daily crate
  const [crateTimeLeft, setCrateTimeLeft] = useState(2 * 3600 + 45 * 60 + 10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCrateTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Keyboard shortcut listener (Space = Launch, G = Garage, M = Modes)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        sounds.playClick();
        onLaunchRace();
      } else if (e.key === 'g' || e.key === 'G') {
        sounds.playClick();
        onNavigate('garage');
      } else if (e.key === 'm' || e.key === 'M') {
        sounds.playClick();
        onNavigate('modes');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onLaunchRace, onNavigate]);

  return (
    <div id="lobby-view" className="pt-16 sm:pt-20 px-3 sm:px-6 max-w-[1920px] mx-auto pb-24 md:pb-16 telemetry-grid">
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        {/* ==================== HERO STAGE & MODES (Cols 1-12 or 1-8 on desktop) ==================== */}
        <section className="col-span-12 xl:col-span-8 flex flex-col gap-4 sm:gap-6">
          {/* Visual Hero Viewport: Active Superbike Stage */}
          <div className="relative w-full h-[380px] sm:h-[460px] xl:h-[520px] bg-[#191c21] border border-[#3b494b]/60 rounded-xl overflow-hidden flex flex-col justify-between p-4 sm:p-6 clip-chamfer-panel shadow-2xl group">
            {/* Background Superbike Image & Cyber Atmosphere */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
              style={{
                backgroundImage: `url('${activeBike.image}')`,
                opacity: 0.88
              }}
            />

            {/* Speed Streak Particles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="streak-1" />
              <div className="streak-2" />
              <div className="streak-3" />
            </div>

            {/* Scanline Overlay */}
            <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />

            {/* Gradient Dark Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e13] via-[#0b0e13]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e13]/90 via-transparent to-[#0b0e13]/60 pointer-events-none" />

            {/* Top HUD Overlay Watermark */}
            <div className="relative z-10 flex justify-between items-start gap-2">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#c5020b]/90 text-[#ffd2cc] font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-widest rounded">
                    FEATURED RUN
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs text-[#00f0ff] tracking-wider hidden sm:inline">
                    SEASON 04: HYPER DRIVE STREETS
                  </span>
                  {/* Pilot Callsign Badge */}
                  <button
                    id="lobby-pilot-profile-btn"
                    onClick={() => {
                      sounds.playClick();
                      onOpenEditName?.();
                    }}
                    title="Click to edit your racer name"
                    className="flex items-center gap-1.5 px-2 py-0.5 bg-[#111319]/90 border border-[#00f0ff]/60 hover:border-[#00f0ff] rounded font-mono text-[10px] sm:text-xs text-[#e1e2ea] hover:text-[#00f0ff] transition-all cursor-pointer shadow-sm hover:scale-105"
                  >
                    <User className="w-3 h-3 text-[#00f0ff]" />
                    <span className="text-[#849495]">PILOT:</span>
                    <span className="font-bold text-[#00f0ff] uppercase">{playerName}</span>
                    <Edit3 className="w-2.5 h-2.5 text-[#849495] ml-0.5" />
                  </button>
                </div>
                <h1 className="font-heading text-2xl sm:text-4xl xl:text-5xl text-[#dbfcff] font-extrabold italic tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] skew-cyber">
                  {activeBike.name.toUpperCase()}
                </h1>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono">
                  <span className="text-[#ffb778] font-bold">{activeBike.tierLabel}</span>
                  <span className="text-[#3b494b]">•</span>
                  <span className="text-[#00f0ff] font-bold">
                    {activeBike.hp} HP / {activeBike.torque} NM
                  </span>
                </div>
              </div>

              {/* Career Record HUD Card */}
              <div className="bg-[#111319]/85 backdrop-blur-md border border-[#004f54] p-2.5 sm:p-3.5 rounded-lg min-w-[150px] sm:min-w-[200px] shadow-lg">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#3b494b]/40">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-[#ffd700]" />
                    <span className="font-mono text-[9px] sm:text-[10px] text-[#849495]">CAREER RECORD</span>
                  </div>
                  <span className="font-mono text-[9px] text-[#00f0ff] font-semibold hidden sm:inline">
                    TOP 3%
                  </span>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-mono text-[#849495] text-[10px] sm:text-xs">PB:</span>
                    <span className="font-heading text-sm sm:text-lg text-[#e1e2ea] font-bold">
                      18.42 <span className="text-[10px] text-[#849495]">KM</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-mono text-[#849495] text-[10px] sm:text-xs">TOP SPEED:</span>
                    <span className="font-mono text-xs sm:text-sm text-[#ffdad5] font-bold">
                      312 <span className="text-[10px] text-[#849495]">KM/H</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Viewport Controls & Launch CTA */}
            <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-end justify-between gap-3 sm:gap-4 mt-auto">
              {/* Quick Bike Telemetry HUD Bar */}
              <div className="bg-[#111319]/90 backdrop-blur-md border border-[#3b494b]/60 p-3 sm:p-4 rounded-lg flex flex-col gap-2 min-w-full md:min-w-[320px]">
                <div className="flex items-center justify-between text-xs pb-1 border-b border-[#3b494b]/40 font-mono">
                  <span className="text-[#849495] text-[10px]">MACHINE TELEMETRY</span>
                  <button
                    id="hero-tune-link"
                    onClick={() => {
                      sounds.playClick();
                      onNavigate('garage');
                    }}
                    className="text-[#00f0ff] hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>TUNE IN GARAGE</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[11px]">
                  {/* Speed */}
                  <div>
                    <div className="flex justify-between mb-0.5 text-[#849495]">
                      <span>SPEED</span>
                      <span className="text-[#e1e2ea] font-bold">{activeBike.topSpeed}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1d2025] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00f0ff]" style={{ width: `${activeBike.topSpeed}%` }} />
                    </div>
                  </div>

                  {/* Accel */}
                  <div>
                    <div className="flex justify-between mb-0.5 text-[#849495]">
                      <span>ACCEL</span>
                      <span className="text-[#e1e2ea] font-bold">{activeBike.acceleration}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1d2025] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00f0ff]" style={{ width: `${activeBike.acceleration}%` }} />
                    </div>
                  </div>

                  {/* Handling */}
                  <div>
                    <div className="flex justify-between mb-0.5 text-[#849495]">
                      <span>HANDLING</span>
                      <span className="text-[#e1e2ea] font-bold">{activeBike.handling}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1d2025] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00f0ff]" style={{ width: `${activeBike.handling}%` }} />
                    </div>
                  </div>

                  {/* Nitro Boost */}
                  <div>
                    <div className="flex justify-between mb-0.5 text-[#849495]">
                      <span>NITRO BOOST</span>
                      <span className="text-[#ffb778] font-bold">{activeBike.nitroBoost}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1d2025] rounded-full overflow-hidden">
                      <div className="h-full bg-[#ffb778]" style={{ width: `${activeBike.nitroBoost}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Massive Primary Action: PLAY RACE / LAUNCH RACE */}
              <div className="flex flex-col items-stretch md:items-end gap-1.5">
                <button
                  id="play-race-btn"
                  onClick={() => {
                    sounds.playClick();
                    onLaunchRace();
                  }}
                  className="px-8 sm:px-12 py-3.5 sm:py-5 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002022] font-heading text-xl sm:text-2xl font-black italic tracking-wider clip-chamfer-btn pulse-glow hover:scale-105 active:scale-95 transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_24px_rgba(0,240,255,0.7)]"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span className="skew-cyber">PLAY RACE</span>
                </button>
                <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-[#849495] justify-end">
                  <kbd className="px-2 py-0.5 bg-[#1d2025] border border-[#3b494b] rounded text-[#00f0ff]">
                    SPACEBAR
                  </kbd>
                  <span>TO INSTANT LAUNCH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Nitro Crate Banner (Mobile / Compact View) */}
          <div className="xl:hidden bg-[#191c21] border-l-4 border-l-[#c5020b] border border-[#3b494b]/40 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded bg-[#c5020b]/20 border border-[#c5020b]/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#ffb4aa] animate-pulse" />
              </div>
              <div>
                <div className="font-heading text-sm font-bold text-[#e1e2ea] uppercase flex items-center gap-2">
                  DAILY NITRO CRATE
                  <span className="bg-[#c5020b] text-[#ffd2cc] text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                    Tier II
                  </span>
                </div>
                <p className="font-mono text-xs text-[#849495]">
                  Unlocks rare tune blueprints and +30 Nitro Gems
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <div className="text-[9px] font-mono text-[#849495] uppercase">REFRESH IN</div>
                <div className="font-mono text-xs sm:text-sm text-[#ffdad5] font-bold tracking-wider tabular-nums">
                  {formatCountdown(crateTimeLeft)}
                </div>
              </div>
              <button
                id="claim-crate-mobile-btn"
                onClick={onClaimCrate}
                disabled={crateClaimed}
                className={`px-4 py-2 font-mono text-xs font-bold rounded uppercase transition-all flex items-center gap-1.5 ${
                  crateClaimed
                    ? 'bg-[#1d2025] text-[#849495] border border-[#3b494b]/40 cursor-default'
                    : 'bg-[#1d2025] hover:bg-[#00f0ff] text-[#ffb4aa] hover:text-[#002022] border border-[#c5020b] pulse-red-glow active:scale-95'
                }`}
              >
                <span>{crateClaimed ? 'CLAIMED' : 'CLAIM CRATE'}</span>
              </button>
            </div>
          </div>

          {/* Quick Mode Carousel Preview */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#00f0ff] rounded-sm shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                <h2 className="font-heading text-base sm:text-lg uppercase text-[#e1e2ea] font-bold tracking-wide">
                  RACE MODES
                </h2>
              </div>
              <button
                id="view-all-modes-link"
                onClick={() => {
                  sounds.playClick();
                  onNavigate('modes');
                }}
                className="font-mono text-xs text-[#00f0ff] hover:underline flex items-center gap-1 uppercase"
              >
                <span>ALL MODES</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {modes.map((mode) => {
                const isSelected = selectedModeId === mode.id;
                const isLocked = mode.status === 'locked';

                return (
                  <div
                    key={mode.id}
                    id={`mode-card-${mode.id}`}
                    onClick={() => {
                      if (!isLocked) {
                        sounds.playClick();
                        onSelectMode(mode.id);
                      }
                    }}
                    className={`relative p-4 rounded-lg flex flex-col justify-between overflow-hidden clip-chamfer-card cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#1d2025] border-2 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                        : isLocked
                        ? 'bg-[#0b0e13]/60 border border-[#3b494b]/30 opacity-70'
                        : 'bg-[#191c21] hover:bg-[#1d2025] border border-[#3b494b]/60 hover:border-[#00f0ff]/50'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`px-2 py-0.5 font-mono text-[9px] font-bold rounded uppercase ${
                          isSelected
                            ? 'bg-[#00f0ff] text-[#002022]'
                            : isLocked
                            ? 'bg-[#272a30] text-[#849495] flex items-center gap-1'
                            : 'bg-[#ffb778] text-[#2e1500]'
                        }`}
                      >
                        {isSelected ? 'ACTIVE SELECT' : isLocked ? 'LOCKED' : 'UNLOCKED'}
                      </span>
                      <span className="font-mono text-xs text-[#00f0ff] font-bold">
                        {mode.multiplier}
                      </span>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] text-[#849495] uppercase tracking-wider mb-1">
                        {mode.tag}
                      </div>
                      <h3
                        className={`font-heading text-lg font-bold mb-1 uppercase ${
                          isSelected ? 'text-[#00f0ff]' : isLocked ? 'text-[#849495]' : 'text-[#e1e2ea]'
                        }`}
                      >
                        {mode.name}
                      </h3>
                      <p className="text-xs text-[#b9cacb] line-clamp-2 leading-relaxed mb-3">
                        {mode.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#3b494b]/30 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#849495] text-[10px]">{mode.reward}</span>
                      {isSelected ? (
                        <span className="text-[#00f0ff] font-bold flex items-center gap-1 text-[11px]">
                          ARMED <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      ) : isLocked ? (
                        <span className="text-[#ffb4ab] flex items-center gap-1 text-[11px]">
                          <Lock className="w-3 h-3" /> LVL {mode.unlockLevel}
                        </span>
                      ) : (
                        <span className="text-[#e1e2ea] hover:text-[#00f0ff] flex items-center gap-1 text-[11px]">
                          SELECT <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bento Grid: Garage, Missions, Rankings, Trophies (Mobile View) */}
          <div className="xl:hidden grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Garage */}
            <button
              id="bento-garage-btn"
              onClick={() => {
                sounds.playClick();
                onNavigate('garage');
              }}
              className="bg-[#191c21] border border-[#3b494b]/40 hover:border-[#00f0ff] p-3 rounded-lg flex flex-col justify-between text-left transition-all group hover:-translate-y-0.5 relative cursor-pointer"
            >
              {tunesReadyCount > 0 && (
                <div className="blink-notification absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#c5020b]" />
              )}
              <div className="w-8 h-8 rounded bg-[#1d2025] flex items-center justify-center text-[#00f0ff]">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <div className="font-heading text-xs sm:text-sm uppercase text-[#e1e2ea] font-bold">
                  GARAGE
                </div>
                <div className="font-mono text-[11px] text-[#00f0ff] font-semibold">
                  {tunesReadyCount} TUNES READY
                </div>
              </div>
            </button>

            {/* Missions */}
            <button
              id="bento-missions-btn"
              onClick={() => {
                sounds.playClick();
                onNavigate('modes');
              }}
              className="bg-[#191c21] border border-[#3b494b]/40 hover:border-[#ffd700] p-3 rounded-lg flex flex-col justify-between text-left transition-all group hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded bg-[#1d2025] flex items-center justify-center text-[#ffd700]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-heading text-xs sm:text-sm uppercase text-[#e1e2ea] font-bold">
                    MISSIONS
                  </span>
                  <span className="font-mono text-[10px] text-[#ffd700] font-bold">3/5</span>
                </div>
                <div className="w-full bg-[#32353b] h-1 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#ffd700] h-full w-3/5" />
                </div>
              </div>
            </button>

            {/* Rankings */}
            <button
              id="bento-rankings-btn"
              onClick={() => {
                sounds.playClick();
                onNavigate('rank');
              }}
              className="bg-[#191c21] border border-[#3b494b]/40 hover:border-[#00f0ff] p-3 rounded-lg flex flex-col justify-between text-left transition-all group hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded bg-[#1d2025] flex items-center justify-center text-[#00f0ff]">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <div className="font-heading text-xs sm:text-sm uppercase text-[#e1e2ea] font-bold">
                  RANKINGS
                </div>
                <div className="font-mono text-[11px] text-[#849495]">GLOBAL #2,412</div>
              </div>
            </button>

            {/* Trophies */}
            <button
              id="bento-trophies-btn"
              onClick={() => {
                sounds.playClick();
                onNavigate('rank');
              }}
              className="bg-[#191c21] border border-[#3b494b]/40 hover:border-[#00f0ff] p-3 rounded-lg flex flex-col justify-between text-left transition-all group hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded bg-[#1d2025] flex items-center justify-center text-[#ffdad5]">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <div className="font-heading text-xs sm:text-sm uppercase text-[#e1e2ea] font-bold">
                  TROPHIES
                </div>
                <div className="font-mono text-[11px] text-[#849495]">24/40 UNLOCKED</div>
              </div>
            </button>
          </div>
        </section>

        {/* ==================== DESKTOP RIGHT SIDEBAR (Cols 9-12 on xl+) ==================== */}
        <aside className="hidden xl:flex xl:col-span-4 flex-col gap-5">
          {/* 1. Daily Nitro Crate Card */}
          <div className="bg-[#191c21] border border-[#004f54]/80 p-5 rounded-lg relative overflow-hidden shadow-lg">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#00f0ff]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between pb-3 border-b border-[#3b494b]/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                <span className="font-heading text-base text-[#e1e2ea] font-bold">DAILY NITRO CRATE</span>
              </div>
              <span className="px-2 py-0.5 bg-[#272a30] border border-[#00f0ff]/40 text-[#00f0ff] font-mono text-[10px] rounded font-bold">
                TIER II
              </span>
            </div>

            <div className="flex items-center gap-4 my-4">
              <div className="w-14 h-14 bg-[#1d2025] border border-[#3b494b]/60 rounded flex items-center justify-center flex-shrink-0 shadow-inner">
                <Sparkles className="w-7 h-7 text-[#00f0ff] animate-bounce" />
              </div>
              <div className="space-y-0.5">
                <div className="font-heading text-sm text-[#e1e2ea] font-bold">Apex Carbon Blueprint</div>
                <div className="font-mono text-xs text-[#849495]">+30 Nitro Gems • 1x Rare Exhaust</div>
                <div className="font-mono text-xs text-[#ffb778] flex items-center gap-1 mt-1 font-bold">
                  <span>⏱ {formatCountdown(crateTimeLeft)} REMAINING</span>
                </div>
              </div>
            </div>

            <button
              id="claim-crate-desktop-btn"
              onClick={onClaimCrate}
              disabled={crateClaimed}
              className={`w-full py-2.5 font-mono text-xs font-bold tracking-wider rounded transition-colors uppercase ${
                crateClaimed
                  ? 'bg-[#1d2025] text-[#849495] border border-[#3b494b]/40'
                  : 'bg-[#1d2025] hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#002022] border border-[#00f0ff]/60 pulse-glow'
              }`}
            >
              {crateClaimed ? 'CRATE CLAIMED (+30 GEMS)' : 'CLAIM CRATE'}
            </button>
          </div>

          {/* 2. Daily Missions Hub */}
          <div className="bg-[#191c21] border border-[#3b494b]/60 p-5 rounded-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#3b494b]/40 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                <span className="font-heading text-base text-[#e1e2ea] font-bold">DAILY MISSIONS</span>
              </div>
              <span className="font-mono text-xs text-[#00f0ff] font-bold">3 / 5 COMPLETED</span>
            </div>

            <div className="space-y-2.5 font-mono">
              <div className="p-2.5 bg-[#1d2025] border border-[#00f0ff]/40 rounded flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-[#e1e2ea] font-semibold">Near-miss 25 trucks in Endless</div>
                  <div className="text-[10px] text-[#ffb778]">25 / 25 COMPLETE</div>
                </div>
                <button
                  id="claim-mission-500-btn"
                  onClick={() => sounds.playCoin()}
                  className="px-2.5 py-1 bg-[#00f0ff] text-[#002022] text-[10px] font-bold rounded hover:brightness-110"
                >
                  CLAIM +500
                </button>
              </div>

              <div className="p-2.5 bg-[#0b0e13] border border-[#3b494b]/40 rounded space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#b9cacb] text-[11px]">Reach 280 km/h in Rain Storm</span>
                  <span className="text-[#849495] text-[10px]">264 / 280 KM/H</span>
                </div>
                <div className="w-full h-1 bg-[#1d2025] rounded-full overflow-hidden">
                  <div className="h-full bg-[#00f0ff]" style={{ width: '94%' }} />
                </div>
              </div>

              <div className="p-2.5 bg-[#0b0e13] border border-[#3b494b]/40 rounded space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#b9cacb] text-[11px]">Complete 3 Lane-Filtering Combos</span>
                  <span className="text-[#849495] text-[10px]">1 / 3 DONE</span>
                </div>
                <div className="w-full h-1 bg-[#1d2025] rounded-full overflow-hidden">
                  <div className="h-full bg-[#00f0ff]" style={{ width: '33%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Live Highway Leaderboard */}
          <div className="bg-[#191c21] border border-[#3b494b]/60 p-5 rounded-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#3b494b]/40 mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#ffd700]" />
                <span className="font-heading text-base text-[#e1e2ea] font-bold">APEX LEADERBOARD</span>
              </div>
              <button
                id="sidebar-view-all-rank-btn"
                onClick={() => {
                  sounds.playClick();
                  onNavigate('rank');
                }}
                className="font-mono text-[10px] text-[#00f0ff] hover:underline uppercase"
              >
                VIEW ALL
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#0b0e13] rounded border border-[#3b494b]/30">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-[#ffd700] w-4 text-center">#1</span>
                  <span className="text-[#e1e2ea]">@GhostRider_99</span>
                </div>
                <span className="text-[#00f0ff] font-bold">42.1 KM</span>
              </div>

              <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#0b0e13] rounded border border-[#3b494b]/30">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-[#e1e2ea] w-4 text-center">#2</span>
                  <span className="text-[#b9cacb]">@ViperX</span>
                </div>
                <span className="text-[#b9cacb] font-bold">38.5 KM</span>
              </div>

              <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#0b0e13] rounded border border-[#3b494b]/30">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-[#ffb778] w-4 text-center">#3</span>
                  <span className="text-[#b9cacb]">@NeonVolt</span>
                </div>
                <span className="text-[#b9cacb] font-bold">35.2 KM</span>
              </div>

              {/* Current User Rank Snippet */}
              <div className="mt-2 pt-2 border-t border-[#3b494b]/40 flex items-center justify-between px-2.5 py-1.5 bg-[#1d2025] border border-[#00f0ff]/40 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-[#00f0ff] font-bold text-[11px]">#2,412</span>
                  <span className="text-[#e1e2ea] font-bold text-xs truncate max-w-[130px]">
                    {playerName} (You)
                  </span>
                </div>
                <span className="text-[#00f0ff] font-bold">18.42 KM</span>
              </div>
            </div>
          </div>

          {/* 4. Workshop Status */}
          <div className="p-3 bg-[#191c21] border border-[#3b494b]/60 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1d2025] rounded text-[#00f0ff]">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-xs text-[#e1e2ea] font-bold">WORKSHOP READY ({tunesReadyCount})</div>
                <div className="font-mono text-[10px] text-[#849495]">Thunder X & Street Racer</div>
              </div>
            </div>
            <button
              id="sidebar-upgrade-link"
              onClick={() => {
                sounds.playClick();
                onNavigate('garage');
              }}
              className="px-3 py-1.5 bg-[#1d2025] hover:bg-[#272a30] border border-[#3b494b] rounded font-mono text-xs text-[#e1e2ea] transition-colors"
            >
              UPGRADE
            </button>
          </div>
        </aside>
      </div>

      {/* Desktop HUD Footer Telemetry & Hotkeys (Image 9) */}
      <footer className="hidden xl:flex w-full mt-8 pt-4 border-t border-[#3b494b]/30 justify-between items-center text-[#849495] text-xs font-mono">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
            <span>TELEMETRY ONLINE // PROTOCOL v4.8</span>
          </div>
          <span>•</span>
          <span>PHYSICS ENGINE: DRIFT-DYNAMICS ACTIVE</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-[#1d2025] border border-[#3b494b] rounded text-[#e1e2ea] text-[10px]">
              SPACE
            </kbd>
            <span>LAUNCH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-[#1d2025] border border-[#3b494b] rounded text-[#e1e2ea] text-[10px]">
              G
            </kbd>
            <span>GARAGE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-[#1d2025] border border-[#3b494b] rounded text-[#e1e2ea] text-[10px]">
              M
            </kbd>
            <span>MODES</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-[#1d2025] border border-[#3b494b] rounded text-[#e1e2ea] text-[10px]">
              ESC
            </kbd>
            <span>MENU</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
