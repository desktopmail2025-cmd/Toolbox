import React, { useState, useEffect, useRef } from 'react';
import { X, Gift, CheckCircle2, AlertTriangle, Trophy, Info } from 'lucide-react';
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
  const totalDuration = 5;
  const adSlotRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(5);
      setIsCompleted(false);
      setShowSkipWarning(false);
      pushedRef.current = false;
      return;
    }

    setSecondsLeft(totalDuration);
    setIsCompleted(false);
    setShowSkipWarning(false);

    // Request Google Ads for rewarded slot
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
      {/* 1. Top Yellow Countdown Progress Bar */}
      <div className="w-full h-1 bg-zinc-800 shrink-0">
        <div
          className="h-full bg-[#fbbc04] transition-all duration-1000 ease-linear shadow-[0_0_8px_#fbbc04]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 2. Google AdMob Header Bar */}
      <div className="w-full bg-[#1e1e1e] border-b border-[#2d2d2d] px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
            Rewarded
          </span>
          <span className="text-zinc-300 text-xs font-medium truncate">
            Google AdMob Video Ad
          </span>
        </div>

        {/* Reward Status / Close */}
        <div className="flex items-center gap-2">
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
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
              title="Close Ad"
              aria-label="Close Ad"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Reward Status Banner */}
      <div className="w-full bg-zinc-900 border-b border-zinc-800 py-2 px-4 flex justify-center">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
          <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isCompleted
              ? `Reward Ready! Tap Claim to activate ${rewardDetails.type}`
              : `Reward in ${secondsLeft}s: ${rewardDetails.type}`}
          </span>
        </div>
      </div>

      {/* 4. Google Ad Insertion Container (Shows the ad provided by Google AdMob from the ID) */}
      <div className="relative flex-1 w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
        <ins
          ref={adSlotRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%', minHeight: '320px' }}
          data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
          data-ad-slot={ADMOB_CONFIG.REWARDED_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {/* Completed Claim Overlay Button if ad finishes */}
        {isCompleted && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleClaimReward}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>COLLECT 30-MIN AD-FREE PASS</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Bottom Footer with Ad Info */}
      <div className="w-full bg-[#1e1e1e] border-t border-[#2d2d2d] px-3 py-2 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-500" />
          <span>Provided by Google AdMob</span>
        </div>
        <span className="font-mono text-[10px] text-zinc-500">
          Slot: {ADMOB_CONFIG.REWARDED_SLOT}
        </span>
      </div>

      {/* Skip Early Confirmation Warning */}
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
