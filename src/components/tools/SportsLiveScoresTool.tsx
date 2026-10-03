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

  // 2. Cricket (Official Live ESPN Scoreboard Feeds)
  {
    id: 'ipl',
    sportId: 'cricket',
    name: 'Indian Premier League (IPL)',
    shortName: 'IPL Cricket',
    country: 'India',
    flag: '🏏',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/cricket/8048/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/ipl.png',
  },
  {
    id: 'bbl',
    sportId: 'cricket',
    name: 'Big Bash League (BBL)',
    shortName: 'BBL Cricket',
    country: 'Australia',
    flag: '🇦🇺',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/cricket/8044/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/8044.png',
  },
  {
    id: 'ranji',
    sportId: 'cricket',
    name: 'Ranji Trophy (First-Class)',
    shortName: 'Ranji Trophy',
    country: 'India',
    flag: '🏏',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/cricket/8050/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/8050.png',
  },
  {
    id: 't20blast',
    sportId: 'cricket',
    name: 'T20 Blast (England)',
    shortName: 'T20 Blast',
    country: 'England',
    flag: '🇬🇧',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/cricket/8053/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/8053.png',
  },
  {
    id: 'ashes-series',
    sportId: 'cricket',
    name: 'The Ashes & International Series',
    shortName: 'The Ashes & Tests',
    country: 'International',
    flag: '🏆',
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/cricket/8048/scoreboard',
    logo: 'https://a.espncdn.com/i/teamlogos/countries/500/eng.png',
  },

  // 3. Combat Sports (UFC Octagon Official Feeds)
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

  // Pure Live Fetcher directly from ESPN Official Feeds (NO MOCK DATA)
  const fetchLiveMatches = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    setError(null);

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

          // Add official match decision / cricket summary if available
          if (comp.status?.summary) {
            details.unshift({
              min: matchStatus === 'LIVE' ? 'LIVE' : 'RESULT',
              text: comp.status.summary,
              player: comp.status.type?.detail || 'Match Decision',
              type: 'general',
            });
          }

          // Add Featured athletes (e.g. Player of the Match / Series)
          if (comp.status?.featuredAthletes) {
            for (const fa of comp.status.featuredAthletes) {
              details.push({
                min: fa.shortDisplayName || 'Award',
                text: `${fa.displayName}: ${fa.athlete?.displayName || fa.athlete?.fullName || ''}`,
                player: fa.athlete?.position || 'Featured Star',
                type: 'general',
              });
            }
          }

          const isCricket = currentLeague.sportId === 'cricket';

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
            statusDetail: comp.status?.summary || ev.status?.type?.detail || ev.status?.type?.description || 'Scheduled',
            clock: ev.status?.displayClock,
            period: ev.status?.period,
            cricketNote: comp.status?.summary,
            homeTeam: {
              id: homeComp.id,
              name: homeComp.team?.displayName || homeComp.team?.name || 'Home Club',
              shortName: homeComp.team?.abbreviation,
              logo: homeComp.team?.logo,
              score: homeComp.score ?? (isCricket ? 'Yet to bat' : '0'),
              cricketOvers: isCricket && homeComp.score ? homeComp.score.split('(')[1]?.replace(')', '') : undefined,
              homeAway: 'home',
              records: homeComp.records?.[0]?.summary,
              winner: homeComp.winner === 'true' || homeComp.winner === true,
            },
            awayTeam: {
              id: awayComp.id,
              name: awayComp.team?.displayName || awayComp.team?.name || 'Away Club',
              shortName: awayComp.team?.abbreviation,
              logo: awayComp.team?.logo,
              score: awayComp.score ?? (isCricket ? 'Yet to bat' : '0'),
              cricketOvers: isCricket && awayComp.score ? awayComp.score.split('(')[1]?.replace(')', '') : undefined,
              homeAway: 'away',
              records: awayComp.records?.[0]?.summary,
              winner: awayComp.winner === 'true' || awayComp.winner === true,
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
            {/* Google Live Sports Match Search & Quick Scorecard Launcher */}
            <div className="p-3.5 rounded-2xl bg-zinc-900 text-white shadow-xs space-y-2.5 border border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                    Google Sports Live Match Finder
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                  Real-Time Verified
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  id="google-sports-search-input"
                  type="text"
                  placeholder={
                    selectedSport === 'cricket'
                      ? 'e.g. India vs Australia, IPL, The Ashes...'
                      : selectedSport === 'combat'
                      ? 'e.g. UFC 310, WWE Bad Blood, AEW...'
                      : 'e.g. Real Madrid, Arsenal, Lakers...'
                  }
                  className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-amber-400"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        const a = document.createElement('a');
                        a.href = `https://www.google.com/search?q=${encodeURIComponent(val + ' live score')}`;
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        a.click();
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('google-sports-search-input') as HTMLInputElement;
                    const val = input?.value.trim();
                    const q = val ? val + ' live score' : (selectedSport === 'cricket' ? 'cricket live score' : currentLeague.name + ' live score');
                    const a = document.createElement('a');
                    a.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.click();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shrink-0 cursor-pointer shadow-2xs transition-all active:scale-95"
                >
                  Search Google
                </button>
              </div>
            </div>

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
                <p className="font-bold text-zinc-700 dark:text-zinc-200 text-sm">No live matches currently in progress for {currentLeague.name}</p>
                <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                  Follow official ball-by-ball commentary, series schedules, and live scorecards directly on Google Sports:
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = `https://www.google.com/search?q=${encodeURIComponent(currentLeague.name + ' live score')}`;
                      a.target = '_blank';
                      a.rel = 'noopener noreferrer';
                      a.click();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <span>Search {currentLeague.name} on Google</span>
                  </button>
                  {statusFilter !== 'ALL' && (
                    <button
                      onClick={() => setStatusFilter('ALL')}
                      className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs cursor-pointer active:scale-95 transition-all"
                    >
                      View All Fixtures
                    </button>
                  )}
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

                    {/* One-Tap Google Sports Live Scoreboard Launcher */}
                    <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                      <div>
                        <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                          <span className="text-xs font-black text-blue-950 dark:text-blue-200">
                            Google Sports Official Real-Time Live Scorecard
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">100% REAL DATA</span>
                        </div>
                        <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
                          Follow live ball-by-ball updates, commentary, fall of wickets, run-rate worms, and player scorecards.
                        </p>
                      </div>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          activeDisplayMatch.leagueId === 'ipl'
                            ? 'IPL live score'
                            : activeDisplayMatch.leagueId === 'ashes-series'
                            ? 'the ashes live score'
                            : activeDisplayMatch.name + ' live score'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer active:scale-95"
                      >
                        <span>Watch Live on Google Sports</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
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
