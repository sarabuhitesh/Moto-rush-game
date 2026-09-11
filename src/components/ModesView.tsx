import React from 'react';
import { Bike, GameMode, TrackBiome, ScreenType } from '../types';
import { sounds } from '../utils/audio';
import { ArrowLeft, Zap, Clock, Lock, Check, Key, Shield } from 'lucide-react';

interface ModesViewProps {
  activeBike: Bike;
  modes: GameMode[];
  selectedModeId: string;
  onSelectMode: (modeId: 'endless' | 'traffic' | 'time') => void;
  onLaunchRace: () => void;
  onNavigate: (screen: ScreenType) => void;
  biomes: TrackBiome[];
  onEquipBiome: (biomeId: 'neon_midnight' | 'sunset_bay' | 'cyber_tunnel') => void;
  playerCoins: number;
  onUnlockMode: (modeId: 'traffic') => void;
}

export const ModesView: React.FC<ModesViewProps> = ({
  activeBike,
  modes,
  selectedModeId,
  onSelectMode,
  onLaunchRace,
  onNavigate,
  biomes,
  onEquipBiome,
  playerCoins,
  onUnlockMode
}) => {
  return (
    <div id="modes-view" className="pt-16 sm:pt-20 px-3 sm:px-6 max-w-4xl mx-auto pb-24 md:pb-16 telemetry-grid">
      {/* Top Header Row (Matches Image 5) */}
      <div className="flex items-center justify-between pb-3 border-b border-[#3b494b]/40 mb-4">
        <div className="flex items-center gap-3">
          <button
            id="modes-back-btn"
            onClick={() => {
              sounds.playClick();
              onNavigate('lobby');
            }}
            className="w-10 h-10 rounded-lg bg-[#191c21] border border-[#3b494b] hover:border-[#00f0ff] flex items-center justify-center text-[#e1e2ea] hover:text-[#00f0ff] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#00f0ff] uppercase tracking-widest">
              <span>MOTO RUSH</span>
              <span>•</span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-black italic tracking-wide text-[#e1e2ea] uppercase">
              SELECT GAME MODE
            </h1>
          </div>
        </div>

        {/* Player Rank Chip */}
        <div className="flex items-center gap-2 bg-[#191c21] border border-[#00f0ff]/40 px-3 py-1.5 rounded-lg shadow-sm font-mono">
          <div className="w-6 h-6 rounded bg-[#272a30] flex items-center justify-center text-[#00f0ff] text-xs font-bold">
            14
          </div>
          <div className="text-right leading-none">
            <div className="text-[9px] text-[#849495] uppercase">RANK</div>
            <div className="text-xs text-[#00f0ff] font-bold uppercase">APEX PRO</div>
          </div>
        </div>
      </div>

      {/* Subheader: Season 04 Highway Domination */}
      <div className="bg-[#191c21] border border-[#004f54]/60 px-4 py-2.5 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono mb-6">
        <div className="flex items-center gap-2 text-[#00f0ff]">
          <span>⚡</span>
          <span className="tracking-wider">SEASON 04 // HIGHWAY DOMINATION</span>
        </div>
        <div className="flex items-center gap-4 text-[#849495]">
          <div>
            ACTIVE BIKE: <span className="text-[#00f0ff] font-bold">{activeBike.name.toUpperCase()}</span>
          </div>
          <div>
            NITRO READY: <span className="text-[#00f0ff] font-bold">100%</span>
          </div>
        </div>
      </div>

      {/* Mode Cards Stack (Matches Image 5) */}
      <div className="space-y-6">
        {/* Card 1: ENDLESS RIDE */}
        <div
          id="mode-card-endless-detailed"
          className="relative bg-[#191c21] border-2 border-[#00f0ff] rounded-xl overflow-hidden shadow-[0_0_24px_rgba(0,240,255,0.2)] group"
        >
          {/* Top Hero Banner */}
          <div
            className="w-full h-44 sm:h-52 bg-cover bg-center relative flex flex-col justify-between p-4"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuByOjldD7hhG-3_Cvgj7c2kqN9f_uwvsHupn6hUEm1mQHPq6aZuuPj0yDAv8TCrYAG_p4N9UkLpMYiduuFoDWTUUxK4orhXTNCPOxqdo2qsNXd9g4r3IYLMwdJEJR_v5us4kletfobizJC0jJ_qKg6Ss4TmK91MGvIHx9AcqIi0k0yxvAD3Nl6Msa6D4Q0pxQ1-99ZJgmPOGIph4Auq-uQvBj6cnFwatM7SkuWmkjVZlygfiA1LVa7Z')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#191c21] via-transparent to-[#0b0e13]/80 pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start">
              <span className="px-2.5 py-1 bg-[#191c21]/90 border border-[#00f0ff] text-[#00f0ff] font-mono text-[10px] font-bold rounded flex items-center gap-1 uppercase">
                <Check className="w-3 h-3" /> READY
              </span>
              <span className="px-2 py-0.5 bg-[#0b0e13]/80 border border-[#3b494b] text-[#00f0ff] font-mono text-xs font-bold rounded">
                1.0x MULTIPLIER
              </span>
            </div>
          </div>

          {/* Details & CTA */}
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-baseline">
              <h2 className="font-heading text-2xl font-black italic uppercase text-[#ffffff] tracking-wide">
                ENDLESS RIDE
              </h2>
              <span className="text-[#00f0ff] text-2xl font-mono">∞</span >
            </div>
            <p className="text-sm text-[#b9cacb] leading-relaxed">
              Ride infinitely along neon highways. Dodge high-density traffic and survive the longest distance.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#3b494b]/30 font-mono">
              <div>
                <div className="text-[10px] text-[#849495] uppercase">BEST RUN</div>
                <div className="font-heading text-base font-bold text-[#e1e2ea]">18.42 KM</div>
              </div>
              <div>
                <div className="text-[10px] text-[#849495] uppercase">REWARD</div>
                <div className="font-heading text-base font-bold text-[#ffd700]">🪙 High Coin Yield</div>
              </div>
            </div>

            <button
              id="race-now-endless-btn"
              onClick={() => {
                sounds.playClick();
                onSelectMode('endless');
                onLaunchRace();
              }}
              className="w-full py-4 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002022] font-heading text-lg font-black italic tracking-wider clip-chamfer-btn pulse-glow flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              <span>RACE NOW</span>
              <Zap className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        {/* Card 2: TIME CHALLENGE */}
        <div
          id="mode-card-time-detailed"
          className="relative bg-[#191c21] border border-[#3b494b]/70 hover:border-[#00f0ff]/60 rounded-xl overflow-hidden shadow-lg group transition-colors"
        >
          <div
            className="w-full h-44 sm:h-52 bg-cover bg-center relative flex flex-col justify-between p-4"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBw2wmiDhO8graw1xUou1k_hi_kujaQAb52ZHa8fDJRVIuhI7QqXwV-kPcRL8OrvS9czNoMnK4hgrY88al-NlMGT1f8J-F0AiB6ce5LFoPqfgPDK0b5H1iSmU58Ujq2943bryCmqtE69R_hiRvGp5OshFqu2_5n1wgYYz4z5FrCe16pDVrIY4QwfTDp4uRKP-WtZ6rGYFcfb00fPhELCC2pbWTLD0OfVOYvLCoHJ7Km3TVZ08MPKv4a')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#191c21] via-transparent to-[#0b0e13]/80 pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start">
              <span className="px-2.5 py-1 bg-[#191c21]/90 border border-[#3b494b] text-[#e1e2ea] font-mono text-[10px] font-bold rounded flex items-center gap-1 uppercase">
                <Clock className="w-3 h-3 text-[#00f0ff]" /> UNLOCKED
              </span>
              <span className="px-2 py-0.5 bg-[#0b0e13]/80 border border-[#ff3b30]/60 text-[#ffdad5] font-mono text-xs font-bold rounded">
                +2S NEAR-MISS
              </span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex justify-between items-baseline">
              <h2 className="font-heading text-2xl font-black italic uppercase text-[#ffffff] tracking-wide">
                TIME CHALLENGE
              </h2>
              <span className="text-[#00f0ff] text-2xl font-mono">⏱</span>
            </div>
            <p className="text-sm text-[#b9cacb] leading-relaxed">
              Reach checkpoints before the 60s timer hits zero. Every near-miss adds +2 seconds.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#3b494b]/30 font-mono">
              <div>
                <div className="text-[10px] text-[#849495] uppercase">TARGET</div>
                <div className="font-heading text-base font-bold text-[#e1e2ea]">12 Checkpoints</div>
              </div>
              <div>
                <div className="text-[10px] text-[#849495] uppercase">TROPHY</div>
                <div className="font-heading text-base font-bold text-[#ffd700]">🏆 Bronze Trophy</div>
              </div>
            </div>

            <button
              id="race-now-time-btn"
              onClick={() => {
                sounds.playClick();
                onSelectMode('time');
                onLaunchRace();
              }}
              className="w-full py-4 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002022] font-heading text-lg font-black italic tracking-wider clip-chamfer-btn flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              <span>RACE NOW</span>
              <Clock className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card 3: TRAFFIC RUSH (Locked with Instant Unlock option) */}
        <div
          id="mode-card-traffic-detailed"
          className="relative bg-[#191c21] border border-[#3b494b]/40 rounded-xl overflow-hidden opacity-90"
        >
          {/* Locked Overlay Header */}
          <div className="w-full h-44 sm:h-52 bg-[#0b0e13]/90 relative flex flex-col justify-between p-4 carbon-mesh">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-1 bg-[#272a30] text-[#849495] font-mono text-[10px] font-bold rounded flex items-center gap-1 uppercase">
                <Lock className="w-3 h-3" /> LOCKED
              </span>
              <span className="px-2 py-0.5 bg-[#c5020b]/30 text-[#ffdad5] font-mono text-xs font-bold rounded border border-[#c5020b]">
                3.0x TRIPLE COINS
              </span>
            </div>

            <div className="flex flex-col items-center justify-center my-auto text-center">
              <div className="w-12 h-12 rounded-full bg-[#1d2025] border border-[#3b494b] flex items-center justify-center text-[#ff3b30] shadow-[0_0_15px_rgba(255,59,48,0.4)] mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs font-bold text-[#e1e2ea] uppercase tracking-wider">
                UNLOCK AT LEVEL 15
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex justify-between items-baseline">
              <h2 className="font-heading text-2xl font-black italic uppercase text-[#849495] tracking-wide">
                TRAFFIC RUSH
              </h2>
              <span className="text-[#849495] text-xl">🚦</span>
            </div>
            <p className="text-sm text-[#849495] leading-relaxed">
              Extreme rush-hour density with aggressive overtaking. Triple coin multiplier and intense near-miss streaks.
            </p>

            <div className="space-y-1.5 pt-2 border-t border-[#3b494b]/30 font-mono">
              <div className="flex justify-between text-xs text-[#849495]">
                <span>LEVEL PROGRESS</span>
                <span className="text-[#ffdad5] font-bold">LVL 14 / 15</span>
              </div>
              <div className="w-full h-1.5 bg-[#0b0e13] rounded-full overflow-hidden">
                <div className="h-full bg-[#ff3b30]" style={{ width: '93%' }} />
              </div>
              <div className="text-[11px] text-[#849495] pt-1">
                Requires Level 15 (Currently Lvl 14) or instant unlock for 3,000 Coins.
              </div>
            </div>

            <button
              id="instant-unlock-traffic-btn"
              onClick={() => {
                if (playerCoins >= 3000) {
                  onUnlockMode('traffic');
                } else {
                  sounds.playClick();
                  alert('Need 3,000 coins! Tap the + button next to coins on top to add test coins.');
                }
              }}
              className="w-full py-3.5 bg-[#1d2025] hover:bg-[#272a30] text-[#ffd700] border-2 border-[#ffd700]/70 font-heading text-base font-bold italic tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-95"
            >
              <Key className="w-4 h-4" />
              <span>INSTANT UNLOCK (3,000 COINS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== TRACK BIOME & WEATHER SELECTOR (Image 5) ==================== */}
      <div className="mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#00f0ff] rounded-sm" />
            <h3 className="font-heading text-lg font-bold text-[#e1e2ea] uppercase tracking-wide">
              TRACK BIOME & WEATHER
            </h3>
          </div>
          <span className="font-mono text-xs text-[#849495] uppercase">SELECT ACTIVE ENVIRONMENT</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          {biomes.map((biome) => {
            const isEquipped = biome.status === 'equipped';
            const isLocked = biome.status === 'locked';

            return (
              <div
                key={biome.id}
                id={`biome-card-${biome.id}`}
                onClick={() => {
                  if (!isLocked && !isEquipped) {
                    sounds.playClick();
                    onEquipBiome(biome.id);
                  }
                }}
                className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
                  isEquipped
                    ? 'bg-[#191c21] border-2 border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : isLocked
                    ? 'bg-[#0b0e13]/60 border-[#3b494b]/30 opacity-70'
                    : 'bg-[#191c21] border-[#3b494b]/60 hover:border-[#00f0ff]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      isEquipped
                        ? 'bg-[#00f0ff] text-[#002022]'
                        : isLocked
                        ? 'bg-[#272a30] text-[#849495]'
                        : 'bg-[#1d2025] text-[#b9cacb]'
                    }`}
                  >
                    {isEquipped ? 'EQUIPPED' : isLocked ? 'LOCKED' : 'UNLOCKED'}
                  </span>
                  {isEquipped && <Check className="w-4 h-4 text-[#00f0ff]" />}
                  {isLocked && <span className="text-[#ffd700] text-xs font-bold">🪙 5,000</span>}
                </div>

                <div className="font-heading text-base font-bold text-[#e1e2ea] mb-1">
                  {biome.name}
                </div>
                <div className="text-[11px] text-[#849495] space-y-0.5">
                  <div>🌙 {biome.weather}</div>
                  <div className="text-[#00f0ff] font-semibold">{biome.perk}</div>
                </div>

                {!isEquipped && !isLocked && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                      onEquipBiome(biome.id);
                    }}
                    className="mt-3 py-1 bg-[#1d2025] hover:bg-[#00f0ff] text-[#e1e2ea] hover:text-[#002022] text-xs font-bold rounded uppercase border border-[#3b494b]"
                  >
                    EQUIP
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
