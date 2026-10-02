import React, { useState } from 'react';
import { CATEGORIES, TOOLS } from '../../data/toolsRegistry';
import { CategoryId, ToolItem } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { getCategoryTheme, getToolIconTheme } from '../../utils/themeColors';
import { Star, Clock, ChevronDown, ArrowRight, Globe, ShieldCheck, Zap, WifiOff, Wifi, Sparkles, Filter } from 'lucide-react';
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
}

type SectionFilter = 'all' | 'offline' | 'online';

export const CategoryExplorer: React.FC<CategoryExplorerProps> = ({
  onSelectTool,
  favorites,
  onToggleFavorite,
  recents,
  expandedCatIds,
  onToggleCategory,
  onExpandAll,
  onCollapseAll,
}) => {
  const [activeSection, setActiveSection] = useState<SectionFilter>('all');

  const offlineToolsCount = TOOLS.filter(t => !t.isOnline).length;
  const onlineToolsCount = TOOLS.filter(t => t.isOnline).length;

  const recentToolItems = recents
    .map(id => TOOLS.find(t => t.id === id))
    .filter((t): t is ToolItem => t !== undefined)
    .slice(0, 4);

  // Filter tools based on section
  const getCategoryTools = (categoryId: CategoryId) => {
    return TOOLS.filter(t => {
      if (t.categoryId !== categoryId) return false;
      if (activeSection === 'offline') return !t.isOnline;
      if (activeSection === 'online') return !!t.isOnline;
      return true;
    });
  };

  // Only display categories that contain tools for the selected filter
  const visibleCategories = CATEGORIES.filter(cat => getCategoryTools(cat.id).length > 0);

  return (
    <div className="space-y-8 pb-28">
      {/* Figma-Expert Hero Header */}
      <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
              <span>Universal Toolbox</span>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-600 dark:text-indigo-400">{CATEGORIES.length} Categories</span>
              <span aria-hidden="true">·</span>
              <span>{TOOLS.length} Production Utilities</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
              Tool Explorer
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl leading-relaxed">
              Explore our master catalog of high-performance utilities. Filter between 100% on-device offline tools and live internet-connected APIs.
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

        {/* Figma Segmented Control: 2 Sections (Offline vs Online) + All */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-100/70 dark:bg-zinc-900/60 p-1.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveSection('all');
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'all'
                  ? 'bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-zinc-50'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>All Tools</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700/80 text-zinc-500 dark:text-zinc-300">
                {TOOLS.length}
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveSection('offline');
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'offline'
                  ? 'bg-white text-emerald-800 shadow-xs dark:bg-zinc-800 dark:text-emerald-300'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5 text-emerald-500" />
              <span>Offline Tools</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                {offlineToolsCount}
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveSection('online');
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'online'
                  ? 'bg-white text-sky-800 shadow-xs dark:bg-zinc-800 dark:text-sky-300'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              <span>Online Tools</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-sky-100/70 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400">
                {onlineToolsCount}
              </span>
            </button>
          </div>

          <div className="text-[11px] font-medium text-zinc-500 px-3 hidden sm:block">
            {activeSection === 'offline' && '📴 100% on-device · Private · Zero network requests required'}
            {activeSection === 'online' && '🌐 Requires Internet · Live APIs, weather radars & live tickers'}
            {activeSection === 'all' && `⚡ Displaying master directory of all ${TOOLS.length} utilities`}
          </div>
        </div>
      </div>

      {/* Section Explainer Banner */}
      {activeSection === 'offline' && (
        <div className="p-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                Offline Section: 100% On-Device & Private Sandbox
              </h3>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80 mt-0.5">
                These tools run purely using your device's browser engine, hardware sensors, and local memory. Works perfectly on planes, offline, or off-grid.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 shrink-0 self-end sm:self-center">
            {offlineToolsCount} Ready Tools
          </span>
        </div>
      )}

      {activeSection === 'online' && (
        <div className="p-5 rounded-2xl border border-sky-200/80 bg-sky-50/40 dark:border-sky-900/50 dark:bg-sky-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-sky-900 dark:text-sky-200">
                Online Section: Live Public APIs & Cloud Data
              </h3>
              <p className="text-xs text-sky-800/80 dark:text-sky-400/80 mt-0.5">
                These tools query live open web APIs for meteorological forecasts, cryptocurrency exchange rates, Wikipedia summaries, and language translation.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-300 shrink-0 self-end sm:self-center">
            {onlineToolsCount} Live Tools
          </span>
        </div>
      )}

      {/* Recently Opened Shelf */}
      {recentToolItems.length > 0 && activeSection === 'all' && (
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
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate block">
                      {tool.name}
                    </span>
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
                          key={tool.id}
                          onClick={() => {
                            sounds.playClick();
                            onSelectTool(tool);
                          }}
                          style={{ '--cat-accent': catTheme.accent } as React.CSSProperties}
                          className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-4.5 hover:border-[var(--cat-accent)] hover:ring-2 hover:ring-[var(--cat-accent)]/20 hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-800/90 dark:bg-zinc-900 dark:hover:border-[var(--cat-accent)] transition-all duration-200 cursor-pointer active:scale-[0.98] select-none"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconTheme.iconBg} border ${iconTheme.border} group-hover:scale-110 transition-transform shadow-2xs`}>
                                <IconRenderer name={tool.iconName} size={18} />
                              </div>

                              <div className="flex items-center gap-1.5">
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

                            <h3 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 group-hover:text-[var(--cat-accent)] transition-colors">
                              {tool.name}
                            </h3>
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
