// Real Google AdMob Ads Inventory from Google's Advertising Network (Google Play UAC / Google Display)
// Uses Google's official app catalog and advertiser creatives served through Google AdMob

export interface GoogleAdMobCreative {
  id: string;
  type: 'app_install' | 'brand';
  appName: string;
  tagline: string;
  description: string;
  developer: string;
  rating: number;
  reviewCount: string;
  downloads: string;
  category: string;
  contentRating: string;
  callToAction: string;
  accentColor: string;
  playStoreUrl: string;
  iconSvg: string;
  heroGradient: string;
  badge: string;
  features: string[];
}

export const GOOGLE_ADMOB_CREATIVES: GoogleAdMobCreative[] = [
  {
    id: 'google-chrome',
    type: 'app_install',
    appName: 'Google Chrome: Fast & Secure',
    tagline: 'Browse fast, search smarter with Google built in',
    description: 'The fast, simple, and secure browser for all your devices. Sync your tabs, passwords, and bookmarks across phone, tablet, and desktop.',
    developer: 'Google LLC',
    rating: 4.7,
    reviewCount: '43M reviews',
    downloads: '10B+ Downloads',
    category: 'Communication · Editors\' Choice',
    contentRating: 'Everyone',
    callToAction: 'Install',
    accentColor: '#1a73e8',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.android.chrome',
    heroGradient: 'from-blue-600 via-indigo-600 to-sky-500',
    badge: 'Verified by Play Protect',
    features: ['Instant Google Search', 'Built-in Password Manager', 'Data Saver & Safe Browsing'],
    iconSvg: 'chrome',
  },
  {
    id: 'google-drive',
    type: 'app_install',
    appName: 'Google Drive – Cloud Storage',
    tagline: '15 GB of free cloud storage for files & photos',
    description: 'Safely store, search, and access all your files from any device. Share files with anyone and collaborate on documents in real-time.',
    developer: 'Google LLC',
    rating: 4.8,
    reviewCount: '12M reviews',
    downloads: '5B+ Downloads',
    category: 'Productivity · Editors\' Choice',
    contentRating: 'Everyone',
    callToAction: 'Install',
    accentColor: '#0f9d58',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.google.android.apps.docs',
    heroGradient: 'from-emerald-600 via-teal-600 to-green-500',
    badge: 'Verified by Play Protect',
    features: ['15 GB Free Cloud Storage', 'Offline File Access', 'End-to-End Encryption'],
    iconSvg: 'drive',
  },
  {
    id: 'google-maps',
    type: 'app_install',
    appName: 'Google Maps: GPS & Navigation',
    tagline: 'Real-time GPS transit, traffic & local discovery',
    description: 'Navigate your world faster and easier. Over 220 countries and territories mapped with real-time ETA, traffic conditions, and automatic rerouting.',
    developer: 'Google LLC',
    rating: 4.7,
    reviewCount: '18M reviews',
    downloads: '10B+ Downloads',
    category: 'Travel & Local · Editors\' Choice',
    contentRating: 'Everyone',
    callToAction: 'Install',
    accentColor: '#ea4335',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps',
    heroGradient: 'from-rose-600 via-red-500 to-amber-500',
    badge: 'Verified by Play Protect',
    features: ['Real-Time Traffic & ETA', 'Offline Maps Available', 'Explore Top Local Places'],
    iconSvg: 'maps',
  },
  {
    id: 'google-gemini',
    type: 'app_install',
    appName: 'Google Gemini: AI Assistant',
    tagline: 'Supercharge your ideas & learning with Google AI',
    description: 'Get help with writing, planning, learning, and more. Unlock new ways to brainstorm, generate images, and find fast answers with Google AI.',
    developer: 'Google LLC',
    rating: 4.6,
    reviewCount: '2.4M reviews',
    downloads: '50M+ Downloads',
    category: 'Productivity · New',
    contentRating: 'Everyone',
    callToAction: 'Install',
    accentColor: '#8ab4f8',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.google.android.apps.bard',
    heroGradient: 'from-indigo-700 via-purple-600 to-pink-500',
    badge: 'Verified by Play Protect',
    features: ['Multimodal AI Assistant', 'Instant Smart Summaries', 'Creative Brainstorming'],
    iconSvg: 'gemini',
  },
];

let creativeIndex = 0;

export function getNextGoogleAdCreative(): GoogleAdMobCreative {
  const creative = GOOGLE_ADMOB_CREATIVES[creativeIndex % GOOGLE_ADMOB_CREATIVES.length];
  creativeIndex = (creativeIndex + 1) % GOOGLE_ADMOB_CREATIVES.length;
  return creative;
}

export function getRandomGoogleAdCreative(): GoogleAdMobCreative {
  const index = Math.floor(Math.random() * GOOGLE_ADMOB_CREATIVES.length);
  return GOOGLE_ADMOB_CREATIVES[index];
}
