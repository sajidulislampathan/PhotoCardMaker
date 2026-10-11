import { CardConfig, GradientDef, PhotoItem } from '../types';

export interface CanvasDimensions {
  width: number;
  height: number;
  dividerY: number;
}

export function getCanvasDimensions(aspectRatio: CardConfig['aspectRatio'], bannerHeightPercent: number): CanvasDimensions {
  let width = 1080;
  let height = 1080;

  switch (aspectRatio) {
    case '1:1':
      width = 1080;
      height = 1080;
      break;
    case '4:5':
      width = 1080;
      height = 1350;
      break;
    case '16:9':
      width = 1920;
      height = 1080;
      break;
    case '9:16':
      width = 1080;
      height = 1920;
      break;
  }

  // bannerHeightPercent is between 25 and 45
  const bannerH = (height * bannerHeightPercent) / 100;
  const dividerY = Math.round(height - bannerH);

  return { width, height, dividerY };
}

// ── COLOR HELPERS ──────────────────────────────────────────────────────────
export function hexAlpha(hex: string, a: number): string {
  if (!hex || !hex.startsWith('#')) return `rgba(255,255,255,${a})`;
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length >= 7) {
    r = parseInt(hex.slice(1, 3), 16) || 0;
    g = parseInt(hex.slice(3, 5), 16) || 0;
    b = parseInt(hex.slice(5, 7), 16) || 0;
  }
  return `rgba(${r},${g},${b},${a})`;
}

// ── ROUNDED RECTANGLE HELPER ───────────────────────────────────────────────
export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── VECTOR ICONS ON CANVAS ────────────────────────────────────────────────
export function drawGlobeIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.1);
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.stroke();

  // Horizontal line
  ctx.beginPath();
  ctx.moveTo(cx - size / 2, cy);
  ctx.lineTo(cx + size / 2, cy);
  ctx.stroke();

  // Vertical ellipse
  ctx.beginPath();
  ctx.ellipse(cx, cy, size * 0.22, size / 2, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawFacebookIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string = '#ffffff'): void {
  ctx.save();
  // Facebook blue circle
  ctx.fillStyle = '#1877F2';
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // 'f' character
  ctx.fillStyle = color;
  ctx.font = `bold ${Math.round(size * 0.72)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('f', cx + size * 0.05, cy + size * 0.06);
  ctx.restore();
}

export function drawYouTubeIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number): void {
  ctx.save();
  const w = size * 1.25;
  const h = size * 0.9;
  ctx.fillStyle = '#FF0000';
  drawRoundRect(ctx, cx - w / 2, cy - h / 2, w, h, size * 0.25);
  ctx.fill();

  // Play triangle
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  const tw = size * 0.35;
  const th = size * 0.38;
  ctx.moveTo(cx - tw / 2, cy - th / 2);
  ctx.lineTo(cx + tw * 0.7, cy);
  ctx.lineTo(cx - tw / 2, cy + th / 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawInstagramIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number): void {
  ctx.save();
  const s = size;
  const x = cx - s / 2;
  const y = cy - s / 2;

  // Instagram gradient background
  const ig = ctx.createLinearGradient(x, y + s, x + s, y);
  ig.addColorStop(0, '#f09433');
  ig.addColorStop(0.25, '#e6683c');
  ig.addColorStop(0.5, '#dc2743');
  ig.addColorStop(0.75, '#cc2366');
  ig.addColorStop(1, '#bc1888');
  ctx.fillStyle = ig;
  drawRoundRect(ctx, x, y, s, s, s * 0.28);
  ctx.fill();

  // Camera lens ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(1.5, size * 0.1);
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.23, 0, Math.PI * 2);
  ctx.stroke();

  // Camera flash dot
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx + s * 0.26, cy - s * 0.26, s * 0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawTwitterXIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number): void {
  ctx.save();
  // Black badge
  ctx.fillStyle = '#000000';
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // X text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.round(size * 0.58)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('𝕏', cx, cy + size * 0.02);
  ctx.restore();
}

export function drawTelegramIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number): void {
  ctx.save();
  // Telegram blue circle
  ctx.fillStyle = '#229ED9';
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // Paper airplane icon
  ctx.fillStyle = '#ffffff';
  const s = size * 0.5;
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.5, cy);
  ctx.lineTo(cx + s * 0.6, cy - s * 0.45);
  ctx.lineTo(cx - s * 0.1, cy + s * 0.5);
  ctx.lineTo(cx - s * 0.1, cy + s * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawCalendarIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.1);
  const w = size;
  const h = size * 0.9;
  const x = cx - w / 2;
  const y = cy - h / 2;

  // Calendar box
  drawRoundRect(ctx, x, y, w, h, size * 0.18);
  ctx.stroke();

  // Top header line
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.32);
  ctx.lineTo(x + w, y + h * 0.32);
  ctx.stroke();

  // Calendar pins
  ctx.fillStyle = color;
  ctx.fillRect(x + w * 0.22, y - size * 0.1, size * 0.08, size * 0.18);
  ctx.fillRect(x + w * 0.7, y - size * 0.1, size * 0.08, size * 0.18);
  ctx.restore();
}

// ── PHOTO TILES CALCULATOR ─────────────────────────────────────────────────
export interface TileRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function getPhotoTiles(count: number, zx: number, zy: number, zw: number, zh: number, mode: CardConfig['layoutMode']): TileRect[] {
  if (count <= 0) return [];
  if (count === 1) return [{ x: zx, y: zy, w: zw, h: zh }];

  const G = 3; // Gap between photos in collage

  const AUTO_MAP: Record<number, number[][]> = {
    2: [[2]],
    3: [[2], [1]],
    4: [[2], [2]],
    5: [[3], [2]],
    6: [[3], [3]],
    7: [[4], [3]],
    8: [[4], [4]],
    9: [[3], [3], [3]],
    10: [[4], [3], [3]],
  };

  let counts: number[][];
  if (mode === 'side') {
    counts = [[Math.min(count, 10)]];
  } else if (mode === 'stack') {
    counts = Array.from({ length: Math.min(count, 10) }, () => [1]);
  } else if (mode === 'grid') {
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    counts = [];
    let rem = count;
    for (let r = 0; r < rows; r++) {
      const take = Math.min(rem, cols);
      counts.push(Array.from({ length: take }, () => 1));
      rem -= take;
    }
  } else {
    // auto mode
    const rowCounts = AUTO_MAP[count] || [[Math.ceil(count / 2)], [Math.floor(count / 2)]];
    counts = rowCounts.map((row) => (Array.isArray(row) ? row : [row]));
  }

  const rects: TileRect[] = [];
  const rows = counts.length;
  const rowH = (zh - G * (rows - 1)) / rows;

  counts.forEach((row, ri) => {
    const numCols = row.reduce((acc, v) => acc + (typeof v === 'number' ? v : 1), 0);
    const colW = (zw - G * (numCols - 1)) / numCols;
    const y = zy + ri * (rowH + G);
    const h = ri === rows - 1 ? zh - ri * (rowH + G) : rowH;

    for (let ci = 0; ci < numCols; ci++) {
      const x = zx + ci * (colW + G);
      const w = ci === numCols - 1 ? zw - ci * (colW + G) : colW;
      rects.push({
        x: Math.round(x),
        y: Math.round(y),
        w: Math.round(w),
        h: Math.round(h),
      });
    }
  });

  return rects;
}

// ── BANNER GRADIENT RENDERING ──────────────────────────────────────────────
export function drawBannerGradient(
  ctx: CanvasRenderingContext2D,
  g: GradientDef,
  customColor: string,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  if (customColor) {
    // If custom color is picked
    const lg = ctx.createLinearGradient(x, y, x + w, y + h);
    lg.addColorStop(0, customColor);
    lg.addColorStop(1, '#050a14');
    ctx.fillStyle = lg;
    ctx.fillRect(x, y, w, h);
  } else if (g.type === 'mesh' && g.blobs) {
    // Base color
    ctx.fillStyle = g.base || '#000d1e';
    ctx.fillRect(x, y, w, h);

    // Radial mesh blobs
    g.blobs.forEach((b) => {
      const bx = x + b.x * w;
      const by = y + b.y * h;
      const r = b.r * Math.max(w, h);
      const rg = ctx.createRadialGradient(bx, by, 0, bx, by, r);
      rg.addColorStop(0, hexAlpha(b.c, b.a));
      rg.addColorStop(0.5, hexAlpha(b.c, b.a * 0.4));
      rg.addColorStop(1, 'transparent');
      ctx.fillStyle = rg;
      ctx.fillRect(x, y, w, h);
    });
  } else if (g.type === 'radial' && g.s) {
    const fx = x + (g.cx || 0.5) * w;
    const fy = y + (g.cy || 0.8) * h;
    const r = Math.max(w, h) * 1.1;
    const rg = ctx.createRadialGradient(fx, fy, 0, fx, fy, r);
    g.s.forEach((c, i) => rg.addColorStop(i / (g.s!.length - 1), c));
    ctx.fillStyle = rg;
    ctx.fillRect(x, y, w, h);
  } else if (g.type === 'diagonal' && g.s) {
    const a = ((g.angle || 135) * Math.PI) / 180;
    const len = Math.sqrt(w * w + h * h);
    const cx2 = x + w / 2;
    const cy2 = y + h / 2;
    const lg = ctx.createLinearGradient(
      cx2 - (Math.cos(a) * len) / 2,
      cy2 - (Math.sin(a) * len) / 2,
      cx2 + (Math.cos(a) * len) / 2,
      cy2 + (Math.sin(a) * len) / 2
    );
    g.s.forEach((c, i) => lg.addColorStop(i / (g.s!.length - 1), c));
    ctx.fillStyle = lg;
    ctx.fillRect(x, y, w, h);
  } else if (g.type === 'angular' && g.s) {
    const angles = [0, 60, 120, 180];
    angles.forEach((deg, ai) => {
      const a = (deg * Math.PI) / 180;
      const len = Math.max(w, h) * 1.4;
      const cx2 = x + w / 2;
      const cy2 = y + h / 2;
      const lg = ctx.createLinearGradient(
        cx2 - (Math.cos(a) * len) / 2,
        cy2 - (Math.sin(a) * len) / 2,
        cx2 + (Math.cos(a) * len) / 2,
        cy2 + (Math.sin(a) * len) / 2
      );
      g.s!.forEach((c, i) => lg.addColorStop(i / (g.s!.length - 1), c));
      ctx.globalAlpha = ai === 0 ? 1 : 0.45;
      ctx.fillStyle = lg;
      ctx.fillRect(x, y, w, h);
    });
    ctx.globalAlpha = 1;
    const spot = ctx.createRadialGradient(x + w * 0.5, y + h, 0, x + w * 0.5, y + h, h * 0.8);
    spot.addColorStop(0, hexAlpha(g.s[Math.floor(g.s.length / 2)], 0.35));
    spot.addColorStop(1, 'transparent');
    ctx.fillStyle = spot;
    ctx.fillRect(x, y, w, h);
  } else if (g.s) {
    // duotone
    const lg = ctx.createLinearGradient(x, y + h, x + w, y);
    g.s.forEach((c, i) => lg.addColorStop(i / (g.s!.length - 1), c));
    ctx.fillStyle = lg;
    ctx.fillRect(x, y, w, h);
  }

  // Soft bottom shadow for text contrast
  const shadow = ctx.createLinearGradient(0, y + h * 0.3, 0, y + h);
  shadow.addColorStop(0, 'transparent');
  shadow.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  ctx.globalAlpha = 1;
  ctx.fillStyle = shadow;
  ctx.fillRect(x, y, w, h);

  // Subtle micro-pattern / light grain dots
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.arc((i * 127 + 45) % w, y + 20 + (i * 59) % (h - 30), 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  ctx.restore();
}

// ── TEXT WRAPPING ENGINE ──────────────────────────────────────────────────
export function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number,
  fontWeight: string,
  fontFamily: string
): string[] {
  ctx.font = `${fontWeight} ${fontSize}px '${fontFamily}', 'Noto Serif Bengali', serif`;
  const paragraphs = text.split('\n');
  const allLines: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      allLines.push('');
      continue;
    }
    const words = para.trim().split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && currentLine) {
        allLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      allLines.push(currentLine);
    }
  }

  return allLines;
}

// ── WATERMARK BADGE ───────────────────────────────────────────────────────
export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  text: string,
  design: CardConfig['watermarkDesign'],
  position: CardConfig['watermarkPosition'],
  W: number,
  DIV: number
): void {
  ctx.save();
  ctx.font = `600 24px 'Inter', 'Noto Sans Bengali', sans-serif`;
  const tw = ctx.measureText(text).width;
  const px = 18;
  const py = 10;
  const bw = tw + px * 2;
  const bh = 24 + py * 2;

  let bx = 28;
  let by = 28;

  if (position === 'top-right') {
    bx = W - bw - 28;
    by = 28;
  } else if (position === 'bottom-left') {
    bx = 28;
    by = DIV - bh - 24;
  }

  switch (design) {
    case 'dark':
      ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
      drawRoundRect(ctx, bx, by, bw, bh, 10);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + px, by + bh / 2);
      break;

    case 'gold': {
      ctx.fillStyle = 'rgba(10, 15, 25, 0.75)';
      drawRoundRect(ctx, bx, by, bw, bh, 10);
      ctx.fill();
      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 2;
      ctx.stroke();
      const gg = ctx.createLinearGradient(bx, 0, bx + bw, 0);
      gg.addColorStop(0, '#b8860b');
      gg.addColorStop(0.5, '#ffd700');
      gg.addColorStop(1, '#c9a227');
      ctx.fillStyle = gg;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + px, by + bh / 2);
      break;
    }

    case 'glass':
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      drawRoundRect(ctx, bx, by, bw, bh, 12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + px, by + bh / 2);
      break;

    case 'pill':
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      drawRoundRect(ctx, bx, by, bw, bh, bh / 2);
      ctx.fill();
      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + px, by + bh / 2);
      break;

    case 'neon':
      ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
      drawRoundRect(ctx, bx, by, bw, bh, 10);
      ctx.fill();
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 14;
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#00f2fe';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + px, by + bh / 2);
      break;

    case 'minimal':
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      drawRoundRect(ctx, bx, by, bw, bh, 6);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + px, by + bh / 2 - 2);
      ctx.strokeStyle = '#e8c75a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bx + px, by + bh - 6);
      ctx.lineTo(bx + px + tw, by + bh - 6);
      ctx.stroke();
      break;

    case 'ribbon':
      ctx.fillStyle = '#b8860b';
      ctx.fillRect(0, by, bw + bx, bh);
      ctx.fillStyle = '#0a1628';
      ctx.fillRect(bw + bx, by, 14, bh);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + px, by + bh / 2);
      break;

    case 'gradient': {
      const gf = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
      gf.addColorStop(0, '#b8860b');
      gf.addColorStop(1, '#e8c75a');
      ctx.fillStyle = gf;
      drawRoundRect(ctx, bx, by, bw, bh, 10);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + px, by + bh / 2);
      break;
    }
  }

  ctx.restore();
}

// ── LOGO / BRAND RENDERING ────────────────────────────────────────────────
export function drawLogo(
  ctx: CanvasRenderingContext2D,
  config: CardConfig,
  W: number,
  DIV: number
): void {
  if (!config.showLogo) return;

  const size = config.logoSize * 1.5; // Scale for high-res canvas
  let x = 32;
  let y = 32;

  switch (config.logoPosition) {
    case 'top-left':
      x = 32;
      y = 32;
      break;
    case 'top-right':
      x = W - size - 32;
      y = 32;
      break;
    case 'bottom-left':
      x = 32;
      y = DIV + 24;
      break;
    case 'bottom-right':
      x = W - size - 32;
      y = DIV + 24;
      break;
    case 'center-top':
      x = W / 2 - size / 2;
      y = DIV - size / 2 - 20;
      break;
  }

  ctx.save();

  // Container styling
  if (config.logoStyle === 'circle') {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2 + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.7)';
    ctx.lineWidth = 3;
    ctx.stroke();
  } else if (config.logoStyle === 'rounded') {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    drawRoundRect(ctx, x - 8, y - 8, size + 16, size + 16, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (config.logoStyle === 'glass') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    drawRoundRect(ctx, x - 8, y - 8, size + 16, size + 16, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw Logo Image or Built-in Preset
  if (config.logoImg) {
    ctx.drawImage(config.logoImg, x, y, size, size);
  } else {
    // Preset Icon
    drawPresetLogo(ctx, config.logoPreset, x, y, size);
  }

  // Brand Name next to logo if enabled
  const brandName = (config.brandName || '').trim();
  if (config.showBrandName && brandName) {
    ctx.font = `bold 28px 'Noto Sans Bengali', 'Inter', sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(brandName, x + size + 14, y + size / 2);
  }

  ctx.restore();
}

function drawPresetLogo(ctx: CanvasRenderingContext2D, preset: string, x: number, y: number, s: number): void {
  ctx.save();
  const cx = x + s / 2;
  const cy = y + s / 2;

  if (preset === 'preset-tv') {
    // Red live broadcast badge
    ctx.fillStyle = '#dc2626';
    drawRoundRect(ctx, x, y, s, s, s * 0.22);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${Math.round(s * 0.38)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LIVE', cx, cy - s * 0.08);
    // Recording red dot
    ctx.beginPath();
    ctx.arc(cx, cy + s * 0.26, s * 0.09, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  } else if (preset === 'preset-quote') {
    // Gold Quote mark
    ctx.fillStyle = 'rgba(201, 162, 39, 0.25)';
    ctx.beginPath();
    ctx.arc(cx, cy, s / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.font = `bold ${Math.round(s * 0.85)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('“', cx, cy + s * 0.18);
  } else {
    // Default Newspaper Emblem
    ctx.fillStyle = '#0f172a';
    drawRoundRect(ctx, x, y, s, s, s * 0.2);
    ctx.fill();
    ctx.strokeStyle = '#e8c75a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Newspaper sheets
    ctx.fillStyle = '#e8c75a';
    drawRoundRect(ctx, x + s * 0.2, y + s * 0.2, s * 0.6, s * 0.6, 4);
    ctx.stroke();
    // Lines
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + s * 0.28, y + s * 0.32, s * 0.44, 3);
    ctx.fillRect(x + s * 0.28, y + s * 0.45, s * 0.44, 3);
    ctx.fillRect(x + s * 0.28, y + s * 0.58, s * 0.28, 3);
  }
  ctx.restore();
}

// ── CATEGORY & DATE BADGES ────────────────────────────────────────────────
export function drawCategoryAndDate(
  ctx: CanvasRenderingContext2D,
  config: CardConfig,
  W: number,
  DIV: number
): number {
  let startContentY = DIV + 36;

  // 1. Separate Date if position is header-right
  if (config.showDate && config.datePosition === 'header-right') {
    ctx.save();
    ctx.font = `600 22px 'Noto Sans Bengali', 'Inter', sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    drawCalendarIcon(ctx, W - 40 - ctx.measureText(config.dateText).width - 16, 42, 22, '#e8c75a');
    ctx.fillText(config.dateText, W - 40, 42);
    ctx.restore();
  }

  // 2. Separate Date if position is header-left
  if (config.showDate && config.datePosition === 'header-left') {
    ctx.save();
    ctx.font = `600 22px 'Noto Sans Bengali', 'Inter', sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    drawCalendarIcon(ctx, 48, 42, 22, '#e8c75a');
    ctx.fillText(config.dateText, 66, 42);
    ctx.restore();
  }

  // 3. Category & inline Date row (just above headline inside banner)
  const categoryText = (config.category || '').trim();
  const dateText = (config.dateText || '').trim();
  const hasCategory = config.showCategory && categoryText.length > 0;
  const hasInlineDate = config.showDate && config.datePosition === 'category-row' && dateText.length > 0;

  if (hasCategory || hasInlineDate) {
    ctx.save();
    const rowY = DIV + 38;

    if (hasCategory) {
      const catText = categoryText;
      ctx.font = `bold 24px 'Noto Sans Bengali', 'Inter', sans-serif`;
      const catWidth = ctx.measureText(catText).width;
      const bPadX = 18;
      const bPadY = 8;
      const bWidth = catWidth + bPadX * 2;
      const bHeight = 24 + bPadY * 2;

      let catX = config.textAlign === 'center' ? W / 2 - bWidth / 2 : 56;
      if (hasInlineDate && config.textAlign === 'center') {
        catX = W / 2 - bWidth - 12;
      }

      switch (config.categoryStyle) {
        case 'red-badge':
          ctx.fillStyle = '#dc2626';
          drawRoundRect(ctx, catX, rowY - bHeight / 2, bWidth, bHeight, 6);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(catText, catX + bWidth / 2, rowY);
          break;

        case 'gold-badge': {
          const gb = ctx.createLinearGradient(catX, 0, catX + bWidth, 0);
          gb.addColorStop(0, '#b8860b');
          gb.addColorStop(1, '#e8c75a');
          ctx.fillStyle = gb;
          drawRoundRect(ctx, catX, rowY - bHeight / 2, bWidth, bHeight, 6);
          ctx.fill();
          ctx.fillStyle = '#0a1628';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(catText, catX + bWidth / 2, rowY);
          break;
        }

        case 'modern-tag':
          ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
          drawRoundRect(ctx, catX, rowY - bHeight / 2, bWidth, bHeight, 8);
          ctx.fill();
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = '#22d3ee';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(catText, catX + bWidth / 2, rowY);
          break;

        case 'minimal-line':
          ctx.fillStyle = '#e8c75a';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(catText, catX, rowY);
          ctx.fillRect(catX, rowY + 16, catWidth, 2);
          break;
      }

      // Inline date next to category
      if (hasInlineDate) {
        const dateX = config.textAlign === 'center' ? W / 2 + 18 : catX + bWidth + 24;
        ctx.font = `500 20px 'Noto Sans Bengali', 'Inter', sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        drawCalendarIcon(ctx, dateX + 10, rowY, 18, '#e8c75a');
        ctx.fillText(dateText, dateX + 28, rowY);
      }
    } else if (hasInlineDate) {
      // Just date in this row
      ctx.font = `500 22px 'Noto Sans Bengali', 'Inter', sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.textAlign = config.textAlign === 'center' ? 'center' : 'left';
      ctx.textBaseline = 'middle';
      const dx = config.textAlign === 'center' ? W / 2 : 56;
      ctx.fillText(dateText, dx, rowY);
    }

    ctx.restore();
    startContentY = rowY + 36;
  }

  return startContentY;
}

// ── FOOTER AREA: WEBSITE & SOCIAL MEDIA BAR ────────────────────────────────
export function drawFooterArea(
  ctx: CanvasRenderingContext2D,
  config: CardConfig,
  W: number,
  H: number
): void {
  if (!config.showFooter) return;

  const footerHeight = 64;
  const footerY = H - footerHeight;

  ctx.save();

  // Background style
  switch (config.footerBgStyle) {
    case 'dark-translucent':
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, footerY, W, footerHeight);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, footerY);
      ctx.lineTo(W, footerY);
      ctx.stroke();
      break;

    case 'solid-dark':
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, footerY, W, footerHeight);
      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, footerY);
      ctx.lineTo(W, footerY);
      ctx.stroke();
      break;

    case 'line-only':
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(40, footerY);
      ctx.lineTo(W - 40, footerY);
      ctx.stroke();
      break;

    case 'gradient': {
      const g = ctx.createLinearGradient(0, footerY, W, footerY);
      g.addColorStop(0, 'rgba(184, 134, 11, 0.25)');
      g.addColorStop(0.5, 'rgba(0, 0, 0, 0.6)');
      g.addColorStop(1, 'rgba(184, 134, 11, 0.25)');
      ctx.fillStyle = g;
      ctx.fillRect(0, footerY, W, footerHeight);
      ctx.strokeStyle = '#e8c75a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, footerY);
      ctx.lineTo(W, footerY);
      ctx.stroke();
      break;
    }
  }

  const centerY = footerY + footerHeight / 2;

  // 1. Left side: Website URL
  const siteUrl = (config.websiteUrl || '').trim();
  if (config.showWebsite && siteUrl) {
    const webX = 48;
    drawGlobeIcon(ctx, webX, centerY, 22, '#e8c75a');

    ctx.font = `600 22px 'Inter', sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(siteUrl, webX + 22, centerY);
  }

  // 2. Right side: Social Media Channels
  const s = config.socials || ({} as any);
  const activeSocials: Array<{ type: string; handle: string }> = [];

  if (s.showFacebook) activeSocials.push({ type: 'facebook', handle: s.facebookHandle || '' });
  if (s.showYoutube) activeSocials.push({ type: 'youtube', handle: s.youtubeHandle || '' });
  if (s.showInstagram) activeSocials.push({ type: 'instagram', handle: s.instagramHandle || '' });
  if (s.showTwitter) activeSocials.push({ type: 'twitter', handle: s.twitterHandle || '' });
  if (s.showTelegram) activeSocials.push({ type: 'telegram', handle: s.telegramHandle || '' });

  if (activeSocials.length > 0) {
    const iconSize = 26;
    const iconGap = 12;
    const unifiedHandleText = (s.unifiedHandle || '').trim();

    if (s.useUnifiedHandle && unifiedHandleText) {
      // Unified Handle style: [Icons row] + @unifiedhandle
      ctx.font = `bold 22px 'Inter', sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const handleWidth = ctx.measureText(unifiedHandleText).width;

      const handleX = W - 48;
      ctx.fillText(unifiedHandleText, handleX, centerY);

      // Render icons directly to the left of the handle
      let iconStartX = handleX - handleWidth - 20 - (activeSocials.length * (iconSize + iconGap) - iconGap);

      activeSocials.forEach((item) => {
        const icx = iconStartX + iconSize / 2;
        renderSocialIcon(ctx, item.type, icx, centerY, iconSize);
        iconStartX += iconSize + iconGap;
      });
    } else {
      // Individual icons aligned to right
      let currX = W - 48;
      // render in reverse from right to left
      for (let i = activeSocials.length - 1; i >= 0; i--) {
        const item = activeSocials[i];
        renderSocialIcon(ctx, item.type, currX - iconSize / 2, centerY, iconSize);
        currX -= iconSize + iconGap;
      }
    }
  }

  // 3. Footer row date if configured
  const footerDate = (config.dateText || '').trim();
  if (config.showDate && config.datePosition === 'footer-row' && footerDate) {
    ctx.font = `500 20px 'Noto Sans Bengali', 'Inter', sans-serif`;
    ctx.fillStyle = '#cbd5e1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(footerDate, W / 2, centerY);
  }

  ctx.restore();
}

function renderSocialIcon(ctx: CanvasRenderingContext2D, type: string, cx: number, cy: number, size: number): void {
  switch (type) {
    case 'facebook':
      drawFacebookIcon(ctx, cx, cy, size);
      break;
    case 'youtube':
      drawYouTubeIcon(ctx, cx, cy, size);
      break;
    case 'instagram':
      drawInstagramIcon(ctx, cx, cy, size);
      break;
    case 'twitter':
      drawTwitterXIcon(ctx, cx, cy, size);
      break;
    case 'telegram':
      drawTelegramIcon(ctx, cx, cy, size);
      break;
  }
}

// ── PHOTO FIT AND FILTERS ──────────────────────────────────────────────────
export function drawPhotoFit(
  ctx: CanvasRenderingContext2D,
  item: PhotoItem,
  filters: CardConfig['filters'],
  rx: number,
  ry: number,
  rw: number,
  rh: number
): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(rx, ry, rw, rh);
  ctx.clip();

  // Apply CSS filters if supported
  const filterParts: string[] = [];
  if (filters.brightness !== 1) filterParts.push(`brightness(${filters.brightness})`);
  if (filters.contrast !== 1) filterParts.push(`contrast(${filters.contrast})`);
  if (filters.saturation !== 1) filterParts.push(`saturate(${filters.saturation})`);
  if (filters.grayscale) filterParts.push('grayscale(100%)');

  if (filterParts.length > 0) {
    ctx.filter = filterParts.join(' ');
  }

  const iw = item.img.naturalWidth || item.img.width;
  const ih = item.img.naturalHeight || item.img.height;
  const baseScale = Math.max(rw / iw, rh / ih);
  const s = baseScale * item.state.scale;
  const dw = iw * s;
  const dh = ih * s;

  const dx = rx + (rw - dw) / 2 + item.state.x * (rw / 700);
  const dy = ry + (rh - dh) / 2 + item.state.y * (rh / 700);

  ctx.drawImage(item.img, dx, dy, dw, dh);
  ctx.filter = 'none';

  // Vignette overlay
  if (filters.vignette) {
    const vg = ctx.createRadialGradient(rx + rw / 2, ry + rh / 2, Math.min(rw, rh) * 0.3, rx + rw / 2, ry + rh / 2, Math.max(rw, rh) * 0.7);
    vg.addColorStop(0, 'transparent');
    vg.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
    ctx.fillStyle = vg;
    ctx.fillRect(rx, ry, rw, rh);
  }

  ctx.restore();
}

// ── MASTER RENDER FUNCTION ─────────────────────────────────────────────────
export function renderCardToCanvas(
  canvas: HTMLCanvasElement,
  photos: PhotoItem[],
  config: CardConfig
): void {
  const { width: W, height: H, dividerY: DIV } = getCanvasDimensions(config.aspectRatio, config.bannerHeightPercent);

  if (canvas.width !== W || canvas.height !== H) {
    canvas.width = W;
    canvas.height = H;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, W, H);

  // 1. Photo area background (if no photos)
  const bg = ctx.createLinearGradient(0, 0, W, DIV);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(0.5, '#1e293b');
  bg.addColorStop(1, '#0f172a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, DIV);

  // 2. Render Photos
  if (photos.length === 0) {
    ctx.save();
    ctx.font = `500 32px 'Noto Sans Bengali', 'Inter', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.fillText('বাম পাশের প্যানেল থেকে ছবি আপলোড করুন', W / 2, DIV / 2 - 20);
    ctx.font = `400 24px 'Inter', sans-serif`;
    ctx.fillText('Click or drag & drop photos (JPG · PNG · WEBP)', W / 2, DIV / 2 + 30);
    ctx.restore();
  } else {
    const tiles = getPhotoTiles(photos.length, 0, 0, W, DIV, config.layoutMode);
    tiles.forEach((t, i) => {
      if (photos[i]) {
        drawPhotoFit(ctx, photos[i], config.filters, t.x, t.y, t.w, t.h);
      }
    });

    // Separators between multi-photos
    if (photos.length > 1) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.lineWidth = 4;
      tiles.forEach((t) => {
        if (t.x + t.w < W - 2) {
          ctx.beginPath();
          ctx.moveTo(t.x + t.w, 0);
          ctx.lineTo(t.x + t.w, DIV);
          ctx.stroke();
        }
        if (t.y + t.h < DIV - 2) {
          ctx.beginPath();
          ctx.moveTo(0, t.y + t.h);
          ctx.lineTo(W, t.y + t.h);
          ctx.stroke();
        }
      });
      ctx.restore();
    }
  }

  // 3. Watermark / Source
  const watermarkText = (config.watermark || '').trim();
  if (config.showWatermark && watermarkText) {
    drawWatermark(ctx, watermarkText, config.watermarkDesign, config.watermarkPosition, W, DIV);
  }

  // 4. Logo & Brand
  drawLogo(ctx, config, W, DIV);

  // 5. Divider Line between Photo and Banner
  if (config.dividerStyle !== 'none') {
    const dl = ctx.createLinearGradient(0, DIV, W, DIV);
    const th = config.dividerThickness;

    if (config.dividerStyle === 'gold') {
      dl.addColorStop(0, 'rgba(184, 134, 11, 0.2)');
      dl.addColorStop(0.2, '#c9a227');
      dl.addColorStop(0.8, '#e8c75a');
      dl.addColorStop(1, 'rgba(184, 134, 11, 0.2)');
    } else if (config.dividerStyle === 'red') {
      dl.addColorStop(0, 'rgba(220, 38, 38, 0.2)');
      dl.addColorStop(0.3, '#dc2626');
      dl.addColorStop(0.7, '#ef4444');
      dl.addColorStop(1, 'rgba(220, 38, 38, 0.2)');
    } else if (config.dividerStyle === 'cyan') {
      dl.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
      dl.addColorStop(0.5, '#06b6d4');
      dl.addColorStop(1, 'rgba(6, 182, 212, 0.2)');
    } else {
      dl.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      dl.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
      dl.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    }

    ctx.fillStyle = dl;
    ctx.fillRect(0, DIV - th / 2, W, th);
  }

  // 6. Lower Banner Area Background
  const bannerH = H - DIV;
  drawBannerGradient(ctx, config.selectedGradient, config.customGradientColor, 0, DIV, W, bannerH);

  // 7. Category & Date Header Row
  const startContentY = drawCategoryAndDate(ctx, config, W, DIV);

  // 8. Headline
  const hl = (config.headline || '').trim();
  let nextY = startContentY;

  const footerSpace = config.showFooter ? 75 : 30;
  const maxTextW = W - 120;

  if (hl) {
    ctx.save();
    const hlSize = config.headlineSize * 1.35; // Canvas scale factor
    const lineHeight = hlSize * 1.28;

    const hlLines = wrapTextLines(ctx, hl, maxTextW, hlSize, 'bold', config.headlineFont);

    // Headline styling / gradient fill
    let fillStyle: string | CanvasGradient = '#ffffff';
    if (config.headlineStyle === 'gold') {
      const tg = ctx.createLinearGradient(0, 0, W, 0);
      tg.addColorStop(0, '#b8860b');
      tg.addColorStop(0.3, '#f59e0b');
      tg.addColorStop(0.6, '#ffd700');
      tg.addColorStop(1, '#c9a227');
      fillStyle = tg;
    } else if (config.headlineStyle === 'yellow') {
      fillStyle = '#fef08a';
    } else if (config.headlineStyle === 'cyan') {
      fillStyle = '#67e8f9';
    } else if (config.headlineStyle === 'red') {
      fillStyle = '#f87171';
    } else if (config.headlineStyle === 'custom' && config.customHeadlineColor) {
      fillStyle = config.customHeadlineColor;
    }

    ctx.fillStyle = fillStyle;
    ctx.textAlign = config.textAlign === 'center' ? 'center' : 'left';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;

    const hlX = config.textAlign === 'center' ? W / 2 : 60;

    hlLines.forEach((line, index) => {
      const lineY = startContentY + index * lineHeight + lineHeight / 2;
      ctx.fillText(line, hlX, lineY);
    });

    nextY = startContentY + hlLines.length * lineHeight + 18;
    ctx.restore();

    // 9. Caption / Subtitle
    const cap = (config.caption || '').trim();
    if (config.showCaption && cap && nextY < H - footerSpace) {
      ctx.save();
      const capSize = config.captionSize * 1.3;
      const capLineH = capSize * 1.35;

      const capLines = wrapTextLines(ctx, cap, maxTextW - 30, capSize, '600', config.captionFont);

      ctx.fillStyle = config.captionColor || 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = config.textAlign === 'center' ? 'center' : 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 6;

      const capX = config.textAlign === 'center' ? W / 2 : 60;

      capLines.forEach((line, i) => {
        const lineY = nextY + i * capLineH + capLineH / 2;
        if (lineY < H - footerSpace) {
          ctx.fillText(line, capX, lineY);
        }
      });

      ctx.restore();
    }
  }

  // 10. Footer Area (Website link + Social Media icons)
  drawFooterArea(ctx, config, W, H);
}
