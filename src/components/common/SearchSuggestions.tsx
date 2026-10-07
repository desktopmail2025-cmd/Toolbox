import React, { useMemo, useEffect, useRef } from 'react';
import { TOOLS, CATEGORIES } from '../../data/toolsRegistry';
import { ToolItem } from '../../types';
import { IconRenderer } from './IconRenderer';
import { getToolIconTheme } from '../../utils/themeColors';
import { sounds } from '../../utils/audio';
import { ArrowRight, Clock, Sparkles, WifiOff, Globe, Star } from 'lucide-react';

interface SearchSuggestionsProps {
  query: string;
  isOpen: boolean;
  onSelectTool: (tool: ToolItem) => void;
  onClose: () => void;
  favorites?: string[];
  recents?: string[];
  selectedIndex?: number;
  onHoverIndex?: (index: number) => void;
  className?: string;
  align?: 'left' | 'center' | 'stretch';
}

// Highlight matched substring with Figma-style subtle highlighter
export const HighlightText: React.FC<{ text?: string; query?: string }> = ({ text = '', query = '' }) => {
  const safeText = String(text || '');
  const safeQuery = String(query || '').trim().toLowerCase();
  if (!safeQuery || !safeText) return <span>{safeText}</span>;

  const lower = safeText.toLowerCase();
  const index = lower.indexOf(safeQuery);

  if (index === -1) return <span>{safeText}</span>;

  const before = safeText.substring(0, index);
  const match = safeText.substring(index, index + safeQuery.length);
  const after = safeText.substring(index + safeQuery.length);

  return (
    <span>
      {before}
      <span className="bg-indigo-500/15 text-indigo-700 dark:bg-indigo-400/25 dark:text-indigo-300 font-semibold px-0.5 rounded-[3px]">
        {match}
      </span>
      {after}
    </span>
  );
};

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query = '',
  isOpen,
  onSelectTool,
  onClose,
  favorites = [],
  recents = [],
  selectedIndex = 0,
  onHoverIndex,
  className = '',
  align = 'stretch',
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const safeQuery = String(query || '');
  const safeFavorites = Array.isArray(favorites) ? favorites : [];
  const safeRecents = Array.isArray(recents) ? recents : [];

  // Compute matching tools with intelligent scoring
  const matches = useMemo(() => {
    const q = safeQuery.trim().toLowerCase();
    if (!q) return [];

    const scored = TOOLS.map(tool => {
      let score = 0;
      const nameLower = (tool.name || '').toLowerCase();
      const descLower = (tool.description || '').toLowerCase();
      const cat = CATEGORIES.find(c => c.id === tool.categoryId);
      const catLower = cat ? (cat.name || '').toLowerCase() : '';

      // 1. Exact name match
      if (nameLower === q) score += 1000;
      // 2. Starts with query
      else if (nameLower.startsWith(q)) score += 600;
      // 3. Word in name starts with query
      else if (nameLower.split(/\s+/).some(w => w.startsWith(q))) score += 400;
      // 4. Name contains query
      else if (nameLower.includes(q)) score += 250;

      // 5. Keywords match
      for (const kw of (tool.keywords || [])) {
        const kwLower = (kw || '').toLowerCase();
        if (kwLower === q) score += 300;
        else if (kwLower.startsWith(q)) score += 180;
        else if (kwLower.includes(q)) score += 90;
      }

      // 6. Category match
      if (catLower.includes(q)) score += 70;

      // 7. Description match
      if (descLower.includes(q)) score += 40;

      return { tool, score, category: cat };
    })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return scored;
  }, [safeQuery]);

  // Default suggested tools when input is empty but search is open
  const fallbackSuggestions = useMemo<{ recents: ToolItem[]; popular: ToolItem[] }>(() => {
    if (safeQuery.trim()) return { recents: [], popular: [] };

    // Prioritize recents, then top curated tools
    const recentTools = safeRecents
      .map(id => TOOLS.find(t => t.id === id))
      .filter((t): t is ToolItem => t !== undefined)
      .slice(0, 4);

    const popularIds = [
      'calc-scientific',
      'currency-converter',
      'study-formulas',
      'prime-checker',
      'qr-code-pro',
      'discount-calc',
      'unit-converter',
      'bmi-calculator',
    ];

    const popularTools = popularIds
      .filter(id => !safeRecents.includes(id))
      .map(id => TOOLS.find(t => t.id === id))
      .filter((t): t is ToolItem => t !== undefined)
      .slice(0, 6);

    return {
      recents: recentTools,
      popular: popularTools,
    };
  }, [safeQuery, safeRecents]);

  // Scroll active item into view when navigating with keyboard
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      ref={listRef}
      className={`absolute top-full mt-1.5 left-0 right-0 z-50 overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white/98 dark:bg-[#18181b]/98 backdrop-blur-xl shadow-[0_18px_45px_-8px_rgba(0,0,0,0.16)] dark:shadow-[0_22px_50px_-8px_rgba(0,0,0,0.7)] animate-in fade-in-50 zoom-in-95 duration-100 ${className}`}
      style={{
        maxHeight: 'min(70vh, 460px)',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Search with Query: Suggestions List */}
      {query.trim() ? (
        <>
          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 select-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Matching Tools
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'}
            </span>
          </div>

          <div className="max-h-[380px] overflow-y-auto overscroll-contain p-1.5 space-y-0.5">
            {matches.length === 0 ? (
              <div className="py-7 px-4 text-center">
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  No tools found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                  Try typing keywords like <span className="text-indigo-600 dark:text-indigo-400">loan</span>, <span className="text-indigo-600 dark:text-indigo-400">formula</span>, <span className="text-indigo-600 dark:text-indigo-400">qr</span>, <span className="text-indigo-600 dark:text-indigo-400">prime</span>, or <span className="text-indigo-600 dark:text-indigo-400">convert</span>
                </p>
              </div>
            ) : (
              matches.map((item, idx) => {
                const { tool, category } = item;
                const isSelected = idx === selectedIndex;
                const isFav = favorites.includes(tool.id);
                const iconTheme = getToolIconTheme(tool.id, tool.iconName);

                return (
                  <button
                    key={tool.id}
                    type="button"
                    data-active={isSelected}
                    onClick={() => {
                      sounds.playClick();
                      onSelectTool(tool);
                    }}
                    onMouseEnter={() => onHoverIndex?.(idx)}
                    className={`w-full group flex items-center justify-between rounded-lg px-2.5 py-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-950 dark:text-zinc-50 ring-1 ring-zinc-300/80 dark:ring-zinc-700/80'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconTheme.iconBg} border ${iconTheme.border} transition-transform group-hover:scale-105`}>
                        <IconRenderer name={tool.iconName} size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 leading-snug">
                          <span className="font-semibold text-xs truncate">
                            <HighlightText text={tool.name} query={query} />
                          </span>
                          {category && (
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 shrink-0 hidden sm:inline">
                              · {category.name}
                            </span>
                          )}
                          {tool.isOnline ? (
                            <span className="inline-flex items-center gap-0.5 text-[9px] text-sky-600 dark:text-sky-400 shrink-0">
                              <Globe className="w-2.5 h-2.5" />
                              <span className="hidden md:inline">Online</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-600 dark:text-emerald-400 shrink-0">
                              <WifiOff className="w-2.5 h-2.5" />
                              <span className="hidden md:inline">Offline</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isFav && (
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-1" />
                      )}
                      <kbd className={`hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono rounded border transition-opacity ${
                        isSelected
                          ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 opacity-100 shadow-2xs'
                          : 'border-transparent text-transparent opacity-0 group-hover:opacity-60 group-hover:border-zinc-200 dark:group-hover:border-zinc-800 group-hover:text-zinc-400'
                      }`}>
                        ↵
                      </kbd>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </>
      ) : (
        /* Empty Query: Recent & Quick Jump Tools */
        <div className="p-1.5 space-y-2">
          {fallbackSuggestions.recents.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Recently Used</span>
              </div>
              <div className="space-y-0.5 mt-0.5">
                {fallbackSuggestions.recents.map(tool => {
                  const iconTheme = getToolIconTheme(tool.id, tool.iconName);
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onSelectTool(tool);
                      }}
                      className="w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${iconTheme.iconBg} border ${iconTheme.border}`}>
                          <IconRenderer name={tool.iconName} size={13} />
                        </div>
                        <span className="text-xs font-medium truncate">{tool.name}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Recommended Utilities</span>
            </div>
            <div className="space-y-0.5 mt-0.5">
              {fallbackSuggestions.popular.map(tool => {
                const iconTheme = getToolIconTheme(tool.id, tool.iconName);
                const cat = CATEGORIES.find(c => c.id === tool.categoryId);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onSelectTool(tool);
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${iconTheme.iconBg} border ${iconTheme.border}`}>
                        <IconRenderer name={tool.iconName} size={13} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-medium truncate block">{tool.name}</span>
                      </div>
                    </div>
                    {cat && (
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                        {cat.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Figma-style Keyboard Footer Guide */}
      <div className="px-3 py-1.5 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/60 flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 select-none">
        <div className="flex items-center gap-2">
          <span><kbd className="font-mono bg-zinc-200/60 dark:bg-zinc-800 px-1 py-0.2 rounded text-[9px]">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono bg-zinc-200/60 dark:bg-zinc-800 px-1 py-0.2 rounded text-[9px]">↵</kbd> select</span>
          <span><kbd className="font-mono bg-zinc-200/60 dark:bg-zinc-800 px-1 py-0.2 rounded text-[9px]">esc</kbd> close</span>
        </div>
        <span className="text-[9px] font-mono tracking-tight text-zinc-400">Quick Actions</span>
      </div>
    </div>
  );
};
