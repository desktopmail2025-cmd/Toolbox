import React, { useState, useEffect, useRef } from 'react';
import { admobService, ADMOB_CONFIG } from '../../services/admobService';
import { Capacitor } from '@capacitor/core';
import { ShieldCheck, AlertCircle, Sparkles, Smartphone, Globe } from 'lucide-react';

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
  const pushedRef = useRef(false);
  const [adStatus, setAdStatus] = useState<'loading' | 'filled' | 'unfilled' | 'blocked'>('loading');

  const isDevDomain = typeof window !== 'undefined' && (
    window.location.hostname.includes('run.app') ||
    window.location.hostname.includes('localhost') ||
    window.location.hostname.includes('127.0.0.1')
  );

  useEffect(() => {
    // On native Android APK, Google AdMob native SDK controls and displays the banner
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

    // Check if Google AdSense script was blocked by browser ad blocker
    const scriptCheckTimer = setTimeout(() => {
      const win = window as any;
      if (!win.adsbygoogle) {
        setAdStatus('blocked');
      }
    }, 1500);

    // On Web, Google AdSense SDK loads the live banner into the ins tag
    if (!pushedRef.current && typeof window !== 'undefined') {
      try {
        const win = window as any;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        pushedRef.current = true;
      } catch (err) {
        console.warn('AdSense notice:', err);
      }
    }

    // Monitor genuine Google AdSense response status from the DOM
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
    }, 1500);

    return () => {
      clearTimeout(scriptCheckTimer);
      clearInterval(checkFill);
    };
  }, [isNative]);

  // On native mobile devices, the native AdMob SDK renders the banner in native space
  if (isNative) {
    return null;
  }

  // On Web, render real official Google AdSense slot
  return (
    <div
      className={`w-full flex flex-col justify-center items-center my-3 transition-all ${
        variant === 'bottom-docked' ? 'py-1 px-2' : 'py-2 px-3'
      } ${className}`}
    >
      <div className="w-full max-w-[728px] overflow-hidden flex flex-col justify-center items-center">
        <ins
          ref={adSlotRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '60px', textAlign: 'center' }}
          data-ad-client={ADMOB_CONFIG.PUBLISHER_ID}
          data-ad-slot={ADMOB_CONFIG.BANNER_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
          data-adtest={isDevDomain ? 'on' : undefined}
        />

        {/* Informative ad status notice when running on preview URLs or if blocked by client */}
        {(adStatus === 'unfilled' || adStatus === 'blocked') && (
          <div className="w-full mt-2 p-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-zinc-200/60 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-200 text-xs">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <span>Google AdSense Slot {ADMOB_CONFIG.BANNER_SLOT}</span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                {adStatus === 'blocked' ? 'AdBlocker Detected' : 'Pending Domain Approval'}
              </span>
            </div>

            <p className="leading-relaxed">
              {adStatus === 'blocked' ? (
                <span>
                  Your browser or extension (such as Brave Shields or uBlock) is blocking the Google AdSense script (<code>pagead2.googlesyndication.com</code>). Disable your ad blocker for this tab to view test ads.
                </span>
              ) : (
                <span>
                  Google AdSense requires your production domain (e.g. <code>yourdomain.com</code>) to be added and verified under <strong>AdSense &rarr; Sites</strong>. Cloud Run preview domains (<code>*.run.app</code>) do not serve live advertiser inventory without domain authorization.
                </span>
              )}
            </p>

            <div className="mt-2 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-emerald-500" />
                <span><strong>Android APK:</strong> AdMob App ID {ADMOB_CONFIG.APP_ID} is active</span>
              </span>
              <span><strong>Client:</strong> {ADMOB_CONFIG.PUBLISHER_ID}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


