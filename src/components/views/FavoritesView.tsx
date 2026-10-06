import React from 'react';
import { TOOLS, CATEGORIES } from '../../data/toolsRegistry';
import { ToolItem } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { getCategoryTheme, getToolIconTheme } from '../../utils/themeColors';
import { Star, ArrowRight, Globe, ShieldCheck, ArrowLeft } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface FavoritesViewProps {
  favorites: string[];
  onSelectTool: (tool: ToolItem) => void;
  onToggleFavorite: (toolId: string) => void;
  onBrowseAll: () => void;
  selectedToolId?: string | null;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onSelectTool,
  onToggleFavorite,
  onBrowseAll,
  selectedToolId,
}) => {
  const favoriteTools = TOOLS.filter(t => favorites.includes(t.id));

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800 flex items-start gap-3">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onBrowseAll();
          }}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors shadow-xs cursor-pointer"
          title="Back to Home"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            Starred Quick Access ({favoriteTools.length})
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Your favorite and most-used utilities pinned for instant one-tap access across devices.
          </p>
        </div>
      </div>

      {favoriteTools.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <Star className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No Starred Tools Yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Click the star icon on any tool card to add it to your personal favorites dashboard.
          </p>
          <button
            onClick={onBrowseAll}
            className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-xs rounded-xl hover:opacity-90"
          >
            Explore All 100+ Tools
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {favoriteTools.map(tool => {
            const isSelected = Boolean(selectedToolId && selectedToolId === tool.id);
            const cat = CATEGORIES.find(c => c.id === tool.categoryId);
            const catTheme = getCategoryTheme(tool.categoryId);
            const iconTheme = getToolIconTheme(tool.id, tool.iconName);
            return (
              <div
                id={`favorite-tool-${tool.id}`}
                key={tool.id}
                tabIndex={0}
                onClick={() => {
                  sounds.playClick();
                  onSelectTool(tool);
                }}
                style={{ '--cat-accent': catTheme.accent } as React.CSSProperties}
                className={`group relative flex flex-col justify-between rounded-2xl p-4.5 border transition-all duration-200 cursor-pointer select-none active:scale-[0.98] tool-card-hover ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500 shadow-xl bg-indigo-50/40 dark:bg-indigo-950/40 dark:border-indigo-400'
                    : 'border-zinc-200/90 bg-white dark:border-zinc-800/90 dark:bg-zinc-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconTheme.iconBg} border ${iconTheme.border} shadow-2xs group-hover:scale-105 transition-transform`}>
                      <IconRenderer name={tool.iconName} size={20} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white shadow-xs animate-pulse">
                          Selected
                        </span>
                      )}
                      {tool.isOnline ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
                          <Globe className="w-2.5 h-2.5" />
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          Offline
                        </span>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          sounds.playClick();
                          onToggleFavorite(tool.id);
                        }}
                        className="p-1.5 text-amber-500 hover:text-amber-600 hover:scale-110 transition-all cursor-pointer"
                        title="Remove from Starred"
                      >
                        <Star className="w-4 h-4 fill-amber-400" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
                  <span className="font-medium">{cat?.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
