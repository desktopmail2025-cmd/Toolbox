import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Volume2, VolumeX, Sparkles, Search, X, HelpCircle, LayoutGrid, Zap, WifiOff, Globe } from 'lucide-react';
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
  favoriteCount?: number;
  toolFilter?: 'all' | 'offline' | 'online';
  onSelectToolFilter?: (filter: 'all' | 'offline' | 'online') => void;
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
  toolFilter = 'all',
  onSelectToolFilter,
}) => {
  // Drawer state: opens when clicking the app logo, closes on repeat click, X, or backdrop
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Swipe gesture support to open/close drawer on mobile
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const startX = touchStartRef.current.x;
      touchStartRef.current = null;

      // Horizontal gesture detection
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
        if (!isDrawerOpen && startX < 45 && deltaX > 40) {
          sounds.playClick();
          setIsDrawerOpen(true);
        } else if (isDrawerOpen && deltaX < -40) {
          sounds.playClick();
          setIsDrawerOpen(false);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDrawerOpen]);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchHistoryPushedRef = useRef(false);
  const isClosingViaBackRef = useRef(false);

  // Helper to completely reset search to unopened and unselected
  const resetSearchToUnopened = (options?: { fromPopState?: boolean }) => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setIsSearchOpen(false);
    setQuery('');
    (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen = false;

    // Remove any text selection on page
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }

    // Safely sync history if entry was pushed and closing wasn't caused by popstate
    if (searchHistoryPushedRef.current) {
      searchHistoryPushedRef.current = false;
      if (!options?.fromPopState) {
        isClosingViaBackRef.current = true;
        try {
          window.history.back();
        } catch {
          // ignore
        }
      }
    }
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen = true;

    if (!searchHistoryPushedRef.current) {
      try {
        window.history.pushState({ omniSearchOpen: true }, '', window.location.href);
        searchHistoryPushedRef.current = true;
      } catch {
        // ignore
      }
    }
  };

  // Close search and unselect if user touches/clicks anywhere outside
  useEffect(() => {
    const handleInteractionOutside = (e: MouseEvent | TouchEvent) => {
      if (isSearchOpen && searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        resetSearchToUnopened();
      }
    };
    document.addEventListener('mousedown', handleInteractionOutside);
    document.addEventListener('touchstart', handleInteractionOutside, { passive: true });
    document.addEventListener('pointerdown', handleInteractionOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleInteractionOutside);
      document.removeEventListener('touchstart', handleInteractionOutside);
      document.removeEventListener('pointerdown', handleInteractionOutside);
    };
  }, [isSearchOpen]);

  // Back button / gesture handler: if user presses back while search is active, dismiss and return to unopened
  useEffect(() => {
    const handlePopState = () => {
      if (isClosingViaBackRef.current) {
        isClosingViaBackRef.current = false;
        return;
      }
      if (isSearchOpen || searchHistoryPushedRef.current || document.activeElement === inputRef.current || query) {
        resetSearchToUnopened({ fromPopState: true });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isSearchOpen, query]);

  // Keyboard shortcut listener: Cmd/Ctrl+K opens/focuses search, ESC closes it
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        handleOpenSearch();
      } else if (e.key === 'Escape') {
        if (isSearchOpen || document.activeElement === inputRef.current || query) {
          resetSearchToUnopened();
        } else if (isDrawerOpen) {
          setIsDrawerOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isDrawerOpen, query]);

  const toggleDrawer = () => {
    sounds.playClick();
    setIsDrawerOpen(prev => !prev);
  };

  return (
    <>
      {/* Outside Touch/Click Backdrop for Search: Returns search instantly to unopened state */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 dark:bg-black/55 backdrop-blur-[1px] transition-opacity duration-150 animate-in fade-in"
          onPointerDown={e => {
            e.preventDefault();
            resetSearchToUnopened();
          }}
          onTouchStart={e => {
            e.preventDefault();
            resetSearchToUnopened();
          }}
          onClick={() => resetSearchToUnopened()}
          aria-label="Close search overlay"
        />
      )}

      <header className={`sticky top-0 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90 transition-colors ${
        isSearchOpen ? 'z-50' : 'z-40'
      }`}>
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
          <div ref={searchContainerRef} className={`flex-1 max-w-md relative min-w-0 ${isSearchOpen ? 'z-50' : ''}`}>
            <div className={`flex items-center rounded-xl border bg-zinc-50 dark:bg-zinc-900 transition-all overflow-hidden h-9 px-2.5 ${
              isSearchOpen
                ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md bg-white dark:bg-zinc-900'
                : 'border-zinc-200/90 dark:border-zinc-800'
            }`}>
              <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  if (!isSearchOpen) {
                    handleOpenSearch();
                  }
                }}
                onFocus={handleOpenSearch}
                onClick={handleOpenSearch}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (query.trim()) {
                      const q = query.toLowerCase().trim();
                      const matched = TOOLS.find(
                        t =>
                          t.name.toLowerCase() === q ||
                          t.id.toLowerCase() === q ||
                          t.name.toLowerCase().includes(q)
                      );
                      if (matched && onSelectTool) {
                        sounds.playClick();
                        onSelectTool(matched);
                        resetSearchToUnopened();
                        return;
                      }
                    }
                    resetSearchToUnopened();
                    onOpenSearch();
                  } else if (e.key === 'Escape') {
                    resetSearchToUnopened();
                  }
                }}
                onBlur={e => {
                  if (!searchContainerRef.current?.contains(e.relatedTarget as Node)) {
                    setTimeout(() => {
                      if (!searchContainerRef.current?.contains(document.activeElement)) {
                        resetSearchToUnopened();
                      }
                    }, 120);
                  }
                }}
                placeholder="Search tools..."
                className="w-full text-xs bg-transparent text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none font-medium truncate"
              />
              {(query || isSearchOpen) && (
                <button
                  type="button"
                  onMouseDown={e => {
                    e.preventDefault();
                    resetSearchToUnopened();
                  }}
                  onClick={() => resetSearchToUnopened()}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  title="Close and clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center rounded bg-zinc-200/70 dark:bg-zinc-800 px-1.5 py-0.5 text-[9px] font-mono text-zinc-500 dark:text-zinc-400 shrink-0 ml-1">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Zone 3: Mode, Question, and Sound buttons — Desktop Only (Moved to drawer on mobile) */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
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

      {/* Slide-out Drawer to the Left Layout (Triggered by clicking the app logo or sliding from left) */}
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
        {/* Drawer Header with same logo and name at the top */}
        <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsDrawerOpen(false);
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
            title="Click to close drawer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 block leading-tight">
                OmniToolbox
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                Universal Utility Suite
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Settings Bar in Drawer: Mood (theme), Question Mark (help), and Sound */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-850">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 px-1">
            Controls & Preferences
          </div>
          <div className="grid grid-cols-3 gap-2">
            {/* Theme Toggle (Mood) */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onToggleDarkMode();
              }}
              className="flex flex-col items-center justify-center p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400 mb-1" /> : <Moon className="w-4 h-4 text-zinc-600 dark:text-zinc-400 mb-1" />}
              <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">{darkMode ? 'Dark' : 'Light'}</span>
              <span className="text-[9px] text-zinc-400">Mood</span>
            </button>

            {/* Help & Guide (Question mark) */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsDrawerOpen(false);
                if (onOpenOnboarding) {
                  onOpenOnboarding();
                }
              }}
              className="flex flex-col items-center justify-center p-2 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 active:scale-95 transition-all cursor-pointer"
              title="Help & Tour Guide"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-[11px] font-semibold text-indigo-900 dark:text-indigo-200">Guide</span>
              <span className="text-[9px] text-indigo-500/80 dark:text-indigo-400/80">Help (?)</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onToggleSound();
              }}
              className="flex flex-col items-center justify-center p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
              title="Toggle Sound Effects"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1" /> : <VolumeX className="w-4 h-4 text-zinc-400 mb-1" />}
              <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">{soundEnabled ? 'On' : 'Muted'}</span>
              <span className="text-[9px] text-zinc-400">Sound</span>
            </button>
          </div>
        </div>

        {/* Info Section moved into drawer: Universal Toolbox, Categories, Utilities, Tool Explorer */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-850 bg-zinc-50/70 dark:bg-zinc-900/50">
          <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex-wrap">
              <span>Universal Toolbox</span>
              <span aria-hidden="true">·</span>
              <span>{CATEGORIES.length} Categories</span>
              <span aria-hidden="true">·</span>
              <span>{TOOLS.length} Utilities</span>
            </div>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">
              Tool Explorer
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Explore our master catalog of high-performance utilities. Filter between 100% on-device offline tools and live internet-connected APIs.
            </p>
          </div>
        </div>

        {/* Drawer Tool Directories: All Categories, Online Tools, Offline Tools */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-2 pt-1 pb-1">
            Tool Directories
          </div>

          {/* 1. All Categories */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              if (onSelectToolFilter) {
                onSelectToolFilter('all');
              }
              onSelectTab('categories');
              setIsDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-left cursor-pointer transition-all duration-200 border ${
              toolFilter === 'all'
                ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-100 font-bold shadow-xs'
                : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
                toolFilter === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate">All Categories</span>
                <span className="text-[10px] text-zinc-400 block font-normal truncate">
                  Master catalog of {CATEGORIES.length} categories
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shrink-0 ml-2">
              {TOOLS.length}
            </span>
          </button>

          {/* 2. Online Tools */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              if (onSelectToolFilter) {
                onSelectToolFilter('online');
              }
              onSelectTab('categories');
              setIsDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-left cursor-pointer transition-all duration-200 border ${
              toolFilter === 'online'
                ? 'bg-sky-50/90 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-100 font-bold shadow-xs'
                : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
                toolFilter === 'online' ? 'bg-sky-600 text-white shadow-xs' : 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60'
              }`}>
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate">Online Tools</span>
                <span className="text-[10px] text-zinc-400 block font-normal truncate">
                  Live web APIs, tickers & cloud forecasts
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 shrink-0 ml-2">
              {TOOLS.filter(t => t.isOnline).length}
            </span>
          </button>

          {/* 3. Offline Tools */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              if (onSelectToolFilter) {
                onSelectToolFilter('offline');
              }
              onSelectTab('categories');
              setIsDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-left cursor-pointer transition-all duration-200 border ${
              toolFilter === 'offline'
                ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs'
                : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
                toolFilter === 'offline' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
              }`}>
                <WifiOff className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate">Offline Tools</span>
                <span className="text-[10px] text-zinc-400 block font-normal truncate">
                  100% on-device & private · No network needed
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 shrink-0 ml-2">
              {TOOLS.filter(t => !t.isOnline).length}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
