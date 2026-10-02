import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { SearchModal } from './components/common/SearchModal';
import { FloatingNotesButton } from './components/common/FloatingNotesButton';
import { SplashScreen } from './components/common/SplashScreen';
import { OnboardingModal } from './components/common/OnboardingModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { CategoryExplorer } from './components/views/CategoryExplorer';
import { FavoritesView } from './components/views/FavoritesView';
import { NotesView } from './components/views/NotesView';
import { ToolDispatcher } from './components/tools/ToolDispatcher';
import { GameZone } from './components/tools/GameZone';
import { CategoryId, ToolItem } from './types';
import { TOOLS, CATEGORIES } from './data/toolsRegistry';
import { getStoredFavorites, saveStoredFavorites, getStoredRecents, addStoredRecent } from './utils/storage';
import { sounds } from './utils/audio';

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('categories');
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites);
  const [recents, setRecents] = useState<string[]>(getStoredRecents);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);
  const [savedScrollPos, setSavedScrollPos] = useState<number>(0);

  // Splash Screen & Professional Onboarding
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

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

  // Persistent category accordion states
  const [expandedCatIds, setExpandedCatIds] = useState<Set<CategoryId>>(() => {
    try {
      const saved = localStorage.getItem('omni_expanded_cats');
      if (saved) return new Set<CategoryId>(JSON.parse(saved));
    } catch {
      // ignore
    }
    return new Set<CategoryId>(['general', 'health']);
  });

  useEffect(() => {
    try {
      localStorage.setItem('omni_expanded_cats', JSON.stringify(Array.from(expandedCatIds)));
    } catch {
      // ignore
    }
  }, [expandedCatIds]);

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
        setActiveTab('notes');
        setActiveTool(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTool = (tool: ToolItem) => {
    // Preserve current scroll position
    setSavedScrollPos(window.scrollY);
    // Keep category expanded so when coming back it is STILL expanded
    setExpandedCatIds(prev => {
      const next = new Set(prev);
      next.add(tool.categoryId);
      return next;
    });
    setActiveTool(tool);
    addStoredRecent(tool.id);
    setRecents(getStoredRecents());
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToOverview = () => {
    setActiveTool(null);
    // Restore the scroll position so it stays exactly where it was
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedScrollPos, behavior: 'instant' });
    });
  };

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

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setActiveTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {activeTool ? (
          <ToolDispatcher
            tool={activeTool}
            onBack={handleBackToOverview}
            isFavorite={favorites.includes(activeTool.id)}
            onToggleFavorite={() => handleToggleFavorite(activeTool.id)}
          />
        ) : activeTab === 'favorites' ? (
          <FavoritesView
            favorites={favorites}
            onSelectTool={handleSelectTool}
            onToggleFavorite={handleToggleFavorite}
            onBrowseAll={() => handleSelectTab('categories')}
          />
        ) : activeTab === 'notes' ? (
          <NotesView />
        ) : activeTab === 'games' ? (
          <div className="space-y-6 max-w-4xl mx-auto pb-24">
            <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {TOOLS.filter(t => t.categoryId === 'games').map(tool => (
                <div
                  key={tool.id}
                  onClick={() => {
                    sounds.playClick();
                    handleSelectTool(tool);
                  }}
                  className="p-5 rounded-2xl border border-zinc-200/90 bg-white hover:border-zinc-400 hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-800/90 dark:bg-zinc-900 dark:hover:border-zinc-600 cursor-pointer active:scale-[0.98] transition-all duration-200 shadow-xs"
                >
                  <h3 className="font-semibold text-sm mb-1 text-zinc-900 dark:text-zinc-100">{tool.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{tool.description}</p>
                </div>
              ))}
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
          />
        )}
      </main>

      {/* Floating Action Button (FAB) to take notes directly */}
      <FloatingNotesButton
        onClick={() => {
          setActiveTab('notes');
          setActiveTool(null);
        }}
        isOpen={activeTab === 'notes'}
      />

      {/* Mobile Bottom Navigation (Tools, Starred, Notes, Games) */}
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
    </div>
  );
}
