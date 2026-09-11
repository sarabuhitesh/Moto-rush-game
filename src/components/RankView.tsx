import React, { useState } from 'react';
import { ScreenType } from '../types';
import { sounds } from '../utils/audio';
import { ArrowLeft, Trophy, Medal, Award, Flame, Sparkles, ChevronRight, CheckCircle2, Edit3 } from 'lucide-react';

interface RankViewProps {
  onNavigate: (screen: ScreenType) => void;
  onLaunchRace: () => void;
  playerName?: string;
  onOpenEditName?: () => void;
}

export const RankView: React.FC<RankViewProps> = ({
  onNavigate,
  onLaunchRace,
  playerName = 'ApexRider',
  onOpenEditName
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'trophies'>('leaderboard');
  const [timeFilter, setTimeFilter] = useState<'season' | 'allTime'>('season');

  const leaderboard = [
    { rank: 1, name: 'GhostRider_99', bike: 'Valkyrie V4-RR', distance: '42.10 KM', score: '482,900', badge: '🥇' },
    { rank: 2, name: 'ViperX', bike: 'Thunder X 750', distance: '38.54 KM', score: '412,400', badge: '🥈' },
    { rank: 3, name: 'NeonVolt', bike: 'Phantom 1000 RR', distance: '35.20 KM', score: '388,150', badge: '🥉' },
    { rank: 4, name: 'CyberPulse', bike: 'Thunder X 750', distance: '31.80 KM', score: '345,000', badge: '' },
    { rank: 5, name: 'ShadowDrifter', bike: 'Valkyrie V4-RR', distance: '29.40 KM', score: '312,800', badge: '' },
    { rank: 6, name: 'ApexKitsune', bike: 'Street Racer GT', distance: '27.15 KM', score: '295,400', badge: '' },
    { rank: 7, name: 'TurboVortex', bike: 'Thunder X 750', distance: '25.60 KM', score: '278,900', badge: '' }
  ];

  const trophies = [
    { title: 'Highway Phantom', desc: 'Execute 50 Near-Misses in a single Endless run', unlocked: true, reward: '+50 Gems' },
    { title: 'Mach 1 Breaker', desc: 'Exceed 300 km/h for 15 seconds continuously', unlocked: true, reward: '+1,500 Coins' },
    { title: 'Apex Survivor', desc: 'Survive over 15 kilometers without collision', unlocked: true, reward: 'Valkyrie Decal' },
    { title: 'Nitrogen Overload', desc: 'Trigger 10 consecutive Nitro boosts without empty tank', unlocked: false, reward: '+80 Gems' },
    { title: 'Lane Filter King', desc: 'Overtake 30 Heavy Trucks during Rain Storm', unlocked: false, reward: 'Gold Wheel Rim' }
  ];

  return (
    <div id="rank-view" className="pt-16 sm:pt-20 px-3 sm:px-6 max-w-4xl mx-auto pb-24 md:pb-16 telemetry-grid">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-3 border-b border-[#3b494b]/40 mb-4">
        <div className="flex items-center gap-3">
          <button
            id="rank-back-btn"
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
              <span>GLOBAL STANDINGS</span>
              <span>•</span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-black italic tracking-wide text-[#e1e2ea] uppercase">
              APEX LEADERBOARD
            </h1>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-[#191c21] p-1 rounded-lg border border-[#3b494b]/60 font-mono text-xs">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('leaderboard');
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-[#00f0ff] text-[#002022] font-bold'
                : 'text-[#849495] hover:text-[#e1e2ea]'
            }`}
          >
            LEADERBOARD
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('trophies');
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'trophies'
                ? 'bg-[#00f0ff] text-[#002022] font-bold'
                : 'text-[#849495] hover:text-[#e1e2ea]'
            }`}
          >
            TROPHIES (24/40)
          </button>
        </div>
      </div>

      {activeTab === 'leaderboard' ? (
        <div className="space-y-6">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 2nd Place */}
            <div className="bg-[#191c21] border border-[#3b494b]/60 rounded-xl p-4 flex flex-col justify-between text-center relative overflow-hidden order-2 sm:order-1">
              <div className="absolute top-2 left-2 text-2xl font-bold text-[#b9cacb]">🥈</div>
              <div className="mt-4">
                <div className="w-14 h-14 rounded-full bg-[#1d2025] border-2 border-[#b9cacb] mx-auto flex items-center justify-center font-heading text-xl font-bold text-[#e1e2ea] mb-2 shadow-md">
                  #2
                </div>
                <div className="font-heading text-lg font-bold text-[#e1e2ea]">ViperX</div>
                <div className="font-mono text-xs text-[#849495]">Thunder X 750</div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#3b494b]/30 font-mono">
                <div className="font-heading text-xl font-black text-[#00f0ff]">38.54 KM</div>
                <div className="text-[10px] text-[#ffd700]">412,400 PTS</div>
              </div>
            </div>

            {/* 1st Place (Champion) */}
            <div className="bg-[#191c21] border-2 border-[#ffd700] rounded-xl p-5 flex flex-col justify-between text-center relative overflow-hidden shadow-[0_0_24px_rgba(255,215,0,0.25)] order-1 sm:order-2">
              <div className="absolute top-2 left-2 text-2xl font-bold text-[#ffd700]">👑</div>
              <span className="px-2 py-0.5 bg-[#ffd700] text-[#002022] text-[9px] font-mono font-bold rounded uppercase self-center">
                CHAMPION
              </span>
              <div className="mt-2">
                <div className="w-16 h-16 rounded-full bg-[#1d2025] border-2 border-[#ffd700] mx-auto flex items-center justify-center font-heading text-2xl font-black text-[#ffd700] mb-2 shadow-lg">
                  #1
                </div>
                <div className="font-heading text-xl font-extrabold text-[#ffffff]">GhostRider_99</div>
                <div className="font-mono text-xs text-[#00f0ff]">Valkyrie V4-RR</div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#ffd700]/30 font-mono">
                <div className="font-heading text-2xl font-black text-[#ffd700]">42.10 KM</div>
                <div className="text-xs text-[#ffd700] font-bold">482,900 PTS</div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-[#191c21] border border-[#3b494b]/60 rounded-xl p-4 flex flex-col justify-between text-center relative overflow-hidden order-3">
              <div className="absolute top-2 left-2 text-2xl font-bold text-[#ffb778]">🥉</div>
              <div className="mt-4">
                <div className="w-14 h-14 rounded-full bg-[#1d2025] border-2 border-[#ffb778] mx-auto flex items-center justify-center font-heading text-xl font-bold text-[#ffdad5] mb-2 shadow-md">
                  #3
                </div>
                <div className="font-heading text-lg font-bold text-[#e1e2ea]">NeonVolt</div>
                <div className="font-mono text-xs text-[#849495]">Phantom 1000 RR</div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#3b494b]/30 font-mono">
                <div className="font-heading text-xl font-black text-[#00f0ff]">35.20 KM</div>
                <div className="text-[10px] text-[#ffd700]">388,150 PTS</div>
              </div>
            </div>
          </div>

          {/* Sticky Player Rank Card */}
          <div className="bg-[#1d2025] border-2 border-[#00f0ff] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(0,240,255,0.25)] font-mono">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-lg bg-[#00f0ff] text-[#002022] font-heading font-black text-sm flex items-center justify-center shadow-md">
                #2,412
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-base font-bold text-[#ffffff] uppercase truncate max-w-[160px] sm:max-w-[220px]">
                    {playerName} (You)
                  </span>
                  {onOpenEditName && (
                    <button
                      id="rank-edit-name-btn"
                      onClick={() => {
                        sounds.playClick();
                        onOpenEditName();
                      }}
                      title="Edit Racer Name"
                      className="p-1 text-[#849495] hover:text-[#00f0ff] rounded bg-[#111319] hover:bg-[#1d2025] transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className="px-1.5 py-0.2 bg-[#272a30] text-[#00f0ff] text-[9px] font-bold rounded">
                    TOP 3%
                  </span>
                </div>
                <div className="text-xs text-[#849495]">Valkyrie V4-RR • Personal Best: 18.42 KM</div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <div className="text-[9px] text-[#849495] uppercase">NEXT TIER: DIAMOND</div>
                <div className="text-xs text-[#00f0ff] font-bold">1.58 KM TO GO</div>
              </div>
              <button
                id="rank-break-pb-btn"
                onClick={() => {
                  sounds.playClick();
                  onLaunchRace();
                }}
                className="px-4 py-2 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002022] font-heading text-xs font-black italic rounded uppercase cursor-pointer"
              >
                BEAT PB
              </button>
            </div>
          </div>

          {/* Full Standings List */}
          <div className="bg-[#191c21] border border-[#3b494b]/60 rounded-xl overflow-hidden">
            <div className="p-3 bg-[#0b0e13] border-b border-[#3b494b]/40 flex justify-between items-center font-mono text-xs text-[#849495]">
              <span>RIDER</span>
              <span>DISTANCE / SCORE</span>
            </div>

            <div className="divide-y divide-[#3b494b]/30 font-mono text-xs">
              {leaderboard.map((row) => (
                <div
                  key={row.rank}
                  className="p-3.5 flex items-center justify-between hover:bg-[#1d2025] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 font-bold text-[#849495] text-center">{row.rank}</span>
                    <div>
                      <div className="text-[#e1e2ea] font-bold flex items-center gap-1.5">
                        <span>{row.name}</span>
                        {row.badge && <span>{row.badge}</span>}
                      </div>
                      <div className="text-[10px] text-[#849495]">{row.bike}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[#00f0ff] font-bold">{row.distance}</div>
                    <div className="text-[10px] text-[#ffd700]">{row.score} PTS</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Trophies & Achievements Tab */
        <div className="space-y-3 font-mono">
          {trophies.map((trophy, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                trophy.unlocked
                  ? 'bg-[#191c21] border-[#00f0ff]/50 shadow-sm'
                  : 'bg-[#0b0e13]/60 border-[#3b494b]/40 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    trophy.unlocked
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]'
                      : 'bg-[#1d2025] text-[#849495] border border-[#3b494b]'
                  }`}
                >
                  {trophy.unlocked ? <Trophy className="w-5 h-5" /> : <Medal className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-[#e1e2ea] uppercase">
                      {trophy.title}
                    </h3>
                    {trophy.unlocked && (
                      <span className="px-1.5 py-0.2 bg-[#00f0ff] text-[#002022] text-[9px] font-bold rounded">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#849495]">{trophy.desc}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-[#849495] uppercase">REWARD</div>
                <div className="text-xs text-[#ffd700] font-bold">{trophy.reward}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
