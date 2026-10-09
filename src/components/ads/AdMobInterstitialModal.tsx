import React, { useState, useEffect, useRef } from 'react';
import { X, Info } from 'lucide-react';
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
  const adSlotRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanSkip(false);
      pushedRef.current = false;
      return;
    }

    setCountdown(5);
    setCanSkip(false);

    // Request Google Ads from configured Ad Unit ID
    if (!pushedRef.current && typeof window !== 'undefined') {
      try {
        const win = window as any;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        pushedRef.current = true;
      } catch (err) {
        console.warn('AdMob interstitial slot push notice:', err);
      }
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

  const handleClose = () => {
    try {
      admobService?.dismissInterstitial?.();
    } catch {}
    onClose();
  };

  const progressPercent = ((5 - countdown) / 5) * 100;

  return (
    <div className="fixed inset-0 z-[120] flex flex-col justify-between bg-black text-white select-none animate-in fade-in duration-200 overflow-hidden font-sans">
      {/* 1. Top Countdown Progress Bar */}
      <div className="w-full h-1 bg-zinc-800 shrink-0">
        <div
          className="h-full bg-[#fbbc04] transition-all duration-1000 ease-linear shadow-[0_0_8px_#fbbc04]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 2. Google AdMob Header Bar */}
      <div className="w-full bg-[#1e1e1e] border-b border-[#2d2d2d] px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30">
            Ad
          </span>
          <span className="text-zinc-300 text-xs font-medium truncate">
            Google AdMob Interstitial
          </span>
        </div>

        {/* Close / Skip Timer */}
        <div className="flex items-center gap-2">
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
            <div className="h-8 px-3 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
              <span>{countdown}s</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Google Ad Insertion Container (Shows the ad provided by Google AdMob from the ID) */}
      <div className="relative flex-1 w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
        <ins
          ref={adSlotRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%', minHeight: '320px' }}
          data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
          data-ad-slot={ADMOB_CONFIG.INTERSTITIAL_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      {/* 4. Bottom Footer with Ad Info */}
      <div className="w-full bg-[#1e1e1e] border-t border-[#2d2d2d] px-3 py-2 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-500" />
          <span>Provided by Google AdMob</span>
        </div>
        <span className="font-mono text-[10px] text-zinc-500">
          Slot: {ADMOB_CONFIG.INTERSTITIAL_SLOT}
        </span>
      </div>
    </div>
  );
};
