import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  const [adLoaded, setAdLoaded] = useState(false);
  const pushedRef = useRef(false);

  useEffect(() => {
    // Record banner impression
    try {
      admobService?.recordImpression?.('banner');
    } catch {}

    // On native mobile platform, Capacitor AdMob plugin manages native banner directly
    if (isNative) {
      try {
        admobService?.showNativeBanner?.();
      } catch {}
      return;
    }

    // On Web, request real Google AdMob / AdSense slot with configured slot ID
    if (!pushedRef.current && typeof window !== 'undefined') {
      try {
        const win = window as any;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        pushedRef.current = true;
        setAdLoaded(true);
      } catch (err) {
        console.warn('Google AdSense slot notice:', err);
      }
    }
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
      <div className="relative w-full max-w-[468px] rounded-xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md">
        {/* Ad Header */}
        <div className="flex items-center justify-between px-2.5 py-1 bg-zinc-100/90 dark:bg-zinc-800/90 border-b border-zinc-200/70 dark:border-zinc-700/70 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-[9px] border border-amber-500/30">
              Ad
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 text-[10px]">Google AdMob</span>
          </div>

          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            title="Minimize Ad"
            aria-label="Minimize Ad"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Real Google Ad Insertion Tag (Filled directly by Google AdMob/AdSense) */}
        <div className="w-full min-h-[60px] flex items-center justify-center p-1 overflow-hidden bg-zinc-50 dark:bg-zinc-950/40">
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
      </div>
    </div>
  );
};
