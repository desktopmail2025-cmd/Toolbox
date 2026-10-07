import React from 'react';
import { ArrowLeft, Star, RotateCcw, ChevronRight } from 'lucide-react';
import { ToolItem } from '../../types';
import { CATEGORIES } from '../../data/toolsRegistry';
import { IconRenderer } from './IconRenderer';
import { sounds } from '../../utils/audio';
import { getToolIconTheme } from '../../utils/themeColors';

interface ToolHeaderProps {
  tool: ToolItem;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onReset?: () => void;
  onSelectTool?: (tool: ToolItem) => void;
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
    <div className="mb-6 border-b border-zinc-200/90 pb-4 dark:border-zinc-800/90 relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Figma-style back action button */}
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="mt-0.5 flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border border-zinc-200/90 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 active:scale-95 transition-all shadow-2xs cursor-pointer group"
            title="Go back (returns to where you entered)"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="min-w-0 flex-1">
            {/* Clean Figma unboxed breadcrumbs */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 mb-1 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onBack();
                }}
                className="hover:text-zinc-900 dark:hover:text-zinc-200 font-medium transition-colors cursor-pointer"
              >
                Tools
              </button>
              <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-600" />
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onBack();
                }}
                className="hover:text-zinc-900 dark:hover:text-zinc-200 font-medium transition-colors cursor-pointer"
              >
                {categoryMeta?.name || 'Category'}
              </button>
              <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-600" />
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold truncate max-w-[200px]">
                {tool.name}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2.5 flex-wrap min-w-0">
              <span className={`p-1.5 rounded-lg ${getToolIconTheme(tool.id, tool.iconName).iconBg} border ${getToolIconTheme(tool.id, tool.iconName).border} inline-flex shadow-2xs shrink-0`}>
                <IconRenderer name={tool.iconName} size={18} />
              </span>
              <span className="break-words min-w-0">{tool.name}</span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl line-clamp-2">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Figma Toolbar Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
          {onReset && (
            <button
              onClick={() => {
                sounds.playClick();
                onReset();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 active:scale-95 transition-all shadow-2xs cursor-pointer"
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
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              isFavorite
                ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-400'
                : 'border-zinc-200/90 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 shadow-2xs'
            }`}
            title={isFavorite ? 'Starred' : 'Add to Starred'}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>{isFavorite ? 'Starred' : 'Star Tool'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
