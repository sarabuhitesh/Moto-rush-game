import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Bike, GameMode } from '../types';
import { sounds } from '../utils/audio';
import { Pause, Play, RotateCcw, Home, Flame, ArrowLeft, ArrowRight, Video } from 'lucide-react';

interface RaceScreenProps {
  activeBike: Bike;
  selectedMode: GameMode;
  onExitRace: (earnedCoins: number, distanceMeters: number) => void;
  playerName?: string;
}

interface TrafficCar {
  id: number;
  x: number; // -1.2 to 1.2 normalized lane position
  z: number; // distance ahead: 50 to 900
  speed: number;
  type: 'truck' | 'bus' | 'car';
  name: string;
  width: number;
  color: string;
  nearMissAwarded?: boolean;
}

interface Collectible {
  id: number;
  x: number;
  z: number;
  type: 'coin' | 'nitro';
  collected?: boolean;
}

export const RaceScreen: React.FC<RaceScreenProps> = ({
  activeBike,
  selectedMode,
  onExitRace,
  playerName = 'ApexRider'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game state
  const [distance, setDistance] = useState(4820);
  const [speed, setSpeed] = useState(238);
  const [score, setScore] = useState(48250);
  const [coinsEarned, setCoinsEarned] = useState(184);
  const [multiplier, setMultiplier] = useState(3.2);
  const [nitro, setNitro] = useState(85);
  const [isBoosting, setIsBoosting] = useState(false);
  const [isBraking, setIsBraking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [nearMissBanner, setNearMissBanner] = useState<{
    show: boolean;
    mult: number;
    pts: number;
  }>({ show: true, mult: 3.2, pts: 500 });
  const [nearMissCount, setNearMissCount] = useState(14);

  // Input states
  const steeringRef = useRef<'left' | 'right' | null>(null);
  const playerXRef = useRef<number>(0); // -1 (left shoulder) to +1 (right shoulder)
  const playerLeanRef = useRef<number>(0); // tilt angle for bike body

  // Internal mutable simulation values
  const stateRef = useRef({
    distance: 4820,
    speed: 238,
    targetSpeed: 238,
    score: 48250,
    coins: 184,
    multiplier: 3.2,
    nitro: 85,
    isBoosting: false,
    isBraking: false,
    isPaused: false,
    isGameOver: false,
    roadOffset: 0,
    traffic: [] as TrafficCar[],
    collectibles: [] as Collectible[],
    shake: 0,
    nextSpawnZ: 400
  });

  // Spawn initial traffic ahead
  useEffect(() => {
    const initialTraffic: TrafficCar[] = [
      {
        id: 1,
        x: -0.55,
        z: 320,
        speed: 120,
        type: 'bus',
        name: 'METRO BUS',
        width: 1.0,
        color: '#2a313d'
      },
      {
        id: 2,
        x: -0.15,
        z: 220,
        speed: 80,
        type: 'truck',
        name: 'OVERSIZE 80 KM/H',
        width: 1.25,
        color: '#1f242d'
      },
      {
        id: 3,
        x: 0.6,
        z: 270,
        speed: 140,
        type: 'car',
        name: 'RUSH 99',
        width: 0.85,
        color: '#2d3748'
      },
      {
        id: 4,
        x: 0.25,
        z: 460,
        speed: 95,
        type: 'truck',
        name: 'HEAVY HAULER',
        width: 1.2,
        color: '#1a202c'
      }
    ];

    const initialCollectibles: Collectible[] = [
      { id: 101, x: 0.28, z: 230, type: 'nitro' },
      { id: 102, x: 0.28, z: 290, type: 'coin' },
      { id: 103, x: -0.3, z: 420, type: 'coin' }
    ];

    stateRef.current.traffic = initialTraffic;
    stateRef.current.collectibles = initialCollectibles;

    sounds.startEngine();

    return () => {
      sounds.stopEngine();
    };
  }, []);

  // Near-miss trigger helper
  const triggerNearMiss = useCallback((mult: number, pts: number) => {
    sounds.playNearMiss();
    setNearMissCount((prev) => prev + 1);
    setNearMissBanner({ show: true, mult, pts });
    stateRef.current.score += pts;
    stateRef.current.multiplier = Math.min(8.0, +(stateRef.current.multiplier + 0.2).toFixed(1));
    setMultiplier(stateRef.current.multiplier);

    // Auto refill 15% nitro on near miss
    stateRef.current.nitro = Math.min(100, stateRef.current.nitro + 15);
    setNitro(stateRef.current.nitro);

    setTimeout(() => {
      setNearMissBanner((prev) => ({ ...prev, show: false }));
    }, 1800);
  }, []);

  // Collision game over trigger
  const handleCollision = useCallback(() => {
    if (stateRef.current.isGameOver) return;
    sounds.playCrash();
    sounds.stopEngine();
    stateRef.current.isGameOver = true;
    stateRef.current.speed = 0;
    setIsGameOver(true);
  }, []);

  // Main Canvas Animation Loop (60 FPS)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const s = stateRef.current;

      // Handle pause or game over
      if (s.isPaused || s.isGameOver) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // 1. Steering & bike lean physics
      const steerSpeed = (activeBike.handling / 100) * 1.8;
      if (steeringRef.current === 'left') {
        playerXRef.current = Math.max(-0.88, playerXRef.current - steerSpeed * dt);
        playerLeanRef.current = Math.max(-0.25, playerLeanRef.current - 1.2 * dt);
      } else if (steeringRef.current === 'right') {
        playerXRef.current = Math.min(0.88, playerXRef.current + steerSpeed * dt);
        playerLeanRef.current = Math.min(0.25, playerLeanRef.current + 1.2 * dt);
      } else {
        // Return lean to center
        playerLeanRef.current *= Math.pow(0.05, dt);
      }

      // 2. Throttle / Speed & Nitro physics
      const baseTopSpeed = 190 + (activeBike.topSpeed / 100) * 90;
      const boostSpeed = baseTopSpeed * 1.45;

      if (s.isBoosting && s.nitro > 0) {
        s.nitro = Math.max(0, s.nitro - 25 * dt);
        s.targetSpeed = boostSpeed;
        s.shake = 3.5;
        if (s.nitro <= 0) {
          s.isBoosting = false;
          setIsBoosting(false);
        }
      } else if (s.isBraking) {
        s.targetSpeed = 90;
        s.shake = 0.5;
      } else {
        s.targetSpeed = baseTopSpeed;
        s.shake = 0.8;
      }

      // Smooth acceleration toward target speed
      const accelRate = s.isBoosting ? 180 : 70;
      if (s.speed < s.targetSpeed) {
        s.speed = Math.min(s.targetSpeed, s.speed + accelRate * dt);
      } else if (s.speed > s.targetSpeed) {
        s.speed = Math.max(s.targetSpeed, s.speed - 120 * dt);
      }

      // Update sound pitch
      sounds.updateEnginePitch(s.speed / 340, s.isBoosting);

      // Distance & score accumulator
      const distDelta = (s.speed / 3.6) * dt;
      s.distance += distDelta;
      s.score += Math.round(distDelta * s.multiplier * 3.5);
      s.roadOffset = (s.roadOffset + s.speed * dt * 8) % 200;

      // Slowly regenerate nitro when cruising
      if (!s.isBoosting && s.nitro < 100) {
        s.nitro = Math.min(100, s.nitro + 2.5 * dt);
      }

      // 3. Traffic Vehicle & Collectibles advancement
      const playerSpeedMps = s.speed / 3.6;

      s.traffic.forEach((car) => {
        const carSpeedMps = car.speed / 3.6;
        const relativeSpeed = playerSpeedMps - carSpeedMps;
        car.z -= relativeSpeed * dt * 4;

        // Near-miss check: Car passes close alongside player
        const playerZ = 45;
        const distZ = Math.abs(car.z - playerZ);
        const distX = Math.abs(car.x - playerXRef.current);

        if (distZ < 25 && distX < 0.38) {
          // Crash collision!
          handleCollision();
        } else if (distZ < 30 && distX < 0.65 && !car.nearMissAwarded) {
          // Near-miss awarded!
          car.nearMissAwarded = true;
          triggerNearMiss(s.multiplier, 500);
        }
      });

      // Collectibles movement & pickup
      s.collectibles.forEach((item) => {
        item.z -= playerSpeedMps * dt * 4;
        const distZ = Math.abs(item.z - 45);
        const distX = Math.abs(item.x - playerXRef.current);
        if (!item.collected && distZ < 15 && distX < 0.35) {
          item.collected = true;
          if (item.type === 'coin') {
            sounds.playCoin();
            s.coins += 10;
            s.score += 200;
          } else if (item.type === 'nitro') {
            sounds.playNitro();
            s.nitro = Math.min(100, s.nitro + 40);
            s.score += 500;
          }
        }
      });

      // Filter out past traffic & respawn ahead
      s.traffic = s.traffic.filter((car) => car.z > -40);
      while (s.traffic.length < 4) {
        const lanes = [-0.6, -0.2, 0.2, 0.6];
        const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
        const types: ('truck' | 'bus' | 'car')[] = ['truck', 'bus', 'car'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        const names = chosenType === 'truck' ? ['OVERSIZE 80 KM/H', 'HEAVY HAULER'] : chosenType === 'bus' ? ['METRO BUS'] : ['RUSH 99', 'CYBER GT', 'NEO SPEED'];
        const chosenName = names[Math.floor(Math.random() * names.length)];
        const maxZ = s.traffic.reduce((max, c) => Math.max(max, c.z), 350);

        s.traffic.push({
          id: Date.now() + Math.random(),
          x: randomLane,
          z: maxZ + 160 + Math.random() * 120,
          speed: chosenType === 'truck' ? 75 + Math.random() * 20 : chosenType === 'bus' ? 100 + Math.random() * 25 : 130 + Math.random() * 40,
          type: chosenType,
          name: chosenName,
          width: chosenType === 'truck' ? 1.25 : chosenType === 'bus' ? 1.05 : 0.85,
          color: chosenType === 'truck' ? '#1f242d' : chosenType === 'bus' ? '#272d38' : '#2d3748'
        });
      }

      // Collectibles respawn
      s.collectibles = s.collectibles.filter((item) => item.z > -40);
      if (s.collectibles.length < 3) {
        s.collectibles.push({
          id: Date.now() + Math.random(),
          x: (Math.random() - 0.5) * 1.2,
          z: 380 + Math.random() * 250,
          type: Math.random() > 0.4 ? 'coin' : 'nitro',
          collected: false
        });
      }

      // Sync React HUD state periodically
      setDistance(Math.round(s.distance));
      setSpeed(Math.round(s.speed));
      setScore(Math.round(s.score));
      setCoinsEarned(s.coins);
      setNitro(Math.round(s.nitro));

      // 4. DRAWING CANVAS HIGHWAY PERSPECTIVE
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Camera Shake
      const shakeX = (Math.random() - 0.5) * s.shake;
      const shakeY = (Math.random() - 0.5) * s.shake;
      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Night Sky & Cyber City Backdrop
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.55);
      skyGrad.addColorStop(0, '#05070a');
      skyGrad.addColorStop(0.7, '#0b1017');
      skyGrad.addColorStop(1, '#0e1823');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.55);

      // Horizon line
      const horizonY = h * 0.52;

      // Distant Cyber Skyline silhouettes
      ctx.fillStyle = '#060a10';
      const buildingWidths = [30, 45, 60, 40, 80, 50, 65, 45, 70, 55, 35, 60];
      let bX = 0;
      buildingWidths.forEach((bw, i) => {
        const bH = 40 + ((i * 37) % 90);
        ctx.fillRect(bX, horizonY - bH, bw, bH);
        // Cyber window dots
        if (i % 2 === 0) {
          ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
          ctx.fillRect(bX + 8, horizonY - bH + 15, 3, 3);
          ctx.fillRect(bX + 16, horizonY - bH + 30, 3, 3);
          ctx.fillStyle = '#060a10';
        }
        bX += bw + 8;
      });

      // Distant neon horizon glow line
      const glowGrad = ctx.createLinearGradient(0, horizonY - 4, 0, horizonY + 4);
      glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      glowGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.5)');
      glowGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, horizonY - 6, w, 12);

      // 5. 3D Perspective Road Projection
      // Perspective projection mapping:
      // screenY from horizonY to h
      // roadWidth at horizon: ~60px, at bottom: w * 0.95
      const roadBottomW = w * 0.94;
      const roadTopW = 70;
      const roadLeftBottom = (w - roadBottomW) / 2;
      const roadRightBottom = roadLeftBottom + roadBottomW;
      const roadLeftTop = (w - roadTopW) / 2;
      const roadRightTop = roadLeftTop + roadTopW;

      // Road Surface
      ctx.beginPath();
      ctx.moveTo(roadLeftTop, horizonY);
      ctx.lineTo(roadRightTop, horizonY);
      ctx.lineTo(roadRightBottom, h);
      ctx.lineTo(roadLeftBottom, h);
      ctx.closePath();

      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      roadGrad.addColorStop(0, '#10151c');
      roadGrad.addColorStop(0.6, '#0d1218');
      roadGrad.addColorStop(1, '#080a0e');
      ctx.fillStyle = roadGrad;
      ctx.fill();

      // Road Borders (Glowing Cyan & Red Neon Curbs)
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(roadLeftTop, horizonY);
      ctx.lineTo(roadLeftBottom, h);
      ctx.stroke();

      ctx.strokeStyle = '#00f0ff';
      ctx.beginPath();
      ctx.moveTo(roadRightTop, horizonY);
      ctx.lineTo(roadRightBottom, h);
      ctx.stroke();

      // Outer highway barrier guardrails glow
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(roadLeftTop - 6, horizonY);
      ctx.lineTo(roadLeftBottom - 18, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(roadRightTop + 6, horizonY);
      ctx.lineTo(roadRightBottom + 18, h);
      ctx.stroke();

      // Perspective Projection Function
      const project = (laneX: number, zDistance: number) => {
        // z: 40 (near bottom) to 800 (near horizon)
        const factor = Math.max(0.001, 1 / Math.max(1, zDistance * 0.012 + 0.5));
        const currentRoadW = roadTopW + (roadBottomW - roadTopW) * factor;
        const currentCenterX = w / 2;
        const currentLeftX = currentCenterX - currentRoadW / 2;
        const currentY = horizonY + (h - horizonY) * factor;
        const screenX = currentCenterX + (laneX * currentRoadW) / 2;
        return { x: screenX, y: currentY, scale: factor, leftX: currentLeftX, roadW: currentRoadW };
      };

      // Moving Yellow Lane Divider Dashes
      const numLanes = 3; // 4 lanes total
      const laneDivs = [-0.5, 0, 0.5];

      laneDivs.forEach((laneVal) => {
        for (let segZ = 30; segZ < 700; segZ += 35) {
          const actualZ = (segZ + s.roadOffset) % 650 + 35;
          const p1 = project(laneVal, actualZ);
          const p2 = project(laneVal, actualZ + 18);

          ctx.strokeStyle = laneVal === 0 ? '#ffd700' : 'rgba(255, 215, 0, 0.65)';
          ctx.lineWidth = Math.max(1.5, 4 * p1.scale);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // 6. Draw Collectibles (Coins & Nitro)
      s.collectibles
        .filter((c) => !c.collected && c.z > 30 && c.z < 650)
        .sort((a, b) => b.z - a.z)
        .forEach((c) => {
          const p = project(c.x, c.z);
          const size = Math.max(8, 30 * p.scale);

          if (c.type === 'nitro') {
            // Glowing cyan nitro pickup box
            ctx.fillStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 15;
            ctx.fillRect(p.x - size / 2, p.y - size, size, size);
            ctx.shadowBlur = 0;
            // Lightning icon inside
            ctx.fillStyle = '#002022';
            ctx.font = `bold ${Math.round(size * 0.6)}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚡', p.x, p.y - size / 2);
          } else {
            // Gold coin
            ctx.fillStyle = '#ffd700';
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(p.x, p.y - size / 2, size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#4c2700';
            ctx.font = `bold ${Math.round(size * 0.55)}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🪙', p.x, p.y - size / 2);
          }
        });

      // 7. Draw Traffic Vehicles (Sorted from farthest to closest)
      const sortedTraffic = [...s.traffic]
        .filter((car) => car.z > 35 && car.z < 750)
        .sort((a, b) => b.z - a.z);

      sortedTraffic.forEach((car) => {
        const p = project(car.x, car.z);
        const carW = Math.max(12, 105 * car.width * p.scale);
        const carH = car.type === 'truck' ? carW * 0.95 : car.type === 'bus' ? carW * 1.1 : carW * 0.65;
        const carX = p.x - carW / 2;
        const carY = p.y - carH;

        // Vehicle Shadow on asphalt
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(carX, p.y - carH * 0.1, carW, carH * 0.25);

        // Vehicle Main Body
        ctx.fillStyle = car.color;
        ctx.strokeStyle = '#3b494b';
        ctx.lineWidth = 1;
        ctx.fillRect(carX, carY, carW, carH);
        ctx.strokeRect(carX, carY, carW, carH);

        // Vehicle Details (Red Tail Lights & License plate banner)
        const lightW = carW * 0.22;
        const lightH = carH * 0.16;

        // Glowing Brake / Tail Lights
        ctx.fillStyle = '#ff2222';
        ctx.shadowColor = '#ff3b30';
        ctx.shadowBlur = 10 * p.scale;
        // Left light
        ctx.fillRect(carX + carW * 0.08, carY + carH * 0.72, lightW, lightH);
        // Right light
        ctx.fillRect(carX + carW * 0.7, carY + carH * 0.72, lightW, lightH);
        ctx.shadowBlur = 0;

        // Rear Label / Nameplate (e.g. OVERSIZE 80 KM/H, METRO BUS)
        if (p.scale > 0.18) {
          ctx.fillStyle = '#ffd700';
          ctx.font = `bold ${Math.max(7, Math.round(9 * p.scale * 2.5))}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(car.name, p.x, carY + carH * 0.35);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(carX + carW * 0.25, carY + carH * 0.55, carW * 0.5, carH * 0.12);
        }
      });

      // 8. Draw Player Motorcycle (Hero View from Behind at bottom center)
      // Matches Image 1: aerodynamic carbon fairing, glowing cyan dashboard screen "RUSH 99",
      // dual red tail lights, wheels on asphalt, steering lean tilt!
      const playerScreenX = w / 2 + (playerXRef.current * roadBottomW) / 2;
      const playerScreenY = h - 65;
      const bikeScale = 1.1;

      ctx.save();
      ctx.translate(playerScreenX, playerScreenY);
      ctx.rotate(playerLeanRef.current);

      // Nitro exhaust flame & cyan particle trails if boosting
      if (s.isBoosting) {
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 24;
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.moveTo(-18, 50);
        ctx.lineTo(0, 110 + Math.random() * 25);
        ctx.lineTo(18, 50);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-8, 50);
        ctx.lineTo(0, 85 + Math.random() * 15);
        ctx.lineTo(8, 50);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Motorcycle Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.beginPath();
      ctx.ellipse(0, 52, 60 * bikeScale, 18 * bikeScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rear Fat Racing Tire
      ctx.fillStyle = '#0e1116';
      ctx.strokeStyle = '#1d2025';
      ctx.lineWidth = 2;
      ctx.fillRect(-22 * bikeScale, 15 * bikeScale, 44 * bikeScale, 45 * bikeScale);
      ctx.strokeRect(-22 * bikeScale, 15 * bikeScale, 44 * bikeScale, 45 * bikeScale);

      // Tire treads
      ctx.fillStyle = '#000000';
      ctx.fillRect(-18 * bikeScale, 20 * bikeScale, 36 * bikeScale, 4 * bikeScale);
      ctx.fillRect(-18 * bikeScale, 32 * bikeScale, 36 * bikeScale, 4 * bikeScale);
      ctx.fillRect(-18 * bikeScale, 44 * bikeScale, 36 * bikeScale, 4 * bikeScale);

      // Carbon Lower Frame & Dual Exhaust pipes
      ctx.fillStyle = '#1a1e26';
      ctx.fillRect(-38 * bikeScale, -15 * bikeScale, 76 * bikeScale, 35 * bikeScale);

      // Tail Lights / Brake Light Bar (Glowing Red like Image 1)
      ctx.fillStyle = s.isBraking ? '#ff0000' : '#ff2222';
      ctx.shadowColor = '#ff3b30';
      ctx.shadowBlur = s.isBraking ? 25 : 14;
      // Dual block tail lights
      ctx.fillRect(-32 * bikeScale, -8 * bikeScale, 26 * bikeScale, 16 * bikeScale);
      ctx.fillRect(6 * bikeScale, -8 * bikeScale, 26 * bikeScale, 16 * bikeScale);
      ctx.shadowBlur = 0;

      // License Plate / Rear Fender: Pilot Callsign
      ctx.fillStyle = '#0b0e13';
      ctx.fillRect(-26 * bikeScale, 8 * bikeScale, 52 * bikeScale, 14 * bikeScale);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1;
      ctx.strokeRect(-26 * bikeScale, 8 * bikeScale, 52 * bikeScale, 14 * bikeScale);
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(playerName.slice(0, 9).toUpperCase(), 0, 19 * bikeScale);

      // Rider Aerodynamic Cockpit & Glowing Cyan Digital Dashboard (Image 1)
      ctx.fillStyle = '#141922';
      ctx.beginPath();
      ctx.roundRect(-28 * bikeScale, -46 * bikeScale, 56 * bikeScale, 34 * bikeScale, [12, 12, 4, 4]);
      ctx.fill();

      // Glowing Cyan Digital Instrument HUD Screen
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(-22 * bikeScale, -42 * bikeScale, 44 * bikeScale, 18 * bikeScale, [8, 8, 4, 4]);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Rider Helmet Back
      ctx.fillStyle = '#090c10';
      ctx.beginPath();
      ctx.arc(0, -68 * bikeScale, 19 * bikeScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      ctx.restore(); // restore camera shake

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeBike, handleCollision, triggerNearMiss]);

  // Window resize handler for canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard controls listener (Arrows / WASD / Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        steeringRef.current = 'left';
      } else if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        steeringRef.current = 'right';
      } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setIsBraking(true);
        stateRef.current.isBraking = true;
      } else if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (stateRef.current.nitro > 15 && !stateRef.current.isBoosting) {
          sounds.playNitro();
          setIsBoosting(true);
          stateRef.current.isBoosting = true;
        }
      } else if (e.code === 'Escape') {
        setIsPaused((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') &&
        steeringRef.current === 'left'
      ) {
        steeringRef.current = null;
      } else if (
        (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') &&
        steeringRef.current === 'right'
      ) {
        steeringRef.current = null;
      } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setIsBraking(false);
        stateRef.current.isBraking = false;
      } else if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setIsBoosting(false);
        stateRef.current.isBoosting = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Nitro Boost Button handler
  const handleBoostClick = () => {
    if (stateRef.current.nitro > 15 && !stateRef.current.isBoosting) {
      sounds.playNitro();
      setIsBoosting(true);
      stateRef.current.isBoosting = true;
    }
  };

  return (
    <div
      id="race-screen-container"
      className="relative w-full h-[100dvh] bg-[#0b0e13] overflow-hidden select-none"
    >
      {/* 3D Canvas Viewport */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* ==================== TOP HUD OVERLAY (Matches Image 1) ==================== */}
      <div className="absolute top-0 left-0 w-full z-20 p-3 sm:p-5 flex flex-col gap-2.5">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#191c21]/90 border border-[#00f0ff]/50 flex items-center justify-center text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              <span className="font-heading font-black italic text-xs">MR</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg sm:text-xl font-extrabold italic text-[#00f0ff] tracking-wider leading-none drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
                  MOTO RUSH
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] font-mono text-[9px] font-bold uppercase rounded">
                  PILOT: {playerName}
                </span>
              </div>
              <div className="font-mono text-[10px] text-[#849495] tracking-widest uppercase">
                {selectedMode.name} • HIGHWAY RUN
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Coin Counter */}
            <div className="flex items-center gap-1.5 bg-[#191c21]/90 border border-[#ffd700]/50 px-3 py-1.5 rounded-lg font-mono text-sm font-bold text-[#ffd700] shadow-[0_0_10px_rgba(255,215,0,0.2)]">
              <span>🪙</span>
              <span className="text-[#e1e2ea] tabular-nums">{coinsEarned}</span>
            </div>

            {/* Pause Button */}
            <button
              id="pause-race-btn"
              onClick={() => {
                sounds.playClick();
                setIsPaused(true);
                stateRef.current.isPaused = true;
              }}
              className="w-9 h-9 rounded-lg bg-[#191c21]/90 border border-[#3b494b] flex items-center justify-center text-[#e1e2ea] hover:border-[#00f0ff] hover:text-[#00f0ff] transition-colors"
            >
              <Pause className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* HUD Telemetry Cards Row (Distance / Speedometer / Score) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto w-full">
          {/* Card 1: DISTANCE */}
          <div className="bg-[#191c21]/85 backdrop-blur-md border border-[#00f0ff]/40 p-2 sm:p-3 rounded-lg shadow-lg font-mono">
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-[#849495] tracking-wider uppercase mb-0.5">
              <span>⎈</span>
              <span>DISTANCE</span>
            </div>
            <div className="font-heading text-lg sm:text-2xl text-[#e1e2ea] font-extrabold tracking-tight tabular-nums">
              {(distance ?? 0).toLocaleString()}{' '}
              <span className="text-xs text-[#00f0ff] font-mono">M</span>
            </div>
          </div>

          {/* Card 2: SPEEDOMETER & RPM METER */}
          <div className="bg-[#191c21]/85 backdrop-blur-md border border-[#00f0ff]/50 p-2 sm:p-3 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.25)] text-center font-mono">
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-heading text-2xl sm:text-3xl text-[#00f0ff] font-black tracking-tight tabular-nums drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]">
                {speed}
              </span>
              <span className="text-[10px] text-[#849495] font-bold">KM/H</span>
            </div>
            {/* Segmented RPM Meter (Cyan -> Yellow -> Red) */}
            <div className="flex justify-center items-center gap-0.5 mt-1">
              {[...Array(10)].map((_, i) => {
                const isActive = (speed / 320) * 10 > i;
                const color =
                  i > 7 ? 'bg-[#ff3b30]' : i > 5 ? 'bg-[#ffd700]' : 'bg-[#00f0ff]';
                return (
                  <div
                    key={i}
                    className={`h-2 w-1.5 rounded-xs transition-colors ${
                      isActive ? color : 'bg-[#272a30]'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[8px] text-[#849495] px-1 mt-0.5">
              <span>0</span>
              <span>14K RPM</span>
            </div>
          </div>

          {/* Card 3: SCORE & MULTIPLIER */}
          <div className="bg-[#191c21]/85 backdrop-blur-md border border-[#00f0ff]/40 p-2 sm:p-3 rounded-lg shadow-lg font-mono text-right">
            <div className="flex items-center justify-end gap-1 text-[9px] sm:text-[10px] text-[#849495] tracking-wider uppercase mb-0.5">
              <span>SCORE</span>
              <span className="text-[#ffd700]">🪙</span>
            </div>
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="font-heading text-lg sm:text-2xl text-[#e1e2ea] font-extrabold tracking-tight tabular-nums">
                {(score ?? 0).toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-[#ffd700] bg-[#ffd700]/15 px-1 rounded">
                x{multiplier}
              </span>
            </div>
          </div>
        </div>

        {/* Camera perspective button on left */}
        <button
          id="camera-switch-btn"
          title="Toggle Camera View"
          onClick={() => sounds.playClick()}
          className="self-start w-8 h-8 rounded bg-[#191c21]/85 border border-[#3b494b] flex items-center justify-center text-[#849495] hover:text-[#00f0ff]"
        >
          <Video className="w-4 h-4" />
        </button>
      </div>

      {/* ==================== CENTER NEAR MISS ALERT BANNER (Matches Image 1) ==================== */}
      {nearMissBanner.show && (
        <div
          id="near-miss-banner"
          className="absolute top-[32%] sm:top-[34%] left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce"
        >
          <div className="px-6 py-2.5 bg-[#191c21]/95 border-2 border-[#ff3b30] rounded-lg clip-banner shadow-[0_0_30px_rgba(255,59,48,0.85)] flex flex-col items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="text-[#ff3b30] text-lg font-bold">⚠️</span>
              <span className="font-heading text-xl sm:text-2xl italic font-black text-[#ffffff] tracking-wider skew-cyber">
                NEAR MISS
              </span>
              <span className="px-1.5 py-0.5 bg-[#c5020b] text-[#ffd2cc] font-mono text-xs font-bold rounded">
                x{nearMissBanner.mult}
              </span>
            </div>
            <div className="font-heading text-sm font-bold text-[#00f0ff] italic tracking-wide drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
              +{nearMissBanner.pts} PTS
            </div>
          </div>
        </div>
      )}

      {/* ==================== RIGHT VERTICAL NITRO GAUGE (Matches Image 1) ==================== */}
      <div
        id="vertical-nitro-gauge"
        onClick={handleBoostClick}
        className="absolute right-3 sm:right-6 top-[38%] sm:top-[42%] -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 cursor-pointer group"
      >
        <div className="font-mono text-[9px] sm:text-[10px] text-[#00f0ff] tracking-widest font-bold uppercase -rotate-90 origin-center mb-4">
          NITRO
        </div>

        {/* Cylinder Meter Container */}
        <div className="w-6 sm:w-7 h-40 sm:h-48 bg-[#191c21]/90 border-2 border-[#00f0ff]/70 rounded-full p-0.5 flex flex-col justify-end overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:border-[#00f0ff] transition-all">
          <div
            className={`w-full rounded-full transition-all duration-150 ${
              isBoosting
                ? 'bg-gradient-to-t from-[#ff3b30] via-[#ffd700] to-[#ffffff] shadow-[0_0_20px_rgba(255,59,48,0.9)]'
                : 'bg-gradient-to-t from-[#006970] via-[#00f0ff] to-[#dbfcff] shadow-[0_0_15px_rgba(0,240,255,0.8)]'
            }`}
            style={{ height: `${nitro}%` }}
          />
        </div>

        <div className="font-mono text-[10px] text-[#e1e2ea] font-bold">{nitro}%</div>
        <div className="px-1.5 py-0.5 bg-[#00f0ff] text-[#002022] font-mono text-[8px] font-bold rounded uppercase">
          {nitro > 20 ? 'READY' : 'LOW'}
        </div>
      </div>

      {/* ==================== BOTTOM CONTROLS (Matches Image 1) ==================== */}
      <div className="absolute bottom-3 left-0 w-full z-20 px-3 sm:px-8 flex flex-col items-center gap-2 max-w-2xl mx-auto">
        {/* Swipe or Tap instruction bar */}
        <div className="w-full max-w-md py-1 px-3 bg-[#111319]/80 backdrop-blur-sm border border-[#3b494b]/50 rounded-full flex items-center justify-center gap-2 text-center text-[10px] sm:text-[11px] font-mono text-[#b9cacb]">
          <span className="text-[#00f0ff]">↺</span>
          <span>SWIPE OR TAP TO STEER & BRAKE</span>
        </div>

        {/* Control Action Buttons Row */}
        <div className="flex items-center justify-between w-full max-w-md gap-2 sm:gap-4">
          {/* Steer Left */}
          <button
            id="control-steer-left-btn"
            onPointerDown={() => {
              sounds.playClick();
              steeringRef.current = 'left';
            }}
            onPointerUp={() => (steeringRef.current = null)}
            onPointerLeave={() => (steeringRef.current = null)}
            className="flex-1 h-16 sm:h-20 bg-[#191c21]/90 hover:bg-[#1d2025] active:bg-[#00f0ff]/20 border-2 border-[#3b494b] active:border-[#00f0ff] rounded-xl flex flex-col items-center justify-center text-[#00f0ff] transition-all duration-100 cursor-pointer shadow-lg active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="font-mono text-[10px] font-bold uppercase mt-1">LEFT</span>
          </button>

          {/* Brake */}
          <button
            id="control-brake-btn"
            onPointerDown={() => {
              sounds.playClick();
              setIsBraking(true);
              stateRef.current.isBraking = true;
            }}
            onPointerUp={() => {
              setIsBraking(false);
              stateRef.current.isBraking = false;
            }}
            onPointerLeave={() => {
              setIsBraking(false);
              stateRef.current.isBraking = false;
            }}
            className={`flex-1 h-16 sm:h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-100 cursor-pointer shadow-lg active:scale-95 ${
              isBraking
                ? 'bg-[#c5020b]/60 border-[#ff3b30] text-[#ffffff] shadow-[0_0_20px_rgba(255,59,48,0.7)]'
                : 'bg-[#191c21]/90 hover:bg-[#1d2025] border-[#3b494b] text-[#ffb4aa]'
            }`}
          >
            <Flame className="w-6 h-6" />
            <span className="font-mono text-[10px] font-bold uppercase mt-1">BRAKE</span>
          </button>

          {/* Nitro Boost (Glowing flame button) */}
          <button
            id="control-nitro-btn"
            onClick={handleBoostClick}
            className="flex-1 h-16 sm:h-20 bg-[#c5020b] hover:bg-[#ff3b30] active:scale-95 border-2 border-[#ffd700] rounded-xl flex flex-col items-center justify-center text-[#ffffff] font-heading font-extrabold italic tracking-wider transition-all duration-100 cursor-pointer shadow-[0_0_24px_rgba(255,59,48,0.8)] pulse-red-glow"
          >
            <Flame className="w-7 h-7 text-[#ffd700] fill-current animate-pulse" />
            <span className="text-xs uppercase skew-cyber">NITRO BOOST</span>
          </button>

          {/* Steer Right */}
          <button
            id="control-steer-right-btn"
            onPointerDown={() => {
              sounds.playClick();
              steeringRef.current = 'right';
            }}
            onPointerUp={() => (steeringRef.current = null)}
            onPointerLeave={() => (steeringRef.current = null)}
            className="flex-1 h-16 sm:h-20 bg-[#191c21]/90 hover:bg-[#1d2025] active:bg-[#00f0ff]/20 border-2 border-[#3b494b] active:border-[#00f0ff] rounded-xl flex flex-col items-center justify-center text-[#00f0ff] transition-all duration-100 cursor-pointer shadow-lg active:scale-95"
          >
            <ArrowRight className="w-6 h-6" />
            <span className="font-mono text-[10px] font-bold uppercase mt-1">RIGHT</span>
          </button>
        </div>
      </div>

      {/* ==================== PAUSE MODAL ==================== */}
      {isPaused && (
        <div className="absolute inset-0 z-50 bg-[#0b0e13]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#191c21] border-2 border-[#00f0ff] p-6 sm:p-8 rounded-xl max-w-sm w-full text-center space-y-5 shadow-[0_0_30px_rgba(0,240,255,0.4)] clip-chamfer-panel">
            <h2 className="font-heading text-3xl font-black italic text-[#00f0ff] tracking-wider skew-cyber">
              RACE PAUSED
            </h2>
            <div className="space-y-1 font-mono text-sm text-[#849495]">
              <div className="text-[#00f0ff] font-bold">PILOT: {playerName.toUpperCase()}</div>
              <div>MODE: {selectedMode.name}</div>
              <div>DISTANCE: {(distance ?? 0).toLocaleString()} M</div>
              <div>SCORE: {(score ?? 0).toLocaleString()}</div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                id="pause-resume-btn"
                onClick={() => {
                  sounds.playClick();
                  setIsPaused(false);
                  stateRef.current.isPaused = false;
                }}
                className="w-full py-3 bg-[#00f0ff] text-[#002022] font-heading text-lg font-bold italic uppercase rounded-lg hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>RESUME RACE</span>
              </button>

              <button
                id="pause-restart-btn"
                onClick={() => {
                  sounds.playClick();
                  stateRef.current.distance = 0;
                  stateRef.current.score = 0;
                  stateRef.current.coins = 0;
                  stateRef.current.speed = 220;
                  stateRef.current.isPaused = false;
                  setIsPaused(false);
                }}
                className="w-full py-2.5 bg-[#1d2025] hover:bg-[#272a30] text-[#e1e2ea] border border-[#3b494b] font-mono text-xs font-bold uppercase rounded-lg flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RESTART</span>
              </button>

              <button
                id="pause-exit-btn"
                onClick={() => {
                  sounds.playClick();
                  onExitRace(coinsEarned, distance);
                }}
                className="w-full py-2.5 bg-[#1d2025] hover:bg-[#c5020b]/40 text-[#ffb4aa] border border-[#3b494b] font-mono text-xs font-bold uppercase rounded-lg flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>RETURN TO LOBBY</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== GAME OVER MODAL ==================== */}
      {isGameOver && (
        <div className="absolute inset-0 z-50 bg-[#0b0e13]/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#191c21] border-2 border-[#ff3b30] p-6 sm:p-8 rounded-xl max-w-md w-full text-center space-y-5 shadow-[0_0_40px_rgba(255,59,48,0.7)] clip-chamfer-panel">
            <div className="space-y-1">
              <span className="px-3 py-1 bg-[#c5020b] text-[#ffd2cc] font-mono text-xs font-bold rounded uppercase">
                HIGHWAY COLLISION
              </span>
              <h2 className="font-heading text-4xl font-black italic text-[#ffdad5] tracking-wider skew-cyber mt-2">
                RUN TERMINATED
              </h2>
            </div>

            {/* Run Stats Summary */}
            <div className="bg-[#0b0e13] border border-[#3b494b]/60 p-4 rounded-lg space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#3b494b]/30">
                <span className="text-[#849495]">RACER PILOT</span>
                <span className="font-heading text-sm font-bold text-[#00f0ff] uppercase">
                  {playerName}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#3b494b]/30">
                <span className="text-[#849495]">DISTANCE SURVIVED</span>
                <span className="font-heading text-base font-bold text-[#e1e2ea]">
                  {(distance ?? 0).toLocaleString()} M
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#3b494b]/30">
                <span className="text-[#849495]">FINAL SCORE</span>
                <span className="font-heading text-base font-bold text-[#00f0ff]">
                  {(score ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#3b494b]/30">
                <span className="text-[#849495]">NEAR MISSES</span>
                <span className="font-bold text-[#ffd700]">{nearMissCount} (x{multiplier})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#849495]">COINS COLLECTED</span>
                <span className="font-bold text-[#ffd700] text-sm">+{coinsEarned} 🪙</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="gameover-retry-btn"
                onClick={() => {
                  sounds.playClick();
                  sounds.startEngine();
                  stateRef.current.distance = 0;
                  stateRef.current.score = 0;
                  stateRef.current.speed = 220;
                  stateRef.current.nitro = 100;
                  stateRef.current.isGameOver = false;
                  setIsGameOver(false);
                }}
                className="flex-1 py-3 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002022] font-heading text-lg font-bold italic uppercase rounded-lg flex items-center justify-center gap-2 cursor-pointer pulse-glow"
              >
                <RotateCcw className="w-5 h-5" />
                <span>RACE AGAIN</span>
              </button>

              <button
                id="gameover-exit-btn"
                onClick={() => {
                  sounds.playClick();
                  onExitRace(coinsEarned, distance);
                }}
                className="flex-1 py-3 bg-[#1d2025] hover:bg-[#272a30] text-[#e1e2ea] border border-[#3b494b] font-heading text-lg font-bold italic uppercase rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-5 h-5" />
                <span>GARAGE / LOBBY</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
