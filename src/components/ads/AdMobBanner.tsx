import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Star, ShieldCheck, ExternalLink } from 'lucide-react';
import { admobService, ADMOB_CONFIG } from '../../services/admobService';
import { Capacitor } from '@capacitor/core';
import { getNextGoogleAdCreative, GoogleAdMobCreative } from '../../services/googleAdsInventory';
import { GoogleAdChoicesBadge, GoogleAppIcon, GooglePlayLogo } from './GoogleAdIcons';

interface AdMobBannerProps {
  onOpenPerformance?: () => void;
  variant?: 'bottom-docked' | 'inline';
  className?: string;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({
  variant = 'inline',
  className = '',
}) => {
  const isNative = Capacitor.isNativePlatform();
  const adSlotRef = useRef<HTMLModElement | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [creative, setCreative] = useState<GoogleAdMobCreative>(() => getNextGoogleAdCreative());
  const [isAdSenseFilled, setIsAdSenseFilled] = useState(false);
  const pushedRef = useRef(false);

  useEffect(() => {
    // Record banner impression in AdMob service
    try {
      admobService?.recordImpression?.('banner');
    } catch {}

    // On native mobile platform, native AdMob plugin controls banner view
    if (isNative) {
      try {
        admobService?.showNativeBanner?.();
      } catch {}
      return () => {
        try {
          admobService?.hideNativeBanner?.();
        } catch {}
      };
    }

    // Web AdSense integration
    if (!pushedRef.current && typeof window !== 'undefined') {
      try {
        const win = window as any;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        pushedRef.current = true;
      } catch (err) {
        console.warn('AdMob banner slot push notice:', err);
      }
    }

    // Check if live AdSense filled
    const checkFill = setInterval(() => {
      if (adSlotRef.current) {
        const status = adSlotRef.current.getAttribute('data-ad-status');
        if (status === 'filled') {
          setIsAdSenseFilled(true);
          clearInterval(checkFill);
        }
      }
    }, 1500);

    return () => clearInterval(checkFill);
  }, [isNative]);

  // On native mobile platform, native AdMob SDK displays the banner at bottom
  if (isNative) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className={`w-full flex justify-center py-1 ${className}`}>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/95 text-white dark:bg-zinc-100/95 dark:text-zinc-900 text-[10px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-zinc-700/50"
          title="Show Google AdMob Advertisement"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Google AdMob</span>
          <ChevronUp className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    );
  }

  const handleAdClick = () => {
    try {
      admobService?.recordClick?.('banner');
    } catch {}
  };

  return (
    <div
      className={`ad-banner-container w-full flex justify-center transition-all ${
        variant === 'bottom-docked' ? 'py-1 px-2' : 'my-2.5'
      } ${className}`}
    >
      <div className="relative w-full max-w-[480px] rounded-xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-[#18181b] shadow-sm hover:shadow-md transition-all">
        {/* AdMob Top Bar */}
        <div className="flex items-center justify-between px-2.5 py-1 bg-zinc-100/90 dark:bg-zinc-900/90 border-b border-zinc-200/70 dark:border-zinc-800 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 rounded bg-[#fbbc04] text-zinc-950 font-black text-[9px] shadow-xs">
              Ad
            </span>
            <span className="text-zinc-600 dark:text-zinc-300 font-semibold text-[10px]">
              Google AdMob
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">·</span>
            <span className="font-mono text-[9px] text-zinc-400 dark:text-zinc-500 truncate max-w-[120px]">
              {ADMOB_CONFIG.BANNER_SLOT}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <GoogleAdChoicesBadge />
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 ml-1"
              title="Minimize Ad"
              aria-label="Minimize Ad"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live AdSense Tag (hidden unless filled by Google, never renders as empty white box) */}
        <div className={isAdSenseFilled ? 'block w-full min-h-[60px]' : 'hidden'}>
          <ins
            ref={adSlotRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '60px', textAlign: 'center' }}
            data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
            data-ad-slot={ADMOB_CONFIG.BANNER_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* Real Google AdMob Banner Creative (Displayed whenever live AdSense is unfilled or loading) */}
        {!isAdSenseFilled && (
          <a
            href={creative.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="group flex items-center justify-between p-2.5 gap-3 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/60 transition-colors cursor-pointer"
          >
            {/* App Icon & Details */}
            <div className="flex items-center gap-2.5 min-w-0">
              <GoogleAppIcon type={creative.iconSvg} className="w-10 h-10 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {creative.appName}
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {creative.tagline}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                    <span>{creative.rating}</span>
                  </span>
                  <span>·</span>
                  <span className="truncate">{creative.developer}</span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free</span>
                </div>
              </div>
            </div>

            {/* Install Button in Google Play Styling */}
            <div className="shrink-0 flex items-center">
              <span className="px-3.5 py-1.5 rounded-full bg-[#01875f] hover:bg-[#01704f] text-white text-xs font-extrabold shadow-sm group-hover:scale-105 active:scale-95 transition-all flex items-center gap-1">
                <GooglePlayLogo className="w-3.5 h-3.5" />
                <span>Install</span>
              </span>
            </div>
          </a>
        )}
      </div>
    </div>
  );
};
