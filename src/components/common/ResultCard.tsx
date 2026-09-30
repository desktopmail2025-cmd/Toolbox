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
            className={`p-1 rounded transition-colors ${
              highlight
                ? 'text-zinc-300 hover:text-white dark:text-zinc-600 dark:hover:text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}
            title="Copy value"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
