import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowRight, Globe, WifiOff } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../../data/toolsRegistry';
import { ToolItem } from '../../types';
import { IconRenderer } from './IconRenderer';
import { getCategoryTheme, getToolIconTheme } from '../../utils/themeColors';
import { sounds } from '../../utils/audio';
import { HighlightText } from './SearchSuggestions';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: ToolItem, origin?: { fromSearch: boolean; searchQuery: string; searchMode: 'navbar' | 'modal' }) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
  initialQuery?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  favorites,
  onToggleFavorite,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialQuery]);

  const filteredTools = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return TOOLS.slice(0, 15);
    return TOOLS.filter(tool => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchKeywords = tool.keywords.some(k => k.toLowerCase().includes(q));
      const matchCat = CATEGORIES.find(c => c.id === tool.categoryId)?.name.toLowerCase().includes(q);
      return matchName || matchDesc || matchKeywords || matchCat;
    }).slice(0, 20);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredTools.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          sounds.playClick();
          onSelectTool(filteredTools[selectedIndex], {
            fromSearch: true,
            searchQuery: query,
            searchMode: 'modal',
          });
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, onClose, onSelectTool, query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:pt-16 bg-black/50 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      onPointerDown={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:border-zinc-800 dark:bg-[#18181b] transition-all animate-in zoom-in-95 duration-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Figma Command Palette: Search Input Bar */}
        <div className="relative flex items-center border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
          <Search className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tools, calculators, scientific solvers..."
            className="w-full bg-transparent text-sm sm:text-base text-zinc-950 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none dark:text-zinc-50 font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 mr-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 cursor-pointer"
          >
            <kbd className="text-[10px] px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 font-mono shadow-2xs">
              ESC
            </kbd>
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 overscroll-contain">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
              <p className="font-medium">No tools matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Try another keyword or browse categories</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTools.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                const isFavorite = favorites.includes(tool.id);
                const categoryMeta = CATEGORIES.find(c => c.id === tool.categoryId);
                const iconTheme = getToolIconTheme(tool.id, tool.iconName);

                return (
                  <div
                    key={tool.id}
                    onClick={() => {
                      sounds.playClick();
                      onSelectTool(tool, {
                        fromSearch: true,
                        searchQuery: query,
                        searchMode: 'modal',
                      });
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex items-center justify-between rounded-xl p-2.5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-800/90 dark:text-white ring-1 ring-zinc-300/80 dark:ring-zinc-700/80'
                        : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-850/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconTheme.iconBg} border ${iconTheme.border} shadow-2xs`}>
                        <IconRenderer name={tool.iconName} size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs sm:text-sm truncate">
                            <HighlightText text={tool.name} query={query} />
                          </span>
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate hidden sm:inline">
                            · {categoryMeta?.name}
                          </span>
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
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          sounds.playClick();
                          onToggleFavorite(tool.id);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-amber-500 transition-colors cursor-pointer"
                        title={isFavorite ? 'Remove from starred' : 'Add to starred'}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`}
                        />
                      </button>
                      <kbd className={`hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono rounded border transition-opacity ${
                        isSelected
                          ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 opacity-100 shadow-2xs'
                          : 'border-transparent text-transparent opacity-0 group-hover:opacity-60 group-hover:border-zinc-200 dark:group-hover:border-zinc-800 group-hover:text-zinc-400'
                      }`}>
                        ↵
                      </kbd>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Figma Quick Actions Modal Footer */}
        <div className="border-t border-zinc-200/80 bg-zinc-50/80 px-4 py-2 text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-900/60 select-none">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-zinc-200/60 dark:bg-zinc-800 px-1 py-0.2 rounded text-[9px]">↑↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-zinc-200/60 dark:bg-zinc-800 px-1 py-0.2 rounded text-[9px]">↵</kbd> Open Tool</span>
            <span><kbd className="font-mono bg-zinc-200/60 dark:bg-zinc-800 px-1 py-0.2 rounded text-[9px]">esc</kbd> Dismiss</span>
          </div>
          <span className="font-mono text-[10px]">{filteredTools.length} tools available</span>
        </div>
      </div>
    </div>
  );
};

