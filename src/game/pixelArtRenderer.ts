/**
 * Pixel Art Renderer for Abidar - The Cosmic Carpet Ride
 * Draws retro 16-bit Sega Genesis style sprites and backgrounds directly to HTML5 Canvas.
 */

import { PlayerState, Collectible, Obstacle, FloatingText, Particle, ParallaxPlanet, BossState, StageConfig, VowelLetter } from './types';

export class PixelArtRenderer {
  // Pre-rendered pixel cache maps for performance
  private spriteCache: Map<string, HTMLCanvasElement> = new Map();

  constructor() {
    this.initSpriteCache();
  }

  private initSpriteCache() {
    // Generate and cache base pixel graphics
    this.spriteCache.set('bowling_pin', this.createBowlingPinSprite());
    this.spriteCache.set('coffee_cup', this.createCoffeeCupSprite());
    this.spriteCache.set('golden_star', this.createGoldenStarSprite());
  }

  // Helper to create an offscreen pixel canvas
  private createOffscreen(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
  }

  // --- SPRITE GENERATORS ---

  private createBowlingPinSprite(): HTMLCanvasElement {
    const { canvas, ctx } = this.createOffscreen(24, 32);
    // Outer black outline
    ctx.fillStyle = '#110b29';
    ctx.fillRect(8, 2, 8, 4);
    ctx.fillRect(6, 6, 12, 6);
    ctx.fillRect(8, 12, 8, 4);
    ctx.fillRect(5, 16, 14, 12);
    ctx.fillRect(7, 28, 10, 3);

    // Body white/cream fill
    ctx.fillStyle = '#fffdf0';
    ctx.fillRect(9, 3, 6, 3);
    ctx.fillRect(7, 7, 10, 4);
    ctx.fillRect(9, 11, 6, 5);
    ctx.fillRect(6, 17, 12, 10);
    ctx.fillRect(8, 27, 8, 3);

    // Shading
    ctx.fillStyle = '#e2dbbe';
    ctx.fillRect(13, 7, 3, 4);
    ctx.fillRect(13, 17, 4, 10);

    // Red bands
    ctx.fillStyle = '#e62e2e';
    ctx.fillRect(8, 9, 8, 2);
    ctx.fillRect(8, 12, 8, 2);

    // Highlight
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, 4, 2, 2);
    ctx.fillRect(7, 18, 2, 6);

    return canvas;
  }

  private createCoffeeCupSprite(): HTMLCanvasElement {
    const { canvas, ctx } = this.createOffscreen(32, 32);
    // Steam particles
    ctx.fillStyle = 'rgba(255, 230, 180, 0.8)';
    ctx.fillRect(10, 2, 2, 4);
    ctx.fillRect(15, 0, 2, 5);
    ctx.fillRect(20, 3, 2, 4);

    // Outline
    ctx.fillStyle = '#221510';
    ctx.fillRect(6, 8, 18, 18);
    ctx.fillRect(24, 11, 6, 10);

    // Cup Body (golden/cream)
    ctx.fillStyle = '#fce4b8';
    ctx.fillRect(7, 9, 16, 16);

    // Shading
    ctx.fillStyle = '#dfab68';
    ctx.fillRect(18, 9, 5, 16);

    // Coffee Liquid Top
    ctx.fillStyle = '#5c3317';
    ctx.fillRect(8, 10, 14, 3);

    // Eye Symbol on Mug (The Gospel of Dimenuous Eye)
    ctx.fillStyle = '#2b1704';
    ctx.fillRect(11, 16, 8, 4);
    ctx.fillStyle = '#e6ac00';
    ctx.fillRect(13, 17, 4, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(14, 17, 2, 2);

    // Handle
    ctx.fillStyle = '#fce4b8';
    ctx.fillRect(24, 13, 4, 6);
    ctx.fillStyle = '#221510';
    ctx.fillRect(25, 14, 2, 4);

    return canvas;
  }

  private createGoldenStarSprite(): HTMLCanvasElement {
    const { canvas, ctx } = this.createOffscreen(28, 28);
    ctx.fillStyle = '#ffe600';
    // Star shape matrix
    const starMap = [
      '....XXXX....',
      '....XXXX....',
      '..XXXXXXXX..',
      '..XXXXXXXX..',
      'XXXXXXXXXXXX',
      '.XXXXXXXXXX.',
      '..XXXXXXXX..',
      '..XXXXXXXX..',
      '.XXXX..XXXX.',
      'XXXX....XXXX',
      'XX........XX'
    ];
    for (let r = 0; r < starMap.length; r++) {
      for (let c = 0; c < starMap[r].length; c++) {
        if (starMap[r][c] === 'X') {
          ctx.fillRect(c * 2 + 2, r * 2 + 3, 2, 2);
        }
      }
    }
    // Highlight center
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 8, 4, 4);

    return canvas;
  }

  // --- BACKGROUND & PARALLAX RENDERERS ---

  public drawSpaceBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    stage: StageConfig,
    gameTime: number
  ) {
    // Gradient Sky
    const gradStart = (stage && stage.bgGradStart) || '#0d0826';
    const gradEnd = (stage && stage.bgGradEnd) || '#1e0c38';
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, gradStart);
    grad.addColorStop(1, gradEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Nebulae (swirling glowing clouds in deep background)
    const nebulaColors = (stage && stage.nebulaColors) || ['rgba(80, 20, 140, 0.3)', 'rgba(20, 60, 160, 0.25)'];
    ctx.save();
    for (let i = 0; i < nebulaColors.length; i++) {
      const col = nebulaColors[i];
      const cx = (width * 0.3 + i * width * 0.4 + Math.sin(gameTime * 0.2 + i) * 80) % (width * 1.5) - width * 0.2;
      const cy = height * 0.3 + (i % 2) * height * 0.4;
      const r = Math.min(width, height) * 0.45;

      const nGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
      nGrad.addColorStop(0, col);
      nGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = nGrad;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
  }

  public drawStars(
    ctx: CanvasRenderingContext2D,
    stars: { x: number; y: number; speed: number; size: number; color: string; twinkle: number }[],
    width: number,
    gameTime: number
  ) {
    stars.forEach((s) => {
      ctx.fillStyle = s.color;
      const alpha = 0.5 + 0.5 * Math.sin(gameTime * 3 + s.twinkle);
      ctx.globalAlpha = alpha;
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
    });
    ctx.globalAlpha = 1.0;
  }

  public drawParallaxPlanets(
    ctx: CanvasRenderingContext2D,
    planets: ParallaxPlanet[],
    gameTime: number
  ) {
    planets.forEach((p) => {
      ctx.save();
      const px = Math.floor(p.x);
      const py = Math.floor(p.y);

      if (p.type === 'spiral_galaxy' || p.type === 'gas_giant') {
        // --- SPINNING SPIRAL GALAXY ---
        ctx.save();
        ctx.translate(px, py);

        // Tilt galaxy plane in 3D perspective
        ctx.rotate(-0.4);
        ctx.scale(1.1, 0.48);

        // Slow rotation over time
        const rotSpeed = 0.22;
        ctx.rotate(gameTime * rotSpeed);

        const radius = p.radius || 50;

        // 1. Radiant Core Glow
        const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.5);
        radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        radGrad.addColorStop(0.15, 'rgba(255, 215, 0, 0.8)');
        radGrad.addColorStop(0.35, 'rgba(0, 229, 255, 0.6)');
        radGrad.addColorStop(0.65, 'rgba(180, 0, 255, 0.35)');
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // 2. Spiral Arms (2 main arms + cosmic star dust trails)
        const numArms = 2;
        const armLength = 50;
        const colorPalette = [
          '#ffffff',
          '#ffd700',
          '#00ffff',
          '#0099ff',
          '#cc00ff',
          '#7000cc'
        ];

        for (let arm = 0; arm < numArms; arm++) {
          const armAngleOffset = arm * Math.PI; // 180 degrees opposite
          for (let i = 0; i < armLength; i++) {
            const t = i / armLength; // 0..1
            const angle = t * Math.PI * 2.8 + armAngleOffset;
            const r = t * radius * 1.35;

            const armX = r * Math.cos(angle);
            const armY = r * Math.sin(angle);

            // Palette index based on distance from core
            const colorIdx = Math.min(
              Math.floor(t * colorPalette.length),
              colorPalette.length - 1
            );
            ctx.fillStyle = colorPalette[colorIdx];

            // Primary star size in arm
            const size = Math.max(2, (1 - t * 0.5) * 5);
            ctx.fillRect(
              Math.floor(armX - size / 2),
              Math.floor(armY - size / 2),
              Math.ceil(size),
              Math.ceil(size)
            );

            // Secondary scattered star dust around arm
            if (i % 2 === 0) {
              const spread = (1 - t * 0.2) * 7;
              const sx = armX + Math.sin(i * 1.9) * spread;
              const sy = armY + Math.cos(i * 2.7) * spread;
              ctx.fillStyle = colorPalette[Math.min(colorIdx + 1, colorPalette.length - 1)];
              ctx.fillRect(Math.floor(sx), Math.floor(sy), 2, 2);
            }
          }
        }

        // 3. Supermassive Core Star
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();

        // Cross sparkle flare on core
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-14, -1, 28, 2);
        ctx.fillRect(-1, -14, 2, 28);

        ctx.restore();
      } else if (p.type === 'temple_island') {
        // Floating Cosmic Temple Island with Waterfalls
        ctx.fillStyle = '#221644';
        // Floating rock base
        ctx.beginPath();
        ctx.moveTo(px - 60, py);
        ctx.lineTo(px + 60, py);
        ctx.lineTo(px + 30, py + 45);
        ctx.lineTo(px - 20, py + 60);
        ctx.closePath();
        ctx.fill();

        // Top Grass/Gold carpet
        ctx.fillStyle = '#3db87a';
        ctx.fillRect(px - 62, py - 4, 124, 6);

        // Golden Temple Domes
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(px - 30, py - 30, 60, 26);
        ctx.fillRect(px - 15, py - 48, 30, 20);

        // Dome Roof
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(px, py - 48, 16, Math.PI, 0);
        ctx.fill();

        // Cascading Cosmic Waterfall
        ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.fillRect(px + 10, py, 12, 70);
        ctx.fillRect(px - 25, py, 8, 55);
      }
      ctx.restore();
    });
  }

  // --- THE DUDE & CARPET RENDERER ---

  public drawPlayer(
    ctx: CanvasRenderingContext2D,
    player: PlayerState,
    gameTime: number
  ) {
    ctx.save();

    const px = Math.floor(player.x);
    const py = Math.floor(player.y);

    // Floating bobbing motion
    const floatY = Math.sin(gameTime * 4) * 4;
    const finalY = py + floatY;

    // Carpet tilt angle based on vertical velocity
    const tilt = Math.max(-0.2, Math.min(0.2, player.vy * 0.03));

    ctx.translate(px, finalY);
    ctx.rotate(tilt);

    // --- DYNAMICALLY FLOWING CARPET PARTICLE TRAIL ---
    const isHighEnergy = player.abidarEnergy > 80 || player.isAbiding;
    const trailColor = player.spiralModeTime > 0
      ? '#00ffff'
      : isHighEnergy
      ? '#ffd700'
      : player.isMaterialMode
      ? '#885522'
      : '#ffaa00';
    const accentColor = player.spiralModeTime > 0
      ? '#ff00ff'
      : isHighEnergy
      ? '#ffffff'
      : '#ff3366';

    ctx.save();
    const trailLength = 240; // Extended length
    const history = player.trailHistory || [];

    // Trailing Stardust & Sparkle Cluster flowing along the tail
    for (let i = 0; i < 22; i++) {
      const dist = 45 + ((i * 12 + gameTime * 200) % trailLength);
      const ratio = dist / trailLength;

      const wave = Math.sin(gameTime * 13 - ratio * Math.PI * 3.2 + i) * (6 + ratio * 20);
      const inertiaLag = -player.vy * 0.42 * Math.pow(ratio, 1.15);

      let historyOffset = 0;
      if (history.length > 1) {
        const histIdx = Math.min(Math.floor(ratio * (history.length - 1)), history.length - 1);
        const histPt = history[histIdx];
        if (histPt) {
          historyOffset = (histPt.y - player.y) * 0.85;
        }
      }

      const sparkX = -dist;
      const sparkY = 18 + wave + inertiaLag + historyOffset + (Math.sin(i * 2.8) * 8);
      const sparkSize = Math.max(1.5, (1 - ratio * 0.65) * (Math.sin(gameTime * 18 + i) * 2 + 4));

      ctx.fillStyle = i % 2 === 0 ? trailColor : accentColor;
      ctx.globalAlpha = Math.max(0.1, 1 - ratio * 0.8);
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 8;
      ctx.fillRect(Math.floor(sparkX), Math.floor(sparkY), Math.ceil(sparkSize), Math.ceil(sparkSize));
    }
    ctx.restore();

    // --- ABIDE & SPIRAL GOLDEN AURA ---
    if (player.isAbiding || player.spiralModeTime > 0) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.save();
      ctx.beginPath();
      const auraR = 50 + Math.sin(gameTime * 8) * 4;
      ctx.arc(0, 0, auraR, 0, Math.PI * 2);
      ctx.stroke();

      // Golden Spiral line around player
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 4; a += 0.2) {
        const r = a * 4;
        const sx = Math.cos(a + gameTime * 5) * r;
        const sy = Math.sin(a + gameTime * 5) * r;
        if (a === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.globalAlpha = 0.4;
      ctx.stroke();
      ctx.restore();
    }

    // --- INVULNERABILITY / SHIELD FLASH ---
    if (player.invulnerableTime > 0 && Math.floor(gameTime * 20) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // --- 16-BIT CARPET ---
    // Carpet Base (Ornate Red/Gold Oriental Pattern)
    ctx.fillStyle = '#2b000a'; // Dark border
    ctx.fillRect(-52, 10, 104, 16);

    ctx.fillStyle = '#a81530'; // Crimson velvet fill
    ctx.fillRect(-50, 12, 100, 12);

    // Gold carpet fringe/pattern border
    ctx.fillStyle = '#f5c542';
    ctx.fillRect(-50, 12, 100, 2);
    ctx.fillRect(-50, 22, 100, 2);
    for (let x = -48; x < 48; x += 8) {
      ctx.fillRect(x, 14, 4, 8); // Diamond pattern
    }

    // Tassels at 4 corners
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(-54, 20, 6, 8); // Rear tassel
    ctx.fillRect(48, 20, 6, 8);  // Front tassel

    // --- THE DUDE ---
    // Sitting Cross-Legged on Carpet
    const bodyX = -12;
    const bodyY = -28;

    // Classic Blue Jeans (Cross-legged)
    ctx.fillStyle = '#224477'; // Blue jeans fill
    ctx.fillRect(bodyX - 18, bodyY + 28, 38, 12);
    ctx.fillStyle = '#3a66aa'; // Denim highlights / knees
    ctx.fillRect(bodyX - 16, bodyY + 30, 14, 4);
    ctx.fillRect(bodyX + 4, bodyY + 30, 14, 4);
    ctx.fillStyle = '#152b4d'; // Seam / shadow
    ctx.fillRect(bodyX - 1, bodyY + 28, 2, 12);

    // Black Leather Jacket Body
    ctx.fillStyle = '#151518'; // Black leather base
    ctx.fillRect(bodyX - 12, bodyY + 8, 26, 22);

    // Leather Jacket Collar, Lapels & Zipper Detail
    ctx.fillStyle = '#2a2a30'; // Leather collar & shoulder highlight
    ctx.fillRect(bodyX - 12, bodyY + 8, 26, 4);
    ctx.fillRect(bodyX - 12, bodyY + 8, 4, 22);
    ctx.fillStyle = '#666670'; // Metallic zipper line
    ctx.fillRect(bodyX + 1, bodyY + 8, 2, 22);
    ctx.fillStyle = '#0d0d10'; // Inner jacket fold shadow
    ctx.fillRect(bodyX + 3, bodyY + 12, 8, 18);

    // Left Arm holding Coffee Mug (Black Leather Sleeve)
    ctx.fillStyle = '#151518'; // Black leather sleeve
    ctx.fillRect(bodyX + 10, bodyY + 12, 14, 8);
    ctx.fillStyle = '#2a2a30'; // Sleeve cuff highlight
    ctx.fillRect(bodyX + 22, bodyY + 12, 2, 8);

    // Mug in hand
    ctx.drawImage(this.spriteCache.get('coffee_cup')!, bodyX + 22, bodyY + 4, 18, 18);

    // Right Arm resting casually (Black Leather Sleeve)
    ctx.fillStyle = '#151518';
    ctx.fillRect(bodyX - 16, bodyY + 14, 10, 8);
    ctx.fillStyle = '#2a2a30';
    ctx.fillRect(bodyX - 16, bodyY + 14, 2, 8);

    // --- HEAD, BEARD & SHORT HAIR ---
    // Skin
    ctx.fillStyle = '#e5a77d';
    ctx.fillRect(bodyX - 4, bodyY - 10, 16, 18);

    // Neat Short Hair (No back hair flowing down)
    ctx.fillStyle = '#24170e'; // Dark brown short crop
    ctx.fillRect(bodyX - 5, bodyY - 14, 19, 7); // Top hair crop
    ctx.fillRect(bodyX - 6, bodyY - 11, 4, 7);  // Sideburn / back short trim
    ctx.fillStyle = '#422c1d'; // Short hair texture / top highlight
    ctx.fillRect(bodyX - 3, bodyY - 13, 14, 2);

    // Beard
    ctx.fillStyle = '#24170e';
    ctx.fillRect(bodyX - 4, bodyY + 2, 18, 8);
    ctx.fillRect(bodyX - 2, bodyY + 9, 14, 3);

    // --- EYES (NO SUNGLASSES) ---
    // Eye Whites
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bodyX + 2, bodyY - 6, 10, 4);
    // Dark Pupils (Looking calmly forward)
    ctx.fillStyle = '#111111';
    ctx.fillRect(bodyX + 4, bodyY - 5, 3, 3);
    ctx.fillRect(bodyX + 8, bodyY - 5, 3, 3);
    // Eyebrows
    ctx.fillStyle = '#24170e';
    ctx.fillRect(bodyX + 1, bodyY - 8, 11, 2);

    // Calm Smile / Expression
    ctx.fillStyle = '#111111';
    ctx.fillRect(bodyX + 5, bodyY + 4, 5, 2);

    // --- ELEMENTAL COLOR AURAS & POWER-UP SHIELDS AROUND THE PLAYER ---
    if (player.powerUpTimer > 0 || player.shieldActive || player.speedBoostActive || player.timeSlowActive || player.magnetActive) {
      ctx.save();
      const pType = player.activePowerUp || (player.shieldActive ? 'fire' : player.speedBoostActive ? 'air' : player.timeSlowActive ? 'water' : player.magnetActive ? 'earth' : null);

      if (pType === 'fire' || player.shieldActive) {
        // 🔥 FIRE AURA: Fiery Blazing Shield & Heat Wave
        ctx.shadowColor = '#ff4400';
        ctx.shadowBlur = 22;

        const pulseR = 52 + Math.sin(gameTime * 12) * 4;
        const fireGrad = ctx.createRadialGradient(0, 0, 25, 0, 0, pulseR);
        fireGrad.addColorStop(0, 'rgba(255, 220, 0, 0.1)');
        fireGrad.addColorStop(0.6, 'rgba(255, 60, 0, 0.35)');
        fireGrad.addColorStop(1, 'rgba(255, 0, 0, 0.8)');
        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
        ctx.fill();

        // Flickering flame spikes orbiting the shield boundary
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const ang = i * (Math.PI / 4) + gameTime * 6;
          const fx = Math.cos(ang) * (pulseR + Math.sin(gameTime * 18 + i) * 5);
          const fy = Math.sin(ang) * (pulseR + Math.sin(gameTime * 18 + i) * 5);
          if (i === 0) ctx.moveTo(fx, fy);
          else ctx.lineTo(fx, fy);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = '#ff2200';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 48, 0, Math.PI * 2);
        ctx.stroke();

      } else if (pType === 'air' || player.speedBoostActive) {
        // 🌀 AIR AURA: Aerodynamic Wind Cyclone Barrier
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 20;

        for (let ring = 0; ring < 2; ring++) {
          ctx.strokeStyle = ring === 0 ? '#00ffff' : '#80f0ff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          const rAngle = (ring === 0 ? 1 : -1) * gameTime * 8;
          ctx.ellipse(0, 0, 56, 26, rAngle, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(0, 225, 255, 0.25)';
        ctx.beginPath();
        ctx.moveTo(30, -20);
        ctx.lineTo(68, 0);
        ctx.lineTo(30, 20);
        ctx.closePath();
        ctx.fill();

      } else if (pType === 'water' || player.timeSlowActive) {
        // 💧 WATER AURA: Tranquil Hydro Bubble
        ctx.shadowColor = '#0066ff';
        ctx.shadowBlur = 22;

        const waveR = 50 + Math.sin(gameTime * 5) * 3;
        const waterGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, waveR);
        waterGrad.addColorStop(0, 'rgba(128, 229, 255, 0.15)');
        waterGrad.addColorStop(0.7, 'rgba(0, 102, 255, 0.35)');
        waterGrad.addColorStop(1, 'rgba(0, 240, 255, 0.7)');
        ctx.fillStyle = waterGrad;
        ctx.beginPath();
        ctx.arc(0, 0, waveR, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#e0f7ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(-15, -15, 32, -Math.PI * 0.7, -Math.PI * 0.2);
        ctx.stroke();

        ctx.fillStyle = '#80e5ff';
        for (let i = 0; i < 4; i++) {
          const ang = i * (Math.PI / 2) + gameTime * 3;
          const dx = Math.cos(ang) * (waveR + 4);
          const dy = Math.sin(ang) * (waveR + 4);
          ctx.beginPath();
          ctx.arc(dx, dy, 4, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (pType === 'earth' || player.magnetActive) {
        // 🌱 EARTH AURA: Geo-Magnetic Crystal Shield
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 20;

        ctx.strokeStyle = '#22cc44';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        const hexR = 52 + Math.sin(gameTime * 4) * 2;
        for (let i = 0; i < 6; i++) {
          const ang = i * (Math.PI / 3) + gameTime * 1.5;
          const hx = Math.cos(ang) * hexR;
          const hy = Math.sin(ang) * hexR;
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = '#88ff00';
        for (let i = 0; i < 4; i++) {
          const ang = i * (Math.PI / 2) - gameTime * 4;
          const cx = Math.cos(ang) * 44;
          const cy = Math.sin(ang) * 44;
          ctx.fillRect(cx - 3, cy - 3, 6, 6);
        }
      }

      ctx.restore();
    }

    ctx.restore();
  }

  // --- COLLECTIBLES RENDERER ---

  public drawCollectibles(
    ctx: CanvasRenderingContext2D,
    collectibles: Collectible[],
    gameTime: number
  ) {
    collectibles.forEach((c) => {
      if (!c.active) return;
      ctx.save();
      const cx = Math.floor(c.x);
      const cy = Math.floor(c.y);

      // Subtle bobbing animation
      const bobY = Math.sin(gameTime * 5 + c.pulsePhase) * 3;

      if (c.type === 'bowling_pin') {
        const sprite = this.spriteCache.get('bowling_pin')!;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 12;
        ctx.drawImage(sprite, cx - 12, cy - 16 + bobY);
        ctx.shadowBlur = 0;
      } else if (c.type === 'coffee_cup') {
        const sprite = this.spriteCache.get('coffee_cup')!;
        ctx.drawImage(sprite, cx - 16, cy - 16 + bobY);
      } else if (c.type === 'golden_star') {
        const sprite = this.spriteCache.get('golden_star')!;
        ctx.save();
        ctx.translate(cx, cy + bobY);
        ctx.rotate(gameTime * 2);
        ctx.drawImage(sprite, -14, -14);
        ctx.restore();
      } else if (c.type === 'ieoua_orb') {
        // IEOUA Sacred Vowel Orb
        this.drawIEOUAOrb(ctx, cx, cy + bobY, c.vowel || 'I', gameTime);
      } else if (c.type === 'spiral_orb') {
        // Golden Spiral Magnet Orb
        this.drawSpiralOrb(ctx, cx, cy + bobY, gameTime);
      } else if (c.type.startsWith('elemental_')) {
        // Elemental Orbs (Fire, Air, Water, Earth)
        const elemType = c.type.replace('elemental_', '');
        this.drawElementalOrb(ctx, cx, cy + bobY, elemType, gameTime);
      }

      ctx.restore();
    });
  }

  private drawIEOUAOrb(ctx: CanvasRenderingContext2D, x: number, y: number, vowel: string, gameTime: number) {
    const vowelColors: Record<string, string> = {
      I: '#00ffff', // Cyan
      E: '#ff00ff', // Magenta
      O: '#ffd700', // Gold
      U: '#00ff66', // Emerald
      A: '#aa33ff'  // Violet
    };
    const col = vowelColors[vowel] || '#ffffff';

    // Outer Glowing Ring
    ctx.shadowColor = col;
    ctx.shadowBlur = 12;

    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Dark Center
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#110b24';
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();

    // Pixel Vowel Text Letter
    ctx.fillStyle = col;
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(vowel, x, y + 1);
  }

  private drawSpiralOrb(ctx: CanvasRenderingContext2D, x: number, y: number, gameTime: number) {
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#110a24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 4; a += 0.3) {
      const r = a * 2.5;
      const sx = x + Math.cos(a + gameTime * 8) * r;
      const sy = y + Math.sin(a + gameTime * 8) * r;
      if (a === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  private drawElementalOrb(ctx: CanvasRenderingContext2D, x: number, y: number, elem: string, gameTime: number) {
    ctx.save();

    if (elem === 'fire') {
      // FIRE ORB: Flaming heat aura & dancing embers
      const colMain = '#ff3300';
      const colGlow = '#ff9900';

      const radGrad = ctx.createRadialGradient(x, y, 2, x, y, 26);
      radGrad.addColorStop(0, '#ffffff');
      radGrad.addColorStop(0.35, colGlow);
      radGrad.addColorStop(0.75, colMain);
      radGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();

      // Flickering flame tips
      ctx.fillStyle = '#ffcc00';
      for (let i = 0; i < 5; i++) {
        const ang = i * (Math.PI * 2 / 5) + gameTime * 4;
        const flR = 16 + Math.sin(gameTime * 12 + i * 2) * 4;
        const fx = x + Math.cos(ang) * flR;
        const fy = y + Math.sin(ang) * flR - 2;
        ctx.beginPath();
        ctx.arc(fx, fy, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowColor = colGlow;
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ff2200';
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔥', x, y + 1);

    } else if (elem === 'air') {
      // AIR ORB: Swirling dual gust rings & sky-blue core
      const colMain = '#00ccff';
      const colGlow = '#80f0ff';

      ctx.strokeStyle = colGlow;
      ctx.lineWidth = 2;
      ctx.shadowColor = colMain;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.ellipse(x, y, 24, 9, gameTime * 3, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(x, y, 20, 7, -gameTime * 2.5, 0, Math.PI * 2);
      ctx.stroke();

      const grad = ctx.createRadialGradient(x, y, 2, x, y, 14);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, colMain);
      grad.addColorStop(1, '#0055aa');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌀', x, y + 1);

    } else if (elem === 'water') {
      // WATER ORB: Pulsing liquid wave & droplets
      const colMain = '#0066ff';
      const colGlow = '#00f0ff';

      const waveR = 18 + Math.sin(gameTime * 6) * 3;
      const grad = ctx.createRadialGradient(x, y, 2, x, y, waveR + 8);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(0.4, colGlow);
      grad.addColorStop(0.8, colMain);
      grad.addColorStop(1, 'rgba(0, 50, 200, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, waveR + 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#80e5ff';
      for (let i = 0; i < 3; i++) {
        const ang = i * (Math.PI * 2 / 3) - gameTime * 3;
        const dx = x + Math.cos(ang) * 20;
        const dy = y + Math.sin(ang) * 20;
        ctx.beginPath();
        ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowColor = colGlow;
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#0044cc';
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💧', x, y + 1);

    } else if (elem === 'earth') {
      // EARTH ORB: Hexagonal geo-crystal forcefield & leaves
      const colMain = '#22cc44';
      const colGlow = '#a0ff33';

      ctx.shadowColor = colMain;
      ctx.shadowBlur = 12;

      ctx.strokeStyle = colGlow;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const hexR = 22 + Math.sin(gameTime * 4) * 2;
      for (let i = 0; i < 6; i++) {
        const ang = i * (Math.PI / 3) + gameTime * 0.8;
        const hx = x + Math.cos(ang) * hexR;
        const hy = y + Math.sin(ang) * hexR;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = '#88ff00';
      for (let i = 0; i < 4; i++) {
        const ang = i * (Math.PI / 2) + gameTime * 2.5;
        const cx = x + Math.cos(ang) * 19;
        const cy = y + Math.sin(ang) * 19;
        ctx.fillRect(cx - 2, cy - 2, 4, 4);
      }

      const grad = ctx.createRadialGradient(x, y, 2, x, y, 14);
      grad.addColorStop(0, '#a0ff33');
      grad.addColorStop(0.6, colMain);
      grad.addColorStop(1, '#115511');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌱', x, y + 1);
    }

    ctx.restore();
  }

  // --- OBSTACLES RENDERER ---

  public drawObstacles(
    ctx: CanvasRenderingContext2D,
    obstacles: Obstacle[],
    gameTime: number
  ) {
    obstacles.forEach((o) => {
      if (!o.active) return;
      ctx.save();
      const ox = Math.floor(o.x);
      const oy = Math.floor(o.y);

      if (o.type === 'the_void') {
        // Swirling Dark Energy Void Orb
        ctx.fillStyle = '#180029';
        ctx.beginPath();
        ctx.arc(ox, oy, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#c800ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ox, oy, 22 + Math.sin(gameTime * 10) * 3, 0, Math.PI * 2);
        ctx.stroke();

        // Pulsing spikes
        ctx.fillStyle = '#aa00ff';
        for (let i = 0; i < 6; i++) {
          const ang = i * (Math.PI / 3) + gameTime * 3;
          const sx = ox + Math.cos(ang) * 26;
          const sy = oy + Math.sin(ang) * 26;
          ctx.fillRect(sx - 2, sy - 2, 4, 4);
        }
      } else if (o.type === 'the_false_one') {
        // Distorted Glitch Shadow Duplicate of The Dude
        ctx.fillStyle = 'rgba(255, 0, 85, 0.7)';
        ctx.fillRect(ox - 20, oy - 20, 40, 40);

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('FALSE', ox, oy + 4);
      } else if (o.type === 'the_projector') {
        // Floating CRT TV Screen displaying floating eyes
        ctx.fillStyle = '#333344';
        ctx.fillRect(ox - 22, oy - 18, 44, 36);
        ctx.fillStyle = '#11111a';
        ctx.fillRect(ox - 18, oy - 14, 36, 28);

        // Screen static eye
        ctx.fillStyle = '#00ffcc';
        ctx.fillRect(ox - 8, oy - 4, 16, 8);
        ctx.fillStyle = '#000000';
        ctx.fillRect(ox - 2, oy - 2, 4, 4);
      } else if (o.type === 'the_agitator') {
        // Crackling Chaos Plasma Cloud
        ctx.fillStyle = '#ff2200';
        ctx.beginPath();
        ctx.arc(ox, oy, 20 + Math.sin(gameTime * 20) * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox - 15, oy - 10);
        ctx.lineTo(ox, oy + 10);
        ctx.lineTo(ox + 15, oy - 10);
        ctx.stroke();
      } else if (o.type === 'the_materialist') {
        // Heavy Golden Gold Bar / Anvil pulling down
        ctx.fillStyle = '#cc9900';
        ctx.fillRect(ox - 20, oy - 12, 40, 24);
        ctx.fillStyle = '#ffee66';
        ctx.fillRect(ox - 18, oy - 10, 36, 4);
        ctx.fillStyle = '#332200';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('HEAVY', ox, oy + 4);
      } else if (o.type === 'the_silencer') {
        // Dark Nullifying Field Ring
        ctx.strokeStyle = '#440066';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(ox, oy, 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(20, 0, 40, 0.5)';
        ctx.fill();
      }

      ctx.restore();
    });
  }

  // --- THE GREAT VOID BOSS RENDERER ---

  public drawBoss(
    ctx: CanvasRenderingContext2D,
    boss: BossState,
    gameTime: number,
    pinsCollected: number = 0,
    pinsRequired: number = 5
  ) {
    if (!boss.active) return;
    ctx.save();
    const bx = Math.floor(boss.x);
    const by = Math.floor(boss.y);

    // Giant Swirling Cosmic Vortex
    const r = 120 + Math.sin(gameTime * 4) * 12;

    // Dark Inner Core with Golden Starry Center
    const grad = ctx.createRadialGradient(bx, by, 10, bx, by, r);
    grad.addColorStop(0, '#ffd700');
    grad.addColorStop(0.2, '#000000');
    grad.addColorStop(0.6, '#3b005c');
    grad.addColorStop(1, 'rgba(160, 0, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();

    // Pulsing Outer Spiral Tendrils (Golden & Magenta arms)
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 6; a += 0.15) {
      const sr = a * 19;
      const sx = bx + Math.cos(a + gameTime * 2.5) * sr;
      const sy = by + Math.sin(a + gameTime * 2.5) * sr;
      if (a === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    ctx.strokeStyle = '#ff00aa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 6; a += 0.15) {
      const sr = a * 19;
      const sx = bx + Math.cos(a + Math.PI + gameTime * 2.5) * sr;
      const sy = by + Math.sin(a + Math.PI + gameTime * 2.5) * sr;
      if (a === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Portal Name & Pin Counter
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 10;
    ctx.fillText('🌀 GREAT VOID SPIRAL 🌀', bx, by - r - 25);
    ctx.shadowBlur = 0;

    const hasEnoughPins = pinsCollected >= pinsRequired;
    ctx.fillStyle = hasEnoughPins ? '#00ffff' : '#ff9900';
    ctx.font = 'bold 13px monospace';
    ctx.shadowColor = hasEnoughPins ? '#00ffff' : '#ff9900';
    ctx.shadowBlur = 8;
    ctx.fillText(
      hasEnoughPins
        ? '✨ TRANSCENDENCE READY! FLY INTO THE SPIRAL! ✨'
        : `🎳 PINOS DE BOLICHE: ${pinsCollected} / ${pinsRequired} PARA ENTRAR`,
      bx,
      by - r - 8
    );
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // --- PARTICLES & FLOATING TEXT RENDERERS ---

  public drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
    particles.forEach((p) => {
      ctx.save();
      const lifeRatio = Math.max(0, p.life / p.maxLife);
      const currentSize = Math.max(1, p.size * lifeRatio);
      ctx.globalAlpha = lifeRatio;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;

      if (p.shape === 'star') {
        ctx.beginPath();
        const s = currentSize * 1.4;
        ctx.moveTo(p.x, p.y - s);
        ctx.lineTo(p.x + s * 0.3, p.y - s * 0.3);
        ctx.lineTo(p.x + s, p.y);
        ctx.lineTo(p.x + s * 0.3, p.y + s * 0.3);
        ctx.lineTo(p.x, p.y + s);
        ctx.lineTo(p.x - s * 0.3, p.y + s * 0.3);
        ctx.lineTo(p.x - s, p.y);
        ctx.lineTo(p.x - s * 0.3, p.y - s * 0.3);
        ctx.closePath();
        ctx.fill();
      } else if (p.shape === 'spark') {
        const len = Math.max(4, Math.hypot(p.vx, p.vy) * 0.06 * lifeRatio);
        const angle = Math.atan2(p.vy, p.vx);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(1.5, currentSize * 0.8);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - Math.cos(angle) * len, p.y - Math.sin(angle) * len);
        ctx.stroke();
      } else if (p.shape === 'droplet') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x - currentSize * 0.3, p.y - currentSize * 0.3, currentSize * 0.5, currentSize * 0.5);
      } else if (p.shape === 'flame') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffa0';
        ctx.fillRect(p.x - 1, p.y - currentSize, 2, currentSize);
      } else {
        ctx.fillRect(Math.floor(p.x - currentSize / 2), Math.floor(p.y - currentSize / 2), Math.ceil(currentSize), Math.ceil(currentSize));
      }

      ctx.restore();
    });
  }

  public drawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingText[]) {
    texts.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${Math.floor(14 * ft.scale)}px monospace`;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, Math.floor(ft.x), Math.floor(ft.y));
      ctx.restore();
    });
  }

  // --- RETRO HUD RENDERER ---

  public drawHUD(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    player: PlayerState,
    stage: StageConfig,
    gameTime: number
  ) {
    ctx.save();

    // Top Bar Frame Background - Crisp Dark Pixel Panel
    ctx.fillStyle = 'rgba(5, 5, 21, 0.9)';
    ctx.fillRect(0, 0, width, 56);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, 54, width, 2);

    // --- TOP LEFT: PORTRAIT & VIDAS ---
    // Frame
    ctx.fillStyle = '#0a0518';
    ctx.fillRect(12, 6, 42, 42);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 6, 42, 42);

    // Mini Dude Face in portrait
    ctx.fillStyle = '#e5a77d';
    ctx.fillRect(22, 16, 22, 22);
    ctx.fillStyle = '#3a2012';
    ctx.fillRect(18, 12, 30, 8); // Hair
    ctx.fillRect(20, 28, 26, 8); // Beard
    ctx.fillStyle = '#111';
    ctx.fillRect(26, 20, 14, 4); // Glasses

    // Lives Label & Hearts
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('THE DUDE', 62, 18);

    for (let i = 0; i < player.maxLives; i++) {
      ctx.fillStyle = i < player.lives ? '#ff2255' : '#442233';
      const hx = 62 + i * 22;
      const hy = 24;
      // Pixel Heart
      ctx.fillRect(hx, hy + 2, 14, 10);
      ctx.fillRect(hx + 2, hy, 4, 14);
      ctx.fillRect(hx + 8, hy, 4, 14);
    }

    // --- TOP CENTER: ABIDAR ENERGY METER ---
    const barWidth = 180;
    const barHeight = 14;
    const barX = Math.floor(width / 2 - barWidth / 2);
    const barY = 24;

    // Title
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ABIDAR ENERGY', width / 2, 16);
    ctx.shadowBlur = 0;

    // Energy Bar Frame
    ctx.fillStyle = '#000000';
    ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);

    // Energy Fill (Cyan / Blue gradient from design theme)
    const fillWidth = Math.max(0, Math.min(barWidth, (player.abidarEnergy / 100) * barWidth));
    const energyGrad = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
    if (player.isMaterialMode) {
      energyGrad.addColorStop(0, '#ff3300');
      energyGrad.addColorStop(1, '#881100');
    } else {
      energyGrad.addColorStop(0, '#00ffff');
      energyGrad.addColorStop(0.5, '#3b82f6');
      energyGrad.addColorStop(1, '#4f46e5');
    }
    ctx.fillStyle = energyGrad;
    ctx.fillRect(barX, barY, fillWidth, barHeight);

    // Glow line on energy bar
    if (fillWidth > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(barX + fillWidth - 3, barY, 3, barHeight);
    }

    // --- TOP RIGHT-CENTER: PONTOS & COMBO ---
    // Positioned at x=600 right-aligned so x=610..800 is reserved for top-right HTML Pause Button
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px monospace';
    ctx.fillText('PONTOS', 600, 16);

    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 18px monospace';
    const scoreStr = player.score.toString().padStart(6, '0');
    ctx.fillText(scoreStr, 600, 34);
    ctx.shadowBlur = 0;

    // Combo Indicator
    if (player.combo > 1) {
      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`COMBO x${player.combo}`, 600, 48);
    }

    // --- BOTTOM HUD OVERLAYS ---
    // Bottom Left: Sacred IEOUA Vowel Slots
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(5, 5, 21, 0.9)';
    ctx.fillRect(10, height - 42, 190, 32);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(10, height - 42, 190, 32);

    const vowels: VowelLetter[] = ['I', 'E', 'O', 'U', 'A'];
    const ieouaProgress = (player && player.ieouaProgress) || [];
    vowels.forEach((v, idx) => {
      const vx = 22 + idx * 34;
      const vy = height - 26;
      const collected = ieouaProgress.includes(v);

      ctx.fillStyle = collected ? '#00ffff' : '#1a1033';
      ctx.fillRect(vx - 10, height - 37, 26, 22);

      if (collected) {
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#000000';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      }
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(v, vx + 3, vy);
      ctx.shadowBlur = 0;
    });

    // Bottom Center: Stage & Abide Banner
    ctx.textAlign = 'center';
    if (player.isAbiding) {
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 16px monospace';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 12;
      ctx.fillText('— ABIDING — (+1000 PRESENCE)', width / 2, height - 20);
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 14px monospace';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 8;
      ctx.fillText('MANTENHA A PRESENÇA', width / 2, height - 18);
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px monospace';
      const stageTitle = (stage && stage.title) ? stage.title.toUpperCase() : 'COSMOS';
      ctx.fillText(`STAGE: ${stageTitle}`, width / 2, height - 34);
    }

    ctx.restore();
  }
}

export const pixelRenderer = new PixelArtRenderer();
