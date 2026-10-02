export interface CategoryTheme {
  bg: string;
  text: string;
  border: string;
  badge: string;
  accent: string;
  iconBg: string;
  highlightColor?: string;
}

// Purposeful Color Psychology:
// - general: Emerald Green (#059669) - Mathematical balance, precision, clarity
// - finance: Forest Green (#047857) - Wealth, assets, compound growth, financial prosperity
// - conversions: Cyan (#0891b2) - Scientific measurement, calibration, international standards
// - health: Crimson Rose (#e11d48) - Vitality, heartbeat, blood pressure, active wellness
// - student: Deep Royal Indigo (#4338ca) - Academic intellect, knowledge, studious focus
// - home: Warm Amber (#d97706) - Domestic hearth, cozy hospitality, family living
// - diy: Rust Ochre (#c2410c) - Construction timber, masonry, hardware, manual crafting
// - smartphone: Electric Purple (#7e22ce) - Digital devices, sensors, modern screens
// - camera: Vivid Fuchsia (#c026d3) - Photography, lenses, color spectrum, visual arts
// - text: Cobalt Blue (#1d4ed8) - Editorial ink, typography, writing, document readability
// - security: Armored Slate (#334155) - Cryptography, padlock security, steel vault
// - travel: Sea Teal (#0d9488) - Navigation, oceanic exploration, world time, transit
// - internet: Electric Sky (#0284c7) - Telecommunications, data packets, cloud networking
// - games: Neon Violet (#8b5cf6) - Playfulness, gaming arcade, mental agility
// - quick: Sunburst Yellow (#ca8a04) - Instant speed, quick utility, lightning reflexes
// - pdf: Ruby Coral (#be123c) - Document standard, portable formats, publication sheets
// - developer: Dark Terminal Teal (#0f766e) - Software syntax, engineering architecture
// - live-data: Deep Ultramarine (#2563eb) - Live global telemetry, weather, orbital feeds
// - audio-music: Hot Magenta (#db2777) - Acoustics, resonance, metronome rhythm
// - hot-picks: Flame Orange (#ea580c) - Breaking headlines, urgency, hot off the press
// - professional: Studio Iris (#6d28d9) - Executive tools, professional media editing

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  general: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    accent: '#059669',
    iconBg: 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300',
    highlightColor: '#10b981',
  },
  finance: {
    bg: 'bg-green-50 dark:bg-green-950/40',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800/50',
    badge: 'bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-300',
    accent: '#047857',
    iconBg: 'bg-green-100/90 text-green-800 dark:bg-green-950/80 dark:text-green-300',
    highlightColor: '#22c55e',
  },
  conversions: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-800/50',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
    accent: '#0891b2',
    iconBg: 'bg-cyan-100/90 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300',
    highlightColor: '#06b6d4',
  },
  health: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/50',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
    accent: '#e11d48',
    iconBg: 'bg-rose-100/90 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300',
    highlightColor: '#f43f5e',
  },
  student: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800/50',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    accent: '#4338ca',
    iconBg: 'bg-indigo-100/90 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300',
    highlightColor: '#6366f1',
  },
  home: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/50',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    accent: '#d97706',
    iconBg: 'bg-amber-100/90 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
    highlightColor: '#f59e0b',
  },
  diy: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800/50',
    badge: 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300',
    accent: '#c2410c',
    iconBg: 'bg-orange-100/90 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300',
    highlightColor: '#ea580c',
  },
  smartphone: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800/50',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    accent: '#7e22ce',
    iconBg: 'bg-purple-100/90 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300',
    highlightColor: '#a855f7',
  },
  camera: {
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    border: 'border-fuchsia-200 dark:border-fuchsia-800/50',
    badge: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300',
    accent: '#c026d3',
    iconBg: 'bg-fuchsia-100/90 text-fuchsia-700 dark:bg-fuchsia-950/80 dark:text-fuchsia-300',
    highlightColor: '#d946ef',
  },
  text: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/50',
    badge: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300',
    accent: '#1d4ed8',
    iconBg: 'bg-blue-100/90 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300',
    highlightColor: '#3b82f6',
  },
  security: {
    bg: 'bg-slate-100 dark:bg-slate-900/60',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-300 dark:border-slate-700/60',
    badge: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    accent: '#334155',
    iconBg: 'bg-slate-200/90 text-slate-800 dark:bg-slate-800/90 dark:text-slate-200',
    highlightColor: '#64748b',
  },
  travel: {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-800/50',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
    accent: '#0d9488',
    iconBg: 'bg-teal-100/90 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300',
    highlightColor: '#14b8a6',
  },
  internet: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-200 dark:border-sky-800/50',
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    accent: '#0284c7',
    iconBg: 'bg-sky-100/90 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300',
    highlightColor: '#38bdf8',
  },
  games: {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800/50',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
    accent: '#8b5cf6',
    iconBg: 'bg-violet-100/90 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300',
    highlightColor: '#a78bfa',
  },
  quick: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/40',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800/50',
    badge: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-300',
    accent: '#ca8a04',
    iconBg: 'bg-yellow-100/90 text-yellow-800 dark:bg-yellow-950/80 dark:text-yellow-300',
    highlightColor: '#eab308',
  },
  pdf: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/50',
    badge: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300',
    accent: '#be123c',
    iconBg: 'bg-rose-100/90 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
    highlightColor: '#fb7185',
  },
  developer: {
    bg: 'bg-stone-50 dark:bg-stone-900/60',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-200 dark:border-teal-800/50',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
    accent: '#0f766e',
    iconBg: 'bg-stone-100/90 text-teal-700 dark:bg-stone-800/90 dark:text-teal-300',
    highlightColor: '#2dd4bf',
  },
  'live-data': {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/50',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    accent: '#2563eb',
    iconBg: 'bg-blue-100/90 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300',
    highlightColor: '#60a5fa',
  },
  'audio-music': {
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-200 dark:border-pink-800/50',
    badge: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
    accent: '#db2777',
    iconBg: 'bg-pink-100/90 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300',
    highlightColor: '#f472b6',
  },
  'hot-picks': {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800/50',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
    accent: '#ea580c',
    iconBg: 'bg-orange-100/90 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300',
    highlightColor: '#fb923c',
  },
  professional: {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-200 dark:border-violet-800/50',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
    accent: '#6d28d9',
    iconBg: 'bg-violet-100/90 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300',
    highlightColor: '#8b5cf6',
  },
};

export const getCategoryTheme = (categoryId?: string): CategoryTheme => {
  if (!categoryId || !CATEGORY_THEMES[categoryId]) {
    return {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800/50',
      badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
      accent: '#4338ca',
      iconBg: 'bg-indigo-100/90 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300',
      highlightColor: '#6366f1',
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
  const key = `${toolId}-${iconName || ''}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % TOOL_ICON_PALETTES.length;
  return TOOL_ICON_PALETTES[index];
};
