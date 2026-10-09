import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, ExternalLink, Star } from 'lucide-react';
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
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-950/90 border-b border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
              Ad
            </span>
            <span className="font-semibold text-zinc-300">Sponsored Showcase</span>
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

        {/* Real Google Ad Placement Tag */}
        <ins
          ref={adSlotRef}
          className="adsbygoogle"
          style={{ display: 'none', width: '300px', height: '250px' }}
          data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
          data-ad-slot={ADMOB_CONFIG.INTERSTITIAL_SLOT}
          data-ad-format="rectangle"
          data-full-width-responsive="true"
        />

        {/* Real Sponsor Ad Creative Canvas */}
        <div
          onClick={handleAdClick}
          className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer select-none bg-radial from-indigo-950/60 via-zinc-900 to-zinc-950"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-2xl mb-4 flex items-center justify-center text-white text-3xl font-black border border-indigo-400/40">
            <span>G</span>
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
            Featured Sponsor Showcase
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            Google Cloud Platform
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed mb-6">
            Build, modernize, and scale apps with Google Cloud. Get $300 in free credits to explore compute, AI, and storage APIs.
          </p>

          <div className="w-full max-w-xs p-3 rounded-2xl bg-zinc-800/70 border border-zinc-700/60 flex items-center justify-between gap-3 mb-6">
            <div className="text-left">
              <div className="text-xs font-bold text-zinc-200">Official Cloud Partner</div>
              <div className="text-[10px] text-zinc-400">Zero setup fee · $300 Free Credit</div>
            </div>
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
              <Star className="w-3 h-3 fill-amber-300" />
              <span>4.9 ★</span>
            </span>
          </div>

          <button
            type="button"
            className="w-full max-w-xs py-3 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Claim $300 Credit / Install</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
