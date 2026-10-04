import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Volume2, VolumeX, Star, Sparkles, Search, X, ArrowRight, FileText, HelpCircle, Menu, LayoutGrid, Check, ExternalLink } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { TOOLS, CATEGORIES } from '../../data/toolsRegistry';
import { ToolItem, CategoryId } from '../../types';
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
  favoriteCount?: number;
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
  favoriteCount = 0,
}) => {
  // Drawer state: opens when clicking the app logo, closes on repeat click, X, or backdrop
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Search state
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listener: Cmd/Ctrl+K opens/focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowDropdown(true);
      } else if (e.key === 'Escape') {
        if (showDropdown) {
          setShowDropdown(false);
        } else if (isDrawerOpen) {
          setIsDrawerOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDropdown, isDrawerOpen]);

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
    setShowDropdown(false);
  };

  const toggleDrawer = () => {
    sounds.playClick();
    setIsDrawerOpen(prev => !prev);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90 transition-colors">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
          {/* Zone 1: Logo & App Name (Clicking toggles the Left Drawer layout!) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={toggleDrawer}
              aria-label="Toggle Navigation Drawer"
              className="flex items-center gap-2 text-left group cursor-pointer p-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors"
              title="Click logo to open Categories & App Menu"
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

          {/* Zone 2: Search Bar directly to the right of the app name */}
          <div ref={searchContainerRef} className="flex-1 max-w-md relative min-w-0">
            <div className="flex items-center rounded-xl border border-zinc-200/90 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all overflow-hidden h-9 px-2.5">
              <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search tools..."
                className="w-full text-xs bg-transparent text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none font-medium truncate"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setShowDropdown(false);
                  }}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center rounded bg-zinc-200/70 dark:bg-zinc-800 px-1.5 py-0.5 text-[9px] font-mono text-zinc-500 dark:text-zinc-400 shrink-0 ml-1">
                ⌘K
              </kbd>
            </div>

            {/* Instant Floating Autocomplete Dropdown */}
            {showDropdown && query.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 rounded-2xl border border-zinc-200/90 bg-white/95 dark:border-zinc-800/90 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
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
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                            tool.isOnline
                              ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {tool.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1.5 px-2 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Press <kbd className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">Enter</kbd> to select</span>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
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

          {/* Zone 3: Mode, Question, and Sound buttons strictly on the right */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mode button (Dark/Light toggle) */}
            <button
              onClick={onToggleDarkMode}
              aria-label="Toggle color theme"
              className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-2xs shrink-0"
              title="Switch Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Question button (Help & Guide) */}
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

            {/* Sound button */}
            <button
              onClick={onToggleSound}
              aria-label="Toggle sound effects"
              className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-2xs shrink-0"
              title={soundEnabled ? 'Mute tactile audio' : 'Enable tactile audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Drawer to the Left Layout (Triggered by clicking the app logo) */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 block leading-tight">
                OmniToolbox
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                Universal Suite · {TOOLS.length} Utilities
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-850 space-y-1">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onSelectTab('categories');
              setIsDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'categories'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              <span>All Tools Directory</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-200/60 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
              {TOOLS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onSelectTab('favorites');
              setIsDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'favorites'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400/40" />
              <span>Starred Favorites</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
              {favoriteCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onSelectTab('notes');
              setIsDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'notes'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Quick Notes & Scratchpad</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">⌘J</span>
          </button>
        </div>

        {/* Drawer Categories List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-1">
            Categories ({CATEGORIES.length})
          </div>
          {CATEGORIES.map(category => {
            const count = TOOLS.filter(t => t.categoryId === category.id).length;
            const theme = getCategoryTheme(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onSelectTab('categories');
                  setIsDrawerOpen(false);
                  setTimeout(() => {
                    const el = document.getElementById(`category-section-${category.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${theme.iconBg} border ${theme.border} shadow-2xs`}>
                    <IconRenderer name={category.iconName} size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate block">
                      {category.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate block">
                      {category.description}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 shrink-0 ml-1">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Drawer Footer: PWA Offline Info & Shortcuts */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/60 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Offline Status:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ready
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span>Search Shortcut:</span>
            <kbd className="font-mono bg-zinc-200/80 dark:bg-zinc-800 px-1 py-0.5 rounded">⌘K</kbd>
          </div>
        </div>
      </aside>
    </>
  );
};
