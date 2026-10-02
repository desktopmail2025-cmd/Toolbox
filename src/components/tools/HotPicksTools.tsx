import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import {
  Flame, ExternalLink, Newspaper, TrendingUp, Search, RefreshCw,
  Bookmark, Check, Globe, Share2, Sparkles, Filter, Clock
} from 'lucide-react';

export interface HotPickArticle {
  id: string;
  title: string;
  source: string;
  sourceDomain: string;
  url: string;
  category: 'world' | 'business' | 'tech' | 'science' | 'culture' | 'health';
  categoryLabel: string;
  summary: string;
  timeAgo: string;
  readTime: string;
  badgeColor: string;
}

const NEWS_CATEGORIES = [
  { id: 'all', label: 'All Picks', icon: Flame },
  { id: 'world', label: 'World & Breaking', icon: Globe },
  { id: 'business', label: 'Business & Finance', icon: TrendingUp },
  { id: 'tech', label: 'Tech & AI', icon: Sparkles },
  { id: 'science', label: 'Science & Climate', icon: Newspaper },
  { id: 'culture', label: 'Culture & Arts', icon: Bookmark },
  { id: 'health', label: 'Health & Medicine', icon: Clock },
] as const;

export const INITIAL_HOT_PICKS: HotPickArticle[] = [
  // World & Breaking
  {
    id: 'bbc-1',
    title: 'Global Climate Summit Reaches Landmark Accord on Clean Energy Financing',
    source: 'BBC News',
    sourceDomain: 'bbc.com',
    url: 'https://www.bbc.com/news/science-environment',
    category: 'world',
    categoryLabel: 'World & Breaking',
    summary: 'Delegates from 140 nations reached a consensus overnight on establishing dedicated cross-border transition financing for rapid grid decarbonization.',
    timeAgo: '28m ago',
    readTime: '4 min read',
    badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  },
  {
    id: 'guardian-1',
    title: 'International Peace Envoys Announce New Diplomatic Framework in Geneva',
    source: 'The Guardian',
    sourceDomain: 'theguardian.com',
    url: 'https://www.theguardian.com/world',
    category: 'world',
    categoryLabel: 'World & Breaking',
    summary: 'Mediators unveiled a multi-stage humanitarian corridor agreement following three days of round-the-clock multilateral negotiations.',
    timeAgo: '1h ago',
    readTime: '5 min read',
    badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  },
  {
    id: 'cnn-1',
    title: 'Historic High-Speed Rail Corridor Opens Connecting Major European Capitals',
    source: 'CNN',
    sourceDomain: 'cnn.com',
    url: 'https://www.cnn.com/world',
    category: 'world',
    categoryLabel: 'World & Breaking',
    summary: 'The cross-border bullet line cuts passenger travel times by 45%, offering a sustainable alternative to regional air travel.',
    timeAgo: '2h ago',
    readTime: '3 min read',
    badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  },

  // Business & Finance
  {
    id: 'forbes-1',
    title: 'Global Central Banks Coordinate Policy Amid Productivity Boom in Emerging Tech',
    source: 'Forbes',
    sourceDomain: 'forbes.com',
    url: 'https://www.forbes.com/business',
    category: 'business',
    categoryLabel: 'Business & Finance',
    summary: 'Economic analysts project a sustained rise in capital expenditure as enterprise software investments begin yielding major structural efficiencies.',
    timeAgo: '42m ago',
    readTime: '6 min read',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },
  {
    id: 'wsj-1',
    title: 'Treasury Yields Stabilize as Inflation Indicators Align with Central Bank Targets',
    source: 'The Wall Street Journal',
    sourceDomain: 'wsj.com',
    url: 'https://www.wsj.com/economy',
    category: 'business',
    categoryLabel: 'Business & Finance',
    summary: 'Bond markets rallied following favorable core price index figures, reducing bond volatility across key global indices.',
    timeAgo: '1h 15m ago',
    readTime: '5 min read',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },
  {
    id: 'bloomberg-1',
    title: 'Venture Inflows Surge into Semiconductor Manufacturing & Next-Gen Optical Computing',
    source: 'Bloomberg',
    sourceDomain: 'bloomberg.com',
    url: 'https://www.bloomberg.com',
    category: 'business',
    categoryLabel: 'Business & Finance',
    summary: 'Over $12 billion in private equity was deployed across specialized silicon packaging and light-speed interconnect fabs this quarter.',
    timeAgo: '3h ago',
    readTime: '4 min read',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },

  // Technology & AI
  {
    id: 'techcrunch-1',
    title: 'Breakthrough on Local Edge Neural Models Brings High-Fidelity Audio & Vision to Phones',
    source: 'TechCrunch',
    sourceDomain: 'techcrunch.com',
    url: 'https://techcrunch.com',
    category: 'tech',
    categoryLabel: 'Technology & AI',
    summary: 'Researchers demonstrate quantized multimodal architectures capable of 60fps real-time inference using under 5 watts of power.',
    timeAgo: '35m ago',
    readTime: '4 min read',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
  },
  {
    id: 'theverge-1',
    title: 'The Open Web Standards Consortium Finalizes Next-Gen WebAssembly Multi-Threading',
    source: 'The Verge',
    sourceDomain: 'theverge.com',
    url: 'https://www.theverge.com/tech',
    category: 'tech',
    categoryLabel: 'Technology & AI',
    summary: 'Desktop-grade photo and video editors can now execute parallel native pipelines in standard web browsers with near-zero latency.',
    timeAgo: '2h ago',
    readTime: '5 min read',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
  },
  {
    id: 'wired-1',
    title: 'Autonomous Clean-Grid Energy Storage Software Prevents Blackouts During Extreme Weather',
    source: 'Wired',
    sourceDomain: 'wired.com',
    url: 'https://www.wired.com',
    category: 'tech',
    categoryLabel: 'Technology & AI',
    summary: 'Algorithmic battery storage systems instantaneously balanced regional grid demand during a severe cold front, keeping millions powered.',
    timeAgo: '3h 30m ago',
    readTime: '6 min read',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
  },

  // Science & Climate
  {
    id: 'natgeo-1',
    title: 'Deep-Ocean Expedition Identifies Hundreds of Uncataloged Bioluminescent Species',
    source: 'National Geographic',
    sourceDomain: 'nationalgeographic.com',
    url: 'https://www.nationalgeographic.com/science',
    category: 'science',
    categoryLabel: 'Science & Climate',
    summary: 'A submersible mission into the Kermadec Trench documented pristine abyssal ecosystems thriving around hydrothermal mineral vents.',
    timeAgo: '4h ago',
    readTime: '5 min read',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
  },
  {
    id: 'nature-1',
    title: 'James Webb Space Telescope Maps Atmospheric Water Vapor on Habitable-Zone Exoplanet',
    source: 'Nature',
    sourceDomain: 'nature.com',
    url: 'https://www.nature.com',
    category: 'science',
    categoryLabel: 'Science & Climate',
    summary: 'Spectroscopic absorption bands confirm stable atmospheric pressure and cloud formations on an Earth-sized world 48 light-years away.',
    timeAgo: '5h ago',
    readTime: '7 min read',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
  },

  // Culture & Arts
  {
    id: 'newyorker-1',
    title: 'The Architectural Renaissance of Civic Libraries as Dynamic Digital Hubs',
    source: 'The New Yorker',
    sourceDomain: 'newyorker.com',
    url: 'https://www.newyorker.com/culture',
    category: 'culture',
    categoryLabel: 'Culture & Arts',
    summary: 'Cities around the globe are transforming classic reading halls into communal maker spaces, acoustic recording booths, and quiet sanctuaries.',
    timeAgo: '6h ago',
    readTime: '8 min read',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  {
    id: 'guardian-culture-1',
    title: 'Retrospective Exhibition Celebrates Half-Century of Groundbreaking Kinetic Art',
    source: 'The Guardian Culture',
    sourceDomain: 'theguardian.com',
    url: 'https://www.theguardian.com/artanddesign',
    category: 'culture',
    categoryLabel: 'Culture & Arts',
    summary: 'Tate Modern unveils a sprawling interactive collection of wind, magnet, and gravity-driven sculptures from international pioneers.',
    timeAgo: '7h ago',
    readTime: '4 min read',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },

  // Health & Medicine
  {
    id: 'reuters-health-1',
    title: 'Clinical Trials Show Targeted mRNA Therapy Slows Neurodegenerative Progression',
    source: 'Reuters',
    sourceDomain: 'reuters.com',
    url: 'https://www.reuters.com/business/healthcare-pharmaceuticals',
    category: 'health',
    categoryLabel: 'Health & Medicine',
    summary: 'Phase 3 multi-center data reveals significant preservation of cognitive and motor function with minimal adverse reactions.',
    timeAgo: '2h 45m ago',
    readTime: '5 min read',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
  },
  {
    id: 'bbc-health-1',
    title: 'Comprehensive Study Correlates Daily Micro-Walks with Long-Term Cardiovascular Health',
    source: 'BBC Health',
    sourceDomain: 'bbc.com',
    url: 'https://www.bbc.com/news/health',
    category: 'health',
    categoryLabel: 'Health & Medicine',
    summary: 'Five-minute brisk movement intervals every hour counteract the cellular stress caused by prolonged desk-bound sedentary habits.',
    timeAgo: '5h 15m ago',
    readTime: '3 min read',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
  },
];

export const HotPicksView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('omni_saved_hot_picks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleSave = (id: string) => {
    sounds.playClick();
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('omni_saved_hot_picks', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const copyArticleLink = (article: HotPickArticle) => {
    sounds.playClick();
    navigator.clipboard.writeText(`${article.title} - Read directly at ${article.url}`);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefresh = () => {
    sounds.playClick();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      sounds.playSuccess();
    }, 600);
  };

  const filteredPicks = INITIAL_HOT_PICKS.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCat;
    const matchesSearch =
      p.title.toLowerCase().includes(query) ||
      p.summary.toLowerCase().includes(query) ||
      p.source.toLowerCase().includes(query) ||
      p.categoryLabel.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
              <Flame className="w-4 h-4" />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Today's Hot Picks & Breaking Headlines
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Curated world-class reporting from Forbes, The Guardian, CNN, BBC, Reuters & Bloomberg with direct source links.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1.5 hover:bg-zinc-100 cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
          <span>{isRefreshing ? 'Updating Picks...' : 'Refresh Feed'}</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          {NEWS_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search breaking stories, sources (Forbes, BBC, CNN), or topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium focus:outline-orange-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Feed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPicks.map(article => {
          const isSaved = savedIds.has(article.id);
          const isCopied = copiedId === article.id;

          return (
            <div
              key={article.id}
              className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between space-y-3.5 shadow-2xs hover:border-orange-300 dark:hover:border-orange-800/60 transition-all group"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                      <Newspaper className="w-3.5 h-3.5 text-zinc-400" />
                      {article.source}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${article.badgeColor}`}>
                      {article.categoryLabel}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                    {article.timeAgo}
                  </span>
                </div>

                {/* Article Headline */}
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {article.title}
                </h3>

                {/* Article Summary */}
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              {/* Bottom Actions Bar with Direct Source Link */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <span className="text-[10px] text-zinc-400 font-medium">
                  {article.readTime}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyArticleLink(article)}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    title="Copy direct article citation"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => toggleSave(article.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isSaved
                        ? 'border-orange-300 bg-orange-50 text-orange-600 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-400'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                    title={isSaved ? 'Remove bookmark' : 'Bookmark story'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  {/* DIRECT ORIGINAL SOURCE LINK */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sounds.playClick()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-2xs transition-all active:scale-95"
                  >
                    <span>Visit Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPicks.length === 0 && (
          <div className="col-span-full p-12 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-2">
            <Newspaper className="w-8 h-8 text-zinc-400 mx-auto opacity-60" />
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No stories match your criteria</p>
            <p className="text-xs text-zinc-500">Try switching categories or clearing your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};
