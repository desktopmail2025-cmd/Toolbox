import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowRight } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../../data/toolsRegistry';
import { ToolItem } from '../../types';
import { IconRenderer } from './IconRenderer';
import { getCategoryTheme, getToolIconTheme } from '../../utils/themeColors';
import { sounds } from '../../utils/audio';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: ToolItem) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  favorites,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

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
          onSelectTool(filteredTools[selectedIndex]);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, onClose, onSelectTool]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <Search className="h-5 w-5 text-zinc-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type any tool name, concept or keyword (e.g. loan, tax, bogo, gpa, qr, unit)..."
            className="w-full bg-transparent text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-50"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <span className="text-xs px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700 rounded font-mono">
              ESC
            </span>
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              No tools matching &ldquo;{query}&rdquo;. Try another search term.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTools.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                const isFavorite = favorites.includes(tool.id);
                const categoryMeta = CATEGORIES.find(c => c.id === tool.categoryId);

                return (
                  <div
                    key={tool.id}
                    onClick={() => {
                      sounds.playClick();
                      onSelectTool(tool);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex items-center justify-between rounded-xl p-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white'
                        : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getToolIconTheme(tool.id, tool.iconName).iconBg} border ${getToolIconTheme(tool.id, tool.iconName).border} shadow-2xs`}>
                        <IconRenderer name={tool.iconName} size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{tool.name}</span>
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                            · {categoryMeta?.name}
                          </span>
                          {tool.isOnline ? (
                            <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.2 rounded border border-sky-200/60 shrink-0">
                              Online
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200/60 shrink-0">
                              Offline
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
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
                        className="p-1.5 text-zinc-400 hover:text-amber-500 transition-colors"
                        title={isFavorite ? 'Remove from starred' : 'Add to starred'}
                      >
                        <Star
                          className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`}
                        />
                      </button>
                      <ArrowRight className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-[11px] text-zinc-500 flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>Showing {filteredTools.length} results</span>
        </div>
      </div>
    </div>
  );
};
