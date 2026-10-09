import React, { useEffect } from 'react';
import { X, Gift, Sparkles, Smartphone, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { admobService, ADMOB_CONFIG } from '../../services/admobService';
import { sounds } from '../../utils/audio';
import { GoogleAdChoicesBadge } from './GoogleAdIcons';

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
  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = () => {
    try {
      sounds.playSuccess();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
      admobService.dismissRewarded(true);
    } catch {}
    onClose();
  };

  const handleClose = () => {
    try {
      admobService.dismissRewarded(false);
    } catch {}
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Google AdMob Rewarded Video Unit"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-white select-none animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <header className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#fbbc04] text-zinc-950 font-black text-xs">
              Reward
            </span>
            <span className="text-zinc-200 text-xs font-bold">
              Google AdMob Rewarded Unit
            </span>
          </div>

          <div className="flex items-center gap-2">
            <GoogleAdChoicesBadge />
            <button
              type="button"
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-100">
                {rewardDetails.type}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Unlocked reward perk for Toolbox
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-mono text-[11px]">Ad Unit ID:</span>
              <span className="font-mono text-[11px] text-zinc-200">{ADMOB_CONFIG.REWARDED_ID}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-mono text-[11px]">Native Mobile Target:</span>
              <span className="text-zinc-200 font-semibold text-[11px]">Android APK (@capacitor-community/admob)</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Rewarded video ads are served through the native Google Mobile Ads SDK on physical Android devices. In web mode, your requested perk is granted directly without interruption.
          </p>

          <button
            type="button"
            onClick={handleClaim}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Claim & Apply Reward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
