import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Moon, Sun, Volume2, VolumeX, Sparkles, Search, X, HelpCircle, LayoutGrid, Zap, WifiOff, Globe, LogOut, Star, BarChart3, Gift } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { TOOLS, CATEGORIES } from '../../data/toolsRegistry';
import { ToolItem } from '../../types';
import { IconRenderer } from './IconRenderer';
import { getCategoryTheme } from '../../utils/themeColors';
import { DrawerStreakWidget } from './DrawerStreakWidget';
import { SearchSuggestions } from './SearchSuggestions';
import { admobService } from '../../services/admobService';

interface NavbarProps {
  onOpenSearch: () => void;
  onClearSearch?: () => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onSelectTool?: (tool: ToolItem, origin?: { fromSearch: boolean; searchQuery: string; searchMode: 'navbar' | 'modal' }) => void;
  onOpenOnboarding?: () => void;
  favoriteCount?: number;
  toolFilter?: 'all' | 'offline' | 'online';
  onSelectToolFilter?: (filter: 'all' | 'offline' | 'online') => void;
  onOpenExitDialog?: () => void;
  isSearchOpen?: boolean;
  onSearchOpenChange?: (open: boolean) => void;
  closeSearchTrigger?: number;
  onDrawerOpenChange?: (open: boolean) => void;
  closeDrawerTrigger?: number;
  favorites?: string[];
  recents?: string[];
  hasActiveTool?: boolean;
  onOpenAdMobPerformance?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  searchQuery,
  onSearchQueryChange,
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
  onOpenExitDialog,
  isSearchOpen: controlledIsSearchOpen,
  onSearchOpenChange,
  closeSearchTrigger,
  onDrawerOpenChange,
  closeDrawerTrigger,
  favorites = [],
  recents = [],
  hasActiveTool = false,
  onOpenAdMobPerformance,
}) => {
  // Drawer state: opens when clicking the app logo, closes on repeat click, X, or backdrop
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const setDrawerState = (open: boolean) => {
    setIsDrawerOpen(open);
    onDrawerOpenChange?.(open);
  };

  // Close drawer trigger from parent back-navigation
  useEffect(() => {
    if (closeDrawerTrigger) {
      setDrawerState(false);
    }
  }, [closeDrawerTrigger]);

  // Prevent background touch and mouse wheel scrolling when drawer is open across all devices (mobile, tablet, web)
  useEffect(() => {
    if (isDrawerOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyTouchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      // Prevent mouse wheel scrolling anywhere outside aside
      const handleWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target?.closest('aside')) {
          e.preventDefault();
        }
      };

      const preventBackgroundScroll = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target?.closest('aside')) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
      window.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.touchAction = prevBodyTouchAction;
        document.removeEventListener('touchmove', preventBackgroundScroll);
        window.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isDrawerOpen]);

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

      // Horizontal gesture detection: only allow swiping left to close when drawer is already open
      if (isDrawerOpen && deltaX < -40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        sounds.playClick();
        setDrawerState(false);
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
  const [internalIsSearchOpen, setInternalIsSearchOpen] = useState(false);
  const isSearchOpen = controlledIsSearchOpen !== undefined ? controlledIsSearchOpen : internalIsSearchOpen;

  const [internalQuery, setInternalQuery] = useState(searchQuery || '');
  const query = searchQuery !== undefined ? searchQuery : internalQuery;

  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync external search query if provided
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== internalQuery) {
      setInternalQuery(searchQuery);
    }
  }, [searchQuery]);

  // Sync external search open state if provided
  useEffect(() => {
    if (controlledIsSearchOpen !== undefined && controlledIsSearchOpen !== internalIsSearchOpen) {
      setInternalIsSearchOpen(controlledIsSearchOpen);
      if (controlledIsSearchOpen) {
        setSelectedIndex(0);
        (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen = true;
      } else {
        (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen = false;
      }
    }
  }, [controlledIsSearchOpen]);

  // When a tool is actively opened, immediately dismiss search suggestions & blur input
  useEffect(() => {
    if (hasActiveTool) {
      setInternalIsSearchOpen(false);
      onSearchOpenChange?.(false);
      inputRef.current?.blur();
      (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen = false;
    }
  }, [hasActiveTool, onSearchOpenChange]);

  // Suggestions are only allowed to show when NO tool is actively open
  const isSuggestionsVisible = !hasActiveTool && isSearchOpen;

  // Computed matches for keyboard navigation
  const currentMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const recentsTools = recents
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
      ];
      const popularTools = popularIds
        .filter(id => !recents.includes(id))
        .map(id => TOOLS.find(t => t.id === id))
        .filter((t): t is ToolItem => t !== undefined)
        .slice(0, 4);
      return [...recentsTools, ...popularTools];
    }

    return TOOLS.map(tool => {
      let score = 0;
      const nameLower = tool.name.toLowerCase();
      const descLower = tool.description.toLowerCase();
      const cat = CATEGORIES.find(c => c.id === tool.categoryId);
      const catLower = cat ? cat.name.toLowerCase() : '';

      if (nameLower === q) score += 1000;
      else if (nameLower.startsWith(q)) score += 600;
      else if (nameLower.split(/\s+/).some(w => w.startsWith(q))) score += 400;
      else if (nameLower.includes(q)) score += 250;

      for (const kw of tool.keywords) {
        const kwLower = kw.toLowerCase();
        if (kwLower === q) score += 300;
        else if (kwLower.startsWith(q)) score += 180;
        else if (kwLower.includes(q)) score += 90;
      }
      if (catLower.includes(q)) score += 70;
      if (descLower.includes(q)) score += 40;

      return { tool, score };
    })
      .filter(i => i.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(i => i.tool);
  }, [query, recents]);

  const updateQuery = (newQuery: string) => {
    setInternalQuery(newQuery);
    onSearchQueryChange?.(newQuery);
    setSelectedIndex(0);
  };

  // Helper to completely reset search to unopened and unselected
  const resetSearchToUnopened = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setInternalIsSearchOpen(false);
    onSearchOpenChange?.(false);
    updateQuery('');
    setSelectedIndex(0);
    (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen = false;

    // Remove any text selection on page
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  };

  // Close search trigger from parent back-navigation
  useEffect(() => {
    if (closeSearchTrigger) {
      resetSearchToUnopened();
    }
  }, [closeSearchTrigger]);

  const handleOpenSearch = () => {
    setInternalIsSearchOpen(true);
    onSearchOpenChange?.(true);
    (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen = true;
  };

  // Selection from suggestions with origin tracking!
  const handleSelectSuggestedTool = (tool: ToolItem) => {
    sounds.playClick();
    // Immediately dismiss suggestions and remove input focus so the tool displays cleanly
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setInternalIsSearchOpen(false);
    onSearchOpenChange?.(false);
    (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen = false;

    if (onSelectTool) {
      onSelectTool(tool, {
        fromSearch: true,
        searchQuery: query,
        searchMode: 'navbar',
      });
    }
  };

  // Close search and unselect if user touches/clicks anywhere outside
  useEffect(() => {
    const handleInteractionOutside = (e: MouseEvent | TouchEvent) => {
      // If the interaction is at the screen edge (edge swipe back zone), do not close search here;
      // let the edge back gesture handler in App.tsx handle it cleanly so it closes suggestions without quitting!
      if (e instanceof TouchEvent && e.touches && e.touches.length > 0) {
        const touchX = e.touches[0].clientX;
        if (touchX <= 75 || touchX >= window.innerWidth - 75) {
          return;
        }
      }
      if (typeof PointerEvent !== 'undefined' && e instanceof PointerEvent && e.pointerType === 'touch') {
        if (e.clientX <= 75 || e.clientX >= window.innerWidth - 75) {
          return;
        }
      }

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
          setDrawerState(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isDrawerOpen, query]);

  const toggleDrawer = () => {
    sounds.playClick();
    setDrawerState(!isDrawerOpen);
  };

  return (
    <>
      {/* Outside Touch/Click Backdrop for Search: Returns search instantly to unopened state */}
      {isSuggestionsVisible && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50 backdrop-blur-[2px] transition-opacity duration-150 animate-in fade-in"
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

      {/* Figma-style workstation top toolbar: Notch-safe, pinned solidly during all scrolling */}
      <header
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 18px)' }}
        className={`fixed top-0 left-0 right-0 w-full border-b border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md shadow-2xs transition-colors ${
          isSearchOpen ? 'z-50' : 'z-40'
        }`}
      >
        <div className="mx-auto flex h-13 max-w-7xl items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
          {/* Zone 1: Brand / Menu Toggle (Figma workspace style) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={toggleDrawer}
              aria-label="Toggle Navigation Drawer"
              className="flex items-center gap-2.5 text-left group cursor-pointer p-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
              title="Click logo to open Categories & App Menu"
            >
              <img
                src="/icon.svg"
                alt="OmniToolbox"
                className="h-7.5 w-7.5 rounded-lg object-contain transition-transform group-hover:scale-105 active:scale-95 shadow-xs border border-zinc-200/50 dark:border-zinc-800"
              />
              <span className="text-sm font-bold tracking-tight text-zinc-950 dark:text-zinc-50 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                <span className="hidden min-[380px]:inline">OmniToolbox</span>
                <span className="min-[380px]:hidden">Omni</span>
              </span>
            </button>
          </div>

          {/* Zone 2: Search Bar positioned on the right side with Live suggestions */}
          <div ref={searchContainerRef} data-search-container="true" className={`ml-auto w-full max-w-xs sm:max-w-sm md:max-w-md relative min-w-0 ${isSearchOpen ? 'z-50' : ''}`}>
            <div className={`flex items-center rounded-lg border bg-zinc-50/80 dark:bg-zinc-900/80 transition-all overflow-hidden h-8.5 px-2.5 ${
              isSearchOpen
                ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md bg-white dark:bg-zinc-900'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}>
              <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0 mr-2" />
              <input
                ref={inputRef}
                type="text"
                data-no-auto-clear="true"
                data-search-input="true"
                value={query}
                onChange={e => {
                  updateQuery(e.target.value);
                  if (!isSearchOpen) {
                    handleOpenSearch();
                  }
                }}
                onFocus={handleOpenSearch}
                onClick={handleOpenSearch}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (!isSearchOpen) {
                      handleOpenSearch();
                    } else if (currentMatches.length > 0) {
                      setSelectedIndex(prev => (prev + 1) % currentMatches.length);
                    }
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (!isSearchOpen) {
                      handleOpenSearch();
                    } else if (currentMatches.length > 0) {
                      setSelectedIndex(prev => (prev - 1 + currentMatches.length) % currentMatches.length);
                    }
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (currentMatches.length > 0 && currentMatches[selectedIndex]) {
                      handleSelectSuggestedTool(currentMatches[selectedIndex]);
                      return;
                    }
                    if (query.trim()) {
                      const q = query.toLowerCase().trim();
                      const matched = TOOLS.find(
                        t =>
                          t.name.toLowerCase() === q ||
                          t.id.toLowerCase() === q ||
                          t.name.toLowerCase().includes(q)
                      );
                      if (matched) {
                        handleSelectSuggestedTool(matched);
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
                    }, 140);
                  }
                }}
                placeholder="Search tools, formulas, solvers..."
                className="w-full text-xs bg-transparent text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none font-medium truncate"
              />

              {(query || isSearchOpen) && (
                <button
                  type="button"
                  onMouseDown={e => {
                    e.preventDefault();
                    resetSearchToUnopened();
                  }}
                  onClick={() => resetSearchToUnopened()}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Close and clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Suggestions Popover attached directly below the search input */}
            <SearchSuggestions
              query={query}
              isOpen={isSuggestionsVisible}
              onSelectTool={handleSelectSuggestedTool}
              onClose={resetSearchToUnopened}
              favorites={favorites}
              recents={recents}
              selectedIndex={selectedIndex}
              onHoverIndex={setSelectedIndex}
            />
          </div>
        </div>
      </header>

      {/* Slide-out Drawer to the Left Layout (Triggered by clicking the app logo or sliding from left) */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in touch-none overscroll-none"
          onClick={() => setDrawerState(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[19rem] sm:w-[22rem] md:w-[25rem] h-[100dvh] max-h-[100dvh] bg-white dark:bg-zinc-950 rounded-r-3xl sm:rounded-r-[2rem] border-r border-zinc-200 dark:border-zinc-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col overflow-hidden ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          height: '100dvh',
          maxHeight: '100dvh',
        }}
      >
        {/* Dedicated Notch / Status-bar Guard Band */}
        <div
          style={{ height: 'max(env(safe-area-inset-top, 0px), 18px)' }}
          className="w-full shrink-0 bg-zinc-100/70 dark:bg-zinc-900/70 border-b border-zinc-200/50 dark:border-zinc-800/50"
        />

        {/* Drawer Header with generous status-bar notch safe clearance for ALL mobile devices */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white dark:bg-zinc-950">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setDrawerState(false);
            }}
            className="flex items-center gap-3 text-left cursor-pointer group"
            title="Click to close drawer"
          >
            <img
              src="/icon.svg"
              alt="OmniToolbox"
              className="h-9 w-9 rounded-2xl object-contain shadow-xs border border-zinc-200/50 dark:border-zinc-800"
            />
            <div>
              <span className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 block leading-tight">
                OmniToolbox
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                Universal Utility Suite
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDrawerState(false)}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer transition-colors"
            title="Close Drawer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Scrollable Drawer Body with smooth scrolling and visible scrollbar for Tablet & Mobile Scrolling */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain py-3 space-y-4 touch-pan-y drawer-scrollbar"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          {/* User Engagement Streak System with 1-Week and 1-Month Milestone Goals */}
          <DrawerStreakWidget />

          {/* Quick Settings Bar in Drawer: Mood (theme), Question Mark (help), and Sound */}
          <div className="px-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 px-1">
              Controls & Preferences
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Theme Toggle (Mood) */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onToggleDarkMode();
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-2xs"
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
                  setDrawerState(false);
                  if (onOpenOnboarding) {
                    onOpenOnboarding();
                  }
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 active:scale-95 transition-all cursor-pointer shadow-2xs"
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
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Toggle Sound Effects"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1" /> : <VolumeX className="w-4 h-4 text-zinc-400 mb-1" />}
                <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">{soundEnabled ? 'On' : 'Muted'}</span>
                <span className="text-[9px] text-zinc-400">Sound</span>
              </button>
            </div>
          </div>

          {/* Info Section in drawer: Universal Toolbox & Catalog */}
          <div className="px-4">
            <div className="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex-wrap">
                <span>Universal Toolbox</span>
                <span aria-hidden="true">·</span>
                <span>{CATEGORIES.length} Categories</span>
                <span aria-hidden="true">·</span>
                <span>{TOOLS.length} Utilities</span>
              </div>
              <h3 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
                Tool Explorer
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Explore our catalog of high-performance utilities. Filter between 100% on-device offline tools and live internet-connected APIs.
              </p>
            </div>
          </div>

          {/* Rewarded Ad-Free Pass Claim Button */}
          <div className="px-4">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setDrawerState(false);
                admobService.showRewardedAd(
                  () => {},
                  { type: '30-Minute Ad-Free Pass', amount: 1 }
                );
              }}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 transition-all cursor-pointer flex items-center justify-between text-xs font-bold shadow-xs active:scale-95"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block leading-tight font-extrabold text-zinc-900 dark:text-zinc-50">Go Ad-Free</span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Watch short video for 30m pass</span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30">
                +30m Pass
              </span>
            </button>
          </div>

          {/* Drawer Tool Directories: All Categories, Online Tools, Offline Tools */}
          <div className="px-4 space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1">
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
                setDrawerState(false);
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left cursor-pointer transition-all duration-200 border ${
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
                setDrawerState(false);
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left cursor-pointer transition-all duration-200 border ${
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
                setDrawerState(false);
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left cursor-pointer transition-all duration-200 border ${
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
        </div>

        {/* Pinned Bottom Exit Application Button — Guaranteed visible at the bottom of the drawer on all tablets & mobile screens without scrolling */}
        <div className="p-3.5 sm:p-4 border-t border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/98 dark:bg-zinc-900/98 backdrop-blur-md shrink-0 z-20 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setDrawerState(false);
              if (onOpenExitDialog) {
                onOpenExitDialog();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/70 text-rose-700 dark:text-rose-300 font-bold text-xs sm:text-sm border border-rose-200 dark:border-rose-900/80 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Exit OmniToolbox session"
          >
            <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Exit OmniToolbox</span>
          </button>
        </div>
      </aside>
    </>
  );
};
