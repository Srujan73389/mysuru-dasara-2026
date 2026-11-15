import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { audioManager } from '@/audio/audioManager';
import {
  createGraniteTexture,
  createCobblestoneTexture,
} from '@/utils/textureGenerator';

export interface CityLandmark {
  id: string;
  name: string;
  nameKn: string;
  category: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  lookAt: [number, number, number];
  description: string;
  descriptionKn: string;
  highlight: string;
  highlightKn: string;
}

export const CITY_LANDMARKS: CityLandmark[] = [
  {
    id: 'palace',
    name: 'Mysore Palace (Amba Vilas)',
    nameKn: 'ಮೈಸೂರು ಅರಮನೆ (ಅಂಬಾವಿಲಾಸ)',
    category: 'Royal Palace',
    position: [0, 0, 0],
    cameraTarget: [0, 26, 44],
    lookAt: [0, 8, 4],
    description:
      'The majestic seat of the Wadiyar dynasty, fortified with Balarama & Jayarama grand gates, 145-foot Durbar tower, and 100,000 golden incandescent serial illuminations.',
    descriptionKn:
      'ಒಡೆಯರ್ ರಾಜಮನೆತನದ ಭವ್ಯ ಅರಮನೆ, ಬಲರಾಮ ಮತ್ತು ಜಯರಾಮ ದ್ವಾರಗಳು, ಮತ್ತು ಲಕ್ಷ ದೀಪಗಳ ದೀಪಾಲಂಕಾರದ ವೈಭವ.',
    highlight: 'Balarama Gate & 100,000 Golden Bulbs',
    highlightKn: 'ಬಲರಾಮ ದ್ವಾರ ಮತ್ತು ಲಕ್ಷ ದೀಪಾಲಂಕಾರ',
  },
  {
    id: 'chamundi',
    name: 'Chamundi Hills & Sri Chamundeshwari Temple',
    nameKn: 'ಚಾಮುಂಡಿ ಬೆಟ್ಟ ಮತ್ತು ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ದೇವಾಲಯ',
    category: 'Sacred Summit',
    position: [42, 16, -34],
    cameraTarget: [34, 22, -18],
    lookAt: [42, 19, -34],
    description:
      '1,062-metre sacred peak guarding Mysuru. Features the 7-tier Dravidian Gopuram with 7 golden Kalashas, the iconic Mahishasura statue, and the 1659 monolithic Nandi bull.',
    descriptionKn:
      'ಮೈಸೂರಿನ ಕಾವಲು ದೇವತೆ ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ಸನ್ನಿಧಿ, ೭ ಚಿನ್ನದ ಕಲಶಗಳ ಗೋಪುರ, ಮಹಿಷಾಸುರ ಮೂರ್ತಿ ಮತ್ತು ಬೃಹತ್ ನಂದಿ.',
    highlight: '7-Tier Gopuram & 1659 Monolithic Nandi',
    highlightKn: 'ಏಳು ಹಂತಗಳ ಗೋಪುರ ಮತ್ತು ೧೬೫೯ರ ಏಕಶಿಲಾ ನಂದಿ',
  },
  {
    id: 'bannimantap',
    name: 'Bannimantap Parade Grounds',
    nameKn: 'ಬನ್ನಿಮಂಟಪ ಪಂಜಿನ ಕವಾಯತು ಮೈದಾನ',
    category: 'Grand Arena',
    position: [-28, 0, -36],
    cameraTarget: [-28, 10, -20],
    lookAt: [-28, 3, -36],
    description:
      'The sacred terminal grounds of the 5-km Vijayadashami Jamboo Savari procession. Hosts the equestrian Torchlight Parade, laser spectacles, and 1,000 sky drone formations.',
    descriptionKn:
      'ಜಂಬೂ ಸವಾರಿಯ ಸಮಾರೋಪ ತಾಣ, ವಿಶ್ವವಿಖ್ಯಾತ ಪಂಜಿನ ಕವಾಯತು ಮತ್ತು ೧,೦೦೦ ಡ್ರೋನ್ ಶೋ ರಂಗ.',
    highlight: 'Torchlight Parade & 1,000 Drone Symphony',
    highlightKn: 'ಪಂಜಿನ ಕವಾಯತು ಮತ್ತು ಡ್ರೋನ್ ಶೋ',
  },
  {
    id: 'exhibition',
    name: 'Dasara Exhibition Grounds (Doddakere Maidan)',
    nameKn: 'ದಸರಾ ವಸ್ತುಪ್ರದರ್ಶನ ಮತ್ತು ಆಹಾರ ಮೇಳ',
    category: 'Cultural Fair',
    position: [24, 0, 16],
    cameraTarget: [18, 9, 30],
    lookAt: [24, 4, 16],
    description:
      'Vibrant festival hub directly facing the Palace. Features government pavilions, giant illuminated ferris wheel, commercial handicrafts, and authentic Mysuru Aahara Mela.',
    descriptionKn:
      'ಮೈಸೂರು ಪಾಕ್, ಮೈಲಾರಿ ದೋಸೆಗಳ ಆಹಾರ ಮೇಳ ಮತ್ತು ಕರ್ನಾಟಕ ಸಾಂಸ್ಕೃತಿಕ ಮಳಿಗೆಗಳ ಸಂತೆ.',
    highlight: 'Aahara Mela & 100+ Heritage Stalls',
    highlightKn: 'ಆಹಾರ ಮೇಳ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಮಳಿಗೆಗಳು',
  },
  {
    id: 'kuppanna',
    name: 'Kuppanna Park (Nishad Bagh Flower Show)',
    nameKn: 'ಕುಪ್ಪಣ್ಣ ಪಾರ್ಕ್ (ಫಲಪುಷ್ಪ ಪ್ರದರ್ಶನ)',
    category: 'Botanical Heritage',
    position: [20, 0, -12],
    cameraTarget: [10, 14, 8],
    lookAt: [20, 3, -12],
    description:
      'Mysuru’s historic Nishad Bagh featuring the grand Glass House, illuminated royal floral replicas of palaces and elephants made of 500,000 fresh blooms.',
    descriptionKn:
      'ಐತಿಹಾಸಿಕ ಗಾಜಿನ ಮನೆ, ಲಕ್ಷಾಂತರ ನೈಸರ್ಗಿಕ ಹೂವುಗಳಿಂದ ನಿರ್ಮಿಸಿದ ಅರಮನೆ ಕಲಾಕೃತಿಗಳು.',
    highlight: 'Glass House Floral Sculptures',
    highlightKn: 'ಗಾಜಿನ ಮನೆ ಮತ್ತು ಪುಷ್ಪ ಕಲಾಕೃತಿಗಳು',
  },
  {
    id: 'brindavan',
    name: 'Brindavan Gardens (KRS Dam)',
    nameKn: 'ಬೃಂದಾವನ ಉದ್ಯಾನವನ (ಕೆ.ಆರ್.ಎಸ್)',
    category: 'Mughal Gardens',
    position: [-44, 0, 20],
    cameraTarget: [-22, 18, 42],
    lookAt: [-44, 4, 20],
    description:
      'World-famous terraced gardens laid out below the Krishnarajasagara Dam by Sir M. Visvesvaraya, with illuminated dancing musical fountains and boating lagoon.',
    descriptionKn:
      'ಸರ್ ಎಂ. ವಿಶ್ವೇಶ್ವರಯ್ಯ ವಿನ್ಯಾಸಗೊಳಿಸಿದ ವಿಶ್ವವಿಖ್ಯಾತ ಮೆಟ್ಟಿಲು ಉದ್ಯಾನ ಮತ್ತು ಸಂಗೀತ ಕಾರಂಜಿ.',
    highlight: 'Synchronized Musical Fountains',
    highlightKn: 'ವರ್ಣರಂಜಿತ ಸಂಗೀತ ಕಾರಂಜಿ',
  },
  {
    id: 'townhall',
    name: 'Mysore Town Hall & Clock Tower',
    nameKn: 'ಟೌನ್ ಹಾಲ್ ಮತ್ತು ಗಡಿಯಾರ ಗೋಪುರ',
    category: 'Civic Heritage',
    position: [-12, 0, 16],
    cameraTarget: [-12, 14, 40],
    lookAt: [-12, 4, 16],
    description:
      'Rangacharlu Memorial Town Hall built in 1884 with Corinthian columns and the adjacent historic Dufferin Clock Tower on Ashoka Road.',
    descriptionKn:
      '೧೮೮೪ರ ರಂಗಾಚಾರ್ಲು ಸ್ಮಾರಕ ಭವ್ಯ ಗ್ರೀಕ್-ರೋಮನ್ ಸ್ತಂಭಗಳ ಟೌನ್ ಹಾಲ್ ಮತ್ತು ಕ್ಲಾಕ್ ಟವರ್.',
    highlight: '1884 Corinthian Monument & Clock Tower',
    highlightKn: '೧೮೮೪ರ ಐತಿಹಾಸಿಕ ಕಟ್ಟಡ',
  },
  {
    id: 'jaganmohan',
    name: 'Jaganmohan Palace & Art Gallery',
    nameKn: 'ಜಗನ್ಮೋಹನ ಅರಮನೆ (ಚಿತ್ರಕಲಾ ಗ್ಯಾಲರಿ)',
    category: 'Royal Gallery',
    position: [-16, 0, -4],
    cameraTarget: [-16, 14, 20],
    lookAt: [-16, 4, -4],
    description:
      'Royal pavilion built in 1861 housing legendary paintings by Raja Ravi Varma, including "Lady with the Lamp", and royal musical instruments.',
    descriptionKn:
      'ರಾಜಾ ರವಿವರ್ಮ ಅವರ ಅಮರ ತೈಲಚಿತ್ರಗಳು ಮತ್ತು ಒಡೆಯರ್ ಸಂಗೀತ ವಾದ್ಯಗಳ ಕಲಾ ಭಂಡಾರ.',
    highlight: 'Raja Ravi Varma Art Collection',
    highlightKn: 'ರಾಜಾ ರವಿವರ್ಮ ಮೂಲ ವರ್ಣಚಿತ್ರಗಳು',
  },
];

// 1. REUSABLE NATURAL MYSORE TREE (Rich layered green canopy with wooden trunk)
function MysoreShadeTree({
  position,
  scale = 1.0,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Bark Trunk */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.35, 2.8, 8]} />
        <meshStandardMaterial color="#4A3728" roughness={0.9} />
      </mesh>
      {/* Foliage Main Canopy */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <sphereGeometry args={[1.5, 10, 8]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.8} />
      </mesh>
      <mesh position={[0.4, 3.8, 0.3]} castShadow>
        <sphereGeometry args={[1.1, 8, 8]} />
        <meshStandardMaterial color="#388E3C" roughness={0.75} />
      </mesh>
      <mesh position={[-0.4, 3.5, -0.3]} castShadow>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#1B5E20" roughness={0.85} />
      </mesh>
    </group>
  );
}

// 2. ROYAL VICTORIAN STREETLAMP POLE (Glowing golden globe)
function VictorianStreetlamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cast Iron Post */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.07, 0.12, 3.6, 8]} />
        <meshStandardMaterial color="#1C1F22" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Cross Arm */}
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#1C1F22" metalness={0.85} />
      </mesh>
      {/* Left Golden Globe */}
      <mesh position={[-0.55, 3.65, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial
          color="#FFF9C4"
          emissive="#FFE082"
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </mesh>
      {/* Right Golden Globe */}
      <mesh position={[0.55, 3.65, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial
          color="#FFF9C4"
          emissive="#FFE082"
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// 3. HIGH-TECH 3D MYSORE PALACE COMPLEX (Amba Vilas)
function PalaceComplex3D({ isIlluminated }: { isIlluminated: boolean }) {
  const graniteTex = useMemo(() => createGraniteTexture(), []);

  return (
    <group position={[0, 0, 0]}>
      {/* Enormous Paved Sandstone Forecourt (90m x 80m - ZERO Black Voids!) */}
      <mesh position={[0, 0.02, 14]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 80]} />
        <meshStandardMaterial color="#C8BAA7" roughness={0.65} />
      </mesh>

      {/* Decorative Garden Lawns flanking the forecourt */}
      {[-28, 28].map((lx, li) => (
        <group key={`plawn-${li}`} position={[lx, 0.04, 14]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 60]} />
            <meshStandardMaterial color="#2E6B27" roughness={0.8} />
          </mesh>
          {/* Flower Parterre Rings */}
          {[-15, 0, 15].map((fz, fi) => (
            <mesh key={`f-ring-${li}-${fi}`} position={[0, 0.08, fz]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.5, 4.5, 20]} />
              <meshStandardMaterial color={fi === 1 ? '#E91E63' : '#FF9800'} roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Royal Visitors & Dasara Crowds in Courtyard */}
      {[
        [-10, 10], [10, 12], [-16, 16], [16, 18], [-4, 14], [4, 15],
        [-8, 22], [8, 24], [-14, 28], [14, 30], [0, 20], [0, 28],
      ].map(([vx, vz], vi) => (
        <group key={`vis-${vi}`} position={[vx, 0.05, vz]}>
          <mesh position={[0, 0.85, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.28, 1.7, 8]} />
            <meshStandardMaterial
              color={
                vi % 4 === 0
                  ? '#D84315'
                  : vi % 4 === 1
                  ? '#FDD835'
                  : vi % 4 === 2
                  ? '#1B5E20'
                  : '#FFFFFF'
              }
            />
          </mesh>
          {/* Head & Mysore Turban (Peta) */}
          <mesh position={[0, 1.85, 0]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>
          <mesh position={[0, 2.02, 0]}>
            <cylinderGeometry args={[0.22, 0.2, 0.16, 10]} />
            <meshStandardMaterial color="#B71C1C" />
          </mesh>
        </group>
      ))}

      {/* Chamaraja Circle Central Statue Pavilion */}
      <group position={[0, 0.05, 24]}>
        <mesh position={[0, 0.4, 0]} receiveShadow>
          <cylinderGeometry args={[4.2, 4.5, 0.8, 24]} />
          <meshStandardMaterial color="#DDD3C4" />
        </mesh>
        {/* White Marble Canopy */}
        <mesh position={[0, 2.4, 0]} castShadow>
          <cylinderGeometry args={[1.8, 1.8, 3.2, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 4.3, 0]}>
          <coneGeometry args={[2.2, 1.8, 16]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.9} />
        </mesh>
      </group>

      {/* 1. Main Amba Vilas Palace Facade */}
      <mesh position={[0, 5.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[22, 10, 10]} />
        <meshStandardMaterial map={graniteTex} color="#D8C8B5" roughness={0.55} />
      </mesh>

      {/* Seven Grand Cusped Indo-Saracenic Arches along Verandah */}
      {[-7.5, -5.0, -2.5, 0, 2.5, 5.0, 7.5].map((ax, i) => (
        <group key={`arch-${i}`} position={[ax, 3.4, 5.1]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.28, 5.2, 10]} />
            <meshStandardMaterial color="#E8D5B5" />
          </mesh>
          <mesh position={[0, 2.8, 0]}>
            <torusGeometry args={[1.05, 0.16, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#D4A017" metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Central 145ft Five-Tier Durbar Tower */}
      <mesh position={[0, 12, 0.5]} castShadow>
        <boxGeometry args={[6.2, 7.5, 6.2]} />
        <meshStandardMaterial map={graniteTex} color="#C4B4A0" roughness={0.5} />
      </mesh>
      {/* Golden Central Dome */}
      <mesh position={[0, 17.2, 0.5]} castShadow>
        <sphereGeometry args={[3.2, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshStandardMaterial
          color={isIlluminated ? '#FFE055' : '#D4AF37'}
          metalness={0.95}
          roughness={0.12}
          emissive={isIlluminated ? '#FFA500' : '#1A1000'}
          emissiveIntensity={isIlluminated ? 0.95 : 0.05}
        />
      </mesh>
      {/* Kalasha Pinnacle Spire */}
      <mesh position={[0, 20.8, 0.5]}>
        <coneGeometry args={[0.3, 3.6, 12]} />
        <meshStandardMaterial color="#FFDF00" metalness={0.98} />
      </mesh>

      {/* 4 Corner Octagonal Bastions & Pink Marble Domes */}
      {[
        [-10.5, 4.5],
        [10.5, 4.5],
        [-10.5, -4.5],
        [10.5, -4.5],
      ].map(([bx, bz], idx) => (
        <group key={`corner-dome-${idx}`} position={[bx, 0, bz]}>
          <mesh position={[0, 6.5, 0]} castShadow>
            <cylinderGeometry args={[2.2, 2.4, 13, 8]} />
            <meshStandardMaterial map={graniteTex} color="#C4B4A0" />
          </mesh>
          <mesh position={[0, 14.5, 0]}>
            <sphereGeometry args={[2.2, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            <meshStandardMaterial
              color="#A32438"
              roughness={0.25}
              metalness={0.35}
              emissive={isIlluminated ? '#FF1744' : '#110000'}
              emissiveIntensity={isIlluminated ? 0.5 : 0}
            />
          </mesh>
          <mesh position={[0, 16.8, 0]}>
            <coneGeometry args={[0.25, 1.6, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Fort Walls with Crenellated Battlements */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 1.8, -10]} castShadow>
          <boxGeometry args={[36, 3.6, 1.0]} />
          <meshStandardMaterial map={graniteTex} color="#8A7D6B" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.8, 18]} castShadow>
          <boxGeometry args={[36, 3.6, 1.0]} />
          <meshStandardMaterial map={graniteTex} color="#8A7D6B" roughness={0.8} />
        </mesh>
        <mesh position={[-18, 1.8, 4]} castShadow>
          <boxGeometry args={[1.0, 3.6, 28]} />
          <meshStandardMaterial map={graniteTex} color="#8A7D6B" roughness={0.8} />
        </mesh>
        <mesh position={[18, 1.8, 4]} castShadow>
          <boxGeometry args={[1.0, 3.6, 28]} />
          <meshStandardMaterial map={graniteTex} color="#8A7D6B" roughness={0.8} />
        </mesh>
      </group>

      {/* BALARAMA GATE (Grand Procession Arch on East/South Face) */}
      <group position={[0, 0, 18]}>
        {[-3.5, 3.5].map((gx, gi) => (
          <mesh key={`bg-p-${gi}`} position={[gx, 3.6, 0]} castShadow>
            <boxGeometry args={[1.8, 7.2, 1.8]} />
            <meshStandardMaterial map={graniteTex} color="#B8AA98" />
          </mesh>
        ))}
        {/* Gate Archtop */}
        <mesh position={[0, 6.8, 0]}>
          <boxGeometry args={[8.8, 1.8, 2.0]} />
          <meshStandardMaterial map={graniteTex} color="#C4B4A0" />
        </mesh>
        {/* 3 Rajput Chhatri Pavilions over Balarama Gate */}
        {[-2.5, 0, 2.5].map((cx, ci) => (
          <group key={`bg-ch-${ci}`} position={[cx, 8.4, 0]}>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 0.8, 8]} />
              <meshStandardMaterial color="#E8D5B5" />
            </mesh>
            <mesh position={[0, 1.1, 0]}>
              <coneGeometry args={[0.9, 0.8, 8]} />
              <meshStandardMaterial color="#FFDF00" metalness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 100,000 Golden Serial Bulbs Illumination */}
      {isIlluminated && (
        <group>
          {Array.from({ length: 64 }).map((_, bi) => {
            const bx = ((bi % 16) / 15) * 22 - 11;
            const by = Math.floor(bi / 16) * 2.8 + 2.5;
            return (
              <mesh key={`bulb-${bi}`} position={[bx, by, 5.2]}>
                <sphereGeometry args={[0.09, 6, 6]} />
                <meshBasicMaterial color="#FFE082" />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}

// 4. CHAMUNDI HILLS & SRI CHAMUNDESHWARI TEMPLE (3D Sculpted Massif)
function ChamundiHill3D() {
  const graniteTex = useMemo(() => createGraniteTexture(), []);

  return (
    <group position={[42, 0, -34]}>
      {/* Terraced Mountain Massif (No primitive flat cone!) */}
      {[
        { y: 3.5, r: 26, h: 7, col: '#2E4C24' },
        { y: 8.5, r: 20, h: 6, col: '#38572A' },
        { y: 13.0, r: 14, h: 5, col: '#426030' },
        { y: 16.0, r: 8, h: 3, col: '#506E38' },
      ].map((layer, li) => (
        <mesh key={`hill-layer-${li}`} position={[0, layer.y, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[layer.r * 0.75, layer.r, layer.h, 24]} />
          <meshStandardMaterial color={layer.col} roughness={0.9} />
        </mesh>
      ))}

      {/* 40+ Natural Hillside Trees */}
      {Array.from({ length: 36 }).map((_, i) => {
        const ang = (i / 36) * Math.PI * 2;
        const dist = 9 + (i % 5) * 3.2;
        const hy = 16 - (dist - 8) * 0.55;
        return (
          <MysoreShadeTree
            key={`ch-tree-${i}`}
            position={[Math.cos(ang) * dist, hy, Math.sin(ang) * dist]}
            scale={0.75}
          />
        );
      })}

      {/* Summit Temple Platform */}
      <mesh position={[0, 17.5, 0]} receiveShadow>
        <boxGeometry args={[14, 1.0, 12]} />
        <meshStandardMaterial map={graniteTex} color="#9E8D77" />
      </mesh>

      {/* Sri Chamundeshwari Temple (7-Tier Dravidian Gopuram) */}
      <group position={[0, 18.0, 0]}>
        {[
          { y: 1.2, w: 5.2, h: 2.2, d: 3.6, col: '#D4AF37' },
          { y: 3.0, w: 4.4, h: 1.8, d: 3.0, col: '#C8A26A' },
          { y: 4.6, w: 3.6, h: 1.5, d: 2.5, col: '#D4AF37' },
          { y: 6.0, w: 2.8, h: 1.3, d: 2.0, col: '#C8A26A' },
          { y: 7.2, w: 2.0, h: 1.1, d: 1.5, col: '#D4AF37' },
        ].map((t, idx) => (
          <mesh key={`ch-tier-${idx}`} position={[0, t.y, 0]} castShadow>
            <boxGeometry args={[t.w, t.h, t.d]} />
            <meshStandardMaterial color={t.col} roughness={0.5} />
          </mesh>
        ))}

        {/* 7 Golden Kalashas atop Gopuram */}
        {[-1.0, -0.6, -0.2, 0.2, 0.6, 1.0].map((kx, ki) => (
          <mesh key={`kal-${ki}`} position={[kx, 8.2, 0]}>
            <coneGeometry args={[0.12, 0.6, 8]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.98} />
          </mesh>
        ))}
      </group>

      {/* Monolithic Nandi Bull Pavilion */}
      <group position={[-8, 12, 8]}>
        <mesh receiveShadow>
          <boxGeometry args={[3.2, 0.6, 3.8]} />
          <meshStandardMaterial color="#C8BAA7" />
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[2.2, 1.4, 3.0]} />
          <meshStandardMaterial color="#1F1D1A" roughness={0.25} metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.8, 1.1]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#1F1D1A" />
        </mesh>
      </group>
    </group>
  );
}

// 5. DASARA EXHIBITION GROUNDS (Doddakere Maidan - Realistic Aahara Mela & Ferris Wheel)
function ExhibitionGrounds3D() {
  const wheelRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z = clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group position={[24, 0, 16]}>
      {/* Fairgrounds Base Platform */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 22]} />
        <meshStandardMaterial color="#9C8B73" roughness={0.9} />
      </mesh>

      {/* Ornate Dasara Exhibition Entrance Arch */}
      <group position={[-10, 0, 0]}>
        {[-2.5, 2.5].map((py, pi) => (
          <mesh key={`ex-arch-p-${pi}`} position={[0, 2.5, py]} castShadow>
            <boxGeometry args={[1.2, 5.0, 1.2]} />
            <meshStandardMaterial color="#B71C1C" />
          </mesh>
        ))}
        <mesh position={[0, 5.4, 0]}>
          <boxGeometry args={[1.4, 1.2, 6.2]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} />
        </mesh>
      </group>

      {/* Realistic Aahara Mela Food Stalls (Royal Striped Canopies, NOT plain blocks!) */}
      {[-5, 0, 5].map((stallZ, si) => (
        <group key={`stall-row-${si}`} position={[2, 0, stallZ]}>
          {/* Wooden Counter */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[6.5, 1.6, 2.6]} />
            <meshStandardMaterial color="#5D4037" roughness={0.7} />
          </mesh>
          {/* Striped Scalloped Canopy Roof */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <boxGeometry args={[7.2, 0.4, 3.2]} />
            <meshStandardMaterial
              color={si === 0 ? '#C62828' : si === 1 ? '#2E7D32' : '#1565C0'}
            />
          </mesh>
          <mesh position={[0, 2.7, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[3.8, 0.9, 4]} />
            <meshStandardMaterial color="#FFE082" />
          </mesh>
        </group>
      ))}

      {/* Animated 3D Ferris Wheel (Ratha Chakra) */}
      <group position={[7, 0, -4]}>
        {/* Support A-Frames */}
        <mesh position={[-0.8, 3.8, 0]} rotation={[0, 0, 0.18]} castShadow>
          <cylinderGeometry args={[0.1, 0.18, 7.8, 6]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} />
        </mesh>
        <mesh position={[0.8, 3.8, 0]} rotation={[0, 0, -0.18]} castShadow>
          <cylinderGeometry args={[0.1, 0.18, 7.8, 6]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} />
        </mesh>

        {/* Rotating Wheel Group */}
        <group ref={wheelRef} position={[0, 6.8, 0]}>
          <mesh>
            <torusGeometry args={[4.2, 0.12, 8, 28]} />
            <meshStandardMaterial color="#FFDF00" metalness={0.9} emissive="#FF8F00" emissiveIntensity={0.4} />
          </mesh>
          <mesh>
            <torusGeometry args={[2.5, 0.08, 8, 24]} />
            <meshStandardMaterial color="#FF9800" metalness={0.8} />
          </mesh>
          {/* 8 Wheel Spokes with Gondola Carriages */}
          {Array.from({ length: 8 }).map((_, wi) => {
            const wAng = (wi / 8) * Math.PI * 2;
            const gx = Math.cos(wAng) * 4.2;
            const gy = Math.sin(wAng) * 4.2;
            return (
              <group key={`spoke-${wi}`}>
                <mesh rotation={[0, 0, wAng]}>
                  <cylinderGeometry args={[0.04, 0.04, 8.4, 4]} />
                  <meshStandardMaterial color="#FFFFFF" />
                </mesh>
                <mesh position={[gx, gy, 0]}>
                  <boxGeometry args={[0.7, 0.7, 0.7]} />
                  <meshStandardMaterial
                    color={wi % 2 === 0 ? '#E91E63' : '#00E5FF'}
                    roughness={0.3}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>
    </group>
  );
}

// 6. KUPPANNA PARK (Nishad Bagh - Authentic Victorian Glass House)
function KuppannaPark3D() {
  return (
    <group position={[20, 0, -12]}>
      {/* Manicured Lawn Base */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial color="#2E6B27" roughness={0.8} />
      </mesh>

      {/* Victorian Octagonal Glass House */}
      <group position={[0, 0, 0]}>
        {/* Stone Plinth */}
        <mesh position={[0, 0.4, 0]} receiveShadow>
          <cylinderGeometry args={[4.2, 4.4, 0.8, 16]} />
          <meshStandardMaterial color="#DDD3C4" />
        </mesh>
        {/* Transparent Cyan Luminous Glass Body */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[3.8, 3.8, 3.4, 16]} />
          <meshStandardMaterial
            color="#80DEEA"
            transparent
            opacity={0.65}
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
        {/* Ornate Iron Lattice Ribs */}
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[3.82, 3.82, 3.4, 16, 1, true]} />
          <meshStandardMaterial color="#263238" wireframe />
        </mesh>
        {/* Curved Glass Dome */}
        <mesh position={[0, 5.0, 0]}>
          <sphereGeometry args={[3.8, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color="#4DD0E1"
            transparent
            opacity={0.7}
            roughness={0.15}
          />
        </mesh>
        {/* Golden Apex Spire */}
        <mesh position={[0, 7.2, 0]}>
          <coneGeometry args={[0.3, 1.4, 8]} />
          <meshStandardMaterial color="#FFDF00" metalness={0.95} />
        </mesh>
      </group>

      {/* Concentric Mysore Flower Carpet Beds */}
      {[-5, 5].map((fx, fi) => (
        <group key={`fbed-${fi}`} position={[fx, 0.06, 4]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.2, 16]} />
            <meshStandardMaterial color={fi === 0 ? '#E91E63' : '#FFC107'} />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.8, 16]} />
            <meshStandardMaterial color="#9C27B0" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 7. BRINDAVAN GARDENS (KRS Dam - Terraced Musical Fountains)
function BrindavanGardens3D() {
  return (
    <group position={[-44, 0, 20]}>
      {/* Krishnarajasagara Dam Massive Granite Wall */}
      <mesh position={[-8, 4.5, 0]} castShadow>
        <boxGeometry args={[3.5, 9, 24]} />
        <meshStandardMaterial color="#6D6558" roughness={0.75} />
      </mesh>
      {/* Sluice Gate Openings */}
      {[-8, -4, 0, 4, 8].map((gy, gi) => (
        <mesh key={`krs-g-${gi}`} position={[-6.2, 3.0, gy]}>
          <boxGeometry args={[0.4, 3.2, 1.6]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
      ))}

      {/* Water Reservoir behind the Dam */}
      <mesh position={[-12, 4.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 24]} />
        <meshStandardMaterial color="#0D47A1" roughness={0.15} metalness={0.8} />
      </mesh>

      {/* Cascading Terraced Gardens with Manicured Lawns */}
      {[0, 1, 2].map((step, si) => (
        <group key={`krs-step-${si}`} position={[step * 4.2 - 2, 0, 0]}>
          <mesh position={[0, 0.5 * (3 - step), 0]} receiveShadow>
            <boxGeometry args={[3.8, 1.0 * (3 - step), 20]} />
            <meshStandardMaterial color="#2E6B27" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Illuminated Musical Fountain Channel with Water Jets */}
      <group position={[6, 0.4, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 16]} />
          <meshStandardMaterial color="#00BCD4" roughness={0.1} metalness={0.7} />
        </mesh>
        {/* Animated Fountain Jets */}
        {[-6, -3, 0, 3, 6].map((jy, ji) => (
          <group key={`jet-${ji}`} position={[0, 1.4, jy]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.24, 2.8, 8]} />
              <meshStandardMaterial
                color="#E0F7FA"
                emissive="#00E5FF"
                emissiveIntensity={0.8}
                transparent
                opacity={0.85}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// 8. MYSORE TOWN HALL & SILVER JUBILEE CLOCK TOWER
function TownHall3D() {
  const graniteTex = useMemo(() => createGraniteTexture(), []);

  return (
    <group position={[-12, 0, 16]}>
      {/* Stone Paved Base */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#B0A290" roughness={0.7} />
      </mesh>

      {/* Rangacharlu Memorial Town Hall (Classical Greek-Roman Colonnade) */}
      <group position={[0, 0, 0]}>
        {/* Front Stone Flight of Steps */}
        <mesh position={[0, 0.3, 3.2]} receiveShadow>
          <boxGeometry args={[9.5, 0.6, 2.5]} />
          <meshStandardMaterial color="#C4B4A0" />
        </mesh>
        {/* Main Hall Building */}
        <mesh position={[0, 3.2, 0]} castShadow>
          <boxGeometry args={[9.0, 5.8, 5.0]} />
          <meshStandardMaterial map={graniteTex} color="#D4C8BA" />
        </mesh>
        {/* Classical Triangular Pediment */}
        <mesh position={[0, 6.8, 2.2]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[4.2, 4.2, 0.6]} />
          <meshStandardMaterial color="#C4B4A0" />
        </mesh>
        {/* Six Corinthian Monumental Columns */}
        {[-3.6, -2.2, -0.8, 0.8, 2.2, 3.6].map((cx, ci) => (
          <mesh key={`th-col-${ci}`} position={[cx, 3.0, 2.4]} castShadow>
            <cylinderGeometry args={[0.22, 0.25, 5.2, 10]} />
            <meshStandardMaterial color="#EDE3D2" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Silver Jubilee Clock Tower (Dufferin Clock Tower on Ashoka Road) */}
      <group position={[6.5, 0, 3.5]}>
        {/* Stone Tower Shaft */}
        <mesh position={[0, 5.5, 0]} castShadow>
          <boxGeometry args={[2.0, 11.0, 2.0]} />
          <meshStandardMaterial map={graniteTex} color="#B8AA98" />
        </mesh>
        {/* 4 Illuminated Glowing Clock Faces */}
        {[
          [0, 9.2, 1.02],
          [0, 9.2, -1.02],
          [1.02, 9.2, 0],
          [-1.02, 9.2, 0],
        ].map(([cx, cy, cz], cfi) => (
          <mesh key={`cf-${cfi}`} position={[cx, cy, cz]}>
            <circleGeometry args={[0.55, 16]} />
            <meshBasicMaterial color="#FFFDE7" />
          </mesh>
        ))}
        {/* Tower Pyramid Spire */}
        <mesh position={[0, 12.0, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.2, 2.2, 4]} />
          <meshStandardMaterial color="#8D6E63" metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// 9. JAGANMOHAN PALACE & ART GALLERY (1861 Traditional Royal Pavilion)
function JaganmohanPalace3D() {
  return (
    <group position={[-16, 0, -4]}>
      {/* Stone Plinth */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#B0A290" roughness={0.7} />
      </mesh>
      {/* 1st Tier Main Gallery Hall */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[9.5, 5.0, 7.0]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.6} />
      </mesh>
      {/* 2nd Tier Gallery */}
      <mesh position={[0, 5.8, 0]} castShadow>
        <boxGeometry args={[7.2, 2.2, 5.2]} />
        <meshStandardMaterial color="#D7C5B0" />
      </mesh>
      {/* Traditional 3-Tier Sloping Terracotta Roofs */}
      <mesh position={[0, 5.1, 0]}>
        <boxGeometry args={[10.2, 0.35, 7.6]} />
        <meshStandardMaterial color="#A04000" roughness={0.5} />
      </mesh>
      <mesh position={[0, 7.0, 0]}>
        <boxGeometry args={[7.8, 0.35, 5.8]} />
        <meshStandardMaterial color="#A04000" roughness={0.5} />
      </mesh>
      {/* Royal Chhatri Pinnacle */}
      <mesh position={[0, 8.2, 0]}>
        <coneGeometry args={[1.5, 1.8, 8]} />
        <meshStandardMaterial color="#FFDF00" metalness={0.9} />
      </mesh>
    </group>
  );
}

// 10. MYSORE CITY ARTERIAL ROAD NETWORK & STREET INFRASTRUCTURE
function MysoreCityRoadways() {
  const cobbleTex = useMemo(() => createCobblestoneTexture(), []);

  return (
    <group position={[0, 0.04, 0]}>
      {/* Sayyaji Rao Road (North-South Grand Procession Avenue, 6.5m wide) */}
      <mesh position={[0, 0, -10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.5, 120]} />
        <meshStandardMaterial map={cobbleTex} color="#2A2A2E" roughness={0.8} />
      </mesh>

      {/* Albert Victor Road / Ashoka Road (East-West Heritage Boulevard) */}
      <mesh position={[0, 0, 18]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[130, 6.0]} />
        <meshStandardMaterial map={cobbleTex} color="#2A2A2E" roughness={0.8} />
      </mesh>

      {/* Road Center Divider Markings (Yellow & White) */}
      <mesh position={[0, 0.02, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 120]} />
        <meshBasicMaterial color="#FFDF00" />
      </mesh>
      <mesh position={[0, 0.02, 18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[130, 0.25]} />
        <meshBasicMaterial color="#FFDF00" />
      </mesh>

      {/* Royal Victorian Streetlamps along Procession Route */}
      {[-36, -24, -12, 0, 12, 24, 36].map((ry, ri) => (
        <React.Fragment key={`lamp-pair-${ri}`}>
          <VictorianStreetlamp position={[-4.0, 0, ry]} />
          <VictorianStreetlamp position={[4.0, 0, ry]} />
        </React.Fragment>
      ))}

      {/* 28+ Lush Leafy Trees Lining the Avenues */}
      {[-32, -20, -8, 4, 16, 28].map((ty, ti) => (
        <React.Fragment key={`tree-pair-${ti}`}>
          <MysoreShadeTree position={[-6.2, 0, ty]} scale={1.1} />
          <MysoreShadeTree position={[6.2, 0, ty]} scale={1.1} />
        </React.Fragment>
      ))}
    </group>
  );
}

// 11. INTERACTIVE HOLOGRAPHIC LANDMARK PIN
function InteractiveHologramPin({
  landmark,
  isSelected,
  onClick,
}: {
  landmark: CityLandmark;
  isSelected: boolean;
  onClick: () => void;
}) {
  const pinRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (pinRef.current) {
      const t = clock.getElapsedTime();
      pinRef.current.position.y =
        landmark.position[1] + 3.5 + Math.sin(t * 3.5 + landmark.position[0]) * 0.35;
      pinRef.current.rotation.y = t * 1.2;
    }
  });

  return (
    <group
      ref={pinRef}
      position={[landmark.position[0], landmark.position[1] + 3.5, landmark.position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Vertical Light Pillar to Ground */}
      <mesh position={[0, -2.0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 4.0, 8]} />
        <meshBasicMaterial color={isSelected ? '#FFD700' : '#FF9100'} />
      </mesh>

      {/* Floating Gem Medallion */}
      <mesh>
        <octahedronGeometry args={[isSelected ? 1.2 : hovered ? 0.95 : 0.75, 0]} />
        <meshStandardMaterial
          color={isSelected ? '#FFDF00' : hovered ? '#FFA500' : '#E5B80B'}
          emissive={isSelected ? '#FFA500' : '#B8860B'}
          emissiveIntensity={isSelected ? 1.4 : 0.6}
        />
      </mesh>

      {/* Rotating Energy Halo Ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[isSelected ? 1.6 : 1.1, 0.06, 8, 24]} />
        <meshBasicMaterial color={isSelected ? '#FFE055' : '#FF8C00'} />
      </mesh>
    </group>
  );
}

// 12. CAMERA CONTROLLER: Smoothly transitions camera to selected landmark without fighting OrbitControls
function CameraController({
  landmarkId,
  targetPos,
  targetLookAt,
  controlsRef,
}: {
  landmarkId: string;
  targetPos: [number, number, number];
  targetLookAt: [number, number, number];
  controlsRef: React.RefObject<any>;
}) {
  const isTransitioning = useRef(false);
  const startPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const destPos = useRef(new THREE.Vector3(...targetPos));
  const destTarget = useRef(new THREE.Vector3(...targetLookAt));
  const progress = useRef(1);

  useEffect(() => {
    if (controlsRef.current) {
      startPos.current.copy(controlsRef.current.object.position);
      startTarget.current.copy(controlsRef.current.target);
      destPos.current.set(...targetPos);
      destTarget.current.set(...targetLookAt);
      progress.current = 0;
      isTransitioning.current = true;
    }
  }, [landmarkId, targetPos, targetLookAt, controlsRef]);

  useFrame((_, delta) => {
    if (isTransitioning.current && controlsRef.current) {
      progress.current += delta * 2.2;
      if (progress.current >= 1) {
        progress.current = 1;
        isTransitioning.current = false;
        controlsRef.current.object.position.copy(destPos.current);
        controlsRef.current.target.copy(destTarget.current);
        controlsRef.current.update();
      } else {
        const t = 1 - Math.pow(1 - progress.current, 3);
        controlsRef.current.object.position.lerpVectors(startPos.current, destPos.current, t);
        controlsRef.current.target.lerpVectors(startTarget.current, destTarget.current, t);
        controlsRef.current.update();
      }
    }
  });

  return null;
}

export interface CityExploreSceneProps {
  selectedId?: string;
  onSelectLandmark?: (landmark: CityLandmark) => void;
}

// MAIN 3D CITY EXPLORE SCENE COMPONENT
export default function CityExploreScene({
  selectedId: controlledSelectedId,
  onSelectLandmark,
}: CityExploreSceneProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string>('palace');
  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;
  const [tod, setTod] = useState<'day' | 'evening' | 'night'>('evening');
  const controlsRef = useRef<any>(null);

  const selectedLandmark = useMemo(
    () => CITY_LANDMARKS.find((l) => l.id === selectedId) || CITY_LANDMARKS[0],
    [selectedId]
  );

  const handleSelect = (lm: CityLandmark) => {
    setInternalSelectedId(lm.id);
    audioManager.playRoyalFanfare();
    if (onSelectLandmark) onSelectLandmark(lm);
  };

  // Time of Day Lighting & Sky Presets (No Pitch-Black Darkness!)
  const todLighting = {
    day: {
      bg: '#4A90E2', // Radiant Mysore Blue Sky
      fog: '#82B1FF',
      ambient: '#FFF8E7',
      ambientIntensity: 1.35,
      sun: '#FFF9C4',
      sunPos: [35, 55, 30] as [number, number, number],
      sunIntensity: 2.2,
      palaceBulbs: false,
    },
    evening: {
      bg: '#3B1838', // Royal Mysore Sunset Twilight Sky
      fog: '#4A1D4E',
      ambient: '#FFE0B2', // Warm amber fill light
      ambientIntensity: 1.4,
      sun: '#FF8A50',
      sunPos: [-35, 26, 20] as [number, number, number],
      sunIntensity: 1.8,
      palaceBulbs: true,
    },
    night: {
      bg: '#0A1329', // Deep Royal Sapphire Night Sky
      fog: '#111D3B',
      ambient: '#3A4D80',
      ambientIntensity: 1.05,
      sun: '#82B1FF',
      sunPos: [20, 35, -20] as [number, number, number],
      sunIntensity: 0.95,
      palaceBulbs: true,
    },
  }[tod];

  return (
    <div
      className="relative w-full h-[650px] min-h-[650px] bg-slate-950 overflow-hidden"
      style={{ height: '650px' }}
    >
      <Canvas
        shadows
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block',
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 26, 44]} fov={48} />
        <OrbitControls
          ref={controlsRef}
          target={[0, 8, 4]}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={8}
          maxDistance={140}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Smooth Camera & Target Follower */}
        <CameraController
          landmarkId={selectedLandmark.id}
          targetPos={selectedLandmark.cameraTarget}
          targetLookAt={selectedLandmark.lookAt}
          controlsRef={controlsRef}
        />

        {/* Atmosphere & Lighting */}
        <color attach="background" args={[todLighting.bg]} />
        <fog attach="fog" args={[todLighting.fog, 45, 160]} />
        <ambientLight color={todLighting.ambient} intensity={todLighting.ambientIntensity} />
        <directionalLight
          position={todLighting.sunPos}
          intensity={todLighting.sunIntensity}
          color={todLighting.sun}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        {/* Soft Secondary Fill Light (Guarantees zero pitch-black surfaces!) */}
        <directionalLight position={[0, -10, 0]} intensity={0.4} color="#FFF8E7" />
        <hemisphereLight args={['#FFE0B2', '#2E5C28', 0.8]} />

        {/* VIBRANT TERRAIN BASE (Lush Mysore Parkland - ZERO Black Voids!) */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[260, 260]} />
          <meshStandardMaterial color="#2E5C28" roughness={0.82} />
        </mesh>

        {/* Mysore City Roadways & Streetlamps */}
        <MysoreCityRoadways />

        {/* 1. Amba Vilas Palace Complex */}
        <PalaceComplex3D isIlluminated={todLighting.palaceBulbs} />

        {/* 2. Chamundi Hills & Sri Chamundeshwari Temple */}
        <ChamundiHill3D />

        {/* 3. Bannimantap Parade Grounds */}
        <Bannimantap3D />

        {/* 4. Dasara Exhibition Grounds (Aahara Mela & Ferris Wheel) */}
        <ExhibitionGrounds3D />

        {/* 5. Kuppanna Park Victorian Glass House */}
        <KuppannaPark3D />

        {/* 6. Brindavan Gardens (KRS Dam & Fountains) */}
        <BrindavanGardens3D />

        {/* 7. Town Hall & Clock Tower */}
        <TownHall3D />

        {/* 8. Jaganmohan Palace */}
        <JaganmohanPalace3D />

        {/* Interactive Holographic Pins for each landmark */}
        {CITY_LANDMARKS.map((lm) => (
          <InteractiveHologramPin
            key={lm.id}
            landmark={lm}
            isSelected={lm.id === selectedId}
            onClick={() => handleSelect(lm)}
          />
        ))}
      </Canvas>

      {/* Top Left: TOD Lighting Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {(['day', 'evening', 'night'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTod(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border capitalize transition-all ${
              tod === t
                ? 'bg-amber-400 text-black shadow-gold-glow border-amber-300'
                : 'bg-black/60 border-white/20 text-white/80 hover:bg-black/80'
            }`}
          >
            {t === 'day' ? '☀️ Daytime' : t === 'evening' ? '🌅 Dusk Glow' : '🌙 Royal Night'}
          </button>
        ))}
      </div>

      {/* Top Right: Landmark Quick Teleport Bar */}
      <div className="absolute top-4 right-4 z-10 hidden md:flex flex-wrap gap-1.5 max-w-md justify-end">
        {CITY_LANDMARKS.map((lm) => (
          <button
            key={lm.id}
            onClick={() => handleSelect(lm)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium backdrop-blur-md border transition-all ${
              lm.id === selectedId
                ? 'bg-amber-400 text-black font-bold border-amber-300 shadow-gold-glow'
                : 'bg-black/60 border-white/10 text-white/70 hover:bg-black/80'
            }`}
          >
            {lm.name.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Bottom Floating Info Card for Selected Landmark */}
      <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-lg z-10">
        <div className="glass-dark p-4 rounded-2xl border border-amber-400/40 shadow-royal backdrop-blur-md">
          <div className="flex justify-between items-start mb-1">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {selectedLandmark.category}
              </span>
              <h3 className="text-base md:text-lg font-bold text-cream mt-1">
                {selectedLandmark.name}
              </h3>
              <p className="text-xs text-amber-300/90 font-kannada">
                {selectedLandmark.nameKn}
              </p>
            </div>
          </div>
          <p className="text-xs text-white/80 my-2 leading-relaxed">
            {selectedLandmark.description}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <span className="text-amber-300 font-medium">✨ {selectedLandmark.highlight}</span>
            <span className="text-[11px] text-amber-400/80 font-kannada">
              {selectedLandmark.highlightKn}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component: Bannimantap Parade Grounds
function Bannimantap3D() {
  return (
    <group position={[-28, 0, -36]}>
      {/* Arena Oval Field */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 22]} />
        <meshStandardMaterial color="#556B2F" roughness={0.9} />
      </mesh>
      {/* Tiered Spectator Grandstand (Semi-circle) */}
      <mesh position={[0, 1.8, 6]} castShadow receiveShadow>
        <cylinderGeometry args={[14, 15, 3.2, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#C8BAA7" roughness={0.7} />
      </mesh>
      {/* Royal Saluting Base Pavilion */}
      <mesh position={[0, 1.2, -6]} castShadow>
        <boxGeometry args={[5.5, 2.2, 3.5]} />
        <meshStandardMaterial color="#FFDF00" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Olympic Ceremonial Torch Pole with Glowing Flame */}
      <group position={[8, 0, 0]}>
        <mesh position={[0, 3.8, 0]}>
          <cylinderGeometry args={[0.2, 0.35, 7.6, 8]} />
          <meshStandardMaterial color="#212121" metalness={0.9} />
        </mesh>
        <mesh position={[0, 8.0, 0]}>
          <coneGeometry args={[0.65, 1.8, 8]} />
          <meshStandardMaterial color="#FF6D00" emissive="#FF3D00" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  );
}
