import React, { useRef, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { audioManager } from '@/audio/audioManager';
import { createGraniteTexture, createCobblestoneTexture } from '@/utils/textureGenerator';

interface ChamundiSceneProps {
  onNandiClick?: () => void;
  onTempleClick?: () => void;
  onMahishaClick?: () => void;
}

// 1. Chamundi Hill Terrain, Dravidian Temple, Mahishasura & Monolithic Nandi
function ChamundiSummit({
  onNandiClick,
  onTempleClick,
  onMahishaClick,
}: {
  onNandiClick?: () => void;
  onTempleClick?: () => void;
  onMahishaClick?: () => void;
}) {
  const graniteTex = useMemo(() => createGraniteTexture(), []);
  const cobblestoneTex = useMemo(() => createCobblestoneTexture(), []);

  return (
    <group>
      {/* 1. Chamundi Hill Mountain Terrain Base */}
      <mesh position={[0, -3, 0]} receiveShadow>
        <coneGeometry args={[48, 20, 36]} />
        <meshStandardMaterial color="#3D4536" roughness={0.95} />
      </mesh>

      {/* Lush Western Ghats Deciduous Forest Foliage */}
      {Array.from({ length: 80 }).map((_, i) => {
        const theta = (i / 80) * Math.PI * 2;
        const radius = 11 + (i % 5) * 4.5 + Math.random() * 3;
        const y = 6 - (radius - 11) * 0.35;
        return (
          <mesh
            key={`tree-${i}`}
            position={[Math.cos(theta) * radius, y, Math.sin(theta) * radius]}
          >
            <coneGeometry args={[1.4 + (i % 3) * 0.3, 3.8 + (i % 2) * 0.8, 8]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#1E4620' : i % 3 === 1 ? '#2E5B28' : '#3E6B34'}
              roughness={0.85}
            />
          </mesh>
        );
      })}

      {/* 2. Temple Courtyard Platform with Stone Pavement */}
      <mesh position={[0, 7.2, -2]} receiveShadow>
        <boxGeometry args={[30, 0.8, 26]} />
        <meshStandardMaterial
          map={graniteTex}
          color="#A89F91"
          roughness={0.7}
        />
      </mesh>

      {/* Courtyard Outer Stone Boundary Wall (Prakara) */}
      <mesh position={[0, 8.1, -15]} castShadow>
        <boxGeometry args={[30, 1.2, 0.6]} />
        <meshStandardMaterial map={graniteTex} color="#8D8273" roughness={0.8} />
      </mesh>
      <mesh position={[-15, 8.1, -2]} castShadow>
        <boxGeometry args={[0.6, 1.2, 26]} />
        <meshStandardMaterial map={graniteTex} color="#8D8273" roughness={0.8} />
      </mesh>
      <mesh position={[15, 8.1, -2]} castShadow>
        <boxGeometry args={[0.6, 1.2, 26]} />
        <meshStandardMaterial map={graniteTex} color="#8D8273" roughness={0.8} />
      </mesh>

      {/* 3. SRI CHAMUNDESHWARI TEMPLE (7-TIER DRAVIDIAN GOPURAM) */}
      <group
        position={[0, 7.6, -6]}
        onClick={(e) => {
          e.stopPropagation();
          audioManager.playRoyalFanfare();
          if (onTempleClick) onTempleClick();
        }}
      >
        {/* Mandapa / Main Sanctum (Garbhagriha Base) */}
        <mesh position={[0, 2, -6]} castShadow receiveShadow>
          <boxGeometry args={[12, 4, 10]} />
          <meshStandardMaterial map={graniteTex} color="#9C9181" roughness={0.7} />
        </mesh>

        {/* 7 Tiered Gopuram Pyramidal Dravidian Tower */}
        {[
          { y: 2.5, w: 9.0, h: 4.2, d: 5.5, col: '#C8A26A' },
          { y: 5.8, w: 7.8, h: 3.2, d: 4.8, col: '#D4AF37' },
          { y: 8.4, w: 6.6, h: 3.0, d: 4.1, col: '#C8A26A' },
          { y: 10.7, w: 5.4, h: 2.6, d: 3.4, col: '#D4AF37' },
          { y: 12.6, w: 4.2, h: 2.2, d: 2.8, col: '#C8A26A' },
          { y: 14.2, w: 3.0, h: 1.8, d: 2.2, col: '#D4AF37' },
          { y: 15.5, w: 2.0, h: 1.4, d: 1.6, col: '#C8A26A' },
        ].map((t, idx) => (
          <group key={`gopuram-tier-${idx}`} position={[0, t.y, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[t.w, t.h, t.d]} />
              <meshStandardMaterial
                map={graniteTex}
                color={t.col}
                roughness={0.65}
              />
            </mesh>
            {/* Ornamental Dravidian niches & pilasters */}
            {[-t.w * 0.35, 0, t.w * 0.35].map((px, pi) => (
              <mesh key={`p-${pi}`} position={[px, 0, t.d * 0.52]}>
                <boxGeometry args={[t.w * 0.15, t.h * 0.8, 0.1]} />
                <meshStandardMaterial color="#8B7355" roughness={0.6} />
              </mesh>
            ))}
          </group>
        ))}

        {/* 7 Golden Kalashas Atop the Summit Gopuram */}
        <group position={[0, 16.6, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 1.8, 0.6, 16]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.92} roughness={0.15} />
          </mesh>
          {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map((kx, kidx) => (
            <group key={`kalasha-${kidx}`} position={[kx, 0.6, 0]}>
              <mesh>
                <coneGeometry args={[0.14, 0.75, 12]} />
                <meshStandardMaterial color="#FFDF00" metalness={0.95} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.4, 0]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#FFE066" metalness={1} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Temple Entrance Mahadwara Arch */}
        <mesh position={[0, 1.2, 2.8]}>
          <boxGeometry args={[3.2, 2.4, 0.4]} />
          <meshStandardMaterial color="#1A0D00" roughness={0.9} />
        </mesh>
      </group>

      {/* 4. ICONIC MAHISHASURA STATUE (Symbol of Mysuru Victory) */}
      <group
        position={[-8, 7.6, 4]}
        onClick={(e) => {
          e.stopPropagation();
          audioManager.playDrumBeat(0.8);
          if (onMahishaClick) onMahishaClick();
        }}
      >
        {/* Octagonal pedestal */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[1.8, 2.0, 1.2, 8]} />
          <meshStandardMaterial map={graniteTex} color="#ECECEC" roughness={0.5} />
        </mesh>

        {/* Demon King Mahishasura colorful body */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.65, 2.0, 12]} />
          <meshStandardMaterial color="#E8A87C" roughness={0.5} />
        </mesh>

        {/* Colorful Royal Dhoti (Yellow/Green) */}
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.68, 0.72, 1.0, 12]} />
          <meshStandardMaterial color="#E5A910" roughness={0.6} />
        </mesh>

        {/* Head with iconic curling black mustache */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshStandardMaterial color="#E8A87C" roughness={0.5} />
        </mesh>

        {/* Royal Crown (Mukuta) */}
        <mesh position={[0, 4.05, 0]}>
          <coneGeometry args={[0.35, 0.8, 12]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.9} />
        </mesh>

        {/* Raised Sword in Right Hand */}
        <group position={[0.7, 3.2, 0.3]} rotation={[0.4, 0, -0.6]}>
          <mesh>
            <boxGeometry args={[0.08, 1.6, 0.2]} />
            <meshStandardMaterial color="#DCDCDC" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Cobra in Left Hand */}
        <group position={[-0.7, 2.8, 0.3]}>
          <mesh>
            <torusGeometry args={[0.3, 0.08, 8, 16]} />
            <meshStandardMaterial color="#1F5A29" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* 5. MONOLITHIC NANDI BULL (Carved from Single Black Granite Boulder in 1659) */}
      <group
        position={[8.5, 4.2, 9]}
        onClick={(e) => {
          e.stopPropagation();
          audioManager.playDrumBeat(0.9);
          if (onNandiClick) onNandiClick();
        }}
      >
        {/* Stone Pedestal with Granite Texture */}
        <mesh position={[0, 0.4, 0]} receiveShadow>
          <boxGeometry args={[5.2, 0.8, 7.2]} />
          <meshStandardMaterial map={graniteTex} color="#333333" roughness={0.8} />
        </mesh>

        {/* Monolithic Polished Black Granite Body */}
        <mesh position={[0, 1.9, 0]} castShadow>
          <boxGeometry args={[3.2, 2.3, 5.2]} />
          <meshStandardMaterial color="#181818" roughness={0.35} metalness={0.3} />
        </mesh>

        {/* Nandi Royal Hump */}
        <mesh position={[0, 3.2, -0.8]} castShadow>
          <sphereGeometry args={[1.0, 16, 12]} />
          <meshStandardMaterial color="#181818" roughness={0.35} metalness={0.3} />
        </mesh>

        {/* Nandi Head & Majestic Horns */}
        <mesh position={[0, 2.9, 2.6]} rotation={[0.18, 0, 0]} castShadow>
          <boxGeometry args={[1.9, 1.7, 2.0]} />
          <meshStandardMaterial color="#181818" roughness={0.35} metalness={0.3} />
        </mesh>
        {/* Left & Right Horns */}
        {[-0.8, 0.8].map((hx, hi) => (
          <mesh
            key={`horn-${hi}`}
            position={[hx, 3.9, 2.3]}
            rotation={[-0.2, 0, hi === 0 ? 0.3 : -0.3]}
          >
            <coneGeometry args={[0.22, 1.1, 10]} />
            <meshStandardMaterial color="#0A0A0A" roughness={0.3} metalness={0.4} />
          </mesh>
        ))}

        {/* Golden & Silver Bell Chains Carved around Neck (Gajjegalu) */}
        <mesh position={[0, 2.1, 2.0]}>
          <torusGeometry args={[1.6, 0.18, 10, 24]} />
          <meshStandardMaterial color="#E5B80B" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Sacred Flower Garland (Yellow & Red Marigold) */}
        <mesh position={[0, 1.8, 2.2]}>
          <torusGeometry args={[1.7, 0.12, 8, 20]} />
          <meshStandardMaterial color="#FF5722" roughness={0.8} />
        </mesh>
      </group>

      {/* 6. Historic 1,000 Stone Steps Pilgrimage Path */}
      {Array.from({ length: 32 }).map((_, stepIdx) => (
        <mesh
          key={`step-${stepIdx}`}
          position={[6.5 - stepIdx * 0.42, 3.8 - stepIdx * 0.16, 7 + stepIdx * 0.65]}
          rotation={[0, 0.28, 0]}
        >
          <boxGeometry args={[2.8, 0.25, 0.85]} />
          <meshStandardMaterial map={cobblestoneTex} color="#7D7465" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export default function ChamundiScene({
  onNandiClick,
  onTempleClick,
  onMahishaClick,
}: ChamundiSceneProps) {
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'noon' | 'twilight'>('dawn');

  const lighting = {
    dawn: {
      bg: '#FAD0A1',
      fog: '#F5BE88',
      ambient: '#FFE0C8',
      sun: '#FF9E40',
      sunPos: [-30, 35, 25] as [number, number, number],
      intensity: 1.5,
    },
    noon: {
      bg: '#87CEEB',
      fog: '#B0E0E6',
      ambient: '#FFFFFF',
      sun: '#FFF5E0',
      sunPos: [10, 50, 15] as [number, number, number],
      intensity: 1.8,
    },
    twilight: {
      bg: '#4A2545',
      fog: '#381C35',
      ambient: '#9C6E8F',
      sun: '#FF6F59',
      sunPos: [-40, 15, 20] as [number, number, number],
      intensity: 1.2,
    },
  }[timeOfDay];

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[18, 18, 32]} fov={50} />
        <OrbitControls
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={10}
          maxDistance={85}
          enableDamping
        />

        <color attach="background" args={[lighting.bg]} />
        <fog attach="fog" args={[lighting.fog, 35, 105]} />
        <ambientLight color={lighting.ambient} intensity={0.7} />
        <directionalLight
          position={lighting.sunPos}
          intensity={lighting.intensity}
          color={lighting.sun}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <ChamundiSummit
          onNandiClick={onNandiClick}
          onTempleClick={onTempleClick}
          onMahishaClick={onMahishaClick}
        />
      </Canvas>

      {/* Floating Info & Ambience Controls */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {(['dawn', 'noon', 'twilight'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setTimeOfDay(mode)}
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-all ${
              timeOfDay === mode
                ? 'bg-amber-400 text-black shadow-gold-glow'
                : 'bg-black/50 text-white/70 hover:bg-black/70 border border-white/10'
            }`}
          >
            {mode === 'dawn' ? '🌅 Morning Dawn' : mode === 'noon' ? '☀️ Midday' : '🌇 Twilight Dusk'}
          </button>
        ))}
      </div>

      <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
        <p className="text-[11px] text-amber-200 bg-black/70 px-3 py-1.5 rounded-xl backdrop-blur-md border border-amber-400/30">
          ⛰️ Chamundi Hills (1,062m) • Sri Chamundeshwari Temple • Mahishasura Statue • 1659 Monolithic Nandi
        </p>
      </div>
    </div>
  );
}
