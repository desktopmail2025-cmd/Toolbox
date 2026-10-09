import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Zap, Info } from 'lucide-react';
import { admobService, ADMOB_CONFIG } from '../../services/admobService';

interface AdMobInterstitialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdMobInterstitialModal: React.FC<AdMobInterstitialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const adSlotRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanSkip(false);
      setIsInstalled(false);
      pushedRef.current = false;
      return;
    }

    setCountdown(5);
    setCanSkip(false);
    setIsInstalled(false);

    // Request Google Ads for web modal
    if (!pushedRef.current && typeof window !== 'undefined') {
      try {
        const win = window as any;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        pushedRef.current = true;
      } catch {}
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdClick = () => {
    try {
      admobService?.recordClick?.('interstitial');
    } catch {}
    setIsInstalled(true);
  };

  const handleClose = () => {
    try {
      admobService?.dismissInterstitial?.();
    } catch {}
    onClose();
  };

  const progressPercent = ((5 - countdown) / 5) * 100;

  return (
    <div className="fixed inset-0 z-[120] flex flex-col justify-between bg-black text-white select-none animate-in fade-in duration-200 overflow-hidden font-sans">
      {/* 1. Top Yellow Countdown Progress Bar (Exact Google AdMob Mobile Standard) */}
      <div className="w-full h-1 bg-zinc-800 shrink-0">
        <div
          className="h-full bg-[#fbbc04] transition-all duration-1000 ease-linear shadow-[0_0_8px_#fbbc04]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 2. Google AdMob Header Bar (App Tile, Title, Google Play, Install Button & Close) */}
      <div className="w-full bg-[#2a2a2a] border-b border-[#383838] px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 z-20">
        {/* App Info (Left) */}
        <div className="flex items-center gap-3 min-w-0">
          {/* App Icon: MorphoGrid Colorful Tile */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#0b1e36] via-[#1a3860] to-[#2563eb] p-1 shadow-md shrink-0 border border-white/10 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
              <rect width="48" height="48" rx="12" fill="url(#adBg)" />
              <path d="M24 10 L30 18 L38 12 L35 24 L42 28 L30 31 L24 40 L18 31 L6 28 L13 24 L10 12 L18 18 Z" fill="url(#goldCrown)" stroke="#fff" strokeWidth="1.5" />
              <circle cx="16" cy="22" r="3" fill="#ef4444" />
              <circle cx="24" cy="18" r="3.5" fill="#3b82f6" />
              <circle cx="32" cy="22" r="3" fill="#10b981" />
              <defs>
                <linearGradient id="adBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e3a8a" />
                  <stop offset="1" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="goldCrown" x1="6" y1="10" x2="42" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fef08a" />
                  <stop offset="0.5" stopColor="#eab308" />
                  <stop offset="1" stopColor="#ca8a04" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="min-w-0">
            <div className="text-white font-bold text-sm sm:text-base leading-tight truncate">
              MorphoGrid
            </div>
            {/* Google Play Badge with 4-color triangle */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M3.6 2.5C3.3 2.8 3.1 3.3 3.1 3.9V20.1C3.1 20.7 3.3 21.2 3.6 21.5L3.7 21.6L12.7 12.6V12.4L3.7 2.4L3.6 2.5Z" fill="#2196F3" />
                <path d="M15.7 15.6L12.7 12.6V12.4L15.7 9.4L15.8 9.5L19.4 11.5C20.4 12.1 20.4 13 19.4 13.5L15.8 15.5L15.7 15.6Z" fill="#FFC107" />
                <path d="M15.8 15.5L12.7 12.5L3.6 21.6C4 22 4.7 22 5.6 21.5L15.8 15.5Z" fill="#4CAF50" />
                <path d="M15.8 9.5L5.6 3.5C4.7 3 4 3 3.6 3.4L12.7 12.5L15.8 9.5Z" fill="#F44336" />
              </svg>
              <span className="text-zinc-300 text-[11px] sm:text-xs font-medium">Google Play</span>
            </div>
          </div>
        </div>

        {/* Action & Close Controls (Right) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Authentic Material 3 Google Play Pill Button */}
          <button
            type="button"
            onClick={handleAdClick}
            className="px-5 sm:px-6 py-2 rounded-full bg-[#a8c7fa] hover:bg-[#8ab4f8] text-[#041e49] font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {isInstalled ? 'Installed' : 'Install'}
          </button>

          {/* Close / Skip Timer */}
          {canSkip ? (
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
              title="Close Ad"
              aria-label="Close Ad"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="h-8 px-2.5 rounded-full bg-black/60 border border-zinc-700 text-zinc-300 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
              <span>{countdown}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Real Google AdMob Slot for SDK reporting */}
      <ins
        ref={adSlotRef}
        className="adsbygoogle"
        style={{ display: 'none', width: '300px', height: '250px' }}
        data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
        data-ad-slot={ADMOB_CONFIG.INTERSTITIAL_SLOT}
        data-ad-format="rectangle"
        data-full-width-responsive="true"
      />

      {/* 3. Main Ad Creative: Immersive Rich-Media Game Scene (Matching User's Screenshot 2) */}
      <div
        onClick={handleAdClick}
        className="relative flex-1 w-full bg-gradient-to-b from-[#1b0803] via-[#3a0d03] to-[#120401] flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden cursor-pointer"
      >
        {/* Background Temple & Golden Radiance Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/30 via-red-900/40 to-black pointer-events-none" />

        {/* Falling Golden Coins Particles Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
          <div className="absolute top-4 left-6 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-yellow-500 shadow-lg animate-bounce" />
          <div className="absolute top-12 right-10 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-yellow-500 shadow-lg animate-pulse" />
          <div className="absolute top-28 left-14 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-yellow-500 shadow-md" />
          <div className="absolute bottom-20 right-8 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-yellow-500 shadow-lg" />
        </div>

        {/* Top-Left Audio Mute/Unmute Overlay */}
        <div className="absolute top-3 left-3 z-30">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-md"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>
        </div>

        {/* Chinese Temple Roof Top Piece */}
        <div className="relative z-10 w-full max-w-sm flex flex-col items-center mt-2">
          {/* Temple Eaves */}
          <div className="relative w-full flex justify-center">
            <svg viewBox="0 0 280 60" className="w-64 sm:w-72 drop-shadow-[0_8px_16px_rgba(234,179,8,0.4)]">
              <path d="M10 50 Q 70 20 140 10 Q 210 20 270 50 L 250 55 Q 210 35 140 25 Q 70 35 30 55 Z" fill="#b91c1c" stroke="#fef08a" strokeWidth="2" />
              <path d="M50 35 Q 140 18 230 35 L 210 50 Q 140 32 70 50 Z" fill="#eab308" />
              <circle cx="140" cy="18" r="8" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
            </svg>
          </div>

          {/* Golden Medallion with Ox Emblem "牛" */}
          <div className="-mt-3 relative w-16 h-16 rounded-full bg-gradient-to-b from-[#fef08a] via-[#eab308] to-[#92400e] border-4 border-[#fde047] flex items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.8)] z-10">
            <div className="w-12 h-12 rounded-full bg-[#991b1b] border-2 border-[#fef08a] flex items-center justify-center text-[#fef08a] font-black text-xl">
              牛
            </div>
          </div>
        </div>

        {/* Center Jackpot Typography: "SUPER MEGA GANHO 10,000.00" */}
        <div className="relative z-10 my-auto text-center flex flex-col items-center py-2">
          <div className="relative">
            {/* 3D Glowing Text "SUPER" */}
            <div
              className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-[#93c5fd] to-[#1e40af] drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
              style={{
                WebkitTextStroke: '1.5px #1e3a8a',
                filter: 'drop-shadow(0 0 15px rgba(59,130,246,0.6))',
              }}
            >
              SUPER
            </div>

            {/* 3D Glowing Text "MEGA GANHO" */}
            <div
              className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fed7aa] to-[#d97706] drop-shadow-[0_6px_12px_rgba(0,0,0,0.95)] -mt-1"
              style={{
                WebkitTextStroke: '2px #7c2d12',
                filter: 'drop-shadow(0 0 20px rgba(234,179,8,0.8))',
              }}
            >
              MEGA GANHO
            </div>

            {/* Massive Golden Amount "10,000.00" */}
            <div
              className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fef08a] to-[#ca8a04] mt-1"
              style={{
                WebkitTextStroke: '2px #713f12',
                filter: 'drop-shadow(0 0 25px rgba(250,204,21,0.9))',
              }}
            >
              10,000.00
            </div>
          </div>

          {/* Golden Bull Mascot (With Sunglasses & Gold Jacket - Screenshot 2) */}
          <div className="relative mt-2 flex flex-col items-center">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
              {/* Golden Mascot SVG Artwork */}
              <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
                {/* Golden Body */}
                <ellipse cx="80" cy="115" rx="42" ry="32" fill="url(#goldJacket)" stroke="#78350f" strokeWidth="2.5" />
                {/* Jacket Zipper */}
                <line x1="80" y1="95" x2="80" y2="140" stroke="#fef08a" strokeWidth="2" />
                {/* Bull Head */}
                <circle cx="80" cy="65" r="32" fill="url(#goldHead)" stroke="#78350f" strokeWidth="2.5" />
                {/* Horns */}
                <path d="M52 52 Q 35 30 50 16 Q 62 25 60 46 Z" fill="url(#goldHorns)" stroke="#78350f" strokeWidth="2" />
                <path d="M108 52 Q 125 30 110 16 Q 98 25 100 46 Z" fill="url(#goldHorns)" stroke="#78350f" strokeWidth="2" />
                {/* Snout */}
                <ellipse cx="80" cy="78" rx="20" ry="14" fill="#fde047" stroke="#854d0e" strokeWidth="2" />
                <circle cx="72" cy="78" r="3" fill="#713f12" />
                <circle cx="88" cy="78" r="3" fill="#713f12" />
                {/* Cool Black Sunglasses */}
                <polygon points="56,58 76,58 74,68 60,68" fill="#111827" stroke="#fef08a" strokeWidth="1.5" />
                <polygon points="84,58 104,58 100,68 86,68" fill="#111827" stroke="#fef08a" strokeWidth="1.5" />
                <line x1="76" y1="61" x2="84" y2="61" stroke="#fef08a" strokeWidth="2" />
                {/* Thumbs Up Hand Left */}
                <path d="M40 100 Q 32 90 38 82 Q 44 80 48 88 L 48 106 Z" fill="url(#goldHead)" stroke="#78350f" strokeWidth="2" />
                {/* Thumbs Up Hand Right */}
                <path d="M120 100 Q 128 90 122 82 Q 116 80 112 88 L 112 106 Z" fill="url(#goldHead)" stroke="#78350f" strokeWidth="2" />

                <defs>
                  <linearGradient id="goldJacket" x1="40" y1="85" x2="120" y2="145" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fef08a" />
                    <stop offset="0.5" stopColor="#eab308" />
                    <stop offset="1" stopColor="#854d0e" />
                  </linearGradient>
                  <linearGradient id="goldHead" x1="50" y1="35" x2="110" y2="95" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fde047" />
                    <stop offset="0.6" stopColor="#ca8a04" />
                    <stop offset="1" stopColor="#713f12" />
                  </linearGradient>
                  <linearGradient id="goldHorns" x1="35" y1="15" x2="125" y2="55" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" />
                    <stop offset="0.5" stopColor="#facc15" />
                    <stop offset="1" stopColor="#854d0e" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* 4. Bottom Controls Overlay (Turbo Speed Left & Ad Info Right) */}
        <div className="relative z-20 w-full flex items-center justify-between px-2 pt-2">
          {/* Turbo Icon (Left) */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-black/60 border border-yellow-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <Zap className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 mt-0.5">
              Turbo
            </span>
          </div>

          {/* AdChoices Badge (Right) */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-white/20 text-white/80 text-[10px] backdrop-blur-xs">
            <Info className="w-3 h-3 text-sky-400" />
            <span className="font-semibold">Ad</span>
          </div>
        </div>
      </div>
    </div>
  );
};
