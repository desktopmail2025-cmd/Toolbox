import React, { useState, useEffect } from 'react';
import { CATEGORIES, TOOLS } from '../../data/toolsRegistry';
import { CategoryId, ToolItem } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { getCategoryTheme, getToolIconTheme } from '../../utils/themeColors';
import { Star, Clock, ChevronDown, ArrowRight, Globe, ShieldCheck, Zap, WifiOff } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface CategoryExplorerProps {
  onSelectTool: (tool: ToolItem) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
  recents: string[];
  expandedCatIds: Set<CategoryId>;
  onToggleCategory: (catId: CategoryId) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  toolFilter?: 'all' | 'offline' | 'online';
  onSelectToolFilter?: (filter: 'all' | 'offline' | 'online') => void;
}

export const CategoryExplorer: React.FC<CategoryExplorerProps> = ({
  onSelectTool,
  favorites,
  onToggleFavorite,
  recents,
  expandedCatIds,
  onToggleCategory,
  onExpandAll,
  onCollapseAll,
  toolFilter = 'all',
  onSelectToolFilter,
}) => {
  const recentToolItems = recents
    .map(id => TOOLS.find(t => t.id === id))
    .filter((t): t is ToolItem => t !== undefined)
    .slice(0, 4);

  // Filter tools based on section
  const getCategoryTools = (categoryId: CategoryId) => {
    return TOOLS.filter(t => {
      if (t.categoryId !== categoryId) return false;
      if (toolFilter === 'offline') return !t.isOnline;
      if (toolFilter === 'online') return !!t.isOnline;
      return true;
    });
  };

  // Only display categories that contain tools for the selected filter
  const visibleCategories = CATEGORIES.filter(cat => getCategoryTools(cat.id).length > 0);

  return (
    <div className="space-y-6 pb-28">
      {/* Hero Header */}
      <div className="border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
        {/* Mobile View: Clean header with only Expand All & Collapse All */}
        <div className="flex md:hidden items-center justify-end gap-2">
          <button
            onClick={onExpandAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer shadow-2xs"
          >
            Expand All
          </button>
          <button
            onClick={onCollapseAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer shadow-2xs"
          >
            Collapse All
          </button>
        </div>

        {/* Desktop View: Description and action buttons */}
        <div className="hidden md:flex flex-row items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
              Tool Explorer
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl leading-relaxed">
              Explore our master catalog of high-performance utilities.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onExpandAll}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer shadow-2xs"
            >
              Expand All
            </button>
            <button
              onClick={onCollapseAll}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer shadow-2xs"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Filter notification if a filter was selected from the drawer */}
      {toolFilter !== 'all' && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Filtered: {toolFilter === 'offline' ? 'Offline Tools' : 'Online Tools'}
          </span>
          {onSelectToolFilter && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onSelectToolFilter('all');
              }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Show All Categories
            </button>
          )}
        </div>
      )}

      {/* Recently Opened Shelf */}
      {recentToolItems.length > 0 && toolFilter === 'all' && (
        <section>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Recently Opened</span>
          </div>
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {recentToolItems.map(tool => (
              <div
                key={tool.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectTool(tool);
                }}
                className="group flex items-center justify-between p-3 rounded-2xl border border-zinc-200/90 bg-white hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800/90 dark:bg-zinc-900 dark:hover:border-zinc-600 cursor-pointer active:scale-[0.98] transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${getToolIconTheme(tool.id, tool.iconName).iconBg} border ${getToolIconTheme(tool.id, tool.iconName).border} shadow-2xs`}>
                    <IconRenderer name={tool.iconName} size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate block">
                        {tool.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block truncate">
                      {CATEGORIES.find(c => c.id === tool.categoryId)?.name}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Expandable Categories Accordion List */}
      <div className="space-y-3.5">
        {visibleCategories.map(category => {
          const tools = getCategoryTools(category.id);
          const isExpanded = expandedCatIds.has(category.id);

          return (
            <div
              key={category.id}
              className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/90 overflow-hidden shadow-xs transition-all duration-200"
            >
              {/* Category Header Button */}
              <button
                type="button"
                onClick={() => onToggleCategory(category.id)}
                className={`w-full flex items-center justify-between p-3.5 sm:p-5 text-left transition-colors cursor-pointer select-none active:bg-zinc-50 dark:active:bg-zinc-800/50 ${
                  isExpanded
                    ? 'bg-zinc-50/70 dark:bg-zinc-800/40 border-b border-zinc-100 dark:border-zinc-800'
                    : 'hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <div
                    className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200 border ${getCategoryTheme(category.id).border} ${
                      isExpanded
                        ? `${getCategoryTheme(category.id).iconBg} ring-2 ring-indigo-500/20 shadow-md scale-105`
                        : `${getCategoryTheme(category.id).iconBg} shadow-2xs`
                    }`}
                  >
                    <IconRenderer name={category.iconName} size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 truncate">
                        {category.name}
                      </h2>
                      <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 shrink-0">
                        · {tools.length} tool{tools.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-2 sm:ml-3">
                  <span className="text-xs text-zinc-400 hidden sm:inline font-medium">
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </span>
                  <div
                    className={`p-1 rounded-lg text-zinc-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-zinc-900 dark:text-zinc-100' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </button>

              {/* Collapsible Content Area */}
              {isExpanded && (
                <div className="p-3.5 sm:p-5 bg-zinc-50/40 dark:bg-zinc-950/30 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
                    {tools.map(tool => {
                      const isFav = favorites.includes(tool.id);
                      const catTheme = getCategoryTheme(category.id);
                      const iconTheme = getToolIconTheme(tool.id, tool.iconName);

                      return (
                        <div
                          id={`tool-card-${tool.id}`}
                          key={tool.id}
                          onClick={() => {
                            sounds.playClick();
                            onSelectTool(tool);
                          }}
                          style={{ '--cat-accent': catTheme.accent } as React.CSSProperties}
                          className="group relative flex flex-col justify-between rounded-2xl p-4.5 border border-zinc-200/90 bg-white hover:border-[var(--cat-accent)] hover:ring-2 hover:ring-[var(--cat-accent)]/20 hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-800/90 dark:bg-zinc-900 dark:hover:border-[var(--cat-accent)] transition-all duration-200 cursor-pointer select-none active:scale-[0.98]"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconTheme.iconBg} border ${iconTheme.border} group-hover:scale-110 transition-transform shadow-2xs`}>
                                <IconRenderer name={tool.iconName} size={18} />
                              </div>

                              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                {/* Online/Offline Badges */}
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
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    sounds.playClick();
                                    onToggleFavorite(tool.id);
                                  }}
                                  className="p-1 rounded-lg text-zinc-300 hover:text-amber-500 dark:text-zinc-600 dark:hover:text-amber-400 transition-colors"
                                  title={isFav ? 'Starred' : 'Add to Starred'}
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      isFav ? 'fill-amber-400 text-amber-500' : ''
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 mb-0.5">
                              <h3 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 group-hover:text-[var(--cat-accent)] transition-colors">
                                {tool.name}
                              </h3>
                            </div>
                            <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                              {tool.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] font-semibold text-zinc-400 group-hover:text-[var(--cat-accent)] transition-colors">
                            <span className="font-mono">Launch Tool</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
