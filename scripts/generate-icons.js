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

// Icon renderer: OmniToolbox brand squircle + sparkle diamond star
function renderOmniIcon(isMaskable) {
  return (x, y, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Coordinate in [-1, 1]
    const u = dx / (w / 2);
    const v = dy / (h / 2);

    // Scale for maskable safe margin
    const scale = isMaskable ? 0.72 : 0.88;
    const su = u / scale;
    const sv = v / scale;

    // Background squircle or circle
    const cornerRadius = 0.85;
    const squircleDist = Math.pow(Math.abs(u), 4) + Math.pow(Math.abs(v), 4);

    let bgR = 15, bgG = 15, bgB = 20, bgA = 255; // Dark slate background

    // If maskable, full bleed background
    if (!isMaskable && squircleDist > 1.0) {
      return [0, 0, 0, 0]; // Transparent outside squircle
    }

    // Gradient background: top left to bottom right
    const bgGrad = (u + 1) * 0.3 + (v + 1) * 0.3;
    bgR = Math.min(255, Math.floor(18 + bgGrad * 15));
    bgG = Math.min(255, Math.floor(18 + bgGrad * 12));
    bgB = Math.min(255, Math.floor(25 + bgGrad * 40));

    // Outer subtle border
    if (!isMaskable && squircleDist > 0.92) {
      return [99, 102, 241, 180];
    }

    // Sparkle star math: curve connecting (0, ±1) and (±1, 0)
    // equation: |su|^0.5 + |sv|^0.5 <= 1
    const starDist = Math.sqrt(Math.abs(su)) + Math.sqrt(Math.abs(sv));

    if (starDist <= 0.95) {
      // Inside star sparkle: rich Indigo/Violet/Pink gradient
      const t = (su + sv + 2) / 4;
      const r = Math.floor(99 + t * (236 - 99));
      const g = Math.floor(102 + t * (72 - 102));
      const b = Math.floor(241 + t * (153 - 241));

      // Core white center
      const coreDist = Math.sqrt(su * su + sv * sv);
      if (coreDist < 0.18) {
        return [255, 255, 255, 255];
      }
      return [r, g, b, 255];
    }

    // Outer subtle glowing aura around star
    if (starDist <= 1.25) {
      const alpha = Math.floor((1.25 - starDist) * 120);
      return [99, 102, 241, Math.min(255, bgA + alpha)];
    }

    // 4 Satellite dots
    const dotDist1 = Math.hypot(su, sv - 0.75);
    const dotDist2 = Math.hypot(su, sv + 0.75);
    const dotDist3 = Math.hypot(su - 0.75, sv);
    const dotDist4 = Math.hypot(su + 0.75, sv);
    if (dotDist1 < 0.08 || dotDist2 < 0.08 || dotDist3 < 0.08 || dotDist4 < 0.08) {
      return [255, 255, 255, 240];
    }

    return [bgR, bgG, bgB, bgA];
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

console.log('Successfully generated all compliant PWA icons in /public:');
console.log('- pwa-192x192.png');
console.log('- pwa-512x512.png');
console.log('- pwa-maskable-512x512.png');
console.log('- apple-touch-icon.png');
console.log('- favicon.ico');
