import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { admobService, ADMOB_CONFIG } from '../../services/admobService';
import { Capacitor } from '@capacitor/core';

interface AdMobBannerProps {
  onOpenPerformance?: () => void;
  variant?: 'bottom-docked' | 'inline';
  className?: string;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({
  variant = 'bottom-docked',
  className = '',
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const isNative = Capacitor.isNativePlatform();
  const adSlotRef = useRef<HTMLModElement | null>(null);
  const [adPushed, setAdPushed] = useState(false);

  useEffect(() => {
    // Record impression
    try {
      admobService?.recordImpression?.('banner');
    } catch {}

    // On native platform, Capacitor AdMob plugin manages native banner
    if (isNative) {
      try {
        admobService?.showNativeBanner?.();
      } catch {}
      return;
    }

    // On web, request real Google AdSense / Google Publisher ad
    if (!adPushed && typeof window !== 'undefined') {
      try {
        const win = window as any;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        setAdPushed(true);
      } catch {
        // Adsbygoogle handled
      }
    }
  }, [isNative, adPushed]);

  if (isMinimized) {
    return (
      <div className={`transition-all duration-300 z-30 ${variant === 'bottom-docked' ? 'fixed bottom-[calc(4.2rem+env(safe-area-inset-bottom,0px))] md:bottom-2 left-1/2 -translate-x-1/2' : 'my-2'} ${className}`}>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/95 text-white dark:bg-zinc-100/95 dark:text-zinc-900 text-[10px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs border border-zinc-700/50"
          title="Show Google AdMob Banner"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Google Ad · 320x50</span>
          <ChevronUp className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-300 ${
        variant === 'bottom-docked'
          ? 'w-full flex justify-center py-1 px-2 bg-gradient-to-t from-zinc-100 via-zinc-50/95 to-transparent dark:from-zinc-950 dark:via-zinc-900/95 dark:to-transparent'
          : 'w-full flex justify-center my-3'
      } ${className}`}
    >
      <div className="relative w-full max-w-[420px] rounded-xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md">
        {/* AdMob Official Header Bar */}
        <div className="flex items-center justify-between px-2.5 py-1 bg-zinc-100/90 dark:bg-zinc-800/90 border-b border-zinc-200/70 dark:border-zinc-700/70 text-[10px]">
          <div className="flex items-center gap-1.5 font-medium text-zinc-600 dark:text-zinc-300">
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-[9px] border border-emerald-500/30">
              Ad
            </span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Google AdMob</span>
            <span className="text-zinc-400 font-mono hidden xs:inline text-[9px]">
              ID: {ADMOB_CONFIG.BANNER_ID}
            </span>
          </div>

          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
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
        </div>

        {/* Real Google Ad Container */}
        <div
          onClick={() => {
            try {
              admobService?.recordClick?.('banner');
            } catch {}
          }}
          className="relative min-h-[52px] sm:min-h-[56px] flex items-center justify-center p-1 bg-zinc-50 dark:bg-zinc-950/80 overflow-hidden"
        >
          {/* Official Google Ads Responsive Element */}
          <ins
            ref={adSlotRef}
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '320px', height: '50px' }}
            data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
            data-ad-slot={ADMOB_CONFIG.BANNER_SLOT}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />

          {/* Real Google Ad Network Verification Overlay (visible when waiting for ad fill or active) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-3 text-[11px] text-zinc-500 dark:text-zinc-400 opacity-60">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-medium text-[10px]">Google Mobile Ads Network</span>
            </div>
            <span className="text-[9px] font-mono font-semibold text-zinc-400">Slot: {ADMOB_CONFIG.BANNER_SLOT}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
