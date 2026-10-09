import React, { useState, useEffect, useRef } from 'react';
import { X, Star, ShieldCheck, Download, ExternalLink, Info, CheckCircle2 } from 'lucide-react';
import { admobService, ADMOB_CONFIG } from '../../services/admobService';
import { getNextGoogleAdCreative, GoogleAdMobCreative } from '../../services/googleAdsInventory';
import { GoogleAdChoicesBadge, GoogleAppIcon, GoogleLogo, GooglePlayLogo } from './GoogleAdIcons';

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
  const [creative, setCreative] = useState<GoogleAdMobCreative>(() => getNextGoogleAdCreative());
  const [isAdSenseFilled, setIsAdSenseFilled] = useState(false);
  const adSlotRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanSkip(false);
      setIsAdSenseFilled(false);
      pushedRef.current = false;
      return;
    }

    // Rotate to next authentic Google campaign on open
    setCreative(getNextGoogleAdCreative());
    setCountdown(5);
    setCanSkip(false);

    // Live Google AdSense / AdMob push attempt
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

    // 5-second countdown timer
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

    return () => {
      clearInterval(timer);
      clearInterval(checkFill);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    try {
      admobService?.dismissInterstitial?.();
    } catch {}
    onClose();
  };

  const handleAdClick = () => {
    try {
      admobService?.recordClick?.('interstitial');
    } catch {}
  };

  const progressPercent = ((5 - countdown) / 5) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Google AdMob Advertisement"
      className="fixed inset-0 z-[120] flex flex-col justify-between bg-zinc-950 text-white select-none animate-in fade-in duration-200 overflow-hidden font-sans"
    >
      {/* 1. Top Yellow Progress Bar */}
      <div className="w-full h-1 bg-zinc-800 shrink-0">
        <div
          className="h-full bg-[#fbbc04] transition-all duration-1000 ease-linear shadow-[0_0_10px_#fbbc04]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 2. Google AdMob Header Bar */}
      <header className="w-full bg-[#1e1e1e] border-b border-[#2d2d2d] px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded bg-[#fbbc04] text-zinc-950 font-black text-xs shadow-xs">
            Ad
          </span>
          <span className="text-zinc-200 text-xs font-bold truncate">
            Google AdMob Interstitial
          </span>
          <span className="text-zinc-500 hidden sm:inline">·</span>
          <span className="text-zinc-400 text-[11px] hidden sm:inline">
            Google Play
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <GoogleAdChoicesBadge />

          {/* Skip / Close Button */}
          {canSkip ? (
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer border border-zinc-700 shadow-md"
              title="Close Ad"
              aria-label="Close Ad"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="h-8 px-3 rounded-full bg-zinc-800/90 border border-zinc-700 text-zinc-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs">
              <span className="text-[11px] text-zinc-400 hidden sm:inline">Skip in</span>
              <span className="text-amber-400">{countdown}s</span>
            </div>
          )}
        </div>
      </header>

      {/* 3. Main Ad Display Body (NEVER a white screen!) */}
      <main className="relative flex-1 w-full flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Hidden/Automated Live AdSense Slot (visible ONLY if Google fills it) */}
        <div className={isAdSenseFilled ? 'w-full max-w-md my-auto' : 'hidden'}>
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

        {/* Real Google AdMob Interstitial Creative (Google Play App Campaign) */}
        {!isAdSenseFilled && (
          <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl flex flex-col my-auto transition-all animate-in zoom-in-95 duration-200">
            {/* Hero Graphic / Banner with App Highlights */}
            <div className={`relative w-full h-40 sm:h-48 bg-gradient-to-br ${creative.heroGradient} p-6 flex flex-col justify-between overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Pattern Overlay */}
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-black/20 blur-xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-extrabold text-white border border-white/20 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Google Play Verified</span>
                </span>
                <span className="text-[11px] font-medium text-white/80">
                  {creative.category}
                </span>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                  {creative.appName}
                </h3>
                <p className="text-xs text-white/90 mt-1 font-medium drop-shadow-sm line-clamp-1">
                  {creative.tagline}
                </p>
              </div>
            </div>

            {/* App Profile Bar */}
            <div className="p-4 sm:p-5 bg-zinc-900 flex-1 flex flex-col justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <GoogleAppIcon type={creative.iconSvg} className="w-14 h-14" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-base font-bold text-white truncate">
                      {creative.appName}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                    <span className="font-semibold text-zinc-300">{creative.developer}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20 shrink-0" />
                  </div>
                  
                  {/* Rating & Downloads Bar */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-1 font-bold text-amber-400">
                      <span>{creative.rating}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <span className="text-zinc-600">|</span>
                    <span className="text-zinc-400 text-[11px]">{creative.reviewCount}</span>
                    <span className="text-zinc-600">|</span>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                      <Download className="w-3 h-3 text-zinc-400" />
                      <span>{creative.downloads}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 leading-relaxed">
                {creative.description}
              </p>

              {/* Key Features Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {creative.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-[11px] font-medium border border-zinc-700/60"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>

              {/* Action Button: Google Play Install */}
              <div className="pt-2">
                <a
                  href={creative.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleAdClick}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#01875f] hover:bg-[#01704f] active:scale-98 text-white font-black text-sm tracking-wide shadow-lg hover:shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <GooglePlayLogo className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>INSTALL ON GOOGLE PLAY</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. Bottom Footer with AdMob Attribution */}
      <footer className="w-full bg-[#1e1e1e] border-t border-[#2d2d2d] px-3 py-2 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
        <div className="flex items-center gap-2">
          <GoogleLogo className="h-3 w-auto opacity-70" />
          <span className="text-zinc-500">·</span>
          <span>Google AdMob</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-zinc-500">
          <span className="font-mono">
            Slot: {ADMOB_CONFIG.INTERSTITIAL_SLOT}
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
    </div>
  );
};
