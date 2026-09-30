import React, { useState, useRef } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Upload, Download, Copy, Check, Pipette } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const CameraImageTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'color-picker-tool':
      return <ColorPickerView />;
    case 'image-compressor':
      return <ImageCompressorView />;
    case 'image-resizer':
      return <ImageResizerView />;
    case 'exif-metadata-viewer':
      return <ExifViewerView />;
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
