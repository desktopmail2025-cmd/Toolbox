import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { sounds } from '../../utils/audio';
import {
  Download, Smartphone, Monitor, CheckCircle2,
  X, Share, PlusSquare, ArrowRight, Sparkles, ShieldCheck
} from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'banner' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed, show small subtle badge in card/banner or hide in navbar
  if (isInstalled) {
    if (variant === 'navbar') return null;
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
        <CheckCircle2 className="w-4 h-4" />
        <span>OmniToolbox Installed</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    sounds.playClick();
    if (isInstallable) {
      setIsInstalling(true);
      const success = await install();
      setIsInstalling(false);
      if (success) {
        sounds.playSuccess();
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Browser doesn't support automatic prompt (e.g. Firefox or desktop Safari)
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          type="button"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-xs font-bold text-indigo-700 dark:text-indigo-300 transition-all cursor-pointer shadow-2xs active:scale-95 whitespace-nowrap ${className}`}
          title="Install OmniToolbox App on this device"
        >
          <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className="p-4 rounded-3xl border border-indigo-200/90 dark:border-indigo-800/90 bg-gradient-to-r from-indigo-50/90 via-purple-50/80 to-pink-50/90 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                Install OmniToolbox as a Native App
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Works 100% offline on Android, iOS, Windows, Mac & Chromebooks
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>{isIOS ? 'Add to Home Screen' : 'Install App'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* iOS Safari / Universal Installation Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in select-none">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  Install on iOS & Android
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Install OmniToolbox to your home screen for full-screen native performance, instant loading, and offline access:
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-xs">
                <div className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-zinc-900 dark:text-zinc-100 font-bold">1. Tap Share</strong>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Tap the Share icon at the bottom of Safari or browser menu.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-xs">
                <div className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-zinc-900 dark:text-zinc-100 font-bold">2. Add to Home Screen</strong>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Scroll down and select "Add to Home Screen".</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-xs">
                <div className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-zinc-900 dark:text-zinc-100 font-bold">3. Launch Anywhere</strong>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Launch from your app drawer without app store accounts.</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
