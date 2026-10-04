import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Flame, Tv, Newspaper, Share2, Download, Copy, Check, Sparkles,
  Upload, Image as ImageIcon, Sliders, RefreshCw, Volume2, Globe,
  ShieldAlert, Clock, MapPin, Eye, Undo, ZoomIn, ZoomOut, AlertCircle, RotateCcw
} from 'lucide-react';
import { sounds } from '../../utils/audio';

type TemplateType = 'tv-breaking' | 'newspaper' | 'social-flash' | 'urgent-bulletin';
type AspectRatio = '16:9' | '1:1' | '9:16';

interface PresetStory {
  category: string;
  badge: string;
  headline: string;
  subHeadline: string;
  location: string;
  ticker: string;
  reporter: string;
  station: string;
  imageUrl: string;
}

const PRESET_STORIES: PresetStory[] = [
  {
    category: 'Global Alert',
    badge: 'BREAKING NEWS',
    headline: 'HISTORIC GLOBAL ACCORD SIGNED IN GENEVA',
    subHeadline: 'Leaders from 140 nations reach unanimous breakthrough agreement on international climate and tech standards',
    location: 'GENEVA, SWITZERLAND',
    ticker: '🔴 LIVE: UN Summit delegates finalize historic declaration · Markets surge worldwide · Leaders praise diplomatic triumph',
    reporter: 'Marcus Sterling · Chief International Correspondent',
    station: 'WORLD NEWS 24',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    category: 'Science & Discovery',
    badge: 'EXCLUSIVE DISCOVERY',
    headline: 'ASTRONOMERS CONFIRM WATER OCEANS ON EXOPLANET',
    subHeadline: 'Deep-space observatory detects atmospheric water vapor and organic signatures 40 light years away',
    location: 'SPACE OBSERVATORY',
    ticker: '🚀 JUST IN: Deep space signals verified by astrophysics council · Planetary research teams prepare robotic mission blueprint',
    reporter: 'Dr. Elena Rostova · Science Desk',
    station: 'DISCOVERY REPORT',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    category: 'Sports Championship',
    badge: 'CHAMPIONS CROWNED',
    headline: 'THRILLING 94TH-MINUTE WINNER SEALS TITLE',
    subHeadline: 'Underdogs stage miraculous second-half comeback to lift the trophy in front of 85,000 spectators',
    location: 'WEMBLEY STADIUM',
    ticker: '🏆 FINAL WHISTLE: Historic championship parade announced for tomorrow · Fans celebrate across the capital',
    reporter: 'Liam Gallagher · Senior Sports Editor',
    station: 'SPORTS NETWORK',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    category: 'Markets & Economy',
    badge: 'MARKET ALERT',
    headline: 'STOCK INDICES HIT ALL-TIME RECORD HIGH',
    subHeadline: 'Tech sector rally drives benchmark indices past historic thresholds as interest rates stabilize',
    location: 'NEW YORK WALL ST',
    ticker: '📈 TRADING DESK: Nasdaq up 2.8% · Global tech stocks surge · Economic outlook upgraded by international monetary council',
    reporter: 'Sarah Jenkins · Financial Bureau',
    station: 'FINANCIAL TODAY',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    category: 'Technology Breakthrough',
    badge: 'SPECIAL REPORT',
    headline: 'NEW QUANTUM BATTERY CHARGES IN 12 SECONDS',
    subHeadline: 'Revolutionary solid-state energy cell promises 1,000-mile electric vehicle range with zero thermal runaway',
    location: 'SILICON VALLEY',
    ticker: '⚡ TECH FLASH: Commercial production slated for next quarter · Automotive manufacturers sign multi-billion supply pacts',
    reporter: 'Alex Chen · Tech Correspondent',
    station: 'TECH PULSE',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
];

export const HeadlineMakerTool: React.FC = () => {
  const [template, setTemplate] = useState<TemplateType>('tv-breaking');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  // Story state
  const [badgeText, setBadgeText] = useState<string>('BREAKING NEWS');
  const [headline, setHeadline] = useState<string>('HISTORIC GLOBAL ACCORD SIGNED IN GENEVA');
  const [subHeadline, setSubHeadline] = useState<string>(
    'Leaders from 140 nations reach unanimous breakthrough agreement on international climate and tech standards'
  );
  const [locationTag, setLocationTag] = useState<string>('GENEVA, SWITZERLAND');
  const [tickerText, setTickerText] = useState<string>(
    '🔴 LIVE: UN Summit delegates finalize historic declaration · Markets surge worldwide · Leaders praise diplomatic triumph'
  );
  const [reporterName, setReporterName] = useState<string>('Marcus Sterling · Chief International Correspondent');
  const [stationName, setStationName] = useState<string>('GLOBAL NEWS 24');
  const [customBadgeColor, setCustomBadgeColor] = useState<string>('#dc2626'); // Red

  // Image manipulation
  const [imageUrl, setImageUrl] = useState<string>(PRESET_STORIES[0].imageUrl);
  const [imageZoom, setImageZoom] = useState<number>(100);
  const [imagePanY, setImagePanY] = useState<number>(50);
  const [imagePanX, setImagePanX] = useState<number>(50);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(105);
  const [showScanlines, setShowScanlines] = useState<boolean>(true);
  const [showVignette, setShowVignette] = useState<boolean>(true);
  const [liveBlink, setLiveBlink] = useState<boolean>(true);

  // Export & copy states
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Movable overlay element offsets (Item 3: Moveable with touch or mouse)
  const [stationOffset, setStationOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [locationOffset, setLocationOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [lowerThirdOffset, setLowerThirdOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tickerOffset, setTickerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  const resetElementPositions = () => {
    sounds.playClick();
    setStationOffset({ x: 0, y: 0 });
    setLocationOffset({ x: 0, y: 0 });
    setLowerThirdOffset({ x: 0, y: 0 });
    setTickerOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDragId(id);
    const cur = id === 'station' ? stationOffset
      : id === 'location' ? locationOffset
      : id === 'lowerThird' ? lowerThirdOffset
      : tickerOffset;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: cur.x,
      initY: cur.y,
    };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (id: string, e: React.PointerEvent) => {
    if (activeDragId !== id || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    const nx = dragStartRef.current.initX + dx;
    const ny = dragStartRef.current.initY + dy;
    if (id === 'station') setStationOffset({ x: nx, y: ny });
    else if (id === 'location') setLocationOffset({ x: nx, y: ny });
    else if (id === 'lowerThird') setLowerThirdOffset({ x: nx, y: ny });
    else if (id === 'ticker') setTickerOffset({ x: nx, y: ny });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeDragId) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      setActiveDragId(null);
      dragStartRef.current = null;
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Play dramatic breaking sound effect when changing badge
  const playSting = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      
      // Brass-like impact chord
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(220, now); // A3
      osc2.frequency.setValueAtTime(440, now); // A4
      osc1.frequency.exponentialRampToValueAtTime(110, now + 0.6);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch {
      sounds.playSuccess();
    }
  };

  // Switch to preset story
  const applyPreset = (preset: PresetStory) => {
    sounds.playClick();
    setBadgeText(preset.badge);
    setHeadline(preset.headline);
    setSubHeadline(preset.subHeadline);
    setLocationTag(preset.location);
    setTickerText(preset.ticker);
    setReporterName(preset.reporter);
    setStationName(preset.station);
    setImageUrl(preset.imageUrl);
    playSting();
  };

  // Handle local user photo upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playSuccess();
    const reader = new FileReader();
    reader.onload = evt => {
      if (typeof evt.target?.result === 'string') {
        setImageUrl(evt.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Render high-res banner to canvas for download
  const generateCanvasImage = useCallback(async (): Promise<HTMLCanvasElement | null> => {
    const canvas = document.createElement('canvas');
    let width = 1920;
    let height = 1080;

    if (aspectRatio === '1:1') {
      width = 1200;
      height = 1200;
    } else if (aspectRatio === '9:16') {
      width = 1080;
      height = 1920;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Load background image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    await new Promise<void>(resolve => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });

    // Draw background with brightness/contrast
    ctx.save();
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    if (img.width && img.height) {
      const zoomFactor = imageZoom / 100;
      const aspect = img.width / img.height;
      const targetAspect = width / height;

      let drawW, drawH;
      if (aspect > targetAspect) {
        drawH = height * zoomFactor;
        drawW = drawH * aspect;
      } else {
        drawW = width * zoomFactor;
        drawH = drawW / aspect;
      }

      const offsetX = (width - drawW) * (imagePanX / 100);
      const offsetY = (height - drawH) * (imagePanY / 100);

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    } else {
      // Fallback dark gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();

    // Vignette overlay
    if (showVignette) {
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.3,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    }

    // TV Broadcast scanlines effect
    if (showScanlines && template === 'tv-breaking') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }
    }

    // Render Template Specific Overlays
    if (template === 'tv-breaking') {
      const scale = width / (previewContainerRef.current?.clientWidth || 640);
      const stX = stationOffset.x * scale;
      const stY = stationOffset.y * scale;
      const locX = locationOffset.x * scale;
      const locY = locationOffset.y * scale;
      const ltX = lowerThirdOffset.x * scale;
      const ltY = lowerThirdOffset.y * scale;
      const tkX = tickerOffset.x * scale;
      const tkY = tickerOffset.y * scale;

      // 1. Top Station Bug / Live Stamp
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(50 + stX, 40 + stY, 240, 50);

      ctx.fillStyle = customBadgeColor;
      ctx.fillRect(50 + stX, 40 + stY, 70, 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LIVE', 85 + stX, 72 + stY);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(stationName, 135 + stX, 72 + stY);

      // Top Right Location Bug
      if (locationTag) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(width - 320 + locX, 40 + locY, 270, 50);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`📍 ${locationTag}`, width - 185 + locX, 72 + locY);
      }

      // Lower Third News Block
      const lowerY = height - 260 + ltY;
      const lowerH = 180;

      // Dark shadow backdrop
      const lowerGrad = ctx.createLinearGradient(0, lowerY - 60, 0, height);
      lowerGrad.addColorStop(0, 'rgba(0,0,0,0)');
      lowerGrad.addColorStop(0.3, 'rgba(0,0,0,0.85)');
      lowerGrad.addColorStop(1, 'rgba(0,0,0,0.98)');
      ctx.fillStyle = lowerGrad;
      ctx.fillRect(0, lowerY - 60, width, height - (lowerY - 60));

      // Breaking Badge Box
      ctx.fillStyle = customBadgeColor;
      ctx.fillRect(50 + ltX, lowerY, 320, 44);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText.toUpperCase(), 210 + ltX, lowerY + 30);

      // Main Headline Bar (Navy / Dark background)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(50 + ltX, lowerY + 44, width - 100, 76);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(headline.toUpperCase(), 75 + ltX, lowerY + 96);

      // Sub-headline Banner
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(50 + ltX, lowerY + 120, width - 100, 44);

      ctx.fillStyle = '#0f172a';
      ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(subHeadline, 75 + ltX, lowerY + 150);

      // Bottom News Ticker (Yellow / Gold)
      const tickerY = height - 60 + tkY;
      ctx.fillStyle = '#eab308';
      ctx.fillRect(0 + tkX, tickerY, width, 60);

      ctx.fillStyle = '#09090b';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(tickerText, 50 + tkX, tickerY + 38);

    } else if (template === 'newspaper') {
      // Vintage Newspaper Filter
      ctx.fillStyle = 'rgba(245, 239, 224, 0.94)'; // Vintage newsprint paper
      ctx.fillRect(0, 0, width, height);

      // Newspaper Header Box
      ctx.fillStyle = '#1c1917';
      ctx.textAlign = 'center';
      ctx.font = 'bold 20px Georgia, serif';
      ctx.fillText('THE INDEPENDENT CHRONICLE · WORLD ARCHIVE EDITION', width / 2, 70);

      // Huge Masthead Title
      ctx.font = '900 84px Georgia, "Times New Roman", serif';
      ctx.fillText('THE DAILY CHRONICLE', width / 2, 160);

      // Divider rules
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#1c1917';
      ctx.beginPath();
      ctx.moveTo(50, 180);
      ctx.lineTo(width - 50, 180);
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, 220);
      ctx.lineTo(width - 50, 220);
      ctx.stroke();

      // Date / Weather / Price line
      ctx.font = 'italic 16px Georgia, serif';
      ctx.textAlign = 'left';
      ctx.fillText(`VOL. CLXVIII NO. 45,920 · ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 60, 206);
      ctx.textAlign = 'right';
      ctx.fillText('LATE CITY EDITION · TWO SHILLINGS', width - 60, 206);

      // Massive Newspaper Headline
      ctx.fillStyle = '#0c0a09';
      ctx.textAlign = 'center';
      ctx.font = '900 68px Georgia, "Times New Roman", serif';
      ctx.fillText(headline.toUpperCase(), width / 2, 310);

      // Sub-headline
      ctx.font = 'bold italic 26px Georgia, serif';
      ctx.fillText(subHeadline, width / 2, 360);

      // Center Photo in vintage border
      const photoW = width - 200;
      const photoH = height - 520;
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 4;
      ctx.strokeRect(100, 400, photoW, photoH);

      // Draw photo with monochrome filter
      ctx.save();
      ctx.filter = 'grayscale(100%) contrast(125%) sepia(25%)';
      ctx.drawImage(img, 104, 404, photoW - 8, photoH - 8);
      ctx.restore();

      // Photo caption & Byline
      ctx.fillStyle = '#292524';
      ctx.font = 'italic 18px Georgia, serif';
      ctx.textAlign = 'left';
      ctx.fillText(`PHOTOGRAPH: WIRE SERVICES · REPORTED BY ${reporterName.toUpperCase()}`, 100, height - 70);

    } else if (template === 'social-flash') {
      // Modern Social Media Flash Card
      // Dark glass container in center
      const cardW = width - 140;
      const cardH = height - 140;
      ctx.fillStyle = 'rgba(9, 9, 11, 0.88)';
      ctx.roundRect(70, 70, cardW, cardH, 32);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Category Pill
      ctx.fillStyle = customBadgeColor;
      ctx.roundRect(120, 120, 200, 48, 24);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, 220, 152);

      // Station / Source
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`• ${stationName} • VERIFIED DISPATCH`, 340, 152);

      // Headline
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 56px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(headline, 120, 260);

      // Sub-headline
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(subHeadline, 120, 330);

      // Embedded Image preview
      const previewW = cardW - 100;
      const previewH = cardH - 350;
      ctx.save();
      ctx.roundRect(120, 380, previewW, previewH, 20);
      ctx.clip();
      ctx.drawImage(img, 120, 380, previewW, previewH);
      ctx.restore();

      // Reporter footer
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Reporting by ${reporterName} • ${locationTag}`, 120, height - 100);

    } else if (template === 'urgent-bulletin') {
      // Danger / Hazard Urgent Stripes
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, 0, width, 40);
      ctx.fillRect(0, height - 40, width, 40);

      // Dark body
      const bodyGrad = ctx.createLinearGradient(0, 40, 0, height - 40);
      bodyGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      bodyGrad.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
      ctx.fillStyle = bodyGrad;
      ctx.fillRect(0, 40, width, height - 80);

      // Emergency Seal
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(width / 2, 160, 60, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', width / 2, 178);

      // Header
      ctx.fillStyle = '#ef4444';
      ctx.font = '900 42px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`⚠️ ${badgeText} ⚠️`, width / 2, 260);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 64px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(headline.toUpperCase(), width / 2, 360);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(subHeadline, width / 2, 430);

      // Image
      const bImgW = 800;
      const bImgH = 420;
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.strokeRect((width - bImgW) / 2, 480, bImgW, bImgH);
      ctx.drawImage(img, (width - bImgW) / 2, 480, bImgW, bImgH);
      ctx.restore();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`OFFICIAL BULLETIN ISSUED BY: ${stationName} • ${locationTag}`, width / 2, height - 70);
    }

    return canvas;
  }, [
    aspectRatio, imageUrl, brightness, contrast, imageZoom, imagePanX, imagePanY,
    showVignette, showScanlines, template, customBadgeColor, stationName,
    locationTag, badgeText, headline, subHeadline, tickerText, reporterName
  ]);

  // Download high-resolution PNG
  const handleDownloadImage = async () => {
    sounds.playClick();
    setIsExporting(true);
    try {
      const canvas = await generateCanvasImage();
      if (!canvas) return;

      const link = document.createElement('a');
      link.download = `omnitoolbox-headline-news-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      sounds.playSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    sounds.playClick();
    setIsExporting(true);
    try {
      const canvas = await generateCanvasImage();
      if (!canvas) return;

      canvas.toBlob(async blob => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopySuccess(true);
            sounds.playSuccess();
            setTimeout(() => setCopySuccess(false), 2500);
          } catch {
            // Fallback: download if clipboard API is restricted
            handleDownloadImage();
          }
        }
      }, 'image/png');
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Story Presets */}
      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0 animate-pulse">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-50">
                  Headline & Breaking News Studio
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                  Broadcast Grade
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Design TV lower-thirds, newspaper front pages, breaking tickers, and viral social bulletins.
              </p>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              {copySuccess ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copySuccess ? 'Copied Image!' : 'Copy Image'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all"
            >
              {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isExporting ? 'Generating...' : 'Download PNG'}</span>
            </button>
          </div>
        </div>

        {/* Quick Presets Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 shrink-0">
            Quick Stories:
          </span>
          {PRESET_STORIES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors shrink-0 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-red-500" />
              <span>{p.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Workstation (Split View: Controls on Left, Live Canvas on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CONTROLS & CONTENT (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Format & Style Chooser */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
              <span>1. Format & Template</span>
              <button
                onClick={playSting}
                className="text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer font-bold"
                title="Play dramatic breaking sound"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio Sting</span>
              </button>
            </h3>

            {/* Template Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setTemplate('tv-breaking');
                  playSting();
                }}
                className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  template === 'tv-breaking'
                    ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <Tv className="w-4 h-4 text-red-500" />
                <span>TV Live Broadcast</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setTemplate('newspaper');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  template === 'newspaper'
                    ? 'border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <Newspaper className="w-4 h-4 text-amber-600" />
                <span>Newspaper Front</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setTemplate('social-flash');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  template === 'social-flash'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <Share2 className="w-4 h-4 text-indigo-500" />
                <span>Social Flash Card</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setTemplate('urgent-bulletin');
                  playSting();
                }}
                className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  template === 'urgent-bulletin'
                    ? 'border-rose-600 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Urgent Bulletin</span>
              </button>
            </div>

            {/* Aspect Ratio Switcher */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Aspect Ratio:</span>
              <div className="flex items-center gap-1.5">
                {(['16:9', '1:1', '9:16'] as AspectRatio[]).map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => {
                      sounds.playClick();
                      setAspectRatio(ratio);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      aspectRatio === ratio
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Inputs (Headline, Sub-headline, Ticker, Badges) */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 space-y-3.5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              2. Headlines & Copy
            </h3>

            {/* Badge & Color */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-zinc-500 block mb-1">
                  Alert Badge Text
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={e => setBadgeText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold uppercase rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 block mb-1">
                  Badge Color
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={customBadgeColor}
                    onChange={e => setCustomBadgeColor(e.target.value)}
                    className="w-8 h-8 rounded-xl cursor-pointer border border-zinc-200 dark:border-zinc-700 p-0"
                  />
                  <div className="flex gap-1">
                    {['#dc2626', '#2563eb', '#d97706'].map(col => (
                      <button
                        key={col}
                        onClick={() => setCustomBadgeColor(col)}
                        style={{ backgroundColor: col }}
                        className="w-4 h-4 rounded-full cursor-pointer hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <div>
              <label className="text-[10px] font-bold text-zinc-500 block mb-1">
                Main Headline (Uppercase impact)
              </label>
              <textarea
                rows={2}
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs font-black uppercase rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:border-red-500"
                placeholder="MAIN HEADLINE TEXT..."
              />
            </div>

            {/* Sub-headline */}
            <div>
              <label className="text-[10px] font-bold text-zinc-500 block mb-1">
                Sub-Headline / Secondary Details
              </label>
              <textarea
                rows={2}
                value={subHeadline}
                onChange={e => setSubHeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:border-red-500"
                placeholder="Secondary descriptive context..."
              />
            </div>

            {/* Location & Station Name */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 block mb-1">
                  Location Stamp
                </label>
                <input
                  type="text"
                  value={locationTag}
                  onChange={e => setLocationTag(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 block mb-1">
                  Station / Network Bug
                </label>
                <input
                  type="text"
                  value={stationName}
                  onChange={e => setStationName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Bottom Scrolling News Ticker */}
            <div>
              <label className="text-[10px] font-bold text-zinc-500 block mb-1">
                Bottom News Ticker Feed
              </label>
              <input
                type="text"
                value={tickerText}
                onChange={e => setTickerText(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:border-red-500"
                placeholder="🔴 LIVE: Update 1 · Update 2..."
              />
            </div>

            {/* Reporter / Byline */}
            <div>
              <label className="text-[10px] font-bold text-zinc-500 block mb-1">
                Reporter Byline
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={e => setReporterName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Image & Camera Controls */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                3. Backdrop Image Controls
              </h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Zoom Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-zinc-500">
                <span>Image Zoom:</span>
                <span>{imageZoom}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="250"
                value={imageZoom}
                onChange={e => setImageZoom(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            {/* Pan Vertical Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-zinc-500">
                <span>Vertical Position (Pan Y):</span>
                <span>{imagePanY}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={imagePanY}
                onChange={e => setImagePanY(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            {/* Effects toggles */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={showScanlines}
                  onChange={e => setShowScanlines(e.target.checked)}
                  className="rounded text-red-600"
                />
                <span>TV Scanlines Effect</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVignette}
                  onChange={e => setShowVignette(e.target.checked)}
                  className="rounded text-red-600"
                />
                <span>Vignette Shadow</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REAL-TIME INTERACTIVE PREVIEW (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full sticky top-20 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Broadcast Preview (Drag elements to reposition)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetElementPositions}
                  className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                  title="Reset moved elements to default positions"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Layout</span>
                </button>
                <span className="text-[10px] font-mono font-bold text-zinc-400">
                  Ratio: {aspectRatio}
                </span>
              </div>
            </div>

            {/* The Live Graphic Box */}
            <div
              ref={previewContainerRef}
              className={`w-full relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/80 dark:border-zinc-800 bg-black select-none ${
                aspectRatio === '16:9' ? 'aspect-video' : aspectRatio === '1:1' ? 'aspect-square' : 'aspect-[9/16] max-w-sm mx-auto'
              }`}
            >
              {/* Background Photo */}
              <div
                className="absolute inset-0 bg-cover bg-no-repeat transition-all duration-150"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: `${imagePanX}% ${imagePanY}%`,
                  transform: `scale(${imageZoom / 100})`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                }}
              />

              {/* Vignette */}
              {showVignette && (
                <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/75 pointer-events-none" />
              )}

              {/* TV Scanlines */}
              {showScanlines && template === 'tv-breaking' && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%)',
                    backgroundSize: '100% 4px',
                  }}
                />
              )}

              {/* TEMPLATE 1: TV LIVE BROADCAST */}
              {template === 'tv-breaking' && (
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {/* Top Bar: Station Bug & Location */}
                  <div className="flex items-center justify-between p-3 sm:p-5 pointer-events-none">
                    <div
                      onPointerDown={e => handlePointerDown('station', e)}
                      onPointerMove={e => handlePointerMove('station', e)}
                      onPointerUp={handlePointerUp}
                      style={{
                        transform: `translate(${stationOffset.x}px, ${stationOffset.y}px)`,
                      }}
                      className="flex items-center shadow-lg rounded-lg overflow-hidden border border-white/20 cursor-grab active:cursor-grabbing pointer-events-auto touch-none select-none transition-shadow hover:ring-2 hover:ring-white/40"
                      title="Drag with touch or mouse to reposition station bug"
                    >
                      <div
                        style={{ backgroundColor: customBadgeColor }}
                        className="px-2.5 py-1 text-white text-[11px] sm:text-xs font-black tracking-widest flex items-center gap-1.5 animate-pulse"
                      >
                        <span className="w-2 h-2 rounded-full bg-white inline-block animate-ping" />
                        <span>LIVE</span>
                      </div>
                      <div className="bg-black/85 backdrop-blur-md px-3 py-1 text-white text-[11px] sm:text-xs font-extrabold tracking-wider">
                        {stationName}
                      </div>
                    </div>

                    {locationTag && (
                      <div
                        onPointerDown={e => handlePointerDown('location', e)}
                        onPointerMove={e => handlePointerMove('location', e)}
                        onPointerUp={handlePointerUp}
                        style={{
                          transform: `translate(${locationOffset.x}px, ${locationOffset.y}px)`,
                        }}
                        className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-amber-400 text-[10px] sm:text-xs font-bold tracking-wider shadow-lg flex items-center gap-1 cursor-grab active:cursor-grabbing pointer-events-auto touch-none select-none transition-shadow hover:ring-2 hover:ring-amber-400/50"
                        title="Drag with touch or mouse to reposition location stamp"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{locationTag}</span>
                      </div>
                    )}
                  </div>

                  {/* Lower Third News Block */}
                  <div
                    onPointerDown={e => handlePointerDown('lowerThird', e)}
                    onPointerMove={e => handlePointerMove('lowerThird', e)}
                    onPointerUp={handlePointerUp}
                    style={{
                      transform: `translate(${lowerThirdOffset.x}px, ${lowerThirdOffset.y}px)`,
                    }}
                    className="space-y-0 shadow-2xl cursor-grab active:cursor-grabbing pointer-events-auto touch-none select-none transition-shadow hover:ring-2 hover:ring-red-500/40"
                    title="Drag with touch or mouse to reposition lower third headline"
                  >
                    {/* Dark gradient behind lower third */}
                    <div className="bg-gradient-to-t from-black via-black/90 to-transparent pt-10 px-3 sm:px-6 pb-2">
                      {/* Alert Badge */}
                      <div className="inline-block">
                        <div
                          style={{ backgroundColor: customBadgeColor }}
                          className="px-3.5 py-1 text-white text-xs sm:text-sm font-black tracking-wider uppercase rounded-t-lg shadow-md flex items-center gap-1.5"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>{badgeText}</span>
                        </div>
                      </div>

                      {/* Main Headline (Navy block) */}
                      <div className="bg-slate-950/95 border-l-4 border-red-500 px-3.5 sm:px-5 py-2 sm:py-3 shadow-xl">
                        <h4 className="text-sm sm:text-lg md:text-xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-sm">
                          {headline}
                        </h4>
                      </div>

                      {/* Sub-headline (Light bar) */}
                      <div className="bg-zinc-100 text-zinc-950 px-3.5 sm:px-5 py-1.5 shadow-md">
                        <p className="text-[10px] sm:text-xs font-bold truncate">
                          {subHeadline}
                        </p>
                      </div>
                    </div>

                    {/* Scrolling Ticker Bar */}
                    <div
                      onPointerDown={e => handlePointerDown('ticker', e)}
                      onPointerMove={e => handlePointerMove('ticker', e)}
                      onPointerUp={handlePointerUp}
                      style={{
                        transform: `translate(${tickerOffset.x}px, ${tickerOffset.y}px)`,
                      }}
                      className="bg-amber-400 text-zinc-950 px-4 py-1.5 flex items-center gap-3 overflow-hidden border-t border-amber-300 cursor-grab active:cursor-grabbing pointer-events-auto touch-none select-none hover:ring-2 hover:ring-amber-300"
                      title="Drag with touch or mouse to reposition news ticker"
                    >
                      <span className="font-mono text-[10px] sm:text-xs font-black uppercase shrink-0 bg-black text-amber-400 px-1.5 py-0.5 rounded">
                        UPDATE
                      </span>
                      <div className="truncate text-[10px] sm:text-xs font-extrabold tracking-wide">
                        {tickerText}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TEMPLATE 2: NEWSPAPER FRONT PAGE */}
              {template === 'newspaper' && (
                <div className="absolute inset-0 bg-[#f4ecd8] text-stone-900 p-4 sm:p-6 flex flex-col justify-between overflow-hidden font-serif select-none pointer-events-none">
                  <div>
                    <div className="text-center text-[9px] sm:text-[10px] font-bold tracking-widest uppercase border-b border-stone-800 pb-1">
                      THE DAILY CHRONICLE · HISTORIC ARCHIVE EDITION
                    </div>
                    <div className="text-center text-xl sm:text-3xl font-black tracking-tight my-1 uppercase">
                      THE DAILY CHRONICLE
                    </div>
                    <div className="flex justify-between items-center text-[8px] sm:text-[10px] italic border-y-2 border-stone-900 py-0.5 mb-2">
                      <span>VOL. CLXVIII NO. 45,920</span>
                      <span>LATE CITY EDITION</span>
                      <span>PRICE: TWO SHILLINGS</span>
                    </div>

                    <h3 className="text-center text-sm sm:text-xl md:text-2xl font-black uppercase leading-tight my-2">
                      {headline}
                    </h3>
                    <p className="text-center text-[10px] sm:text-xs italic font-bold text-stone-700 mb-3">
                      {subHeadline}
                    </p>
                  </div>

                  {/* Photo In Newspaper */}
                  <div className="flex-1 my-1 border-2 border-stone-900 relative overflow-hidden max-h-48 sm:max-h-64">
                    <img
                      src={imageUrl}
                      alt=""
                      className="w-full h-full object-cover grayscale contrast-125 sepia-25"
                    />
                  </div>

                  <div className="text-[9px] sm:text-[10px] italic flex justify-between border-t border-stone-400 pt-1 text-stone-600">
                    <span>Special Dispatch • Wire Services</span>
                    <span>By {reporterName}</span>
                  </div>
                </div>
              )}

              {/* TEMPLATE 3: SOCIAL FLASH CARD */}
              {template === 'social-flash' && (
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between pointer-events-none">
                  <div className="bg-zinc-950/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 text-white space-y-2.5 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <span
                        style={{ backgroundColor: customBadgeColor }}
                        className="px-2.5 py-1 text-[10px] sm:text-xs font-black uppercase rounded-lg"
                      >
                        {badgeText}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400">
                        {stationName} • VERIFIED
                      </span>
                    </div>

                    <h3 className="text-base sm:text-xl font-black tracking-tight leading-snug">
                      {headline}
                    </h3>

                    <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                      {subHeadline}
                    </p>
                  </div>

                  <div className="bg-black/80 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-white text-[10px] flex items-center justify-between">
                    <span className="font-semibold text-zinc-400">By {reporterName}</span>
                    <span className="text-amber-400 font-bold">{locationTag}</span>
                  </div>
                </div>
              )}

              {/* TEMPLATE 4: URGENT BULLETIN */}
              {template === 'urgent-bulletin' && (
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between bg-black/85 text-white pointer-events-none border-t-8 border-b-8 border-amber-500">
                  <div className="text-center space-y-2">
                    <div className="inline-block px-3 py-1 bg-red-600 text-white text-xs sm:text-sm font-black rounded-full uppercase tracking-wider animate-pulse">
                      ⚠️ {badgeText} ⚠️
                    </div>
                    <h3 className="text-base sm:text-2xl font-black uppercase tracking-tight text-white leading-tight">
                      {headline}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                      {subHeadline}
                    </p>
                  </div>

                  <div className="text-center text-[10px] text-zinc-400 font-mono border-t border-zinc-800 pt-2">
                    OFFICIAL DISPATCH: {stationName} • {locationTag}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Hints */}
            <div className="p-3 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>Rendered directly on 1080p broadcast canvas</span>
              </span>
              <button
                onClick={handleDownloadImage}
                className="text-red-600 dark:text-red-400 font-bold hover:underline cursor-pointer"
              >
                Download Graphic →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
