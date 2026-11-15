import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { audioManager } from '@/audio/audioManager';

export type DroneFormation = 'palace' | 'elephant' | 'kannada' | 'gandaberunda' | 'chandrayaan' | 'fireworks';
export type DroneColorTheme = 'gold' | 'karnataka' | 'neon' | 'diamond';

interface DroneShowSceneProps {
  formation?: DroneFormation;
  colorTheme?: DroneColorTheme;
  playbackState?: 'playing' | 'paused';
  showLasers?: boolean;
  showFireworks?: boolean;
  showTorchbearers?: boolean;
  cameraMode?: 'grandstand' | 'sky' | 'parade' | 'cinematic';
  triggerFireworkCount?: number;
}

// ==============================================================
// 1. 1,500 SYNCHRONIZED HIGH-DENSITY LED DRONE SWARM
// ==============================================================
function SynchronizedDroneSwarm({
  formation = 'palace',
  colorTheme = 'gold',
  playbackState = 'playing',
}: {
  formation: DroneFormation;
  colorTheme: DroneColorTheme;
  playbackState: 'playing' | 'paused';
}) {
  const count = 1600;
  const pointsRef = useRef<THREE.Points>(null);

  // Pre-generate precise 3D target coordinates for each formation
  const formationTargets = useMemo(() => {
    // 1. MYSORE PALACE OUTLINE & ILLUMINATED ARCHES
    const palace = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = (Math.random() - 0.5) * 2.5;

      if (i < 300) {
        // Central Durbar Tower (Apex & Spire)
        const t = i / 300;
        if (t < 0.3) {
          // Tower body
          x = (Math.random() - 0.5) * 6;
          y = 14 + Math.random() * 8;
        } else if (t < 0.75) {
          // Central Golden Dome
          const ang = Math.random() * Math.PI;
          const r = Math.random() * 4.2;
          x = Math.cos(ang) * r;
          y = 22 + Math.sin(ang) * r * 1.3;
        } else {
          // Crown Kalasa Spire
          x = (Math.random() - 0.5) * 1.2;
          y = 27 + Math.random() * 6;
        }
      } else if (i < 650) {
        // Left & Right Domes (Corner Pavilions)
        const isLeft = i % 2 === 0;
        const cx = isLeft ? -19.5 : 19.5;
        const ang = Math.random() * Math.PI;
        const r = Math.random() * 3.4;
        x = cx + Math.cos(ang) * r;
        y = 16 + Math.sin(ang) * r * 1.2;
      } else if (i < 1200) {
        // Grand 7-Arch Colonnade & Illuminated Roofline
        const seg = Math.floor((i - 650) / 78);
        const archCenter = -21 + seg * 7;
        const ang = Math.random() * Math.PI;
        if (Math.random() > 0.4) {
          // Arch curve
          x = archCenter + Math.cos(ang) * 3.0;
          y = 11 + Math.sin(ang) * 2.8;
        } else {
          // Pillars
          x = archCenter + (Math.random() > 0.5 ? -3.0 : 3.0);
          y = 5 + Math.random() * 6.5;
        }
      } else {
        // Lower Facade Base & Ground Balustrades
        x = ((i - 1200) / 400 - 0.5) * 52;
        y = 4.5 + Math.random() * 2.5;
      }

      palace[i * 3] = x;
      palace[i * 3 + 1] = y;
      palace[i * 3 + 2] = z;
    }

    // 2. GOLDEN HOWDAH & ROYAL ELEPHANT SILHOUETTE
    const elephant = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = (Math.random() - 0.5) * 2.0;

      if (i < 450) {
        // Golden Howdah (Mandapa with Devi Chamundeshwari & Canopy)
        const t = i / 450;
        if (t < 0.4) {
          // Howdah base and pillars
          x = (Math.random() - 0.5) * 7.5;
          y = 16 + Math.random() * 4.5;
        } else if (t < 0.8) {
          // Howdah tiered canopy
          const ang = Math.random() * Math.PI;
          const r = Math.random() * 4.2;
          x = Math.cos(ang) * r;
          y = 20.5 + Math.sin(ang) * 3.5;
        } else {
          // Kalasa finial
          x = (Math.random() - 0.5) * 1.5;
          y = 24 + Math.random() * 5.5;
        }
      } else if (i < 950) {
        // Massive Elephant Torso, Back & Flanks
        const u = (Math.random() - 0.5) * 2;
        const v = (Math.random() - 0.5) * 2;
        if (u * u + v * v <= 1.0) {
          x = u * 9.5;
          y = 11 + v * 5.5;
        } else {
          x = (Math.random() - 0.5) * 16;
          y = 10 + Math.random() * 5;
        }
      } else if (i < 1250) {
        // 4 Pillar-like Columnar Legs
        const legIdx = i % 4;
        const legX = [-6.5, -2.5, 3.5, 7.5][legIdx];
        x = legX + (Math.random() - 0.5) * 1.8;
        y = 2 + Math.random() * 8;
      } else if (i < 1450) {
        // Head & Majestic Downward Curved Tusks
        const t = (i - 1250) / 200;
        if (t < 0.5) {
          // Head & Ears
          x = -10 + Math.sin(t * Math.PI * 4) * 3.5;
          y = 13 + Math.cos(t * Math.PI * 4) * 3.5;
        } else {
          // Downward curving tusk
          x = -11.5 + (t - 0.5) * 2.5;
          y = 11.5 - (t - 0.5) * 14;
        }
      } else {
        // Articulated S-curved Trunk
        const s = (i - 1450) / 150;
        x = -13 + Math.sin(s * Math.PI * 2.5) * 2.5;
        y = 12 - s * 10;
      }

      elephant[i * 3] = x;
      elephant[i * 3 + 1] = y;
      elephant[i * 3 + 2] = z;
    }

    // 3. KANNADA INSCRIPTION "ದಸರಾ" (VIVID KANNADA FONT GEOMETRY)
    const kannada = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = (Math.random() - 0.5) * 1.5;
      const charGroup = i % 3;

      if (charGroup === 0) {
        // Letter 'ದ' (Da) - centered at x = -14
        const ang = Math.random() * Math.PI * 1.7 - 0.2;
        const r = 3.6 + Math.random() * 0.8;
        x = -14 + Math.cos(ang) * r;
        y = 15 + Math.sin(ang) * (r * 1.25);
        if (Math.random() > 0.75) {
          // Tail notch of 'ದ'
          x = -14 + 3.2 + Math.random() * 2.5;
          y = 12 - Math.random() * 2;
        }
      } else if (charGroup === 1) {
        // Letter 'ಸ' (Sa) - centered at x = 0
        const ang = Math.random() * Math.PI * 1.85;
        const r = 3.8 + Math.random() * 0.8;
        x = Math.cos(ang) * r;
        y = 15 + Math.sin(ang) * (r * 1.25);
        if (Math.random() > 0.7) {
          // Horizontal loop / talekattu of 'ಸ'
          x = (Math.random() - 0.5) * 3.5;
          y = 19 + Math.random() * 1.5;
        }
      } else {
        // Letter 'ರಾ' (Raa with Deergha) - centered at x = 14
        const ang = Math.random() * Math.PI * 1.85;
        const r = 3.6 + Math.random() * 0.8;
        x = 13 + Math.cos(ang) * r;
        y = 15 + Math.sin(ang) * (r * 1.25);
        // Deergha extended arch on right
        if (Math.random() > 0.6) {
          x = 16.5 + Math.random() * 2.5;
          y = 16 + Math.random() * 4.5;
        }
      }

      kannada[i * 3] = x;
      kannada[i * 3 + 1] = y;
      kannada[i * 3 + 2] = z;
    }

    // 4. ROYAL GANDABERUNDA (DOUBLE-HEADED EAGLE EMBLEM)
    const gandaberunda = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = (Math.random() - 0.5) * 2.0;
      const t = i / count;

      if (t < 0.15) {
        // Twin Crested Heads & Royal Crown
        const isLeft = i % 2 === 0;
        x = isLeft ? -2.8 : 2.8;
        y = 21 + Math.random() * 4.5;
        if (Math.random() > 0.6) {
          // Beak
          x += isLeft ? -2.2 : 2.2;
          y -= 0.8;
        }
      } else if (t < 0.65) {
        // Majestic Widespread Eagle Wings
        const sign = i % 2 === 0 ? -1 : 1;
        const wingT = Math.random();
        const span = 4.0 + wingT * 18.0;
        x = sign * span;
        // Wing upward sweep arch
        y = 14 + Math.sin(wingT * Math.PI * 0.85) * 9.5 + (Math.random() - 0.5) * 2.2;
      } else if (t < 0.85) {
        // Central Regal Body & Heart Shield
        const u = (Math.random() - 0.5) * 5.5;
        x = u;
        y = 10 + Math.random() * 9.5;
      } else {
        // Fan Tail Feathers & Sharp Talons
        const tailSpan = (Math.random() - 0.5) * 11;
        x = tailSpan;
        y = 3 + Math.random() * 6.5;
      }

      gandaberunda[i * 3] = x;
      gandaberunda[i * 3 + 1] = y;
      gandaberunda[i * 3 + 2] = z;
    }

    // 5. CHANDRAYAAN ROCKET LAUNCH (TECH & SPACE PRIDE)
    const chandrayaan = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = (Math.random() - 0.5) * 2.0;
      const t = i / count;

      if (t < 0.45) {
        // Rocket Fuselage & Payload Fairing
        x = (Math.random() - 0.5) * 3.4;
        if (t < 0.12) {
          // Aerodynamic Nose Cone
          const coneH = Math.random() * 6;
          x = (Math.random() - 0.5) * (3.4 * (1 - coneH / 6));
          y = 28 + coneH;
        } else {
          // Cylindrical Core
          y = 13 + Math.random() * 15;
        }
      } else if (t < 0.7) {
        // Twin Solid Rocket Boosters (Strapons)
        const isLeft = i % 2 === 0;
        x = isLeft ? -3.4 : 3.4;
        x += (Math.random() - 0.5) * 1.5;
        y = 11 + Math.random() * 12;
      } else {
        // Fiery Engine Exhaust & Smoke Plume
        const exhaustT = Math.random();
        const spread = exhaustT * 8.5;
        x = (Math.random() - 0.5) * spread;
        y = 11 - exhaustT * 12;
        z += (Math.random() - 0.5) * 4;
      }

      chandrayaan[i * 3] = x;
      chandrayaan[i * 3 + 1] = y;
      chandrayaan[i * 3 + 2] = z;
    }

    // 6. GRAND FIREWORKS BURST (RADIAL EXPLODING CASCADE)
    const fireworks = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.5) * 20.0;
      fireworks[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      fireworks[i * 3 + 1] = 18 + r * Math.sin(phi) * Math.sin(theta);
      fireworks[i * 3 + 2] = r * Math.cos(phi);
    }

    return {
      palace,
      elephant,
      kannada,
      gandaberunda,
      chandrayaan,
      fireworks,
    };
  }, [count]);

  // Current position and color attributes
  const currentPos = useMemo(() => new Float32Array(formationTargets.palace), [formationTargets]);
  const colors = useMemo(() => new Float32Array(count * 3), [count]);

  // Live flight interpolation and reactive colors
  useFrame(({ clock }, delta) => {
    if (!pointsRef.current || playbackState === 'paused') return;

    const targetArr = formationTargets[formation] || formationTargets.palace;
    const posAttr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colAttr = pointsRef.current.geometry.attributes.color.array as Float32Array;
    const time = clock.getElapsedTime();

    // Responsive flight morph speed
    const lerpSpeed = Math.min(1.0, 3.8 * delta);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Morph to formation position
      posAttr[i3] += (targetArr[i3] - posAttr[i3]) * lerpSpeed;
      posAttr[i3 + 1] += (targetArr[i3 + 1] - posAttr[i3 + 1]) * lerpSpeed;
      posAttr[i3 + 2] += (targetArr[i3 + 2] - posAttr[i3 + 2]) * lerpSpeed;

      // Realistic drone flight hovering micro-jitter & LED shimmer
      const hover = Math.sin(time * 3 + i * 0.4) * 0.035;
      posAttr[i3 + 1] += hover;

      // Color computation based on Theme and Formation
      if (colorTheme === 'karnataka' || formation === 'kannada') {
        // Red and Yellow (ನಾಡಧ್ವಜ Karnataka Flag Palette)
        if (i % 2 === 0) {
          colAttr[i3] = 1.0; colAttr[i3 + 1] = 0.88; colAttr[i3 + 2] = 0.05; // Yellow
        } else {
          colAttr[i3] = 0.95; colAttr[i3 + 1] = 0.12; colAttr[i3 + 2] = 0.12; // Red
        }
      } else if (colorTheme === 'neon') {
        // Cyber Neon Palette
        const hue = (time * 0.1 + i / count) % 1;
        const color = new THREE.Color().setHSL(hue, 1.0, 0.6);
        colAttr[i3] = color.r; colAttr[i3 + 1] = color.g; colAttr[i3 + 2] = color.b;
      } else if (colorTheme === 'diamond' || formation === 'gandaberunda') {
        // Diamond Cyan & White
        colAttr[i3] = 0.2; colAttr[i3 + 1] = 0.85; colAttr[i3 + 2] = 1.0;
        if (i % 5 === 0) {
          colAttr[i3] = 1.0; colAttr[i3 + 1] = 1.0; colAttr[i3 + 2] = 1.0;
        }
      } else {
        // Royal Wadiyar Gold Palette
        colAttr[i3] = 1.0;
        colAttr[i3 + 1] = 0.82 + Math.sin(time * 4 + i) * 0.08;
        colAttr[i3 + 2] = 0.18;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[currentPos, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.72}
        vertexColors
        transparent
        opacity={0.96}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ==============================================================
// 2. BANNIMANTAP PARADE GROUNDS & STADIUM WITH FLOODLIGHTS
// ==============================================================
function BannimantapStadiumGrounds({ showTorchbearers = true }: { showTorchbearers: boolean }) {
  // Synchronized Marching Torchbearers Formation
  const torchbearerPositions = useMemo(() => {
    const list: [number, number, number][] = [];
    // Outer drill ring
    for (let a = 0; a < Math.PI * 2; a += 0.24) {
      list.push([Math.cos(a) * 22, 0, Math.sin(a) * 22]);
    }
    // Mid drill ring
    for (let a = 0; a < Math.PI * 2; a += 0.32) {
      list.push([Math.cos(a) * 14, 0, Math.sin(a) * 14]);
    }
    // Center ceremonial Chakra star
    for (let a = 0; a < Math.PI * 2; a += 0.52) {
      list.push([Math.cos(a) * 7, 0, Math.sin(a) * 7]);
    }
    return list;
  }, []);

  return (
    <group>
      {/* 1. Main Parade Turf Ground (High Quality Green-Grass Texture) */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[48, 48]} />
        <meshStandardMaterial color="#0A1810" roughness={0.85} />
      </mesh>

      {/* 2. Olympic Running Track Border */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[44, 49, 48]} />
        <meshStandardMaterial color="#8B2500" roughness={0.9} />
      </mesh>

      {/* 3. Curved Spectator Stadium Grandstands */}
      {[-1, 1].map((side) => (
        <group key={`stand-${side}`} position={[0, 0, side * 54]} rotation={[0, side === 1 ? Math.PI : 0, 0]}>
          {/* Tiered Seating Structure */}
          <mesh position={[0, 5, 0]} receiveShadow>
            <boxGeometry args={[82, 10, 12]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
          {/* Glowing Spectator Mobile Lights (Cheering Crowd) */}
          <mesh position={[0, 7.5, 3]}>
            <boxGeometry args={[78, 0.4, 0.4]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
        </group>
      ))}

      {/* 4. Four Massive 35-Meter Stadium Floodlight Towers */}
      {[
        [-40, -32],
        [40, -32],
        [-40, 32],
        [40, 32],
      ].map(([tx, tz], i) => (
        <group key={`floodlight-tower-${i}`} position={[tx, 0, tz]}>
          {/* Steel Lattice Truss Mast */}
          <mesh position={[0, 15, 0]} castShadow>
            <cylinderGeometry args={[0.6, 1.2, 30, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* High-Powered LED Luminaire Flood Bank */}
          <mesh position={[0, 30.5, 0]} rotation={[0.4, Math.atan2(-tz, -tx), 0]}>
            <boxGeometry args={[6.5, 3.2, 0.8]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0, 30.5, 0.4]} rotation={[0.4, Math.atan2(-tz, -tx), 0]}>
            <planeGeometry args={[6.2, 2.9]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          {/* Direct Stadium Illumination */}
          <spotLight
            position={[0, 30, 0]}
            target-position={[0, 0, 0]}
            color="#FFFBEB"
            intensity={1.8}
            distance={85}
            angle={0.7}
            penumbra={0.4}
            castShadow
          />
        </group>
      ))}

      {/* 5. Synchronized Torchbearers with Blazing Flames */}
      {showTorchbearers && (
        <group>
          {torchbearerPositions.map((pos, idx) => (
            <group key={`torch-${idx}`} position={pos}>
              {/* Trooper Silhouette in Ceremonial Khaki / Blue Uniform */}
              <mesh position={[0, 0.8, 0]} castShadow>
                <cylinderGeometry args={[0.16, 0.22, 1.6, 8]} />
                <meshStandardMaterial color="#1E293B" />
              </mesh>
              {/* Torchpole */}
              <mesh position={[0.2, 1.7, 0.2]}>
                <cylinderGeometry args={[0.035, 0.035, 1.6, 6]} />
                <meshStandardMaterial color="#78350F" />
              </mesh>
              {/* Blazing Flame Core (Amber & Gold) */}
              <mesh position={[0.2, 2.5, 0.2]}>
                <sphereGeometry args={[0.22, 8, 8]} />
                <meshBasicMaterial color="#FF5722" />
              </mesh>
              <mesh position={[0.2, 2.7, 0.2]}>
                <coneGeometry args={[0.16, 0.45, 8]} />
                <meshBasicMaterial color="#FFB300" />
              </mesh>
            </group>
          ))}
          {/* Warm Field Torch Glow */}
          <pointLight position={[0, 3.5, 0]} intensity={2.2} distance={45} color="#FF6F00" />
        </group>
      )}
    </group>
  );
}

// ==============================================================
// 3. CONCERT SKY LASERS & SCANNING BEAMS
// ==============================================================
function ConcertSkyLasers() {
  const laserRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!laserRef.current) return;
    const time = clock.getElapsedTime() * 0.8;
    laserRef.current.children.forEach((child, i) => {
      child.rotation.z = Math.sin(time + i * 1.1) * 0.55;
      child.rotation.x = Math.cos(time * 0.7 + i * 0.9) * 0.4;
    });
  });

  const laserColors = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EC4899', '#3B82F6'];

  return (
    <group ref={laserRef} position={[0, 1, 0]}>
      {laserColors.map((col, idx) => {
        const ang = (idx / laserColors.length) * Math.PI * 2;
        return (
          <group key={`laser-${idx}`} position={[Math.cos(ang) * 28, 0, Math.sin(ang) * 28]}>
            <mesh position={[0, 32, 0]}>
              <cylinderGeometry args={[0.06, 0.18, 65, 8]} />
              <meshBasicMaterial color={col} transparent opacity={0.65} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ==============================================================
// 4. AERIAL PYROTECHNICS & FIREWORKS BURSTS
// ==============================================================
function AerialFireworksDisplay({ triggerCount = 0 }: { triggerCount: number }) {
  const [bursts, setBursts] = useState<Array<{ id: number; pos: [number, number, number]; color: string }>>([]);

  // Auto fireworks every few seconds + reactive trigger
  useEffect(() => {
    if (triggerCount === 0) return;
    const colors = ['#F59E0B', '#EF4444', '#10B981', '#38BDF8', '#EC4899', '#A855F7'];
    const newBurst = {
      id: Date.now() + Math.random(),
      pos: [(Math.random() - 0.5) * 50, 24 + Math.random() * 14, -20 + (Math.random() - 0.5) * 30] as [number, number, number],
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setBursts((prev) => [...prev.slice(-4), newBurst]);
  }, [triggerCount]);

  return (
    <group>
      {bursts.map((b) => (
        <group key={b.id} position={b.pos}>
          {/* Flash light on explosion */}
          <pointLight color={b.color} intensity={4.5} distance={50} decay={2} />
          {/* Firework Star Ring */}
          <mesh>
            <ringGeometry args={[1.5, 3.2, 16]} />
            <meshBasicMaterial color={b.color} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==============================================================
// 5. MAIN SCENE COMPONENT
// ==============================================================
export default function DroneShowScene({
  formation = 'palace',
  colorTheme = 'gold',
  playbackState = 'playing',
  showLasers = true,
  showFireworks = true,
  showTorchbearers = true,
  cameraMode = 'grandstand',
  triggerFireworkCount = 0,
}: DroneShowSceneProps) {
  // Camera perspective management
  const camConfig = useMemo(() => {
    switch (cameraMode) {
      case 'sky':
        return { position: [0, 52, 28] as [number, number, number], target: [0, 16, 0] as [number, number, number] };
      case 'parade':
        return { position: [0, 2.5, 24] as [number, number, number], target: [0, 18, 0] as [number, number, number] };
      case 'cinematic':
        return { position: [36, 26, 44] as [number, number, number], target: [0, 16, 0] as [number, number, number] };
      case 'grandstand':
      default:
        return { position: [0, 16, 52] as [number, number, number], target: [0, 16, 0] as [number, number, number] };
    }
  }, [cameraMode]);

  return (
    <div className="relative w-full h-full min-h-[580px] bg-slate-950">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={camConfig.position} fov={50} />
        <OrbitControls
          target={camConfig.target}
          maxPolarAngle={Math.PI / 2 - 0.04}
          minDistance={12}
          maxDistance={110}
          enableDamping
        />

        {/* Deep Mystical Dussehra Midnight Sky */}
        <color attach="background" args={['#040714']} />
        <fog attach="fog" args={['#040714', 40, 140]} />

        {/* Ambient & Moon Light */}
        <ambientLight color="#0F172A" intensity={0.65} />
        <directionalLight position={[0, 45, 20]} color="#94A3B8" intensity={0.5} />

        {/* 1. Bannimantap Stadium Grounds, Floodlights & Torchbearers */}
        <BannimantapStadiumGrounds showTorchbearers={showTorchbearers} />

        {/* 2. 1,600 Synchronized High-Density Drone Swarm */}
        <SynchronizedDroneSwarm
          formation={formation}
          colorTheme={colorTheme}
          playbackState={playbackState}
        />

        {/* 3. Sweeping Concert Sky Lasers */}
        {showLasers && <ConcertSkyLasers />}

        {/* 4. Aerial Pyrotechnics Fireworks */}
        {showFireworks && <AerialFireworksDisplay triggerCount={triggerFireworkCount} />}
      </Canvas>
    </div>
  );
}
