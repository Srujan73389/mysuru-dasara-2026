import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export type GMSGesture = 'idle' | 'namaskara' | 'pointing' | 'talking' | 'waving';
export type KiranGesture = GMSGesture;

interface GMSGuideProps {
  gesture?: GMSGesture;
  speaking?: boolean;
}

// -------------------------------------------------------------
// Floating Golden Royal Dust / Sparkles
// -------------------------------------------------------------
function RoyalSparkles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 40;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3.5;
      pos[i * 3 + 1] = Math.random() * 3.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.0;
    }
    return [pos];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const time = clock.getElapsedTime() * 0.25;
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += Math.sin(time + i) * 0.002;
        if (pos[i * 3 + 1] > 3.0) pos[i * 3 + 1] = 0.0;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#FFDF00"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// -------------------------------------------------------------
// Ornate Mysore Palace Durbar Background Arch
// -------------------------------------------------------------
function PalaceDurbarBackdrop() {
  return (
    <group position={[0, 0, -1.6]}>
      {/* Deep Royal Wall */}
      <mesh position={[0, 1.2, -0.2]}>
        <planeGeometry args={[6.5, 4.5]} />
        <meshStandardMaterial color="#190628" roughness={0.9} />
      </mesh>

      {/* Golden Glowing Durbar Arch Rib */}
      <mesh position={[0, 2.1, 0]}>
        <torusGeometry args={[1.4, 0.06, 12, 32, Math.PI]} />
        <meshStandardMaterial color="#E5B80B" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Decorative Golden Pillars */}
      {[-1.35, 1.35].map((px, i) => (
        <group key={`pillar-${i}`} position={[px, 0.9, 0]}>
          <mesh position={[0, -0.9, 0]}>
            <boxGeometry args={[0.3, 0.2, 0.3]} />
            <meshStandardMaterial color="#5E0F21" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 2.0, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[0, 1.15, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.22, 0.22, 16]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// Refined Human-like GMS Guide Rig with Natural Posture & Head Tracking
// -------------------------------------------------------------
function GMSRig({
  gesture = 'idle',
  speaking = false,
}: {
  gesture: GMSGesture;
  speaking: boolean;
}) {
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    const time = clock.getElapsedTime();

    // 1. Natural Breathing sway
    if (bodyRef.current) {
      bodyRef.current.position.y = 1.35 + Math.sin(time * 2.2) * 0.015;
    }

    // 2. Interactive Head Tracking: GMS gently looks towards the user's mouse cursor!
    if (headRef.current) {
      const targetLookX = (pointer.x * 0.35);
      const targetLookY = (pointer.y * 0.25);

      if (speaking) {
        // Natural talking head movements layered over mouse-tracking
        headRef.current.rotation.x = THREE.MathUtils.lerp(
          headRef.current.rotation.x,
          targetLookY + Math.sin(time * 5.5) * 0.04,
          0.1
        );
        headRef.current.rotation.y = THREE.MathUtils.lerp(
          headRef.current.rotation.y,
          targetLookX + Math.cos(time * 3.8) * 0.05,
          0.1
        );
        if (mouthRef.current) {
          mouthRef.current.scale.y = 1 + Math.sin(time * 12) * 0.75;
          mouthRef.current.scale.x = 1 + Math.cos(time * 8) * 0.2;
        }
      } else {
        headRef.current.rotation.x = THREE.MathUtils.lerp(
          headRef.current.rotation.x,
          targetLookY + Math.sin(time * 1.5) * 0.015,
          0.08
        );
        headRef.current.rotation.y = THREE.MathUtils.lerp(
          headRef.current.rotation.y,
          targetLookX,
          0.08
        );
        if (mouthRef.current) {
          mouthRef.current.scale.y = 1;
          mouthRef.current.scale.x = 1;
        }
      }
    }

    // 3. Natural Organic Arm Poses
    if (leftArmRef.current && rightArmRef.current) {
      switch (gesture) {
        case 'namaskara':
          // Hands gently folded together in front of heart in traditional Mysore court greeting
          leftArmRef.current.rotation.set(1.15, 0.45, -0.65);
          rightArmRef.current.rotation.set(1.15, -0.45, 0.65);
          break;
        case 'waving':
          // Left hand relaxed near hip, right hand warmly waving near shoulder
          leftArmRef.current.rotation.set(0.2, 0.1, -0.1);
          rightArmRef.current.rotation.set(1.9, 0, Math.sin(time * 6) * 0.25 + 0.35);
          break;
        case 'pointing':
          // Right arm gracefully gesturing forward/right towards landmark
          leftArmRef.current.rotation.set(0.2, 0.1, -0.1);
          rightArmRef.current.rotation.set(1.2, 0.6, -0.2);
          break;
        case 'talking':
          // Subtle, dignified orator conversational hand gestures
          leftArmRef.current.rotation.set(0.65 + Math.sin(time * 3) * 0.1, 0.3, -0.2);
          rightArmRef.current.rotation.set(0.75 + Math.cos(time * 2.8) * 0.15, -0.3, 0.25);
          break;
        case 'idle':
        default:
          // Dignified royal posture: arms resting gently curved by side/waist
          leftArmRef.current.rotation.set(0.25 + Math.sin(time * 2) * 0.02, 0.1, -0.12);
          rightArmRef.current.rotation.set(0.25 + Math.sin(time * 2) * 0.02, -0.1, 0.12);
          break;
      }
    }
  });

  return (
    <group position={[0, -0.9, 0]}>
      {/* Lower Torso / Silk Panche (Dhoti) Base */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.38, 0.46, 1.1, 24]} />
        <meshStandardMaterial color="#FDFBF7" roughness={0.7} />
      </mesh>
      {/* Gold Border trim along Panche */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.465, 0.465, 0.08, 24]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Main Upper Torso / Royal Silk Sherwani */}
      <group ref={bodyRef} position={[0, 1.35, 0]}>
        {/* Curved Organic Chest */}
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.34, 0.95, 24]} />
          <meshStandardMaterial color="#FAF5EB" roughness={0.55} />
        </mesh>

        {/* Rounded Shoulders */}
        <mesh position={[-0.34, 0.38, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#FAF5EB" roughness={0.55} />
        </mesh>
        <mesh position={[0.34, 0.38, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#FAF5EB" roughness={0.55} />
        </mesh>

        {/* Mandarin Royal Collar */}
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.12, 20]} />
          <meshStandardMaterial color="#E8DEC8" roughness={0.5} />
        </mesh>

        {/* Golden Buttons down center placket */}
        {[-0.2, -0.05, 0.1, 0.25, 0.4].map((by, i) => (
          <mesh key={`btn-${i}`} position={[0, by, 0.36]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.9} roughness={0.15} />
          </mesh>
        ))}

        {/* Embroidered Royal Maroon & Gold Angavastram (Shawl draped over left shoulder) */}
        <mesh position={[-0.14, 0.02, 0.04]} rotation={[0, 0, -0.22]}>
          <boxGeometry args={[0.22, 1.05, 0.42]} />
          <meshStandardMaterial color="#6B0E1E" roughness={0.4} />
        </mesh>
        {/* Shawl Gold Zari Trim */}
        <mesh position={[-0.14, -0.48, 0.04]} rotation={[0, 0, -0.22]}>
          <boxGeometry args={[0.23, 0.06, 0.43]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.88} roughness={0.2} />
        </mesh>

        {/* Official Tour Guide Gold Badge */}
        <group position={[0.22, 0.24, 0.34]}>
          <mesh>
            <boxGeometry args={[0.15, 0.18, 0.02]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[0.12, 0.14, 0.01]} />
            <meshStandardMaterial color="#1B0A2A" />
          </mesh>
          <mesh position={[0, 0.02, 0.02]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#FFDF00" metalness={1} />
          </mesh>
        </group>

        {/* Natural Curved Arms */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.38, 0.32, 0]}>
          {/* Upper Arm */}
          <mesh position={[0, -0.26, 0]}>
            <cylinderGeometry args={[0.1, 0.085, 0.52, 16]} />
            <meshStandardMaterial color="#FAF5EB" roughness={0.55} />
          </mesh>
          {/* Forearm & Hand */}
          <mesh position={[0, -0.62, 0.04]}>
            <cylinderGeometry args={[0.08, 0.07, 0.38, 16]} />
            <meshStandardMaterial color="#C68642" roughness={0.65} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.38, 0.32, 0]}>
          {/* Upper Arm */}
          <mesh position={[0, -0.26, 0]}>
            <cylinderGeometry args={[0.1, 0.085, 0.52, 16]} />
            <meshStandardMaterial color="#FAF5EB" roughness={0.55} />
          </mesh>
          {/* Forearm & Hand */}
          <mesh position={[0, -0.62, 0.04]}>
            <cylinderGeometry args={[0.08, 0.07, 0.38, 16]} />
            <meshStandardMaterial color="#C68642" roughness={0.65} />
          </mesh>
        </group>
      </group>

      {/* Head, Face & The Royal Mysore Peta (Turban) */}
      <group ref={headRef} position={[0, 2.05, 0]}>
        {/* Head Sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color="#C68642" roughness={0.6} />
        </mesh>

        {/* Expressive Warm Eyes with Eyelids */}
        {[-0.08, 0.08].map((ex, i) => (
          <group key={`eye-${i}`} position={[ex, 0.04, 0.23]}>
            {/* White */}
            <mesh>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            {/* Warm dark brown iris */}
            <mesh position={[0, 0, 0.02]}>
              <sphereGeometry args={[0.02, 10, 10]} />
              <meshBasicMaterial color="#1E140C" />
            </mesh>
            {/* Eye highlight */}
            <mesh position={[0.008, 0.008, 0.03]}>
              <sphereGeometry args={[0.006, 6, 6]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>
        ))}

        {/* Gold-Rimmed Mysore Scholar Spectacles */}
        <group position={[0, 0.04, 0.24]}>
          {[-0.08, 0.08].map((lx, idx) => (
            <mesh key={`lens-${idx}`} position={[lx, 0, 0]}>
              <torusGeometry args={[0.042, 0.005, 8, 16]} />
              <meshStandardMaterial color="#FFDF00" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
          {/* Bridge */}
          <mesh position={[0, 0.015, 0]}>
            <boxGeometry args={[0.04, 0.005, 0.005]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Dignified Traditional Mustache */}
        <mesh position={[0, -0.04, 0.245]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.13, 0.03, 0.02]} />
          <meshStandardMaterial color="#2B1A0E" roughness={0.8} />
        </mesh>

        {/* Traditional Vermilion Kumkum Tilaka */}
        <mesh position={[0, 0.12, 0.25]}>
          <cylinderGeometry args={[0.015, 0.015, 0.05, 8]} />
          <meshBasicMaterial color="#9E0000" />
        </mesh>

        {/* Warm Smiling Mouth with dynamic speech animation */}
        <mesh ref={mouthRef} position={[0, -0.09, 0.23]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.048, 0.012, 8, 12, Math.PI]} />
          <meshBasicMaterial color="#5E1818" />
        </mesh>

        {/* AUTHENTIC ROYAL MYSURU PETA (TURBAN) */}
        <group position={[0, 0.18, 0]}>
          {/* Peta Main Body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.31, 0.28, 0.32, 24]} />
            <meshStandardMaterial color="#5E0F21" roughness={0.45} />
          </mesh>
          {/* Turban Royal Slanted Crown */}
          <mesh position={[0, 0.16, 0]} rotation={[0.12, 0, -0.08]}>
            <sphereGeometry args={[0.28, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#5E0F21" roughness={0.45} />
          </mesh>
          {/* Broad Golden Zari Ribbon (Ganda Patti) wrapped around Peta */}
          <mesh position={[0, 0.01, 0]}>
            <torusGeometry args={[0.315, 0.045, 10, 24]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.92} roughness={0.15} />
          </mesh>
          {/* Golden Royal Kalgi (Plume Crest) on front of Peta */}
          <group position={[0, 0.18, 0.28]} rotation={[-0.28, 0, 0]}>
            <mesh>
              <coneGeometry args={[0.05, 0.25, 12]} />
              <meshStandardMaterial color="#FFD700" metalness={0.98} roughness={0.1} />
            </mesh>
            {/* Jewel emerald centerpiece */}
            <mesh position={[0, -0.04, 0.025]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#008037" roughness={0.2} metalness={0.7} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

export default function GMSGuide({ gesture = 'namaskara', speaking = false }: GMSGuideProps) {
  return (
    <div className="w-full h-full min-h-[380px] flex items-center justify-center relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#140523] via-[#1d0a2f] to-[#0c0316]">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1.1, 2.7]} fov={36} />
        <OrbitControls
          target={[0, 1.0, 0]}
          enableZoom={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.3}
          maxAzimuthAngle={Math.PI / 5}
          minAzimuthAngle={-Math.PI / 5}
          enablePan={false}
        />
        <ambientLight intensity={1.15} color="#FFF8EB" />
        <directionalLight position={[3, 5, 4]} intensity={1.4} color="#FFE699" />
        <directionalLight position={[-3, 4, 3]} intensity={0.95} color="#FFD700" />
        <pointLight position={[0, 2.2, 1.5]} intensity={1.3} color="#FFF8E7" />
        <pointLight position={[0, 0.5, 1.8]} intensity={0.7} color="#FF9933" />

        {/* Background Durbar Arch & Royal Sparkles */}
        <PalaceDurbarBackdrop />
        <RoyalSparkles />

        {/* Dignified Human GMS Character */}
        <GMSRig gesture={gesture} speaking={speaking} />
      </Canvas>
    </div>
  );
}

// Backward compatibility alias
export { GMSGuide as KiranGuide };
