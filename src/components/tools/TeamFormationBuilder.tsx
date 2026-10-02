import React, { useState } from 'react';
import {
  Users, Shirt, Shield, Shuffle, Download, Copy, Check,
  Edit2, Trash2, Plus, Sparkles, RefreshCw, Star, ArrowRightLeft,
  Settings, Award, Image
} from 'lucide-react';
import { sounds } from '../../utils/audio';

interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  x: number;
  y: number;
  isCaptain?: boolean;
}

interface ClubPreset {
  id: string;
  name: string;
  manager: string;
  logo: string;
  primaryColor: string;
  defaultFormation: string;
  starters: Array<{ name: string; number: number; position: string }>;
  bench: Array<{ name: string; number: number; position: string }>;
}

const WORLD_CLUBS: ClubPreset[] = [
  {
    id: 'real-madrid',
    name: 'Real Madrid CF',
    manager: 'Carlo Ancelotti',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png',
    primaryColor: '#0a0a0c',
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
      { name: 'Brahim', number: 21, position: 'RW' },
      { name: 'Endrick', number: 16, position: 'ST' },
      { name: 'Garcia', number: 20, position: 'LB' },
      { name: 'Alaba', number: 4, position: 'CB' },
    ],
  },
  {
    id: 'man-city',
    name: 'Manchester City',
    manager: 'Pep Guardiola',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png',
    primaryColor: '#6CABDD',
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
      { name: 'Grealish', number: 10, position: 'LW' },
      { name: 'Haaland', number: 9, position: 'ST' },
      { name: 'Foden', number: 47, position: 'RW' },
    ],
    bench: [
      { name: 'Ortega', number: 18, position: 'GK' },
      { name: 'Stones', number: 5, position: 'CB' },
      { name: 'Kovacic', number: 8, position: 'CM' },
      { name: 'Doku', number: 11, position: 'LW' },
      { name: 'Savinho', number: 26, position: 'RW' },
      { name: 'Ake', number: 6, position: 'CB' },
      { name: 'Lewis', number: 82, position: 'RB' },
    ],
  },
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    manager: 'Hansi Flick',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png',
    primaryColor: '#a50044',
    defaultFormation: '4-2-3-1',
    starters: [
      { name: 'Ter Stegen', number: 1, position: 'GK' },
      { name: 'Balde', number: 3, position: 'LB' },
      { name: 'Cubarsi', number: 2, position: 'CB' },
      { name: 'Inigo', number: 5, position: 'CB' },
      { name: 'Kounde', number: 23, position: 'RB' },
      { name: 'Casado', number: 17, position: 'CDM' },
      { name: 'Pedri', number: 8, position: 'CM' },
      { name: 'Raphinha', number: 11, position: 'LW' },
      { name: 'Olmo', number: 20, position: 'CAM' },
      { name: 'Lamine Yamal', number: 19, position: 'RW' },
      { name: 'Lewandowski', number: 9, position: 'ST' },
    ],
    bench: [
      { name: 'Pena', number: 13, position: 'GK' },
      { name: 'Gavi', number: 6, position: 'CM' },
      { name: 'Frenkie de Jong', number: 21, position: 'CM' },
      { name: 'Ferran', number: 7, position: 'ST' },
      { name: 'Fermin', number: 16, position: 'CAM' },
      { name: 'Christensen', number: 15, position: 'CB' },
      { name: 'Araujo', number: 4, position: 'CB' },
    ],
  },
  {
    id: 'arsenal',
    name: 'Arsenal FC',
    manager: 'Mikel Arteta',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
    primaryColor: '#EF0107',
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
      { name: 'Timber', number: 12, position: 'RB' },
      { name: 'Zinchenko', number: 17, position: 'LB' },
    ],
  },
  {
    id: 'liverpool',
    name: 'Liverpool FC',
    manager: 'Arne Slot',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png',
    primaryColor: '#C8102E',
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
      { name: 'Quansah', number: 78, position: 'CB' },
      { name: 'Tsimikas', number: 21, position: 'LB' },
    ],
  },
  {
    id: 'bayern',
    name: 'Bayern Munich',
    manager: 'Vincent Kompany',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png',
    primaryColor: '#DC052D',
    defaultFormation: '4-2-3-1',
    starters: [
      { name: 'Neuer', number: 1, position: 'GK' },
      { name: 'Davies', number: 19, position: 'LB' },
      { name: 'Kim Min-jae', number: 3, position: 'CB' },
      { name: 'Upamecano', number: 2, position: 'CB' },
      { name: 'Kimmich', number: 6, position: 'RB' },
      { name: 'Pavlovic', number: 45, position: 'CDM' },
      { name: 'Palhinha', number: 16, position: 'CDM' },
      { name: 'Gnabry', number: 7, position: 'LW' },
      { name: 'Musiala', number: 42, position: 'CAM' },
      { name: 'Olise', number: 17, position: 'RW' },
      { name: 'Harry Kane', number: 9, position: 'ST' },
    ],
    bench: [
      { name: 'Ulreich', number: 26, position: 'GK' },
      { name: 'Sane', number: 10, position: 'RW' },
      { name: 'Coman', number: 11, position: 'LW' },
      { name: 'Muller', number: 25, position: 'CAM' },
      { name: 'Goretzka', number: 8, position: 'CM' },
      { name: 'Dier', number: 15, position: 'CB' },
      { name: 'Guerreiro', number: 22, position: 'LB' },
    ],
  },
  {
    id: 'psg',
    name: 'Paris Saint-Germain',
    manager: 'Luis Enrique',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',
    primaryColor: '#004170',
    defaultFormation: '4-3-3',
    starters: [
      { name: 'Donnarumma', number: 1, position: 'GK' },
      { name: 'Nuno Mendes', number: 25, position: 'LB' },
      { name: 'Pacho', number: 51, position: 'CB' },
      { name: 'Marquinhos', number: 5, position: 'CB' },
      { name: 'Hakimi', number: 2, position: 'RB' },
      { name: 'Vitinha', number: 17, position: 'CM' },
      { name: 'Zaire-Emery', number: 33, position: 'CM' },
      { name: 'Joao Neves', number: 87, position: 'CAM' },
      { name: 'Barcola', number: 29, position: 'LW' },
      { name: 'Kolo Muani', number: 23, position: 'ST' },
      { name: 'Dembele', number: 10, position: 'RW' },
    ],
    bench: [
      { name: 'Safonov', number: 39, position: 'GK' },
      { name: 'Asensio', number: 11, position: 'RW' },
      { name: 'Fabian Ruiz', number: 8, position: 'CM' },
      { name: 'Lee Kang-in', number: 19, position: 'CAM' },
      { name: 'Beraldo', number: 35, position: 'CB' },
    ],
  },
  {
    id: 'inter',
    name: 'Inter Milan',
    manager: 'Simone Inzaghi',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/110.png',
    primaryColor: '#010E80',
    defaultFormation: '3-5-2',
    starters: [
      { name: 'Sommer', number: 1, position: 'GK' },
      { name: 'Bastoni', number: 95, position: 'CB' },
      { name: 'Acerbi', number: 15, position: 'CB' },
      { name: 'Pavard', number: 28, position: 'CB' },
      { name: 'Dimarco', number: 32, position: 'LB' },
      { name: 'Mkhitaryan', number: 22, position: 'CM' },
      { name: 'Calhanoglu', number: 20, position: 'CDM' },
      { name: 'Barella', number: 23, position: 'CM' },
      { name: 'Dumfries', number: 2, position: 'RB' },
      { name: 'Lautaro', number: 10, position: 'ST' },
      { name: 'Thuram', number: 9, position: 'ST' },
    ],
    bench: [
      { name: 'Martinez', number: 13, position: 'GK' },
      { name: 'Frattesi', number: 16, position: 'CM' },
      { name: 'Taremi', number: 99, position: 'ST' },
      { name: 'Zielinski', number: 7, position: 'CM' },
      { name: 'De Vrij', number: 6, position: 'CB' },
    ],
  },
];

const FORMATION_COORDINATES: Record<string, Array<{ x: number; y: number }>> = {
  '4-3-3': [
    { x: 50, y: 88 }, // GK
    { x: 15, y: 70 }, // LB
    { x: 38, y: 72 }, // CB
    { x: 62, y: 72 }, // CB
    { x: 85, y: 70 }, // RB
    { x: 50, y: 53 }, // CDM
    { x: 30, y: 42 }, // CM
    { x: 70, y: 42 }, // CAM
    { x: 18, y: 22 }, // LW
    { x: 50, y: 16 }, // ST
    { x: 82, y: 22 }, // RW
  ],
  '4-2-3-1': [
    { x: 50, y: 88 },
    { x: 15, y: 72 },
    { x: 38, y: 74 },
    { x: 62, y: 74 },
    { x: 85, y: 72 },
    { x: 35, y: 56 },
    { x: 65, y: 56 },
    { x: 20, y: 36 },
    { x: 50, y: 34 },
    { x: 80, y: 36 },
    { x: 50, y: 16 },
  ],
  '4-4-2': [
    { x: 50, y: 88 },
    { x: 15, y: 72 },
    { x: 38, y: 74 },
    { x: 62, y: 74 },
    { x: 85, y: 72 },
    { x: 18, y: 46 },
    { x: 38, y: 48 },
    { x: 62, y: 48 },
    { x: 82, y: 46 },
    { x: 38, y: 18 },
    { x: 62, y: 18 },
  ],
  '3-5-2': [
    { x: 50, y: 88 },
    { x: 26, y: 73 },
    { x: 50, y: 75 },
    { x: 74, y: 73 },
    { x: 12, y: 48 },
    { x: 50, y: 55 },
    { x: 35, y: 40 },
    { x: 65, y: 40 },
    { x: 88, y: 48 },
    { x: 38, y: 18 },
    { x: 62, y: 18 },
  ],
};

export const TeamFormationBuilder: React.FC = () => {
  const [selectedClubId, setSelectedClubId] = useState<string>('real-madrid');
  const currentClub = WORLD_CLUBS.find(c => c.id === selectedClubId) || WORLD_CLUBS[0];

  const [teamName, setTeamName] = useState<string>(currentClub.name);
  const [managerName, setManagerName] = useState<string>(currentClub.manager);
  const [teamLogo, setTeamLogo] = useState<string>(currentClub.logo);
  const [formationKey, setFormationKey] = useState<string>(currentClub.defaultFormation);
  const [tacticalStyle, setTacticalStyle] = useState<string>('Gegenpressing');
  const [copied, setCopied] = useState<boolean>(false);

  // Initialize players from selected club
  const [players, setPlayers] = useState<Player[]>(() => {
    const coords = FORMATION_COORDINATES[currentClub.defaultFormation] || FORMATION_COORDINATES['4-3-3'];
    return currentClub.starters.map((s, idx) => ({
      id: `p-${idx}`,
      name: s.name,
      number: s.number,
      position: s.position,
      x: coords[idx].x,
      y: coords[idx].y,
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

  // When switching club preset
  const handleSelectClub = (clubId: string) => {
    sounds.playClick();
    setSelectedClubId(clubId);
    const club = WORLD_CLUBS.find(c => c.id === clubId);
    if (!club) return;

    setTeamName(club.name);
    setManagerName(club.manager);
    setTeamLogo(club.logo);
    setFormationKey(club.defaultFormation);

    const coords = FORMATION_COORDINATES[club.defaultFormation] || FORMATION_COORDINATES['4-3-3'];
    setPlayers(
      club.starters.map((s, idx) => ({
        id: `p-${idx}`,
        name: s.name,
        number: s.number,
        position: s.position,
        x: coords[idx].x,
        y: coords[idx].y,
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

  const handleSelectFormation = (fKey: string) => {
    sounds.playClick();
    setFormationKey(fKey);
    const coords = FORMATION_COORDINATES[fKey] || FORMATION_COORDINATES['4-3-3'];

    setPlayers(prev =>
      prev.map((p, idx) => ({
        ...p,
        x: coords[idx]?.x ?? p.x,
        y: coords[idx]?.y ?? p.y,
      }))
    );
  };

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

  const handleSavePlayerEdit = (name: string, number: number, position: string, isCaptain: boolean) => {
    sounds.playClick();
    if (!selectedPlayer) return;

    if (isCaptain) {
      setPlayers(prev =>
        prev.map(p => ({
          ...p,
          isCaptain: p.id === selectedPlayer.id,
        }))
      );
    }

    setPlayers(prev =>
      prev.map(p =>
        p.id === selectedPlayer.id
          ? { ...p, name, number, position, isCaptain }
          : p
      )
    );
    setEditingModal(false);
    setSelectedPlayer(null);
  };

  const handleCopyLineup = () => {
    sounds.playSuccess();
    const text = `⚽ ${teamName} (${formationKey})\nManager: ${managerName}\nTactics: ${tacticalStyle}\n\nStarting Lineup:\n${players.map(p => `${p.number}. ${p.name} (${p.position})${p.isCaptain ? ' [C]' : ''}`).join('\n')}\n\nSubstitutes Bench:\n${bench.map(b => `${b.number}. ${b.name} (${b.position})`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Club & Config Banner */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Real Team Crest & Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-sm">
            <img src={teamLogo} alt={teamName} className="w-12 h-12 object-contain drop-shadow-md" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="text-lg font-black text-zinc-900 dark:text-zinc-50 bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-indigo-500 focus:outline-none"
              />
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {formationKey}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
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

        {/* Preset Club Dropdown + Formation Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              World Club Squad
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
              Formation
            </label>
            <select
              value={formationKey}
              onChange={e => handleSelectFormation(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer"
            >
              {Object.keys(FORMATION_COORDINATES).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="self-end">
            <button
              onClick={handleCopyLineup}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Lineup Copied!' : 'Export Squad'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Pitch & Squad View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TACTICAL PITCH CANVAS (Left 8 Cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-2xl aspect-[3/4] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-900/60 bg-emerald-800 select-none">
            {/* Realistic Grass Texture */}
            <div className="absolute inset-0 flex flex-col pointer-events-none opacity-30">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 ${i % 2 === 0 ? 'bg-emerald-700/60' : 'bg-emerald-800/60'}`}
                />
              ))}
            </div>

            {/* Pitch Markings SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white/40" fill="none" strokeWidth="2">
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
            </svg>

            {/* Official Team Logo Watermark Badge on the Pitch */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
              <img src={teamLogo} alt="" className="w-5 h-5 object-contain" />
              <span className="text-white font-extrabold text-xs tracking-tight">{teamName}</span>
              <span className="text-white/60 text-[10px] font-mono">· {formationKey}</span>
            </div>

            {/* Pitch Player Tokens with REAL Team Crest Logo Badges */}
            {players.map(player => {
              const isSelected = selectedPlayer?.id === player.id;
              return (
                <div
                  key={player.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedPlayer(player);
                  }}
                  style={{
                    left: `${player.x}%`,
                    top: `${player.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute z-20 flex flex-col items-center cursor-pointer transition-transform duration-200 group active:scale-95 ${
                    isSelected ? 'scale-115 z-30' : 'hover:scale-105'
                  }`}
                >
                  {/* Badge Token displaying the Real Club Crest */}
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-zinc-900/90 backdrop-blur-md flex flex-col items-center justify-center p-1 shadow-xl border-2 transition-all relative ${
                      isSelected
                        ? 'ring-4 ring-amber-400 border-white scale-105'
                        : 'border-white/80 hover:border-amber-300'
                    }`}
                  >
                    {/* Real Team Crest Logo */}
                    <img
                      src={teamLogo}
                      alt=""
                      className="w-5 h-5 object-contain opacity-90 drop-shadow-xs"
                    />

                    {/* Number and Position overlay */}
                    <div className="flex items-center gap-1 leading-none mt-0.5">
                      <span className="text-white font-black text-[11px] font-mono leading-none">
                        {player.number}
                      </span>
                      <span className="text-[8px] font-mono font-bold text-amber-300 uppercase leading-none">
                        {player.position}
                      </span>
                    </div>

                    {/* Captain C Badge */}
                    {player.isCaptain && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-zinc-950 font-black text-[9px] flex items-center justify-center shadow-md">
                        C
                      </span>
                    )}
                  </div>

                  {/* Player Name Pill */}
                  <span className="mt-1 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-extrabold shadow-md tracking-tight whitespace-nowrap max-w-[90px] truncate border border-white/10">
                    {player.name}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-zinc-400 mt-3 text-center">
            Tap any player on the pitch to edit details or swap with a substitute on the bench.
          </p>
        </div>

        {/* SQUAD CONTROLS & BENCH (Right 4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Selected Player Card */}
          {selectedPlayer && (
            <div className="p-5 rounded-3xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center p-1.5">
                    <img src={teamLogo} alt="" className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                      {selectedPlayer.name}
                    </h4>
                    <span className="text-[11px] text-zinc-500 font-bold">
                      #{selectedPlayer.number} · {selectedPlayer.position}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setEditingModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Quick Swap with Substitute */}
              <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Swap With Bench Substitute:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {bench.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => handleSwapWithBench(selectedPlayer.id, sub.id)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={teamLogo} alt="" className="w-4 h-4 object-contain" />
                        <span className="font-mono text-zinc-400 font-bold">{sub.number}.</span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-bold">{sub.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">
                          {sub.position}
                        </span>
                      </div>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Substitutes Bench with Club Logos */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <img src={teamLogo} alt="" className="w-4 h-4 object-contain" />
                <span>Substitutes Bench ({bench.length})</span>
              </h4>
            </div>

            <div className="space-y-2">
              {bench.map(sub => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/40 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={teamLogo} alt="" className="w-4 h-4 object-contain" />
                    <span className="w-6 h-6 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-bold text-[11px] flex items-center justify-center">
                      {sub.number}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{sub.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {sub.position}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Style Selector */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Tactical Play Style
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {['Gegenpressing', 'Tiki-Taka', 'Counter Attack', 'Low Block'].map(style => (
                <button
                  key={style}
                  onClick={() => {
                    sounds.playClick();
                    setTacticalStyle(style);
                  }}
                  className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                    tacticalStyle === style
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Player Modal */}
      {editingModal && selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <form
            onSubmit={e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const name = (form.elements.namedItem('pName') as HTMLInputElement).value;
              const num = parseInt((form.elements.namedItem('pNum') as HTMLInputElement).value, 10);
              const pos = (form.elements.namedItem('pPos') as HTMLInputElement).value;
              const isCap = (form.elements.namedItem('pCap') as HTMLInputElement).checked;
              handleSavePlayerEdit(name, num, pos, isCap);
            }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <img src={teamLogo} alt="" className="w-8 h-8 object-contain" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Edit Player Details
              </h3>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-zinc-500 block mb-1">Player Name</label>
                <input
                  name="pName"
                  defaultValue={selectedPlayer.name}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-zinc-500 block mb-1">Jersey Number (1-99)</label>
                <input
                  name="pNum"
                  type="number"
                  min="1"
                  max="99"
                  defaultValue={selectedPlayer.number}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-zinc-500 block mb-1">Position / Role</label>
                <select
                  name="pPos"
                  defaultValue={selectedPlayer.position}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold cursor-pointer"
                >
                  {['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST', 'CF'].map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="capCheck"
                  name="pCap"
                  defaultChecked={selectedPlayer.isCaptain}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="capCheck" className="text-zinc-800 dark:text-zinc-200 cursor-pointer">
                  Team Captain (C)
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingModal(false)}
                className="flex-1 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-xs cursor-pointer hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer hover:bg-indigo-700 shadow-xs"
              >
                Save Player
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
