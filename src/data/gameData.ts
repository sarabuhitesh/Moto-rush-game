import { Bike, TuningStation, GameMode, TrackBiome, DailyMission, LeaderboardEntry } from '../types';

export const INITIAL_BIKES: Bike[] = [
  {
    id: 'thunder_x',
    name: 'Thunder X',
    subName: '750',
    className: 'CLASS A',
    tierLabel: 'TIER 3 SUPERBIKE',
    cc: 749,
    hp: 750,
    torque: 820,
    rpmCap: 16800,
    topSpeed: 88,
    acceleration: 90,
    handling: 72,
    braking: 78,
    nitroBoost: 85,
    status: 'in_use',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByOjldD7hhG-3_Cvgj7c2kqN9f_uwvsHupn6hUEm1mQHPq6aZuuPj0yDAv8TCrYAG_p4N9UkLpMYiduuFoDWTUUxK4orhXTNCPOxqdo2qsNXd9g4r3IYLMwdJEJR_v5us4kletfobizJC0jJ_qKg6Ss4TmK91MGvIHx9AcqIi0k0yxvAD3Nl6Msa6D4Q0pxQ1-99ZJgmPOGIph4Auq-uQvBj6cnFwatM7SkuWmkjVZlygfiA1LVa7Z',
    colorway: 'Neon Cyan',
    tunerVerdict: 'Thunder X 750 exhibits dominant straight-line torque. Upgrading Handling or Braking next will reduce corner drift-loss on technical circuits.'
  },
  {
    id: 'street_racer',
    name: 'Street Racer',
    subName: '600 R',
    className: 'CLASS C',
    tierLabel: 'LEVEL 5 STREET RACER',
    cc: 599,
    hp: 450,
    torque: 520,
    rpmCap: 14500,
    topSpeed: 74,
    acceleration: 78,
    handling: 86,
    braking: 80,
    nitroBoost: 70,
    status: 'owned',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw2wmiDhO8graw1xUou1k_hi_kujaQAb52ZHa8fDJRVIuhI7QqXwV-kPcRL8OrvS9czNoMnK4hgrY88al-NlMGT1f8J-F0AiB6ce5LFoPqfgPDK0b5H1iSmU58Ujq2943bryCmqtE69R_hiRvGp5OshFqu2_5n1wgYYz4z5FrCe16pDVrIY4QwfTDp4uRKP-WtZ6rGYFcfb00fPhELCC2pbWTLD0OfVOYvLCoHJ7Km3TVZ08MPKv4a',
    colorway: 'Acid Gold',
    tunerVerdict: 'Agile chassis with lightweight swingarm. Exceptional cornering apex recovery, though outmatched in top-end terminal velocity.'
  },
  {
    id: 'valkyrie_v4',
    name: 'Valkyrie V4-RR',
    subName: 'Apex Edition',
    className: 'APEX PROTOTYPE',
    tierLabel: 'SEASON 04 HYPER DRIVE',
    cc: 1198,
    hp: 980,
    torque: 1120,
    rpmCap: 18500,
    topSpeed: 94,
    acceleration: 96,
    handling: 88,
    braking: 89,
    nitroBoost: 92,
    status: 'owned',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByOjldD7hhG-3_Cvgj7c2kqN9f_uwvsHupn6hUEm1mQHPq6aZuuPj0yDAv8TCrYAG_p4N9UkLpMYiduuFoDWTUUxK4orhXTNCPOxqdo2qsNXd9g4r3IYLMwdJEJR_v5us4kletfobizJC0jJ_qKg6Ss4TmK91MGvIHx9AcqIi0k0yxvAD3Nl6Msa6D4Q0pxQ1-99ZJgmPOGIph4Auq-uQvBj6cnFwatM7SkuWmkjVZlygfiA1LVa7Z',
    colorway: 'Hyper Blue',
    tunerVerdict: 'Apex hyper-prototype with wind-tunnel validated aerodynamic winglets. Extreme stability in wet weather with unmatched boost acceleration.'
  },
  {
    id: 'phantom_1000',
    name: 'Phantom 1000 RR',
    subName: 'Prototype Beast',
    className: 'CLASS S',
    tierLabel: 'PROTOTYPE BEAST',
    cc: 999,
    hp: 1050,
    torque: 1200,
    rpmCap: 19000,
    topSpeed: 98,
    acceleration: 97,
    handling: 84,
    braking: 92,
    nitroBoost: 96,
    status: 'locked',
    priceCoins: 5000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw2wmiDhO8graw1xUou1k_hi_kujaQAb52ZHa8fDJRVIuhI7QqXwV-kPcRL8OrvS9czNoMnK4hgrY88al-NlMGT1f8J-F0AiB6ce5LFoPqfgPDK0b5H1iSmU58Ujq2943bryCmqtE69R_hiRvGp5OshFqu2_5n1wgYYz4z5FrCe16pDVrIY4QwfTDp4uRKP-WtZ6rGYFcfb00fPhELCC2pbWTLD0OfVOYvLCoHJ7Km3TVZ08MPKv4a',
    colorway: 'Stealth Carbon',
    tunerVerdict: 'Illegal underground superbike with titanium-matrix combustion chamber. Top speed exceeds 330 km/h under sustained nitrous pressure.'
  }
];

export const INITIAL_TUNING: TuningStation = {
  speedTurbine: { tier: 4, maxTier: 5, costCoins: 800, statBonus: 4 },
  driveGearbox: { tier: 3, maxTier: 5, costCoins: 650, statBonus: 3 },
  raceSuspension: { tier: 2, maxTier: 5, costCoins: 500, statBonus: 3 },
  nosInjector: { tier: 4, maxTier: 5, costGems: 12, statBonus: 5 }
};

export const INITIAL_GAME_MODES: GameMode[] = [
  {
    id: 'endless',
    name: 'ENDLESS RIDE',
    tag: 'FREEWAY CRUISE',
    multiplier: '1.0x MULT',
    description: 'Infinite dense highway. Weave past oncoming heavy trailers without crashing to rack up multiplier points.',
    reward: 'XP & COINS',
    status: 'ready',
    bestRun: '18.42 KM',
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByOjldD7hhG-3_Cvgj7c2kqN9f_uwvsHupn6hUEm1mQHPq6aZuuPj0yDAv8TCrYAG_p4N9UkLpMYiduuFoDWTUUxK4orhXTNCPOxqdo2qsNXd9g4r3IYLMwdJEJR_v5us4kletfobizJC0jJ_qKg6Ss4TmK91MGvIHx9AcqIi0k0yxvAD3Nl6Msa6D4Q0pxQ1-99ZJgmPOGIph4Auq-uQvBj6cnFwatM7SkuWmkjVZlygfiA1LVa7Z'
  },
  {
    id: 'traffic',
    name: 'TRAFFIC RUSH',
    tag: 'RUSH HOUR',
    multiplier: '3.0x COINS',
    description: 'Hyper-speed lane filtering through peak gridlock. Close near-misses grant immediate full Nitro refills.',
    reward: 'NITRO GEMS',
    status: 'unlocked',
    unlockLevel: 15,
    unlockCoins: 3000
  },
  {
    id: 'time',
    name: 'TIME CHALLENGE',
    tag: 'CHRONO ATTACK',
    multiplier: '+2S NEAR-MISS',
    description: 'Reach checkpoints before the 60s timer hits zero. Every near-miss adds +2 seconds.',
    reward: 'BRONZE TROPHY',
    status: 'unlocked',
    target: '12 Checkpoints',
    trophy: 'Bronze Trophy',
    unlockLevel: 18
  }
];

export const TRACK_BIOMES: TrackBiome[] = [
  {
    id: 'neon_midnight',
    name: 'Neon Midnight Highway',
    weather: 'Clear Night',
    perk: '+15% Grip',
    status: 'equipped',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByOjldD7hhG-3_Cvgj7c2kqN9f_uwvsHupn6hUEm1mQHPq6aZuuPj0yDAv8TCrYAG_p4N9UkLpMYiduuFoDWTUUxK4orhXTNCPOxqdo2qsNXd9g4r3IYLMwdJEJR_v5us4kletfobizJC0jJ_qKg6Ss4TmK91MGvIHx9AcqIi0k0yxvAD3Nl6Msa6D4Q0pxQ1-99ZJgmPOGIph4Auq-uQvBj6cnFwatM7SkuWmkjVZlygfiA1LVa7Z'
  },
  {
    id: 'sunset_bay',
    name: 'Sunset Coastal Bay',
    weather: 'Golden Dusk',
    perk: 'High Visibility',
    status: 'unlocked',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw2wmiDhO8graw1xUou1k_hi_kujaQAb52ZHa8fDJRVIuhI7QqXwV-kPcRL8OrvS9czNoMnK4hgrY88al-NlMGT1f8J-F0AiB6ce5LFoPqfgPDK0b5H1iSmU58Ujq2943bryCmqtE69R_hiRvGp5OshFqu2_5n1wgYYz4z5FrCe16pDVrIY4QwfTDp4uRKP-WtZ6rGYFcfb00fPhELCC2pbWTLD0OfVOYvLCoHJ7Km3TVZ08MPKv4a'
  },
  {
    id: 'cyber_tunnel',
    name: 'Cyber Rain Tunnel',
    weather: 'Wet Asphalt',
    perk: 'Low Traction (High Nitro Refill)',
    status: 'locked',
    unlockCoins: 5000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByOjldD7hhG-3_Cvgj7c2kqN9f_uwvsHupn6hUEm1mQHPq6aZuuPj0yDAv8TCrYAG_p4N9UkLpMYiduuFoDWTUUxK4orhXTNCPOxqdo2qsNXd9g4r3IYLMwdJEJR_v5us4kletfobizJC0jJ_qKg6Ss4TmK91MGvIHx9AcqIi0k0yxvAD3Nl6Msa6D4Q0pxQ1-99ZJgmPOGIph4Auq-uQvBj6cnFwatM7SkuWmkjVZlygfiA1LVa7Z'
  }
];

export const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: 'm1',
    title: 'Near-miss 25 trucks in Endless',
    progress: 25,
    goal: 25,
    unit: 'Near-Misses',
    rewardCoins: 500,
    isCompleted: true,
    isClaimed: false
  },
  {
    id: 'm2',
    title: 'Reach 280 km/h in Rain Storm',
    progress: 264,
    goal: 280,
    unit: 'KM/H',
    rewardCoins: 350,
    isCompleted: false,
    isClaimed: false
  },
  {
    id: 'm3',
    title: 'Complete 3 Lane-Filtering Combos',
    progress: 1,
    goal: 3,
    unit: 'Combos',
    rewardCoins: 400,
    rewardGems: 10,
    isCompleted: false,
    isClaimed: false
  },
  {
    id: 'm4',
    title: 'Survive 5,000 meters in Traffic Rush',
    progress: 3200,
    goal: 5000,
    unit: 'Meters',
    rewardCoins: 600,
    rewardGems: 15,
    isCompleted: false,
    isClaimed: false
  },
  {
    id: 'm5',
    title: 'Activate Nitro Boost 10 Times',
    progress: 8,
    goal: 10,
    unit: 'Boosts',
    rewardCoins: 300,
    isCompleted: false,
    isClaimed: false
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, handle: '@GhostRider_99', distanceKm: 42.1, bike: 'Valkyrie V4-RR' },
  { rank: 2, handle: '@ViperX', distanceKm: 38.5, bike: 'Phantom 1000 RR' },
  { rank: 3, handle: '@NeonVolt', distanceKm: 35.2, bike: 'Thunder X 750' },
  { rank: 4, handle: '@KawaDrift', distanceKm: 31.8, bike: 'Street Racer' },
  { rank: 5, handle: '@ShadowPulse', distanceKm: 29.4, bike: 'Valkyrie V4-RR' },
  { rank: 6, handle: '@CyberHawk', distanceKm: 26.0, bike: 'Thunder X 750' },
  { rank: 2412, handle: 'ApexRider (You)', distanceKm: 18.42, bike: 'Thunder X 750', isUser: true }
];
