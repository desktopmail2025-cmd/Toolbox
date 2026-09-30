import React from 'react';
import { ArrowLeft, Star, RotateCcw } from 'lucide-react';
import { ToolItem } from '../../types';
import { CATEGORIES } from '../../data/toolsRegistry';
import { IconRenderer } from './IconRenderer';
import { sounds } from '../../utils/audio';

interface ToolHeaderProps {
  tool: ToolItem;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onReset?: () => void;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  tool,
  onBack,
  isFavorite,
  onToggleFavorite,
  onReset,
}) => {
  const categoryMeta = CATEGORIES.find(c => c.id === tool.categoryId);

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
      <div className="flex items-start gap-3">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors shadow-xs"
          title="Back to category"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
            <span>{categoryMeta?.name || 'Tools'}</span>
            <span aria-hidden="true">/</span>
            <span className="text-zinc-700 dark:text-zinc-300">{tool.name}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <span className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 inline-flex">
              <IconRenderer name={tool.iconName} size={18} />
            </span>
            {tool.name}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {onReset && (
          <button
            onClick={() => {
              sounds.playClick();
              onReset();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 active:scale-95 transition-all shadow-2xs cursor-pointer"
            title="Reset tool & start a new calculation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Reset</span>
          </button>
        )}

        <button
          onClick={() => {
            sounds.playClick();
            onToggleFavorite();
          }}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            isFavorite
              ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-400'
              : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
          title={isFavorite ? 'Starred' : 'Add to Starred'}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
          <span>{isFavorite ? 'Starred' : 'Star Tool'}</span>
        </button>
      </div>
    </div>
  );
};
