import React, { useState, useEffect, useRef } from 'react';
import { X, Gift, Volume2, VolumeX, CheckCircle2, AlertTriangle, Trophy, Zap, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { admobService, ADMOB_CONFIG } from '../../services/admobService';
import { sounds } from '../../utils/audio';

interface AdMobRewardedModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardDetails?: { type: string; amount: number };
}

export const AdMobRewardedModal: React.FC<AdMobRewardedModalProps> = ({
  isOpen,
  onClose,
  rewardDetails = { type: '30-Minute Ad-Free Pass', amount: 1 },
}) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const totalDuration = 5;
  const adSlotRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(5);
      setIsCompleted(false);
      setShowSkipWarning(false);
      setIsInstalled(false);
      pushedRef.current = false;
      return;
    }

    setSecondsLeft(totalDuration);
    setIsCompleted(false);
    setShowSkipWarning(false);
    setIsInstalled(false);

    // Request Google Ads for rewarded slot
    if (!pushedRef.current && typeof window !== 'undefined') {
      try {
        const win = window as any;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        pushedRef.current = true;
      } catch {}
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          try {
            sounds.playSuccess();
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaimReward = () => {
    try {
      admobService?.dismissRewarded?.(true);
    } catch {}
    onClose();
  };

  const handleAttemptClose = () => {
    if (isCompleted) {
      handleClaimReward();
      return;
    }
    setShowSkipWarning(true);
  };

  const handleConfirmEarlyExit = () => {
    try {
      admobService?.dismissRewarded?.(false);
    } catch {}
    onClose();
  };

  const progressPercent = ((totalDuration - secondsLeft) / totalDuration) * 100;

  return (
    <div className="fixed inset-0 z-[125] flex flex-col justify-between bg-black text-white select-none animate-in fade-in duration-200 overflow-hidden font-sans">
      {/* 1. Top Yellow Countdown Progress Bar (Exact Google AdMob Rewarded Standard) */}
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
              <rect width="48" height="48" rx="12" fill="url(#rwBg)" />
              <path d="M24 10 L30 18 L38 12 L35 24 L42 28 L30 31 L24 40 L18 31 L6 28 L13 24 L10 12 L18 18 Z" fill="url(#rwCrown)" stroke="#fff" strokeWidth="1.5" />
              <circle cx="16" cy="22" r="3" fill="#ef4444" />
              <circle cx="24" cy="18" r="3.5" fill="#3b82f6" />
              <circle cx="32" cy="22" r="3" fill="#10b981" />
              <defs>
                <linearGradient id="rwBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e3a8a" />
                  <stop offset="1" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="rwCrown" x1="6" y1="10" x2="42" y2="40" gradientUnits="userSpaceOnUse">
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
            onClick={() => {
              try {
                admobService?.recordClick?.('rewarded');
              } catch {}
              setIsInstalled(true);
            }}
            className="px-5 sm:px-6 py-2 rounded-full bg-[#a8c7fa] hover:bg-[#8ab4f8] text-[#041e49] font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {isInstalled ? 'Installed' : 'Install'}
          </button>

          {/* Reward Status / Close */}
          {isCompleted ? (
            <button
              type="button"
              onClick={handleClaimReward}
              className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1 active:scale-95 animate-pulse"
            >
              <span>Claim</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAttemptClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
              title="Close Ad"
              aria-label="Close Ad"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hidden Real Google AdMob Slot for SDK reporting */}
      <ins
        ref={adSlotRef}
        className="adsbygoogle"
        style={{ display: 'none', width: '300px', height: '250px' }}
        data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
        data-ad-slot={ADMOB_CONFIG.REWARDED_SLOT}
        data-ad-format="rectangle"
        data-full-width-responsive="true"
      />

      {/* 3. Main Ad Creative: Immersive Rich-Media Game Scene with Reward Banner */}
      <div className="relative flex-1 w-full bg-gradient-to-b from-[#1b0803] via-[#3a0d03] to-[#120401] flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden">
        {/* Background Temple & Golden Radiance Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/30 via-red-900/40 to-black pointer-events-none" />

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

        {/* Reward Status Banner at Top of Media */}
        <div className="relative z-10 w-full max-w-sm flex justify-center mt-2">
          <div className="px-3.5 py-1 rounded-full bg-black/60 border border-emerald-500/50 backdrop-blur-md flex items-center gap-2 shadow-lg">
            <Gift className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-white">
              {isCompleted ? 'Reward Ready: Click Claim!' : `Reward in ${secondsLeft}s: ${rewardDetails.type}`}
            </span>
          </div>
        </div>

        {/* Center Jackpot Typography: "SUPER MEGA GANHO 10,000.00" */}
        <div className="relative z-10 my-auto text-center flex flex-col items-center py-2">
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

          {/* Completed Claim Overlay Button */}
          {isCompleted && (
            <button
              type="button"
              onClick={handleClaimReward}
              className="mt-4 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm shadow-[0_0_30px_rgba(16,185,129,0.7)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Trophy className="w-5 h-5" />
              <span>COLLECT 30-MIN AD-FREE PASS</span>
            </button>
          )}
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

      {/* Skip Early Confirmation Warning (When user taps X before reward duration) */}
      {showSkipWarning && !isCompleted && (
        <div className="fixed inset-x-4 bottom-14 z-50 p-4 rounded-3xl bg-zinc-950/95 border border-amber-500/80 shadow-2xl animate-in slide-in-from-bottom-2 duration-200 max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-left flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white">Leave Early?</h4>
              <p className="text-xs text-zinc-300 mt-1">
                If you close before the timer ends, you will lose your <strong>30-minute ad-free pass</strong>.
              </p>
              <div className="flex items-center gap-2.5 mt-3">
                <button
                  type="button"
                  onClick={() => setShowSkipWarning(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Keep Watching
                </button>
                <button
                  type="button"
                  onClick={handleConfirmEarlyExit}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer transition-colors"
                >
                  Close Without Reward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
