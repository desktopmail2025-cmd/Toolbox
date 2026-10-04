import React, { useState, useEffect } from 'react';
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
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    // Detect input/textarea focus which opens virtual keyboard on mobile
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    // Also monitor visualViewport height changes
    const handleViewportResize = () => {
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height;
        if (heightDiff > 140) {
          setIsKeyboardOpen(true);
        } else {
          // If no active input is focused, reset
          const active = document.activeElement;
          if (!active || (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA' && !active.getAttribute('contenteditable'))) {
            setIsKeyboardOpen(false);
          }
        }
      }
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
    }

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
      }
    };
  }, []);

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-zinc-200/90 bg-white/95 backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-950/95 shadow-lg safe-area-bottom transition-all duration-200 ${
        isKeyboardOpen ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
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
