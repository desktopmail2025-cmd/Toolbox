import React, { useState } from 'react';
import { Smartphone, Download, Share, X, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { sounds } from '../../utils/audio';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If already installed as PWA or dismissed, hide
  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    sounds.playClick();
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // Only show when the browser supports installation or on iOS Safari
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Install App on Device"
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
        title="Install OmniToolbox to Home Screen / Android"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden min-[480px]:inline">Install App</span>
        <span className="min-[480px]:hidden">Install</span>
      </button>

      {/* iOS Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in select-none">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-500" />
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                  Install on iPhone / iPad
                </h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Install OmniToolbox directly to your iOS Home Screen for instant offline access and native app fullscreen view:
            </p>

            <ol className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
                <span className="font-bold text-indigo-500 shrink-0">1.</span>
                <span>Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-0.5" /> in Safari's bottom toolbar.</span>
              </li>
              <li className="flex items-start gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
                <span className="font-bold text-indigo-500 shrink-0">2.</span>
                <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
                <span className="font-bold text-indigo-500 shrink-0">3.</span>
                <span>Tap <strong>Add</strong> in the top-right corner to launch as a standalone app!</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs cursor-pointer hover:bg-zinc-800 dark:hover:bg-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
