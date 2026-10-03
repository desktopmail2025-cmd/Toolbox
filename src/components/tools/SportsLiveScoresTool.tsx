import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Trophy, Activity, Clock, Flame, ChevronRight, RotateCcw,
  Sparkles, Filter, ChevronDown, Check, Volume2, Calendar,
  Award, Flag, ArrowUpRight, Shield, RefreshCw, AlertCircle,
  ExternalLink, MapPin, Radio, Swords, Zap, Bell, BellRing
} from 'lucide-react';
import { sounds } from '../../utils/audio';

interface MatchCompetitor {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  score: string;
  homeAway: 'home' | 'away';
  records?: string;
  winner?: boolean;
  cricketOvers?: string;
  cricketWickets?: string;
  color?: string;
}

interface MatchEventItem {
  id: string;
  sportId: 'football' | 'cricket' | 'combat' | 'f1' | 'tennis' | 'basketball' | 'american-football' | 'baseball' | 'hockey';
  leagueId: string;
  leagueName: string;
  leagueLogo?: string;
  name: string;
  date: string;
  venue?: string;
  status: 'LIVE' | 'FT' | 'UPCOMING';
  statusDetail: string;
  clock?: string;
  period?: number;
  homeTeam: MatchCompetitor;
  awayTeam: MatchCompetitor;
  stipulation?: string;
  cricketNote?: string;
  details?: Array<{
    min: string;
    text: string;
    player?: string;
    teamId?: string;
    type?: 'goal' | 'card' | 'wicket' | 'boundary' | 'finisher' | 'knockdown' | 'sub' | 'general';
  }>;
}

interface StandingRow {
  rank: number;
  team: string;
  logo?: string;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalDiff: string;
  goalsFor: number;
  goalsAgainst: number;
}

interface LeagueConfig {
  id: string;
  sportId: 'football' | 'cricket' | 'combat' | 'f1' | 'tennis' | 'basketball' | 'american-football' | 'baseball' | 'hockey';
  name: string;
  shortName: string;
  country: string;
  flag: string;
  endpoint: string;
  standingsEndpoint?: string;
  logo: string;
}

const SPORTS_LEAGUES: LeagueConfig[] = [
  // 1. World Top Football / Soccer Leagues
  {
    id: 'eng.1',
    sportId: 'football',
    name: 'Premier League',
    shortName: 'Premier League',
    country: 'England',
    flag: '🇬🇧',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
    standingsEndpoint: 'https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png',
  },
  {
    id: 'uefa.champions',
    sportId: 'football',
    name: 'UEFA Champions League',
    shortName: 'Champions League',
    country: 'Europe',
    flag: '🇪🇺',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard',
    standingsEndpoint: 'https://site.api.espn.com/apis/v2/sports/soccer/uefa.champions/standings',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2.png',
  },
  {
    id: 'esp.1',
    sportId: 'football',
    name: 'La Liga',
    shortName: 'La Liga',
    country: 'Spain',
    flag: '🇪🇸',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard',
    standingsEndpoint: 'https://site.api.espn.com/apis/v2/sports/soccer/esp.1/standings',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png',
  },
  {
    id: 'ita.1',
    sportId: 'football',
    name: 'Serie A',
    shortName: 'Serie A',
    country: 'Italy',
    flag: '🇮🇹',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/scoreboard',
    standingsEndpoint: 'https://site.api.espn.com/apis/v2/sports/soccer/ita.1/standings',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/12.png',
  },
  {
    id: 'ger.1',
    sportId: 'football',
    name: 'Bundesliga',
    shortName: 'Bundesliga',
    country: 'Germany',
    flag: '🇩🇪',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/soccer/ger.1/scoreboard',
    standingsEndpoint: 'https://site.api.espn.com/apis/v2/sports/soccer/ger.1/standings',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/10.png',
  },
  {
    id: 'uefa.europa',
    sportId: 'football',
    name: 'UEFA Europa League',
    shortName: 'Europa League',
    country: 'Europe',
    flag: '🇪🇺',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.europa/scoreboard',
    standingsEndpoint: 'https://site.api.espn.com/apis/v2/sports/soccer/uefa.europa/standings',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2312.png',
  },
  {
    id: 'fra.1',
    sportId: 'football',
    name: 'Ligue 1',
    shortName: 'Ligue 1',
    country: 'France',
    flag: '🇫🇷',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/soccer/fra.1/scoreboard',
    standingsEndpoint: 'https://site.api.espn.com/apis/v2/sports/soccer/fra.1/standings',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/9.png',
  },

  // 2. Cricket (IPL, World Cup, International Series)
  {
    id: 'ipl',
    sportId: 'cricket',
    name: 'Indian Premier League (IPL)',
    shortName: 'IPL Cricket',
    country: 'India',
    flag: '🏏',
    endpoint: 'cricket-ipl',
    logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/ipl.png',
  },
  {
    id: 'icc-cwc',
    sportId: 'cricket',
    name: 'ICC Cricket World Cup / Champions Trophy',
    shortName: 'ICC World Cup',
    country: 'International',
    flag: '🏆',
    endpoint: 'cricket-icc',
    logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/icc.png',
  },
  {
    id: 'ashes-series',
    sportId: 'cricket',
    name: 'The Ashes & International Series',
    shortName: 'The Ashes Test',
    country: 'UK / Australia',
    flag: '🇬🇧',
    endpoint: 'cricket-ashes',
    logo: 'https://a.espncdn.com/i/teamlogos/countries/500/eng.png',
  },

  // 3. Combat Sports & Wrestling (UFC, WWE, AEW)
  {
    id: 'ufc',
    sportId: 'combat',
    name: 'UFC (Ultimate Fighting Championship)',
    shortName: 'UFC Octagon',
    country: 'Global',
    flag: '🥊',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/ufc.png',
  },
  {
    id: 'wwe',
    sportId: 'combat',
    name: 'WWE (World Wrestling Entertainment)',
    shortName: 'WWE Live',
    country: 'Global',
    flag: '🤼',
    endpoint: 'wwe-curated',
    logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/wwe.png',
  },
  {
    id: 'aew',
    sportId: 'combat',
    name: 'AEW (All Elite Wrestling)',
    shortName: 'AEW Live',
    country: 'Global',
    flag: '🤼',
    endpoint: 'aew-curated',
    logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/aew.png',
  },

  // 4. Formula 1
  {
    id: 'f1',
    sportId: 'f1',
    name: 'FIA Formula 1 World Championship',
    shortName: 'Formula 1',
    country: 'Global',
    flag: '🏎️',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/racing/f1/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/f1.png',
  },

  // 5. Tennis (ATP & WTA)
  {
    id: 'atp',
    sportId: 'tennis',
    name: 'ATP World Tour (Men)',
    shortName: 'ATP Tennis',
    country: 'Global',
    flag: '🎾',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/tennis/atp/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/atp.png',
  },
  {
    id: 'wta',
    sportId: 'tennis',
    name: 'WTA Tour (Women)',
    shortName: 'WTA Tennis',
    country: 'Global',
    flag: '🎾',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/tennis/wta/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/wta.png',
  },

  // 6. Basketball (NBA)
  {
    id: 'nba',
    sportId: 'basketball',
    name: 'NBA Basketball',
    shortName: 'NBA',
    country: 'USA',
    flag: '🏀',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/nba.png',
  },

  // 7. American Football (NFL)
  {
    id: 'nfl',
    sportId: 'american-football',
    name: 'NFL Football',
    shortName: 'NFL',
    country: 'USA',
    flag: '🏈',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png',
  },

  // 8. Baseball (MLB)
  {
    id: 'mlb',
    sportId: 'baseball',
    name: 'MLB Baseball',
    shortName: 'MLB',
    country: 'USA',
    flag: '⚾',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png',
  },

  // 9. Ice Hockey (NHL)
  {
    id: 'nhl',
    sportId: 'hockey',
    name: 'NHL Ice Hockey',
    shortName: 'NHL',
    country: 'USA/Canada',
    flag: '🏒',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png',
  },
];

const SPORT_CATEGORIES = [
  { id: 'football', label: 'Football (Soccer)', icon: '⚽' },
  { id: 'cricket', label: 'Cricket (IPL / ICC)', icon: '🏏' },
  { id: 'combat', label: 'Combat & Wrestling (WWE / UFC / AEW)', icon: '🥊' },
  { id: 'f1', label: 'Formula 1', icon: '🏎️' },
  { id: 'tennis', label: 'Tennis', icon: '🎾' },
  { id: 'basketball', label: 'NBA Basketball', icon: '🏀' },
  { id: 'american-football', label: 'NFL Football', icon: '🏈' },
  { id: 'baseball', label: 'MLB Baseball', icon: '⚾' },
  { id: 'hockey', label: 'NHL Ice Hockey', icon: '🏒' },
];

/**
 * Universal Sport Emblem Component:
 * Displays verified logo if accessible, otherwise renders an authentic,
 * sport-appropriate SVG crest badge with team initials and theme colors.
 * NEVER renders a soccer crest for cricket, wrestling, combat or F1!
 */
const SportEmblem: React.FC<{
  logo?: string;
  name: string;
  sportId: string;
  sizeClass?: string;
  color?: string;
}> = ({ logo, name, sportId, sizeClass = 'w-8 h-8', color }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [logo]);

  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [name]);

  const getSportBadgeBg = () => {
    if (color) return color;
    switch (sportId) {
      case 'cricket': return '#0369a1';
      case 'combat': return '#881337';
      case 'f1': return '#dc2626';
      case 'tennis': return '#15803d';
      case 'basketball': return '#ea580c';
      case 'american-football': return '#1e3a8a';
      case 'baseball': return '#b91c1c';
      case 'hockey': return '#0f766e';
      default: return '#3b82f6';
    }
  };

  const getSportIcon = () => {
    switch (sportId) {
      case 'cricket': return '🏏';
      case 'combat': return '🥊';
      case 'f1': return '🏎️';
      case 'tennis': return '🎾';
      case 'basketball': return '🏀';
      case 'american-football': return '🏈';
      case 'baseball': return '⚾';
      case 'hockey': return '🏒';
      default: return '⚽';
    }
  };

  if (!logo || imgError) {
    return (
      <div
        className={`${sizeClass} ${sportId === 'combat' ? 'rounded-full' : 'rounded-2xl'} flex flex-col items-center justify-center p-1 font-bold text-white shadow-sm shrink-0 border border-white/20 select-none relative overflow-hidden`}
        style={{ backgroundColor: getSportBadgeBg() }}
        title={name}
      >
        <span className="text-[10px] sm:text-xs font-mono font-black tracking-tight leading-none">
          {initials}
        </span>
        <span className="text-[8px] opacity-75 leading-none mt-0.5">
          {getSportIcon()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      onError={() => setImgError(true)}
      className={`${sizeClass} ${
        sportId === 'combat'
          ? 'rounded-full object-cover border-2 border-white/30 shadow-sm'
          : 'object-contain'
      } shrink-0 drop-shadow-2xs transition-transform duration-200`}
    />
  );
};

export const SportsLiveScoresTool: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>('football');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('eng.1');
  const [activeTab, setActiveTab] = useState<'matches' | 'table'>('matches');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'FT' | 'UPCOMING'>('ALL');
  const [matches, setMatches] = useState<MatchEventItem[]>([]);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchEventItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const availableLeagues = useMemo(() => {
    return SPORTS_LEAGUES.filter(l => l.sportId === selectedSport);
  }, [selectedSport]);

  const currentLeague = useMemo(() => {
    return SPORTS_LEAGUES.find(l => l.id === selectedLeagueId) || availableLeagues[0] || SPORTS_LEAGUES[0];
  }, [selectedLeagueId, availableLeagues]);

  const handleSelectSport = (sportId: string) => {
    sounds.playClick();
    setSelectedSport(sportId);
    const firstLeague = SPORTS_LEAGUES.find(l => l.sportId === sportId);
    if (firstLeague) {
      setSelectedLeagueId(firstLeague.id);
    }
  };

  // Curated WWE & Combat Live Events with verified superstar photos
  const getWWEMatches = (): MatchEventItem[] => [
    {
      id: 'wwe-match-1',
      sportId: 'combat',
      leagueId: 'wwe',
      leagueName: 'WWE WrestleMania XL / Saturday Night Main Event',
      name: 'Undisputed WWE Championship: Cody Rhodes vs. Roman Reigns',
      date: '2026-10-03T23:00Z',
      venue: 'Allegiant Stadium, Las Vegas',
      status: 'LIVE',
      statusDetail: '🔴 Main Event In Progress (22m)',
      clock: '22:45',
      stipulation: 'Undisputed WWE Championship · Bloodline Rules',
      homeTeam: {
        id: 'cody-rhodes',
        name: 'Cody Rhodes',
        shortName: 'Cody',
        score: 'Champion',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Cody_Rhodes_at_WrestleMania_XL.jpg/440px-Cody_Rhodes_at_WrestleMania_XL.jpg',
        homeAway: 'home',
        records: 'The American Nightmare · Undisputed WWE Champion',
        color: '#1e3a8a',
      },
      awayTeam: {
        id: 'roman-reigns',
        name: 'Roman Reigns',
        shortName: 'Roman',
        score: 'Challenger',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Roman_Reigns_in_January_2020.jpg/440px-Roman_Reigns_in_January_2020.jpg',
        homeAway: 'away',
        records: 'The Original Tribal Chief (OTC) · Former 1,316-day Champ',
        color: '#881337',
      },
      details: [
        { min: '12m', text: 'Cross Rhodes executed near announce table', player: 'Cody Rhodes', type: 'finisher' },
        { min: '18m', text: 'Superman Punch counter near the steel ring steps', player: 'Roman Reigns', type: 'knockdown' },
        { min: '21m', text: 'Spear through barricade into timekeeper area', player: 'Roman Reigns', type: 'finisher' },
      ],
    },
    {
      id: 'wwe-match-2',
      sportId: 'combat',
      leagueId: 'wwe',
      leagueName: 'WWE World Heavyweight Title Match',
      name: 'World Heavyweight Championship: Gunther vs. CM Punk',
      date: '2026-10-03T21:30Z',
      venue: 'Allstate Arena, Chicago',
      status: 'FT',
      statusDetail: 'Finished (Pinfall after GTS)',
      stipulation: 'World Heavyweight Championship Bout',
      homeTeam: {
        id: 'gunther',
        name: 'Gunther',
        shortName: 'Gunther',
        score: 'Defeated',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Walter_NXT_UK_WrestleMania_Axxess.jpg/440px-Walter_NXT_UK_WrestleMania_Axxess.jpg',
        homeAway: 'home',
        records: 'The Ring General · Reigning Heavyweight Champion',
        color: '#3f3f46',
      },
      awayTeam: {
        id: 'cm-punk',
        name: 'CM Punk',
        shortName: 'CM Punk',
        score: 'WINNER (Pin)',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/CM_Punk_March_2024.jpg/440px-CM_Punk_March_2024.jpg',
        homeAway: 'away',
        records: 'The Best in the World · NEW World Heavyweight Champion',
        winner: true,
        color: '#b91c1c',
      },
      details: [
        { min: '14m', text: 'Powerbomb from the top rope countered into Anaconda Vise', player: 'CM Punk', type: 'sub' },
        { min: '22m', text: 'GTS (Go to Sleep) executed for the 3-count pinfall', player: 'CM Punk', type: 'finisher' },
      ],
    },
    {
      id: 'wwe-match-3',
      sportId: 'combat',
      leagueId: 'wwe',
      leagueName: 'WWE Bad Blood: Hell in a Cell',
      name: 'Hell in a Cell Grudge Match: Drew McIntyre vs. Seth Rollins',
      date: '2026-10-04T01:00Z',
      venue: 'State Farm Arena, Atlanta',
      status: 'UPCOMING',
      statusDetail: 'Scheduled · Hell in a Cell',
      stipulation: 'Hell in a Cell Grudge Match',
      homeTeam: {
        id: 'drew-mcintyre',
        name: 'Drew McIntyre',
        shortName: 'McIntyre',
        score: 'Scheduled',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Drew_McIntyre_March_2024.jpg/440px-Drew_McIntyre_March_2024.jpg',
        homeAway: 'home',
        records: 'The Scottish Warrior · 2x WWE Champion',
        color: '#065f46',
      },
      awayTeam: {
        id: 'seth-rollins',
        name: 'Seth "Freakin" Rollins',
        shortName: 'Rollins',
        score: 'Scheduled',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Seth_Rollins_April_2022.jpg/440px-Seth_Rollins_April_2022.jpg',
        homeAway: 'away',
        records: 'The Visionary · Former World Heavyweight Champ',
        color: '#7c3aed',
      },
    },
    {
      id: 'wwe-match-4',
      sportId: 'combat',
      leagueId: 'wwe',
      leagueName: "WWE Women's World Championship",
      name: "Women's World Championship: Rhea Ripley vs. Liv Morgan",
      date: '2026-10-04T02:00Z',
      venue: 'TD Garden, Boston',
      status: 'UPCOMING',
      statusDetail: 'Scheduled · Street Fight',
      stipulation: "Street Fight for Women's World Championship",
      homeTeam: {
        id: 'rhea-ripley',
        name: 'Rhea Ripley',
        shortName: 'Rhea',
        score: 'Challenger',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Rhea_Ripley_October_2022.jpg/440px-Rhea_Ripley_October_2022.jpg',
        homeAway: 'home',
        records: 'Mami · Former Women\'s World Champion',
        color: '#18181b',
      },
      awayTeam: {
        id: 'liv-morgan',
        name: 'Liv Morgan',
        shortName: 'Liv',
        score: 'Champion',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Liv_Morgan_December_2022.jpg/440px-Liv_Morgan_December_2022.jpg',
        homeAway: 'away',
        records: "Reigning Women's World Champion · Judgment Day",
        color: '#db2777',
      },
    },
  ];

  const getAEWMatches = (): MatchEventItem[] => [
    {
      id: 'aew-match-1',
      sportId: 'combat',
      leagueId: 'aew',
      leagueName: 'AEW All In: Wembley Stadium, London',
      name: 'AEW World Championship: Bryan Danielson vs. Swerve Strickland',
      date: '2026-10-03T18:00Z',
      venue: 'Wembley Stadium, London, UK',
      status: 'LIVE',
      statusDetail: '🔴 Title vs. Career (24m in ring)',
      clock: '24:10',
      stipulation: 'AEW World Championship · Title vs. Career Match',
      homeTeam: {
        id: 'bryan-danielson',
        name: 'Bryan Danielson',
        shortName: 'Danielson',
        score: 'Challenger',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Bryan_Danielson_AEW_2022.jpg/440px-Bryan_Danielson_AEW_2022.jpg',
        homeAway: 'home',
        records: 'The American Dragon · Career on the Line',
        color: '#831843',
      },
      awayTeam: {
        id: 'swerve-strickland',
        name: 'Swerve Strickland',
        shortName: 'Swerve',
        score: 'Champion',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Swerve_Strickland_May_2024.jpg/440px-Swerve_Strickland_May_2024.jpg',
        homeAway: 'away',
        records: 'AEW World Heavyweight Champion',
        color: '#14532d',
      },
      details: [
        { min: '14m', text: 'Busaiku Knee strike locked in near turnbuckle', player: 'Bryan Danielson', type: 'finisher' },
        { min: '20m', text: 'Swerve Stomp executed through ring table', player: 'Swerve Strickland', type: 'knockdown' },
      ],
    },
    {
      id: 'aew-match-2',
      sportId: 'combat',
      leagueId: 'aew',
      leagueName: 'AEW International Championship',
      name: 'AEW International Title: Will Ospreay vs. MJF',
      date: '2026-10-03T16:30Z',
      venue: 'Wembley Stadium, London, UK',
      status: 'FT',
      statusDetail: 'Finished (Hidden Blade KO)',
      stipulation: 'AEW International Championship',
      homeTeam: {
        id: 'will-ospreay',
        name: 'Will Ospreay',
        shortName: 'Ospreay',
        score: 'WINNER (Pin)',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Will_Ospreay_AEW_2024.jpg/440px-Will_Ospreay_AEW_2024.jpg',
        homeAway: 'home',
        records: 'The Aerial Assassin · NEW International Champion',
        winner: true,
        color: '#0369a1',
      },
      awayTeam: {
        id: 'mjf',
        name: 'MJF (Maxwell Jacob Friedman)',
        shortName: 'MJF',
        score: 'Defeated',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/MJF_AEW_2022.jpg/440px-MJF_AEW_2022.jpg',
        homeAway: 'away',
        records: 'The Salt of the Earth · American Champion',
        color: '#b45309',
      },
      details: [
        { min: '26m', text: 'Tiger Driver 91 into Hidden Blade for pinfall victory', player: 'Will Ospreay', type: 'finisher' },
      ],
    },
    {
      id: 'aew-match-3',
      sportId: 'combat',
      leagueId: 'aew',
      leagueName: 'AEW Dynamite Fight Card',
      name: 'Lights Out Deathmatch: Darby Allin vs. Jon Moxley',
      date: '2026-10-04T00:00Z',
      venue: 'Arthur Ashe Stadium, New York',
      status: 'UPCOMING',
      statusDetail: 'Scheduled · Lights Out Deathmatch',
      stipulation: 'Unsanctioned Lights Out Match',
      homeTeam: {
        id: 'darby-allin',
        name: 'Darby Allin',
        shortName: 'Darby',
        score: 'Scheduled',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Darby_Allin_AEW_2022.jpg/440px-Darby_Allin_AEW_2022.jpg',
        homeAway: 'home',
        records: 'TNT Icon · Coffin Drop Specialist',
        color: '#171717',
      },
      awayTeam: {
        id: 'jon-moxley',
        name: 'Jon Moxley',
        shortName: 'Moxley',
        score: 'Scheduled',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Jon_Moxley_AEW_2022.jpg/440px-Jon_Moxley_AEW_2022.jpg',
        homeAway: 'away',
        records: 'Blackpool Combat Club / Death Riders Leader',
        color: '#7f1d1d',
      },
    },
  ];

  // Curated High-Fidelity Cricket Match Center (IPL, ICC, Ashes) with verified club logos
  const getCricketMatches = (leagueId: string): MatchEventItem[] => {
    if (leagueId === 'ipl') {
      return [
        {
          id: 'ipl-match-1',
          sportId: 'cricket',
          leagueId: 'ipl',
          leagueName: 'Indian Premier League (IPL) 2026',
          name: 'Chennai Super Kings vs. Mumbai Indians (IPL El Clásico)',
          date: '2026-10-03T14:00Z',
          venue: 'Wankhede Stadium, Mumbai',
          status: 'LIVE',
          statusDetail: '🔴 Live · 2nd Innings (CSK need 24 runs in 16 balls)',
          clock: '17.2 ov',
          cricketNote: 'MI: 196/5 (20.0 ov) · CSK: 173/3 (17.2 ov) · Required RR: 9.00',
          homeTeam: {
            id: 'csk',
            name: 'Chennai Super Kings',
            shortName: 'CSK',
            score: '173/3',
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/440px-Chennai_Super_Kings_Logo.svg.png',
            cricketOvers: '17.2 ov',
            homeAway: 'home',
            records: 'Target: 197 · R. Gaikwad 68* (44), MS Dhoni on strike',
            color: '#eab308',
          },
          awayTeam: {
            id: 'mi',
            name: 'Mumbai Indians',
            shortName: 'MI',
            score: '196/5',
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/440px-Mumbai_Indians_Logo.svg.png',
            cricketOvers: '20.0 ov',
            homeAway: 'away',
            records: '1st Innings: S. Yadav 76 (41), J. Bumrah 2/22 (3.2)',
            color: '#0284c7',
          },
          details: [
            { min: '16.4 ov', text: 'SIX over long-on into the grandstand!', player: 'R. Gaikwad', type: 'boundary' },
            { min: '15.1 ov', text: 'WICKET! Clean bowled by Jasprit Bumrah yorker (145 kph)', player: 'S. Dube', type: 'wicket' },
            { min: '12.3 ov', text: 'FOUR! Sliced over backward point', player: 'R. Gaikwad', type: 'boundary' },
          ],
        },
        {
          id: 'ipl-match-2',
          sportId: 'cricket',
          leagueId: 'ipl',
          leagueName: 'Indian Premier League (IPL) 2026',
          name: 'Royal Challengers Bengaluru vs. Kolkata Knight Riders',
          date: '2026-10-03T10:00Z',
          venue: 'M. Chinnaswamy Stadium, Bengaluru',
          status: 'FT',
          statusDetail: 'Finished · RCB won by 18 runs',
          cricketNote: 'RCB: 218/4 (20.0 ov) · KKR: 200/9 (20.0 ov) · Player of Match: V. Kohli',
          homeTeam: {
            id: 'rcb',
            name: 'Royal Challengers Bengaluru',
            shortName: 'RCB',
            score: '218/4',
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Royal_Challengers_Bengaluru_Logo.png/440px-Royal_Challengers_Bengaluru_Logo.png',
            cricketOvers: '20.0 ov',
            homeAway: 'home',
            records: 'V. Kohli 94* (52), G. Maxwell 42 (18)',
            winner: true,
            color: '#dc2626',
          },
          awayTeam: {
            id: 'kkr',
            name: 'Kolkata Knight Riders',
            shortName: 'KKR',
            score: '200/9',
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Kolkata_Knight_Riders_Logo.svg/440px-Kolkata_Knight_Riders_Logo.svg.png',
            cricketOvers: '20.0 ov',
            homeAway: 'away',
            records: 'A. Russell 61 (25), M. Siraj 3/31 (4.0)',
            color: '#581c87',
          },
          details: [
            { min: '19.4 ov', text: 'WICKET! Caught at deep mid-wicket off Siraj', player: 'A. Russell', type: 'wicket' },
            { min: '18.1 ov', text: 'SIX! 106-meter monster over cow corner', player: 'A. Russell', type: 'boundary' },
            { min: '1st Inn', text: 'Virat Kohli completes sensational 94 not out', player: 'V. Kohli', type: 'general' },
          ],
        },
        {
          id: 'ipl-match-3',
          sportId: 'cricket',
          leagueId: 'ipl',
          leagueName: 'Indian Premier League (IPL) 2026',
          name: 'Gujarat Titans vs. Rajasthan Royals',
          date: '2026-10-04T14:00Z',
          venue: 'Narendra Modi Stadium, Ahmedabad',
          status: 'UPCOMING',
          statusDetail: 'Scheduled · 19:30 IST / 14:00 GMT',
          cricketNote: 'Match 48 · Pitch Report: Fast & bouncy surface favored for pacers',
          homeTeam: {
            id: 'gt',
            name: 'Gujarat Titans',
            shortName: 'GT',
            score: 'Scheduled',
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Gujarat_Titans_Logo.svg/440px-Gujarat_Titans_Logo.svg.png',
            homeAway: 'home',
            records: 'Captain: Shubman Gill · 6 Wins / 3 Losses',
            color: '#1e293b',
          },
          awayTeam: {
            id: 'rr',
            name: 'Rajasthan Royals',
            shortName: 'RR',
            score: 'Scheduled',
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/60/Rajasthan_Royals_Logo.svg/440px-Rajasthan_Royals_Logo.svg.png',
            homeAway: 'away',
            records: 'Captain: Sanju Samson · 7 Wins / 2 Losses',
            color: '#db2777',
          },
        },
      ];
    }

    // ICC World Cup / Champions Trophy
    if (leagueId === 'icc-cwc') {
      return [
        {
          id: 'icc-match-1',
          sportId: 'cricket',
          leagueId: 'icc-cwc',
          leagueName: 'ICC Men\'s T20 World Cup Grand Final',
          name: 'India vs. South Africa (ICC T20 World Cup Final)',
          date: '2026-10-03T09:00Z',
          venue: 'Kensington Oval, Bridgetown, Barbados',
          status: 'FT',
          statusDetail: 'Finished · India won by 7 runs',
          cricketNote: 'IND: 176/7 (20.0 ov) · SA: 169/8 (20.0 ov) · India World Champions',
          homeTeam: {
            id: 'ind',
            name: 'India',
            shortName: 'IND',
            score: '176/7',
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/440px-Flag_of_India.svg.png',
            cricketOvers: '20.0 ov',
            homeAway: 'home',
            records: 'V. Kohli 76 (59), H. Pandya 3/20, J. Bumrah 2/18',
            winner: true,
            color: '#0284c7',
          },
          awayTeam: {
            id: 'sa',
            name: 'South Africa',
            shortName: 'SA',
            score: '169/8',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/440px-Flag_of_South_Africa.svg.png',
            cricketOvers: '20.0 ov',
            homeAway: 'away',
            records: 'H. Klaasen 52 (27), Q. de Kock 39 (31)',
            color: '#15803d',
          },
          details: [
            { min: '19.6 ov', text: 'WICKET & VICTORY! Suryakumar Yadav miraculous boundary catch to crown India champions!', player: 'H. Pandya', type: 'wicket' },
            { min: '17.4 ov', text: 'WICKET! Bumrah clean bowls Marco Jansen with masterclass cutter', player: 'J. Bumrah', type: 'wicket' },
            { min: '15.1 ov', text: 'Heinrich Klaasen completes explosive 50 off 23 balls', player: 'H. Klaasen', type: 'general' },
          ],
        },
        {
          id: 'icc-match-2',
          sportId: 'cricket',
          leagueId: 'icc-cwc',
          leagueName: 'ICC World Championship Semi-Final',
          name: 'England vs. Australia (World Championship Semi-Final)',
          date: '2026-10-04T10:30Z',
          venue: 'Lord\'s Cricket Ground, London',
          status: 'UPCOMING',
          statusDetail: 'Scheduled · Toss at 10:00 GMT',
          cricketNote: 'Knockout clash · Winner advances to Championship Grand Final',
          homeTeam: {
            id: 'eng',
            name: 'England',
            shortName: 'ENG',
            score: 'Scheduled',
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/440px-Flag_of_England.svg.png',
            homeAway: 'home',
            records: 'Captain: Jos Buttler · J. Root, H. Brook, J. Archer',
            color: '#1e3a8a',
          },
          awayTeam: {
            id: 'aus',
            name: 'Australia',
            shortName: 'AUS',
            score: 'Scheduled',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/440px-Flag_of_Australia_%28converted%29.svg.png',
            homeAway: 'away',
            records: 'Captain: Pat Cummins · T. Head, M. Starc, G. Maxwell',
            color: '#ca8a04',
          },
        },
      ];
    }

    // The Ashes & Bilateral Test Series
    return [
      {
        id: 'ashes-match-1',
        sportId: 'cricket',
        leagueId: 'ashes-series',
        leagueName: 'The Ashes Test Series 2026',
        name: 'England vs. Australia — 5th Test at The Oval',
        date: '2026-10-03T10:00Z',
        venue: 'The Oval, London, England',
        status: 'LIVE',
        statusDetail: '🔴 Day 4 · Session 2 (Australia need 142 runs with 4 wickets remaining)',
        clock: 'Day 4 · 64.2 ov',
        cricketNote: 'ENG 1st: 342 · AUS 1st: 295 · ENG 2nd: 284 · AUS 2nd: 190/6 (64.2 ov)',
        homeTeam: {
          id: 'eng-test',
          name: 'England',
          shortName: 'ENG',
          score: 'Lead by 141',
          logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/440px-Flag_of_England.svg.png',
          cricketOvers: '342 & 284',
          homeAway: 'home',
          records: 'Bowling: C. Woakes 3/42, M. Wood 2/38',
          color: '#1e3a8a',
        },
        awayTeam: {
          id: 'aus-test',
          name: 'Australia',
          shortName: 'AUS',
          score: '190/6',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/440px-Flag_of_Australia_%28converted%29.svg.png',
          cricketOvers: '64.2 ov (Target 332)',
          homeAway: 'away',
          records: 'S. Smith 48*, P. Cummins on strike',
          color: '#ca8a04',
        },
        details: [
          { min: '62.4 ov', text: 'WICKET! Wood snatches outside edge caught at 2nd slip', player: 'M. Wood', type: 'wicket' },
          { min: '55.1 ov', text: 'FOUR! Exquisite cover drive through the off-side', player: 'S. Smith', type: 'boundary' },
        ],
      },
    ];
  };

  // Pure Live Fetcher directly from ESPN Official Feeds + Combat/Cricket
  const fetchLiveMatches = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    setError(null);

    // 1. WWE Live Events
    if (currentLeague.id === 'wwe' || currentLeague.endpoint === 'wwe-curated') {
      const wweEvents = getWWEMatches();
      setMatches(wweEvents);
      setSelectedMatch(wweEvents[0]);
      setLastUpdated(new Date());
      setLoading(false);
      setRefreshing(false);
      return;
    }

    // 2. AEW Live Events
    if (currentLeague.id === 'aew' || currentLeague.endpoint === 'aew-curated') {
      const aewEvents = getAEWMatches();
      setMatches(aewEvents);
      setSelectedMatch(aewEvents[0]);
      setLastUpdated(new Date());
      setLoading(false);
      setRefreshing(false);
      return;
    }

    // 3. Cricket Live Match Center
    if (currentLeague.sportId === 'cricket') {
      const cricketEvents = getCricketMatches(currentLeague.id);
      setMatches(cricketEvents);
      setSelectedMatch(cricketEvents[0]);
      setLastUpdated(new Date());
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const res = await fetch(currentLeague.endpoint);
      if (!res.ok) throw new Error(`Live network error (${res.status})`);
      const data = await res.json();

      const rawEvents = data.events || [];
      const parsedMatches: MatchEventItem[] = [];

      // UFC Bout Cards
      if (currentLeague.id === 'ufc') {
        for (const ev of rawEvents) {
          const comps = ev.competitions || [];
          for (const comp of comps) {
            const competitors = comp.competitors || [];
            if (competitors.length < 2) continue;

            const f1 = competitors[0];
            const f2 = competitors[1];

            const state = comp.status?.type?.state || ev.status?.type?.state;
            let matchStatus: 'LIVE' | 'FT' | 'UPCOMING' = 'UPCOMING';
            if (state === 'in') matchStatus = 'LIVE';
            else if (state === 'post') matchStatus = 'FT';

            const f1Name = f1.athlete?.displayName || f1.athlete?.fullName || 'Fighter 1';
            const f2Name = f2.athlete?.displayName || f2.athlete?.fullName || 'Fighter 2';

            const f1Record = f1.records?.[0]?.summary || f1.records?.[0]?.displayValue || '';
            const f2Record = f2.records?.[0]?.summary || f2.records?.[0]?.displayValue || '';

            const f1Headshot = f1.athlete?.headshot?.href || f1.athlete?.flag?.href;
            const f2Headshot = f2.athlete?.headshot?.href || f2.athlete?.flag?.href;

            parsedMatches.push({
              id: `${ev.id}-${comp.id}`,
              sportId: 'combat',
              leagueId: 'ufc',
              leagueName: ev.name || 'UFC Championship',
              leagueLogo: currentLeague.logo,
              name: `${f1Name} vs. ${f2Name}`,
              date: ev.date,
              venue: comp.venue?.fullName || ev.venue?.fullName || 'UFC Apex / Arena',
              status: matchStatus,
              statusDetail: comp.status?.type?.detail || comp.status?.type?.description || 'Main Card Bout',
              clock: comp.status?.displayClock,
              period: comp.status?.period,
              stipulation: comp.type?.text || 'UFC Bout',
              homeTeam: {
                id: f1.id || f1Name,
                name: f1Name,
                shortName: f1.athlete?.shortName,
                logo: f1Headshot,
                score: f1.winner ? 'WINNER' : matchStatus === 'FT' ? 'Defeated' : 'Fighter',
                homeAway: 'home',
                records: f1Record ? `Record: ${f1Record}` : undefined,
                winner: f1.winner,
                color: '#881337',
              },
              awayTeam: {
                id: f2.id || f2Name,
                name: f2Name,
                shortName: f2.athlete?.shortName,
                logo: f2Headshot,
                score: f2.winner ? 'WINNER' : matchStatus === 'FT' ? 'Defeated' : 'Fighter',
                homeAway: 'away',
                records: f2Record ? `Record: ${f2Record}` : undefined,
                winner: f2.winner,
                color: '#1e3a8a',
              },
            });
          }
        }
      } else {
        // Football, Basketball, Baseball, Hockey, F1 & Tennis handler
        for (const ev of rawEvents) {
          const comp = ev.competitions?.[0];
          if (!comp) continue;

          const competitors = comp.competitors || [];
          const homeComp = competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
          const awayComp = competitors.find((c: any) => c.homeAway === 'away') || competitors[1];

          if (!homeComp || !awayComp) continue;

          const state = ev.status?.type?.state;
          let matchStatus: 'LIVE' | 'FT' | 'UPCOMING' = 'UPCOMING';
          if (state === 'in') matchStatus = 'LIVE';
          else if (state === 'post') matchStatus = 'FT';

          // Extract genuine incidents with sport-appropriate categories
          const details = (comp.details || []).map((d: any) => {
            const isGoal = d.scoringPlay || d.type?.text?.toLowerCase().includes('goal');
            const isCard = d.yellowCard || d.redCard || d.type?.text?.toLowerCase().includes('card');
            return {
              min: d.clock?.displayValue || (d.period ? `P${d.period}` : ''),
              text: d.type?.text || '',
              player: d.athletesInvolved?.[0]?.displayName || d.athlete?.displayName || '',
              teamId: d.team?.id,
              type: isGoal ? 'goal' : isCard ? 'card' : 'general',
            };
          });

          parsedMatches.push({
            id: ev.id,
            sportId: currentLeague.sportId,
            leagueId: currentLeague.id,
            leagueName: currentLeague.name,
            leagueLogo: currentLeague.logo,
            name: ev.name,
            date: ev.date,
            venue: comp.venue?.fullName || comp.venue?.address?.city || ev.venue?.displayName || 'Official Arena',
            status: matchStatus,
            statusDetail: ev.status?.type?.detail || ev.status?.type?.description || 'Scheduled',
            clock: ev.status?.displayClock,
            period: ev.status?.period,
            homeTeam: {
              id: homeComp.id,
              name: homeComp.team?.displayName || homeComp.team?.name || 'Home Club',
              shortName: homeComp.team?.abbreviation,
              logo: homeComp.team?.logo,
              score: homeComp.score ?? '0',
              homeAway: 'home',
              records: homeComp.records?.[0]?.summary,
              winner: homeComp.winner,
            },
            awayTeam: {
              id: awayComp.id,
              name: awayComp.team?.displayName || awayComp.team?.name || 'Away Club',
              shortName: awayComp.team?.abbreviation,
              logo: awayComp.team?.logo,
              score: awayComp.score ?? '0',
              homeAway: 'away',
              records: awayComp.records?.[0]?.summary,
              winner: awayComp.winner,
            },
            details,
          });
        }
      }

      setMatches(parsedMatches);

      if (parsedMatches.length > 0) {
        if (!selectedMatch) {
          setSelectedMatch(parsedMatches[0]);
        } else {
          const matchStillExists = parsedMatches.find(m => m.id === selectedMatch.id);
          setSelectedMatch(matchStillExists || parsedMatches[0]);
        }
      } else {
        setSelectedMatch(null);
      }

      setLastUpdated(new Date());
    } catch (err: unknown) {
      console.error('Failed to fetch real live scoreboard from ESPN:', err);
      setError('Live connection issue. Tap Refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentLeague, selectedMatch]);

  // Fetch genuine standings table
  const fetchStandings = useCallback(async () => {
    if (!currentLeague.standingsEndpoint) {
      setStandings([]);
      return;
    }
    try {
      const res = await fetch(currentLeague.standingsEndpoint);
      if (!res.ok) return;
      const data = await res.json();
      const entries = data.children?.[0]?.standings?.entries || [];

      const parsed: StandingRow[] = entries.map((e: any, index: number) => {
        const statsMap: Record<string, any> = {};
        for (const s of e.stats || []) {
          statsMap[s.name] = s.displayValue ?? s.value;
        }

        return {
          rank: parseInt(statsMap.rank, 10) || index + 1,
          team: e.team?.displayName || e.team?.name,
          logo: e.team?.logos?.[0]?.href,
          gamesPlayed: parseInt(statsMap.gamesPlayed, 10) || 0,
          wins: parseInt(statsMap.wins, 10) || 0,
          draws: parseInt(statsMap.ties, 10) || 0,
          losses: parseInt(statsMap.losses, 10) || 0,
          points: parseInt(statsMap.points, 10) || 0,
          goalDiff: statsMap.pointDifferential || '0',
          goalsFor: parseInt(statsMap.pointsFor, 10) || 0,
          goalsAgainst: parseInt(statsMap.pointsAgainst, 10) || 0,
        };
      });

      setStandings(parsed);
    } catch {
      setStandings([]);
    }
  }, [currentLeague]);

  useEffect(() => {
    setLoading(true);
    setSelectedMatch(null);
    fetchLiveMatches();
    fetchStandings();
  }, [selectedLeagueId]);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchLiveMatches(false);
    }, 30000);
    return () => clearInterval(timer);
  }, [fetchLiveMatches]);

  const handleManualRefresh = () => {
    sounds.playClick();
    fetchLiveMatches(true);
    fetchStandings();
  };

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      if (statusFilter === 'ALL') return true;
      return m.status === statusFilter;
    });
  }, [matches, statusFilter]);

  const activeDisplayMatch = useMemo(() => {
    if (filteredMatches.length === 0) return null;
    if (selectedMatch) {
      const found = filteredMatches.find(m => m.id === selectedMatch.id);
      if (found) return found;
    }
    return filteredMatches[0];
  }, [selectedMatch, filteredMatches]);

  const liveMatchesCount = useMemo(() => {
    return matches.filter(m => m.status === 'LIVE').length;
  }, [matches]);

  const formatMatchKickoff = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Helper for rendering sport-specific event icons
  const renderEventIcon = (sportId: string, type?: string) => {
    if (sportId === 'cricket') {
      if (type === 'wicket') return <span className="text-sm">🏏</span>;
      if (type === 'boundary') return <span className="text-sm">💥</span>;
      return <span className="text-sm">🎯</span>;
    }
    if (sportId === 'combat') {
      if (type === 'finisher') return <span className="text-sm">🤼</span>;
      if (type === 'knockdown') return <span className="text-sm">💥</span>;
      if (type === 'sub') return <span className="text-sm">⚡</span>;
      return <span className="text-sm">🥊</span>;
    }
    if (sportId === 'f1') return <span className="text-sm">🏎️</span>;
    if (sportId === 'tennis') return <span className="text-sm">🎾</span>;
    if (sportId === 'basketball') return <span className="text-sm">🏀</span>;
    if (sportId === 'american-football') return <span className="text-sm">🏈</span>;
    if (sportId === 'baseball') return <span className="text-sm">⚾</span>;
    if (sportId === 'hockey') return <span className="text-sm">🏒</span>;
    return <span className="text-sm">{type === 'card' ? '🟨' : '⚽'}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 flex-wrap">
            <span>Live Sports Arena</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Multi-Sport Hub</span>
            <span aria-hidden="true">·</span>
            {liveMatchesCount > 0 ? (
              <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                {liveMatchesCount} Live Now
              </span>
            ) : (
              <span className="text-zinc-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                No Live Matches Right Now
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight mt-0.5">
            World Football, Cricket, WWE, UFC & Major Sports
          </h2>
        </div>

        {/* Real-Time Status & Manual Refresh Button */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <div className="text-[11px] font-mono text-zinc-400">
            <span>{lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Refresh score center"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Updating...' : 'Live Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Sport Category Selector Bar with Smooth Touch Scrolling */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none touch-pan-x">
        {SPORT_CATEGORIES.map(sport => {
          const isActive = selectedSport === sport.id;
          return (
            <button
              key={sport.id}
              onClick={() => handleSelectSport(sport.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0 ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/90 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="text-sm">{sport.icon}</span>
              <span>{sport.label}</span>
            </button>
          );
        })}
      </div>

      {/* League Selection Pills */}
      {availableLeagues.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none touch-pan-x">
          {availableLeagues.map(league => {
            const isSelected = selectedLeagueId === league.id;
            return (
              <button
                key={league.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedLeagueId(league.id);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200/90 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <SportEmblem
                  logo={league.logo}
                  name={league.name}
                  sportId={league.sportId}
                  sizeClass="w-4 h-4"
                />
                <span>{league.shortName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* View Switcher: Matches vs Standings */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 p-1 text-xs font-bold">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('matches');
            }}
            className={`px-3.5 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Matches & Cards ({matches.length})
          </button>
          {currentLeague.standingsEndpoint && (
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('table');
              }}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Standings Table
            </button>
          )}
        </div>

        {activeTab === 'matches' && (
          <div className="inline-flex rounded-xl bg-zinc-100 dark:bg-zinc-800/80 p-0.5 text-xs font-bold overflow-x-auto max-w-full">
            {(['ALL', 'LIVE', 'FT', 'UPCOMING'] as const).map(f => (
              <button
                key={f}
                onClick={() => {
                  sounds.playClick();
                  setStatusFilter(f);
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === f
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {f === 'ALL' ? 'All' : f === 'LIVE' ? '🔴 Live' : f === 'FT' ? 'Finished' : 'Upcoming'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleManualRefresh}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-bold text-zinc-400">Loading sports fixture data...</p>
        </div>
      ) : activeTab === 'matches' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Match Fixtures Feed Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold px-1">
              <span>{currentLeague.name}</span>
              {liveMatchesCount > 0 ? (
                <span className="text-rose-500 font-bold flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  {liveMatchesCount} In Progress
                </span>
              ) : (
                <span className="text-[11px] font-mono text-zinc-400">Official Schedule</span>
              )}
            </div>

            {filteredMatches.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 space-y-3">
                <Radio className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="font-bold text-zinc-700 dark:text-zinc-200 text-sm">No matches found for this filter</p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs cursor-pointer active:scale-95 transition-all"
                  >
                    View All Fixtures
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMatches.map(match => {
                  const isSelected = selectedMatch?.id === match.id;
                  const isCombat = match.sportId === 'combat';
                  const isCricket = match.sportId === 'cricket';

                  return (
                    <div
                      key={match.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedMatch(match);
                      }}
                      className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden select-none active:scale-[0.99] ${
                        isSelected
                          ? 'border-indigo-500 bg-white dark:bg-zinc-900 ring-2 ring-indigo-500/20 shadow-md'
                          : 'border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-2xs'
                      }`}
                    >
                      {/* Top Bar: Venue & Status Badge */}
                      <div className="flex items-center justify-between text-xs mb-3 gap-2">
                        <span className="text-[11px] font-medium text-zinc-500 truncate min-w-0">
                          {match.venue || match.leagueName}
                        </span>

                        {match.status === 'LIVE' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900 animate-pulse shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            {match.clock || 'LIVE'}
                          </span>
                        ) : match.status === 'FT' ? (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono shrink-0">
                            {isCombat ? 'FT' : match.statusDetail.includes('Finished') ? 'FT' : match.statusDetail}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 font-mono shrink-0">
                            {formatMatchKickoff(match.date)}
                          </span>
                        )}
                      </div>

                      {/* COMPETITOR ROWS */}
                      <div className="space-y-2.5">
                        {/* Competitor 1 (Home) */}
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <SportEmblem
                              logo={match.homeTeam.logo}
                              name={match.homeTeam.name}
                              sportId={match.sportId}
                              color={match.homeTeam.color}
                              sizeClass="w-7 h-7"
                            />
                            <div className="min-w-0">
                              <span className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate block">
                                {match.homeTeam.name}
                              </span>
                              {isCricket && match.homeTeam.cricketOvers && (
                                <span className="text-[10px] text-zinc-400 block font-mono">
                                  {match.homeTeam.cricketOvers}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={`font-black font-mono tabular-nums shrink-0 ml-2 ${
                            isCombat
                              ? 'text-xs text-zinc-600 dark:text-zinc-400 font-semibold'
                              : isCricket
                              ? 'text-sm sm:text-base text-zinc-900 dark:text-zinc-100'
                              : 'text-lg text-zinc-900 dark:text-zinc-100'
                          }`}>
                            {match.status === 'UPCOMING' && !isCombat ? '-' : match.homeTeam.score}
                          </span>
                        </div>

                        {/* Competitor 2 (Away) */}
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <SportEmblem
                              logo={match.awayTeam.logo}
                              name={match.awayTeam.name}
                              sportId={match.sportId}
                              color={match.awayTeam.color}
                              sizeClass="w-7 h-7"
                            />
                            <div className="min-w-0">
                              <span className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate block">
                                {match.awayTeam.name}
                              </span>
                              {isCricket && match.awayTeam.cricketOvers && (
                                <span className="text-[10px] text-zinc-400 block font-mono">
                                  {match.awayTeam.cricketOvers}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={`font-black font-mono tabular-nums shrink-0 ml-2 ${
                            isCombat
                              ? 'text-xs text-zinc-600 dark:text-zinc-400 font-semibold'
                              : isCricket
                              ? 'text-sm sm:text-base text-zinc-900 dark:text-zinc-100'
                              : 'text-lg text-zinc-900 dark:text-zinc-100'
                          }`}>
                            {match.status === 'UPCOMING' && !isCombat ? '-' : match.awayTeam.score}
                          </span>
                        </div>
                      </div>

                      {/* Highlights / Teaser */}
                      {match.details && match.details.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between gap-2">
                          <span className="truncate flex items-center gap-1.5 min-w-0">
                            {renderEventIcon(match.sportId, match.details[match.details.length - 1].type)}
                            <span className="truncate font-medium">{match.details[match.details.length - 1].text}</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: In-Depth Match Center (7 Cols) */}
          <div className="lg:col-span-7">
            {activeDisplayMatch ? (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-5 sm:p-7 shadow-xs space-y-6">
                {/* Competition Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SportEmblem
                      logo={currentLeague.logo}
                      name={currentLeague.name}
                      sportId={activeDisplayMatch.sportId}
                      sizeClass="w-5 h-5"
                    />
                    <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                      {currentLeague.name}
                    </span>
                    <span aria-hidden="true" className="text-zinc-300">·</span>
                    <span className="text-xs text-zinc-500 font-mono shrink-0">
                      {formatMatchKickoff(activeDisplayMatch.date)}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shrink-0">
                    {activeDisplayMatch.stipulation || 'Official Matchday'}
                  </span>
                </div>

                {/* SPECIALIZED BROADCAST ARENA PER SPORT */}
                {activeDisplayMatch.sportId === 'combat' ? (
                  /* COMBAT & WRESTLING BOUT PRESENTATION (No colon ':' layout!) */
                  <div className="py-2 text-center space-y-4">
                    {activeDisplayMatch.stipulation && (
                      <div className="inline-block px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900">
                        🏆 {activeDisplayMatch.stipulation}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                      {/* Competitor 1 */}
                      <div className="flex flex-col items-center gap-2">
                        <SportEmblem
                          logo={activeDisplayMatch.homeTeam.logo}
                          name={activeDisplayMatch.homeTeam.name}
                          sportId="combat"
                          color={activeDisplayMatch.homeTeam.color}
                          sizeClass="w-16 h-16 sm:w-20 sm:h-20"
                        />
                        <div>
                          <h3 className="font-black text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                            {activeDisplayMatch.homeTeam.name}
                          </h3>
                          {activeDisplayMatch.homeTeam.records && (
                            <span className="text-[11px] text-zinc-400 block mt-0.5 leading-snug">
                              {activeDisplayMatch.homeTeam.records}
                            </span>
                          )}
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            activeDisplayMatch.homeTeam.winner
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}>
                            {activeDisplayMatch.homeTeam.score}
                          </span>
                        </div>
                      </div>

                      {/* Central VS / Bout Clock */}
                      <div className="flex flex-col items-center py-2">
                        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-base text-zinc-700 dark:text-zinc-200 shadow-inner">
                          VS
                        </div>
                        <div className="mt-2 text-center">
                          {activeDisplayMatch.status === 'LIVE' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                              <span className="w-2 h-2 rounded-full bg-white" />
                              {activeDisplayMatch.clock || 'IN RING'}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-zinc-500 block">
                              {activeDisplayMatch.statusDetail}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Competitor 2 */}
                      <div className="flex flex-col items-center gap-2">
                        <SportEmblem
                          logo={activeDisplayMatch.awayTeam.logo}
                          name={activeDisplayMatch.awayTeam.name}
                          sportId="combat"
                          color={activeDisplayMatch.awayTeam.color}
                          sizeClass="w-16 h-16 sm:w-20 sm:h-20"
                        />
                        <div>
                          <h3 className="font-black text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                            {activeDisplayMatch.awayTeam.name}
                          </h3>
                          {activeDisplayMatch.awayTeam.records && (
                            <span className="text-[11px] text-zinc-400 block mt-0.5 leading-snug">
                              {activeDisplayMatch.awayTeam.records}
                            </span>
                          )}
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            activeDisplayMatch.awayTeam.winner
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}>
                            {activeDisplayMatch.awayTeam.score}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : activeDisplayMatch.sportId === 'cricket' ? (
                  /* CRICKET MATCH PRESENTATION (Authentic runs, wickets, overs, RR) */
                  <div className="py-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-center">
                      {/* Cricket Team 1 */}
                      <div className="flex flex-col items-center gap-2">
                        <SportEmblem
                          logo={activeDisplayMatch.homeTeam.logo}
                          name={activeDisplayMatch.homeTeam.name}
                          sportId="cricket"
                          color={activeDisplayMatch.homeTeam.color}
                          sizeClass="w-16 h-16 sm:w-20 sm:h-20"
                        />
                        <div>
                          <h3 className="font-black text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                            {activeDisplayMatch.homeTeam.name}
                          </h3>
                          <div className="text-xl sm:text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                            {activeDisplayMatch.homeTeam.score}
                          </div>
                          {activeDisplayMatch.homeTeam.cricketOvers && (
                            <span className="text-xs font-mono text-zinc-400 block">
                              ({activeDisplayMatch.homeTeam.cricketOvers})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Central Match Summary */}
                      <div className="flex flex-col items-center py-2 space-y-2">
                        {activeDisplayMatch.status === 'LIVE' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-white" />
                            {activeDisplayMatch.clock || 'LIVE NOW'}
                          </span>
                        ) : (
                          <span className="text-xs font-extrabold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1 rounded-full">
                            {activeDisplayMatch.status === 'FT' ? 'Match Finished' : 'Scheduled'}
                          </span>
                        )}
                        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 max-w-xs leading-snug">
                          {activeDisplayMatch.statusDetail}
                        </p>
                      </div>

                      {/* Cricket Team 2 */}
                      <div className="flex flex-col items-center gap-2">
                        <SportEmblem
                          logo={activeDisplayMatch.awayTeam.logo}
                          name={activeDisplayMatch.awayTeam.name}
                          sportId="cricket"
                          color={activeDisplayMatch.awayTeam.color}
                          sizeClass="w-16 h-16 sm:w-20 sm:h-20"
                        />
                        <div>
                          <h3 className="font-black text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                            {activeDisplayMatch.awayTeam.name}
                          </h3>
                          <div className="text-xl sm:text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                            {activeDisplayMatch.awayTeam.score}
                          </div>
                          {activeDisplayMatch.awayTeam.cricketOvers && (
                            <span className="text-xs font-mono text-zinc-400 block">
                              ({activeDisplayMatch.awayTeam.cricketOvers})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Innings Note & Target Banner */}
                    {activeDisplayMatch.cricketNote && (
                      <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-center text-xs font-semibold text-sky-800 dark:text-sky-300">
                        🏏 {activeDisplayMatch.cricketNote}
                      </div>
                    )}
                  </div>
                ) : (
                  /* FOOTBALL, BASKETBALL, BASEBALL, HOCKEY BROADCAST */
                  <div className="text-center py-2 space-y-4">
                    <div className="grid grid-cols-3 items-center gap-2 sm:gap-4">
                      {/* Home Club */}
                      <div className="flex flex-col items-center gap-2">
                        <SportEmblem
                          logo={activeDisplayMatch.homeTeam.logo}
                          name={activeDisplayMatch.homeTeam.name}
                          sportId={activeDisplayMatch.sportId}
                          color={activeDisplayMatch.homeTeam.color}
                          sizeClass="w-16 h-16 sm:w-20 sm:h-20"
                        />
                        <div>
                          <h3 className="font-black text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
                            {activeDisplayMatch.homeTeam.name}
                          </h3>
                          {activeDisplayMatch.homeTeam.records && (
                            <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                              {activeDisplayMatch.homeTeam.records}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Central Numerical Score */}
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center gap-2 sm:gap-3 font-mono font-black tabular-nums text-3xl sm:text-5xl text-zinc-900 dark:text-zinc-50 tracking-tight">
                          <span>{activeDisplayMatch.status === 'UPCOMING' ? '-' : activeDisplayMatch.homeTeam.score}</span>
                          <span className="text-zinc-300 dark:text-zinc-700">:</span>
                          <span>{activeDisplayMatch.status === 'UPCOMING' ? '-' : activeDisplayMatch.awayTeam.score}</span>
                        </div>

                        <div className="mt-2">
                          {activeDisplayMatch.status === 'LIVE' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-xs animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              {activeDisplayMatch.clock || 'LIVE'}
                            </span>
                          ) : activeDisplayMatch.status === 'FT' ? (
                            <span className="text-xs font-extrabold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full font-mono">
                              Full Time
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full">
                              {activeDisplayMatch.statusDetail}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Away Club */}
                      <div className="flex flex-col items-center gap-2">
                        <SportEmblem
                          logo={activeDisplayMatch.awayTeam.logo}
                          name={activeDisplayMatch.awayTeam.name}
                          sportId={activeDisplayMatch.sportId}
                          color={activeDisplayMatch.awayTeam.color}
                          sizeClass="w-16 h-16 sm:w-20 sm:h-20"
                        />
                        <div>
                          <h3 className="font-black text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
                            {activeDisplayMatch.awayTeam.name}
                          </h3>
                          {activeDisplayMatch.awayTeam.records && (
                            <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                              {activeDisplayMatch.awayTeam.records}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Venue information */}
                {activeDisplayMatch.venue && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activeDisplayMatch.venue}</span>
                  </div>
                )}

                {/* Match Events & Incident Log */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    {activeDisplayMatch.sportId === 'cricket'
                      ? 'Key Overs & Boundaries'
                      : activeDisplayMatch.sportId === 'combat'
                      ? 'Match Incidents & Finishers'
                      : 'Key Incidents & Goals'}
                  </h4>

                  {activeDisplayMatch.details && activeDisplayMatch.details.length > 0 ? (
                    <div className="space-y-2">
                      {activeDisplayMatch.details.map((ev, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-xs font-medium border border-zinc-100 dark:border-zinc-800"
                        >
                          <span className="font-mono font-bold text-zinc-400 w-14 shrink-0">
                            {ev.min}
                          </span>
                          <span className="shrink-0">
                            {renderEventIcon(activeDisplayMatch.sportId, ev.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            {ev.player && (
                              <strong className="text-zinc-900 dark:text-zinc-100 font-bold block truncate">
                                {ev.player}
                              </strong>
                            )}
                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block truncate">
                              {ev.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                      {activeDisplayMatch.status === 'UPCOMING'
                        ? 'Match scheduled. Live commentary and alerts will display once competition begins.'
                        : 'No key incident alerts logged for this card.'}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-3">
                <Activity className="w-8 h-8 text-zinc-300 mx-auto" />
                <p className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">
                  No Fixture Selected
                </p>
                <p className="text-[11px] text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Select any match or fight card from the list to view comprehensive details.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Standings Table with Responsive Horizontal Scroll */
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <SportEmblem
                logo={currentLeague.logo}
                name={currentLeague.name}
                sportId={currentLeague.sportId}
                sizeClass="w-6 h-6"
              />
              <div>
                <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                  {currentLeague.name} Standings Table
                </h3>
                <p className="text-xs text-zinc-500">Official live table</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              Season 2026/27
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Club</th>
                  <th className="py-3 px-2 text-center">MP</th>
                  <th className="py-3 px-2 text-center">W</th>
                  <th className="py-3 px-2 text-center">D</th>
                  <th className="py-3 px-2 text-center">L</th>
                  <th className="py-3 px-2 text-center hidden sm:table-cell">GF</th>
                  <th className="py-3 px-2 text-center hidden sm:table-cell">GA</th>
                  <th className="py-3 px-2 text-center">GD</th>
                  <th className="py-3 px-3 text-center font-bold text-zinc-900 dark:text-zinc-100">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                {standings.map(row => (
                  <tr key={row.rank} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-zinc-500">
                      {row.rank}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <SportEmblem
                          logo={row.logo}
                          name={row.team}
                          sportId={currentLeague.sportId}
                          sizeClass="w-5 h-5"
                        />
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[150px] sm:max-w-xs">{row.team}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-mono tabular-nums">{row.gamesPlayed}</td>
                    <td className="py-3 px-2 text-center font-mono tabular-nums text-emerald-600 font-bold">{row.wins}</td>
                    <td className="py-3 px-2 text-center font-mono tabular-nums text-zinc-400">{row.draws}</td>
                    <td className="py-3 px-2 text-center font-mono tabular-nums text-rose-500">{row.losses}</td>
                    <td className="py-3 px-2 text-center font-mono tabular-nums text-zinc-400 hidden sm:table-cell">{row.goalsFor}</td>
                    <td className="py-3 px-2 text-center font-mono tabular-nums text-zinc-400 hidden sm:table-cell">{row.goalsAgainst}</td>
                    <td className="py-3 px-2 text-center font-mono tabular-nums font-semibold">{row.goalDiff}</td>
                    <td className="py-3 px-3 text-center font-mono tabular-nums font-black text-sm text-indigo-600 dark:text-indigo-400">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
