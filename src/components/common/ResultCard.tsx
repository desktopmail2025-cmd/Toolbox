import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface ResultCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  copyable?: boolean;
  highlight?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  label,
  value,
  subtext,
  copyable = true,
  highlight = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    sounds.playClick();
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={`relative rounded-xl border p-4 transition-all ${
        highlight
          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 shadow-md'
          : 'border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100'
      }`}
    >
      <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
        <span className={highlight ? 'text-zinc-300 dark:text-zinc-600' : ''}>{label}</span>
        {copyable && (
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white shadow-xs scale-105'
                : highlight
                ? 'text-zinc-300 hover:text-white dark:text-zinc-600 dark:hover:text-zinc-950 hover:bg-white/10 dark:hover:bg-zinc-950/10'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="Copy value"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight tabular-nums truncate">
        {value}
      </div>

      {subtext && (
        <div className={`mt-1 text-xs truncate ${highlight ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
          {subtext}
        </div>
      )}
    </div>
  );
};
