export interface CategoryTheme {
  bg: string;
  text: string;
  border: string;
  badge: string;
  accent: string;
  iconBg: string;
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  general: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    accent: '#059669',
    iconBg: 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300',
  },
  finance: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/50',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    accent: '#d97706',
    iconBg: 'bg-amber-100/90 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
  },
  conversions: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-800/50',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
    accent: '#0891b2',
    iconBg: 'bg-cyan-100/90 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300',
  },
  health: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/50',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
    accent: '#e11d48',
    iconBg: 'bg-rose-100/90 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300',
  },
  student: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800/50',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    accent: '#4f46e5',
    iconBg: 'bg-indigo-100/90 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300',
  },
  home: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800/50',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
    accent: '#ea580c',
    iconBg: 'bg-orange-100/90 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300',
  },
  diy: {
    bg: 'bg-lime-50 dark:bg-lime-950/40',
    text: 'text-lime-600 dark:text-lime-400',
    border: 'border-lime-200 dark:border-lime-800/50',
    badge: 'bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-300',
    accent: '#65a30d',
    iconBg: 'bg-lime-100/90 text-lime-700 dark:bg-lime-950/80 dark:text-lime-300',
  },
  smartphone: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800/50',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    accent: '#9333ea',
    iconBg: 'bg-purple-100/90 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300',
  },
  camera: {
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    border: 'border-fuchsia-200 dark:border-fuchsia-800/50',
    badge: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300',
    accent: '#c026d3',
    iconBg: 'bg-fuchsia-100/90 text-fuchsia-700 dark:bg-fuchsia-950/80 dark:text-fuchsia-300',
  },
  text: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/50',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    accent: '#2563eb',
    iconBg: 'bg-blue-100/90 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300',
  },
  security: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800/50',
    badge: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    accent: '#dc2626',
    iconBg: 'bg-red-100/90 text-red-700 dark:bg-red-950/80 dark:text-red-300',
  },
  travel: {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-800/50',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
    accent: '#0d9488',
    iconBg: 'bg-teal-100/90 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300',
  },
  internet: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-200 dark:border-sky-800/50',
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    accent: '#0284c7',
    iconBg: 'bg-sky-100/90 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300',
  },
  games: {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800/50',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
    accent: '#7c3aed',
    iconBg: 'bg-violet-100/90 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300',
  },
  quick: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/40',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800/50',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    accent: '#ca8a04',
    iconBg: 'bg-yellow-100/90 text-yellow-700 dark:bg-yellow-950/80 dark:text-yellow-300',
  },
  pdf: {
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-200 dark:border-pink-800/50',
    badge: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
    accent: '#db2777',
    iconBg: 'bg-pink-100/90 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300',
  },
  developer: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    accent: '#047857',
    iconBg: 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300',
  },
  'live-data': {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/50',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    accent: '#1d4ed8',
    iconBg: 'bg-blue-100/90 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300',
  },
  'audio-music': {
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    border: 'border-fuchsia-200 dark:border-fuchsia-800/50',
    badge: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300',
    accent: '#a21caf',
    iconBg: 'bg-fuchsia-100/90 text-fuchsia-700 dark:bg-fuchsia-950/80 dark:text-fuchsia-300',
  },
};

export const getCategoryTheme = (categoryId?: string): CategoryTheme => {
  if (!categoryId || !CATEGORY_THEMES[categoryId]) {
    return {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800/50',
      badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
      accent: '#6366f1',
      iconBg: 'bg-indigo-100/90 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300',
    };
  }
  return CATEGORY_THEMES[categoryId];
};

export interface ToolIconTheme {
  iconBg: string;
  border: string;
  text: string;
}

export const TOOL_ICON_PALETTES: ToolIconTheme[] = [
  { iconBg: 'bg-blue-100/90 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300', border: 'border-blue-200/90 dark:border-blue-800', text: 'text-blue-600 dark:text-blue-400' },
  { iconBg: 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300', border: 'border-emerald-200/90 dark:border-emerald-800', text: 'text-emerald-600 dark:text-emerald-400' },
  { iconBg: 'bg-violet-100/90 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300', border: 'border-violet-200/90 dark:border-violet-800', text: 'text-violet-600 dark:text-violet-400' },
  { iconBg: 'bg-amber-100/90 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300', border: 'border-amber-200/90 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-400' },
  { iconBg: 'bg-rose-100/90 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300', border: 'border-rose-200/90 dark:border-rose-800', text: 'text-rose-600 dark:text-rose-400' },
  { iconBg: 'bg-cyan-100/90 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300', border: 'border-cyan-200/90 dark:border-cyan-800', text: 'text-cyan-600 dark:text-cyan-400' },
  { iconBg: 'bg-purple-100/90 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300', border: 'border-purple-200/90 dark:border-purple-800', text: 'text-purple-600 dark:text-purple-400' },
  { iconBg: 'bg-fuchsia-100/90 text-fuchsia-700 dark:bg-fuchsia-950/80 dark:text-fuchsia-300', border: 'border-fuchsia-200/90 dark:border-fuchsia-800', text: 'text-fuchsia-600 dark:text-fuchsia-400' },
  { iconBg: 'bg-teal-100/90 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300', border: 'border-teal-200/90 dark:border-teal-800', text: 'text-teal-600 dark:text-teal-400' },
  { iconBg: 'bg-orange-100/90 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300', border: 'border-orange-200/90 dark:border-orange-800', text: 'text-orange-600 dark:text-orange-400' },
  { iconBg: 'bg-indigo-100/90 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300', border: 'border-indigo-200/90 dark:border-indigo-800', text: 'text-indigo-600 dark:text-indigo-400' },
  { iconBg: 'bg-lime-100/90 text-lime-800 dark:bg-lime-950/80 dark:text-lime-300', border: 'border-lime-200/90 dark:border-lime-800', text: 'text-lime-600 dark:text-lime-400' },
  { iconBg: 'bg-pink-100/90 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300', border: 'border-pink-200/90 dark:border-pink-800', text: 'text-pink-600 dark:text-pink-400' },
  { iconBg: 'bg-sky-100/90 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300', border: 'border-sky-200/90 dark:border-sky-800', text: 'text-sky-600 dark:text-sky-400' },
  { iconBg: 'bg-yellow-100/90 text-yellow-800 dark:bg-yellow-950/80 dark:text-yellow-300', border: 'border-yellow-200/90 dark:border-yellow-800', text: 'text-yellow-600 dark:text-yellow-400' },
  { iconBg: 'bg-red-100/90 text-red-700 dark:bg-red-950/80 dark:text-red-300', border: 'border-red-200/90 dark:border-red-800', text: 'text-red-600 dark:text-red-400' },
];

export const getToolIconTheme = (toolId: string, iconName?: string): ToolIconTheme => {
  // Hash tool ID string to select a distinct vibrant color palette
  const key = `${toolId}-${iconName || ''}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % TOOL_ICON_PALETTES.length;
  return TOOL_ICON_PALETTES[index];
};
