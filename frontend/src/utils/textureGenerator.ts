import * as THREE from 'three';

// Procedural Canvas Texture Generator for realistic Mysore Heritage materials
// Generates high-res textures locally with zero external asset dependencies

export function createGraniteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base stone tone
  ctx.fillStyle = '#b8a898';
  ctx.fillRect(0, 0, 512, 512);

  // Stone block grid (Ashlar masonry)
  const rows = 16;
  const cols = 8;
  const rowHeight = 512 / rows;
  const colWidth = 512 / cols;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (colWidth / 2);
    for (let c = -1; c <= cols; c++) {
      const x = c * colWidth + offset;
      const y = r * rowHeight;

      // Slight color variation per block
      const shade = Math.floor(Math.random() * 30 - 15);
      ctx.fillStyle = `rgb(${184 + shade}, ${168 + shade}, ${152 + shade})`;
      ctx.fillRect(x + 2, y + 2, colWidth - 4, rowHeight - 4);

      // Texture noise / speckles (granite minerals)
      for (let s = 0; s < 60; s++) {
        const sx = x + 2 + Math.random() * (colWidth - 4);
        const sy = y + 2 + Math.random() * (rowHeight - 4);
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(40,30,20,0.25)' : 'rgba(255,255,255,0.3)';
        ctx.fillRect(sx, sy, 2, 2);
      }
    }
    // Mortar horizontal groove
    ctx.strokeStyle = '#5c4e40';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, r * rowHeight);
    ctx.lineTo(512, r * rowHeight);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createStainedGlassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, 256, 256);

  const colors = ['#007791', '#00A86B', '#C71585', '#FFD700', '#4B0082', '#E0115F'];
  for (let i = 0; i < 32; i++) {
    const cx = (i % 6) * 42 + 20;
    const cy = Math.floor(i / 6) * 45 + 20;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function createCobblestoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#423d38';
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 32) {
    const shift = (y / 32) % 2 === 0 ? 0 : 16;
    for (let x = -16; x < 512; x += 32) {
      const stoneColor = 70 + Math.floor(Math.random() * 25);
      ctx.fillStyle = `rgb(${stoneColor + 10}, ${stoneColor}, ${stoneColor - 10})`;
      ctx.beginPath();
      ctx.roundRect(x + shift + 2, y + 2, 28, 28, 6);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function createElephantSkinTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm natural Asian elephant grey (not dark black)
  ctx.fillStyle = '#78726B';
  ctx.fillRect(0, 0, 512, 512);

  // Natural skin folds and cross-hatch wrinkles
  ctx.strokeStyle = '#5E5851';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 220; i++) {
    ctx.beginPath();
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(
      sx + (Math.random() - 0.5) * 50,
      sy + (Math.random() - 0.5) * 35,
      sx + (Math.random() - 0.5) * 75,
      sy + (Math.random() - 0.5) * 50
    );
    ctx.stroke();
  }

  // Soft pinkish mottled skin speckles (depigmentation on royal tuskers)
  for (let p = 0; p < 80; p++) {
    const px = Math.random() * 512;
    const py = Math.random() * 512;
    ctx.fillStyle = 'rgba(215, 175, 160, 0.28)';
    ctx.beginPath();
    ctx.arc(px, py, 2 + Math.random() * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Earthen dust highlights
  for (let d = 0; d < 60; d++) {
    const dx = Math.random() * 512;
    const dy = Math.random() * 512;
    ctx.fillStyle = 'rgba(150, 140, 130, 0.22)';
    ctx.beginPath();
    ctx.arc(dx, dy, 3 + Math.random() * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 5. Arjuna Royal Green Forehead Nameboard with Bold Kannada Inscription: "ಅರ್ಜುನ"
export function createArjunaForeheadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Rich Royal Karnataka Emerald Green Gradient Background
  const bgGrad = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
  bgGrad.addColorStop(0, '#137A38');    // Luminous emerald green center
  bgGrad.addColorStop(0.45, '#0B5B26'); // Rich royal green
  bgGrad.addColorStop(0.85, '#053B18'); // Deep forest green
  bgGrad.addColorStop(1, '#02230D');    // Dark regal green edge
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle royal damask / diamond grid watermark on green velvet
  ctx.strokeStyle = 'rgba(255, 223, 0, 0.08)';
  ctx.lineWidth = 2;
  const step = 48;
  for (let x = -1024; x < 2048; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 1024, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, 1024);
    ctx.lineTo(x + 1024, 0);
    ctx.stroke();
  }

  // 2. Heavy Royal Mysore Gold Filigree Outer Frame
  // Outer Gold Border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 28;
  ctx.strokeRect(34, 34, 956, 956);

  ctx.strokeStyle = '#FFDF00';
  ctx.lineWidth = 14;
  ctx.strokeRect(52, 52, 920, 920);

  // Inner Gold Rope / Beaded Accent
  ctx.strokeStyle = '#FFE57F';
  ctx.lineWidth = 6;
  ctx.setLineDash([14, 10]);
  ctx.strokeRect(74, 74, 876, 876);
  ctx.setLineDash([]); // Reset line dash

  // Inner Emerald Velvet Inset Panel
  ctx.fillStyle = 'rgba(2, 40, 15, 0.65)';
  ctx.fillRect(86, 86, 852, 852);
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 4;
  ctx.strokeRect(86, 86, 852, 852);

  // 3. Ornate Corner Brackets with Ruby & Gold Medallions
  const corners = [
    [100, 100],
    [924, 100],
    [100, 924],
    [924, 924],
  ];
  corners.forEach(([cx, cy]) => {
    // Outer Gold Ring
    ctx.fillStyle = '#FFDF00';
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8B6508';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner Ruby Jewel
    ctx.fillStyle = '#B71C1C';
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();

    // Jewel Specular Glimmer
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx - 6, cy - 6, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. Sacred Royal Mysore Emblem / Crest at Top (Crest with Gandaberunda / Sun)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(512, 190, 72, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Red Center Jewel in Crest
  ctx.fillStyle = '#C62828';
  ctx.beginPath();
  ctx.arc(512, 190, 36, 0, Math.PI * 2);
  ctx.fill();

  // Royal Crown Emoji / Symbol
  ctx.fillStyle = '#FFF8E1';
  ctx.font = 'bold 44px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('👑', 512, 188);

  // Top Inscription: "ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ಕೃಪೆ • ಮೈಸೂರು ದಸರಾ"
  ctx.fillStyle = '#FFE082';
  ctx.font = 'bold 34px "Nirmala UI", "Tunga", "Segoe UI", sans-serif';
  ctx.fillText('ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ಕೃಪೆ • ಮೈಸೂರು ದಸರಾ', 512, 305);

  // Subtitle Banner: "ದಸರಾ ಗಜಪಡೆ ನಾಯಕ"
  ctx.fillStyle = '#FFCA28';
  ctx.font = 'bold 40px "Nirmala UI", "Tunga", "Segoe UI", sans-serif';
  ctx.fillText('ದಸರಾ ಗಜಪಡೆ ನಾಯಕ', 512, 375);

  // 5. THE MAIN ATTRACTION: GIANT BOLD KANNADA NAME: "ಅರ್ಜುನ"
  // Deep drop shadow outline for crisp legibility
  ctx.font = '900 190px "Nirmala UI", "Tunga", "Kedage", "Mallige", "Arial Unicode MS", sans-serif';
  ctx.strokeStyle = '#001A07';
  ctx.lineWidth = 26;
  ctx.lineJoin = 'round';
  ctx.strokeText('ಅರ್ಜುನ', 512, 570);

  // Second dark shadow offset
  ctx.fillStyle = '#01260B';
  ctx.fillText('ಅರ್ಜುನ', 512, 578);

  // Radiant Gold Text Gradient
  const textGrad = ctx.createLinearGradient(0, 420, 0, 600);
  textGrad.addColorStop(0, '#FFFFFF');
  textGrad.addColorStop(0.2, '#FFF9A6');
  textGrad.addColorStop(0.55, '#FFD700');
  textGrad.addColorStop(1, '#FF9800');
  ctx.fillStyle = textGrad;
  ctx.fillText('ಅರ್ಜುನ', 512, 568);

  // Inner subtle highlight
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FFFFFF';
  ctx.strokeText('ಅರ್ಜುನ', 512, 566);

  // Decorative Golden Divider Line with Jewels
  ctx.strokeStyle = '#FFDF00';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(200, 650);
  ctx.lineTo(824, 650);
  ctx.stroke();

  // Center Diamond in Divider
  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  ctx.arc(512, 650, 12, 0, Math.PI * 2);
  ctx.fill();

  // 6. Subtitles & Accolades
  // "CAPTAIN ARJUNA"
  ctx.fillStyle = '#FFE57F';
  ctx.font = 'bold 50px "Segoe UI", "Georgia", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('CAPTAIN ARJUNA', 512, 730);

  // "೭೫೦ ಕೆಜಿ ಚಿನ್ನದ ಅಂಬಾರಿ ವಾಹಕ"
  ctx.fillStyle = '#FFF59D';
  ctx.font = 'bold 44px "Nirmala UI", "Tunga", "Segoe UI", sans-serif';
  ctx.fillText('೭೫೦ ಕೆಜಿ ಚಿನ್ನದ ಅಂಬಾರಿ ವಾಹಕ', 512, 805);

  // Golden Floral Base Garland / Bottom Festoon
  ctx.fillStyle = '#FFDF00';
  ctx.font = 'bold 36px "Segoe UI", sans-serif';
  ctx.fillText('✦ ✦ ✦   ರಾಜಗಾಂಭೀರ್ಯದ ಗಜರಾಜ   ✦ ✦ ✦', 512, 875);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 6. Royal Mysore Gandaberunda (Two-Headed Mythological Royal Eagle Crest)
export function createGandaberundaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Royal Crimson / Deep Maroon background disc
  const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 250);
  grad.addColorStop(0, '#8A0B29');
  grad.addColorStop(0.7, '#590014');
  grad.addColorStop(1, '#2D000A');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(256, 256, 250, 0, Math.PI * 2);
  ctx.fill();

  // Double Gilded Gold Filigree Ring
  ctx.strokeStyle = '#FFDF00';
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(256, 256, 230, 0, Math.PI * 2);
  ctx.stroke();

  // Golden Sun Rays / Lotus Petals border
  for (let i = 0; i < 24; i++) {
    const ang = (i / 24) * Math.PI * 2;
    const x1 = 256 + Math.cos(ang) * 230;
    const y1 = 256 + Math.sin(ang) * 230;
    const x2 = 256 + Math.cos(ang) * 246;
    const y2 = 256 + Math.sin(ang) * 246;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Draw Gilded Gandaberunda (Two-Headed Bird of Royal Mysore)
  ctx.save();
  ctx.translate(256, 256);

  // Central Royal Crown (Kireeta) atop the two heads
  ctx.fillStyle = '#FFE082';
  ctx.beginPath();
  ctx.moveTo(0, -180);
  ctx.lineTo(-24, -130);
  ctx.lineTo(0, -145);
  ctx.lineTo(24, -130);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Twin Heads facing Left & Right
  [-1, 1].forEach((dir) => {
    ctx.save();
    ctx.scale(dir, 1);

    // Head and neck
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(0, -135);
    ctx.quadraticCurveTo(35, -135, 48, -110);
    ctx.quadraticCurveTo(65, -95, 75, -80); // Beak
    ctx.lineTo(48, -75);
    ctx.quadraticCurveTo(30, -50, 15, -20);
    ctx.lineTo(0, -20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Sharp Beak curve
    ctx.fillStyle = '#FFA000';
    ctx.beginPath();
    ctx.moveTo(48, -98);
    ctx.lineTo(82, -82);
    ctx.lineTo(50, -74);
    ctx.closePath();
    ctx.fill();

    // Fierce Royal Eye
    ctx.fillStyle = '#800000';
    ctx.beginPath();
    ctx.arc(36, -100, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(35, -101, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Outspread Wing
    ctx.fillStyle = '#FFCA28';
    ctx.beginPath();
    ctx.moveTo(15, -30);
    ctx.quadraticCurveTo(90, -90, 160, -75);
    ctx.quadraticCurveTo(195, -20, 175, 40);
    ctx.quadraticCurveTo(120, 70, 45, 60);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Wing Feather Layers
    for (let f = 0; f < 4; f++) {
      ctx.beginPath();
      ctx.moveTo(45 + f * 25, 40 - f * 10);
      ctx.quadraticCurveTo(100 + f * 20, 10 - f * 15, 155 - f * 15, 10 + f * 12);
      ctx.strokeStyle = '#DAA520';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Powerful Talons (Claws holding mythical power)
    ctx.fillStyle = '#FF9800';
    ctx.beginPath();
    ctx.moveTo(25, 90);
    ctx.lineTo(50, 135);
    ctx.lineTo(38, 142);
    ctx.lineTo(24, 115);
    ctx.lineTo(10, 142);
    ctx.lineTo(2, 135);
    ctx.lineTo(15, 90);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  });

  // Central Regal Torso / Royal Shield
  ctx.fillStyle = '#FFA000';
  ctx.beginPath();
  ctx.moveTo(0, -30);
  ctx.lineTo(32, 20);
  ctx.lineTo(28, 85);
  ctx.lineTo(0, 115);
  ctx.lineTo(-28, 85);
  ctx.lineTo(-32, 20);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Ornate central gem
  ctx.fillStyle = '#D32F2F';
  ctx.beginPath();
  ctx.arc(0, 35, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFDF00';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Majestic Tail Feathers
  ctx.fillStyle = '#FFD54F';
  ctx.beginPath();
  ctx.moveTo(0, 110);
  ctx.lineTo(35, 175);
  ctx.lineTo(15, 185);
  ctx.lineTo(0, 160);
  ctx.lineTo(-15, 185);
  ctx.lineTo(-35, 175);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();

  // Banner text at bottom: "ನಹಿ ಸತ್ಯಾತ್ ಪರೋ ಧರ್ಮಃ" (Mysore Royal Motto)
  ctx.font = 'bold 24px "Nirmala UI", "Segoe UI", sans-serif';
  ctx.fillStyle = '#FFDF00';
  ctx.textAlign = 'center';
  ctx.fillText('ನಹಿ ಸತ್ಯಾತ್ ಪರೋ ಧರ್ಮಃ', 256, 475);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 7. Royal Courtyard Sandstone & Terracotta Geometric Paving
export function createPalaceCourtyardPavingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm buff-cream sandstone base
  ctx.fillStyle = '#D7C7B3';
  ctx.fillRect(0, 0, 512, 512);

  // Large octagonal paving grid
  const step = 64;
  for (let y = 0; y < 512; y += step) {
    for (let x = 0; x < 512; x += step) {
      // Alternating terracotta and sandstone tiles
      const isRed = ((x + y) / step) % 2 === 0;
      ctx.fillStyle = isRed ? '#9B5B49' : '#CBB9A3';
      ctx.fillRect(x + 2, y + 2, step - 4, step - 4);

      // Inner diamond border
      ctx.strokeStyle = isRed ? '#BA7360' : '#E0D2C2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + step / 2, y + 6);
      ctx.lineTo(x + step - 6, y + step / 2);
      ctx.lineTo(x + step / 2, y + step - 6);
      ctx.lineTo(x + 6, y + step / 2);
      ctx.closePath();
      ctx.stroke();

      // Stone grain noise
      for (let n = 0; n < 12; n++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)';
        ctx.fillRect(x + Math.random() * step, y + Math.random() * step, 2, 2);
      }
    }
  }

  // Deep mortar lines
  ctx.strokeStyle = '#5E4C3D';
  ctx.lineWidth = 3;
  for (let i = 0; i <= 512; i += step) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}
