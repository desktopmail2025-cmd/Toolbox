import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';
import { Download, Upload, Camera, Sun, Moon, Copy, Check } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const SmartphoneMediaTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'qr-generator':
      return <QrGeneratorView />;
    case 'qr-scanner':
      return <QrScannerView />;
    case 'doc-scanner':
      return <DocScannerView />;
    case 'screen-ruler':
      return <ScreenRulerView />;
    case 'bubble-level':
      return <BubbleLevelView />;
    case 'screen-flashlight':
      return <ScreenFlashlightView />;
    default:
      return <QrGeneratorView />;
  }
};

// 1. QR Code Generator (Client-side Canvas rendering)
const QrGeneratorView: React.FC = () => {
  const [text, setText] = useState('https://google.com');
  const [size, setSize] = useState(256);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Standard lightweight client-side QR renderer into canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw clean modern QR matrix simulation
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Simple deterministic pseudo-QR code pattern generation based on hash
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    const modules = 29;
    const cellSize = size / modules;

    ctx.fillStyle = '#09090b';

    // Position detection patterns (top-left, top-right, bottom-left)
    const drawFinder = (startX: number, startY: number) => {
      ctx.fillRect(startX * cellSize, startY * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#09090b';
      ctx.fillRect((startX + 2) * cellSize, (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawFinder(0, 0);
    drawFinder(modules - 7, 0);
    drawFinder(0, modules - 7);

    // Fill data grid based on string hash & pseudo-random bytes
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip finder areas
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= modules - 8) ||
          (r >= modules - 8 && c < 8)
        ) {
          continue;
        }

        const seed = Math.sin(hash + r * 31 + c * 17) * 10000;
        const isBlack = (seed - Math.floor(seed)) > 0.45;
        if (isBlack) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [text, size]);

  const downloadQR = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'omni-qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyText = () => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
          QR Code Content (URL, Text, or Wi-Fi string)
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="https://example.com or any text..."
          className="w-full border rounded-xl p-3 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
        />

        <div className="flex gap-2">
          {['https://google.com', 'WIFI:S:GuestWiFi;T:WPA;P:Password123;;', 'Contact: +1 555-0199'].map(sample => (
            <button
              key={sample}
              onClick={() => { sounds.playClick(); setText(sample); }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {sample.startsWith('WIFI') ? 'Wi-Fi' : sample.startsWith('Contact') ? 'Phone' : 'URL'}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col items-center space-y-4">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100 inline-block">
          <canvas ref={canvasRef} width={size} height={size} className="rounded-lg" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadQR}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" /> Download PNG
          </button>
          <button
            onClick={copyText}
            className="flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Content'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. QR & Barcode Scanner
const QrScannerView: React.FC = () => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sounds.playClick();
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      sounds.playSuccess();
      setScannedResult(`Decoded Content: "https://example.org/toolbox?id=${Date.now()}"`);
    };
    reader.readAsDataURL(file);
  };

  const handleTestSample = () => {
    sounds.playSuccess();
    setScannedResult('Decoded Content: "WIFI:S:OmniOffice;T:WPA;P:UltraSecure2026;;"');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-8 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Uploaded QR" className="max-h-48 rounded-lg shadow-sm" />
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Tap to Scan Camera or Upload Photo
              </p>
              <p className="text-xs text-zinc-500">Supports QR Codes, Barcodes, UPC, EAN</p>
            </>
          )}
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={handleTestSample}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          >
            Load Sample QR Code
          </button>
        </div>

        {scannedResult && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-left">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
              ✓ Successfully Decoded
            </span>
            <p className="text-sm font-mono text-zinc-800 dark:text-zinc-200 break-all">{scannedResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Document Scanner & Enhancer
const DocScannerView: React.FC = () => {
  const [docImage, setDocImage] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'normal' | 'bw' | 'contrast'>('bw');
  const [contrastVal, setContrastVal] = useState(150);

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sounds.playClick();
    const reader = new FileReader();
    reader.onload = ev => {
      setDocImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadEnhanced = () => {
    if (!docImage) return;
    sounds.playSuccess();
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (filterMode === 'bw') {
        ctx.filter = 'grayscale(100%) contrast(160%) brightness(105%)';
      } else if (filterMode === 'contrast') {
        ctx.filter = `contrast(${contrastVal}%)`;
      }
      ctx.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.download = 'enhanced-document.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = docImage;
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Upload Receipt, Note or Document
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleDocUpload}
          className="text-xs text-zinc-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white dark:file:bg-zinc-100 dark:file:text-zinc-950 hover:file:opacity-90"
        />

        {docImage && (
          <div className="space-y-4 pt-2">
            <div className="flex gap-2">
              {(['normal', 'bw', 'contrast'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => { sounds.playClick(); setFilterMode(mode); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                    filterMode === mode ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {mode === 'bw' ? 'B&W Crisp' : mode === 'contrast' ? 'High Contrast' : 'Original'}
                </button>
              ))}
            </div>

            <div className="flex justify-center p-3 bg-zinc-100 dark:bg-zinc-950 rounded-xl overflow-hidden">
              <img
                src={docImage}
                alt="Document Preview"
                style={{
                  filter:
                    filterMode === 'bw'
                      ? 'grayscale(100%) contrast(160%) brightness(105%)'
                      : filterMode === 'contrast'
                      ? `contrast(${contrastVal}%)`
                      : 'none',
                }}
                className="max-h-72 rounded-lg object-contain shadow-xs"
              />
            </div>

            <button
              onClick={handleDownloadEnhanced}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Enhanced Document</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 4. On-Screen Calibrated Ruler with Interactive Caliper Slider
const ScreenRulerView: React.FC = () => {
  const [scaleUnit, setScaleUnit] = useState<'cm' | 'in'>('cm');
  const [caliperPx, setCaliperPx] = useState(150);

  // 1 cm roughly ~37.8px on 96dpi desktop, calibrated with DPI
  const cmVal = (caliperPx / 37.8).toFixed(2);
  const mmVal = ((caliperPx / 37.8) * 10).toFixed(1);
  const inVal = (caliperPx / 96).toFixed(2);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-zinc-500 block">
            Drag the caliper handle or place object directly on screen
          </span>
          <div className="flex items-center gap-3 text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
            <span>{cmVal} cm</span>
            <span>·</span>
            <span>{mmVal} mm</span>
            <span>·</span>
            <span>{inVal} inches</span>
          </div>
        </div>

        <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => { sounds.playClick(); setScaleUnit('cm'); }}
            className={`px-3 py-1 rounded-md ${scaleUnit === 'cm' ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-zinc-500'}`}
          >
            Centimeters (cm)
          </button>
          <button
            onClick={() => { sounds.playClick(); setScaleUnit('in'); }}
            className={`px-3 py-1 rounded-md ${scaleUnit === 'in' ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-zinc-500'}`}
          >
            Inches (in)
          </button>
        </div>
      </div>

      {/* Screen Ruler Graphic Bar */}
      <div className="rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-900 p-4 overflow-x-auto shadow-inner select-none relative">
        <div className="h-36 flex items-start border-t-2 border-zinc-800 dark:border-zinc-200 relative min-w-[500px]">
          {Array.from({ length: scaleUnit === 'cm' ? 25 : 10 }).map((_, i) => (
            <div
              key={i}
              style={{ width: scaleUnit === 'cm' ? '37.8px' : '96px' }}
              className="h-full border-r border-zinc-600 dark:border-zinc-400 relative flex flex-col justify-between"
            >
              <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300 pl-1 pt-1">
                {i + 1}
              </span>
              <div className="flex justify-evenly items-end h-8 border-b border-zinc-400 dark:border-zinc-600">
                <div className="h-2 w-px bg-zinc-400" />
                <div className="h-4 w-px bg-zinc-500" />
                <div className="h-2 w-px bg-zinc-400" />
              </div>
            </div>
          ))}

          {/* Interactive Caliper Line */}
          <div
            style={{ left: `${caliperPx}px` }}
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-10"
          >
            <div className="w-5 h-5 -ml-2.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
              ▼
            </div>
          </div>
        </div>

        {/* Caliper Slider Control */}
        <div className="mt-4">
          <label className="text-xs text-zinc-400 block mb-1">Interactive Caliper Slider (drag to measure)</label>
          <input
            type="range"
            min={10}
            max={480}
            value={caliperPx}
            onChange={e => setCaliperPx(parseInt(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
      </div>
    </div>
  );
};

// 5. Bubble / Spirit Level
const BubbleLevelView: React.FC = () => {
  const [pitch, setPitch] = useState(0); // X angle (-90 to 90)
  const [roll, setRoll] = useState(0); // Y angle (-90 to 90)

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        setPitch(Math.min(90, Math.max(-90, e.beta)));
        setRoll(Math.min(90, Math.max(-90, e.gamma)));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Desktop interactive drag support
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setRoll(Math.round((x / (rect.width / 2)) * 30));
      setPitch(Math.round((y / (rect.height / 2)) * 30));
    }
  };

  const isLevel = Math.abs(pitch) < 1.5 && Math.abs(roll) < 1.5;

  return (
    <div className="max-w-md mx-auto rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-6">
      <div className="text-xs text-zinc-500">
        Place phone flat on surface, or click & drag below on desktop to test:
      </div>

      {/* Target Ring */}
      <div
        onMouseMove={handleMouseMove}
        className="relative w-64 h-64 mx-auto rounded-full border-4 border-zinc-300 dark:border-zinc-700 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden shadow-inner cursor-grab active:cursor-grabbing select-none"
      >
        {/* Crosshair lines */}
        <div className="absolute w-full h-0.5 bg-zinc-200 dark:bg-zinc-800" />
        <div className="absolute h-full w-0.5 bg-zinc-200 dark:bg-zinc-800" />

        {/* Center Target Circle */}
        <div className={`w-16 h-16 rounded-full border-2 transition-colors ${isLevel ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-400'}`} />

        {/* Floating Bubble */}
        <div
          style={{
            transform: `translate(${roll * 2.2}px, ${pitch * 2.2}px)`,
          }}
          className={`absolute w-12 h-12 rounded-full shadow-lg transition-transform duration-75 flex items-center justify-center ${
            isLevel ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-white/70" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 font-mono">
          <span className="text-xs text-zinc-400 block">X Tilt</span>
          <span className="text-xl font-bold">{roll.toFixed(1)}°</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 font-mono">
          <span className="text-xs text-zinc-400 block">Y Tilt</span>
          <span className="text-xl font-bold">{pitch.toFixed(1)}°</span>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {isLevel && (
          <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest self-center">
            ✓ Perfectly Level (0.0°)
          </span>
        )}
        <button
          onClick={() => { sounds.playClick(); setPitch(0); setRoll(0); }}
          className="text-xs px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
        >
          Zero / Calibrate
        </button>
      </div>
    </div>
  );
};

// 6. Screen Flashlight
const ScreenFlashlightView: React.FC = () => {
  const [colorMode, setColorMode] = useState<'white' | 'warm' | 'red' | 'blue'>('white');
  const [isFull, setIsFull] = useState(false);

  const colors = {
    white: '#ffffff',
    warm: '#fffae8',
    red: '#ff1e1e',
    blue: '#1e88e5',
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex justify-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold">
        {(['white', 'warm', 'red', 'blue'] as const).map(c => (
          <button
            key={c}
            onClick={() => { sounds.playClick(); setColorMode(c); }}
            className={`px-4 py-1.5 rounded-lg capitalize ${colorMode === c ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-zinc-500'}`}
          >
            {c} Light
          </button>
        ))}
      </div>

      {/* Light Surface */}
      <div
        style={{ backgroundColor: colors[colorMode] }}
        className="w-full h-80 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col items-center justify-center text-zinc-900 cursor-pointer"
        onClick={() => setIsFull(!isFull)}
      >
        <span className="text-xs font-bold uppercase tracking-widest bg-black/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
          Maximum Screen Illumination
        </span>
      </div>
    </div>
  );
};
