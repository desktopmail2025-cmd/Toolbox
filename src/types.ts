export type CategoryId =
  | 'general'
  | 'finance'
  | 'conversions'
  | 'health'
  | 'student'
  | 'home'
  | 'diy'
  | 'smartphone'
  | 'camera'
  | 'text'
  | 'security'
  | 'travel'
  | 'internet'
  | 'games'
  | 'quick'
  | 'pdf'
  | 'developer'
  | 'live-data'
  | 'audio-music'
  | 'hot-picks'
  | 'professional'
  | 'live-score'
  | 'love-management'
  | 'date-reminder';

export interface ToolItem {
  id: string;
  name: string;
  categoryId: CategoryId;
  description: string;
  iconName: string;
  keywords: string[];
  isOnline?: boolean; // true = Requires Internet / Live API, false = 100% Offline on-device
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  iconName: string;
  description: string;
  badgeCount?: number;
}
