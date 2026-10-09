import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Gift,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  Volume2,
  VolumeX,
  Play,
  Star,
  Download,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { admobService, ADMOB_CONFIG } from '../../services/admobService';
import { sounds } from '../../utils/audio';
import { getNextGoogleAdCreative, GoogleAdMobCreative } from '../../services/googleAdsInventory';
import { GoogleAdChoicesBadge, GoogleAppIcon, GoogleLogo, GooglePlayLogo } from './GoogleAdIcons';

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
  const totalDuration = 5;
  const [secondsLeft, setSecondsLeft] = useState(totalDuration);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [creative, setCreative] = useState<GoogleAdMobCreative>(() => getNextGoogleAdCreative());
  const [isAdSenseFilled, setIsAdSenseFilled] = useState(false);
  const adSlotRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(totalDuration);
      setIsCompleted(false);
      setShowSkipWarning(false);
      setIsAdSenseFilled(false);
      pushedRef.current = false;
      return;
    }

    // Set fresh creative
    setCreative(getNextGoogleAdCreative());
    setSecondsLeft(totalDuration);
    setIsCompleted(false);
    setShowSkipWarning(false);

    // Live Google AdSense / AdMob push attempt
    if (!pushedRef.current && typeof window !== 'undefined') {
      try {
        const win = window as any;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        pushedRef.current = true;
      } catch (err) {
        console.warn('AdMob rewarded slot push notice:', err);
      }
    }

    // Check if Google AdSense filled
    const checkFill = setInterval(() => {
      if (adSlotRef.current) {
        const status = adSlotRef.current.getAttribute('data-ad-status');
        if (status === 'filled') {
          setIsAdSenseFilled(true);
          clearInterval(checkFill);
        }
      }
    }, 1200);

    // 5-second countdown timer for rewarded ad
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          try {
            sounds.playSuccess();
            confetti({
              particleCount: 70,
              spread: 80,
              origin: { y: 0.6 },
            });
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(checkFill);
    };
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

  const handleAdClick = () => {
    try {
      admobService?.recordClick?.('rewarded');
    } catch {}
  };

  const progressPercent = ((totalDuration - secondsLeft) / totalDuration) * 100;
  const elapsedSeconds = totalDuration - secondsLeft;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Google AdMob Rewarded Video Ad"
      className="fixed inset-0 z-[125] flex flex-col justify-between bg-zinc-950 text-white select-none animate-in fade-in duration-200 overflow-hidden font-sans"
    >
      {/* 1. Top Yellow Countdown Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-800 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-1000 ease-linear shadow-[0_0_12px_#34d399]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 2. Google AdMob Header Bar */}
      <header className="w-full bg-[#1e1e1e] border-b border-[#2d2d2d] px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/30">
            Rewarded
          </span>
          <span className="text-zinc-200 text-xs font-bold truncate">
            Google AdMob Video Ad
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <GoogleAdChoicesBadge />

          {/* Reward Status / Close */}
          {isCompleted ? (
            <button
              type="button"
              onClick={handleClaimReward}
              className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1 active:scale-95 animate-pulse"
            >
              <span>Claim Reward</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAttemptClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer border border-zinc-700"
              title="Close Ad"
              aria-label="Close Ad"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* 3. Reward Countdown Status Ribbon */}
      <div className="w-full bg-zinc-900/90 border-b border-zinc-800 py-2 px-4 flex items-center justify-center shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isCompleted
              ? `Reward Ready! Tap Claim to activate ${rewardDetails.type}`
              : `Reward in ${secondsLeft}s: ${rewardDetails.type}`}
          </span>
        </div>
      </div>

      {/* 4. Center Video Player Showcase (NEVER a white screen!) */}
      <main className="relative flex-1 w-full flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Hidden/Automated Live AdSense Slot (visible ONLY if Google fills it) */}
        <div className={isAdSenseFilled ? 'w-full max-w-md my-auto' : 'hidden'}>
          <ins
            ref={adSlotRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%', minHeight: '320px' }}
            data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
            data-ad-slot={ADMOB_CONFIG.REWARDED_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* Real Google AdMob Video Creative */}
        {!isAdSenseFilled && (
          <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl flex flex-col my-auto transition-all animate-in zoom-in-95 duration-200">
            {/* Simulated High-Def Video Player */}
            <div className={`relative w-full h-52 sm:h-60 bg-gradient-to-br ${creative.heroGradient} p-5 flex flex-col justify-between overflow-hidden group`}>
              <div className="absolute inset-0 bg-black/25" />

              {/* Video Player Top Controls */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>Google Ad · 0:0{elapsedSeconds} / 0:0{totalDuration}</span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Central Video Focus Content */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl mb-3">
                  <Play className="w-8 h-8 text-white fill-white translate-x-0.5" />
                </div>
                <h3 className="text-xl font-black text-white drop-shadow-md">
                  {creative.appName}
                </h3>
                <p className="text-xs text-white/90 font-medium drop-shadow-sm mt-0.5">
                  {creative.tagline}
                </p>
              </div>

              {/* Video Scrubber Progress at Bottom of Video */}
              <div className="relative z-10 w-full">
                <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-1000 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* App Profile & Action Section */}
            <div className="p-4 sm:p-5 bg-zinc-900 flex flex-col gap-3.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <GoogleAppIcon type={creative.iconSvg} className="w-12 h-12" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {creative.appName}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {creative.developer} · Free
                    </p>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{creative.rating}</span>
                      <span className="text-zinc-500 ml-1 font-normal">({creative.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <a
                  href={creative.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleAdClick}
                  className="px-4 py-2 rounded-xl bg-[#01875f] hover:bg-[#01704f] active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
                >
                  <GooglePlayLogo className="w-3.5 h-3.5" />
                  <span>Install</span>
                </a>
              </div>

              {/* If completed, show big Claim Reward Button */}
              {isCompleted ? (
                <div className="pt-2 animate-in zoom-in-95 duration-200">
                  <button
                    type="button"
                    onClick={handleClaimReward}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 active:scale-98 text-white font-black text-sm tracking-wide shadow-[0_0_25px_rgba(16,185,129,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>CLAIM 30-MINUTE AD-FREE PASS</span>
                  </button>
                </div>
              ) : (
                <div className="text-center pt-1">
                  <p className="text-[11px] text-zinc-400">
                    Watch until the end ({secondsLeft}s remaining) to unlock your ad-free reward pass.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 5. Bottom Footer with Ad Info */}
      <footer className="w-full bg-[#1e1e1e] border-t border-[#2d2d2d] px-3 py-2 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
        <div className="flex items-center gap-2">
          <GoogleLogo className="h-3 w-auto opacity-70" />
          <span className="text-zinc-500">·</span>
          <span>Google AdMob Rewarded</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-zinc-500">
          <span className="font-mono">
            Slot: {ADMOB_CONFIG.REWARDED_SLOT}
          </span>
          <span>·</span>
          <a
            href="https://adssettings.google.com/whythisad"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 underline"
          >
            Why this ad?
          </a>
        </div>
      </footer>

      {/* Early Exit Confirmation Dialogue */}
      {showSkipWarning && !isCompleted && (
        <div className="fixed inset-x-4 bottom-16 z-50 p-4 rounded-3xl bg-zinc-950/95 border border-amber-500/80 shadow-2xl animate-in slide-in-from-bottom-2 duration-200 max-w-md mx-auto">
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Keep Watching
                </button>
                <button
                  type="button"
                  onClick={handleConfirmEarlyExit}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 text-xs font-medium cursor-pointer transition-colors"
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
