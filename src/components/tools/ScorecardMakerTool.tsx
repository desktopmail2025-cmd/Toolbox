import React, { useState, useEffect } from 'react';
import {
  ClipboardList, Play, Pause, RotateCcw, Plus, Minus,
  Undo2, Copy, Check, Download, Share2, Award, Clock,
  Calendar, Shield, Flag, Trash2, Volume2, Search, Sparkles,
  ChevronDown, Image as ImageIcon
} from 'lucide-react';
import { sounds } from '../../utils/audio';

type SportType = 'football' | 'basketball' | 'cricket' | 'badminton' | 'tennis' | 'volleyball' | 'custom';

interface TeamPreset {
  name: string;
  shortName: string;
  logo: string;
  sport: SportType;
}

const PRESET_TEAMS: TeamPreset[] = [
  // Football World Clubs
  { name: 'Real Madrid CF', shortName: 'RMA', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png', sport: 'football' },
  { name: 'FC Barcelona', shortName: 'BAR', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png', sport: 'football' },
  { name: 'Manchester City', shortName: 'MCI', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png', sport: 'football' },
  { name: 'Arsenal FC', shortName: 'ARS', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png', sport: 'football' },
  { name: 'Liverpool FC', shortName: 'LIV', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png', sport: 'football' },
  { name: 'Bayern Munich', shortName: 'BAY', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png', sport: 'football' },
  { name: 'Paris Saint-Germain', shortName: 'PSG', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png', sport: 'football' },
  { name: 'Manchester United', shortName: 'MUN', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/360.png', sport: 'football' },
  { name: 'Inter Milan', shortName: 'INT', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/110.png', sport: 'football' },
  { name: 'Juventus FC', shortName: 'JUV', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/111.png', sport: 'football' },
  { name: 'Chelsea FC', shortName: 'CHE', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/363.png', sport: 'football' },
  { name: 'Borussia Dortmund', shortName: 'BVB', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png', sport: 'football' },
  { name: 'AC Milan', shortName: 'MIL', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/103.png', sport: 'football' },
  { name: 'Atletico Madrid', shortName: 'ATM', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png', sport: 'football' },

  // Football National Teams
  { name: 'Argentina', shortName: 'ARG', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/202.png', sport: 'football' },
  { name: 'Brazil', shortName: 'BRA', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/205.png', sport: 'football' },
  { name: 'France', shortName: 'FRA', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/474.png', sport: 'football' },
  { name: 'England', shortName: 'ENG', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/448.png', sport: 'football' },
  { name: 'Spain', shortName: 'ESP', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/164.png', sport: 'football' },
  { name: 'Germany', shortName: 'GER', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/481.png', sport: 'football' },
  { name: 'Portugal', shortName: 'POR', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/482.png', sport: 'football' },
  { name: 'Netherlands', shortName: 'NED', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/449.png', sport: 'football' },
  { name: 'Italy', shortName: 'ITA', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/115.png', sport: 'football' },

  // Basketball (NBA)
  { name: 'Los Angeles Lakers', shortName: 'LAL', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png', sport: 'basketball' },
  { name: 'Golden State Warriors', shortName: 'GSW', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png', sport: 'basketball' },
  { name: 'Boston Celtics', shortName: 'BOS', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png', sport: 'basketball' },
  { name: 'Chicago Bulls', shortName: 'CHI', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png', sport: 'basketball' },
  { name: 'Miami Heat', shortName: 'MIA', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png', sport: 'basketball' },
  { name: 'Milwaukee Bucks', shortName: 'MIL', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png', sport: 'basketball' },
];

interface MatchEvent {
  id: string;
  time: string;
  team: 'A' | 'B';
  type: string;
  detail: string;
}

export const ScorecardMakerTool: React.FC = () => {
  const [sport, setSport] = useState<SportType>('football');

  // Team A info with real logos
  const [teamAName, setTeamAName] = useState<string>('Real Madrid CF');
  const [teamAShort, setTeamAShort] = useState<string>('RMA');
  const [teamALogo, setTeamALogo] = useState<string>('https://a.espncdn.com/i/teamlogos/soccer/500/86.png');

  // Team B info with real logos
  const [teamBName, setTeamBName] = useState<string>('FC Barcelona');
  const [teamBShort, setTeamBShort] = useState<string>('BAR');
  const [teamBLogo, setTeamBLogo] = useState<string>('https://a.espncdn.com/i/teamlogos/soccer/500/83.png');

  // Modal for changing team logo/preset
  const [activePickerTeam, setActivePickerTeam] = useState<'A' | 'B' | null>(null);
  const [searchLogoQuery, setSearchLogoQuery] = useState<string>('');
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('');

  // Scores
  const [scoreA, setScoreA] = useState<number>(2);
  const [scoreB, setScoreB] = useState<number>(1);

  // Period / Half / Set
  const [period, setPeriod] = useState<string>('2nd Half');
  const [events, setEvents] = useState<MatchEvent[]>([
    { id: 'ev-1', time: '14:20', team: 'A', type: 'Goal', detail: 'V. Junior (Assist: Bellingham)' },
    { id: 'ev-2', time: '38:45', team: 'B', type: 'Goal', detail: 'L. Yamal (Curler from outside box)' },
    { id: 'ev-3', time: '67:10', team: 'A', type: 'Goal', detail: 'K. Mbappe (Penalty kick)' },
  ]);

  // Match Timer
  const [seconds, setSeconds] = useState<number>(4215); // ~70 mins
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Quick event input
  const [customEventDetail, setCustomEventDetail] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleScoreChange = (team: 'A' | 'B', delta: number) => {
    sounds.playClick();
    if (team === 'A') {
      const next = Math.max(0, scoreA + delta);
      setScoreA(next);
      if (delta > 0) {
        logEvent('A', delta === 1 ? 'Point / Goal' : `+${delta} Points`, `Scoreline: ${next} - ${scoreB}`);
      }
    } else {
      const next = Math.max(0, scoreB + delta);
      setScoreB(next);
      if (delta > 0) {
        logEvent('B', delta === 1 ? 'Point / Goal' : `+${delta} Points`, `Scoreline: ${scoreA} - ${next}`);
      }
    }
  };

  const logEvent = (team: 'A' | 'B', type: string, detail: string) => {
    const newEvent: MatchEvent = {
      id: Math.random().toString(36).substring(2, 9),
      time: formatTimer(seconds),
      team,
      type,
      detail,
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleUndoLastEvent = () => {
    sounds.playClick();
    if (events.length === 0) return;
    setEvents(prev => prev.slice(1));
  };

  const handleResetMatch = () => {
    sounds.playClick();
    if (confirm('Reset match scorecard, scoreline, and timer to zero?')) {
      setScoreA(0);
      setScoreB(0);
      setSeconds(0);
      setIsRunning(false);
      setEvents([]);
    }
  };

  const handleSelectTeamPreset = (preset: TeamPreset) => {
    sounds.playClick();
    if (activePickerTeam === 'A') {
      setTeamAName(preset.name);
      setTeamAShort(preset.shortName);
      setTeamALogo(preset.logo);
    } else if (activePickerTeam === 'B') {
      setTeamBName(preset.name);
      setTeamBShort(preset.shortName);
      setTeamBLogo(preset.logo);
    }
    setActivePickerTeam(null);
    setSearchLogoQuery('');
  };

  const handleApplyCustomLogo = () => {
    if (!customLogoUrl.trim()) return;
    sounds.playClick();
    if (activePickerTeam === 'A') {
      setTeamALogo(customLogoUrl.trim());
    } else if (activePickerTeam === 'B') {
      setTeamBLogo(customLogoUrl.trim());
    }
    setCustomLogoUrl('');
    setActivePickerTeam(null);
  };

  const handleCopyReport = () => {
    sounds.playSuccess();
    const report = `🏆 OFFICIAL MATCH SCORECARD
Sport: ${sport.toUpperCase()}
Period: ${period}
Match Time: ${formatTimer(seconds)}

Result:
${teamAName} (${teamAShort}) [${scoreA}] - [${scoreB}] ${teamBName} (${teamBShort})

Timeline Log:
${events.map(e => `[${e.time}] ${e.team === 'A' ? teamAName : teamBName} · ${e.type}: ${e.detail}`).join('\n') || 'No major events logged.'}
    `;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredPresets = PRESET_TEAMS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchLogoQuery.toLowerCase()) ||
                          t.shortName.toLowerCase().includes(searchLogoQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Sport Selector Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
            <span>Scorecard Hub</span>
            <span aria-hidden="true">·</span>
            <span>Broadcast Grade</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Real Team Crests</span>
          </div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight mt-0.5">
            Universal Match Referee & Live Scorecard
          </h2>
        </div>

        {/* Sport Switcher Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'football', label: 'Football', periods: ['1st Half', '2nd Half', 'Extra Time', 'Penalties'] },
            { id: 'basketball', label: 'Basketball', periods: ['Q1', 'Q2', 'Q3', 'Q4', 'Overtime'] },
            { id: 'cricket', label: 'Cricket', periods: ['1st Innings', '2nd Innings'] },
            { id: 'tennis', label: 'Tennis', periods: ['Set 1', 'Set 2', 'Set 3', 'Set 4', 'Set 5'] },
            { id: 'badminton', label: 'Badminton', periods: ['Set 1', 'Set 2', 'Set 3'] },
            { id: 'custom', label: 'Custom', periods: ['Period 1', 'Period 2', 'Period 3'] },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => {
                sounds.playClick();
                setSport(s.id as SportType);
                setPeriod(s.periods[0]);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                sport === s.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs ring-2 ring-indigo-500/20'
                  : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/60 hover:bg-zinc-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Broadcast Scoreboard */}
      <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white rounded-3xl border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Top Control Bar: Match Period & Official Clock */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Match Period:
            </span>
            <select
              value={period}
              onChange={e => {
                sounds.playClick();
                setPeriod(e.target.value);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-700 bg-zinc-800/90 text-white text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {sport === 'football' && ['1st Half', '2nd Half', 'Extra Time', 'Penalties'].map(p => <option key={p} value={p}>{p}</option>)}
              {sport === 'basketball' && ['Q1', 'Q2', 'Q3', 'Q4', 'Overtime'].map(p => <option key={p} value={p}>{p}</option>)}
              {sport === 'cricket' && ['1st Innings', '2nd Innings'].map(p => <option key={p} value={p}>{p}</option>)}
              {['badminton', 'tennis'].includes(sport) && ['Set 1', 'Set 2', 'Set 3', 'Set 4', 'Set 5'].map(p => <option key={p} value={p}>{p}</option>)}
              {sport === 'custom' && ['Period 1', 'Period 2', 'Period 3', 'Overtime'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Broadcast Stopclock */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-zinc-800/90 border border-zinc-700 shadow-inner">
              <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-rose-500 animate-pulse' : 'bg-zinc-500'}`} />
              <span className="font-mono text-2xl sm:text-3xl font-black tabular-nums tracking-wider text-emerald-400">
                {formatTimer(seconds)}
              </span>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setIsRunning(prev => !prev);
              }}
              className={`p-3 rounded-2xl text-white font-bold cursor-pointer transition-all shadow-md active:scale-95 ${
                isRunning ? 'bg-amber-600 hover:bg-amber-700 ring-2 ring-amber-400/30' : 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-400/30'
              }`}
              title={isRunning ? 'Pause Timer' : 'Start Timer'}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={handleResetMatch}
              className="p-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 cursor-pointer shadow-xs active:scale-95 transition-all"
              title="Reset Match Scorecard"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Head-to-Head Arena with PROMINENT REAL TEAM LOGOS */}
        <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-6 relative z-10">
          {/* Team A Broadcast Tile */}
          <div className="md:col-span-5 bg-zinc-800/50 backdrop-blur-md p-6 rounded-3xl border border-zinc-700/80 flex flex-col items-center space-y-4 shadow-xl">
            {/* Team A Crest Logo Header */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActivePickerTeam('A');
                }}
                className="group relative w-24 h-24 sm:w-28 sm:h-28 p-3 rounded-3xl bg-zinc-900 border-2 border-zinc-700 hover:border-indigo-400 flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Tap to change Team A logo or select official club"
              >
                <img
                  src={teamALogo}
                  alt={teamAName}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-xl"
                  onError={e => {
                    (e.target as HTMLElement).setAttribute('src', 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png');
                  }}
                />
                <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-3xl flex items-center justify-center text-[11px] font-bold text-white transition-opacity">
                  Change Crest
                </span>
              </button>

              <div className="text-center w-full">
                <input
                  type="text"
                  value={teamAName}
                  onChange={e => setTeamAName(e.target.value)}
                  className="font-black text-lg sm:text-xl text-white text-center bg-transparent border-b border-transparent hover:border-zinc-600 focus:border-indigo-500 focus:outline-none w-full"
                />
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                    HOME CLUB
                  </span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActivePickerTeam('A');
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                  >
                    Change Logo
                  </button>
                </div>
              </div>
            </div>

            {/* Score Big Tabular Display */}
            <div className="w-full py-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center shadow-inner">
              <span className="font-mono font-black tabular-nums text-6xl sm:text-7xl text-white tracking-tight">
                {scoreA}
              </span>
            </div>

            {/* Quick Scoring Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
              <button
                onClick={() => handleScoreChange('A', 1)}
                className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              >
                +1
              </button>
              {['basketball'].includes(sport) && (
                <>
                  <button
                    onClick={() => handleScoreChange('A', 2)}
                    className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => handleScoreChange('A', 3)}
                    className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +3
                  </button>
                </>
              )}
              {['cricket'].includes(sport) && (
                <>
                  <button
                    onClick={() => handleScoreChange('A', 4)}
                    className="flex-1 min-w-[60px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +4 Boundary
                  </button>
                  <button
                    onClick={() => handleScoreChange('A', 6)}
                    className="flex-1 min-w-[60px] py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +6 Six
                  </button>
                </>
              )}
              <button
                onClick={() => handleScoreChange('A', -1)}
                className="px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                title="Subtract 1"
              >
                -1
              </button>
            </div>
          </div>

          {/* Center VS & Quick Event Log Trigger */}
          <div className="md:col-span-1 flex flex-col items-center justify-center gap-2 py-4">
            <span className="font-mono font-black text-2xl text-zinc-500">VS</span>
            <span className="w-1.5 h-12 bg-zinc-800 rounded-full hidden md:block" />
          </div>

          {/* Team B Broadcast Tile */}
          <div className="md:col-span-5 bg-zinc-800/50 backdrop-blur-md p-6 rounded-3xl border border-zinc-700/80 flex flex-col items-center space-y-4 shadow-xl">
            {/* Team B Crest Logo Header */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActivePickerTeam('B');
                }}
                className="group relative w-24 h-24 sm:w-28 sm:h-28 p-3 rounded-3xl bg-zinc-900 border-2 border-zinc-700 hover:border-indigo-400 flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Tap to change Team B logo or select official club"
              >
                <img
                  src={teamBLogo}
                  alt={teamBName}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-xl"
                  onError={e => {
                    (e.target as HTMLElement).setAttribute('src', 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png');
                  }}
                />
                <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-3xl flex items-center justify-center text-[11px] font-bold text-white transition-opacity">
                  Change Crest
                </span>
              </button>

              <div className="text-center w-full">
                <input
                  type="text"
                  value={teamBName}
                  onChange={e => setTeamBName(e.target.value)}
                  className="font-black text-lg sm:text-xl text-white text-center bg-transparent border-b border-transparent hover:border-zinc-600 focus:border-indigo-500 focus:outline-none w-full"
                />
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                    AWAY CLUB
                  </span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActivePickerTeam('B');
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                  >
                    Change Logo
                  </button>
                </div>
              </div>
            </div>

            {/* Score Big Tabular Display */}
            <div className="w-full py-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center shadow-inner">
              <span className="font-mono font-black tabular-nums text-6xl sm:text-7xl text-white tracking-tight">
                {scoreB}
              </span>
            </div>

            {/* Quick Scoring Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
              <button
                onClick={() => handleScoreChange('B', 1)}
                className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              >
                +1
              </button>
              {['basketball'].includes(sport) && (
                <>
                  <button
                    onClick={() => handleScoreChange('B', 2)}
                    className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => handleScoreChange('B', 3)}
                    className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +3
                  </button>
                </>
              )}
              {['cricket'].includes(sport) && (
                <>
                  <button
                    onClick={() => handleScoreChange('B', 4)}
                    className="flex-1 min-w-[60px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +4 Boundary
                  </button>
                  <button
                    onClick={() => handleScoreChange('B', 6)}
                    className="flex-1 min-w-[60px] py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +6 Six
                  </button>
                </>
              )}
              <button
                onClick={() => handleScoreChange('B', -1)}
                className="px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                title="Subtract 1"
              >
                -1
              </button>
            </div>
          </div>
        </div>

        {/* Quick Match Incident Logger */}
        <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-mono text-zinc-400 shrink-0">Log Incident:</span>
            <input
              type="text"
              placeholder="e.g. Scorer name, Yellow card, Free kick, Sub"
              value={customEventDetail}
              onChange={e => setCustomEventDetail(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                if (!customEventDetail.trim()) return;
                sounds.playClick();
                logEvent('A', 'Event', customEventDetail.trim());
                setCustomEventDetail('');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold text-white cursor-pointer active:scale-95 transition-all"
            >
              <img src={teamALogo} alt="" className="w-4 h-4 object-contain" />
              <span>For {teamAName.split(' ')[0]}</span>
            </button>

            <button
              onClick={() => {
                if (!customEventDetail.trim()) return;
                sounds.playClick();
                logEvent('B', 'Event', customEventDetail.trim());
                setCustomEventDetail('');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold text-white cursor-pointer active:scale-95 transition-all"
            >
              <img src={teamBLogo} alt="" className="w-4 h-4 object-contain" />
              <span>For {teamBName.split(' ')[0]}</span>
            </button>

            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer active:scale-95 transition-all shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Export'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Match Events Timeline */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Live Match Incident Log ({events.length})
            </h3>
          </div>

          {events.length > 0 && (
            <button
              onClick={handleUndoLastEvent}
              className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo Last</span>
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            No match incidents logged yet. Tap score buttons or type in an event above to record live actions.
          </div>
        ) : (
          <div className="space-y-2">
            {events.map(ev => {
              const teamLogo = ev.team === 'A' ? teamALogo : teamBLogo;
              const teamName = ev.team === 'A' ? teamAName : teamBName;
              return (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono font-bold text-zinc-400 w-12 shrink-0">
                      {ev.time}
                    </span>
                    <img src={teamLogo} alt="" className="w-5 h-5 object-contain shrink-0 drop-shadow-2xs" />
                    <div className="truncate">
                      <strong className="text-zinc-900 dark:text-zinc-100 mr-1.5 font-bold">
                        {teamName}:
                      </strong>
                      <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                        {ev.type} — {ev.detail}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TEAM CREST PICKER MODAL (OFFICIAL CLUBS & LOGOS) */}
      {activePickerTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                  Select Official Crest for {activePickerTeam === 'A' ? 'Team A (Home)' : 'Team B (Away)'}
                </h3>
                <p className="text-xs text-zinc-400">Choose from top world clubs or paste a custom image URL</p>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActivePickerTeam(null);
                }}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search club (e.g. Madrid, Barcelona, City, Arsenal, Lakers...)"
                value={searchLogoQuery}
                onChange={e => setSearchLogoQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Predefined World Club Logos Grid */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {filteredPresets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => handleSelectTeamPreset(preset)}
                    className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-zinc-50/60 dark:bg-zinc-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center p-1.5 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <img src={preset.logo} alt={preset.name} className="w-7 h-7 object-contain drop-shadow-2xs" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100 truncate block">
                        {preset.shortName}
                      </span>
                      <span className="text-[10px] text-zinc-500 truncate block">
                        {preset.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Logo URL Fallback */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 block">
                Or Use Custom Club Logo URL:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={customLogoUrl}
                  onChange={e => setCustomLogoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleApplyCustomLogo}
                  disabled={!customLogoUrl.trim()}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
