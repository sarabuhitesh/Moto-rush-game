import React from 'react';
import { ScreenType } from '../types';
import { Volume2, VolumeX, Settings, Plus, Play, Edit3 } from 'lucide-react';
import { sounds } from '../utils/audio';

export interface TopNavBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  coins?: number;
  gems?: number;
  playerCoins?: number;
  playerGems?: number;
  playerLevel?: number;
  playerName?: string;
  onAddCoins?: () => void;
  onAddGems?: () => void;
  onAddTestCoins?: () => void;
  onOpenSettings?: () => void;
  onOpenEditName?: () => void;
  onLaunchRace?: () => void;
  tunesReadyCount?: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentScreen,
  onNavigate,
  coins,
  gems,
  playerCoins,
  playerGems,
  playerLevel = 14,
  playerName = 'ApexRider',
  onAddCoins,
  onAddGems,
  onAddTestCoins,
  onOpenSettings,
  onOpenEditName,
  onLaunchRace,
  tunesReadyCount = 0
}) => {
  const [isMuted, setIsMuted] = React.useState(sounds.isMuted);

  const displayCoins = coins ?? playerCoins ?? 0;
  const displayGems = gems ?? playerGems ?? 0;
  const handleAddCoins = onAddCoins || onAddTestCoins || (() => {});
  const handleAddGems = onAddGems || onAddTestCoins || (() => {});
  const handleOpenSettings = onOpenSettings || (() => {});

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playClick();
  };

  return (
    <header
      id="top-nav-bar"
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-3 sm:px-6 h-14 sm:h-16 bg-[#0b0e13]/90 backdrop-blur-md border-b border-[#3b494b]/40 shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
    >
      {/* Brand & Track Telemetry */}
      <div className="flex items-center gap-2 sm:gap-6">
        <button
          id="nav-brand-btn"
          onClick={() => {
            sounds.playClick();
            onNavigate('lobby');
          }}
          className="flex items-center gap-1.5 sm:gap-2 group text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded bg-[#1d2025] border border-[#00f0ff]/50 flex items-center justify-center text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.3)] group-hover:scale-105 transition-transform">
            <span className="font-heading font-black italic text-xs tracking-tighter">MR</span>
          </div>
          <span className="font-heading text-lg sm:text-2xl italic font-extrabold tracking-wider text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">
            MOTO <span className="text-[#dbfcff]">RUSH</span>
          </span>
        </button>

        {/* Live Track Telemetry Pill (Desktop) */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1 bg-[#191c21] border border-[#004f54]/70 rounded text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="text-[#849495]">WEATHER:</span>
            <span className="text-[#dbfcff] font-semibold">RAIN STORM</span>
          </div>
          <span className="text-[#3b494b]">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#849495]">TARMAC:</span>
            <span className="text-[#ffb778] font-semibold">78% TRACTION</span>
          </div>
          <span className="text-[#3b494b]">|</span>
          <div className="flex items-center gap-1">
            <span className="text-[#00f0ff] font-bold">34 MS</span>
            <span className="text-[#849495]">US-EAST</span>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 font-mono text-xs tracking-wider uppercase">
        <button
          id="nav-link-lobby"
          onClick={() => {
            sounds.playClick();
            onNavigate('lobby');
          }}
          className={`pb-1 transition-all flex items-center gap-1.5 ${
            currentScreen === 'lobby'
              ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]'
              : 'text-[#849495] hover:text-[#e1e2ea]'
          }`}
        >
          Lobby
        </button>

        <button
          id="nav-link-garage"
          onClick={() => {
            sounds.playClick();
            onNavigate('garage');
          }}
          className={`relative pb-1 transition-all flex items-center gap-1.5 ${
            currentScreen === 'garage'
              ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]'
              : 'text-[#849495] hover:text-[#e1e2ea]'
          }`}
        >
          <span>Garage</span>
          {tunesReadyCount > 0 && (
            <span className="px-1.5 py-0.5 bg-[#c5020b] text-[#ffd2cc] font-mono text-[9px] rounded font-bold uppercase tracking-tight">
              {tunesReadyCount} TUNES
            </span>
          )}
        </button>

        <button
          id="nav-link-modes"
          onClick={() => {
            sounds.playClick();
            onNavigate('modes');
          }}
          className={`pb-1 transition-all ${
            currentScreen === 'modes'
              ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]'
              : 'text-[#849495] hover:text-[#e1e2ea]'
          }`}
        >
          Modes
        </button>

        <button
          id="nav-link-rank"
          onClick={() => {
            sounds.playClick();
            onNavigate('rank');
          }}
          className={`pb-1 transition-all ${
            currentScreen === 'rank'
              ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]'
              : 'text-[#849495] hover:text-[#e1e2ea]'
          }`}
        >
          Rankings
        </button>
      </nav>

      {/* Currency & Player Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Coins Counter */}
        <div
          id="coin-display"
          className="flex items-center gap-1 bg-[#191c21] px-2 sm:px-2.5 py-1 border border-[#3b494b]/60 rounded text-xs font-mono shadow-inner"
        >
          <span className="text-[#ffd700] text-sm">🪙</span>
          <span className="text-[#e1e2ea] font-bold tabular-nums">
            {displayCoins.toLocaleString()}
          </span>
          <button
            id="add-coins-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleAddCoins();
            }}
            title="Add Test Coins"
            className="w-4 h-4 rounded bg-[#272a30] hover:bg-[#00f0ff] hover:text-[#0b0e13] text-[#00f0ff] flex items-center justify-center text-[10px] ml-0.5 transition-colors"
          >
            <Plus className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Gems Counter */}
        <div
          id="gem-display"
          className="flex items-center gap-1 bg-[#191c21] px-2 sm:px-2.5 py-1 border border-[#00f0ff]/30 rounded text-xs font-mono shadow-inner"
        >
          <span className="text-[#00f0ff] text-sm">💎</span>
          <span className="text-[#00f0ff] font-bold tabular-nums">
            {displayGems.toLocaleString()}
          </span>
          <button
            id="add-gems-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleAddGems();
            }}
            title="Add Test Gems"
            className="w-4 h-4 rounded bg-[#272a30] hover:bg-[#00f0ff] hover:text-[#0b0e13] text-[#00f0ff] flex items-center justify-center text-[10px] ml-0.5 transition-colors"
          >
            <Plus className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Audio Mute Toggle */}
        <button
          id="sound-toggle-btn"
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-1.5 text-[#849495] hover:text-[#00f0ff] rounded bg-[#191c21] border border-[#3b494b]/50 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#ffb4ab]" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Settings Toggle */}
        <button
          id="settings-btn"
          onClick={() => {
            sounds.playClick();
            handleOpenSettings();
          }}
          title="Game Settings"
          className="p-1.5 text-[#849495] hover:text-[#00f0ff] rounded bg-[#191c21] border border-[#3b494b]/50 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Instant RACE NOW CTA Button */}
        {onLaunchRace && (
          <button
            id="top-nav-race-btn"
            onClick={() => {
              sounds.playClick();
              onLaunchRace();
            }}
            title="Launch Race Immediately"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002022] font-heading font-black italic text-xs uppercase rounded clip-chamfer-btn shadow-[0_0_14px_rgba(0,240,255,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="skew-cyber hidden sm:inline">RACE NOW</span>
            <span className="skew-cyber sm:hidden">RACE</span>
          </button>
        )}

        {/* Profile Cluster & Edit Name */}
        <button
          id="profile-edit-name-btn"
          onClick={() => {
            sounds.playClick();
            onOpenEditName?.();
          }}
          title="Click to edit racer callsign"
          className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[#3b494b]/40 hover:bg-[#1d2025]/80 p-1 rounded-lg transition-colors cursor-pointer group text-left"
        >
          <div className="relative">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded border-2 border-[#00f0ff] overflow-hidden bg-[#272a30] shadow-[0_0_10px_rgba(0,240,255,0.4)] group-hover:border-[#7df4ff] transition-colors">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbnxnPoibDxZw92Jq2mfkCHcXHadsC9_uMkTw4xOvEzJCxftRKPn8Omt7E0ve_bO1exhoII2lMhs0L90KBQfBQYrhrAnp0yTQiPeIZqdFbtIpivTiopIIMXDRBTCt20_xsFaNGeDaxaW07Qwp95ZCZ5oZja9_u2vVFfKHbcYuXR_kmtRFimvr9CMzMOKynE3dxDbeJPBzX4yn2e_L4eygEqPU-Goit3nULDUwA-zBnD4UZa2kDp3mn"
                alt="Apex Pilot Helmet Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 px-1 bg-[#00f0ff] text-[#002022] font-mono text-[8px] font-bold rounded">
              VIP 3
            </span>
          </div>

          <div className="hidden lg:block text-left leading-none font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#e1e2ea] group-hover:text-[#00f0ff] transition-colors truncate max-w-[90px]">
                {playerName}
              </span>
              <Edit3 className="w-3 h-3 text-[#00f0ff] opacity-70 group-hover:opacity-100 transition-opacity shrink-0" />
              <span className="text-[9px] text-[#ffb778] font-bold bg-[#1d2025] px-1 py-0.5 rounded border border-[#ffb778]/30">
                LVL {playerLevel}
              </span>
            </div>
            <div className="w-16 h-1 bg-[#1d2025] rounded-full overflow-hidden mt-1">
              <div className="h-full bg-[#00f0ff]" style={{ width: '75%' }} />
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
