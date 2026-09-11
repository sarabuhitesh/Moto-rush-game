export type ScreenType = 'lobby' | 'race' | 'modes' | 'garage' | 'rank';

export interface Bike {
  id: string;
  name: string;
  subName: string;
  className: 'CLASS C' | 'CLASS A' | 'CLASS S' | 'APEX PROTOTYPE';
  tierLabel: string;
  cc: number;
  hp: number;
  torque: number;
  rpmCap: number;
  topSpeed: number; // 0-100
  acceleration: number;
  handling: number;
  braking: number;
  nitroBoost: number;
  status: 'owned' | 'in_use' | 'locked';
  priceCoins?: number;
  image: string;
  colorway: string;
  tunerVerdict: string;
}

export interface TuningStation {
  speedTurbine: { tier: number; maxTier: number; costCoins: number; statBonus: number };
  driveGearbox: { tier: number; maxTier: number; costCoins: number; statBonus: number };
  raceSuspension: { tier: number; maxTier: number; costCoins: number; statBonus: number };
  nosInjector: { tier: number; maxTier: number; costGems: number; statBonus: number };
}

export interface GameMode {
  id: 'endless' | 'traffic' | 'time';
  name: string;
  tag: string;
  multiplier: string;
  description: string;
  reward: string;
  status: 'ready' | 'unlocked' | 'locked';
  bestRun?: string;
  target?: string;
  trophy?: string;
  unlockLevel?: number;
  unlockCoins?: number;
  bgImage?: string;
}

export interface TrackBiome {
  id: 'neon_midnight' | 'sunset_bay' | 'cyber_tunnel';
  name: string;
  weather: string;
  perk: string;
  status: 'equipped' | 'unlocked' | 'locked';
  unlockCoins?: number;
  image: string;
}

export interface DailyMission {
  id: string;
  title: string;
  progress: number;
  goal: number;
  unit: string;
  rewardCoins: number;
  rewardGems?: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  handle: string;
  distanceKm: number;
  isUser?: boolean;
  bike: string;
}
