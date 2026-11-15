import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { audioManager } from '@/audio/audioManager';
import {
  createElephantSkinTexture,
  createCobblestoneTexture,
  createArjunaForeheadTexture,
  createGraniteTexture,
} from '@/utils/textureGenerator';

interface JambooSavariSceneProps {
  playbackState?: 'playing' | 'paused' | 'slowmo';
  cameraMode?: 'follow' | 'spectator' | 'balcony' | 'aerial' | 'devi';
  onElephantClick?: () => void;
}

// 1. DIVINE GODDESS SRI CHAMUNDESHWARI (ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ದೇವಿ)
function SriChamundeshwariDevi() {
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (haloRef.current) {
      const pulse = 1.0 + Math.sin(clock.getElapsedTime() * 4) * 0.12;
      haloRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={[0, 1.4, 0]}>
      {/* 1. Divine Lotus Throne (Padma Peetha) */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.3, 0.4, 20]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.4} />
      </mesh>
      {Array.from({ length: 12 }).map((_, pi) => {
        const ang = (pi / 12) * Math.PI * 2;
        return (
          <mesh
            key={`petal-${pi}`}
            position={[Math.cos(ang) * 1.25, -0.15, Math.sin(ang) * 1.25]}
            rotation={[0, -ang, 0.4]}
          >
            <coneGeometry args={[0.3, 0.5, 6]} />
            <meshStandardMaterial color="#E91E63" roughness={0.3} />
          </mesh>
        );
      })}

      {/* 2. Goddess Body & Royal Saree */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.7, 1.4, 16]} />
        <meshStandardMaterial color="#880E4F" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.71, 0.71, 0.22, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.42, 0.7, 16]} />
        <meshStandardMaterial color="#004D40" roughness={0.4} />
      </mesh>

      {/* 3. Divine Head, Face & Golden Mukuta (Crown) */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#F5CBA7" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.95, 0.31]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#B71C1C" />
      </mesh>
      {[-0.09, 0.09].map((ex, ei) => (
        <mesh key={`eye-${ei}`} position={[ex, 1.88, 0.3]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color="#111" />
        </mesh>
      ))}

      {/* Golden Tiered Crown */}
      <group position={[0, 2.25, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.36, 0.75, 16]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <coneGeometry args={[0.22, 0.65, 12]} />
          <meshStandardMaterial color="#FFE066" metalness={0.98} roughness={0.08} />
        </mesh>
      </group>

      {/* 4. Multi-Armed Divine Form (8 Sacred Arms with Weapons) */}
      {[
        { angZ: 0.6, item: 'trident' },
        { angZ: 0.2, item: 'disc' },
        { angZ: -0.3, item: 'blade' },
        { angZ: -0.7, item: 'hand' },
      ].map((arm, ai) => (
        <group key={`r-arm-${ai}`} position={[0.42, 1.25, 0]} rotation={[0, 0, arm.angZ]}>
          <mesh position={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.65, 8]} />
            <meshStandardMaterial color="#F5CBA7" />
          </mesh>
          <group position={[0.65, 0, 0.1]}>
            {arm.item === 'trident' && (
              <mesh rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.05, 0.9, 0.05]} />
                <meshStandardMaterial color="#FFDF00" metalness={0.9} />
              </mesh>
            )}
            {arm.item === 'disc' && (
              <mesh>
                <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
                <meshStandardMaterial color="#FFDF00" metalness={0.95} />
              </mesh>
            )}
            {arm.item === 'blade' && (
              <mesh rotation={[0, 0, 0.4]}>
                <boxGeometry args={[0.04, 0.8, 0.08]} />
                <meshStandardMaterial color="#E0E0E0" metalness={0.9} />
              </mesh>
            )}
            {arm.item === 'hand' && (
              <mesh>
                <boxGeometry args={[0.08, 0.14, 0.04]} />
                <meshStandardMaterial color="#F5CBA7" />
              </mesh>
            )}
          </group>
        </group>
      ))}

      {[
        { angZ: -0.6, item: 'shankha' },
        { angZ: -0.2, item: 'bow' },
        { angZ: 0.3, item: 'shield' },
        { angZ: 0.7, item: 'lotus' },
      ].map((arm, ai) => (
        <group key={`l-arm-${ai}`} position={[-0.42, 1.25, 0]} rotation={[0, 0, arm.angZ]}>
          <mesh position={[-0.3, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.65, 8]} />
            <meshStandardMaterial color="#F5CBA7" />
          </mesh>
          <group position={[-0.65, 0, 0.1]}>
            {arm.item === 'shankha' && (
              <mesh>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial color="#FFFFFF" metalness={0.2} />
              </mesh>
            )}
            {arm.item === 'bow' && (
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.25, 0.03, 6, 12, Math.PI]} />
                <meshStandardMaterial color="#8D6E63" />
              </mesh>
            )}
            {arm.item === 'shield' && (
              <mesh>
                <cylinderGeometry args={[0.18, 0.18, 0.05, 12]} />
                <meshStandardMaterial color="#FFD700" metalness={0.9} />
              </mesh>
            )}
            {arm.item === 'lotus' && (
              <mesh>
                <sphereGeometry args={[0.14, 8, 8]} />
                <meshStandardMaterial color="#E91E63" />
              </mesh>
            )}
          </group>
        </group>
      ))}

      {/* 5. Golden Prabhavali Arch */}
      <group position={[0, 1.5, -0.3]}>
        <mesh>
          <torusGeometry args={[1.5, 0.14, 12, 32, Math.PI]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.95} roughness={0.1} />
        </mesh>
        {Array.from({ length: 15 }).map((_, fi) => {
          const ang = (fi / 14) * Math.PI;
          return (
            <mesh
              key={`flame-${fi}`}
              position={[Math.cos(ang) * 1.62, Math.sin(ang) * 1.62, 0]}
              rotation={[0, 0, ang - Math.PI / 2]}
            >
              <coneGeometry args={[0.1, 0.35, 6]} />
              <meshStandardMaterial color="#FFA000" emissive="#FF6D00" emissiveIntensity={0.8} />
            </mesh>
          );
        })}
      </group>

      <mesh ref={haloRef} position={[0, 1.8, -0.2]}>
        <circleGeometry args={[1.8, 32]} />
        <meshBasicMaterial color="#FFEA00" transparent opacity={0.35} />
      </mesh>

      {/* Marigold and Jasmine Garlands */}
      <mesh position={[0, 1.0, 0.32]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.42, 0.08, 8, 16]} />
        <meshStandardMaterial color="#FF9800" roughness={0.8} />
      </mesh>
    </group>
  );
}

// 2. SACRED 750 KG GOLDEN HOWDAH (೭೫೦ ಕೆಜಿ ಚಿನ್ನದ ಅಂಬಾರಿ)
function GoldenHowdah() {
  return (
    <group position={[0, 6.7, 0]}>
      {/* Base Platform (Gaddi) with Sculpted Lions */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[3.6, 0.7, 3.6]} />
        <meshStandardMaterial color="#FFDF00" metalness={0.96} roughness={0.08} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[3.7, 0.4, 3.7]} />
        <meshStandardMaterial color="#FFE066" metalness={0.98} roughness={0.06} />
      </mesh>

      {/* 4 Ornate Golden Corner Pillars */}
      {[
        [-1.4, -1.4],
        [1.4, -1.4],
        [-1.4, 1.4],
        [1.4, 1.4],
      ].map(([px, pz], idx) => (
        <group key={`howdah-pillar-${idx}`} position={[px, 2.2, pz]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.22, 2.8, 16]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.98} roughness={0.06} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial color="#FFF176" metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Ornate Scalloped Roof Canopy (Mandapa Dome) with Flower Garlands */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <cylinderGeometry args={[1.2, 2.6, 1.2, 24]} />
        <meshStandardMaterial color="#FFDF00" metalness={0.97} roughness={0.08} />
      </mesh>

      {/* Hanging Floral Festoons / Tassels around Howdah Canopy rim */}
      {Array.from({ length: 16 }).map((_, fi) => {
        const ang = (fi / 16) * Math.PI * 2;
        return (
          <mesh
            key={`howdah-fringe-${fi}`}
            position={[Math.cos(ang) * 2.5, 3.2, Math.sin(ang) * 2.5]}
          >
            <cylinderGeometry args={[0.06, 0.08, 0.6, 6]} />
            <meshStandardMaterial color={fi % 2 === 0 ? '#FF5722' : '#FFDF00'} />
          </mesh>
        );
      })}

      {/* Five Golden Kalashas atop the Mandapa */}
      <group position={[0, 4.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial color="#FFF59D" metalness={1} roughness={0.05} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <coneGeometry args={[0.22, 0.8, 12]} />
          <meshStandardMaterial color="#FFDF00" metalness={1} />
        </mesh>
      </group>
      {[
        [-1.0, -1.0],
        [1.0, -1.0],
        [-1.0, 1.0],
        [1.0, 1.0],
      ].map(([kx, kz], ki) => (
        <group key={`sub-kalasha-${ki}`} position={[kx, 4.3, kz]}>
          <mesh>
            <coneGeometry args={[0.15, 0.5, 8]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.96} />
          </mesh>
        </group>
      ))}

      {/* GODDESS SRI CHAMUNDESHWARI SEATED INSIDE */}
      <SriChamundeshwariDevi />
    </group>
  );
}

// 3. ANATOMICALLY SCULPTED ASIAN ELEPHANT (CURVED TUSKS, S-CURVED TRUNK, BIMATA CRANIAL DOMES)
function AnatomicalElephantModel({
  isArjuna = false,
  blanketColor = '#880E1C',
  scale = 1.0,
}: {
  isArjuna?: boolean;
  blanketColor?: string;
  scale?: number;
}) {
  const elephantSkin = useMemo(() => createElephantSkinTexture(), []);
  const arjunaForeheadTex = useMemo(() => createArjunaForeheadTexture(), []);

  // Rig references
  const leftFrontLeg = useRef<THREE.Group>(null);
  const rightFrontLeg = useRef<THREE.Group>(null);
  const leftRearLeg = useRef<THREE.Group>(null);
  const rightRearLeg = useRef<THREE.Group>(null);
  const trunkBase = useRef<THREE.Group>(null);
  const trunkMid = useRef<THREE.Group>(null);
  const trunkTip = useRef<THREE.Group>(null);
  const leftEar = useRef<THREE.Group>(null);
  const rightEar = useRef<THREE.Group>(null);
  const headGroup = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 2.8;

    // Natural 4-Phase Elephant Stride (Left-Front + Right-Rear in sync with forward progress)
    if (leftFrontLeg.current) leftFrontLeg.current.rotation.x = Math.sin(time) * 0.35;
    if (rightFrontLeg.current) rightFrontLeg.current.rotation.x = -Math.sin(time) * 0.35;
    if (leftRearLeg.current) leftRearLeg.current.rotation.x = -Math.sin(time + 0.35) * 0.28;
    if (rightRearLeg.current) rightRearLeg.current.rotation.x = Math.sin(time + 0.35) * 0.28;

    // Natural S-Curved Trunk Motion
    if (trunkBase.current) {
      trunkBase.current.rotation.x = -0.25 + Math.sin(time * 0.7) * 0.12;
      trunkBase.current.rotation.y = Math.sin(time * 0.5) * 0.08;
    }
    if (trunkMid.current) {
      trunkMid.current.rotation.x = -0.5 + Math.sin(time * 0.8 + 0.3) * 0.18;
    }
    if (trunkTip.current) {
      trunkTip.current.rotation.x = 0.75 + Math.sin(time * 1.1) * 0.22;
    }

    // Ear Flapping in Procession Rhythm
    if (leftEar.current && rightEar.current) {
      const earFlap = Math.sin(time * 1.5) * 0.15;
      leftEar.current.rotation.y = -0.28 + earFlap;
      rightEar.current.rotation.y = 0.28 - earFlap;
    }

    // Gentle Head Sway
    if (headGroup.current) {
      headGroup.current.position.y = 5.2 + Math.sin(time * 2) * 0.07;
      headGroup.current.rotation.z = Math.sin(time) * 0.02;
    }

    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(time * 1.4) * 0.3;
    }
  });

  return (
    <group scale={[scale, scale, scale]}>
      {/* 1. BARREL TORSO: OBLONG ASIAN ELEPHANT BODY WITH DORSAL RIDGE */}
      {/* Main Chest & Ribcage Barrel */}
      <mesh position={[0, 4.4, -0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[2.5, 2.7, 5.4, 20]} />
        <meshStandardMaterial map={elephantSkin} roughness={0.65} color="#807A73" />
      </mesh>
      {/* Front Shoulder Bulge */}
      <mesh position={[0, 4.6, 1.4]} castShadow>
        <sphereGeometry args={[2.5, 20, 18]} />
        <meshStandardMaterial map={elephantSkin} roughness={0.65} color="#807A73" />
      </mesh>
      {/* Rear Rump */}
      <mesh position={[0, 4.2, -2.4]} castShadow>
        <sphereGeometry args={[2.4, 20, 18]} />
        <meshStandardMaterial map={elephantSkin} roughness={0.65} color="#807A73" />
      </mesh>

      {/* 2. ROYAL VELVET CAPARISON BLANKET (JHOOL) */}
      <mesh position={[0, 4.65, -0.4]} castShadow>
        <boxGeometry args={[4.8, 3.5, 4.8]} />
        <meshStandardMaterial color={blanketColor} roughness={0.35} />
      </mesh>
      {/* Heavy Gold Zari Bullion Fringe along hem */}
      <mesh position={[0, 2.85, -0.4]}>
        <boxGeometry args={[4.9, 0.45, 4.9]} />
        <meshStandardMaterial color="#FFDF00" metalness={0.92} roughness={0.12} />
      </mesh>

      {/* 3. HEAD & NECK WITH DISTINCTIVE ASIAN TWIN CRANIAL DOMES (BIMATA) */}
      <group ref={headGroup} position={[0, 5.2, 2.8]}>
        {/* Muscular Neck Connection */}
        <mesh position={[0, -0.2, -1.0]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[1.4, 1.8, 1.6, 16]} />
          <meshStandardMaterial map={elephantSkin} color="#756F68" />
        </mesh>

        {/* Head Base Core */}
        <mesh castShadow>
          <sphereGeometry args={[1.7, 20, 18]} />
          <meshStandardMaterial map={elephantSkin} roughness={0.65} color="#807A73" />
        </mesh>

        {/* Left Cranial Dome (Bimata) */}
        <mesh position={[-0.62, 0.9, 0.1]} castShadow>
          <sphereGeometry args={[0.88, 16, 14]} />
          <meshStandardMaterial map={elephantSkin} roughness={0.65} color="#807A73" />
        </mesh>
        {/* Right Cranial Dome (Bimata) */}
        <mesh position={[0.62, 0.9, 0.1]} castShadow>
          <sphereGeometry args={[0.88, 16, 14]} />
          <meshStandardMaterial map={elephantSkin} roughness={0.65} color="#807A73" />
        </mesh>

        {/* Sloping Forehead Bridge to Trunk */}
        <mesh position={[0, 0.25, 1.2]} rotation={[0.42, 0, 0]} castShadow>
          <cylinderGeometry args={[0.75, 0.95, 1.5, 16]} />
          <meshStandardMaterial map={elephantSkin} color="#7E7871" />
        </mesh>

        {/* BOLD GOLDEN NETCHIPATTAM (FOREHEAD ARMOR WITH "ಅರ್ಜುನ") */}
        {isArjuna ? (
          <group position={[0, 0.5, 1.7]} rotation={[0.38, 0, 0]}>
            {/* Curved Golden Plate */}
            <mesh>
              <planeGeometry args={[2.0, 2.4]} />
              <meshStandardMaterial
                map={arjunaForeheadTex}
                metalness={0.85}
                roughness={0.15}
              />
            </mesh>
            {/* Raised Gold Zari Beaded Rim */}
            <mesh position={[0, 0, -0.02]}>
              <boxGeometry args={[2.1, 2.5, 0.08]} />
              <meshStandardMaterial color="#FFDF00" metalness={0.95} />
            </mesh>
            {/* Hanging Golden Chime Bells */}
            {[-0.75, -0.38, 0, 0.38, 0.75].map((bx, bi) => (
              <mesh key={`h-bell-${bi}`} position={[bx, -1.3, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#FFDF00" metalness={0.98} />
              </mesh>
            ))}
          </group>
        ) : (
          <group position={[0, 0.5, 1.65]} rotation={[0.38, 0, 0]}>
            <mesh>
              <planeGeometry args={[1.7, 2.1]} />
              <meshStandardMaterial color="#FFDF00" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.2, 0.02]}>
              <circleGeometry args={[0.38, 16]} />
              <meshBasicMaterial color="#C62828" />
            </mesh>
          </group>
        )}

        {/* EXPRESSIVE KINDLY EYES NESTLED UNDER BROW RIDGES */}
        {[-0.88, 0.88].map((ex, ei) => (
          <group key={`eye-${ei}`} position={[ex, 0.32, 1.15]}>
            {/* Brow Ridge Crease */}
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.35, 0.14, 0.25]} />
              <meshStandardMaterial map={elephantSkin} color="#68625B" />
            </mesh>
            {/* Eye Sclera & Iris */}
            <mesh position={[0, 0, 0.08]}>
              <sphereGeometry args={[0.09, 10, 10]} />
              <meshBasicMaterial color="#1C140D" />
            </mesh>
            {/* Specular Highlight */}
            <mesh position={[0.02, 0.02, 0.15]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>
        ))}

        {/* REALISTIC FAN-SHAPED CURVED EARS (Angled back with folded top edge) */}
        <group ref={leftEar} position={[-1.75, 0.15, -0.2]}>
          <mesh rotation={[0, 0.32, -0.1]}>
            <boxGeometry args={[1.6, 2.1, 0.08]} />
            <meshStandardMaterial map={elephantSkin} roughness={0.75} color="#756F68" />
          </mesh>
          {/* Folded Top Helix of Ear with Pinkish-grey Skin Tone */}
          <mesh position={[0, 0.98, 0.06]} rotation={[0.42, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 1.5, 8]} />
            <meshStandardMaterial color="#BCA197" roughness={0.65} />
          </mesh>
        </group>

        <group ref={rightEar} position={[1.75, 0.15, -0.2]}>
          <mesh rotation={[0, -0.32, 0.1]}>
            <boxGeometry args={[1.6, 2.1, 0.08]} />
            <meshStandardMaterial map={elephantSkin} roughness={0.75} color="#756F68" />
          </mesh>
          <mesh position={[0, 0.98, 0.06]} rotation={[0.42, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 1.5, 8]} />
            <meshStandardMaterial color="#BCA197" roughness={0.65} />
          </mesh>
        </group>

        {/* POWERFUL DOWNWARD-CURVING ROYAL IVORY TUSKS (REAL ASIAN TUSKER ANATOMY) */}
        {[-0.68, 0.68].map((tx, idx) => (
          <group
            key={`tusk-${idx}`}
            position={[tx, -0.65, 1.45]}
            rotation={[-0.32, idx === 0 ? -0.16 : 0.16, idx === 0 ? 0.08 : -0.08]}
          >
            {/* Tusk Socket in Lip Sheath */}
            <mesh position={[0, -0.15, 0]}>
              <cylinderGeometry args={[0.24, 0.28, 0.45, 16]} />
              <meshStandardMaterial map={elephantSkin} color="#655F59" roughness={0.7} />
            </mesh>

            {/* Segment 1: Base shaft pointing downwards from jaw */}
            <mesh position={[0, -0.75, 0.08]} castShadow>
              <cylinderGeometry args={[0.22, 0.18, 1.4, 16]} />
              <meshStandardMaterial color="#FFFDF2" roughness={0.18} metalness={0.05} />
            </mesh>
            {/* Royal Gold Ring Band 1 (Danta Bandha) */}
            <mesh position={[0, -0.5, 0.08]}>
              <torusGeometry args={[0.21, 0.038, 8, 16]} />
              <meshStandardMaterial color="#FFDF00" metalness={0.96} roughness={0.08} />
            </mesh>

            {/* Segment 2: Curved downward-forward sweep */}
            <group position={[0, -1.4, 0.18]} rotation={[0.22, 0, 0]}>
              <mesh position={[0, -0.7, 0.08]} castShadow>
                <cylinderGeometry args={[0.18, 0.13, 1.4, 16]} />
                <meshStandardMaterial color="#FFFDF2" roughness={0.18} metalness={0.05} />
              </mesh>
              {/* Royal Gold Ring Band 2 with Ruby Inset */}
              <mesh position={[0, -0.4, 0.08]}>
                <torusGeometry args={[0.17, 0.035, 8, 16]} />
                <meshStandardMaterial color="#FFDF00" metalness={0.96} roughness={0.08} />
              </mesh>

              {/* Segment 3: Tapered tip pointing downward and forward toward the ground */}
              <group position={[0, -1.35, 0.16]} rotation={[0.18, 0, 0]}>
                <mesh position={[0, -0.5, 0.06]} rotation={[Math.PI, 0, 0]} castShadow>
                  <coneGeometry args={[0.13, 1.1, 16]} />
                  <meshStandardMaterial color="#FFFDF2" roughness={0.18} metalness={0.05} />
                </mesh>
                {/* Polished Royal Gold Capping at Tip (ಚಿನ್ನದ ದಂತದ ಕವಚ) */}
                <mesh position={[0, -0.85, 0.06]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.085, 0.45, 14]} />
                  <meshStandardMaterial color="#FFDF00" metalness={0.98} roughness={0.06} />
                </mesh>
              </group>
            </group>
          </group>
        ))}

        {/* ARTICULATED TAPERING TRUNK IN S-CURVED ROYAL SALUTE */}
        <group ref={trunkBase} position={[0, -0.65, 1.65]}>
          <mesh position={[0, -0.85, 0.15]} rotation={[-0.22, 0, 0]}>
            <cylinderGeometry args={[0.44, 0.54, 1.8, 16]} />
            <meshStandardMaterial map={elephantSkin} roughness={0.75} color="#7E7871" />
          </mesh>
          {/* Sacred Saffron & Vermilion Ceremonial Paint along Bridge */}
          <mesh position={[0, -0.85, 0.42]} rotation={[-0.22, 0, 0]}>
            <planeGeometry args={[0.45, 1.6]} />
            <meshBasicMaterial color="#E65100" />
          </mesh>

          <group ref={trunkMid} position={[0, -1.75, 0.4]}>
            <mesh position={[0, -0.8, 0.15]} rotation={[-0.45, 0, 0]}>
              <cylinderGeometry args={[0.32, 0.44, 1.7, 14]} />
              <meshStandardMaterial map={elephantSkin} roughness={0.75} color="#7E7871" />
            </mesh>

            <group ref={trunkTip} position={[0, -1.5, 0.55]}>
              {/* Upward Curved Tip (Royal J-Hook) */}
              <mesh position={[0, -0.4, 0.3]} rotation={[0.65, 0, 0]}>
                <cylinderGeometry args={[0.18, 0.32, 1.2, 12]} />
                <meshStandardMaterial map={elephantSkin} roughness={0.75} color="#7E7871" />
              </mesh>
              <mesh position={[0, -0.05, 0.75]}>
                <sphereGeometry args={[0.18, 10, 10]} />
                <meshStandardMaterial color="#A18076" />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* 4. FOUR COLUMNAR LEGS WITH BROAD FOOT PADS & DISTINCT TOENAILS */}
      {/* Front-Left Leg */}
      <group ref={leftFrontLeg} position={[-1.4, 3.6, 1.2]}>
        <mesh position={[0, -1.8, 0]} castShadow>
          <cylinderGeometry args={[0.64, 0.76, 3.6, 16]} />
          <meshStandardMaterial map={elephantSkin} roughness={0.75} color="#756F68" />
        </mesh>
        <mesh position={[0, -3.4, 0]}>
          <cylinderGeometry args={[0.76, 0.82, 0.4, 16]} />
          <meshStandardMaterial map={elephantSkin} color="#655F59" />
        </mesh>
        {/* 5 Distinct Light-Colored Toenails */}
        {[-0.42, -0.21, 0, 0.21, 0.42].map((nx, ni) => (
          <mesh key={`toenail-fl-${ni}`} position={[nx, -3.48, 0.75]}>
            <boxGeometry args={[0.12, 0.16, 0.12]} />
            <meshStandardMaterial color="#FFF9E6" roughness={0.25} />
          </mesh>
        ))}
        {/* Golden Anklet (Gajjegalu) */}
        <mesh position={[0, -3.1, 0]}>
          <torusGeometry args={[0.84, 0.12, 8, 16]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.92} />
        </mesh>
      </group>

      {/* Front-Right Leg */}
      <group ref={rightFrontLeg} position={[1.4, 3.6, 1.2]}>
        <mesh position={[0, -1.8, 0]} castShadow>
          <cylinderGeometry args={[0.64, 0.76, 3.6, 16]} />
          <meshStandardMaterial map={elephantSkin} roughness={0.75} color="#756F68" />
        </mesh>
        <mesh position={[0, -3.4, 0]}>
          <cylinderGeometry args={[0.76, 0.82, 0.4, 16]} />
          <meshStandardMaterial map={elephantSkin} color="#655F59" />
        </mesh>
        {[-0.42, -0.21, 0, 0.21, 0.42].map((nx, ni) => (
          <mesh key={`toenail-fr-${ni}`} position={[nx, -3.48, 0.75]}>
            <boxGeometry args={[0.12, 0.16, 0.12]} />
            <meshStandardMaterial color="#FFF9E6" roughness={0.25} />
          </mesh>
        ))}
        <mesh position={[0, -3.1, 0]}>
          <torusGeometry args={[0.84, 0.12, 8, 16]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.92} />
        </mesh>
      </group>

      {/* Rear-Left Leg */}
      <group ref={leftRearLeg} position={[-1.4, 3.6, -2.0]}>
        <mesh position={[0, -1.8, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.8, 3.6, 16]} />
          <meshStandardMaterial map={elephantSkin} roughness={0.75} color="#756F68" />
        </mesh>
        <mesh position={[0, -3.4, 0]}>
          <cylinderGeometry args={[0.8, 0.85, 0.4, 16]} />
          <meshStandardMaterial map={elephantSkin} color="#655F59" />
        </mesh>
        {/* 4 Toenails on Rear Foot */}
        {[-0.32, -0.11, 0.11, 0.32].map((nx, ni) => (
          <mesh key={`toenail-rl-${ni}`} position={[nx, -3.48, 0.78]}>
            <boxGeometry args={[0.12, 0.16, 0.12]} />
            <meshStandardMaterial color="#FFF9E6" roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* Rear-Right Leg */}
      <group ref={rightRearLeg} position={[1.4, 3.6, -2.0]}>
        <mesh position={[0, -1.8, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.8, 3.6, 16]} />
          <meshStandardMaterial map={elephantSkin} roughness={0.75} color="#756F68" />
        </mesh>
        <mesh position={[0, -3.4, 0]}>
          <cylinderGeometry args={[0.8, 0.85, 0.4, 16]} />
          <meshStandardMaterial map={elephantSkin} color="#655F59" />
        </mesh>
        {[-0.32, -0.11, 0.11, 0.32].map((nx, ni) => (
          <mesh key={`toenail-rr-${ni}`} position={[nx, -3.48, 0.78]}>
            <boxGeometry args={[0.12, 0.16, 0.12]} />
            <meshStandardMaterial color="#FFF9E6" roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* 5. TAIL */}
      <group ref={tailRef} position={[0, 4.4, -3.5]}>
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[0.07, 0.1, 3.0, 8]} />
          <meshStandardMaterial color="#4A4540" />
        </mesh>
        <mesh position={[0, -3.0, 0]}>
          <coneGeometry args={[0.2, 0.9, 8]} />
          <meshStandardMaterial color="#1A1816" />
        </mesh>
      </group>

      {/* 6. ROYAL MAHOUT IN MYSORE PETA */}
      <group position={[0, 6.3, 1.8]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.34, 0.9, 8, 12]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.38, 0.32, 0.38, 16]} />
          <meshStandardMaterial color="#880E1C" />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <torusGeometry args={[0.39, 0.05, 8, 16]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.9} />
        </mesh>
        <group position={[0.45, 0.25, 0.3]} rotation={[0.4, 0, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.04, 1.2, 8]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// 4. CAPTAIN ARJUNA WITH 750KG GOLDEN HOWDAH
function CaptainArjunaElephant({
  position = [0, 0, 0] as [number, number, number],
  onClick,
}: {
  position?: [number, number, number];
  onClick?: () => void;
}) {
  const howdahOscillator = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (howdahOscillator.current) {
      const time = clock.getElapsedTime() * 2.8;
      howdahOscillator.current.rotation.z = Math.sin(time) * 0.022;
      howdahOscillator.current.rotation.x = Math.cos(time) * 0.014;
    }
  });

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <AnatomicalElephantModel isArjuna={true} blanketColor="#880E1C" />
      <group ref={howdahOscillator}>
        <GoldenHowdah />
      </group>
    </group>
  );
}

// 5. KUMKI ESCORT ELEPHANTS (BALARAMA & ABHIMANYU - Image 1)
function KumkiElephant({
  name,
  position,
  blanketColor,
}: {
  name: string;
  position: [number, number, number];
  blanketColor: string;
}) {
  return (
    <group position={position}>
      <AnatomicalElephantModel
        isArjuna={false}
        blanketColor={blanketColor}
        scale={0.88}
      />
    </group>
  );
}

// 6. KARNATAKA POLICE CEREMONIAL GUARDS
function PoliceEscortGuard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.5, 0.72, 0.3]} />
        <meshStandardMaterial color="#C2B280" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.2, 0.16]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.1, 0.75, 0.04]} />
        <meshStandardMaterial color="#C62828" />
      </mesh>
      <mesh position={[0, 1.76, 0]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshStandardMaterial color="#D7A172" />
      </mesh>
      <mesh position={[0, 1.94, 0]}>
        <cylinderGeometry args={[0.2, 0.18, 0.15, 12]} />
        <meshStandardMaterial color="#0D47A1" />
      </mesh>
      <mesh position={[0, 1.97, 0.1]}>
        <boxGeometry args={[0.22, 0.06, 0.12]} />
        <meshStandardMaterial color="#C62828" />
      </mesh>
      <mesh position={[-0.12, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.8, 8]} />
        <meshStandardMaterial color="#B0A06E" />
      </mesh>
      <mesh position={[0.12, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.8, 8]} />
        <meshStandardMaterial color="#B0A06E" />
      </mesh>
      <mesh position={[0.3, 0.8, 0.15]}>
        <cylinderGeometry args={[0.02, 0.02, 1.6, 6]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>
    </group>
  );
}

// 7. CHEERING CITIZENS & CROWDS
function CheeringPeopleSection({ side, count = 24 }: { side: 'left' | 'right'; count?: number }) {
  const xBase = side === 'left' ? -14 : 14;

  const people = useMemo(() => {
    const colors = ['#E91E63', '#FFC107', '#00BCD4', '#4CAF50', '#9C27B0', '#FFFFFF', '#FF5722'];
    return Array.from({ length: count }).map((_, i) => ({
      x: xBase + (Math.random() - 0.5) * 2.2,
      z: -70 + i * 6 + (Math.random() - 0.5) * 2,
      color: colors[i % colors.length],
      scale: 0.9 + Math.random() * 0.2,
    }));
  }, [count, xBase]);

  return (
    <group>
      {people.map((p, idx) => (
        <group key={`p-${side}-${idx}`} position={[p.x, 0, p.z]}>
          <mesh position={[0, 1.1 * p.scale, 0]} castShadow>
            <capsuleGeometry args={[0.22 * p.scale, 0.9 * p.scale, 4, 8]} />
            <meshStandardMaterial color={p.color} />
          </mesh>
          <mesh position={[0, 1.8 * p.scale, 0]}>
            <sphereGeometry args={[0.14 * p.scale, 8, 8]} />
            <meshStandardMaterial color="#C89D7C" />
          </mesh>
          <mesh position={[side === 'left' ? 0.25 : -0.25, 1.8, 0]} rotation={[0, 0, side === 'left' ? 0.6 : -0.6]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
            <meshStandardMaterial color="#C89D7C" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 8. DISTANT GRAND MYSORE PALACE BACKDROP
function MysorePalaceBackdrop() {
  const graniteTex = useMemo(() => createGraniteTexture(), []);

  return (
    <group position={[0, 0, -125]}>
      {/* Palace Main Central Facade */}
      <mesh position={[0, 14, 0]} castShadow>
        <boxGeometry args={[140, 26, 16]} />
        <meshStandardMaterial map={graniteTex} color="#D8C8B5" roughness={0.6} />
      </mesh>

      {/* Seven Grand Scalloped Arches on Facade */}
      {[-45, -30, -15, 0, 15, 30, 45].map((ax, i) => (
        <group key={`bg-arch-${i}`} position={[ax, 10, 8.2]}>
          <mesh>
            <cylinderGeometry args={[0.5, 0.6, 14, 8]} />
            <meshStandardMaterial color="#E8D5B5" />
          </mesh>
          <mesh position={[0, 6, 0]}>
            <torusGeometry args={[3.6, 0.45, 6, 14, Math.PI]} />
            <meshStandardMaterial color="#D4A017" metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Central 145ft Durbar Tower */}
      <mesh position={[0, 32, 2]} castShadow>
        <boxGeometry args={[26, 20, 16]} />
        <meshStandardMaterial map={graniteTex} color="#C4B4A0" roughness={0.5} />
      </mesh>

      {/* Majestic Golden Central Dome */}
      <mesh position={[0, 48, 2]} castShadow>
        <sphereGeometry args={[11, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshStandardMaterial
          color="#FFDF00"
          metalness={0.95}
          roughness={0.1}
          emissive="#FFA500"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh position={[0, 58, 2]}>
        <coneGeometry args={[1.4, 9, 12]} />
        <meshStandardMaterial color="#FFF176" metalness={1} />
      </mesh>

      {/* Corner Towers with Rose-Red Domes */}
      {[-60, 60].map((cx, ci) => (
        <group key={`bg-dome-${ci}`} position={[cx, 0, 0]}>
          <mesh position={[0, 20, 0]} castShadow>
            <cylinderGeometry args={[8, 8.5, 36, 8]} />
            <meshStandardMaterial map={graniteTex} color="#C4B4A0" />
          </mesh>
          <mesh position={[0, 40, 0]}>
            <sphereGeometry args={[8, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            <meshStandardMaterial color="#A32438" roughness={0.3} metalness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 9. PUSHPARCHANE - SACRED FLOWER PETAL RAIN SYSTEM (ಪುಷ್ಪಾರ್ಚನೆ)
function PushparchaneFlowerShower() {
  const count = 220;
  const petalsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const petalData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 18,
      y: 10 + Math.random() * 16,
      z: (Math.random() - 0.5) * 18,
      speedY: 2.2 + Math.random() * 2.5,
      rotSpeed: Math.random() * 3,
      scale: 0.16 + Math.random() * 0.18,
    }));
  }, [count]);

  useFrame((_, delta) => {
    if (petalsRef.current) {
      petalData.forEach((p, i) => {
        p.y -= p.speedY * delta;
        if (p.y < 0.2) p.y = 22 + Math.random() * 5;

        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(p.y * p.rotSpeed, p.x * 2, p.z);
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.updateMatrix();
        petalsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      petalsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={petalsRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.3, 6, 6]} />
      <meshStandardMaterial color="#FFB300" roughness={0.4} />
    </instancedMesh>
  );
}

// 10. Sayyaji Rao Roadway with Streetlamps, Trees & Flags
function ProcessionAvenue() {
  const cobbleTex = useMemo(() => createCobblestoneTexture(), []);

  return (
    <group>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 280]} />
        <meshStandardMaterial map={cobbleTex} color="#524A42" roughness={0.8} />
      </mesh>

      {[-14, 14].map((cx, idx) => (
        <group key={`curb-${idx}`} position={[cx, 0, 0]}>
          <mesh position={[0, 0.2, 0]} receiveShadow>
            <boxGeometry args={[7, 0.4, 280]} />
            <meshStandardMaterial color="#8D8273" roughness={0.7} />
          </mesh>
          <mesh position={[idx === 0 ? 3.3 : -3.3, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 280, 8]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      ))}

      {[-11.5, 11.5].map((lx, li) => (
        <group key={`lamp-line-${li}`}>
          {Array.from({ length: 14 }).map((_, lIdx) => (
            <group key={`lamp-${li}-${lIdx}`} position={[lx, 0, -80 + lIdx * 14]}>
              <mesh position={[0, 2.5, 0]}>
                <cylinderGeometry args={[0.08, 0.12, 5, 8]} />
                <meshStandardMaterial color="#111" metalness={0.8} />
              </mesh>
              <mesh position={[0, 5.2, 0]}>
                <sphereGeometry args={[0.3, 10, 10]} />
                <meshBasicMaterial color="#FFE082" />
              </mesh>
              <group position={[li === 0 ? 0.4 : -0.4, 3.8, 0]}>
                <mesh position={[0, 0.2, 0]}>
                  <planeGeometry args={[0.8, 0.35]} />
                  <meshBasicMaterial color="#FFEB3B" />
                </mesh>
                <mesh position={[0, -0.15, 0]}>
                  <planeGeometry args={[0.8, 0.35]} />
                  <meshBasicMaterial color="#D50000" />
                </mesh>
              </group>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

// 11. MOVING PROCESSION: V-FORMATION & TRUE FORWARD MARCHING (NO MORE GOING BACKWARDS!)
function MovingProcession({
  playbackState,
  onElephantClick,
}: {
  playbackState: 'playing' | 'paused' | 'slowmo';
  onElephantClick?: () => void;
}) {
  const [elephantPos, setElephantPos] = useState<number>(-20);

  // Advance FORWARD towards camera (from negative Z towards positive Z)
  useFrame((_, delta) => {
    if (playbackState === 'playing') {
      const speed = 2.4 * delta;
      setElephantPos((prev) => (prev > 35 ? -45 : prev + speed));
    } else if (playbackState === 'slowmo') {
      const speed = 0.8 * delta;
      setElephantPos((prev) => (prev > 35 ? -45 : prev + speed));
    }
  });

  return (
    <group position={[0, 0, elephantPos]}>
      {/* 1. CENTER LEADER: CAPTAIN ARJUNA (ಅರ್ಜುನ) with 750kg Howdah & Goddess Chamundeshwari */}
      <CaptainArjunaElephant
        position={[0, 0, 0]}
        onClick={() => {
          audioManager.playRoyalFanfare();
          if (onElephantClick) onElephantClick();
        }}
      />

      {/* 2. LEFT ESCORT: BALARAMA (ಬಲರಾಮ) - Stepped back 7m in classic V-Formation */}
      <KumkiElephant
        name="Balarama"
        position={[-7.5, 0, -7.0]}
        blanketColor="#1E7A36"
      />

      {/* 3. RIGHT ESCORT: ABHIMANYU (ಅಭಿಮನ್ಯು) - Stepped back 7m in classic V-Formation */}
      <KumkiElephant
        name="Abhimanyu"
        position={[7.5, 0, -7.0]}
        blanketColor="#0D5C75"
      />

      {/* 4. KARNATAKA POLICE CEREMONIAL GUARDS (Marching in step alongside) */}
      {[-8, -4, 0, 4].map((pz, pi) => (
        <PoliceEscortGuard key={`pol-l-${pi}`} position={[-10.2, 0, pz]} />
      ))}
      {[-8, -4, 0, 4].map((pz, pi) => (
        <PoliceEscortGuard key={`pol-r-${pi}`} position={[10.2, 0, pz]} />
      ))}
    </group>
  );
}

export default function JambooSavariScene({
  playbackState = 'playing',
  cameraMode = 'follow',
  onElephantClick,
}: JambooSavariSceneProps) {
  const camConfig = useMemo(() => {
    switch (cameraMode) {
      case 'devi':
        return {
          position: [0, 9.6, 8.5] as [number, number, number],
          target: [0, 8.2, 0] as [number, number, number],
        };
      case 'spectator':
        return {
          position: [11.5, 2.8, 14] as [number, number, number],
          target: [0, 5.5, 0] as [number, number, number],
        };
      case 'balcony':
        return {
          position: [16, 16, 18] as [number, number, number],
          target: [0, 5.5, 0] as [number, number, number],
        };
      case 'aerial':
        return {
          position: [0, 38, 28] as [number, number, number],
          target: [0, 0, 0] as [number, number, number],
        };
      case 'follow':
      default:
        // Dynamic 3/4 front-side perspective reveals the 3 elephants, tusks, howdah & palace depth!
        return {
          position: [11.5, 7.5, 20] as [number, number, number],
          target: [0, 5.5, 0] as [number, number, number],
        };
    }
  }, [cameraMode]);

  return (
    <div className="relative w-full h-full min-h-[580px] bg-black">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={camConfig.position} fov={46} />
        <OrbitControls
          target={camConfig.target}
          maxPolarAngle={Math.PI / 2 - 0.04}
          minDistance={6}
          maxDistance={90}
          enableDamping
        />

        {/* Vibrant Bright Festive Sky */}
        <color attach="background" args={['#BFDBFE']} />
        <fog attach="fog" args={['#DBEAFE', 60, 180]} />

        {/* Crisp Warm Sunlight & Direct Front Fill (Vivid pachyderm grey & golden howdah) */}
        <ambientLight color="#FFFFFF" intensity={1.3} />
        <directionalLight
          position={[10, 20, 32]}
          intensity={1.7}
          color="#FFFDF5"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-20, 25, 20]}
          intensity={0.9}
          color="#FFE8D6"
        />

        {/* 1. Distant Mysore Palace Backdrop */}
        <MysorePalaceBackdrop />

        {/* 2. Procession Avenue Boulevard */}
        <ProcessionAvenue />

        {/* 3. Cheering Crowds & Spectators */}
        <CheeringPeopleSection side="left" count={28} />
        <CheeringPeopleSection side="right" count={28} />

        {/* 4. Flower Shower (Pushparchane) */}
        <PushparchaneFlowerShower />

        {/* 5. Moving Procession: Marching FORWARD towards Camera in V-Formation */}
        <MovingProcession
          playbackState={playbackState}
          onElephantClick={onElephantClick}
        />
      </Canvas>

      {/* Floating HUD Badge for Arjuna & Chamundeshwari Devi */}
      <div className="absolute top-4 left-4 z-10">
        <div className="glass-dark px-4 py-2.5 rounded-2xl border border-amber-400/50 shadow-royal flex items-center gap-3">
          <span className="text-2xl animate-bounce">🐘</span>
          <div>
            <h4 className="text-sm font-bold text-amber-200">
              ಕ್ಯಾಪ್ಟನ್ ಅರ್ಜುನ (Captain Arjuna)
            </h4>
            <p className="text-[11px] text-amber-400/90 font-kannada">
              ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ದೇವಿ • ೭೫೦ ಕೆಜಿ ಚಿನ್ನದ ಅಂಬಾರಿ • ಪೊಲೀಸ್ ಬೆಂಗಾವಲು
            </p>
          </div>
        </div>
      </div>

      {/* Pushparchane Live Indicator */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs backdrop-blur-md">
        <span className="animate-spin text-sm">🌸</span>
        <span className="font-kannada font-semibold">ಪುಷ್ಪಾರ್ಚನೆ (Pushparchane Active)</span>
      </div>

      {/* Bottom Status Banner */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-10 pointer-events-none">
        <p className="text-xs text-amber-200 bg-black/75 px-3.5 py-2 rounded-xl backdrop-blur-md border border-amber-400/30">
          👑 Live 3D Marching Forward • Captain Arjuna in V-Formation flanked by Balarama & Abhimanyu
        </p>
      </div>
    </div>
  );
}
