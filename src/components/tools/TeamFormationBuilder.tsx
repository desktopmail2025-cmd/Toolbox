import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import {
  Users, Shirt, Shield, Shuffle, Download, Copy, Check,
  Edit2, Trash2, Plus, Sparkles, RefreshCw, Star, ArrowRightLeft,
  Settings, Award, Image as ImageIcon, Upload, Palette, Move,
  FolderOpen, Save, Eye, EyeOff, Info, HelpCircle, FileText
} from 'lucide-react';
import { sounds } from '../../utils/audio';

interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  role?: string;
}

interface ClubPreset {
  id: string;
  name: string;
  manager: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
  defaultFormation: string;
  starters: { name: string; number: number; position: string }[];
  bench: { name: string; number: number; position: string }[];
}

const FORMATION_COORDINATES: Record<string, { x: number; y: number }[]> = {
  '4-3-3': [
    { x: 50, y: 88 }, // GK
    { x: 18, y: 72 }, // LB
    { x: 38, y: 74 }, // CB
    { x: 62, y: 74 }, // CB
    { x: 82, y: 72 }, // RB
    { x: 50, y: 56 }, // CDM
    { x: 32, y: 46 }, // CM
    { x: 68, y: 46 }, // CM
    { x: 20, y: 22 }, // LW
    { x: 50, y: 16 }, // ST
    { x: 80, y: 22 }, // RW
  ],
  '4-2-3-1': [
    { x: 50, y: 88 }, // GK
    { x: 18, y: 72 }, // LB
    { x: 38, y: 74 }, // CB
    { x: 62, y: 74 }, // CB
    { x: 82, y: 72 }, // RB
    { x: 36, y: 58 }, // CDM
    { x: 64, y: 58 }, // CDM
    { x: 20, y: 38 }, // LAM
    { x: 50, y: 36 }, // CAM
    { x: 80, y: 38 }, // RAM
    { x: 50, y: 16 }, // ST
  ],
  '4-4-2': [
    { x: 50, y: 88 }, // GK
    { x: 18, y: 72 }, // LB
    { x: 38, y: 74 }, // CB
    { x: 62, y: 74 }, // CB
    { x: 82, y: 72 }, // RB
    { x: 18, y: 48 }, // LM
    { x: 38, y: 50 }, // CM
    { x: 62, y: 50 }, // CM
    { x: 82, y: 48 }, // RM
    { x: 38, y: 18 }, // ST
    { x: 62, y: 18 }, // ST
  ],
  '3-5-2': [
    { x: 50, y: 88 }, // GK
    { x: 25, y: 74 }, // CB
    { x: 50, y: 76 }, // CB
    { x: 75, y: 74 }, // CB
    { x: 12, y: 46 }, // LWB
    { x: 35, y: 54 }, // CM
    { x: 50, y: 42 }, // CAM
    { x: 65, y: 54 }, // CM
    { x: 88, y: 46 }, // RWB
    { x: 38, y: 18 }, // ST
    { x: 62, y: 18 }, // ST
  ],
  '3-4-2-1': [
    { x: 50, y: 88 }, // GK
    { x: 26, y: 74 }, // LCB
    { x: 50, y: 76 }, // CB
    { x: 74, y: 74 }, // RCB
    { x: 14, y: 50 }, // LM
    { x: 38, y: 52 }, // CM
    { x: 62, y: 52 }, // CM
    { x: 86, y: 50 }, // RM
    { x: 34, y: 32 }, // LAM
    { x: 66, y: 32 }, // RAM
    { x: 50, y: 16 }, // ST
  ],
  '5-3-2': [
    { x: 50, y: 88 }, // GK
    { x: 14, y: 68 }, // LWB
    { x: 32, y: 74 }, // CB
    { x: 50, y: 76 }, // CB
    { x: 68, y: 74 }, // CB
    { x: 86, y: 68 }, // RWB
    { x: 30, y: 48 }, // CM
    { x: 50, y: 44 }, // CDM
    { x: 70, y: 48 }, // CM
    { x: 38, y: 18 }, // ST
    { x: 62, y: 18 }, // ST
  ],
  '4-1-2-1-2': [
    { x: 50, y: 88 }, // GK
    { x: 18, y: 72 }, // LB
    { x: 38, y: 74 }, // CB
    { x: 62, y: 74 }, // CB
    { x: 82, y: 72 }, // RB
    { x: 50, y: 58 }, // CDM
    { x: 30, y: 46 }, // LCM
    { x: 70, y: 46 }, // RCM
    { x: 50, y: 34 }, // CAM
    { x: 38, y: 18 }, // ST
    { x: 62, y: 18 }, // ST
  ],
  '3-4-3': [
    { x: 50, y: 88 }, // GK
    { x: 26, y: 74 }, // CB
    { x: 50, y: 76 }, // CB
    { x: 74, y: 74 }, // CB
    { x: 14, y: 50 }, // LM
    { x: 38, y: 52 }, // CM
    { x: 62, y: 52 }, // CM
    { x: 86, y: 50 }, // RM
    { x: 22, y: 22 }, // LW
    { x: 50, y: 16 }, // ST
    { x: 78, y: 22 }, // RW
  ],
};

const WORLD_CLUBS: ClubPreset[] = [
  {
    id: 'real-madrid',
    name: 'Real Madrid CF',
    manager: 'Carlo Ancelotti',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png',
    primaryColor: '#1e3a8a',
    accentColor: '#f59e0b',
    defaultFormation: '4-3-3',
    starters: [
      { name: 'Courtois', number: 1, position: 'GK' },
      { name: 'Mendy', number: 23, position: 'LB' },
      { name: 'Rudiger', number: 22, position: 'CB' },
      { name: 'Militao', number: 3, position: 'CB' },
      { name: 'Carvajal', number: 2, position: 'RB' },
      { name: 'Tchouameni', number: 14, position: 'CDM' },
      { name: 'Valverde', number: 8, position: 'CM' },
      { name: 'Bellingham', number: 5, position: 'CAM' },
      { name: 'Vinicius Jr', number: 7, position: 'LW' },
      { name: 'Mbappe', number: 9, position: 'ST' },
      { name: 'Rodrygo', number: 11, position: 'RW' },
    ],
    bench: [
      { name: 'Lunin', number: 13, position: 'GK' },
      { name: 'Modric', number: 10, position: 'CM' },
      { name: 'Camavinga', number: 6, position: 'CM' },
      { name: 'Guler', number: 15, position: 'CAM' },
      { name: 'Endrick', number: 16, position: 'ST' },
      { name: 'Brahim', number: 21, position: 'RW' },
    ],
  },
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    manager: 'Hansi Flick',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png',
    primaryColor: '#991b1b',
    accentColor: '#1e3a8a',
    defaultFormation: '4-2-3-1',
    starters: [
      { name: 'Ter Stegen', number: 1, position: 'GK' },
      { name: 'Balde', number: 3, position: 'LB' },
      { name: 'Cubarsi', number: 2, position: 'CB' },
      { name: 'Inigo Martinez', number: 5, position: 'CB' },
      { name: 'Kounde', number: 23, position: 'RB' },
      { name: 'Casado', number: 17, position: 'CDM' },
      { name: 'Pedri', number: 8, position: 'CM' },
      { name: 'Raphinha', number: 11, position: 'LW' },
      { name: 'Dani Olmo', number: 20, position: 'CAM' },
      { name: 'Lamine Yamal', number: 19, position: 'RW' },
      { name: 'Lewandowski', number: 9, position: 'ST' },
    ],
    bench: [
      { name: 'Inaki Pena', number: 13, position: 'GK' },
      { name: 'Gavi', number: 6, position: 'CM' },
      { name: 'Frenkie de Jong', number: 21, position: 'CM' },
      { name: 'Ferran Torres', number: 7, position: 'ST' },
      { name: 'Fermin Lopez', number: 16, position: 'CAM' },
    ],
  },
  {
    id: 'man-city',
    name: 'Manchester City',
    manager: 'Pep Guardiola',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png',
    primaryColor: '#0284c7',
    accentColor: '#ffffff',
    defaultFormation: '4-3-3',
    starters: [
      { name: 'Ederson', number: 31, position: 'GK' },
      { name: 'Gvardiol', number: 24, position: 'LB' },
      { name: 'Dias', number: 3, position: 'CB' },
      { name: 'Akanji', number: 25, position: 'CB' },
      { name: 'Walker', number: 2, position: 'RB' },
      { name: 'Rodri', number: 16, position: 'CDM' },
      { name: 'De Bruyne', number: 17, position: 'CAM' },
      { name: 'Bernardo', number: 20, position: 'CM' },
      { name: 'Doku', number: 11, position: 'LW' },
      { name: 'Haaland', number: 9, position: 'ST' },
      { name: 'Foden', number: 47, position: 'RW' },
    ],
    bench: [
      { name: 'Ortega', number: 18, position: 'GK' },
      { name: 'Stones', number: 5, position: 'CB' },
      { name: 'Kovacic', number: 8, position: 'CM' },
      { name: 'Gundogan', number: 19, position: 'CM' },
      { name: 'Savinho', number: 26, position: 'RW' },
    ],
  },
  {
    id: 'arsenal',
    name: 'Arsenal FC',
    manager: 'Mikel Arteta',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
    primaryColor: '#dc2626',
    accentColor: '#ffffff',
    defaultFormation: '4-3-3',
    starters: [
      { name: 'Raya', number: 22, position: 'GK' },
      { name: 'Calafiori', number: 33, position: 'LB' },
      { name: 'Gabriel', number: 6, position: 'CB' },
      { name: 'Saliba', number: 2, position: 'CB' },
      { name: 'White', number: 4, position: 'RB' },
      { name: 'Partey', number: 5, position: 'CDM' },
      { name: 'Rice', number: 41, position: 'CM' },
      { name: 'Odegaard', number: 8, position: 'CAM' },
      { name: 'Martinelli', number: 11, position: 'LW' },
      { name: 'Havertz', number: 29, position: 'ST' },
      { name: 'Saka', number: 7, position: 'RW' },
    ],
    bench: [
      { name: 'Neto', number: 32, position: 'GK' },
      { name: 'Merino', number: 23, position: 'CM' },
      { name: 'Trossard', number: 19, position: 'LW' },
      { name: 'Sterling', number: 30, position: 'RW' },
      { name: 'Jesus', number: 9, position: 'ST' },
    ],
  },
  {
    id: 'liverpool',
    name: 'Liverpool FC',
    manager: 'Arne Slot',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png',
    primaryColor: '#b91c1c',
    accentColor: '#ffffff',
    defaultFormation: '4-3-3',
    starters: [
      { name: 'Alisson', number: 1, position: 'GK' },
      { name: 'Robertson', number: 26, position: 'LB' },
      { name: 'Van Dijk', number: 4, position: 'CB' },
      { name: 'Konate', number: 5, position: 'CB' },
      { name: 'Alexander-Arnold', number: 66, position: 'RB' },
      { name: 'Gravenberch', number: 38, position: 'CDM' },
      { name: 'Mac Allister', number: 10, position: 'CM' },
      { name: 'Szoboszlai', number: 8, position: 'CAM' },
      { name: 'Diaz', number: 7, position: 'LW' },
      { name: 'Jota', number: 20, position: 'ST' },
      { name: 'Salah', number: 11, position: 'RW' },
    ],
    bench: [
      { name: 'Kelleher', number: 62, position: 'GK' },
      { name: 'Nunez', number: 9, position: 'ST' },
      { name: 'Gakpo', number: 18, position: 'LW' },
      { name: 'Jones', number: 17, position: 'CM' },
      { name: 'Elliott', number: 19, position: 'CAM' },
    ],
  },
];

export const TeamFormationBuilder: React.FC = () => {
  const [selectedClubId, setSelectedClubId] = useState<string>('real-madrid');
  const currentClub = WORLD_CLUBS.find(c => c.id === selectedClubId) || WORLD_CLUBS[0];

  const [teamName, setTeamName] = useState<string>(currentClub.name);
  const [managerName, setManagerName] = useState<string>(currentClub.manager);
  const [customLogoUrl, setCustomLogoUrl] = useState<string>(currentClub.logo);
  const [selectedCrestIcon, setSelectedCrestIcon] = useState<string>('🛡️');
  const [formationKey, setFormationKey] = useState<string>(currentClub.defaultFormation);
  const [tacticalStyle, setTacticalStyle] = useState<string>('Gegenpressing');
  const [kitPrimaryColor, setKitPrimaryColor] = useState<string>(currentClub.primaryColor || '#1e3a8a');
  const [pitchTheme, setPitchTheme] = useState<'classic' | 'noir' | 'midnight' | 'chalkboard'>('classic');
  const [showPassingLanes, setShowPassingLanes] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Custom formation user input
  const [customFormationInput, setCustomFormationInput] = useState<string>('3-4-2-1');
  const [customFormationError, setCustomFormationError] = useState<string>('');

  // Continuous Silky Smooth Dragging State (0 big leaps, 1:1 direct tracking)
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragMovedRef = useRef<boolean>(false);

  // Initialize players
  const [players, setPlayers] = useState<Player[]>(() => {
    const coords = FORMATION_COORDINATES[currentClub.defaultFormation] || FORMATION_COORDINATES['4-3-3'];
    return currentClub.starters.map((s, idx) => ({
      id: `p-${idx}`,
      name: s.name,
      number: s.number,
      position: s.position,
      x: coords[idx]?.x ?? 50,
      y: coords[idx]?.y ?? 50,
      isCaptain: idx === 1,
    }));
  });

  const [bench, setBench] = useState<Player[]>(() => {
    return currentClub.bench.map((b, idx) => ({
      id: `b-${idx}`,
      name: b.name,
      number: b.number,
      position: b.position,
      x: 0,
      y: 0,
    }));
  });

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editingModal, setEditingModal] = useState<boolean>(false);
  const [customLogoModal, setCustomLogoModal] = useState<boolean>(false);
  const [addBenchModal, setAddBenchModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pitchRef = useRef<HTMLDivElement>(null);

  // Switch preset club
  const handleSelectClub = (clubId: string) => {
    sounds.playClick();
    setSelectedClubId(clubId);
    const club = WORLD_CLUBS.find(c => c.id === clubId);
    if (!club) return;

    setTeamName(club.name);
    setManagerName(club.manager);
    setCustomLogoUrl(club.logo);
    setFormationKey(club.defaultFormation);
    setKitPrimaryColor(club.primaryColor);

    const coords = FORMATION_COORDINATES[club.defaultFormation] || FORMATION_COORDINATES['4-3-3'];
    setPlayers(
      club.starters.map((s, idx) => ({
        id: `p-${idx}`,
        name: s.name,
        number: s.number,
        position: s.position,
        x: coords[idx]?.x ?? 50,
        y: coords[idx]?.y ?? 50,
        isCaptain: idx === 1,
      }))
    );

    setBench(
      club.bench.map((b, idx) => ({
        id: `b-${idx}`,
        name: b.name,
        number: b.number,
        position: b.position,
        x: 0,
        y: 0,
      }))
    );
    setSelectedPlayer(null);
  };

  // Change formation via preset dropdown
  const handleSelectFormation = (fKey: string) => {
    sounds.playClick();
    setFormationKey(fKey);
    setCustomFormationError('');
    if (fKey === 'Custom') return;

    const coords = FORMATION_COORDINATES[fKey] || FORMATION_COORDINATES['4-3-3'];
    setPlayers(prev =>
      prev.map((p, idx) => ({
        ...p,
        x: coords[idx]?.x ?? p.x,
        y: coords[idx]?.y ?? p.y,
      }))
    );
  };

  // Apply custom formation string inputted by user (e.g. "3-4-2-1", "4-3-3", "3-5-2", "5-3-2", "4-1-4-1")
  const applyCustomFormation = (inputStr: string) => {
    const trimmed = inputStr.trim();
    if (!trimmed) return;

    // Parse parts
    const parts = trimmed.split(/[-–—\s,]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n) && n > 0);
    const totalOutfield = parts.reduce((a, b) => a + b, 0);

    if (totalOutfield !== 10) {
      setCustomFormationError(
        `Total outfield players must equal 10 (+ 1 Goalkeeper = 11). You entered ${totalOutfield}. (Example: 3-4-2-1, 4-2-3-1, 4-3-3, 3-5-2)`
      );
      return;
    }

    setCustomFormationError('');
    sounds.playSuccess();
    setFormationKey(trimmed);

    // Compute coordinates for 11 players: 1 GK at bottom + distributed rows
    const newCoords: { x: number; y: number }[] = [];
    // Index 0: Goalkeeper
    newCoords.push({ x: 50, y: 88 });

    const numLines = parts.length;
    const minY = 18; // attacking row
    const maxY = 72; // defensive row

    parts.forEach((lineCount, lineIdx) => {
      // lineIdx: 0 is defense, numLines-1 is forwards
      const y = numLines === 1
        ? 50
        : maxY - (lineIdx / (numLines - 1)) * (maxY - minY);

      for (let i = 0; i < lineCount; i++) {
        const x = lineCount === 1
          ? 50
          : 15 + ((i + 0.5) / lineCount) * 70;
        newCoords.push({ x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) });
      }
    });

    setPlayers(prev =>
      prev.map((p, idx) => ({
        ...p,
        x: newCoords[idx]?.x ?? p.x,
        y: newCoords[idx]?.y ?? p.y,
      }))
    );
  };

  // POINTER DRAG IMPLEMENTATION: 1:1 Direct Tracking (Finger or Mouse, Zero big leaps)
  const handlePlayerPointerDown = (id: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingId(id);
    dragMovedRef.current = false;
    setSelectedPlayer(players.find(p => p.id === id) || null);
  };

  const handlePitchPointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !pitchRef.current) return;
    dragMovedRef.current = true;
    const rect = pitchRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(6, Math.min(94, Number(rawX.toFixed(1))));
    const clampedY = Math.max(6, Math.min(94, Number(rawY.toFixed(1))));

    setPlayers(prev =>
      prev.map(p => (p.id === draggingId ? { ...p, x: clampedX, y: clampedY } : p))
    );
    // Mark formation as customized
    if (formationKey !== 'Custom' && !formationKey.includes('Custom')) {
      setFormationKey(`Custom (${formationKey})`);
    }
  };

  const handlePitchPointerUp = (e: React.PointerEvent) => {
    if (draggingId) {
      if (dragMovedRef.current) {
        sounds.playClick(420, 0.03);
      }
      setDraggingId(null);
    }
  };

  // Handle custom image logo upload via FileReader
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      if (typeof evt.target?.result === 'string') {
        setCustomLogoUrl(evt.target.result);
        sounds.playSuccess();
        setCustomLogoModal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Swap starter with bench substitute
  const handleSwapWithBench = (starterId: string, benchId: string) => {
    sounds.playSuccess();
    const pIdx = players.findIndex(p => p.id === starterId);
    const bIdx = bench.findIndex(b => b.id === benchId);
    if (pIdx === -1 || bIdx === -1) return;

    const currentStarter = players[pIdx];
    const currentBench = bench[bIdx];

    const nextStarters = [...players];
    nextStarters[pIdx] = {
      ...currentBench,
      id: currentStarter.id,
      x: currentStarter.x,
      y: currentStarter.y,
    };

    const nextBench = [...bench];
    nextBench[bIdx] = {
      ...currentStarter,
      id: currentBench.id,
      x: 0,
      y: 0,
    };

    setPlayers(nextStarters);
    setBench(nextBench);
    setSelectedPlayer(null);
  };

  // Save Player Details (Name, Number, Position, Captaincy, Role)
  const handleSavePlayerEdit = (
    name: string,
    number: number,
    position: string,
    isCaptain: boolean,
    isViceCaptain: boolean,
    role?: string
  ) => {
    sounds.playClick();
    if (!selectedPlayer) return;

    setPlayers(prev =>
      prev.map(p => {
        if (p.id === selectedPlayer.id) {
          return { ...p, name, number, position, isCaptain, isViceCaptain, role };
        }
        return {
          ...p,
          isCaptain: isCaptain ? false : p.isCaptain,
          isViceCaptain: isViceCaptain ? false : p.isViceCaptain,
        };
      })
    );
    setEditingModal(false);
    setSelectedPlayer(null);
  };

  // Add new player to bench
  const handleAddBenchPlayer = (name: string, number: number, position: string) => {
    sounds.playSuccess();
    const newPlayer: Player = {
      id: `b-${Date.now()}`,
      name,
      number,
      position,
      x: 0,
      y: 0,
    };
    setBench(prev => [...prev, newPlayer]);
    setAddBenchModal(false);
  };

  // Delete bench player
  const handleDeleteBenchPlayer = (subId: string) => {
    sounds.playClick();
    setBench(prev => prev.filter(p => p.id !== subId));
  };

  // Save Lineup to local storage
  const handleSaveLineupLocally = () => {
    sounds.playSuccess();
    try {
      const squadData = {
        teamName,
        managerName,
        customLogoUrl,
        formationKey,
        tacticalStyle,
        kitPrimaryColor,
        pitchTheme,
        players,
        bench,
      };
      localStorage.setItem('omni_saved_formation', JSON.stringify(squadData));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      // ignore
    }
  };

  // Load Saved Lineup from local storage
  const handleLoadSavedLineup = () => {
    try {
      const saved = localStorage.getItem('omni_saved_formation');
      if (saved) {
        sounds.playSuccess();
        const data = JSON.parse(saved);
        if (data.teamName) setTeamName(data.teamName);
        if (data.managerName) setManagerName(data.managerName);
        if (data.customLogoUrl !== undefined) setCustomLogoUrl(data.customLogoUrl);
        if (data.formationKey) setFormationKey(data.formationKey);
        if (data.tacticalStyle) setTacticalStyle(data.tacticalStyle);
        if (data.kitPrimaryColor) setKitPrimaryColor(data.kitPrimaryColor);
        if (data.pitchTheme) setPitchTheme(data.pitchTheme);
        if (data.players) setPlayers(data.players);
        if (data.bench) setBench(data.bench);
      }
    } catch {
      // ignore
    }
  };

  // Copy Lineup text
  const handleCopyLineup = () => {
    sounds.playSuccess();
    const text = `⚽ ${teamName} (${formationKey})\nManager: ${managerName}\nTactics: ${tacticalStyle}\n\nStarting Lineup:\n${players
      .map(
        p =>
          `${p.number}. ${p.name} (${p.position})${p.isCaptain ? ' [C]' : ''}${
            p.isViceCaptain ? ' [VC]' : ''
          }${p.role ? ` [${p.role}]` : ''}`
      )
      .join('\n')}\n\nSubstitutes Bench:\n${bench
      .map(b => `${b.number}. ${b.name} (${b.position})`)
      .join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Pitch theme background styling
  const getPitchStyleClasses = () => {
    switch (pitchTheme) {
      case 'noir':
        return 'bg-zinc-950 border-zinc-800 text-cyan-400';
      case 'midnight':
        return 'bg-slate-900 border-slate-700 text-indigo-400';
      case 'chalkboard':
        return 'bg-emerald-950 border-emerald-900 text-white';
      default:
        return 'bg-emerald-800 border-emerald-950 text-white';
    }
  };

  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Generate High-Resolution Pitch Canvas for PNG and PDF exports
  const generatePitchCanvas = (): HTMLCanvasElement => {
    const W = 1200;
    const H = 1600;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // 1. Draw Pitch Background
    if (pitchTheme === 'noir') {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, W, H);
    } else if (pitchTheme === 'midnight') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, H);
    } else if (pitchTheme === 'chalkboard') {
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, W, H);
    } else {
      // Classic Lawn Stripes
      const stripes = 12;
      const stripeH = H / stripes;
      for (let i = 0; i < stripes; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#15803d' : '#166534';
        ctx.fillRect(0, i * stripeH, W, stripeH);
      }
    }

    // 2. Pitch Markings (White strokes)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const pX = W * 0.05;
    const pY = H * 0.04;
    const pW = W * 0.9;
    const pH = H * 0.92;

    // Outer border
    ctx.strokeRect(pX, pY, pW, pH);

    // Halfway line
    ctx.beginPath();
    ctx.moveTo(pX, H * 0.5);
    ctx.lineTo(pX + pW, H * 0.5);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(W * 0.5, H * 0.5, W * 0.14, 0, Math.PI * 2);
    ctx.stroke();

    // Center kick-off spot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(W * 0.5, H * 0.5, 8, 0, Math.PI * 2);
    ctx.fill();

    // Penalty Boxes & Goal Boxes (Top & Bottom)
    // Top Penalty Box
    ctx.strokeRect(W * 0.28, pY, W * 0.44, H * 0.16);
    ctx.strokeRect(W * 0.37, pY, W * 0.26, H * 0.07);
    ctx.beginPath();
    ctx.arc(W * 0.5, pY + H * 0.12, 6, 0, Math.PI * 2);
    ctx.fill();

    // Bottom Penalty Box
    ctx.strokeRect(W * 0.28, pY + pH - H * 0.16, W * 0.44, H * 0.16);
    ctx.strokeRect(W * 0.37, pY + pH - H * 0.07, W * 0.26, H * 0.07);
    ctx.beginPath();
    ctx.arc(W * 0.5, pY + pH - H * 0.12, 6, 0, Math.PI * 2);
    ctx.fill();

    // Penalty Arcs
    ctx.beginPath();
    ctx.arc(W * 0.5, pY + H * 0.12, W * 0.09, 0.65, Math.PI - 0.65);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W * 0.5, pY + pH - H * 0.12, W * 0.09, Math.PI + 0.65, -0.65);
    ctx.stroke();

    // Corner arcs
    const rC = 30;
    ctx.beginPath();
    ctx.arc(pX, pY, rC, 0, Math.PI / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(pX + pW, pY, rC, Math.PI / 2, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(pX, pY + pH, rC, -Math.PI / 2, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(pX + pW, pY + pH, rC, Math.PI, -Math.PI / 2);
    ctx.stroke();

    // 3. Header Tactical Banner
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.roundRect(pX + 20, pY + 20, 480, 72, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`${teamName}`, pX + 44, pY + 52);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`· ${formationKey} · ${managerName ? 'Mgr: ' + managerName : ''}`, pX + 44, pY + 78);

    // 4. Draw Player Tokens
    players.forEach(player => {
      const posX = (player.x / 100) * W;
      const posY = (player.y / 100) * H;
      const radius = 42;

      // Drop shadow for token
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 6;

      // Circle badge
      ctx.fillStyle = kitPrimaryColor;
      ctx.beginPath();
      ctx.arc(posX, posY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Number
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(player.number), posX, posY);

      // Captain / Vice-Captain Badge
      if (player.isCaptain || player.isViceCaptain) {
        ctx.fillStyle = player.isCaptain ? '#eab308' : '#cbd5e1';
        ctx.beginPath();
        ctx.arc(posX + radius * 0.7, posY - radius * 0.7, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#000000';
        ctx.font = 'black 14px sans-serif';
        ctx.fillText(player.isCaptain ? 'C' : 'VC', posX + radius * 0.7, posY - radius * 0.7);
      }

      // Name & Position Tag Pill below token
      const tagText = `${player.name} (${player.position})`;
      ctx.font = 'bold 18px sans-serif';
      const textMetrics = ctx.measureText(tagText);
      const pillW = textMetrics.width + 24;
      const pillH = 30;
      const pillX = posX - pillW / 2;
      const pillY = posY + radius + 10;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 15);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(tagText, posX, pillY + pillH / 2);
    });

    return canvas;
  };

  // High-Quality PNG Export
  const handleExportPNG = () => {
    sounds.playSuccess();
    const canvas = generatePitchCanvas();
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${teamName.replace(/\s+/g, '_')}_Formation_${formationKey}.png`;
    a.click();
  };

  // High-Quality Print PDF Export
  const handleExportPDF = () => {
    sounds.playSuccess();
    const canvas = generatePitchCanvas();
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Match Header Banner
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, 210, 26, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(15);
    pdf.text(`${teamName.toUpperCase()} — OFFICIAL TACTICAL LINEUP`, 15, 12);
    pdf.setFontSize(9.5);
    pdf.setTextColor(203, 213, 225);
    pdf.text(`Formation: ${formationKey}   |   Manager: ${managerName || 'Tactical Team'}   |   Style: ${tacticalStyle}`, 15, 20);

    // Pitch visual diagram
    const imgW = 110;
    const imgH = 146.6;
    const imgX = (210 - imgW) / 2;
    pdf.addImage(imgData, 'PNG', imgX, 29, imgW, imgH);

    // Roster Table below pitch
    const startY = 180;
    pdf.setFillColor(241, 245, 249);
    pdf.rect(15, startY, 180, 7, 'F');
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NO.', 18, startY + 5);
    pdf.text('PLAYER NAME', 35, startY + 5);
    pdf.text('POSITION', 105, startY + 5);
    pdf.text('ROLE / CAPTAINCY', 135, startY + 5);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    players.slice(0, 11).forEach((p, idx) => {
      const rowY = startY + 12 + idx * 5.2;
      if (idx % 2 === 1) {
        pdf.setFillColor(248, 250, 252);
        pdf.rect(15, rowY - 3.8, 180, 5.2, 'F');
      }
      pdf.text(String(p.number), 18, rowY);
      pdf.text(p.name, 35, rowY);
      pdf.text(p.position, 105, rowY);
      const badges = [
        p.isCaptain ? 'Captain [C]' : '',
        p.isViceCaptain ? 'Vice-Captain [VC]' : '',
        p.role || ''
      ].filter(Boolean).join(' · ');
      pdf.text(badges || 'Starting XI', 135, rowY);
    });

    // Bench substitutes
    if (bench.length > 0) {
      const benchY = startY + 74;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.text('SUBSTITUTES BENCH: ' + bench.map(b => `${b.number}. ${b.name} (${b.position})`).join(', '), 15, benchY);
    }

    pdf.save(`${teamName.replace(/\s+/g, '_')}_Formation_${formationKey}.pdf`);
  };

  // Export Squad JSON file
  const handleExportJSON = () => {
    sounds.playSuccess();
    const squadData = {
      teamName,
      managerName,
      customLogoUrl,
      formationKey,
      tacticalStyle,
      kitPrimaryColor,
      pitchTheme,
      players,
      bench,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(squadData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${teamName.replace(/\s+/g, '_')}_Squad.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Squad JSON file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.teamName) setTeamName(data.teamName);
        if (data.managerName) setManagerName(data.managerName);
        if (data.customLogoUrl !== undefined) setCustomLogoUrl(data.customLogoUrl);
        if (data.formationKey) setFormationKey(data.formationKey);
        if (data.tacticalStyle) setTacticalStyle(data.tacticalStyle);
        if (data.kitPrimaryColor) setKitPrimaryColor(data.kitPrimaryColor);
        if (data.pitchTheme) setPitchTheme(data.pitchTheme);
        if (data.players) setPlayers(data.players);
        if (data.bench) setBench(data.bench);
        sounds.playSuccess();
      } catch {
        // ignore
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Club & Config Banner */}
      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Team Crest & Name / Manager Edit */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            onClick={() => setCustomLogoModal(true)}
            className="w-14 h-14 sm:w-16 sm:h-16 p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-500/40 transition-all relative group"
            title="Click to customize team crest / logo"
          >
            {customLogoUrl ? (
              <img src={customLogoUrl} alt="" className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-sm" />
            ) : (
              <span className="text-2xl sm:text-3xl">{selectedCrestIcon}</span>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50 bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-indigo-500 focus:outline-none truncate max-w-[200px] sm:max-w-xs"
              />
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                {formationKey}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 flex-wrap">
              <span>Manager:</span>
              <input
                type="text"
                value={managerName}
                onChange={e => setManagerName(e.target.value)}
                className="font-bold text-zinc-700 dark:text-zinc-300 bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Preset Club Dropdown + Formation Switcher + Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Club Preset
            </label>
            <select
              value={selectedClubId}
              onChange={e => handleSelectClub(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer"
            >
              {WORLD_CLUBS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Formation Preset
            </label>
            <select
              value={formationKey.includes('Custom') ? 'Custom' : formationKey}
              onChange={e => handleSelectFormation(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer"
            >
              {Object.keys(FORMATION_COORDINATES).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
              <option value="Custom">Custom Lineup</option>
            </select>
          </div>

          <div className="self-end flex flex-wrap items-center gap-1.5">
            <button
              onClick={handleSaveLineupLocally}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Save custom squad to local storage"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Saved!' : 'Save'}</span>
            </button>

            <button
              onClick={handleLoadSavedLineup}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Load previously saved squad"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Load</span>
            </button>

            <button
              onClick={handleExportPNG}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              title="Export high-resolution PNG image"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Export PNG</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              title="Download tactical print PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>

            <button
              onClick={handleCopyLineup}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold cursor-pointer active:scale-95 transition-all"
              title="Copy squad roster text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* USER INPUT CUSTOM FORMATION BAR */}
      <div className="bg-white dark:bg-zinc-900 p-3.5 sm:p-4 rounded-3xl border border-indigo-200/80 dark:border-indigo-900/50 shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 block">
                Input Custom Formation
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Type any custom formation (e.g. 3-4-2-1, 4-2-3-1, 3-5-2, 5-3-2) to auto-align all 11 players:
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customFormationInput}
              onChange={e => {
                setCustomFormationInput(e.target.value);
                setCustomFormationError('');
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  applyCustomFormation(customFormationInput);
                }
              }}
              placeholder="e.g. 3-4-2-1"
              className="w-28 sm:w-32 px-3 py-1.5 text-xs font-mono font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 text-center"
            />
            <button
              onClick={() => applyCustomFormation(customFormationInput)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Quick Custom Formation Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-1 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 shrink-0">
            Quick Formations:
          </span>
          {['3-4-2-1', '4-2-3-1', '3-5-2', '4-3-3', '4-4-2', '5-3-2', '4-1-2-1-2', '3-4-3'].map(preset => (
            <button
              key={preset}
              onClick={() => {
                setCustomFormationInput(preset);
                applyCustomFormation(preset);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all shrink-0 cursor-pointer ${
                formationKey === preset
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {customFormationError && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 pt-1">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>{customFormationError}</span>
          </div>
        )}
      </div>

      {/* Feature Toolbar: Custom Logo, Jersey Color, Pitch Theme, Passing Lines */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 p-3 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Smooth Drag Info Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 shadow-2xs">
            <Move className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Smooth Drag: Touch or Mouse (Direct Pointer 1:1)</span>
          </div>

          {/* Set Own Logo Button */}
          <button
            onClick={() => setCustomLogoModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Custom Team Logo</span>
          </button>

          {/* Toggle Passing Lanes */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowPassingLanes(prev => !prev);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              showPassingLanes
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 font-bold'
                : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Tactical Lanes</span>
          </button>
        </div>

        {/* Pitch Theme & Kit Color Selectors */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400">Theme:</span>
            <select
              value={pitchTheme}
              onChange={e => setPitchTheme(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px] font-bold"
            >
              <option value="classic">Turf Grass</option>
              <option value="noir">Noir Tactical</option>
              <option value="midnight">Midnight Stadium</option>
              <option value="chalkboard">Coaching Board</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400">Jersey:</span>
            <input
              type="color"
              value={kitPrimaryColor}
              onChange={e => setKitPrimaryColor(e.target.value)}
              className="w-6 h-6 rounded-lg cursor-pointer border border-zinc-200 dark:border-zinc-700 p-0"
              title="Pick team jersey color"
            />
          </div>

          <div className="flex items-center gap-1.5 sm:ml-auto">
            <button
              onClick={handleExportPNG}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] border border-indigo-200 dark:border-indigo-800 cursor-pointer shadow-2xs"
              title="Download High-Res PNG image of the pitch"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Save PNG</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-[11px] border border-zinc-200 dark:border-zinc-700 cursor-pointer shadow-2xs"
              title="Download tactical match PDF"
            >
              <FileText className="w-3 h-3" />
              <span>Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Pitch & Squad View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TACTICAL PITCH CANVAS (Left 8 Cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div
            ref={pitchRef}
            onPointerMove={handlePitchPointerMove}
            onPointerUp={handlePitchPointerUp}
            onPointerCancel={handlePitchPointerUp}
            className={`w-full max-w-2xl aspect-[3/4] relative rounded-3xl overflow-hidden shadow-2xl border-4 transition-colors select-none touch-none ${getPitchStyleClasses()}`}
          >
            {/* Lawn Strips */}
            {pitchTheme === 'classic' && (
              <div className="absolute inset-0 flex flex-col pointer-events-none opacity-25">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${i % 2 === 0 ? 'bg-emerald-700/60' : 'bg-emerald-800/60'}`}
                  />
                ))}
              </div>
            )}

            {/* Pitch Markings SVG */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none stroke-white/40"
              fill="none"
              strokeWidth="2"
            >
              <rect x="5%" y="4%" width="90%" height="92%" />
              <line x1="5%" y1="50%" x2="95%" y2="50%" />
              <circle cx="50%" cy="50%" r="13%" />
              <circle cx="50%" cy="50%" r="1%" fill="white" />
              <rect x="28%" y="4%" width="44%" height="16%" />
              <rect x="37%" y="4%" width="26%" height="7%" />
              <circle cx="50%" cy="13%" r="0.8%" fill="white" />
              <rect x="28%" y="80%" width="44%" height="16%" />
              <rect x="37%" y="89%" width="26%" height="7%" />
              <circle cx="50%" cy="87%" r="0.8%" fill="white" />
              <path d="M 5% 7% A 3% 3% 0 0 0 8% 4%" />
              <path d="M 95% 7% A 3% 3% 0 0 1 92% 4%" />
              <path d="M 5% 93% A 3% 3% 0 0 1 8% 96%" />
              <path d="M 95% 93% A 3% 3% 0 0 0 92% 96%" />

              {/* Tactical Passing Lanes between lines */}
              {showPassingLanes && (
                <g stroke="#ffffff" strokeWidth="1" strokeDasharray="4 4" opacity="0.35">
                  {players.slice(1, 5).map((def, idx, arr) => {
                    const next = arr[idx + 1];
                    return next ? (
                      <line
                        key={`def-${idx}`}
                        x1={`${def.x}%`}
                        y1={`${def.y}%`}
                        x2={`${next.x}%`}
                        y2={`${next.y}%`}
                      />
                    ) : null;
                  })}
                  {players.slice(5, 9).map((mid, idx, arr) => {
                    const next = arr[idx + 1];
                    return next ? (
                      <line
                        key={`mid-${idx}`}
                        x1={`${mid.x}%`}
                        y1={`${mid.y}%`}
                        x2={`${next.x}%`}
                        y2={`${next.y}%`}
                      />
                    ) : null;
                  })}
                </g>
              )}
            </svg>

            {/* Team Logo Badge on Pitch Header */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
              {customLogoUrl ? (
                <img src={customLogoUrl} alt="" className="w-4 h-4 object-contain" />
              ) : (
                <span className="text-xs">{selectedCrestIcon}</span>
              )}
              <span className="text-white font-extrabold text-xs tracking-tight truncate max-w-[130px]">
                {teamName}
              </span>
              <span className="text-white/60 text-[10px] font-mono">· {formationKey}</span>
            </div>

            {/* Pitch Player Tokens - Silky Smooth Pointer Tracking */}
            {players.map(player => {
              const isSelected = selectedPlayer?.id === player.id;
              const isDragging = draggingId === player.id;

              return (
                <div
                  key={player.id}
                  onPointerDown={e => handlePlayerPointerDown(player.id, e)}
                  style={{
                    left: `${player.x}%`,
                    top: `${player.y}%`,
                    transform: 'translate(-50%, -50%)',
                    touchAction: 'none',
                  }}
                  className={`absolute z-20 flex flex-col items-center select-none touch-none cursor-grab active:cursor-grabbing transition-transform ${
                    isDragging
                      ? 'scale-125 z-50 transition-none'
                      : isSelected
                      ? 'scale-110 z-30'
                      : 'hover:scale-105'
                  }`}
                >
                  {/* Badge Token with Team Jersey Colors & Custom Logo */}
                  <div
                    style={{ backgroundColor: kitPrimaryColor }}
                    className={`w-9 h-9 sm:w-12 sm:h-12 rounded-2xl flex flex-col items-center justify-center p-0.5 shadow-xl border-2 transition-all relative ${
                      isDragging
                        ? 'ring-4 ring-amber-400 border-white shadow-2xl scale-110'
                        : isSelected
                        ? 'ring-4 ring-amber-400 border-white'
                        : 'border-white/80 hover:border-amber-300'
                    }`}
                  >
                    {/* Club Crest or Number */}
                    {customLogoUrl ? (
                      <img
                        src={customLogoUrl}
                        alt=""
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain opacity-90 drop-shadow-xs pointer-events-none"
                      />
                    ) : (
                      <span className="text-[10px] leading-none pointer-events-none">{selectedCrestIcon}</span>
                    )}

                    <span className="text-[11px] sm:text-xs font-black text-white leading-none mt-0.5 font-mono drop-shadow-sm pointer-events-none">
                      {player.number}
                    </span>

                    {/* Captain / Vice Captain Badges */}
                    {player.isCaptain && (
                      <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-zinc-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-white">
                        C
                      </span>
                    )}
                    {player.isViceCaptain && !player.isCaptain && (
                      <span className="absolute -top-1.5 -right-1.5 bg-sky-400 text-zinc-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-white">
                        V
                      </span>
                    )}
                  </div>

                  {/* Player Name Tag */}
                  <div className="mt-1 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs border border-white/20 text-[9px] sm:text-[10px] font-bold text-white shadow-sm flex items-center gap-1 max-w-[85px] sm:max-w-[100px] truncate pointer-events-none">
                    <span className="text-amber-400 text-[8px] font-mono">{player.position}</span>
                    <span className="truncate">{player.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-zinc-400 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3 text-amber-500" />
            <span>Drag any player with mouse or finger to move smoothly across pitch coordinates.</span>
          </p>
        </div>

        {/* SQUAD LIST & BENCH MANAGEMENT (Right 4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Player Quick Card */}
          {selectedPlayer ? (
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border-2 border-amber-400 dark:border-amber-500 shadow-md space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: kitPrimaryColor }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-mono font-bold text-xs"
                  >
                    {selectedPlayer.number}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 truncate">
                      {selectedPlayer.name}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedPlayer.position} · X: {selectedPlayer.x}%, Y: {selectedPlayer.y}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setEditingModal(true)}
                  className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 text-xs font-bold cursor-pointer"
                  title="Edit player name, number & role"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bench Sub Selector: Click bench player to swap */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Substitute with Bench Player:
                </span>
                <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {bench.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => handleSwapWithBench(selectedPlayer.id, sub.id)}
                      className="flex items-center justify-between p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left text-xs transition-colors cursor-pointer group"
                    >
                      <span className="truncate text-zinc-800 dark:text-zinc-200">
                        {sub.number}. {sub.name}
                      </span>
                      <ArrowRightLeft className="w-3 h-3 text-zinc-400 group-hover:text-indigo-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400 bg-white/50 dark:bg-zinc-900/50">
              Tap any player token on the pitch to edit details or make substitutions.
            </div>
          )}

          {/* Substitutes Bench List */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Substitutes Bench ({bench.length})</span>
              </h3>
              <button
                onClick={() => setAddBenchModal(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Sub</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {bench.map(sub => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                      {sub.number}
                    </span>
                    <div className="truncate">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 block truncate">
                        {sub.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">{sub.position}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteBenchPlayer(sub.id)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                    title="Remove substitute"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Custom Team Logo Upload */}
      {customLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              Customize Team Crest & Logo
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Upload your own club emblem image or choose an emoji crest:
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer bg-zinc-50/50 dark:bg-zinc-800/40"
            >
              <Upload className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                Upload Crest Image (PNG/JPG)
              </span>
              <span className="text-[10px] text-zinc-400">Transparent PNG recommended</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />

            <div>
              <span className="text-xs font-bold text-zinc-500 block mb-2">Or Choose Symbol:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {['🛡️', '⚡', '🦅', '🦁', '⭐', '🔥', '👑', '🐉'].map(symbol => (
                  <button
                    key={symbol}
                    onClick={() => {
                      setSelectedCrestIcon(symbol);
                      setCustomLogoUrl('');
                      setCustomLogoModal(false);
                      sounds.playSuccess();
                    }}
                    className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCustomLogoModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs cursor-pointer hover:bg-zinc-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Player Modal */}
      {editingModal && selectedPlayer && (
        <PlayerEditDialog
          player={selectedPlayer}
          onSave={handleSavePlayerEdit}
          onClose={() => setEditingModal(false)}
        />
      )}

      {/* MODAL 3: Add Bench Player Modal */}
      {addBenchModal && (
        <AddBenchPlayerDialog
          onAdd={handleAddBenchPlayer}
          onClose={() => setAddBenchModal(false)}
        />
      )}
    </div>
  );
};

// Internal Player Edit Dialog Component
const PlayerEditDialog: React.FC<{
  player: Player;
  onSave: (
    name: string,
    number: number,
    position: string,
    isCaptain: boolean,
    isViceCaptain: boolean,
    role?: string
  ) => void;
  onClose: () => void;
}> = ({ player, onSave, onClose }) => {
  const [name, setName] = useState(player.name);
  const [number, setNumber] = useState(player.number);
  const [position, setPosition] = useState(player.position);
  const [isCaptain, setIsCaptain] = useState(!!player.isCaptain);
  const [isViceCaptain, setIsViceCaptain] = useState(!!player.isViceCaptain);
  const [role, setRole] = useState(player.role || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
        <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
          Edit Player Details
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-zinc-500 block mb-1">Player Name:</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-zinc-500 block mb-1">Squad Number:</label>
              <input
                type="number"
                value={number}
                onChange={e => setNumber(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 block mb-1">Position:</label>
              <select
                value={position}
                onChange={e => setPosition(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold"
              >
                <option value="GK">GK (Goalkeeper)</option>
                <option value="CB">CB (Center Back)</option>
                <option value="LB">LB (Left Back)</option>
                <option value="RB">RB (Right Back)</option>
                <option value="CDM">CDM (Defensive Mid)</option>
                <option value="CM">CM (Central Mid)</option>
                <option value="CAM">CAM (Attacking Mid)</option>
                <option value="LM">LM (Left Mid)</option>
                <option value="RM">RM (Right Mid)</option>
                <option value="LW">LW (Left Wing)</option>
                <option value="RW">RW (Right Wing)</option>
                <option value="ST">ST (Striker)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={isCaptain}
                onChange={e => {
                  setIsCaptain(e.target.checked);
                  if (e.target.checked) setIsViceCaptain(false);
                }}
                className="rounded text-amber-500"
              />
              <span>Captain (C)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={isViceCaptain}
                onChange={e => {
                  setIsViceCaptain(e.target.checked);
                  if (e.target.checked) setIsCaptain(false);
                }}
                className="rounded text-sky-500"
              />
              <span>Vice-Captain (VC)</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(name, number, position, isCaptain, isViceCaptain, role)}
            className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
          >
            Save Player
          </button>
        </div>
      </div>
    </div>
  );
};

// Internal Add Bench Dialog Component
const AddBenchPlayerDialog: React.FC<{
  onAdd: (name: string, number: number, position: string) => void;
  onClose: () => void;
}> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState(12);
  const [position, setPosition] = useState('CM');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
        <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
          Add Substitute Player
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-zinc-500 block mb-1">Player Name:</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Brahim Diaz"
              className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-zinc-500 block mb-1">Squad Number:</label>
              <input
                type="number"
                value={number}
                onChange={e => setNumber(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 block mb-1">Position:</label>
              <select
                value={position}
                onChange={e => setPosition(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold"
              >
                <option value="GK">GK</option>
                <option value="CB">CB</option>
                <option value="LB">LB</option>
                <option value="RB">RB</option>
                <option value="CDM">CDM</option>
                <option value="CM">CM</option>
                <option value="CAM">CAM</option>
                <option value="LW">LW</option>
                <option value="RW">RW</option>
                <option value="ST">ST</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => onAdd(name, number, position)}
            className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 disabled:opacity-50"
          >
            Add to Bench
          </button>
        </div>
      </div>
    </div>
  );
};
