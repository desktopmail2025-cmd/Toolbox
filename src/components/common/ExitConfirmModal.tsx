import React from 'react';
import { LogOut, X } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleConfirmExit = () => {
    sounds.playTone(200, 0.3);
    try {
      const cap = (window as unknown as { Capacitor?: { Plugins?: { App?: { exitApp: () => void } } } }).Capacitor;
      if (cap?.Plugins?.App?.exitApp) {
        cap.Plugins.App.exitApp();
        return;
      }
    } catch {
      // ignore
    }

    try {
      window.close();
    } catch {
      // ignore
    }

    // Direct exit behavior: navigate away to blank or display final closed screen
    setTimeout(() => {
      try {
        window.location.replace('about:blank');
      } catch {
        // Fallback for strict browser iframe boundaries
        document.body.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#09090b;color:#a1a1aa;font-family:sans-serif;text-align:center;padding:24px;">
            <div style="width:48px;height:48px;border-radius:16px;background:rgba(244,63,94,0.15);display:flex;align-items:center;justify-content:center;color:#f43f5e;font-size:24px;margin-bottom:16px;">⏻</div>
            <h1 style="font-size:20px;font-weight:800;color:#f4f4f5;margin:0 0 8px 0;">OmniToolbox Closed</h1>
            <p style="font-size:13px;color:#71717a;max-width:320px;margin:0;line-height:1.5;">Your session has ended safely. You can now close this tab or window.</p>
          </div>
        `;
      }
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-6 text-center space-y-4">
        {/* Alert Confirmation Dialog */}
        <div className="w-14 h-14 mx-auto rounded-3xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-inner">
          <LogOut className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Exit OmniToolbox?
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
            Are you sure you want to exit the application? Your saved notes, calculations, and settings are safely stored.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs cursor-pointer transition-all shadow-2xs"
          >
            Stay in App
          </button>
          <button
            type="button"
            onClick={handleConfirmExit}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Yes, Exit App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
