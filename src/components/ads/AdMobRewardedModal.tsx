import React, { useState, useEffect, useRef } from 'react';
import { X, Gift, Volume2, VolumeX, CheckCircle2, AlertTriangle, Trophy, ShieldCheck } from 'lucide-react';
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
              particleCount: 50,
              spread: 60,
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92dvh]">
        {/* Top Rewarded Video Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-950/90 border-b border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40 flex items-center gap-1">
              <Gift className="w-3 h-3" />
              Rewarded Ad
            </span>
            <span className="font-semibold text-zinc-200">Google AdMob Rewarded</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {isCompleted ? (
              <button
                type="button"
                onClick={handleClaimReward}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer hover:bg-emerald-600 active:scale-95"
              >
                <span>Claim</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAttemptClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Video Progress Bar */}
        <div className="w-full h-1 bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Real Google Rewarded Ad Canvas */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center select-none bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900">
          {!isCompleted ? (
            <>
              {/* Official Google Ads Rewarded Slot Element */}
              <div className="w-full max-w-[320px] min-h-[250px] flex items-center justify-center bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden relative p-2 shadow-inner mb-4">
                <ins
                  ref={adSlotRef}
                  className="adsbygoogle"
                  style={{ display: 'inline-block', width: '300px', height: '250px' }}
                  data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
                  data-ad-slot={ADMOB_CONFIG.REWARDED_SLOT}
                  data-ad-format="rectangle"
                  data-full-width-responsive="true"
                />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full border-2 border-emerald-500/50 flex items-center justify-center">
                  <span className="font-mono text-xs font-bold text-emerald-400">{secondsLeft}s</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  Reward: 30-Minute 100% Ad-Free Pass
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 bg-zinc-950/80 px-2.5 py-1 rounded border border-zinc-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Unit: {ADMOB_CONFIG.REWARDED_ID}</span>
              </div>
            </>
          ) : (
            <div className="animate-in zoom-in-95 duration-300 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mb-4 text-emerald-400 shadow-xl">
                <Trophy className="w-10 h-10 animate-bounce" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                Reward Unlocked!
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                Congratulations!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-sm mb-6">
                You unlocked a <strong className="text-emerald-400 font-bold">30-Minute 100% Ad-Free Pass</strong>. Enjoy uninterrupted access to all tools!
              </p>

              <button
                type="button"
                onClick={handleClaimReward}
                className="py-3 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Collect Reward</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Skip Early Confirmation Warning */}
        {showSkipWarning && !isCompleted && (
          <div className="absolute inset-x-4 bottom-14 p-4 rounded-2xl bg-zinc-950 border border-amber-500/60 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-left flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white">Leave Early?</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  If you close before the video ends, you will not receive your 30-minute ad-free pass.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setShowSkipWarning(false)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Keep Watching
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmEarlyExit}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-xs font-medium cursor-pointer"
                  >
                    Close Without Reward
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
