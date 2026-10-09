import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Minimal compliant PNG generator in pure Node.js
function createPNG(width, height, renderPixel) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA color type
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  // Raw image scanlines
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = renderPixel(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Deflate compressed data
  const compressed = zlib.deflateSync(rawData);

  // Helper to wrap chunks with length and CRC32
  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(12 + len);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);

    // CRC32
    const crc = crc32(Buffer.concat([Buffer.from(type, 'ascii'), data]));
    chunk.writeInt32BE(crc, 8 + len);
    return chunk;
  }

  // Basic CRC32 table
  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) {
          crc = (crc >>> 1) ^ 0xedb88320;
        } else {
          crc = crc >>> 1;
        }
        byte = byte >>> 1;
      }
    }
    return (crc ^ -1) | 0;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Icon renderer: OmniToolbox brand squircle + sparkle star matching splash screen
function renderOmniIcon(isMaskable) {
  return (x, y, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const dx = x - cx;
    const dy = y - cy;

    // Coordinate in [-1, 1]
    const u = dx / (w / 2);
    const v = dy / (h / 2);

    // Scale for maskable safe margin
    const scale = isMaskable ? 0.72 : 0.88;
    const su = u / scale;
    const sv = v / scale;

    // Background squircle distance: |u|^4 + |v|^4
    const squircleDist = Math.pow(Math.abs(u), 4) + Math.pow(Math.abs(v), 4);

    if (!isMaskable && squircleDist > 1.0) {
      return [0, 0, 0, 0]; // Transparent outside squircle
    }

    // Gradient background matching splash screen: linear-gradient(135deg, #4f46e5, #6366f1, #8b5cf6)
    // tGrad ranges from 0 (top-left) to 1 (bottom-right)
    const tGrad = Math.max(0, Math.min(1, (u + v + 2) / 4));
    let bgR, bgG, bgB, bgA = 255;
    if (tGrad < 0.5) {
      const f = tGrad / 0.5;
      bgR = Math.round(79 + f * (99 - 79));
      bgG = Math.round(70 + f * (102 - 70));
      bgB = Math.round(229 + f * (241 - 229));
    } else {
      const f = (tGrad - 0.5) / 0.5;
      bgR = Math.round(99 + f * (139 - 99));
      bgG = Math.round(102 + f * (92 - 102));
      bgB = Math.round(241 + f * (246 - 241));
    }

    // Outer subtle border (rgba(255, 255, 255, 0.22))
    if (!isMaskable && squircleDist > 0.88) {
      const borderAlpha = Math.min(1, (squircleDist - 0.88) / 0.12);
      return [
        Math.round(bgR * (1 - borderAlpha * 0.4) + 255 * (borderAlpha * 0.4)),
        Math.round(bgG * (1 - borderAlpha * 0.4) + 255 * (borderAlpha * 0.4)),
        Math.round(bgB * (1 - borderAlpha * 0.4) + 255 * (borderAlpha * 0.4)),
        255
      ];
    }

    // 4-point sparkle star math matching splash screen: |su|^0.55 + |sv|^0.55
    const starDist = Math.pow(Math.abs(su), 0.55) + Math.pow(Math.abs(sv), 0.55);

    if (starDist <= 0.82) {
      // Crisp white sparkle star
      return [255, 255, 255, 255];
    }

    // Soft antialiased edge of sparkle star
    if (starDist <= 0.94) {
      const alpha = (0.94 - starDist) / 0.12;
      return [
        Math.round(255 * alpha + bgR * (1 - alpha)),
        Math.round(255 * alpha + bgG * (1 - alpha)),
        Math.round(255 * alpha + bgB * (1 - alpha)),
        255
      ];
    }

    return [bgR, bgG, bgB, bgA];
  };
}

// Screenshot mock renderer for App Store & Play Store compliance
function renderScreenshot(isNarrow) {
  return (x, y, w, h) => {
    // Header bar (y < h * 0.08)
    if (y < h * 0.08) {
      if (y > h * 0.075) return [39, 39, 42, 255]; // border-zinc-800
      return [9, 9, 11, 255]; // zinc-950 header
    }

    // Bottom mobile bar (if narrow and y > h * 0.92)
    if (isNarrow && y > h * 0.92) {
      if (y < h * 0.925) return [39, 39, 42, 255];
      return [9, 9, 11, 255];
    }

    // Subtle dark gradient background
    const bg = Math.floor(12 + (y / h) * 12);
    let r = bg, g = bg, b = bg + 3;

    // Center dashboard accent glow
    const cx = w * 0.5;
    const cy = h * 0.4;
    const dist = Math.hypot(x - cx, y - cy);
    if (dist < w * 0.4) {
      const glow = Math.floor((1 - dist / (w * 0.4)) * 25);
      r += Math.floor(glow * 0.4);
      g += Math.floor(glow * 0.4);
      b += glow;
    }

    // Card outlines mockup
    const cardW = isNarrow ? w * 0.88 : w * 0.28;
    const cardH = isNarrow ? h * 0.12 : h * 0.22;
    const startY = h * 0.22;

    const relY = (y - startY);
    if (relY > 0) {
      const cardRow = Math.floor(relY / (cardH + 20));
      const cardOffset = relY % (cardH + 20);
      if (cardOffset < cardH && cardRow < (isNarrow ? 4 : 2)) {
        const col = isNarrow ? 0 : Math.floor((x - w * 0.05) / (cardW + 20));
        const colOffset = isNarrow ? (x - w * 0.06) : ((x - w * 0.05) % (cardW + 20));
        if (col >= 0 && col < (isNarrow ? 1 : 3) && colOffset > 0 && colOffset < cardW) {
          // Inside card
          r = 24; g = 24; b = 27; // zinc-900 card
          // Top edge accent highlight
          if (cardOffset < 3) {
            r = 99; g = 102; b = 241;
          }
        }
      }
    }

    return [Math.min(255, r), Math.min(255, g), Math.min(255, b), 255];
  };
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA icons
console.log('Generating PWA icons...');

const png192 = createPNG(192, 192, renderOmniIcon(false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

const png512 = createPNG(512, 512, renderOmniIcon(false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

const pngMaskable = createPNG(512, 512, renderOmniIcon(true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable);

const appleTouch = createPNG(180, 180, renderOmniIcon(false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);

// Also generate a small 32x32 for favicon.ico / favicon.png
const favicon32 = createPNG(32, 32, renderOmniIcon(false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon32);
fs.writeFileSync(path.join(publicDir, 'favicon.png'), favicon32);

// Generate App Store screenshots
console.log('Generating App Store compliance screenshots...');
const screenWide = createPNG(1280, 720, renderScreenshot(false));
fs.writeFileSync(path.join(publicDir, 'screenshot-wide.png'), screenWide);

const screenNarrow = createPNG(750, 1334, renderScreenshot(true));
fs.writeFileSync(path.join(publicDir, 'screenshot-narrow.png'), screenNarrow);

console.log('Successfully generated all compliant PWA icons & app store screenshots in /public:');
console.log('- pwa-192x192.png');
console.log('- pwa-512x512.png');
console.log('- pwa-maskable-512x512.png');
console.log('- apple-touch-icon.png');
console.log('- favicon.ico');
console.log('- screenshot-wide.png');
console.log('- screenshot-narrow.png');
