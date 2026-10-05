import React, { useRef, useEffect } from 'react';
import { LayoutGrid, Star, FileText } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  favoriteCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  favoriteCount,
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

    // Set baseline screen height when no input is focused
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

      // If no input is focused and current height is larger than baseline, update baseline
      if (!isInputFocused() && currentHeight >= (baselineHeightRef.current || 0)) {
        baselineHeightRef.current = currentHeight;
        navRef.current.style.transform = 'translateY(0px)';
        return;
      }

      const baseline = baselineHeightRef.current || currentHeight;
      const delta = Math.max(0, baseline - currentHeight);

      // If the viewport shrunk because of the virtual keyboard, counteract it by delta
      // so the bottom nav bar remains firmly fixed at the physical bottom of the screen
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

  return (
    <nav
      ref={navRef}
      className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-zinc-200/90 bg-white/95 backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-950/95 shadow-lg safe-area-bottom will-change-transform"
      style={{
        transform: 'translateY(0px)',
        transition: 'transform 0.05s ease-out',
      }}
    >
      <div className="grid grid-cols-3 h-16 items-center px-4">
        {/* Tab 1: Tools */}
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('categories');
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all touch-feedback cursor-pointer ${
            activeTab === 'categories'
              ? 'text-zinc-950 dark:text-white font-semibold scale-105'
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">All Tools</span>
          {activeTab === 'categories' && (
            <span className="w-1.5 h-1 rounded-full bg-zinc-900 dark:bg-zinc-100 mt-0.5" />
          )}
        </button>

        {/* Tab 2: Starred */}
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('favorites');
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all touch-feedback cursor-pointer ${
            activeTab === 'favorites'
              ? 'text-zinc-950 dark:text-white font-semibold scale-105'
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Star
            className={`w-5 h-5 ${
              favoriteCount > 0 ? 'fill-amber-400/40 text-amber-500' : ''
            }`}
          />
          <span className="text-[10px] tracking-tight mt-1">Starred</span>
          {activeTab === 'favorites' && (
            <span className="w-1.5 h-1 rounded-full bg-zinc-900 dark:bg-zinc-100 mt-0.5" />
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
              ? 'text-zinc-950 dark:text-white font-semibold scale-105'
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Notes</span>
          {activeTab === 'notes' && (
            <span className="w-1.5 h-1 rounded-full bg-zinc-900 dark:bg-zinc-100 mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
