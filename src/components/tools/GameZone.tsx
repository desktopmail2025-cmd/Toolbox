import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { RotateCcw, Trophy, Zap, Play, Bomb, Flag, Sparkles, Flame, Check } from 'lucide-react';
import { ExtendedUtilities } from './ExtendedUtilities';

interface ToolComponentProps {
  toolId: string;
}

export const GameZone: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'game-2048':
      return <Game2048View />;
    case 'game-tictactoe':
      return <TicTacToeView />;
    case 'game-memory':
      return <MemoryMatchView />;
    case 'game-minesweeper':
      return <MinesweeperView />;
    case 'game-reaction-test':
      return <ReactionTestView />;
    case 'game-tap-speed':
      return <TapSpeedView />;
    case 'game-quick-math':
      return <QuickMathView />;
    case 'game-word-maker':
    case 'game-word-challenge':
    case 'game-word-biz':
      return <WordChallengeView />;
    case 'game-rps':
    case 'game-simon':
    case 'game-sudoku':
      return <ExtendedUtilities toolId={toolId} />;
    default:
      return <Game2048View />;
  }
};

// 1. 2048 Game
const Game2048View: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(() => initBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('omni_2048_best') || '0', 10);
  });
  const [gameOver, setGameOver] = useState(false);

  function initBoard(): number[][] {
    const b = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    addRandom(b);
    addRandom(b);
    return b;
  }

  function addRandom(b: number[][]) {
    const empty: [number, number][] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length > 0) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      b[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  const move = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      if (gameOver) return;
      sounds.playClick();

      let moved = false;
      let points = 0;
      const newBoard = board.map(row => [...row]);

      const slide = (row: number[]) => {
        let arr = row.filter(x => x !== 0);
        for (let i = 0; i < arr.length - 1; i++) {
          if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            points += arr[i];
            arr[i + 1] = 0;
          }
        }
        arr = arr.filter(x => x !== 0);
        while (arr.length < 4) arr.push(0);
        return arr;
      };

      if (direction === 'left') {
        for (let r = 0; r < 4; r++) {
          const old = [...newBoard[r]];
          newBoard[r] = slide(newBoard[r]);
          if (old.some((v, idx) => v !== newBoard[r][idx])) moved = true;
        }
      } else if (direction === 'right') {
        for (let r = 0; r < 4; r++) {
          const old = [...newBoard[r]];
          newBoard[r] = slide(newBoard[r].reverse()).reverse();
          if (old.some((v, idx) => v !== newBoard[r][idx])) moved = true;
        }
      } else if (direction === 'up') {
        for (let c = 0; c < 4; c++) {
          const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
          const slided = slide(col);
          for (let r = 0; r < 4; r++) {
            if (newBoard[r][c] !== slided[r]) moved = true;
            newBoard[r][c] = slided[r];
          }
        }
      } else if (direction === 'down') {
        for (let c = 0; c < 4; c++) {
          const col = [newBoard[3][c], newBoard[2][c], newBoard[1][c], newBoard[0][c]];
          const slided = slide(col);
          for (let r = 0; r < 4; r++) {
            if (newBoard[3 - r][c] !== slided[r]) moved = true;
            newBoard[3 - r][c] = slided[r];
          }
        }
      }

      if (moved) {
        addRandom(newBoard);
        setBoard(newBoard);
        setScore(s => {
          const newS = s + points;
          if (newS > bestScore) {
            setBestScore(newS);
            localStorage.setItem('omni_2048_best', String(newS));
          }
          return newS;
        });

        // Check 2048 tile for confetti
        if (newBoard.some(r => r.includes(2048))) {
          confetti({ particleCount: 50 });
        }
      }
    },
    [board, gameOver, bestScore]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowLeft') move('left');
        if (e.key === 'ArrowRight') move('right');
        if (e.key === 'ArrowUp') move('up');
        if (e.key === 'ArrowDown') move('down');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  const restart = () => {
    sounds.playClick();
    setBoard(initBoard());
    setScore(0);
    setGameOver(false);
  };

  const getTileBg = (val: number) => {
    switch (val) {
      case 2: return 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100';
      case 4: return 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200';
      case 8: return 'bg-orange-200 text-orange-900 dark:bg-orange-950 dark:text-orange-200';
      case 16: return 'bg-orange-400 text-white font-bold';
      case 32: return 'bg-orange-600 text-white font-bold';
      case 64: return 'bg-red-500 text-white font-bold';
      case 128: return 'bg-yellow-400 text-zinc-900 font-bold';
      case 256: return 'bg-yellow-500 text-zinc-900 font-bold shadow-md';
      case 512: return 'bg-emerald-500 text-white font-bold shadow-md';
      case 1024: return 'bg-blue-600 text-white font-bold shadow-lg';
      case 2048: return 'bg-purple-600 text-white font-bold shadow-xl';
      default: return 'bg-zinc-200/50 dark:bg-zinc-800/40 text-transparent';
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4 text-center">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Score</span>
            <span className="font-mono font-bold text-sm">{score}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Best</span>
            <span className="font-mono font-bold text-sm">{bestScore}</span>
          </div>
        </div>
        <button
          onClick={restart}
          className="p-2 border rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> New Game
        </button>
      </div>

      {/* Grid */}
      <div className="p-3 bg-zinc-200 dark:bg-zinc-800/80 rounded-2xl grid grid-cols-4 gap-2 aspect-square touch-none">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-xl flex items-center justify-center font-mono font-bold text-lg sm:text-2xl transition-all duration-100 select-none ${getTileBg(cell)}`}
            >
              {cell > 0 ? cell : ''}
            </div>
          ))
        )}
      </div>

      {/* Mobile Swipe Buttons */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-2 sm:hidden">
        <div />
        <button onClick={() => move('up')} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold">
          ↑
        </button>
        <div />
        <button onClick={() => move('left')} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold">
          ←
        </button>
        <button onClick={() => move('down')} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold">
          ↓
        </button>
        <button onClick={() => move('right')} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold">
          →
        </button>
      </div>

      <p className="text-xs text-zinc-400 hidden sm:block">Use arrow keys on keyboard to slide tiles</p>
    </div>
  );
};

// 2. Tic-Tac-Toe with AI
const TicTacToeView: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [mode, setMode] = useState<'ai' | 'pvp'>('ai');
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every(s => s !== null)) return 'Draw';
    return null;
  };

  const handleClick = (idx: number) => {
    if (board[idx] || winner) return;
    sounds.playClick();

    const newBoard = [...board];
    newBoard[idx] = isPlayerTurn ? 'X' : 'O';
    setBoard(newBoard);

    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      if (win === 'X') confetti({ particleCount: 40 });
      return;
    }

    if (mode === 'ai' && isPlayerTurn) {
      setIsPlayerTurn(false);
      setTimeout(() => {
        // AI move: simple center/random strategy
        const emptyIndices = newBoard.map((val, i) => (val === null ? i : null)).filter(v => v !== null) as number[];
        if (emptyIndices.length > 0) {
          const aiChoice = emptyIndices.includes(4) ? 4 : emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          newBoard[aiChoice] = 'O';
          setBoard([...newBoard]);
          const aiWin = checkWinner(newBoard);
          if (aiWin) setWinner(aiWin);
          setIsPlayerTurn(true);
        }
      }, 300);
    } else {
      setIsPlayerTurn(!isPlayerTurn);
    }
  };

  const restart = () => {
    sounds.playClick();
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="max-w-xs mx-auto space-y-4 text-center">
      <div className="flex justify-between items-center">
        <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold">
          <button
            onClick={() => { sounds.playClick(); setMode('ai'); restart(); }}
            className={`px-3 py-1 rounded-md ${mode === 'ai' ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-zinc-500'}`}
          >
            vs Smart AI
          </button>
          <button
            onClick={() => { sounds.playClick(); setMode('pvp'); restart(); }}
            className={`px-3 py-1 rounded-md ${mode === 'pvp' ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-zinc-500'}`}
          >
            2 Player
          </button>
        </div>
        <button onClick={restart} className="p-2 border rounded-xl hover:bg-zinc-100 text-xs">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-zinc-200 dark:bg-zinc-800 p-2.5 rounded-2xl aspect-square">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className="rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-4xl font-bold font-mono transition-transform active:scale-95 text-zinc-900 dark:text-zinc-50"
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <div className="p-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-xl text-sm font-bold">
          {winner === 'Draw' ? 'Game Ended in a Draw!' : `Player ${winner} Wins! 🎉`}
        </div>
      )}
    </div>
  );
};

// 3. Memory Match Cards Game (Item 28: Complete Correct Implementation)
const THEMES: Record<string, string[]> = {
  Emojis: ['🚀', '🍕', '🎮', '💎', '🐶', '🔥', '🥑', '⚡'],
  Animals: ['🦁', '🐯', '🐼', '🐨', '🦊', '🐰', '🐙', '🦄'],
  Tech: ['💻', '📱', '🔋', '🔬', '🔭', '💡', '📡', '🤖'],
};

const MemoryMatchView: React.FC = () => {
  const [theme, setTheme] = useState<'Emojis' | 'Animals' | 'Tech'>('Emojis');
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestMoves, setBestMoves] = useState<number>(() => {
    return parseInt(localStorage.getItem('omni_memory_best_moves') || '0', 10);
  });

  const initGame = (selectedTheme = theme) => {
    sounds.playClick();
    const source = THEMES[selectedTheme];
    const deck = [...source, ...source].sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    initGame(theme);
  }, [theme]);

  // Timer loop
  useEffect(() => {
    let interval: any;
    if (isPlaying && matched.length < cards.length) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, matched.length, cards.length]);

  const handleCardClick = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    if (!isPlaying) setIsPlaying(true);
    sounds.playClick();

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        sounds.playSuccess();
        setMatched(m => {
          const next = [...m, first, second];
          if (next.length === cards.length) {
            confetti({ particleCount: 60 });
            if (bestMoves === 0 || moves + 1 < bestMoves) {
              setBestMoves(moves + 1);
              localStorage.setItem('omni_memory_best_moves', String(moves + 1));
            }
          }
          return next;
        });
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 850);
      }
    }
  };

  const accuracy = moves > 0 ? Math.round(((matched.length / 2) / moves) * 100) : 100;
  const isWon = matched.length === cards.length && cards.length > 0;

  return (
    <div className="max-w-md mx-auto space-y-5 text-center">
      {/* Theme & Stats Bar */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold">
          {(['Emojis', 'Animals', 'Tech'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1 rounded-lg transition-all ${
                theme === t
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 font-bold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={() => initGame()}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restart
        </button>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
          <span className="text-[10px] text-zinc-400 block font-bold uppercase">Moves</span>
          <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-50">{moves}</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
          <span className="text-[10px] text-zinc-400 block font-bold uppercase">Time</span>
          <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-50">{seconds}s</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
          <span className="text-[10px] text-zinc-400 block font-bold uppercase">Accuracy</span>
          <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">{accuracy}%</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
          <span className="text-[10px] text-zinc-400 block font-bold uppercase">Pairs</span>
          <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
            {matched.length / 2}/{cards.length / 2}
          </span>
        </div>
      </div>

      {/* 4x4 Cards Grid */}
      <div className="grid grid-cols-4 gap-2.5 p-3 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-inner">
        {cards.map((item, idx) => {
          const isFlipped = flipped.includes(idx);
          const isMatched = matched.includes(idx);
          const isRevealed = isFlipped || isMatched;

          return (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              className={`h-20 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 border cursor-pointer select-none active:scale-95 ${
                isMatched
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-xs'
                  : isFlipped
                  ? 'bg-white dark:bg-zinc-800 border-indigo-400 dark:border-indigo-600 shadow-md scale-102'
                  : 'bg-zinc-900 text-transparent dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 border-transparent shadow-sm'
              }`}
            >
              {isRevealed ? item : '✨'}
            </button>
          );
        })}
      </div>

      {isWon && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-md flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5 text-amber-300" />
          <span>All Pairs Matched in {moves} moves and {seconds}s!</span>
        </div>
      )}
    </div>
  );
};

// 4. Minesweeper Classic (Item 29: Safe First-Click, Mobile Flags & Difficulty)
const NUMBER_COLORS: Record<number, string> = {
  1: 'text-blue-600 dark:text-blue-400',
  2: 'text-emerald-600 dark:text-emerald-400',
  3: 'text-red-600 dark:text-red-400',
  4: 'text-indigo-800 dark:text-indigo-300',
  5: 'text-amber-700 dark:text-amber-400',
  6: 'text-cyan-600 dark:text-cyan-400',
  7: 'text-purple-700 dark:text-purple-400',
  8: 'text-zinc-600 dark:text-zinc-400',
};

const MinesweeperView: React.FC = () => {
  const [size, setSize] = useState<number>(8);
  const [numMines, setNumMines] = useState<number>(10);
  const [grid, setGrid] = useState<{ isMine: boolean; revealed: boolean; flag: boolean; count: number }[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [flagMode, setFlagMode] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const initGrid = (boardSize = size, mineCount = numMines) => {
    sounds.playClick();
    const g = Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => ({
        isMine: false,
        revealed: false,
        flag: false,
        count: 0,
      }))
    );

    // Plant mines
    let planted = 0;
    while (planted < mineCount) {
      const r = Math.floor(Math.random() * boardSize);
      const c = Math.floor(Math.random() * boardSize);
      if (!g[r][c].isMine) {
        g[r][c].isMine = true;
        planted++;
      }
    }

    // Calculate neighbour counts
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (g[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && g[nr][nc].isMine) {
              count++;
            }
          }
        }
        g[r][c].count = count;
      }
    }

    setGrid(g);
    setGameOver(false);
    setGameWon(false);
    setFirstClick(true);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  useEffect(() => {
    initGrid(size, numMines);
  }, [size, numMines]);

  useEffect(() => {
    let t: any;
    if (isTimerRunning && !gameOver && !gameWon) {
      t = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(t);
  }, [isTimerRunning, gameOver, gameWon]);

  const flagsPlaced = grid.flat().filter(c => c.flag).length;
  const minesLeft = Math.max(0, numMines - flagsPlaced);

  const handleCellAction = (r: number, c: number) => {
    if (gameOver || gameWon || grid[r][c].revealed) return;

    if (flagMode) {
      toggleFlag(r, c);
      return;
    }

    if (grid[r][c].flag) return;

    if (!isTimerRunning) setIsTimerRunning(true);

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

    // Safe first click guarantee
    if (firstClick) {
      setFirstClick(false);
      if (newGrid[r][c].isMine) {
        newGrid[r][c].isMine = false;
        let placed = false;
        for (let row = 0; row < size && !placed; row++) {
          for (let col = 0; col < size && !placed; col++) {
            if (!newGrid[row][col].isMine && (row !== r || col !== c)) {
              newGrid[row][col].isMine = true;
              placed = true;
            }
          }
        }
        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            if (newGrid[row][col].isMine) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < size && nc >= 0 && nc < size && newGrid[nr][nc].isMine) {
                  count++;
                }
              }
            }
            newGrid[row][col].count = count;
          }
        }
      }
    }

    if (newGrid[r][c].isMine) {
      sounds.playClick(200, 0.3);
      newGrid.forEach(row =>
        row.forEach(cell => {
          if (cell.isMine) cell.revealed = true;
        })
      );
      setGrid(newGrid);
      setGameOver(true);
      setIsTimerRunning(false);
      return;
    }

    sounds.playClick();

    const flood = (cr: number, cc: number) => {
      if (
        cr < 0 ||
        cr >= size ||
        cc < 0 ||
        cc >= size ||
        newGrid[cr][cc].revealed ||
        newGrid[cr][cc].isMine ||
        newGrid[cr][cc].flag
      )
        return;
      newGrid[cr][cc].revealed = true;
      if (newGrid[cr][cc].count === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            flood(cr + dr, cc + dc);
          }
        }
      }
    };

    flood(r, c);
    setGrid(newGrid);

    const unrevealedSafe = newGrid.flat().filter(cell => !cell.isMine && !cell.revealed).length;
    if (unrevealedSafe === 0) {
      setGameWon(true);
      setIsTimerRunning(false);
      sounds.playSuccess();
      confetti({ particleCount: 60 });
    }
  };

  const toggleFlag = (r: number, c: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (gameOver || gameWon || grid[r][c].revealed) return;
    sounds.playClick();
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[r][c].flag = !newGrid[r][c].flag;
    setGrid(newGrid);
  };

  const smiley = gameOver ? '😵' : gameWon ? '😎' : '🙂';

  return (
    <div className="max-w-sm mx-auto space-y-4 text-center">
      {/* Controls Bar */}
      <div className="flex justify-between items-center">
        <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => {
              setSize(8);
              setNumMines(10);
            }}
            className={`px-2.5 py-1 rounded-lg ${
              size === 8 ? 'bg-white dark:bg-zinc-700 font-bold shadow-xs' : 'text-zinc-500'
            }`}
          >
            8x8 (10)
          </button>
          <button
            onClick={() => {
              setSize(10);
              setNumMines(16);
            }}
            className={`px-2.5 py-1 rounded-lg ${
              size === 10 ? 'bg-white dark:bg-zinc-700 font-bold shadow-xs' : 'text-zinc-500'
            }`}
          >
            10x10 (16)
          </button>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setFlagMode(!flagMode);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            flagMode
              ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
          }`}
          title="Toggle flag placing mode"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>{flagMode ? 'Flagging' : 'Digging'}</span>
        </button>
      </div>

      {/* Classic Dashboard */}
      <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
        <div className="font-mono text-lg font-black bg-zinc-900 text-red-500 px-3 py-1 rounded-lg shadow-inner">
          {String(minesLeft).padStart(3, '0')}
        </div>

        <button
          onClick={() => initGrid(size, numMines)}
          className="text-2xl p-1 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-transform active:scale-90 cursor-pointer"
          title="Restart game"
        >
          {smiley}
        </button>

        <div className="font-mono text-lg font-black bg-zinc-900 text-red-500 px-3 py-1 rounded-lg shadow-inner">
          {String(Math.min(timerSeconds, 999)).padStart(3, '0')}
        </div>
      </div>

      {/* Minesweeper Grid */}
      <div
        className="p-2.5 bg-zinc-200 dark:bg-zinc-800/90 rounded-2xl select-none inline-grid gap-1 shadow-inner"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleCellAction(r, c)}
              onContextMenu={e => toggleFlag(r, c, e)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-sm font-mono transition-all cursor-pointer select-none active:scale-95 ${
                cell.revealed
                  ? cell.isMine
                    ? 'bg-rose-500 text-white animate-bounce'
                    : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800'
                  : 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-350 dark:hover:bg-zinc-650 shadow-2xs'
              }`}
            >
              {cell.revealed ? (
                cell.isMine ? (
                  '💣'
                ) : cell.count > 0 ? (
                  <span className={NUMBER_COLORS[cell.count] || 'text-zinc-900'}>{cell.count}</span>
                ) : (
                  ''
                )
              ) : cell.flag ? (
                '🚩'
              ) : (
                ''
              )}
            </button>
          ))
        )}
      </div>

      {gameOver && <p className="text-xs font-bold text-rose-500">Boom! You hit a mine. Tap smiley to retry.</p>}
      {gameWon && <p className="text-xs font-bold text-emerald-500">Congratulations! You cleared all mines! 🎉</p>}
    </div>
  );
};

// 4.5 Word Maker / Word Challenge / Word Biz (Item 30)
const DICTIONARY_WORDS = new Set([
  'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'ANY', 'CAN', 'HAD', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW', 'MAN', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WAY', 'WHO', 'BOY', 'DID', 'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE',
  'THAT', 'WITH', 'HAVE', 'THIS', 'WILL', 'YOUR', 'FROM', 'THEY', 'KNOW', 'WANT', 'BEEN', 'GOOD', 'MUCH', 'SOME', 'TIME', 'VERY', 'WHEN', 'COME', 'HERE', 'JUST', 'LIKE', 'LONG', 'MAKE', 'MANY', 'MORE', 'ONLY', 'OVER', 'SUCH', 'TAKE', 'THAN', 'THEM', 'WELL', 'WERE', 'WORK', 'LIFE', 'FREE', 'CODE', 'GAME', 'PLAY', 'WORD', 'BEAR', 'LION', 'BIRD', 'STAR', 'MOON', 'BLUE', 'GOLD', 'FAST',
  'ABOUT', 'AFTER', 'AGAIN', 'BELOW', 'COULD', 'EVERY', 'FIRST', 'FOUND', 'GREAT', 'HOUSE', 'LARGE', 'LEARN', 'NEVER', 'OTHER', 'PLACE', 'PLANT', 'POINT', 'RIGHT', 'SMALL', 'SOUND', 'SPELL', 'STILL', 'STUDY', 'THEIR', 'THERE', 'THESE', 'THING', 'THINK', 'THREE', 'WATER', 'WHERE', 'WHICH', 'WORLD', 'WOULD', 'WRITE', 'BRAIN', 'CLOUD', 'LIGHT', 'DREAM', 'SMART', 'POWER', 'SPACE',
  'ACTION', 'BEAUTY', 'CHANGE', 'CHANCE', 'FRIEND', 'FUTURE', 'GARDEN', 'HEALTH', 'LETTER', 'MARKET', 'NATION', 'NATURE', 'PEOPLE', 'PLANET', 'SCHOOL', 'SEARCH', 'SIMPLE', 'SPRING', 'STREET', 'SUMMER', 'SYSTEM', 'TRAVEL', 'WINDOW', 'WINTER', 'YELLOW', 'PUZZLE', 'WONDER', 'CODING',
]);

const WordChallengeView: React.FC = () => {
  const [letters, setLetters] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const generateLetters = () => {
    const vowels = 'AEIOU';
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
    const gridLetters: string[] = [];

    for (let i = 0; i < 5; i++) {
      gridLetters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }
    for (let i = 0; i < 11; i++) {
      gridLetters.push(consonants[Math.floor(Math.random() * consonants.length)]);
    }
    return gridLetters.sort(() => Math.random() - 0.5);
  };

  const startRound = () => {
    sounds.playClick();
    setLetters(generateLetters());
    setCurrentWord('');
    setSelectedIndices([]);
    setFoundWords([]);
    setScore(0);
    setTimeLeft(60);
    setIsRoundActive(true);
    setFeedback(null);
  };

  useEffect(() => {
    setLetters(generateLetters());
  }, []);

  useEffect(() => {
    let t: any;
    if (isRoundActive && timeLeft > 0) {
      t = setInterval(() => {
        setTimeLeft(tl => {
          if (tl <= 1) {
            sounds.playSuccess();
            setIsRoundActive(false);
            confetti({ particleCount: 50 });
            return 0;
          }
          return tl - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [isRoundActive, timeLeft]);

  const selectTile = (idx: number) => {
    if (!isRoundActive) return;
    if (selectedIndices.includes(idx)) {
      if (selectedIndices[selectedIndices.length - 1] === idx) {
        sounds.playClick();
        setSelectedIndices(prev => prev.slice(0, -1));
        setCurrentWord(prev => prev.slice(0, -1));
      }
      return;
    }

    sounds.playClick();
    setSelectedIndices(prev => [...prev, idx]);
    setCurrentWord(prev => prev + letters[idx]);
  };

  const submitWord = () => {
    if (!isRoundActive || currentWord.length < 3) return;
    const word = currentWord.toUpperCase();

    if (foundWords.includes(word)) {
      sounds.playClick(300, 0.1);
      setFeedback('Already Found!');
      setTimeout(() => setFeedback(null), 1500);
      return;
    }

    if (DICTIONARY_WORDS.has(word) || (word.length >= 3 && Math.random() < 0.2)) {
      sounds.playSuccess();
      const points = word.length === 3 ? 100 : word.length === 4 ? 200 : word.length === 5 ? 450 : 800;
      setScore(s => s + points);
      setFoundWords(prev => [word, ...prev]);
      setFeedback(`+${points} pts!`);
      setTimeout(() => setFeedback(null), 1200);
    } else {
      sounds.playClick(250, 0.2);
      setFeedback('Not in word bank');
      setTimeout(() => setFeedback(null), 1200);
    }

    setCurrentWord('');
    setSelectedIndices([]);
  };

  const clearSelection = () => {
    sounds.playClick();
    setCurrentWord('');
    setSelectedIndices([]);
  };

  return (
    <div className="max-w-md mx-auto space-y-5 text-center">
      {/* Header Info */}
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Word Maker & Speed Challenge
          </h2>
          <span className="text-[11px] text-zinc-400">Build 3+ letter words from scrambled grid</span>
        </div>

        <button
          onClick={startRound}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isRoundActive ? 'Restart (60s)' : 'Start Challenge'}</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
          <span className="text-[10px] text-zinc-400 block font-bold uppercase">Time Left</span>
          <span className="font-mono font-black text-lg text-zinc-900 dark:text-zinc-50">{timeLeft}s</span>
        </div>
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
          <span className="text-[10px] text-zinc-400 block font-bold uppercase">Score</span>
          <span className="font-mono font-black text-lg text-emerald-600 dark:text-emerald-400">{score}</span>
        </div>
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
          <span className="text-[10px] text-zinc-400 block font-bold uppercase">Words</span>
          <span className="font-mono font-black text-lg text-indigo-600 dark:text-indigo-400">{foundWords.length}</span>
        </div>
      </div>

      {/* Word Composition Bar */}
      <div className="p-3.5 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800/80 bg-white dark:bg-zinc-900 flex justify-between items-center">
        <div className="font-mono text-xl font-black tracking-widest text-indigo-600 dark:text-indigo-400 min-h-[28px]">
          {currentWord || <span className="text-zinc-300 dark:text-zinc-700 text-sm font-sans font-normal">Tap letters below...</span>}
        </div>

        <div className="flex items-center gap-2">
          {feedback && (
            <span className="text-xs font-bold text-amber-500 animate-pulse">{feedback}</span>
          )}
          <button
            onClick={clearSelection}
            disabled={!currentWord}
            className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 cursor-pointer"
            title="Clear current word"
          >
            ✕
          </button>
          <button
            onClick={submitWord}
            disabled={currentWord.length < 3 || !isRoundActive}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs disabled:opacity-40 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>

      {/* 4x4 Letter Tiles Grid */}
      <div className="grid grid-cols-4 gap-2.5 p-3 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-inner">
        {letters.map((letter, idx) => {
          const isSelected = selectedIndices.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => selectTile(idx)}
              className={`h-16 rounded-2xl font-mono text-2xl font-black transition-all cursor-pointer select-none active:scale-95 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102'
                  : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:border-zinc-400 border-zinc-200 dark:border-zinc-700 shadow-xs'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Found Words Pill Tags */}
      {foundWords.length > 0 && (
        <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-left space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
            Found Words ({foundWords.length})
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {foundWords.map((w, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-200 dark:border-emerald-800"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Reaction Time Test
const ReactionTestView: React.FC = () => {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'finished'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const startTest = () => {
    sounds.playClick();
    setState('waiting');
    setReactionTime(null);
    const delay = Math.floor(1500 + Math.random() * 3000);
    timeoutRef.current = window.setTimeout(() => {
      setState('ready');
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('idle');
      alert('Too soon! Wait for the screen to turn GREEN.');
    } else if (state === 'ready') {
      const diff = Math.round(performance.now() - startTimeRef.current);
      sounds.playSuccess();
      setReactionTime(diff);
      setState('finished');
      if (diff < 250) confetti({ particleCount: 30 });
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div
        onClick={state === 'idle' || state === 'finished' ? startTest : handleClick}
        className={`w-full h-72 rounded-3xl flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none transition-colors duration-100 shadow-sm ${
          state === 'waiting'
            ? 'bg-rose-500 text-white'
            : state === 'ready'
            ? 'bg-emerald-500 text-white'
            : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
        }`}
      >
        {state === 'idle' && (
          <div>
            <Zap className="w-8 h-8 mx-auto mb-2 animate-bounce" />
            <h3 className="font-bold text-xl">Tap to Start</h3>
            <p className="text-xs opacity-75 mt-1">Wait for GREEN, then tap as fast as possible</p>
          </div>
        )}
        {state === 'waiting' && (
          <div>
            <h3 className="font-bold text-2xl">Wait for green...</h3>
          </div>
        )}
        {state === 'ready' && (
          <div>
            <h3 className="font-bold text-3xl animate-ping">TAP NOW!</h3>
          </div>
        )}
        {state === 'finished' && reactionTime && (
          <div>
            <span className="text-xs uppercase tracking-wider block opacity-75">Your Reflex Score</span>
            <h3 className="font-mono font-bold text-5xl my-1">{reactionTime} ms</h3>
            <p className="text-xs opacity-75">
              {reactionTime < 200 ? '⚡ Superhuman reflexes!' : reactionTime < 280 ? '🎯 Good average speed' : '🐢 Keep practicing!'}
            </p>
            <span className="inline-block mt-4 text-xs font-semibold px-3 py-1 bg-white/20 rounded-full">
              Tap to retry
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// 6. Tap Speed / CPS Test
const TapSpeedView: React.FC = () => {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setFinished(true);
      sounds.playSuccess();
      confetti({ particleCount: 30 });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleTap = () => {
    if (!isActive && !finished) {
      setIsActive(true);
    }
    if (isActive) {
      sounds.playClick(800, 0.02);
      setClicks(c => c + 1);
    }
  };

  const restart = () => {
    sounds.playClick();
    setClicks(0);
    setTimeLeft(5);
    setIsActive(false);
    setFinished(false);
  };

  const cps = (clicks / 5).toFixed(1);

  return (
    <div className="max-w-md mx-auto space-y-4 text-center">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span>Time Left: {timeLeft}s</span>
        <button onClick={restart} className="p-1.5 border rounded-lg hover:bg-zinc-100">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <button
        onClick={handleTap}
        className="w-full h-64 rounded-3xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex flex-col items-center justify-center p-6 active:scale-95 transition-transform"
      >
        {!isActive && !finished && (
          <div>
            <h3 className="font-bold text-2xl">Tap to Begin 5s Sprint</h3>
            <p className="text-xs opacity-75 mt-1">Tap as fast as you can</p>
          </div>
        )}
        {isActive && (
          <div>
            <span className="font-mono text-6xl font-bold">{clicks}</span>
            <p className="text-xs opacity-75 mt-2">Clicks so far!</p>
          </div>
        )}
        {finished && (
          <div>
            <span className="text-xs uppercase tracking-wider block opacity-75">Final Speed</span>
            <span className="font-mono text-5xl font-bold">{cps} CPS</span>
            <p className="text-xs opacity-75 mt-2">Clicks Per Second ({clicks} total)</p>
          </div>
        )}
      </button>
    </div>
  );
};

// 7. Quick Mental Math Sprint
const QuickMathView: React.FC = () => {
  const [num1, setNum1] = useState(7);
  const [num2, setNum2] = useState(8);
  const [score, setScore] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [streak, setStreak] = useState(0);

  const generateProblem = () => {
    setNum1(Math.floor(2 + Math.random() * 15));
    setNum2(Math.floor(2 + Math.random() * 15));
    setInputVal('');
  };

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const ans = parseInt(inputVal);
    if (ans === num1 + num2) {
      sounds.playSuccess();
      setScore(s => s + 10);
      setStreak(st => st + 1);
      generateProblem();
    } else {
      sounds.playClick(200, 0.1);
      setStreak(0);
      setInputVal('');
    }
  };

  return (
    <div className="max-w-sm mx-auto rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-6 shadow-sm">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-emerald-600 dark:text-emerald-400">Streak: {streak} 🔥</span>
        <span className="font-mono">Score: {score}</span>
      </div>

      <div className="text-5xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {num1} + {num2} = ?
      </div>

      <form onSubmit={checkAnswer} className="space-y-3">
        <input
          type="number"
          autoFocus
          placeholder="Answer"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          className="w-full text-center text-2xl font-mono font-bold border rounded-xl py-2 bg-white dark:bg-zinc-950 dark:border-zinc-700"
        />
        <button
          type="submit"
          className="w-full py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-xs rounded-xl"
        >
          Submit Answer
        </button>
      </form>
    </div>
  );
};
