import React, { useState, useEffect } from 'react';
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
}

export const FloatingNotesButton: React.FC<FloatingNotesButtonProps> = ({
  activeTab = 'categories',
  onSelectTab,
  onGoHome,
  onBackToOverview,
  favoriteCount = 0,
  onExpandedChange,
  closeTrigger,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const setExpandedState = (expanded: boolean) => {
    setIsExpanded(expanded);
    onExpandedChange?.(expanded);
  };

  // Close when switching tabs
  useEffect(() => {
    setExpandedState(false);
  }, [activeTab]);

  // Close when parent triggers close
  useEffect(() => {
    if (closeTrigger) {
      setExpandedState(false);
    }
  }, [closeTrigger]);

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

  // Equal geometric circle arc with generous spacing: Radius R = 108px
  // 1. Notes: 90° (top) -> (0, -108), label placed centered above button
  // 2. Starred: 135° (diagonal) -> (-76, -76), label placed to the left of button
  // 3. Home: 180° (left) -> (-108, 0), label placed to the left of button
  // Chord distance between adjacent buttons is exactly 82.5px!
  // Labels are positioned radially to prevent any collision between icons and texts.
  const menuOptions = [
    {
      id: 'notes' as const,
      label: 'Notes',
      icon: <FileText className="w-5 h-5 text-white" />,
      colorClass: activeTab === 'notes'
        ? 'bg-indigo-600 border-indigo-400 ring-2 ring-indigo-500/30'
        : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-500/60 shadow-indigo-600/30',
      x: 0,
      y: -108,
      delay: '0.02s',
      labelPositionClass: 'bottom-full mb-2.5 left-1/2 -translate-x-1/2',
    },
    {
      id: 'favorites' as const,
      label: 'Starred',
      badge: favoriteCount > 0 ? favoriteCount : undefined,
      icon: <Star className="w-5 h-5 fill-amber-200/50 text-white" />,
      colorClass: activeTab === 'favorites'
        ? 'bg-amber-500 border-amber-300 ring-2 ring-amber-500/30'
        : 'bg-amber-500 hover:bg-amber-600 border-amber-400/60 shadow-amber-500/30',
      x: -76,
      y: -76,
      delay: '0.01s',
      labelPositionClass: 'right-full mr-3 top-1/2 -translate-y-1/2',
    },
    {
      id: 'categories' as const,
      label: 'Home',
      icon: <Home className="w-5 h-5 text-white" />,
      colorClass: activeTab === 'categories'
        ? 'bg-emerald-600 border-emerald-400 ring-2 ring-emerald-500/30'
        : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500/60 shadow-emerald-600/30',
      x: -108,
      y: 0,
      delay: '0s',
      labelPositionClass: 'right-full mr-3 top-1/2 -translate-y-1/2',
    },
  ];

  return (
    <>
      {/* Outside click backdrop when speed dial is open */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-30 bg-black/20 dark:bg-black/45 backdrop-blur-[1px] transition-opacity duration-150 animate-in fade-in"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}

      <div className="floating-notes-btn fixed z-40 bottom-[max(1.25rem,calc(1.25rem+env(safe-area-inset-bottom,0px)))] right-[max(1.25rem,env(safe-area-inset-right,0px))] md:bottom-8 md:right-8 w-14 h-14">
        {/* Circle Menu Options fanning out in equal geometric arc */}
        {menuOptions.map(option => (
          <div
            key={option.id}
            style={{
              left: 'calc(50% - 22px)',
              top: 'calc(50% - 22px)',
              transform: isExpanded
                ? `translate3d(${option.x}px, ${option.y}px, 0) scale(1)`
                : 'translate3d(0, 0, 0) scale(0)',
              opacity: isExpanded ? 1 : 0,
              pointerEvents: isExpanded ? 'auto' : 'none',
              transition: `transform 0.16s cubic-bezier(0.16, 1, 0.3, 1) ${option.delay}, opacity 0.12s ease ${option.delay}`,
            }}
            className="absolute w-11 h-11 flex items-center justify-center"
          >
            {/* Action Button (Icon Only) */}
            <button
              type="button"
              onClick={() => handleSelectOption(option.id)}
              aria-label={option.label}
              className={`relative w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 hover:scale-105 transition-all duration-100 cursor-pointer border ${option.colorClass}`}
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
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-zinc-950/25 active:scale-95 transition-all duration-150 cursor-pointer border relative ${
            isExpanded
              ? 'bg-zinc-900 border-zinc-700 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-300 rotate-45 scale-105'
              : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 hover:scale-105 rotate-0'
          }`}
          title={isExpanded ? 'Close' : 'Quick Access (Home, Starred, Notes)'}
        >
          <Plus className="w-6 h-6 transition-transform duration-150 ease-out" />
        </button>
      </div>
    </>
  );
};
