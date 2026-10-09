import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { admobService, ADMOB_CONFIG } from '../../services/admobService';
import { Capacitor } from '@capacitor/core';
import { GoogleAdChoicesBadge } from './GoogleAdIcons';

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
  const [adStatus, setAdStatus] = useState<'loading' | 'filled' | 'unfilled'>('loading');
  const pushedRef = useRef(false);

  useEffect(() => {
    // On native mobile platform (Android APK), native AdMob plugin controls the banner
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

    // Web AdSense integration via official Google adsbygoogle script
    if (!pushedRef.current && typeof window !== 'undefined') {
      try {
        const win = window as any;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        pushedRef.current = true;
      } catch (err) {
        console.warn('AdSense ad push notice:', err);
      }
    }

    // Inspect genuine Google AdSense response status from the DOM
    const checkFill = setInterval(() => {
      if (adSlotRef.current) {
        const status = adSlotRef.current.getAttribute('data-ad-status');
        if (status === 'filled') {
          setAdStatus('filled');
          clearInterval(checkFill);
        } else if (status === 'unfilled') {
          setAdStatus('unfilled');
          clearInterval(checkFill);
        }
      }
    }, 1200);

    return () => clearInterval(checkFill);
  }, [isNative]);

  // On native mobile platform, the native AdMob SDK displays the banner at the bottom of the device
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
          title="Show Google AdSense Advertisement"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Google AdSense</span>
          <ChevronUp className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`ad-banner-container w-full flex justify-center transition-all ${
        variant === 'bottom-docked' ? 'py-1 px-2' : 'my-2.5'
      } ${className}`}
    >
      <div className="relative w-full max-w-[728px] rounded-xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-[#18181b] shadow-sm hover:shadow-md transition-all">
        {/* AdSense Top Header */}
        <div className="flex items-center justify-between px-2.5 py-1 bg-zinc-100/90 dark:bg-zinc-900/90 border-b border-zinc-200/70 dark:border-zinc-800 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 rounded bg-[#fbbc04] text-zinc-950 font-black text-[9px] shadow-xs">
              Ad
            </span>
            <span className="text-zinc-600 dark:text-zinc-300 font-semibold text-[10px]">
              Google AdSense
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">·</span>
            <span className="font-mono text-[9px] text-zinc-400 dark:text-zinc-500 truncate max-w-[120px]">
              Slot {ADMOB_CONFIG.BANNER_SLOT}
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

        {/* Live Google AdSense Container (Always accessible in DOM so Google AdSense engine can measure width and render) */}
        <div className="w-full flex flex-col justify-center items-center py-2 px-2 min-h-[90px] overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/30">
          <ins
            ref={adSlotRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '60px', textAlign: 'center' }}
            data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
            data-ad-slot={ADMOB_CONFIG.BANNER_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />

          {/* Clean, authentic notice when Google AdSense is pending approval on unverified preview origin */}
          {adStatus === 'unfilled' && (
            <div className="text-center py-2 px-4 text-xs text-zinc-400 dark:text-zinc-500 flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                <Globe className="w-3 h-3 text-zinc-400" />
                <span>Google AdSense Slot {ADMOB_CONFIG.BANNER_SLOT}</span>
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 max-w-sm">
                Live advertisements will serve automatically on approved production domains registered in your AdSense Sites console.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
