import React, { useState } from 'react';
import { ScreenType, Bike, TuningStation, GameMode, TrackBiome } from './types';
import { INITIAL_BIKES, INITIAL_GAME_MODES, INITIAL_TUNING, TRACK_BIOMES } from './data/gameData';
import { TopNavBar } from './components/TopNavBar';
import { BottomNavBar } from './components/BottomNavBar';
import { LobbyView } from './components/LobbyView';
import { GarageView } from './components/GarageView';
import { ModesView } from './components/ModesView';
import { RankView } from './components/RankView';
import { RaceScreen } from './components/RaceScreen';
import { EditNameModal } from './components/EditNameModal';
import { sounds } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('lobby');

  // Player state & wallet
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('moto_rush_player_name') || 'ApexRider';
  });
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [playerCoins, setPlayerCoins] = useState(2450);
  const [playerGems, setPlayerGems] = useState(48);
  const [playerLevel, setPlayerLevel] = useState(14);
  const [crateClaimed, setCrateClaimed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper to save player name
  const handleSavePlayerName = (newName: string) => {
    const clean = newName.trim();
    if (!clean) return;
    setPlayerName(clean);
    localStorage.setItem('moto_rush_player_name', clean);
    showToast(`CALLSIGN UPDATED: ${clean.toUpperCase()}`);
  };

  const handleSaveNameAndRace = (newName: string) => {
    handleSavePlayerName(newName);
    setIsEditNameOpen(false);
    handleLaunchRace();
  };

  // Game data state
  const [bikes, setBikes] = useState<Bike[]>(INITIAL_BIKES);
  const [activeBikeId, setActiveBikeId] = useState<string>('valkyrie_v4');
  const [tuning, setTuning] = useState<TuningStation>(INITIAL_TUNING);
  const [modes, setModes] = useState<GameMode[]>(INITIAL_GAME_MODES);
  const [selectedModeId, setSelectedModeId] = useState<'endless' | 'traffic' | 'time'>('endless');
  const [biomes, setBiomes] = useState<TrackBiome[]>(TRACK_BIOMES);

  // Helper to show transient toast feedback
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Find active bike
  const activeBike = bikes.find((b) => b.id === activeBikeId) || bikes[0];
  const selectedMode = modes.find((m) => m.id === selectedModeId) || modes[0];

  // Number of upgrades ready in garage
  const tunesReadyCount = 2;

  // Add test coins helper for convenience
  const handleAddTestCoins = () => {
    sounds.playCoin();
    setPlayerCoins((prev) => prev + 1000);
    setPlayerGems((prev) => prev + 20);
    showToast('+1,000 COINS & +20 GEMS ADDED');
  };

  // Claim Daily Crate
  const handleClaimCrate = () => {
    if (crateClaimed) return;
    sounds.playClaim();
    setCrateClaimed(true);
    setPlayerGems((prev) => prev + 30);
    setPlayerCoins((prev) => prev + 500);
    showToast('CRATE UNLOCKED: +30 GEMS & +500 COINS!');
  };

  // Bike Selection
  const handleSelectBike = (bikeId: string) => {
    setActiveBikeId(bikeId);
    showToast(`EQUIPPED ${bikeId.toUpperCase()}`);
  };

  // Bike Unlock
  const handleUnlockBike = (bikeId: string) => {
    const bike = bikes.find((b) => b.id === bikeId);
    if (!bike || !bike.priceCoins) return;

    if (playerCoins >= bike.priceCoins) {
      sounds.playClaim();
      setPlayerCoins((prev) => prev - (bike.priceCoins || 0));
      setBikes((prev) =>
        prev.map((b) => (b.id === bikeId ? { ...b, status: 'owned' } : b))
      );
      setActiveBikeId(bikeId);
      showToast(`UNLOCKED & EQUIPPED ${bike.name}!`);
    }
  };

  // Subsystem upgrade
  const handleUpgradeSubsystem = (subsystem: keyof TuningStation) => {
    const sub = tuning[subsystem];
    if (sub.tier >= sub.maxTier) return;

    if (subsystem === 'nosInjector') {
      if (playerGems < sub.costGems) {
        showToast('NOT ENOUGH GEMS! Tap + on top bar.');
        return;
      }
      sounds.playUpgrade();
      setPlayerGems((prev) => prev - sub.costGems);
    } else {
      if (playerCoins < sub.costCoins) {
        showToast('NOT ENOUGH COINS! Tap + on top bar.');
        return;
      }
      sounds.playUpgrade();
      setPlayerCoins((prev) => prev - sub.costCoins);
    }

    // Apply upgrade
    setTuning((prev) => ({
      ...prev,
      [subsystem]: {
        ...prev[subsystem],
        tier: prev[subsystem].tier + 1,
        costCoins: Math.round(prev[subsystem].costCoins * 1.3),
        costGems: Math.round(prev[subsystem].costGems * 1.25)
      }
    }));

    // Boost active bike telemetry stats accordingly
    setBikes((prev) =>
      prev.map((b) => {
        if (b.id === activeBikeId) {
          if (subsystem === 'speedTurbine') {
            return { ...b, topSpeed: Math.min(100, b.topSpeed + 4), hp: b.hp + 18 };
          } else if (subsystem === 'driveGearbox') {
            return { ...b, acceleration: Math.min(100, b.acceleration + 3) };
          } else if (subsystem === 'raceSuspension') {
            return { ...b, handling: Math.min(100, b.handling + 4), braking: Math.min(100, b.braking + 3) };
          } else if (subsystem === 'nosInjector') {
            return { ...b, nitroBoost: Math.min(100, b.nitroBoost + 5) };
          }
        }
        return b;
      })
    );

    showToast(`UPGRADED ${sub.name.toUpperCase()} TO TIER ${sub.tier + 1}!`);
  };

  // Upgrade All
  const handleUpgradeAll = () => {
    const totalCost =
      (tuning.speedTurbine.tier < tuning.speedTurbine.maxTier ? tuning.speedTurbine.costCoins : 0) +
      (tuning.driveGearbox.tier < tuning.driveGearbox.maxTier ? tuning.driveGearbox.costCoins : 0) +
      (tuning.raceSuspension.tier < tuning.raceSuspension.maxTier ? tuning.raceSuspension.costCoins : 0);

    if (playerCoins < totalCost) {
      showToast('NOT ENOUGH COINS FOR BULK UPGRADE!');
      return;
    }

    sounds.playUpgrade();
    setPlayerCoins((prev) => prev - totalCost);

    setTuning((prev) => ({
      ...prev,
      speedTurbine: { ...prev.speedTurbine, tier: Math.min(prev.speedTurbine.maxTier, prev.speedTurbine.tier + 1) },
      driveGearbox: { ...prev.driveGearbox, tier: Math.min(prev.driveGearbox.maxTier, prev.driveGearbox.tier + 1) },
      raceSuspension: { ...prev.raceSuspension, tier: Math.min(prev.raceSuspension.maxTier, prev.raceSuspension.tier + 1) }
    }));

    setBikes((prev) =>
      prev.map((b) => {
        if (b.id === activeBikeId) {
          return {
            ...b,
            topSpeed: Math.min(100, b.topSpeed + 4),
            acceleration: Math.min(100, b.acceleration + 3),
            handling: Math.min(100, b.handling + 4)
          };
        }
        return b;
      })
    );

    showToast('AUTO CONFIG: ALL SUBSYSTEMS ENHANCED!');
  };

  // Mode Selection
  const handleSelectMode = (modeId: 'endless' | 'traffic' | 'time') => {
    setSelectedModeId(modeId);
  };

  // Instant unlock Traffic Rush mode
  const handleUnlockMode = (modeId: 'traffic') => {
    if (playerCoins >= 3000) {
      sounds.playClaim();
      setPlayerCoins((prev) => prev - 3000);
      setModes((prev) =>
        prev.map((m) => (m.id === modeId ? { ...m, status: 'unlocked' } : m))
      );
      setSelectedModeId(modeId);
      showToast('TRAFFIC RUSH MODE UNLOCKED!');
    }
  };

  // Equip Biome
  const handleEquipBiome = (biomeId: 'neon_midnight' | 'sunset_bay' | 'cyber_tunnel') => {
    setBiomes((prev) =>
      prev.map((b) => ({
        ...b,
        status: b.id === biomeId ? 'equipped' : b.status === 'equipped' ? 'unlocked' : b.status
      }))
    );
    showToast(`BIOME EQUIPPED`);
  };

  // Launch Race
  const handleLaunchRace = () => {
    setCurrentScreen('race');
  };

  // Exit Race
  const handleExitRace = (earnedCoins: number, distanceMeters: number) => {
    sounds.playCoin();
    setPlayerCoins((prev) => prev + (earnedCoins || 0));
    setCurrentScreen('lobby');
    showToast(`RACE FINISHED! +${earnedCoins || 0} COINS (DISTANCE: ${(distanceMeters || 0).toLocaleString()}M)`);
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-[#e1e2ea] font-sans antialiased relative selection:bg-[#00f0ff] selection:text-[#002022] overflow-x-hidden">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#191c21] border-2 border-[#00f0ff] px-5 py-2.5 rounded-lg shadow-[0_0_24px_rgba(0,240,255,0.6)] font-mono text-xs sm:text-sm font-bold text-[#00f0ff] flex items-center gap-2 animate-in fade-in slide-in-from-top-4"
        >
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Nav Bar (Shown across all screens except fullscreen race) */}
      {currentScreen !== 'race' && (
        <TopNavBar
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          coins={playerCoins}
          gems={playerGems}
          playerCoins={playerCoins}
          playerGems={playerGems}
          playerLevel={playerLevel}
          playerName={playerName}
          onAddCoins={handleAddTestCoins}
          onAddGems={handleAddTestCoins}
          onAddTestCoins={handleAddTestCoins}
          onOpenSettings={() => showToast('SYSTEM SETTINGS: AUDIO & SENSORS NOMINAL')}
          onOpenEditName={() => setIsEditNameOpen(true)}
          onLaunchRace={handleLaunchRace}
          tunesReadyCount={tunesReadyCount}
        />
      )}

      {/* Active Screen View */}
      <main className="w-full">
        {currentScreen === 'lobby' && (
          <LobbyView
            activeBike={activeBike}
            modes={modes}
            selectedModeId={selectedModeId}
            onSelectMode={handleSelectMode}
            onLaunchRace={handleLaunchRace}
            onNavigate={setCurrentScreen}
            onClaimCrate={handleClaimCrate}
            crateClaimed={crateClaimed}
            tunesReadyCount={tunesReadyCount}
            playerName={playerName}
            playerLevel={playerLevel}
            onOpenEditName={() => setIsEditNameOpen(true)}
          />
        )}

        {currentScreen === 'garage' && (
          <GarageView
            bikes={bikes}
            activeBike={activeBike}
            onSelectBike={handleSelectBike}
            onUnlockBike={handleUnlockBike}
            tuning={tuning}
            onUpgradeSubsystem={handleUpgradeSubsystem}
            onUpgradeAll={handleUpgradeAll}
            onLaunchRace={handleLaunchRace}
            onNavigate={setCurrentScreen}
            playerCoins={playerCoins}
            playerGems={playerGems}
          />
        )}

        {currentScreen === 'modes' && (
          <ModesView
            activeBike={activeBike}
            modes={modes}
            selectedModeId={selectedModeId}
            onSelectMode={handleSelectMode}
            onLaunchRace={handleLaunchRace}
            onNavigate={setCurrentScreen}
            biomes={biomes}
            onEquipBiome={handleEquipBiome}
            playerCoins={playerCoins}
            onUnlockMode={handleUnlockMode}
          />
        )}

        {currentScreen === 'rank' && (
          <RankView
            onNavigate={setCurrentScreen}
            onLaunchRace={handleLaunchRace}
            playerName={playerName}
            onOpenEditName={() => setIsEditNameOpen(true)}
          />
        )}

        {currentScreen === 'race' && (
          <RaceScreen
            activeBike={activeBike}
            selectedMode={selectedMode}
            onExitRace={handleExitRace}
            playerName={playerName}
          />
        )}
      </main>

      {/* Edit Racer Name Modal */}
      <EditNameModal
        isOpen={isEditNameOpen}
        currentName={playerName}
        onClose={() => setIsEditNameOpen(false)}
        onSaveName={handleSavePlayerName}
        onSaveAndRace={handleSaveNameAndRace}
      />

      {/* Bottom Nav Bar (Mobile Navigation, hidden during race) */}
      {currentScreen !== 'race' && (
        <BottomNavBar
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          tunesReadyCount={tunesReadyCount}
        />
      )}
    </div>
  );
}
