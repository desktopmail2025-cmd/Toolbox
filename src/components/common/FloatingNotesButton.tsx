import React from 'react';
import { PenLine, ArrowLeft } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface FloatingNotesButtonProps {
  onClick: () => void;
  isOpen: boolean;
  activeToolName?: string;
}

export const FloatingNotesButton: React.FC<FloatingNotesButtonProps> = ({
  onClick,
  isOpen,
  activeToolName,
}) => {
  return (
    <button
      onClick={() => {
        sounds.playClick();
        onClick();
      }}
      aria-label={isOpen ? (activeToolName ? `Return to ${activeToolName}` : 'Close Notes') : 'Open Quick Notes'}
      className="fixed z-40 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-8 right-[max(1rem,env(safe-area-inset-right,0px))] md:right-8 flex items-center gap-2 px-3.5 sm:px-4 py-3 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-xs shadow-xl shadow-zinc-950/20 hover:scale-105 active:scale-95 transition-all duration-200 border border-zinc-700/50 dark:border-zinc-300/50 group cursor-pointer"
      title={isOpen ? (activeToolName ? `Return to ${activeToolName}` : 'Close Notes') : 'Quick Notes & Scratchpad'}
    >
      {isOpen ? (
        <>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="font-medium tracking-tight">
            {activeToolName ? `Back to ${activeToolName}` : 'Back to Tools'}
          </span>
        </>
      ) : (
        <>
          <PenLine className="w-4 h-4 transition-transform group-hover:-rotate-12" />
          <span className="hidden sm:inline font-medium tracking-tight">Quick Notes</span>
        </>
      )}
    </button>
  );
};
