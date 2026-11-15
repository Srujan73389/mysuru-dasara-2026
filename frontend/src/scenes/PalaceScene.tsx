import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { audioManager } from '@/audio/audioManager';
import {
  createGraniteTexture,
  createStainedGlassTexture,
  createPalaceCourtyardPavingTexture,
  createGandaberundaTexture,
} from '@/utils/textureGenerator';

interface PalaceSceneProps {
  lightingMode: 'day' | 'evening' | 'night';
  illuminationOn: boolean;
  lightIntensity: number;
  bloomIntensity: number;
  quality: 'high' | 'balanced' | 'low';
  cameraView?: 'overview' | 'durbar' | 'courtyard' | 'aerial' | 'gates';
  onSelectHotspot?: (hotspot: string) => void;
}

// -------------------------------------------------------------
// 1. Carved White Marble Royal Elephant Statue for Balarama Gate
// -------------------------------------------------------------
function ElephantStatue({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Tiered Sandstone & Marble Plinth */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.8, 4.4]} />
        <meshStandardMaterial color="#BCAAA4" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.3, 4.0]} />
        <meshStandardMaterial color="#E8DED1" roughness={0.4} />
      </mesh>

      {/* Elephant Body (Fine White/Cream Polished Marble) */}
      <group position={[0, 1.05, 0]}>
        {/* Torso */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[1.7, 1.5, 2.6]} />
          <meshStandardMaterial color="#EFEAE1" roughness={0.35} metalness={0.05} />
        </mesh>

        {/* 4 Sturdy Legs */}
        {[
          [-0.6, 0.65, 0.9],
          [0.6, 0.65, 0.9],
          [-0.6, 0.65, -0.9],
          [0.6, 0.65, -0.9],
        ].map(([lx, ly, lz], i) => (
          <mesh key={i} position={[lx, ly, lz]} castShadow>
            <cylinderGeometry args={[0.26, 0.32, 1.3, 12]} />
            <meshStandardMaterial color="#EFEAE1" roughness={0.35} />
          </mesh>
        ))}

        {/* Twin Cranial Domes (Bimata) */}
        <mesh position={[-0.32, 2.2, 1.25]} castShadow>
          <sphereGeometry args={[0.38, 14, 14]} />
          <meshStandardMaterial color="#EFEAE1" roughness={0.35} />
        </mesh>
        <mesh position={[0.32, 2.2, 1.25]} castShadow>
          <sphereGeometry args={[0.38, 14, 14]} />
          <meshStandardMaterial color="#EFEAE1" roughness={0.35} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.95, 1.3]} castShadow>
          <sphereGeometry args={[0.55, 16, 14]} />
          <meshStandardMaterial color="#EFEAE1" roughness={0.35} />
        </mesh>

        {/* Royal Head Caparison (ನೆತ್ತಿ ಪಟ್ಟಿ) in Crimson & Gold */}
        <mesh position={[0, 2.05, 1.65]}>
          <boxGeometry args={[0.65, 0.8, 0.08]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.05, 1.7]}>
          <circleGeometry args={[0.22, 12]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Raised Trunk in Royal Salute (ಸಲಾಮ್ ಭಂಗಿ - Upwards curled trunk) */}
        <mesh position={[0, 1.45, 1.8]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.9, 10]} />
          <meshStandardMaterial color="#EFEAE1" roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.9, 2.05]} rotation={[-0.6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.18, 0.7, 10]} />
          <meshStandardMaterial color="#EFEAE1" roughness={0.35} />
        </mesh>
        <mesh position={[0, 2.2, 1.9]} rotation={[-1.6, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 0.5, 10]} />
          <meshStandardMaterial color="#EFEAE1" roughness={0.35} />
        </mesh>

        {/* Royal White Marble Tusks (ದಂತ) with Golden Brass Rings */}
        {[-0.32, 0.32].map((tx, ti) => (
          <group key={ti} position={[tx, 1.6, 1.7]} rotation={[0.3, ti === 0 ? -0.15 : 0.15, 0]}>
            <mesh castShadow>
              <coneGeometry args={[0.07, 0.85, 10]} />
              <meshStandardMaterial color="#FFFFF2" roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.08, 10]} />
              <meshStandardMaterial color="#FFDF00" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        ))}

        {/* Large Flared Ears */}
        {[-0.8, 0.8].map((ex, ei) => (
          <mesh key={ei} position={[ex, 1.85, 1.1]} rotation={[0, ei === 0 ? 0.35 : -0.35, 0]}>
            <boxGeometry args={[0.48, 0.75, 0.08]} />
            <meshStandardMaterial color="#E8DED1" roughness={0.4} />
          </mesh>
        ))}

        {/* Royal Saddle Cloth (ಝೂಲ್) in Rich Red & Gold */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[1.76, 1.25, 2.0]} />
          <meshStandardMaterial color="#8B0000" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[1.78, 0.2, 2.02]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 2. Uniformed Karnataka Police / Mysore Royal Guard Sentry
// -------------------------------------------------------------
function PoliceSentry({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Sentry Box Shelter */}
      <group position={[0, 0, -1.2]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[1.5, 0.3, 1.5]} />
          <meshStandardMaterial color="#3E2723" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[1.3, 2.3, 1.3]} />
          <meshStandardMaterial color="#1B5E20" roughness={0.6} />
        </mesh>
        <mesh position={[0, 2.8, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.1, 0.8, 4]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.4} />
        </mesh>
      </group>

      {/* Sentry Figure Standing at Attention */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.45, 0.5, 0.2, 12]} />
          <meshStandardMaterial color="#555" />
        </mesh>

        {/* Khaki Trousers */}
        <mesh position={[-0.14, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.9, 10]} />
          <meshStandardMaterial color="#A48C65" roughness={0.7} />
        </mesh>
        <mesh position={[0.14, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.9, 10]} />
          <meshStandardMaterial color="#A48C65" roughness={0.7} />
        </mesh>

        {/* Khaki Police Tunic */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[0.46, 0.7, 0.28]} />
          <meshStandardMaterial color="#B39972" roughness={0.6} />
        </mesh>

        {/* White Ceremonial Crossbelt & Brass Buckle */}
        <mesh position={[0, 1.4, 0.15]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.07, 0.75, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.15, 0.15]}>
          <boxGeometry args={[0.1, 0.08, 0.04]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.9} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.95, 0]} castShadow>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#8D5524" roughness={0.6} />
        </mesh>

        {/* Mysore Royal Red Safa (Turban with Gold Fan Crest) */}
        <mesh position={[0, 2.08, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.2, 0.22, 12]} />
          <meshStandardMaterial color="#C2185B" roughness={0.5} />
        </mesh>
        <mesh position={[0, 2.24, 0.06]}>
          <coneGeometry args={[0.18, 0.2, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} />
        </mesh>

        {/* Ceremonial Cane / Lathi */}
        <mesh position={[0.28, 0.95, 0.1]} castShadow>
          <cylinderGeometry args={[0.02, 0.025, 1.5, 8]} />
          <meshStandardMaterial color="#4E342E" roughness={0.5} />
        </mesh>
        <mesh position={[0.28, 1.7, 0.1]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 3. Royal Courtyard Grand Multi-Tiered Fountain with Water Jets
// -------------------------------------------------------------
function RoyalPalaceFountain({ position }: { position: [number, number, number] }) {
  const waterJetRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (waterJetRef.current) {
      const t = clock.getElapsedTime();
      const scaleY = 1.0 + Math.sin(t * 3.5) * 0.15;
      waterJetRef.current.scale.set(1, scaleY, 1);
    }
  });

  return (
    <group position={position}>
      {/* Octagonal Stone Outer Basin */}
      <mesh position={[0, 0.45, 0]} receiveShadow>
        <cylinderGeometry args={[7.8, 8.4, 0.9, 8]} />
        <meshStandardMaterial color="#9C8B7A" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[8.0, 7.8, 0.15, 8]} />
        <meshStandardMaterial color="#C4B5A5" roughness={0.4} />
      </mesh>

      {/* Water Pool Disc */}
      <mesh position={[0, 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[7.2, 32]} />
        <meshStandardMaterial
          color="#0d698b"
          roughness={0.08}
          metalness={0.85}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Tier 1 Center Pedestal */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[2.0, 2.4, 1.1, 16]} />
        <meshStandardMaterial color="#8A7B6D" roughness={0.5} />
      </mesh>
      {/* Tier 1 Carved Basin */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <cylinderGeometry args={[3.2, 1.8, 0.4, 16]} />
        <meshStandardMaterial color="#D7C9B8" roughness={0.4} />
      </mesh>

      {/* Tier 2 Center Column */}
      <mesh position={[0, 2.7, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.9, 1.2, 12]} />
        <meshStandardMaterial color="#FFDF00" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Tier 2 Basin */}
      <mesh position={[0, 3.4, 0]} castShadow>
        <cylinderGeometry args={[1.8, 0.6, 0.35, 12]} />
        <meshStandardMaterial color="#D7C9B8" roughness={0.4} />
      </mesh>

      {/* Tier 3 Gilded Lotus Finial */}
      <mesh position={[0, 3.9, 0]}>
        <sphereGeometry args={[0.45, 12, 12]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Dynamic Water Spray Columns */}
      <group ref={waterJetRef} position={[0, 4.0, 0]}>
        {/* Central High Spout */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.1, 0.3, 3.6, 8]} />
          <meshBasicMaterial color="#E0F7FA" transparent opacity={0.65} />
        </mesh>
        {/* Surrounding Arching Water Jets */}
        {Array.from({ length: 6 }).map((_, ji) => {
          const ang = (ji / 6) * Math.PI * 2;
          return (
            <mesh
              key={ji}
              position={[Math.cos(ang) * 1.5, 0.7, Math.sin(ang) * 1.5]}
              rotation={[0.3 * Math.sin(ang), 0, -0.3 * Math.cos(ang)]}
            >
              <cylinderGeometry args={[0.06, 0.15, 2.2, 6]} />
              <meshBasicMaterial color="#B2EBF2" transparent opacity={0.55} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 4. Wadiyar Royal Standard Flagpole
// -------------------------------------------------------------
function RoyalFlagpole({ position }: { position: [number, number, number] }) {
  const flagRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (flagRef.current) {
      const t = clock.getElapsedTime();
      flagRef.current.rotation.y = Math.sin(t * 1.2) * 0.18;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.4, 1.6, 0.8, 8]} />
        <meshStandardMaterial color="#ECE4D8" roughness={0.4} />
      </mesh>
      <mesh position={[0, 8.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 16, 12]} />
        <meshStandardMaterial color="#FFDF00" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, 16.6, 0]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#FFD700" metalness={0.98} />
      </mesh>
      <mesh ref={flagRef} position={[1.4, 15.2, 0]}>
        <planeGeometry args={[2.8, 1.6]} />
        <meshStandardMaterial color="#A71D3A" roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 5. High-Fidelity Realistic Mysore Palace Architecture
// -------------------------------------------------------------
function RealisticPalaceArchitecture({
  illuminationOn,
  lightIntensity,
}: {
  illuminationOn: boolean;
  lightIntensity: number;
}) {
  const graniteTex = useMemo(() => createGraniteTexture(), []);
  const stainedGlassTex = useMemo(() => createStainedGlassTexture(), []);
  const pavingTex = useMemo(() => createPalaceCourtyardPavingTexture(), []);
  const gandaberundaTex = useMemo(() => createGandaberundaTexture(), []);

  // Precise contour points for the 100,000 bulb illumination
  const bulbPoints = useMemo(() => {
    const points: [number, number, number][] = [];

    // 1. Facade Plinth & Cornices across full 76m
    for (let x = -36; x <= 36; x += 1.0) {
      points.push([x, 1.6, 10.6]);
      points.push([x, 8.2, 10.4]);
      points.push([x, 15.0, 9.4]);
      points.push([x, 18.8, 7.8]);
    }

    // 2. Seven Grand Scalloped Archway Perimeters
    for (let arch = -24; arch <= 24; arch += 8) {
      for (let a = 0; a <= Math.PI; a += 0.22) {
        points.push([arch + Math.cos(a) * 3.5, 4.4 + Math.sin(a) * 3.4, 10.5]);
      }
      for (let y = 1.6; y <= 7.8; y += 0.8) {
        points.push([arch - 3.5, y, 10.5]);
        points.push([arch + 3.5, y, 10.5]);
      }
    }

    // 3. Central Grand 5-Tier Durbar Tower (45m high)
    for (let y = 18.5; y <= 33; y += 0.9) {
      points.push([-6.8, y, 7.4]);
      points.push([6.8, y, 7.4]);
      points.push([-6.8, y, -5.2]);
      points.push([6.8, y, -5.2]);
    }
    [-6.8, 6.8].forEach((x) => {
      for (let z = -5.2; z <= 7.4; z += 1.0) {
        points.push([x, 25.0, z]);
        points.push([x, 31.5, z]);
      }
    });

    // 4. Central Golden Gilded Dome Ribs (12 radiating ribs)
    for (let rib = 0; rib < 12; rib++) {
      const angle = (rib / 12) * Math.PI * 2;
      for (let t = 0; t <= 1; t += 0.16) {
        const phi = t * (Math.PI * 0.58);
        const r = 6.4 * Math.sin(phi);
        const y = 38.5 + 6.4 * Math.cos(phi);
        points.push([Math.cos(angle) * r, y, Math.sin(angle) * r]);
      }
    }

    // 5. Four Corner Bastions & Crimson-Rose Marble Domes
    [
      [-32, 10],
      [32, 10],
      [-32, -10],
      [32, -10],
    ].forEach(([xOffset, zOffset]) => {
      for (let oct = 0; oct < 8; oct++) {
        const ang = (oct / 8) * Math.PI * 2;
        for (let y = 2; y <= 24; y += 1.2) {
          points.push([xOffset + Math.cos(ang) * 5.0, y, zOffset + Math.sin(ang) * 5.0]);
        }
      }
      for (let angle = 0; angle < Math.PI * 2; angle += 0.3) {
        points.push([xOffset + Math.cos(angle) * 5.0, 24.8, zOffset + Math.sin(angle) * 5.0]);
        points.push([xOffset + Math.cos(angle) * 3.8, 28.5, zOffset + Math.sin(angle) * 3.8]);
        points.push([xOffset + Math.cos(angle) * 2.2, 31.8, zOffset + Math.sin(angle) * 2.2]);
      }
    });

    // 6. Balarama Gate (East Gate) Triple Arches & Chhatris
    [-6.0, 0, 6.0].forEach((gateX) => {
      for (let a = 0; a <= Math.PI; a += 0.25) {
        const radius = gateX === 0 ? 3.4 : 2.2;
        const baseY = gateX === 0 ? 5.2 : 4.4;
        points.push([gateX + Math.cos(a) * radius, baseY + Math.sin(a) * radius, 68]);
      }
    });
    for (let x = -13; x <= 13; x += 1.0) {
      points.push([x, 11.2, 68]);
      points.push([x, 14.5, 68]);
    }
    // Chhatris atop Balarama Gate
    [-7, 0, 7].forEach((cx) => {
      for (let a = 0; a < Math.PI * 2; a += 0.35) {
        points.push([cx + Math.cos(a) * 1.8, 17.0, 68 + Math.sin(a) * 1.8]);
      }
    });

    return points;
  }, []);

  const bulbsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize all bulb positions once
  useEffect(() => {
    if (bulbsRef.current) {
      const count = bulbPoints.length;
      for (let i = 0; i < count; i++) {
        const p = bulbPoints[i];
        dummy.position.set(p[0], p[1], p[2]);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        bulbsRef.current.setMatrixAt(i, dummy.matrix);
      }
      bulbsRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [bulbPoints, dummy]);

  return (
    <group>
      {/* ======================================================== */}
      {/* 1. PALACE BASE PODIUM & MAIN THREE-STORY FACADE WINGS   */}
      {/* ======================================================== */}
      {/* Basework Plinth (Dark fine Mysore Granite) */}
      <mesh position={[0, 0.75, 0]} receiveShadow>
        <boxGeometry args={[78, 1.5, 38]} />
        <meshStandardMaterial map={graniteTex} color="#C4B5A5" roughness={0.7} />
      </mesh>

      {/* Main Wings Body (Buff Mysore Granite) */}
      <mesh position={[0, 8.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[70, 14.8, 25]} />
        <meshStandardMaterial map={graniteTex} color="#E8DCD0" roughness={0.55} />
      </mesh>

      {/* Upper Parapet Stone Balustrade with Carved Battlements */}
      <mesh position={[0, 16.5, 10.4]}>
        <boxGeometry args={[68, 1.4, 1.2]} />
        <meshStandardMaterial color="#DDD0BE" roughness={0.45} />
      </mesh>

      {/* Miniature Jali Chhatris along Roofline */}
      {[-20, -12, 12, 20].map((cx, ci) => (
        <group key={`rf-ch-${ci}`} position={[cx, 17.5, 10.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.7, 0.8, 1.4, 8]} />
            <meshStandardMaterial color="#DDD0BE" />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow>
            <sphereGeometry args={[0.85, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. SEVEN GRAND MULTI-FOIL CUSPED ARCADES (CENTRAL FACADE) */}
      {/* ======================================================== */}
      {[-24, -16, -8, 0, 8, 16, 24].map((archX, i) => {
        const isCenter = archX === 0;
        return (
          <group key={`arch-${i}`} position={[archX, 0, 10.4]}>
            {/* Clustered Classical Indo-Saracenic Columns */}
            {[-3.4, 3.4].map((px, pi) => (
              <group key={`col-${pi}`} position={[px, 4.5, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.36, 0.44, 7.6, 16]} />
                  <meshStandardMaterial color="#F2EAE0" metalness={0.1} roughness={0.4} />
                </mesh>
                <mesh position={[0, 3.9, 0]}>
                  <boxGeometry args={[0.9, 0.35, 0.9]} />
                  <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.25} />
                </mesh>
                <mesh position={[0, -3.8, 0]}>
                  <boxGeometry args={[0.95, 0.35, 0.95]} />
                  <meshStandardMaterial color="#B0A090" />
                </mesh>
              </group>
            ))}

            {/* Cusped Arch Keystones & Spandrel */}
            <mesh position={[0, 7.8, 0]}>
              <boxGeometry args={[7.2, 1.2, 0.8]} />
              <meshStandardMaterial color="#D4A017" metalness={0.5} roughness={0.3} />
            </mesh>

            {/* Glowing Stained Glass Rose & Clerestory Window behind Arch */}
            <mesh position={[0, 5.2, -1.2]}>
              <planeGeometry args={[5.6, 6.4]} />
              <meshStandardMaterial
                map={stainedGlassTex}
                emissive={illuminationOn ? '#FFA500' : '#112233'}
                emissiveIntensity={illuminationOn ? 0.7 : 0.08}
                roughness={0.2}
              />
            </mesh>

            {/* Grand Goddess Gajalakshmi & Gandaberunda Sculpture above Central Arch */}
            {isCenter && (
              <group position={[0, 12.0, 0.4]}>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[7.6, 3.6, 0.6]} />
                  <meshStandardMaterial color="#E8DED1" roughness={0.4} />
                </mesh>
                <mesh position={[0, 0.2, 0.35]}>
                  <circleGeometry args={[1.5, 32]} />
                  <meshStandardMaterial
                    map={gandaberundaTex}
                    metalness={0.8}
                    roughness={0.25}
                    emissive={illuminationOn ? '#FFE082' : '#221100'}
                    emissiveIntensity={illuminationOn ? 0.5 : 0.05}
                  />
                </mesh>
                {/* Flanking Gilded Elephants of Goddess Gajalakshmi */}
                {[-2.6, 2.6].map((gx, gi) => (
                  <mesh key={gi} position={[gx, -0.4, 0.4]} rotation={[0, gi === 0 ? 0.4 : -0.4, 0]}>
                    <capsuleGeometry args={[0.4, 0.7, 8, 8]} />
                    <meshStandardMaterial color="#FFDF00" metalness={0.85} roughness={0.2} />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        );
      })}

      {/* ======================================================== */}
      {/* 3. CENTRAL 5-TIER DURBAR TOWER (145 FEET / 45 METERS)    */}
      {/* ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Tier 2: Royal Diwan Gallery */}
        <mesh position={[0, 20.8, 0]} castShadow>
          <boxGeometry args={[16.5, 10.0, 15.5]} />
          <meshStandardMaterial map={graniteTex} color="#E8DCD0" roughness={0.5} />
        </mesh>
        <mesh position={[0, 25.8, 8.0]}>
          <boxGeometry args={[14.5, 1.2, 1.6]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Tier 3: High Durbar Clerestory */}
        <mesh position={[0, 28.8, 0]} castShadow>
          <boxGeometry args={[13.5, 7.8, 12.5]} />
          <meshStandardMaterial color="#DDD0BE" roughness={0.5} />
        </mesh>

        {/* Tier 4: Drum with Arched Niches */}
        <mesh position={[0, 33.6, 0]} castShadow>
          <cylinderGeometry args={[6.4, 7.0, 3.4, 16]} />
          <meshStandardMaterial color="#D4C5B2" roughness={0.4} />
        </mesh>

        {/* Tier 5: The Iconic 24k Radiant Golden Gilded Dome */}
        <mesh position={[0, 38.8, 0]} castShadow>
          <sphereGeometry args={[6.6, 32, 28, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
          <meshStandardMaterial
            color={illuminationOn ? '#FFE259' : '#D4AF37'}
            metalness={0.96}
            roughness={0.12}
            emissive={illuminationOn ? '#FFA500' : '#422400'}
            emissiveIntensity={illuminationOn ? 0.8 * lightIntensity : 0.08}
          />
        </mesh>

        {/* Tall Golden Spire / Kalasha Mast (Pinnacle) */}
        <mesh position={[0, 45.2, 0]}>
          <coneGeometry args={[0.55, 6.2, 16]} />
          <meshStandardMaterial color="#FFF176" metalness={0.98} roughness={0.08} />
        </mesh>
        <mesh position={[0, 48.4, 0]}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={1} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 4. FOUR CORNER BASTIONS & FAMOUS CRIMSON-ROSE MARBLE DOMES */}
      {/* ======================================================== */}
      {[
        [-32, 10],
        [32, 10],
        [-32, -10],
        [32, -10],
      ].map(([bx, bz], idx) => (
        <group key={`bastion-${idx}`} position={[bx, 0, bz]}>
          {/* Octagonal Stone Bastion Body */}
          <mesh position={[0, 12.8, 0]} castShadow>
            <cylinderGeometry args={[5.2, 5.8, 23.5, 8]} />
            <meshStandardMaterial map={graniteTex} color="#E8DCD0" roughness={0.55} />
          </mesh>

          {/* Arched Balcony Trim */}
          <mesh position={[0, 24.2, 0]}>
            <cylinderGeometry args={[5.6, 5.3, 0.8, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Mysore Royal Crimson-Rose Marble Dome */}
          <mesh position={[0, 27.6, 0]} castShadow>
            <sphereGeometry args={[5.3, 28, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            <meshStandardMaterial
              color="#BA133A"
              metalness={0.35}
              roughness={0.2}
              emissive={illuminationOn ? '#FF1744' : '#1A0005'}
              emissiveIntensity={illuminationOn ? 0.4 : 0.02}
            />
          </mesh>

          {/* 24k Golden Kalasha Finial Spire */}
          <mesh position={[0, 33.0, 0]}>
            <coneGeometry args={[0.7, 4.0, 12]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.96} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 5. ROYAL COURTYARD, GEOMETRIC PARTERRES & WATER FOUNTAIN */}
      {/* ======================================================== */}
      {/* Ceremonial Paved Plaza (Sandstone & Terracotta Paving) */}
      <mesh position={[0, -0.05, 36]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[130, 68]} />
        <meshStandardMaterial map={pavingTex} roughness={0.75} />
      </mesh>

      {/* Manicured Royal Parterre Lawns */}
      {[-36, 36].map((lx, li) => (
        <group key={`lawn-${li}`} position={[lx, 0.04, 36]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[36, 52]} />
            <meshStandardMaterial color="#1E4424" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[36.4, 0.15, 0.6]} />
            <meshStandardMaterial color="#FFB300" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Central Royal Multi-Tiered Fountain with Glistening Water Jets */}
      <RoyalPalaceFountain position={[0, 0.1, 34]} />

      {/* Royal Wadiyar Flagpole */}
      <RoyalFlagpole position={[18, 0, 34]} />

      {/* Victorian Cast-Iron Streetlamps along Courtyard Promenades */}
      {[-24, -12, 12, 24].map((lx, li) => (
        <group key={`lamp-${li}`} position={[lx, 0, 22]}>
          <mesh position={[0, 2.6, 0]}>
            <cylinderGeometry args={[0.08, 0.14, 5.2, 8]} />
            <meshStandardMaterial color="#1A1A1A" metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh position={[0, 5.3, 0]}>
            <sphereGeometry args={[0.38, 12, 12]} />
            <meshBasicMaterial color={illuminationOn ? '#FFF59D' : '#777'} />
          </mesh>
          {[-0.5, 0.5].map((gx, gi) => (
            <mesh key={gi} position={[gx, 4.9, 0]}>
              <sphereGeometry args={[0.26, 10, 10]} />
              <meshBasicMaterial color={illuminationOn ? '#FFF59D' : '#777'} />
            </mesh>
          ))}
          {illuminationOn && (
            <pointLight position={[0, 5.3, 0]} intensity={1.4} distance={16} color="#FFD15C" />
          )}
        </group>
      ))}

      {/* ======================================================== */}
      {/* 6. FORTIFIED OUTER STONE PERIMETER WALLS (KOTE)          */}
      {/* ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* North Fort Wall */}
        <mesh position={[-35, 2.4, -18]} castShadow>
          <boxGeometry args={[45, 4.8, 1.5]} />
          <meshStandardMaterial map={graniteTex} color="#857666" roughness={0.8} />
        </mesh>
        <mesh position={[35, 2.4, -18]} castShadow>
          <boxGeometry args={[45, 4.8, 1.5]} />
          <meshStandardMaterial map={graniteTex} color="#857666" roughness={0.8} />
        </mesh>
        {/* West Fort Wall */}
        <mesh position={[-58, 2.4, 28]} castShadow>
          <boxGeometry args={[1.5, 4.8, 92]} />
          <meshStandardMaterial map={graniteTex} color="#857666" roughness={0.8} />
        </mesh>
        {/* East Fort Wall */}
        <mesh position={[58, 2.4, 28]} castShadow>
          <boxGeometry args={[1.5, 4.8, 92]} />
          <meshStandardMaterial map={graniteTex} color="#857666" roughness={0.8} />
        </mesh>
        {/* South Front Fort Walls (flanking Balarama Gate) */}
        <mesh position={[-39, 2.4, 68]} castShadow>
          <boxGeometry args={[36, 4.8, 1.5]} />
          <meshStandardMaterial map={graniteTex} color="#857666" roughness={0.8} />
        </mesh>
        <mesh position={[39, 2.4, 68]} castShadow>
          <boxGeometry args={[36, 4.8, 1.5]} />
          <meshStandardMaterial map={graniteTex} color="#857666" roughness={0.8} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 7. BALARAMA GATE (EAST GATE - MAIN CEREMONIAL ENTRANCE)  */}
      {/* ======================================================== */}
      <group position={[0, 0, 68]}>
        {/* Monumental Stone Gateway Body */}
        <mesh position={[0, 6.8, 0]} castShadow>
          <boxGeometry args={[26, 12.5, 5.0]} />
          <meshStandardMaterial map={graniteTex} color="#D8C8B5" roughness={0.55} />
        </mesh>

        {/* Central Grand Ceremonial Archway */}
        <group position={[0, 4.2, 0]}>
          <mesh>
            <boxGeometry args={[6.2, 8.4, 5.2]} />
            <meshStandardMaterial color="#1A0F00" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[5.8, 8.0, 0.3]} />
            <meshStandardMaterial color="#4A2F1B" roughness={0.6} />
          </mesh>
          {[-2, 0, 2].map((bx, bi) =>
            [-3, -1, 1, 3].map((by, bj) => (
              <mesh key={`boss-${bi}-${bj}`} position={[bx, by, 0.2]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial color="#FFDF00" metalness={0.9} />
              </mesh>
            ))
          )}
        </group>

        {/* Flanking Side Arches */}
        {[-7.2, 7.2].map((ax, ai) => (
          <group key={`side-arch-${ai}`} position={[ax, 3.6, 0]}>
            <mesh>
              <boxGeometry args={[3.8, 7.2, 5.2]} />
              <meshStandardMaterial color="#1A0F00" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[3.4, 6.8, 0.25]} />
              <meshStandardMaterial color="#4A2F1B" roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Upper Sentry Pavilion Gallery with Jali Arches */}
        <mesh position={[0, 13.8, 0]} castShadow>
          <boxGeometry args={[22, 3.2, 4.4]} />
          <meshStandardMaterial color="#E8DED1" roughness={0.45} />
        </mesh>

        {/* Three Crowning Golden Chhatris */}
        <group position={[0, 16.5, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[2.5, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.94} roughness={0.12} />
          </mesh>
          <mesh position={[0, 2.7, 0]}>
            <coneGeometry args={[0.35, 1.8, 10]} />
            <meshStandardMaterial color="#FFF176" metalness={1} />
          </mesh>
        </group>
        {[-8.5, 8.5].map((cx, ci) => (
          <group key={`bg-ch-${ci}`} position={[cx, 15.6, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[1.9, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
              <meshStandardMaterial color="#FFDF00" metalness={0.92} roughness={0.15} />
            </mesh>
            <mesh position={[0, 2.2, 0]}>
              <coneGeometry args={[0.28, 1.4, 8]} />
              <meshStandardMaterial color="#FFF176" metalness={1} />
            </mesh>
          </group>
        ))}

        {/* Royal Gandaberunda Medallion atop Balarama Gate */}
        <mesh position={[0, 14.8, 2.3]}>
          <circleGeometry args={[1.5, 32]} />
          <meshStandardMaterial
            map={gandaberundaTex}
            metalness={0.85}
            roughness={0.2}
            emissive={illuminationOn ? '#FFE082' : '#221100'}
            emissiveIntensity={illuminationOn ? 0.5 : 0.05}
          />
        </mesh>

        {/* Royal Emerald & Gold Signboard */}
        <mesh position={[0, 9.8, 2.6]}>
          <boxGeometry args={[12, 1.1, 0.15]} />
          <meshStandardMaterial color="#0B5B26" roughness={0.3} />
        </mesh>
        <mesh position={[0, 9.8, 2.7]}>
          <boxGeometry args={[11.6, 0.9, 0.05]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Pair of Carved White Marble Royal Elephant Statues Flanking Gate */}
        <ElephantStatue position={[-11.5, 0, 3.2]} rotation={[0, 0.25, 0]} />
        <ElephantStatue position={[11.5, 0, 3.2]} rotation={[0, -0.25, 0]} />

        {/* Karnataka Police Sentries Standing Guard beside Sentries Boxes */}
        <PoliceSentry position={[-14.5, 0, 2.8]} rotation={[0, 0.3, 0]} />
        <PoliceSentry position={[14.5, 0, 2.8]} rotation={[0, -0.3, 0]} />
      </group>

      {/* ======================================================== */}
      {/* 8. JAYARAMA GATE (NORTH GATE) & VARAHA GATE (SOUTH GATE) */}
      {/* ======================================================== */}
      <group position={[-58, 0, 12]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 6.0, 0]} castShadow>
          <boxGeometry args={[16, 11, 4.0]} />
          <meshStandardMaterial map={graniteTex} color="#D8C8B5" />
        </mesh>
        <mesh position={[0, 4.0, 0]}>
          <boxGeometry args={[5.0, 7.5, 4.2]} />
          <meshStandardMaterial color="#1A0F00" />
        </mesh>
        <mesh position={[0, 12.2, 0]}>
          <sphereGeometry args={[2.5, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} />
        </mesh>
      </group>

      <group position={[58, 0, 12]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 6.0, 0]} castShadow>
          <boxGeometry args={[16, 11, 4.0]} />
          <meshStandardMaterial map={graniteTex} color="#D8C8B5" />
        </mesh>
        <mesh position={[0, 4.0, 0]}>
          <boxGeometry args={[5.0, 7.5, 4.2]} />
          <meshStandardMaterial color="#1A0F00" />
        </mesh>
        <mesh position={[0, 12.2, 0]}>
          <sphereGeometry args={[2.5, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 9. CHAMARAJA CIRCLE MONUMENT (LOCATED OUTSIDE GATE AT Z=114) */}
      {/* ======================================================== */}
      <group position={[0, 0, 114]}>
        <mesh position={[0, 0.6, 0]} receiveShadow>
          <cylinderGeometry args={[6.5, 7.2, 1.2, 6]} />
          <meshStandardMaterial color="#ECE4D8" roughness={0.4} />
        </mesh>
        {Array.from({ length: 6 }).map((_, ci) => {
          const ang = (ci / 6) * Math.PI * 2;
          return (
            <mesh key={`cc-col-${ci}`} position={[Math.cos(ang) * 4.4, 5.0, Math.sin(ang) * 4.4]} castShadow>
              <cylinderGeometry args={[0.32, 0.38, 7.6, 12]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
            </mesh>
          );
        })}
        <mesh position={[0, 10.6, 0]} castShadow>
          <sphereGeometry args={[4.8, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
          <meshStandardMaterial color="#FDFBF7" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, 14.8, 0]}>
          <coneGeometry args={[0.42, 2.6, 8]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.96} />
        </mesh>
        <mesh position={[0, 3.4, 0]} castShadow>
          <capsuleGeometry args={[0.65, 2.5, 8, 12]} />
          <meshStandardMaterial color="#5A3A1E" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 10. 100,000 WARM INCANDESCENT SERIAL BULB ILLUMINATION   */}
      {/* ======================================================== */}
      {illuminationOn && (
        <instancedMesh
          ref={bulbsRef}
          args={[undefined, undefined, bulbPoints.length]}
          position={[0, 0, 0]}
        >
          <sphereGeometry args={[0.32, 8, 8]} />
          <meshBasicMaterial color="#FFEB3B" toneMapped={false} />
        </instancedMesh>
      )}

      {/* Architectural Warm Floodlights */}
      {illuminationOn && (
        <>
          <pointLight position={[0, 22, 18]} intensity={lightIntensity * 6.5} distance={80} color="#FFD15C" />
          <pointLight position={[-28, 16, 16]} intensity={lightIntensity * 4.0} distance={55} color="#FFA726" />
          <pointLight position={[28, 16, 16]} intensity={lightIntensity * 4.0} distance={55} color="#FFA726" />
          <pointLight position={[0, 44, 8]} intensity={lightIntensity * 7.5} distance={70} color="#FFE082" />
          <pointLight position={[0, 16, 68]} intensity={lightIntensity * 4.5} distance={50} color="#FFD15C" />
        </>
      )}
    </group>
  );
}

// -------------------------------------------------------------
// 6. High-Altitude Fireworks Particle Show
// -------------------------------------------------------------
function RealisticFireworks({ active }: { active: boolean }) {
  const count = 350;
  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = 50 + Math.random() * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;

      const c = new THREE.Color().setHSL(Math.random(), 0.95, 0.65);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      vel[i * 3] = (Math.random() - 0.5) * 0.4;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return { pos, col, vel };
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (!pointsRef.current || !active) return;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3] += particles.vel[i * 3];
      positions[i * 3 + 1] += particles.vel[i * 3 + 1] - 0.015;
      positions[i * 3 + 2] += particles.vel[i * 3 + 2];

      if (positions[i * 3 + 1] < 30) {
        positions[i * 3] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = 50 + Math.random() * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[particles.col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        vertexColors
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// -------------------------------------------------------------
// 7. Architectural Hotspot Beacon with Glowing Ring
// -------------------------------------------------------------
function ArchitecturalHotspot({
  position,
  label,
  labelKn,
  onClick,
}: {
  position: [number, number, number];
  label: string;
  labelKn?: string;
  onClick: () => void;
}) {
  const pinRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (pinRef.current) {
      pinRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 3) * 0.35;
      pinRef.current.rotation.y = clock.getElapsedTime() * 1.8;
    }
  });

  return (
    <group
      ref={pinRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color={hovered ? '#FFD700' : '#E85D04'}
          emissive={hovered ? '#FFA500' : '#E85D04'}
          emissiveIntensity={hovered ? 1.4 : 0.6}
        />
      </mesh>
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 3.4, 8]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.06, 8, 20]} />
        <meshBasicMaterial color="#FFA500" />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 8. Smooth Camera Controller with Glide Lerping & Free Orbit
// -------------------------------------------------------------
function CameraController({
  position,
  target,
}: {
  position: [number, number, number];
  target: [number, number, number];
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const targetLook = useMemo(() => new THREE.Vector3(...target), [target]);
  const isTransitioningRef = useRef(true);

  // When camera view props change, start a smooth glide
  useEffect(() => {
    isTransitioningRef.current = true;
  }, [position[0], position[1], position[2], target[0], target[1], target[2]]);

  useFrame((_, delta) => {
    if (isTransitioningRef.current) {
      camera.position.lerp(targetPos, Math.min(1, delta * 3.0));
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook, Math.min(1, delta * 3.0));
        controlsRef.current.update();
      }

      // Stop lerping when close so user gets 100% free OrbitControls
      if (
        camera.position.distanceTo(targetPos) < 0.25 &&
        controlsRef.current?.target.distanceTo(targetLook) < 0.25
      ) {
        camera.position.copy(targetPos);
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetLook);
          controlsRef.current.update();
        }
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      onStart={() => {
        // User started dragging with mouse: stop auto-transition immediately
        isTransitioningRef.current = false;
      }}
      target={target}
      maxPolarAngle={Math.PI / 2 - 0.04}
      minDistance={8}
      maxDistance={155}
      enableDamping
      dampingFactor={0.06}
    />
  );
}

// -------------------------------------------------------------
// 9. Main Palace 3D Scene Component
// -------------------------------------------------------------
export default function PalaceScene({
  lightingMode = 'night',
  illuminationOn = true,
  lightIntensity = 1.2,
  quality = 'high',
  cameraView = 'overview',
  onSelectHotspot,
}: PalaceSceneProps) {
  const [fireworks, setFireworks] = useState(lightingMode === 'night');
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  // Unobstructed camera configurations with optimal framing
  const cameraConfig = useMemo(() => {
    switch (cameraView) {
      case 'gates':
        // Angled 3/4 view of Balarama Gate with elephant statues and sentries in view, palace behind
        return {
          position: [-20, 10, 84] as [number, number, number],
          target: [0, 7, 68] as [number, number, number],
        };
      case 'durbar':
        // Close-up looking up at Durbar Hall, Gajalakshmi pediment and Glistening Golden Dome
        return {
          position: [0, 18, 28] as [number, number, number],
          target: [0, 24, 0] as [number, number, number],
        };
      case 'courtyard':
        // Eye-level view next to the fountain and lampposts looking up at the illuminated facade
        return {
          position: [0, 4.5, 46] as [number, number, number],
          target: [0, 12, 0] as [number, number, number],
        };
      case 'aerial':
        // Panoramic high bird's eye view over the entire fortified complex
        return {
          position: [0, 78, 100] as [number, number, number],
          target: [0, 14, 15] as [number, number, number],
        };
      case 'overview':
      default:
        // Grand Facade view: Full 76m wide facade, rose domes, gold dome & courtyard fountain
        return {
          position: [0, 20, 62] as [number, number, number],
          target: [0, 16, 0] as [number, number, number],
        };
    }
  }, [cameraView]);

  const env = useMemo(() => {
    switch (lightingMode) {
      case 'day':
        return {
          bg: '#7ec0ee',
          ambient: '#FFFFFF',
          ambientIntensity: 1.15,
          sunColor: '#FFFDF0',
          sunIntensity: 1.85,
          sunPos: [35, 50, 30] as [number, number, number],
          fogColor: '#A8D5F2',
        };
      case 'evening':
        return {
          bg: '#2e1236',
          ambient: '#FFA770',
          ambientIntensity: 0.98,
          sunColor: '#FF6F3C',
          sunIntensity: 1.65,
          sunPos: [-45, 22, 35] as [number, number, number],
          fogColor: '#3a1845',
        };
      case 'night':
      default:
        return {
          bg: '#081026',
          ambient: illuminationOn ? '#FFE8C2' : '#1A237E',
          ambientIntensity: illuminationOn ? 1.2 : 0.35,
          sunColor: illuminationOn ? '#FFA726' : '#90CAF9',
          sunIntensity: illuminationOn ? 1.5 : 0.45,
          sunPos: [20, 45, 30] as [number, number, number],
          fogColor: '#0C1838',
        };
    }
  }, [lightingMode, illuminationOn]);

  const hotspots = [
    {
      id: 'balarama',
      pos: [0, 10, 68] as [number, number, number],
      label: 'Balarama Gate (East Entrance)',
      labelKn: 'ಬಲರಾಮ ದ್ವಾರ (ಪೂರ್ವ ದ್ವಾರ - ಜಂಬೂ ಸವಾರಿ ಆರಂಭ)',
      desc: 'The ceremonial triumphal gateway flanked by carved white marble elephants and royal sentries where the Vijayadashami procession commences.',
    },
    {
      id: 'durbar',
      pos: [0, 18, 11] as [number, number, number],
      label: 'Amba Vilas Durbar Hall & Golden Dome',
      labelKn: 'ಅಂಬಾವಿಲಾಸ ದರ್ಬಾರ್ ಮಂಟಪ ಮತ್ತು ಚಿನ್ನದ ಗೋಪುರ',
      desc: 'The grand royal court hall with 145-foot central tower crowned by the pure 24-carat gold gilded dome and Gajalakshmi pediment.',
    },
    {
      id: 'fountain',
      pos: [0, 3, 34] as [number, number, number],
      label: 'Royal Courtyard & Fountain',
      labelKn: 'ಅರಮನೆ ರಾಜ ಕಾರಂಜಿ ಮತ್ತು ಪ್ರಾಂಗಣ',
      desc: 'Vast ceremonial sandstone courtyard with multi-tiered water fountain and Victorian cast-iron lampposts.',
    },
    {
      id: 'jayarama',
      pos: [-58, 8, 12] as [number, number, number],
      label: 'Jayarama Gate (North Entrance)',
      labelKn: 'ಜಯರಾಮ ದ್ವಾರ (ಉತ್ತರ ದ್ವಾರ)',
      desc: 'Northern fortified entrance connecting the palace grounds to the heart of Mysuru city.',
    },
    {
      id: 'varaha',
      pos: [58, 8, 12] as [number, number, number],
      label: 'Varaha Gate (South Entrance)',
      labelKn: 'ವರಾಹ ದ್ವಾರ (ದಕ್ಷಿಣ ದ್ವಾರ)',
      desc: 'Southern entrance leading towards Sri Chamundeshwari hill road.',
    },
  ];

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <Canvas shadows={quality !== 'low'}>
        <PerspectiveCamera makeDefault position={cameraConfig.position} fov={48} />
        <CameraController position={cameraConfig.position} target={cameraConfig.target} />

        <color attach="background" args={[env.bg]} />
        <fog attach="fog" args={[env.fogColor, 50, 195]} />

        <ambientLight color={env.ambient} intensity={env.ambientIntensity} />
        <directionalLight
          position={env.sunPos}
          intensity={env.sunIntensity}
          color={env.sunColor}
          castShadow={quality !== 'low'}
          shadow-mapSize={[2048, 2048]}
        />

        {/* Realistic Architectural Palace Model with Gates, Sculptures & Sentries */}
        <RealisticPalaceArchitecture
          illuminationOn={illuminationOn}
          lightIntensity={lightIntensity}
        />

        {/* Night Fireworks */}
        <RealisticFireworks active={fireworks && lightingMode === 'night'} />

        {/* Interactive Hotspot Beacons for All Key Landmarks */}
        {hotspots.map((hs) => (
          <ArchitecturalHotspot
            key={hs.id}
            position={hs.pos}
            label={hs.label}
            labelKn={hs.labelKn}
            onClick={() => {
              audioManager.playRoyalFanfare();
              setActiveInfo(hs.label + ' • ' + hs.desc);
              if (onSelectHotspot) onSelectHotspot(hs.id);
            }}
          />
        ))}
      </Canvas>

      {/* Fireworks Control Button */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => {
            const next = !fireworks;
            setFireworks(next);
            if (next) audioManager.playFireworkSound();
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all ${
            fireworks
              ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-gold-glow'
              : 'bg-black/60 border-white/20 text-white/70 hover:bg-black/80'
          }`}
        >
          🎆 {fireworks ? 'Fireworks Active' : 'Launch Fireworks'}
        </button>
      </div>

      {/* Hotspot Info Popup when clicked */}
      {activeInfo && (
        <div className="absolute top-4 left-4 max-w-sm z-10">
          <div className="glass-dark p-3.5 rounded-xl border border-amber-400/40 shadow-royal">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-amber-300">🏛️ Location Selected</span>
              <button
                onClick={() => setActiveInfo(null)}
                className="text-white/40 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-cream mt-1 leading-relaxed">{activeInfo}</p>
          </div>
        </div>
      )}

      {/* Bottom Status Banner */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
        <p className="text-[11px] text-amber-200/90 bg-black/75 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-amber-400/30">
          🏛️ Mysore Amba Vilas Palace • Balarama Gate with Marble Elephants & Guards • 100,000 Golden Serial Bulbs
        </p>
      </div>
    </div>
  );
}
