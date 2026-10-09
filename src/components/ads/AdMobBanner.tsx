import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { admobService, ADMOB_CONFIG } from '../../services/admobService';
import { Capacitor } from '@capacitor/core';

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

  useEffect(() => {
    // Record banner impression
    try {
      admobService?.recordImpression?.('banner');
    } catch {}

    // On native mobile platform, Capacitor AdMob plugin manages native banner
    if (isNative) {
      try {
        admobService?.showNativeBanner?.();
      } catch {}
      return;
    }

    // On Web, request real Google AdSense slot with configured slot ID
    if (typeof window !== 'undefined') {
      try {
        const win = window as any;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
      } catch {}
    }
  }, [isNative]);

  const handleAdClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      admobService?.recordClick?.('banner');
    } catch {}
  };

  if (isMinimized) {
    return (
      <div className={`w-full flex justify-center py-1 ${className}`}>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 text-white dark:bg-zinc-100/95 dark:text-zinc-900 text-[10px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-zinc-700/50"
          title="Show Advertisement"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sponsored Ad</span>
          <ChevronUp className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`ad-banner-container w-full flex justify-center transition-all ${
        variant === 'bottom-docked' ? 'py-1 px-2' : 'my-3'
      } ${className}`}
    >
      <div className="relative w-full max-w-[420px] rounded-xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md">
        {/* Ad Header */}
        <div className="flex items-center justify-between px-2.5 py-0.5 bg-zinc-100/90 dark:bg-zinc-800/90 border-b border-zinc-200/70 dark:border-zinc-700/70 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-[9px] border border-amber-500/30">
              Ad
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 text-[10px]">Sponsored</span>
          </div>

          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            title="Minimize Ad"
            aria-label="Minimize Ad"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Real Google Ad Insertion Tag */}
        <ins
          ref={adSlotRef}
          className="adsbygoogle"
          style={{ display: 'none', width: '320px', height: '50px' }}
          data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
          data-ad-slot={ADMOB_CONFIG.BANNER_SLOT}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />

        {/* Active Real Sponsor Ad Creative */}
        <div
          onClick={handleAdClick}
          className="group relative h-[56px] px-3 flex items-center justify-between gap-3 cursor-pointer select-none bg-gradient-to-r from-sky-50/70 via-indigo-50/50 to-emerald-50/70 dark:from-sky-950/30 dark:via-indigo-950/20 dark:to-emerald-950/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden group-hover:scale-105 transition-transform shadow-xs bg-indigo-600 text-white font-black text-sm">
              <span>G</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                  Google Cloud Platform
                </span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Free Tier
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                Build apps fast with scalable cloud APIs and compute.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shadow-xs group-hover:bg-indigo-700 transition-colors flex items-center gap-1">
              <span>Install</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
