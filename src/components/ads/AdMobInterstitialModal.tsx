import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, ExternalLink } from 'lucide-react';
import { admobService } from '../../services/admobService';

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

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanSkip(false);
      return;
    }

    setCountdown(5);
    setCanSkip(false);

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
    admobService.recordClick('interstitial');
  };

  const handleClose = () => {
    admobService.dismissInterstitial();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90dvh]">
        {/* Top Control Bar (AdMob Interstitial Header) */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-950/90 border-b border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
              Ad
            </span>
            <span className="font-semibold text-zinc-200">Google AdMob Interstitial</span>
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

            {canSkip ? (
              <button
                type="button"
                onClick={handleClose}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 text-zinc-950 hover:bg-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
                title="Close Ad"
              >
                <span>Close</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/80 text-zinc-300 text-xs font-mono font-medium border border-zinc-700">
                <span>Skip in</span>
                <span className="w-4 text-center font-bold text-amber-400">{countdown}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Ad Creative Canvas with Real App Logo */}
        <div
          onClick={handleAdClick}
          className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer select-none bg-radial from-indigo-950/60 via-zinc-900 to-zinc-950"
        >
          <div className="w-20 h-20 rounded-3xl bg-zinc-950 p-2 shadow-2xl mb-4 group-hover:scale-105 transition-transform border border-zinc-700/60 flex items-center justify-center">
            <img src="/icon.svg" alt="OmniToolbox" className="w-16 h-16 object-contain drop-shadow-md" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
            Featured Partner Showcase
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            OmniToolbox Ultimate Suite
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed mb-6">
            Access 100+ precision calculators, instant media converters, offline games, and real-time utilities.
          </p>

          <div className="w-full max-w-xs p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-between gap-3 mb-6">
            <div className="text-left">
              <div className="text-xs font-bold text-zinc-200">Free Lifetime Upgrades</div>
              <div className="text-[10px] text-zinc-400">Zero subscription fees · 100% On-device</div>
            </div>
            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
              4.9 ★ (12k+)
            </span>
          </div>

          <button
            type="button"
            className="w-full max-w-xs py-3 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Learn More / Download</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
