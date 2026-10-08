import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { admobService, ADMOB_CONFIG } from '../../services/admobService';

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

  useEffect(() => {
    // Record banner impression when rendered
    admobService.recordImpression('banner');
  }, []);

  const handleAdClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    admobService.recordClick('banner');
  };

  if (isMinimized) {
    return (
      <div className={`transition-all duration-300 z-30 ${variant === 'bottom-docked' ? 'fixed bottom-[calc(4.2rem+env(safe-area-inset-bottom,0px))] md:bottom-2 left-1/2 -translate-x-1/2' : 'my-2'} ${className}`}>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 text-white dark:bg-zinc-100/95 dark:text-zinc-900 text-[10px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs border border-zinc-700/50"
          title="Show Google AdMob Banner"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Ad · Google AdMob</span>
          <ChevronUp className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-300 ${
        variant === 'bottom-docked'
          ? 'w-full flex justify-center py-1.5 px-2 bg-gradient-to-t from-zinc-100 via-zinc-50/95 to-transparent dark:from-zinc-950 dark:via-zinc-900/95 dark:to-transparent'
          : 'w-full flex justify-center my-3'
      } ${className}`}
    >
      <div className="relative w-full max-w-[420px] rounded-xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md">
        {/* AdMob Top Bar */}
        <div className="flex items-center justify-between px-2.5 py-1 bg-zinc-100/90 dark:bg-zinc-800/90 border-b border-zinc-200/70 dark:border-zinc-700/70 text-[10px]">
          <div className="flex items-center gap-1.5 font-medium text-zinc-600 dark:text-zinc-300">
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-[9px] border border-emerald-500/30">
              Ad
            </span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Google AdMob</span>
            <span className="text-zinc-400 hidden xs:inline">· 320x50 Banner</span>
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

        {/* Ad Body (Standard 320x50 / responsive Google Ad creative with App Logo) */}
        <div
          onClick={handleAdClick}
          className="group relative h-[52px] sm:h-[56px] px-3 flex items-center justify-between gap-3 cursor-pointer select-none bg-gradient-to-r from-sky-50/70 via-indigo-50/50 to-emerald-50/70 dark:from-sky-950/30 dark:via-indigo-950/20 dark:to-emerald-950/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          {/* Ad Creative Content with Real App Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden group-hover:scale-105 transition-transform shadow-xs bg-zinc-950 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800">
              <img src="/icon.svg" alt="OmniToolbox" className="w-7 h-7 object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                  OmniToolbox Pro Suite
                </span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                Supercharge your workflow with 100+ utilities & offline games.
              </p>
            </div>
          </div>

          {/* Action Pill */}
          <div className="shrink-0 flex items-center gap-1">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shadow-2xs group-hover:bg-indigo-700 transition-colors flex items-center gap-1">
              <span>Install</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
