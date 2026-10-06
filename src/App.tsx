import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { SearchModal } from './components/common/SearchModal';
import { FloatingNotesButton } from './components/common/FloatingNotesButton';
import { SplashScreen } from './components/common/SplashScreen';
import { OnboardingModal } from './components/common/OnboardingModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ExitConfirmModal } from './components/common/ExitConfirmModal';
import { CategoryExplorer } from './components/views/CategoryExplorer';
import { FavoritesView } from './components/views/FavoritesView';
import { NotesView } from './components/views/NotesView';
import { ToolDispatcher } from './components/tools/ToolDispatcher';
import { GameZone } from './components/tools/GameZone';
import { CategoryId, ToolItem } from './types';
import { TOOLS, CATEGORIES } from './data/toolsRegistry';
import { getStoredFavorites, saveStoredFavorites, getStoredRecents, addStoredRecent } from './utils/storage';
import { sounds } from './utils/audio';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [toolSessionId, setToolSessionId] = useState<number>(() => Date.now());
  const [lastOpenedToolId, setLastOpenedToolId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('omni_last_tool') || null;
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState<string>('categories');
  const [toolReturnTab, setToolReturnTab] = useState<string>('categories');
  const [starredSelectedToolId, setStarredSelectedToolId] = useState<string | null>(null);
  const [toolFilter, setToolFilter] = useState<'all' | 'offline' | 'online'>('all');
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites);
  const [recents, setRecents] = useState<string[]>(getStoredRecents);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);
  const [savedScrollPos, setSavedScrollPos] = useState<number>(0);

  // Splash Screen & Professional Onboarding
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showExitDialog, setShowExitDialog] = useState<boolean>(false);

  const handleFinishSplash = () => {
    setShowSplash(false);
    try {
      const onboarded = localStorage.getItem('omni_onboarded');
      if (!onboarded) {
        setShowOnboarding(true);
      }
    } catch {
      // ignore
    }
  };

  // In the beginning of the app keep all categories collapsed; expand when user clicks
  const [expandedCatIds, setExpandedCatIds] = useState<Set<CategoryId>>(() => {
    return new Set<CategoryId>();
  });

  const handleToggleCategory = (catId: CategoryId) => {
    sounds.playClick();
    setExpandedCatIds(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    sounds.playClick();
    setExpandedCatIds(new Set(CATEGORIES.map(c => c.id)));
  };

  const handleCollapseAll = () => {
    sounds.playClick();
    setExpandedCatIds(new Set());
  };

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('omni_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html document immediately
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('omni_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('omni_theme', 'light');
    }
  }, [darkMode]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K for search, Cmd+J for notes)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        sounds.playClick();
        if (activeTab === 'notes') {
          setActiveTab('categories');
        } else {
          setActiveTab('notes');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Universal input field hint vanish on focus & restore on blur / click outside / back:
  // Shows default value in the field as a hint; vanishes as soon as user clicks to input;
  // restores default hint if user clears or leaves it empty and blurs/presses back.
  useEffect(() => {
    // Install prototype interceptors once so React re-renders don't prematurely re-inject '0' / default while user is actively focused to type
    if (typeof window !== 'undefined' && !(window as unknown as { __omniHintEngineInit?: boolean }).__omniHintEngineInit) {
      (window as unknown as { __omniHintEngineInit?: boolean }).__omniHintEngineInit = true;

      const inputProto = window.HTMLInputElement?.prototype;
      const originalInputSetter = inputProto ? Object.getOwnPropertyDescriptor(inputProto, 'value')?.set : null;
      if (inputProto && originalInputSetter) {
        Object.defineProperty(inputProto, 'value', {
          set(val) {
            // If input is actively focused and marked as hint-vanished, suppress re-populating default/zero during render
            if (
              this.dataset?.hintVanished === 'true' &&
              document.activeElement === this &&
              (String(val) === this.dataset.defaultVal || String(val) === '0' || String(val) === '')
            ) {
              return originalInputSetter.call(this, '');
            }
            return originalInputSetter.call(this, val);
          },
          configurable: true,
        });
      }

      const textareaProto = window.HTMLTextAreaElement?.prototype;
      const originalTextareaSetter = textareaProto ? Object.getOwnPropertyDescriptor(textareaProto, 'value')?.set : null;
      if (textareaProto && originalTextareaSetter) {
        Object.defineProperty(textareaProto, 'value', {
          set(val) {
            if (
              this.dataset?.hintVanished === 'true' &&
              document.activeElement === this &&
              (String(val) === this.dataset.defaultVal || String(val) === '')
            ) {
              return originalTextareaSetter.call(this, '');
            }
            return originalTextareaSetter.call(this, val);
          },
          configurable: true,
        });
      }
    }

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement | null;
      if (!target) return;
      const tag = target.tagName.toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') return;

      const type = (target.getAttribute('type') || 'text').toLowerCase();
      if (['password', 'checkbox', 'radio', 'file', 'button', 'submit', 'range', 'color', 'hidden', 'search'].includes(type)) return;
      if (target.dataset.noAutoClear === 'true') return;
      if (target.closest('[role="search"]') || target.closest('.search-container')) return;

      // Remember initial default hint value
      if (target.dataset.defaultVal === undefined) {
        target.dataset.defaultVal = target.value || target.placeholder || '';
      }

      const defaultVal = target.dataset.defaultVal;
      // When user clicks in the tool to give input:
      // If the field shows the initial default hint (or user hasn't typed yet, or value matches default/0/placeholder), vanish the hint immediately!
      const isDefaultHint = !target.dataset.userHasTyped ||
        target.dataset.userHasTyped === 'false' ||
        target.value === defaultVal ||
        target.value === '0' ||
        target.value === target.placeholder;

      if (defaultVal && isDefaultHint) {
        target.dataset.hintVanished = 'true';
        target.dataset.userHasTyped = 'false';
        const prototype = target instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
        if (nativeSetter) {
          nativeSetter.call(target, '');
          target.dispatchEvent(new Event('input', { bubbles: true }));
          target.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          target.value = '';
        }
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement | null;
      if (!target) return;
      // As soon as the user enters actual input, cancel hint-vanished state and mark edited
      target.dataset.hintVanished = 'false';
      target.dataset.userHasTyped = 'true';
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement | null;
      if (!target) return;
      const tag = target.tagName.toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') return;

      target.dataset.hintVanished = 'false';
      const defaultVal = target.dataset.defaultVal;
      if (!defaultVal) return;

      // If user left it empty or only whitespace, or didn't type anything, restore the default hint value!
      if (target.value.trim() === '' || target.dataset.userHasTyped !== 'true') {
        target.dataset.userHasTyped = 'false';
        const prototype = target instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
        if (nativeSetter) {
          nativeSetter.call(target, defaultVal);
          target.dispatchEvent(new Event('input', { bubbles: true }));
          target.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          target.value = defaultVal;
        }
      }
    };

    const handleInputKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement | null;
      if (!target) return;
      // If user presses Escape while in field, restore default hint value and blur
      if (e.key === 'Escape' && target.dataset.defaultVal) {
        const defaultVal = target.dataset.defaultVal;
        const prototype = target instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
        if (nativeSetter) {
          nativeSetter.call(target, defaultVal);
          target.dispatchEvent(new Event('input', { bubbles: true }));
          target.dispatchEvent(new Event('change', { bubbles: true }));
        }
        target.blur();
      }
    };

    window.addEventListener('focusin', handleFocusIn, true);
    window.addEventListener('input', handleInput, true);
    window.addEventListener('focusout', handleFocusOut, true);
    window.addEventListener('keydown', handleInputKeyDown, true);

    return () => {
      window.removeEventListener('focusin', handleFocusIn, true);
      window.removeEventListener('input', handleInput, true);
      window.removeEventListener('focusout', handleFocusOut, true);
      window.removeEventListener('keydown', handleInputKeyDown, true);
    };
  }, []);

  // If user selected something and touched anywhere of the app, the selection vanishes immediately
  useEffect(() => {
    const handleGlobalDeselect = (e: MouseEvent | TouchEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      selection.removeAllRanges();
    };

    window.addEventListener('pointerdown', handleGlobalDeselect, { passive: true });
    window.addEventListener('touchstart', handleGlobalDeselect, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleGlobalDeselect);
      window.removeEventListener('touchstart', handleGlobalDeselect);
    };
  }, []);

  // Slide-to-exit gesture:
  // When user deliberately swipes inward from the far edge (standard mobile back/exit gesture), trigger exit alert box
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isIgnoredTarget = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement | null;
      // Do not trigger exit gesture when touching inputs, search bar, buttons, or scrollables
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('input') ||
          target.closest('button') ||
          target.closest('header') ||
          target.closest('aside') ||
          target.closest('[data-search-container]') ||
          (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen)
      ) {
        isIgnoredTarget = true;
        return;
      }

      isIgnoredTarget = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isIgnoredTarget || !e.changedTouches || e.changedTouches.length === 0) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Deliberate inward swipe from the very edge of the viewport
      const isRightEdgeSwipe =
        startX >= window.innerWidth - 35 && deltaX < -65 && Math.abs(deltaY) < 40;

      if (isRightEdgeSwipe) {
        sounds.playClick();
        setShowExitDialog(true);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleSelectTool = (tool: ToolItem) => {
    // Preserve current scroll position
    setSavedScrollPos(window.scrollY);

    // Remember the tab the tool was opened from (e.g. 'favorites' if opened from Starred screen)
    const sourceTab = activeTab;
    setToolReturnTab(sourceTab);

    // Categories remain in collapsed form always unless user explicitly clicks expand/collapse

    setLastOpenedToolId(tool.id);
    try {
      localStorage.setItem('omni_last_tool', tool.id);
    } catch {
      // ignore
    }
    setActiveTool(tool);
    addStoredRecent(tool.id);
    setRecents(getStoredRecents());
    try {
      window.history.pushState({ toolId: tool.id, returnTab: sourceTab }, '', `?tool=${tool.id}`);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToOverview = () => {
    const closedToolId = activeTool?.id || lastOpenedToolId;
    setActiveTool(null);
    if (closedToolId) {
      setLastOpenedToolId(closedToolId);
      const closedTool = TOOLS.find(t => t.id === closedToolId);
      if (closedTool) {
        setExpandedCatIds(prev => new Set([...prev, closedTool.categoryId]));
      }
    }
    const targetTab = toolReturnTab || 'categories';
    setActiveTab(targetTab);
    if (targetTab === 'favorites') {
      setStarredSelectedToolId(closedToolId || null);
    } else {
      setStarredSelectedToolId(null);
    }
    try {
      window.history.pushState({ tab: targetTab }, '', targetTab === 'categories' ? '/' : `?tab=${targetTab}`);
    } catch {
      // ignore
    }
    // If returning to categories, restore saved scroll position; if returning to Starred, scroll to top
    if (targetTab === 'categories') {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollPos, behavior: 'instant' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Browser back button / gesture handler: first return to tool left off, then on another press to home
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // If search in navbar was open when back was pressed, it was closed - don't navigate away
      if ((window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen || e.state?.omniSearchOpen) {
        (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen = false;
        return;
      }

      // If full search modal was open, close it
      if (isSearchOpen) {
        setIsSearchOpen(false);
        return;
      }

      const state = e.state;
      if (state?.toolId) {
        const found = TOOLS.find(t => t.id === state.toolId);
        if (found) {
          setActiveTool(found);
          if (state.returnTab) {
            setToolReturnTab(state.returnTab);
          }
          return;
        }
      }

      // If returning from tool, navigate back to the tab it was opened from (e.g. Starred)
      if (activeTool) {
        handleBackToOverview();
        return;
      }

      if (state?.tab) {
        setStarredSelectedToolId(null);
        if (state.tab === 'categories') {
          setActiveTool(null);
          setActiveTab('categories');
          setToolReturnTab('categories');
        } else {
          setActiveTool(null);
          setActiveTab(state.tab);
          setToolReturnTab(state.tab);
        }
        return;
      }
      // If user came from a tool to notes/starred, back takes them to tool
      if (activeTab !== 'categories' && activeTool) {
        setActiveTab('categories');
        return;
      }
      // If user was on notes/starred/games, back takes them to home
      if (activeTab !== 'categories') {
        handleGoHome();
        return;
      }

      // Root level exit prompt
      if (!activeTool && activeTab === 'categories') {
        setShowExitDialog(true);
        try {
          window.history.pushState({ root: true }, '', '/');
        } catch {
          // ignore
        }
        return;
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTool, activeTab, savedScrollPos, isSearchOpen, toolReturnTab]);

  const handleToggleFavorite = (toolId: string) => {
    const updated = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
    setFavorites(updated);
    saveStoredFavorites(updated);
  };

  const handleToggleSound = () => {
    const newState = sounds.toggle();
    setSoundEnabled(newState);
  };

  const handleToggleDarkMode = () => {
    sounds.playClick();
    setDarkMode(prev => !prev);
  };

  const handleGoHome = () => {
    sounds.playClick();
    setActiveTool(null);
    setStarredSelectedToolId(null);
    setActiveTab('categories');
    setToolReturnTab('categories');
    try {
      window.history.pushState({ tab: 'categories' }, '', '/');
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectTab = (tab: string) => {
    sounds.playClick();
    setStarredSelectedToolId(null);
    if (tab === 'categories') {
      handleGoHome();
      return;
    }
    setActiveTool(null);
    setActiveTab(tab);
    setToolReturnTab(tab);
    try {
      window.history.pushState({ tab }, '', `?tab=${tab}`);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFloatingNotes = () => {
    sounds.playClick();
    setStarredSelectedToolId(null);
    if (activeTab === 'notes') {
      handleGoHome();
    } else {
      handleSelectTab('notes');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar with Expandable Search */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onClearSearch={() => setIsSearchOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onSelectTool={handleSelectTool}
        onOpenOnboarding={() => setShowOnboarding(true)}
        toolFilter={toolFilter}
        onSelectToolFilter={setToolFilter}
        onOpenExitDialog={() => setShowExitDialog(true)}
      />

      {/* Main Content Area — fully responsive across mobile phones, tablets, laptops & PCs */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-12">
        {activeTool ? (
          <ToolDispatcher
            tool={activeTool}
            onBack={handleBackToOverview}
            isFavorite={favorites.includes(activeTool.id)}
            onToggleFavorite={() => handleToggleFavorite(activeTool.id)}
            onSelectTool={handleSelectTool}
          />
        ) : activeTab === 'notes' ? (
          <div className="space-y-4">
            <NotesView onBackToHome={handleGoHome} />
          </div>
        ) : activeTab === 'favorites' ? (
          <div className="space-y-4">
            <FavoritesView
              favorites={favorites}
              onSelectTool={handleSelectTool}
              onToggleFavorite={handleToggleFavorite}
              onBrowseAll={handleGoHome}
              selectedToolId={starredSelectedToolId}
            />
          </div>
        ) : activeTab === 'games' ? (
          <div className="space-y-6 max-w-4xl mx-auto pb-24">
            <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800 flex items-start gap-3">
              <button
                type="button"
                onClick={handleGoHome}
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors shadow-xs cursor-pointer"
                title="Back to Home"
                aria-label="Back to Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  <span>Offline Arcade</span>
                  <span aria-hidden="true">·</span>
                  <span>Brain & Reflex Challenges</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Lightweight Game Zone
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Zero lag, 100% offline mini-games: 2048, Tic-Tac-Toe AI, Minesweeper, Memory Match, reaction time reflex tests & mental math.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {TOOLS.filter(t => t.categoryId === 'games').map(tool => {
                const isSelected = tool.id === lastOpenedToolId;
                return (
                  <div
                    key={tool.id}
                    onClick={() => {
                      sounds.playClick();
                      handleSelectTool(tool);
                    }}
                    className={`p-5 rounded-2xl border transition-all duration-200 shadow-xs cursor-pointer active:scale-[0.98] ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500 shadow-xl bg-indigo-50/40 dark:bg-indigo-950/40'
                        : 'border-zinc-200/90 bg-white hover:border-zinc-400 hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-800/90 dark:bg-zinc-900 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{tool.name}</h3>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white shadow-xs animate-pulse">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{tool.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <CategoryExplorer
            onSelectTool={handleSelectTool}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            recents={recents}
            expandedCatIds={expandedCatIds}
            onToggleCategory={handleToggleCategory}
            onExpandAll={handleExpandAll}
            onCollapseAll={handleCollapseAll}
            toolFilter={toolFilter}
            onSelectToolFilter={setToolFilter}
            selectedToolId={lastOpenedToolId}
          />
        )}
      </main>

      {/* Floating Action Button (FAB): Circular Speed Dial for Home, Starred & Notes */}
      <FloatingNotesButton
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onGoHome={handleGoHome}
        onBackToOverview={handleBackToOverview}
        favoriteCount={favorites.length}
        activeToolName={activeTool?.name}
      />

      {/* Mobile Bottom Navigation (Tools, Starred, Notes) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        favoriteCount={favorites.length}
      />

      {/* Keyboard Quick Search Modal (preserved via ⌘K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* High-Performance Splash Screen on Launch */}
      {showSplash && <SplashScreen onFinish={handleFinishSplash} />}

      {/* Professional Multi-Device Onboarding Tour */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Network Connectivity & Offline Indicator */}
      <OfflineIndicator />

      {/* Exit App Confirmation Dialogue */}
      <ExitConfirmModal
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
      />
    </div>
  );
}
