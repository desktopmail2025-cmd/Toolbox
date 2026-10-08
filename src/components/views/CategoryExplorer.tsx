import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES, TOOLS } from '../../data/toolsRegistry';
import { CategoryId, ToolItem } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { getCategoryTheme, getToolIconTheme } from '../../utils/themeColors';
import { Star, Clock, ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Globe, ShieldCheck, Zap, WifiOff } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { AdMobBanner } from '../ads/AdMobBanner';

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
  tierFilter?: 'all' | 'basic' | 'pro';
  onSelectTierFilter?: (tier: 'all' | 'basic' | 'pro') => void;
  selectedToolId?: string | null;
  onOpenAdMobPerformance?: () => void;
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
  tierFilter: propTierFilter,
  onSelectTierFilter,
  selectedToolId,
  onOpenAdMobPerformance,
}) => {
  // The tool card is styled with active selection badge and ring without disruptive page jumping
  const recentToolItems = recents
    .map(id => TOOLS.find(t => t.id === id))
    .filter((t): t is ToolItem => t !== undefined)
    .slice(0, 4);

  const recentScrollRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const handleScrollShelf = (direction: 'next' | 'prev' = 'next') => {
    sounds.playClick();
    if (!recentScrollRef.current) return;
    const container = recentScrollRef.current;
    const cardStep = 180;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (direction === 'next') {
      if (container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: cardStep, behavior: 'smooth' });
      }
    } else {
      if (container.scrollLeft <= 15) {
        container.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -cardStep, behavior: 'smooth' });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!recentScrollRef.current) return;
    isDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - recentScrollRef.current.offsetLeft;
    scrollLeftRef.current = recentScrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDownRef.current = false;
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current || !recentScrollRef.current) return;
    const x = e.pageX - recentScrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 6) {
      hasDraggedRef.current = true;
    }
    recentScrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  // Filter tools based on section
  const getCategoryTools = (categoryId: CategoryId) => {
    return TOOLS.filter(t => {
      if (t.categoryId !== categoryId) return false;
      if (toolFilter === 'offline') return !t.isOnline;
      if (toolFilter === 'online') return !!t.isOnline;
      return true;
    });
  };

  // Tier filter: 'all' | 'basic' | 'pro' (synced with App state so returning from a tool preserves suite)
  const [localTierFilter, setLocalTierFilter] = useState<'all' | 'basic' | 'pro'>('all');
  const tierFilter = propTierFilter !== undefined ? propTierFilter : localTierFilter;
  const setTierFilter = (newTier: 'all' | 'basic' | 'pro') => {
    if (onSelectTierFilter) {
      onSelectTierFilter(newTier);
    } else {
      setLocalTierFilter(newTier);
    }
  };

  // Only display categories that contain tools for the selected filter & tier
  const visibleCategories = CATEGORIES.filter(cat => {
    if (tierFilter !== 'all' && cat.tier !== tierFilter) return false;
    return getCategoryTools(cat.id).length > 0;
  });

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
              Explore our master catalog of high-performance utilities arranged into Basic & Pro suites.
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

      {/* Google AdMob Test Banner (Featured Placement: visible immediately on screen) */}
      <div className="pt-1 pb-1">
        <AdMobBanner onOpenPerformance={onOpenAdMobPerformance} variant="inline" />
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

      {/* Recently Opened Shelf: Unified Horizontal Recycler View Shelf for ALL devices and screen sizes */}
      {recentToolItems.length > 0 && toolFilter === 'all' && (
        <section className="relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Recently Opened</span>
              <span className="text-[10px] font-normal normal-case px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                {recentToolItems.length}
              </span>
            </div>

            {/* Interactive, working "Swipe to explore" button & smooth scroll controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScrollShelf('prev')}
                className="w-6 h-6 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 transition-all cursor-pointer shadow-2xs"
                title="Scroll previous"
                aria-label="Scroll previous recent tools"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleScrollShelf('next')}
                className="group/btn inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 active:scale-95 transition-all cursor-pointer select-none bg-indigo-50/90 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs"
                title="Click or swipe to explore recent tools"
                aria-label="Swipe to explore recent tools"
              >
                <span>Swipe to explore</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Smooth Horizontal Recycler View: Uniform across all devices, phones, tablets, and desktops */}
          <div className="relative -mx-1 px-1">
            <div
              ref={recentScrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2 pt-0.5 overscroll-x-contain cursor-grab active:cursor-grabbing"
            >
              {recentToolItems.map(tool => (
                <div
                  key={tool.id}
                  onClick={() => {
                    if (hasDraggedRef.current) {
                      hasDraggedRef.current = false;
                      return;
                    }
                    sounds.playClick();
                    onSelectTool(tool);
                  }}
                  className="group w-[155px] sm:w-[175px] shrink-0 snap-start flex flex-col justify-between p-3 rounded-2xl border border-zinc-200/90 bg-white hover:border-indigo-400 hover:shadow-sm dark:border-zinc-800/90 dark:bg-zinc-900 dark:hover:border-indigo-500/60 cursor-pointer active:scale-[0.96] transition-all duration-150 select-none shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${getToolIconTheme(tool.id, tool.iconName).iconBg} border ${getToolIconTheme(tool.id, tool.iconName).border} shadow-2xs`}>
                      <IconRenderer name={tool.iconName} size={16} />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate block">
                      {tool.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate font-medium mt-0.5">
                      {CATEGORIES.find(c => c.id === tool.categoryId)?.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Basic vs Pro Tier Segmented Selector */}
      <section className="pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Figma-style Segmented Filter Bar */}
          <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setTierFilter('all');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                tierFilter === 'all'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              All ({CATEGORIES.length})
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setTierFilter('basic');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                tierFilter === 'basic'
                  ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              <span>Basic Suite</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                tierFilter === 'basic' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'
              }`}>
                {CATEGORIES.filter(c => c.tier === 'basic').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setTierFilter('pro');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                tierFilter === 'pro'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              <span>Pro Suite</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                tierFilter === 'pro' ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'
              }`}>
                {CATEGORIES.filter(c => c.tier === 'pro').length}
              </span>
            </button>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {tierFilter === 'all'
              ? 'Showing all 24 categories (12 Basic & 12 Pro)'
              : tierFilter === 'basic'
              ? '⚡ Basic Suite: Everyday essential calculators, converters & text'
              : '💎 Pro Suite: Advanced finance, dev playground, sports & security'}
          </div>
        </div>
      </section>

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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm sm:text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 truncate">
                        {category.name}
                      </h2>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border shrink-0 ${
                        category.tier === 'pro'
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      }`}>
                        {category.tier === 'pro' ? '💎 Pro' : '⚡ Basic'}
                      </span>
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
                      const isSelected = selectedToolId === tool.id;
                      const catTheme = getCategoryTheme(category.id);
                      const iconTheme = getToolIconTheme(tool.id, tool.iconName);

                      return (
                        <div
                          id={`tool-card-${tool.id}`}
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
                              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconTheme.iconBg} border ${iconTheme.border} group-hover:scale-110 transition-transform shadow-2xs`}>
                                <IconRenderer name={tool.iconName} size={18} />
                              </div>

                              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                {isSelected && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                                    Active
                                  </span>
                                )}

                                {/* Quiet unboxed status metadata (Figma style) */}
                                {tool.isOnline ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-sky-600 dark:text-sky-400 font-medium">
                                    <Globe className="w-2.5 h-2.5" />
                                    Online
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
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
                                  className="p-1 rounded-md text-zinc-300 hover:text-amber-500 dark:text-zinc-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                                  title={isFav ? 'Starred' : 'Add to Starred'}
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${
                                      isFav ? 'fill-amber-400 text-amber-500' : ''
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 mb-0.5">
                              <h3 className="font-semibold text-xs sm:text-sm text-zinc-950 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {tool.name}
                              </h3>
                            </div>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                              {tool.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] font-medium text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            <span className="font-mono text-[9px] uppercase tracking-wider">Open Utility</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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

      {/* Google AdMob Test Banner (320x50 / Adaptive) docked cleanly at the bottom */}
      <div className="pt-4">
        <AdMobBanner onOpenPerformance={onOpenAdMobPerformance} variant="inline" />
      </div>
    </div>
  );
};
