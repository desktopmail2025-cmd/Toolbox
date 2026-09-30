import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { RotateCcw, Trophy, Zap, Play, Bomb } from 'lucide-react';

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

// 3. Memory Match Cards Game
const EMOJIS = ['🚀', '🍕', '🎮', '💎', '🐶', '🔥'];

const MemoryMatchView: React.FC = () => {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    sounds.playClick();
    const deck = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
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
            confetti({ particleCount: 50 });
          }
          return next;
        });
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4 text-center">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span>Moves: {moves}</span>
        <button onClick={initGame} className="flex items-center gap-1 px-3 py-1.5 border rounded-xl hover:bg-zinc-100">
          <RotateCcw className="w-3.5 h-3.5" /> Restart
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {cards.map((emoji, idx) => {
          const isRevealed = flipped.includes(idx) || matched.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              className={`h-20 rounded-2xl flex items-center justify-center text-3xl transition-all duration-200 border ${
                isRevealed
                  ? 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 shadow-sm'
                  : 'bg-zinc-900 dark:bg-zinc-100 text-transparent border-transparent'
              }`}
            >
              {isRevealed ? emoji : '❓'}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 4. Minesweeper Classic
const MinesweeperView: React.FC = () => {
  const size = 8;
  const numMines = 10;
  const [grid, setGrid] = useState<{ isMine: boolean; revealed: boolean; flag: boolean; count: number }[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initGrid = () => {
    sounds.playClick();
    const g = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({ isMine: false, revealed: false, flag: false, count: 0 }))
    );

    // Plant mines
    let planted = 0;
    while (planted < numMines) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      if (!g[r][c].isMine) {
        g[r][c].isMine = true;
        planted++;
      }
    }

    // Calculate neighbour counts
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (g[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && g[nr][nc].isMine) {
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
  };

  useEffect(() => {
    initGrid();
  }, []);

  const revealCell = (r: number, c: number) => {
    if (gameOver || gameWon || grid[r][c].revealed || grid[r][c].flag) return;
    sounds.playClick();

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

    if (newGrid[r][c].isMine) {
      // Hit mine
      newGrid.forEach(row => row.forEach(cell => { if (cell.isMine) cell.revealed = true; }));
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

    // Flood fill empty
    const flood = (cr: number, cc: number) => {
      if (cr < 0 || cr >= size || cc < 0 || cc >= size || newGrid[cr][cc].revealed || newGrid[cr][cc].isMine) return;
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

    // Check win
    const unrevealedSafe = newGrid.flat().filter(cell => !cell.isMine && !cell.revealed).length;
    if (unrevealedSafe === 0) {
      setGameWon(true);
      sounds.playSuccess();
      confetti({ particleCount: 50 });
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[r][c].revealed) return;
    sounds.playClick();
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[r][c].flag = !newGrid[r][c].flag;
    setGrid(newGrid);
  };

  return (
    <div className="max-w-xs mx-auto space-y-4 text-center">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="flex items-center gap-1"><Bomb className="w-3.5 h-3.5 text-red-500" /> Mines: 10</span>
        <button onClick={initGrid} className="px-3 py-1 border rounded-lg hover:bg-zinc-100 flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> New Game
        </button>
      </div>

      <div className="grid grid-cols-8 gap-1 bg-zinc-300 dark:bg-zinc-800 p-2 rounded-2xl select-none">
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => revealCell(r, c)}
              onContextMenu={e => toggleFlag(e, r, c)}
              className={`h-9 rounded-md flex items-center justify-center font-bold text-xs font-mono transition-colors ${
                cell.revealed
                  ? cell.isMine
                    ? 'bg-red-500 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
                  : 'bg-zinc-200 dark:bg-zinc-700 hover:opacity-80'
              }`}
            >
              {cell.revealed
                ? cell.isMine
                  ? '💣'
                  : cell.count > 0
                  ? cell.count
                  : ''
                : cell.flag
                ? '🚩'
                : ''}
            </button>
          ))
        )}
      </div>

      {gameOver && <p className="text-xs font-bold text-red-500">Boom! You hit a mine.</p>}
      {gameWon && <p className="text-xs font-bold text-emerald-500">Congratulations! You cleared all mines! 🎉</p>}
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
