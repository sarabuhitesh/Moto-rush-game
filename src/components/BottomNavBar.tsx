import React from 'react';
import { ScreenType } from '../types';
import { sounds } from '../utils/audio';

interface BottomNavBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  tunesReadyCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  tunesReadyCount
}) => {
  return (
    <nav
      id="bottom-nav-bar"
      className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-3 py-2 bg-[#0b0e13]/95 backdrop-blur-md border-t border-[#3b494b]/40 shadow-[0_-4px_24px_rgba(0,0,0,0.85)] md:hidden"
    >
      {/* Lobby Tab */}
      <button
        id="bottom-tab-lobby"
        onClick={() => {
          sounds.playClick();
          onNavigate('lobby');
        }}
        className={`flex flex-col items-center justify-center transition-all ${
          currentScreen === 'lobby'
            ? 'text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]'
            : 'text-[#849495] hover:text-[#e1e2ea]'
        }`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        <span className="text-[10px] font-mono uppercase font-bold mt-1 tracking-wider">
          LOBBY
        </span>
      </button>

      {/* Garage Tab */}
      <button
        id="bottom-tab-garage"
        onClick={() => {
          sounds.playClick();
          onNavigate('garage');
        }}
        className={`relative flex flex-col items-center justify-center transition-all ${
          currentScreen === 'garage'
            ? 'text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]'
            : 'text-[#849495] hover:text-[#e1e2ea]'
        }`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
          </svg>
          {tunesReadyCount > 0 && (
            <span className="blink-notification absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#c5020b] shadow-[0_0_6px_rgba(255,59,48,0.9)]" />
          )}
        </div>
        <span className="text-[10px] font-mono uppercase font-bold mt-1 tracking-wider">
          GARAGE
        </span>
      </button>

      {/* Modes Tab */}
      <button
        id="bottom-tab-modes"
        onClick={() => {
          sounds.playClick();
          onNavigate('modes');
        }}
        className={`flex flex-col items-center justify-center transition-all ${
          currentScreen === 'modes'
            ? 'text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]'
            : 'text-[#849495] hover:text-[#e1e2ea]'
        }`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
          </svg>
        </div>
        <span className="text-[10px] font-mono uppercase font-bold mt-1 tracking-wider">
          MODES
        </span>
      </button>

      {/* Rank Tab */}
      <button
        id="bottom-tab-rank"
        onClick={() => {
          sounds.playClick();
          onNavigate('rank');
        }}
        className={`flex flex-col items-center justify-center transition-all ${
          currentScreen === 'rank'
            ? 'text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]'
            : 'text-[#849495] hover:text-[#e1e2ea]'
        }`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-6h2v6zm4 0h-2v-9h2v9zm-8 0H6v-3h2v3z" />
          </svg>
        </div>
        <span className="text-[10px] font-mono uppercase font-bold mt-1 tracking-wider">
          RANK
        </span>
      </button>
    </nav>
  );
};
