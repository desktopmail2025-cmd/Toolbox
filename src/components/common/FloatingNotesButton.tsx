import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Home, FileText, Star } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface FloatingNotesButtonProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onGoHome?: () => void;
  onBackToOverview?: () => void;
  onClick?: () => void;
  isOpen?: boolean;
  activeToolName?: string;
  favoriteCount?: number;
  onExpandedChange?: (expanded: boolean) => void;
  closeTrigger?: number;
  isDrawerOpen?: boolean;
}

export const FloatingNotesButton: React.FC<FloatingNotesButtonProps> = ({
  activeTab = 'categories',
  onSelectTab,
  onGoHome,
  onBackToOverview,
  favoriteCount = 0,
  onExpandedChange,
  closeTrigger,
  isDrawerOpen = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setExpandedState = (expanded: boolean) => {
    setIsExpanded(expanded);
    onExpandedChange?.(expanded);
  };

  // Close when switching tabs or when drawer opens
  useEffect(() => {
    setExpandedState(false);
  }, [activeTab, isDrawerOpen]);

  // Close when parent triggers close
  useEffect(() => {
    if (closeTrigger) {
      setExpandedState(false);
    }
  }, [closeTrigger]);

  // Auto-collapse when user scrolls to prevent sticking over content
  useEffect(() => {
    if (!isExpanded) return;
    const handleScroll = () => {
      setExpandedState(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExpanded]);

  const handleToggle = () => {
    sounds.playClick();
    setExpandedState(!isExpanded);
  };

  const handleSelectOption = (tab: 'categories' | 'favorites' | 'notes') => {
    sounds.playClick();
    setExpandedState(false);
    if (tab === 'categories') {
      if (onGoHome) {
        onGoHome();
      } else if (onBackToOverview) {
        onBackToOverview();
      } else if (onSelectTab) {
        onSelectTab('categories');
      }
    } else if (onSelectTab) {
      onSelectTab(tab);
    }
  };

  // Equal geometric circle arc with generous spacing like before: Radius R = 108px
  // 1. Notes: 90° (top) -> (0, -108)
  // 2. Starred: 135° (diagonal) -> (-76, -76)
  // 3. Home: 180° (left) -> (-108, 0)
  const menuOptions = [
    {
      id: 'notes' as const,
      label: 'Notes',
      icon: <FileText className="w-5 h-5 text-white" />,
      colorClass: activeTab === 'notes'
        ? 'bg-indigo-600 border-indigo-400 ring-2 ring-indigo-500/40'
        : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-400/60 shadow-indigo-600/30',
      x: 0,
      y: -108,
    },
    {
      id: 'favorites' as const,
      label: 'Starred',
      badge: favoriteCount > 0 ? favoriteCount : undefined,
      icon: <Star className="w-5 h-5 fill-amber-200/50 text-white" />,
      colorClass: activeTab === 'favorites'
        ? 'bg-amber-500 border-amber-300 ring-2 ring-amber-500/40'
        : 'bg-amber-500 hover:bg-amber-600 border-amber-400/60 shadow-amber-500/30',
      x: -76,
      y: -76,
    },
    {
      id: 'categories' as const,
      label: 'Home',
      icon: <Home className="w-5 h-5 text-white" />,
      colorClass: activeTab === 'categories'
        ? 'bg-emerald-600 border-emerald-400 ring-2 ring-emerald-500/40'
        : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500/60 shadow-emerald-600/30',
      x: -108,
      y: 0,
    },
  ];

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  // Hide completely when drawer is open
  if (isDrawerOpen) {
    return null;
  }

  const content = (
    <>
      {/* Outside click backdrop when speed dial is open */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/25 dark:bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 animate-in fade-in"
          onClick={() => setExpandedState(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Add (+) FAB Button Container */}
      <div
        className="floating-notes-btn fixed z-50 bottom-5 right-5 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 w-14 h-14 select-none pointer-events-auto"
        style={{
          marginBottom: 'env(safe-area-inset-bottom, 0px)',
          marginRight: 'env(safe-area-inset-right, 0px)',
        }}
      >
        {/* Circle Menu Options fanning out cleanly */}
        {menuOptions.map(option => (
          <div
            key={option.id}
            style={{
              left: 'calc(50% - 22px)',
              top: 'calc(50% - 22px)',
              transform: isExpanded
                ? `translate3d(${option.x}px, ${option.y}px, 0) scale(1)`
                : 'translate3d(0, 0, 0) scale(0.3)',
              opacity: isExpanded ? 1 : 0,
              pointerEvents: isExpanded ? 'auto' : 'none',
              transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease',
            }}
            className="absolute w-11 h-11 flex items-center justify-center will-change-transform z-10"
          >
            {/* Speed Dial Action Button */}
            <button
              type="button"
              onClick={() => handleSelectOption(option.id)}
              aria-label={option.label}
              className={`relative w-11 h-11 rounded-full flex items-center justify-center text-white shadow-xl active:scale-90 hover:scale-110 transition-transform duration-150 cursor-pointer border ${option.colorClass}`}
              title={option.label}
            >
              {option.icon}
              {option.badge !== undefined && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-zinc-950 text-[9px] font-mono font-black shadow-xs">
                  {option.badge}
                </span>
              )}
            </button>
          </div>
        ))}

        {/* Primary Add (+) FAB Button */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isExpanded ? 'Close quick menu' : 'Quick access options (Home, Starred, Notes)'}
          aria-expanded={isExpanded}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl active:scale-95 transition-all duration-250 ease-out cursor-pointer border relative z-20 ${
            isExpanded
              ? 'bg-zinc-900 border-zinc-700 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-300 rotate-45 scale-105 shadow-zinc-900/40'
              : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-400/50 hover:scale-105 rotate-0 shadow-indigo-600/35'
          }`}
          title={isExpanded ? 'Close' : 'Quick Access (Home, Starred, Notes)'}
        >
          <Plus className="w-6 h-6 transition-transform duration-250 cubic-bezier(0.34, 1.56, 0.64, 1)" />
        </button>
      </div>
    </>
  );

  return createPortal(content, document.body);
};
