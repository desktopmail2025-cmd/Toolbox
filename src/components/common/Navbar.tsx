import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Volume2, VolumeX, Star, Sparkles, Search, X, ArrowRight, FileText, HelpCircle } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { TOOLS, CATEGORIES } from '../../data/toolsRegistry';
import { ToolItem } from '../../types';
import { IconRenderer } from './IconRenderer';
import { getCategoryTheme } from '../../utils/themeColors';

interface NavbarProps {
  onOpenSearch: () => void;
  onClearSearch?: () => void;
  searchQuery?: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onSelectTool?: (tool: ToolItem) => void;
  onOpenOnboarding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  darkMode,
  onToggleDarkMode,
  soundEnabled,
  onToggleSound,
  activeTab,
  onSelectTab,
  onSelectTool,
  onOpenOnboarding,
}) => {
  // Expandable search state: collapsed by default
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close search and dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!query.trim()) {
          setIsExpanded(false);
        }
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  // Keyboard shortcut listener: Cmd/Ctrl+K expands navbar search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsExpanded(true);
        setShowDropdown(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      } else if (e.key === 'Escape' && isExpanded) {
        handleCollapseSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const handleExpandSearch = () => {
    sounds.playClick();
    setIsExpanded(true);
    setShowDropdown(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCollapseSearch = () => {
    sounds.playClick();
    setQuery('');
    setIsExpanded(false);
    setShowDropdown(false);
  };

  // Filtered tools for instant autocomplete dropdown
  const filteredTools = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return TOOLS.filter(tool => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchKeywords = tool.keywords.some(k => k.toLowerCase().includes(q));
      const matchCat = CATEGORIES.find(c => c.id === tool.categoryId)?.name.toLowerCase().includes(q);
      return matchName || matchDesc || matchKeywords || matchCat;
    }).slice(0, 6);
  }, [query]);

  const handleSelectSearchResult = (tool: ToolItem) => {
    sounds.playClick();
    if (onSelectTool) {
      onSelectTool(tool);
    }
    setQuery('');
    setIsExpanded(false);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90 transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('categories');
            }}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-base transition-transform group-hover:scale-105 active:scale-95 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              <span className="hidden min-[380px]:inline">OmniToolbox</span>
              <span className="min-[380px]:hidden">Omni</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (All Tools, Live Scores, Starred, Notes) */}
        <nav className={`hidden md:flex items-center gap-5 text-sm font-medium text-zinc-600 dark:text-zinc-400 transition-opacity ${isExpanded ? 'lg:flex' : ''}`}>
          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('categories');
            }}
            className={`transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer ${
              activeTab === 'categories' ? 'text-zinc-950 dark:text-white font-semibold' : ''
            }`}
          >
            All Tools
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('favorites');
            }}
            className={`flex items-center gap-1.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer ${
              activeTab === 'favorites' ? 'text-zinc-950 dark:text-white font-semibold' : ''
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400/40 text-amber-500" />
            <span>Starred</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('notes');
            }}
            className={`flex items-center gap-1.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer ${
              activeTab === 'notes' ? 'text-zinc-950 dark:text-white font-semibold' : ''
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Notes</span>
          </button>
        </nav>

        {/* Zone 3: Actions - Expandable Search Bar + Audio/Theme/Help controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* EXPANDABLE SEARCH: No 'X' sign when collapsed. 'X' sign ONLY appears when search is expanded! */}
          <div ref={containerRef} className="relative">
            {!isExpanded ? (
              // Collapsed state: Sleek, pill-shaped trigger button with NO 'x' sign
              <button
                type="button"
                onClick={handleExpandSearch}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200/90 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/90 dark:hover:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300 cursor-pointer active:scale-95 transition-all shadow-2xs"
                title="Search 160+ tools (⌘K / Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span className="font-semibold hidden sm:inline">Search tools</span>
                <span className="font-semibold sm:hidden">Search</span>
                <kbd className="hidden lg:inline-flex items-center rounded bg-zinc-200/70 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                  ⌘K
                </kbd>
              </button>
            ) : (
              // Expanded state: Full active search input WITH the 'X' button on the right to collapse/clear!
              <div className="flex items-center rounded-xl border border-indigo-500/80 bg-white dark:bg-zinc-900 dark:border-indigo-400/80 shadow-md transition-all duration-200 w-44 min-[380px]:w-56 sm:w-72 md:w-80 overflow-hidden ring-2 ring-indigo-500/20">
                <div className="pl-2.5 pr-1.5 text-indigo-500 dark:text-indigo-400 shrink-0">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Escape') {
                      handleCollapseSearch();
                    } else if (e.key === 'Enter' && filteredTools.length > 0) {
                      handleSelectSearchResult(filteredTools[0]);
                    }
                  }}
                  placeholder="Search 160+ tools..."
                  className="w-full py-1.5 text-xs bg-transparent text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none font-medium"
                />
                {/* The 'X' sign ONLY appears when search is expanded! */}
                <button
                  type="button"
                  onClick={handleCollapseSearch}
                  className="flex items-center justify-center p-1.5 mr-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer active:scale-90 transition-all shrink-0"
                  title="Close search (Esc)"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Instant Floating Autocomplete Dropdown when typing in expanded search */}
            {isExpanded && showDropdown && query.trim().length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-zinc-200/90 bg-white/95 dark:border-zinc-800/90 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2.5 py-1 flex items-center justify-between">
                  <span>Matching Tools</span>
                  <span>{filteredTools.length} results</span>
                </div>
                {filteredTools.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-zinc-500">
                    No tools found for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {filteredTools.map(tool => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => handleSelectSearchResult(tool)}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${getCategoryTheme(tool.categoryId).iconBg} border ${getCategoryTheme(tool.categoryId).border} shadow-2xs`}>
                            <IconRenderer name={tool.iconName} size={14} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                              {tool.name}
                            </div>
                            <div className="text-[10px] text-zinc-400 truncate">
                              {tool.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                              tool.isOnline
                                ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300'
                                : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {tool.isOnline ? 'Online' : 'Offline'}
                          </span>
                          <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1.5 px-2 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Press <kbd className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">Enter</kbd> to select</span>
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      onOpenSearch();
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                  >
                    Open Full Search
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label="Toggle sound effects"
            className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-2xs shrink-0"
            title={soundEnabled ? 'Mute sound effects' : 'Enable tactile audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle color theme"
            className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-2xs shrink-0"
            title="Switch Dark/Light Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Tour / Help Button (Always starts from beginning) */}
          {onOpenOnboarding && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenOnboarding();
              }}
              aria-label="Quick Tour & Guide"
              className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-indigo-200/80 bg-indigo-50/60 hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 active:scale-95 transition-all cursor-pointer shadow-2xs shrink-0"
              title="Quick App Tour & Guide (?)"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
