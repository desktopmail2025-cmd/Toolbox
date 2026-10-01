import React, { useState, useRef } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Upload, Download, Copy, Check, Pipette, Scissors, Trash2, Plus, Sparkles, Sliders, RefreshCw, Eye, Image as ImageIcon } from 'lucide-react';
import { ExtendedUtilities } from './ExtendedUtilities';

interface ToolComponentProps {
  toolId: string;
}

export const CameraImageTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'image-bg-remover':
    case 'bg-remover':
      return <ImageBgRemoverView />;
    case 'color-picker-tool':
      return <ColorPickerView />;
    case 'image-compressor':
      return <ImageCompressorView />;
    case 'image-resizer':
      return <ImageResizerView />;
    case 'exif-metadata-viewer':
      return <ExifViewerView />;
    case 'meme-generator':
      return <ExtendedUtilities toolId={toolId} />;
    default:
      return <ColorPickerView />;
  }
};

// 1. Color Eyedropper & Palette Analyzer
const ColorPickerView: React.FC = () => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [selectedHex, setSelectedHex] = useState('#2563EB');
  const [selectedRgb, setSelectedRgb] = useState('rgb(37, 99, 235)');
  const [palette, setPalette] = useState<string[]>(['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sounds.playClick();
    const reader = new FileReader();
    reader.onload = ev => {
      const data = ev.target?.result as string;
      setImgSrc(data);

      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Sample 6 colors from grid
        const sampledColors: string[] = [];
        const stepX = Math.floor(img.width / 4);
        const stepY = Math.floor(img.height / 3);
        for (let y = stepY / 2; y < img.height; y += stepY) {
          for (let x = stepX / 2; x < img.width; x += stepX) {
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const hex = '#' + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase();
            if (!sampledColors.includes(hex) && sampledColors.length < 6) {
              sampledColors.push(hex);
            }
          }
        }
        if (sampledColors.length > 0) setPalette(sampledColors);
      };
      img.src = data;
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = '#' + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase();
    sounds.playClick();
    setSelectedHex(hex);
    setSelectedRgb(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
  };

  const copyHex = (hex: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(hex);
    setSelectedHex(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Upload Image to Sample Colors
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="text-xs text-zinc-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white dark:file:bg-zinc-100 dark:file:text-zinc-950"
        />

        {imgSrc && (
          <div className="pt-2">
            <p className="text-xs text-zinc-400 mb-2">Click anywhere on the image to inspect pixel color:</p>
            <div className="max-h-72 overflow-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="cursor-crosshair max-w-full h-auto block mx-auto"
              />
            </div>
          </div>
        )}
      </div>

      {/* Selected Color Preview */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 flex items-center gap-4">
        <div
          style={{ backgroundColor: selectedHex }}
          className="w-16 h-16 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-md shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xl text-zinc-900 dark:text-zinc-50">{selectedHex}</span>
            <button
              onClick={() => copyHex(selectedHex)}
              className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">{selectedRgb}</p>
        </div>
      </div>

      {/* Dominant Palette */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Extracted Dominant Palette</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {palette.map((color, idx) => (
            <button
              key={idx}
              onClick={() => copyHex(color)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <div style={{ backgroundColor: color }} className="w-10 h-10 rounded-lg shadow-xs" />
              <span className="text-[11px] font-mono font-semibold text-zinc-700 dark:text-zinc-300">{color}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. Image Compressor
const ImageCompressorView: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sounds.playClick();
    setOriginalFile(file);
    compress(file, quality);
  };

  const compress = (file: File, q: number) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          blob => {
            if (!blob) return;
            setCompressedUrl(URL.createObjectURL(blob));
            setCompressedSize(blob.size);
          },
          'image/jpeg',
          q / 100
        );
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (originalFile) compress(originalFile, newQ);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Upload Image to Compress
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          className="text-xs text-zinc-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white dark:file:bg-zinc-100 dark:file:text-zinc-950"
        />

        {originalFile && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-600 dark:text-zinc-400">Target Quality: {quality}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={95}
              value={quality}
              onChange={e => handleQualityChange(parseInt(e.target.value))}
              className="w-full accent-zinc-900 dark:accent-zinc-100"
            />
          </div>
        )}
      </div>

      {originalFile && compressedSize && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultCard label="Original Size" value={`${(originalFile.size / 1024).toFixed(1)} KB`} />
            <ResultCard
              label="Compressed Size"
              value={`${(compressedSize / 1024).toFixed(1)} KB`}
              subtext={`-${Math.round((1 - compressedSize / originalFile.size) * 100)}% reduction`}
              highlight
            />
          </div>

          {compressedUrl && (
            <a
              href={compressedUrl}
              download={`compressed-${originalFile.name}`}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" /> Download Compressed Image
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// 3. Image Resizer & Cropper
const ImageResizerView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [targetW, setTargetW] = useState(800);
  const [targetH, setTargetH] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    sounds.playClick();
    setFile(f);
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        setOrigW(img.width);
        setOrigH(img.height);
        setTargetW(Math.round(img.width * 0.75));
        setTargetH(Math.round(img.height * 0.75));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(f);
  };

  const handleWidthChange = (w: number) => {
    setTargetW(w);
    if (lockAspect && origW > 0) {
      setTargetH(Math.round((w * origH) / origW));
    }
  };

  const handleResize = () => {
    if (!file) return;
    sounds.playSuccess();
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, targetW, targetH);
        setResizedUrl(canvas.toDataURL('image/png'));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Upload Image to Resize
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="text-xs text-zinc-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white dark:file:bg-zinc-100 dark:file:text-zinc-950"
        />

        {origW > 0 && (
          <div className="space-y-4 pt-2">
            <div className="text-xs text-zinc-500">
              Original Dimensions: <span className="font-mono font-bold">{origW} × {origH} px</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Target Width (px)</label>
                <input
                  type="number"
                  value={targetW}
                  onChange={e => handleWidthChange(parseInt(e.target.value) || 1)}
                  className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Target Height (px)</label>
                <input
                  type="number"
                  value={targetH}
                  onChange={e => setTargetH(parseInt(e.target.value) || 1)}
                  className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={lockAspect}
                onChange={e => setLockAspect(e.target.checked)}
                className="rounded accent-zinc-900"
              />
              <span>Lock Aspect Ratio</span>
            </label>

            <button
              onClick={handleResize}
              className="w-full py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-xl hover:opacity-90"
            >
              Resize Image
            </button>
          </div>
        )}
      </div>

      {resizedUrl && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-3">
          <img src={resizedUrl} alt="Resized" className="max-h-64 mx-auto rounded-lg shadow-sm" />
          <a
            href={resizedUrl}
            download={`resized-${targetW}x${targetH}.png`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl"
          >
            <Download className="w-4 h-4" /> Download Resized Image
          </a>
        </div>
      )}
    </div>
  );
};

// 4. Photo Metadata & EXIF Viewer
const ExifViewerView: React.FC = () => {
  const [meta, setMeta] = useState<Record<string, string | number> | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    sounds.playClick();
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        setMeta({
          'File Name': f.name,
          'File Size': `${(f.size / 1024).toFixed(1)} KB`,
          'MIME Type': f.type || 'image/jpeg',
          'Resolution Width': `${img.width} px`,
          'Resolution Height': `${img.height} px`,
          'Aspect Ratio': `${(img.width / img.height).toFixed(2)} : 1`,
          'Last Modified': new Date(f.lastModified).toLocaleDateString(),
        });
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(f);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Upload Image to Inspect Metadata
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="text-xs text-zinc-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white dark:file:bg-zinc-100 dark:file:text-zinc-950"
        />
      </div>

      {meta && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Image Technical Details</h4>
          {Object.entries(meta).map(([key, val]) => (
            <div key={key} className="flex justify-between items-center p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-xs">
              <span className="text-zinc-500">{key}</span>
              <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 5. Image Background Remover (Item 5: Automatic Browser Canvas Cutout, Tolerance Controls, Background Swapping & Add/Delete Beside Each)
interface ProcessedImageItem {
  id: string;
  name: string;
  originalUrl: string;
  processedUrl: string;
  timestamp: string;
}

const SAMPLE_IMAGES = [
  {
    name: 'Studio Portrait',
    type: 'portrait',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#e2e8f0"/>
      <circle cx="200" cy="160" r="70" fill="#f87171"/>
      <ellipse cx="200" cy="330" rx="110" ry="90" fill="#3b82f6"/>
      <circle cx="180" cy="150" r="8" fill="#1e293b"/>
      <circle cx="220" cy="150" r="8" fill="#1e293b"/>
      <path d="M185 180 Q200 195 215 180" stroke="#1e293b" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>`
  },
  {
    name: 'Sneaker Product',
    type: 'product',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#ffffff"/>
      <path d="M70 260 C70 230, 110 200, 150 190 L230 180 L290 140 L340 180 L350 260 L320 280 L90 280 Z" fill="#6366f1"/>
      <rect x="80" y="270" width="270" height="20" rx="10" fill="#f59e0b"/>
      <path d="M160 210 Q230 190 290 240" stroke="#ffffff" stroke-width="6" fill="none"/>
    </svg>`
  },
  {
    name: 'Pet Companion',
    type: 'pet',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#f1f5f9"/>
      <circle cx="200" cy="200" r="85" fill="#f59e0b"/>
      <polygon points="135,140 160,80 190,130" fill="#d97706"/>
      <polygon points="265,140 240,80 210,130" fill="#d97706"/>
      <circle cx="170" cy="190" r="10" fill="#1e293b"/>
      <circle cx="230" cy="190" r="10" fill="#1e293b"/>
      <polygon points="195,215 205,215 200,225" fill="#ef4444"/>
    </svg>`
  },
  {
    name: 'Camera Icon',
    type: 'object',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#cbd5e1"/>
      <rect x="90" y="130" width="220" height="160" rx="28" fill="#10b981"/>
      <rect x="150" y="95" width="100" height="35" rx="10" fill="#047857"/>
      <circle cx="200" cy="210" r="50" fill="#ffffff"/>
      <circle cx="200" cy="210" r="32" fill="#0f172a"/>
      <circle cx="270" cy="160" r="10" fill="#facc15"/>
    </svg>`
  },
];

const svgToDataUrl = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

export const ImageBgRemoverView: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string>(() => svgToDataUrl(SAMPLE_IMAGES[0].svg));
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tolerance, setTolerance] = useState<number>(35);
  const [feather, setFeather] = useState<number>(2);
  const [targetBgKey, setTargetBgKey] = useState<string>('auto'); // 'auto' or hex
  const [bgReplacement, setBgReplacement] = useState<'transparent' | 'white' | 'black' | 'gradient' | 'neon'>('transparent');
  const [viewCompare, setViewCompare] = useState<'processed' | 'original' | 'split'>('processed');
  const [history, setHistory] = useState<ProcessedImageItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Perform background removal algorithm on canvas
  const processImageBgRemoval = (imgSrc: string, tol: number, targetKey: string, replacement: string) => {
    setIsProcessing(true);
    sounds.playClick();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = hiddenCanvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample key color: either corners average (auto) or custom target
      let keyR = 240, keyG = 240, keyB = 240;

      if (targetKey === 'auto') {
        // Average 4 corners
        const corners = [
          0, // top-left
          (canvas.width - 1) * 4, // top-right
          ((canvas.height - 1) * canvas.width) * 4, // bottom-left
          ((canvas.height * canvas.width) - 1) * 4 // bottom-right
        ];
        let sumR = 0, sumG = 0, sumB = 0;
        corners.forEach(idx => {
          sumR += data[idx];
          sumG += data[idx + 1];
          sumB += data[idx + 2];
        });
        keyR = Math.round(sumR / 4);
        keyG = Math.round(sumG / 4);
        keyB = Math.round(sumB / 4);
      } else {
        // Parse hex
        const hex = targetKey.replace('#', '');
        keyR = parseInt(hex.substring(0, 2), 16) || 240;
        keyG = parseInt(hex.substring(2, 4), 16) || 240;
        keyB = parseInt(hex.substring(4, 6), 16) || 240;
      }

      const thresholdDist = (tol / 100) * 441.67; // max distance is sqrt(255^2*3) = 441.67
      const featherBand = feather * 8;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance
        const dist = Math.sqrt(
          (r - keyR) * (r - keyR) +
          (g - keyG) * (g - keyG) +
          (b - keyB) * (b - keyB)
        );

        if (dist < thresholdDist) {
          // Within background threshold -> transparent or replacement
          if (dist < thresholdDist - featherBand) {
            data[i + 3] = 0; // 100% transparent
          } else {
            // Feather edge
            const alphaRatio = (dist - (thresholdDist - featherBand)) / Math.max(1, featherBand);
            data[i + 3] = Math.round(alphaRatio * data[i + 3]);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // If replacement background requested
      if (replacement !== 'transparent') {
        const outCanvas = document.createElement('canvas');
        outCanvas.width = canvas.width;
        outCanvas.height = canvas.height;
        const outCtx = outCanvas.getContext('2d');
        if (outCtx) {
          if (replacement === 'white') {
            outCtx.fillStyle = '#ffffff';
            outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
          } else if (replacement === 'black') {
            outCtx.fillStyle = '#09090b';
            outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
          } else if (replacement === 'gradient') {
            const grad = outCtx.createLinearGradient(0, 0, outCanvas.width, outCanvas.height);
            grad.addColorStop(0, '#6366f1');
            grad.addColorStop(1, '#ec4899');
            outCtx.fillStyle = grad;
            outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
          } else if (replacement === 'neon') {
            const grad = outCtx.createLinearGradient(0, 0, outCanvas.width, outCanvas.height);
            grad.addColorStop(0, '#10b981');
            grad.addColorStop(1, '#06b6d4');
            outCtx.fillStyle = grad;
            outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
          }
          outCtx.drawImage(canvas, 0, 0);
          const finalUrl = outCanvas.toDataURL('image/png');
          setProcessedUrl(finalUrl);
          setIsProcessing(false);
          sounds.playSuccess();
          return;
        }
      }

      const finalUrl = canvas.toDataURL('image/png');
      setProcessedUrl(finalUrl);
      setIsProcessing(false);
      sounds.playSuccess();
    };

    img.src = imgSrc;
  };

  // Run on initial or config change
  React.useEffect(() => {
    processImageBgRemoval(currentImage, tolerance, targetBgKey, bgReplacement);
  }, [currentImage, tolerance, targetBgKey, bgReplacement]);

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sounds.playClick();
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setCurrentImage(url);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveToHistory = () => {
    if (!processedUrl) return;
    sounds.playSuccess();
    const newItem: ProcessedImageItem = {
      id: String(Date.now()),
      name: `Cutout_${Date.now().toString().slice(-4)}.png`,
      originalUrl: currentImage,
      processedUrl: processedUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    sounds.playClick();
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const handleDownload = (dataUrl?: string, filename?: string) => {
    const url = dataUrl || processedUrl;
    if (!url) return;
    sounds.playClick();
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'transparent_cutout.png';
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      {/* Hidden processing canvas */}
      <canvas ref={hiddenCanvasRef} className="hidden" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Scissors className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />
            <span>AI Image Background Remover Studio</span>
          </h2>
          <span className="text-xs text-zinc-400 mt-0.5 block">
            Automatic client-side color-chroma cutout with edge feathering, background backdrops & instant PNG download
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadFile}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Sample presets for 1-click test */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
          Or Select a Sample Subject
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SAMPLE_IMAGES.map(samp => (
            <button
              key={samp.name}
              onClick={() => {
                sounds.playClick();
                setCurrentImage(svgToDataUrl(samp.svg));
              }}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:border-fuchsia-400 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-fuchsia-500" />
              <span>{samp.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Viewport & Preview */}
      <div className="rounded-3xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-950/60 p-6 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden shadow-inner">
        {/* Transparent Checkerboard Pattern when in transparent mode */}
        <div
          className={`w-full max-w-md h-72 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center overflow-hidden shadow-md transition-all ${
            bgReplacement === 'transparent'
              ? 'bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[size:20px_20px] dark:bg-[linear-gradient(45deg,#1f1f23_25%,transparent_25%),linear-gradient(-45deg,#1f1f23_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1f1f23_75%),linear-gradient(-45deg,transparent_75%,#1f1f23_75%)]'
              : ''
          }`}
        >
          {viewCompare === 'original' ? (
            <img src={currentImage} alt="Original" className="max-h-full max-w-full object-contain" />
          ) : processedUrl ? (
            <img src={processedUrl} alt="Cutout" className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="text-xs text-zinc-400 animate-pulse">Rendering cutout...</div>
          )}
        </div>

        {/* View Toggle Bar */}
        <div className="mt-4 flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-2xl shadow-xs">
          <button
            onClick={() => setViewCompare('processed')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewCompare === 'processed'
                ? 'bg-fuchsia-600 text-white shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Cutout View
          </button>
          <button
            onClick={() => setViewCompare('original')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewCompare === 'original'
                ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Original
          </button>
        </div>
      </div>

      {/* Control Panel: Sliders & Backdrop Replacements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tuning Controls */}
        <div className="p-5 rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-fuchsia-500" />
            <span>Cutout Precision Controls</span>
          </h3>

          <div>
            <div className="flex justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              <span>Tolerance Threshold</span>
              <span className="font-mono text-fuchsia-600 dark:text-fuchsia-400">{tolerance}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="90"
              value={tolerance}
              onChange={e => setTolerance(Number(e.target.value))}
              className="w-full accent-fuchsia-600 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-400">Higher values remove similar surrounding shades</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              <span>Edge Feather / Smoothing</span>
              <span className="font-mono text-fuchsia-600 dark:text-fuchsia-400">{feather}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={feather}
              onChange={e => setFeather(Number(e.target.value))}
              className="w-full accent-fuchsia-600 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-400">Softens boundary edges to prevent harsh pixel borders</span>
          </div>
        </div>

        {/* Backdrop Swapper */}
        <div className="p-5 rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-fuchsia-500" />
            <span>Background Backdrop Replacement</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'transparent', label: 'Transparent', icon: '🏁' },
              { id: 'white', label: 'Clean White', icon: '⚪' },
              { id: 'black', label: 'Studio Black', icon: '⚫' },
              { id: 'gradient', label: 'Sunset Grad', icon: '🌅' },
              { id: 'neon', label: 'Cyan Aurora', icon: '🌌' },
            ].map(bg => (
              <button
                key={bg.id}
                onClick={() => {
                  sounds.playClick();
                  setBgReplacement(bg.id as any);
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  bgReplacement === bg.id
                    ? 'border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-300 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <span>{bg.icon}</span>
                <span className="truncate">{bg.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              onClick={handleSaveToHistory}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Save to Queue</span>
            </button>

            <button
              onClick={() => handleDownload()}
              className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>
      </div>

      {/* Processed Images Queue with Add and Delete Buttons Beside Each Item (User Request #5 requirement) */}
      {history.length > 0 && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Processed Cutout Queue ({history.length})
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Image</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {history.map(item => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-[size:8px_8px] bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%)] shrink-0">
                    <img src={item.processedUrl} alt="Thumbnail" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.name}</h4>
                    <span className="text-[10px] text-zinc-400 font-mono">Processed at {item.timestamp}</span>
                  </div>
                </div>

                {/* ADD and DELETE Buttons Beside EACH Queue Item */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleDownload(item.processedUrl, item.name)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Add another image to queue"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Add</span>
                  </button>

                  <button
                    onClick={() => handleDeleteHistoryItem(item.id)}
                    className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:border-rose-800 text-zinc-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Delete image from queue"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
