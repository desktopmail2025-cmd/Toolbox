import React, { useEffect } from 'react';
import { X, ShieldCheck, Layers, Smartphone } from 'lucide-react';
import { admobService, ADMOB_CONFIG } from '../../services/admobService';
import { GoogleAdChoicesBadge } from './GoogleAdIcons';

interface AdMobInterstitialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdMobInterstitialModal: React.FC<AdMobInterstitialModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    try {
      admobService?.dismissInterstitial?.();
    } catch {}
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Google AdMob Interstitial Configuration"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-white select-none animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <header className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#fbbc04] text-zinc-950 font-black text-xs">
              Ad
            </span>
            <span className="text-zinc-200 text-xs font-bold">
              Google AdMob Interstitial
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
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-100">
                Native AdMob Full-Screen Transition
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Targeted for Android APK release
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-mono text-[11px]">Ad Unit ID:</span>
              <span className="font-mono text-[11px] text-zinc-200">{ADMOB_CONFIG.INTERSTITIAL_ID}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-mono text-[11px]">Platform:</span>
              <span className="text-zinc-200 font-semibold text-[11px]">Android (@capacitor-community/admob)</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Interstitials run through Google Mobile Ads SDK on native devices between screen transitions. On the web version, Google AdSense Auto Ads handle vignette overlays on verified domains.
          </p>

          <button
            type="button"
            onClick={handleClose}
            className="w-full py-3 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Continue to Application
          </button>
        </div>
      </div>
    </div>
  );
};
