import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex items-center justify-between gap-3 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border border-zinc-700/80 px-4 py-2.5 text-xs shadow-xl animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2.5">
        <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400 dark:text-amber-600">
          <WifiOff className="w-4 h-4 animate-pulse" />
        </span>
        <div>
          <span className="font-bold block">Offline Mode Active</span>
          <span className="text-[11px] opacity-75">100+ calculators and utilities working without network</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-1 rounded bg-white/10 dark:bg-zinc-900/10">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>Cached</span>
      </div>
    </div>
  );
};
