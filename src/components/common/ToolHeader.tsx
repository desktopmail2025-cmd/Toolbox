import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Star, RotateCcw, ChevronDown, Check, Layers, X, Sparkles } from 'lucide-react';
import { ToolItem } from '../../types';
import { CATEGORIES, TOOLS } from '../../data/toolsRegistry';
import { IconRenderer } from './IconRenderer';
import { sounds } from '../../utils/audio';
import { getCategoryTheme, getToolIconTheme } from '../../utils/themeColors';

interface ToolHeaderProps {
  tool: ToolItem;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onReset?: () => void;
  onSelectTool?: (tool: ToolItem) => void;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  tool,
  onBack,
  isFavorite,
  onToggleFavorite,
  onReset,
  onSelectTool,
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const categoryMeta = CATEGORIES.find(c => c.id === tool.categoryId);
  const siblingTools = TOOLS.filter(t => t.categoryId === tool.categoryId);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setIsSwitcherOpen(false);
      }
    };
    if (isSwitcherOpen) {
      window.addEventListener('mousedown', handleOutsideClick);
    }
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isSwitcherOpen]);

  return (
    <div className="mb-6 border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80 relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors shadow-xs cursor-pointer"
            title="Back to category"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-0.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onBack();
                }}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer"
              >
                {categoryMeta?.name || 'Tools'}
              </button>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold truncate max-w-[200px]">{tool.name}</span>

              {/* Quick Category Tool Switcher */}
              {onSelectTool && siblingTools.length > 1 && (
                <div className="relative inline-block" ref={switcherRef}>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setIsSwitcherOpen(prev => !prev);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
                    title="Change tool within this category"
                  >
                    <Layers className="w-3 h-3 text-indigo-500" />
                    <span>Change Tool ({siblingTools.length})</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isSwitcherOpen && (
                    <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-2.5 py-1.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          {categoryMeta?.name} Tools
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsSwitcherOpen(false)}
                          className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        {siblingTools.map(item => {
                          const isCurrent = item.id === tool.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                sounds.playClick();
                                setIsSwitcherOpen(false);
                                if (!isCurrent) {
                                  onSelectTool(item);
                                }
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                                isCurrent
                                  ? 'bg-indigo-50 text-indigo-900 font-bold dark:bg-indigo-950/60 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
                                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                                  <IconRenderer name={item.iconName} size={14} />
                                </span>
                                <span className="truncate">{item.name}</span>
                              </div>
                              {isCurrent && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0 ml-1">
                                  <Check className="w-3.5 h-3.5" /> Active
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5 flex-wrap min-w-0">
              <span className={`p-1.5 rounded-xl ${getToolIconTheme(tool.id, tool.iconName).iconBg} border ${getToolIconTheme(tool.id, tool.iconName).border} inline-flex shadow-2xs shrink-0`}>
                <IconRenderer name={tool.iconName} size={18} />
              </span>
              <span className="break-words min-w-0">{tool.name}</span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl line-clamp-2">
              {tool.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
          {onReset && (
            <button
              onClick={() => {
                sounds.playClick();
                onReset();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 active:scale-95 transition-all shadow-2xs cursor-pointer"
              title="Reset tool & start a new calculation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              onToggleFavorite();
            }}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              isFavorite
                ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-400'
                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`}
            title={isFavorite ? 'Starred' : 'Add to Starred'}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>{isFavorite ? 'Starred' : 'Star Tool'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
