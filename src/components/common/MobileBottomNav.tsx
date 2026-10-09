import React, { useRef, useEffect } from 'react';
import { LayoutGrid, Star, FileText, Gamepad2 } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  favoriteCount: number;
  hasActiveTool?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  favoriteCount,
  hasActiveTool = false,
}) => {
  const navRef = useRef<HTMLElement>(null);
  const baselineHeightRef = useRef<number>(0);

  useEffect(() => {
    const isInputFocused = () => {
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select' || (el as HTMLElement).isContentEditable;
    };

    const getViewportHeight = () => {
      return window.visualViewport ? window.visualViewport.height : window.innerHeight;
    };

    const updateBaseline = () => {
      if (!isInputFocused()) {
        baselineHeightRef.current = Math.max(
          getViewportHeight(),
          window.innerHeight,
          window.screen?.height || 0
        );
      }
    };

    updateBaseline();

    const handleAdjust = () => {
      if (!navRef.current) return;
      const currentHeight = getViewportHeight();

      if (!isInputFocused() && currentHeight >= (baselineHeightRef.current || 0)) {
        baselineHeightRef.current = currentHeight;
        navRef.current.style.transform = 'translateY(0px)';
        return;
      }

      const baseline = baselineHeightRef.current || currentHeight;
      const delta = Math.max(0, baseline - currentHeight);

      if (delta > 60) {
        navRef.current.style.transform = `translateY(${delta}px)`;
      } else {
        navRef.current.style.transform = 'translateY(0px)';
      }
    };

    window.addEventListener('resize', handleAdjust, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        updateBaseline();
        handleAdjust();
      }, 150);
    });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleAdjust, { passive: true });
      window.visualViewport.addEventListener('scroll', handleAdjust, { passive: true });
    }

    window.addEventListener('focusin', handleAdjust, { passive: true });
    window.addEventListener('focusout', () => {
      setTimeout(handleAdjust, 100);
      setTimeout(handleAdjust, 250);
    }, { passive: true });

    return () => {
      window.removeEventListener('resize', handleAdjust);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleAdjust);
        window.visualViewport.removeEventListener('scroll', handleAdjust);
      }
    };
  }, []);

  // When a tool is open, hide the bottom navigation so the tool has 100% full screen
  if (hasActiveTool) {
    return null;
  }

  return (
    <nav
      ref={navRef}
      className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-zinc-200/90 bg-white/95 backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-950/95 shadow-lg safe-area-bottom will-change-transform select-none"
      style={{
        transform: 'translateY(0px)',
        transition: 'transform 0.05s ease-out',
      }}
    >
      <div className="grid grid-cols-4 h-15 items-center px-2">
        {/* Tab 1: Tools */}
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('categories');
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all touch-feedback cursor-pointer ${
            activeTab === 'categories'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">All Tools</span>
          {activeTab === 'categories' && (
            <span className="w-1.5 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />
          )}
        </button>

        {/* Tab 2: Starred */}
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('favorites');
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all touch-feedback cursor-pointer relative ${
            activeTab === 'favorites'
              ? 'text-amber-500 font-bold scale-105'
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <Star
              className={`w-5 h-5 ${
                favoriteCount > 0 ? 'fill-amber-400/40 text-amber-500' : ''
              }`}
            />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-amber-500 text-zinc-950 text-[8px] font-bold font-mono">
                {favoriteCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Starred</span>
          {activeTab === 'favorites' && (
            <span className="w-1.5 h-1 rounded-full bg-amber-500 mt-0.5" />
          )}
        </button>

        {/* Tab 3: Notes */}
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('notes');
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all touch-feedback cursor-pointer ${
            activeTab === 'notes'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Notes</span>
          {activeTab === 'notes' && (
            <span className="w-1.5 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />
          )}
        </button>

        {/* Tab 4: Games */}
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('games');
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all touch-feedback cursor-pointer ${
            activeTab === 'games'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Games</span>
          {activeTab === 'games' && (
            <span className="w-1.5 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
