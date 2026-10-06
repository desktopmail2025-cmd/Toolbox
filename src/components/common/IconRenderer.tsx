import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  // Distinct dedicated icon for 2048 Number Tile Game
  if (name === 'Game2048' || name === 'game-2048') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ width: size, height: size }}
        aria-label="2048 Puzzle Icon"
      >
        <rect x="2" y="2" width="20" height="20" rx="4" className="stroke-amber-500 fill-amber-500/10" strokeWidth="1.5" />
        {/* Top-left: tile 2 */}
        <rect x="4" y="4" width="7" height="7" rx="1.5" className="fill-amber-400 stroke-amber-500" strokeWidth="1" />
        <text x="7.5" y="9.5" textAnchor="middle" fontSize="5" fontWeight="900" fill="#78350F">2</text>
        {/* Top-right: tile 4 */}
        <rect x="13" y="4" width="7" height="7" rx="1.5" className="fill-orange-400 stroke-orange-500" strokeWidth="1" />
        <text x="16.5" y="9.5" textAnchor="middle" fontSize="5" fontWeight="900" fill="#7C2D12">4</text>
        {/* Bottom-left: tile 8 */}
        <rect x="4" y="13" width="7" height="7" rx="1.5" className="fill-rose-500 stroke-rose-600" strokeWidth="1" />
        <text x="7.5" y="18.5" textAnchor="middle" fontSize="5" fontWeight="900" fill="#FFFFFF">8</text>
        {/* Bottom-right: tile 2048 banner */}
        <rect x="13" y="13" width="7" height="7" rx="1.5" className="fill-yellow-400 stroke-yellow-500" strokeWidth="1" />
        <text x="16.5" y="18.2" textAnchor="middle" fontSize="3.5" fontWeight="900" fill="#713F12">2K</text>
      </svg>
    );
  }

  // Distinct dedicated icon for Classic Sudoku Solver & Player
  if (name === 'SudokuGrid' || name === 'game-sudoku') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ width: size, height: size }}
        aria-label="Sudoku Grid Icon"
      >
        <rect x="2" y="2" width="20" height="20" rx="3" className="stroke-indigo-600 fill-indigo-500/10" strokeWidth="1.75" />
        {/* 3x3 main division grid lines */}
        <line x1="8.66" y1="2" x2="8.66" y2="22" stroke="currentColor" strokeWidth="1.5" className="stroke-indigo-500" />
        <line x1="15.33" y1="2" x2="15.33" y2="22" stroke="currentColor" strokeWidth="1.5" className="stroke-indigo-500" />
        <line x1="2" y1="8.66" x2="22" y2="8.66" stroke="currentColor" strokeWidth="1.5" className="stroke-indigo-500" />
        <line x1="2" y1="15.33" x2="22" y2="15.33" stroke="currentColor" strokeWidth="1.5" className="stroke-indigo-500" />
        {/* Sudoku numbers in cells */}
        <text x="5.33" y="7" textAnchor="middle" fontSize="4.5" fontWeight="900" fill="currentColor" className="fill-indigo-600 dark:fill-indigo-300">5</text>
        <text x="12" y="7" textAnchor="middle" fontSize="4.5" fontWeight="900" fill="currentColor" className="fill-emerald-600 dark:fill-emerald-300">3</text>
        <text x="18.66" y="13.7" textAnchor="middle" fontSize="4.5" fontWeight="900" fill="currentColor" className="fill-purple-600 dark:fill-purple-300">7</text>
        <text x="5.33" y="20.3" textAnchor="middle" fontSize="4.5" fontWeight="900" fill="currentColor" className="fill-rose-600 dark:fill-rose-300">9</text>
        <text x="12" y="20.3" textAnchor="middle" fontSize="4.5" fontWeight="900" fill="currentColor" className="fill-blue-600 dark:fill-blue-300">1</text>
      </svg>
    );
  }

  // Find matching Lucide icon or fallback to Wrench
  const iconMap = Icons as unknown as Record<string, React.ElementType>;
  const LucideIcon = iconMap[name] || Icons.Wrench;
  return <LucideIcon className={className} size={size} aria-hidden="true" />;
};

