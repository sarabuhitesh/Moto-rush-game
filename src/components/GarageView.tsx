import React, { useState } from 'react';
import { Bike, TuningStation, ScreenType } from '../types';
import { sounds } from '../utils/audio';
import { ArrowLeft, RotateCw, Palette, Check, Lock, Zap, Gauge, Flame, ShieldAlert, ChevronRight } from 'lucide-react';

interface GarageViewProps {
  bikes: Bike[];
  activeBike: Bike;
  onSelectBike: (bikeId: string) => void;
  onUnlockBike: (bikeId: string) => void;
  tuning: TuningStation;
  onUpgradeSubsystem: (subsystem: keyof TuningStation) => void;
  onUpgradeAll: () => void;
  onLaunchRace: () => void;
  onNavigate: (screen: ScreenType) => void;
  playerCoins: number;
  playerGems: number;
}

export const GarageView: React.FC<GarageViewProps> = ({
  bikes,
  activeBike,
  onSelectBike,
  onUnlockBike,
  tuning,
  onUpgradeSubsystem,
  onUpgradeAll,
  onLaunchRace,
  onNavigate,
  playerCoins,
  playerGems
}) => {
  const [is360Spin, setIs360Spin] = useState(false);
  const [activeLiveryIdx, setActiveLiveryIdx] = useState(0);
  const [inspectTilt, setInspectTilt] = useState({ x: 0, y: 0 });

  const liveries = [
    { name: 'Cyber Cyan', accent: '#00f0ff' },
    { name: 'Neon Crimson', accent: '#ff3b30' },
    { name: 'Acid Gold', accent: '#ffd700' },
    { name: 'Stealth Carbon', accent: '#3b494b' }
  ];

  // Dynamic telemetry overall score
  const telemetryScore = (
    (activeBike.topSpeed +
      activeBike.handling +
      activeBike.acceleration +
      activeBike.braking +
      activeBike.nitroBoost) /
    5
  ).toFixed(1);

  // Total upgrade all cost
  const totalCoinsNeeded =
    (tuning.speedTurbine.tier < tuning.speedTurbine.maxTier ? tuning.speedTurbine.costCoins : 0) +
    (tuning.driveGearbox.tier < tuning.driveGearbox.maxTier ? tuning.driveGearbox.costCoins : 0) +
    (tuning.raceSuspension.tier < tuning.raceSuspension.maxTier ? tuning.raceSuspension.costCoins : 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (is360Spin) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setInspectTilt({ x: x * 15, y: -y * 15 });
  };

  const handleMouseLeave = () => {
    if (!is360Spin) {
      setInspectTilt({ x: 0, y: 0 });
    }
  };

  return (
    <div id="garage-view" className="pt-16 sm:pt-20 px-3 sm:px-6 max-w-4xl mx-auto pb-24 md:pb-16 telemetry-grid">
      {/* Top Header Row (Matches Image 7) */}
      <div className="flex items-center justify-between pb-3 border-b border-[#3b494b]/40 mb-4">
        <div className="flex items-center gap-3">
          <button
            id="garage-back-btn"
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
              <span>RACE WORKSHOP</span>
              <span>•</span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-black italic tracking-wide text-[#e1e2ea] uppercase">
              GARAGE
            </h1>
          </div>
        </div>

        {/* Currency summary */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
          <div className="bg-[#191c21] border border-[#3b494b] px-2.5 py-1 rounded flex items-center gap-1.5">
            <span className="text-[#ffd700]">🪙</span>
            <span className="text-[#e1e2ea] font-bold">{(playerCoins ?? 0).toLocaleString()}</span>
          </div>
          <div className="bg-[#191c21] border border-[#00f0ff]/40 px-2.5 py-1 rounded flex items-center gap-1.5">
            <span className="text-[#00f0ff]">💎</span>
            <span className="text-[#00f0ff] font-bold">{(playerGems ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ==================== FEATURED SUPERBIKE HERO STAGE ==================== */}
      <div className="relative w-full bg-[#191c21] border border-[#3b494b]/70 rounded-xl overflow-hidden p-4 sm:p-6 mb-6 shadow-2xl clip-chamfer-panel">
        {/* Top Watermark Telemetry */}
        <div className="flex justify-between items-start mb-3 font-mono text-[10px] sm:text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#00f0ff] text-[#002022] font-bold rounded uppercase">
                {activeBike.className}
              </span>
              <span className="text-[#849495] font-semibold">{activeBike.tierLabel}</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-black italic text-[#ffffff] uppercase tracking-tight mt-1 skew-cyber">
              {activeBike.name}{' '}
              <span className="text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]">
                {activeBike.subName}
              </span>
            </h2>
            <div className="text-[#849495] text-[11px] mt-0.5">
              {activeBike.cc}CC • RPM CAP: {(activeBike.rpmCap ?? 16000).toLocaleString()}
            </div>
          </div>

          <div className="text-right text-[#849495] space-y-0.5 hidden sm:block">
            <div>STATUS: OPTIMAL</div>
            <div className="text-[#00f0ff] font-semibold">TELEMETRY LINK: STABLE</div>
            <div>AERODYNAMIC INDEX: 0.28</div>
          </div>
        </div>

        {/* 3D Superbike Showcase Canvas / Viewer */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-[260px] sm:h-[340px] rounded-lg overflow-hidden flex items-center justify-center bg-[#0b0e13] border border-[#3b494b]/40 cursor-grab group"
          style={{
            perspective: '1000px'
          }}
        >
          {/* Ambient Studio Lighting Glow with selected Livery accent */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-500"
            style={{
              background: `radial-gradient(circle at center, ${liveries[activeLiveryIdx].accent} 0%, transparent 70%)`
            }}
          />

          {/* Superbike Visual with 3D Tilt or 360 Spin */}
          <div
            className={`w-full h-full bg-contain bg-no-repeat bg-center transition-transform duration-200 ${
              is360Spin ? 'animate-spin' : ''
            }`}
            style={{
              backgroundImage: `url('${activeBike.image}')`,
              transform: is360Spin
                ? undefined
                : `rotateY(${inspectTilt.x}deg) rotateX(${inspectTilt.y}deg) scale(1.05)`,
              animationDuration: '10s'
            }}
          />

          {/* Scanline texture */}
          <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
        </div>

        {/* Inspection Tools Bar: 360 Spin, Drag to Inspect, Livery (4) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-[#3b494b]/40 font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              id="spin-360-toggle-btn"
              onClick={() => {
                sounds.playClick();
                setIs360Spin((prev) => !prev);
              }}
              className={`px-3 py-1.5 rounded border flex items-center gap-1.5 transition-colors ${
                is360Spin
                  ? 'bg-[#00f0ff] text-[#002022] border-[#00f0ff] font-bold'
                  : 'bg-[#1d2025] hover:bg-[#272a30] text-[#e1e2ea] border-[#3b494b]'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${is360Spin ? 'animate-spin' : ''}`} />
              <span>360° SPIN</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-[#849495] text-[11px] pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
              <span>DRAG TO INSPECT</span>
            </div>
          </div>

          {/* Livery Selector */}
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="text-[#849495] uppercase text-[11px]">LIVERY (4):</span>
            <div className="flex items-center gap-1">
              {liveries.map((liv, idx) => (
                <button
                  key={liv.name}
                  id={`livery-btn-${idx}`}
                  title={liv.name}
                  onClick={() => {
                    sounds.playClick();
                    setActiveLiveryIdx(idx);
                  }}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    activeLiveryIdx === idx
                      ? 'scale-125 border-[#ffffff] shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'border-[#3b494b] opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: liv.accent }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== SELECT MACHINE CAROUSEL ==================== */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#00f0ff] rounded-sm" />
            <h3 className="font-heading text-lg font-bold text-[#e1e2ea] uppercase tracking-wide">
              SELECT MACHINE
            </h3>
          </div>
          <span className="text-xs text-[#00f0ff] uppercase">{bikes.length} VEHICLES DISCOVERED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
          {bikes.map((bike) => {
            const isSelected = activeBike.id === bike.id;
            const isLocked = bike.status === 'locked';

            return (
              <div
                key={bike.id}
                id={`bike-card-${bike.id}`}
                onClick={() => {
                  if (!isLocked) {
                    sounds.playClick();
                    onSelectBike(bike.id);
                  }
                }}
                className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#1d2025] border-2 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                    : isLocked
                    ? 'bg-[#0b0e13]/60 border-[#3b494b]/40 opacity-70'
                    : 'bg-[#191c21] border-[#3b494b]/60 hover:border-[#00f0ff]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#849495] font-bold uppercase">
                    {bike.className}
                  </span>
                  {isSelected ? (
                    <span className="px-2 py-0.5 bg-[#00f0ff] text-[#002022] text-[9px] font-bold rounded uppercase">
                      SELECTED
                    </span>
                  ) : isLocked ? (
                    <span className="px-2 py-0.5 bg-[#272a30] text-[#ffb4ab] text-[9px] font-bold rounded uppercase flex items-center gap-1">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#ffb778] font-semibold uppercase">READY</span>
                  )}
                </div>

                {/* Bike Image Thumbnail */}
                <div className="w-full h-28 my-2 rounded bg-[#0b0e13] overflow-hidden flex items-center justify-center">
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="w-full h-full object-contain p-2 hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="pt-2 border-t border-[#3b494b]/30 flex items-center justify-between">
                  <div>
                    <div className="font-heading text-base font-bold text-[#e1e2ea] uppercase">
                      {bike.name}
                    </div>
                    <div className="text-[10px] text-[#849495]">{bike.hp} HP</div>
                  </div>

                  {isSelected ? (
                    <div className="flex items-center gap-1 text-[#00f0ff] text-xs font-bold uppercase">
                      <Check className="w-4 h-4" /> IN USE
                    </div>
                  ) : isLocked ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (playerCoins >= (bike.priceCoins || 5000)) {
                          onUnlockBike(bike.id);
                        } else {
                          sounds.playClick();
                          alert('Need 5,000 coins to unlock this beast! Add test coins on top.');
                        }
                      }}
                      className="px-2.5 py-1 bg-[#ffd700] hover:bg-[#ffe16d] text-[#002022] text-xs font-bold rounded uppercase"
                    >
                      🪙 {(bike.priceCoins ?? 5000).toLocaleString()}
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playClick();
                        onSelectBike(bike.id);
                      }}
                      className="px-3 py-1 bg-[#1d2025] hover:bg-[#00f0ff] text-[#e1e2ea] hover:text-[#002022] text-xs font-bold rounded uppercase border border-[#3b494b]"
                    >
                      EQUIP
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== TELEMETRY MATRIX (Matches Image 7) ==================== */}
      <div className="bg-[#191c21] border border-[#3b494b]/70 p-5 rounded-xl space-y-4 mb-6">
        <div className="flex justify-between items-center pb-2 border-b border-[#3b494b]/40 font-mono">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#e1e2ea] uppercase tracking-wide">
              TELEMETRY MATRIX
            </h3>
            <div className="text-[10px] text-[#849495]">REAL-TIME BIKE DYNAMICS</div>
          </div>
          <div className="px-3 py-1 bg-[#00f0ff]/15 border border-[#00f0ff] text-[#00f0ff] font-bold text-xs rounded">
            SCORE: {telemetryScore}
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {/* Speed */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[#849495] flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#00f0ff]" /> SPEED
              </span>
              <span className="text-[#e1e2ea] font-bold">
                {activeBike.topSpeed} /100 <span className="text-[#00f0ff] text-[10px]">(+4 Next Tier)</span>
              </span>
            </div>
            <div className="w-full h-2 bg-[#0b0e13] rounded-full overflow-hidden">
              <div className="h-full bg-[#00f0ff]" style={{ width: `${activeBike.topSpeed}%` }} />
            </div>
          </div>

          {/* Handling */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[#849495] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#00f0ff]" /> HANDLING
              </span>
              <span className="text-[#e1e2ea] font-bold">{activeBike.handling} /100</span>
            </div>
            <div className="w-full h-2 bg-[#0b0e13] rounded-full overflow-hidden">
              <div className="h-full bg-[#00f0ff]" style={{ width: `${activeBike.handling}%` }} />
            </div>
          </div>

          {/* Acceleration */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[#849495] flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-[#00f0ff]" /> ACCELERATION
              </span>
              <span className="text-[#e1e2ea] font-bold">{activeBike.acceleration} /100</span>
            </div>
            <div className="w-full h-2 bg-[#0b0e13] rounded-full overflow-hidden">
              <div className="h-full bg-[#00f0ff]" style={{ width: `${activeBike.acceleration}%` }} />
            </div>
          </div>

          {/* Braking */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[#849495] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#00f0ff]" /> BRAKING
              </span>
              <span className="text-[#e1e2ea] font-bold">{activeBike.braking} /100</span>
            </div>
            <div className="w-full h-2 bg-[#0b0e13] rounded-full overflow-hidden">
              <div className="h-full bg-[#00f0ff]" style={{ width: `${activeBike.braking}%` }} />
            </div>
          </div>

          {/* Nitro Boost */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[#849495] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#ff3b30]" /> NITRO BOOST
              </span>
              <span className="text-[#ffdad5] font-bold">{activeBike.nitroBoost} /100</span>
            </div>
            <div className="w-full h-2 bg-[#0b0e13] rounded-full overflow-hidden">
              <div className="h-full bg-[#ff3b30]" style={{ width: `${activeBike.nitroBoost}%` }} />
            </div>
          </div>
        </div>

        {/* Tuner Verdict Card */}
        <div className="p-3 bg-[#0b0e13] border-l-4 border-l-[#00f0ff] border border-[#3b494b]/40 rounded text-xs">
          <div className="font-mono text-[#00f0ff] font-bold uppercase mb-1">TUNER VERDICT</div>
          <p className="text-[#b9cacb] leading-relaxed">{activeBike.tunerVerdict}</p>
        </div>
      </div>

      {/* ==================== TUNING STATION (Matches Image 7) ==================== */}
      <div className="bg-[#191c21] border border-[#3b494b]/70 p-5 rounded-xl space-y-4 mb-6">
        <div className="flex justify-between items-center pb-2 border-b border-[#3b494b]/40 font-mono">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#e1e2ea] uppercase tracking-wide">
              TUNING STATION
            </h3>
            <div className="text-[10px] text-[#849495]">ENHANCE SPECIFIC SUBSYSTEMS</div>
          </div>
          <button
            id="auto-config-btn"
            onClick={() => {
              sounds.playClick();
              onUpgradeAll();
            }}
            className="text-xs text-[#00f0ff] hover:underline flex items-center gap-1 font-bold uppercase"
          >
            <span>⚡ AUTO CONFIG</span>
          </button>
        </div>

        {/* Tuning Upgrades List */}
        <div className="space-y-4 font-mono">
          {/* 1. Speed Turbine */}
          <div className="p-3 bg-[#0b0e13] border border-[#3b494b]/40 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-heading text-sm font-bold text-[#e1e2ea] uppercase flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[#00f0ff]" /> SPEED TURBINE
                </div>
                <div className="text-[10px] text-[#849495]">
                  Tier {tuning.speedTurbine.tier} / {tuning.speedTurbine.maxTier}
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(tuning.speedTurbine.maxTier)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-1.5 rounded-sm ${
                      i < tuning.speedTurbine.tier ? 'bg-[#00f0ff]' : 'bg-[#272a30]'
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              id="upgrade-speed-turbine-btn"
              disabled={tuning.speedTurbine.tier >= tuning.speedTurbine.maxTier}
              onClick={() => onUpgradeSubsystem('speedTurbine')}
              className="w-full py-2 bg-[#1d2025] hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#002022] border border-[#00f0ff]/50 font-bold text-xs rounded uppercase transition-colors"
            >
              {tuning.speedTurbine.tier >= tuning.speedTurbine.maxTier
                ? 'MAX TIER REACHED'
                : `UPGRADE 🪙 ${tuning.speedTurbine.costCoins}`}
            </button>
          </div>

          {/* 2. Drive Gearbox */}
          <div className="p-3 bg-[#0b0e13] border border-[#3b494b]/40 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-heading text-sm font-bold text-[#e1e2ea] uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#00f0ff]" /> DRIVE GEARBOX
                </div>
                <div className="text-[10px] text-[#849495]">
                  Tier {tuning.driveGearbox.tier} / {tuning.driveGearbox.maxTier}
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(tuning.driveGearbox.maxTier)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-1.5 rounded-sm ${
                      i < tuning.driveGearbox.tier ? 'bg-[#00f0ff]' : 'bg-[#272a30]'
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              id="upgrade-gearbox-btn"
              disabled={tuning.driveGearbox.tier >= tuning.driveGearbox.maxTier}
              onClick={() => onUpgradeSubsystem('driveGearbox')}
              className="w-full py-2 bg-[#1d2025] hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#002022] border border-[#00f0ff]/50 font-bold text-xs rounded uppercase transition-colors"
            >
              {tuning.driveGearbox.tier >= tuning.driveGearbox.maxTier
                ? 'MAX TIER REACHED'
                : `UPGRADE 🪙 ${tuning.driveGearbox.costCoins}`}
            </button>
          </div>

          {/* 3. Race Suspension */}
          <div className="p-3 bg-[#0b0e13] border border-[#3b494b]/40 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-heading text-sm font-bold text-[#e1e2ea] uppercase flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#00f0ff]" /> RACE SUSPENSION
                </div>
                <div className="text-[10px] text-[#849495]">
                  Tier {tuning.raceSuspension.tier} / {tuning.raceSuspension.maxTier}
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(tuning.raceSuspension.maxTier)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-1.5 rounded-sm ${
                      i < tuning.raceSuspension.tier ? 'bg-[#00f0ff]' : 'bg-[#272a30]'
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              id="upgrade-suspension-btn"
              disabled={tuning.raceSuspension.tier >= tuning.raceSuspension.maxTier}
              onClick={() => onUpgradeSubsystem('raceSuspension')}
              className="w-full py-2 bg-[#1d2025] hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#002022] border border-[#00f0ff]/50 font-bold text-xs rounded uppercase transition-colors"
            >
              {tuning.raceSuspension.tier >= tuning.raceSuspension.maxTier
                ? 'MAX TIER REACHED'
                : `UPGRADE 🪙 ${tuning.raceSuspension.costCoins}`}
            </button>
          </div>

          {/* 4. NOS Injector */}
          <div className="p-3 bg-[#0b0e13] border border-[#3b494b]/40 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-heading text-sm font-bold text-[#e1e2ea] uppercase flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#ff3b30]" /> NOS INJECTOR
                </div>
                <div className="text-[10px] text-[#849495]">
                  Tier {tuning.nosInjector.tier} / {tuning.nosInjector.maxTier}
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(tuning.nosInjector.maxTier)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-1.5 rounded-sm ${
                      i < tuning.nosInjector.tier ? 'bg-[#ff3b30]' : 'bg-[#272a30]'
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              id="upgrade-nos-btn"
              disabled={tuning.nosInjector.tier >= tuning.nosInjector.maxTier}
              onClick={() => onUpgradeSubsystem('nosInjector')}
              className="w-full py-2 bg-[#1d2025] hover:bg-[#ff3b30] text-[#ffdad5] hover:text-[#ffffff] border border-[#ff3b30]/50 font-bold text-xs rounded uppercase transition-colors"
            >
              {tuning.nosInjector.tier >= tuning.nosInjector.maxTier
                ? 'MAX TIER REACHED'
                : `UPGRADE 💎 ${tuning.nosInjector.costGems}`}
            </button>
          </div>
        </div>

        {/* Upgrade All Button */}
        {totalCoinsNeeded > 0 && (
          <button
            id="upgrade-all-btn"
            onClick={onUpgradeAll}
            className="w-full py-3 bg-[#1d2025] hover:bg-[#272a30] text-[#e1e2ea] hover:text-[#00f0ff] border border-[#3b494b] font-mono text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>↑ UPGRADE ALL ({(totalCoinsNeeded ?? 0).toLocaleString()})</span>
          </button>
        )}

        {/* Primary Launch Action: RACE WITH THIS BIKE > */}
        <button
          id="race-with-bike-btn"
          onClick={() => {
            sounds.playClick();
            onLaunchRace();
          }}
          className="w-full py-4 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002022] font-heading text-lg font-black italic tracking-wider clip-chamfer-btn pulse-glow flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
        >
          <span>RACE WITH THIS BIKE</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
