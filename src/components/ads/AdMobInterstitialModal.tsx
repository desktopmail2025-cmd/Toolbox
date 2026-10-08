import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, ShieldCheck, Sparkles } from 'lucide-react';
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
  };

  const handleClose = () => {
    try {
      admobService?.dismissInterstitial?.();
    } catch {}
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

        {/* Real Google Ad Container */}
        <div
          onClick={handleAdClick}
          className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer select-none bg-radial from-zinc-800/60 via-zinc-900 to-zinc-950 min-h-[300px]"
        >
          {/* Official Google Ads Responsive Canvas */}
          <div className="w-full max-w-[320px] min-h-[250px] flex items-center justify-center bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden relative p-2 shadow-inner">
            <ins
              ref={adSlotRef}
              className="adsbygoogle"
              style={{ display: 'inline-block', width: '300px', height: '250px' }}
              data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
              data-ad-slot={ADMOB_CONFIG.INTERSTITIAL_SLOT}
              data-ad-format="rectangle"
              data-full-width-responsive="true"
            />
          </div>

          {/* Ad Identification Info */}
          <div className="mt-4 flex flex-col items-center gap-1.5 text-zinc-400 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Google Mobile Ad Unit</span>
            </div>
            <div className="font-mono text-[10px] text-zinc-500 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-800">
              Unit: {ADMOB_CONFIG.INTERSTITIAL_ID}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
