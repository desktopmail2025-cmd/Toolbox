import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import {
  ClipboardList, Play, Pause, RotateCcw, Plus, Minus,
  Undo2, Copy, Check, Download, Share2, Award, Clock,
  Calendar, Shield, Flag, Trash2, Volume2, Search, Sparkles,
  ChevronDown, Image as ImageIcon, Upload, FileText
} from 'lucide-react';
import { sounds } from '../../utils/audio';

type SportType = 'football' | 'cricket' | 'combat' | 'rugby' | 'handball' | 'basketball' | 'tennis' | 'badminton' | 'volleyball' | 'custom';

interface TeamPreset {
  name: string;
  shortName: string;
  logo: string;
  sport: SportType;
}

const PRESET_TEAMS: TeamPreset[] = [
  // Football World Clubs (European & Global Giants)
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

  // Cricket International & League Teams
  { name: 'India Cricket', shortName: 'IND', logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/6.png', sport: 'cricket' },
  { name: 'Australia Cricket', shortName: 'AUS', logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/2.png', sport: 'cricket' },
  { name: 'England Cricket', shortName: 'ENG', logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/1.png', sport: 'cricket' },
  { name: 'South Africa Cricket', shortName: 'SA', logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/3.png', sport: 'cricket' },
  { name: 'Pakistan Cricket', shortName: 'PAK', logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/7.png', sport: 'cricket' },
  { name: 'New Zealand Cricket', shortName: 'NZ', logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/5.png', sport: 'cricket' },
  { name: 'Chennai Super Kings', shortName: 'CSK', logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/4340.png', sport: 'cricket' },
  { name: 'Mumbai Indians', shortName: 'MI', logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/4346.png', sport: 'cricket' },
  { name: 'Royal Challengers Bengaluru', shortName: 'RCB', logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/4347.png', sport: 'cricket' },
  { name: 'Kolkata Knight Riders', shortName: 'KKR', logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/4341.png', sport: 'cricket' },
  { name: 'Surrey CCC (County)', shortName: 'SUR', logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/333.png', sport: 'cricket' },
  { name: 'Yorkshire CCC (County)', shortName: 'YOR', logo: 'https://a.espncdn.com/i/teamlogos/cricket/500/338.png', sport: 'cricket' },

  // Combat Sports & Pro Wrestling (WWE / UFC / AEW)
  { name: 'Cody Rhodes (Undisputed Champion)', shortName: 'CODY', logo: 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/wwe_championship.png', sport: 'combat' },
  { name: 'Roman Reigns (The OTC)', shortName: 'ROMAN', logo: 'https://a.espncdn.com/i/teamlogos/countries/500/usa.png', sport: 'combat' },
  { name: 'CM Punk (Best in the World)', shortName: 'PUNK', logo: 'https://a.espncdn.com/i/teamlogos/countries/500/usa.png', sport: 'combat' },
  { name: 'Gunther (World Heavyweight Champ)', shortName: 'GUNTHER', logo: 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/wwe_championship.png', sport: 'combat' },
  { name: 'Seth "Freakin" Rollins', shortName: 'SETH', logo: 'https://a.espncdn.com/i/teamlogos/countries/500/usa.png', sport: 'combat' },
  { name: 'Rhea Ripley (Mami)', shortName: 'RHEA', logo: 'https://a.espncdn.com/i/teamlogos/countries/500/aus.png', sport: 'combat' },
  { name: 'Bryan Danielson (AEW World Champ)', shortName: 'BRYAN', logo: 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/aew_belt.png', sport: 'combat' },
  { name: 'Swerve Strickland (AEW)', shortName: 'SWERVE', logo: 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/aew_belt.png', sport: 'combat' },
  { name: 'Will Ospreay (The Aerial Assassin)', shortName: 'OSPREAY', logo: 'https://a.espncdn.com/i/teamlogos/countries/500/gbr.png', sport: 'combat' },
  { name: 'Jon Moxley (Death Riders)', shortName: 'MOXLEY', logo: 'https://a.espncdn.com/i/teamlogos/countries/500/usa.png', sport: 'combat' },
  { name: 'Jon Jones (UFC Heavyweight Champ)', shortName: 'JONES', logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/ufc.png', sport: 'combat' },
  { name: 'Alex Pereira (Poatan / UFC Champ)', shortName: 'POATAN', logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/ufc.png', sport: 'combat' },
  { name: 'Islam Makhachev (UFC Lightweight)', shortName: 'ISLAM', logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/ufc.png', sport: 'combat' },
  { name: 'Ilia Topuria (El Matador)', shortName: 'TOPURIA', logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/ufc.png', sport: 'combat' },

  // European Rugby Six Nations & Champions Cup
  { name: 'England Rugby', shortName: 'ENG', logo: 'https://a.espncdn.com/i/teamlogos/rugby/500/59.png', sport: 'rugby' },
  { name: 'France Rugby (Les Bleus)', shortName: 'FRA', logo: 'https://a.espncdn.com/i/teamlogos/rugby/500/60.png', sport: 'rugby' },
  { name: 'Ireland Rugby', shortName: 'IRE', logo: 'https://a.espncdn.com/i/teamlogos/rugby/500/61.png', sport: 'rugby' },
  { name: 'Scotland Rugby', shortName: 'SCO', logo: 'https://a.espncdn.com/i/teamlogos/rugby/500/62.png', sport: 'rugby' },
  { name: 'Wales Rugby', shortName: 'WAL', logo: 'https://a.espncdn.com/i/teamlogos/rugby/500/63.png', sport: 'rugby' },
  { name: 'Italy Rugby (Azzurri)', shortName: 'ITA', logo: 'https://a.espncdn.com/i/teamlogos/rugby/500/64.png', sport: 'rugby' },
  { name: 'Stade Toulousain (Toulouse)', shortName: 'TOU', logo: 'https://a.espncdn.com/i/teamlogos/rugby/500/25920.png', sport: 'rugby' },
  { name: 'Leinster Rugby', shortName: 'LEI', logo: 'https://a.espncdn.com/i/teamlogos/rugby/500/25927.png', sport: 'rugby' },

  // European Handball (EHF Champions League)
  { name: 'THW Kiel Handball', shortName: 'KIE', logo: 'https://a.espncdn.com/i/teamlogos/countries/500/ger.png', sport: 'handball' },
  { name: 'FC Barcelona Handbol', shortName: 'FCB', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png', sport: 'handball' },
  { name: 'Paris Saint-Germain Handball', shortName: 'PSG', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png', sport: 'handball' },
  { name: 'SC Magdeburg Handball', shortName: 'SCM', logo: 'https://a.espncdn.com/i/teamlogos/countries/500/ger.png', sport: 'handball' },
  { name: 'Aalborg Håndbold', shortName: 'AAL', logo: 'https://a.espncdn.com/i/teamlogos/countries/500/den.png', sport: 'handball' },

  // Basketball (NBA & EuroLeague)
  { name: 'Real Madrid Baloncesto', shortName: 'RMB', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png', sport: 'basketball' },
  { name: 'Panathinaikos AKTOR', shortName: 'PAO', logo: 'https://a.espncdn.com/i/teamlogos/countries/500/gre.png', sport: 'basketball' },
  { name: 'Olympiacos Piraeus', shortName: 'OLY', logo: 'https://a.espncdn.com/i/teamlogos/countries/500/gre.png', sport: 'basketball' },
  { name: 'FC Barcelona Bàsquet', shortName: 'FCB', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png', sport: 'basketball' },
  { name: 'Fenerbahçe Beko', shortName: 'FEN', logo: 'https://a.espncdn.com/i/teamlogos/countries/500/tur.png', sport: 'basketball' },
  { name: 'Los Angeles Lakers', shortName: 'LAL', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png', sport: 'basketball' },
  { name: 'Golden State Warriors', shortName: 'GSW', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png', sport: 'basketball' },
  { name: 'Boston Celtics', shortName: 'BOS', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png', sport: 'basketball' },
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
  const fileInputRefA = useRef<HTMLInputElement | null>(null);
  const fileInputRefB = useRef<HTMLInputElement | null>(null);
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Match Timer & Custom Time Inputs
  const [seconds, setSeconds] = useState<number>(4215); // ~70 mins
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isEditingTime, setIsEditingTime] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<string>('70');
  const [customSeconds, setCustomSeconds] = useState<string>('15');

  const handleApplyCustomTime = () => {
    sounds.playClick();
    const m = Math.max(0, parseInt(customMinutes, 10) || 0);
    const s = Math.max(0, Math.min(59, parseInt(customSeconds, 10) || 0));
    setSeconds(m * 60 + s);
    setIsEditingTime(false);
  };

  const handleLogoFileUpload = (team: 'A' | 'B', file: File) => {
    sounds.playSuccess();
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      if (team === 'A') {
        setTeamALogo(dataUrl);
      } else {
        setTeamBLogo(dataUrl);
      }
      setActivePickerTeam(null);
    };
    reader.readAsDataURL(file);
  };

  // Quick event input
  const [customEventDetail, setCustomEventDetail] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Cricket Specific: Wickets, Overs & Balls
  const [wicketsA, setWicketsA] = useState<number>(0);
  const [wicketsB, setWicketsB] = useState<number>(0);
  const [ballsA, setBallsA] = useState<number>(0);
  const [ballsB, setBallsB] = useState<number>(0);

  // Combat / Wrestling Specific: Result Decision & Stipulation
  const [combatOutcome, setCombatOutcome] = useState<string | null>(null);

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
      setWicketsA(0);
      setWicketsB(0);
      setBallsA(0);
      setBallsB(0);
      setCombatOutcome(null);
      setSeconds(0);
      setIsRunning(false);
      setEvents([]);
    }
  };

  const handleCricketBall = (team: 'A' | 'B', runs: number = 0) => {
    sounds.playClick();
    if (team === 'A') {
      const nextBalls = ballsA + 1;
      setBallsA(nextBalls);
      const nextRuns = scoreA + runs;
      setScoreA(nextRuns);
      const ov = `${Math.floor(nextBalls / 6)}.${nextBalls % 6}`;
      logEvent('A', runs === 4 ? 'Boundary Four 🏏' : runs === 6 ? 'Maximum Six 💥' : `${runs} Run(s)`, `Score: ${nextRuns}/${wicketsA} (${ov} ov)`);
    } else {
      const nextBalls = ballsB + 1;
      setBallsB(nextBalls);
      const nextRuns = scoreB + runs;
      setScoreB(nextRuns);
      const ov = `${Math.floor(nextBalls / 6)}.${nextBalls % 6}`;
      logEvent('B', runs === 4 ? 'Boundary Four 🏏' : runs === 6 ? 'Maximum Six 💥' : `${runs} Run(s)`, `Score: ${nextRuns}/${wicketsB} (${ov} ov)`);
    }
  };

  const handleCricketWicket = (team: 'A' | 'B') => {
    sounds.playClick();
    if (team === 'A') {
      const nextW = Math.min(10, wicketsA + 1);
      setWicketsA(nextW);
      const nextBalls = ballsA + 1;
      setBallsA(nextBalls);
      const ov = `${Math.floor(nextBalls / 6)}.${nextBalls % 6}`;
      logEvent('A', 'WICKET DOWN! ☝️', `Fall of Wicket: ${scoreA}/${nextW} in ${ov} ov`);
    } else {
      const nextW = Math.min(10, wicketsB + 1);
      setWicketsB(nextW);
      const nextBalls = ballsB + 1;
      setBallsB(nextBalls);
      const ov = `${Math.floor(nextBalls / 6)}.${nextBalls % 6}`;
      logEvent('B', 'WICKET DOWN! ☝️', `Fall of Wicket: ${scoreB}/${nextW} in ${ov} ov`);
    }
  };

  const handleCricketExtra = (team: 'A' | 'B', type: 'Wide' | 'No-Ball' | 'Leg-Bye') => {
    sounds.playClick();
    if (team === 'A') {
      const nextRuns = scoreA + 1;
      setScoreA(nextRuns);
      logEvent('A', `Extra (${type})`, `+1 run · Total: ${nextRuns}/${wicketsA}`);
    } else {
      const nextRuns = scoreB + 1;
      setScoreB(nextRuns);
      logEvent('B', `Extra (${type})`, `+1 run · Total: ${nextRuns}/${wicketsB}`);
    }
  };

  const handleCombatFinish = (winner: 'A' | 'B', method: string) => {
    sounds.playSuccess();
    const winTeam = winner === 'A' ? teamAName : teamBName;
    const loseTeam = winner === 'A' ? teamBName : teamAName;
    const resStr = `${winTeam} def. ${loseTeam} via ${method} (${period})`;
    setCombatOutcome(resStr);
    logEvent(winner, 'Match Finish / Fall 🏆', resStr);
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

  const handleDeviceLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sounds.playSuccess();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        if (activePickerTeam === 'A') {
          setTeamALogo(dataUrl);
        } else if (activePickerTeam === 'B') {
          setTeamBLogo(dataUrl);
        }
        setActivePickerTeam(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const generateScorecardCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    const W = 1600;
    const H = 1000;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Background Gradient (Dark Broadcast Arena)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#09090b');
    bgGrad.addColorStop(0.5, '#18181b');
    bgGrad.addColorStop(1, '#09090b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Outer Border
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // 1. Header Tournament Banner
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${sport.toUpperCase()} OFFICIAL MATCH SCORECARD`, W / 2, 80);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'bold 20px monospace';
    const matchDateStr = new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    ctx.fillText(`Period: ${period}  |  Match Time: ${formatTimer(seconds)}  |  ${matchDateStr}`, W / 2, 120);

    // Helper to safely load and draw image onto canvas
    const drawImageSafe = async (src: string, x: number, y: number, size: number) => {
      return new Promise<void>((resolve) => {
        if (!src) return resolve();
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            ctx.drawImage(img, x, y, size, size);
          } catch {}
          resolve();
        };
        img.onerror = () => resolve();
        img.src = src;
      });
    };

    // 2. Scoreboard Cards: Team A (Left) & Team B (Right)
    const cardY = 160;
    const cardH = 260;
    const cardW = 600;

    // Team A Card
    ctx.fillStyle = 'rgba(24, 24, 27, 0.9)';
    ctx.beginPath();
    ctx.roundRect(80, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Team A Logo
    await drawImageSafe(teamALogo, 120, cardY + 50, 160);

    // Team A Text
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(teamAName, 310, cardY + 100, 340);
    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`[${teamAShort}]`, 310, cardY + 140);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px monospace';
    const scoreStrA = sport === 'cricket' ? `${scoreA}/${wicketsA} (${Math.floor(ballsA / 6)}.${ballsA % 6} ov)` : String(scoreA);
    ctx.fillText(scoreStrA, 310, cardY + 215, 340);

    // Team B Card
    ctx.fillStyle = 'rgba(24, 24, 27, 0.9)';
    ctx.beginPath();
    ctx.roundRect(W - 80 - cardW, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Team B Logo
    await drawImageSafe(teamBLogo, W - 80 - cardW + 40, cardY + 50, 160);

    // Team B Text
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(teamBName, W - 80 - cardW + 230, cardY + 100, 340);
    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`[${teamBShort}]`, W - 80 - cardW + 230, cardY + 140);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px monospace';
    const scoreStrB = sport === 'cricket' ? `${scoreB}/${wicketsB} (${Math.floor(ballsB / 6)}.${ballsB % 6} ov)` : String(scoreB);
    ctx.fillText(scoreStrB, W - 80 - cardW + 230, cardY + 215, 340);

    // Center VS
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6366f1';
    ctx.font = 'black 48px sans-serif';
    ctx.fillText('VS', W / 2, cardY + 145);

    // Combat Outcome banner if any
    if (combatOutcome) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(combatOutcome, W / 2, cardY + 200);
    }

    // 3. Match Timeline / Events Table
    const tableY = 460;
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(80, tableY, W - 160, 480, 24);
    ctx.fill();
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Table Header
    ctx.fillStyle = '#27272a';
    ctx.fillRect(80, tableY, W - 160, 56);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('OFFICIAL MATCH INCIDENT TIMELINE & NOTATIONS', 110, tableY + 36);

    // Table Column Headers
    const colY = tableY + 90;
    ctx.fillStyle = '#71717a';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('TIME', 110, colY);
    ctx.fillText('TEAM', 240, colY);
    ctx.fillText('TYPE / INCIDENT', 460, colY);
    ctx.fillText('DETAILS / SCORER NOTATION', 800, colY);

    // Table Rows
    const displayEvents = events.slice(0, 8);
    if (displayEvents.length === 0) {
      ctx.fillStyle = '#71717a';
      ctx.font = 'italic 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No incidents logged yet. Game in progress or scheduled.', W / 2, tableY + 240);
    } else {
      ctx.textAlign = 'left';
      displayEvents.forEach((ev, idx) => {
        const rowY = colY + 38 + idx * 42;
        if (idx % 2 === 1) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.fillRect(85, rowY - 28, W - 170, 38);
        }
        ctx.fillStyle = '#e4e4e7';
        ctx.font = 'bold 18px monospace';
        ctx.fillText(ev.time, 110, rowY);

        ctx.fillStyle = ev.team === 'A' ? '#60a5fa' : '#f87171';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(ev.team === 'A' ? teamAShort : teamBShort, 240, rowY);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(ev.type, 460, rowY, 300);

        ctx.fillStyle = '#d4d4d8';
        ctx.fillText(ev.detail, 800, rowY, 650);
      });
    }

    return canvas;
  };

  const handleExportScorecardPNG = async () => {
    sounds.playSuccess();
    const canvas = await generateScorecardCanvas();
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnitoolbox-scorecard-${teamAName.replace(/\s+/g, '_')}_vs_${teamBName.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  const handleExportScorecardPDF = async () => {
    sounds.playSuccess();
    const canvas = await generateScorecardCanvas();
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Header
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, 297, 24, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.text(`${sport.toUpperCase()} OFFICIAL MATCH SCORECARD`, 15, 12);
    pdf.setFontSize(9.5);
    pdf.setTextColor(203, 213, 225);
    pdf.text(`Period: ${period}   |   Match Time: ${formatTimer(seconds)}   |   ${new Date().toLocaleDateString()}`, 15, 19);

    // Scorecard Image
    const imgW = 277;
    const imgH = 173;
    pdf.addImage(imgData, 'PNG', 10, 27, imgW, imgH);

    pdf.save(`omnitoolbox-scorecard-${teamAName.replace(/\s+/g, '_')}_vs_${teamBName.replace(/\s+/g, '_')}.pdf`);
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
            { id: 'football', label: '⚽ Football', periods: ['1st Half', '2nd Half', 'Extra Time', 'Penalties'] },
            { id: 'cricket', label: '🏏 Cricket', periods: ['1st Innings', '2nd Innings', 'Super Over'] },
            { id: 'combat', label: '🥊 Combat / Wrestling', periods: ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5 (Championship)', 'Sudden Victory'] },
            { id: 'rugby', label: '🏉 Rugby', periods: ['1st Half (40m)', '2nd Half (40m)', 'Extra Time'] },
            { id: 'handball', label: '🤾 Handball', periods: ['1st Half (30m)', '2nd Half (30m)', '7m Shootout'] },
            { id: 'basketball', label: '🏀 Basketball', periods: ['Q1', 'Q2', 'Q3', 'Q4', 'Overtime'] },
            { id: 'tennis', label: '🎾 Tennis', periods: ['Set 1', 'Set 2', 'Set 3', 'Set 4', 'Set 5'] },
            { id: 'badminton', label: '🏸 Badminton', periods: ['Set 1', 'Set 2', 'Set 3'] },
            { id: 'volleyball', label: '🏐 Volleyball', periods: ['Set 1', 'Set 2', 'Set 3', 'Set 4', 'Set 5'] },
            { id: 'custom', label: '⚙️ Custom', periods: ['Period 1', 'Period 2', 'Period 3'] },
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

        {/* Combat / Wrestling Winner Announcement Banner */}
        {combatOutcome && (
          <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 flex items-center justify-between text-xs font-bold shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{combatOutcome}</span>
            </div>
            <button
              onClick={() => setCombatOutcome(null)}
              className="text-[10px] uppercase tracking-wider text-amber-400 hover:text-white px-2 py-1 rounded bg-black/40 cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

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
              {sport === 'cricket' && ['1st Innings', '2nd Innings', 'Super Over'].map(p => <option key={p} value={p}>{p}</option>)}
              {sport === 'combat' && ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5 (Championship)', 'Sudden Victory'].map(p => <option key={p} value={p}>{p}</option>)}
              {sport === 'rugby' && ['1st Half (40m)', '2nd Half (40m)', 'Extra Time'].map(p => <option key={p} value={p}>{p}</option>)}
              {sport === 'handball' && ['1st Half (30m)', '2nd Half (30m)', '7m Shootout'].map(p => <option key={p} value={p}>{p}</option>)}
              {sport === 'basketball' && ['Q1', 'Q2', 'Q3', 'Q4', 'Overtime'].map(p => <option key={p} value={p}>{p}</option>)}
              {['badminton', 'tennis'].includes(sport) && ['Set 1', 'Set 2', 'Set 3', 'Set 4', 'Set 5'].map(p => <option key={p} value={p}>{p}</option>)}
              {sport === 'volleyball' && ['Set 1', 'Set 2', 'Set 3', 'Set 4', 'Set 5'].map(p => <option key={p} value={p}>{p}</option>)}
              {sport === 'custom' && ['Period 1', 'Period 2', 'Period 3', 'Overtime'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Broadcast Stopclock */}
          <div className="flex flex-wrap items-center gap-3">
            {isEditingTime ? (
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-zinc-800 border border-indigo-500 shadow-md">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={customMinutes}
                    onChange={e => setCustomMinutes(e.target.value)}
                    className="w-14 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono text-center text-sm font-bold focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    placeholder="Min"
                  />
                  <span className="text-white font-bold font-mono">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={customSeconds}
                    onChange={e => setCustomSeconds(e.target.value)}
                    className="w-14 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono text-center text-sm font-bold focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    placeholder="Sec"
                  />
                </div>
                <button
                  onClick={handleApplyCustomTime}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs active:scale-95"
                >
                  Set
                </button>
                <button
                  onClick={() => setIsEditingTime(false)}
                  className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-bold rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  sounds.playClick();
                  setCustomMinutes(String(Math.floor(seconds / 60)));
                  setCustomSeconds(String(seconds % 60).padStart(2, '0'));
                  setIsEditingTime(true);
                }}
                className="group flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-zinc-800/90 border border-zinc-700 shadow-inner cursor-pointer hover:border-indigo-400 transition-colors"
                title="Click to input custom match time"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-rose-500 animate-pulse' : 'bg-zinc-500'}`} />
                <span className="font-mono text-2xl sm:text-3xl font-black tabular-nums tracking-wider text-emerald-400">
                  {formatTimer(seconds)}
                </span>
                <span className="text-[10px] text-indigo-300 font-sans font-bold underline opacity-0 group-hover:opacity-100 transition-opacity">
                  Custom Time
                </span>
              </div>
            )}

            {/* Quick time adjustments */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  sounds.playClick();
                  setSeconds(prev => Math.max(0, prev - 60));
                }}
                className="px-2 py-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:text-white text-xs font-bold font-mono cursor-pointer"
                title="Subtract 1 minute"
              >
                -1m
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setSeconds(prev => prev + 60);
                }}
                className="px-2 py-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:text-white text-xs font-bold font-mono cursor-pointer"
                title="Add 1 minute"
              >
                +1m
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setSeconds(45 * 60);
                }}
                className="px-2 py-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:text-white text-xs font-bold font-mono cursor-pointer hidden sm:block"
                title="Set to 45:00"
              >
                45m
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setSeconds(90 * 60);
                }}
                className="px-2 py-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:text-white text-xs font-bold font-mono cursor-pointer hidden sm:block"
                title="Set to 90:00"
              >
                90m
              </button>
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
          {/* Hidden File Inputs for Own Photo Uploads */}
          <input
            type="file"
            ref={fileInputRefA}
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleLogoFileUpload('A', e.target.files[0])}
          />
          <input
            type="file"
            ref={fileInputRefB}
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleLogoFileUpload('B', e.target.files[0])}
          />

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
                title="Tap to change Team A logo or upload your own photo"
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
                  Change Photo
                </span>
              </button>

              <div className="text-center w-full">
                <input
                  type="text"
                  value={teamAName}
                  onChange={e => setTeamAName(e.target.value)}
                  className="font-black text-lg sm:text-xl text-white text-center bg-transparent border-b border-transparent hover:border-zinc-600 focus:border-indigo-500 focus:outline-none w-full"
                />
                <div className="flex items-center justify-center gap-2 mt-2">
                  <button
                    onClick={() => fileInputRefA.current?.click()}
                    className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 font-bold bg-amber-950/60 border border-amber-700/70 px-2.5 py-1 rounded-xl cursor-pointer shadow-xs transition-all hover:scale-105"
                    title="Upload custom logo photo from your device"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Own Photo</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActivePickerTeam('A');
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                  >
                    Preset Crests
                  </button>
                </div>
              </div>
            </div>

            {/* Score Big Tabular Display */}
            <div className="w-full py-4 px-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col items-center justify-center shadow-inner">
              {sport === 'cricket' ? (
                <>
                  <div className="flex items-baseline gap-1 font-mono font-black tracking-tight">
                    <span className="text-5xl sm:text-6xl text-white">{scoreA}</span>
                    <span className="text-3xl sm:text-4xl text-rose-400">/{wicketsA}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 mt-1">
                    {Math.floor(ballsA / 6)}.{ballsA % 6} Overs · RR: {ballsA > 0 ? ((scoreA / ballsA) * 6).toFixed(2) : '0.00'}
                  </span>
                </>
              ) : (
                <span className="font-mono font-black tabular-nums text-6xl sm:text-7xl text-white tracking-tight">
                  {scoreA}
                </span>
              )}
            </div>

            {/* Quick Scoring Controls for Sport */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full pt-1">
              {sport === 'cricket' ? (
                <>
                  <button
                    onClick={() => handleCricketBall('A', 1)}
                    className="flex-1 min-w-[55px] py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleCricketBall('A', 2)}
                    className="flex-1 min-w-[55px] py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => handleCricketBall('A', 4)}
                    className="flex-1 min-w-[65px] py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +4 Four
                  </button>
                  <button
                    onClick={() => handleCricketBall('A', 6)}
                    className="flex-1 min-w-[65px] py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +6 Six
                  </button>
                  <button
                    onClick={() => handleCricketWicket('A')}
                    className="flex-1 min-w-[70px] py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    ☝️ Wicket
                  </button>
                  <button
                    onClick={() => handleCricketExtra('A', 'Wide')}
                    className="py-2 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    Wide
                  </button>
                </>
              ) : sport === 'rugby' ? (
                <>
                  <button
                    onClick={() => handleScoreChange('A', 5)}
                    className="flex-1 min-w-[70px] py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +5 Try
                  </button>
                  <button
                    onClick={() => handleScoreChange('A', 2)}
                    className="flex-1 min-w-[60px] py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +2 Conv
                  </button>
                  <button
                    onClick={() => handleScoreChange('A', 3)}
                    className="flex-1 min-w-[60px] py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +3 Pen
                  </button>
                </>
              ) : sport === 'handball' ? (
                <>
                  <button
                    onClick={() => handleScoreChange('A', 1)}
                    className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +1 Goal
                  </button>
                  <button
                    onClick={() => {
                      handleScoreChange('A', 1);
                      logEvent('A', '7m Penalty Goal', `Score: ${scoreA + 1}`);
                    }}
                    className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +1 (7m)
                  </button>
                  <button
                    onClick={() => logEvent('A', '2-Min Suspension ⏱️', 'Player sent off for 2 minutes')}
                    className="px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-amber-300 font-bold text-xs cursor-pointer"
                  >
                    2m Susp
                  </button>
                </>
              ) : sport === 'combat' ? (
                <>
                  <button
                    onClick={() => handleScoreChange('A', 1)}
                    className="flex-1 min-w-[60px] py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-xs cursor-pointer active:scale-95"
                  >
                    +1 Pt
                  </button>
                  <button
                    onClick={() => handleCombatFinish('A', 'Pinfall (1-2-3)')}
                    className="flex-1 min-w-[80px] py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs cursor-pointer shadow-md active:scale-95"
                  >
                    🏆 Pinfall
                  </button>
                  <button
                    onClick={() => handleCombatFinish('A', 'Submission (Tapout)')}
                    className="flex-1 min-w-[80px] py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer shadow-md active:scale-95"
                  >
                    🥋 Tapout
                  </button>
                  <button
                    onClick={() => handleCombatFinish('A', 'Knockout (KO/TKO)')}
                    className="flex-1 min-w-[75px] py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs cursor-pointer shadow-md active:scale-95"
                  >
                    💥 KO/TKO
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
              <button
                onClick={() => handleScoreChange('A', -1)}
                className="px-3.5 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
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
                <div className="flex items-center justify-center gap-2 mt-2">
                  <button
                    onClick={() => fileInputRefB.current?.click()}
                    className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 font-bold bg-amber-950/60 border border-amber-700/70 px-2.5 py-1 rounded-xl cursor-pointer shadow-xs transition-all hover:scale-105"
                    title="Upload custom logo photo from your device"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Own Photo</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActivePickerTeam('B');
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                  >
                    Preset Crests
                  </button>
                </div>
              </div>
            </div>

            {/* Score Big Tabular Display */}
            <div className="w-full py-4 px-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col items-center justify-center shadow-inner">
              {sport === 'cricket' ? (
                <>
                  <div className="flex items-baseline gap-1 font-mono font-black tracking-tight">
                    <span className="text-5xl sm:text-6xl text-white">{scoreB}</span>
                    <span className="text-3xl sm:text-4xl text-rose-400">/{wicketsB}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 mt-1">
                    {Math.floor(ballsB / 6)}.{ballsB % 6} Overs · RR: {ballsB > 0 ? ((scoreB / ballsB) * 6).toFixed(2) : '0.00'}
                  </span>
                </>
              ) : (
                <span className="font-mono font-black tabular-nums text-6xl sm:text-7xl text-white tracking-tight">
                  {scoreB}
                </span>
              )}
            </div>

            {/* Quick Scoring Controls for Sport */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full pt-1">
              {sport === 'cricket' ? (
                <>
                  <button
                    onClick={() => handleCricketBall('B', 1)}
                    className="flex-1 min-w-[55px] py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleCricketBall('B', 2)}
                    className="flex-1 min-w-[55px] py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => handleCricketBall('B', 4)}
                    className="flex-1 min-w-[65px] py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +4 Four
                  </button>
                  <button
                    onClick={() => handleCricketBall('B', 6)}
                    className="flex-1 min-w-[65px] py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +6 Six
                  </button>
                  <button
                    onClick={() => handleCricketWicket('B')}
                    className="flex-1 min-w-[70px] py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    ☝️ Wicket
                  </button>
                  <button
                    onClick={() => handleCricketExtra('B', 'Wide')}
                    className="py-2 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    Wide
                  </button>
                </>
              ) : sport === 'rugby' ? (
                <>
                  <button
                    onClick={() => handleScoreChange('B', 5)}
                    className="flex-1 min-w-[70px] py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +5 Try
                  </button>
                  <button
                    onClick={() => handleScoreChange('B', 2)}
                    className="flex-1 min-w-[60px] py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +2 Conv
                  </button>
                  <button
                    onClick={() => handleScoreChange('B', 3)}
                    className="flex-1 min-w-[60px] py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +3 Pen
                  </button>
                </>
              ) : sport === 'handball' ? (
                <>
                  <button
                    onClick={() => handleScoreChange('B', 1)}
                    className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +1 Goal
                  </button>
                  <button
                    onClick={() => {
                      handleScoreChange('B', 1);
                      logEvent('B', '7m Penalty Goal', `Score: ${scoreB + 1}`);
                    }}
                    className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    +1 (7m)
                  </button>
                  <button
                    onClick={() => logEvent('B', '2-Min Suspension ⏱️', 'Player sent off for 2 minutes')}
                    className="px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-amber-300 font-bold text-xs cursor-pointer"
                  >
                    2m Susp
                  </button>
                </>
              ) : sport === 'combat' ? (
                <>
                  <button
                    onClick={() => handleScoreChange('B', 1)}
                    className="flex-1 min-w-[60px] py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-xs cursor-pointer active:scale-95"
                  >
                    +1 Pt
                  </button>
                  <button
                    onClick={() => handleCombatFinish('B', 'Pinfall (1-2-3)')}
                    className="flex-1 min-w-[80px] py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs cursor-pointer shadow-md active:scale-95"
                  >
                    🏆 Pinfall
                  </button>
                  <button
                    onClick={() => handleCombatFinish('B', 'Submission (Tapout)')}
                    className="flex-1 min-w-[80px] py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer shadow-md active:scale-95"
                  >
                    🥋 Tapout
                  </button>
                  <button
                    onClick={() => handleCombatFinish('B', 'Knockout (KO/TKO)')}
                    className="flex-1 min-w-[75px] py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs cursor-pointer shadow-md active:scale-95"
                  >
                    💥 KO/TKO
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
              <button
                onClick={() => handleScoreChange('B', -1)}
                className="px-3.5 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
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

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportScorecardPNG}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer active:scale-95 transition-all shadow-md"
                title="Export high-resolution PNG scorecard image"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Export PNG</span>
              </button>

              <button
                onClick={handleExportScorecardPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold cursor-pointer active:scale-95 transition-all shadow-md border border-zinc-700 dark:border-zinc-300"
                title="Download match scorecard PDF"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Print PDF</span>
              </button>

              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold cursor-pointer active:scale-95 transition-all border border-zinc-700"
                title="Copy text match report"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
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
                  Select or Upload Photo for {activePickerTeam === 'A' ? 'Team A (Home)' : 'Team B (Away)'}
                </h3>
                <p className="text-xs text-zinc-400">Upload your own photo from device, choose world club crest, or paste a link</p>
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

            {/* Custom Photo / Device File Upload Section */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border-2 border-dashed border-indigo-300 dark:border-indigo-700/80 flex items-center justify-between gap-3">
              <input
                type="file"
                ref={modalFileInputRef}
                accept="image/*"
                className="hidden"
                onChange={e => {
                  if (e.target.files?.[0] && activePickerTeam) {
                    handleLogoFileUpload(activePickerTeam, e.target.files[0]);
                  }
                }}
              />
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100 block truncate">
                    Upload Your Own Photo / Logo
                  </span>
                  <span className="text-[11px] text-zinc-500 block truncate">
                    Supports PNG, JPG, WebP, SVG from your device
                  </span>
                </div>
              </div>
              <button
                onClick={() => modalFileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs whitespace-nowrap shadow-sm cursor-pointer active:scale-95 transition-all"
              >
                Browse File
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
