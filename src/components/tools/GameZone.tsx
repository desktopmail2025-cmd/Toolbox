import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { RotateCcw, Trophy, Zap, Play, Bomb, Flag, Sparkles, Flame, Check, HelpCircle, Undo2, Eye, Star, Info } from 'lucide-react';
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

// 1. 2048 Game (Item 10: Professional Edition with Touch Swipe, Undo, and Game Over Overlays)
const Game2048View: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(() => initBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('omni_2048_best') || '0', 10);
  });
  const [history, setHistory] = useState<{ board: number[][]; score: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [recentPoints, setRecentPoints] = useState<number | null>(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

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

  const checkGameOver = (currentBoard: number[][]) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentBoard[r][c] === 0) return false;
        if (r < 3 && currentBoard[r][c] === currentBoard[r + 1][c]) return false;
        if (c < 3 && currentBoard[r][c] === currentBoard[r][c + 1]) return false;
      }
    }
    return true;
  };

  const move = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      if (gameOver) return;

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
        sounds.playClick();
        // Save undo history (last 5 moves)
        setHistory(prev => [...prev.slice(-4), { board: board.map(r => [...r]), score }]);

        addRandom(newBoard);
        setBoard(newBoard);

        if (points > 0) {
          setRecentPoints(points);
          setTimeout(() => setRecentPoints(null), 800);
        }

        const newScore = score + points;
        setScore(newScore);
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('omni_2048_best', String(newScore));
        }

        // Check 2048 tile for victory
        if (!hasWon && !keepPlaying && newBoard.some(r => r.includes(2048))) {
          setHasWon(true);
          confetti({ particleCount: 75 });
          sounds.playSuccess();
        }

        // Check Game Over
        if (checkGameOver(newBoard)) {
          setGameOver(true);
        }
      }
    },
    [board, gameOver, score, bestScore, hasWon, keepPlaying]
  );

  const undoMove = () => {
    if (history.length === 0) return;
    sounds.playClick();
    const last = history[history.length - 1];
    setBoard(last.board);
    setScore(last.score);
    setHistory(h => h.slice(0, -1));
    setGameOver(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') move('left');
        if (e.code === 'ArrowRight' || e.code === 'KeyD') move('right');
        if (e.code === 'ArrowUp' || e.code === 'KeyW') move('up');
        if (e.code === 'ArrowDown' || e.code === 'KeyS') move('down');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  // Touch swipe handling directly on board
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 30) {
      if (absX > absY) {
        if (dx > 0) move('right');
        else move('left');
      } else {
        if (dy > 0) move('down');
        else move('up');
      }
    }
    touchStartRef.current = null;
  };

  const restart = () => {
    sounds.playClick();
    setBoard(initBoard());
    setScore(0);
    setHistory([]);
    setGameOver(false);
    setHasWon(false);
    setKeepPlaying(false);
  };

  const getTileBg = (val: number) => {
    switch (val) {
      case 2: return 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 shadow-2xs';
      case 4: return 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 shadow-2xs';
      case 8: return 'bg-orange-200 text-orange-950 dark:bg-orange-950 dark:text-orange-200 font-bold';
      case 16: return 'bg-orange-400 text-white font-extrabold shadow-xs';
      case 32: return 'bg-orange-600 text-white font-black shadow-xs';
      case 64: return 'bg-rose-500 text-white font-black shadow-xs';
      case 128: return 'bg-amber-400 text-zinc-950 font-black shadow-sm scale-102';
      case 256: return 'bg-amber-500 text-zinc-950 font-black shadow-md scale-102';
      case 512: return 'bg-emerald-500 text-white font-black shadow-md scale-102';
      case 1024: return 'bg-indigo-600 text-white font-black shadow-lg scale-104';
      case 2048: return 'bg-purple-600 text-white font-black shadow-xl ring-2 ring-amber-300 scale-104 animate-pulse';
      default: return 'bg-zinc-200/40 dark:bg-zinc-800/30 text-transparent';
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4 text-center">
      {/* Header with Title and Help */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">2048 Puzzle Classic</h2>
            <button
              onClick={() => setShowHowTo(prev => !prev)}
              title="How to Play 2048"
              className="text-zinc-400 hover:text-indigo-600 text-xs cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[10px] text-zinc-400">Join matching numbers to reach 2048</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={undoMove}
            disabled={history.length === 0 || gameOver}
            title="Undo last move"
            className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold disabled:opacity-30 cursor-pointer flex items-center gap-1"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">Undo</span>
          </button>
          <button
            onClick={restart}
            className="p-1.5 px-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[10px]">New</span>
          </button>
        </div>
      </div>

      {/* Rules Banner (Collapsible) */}
      {showHowTo && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-left text-xs space-y-1">
          <span className="font-bold text-indigo-700 dark:text-indigo-300 block">💡 How to Play 2048:</span>
          <p className="text-zinc-600 dark:text-zinc-300 text-[11px] leading-relaxed">
            Swipe or use arrow keys to slide tiles across the board. When two tiles with the same number collide, they combine into one double-value tile (2+2=4, 4+4=8... 1024+1024=2048). Create the <strong>2048 tile</strong> to win!
          </p>
        </div>
      )}

      {/* Score Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 relative">
          <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Score</span>
          <span className="font-mono font-black text-xl text-zinc-900 dark:text-zinc-50">{score}</span>
          {recentPoints && (
            <span className="absolute top-1 right-2 text-xs font-mono font-black text-emerald-600 animate-bounce">
              +{recentPoints}
            </span>
          )}
        </div>
        <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Best Score</span>
          <span className="font-mono font-black text-xl text-amber-600 dark:text-amber-400">{bestScore}</span>
        </div>
      </div>

      {/* 4x4 Grid Board with Touch Gestures */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="p-3 bg-zinc-300 dark:bg-zinc-800/90 rounded-3xl grid grid-cols-4 gap-2 aspect-square touch-none relative select-none shadow-inner"
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-2xl flex items-center justify-center font-mono font-black text-xl sm:text-2xl transition-all duration-150 select-none ${getTileBg(cell)}`}
            >
              {cell > 0 ? cell : ''}
            </div>
          ))
        )}

        {/* Victory Overlay */}
        {hasWon && !keepPlaying && (
          <div className="absolute inset-0 bg-amber-500/90 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-6 text-white space-y-3 z-10 animate-fade-in">
            <Trophy className="w-12 h-12 text-yellow-200 animate-bounce" />
            <h3 className="text-2xl font-black">You Reached 2048!</h3>
            <p className="text-xs text-amber-100">Incredible puzzle solving! Continue to reach 4096 or restart.</p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setKeepPlaying(true)}
                className="px-4 py-2 bg-white text-zinc-900 rounded-xl font-bold text-xs hover:bg-zinc-100 cursor-pointer shadow-md"
              >
                Keep Going
              </button>
              <button
                onClick={restart}
                className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-bold text-xs hover:bg-zinc-800 cursor-pointer shadow-md"
              >
                New Game
              </button>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-6 text-white space-y-3 z-10">
            <span className="text-3xl">🧩</span>
            <h3 className="text-2xl font-black">Game Over!</h3>
            <p className="text-xs text-zinc-300">No more valid moves available. Final score: {score}</p>
            <button
              onClick={restart}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 cursor-pointer shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="text-[11px] text-zinc-400 flex items-center justify-center gap-2">
        <span className="hidden sm:inline">Use Arrow keys or W/A/S/D to slide tiles</span>
        <span className="sm:hidden">Swipe anywhere on board to slide tiles</span>
      </div>
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

// 3. Memory Match Cards Game (Item 7: Start Game Button -> Random Preview Countdown -> Vanish & Guess Recall Mode)
const THEMES: Record<string, string[]> = {
  Emojis: ['🚀', '🍕', '🎮', '💎', '🐶', '🔥', '🥑', '⚡'],
  Animals: ['🦁', '🐯', '🐼', '🐨', '🦊', '🐰', '🐙', '🦄'],
  Tech: ['💻', '📱', '🔋', '🔬', '🔭', '💡', '📡', '🤖'],
};

type MemoryGameState = 'idle' | 'preview' | 'playing' | 'won';

const MemoryMatchView: React.FC = () => {
  const [theme, setTheme] = useState<'Emojis' | 'Animals' | 'Tech'>('Emojis');
  const [previewDuration, setPreviewDuration] = useState<number>(3.5); // 3.5 seconds default
  const [gameState, setGameState] = useState<MemoryGameState>('idle');
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [previewRemaining, setPreviewRemaining] = useState(3.5);
  const [peeking, setPeeking] = useState(false);
  const [targetMode, setTargetMode] = useState(false);
  const [targetItem, setTargetItem] = useState<string | null>(null);
  const [bestMoves, setBestMoves] = useState<number>(() => {
    return parseInt(localStorage.getItem('omni_memory_best_moves') || '0', 10);
  });

  const previewTimerRef = useRef<any>(null);

  // Initialize placeholder deck on load/theme change
  useEffect(() => {
    const source = THEMES[theme];
    const deck = [...source, ...source].sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setGameState('idle');
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);
  }, [theme]);

  // Start Game Button Action: Shuffles deck, shows cards face-up for previewDuration, then vanishes and starts guessing
  const handleStartGame = () => {
    sounds.playClick();
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);

    const source = THEMES[theme];
    const deck = [...source, ...source].sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setPeeking(false);

    // Pick initial target item if target mode active
    const randomTarget = source[Math.floor(Math.random() * source.length)];
    setTargetItem(randomTarget);

    // Enter Preview Mode
    setGameState('preview');
    setPreviewRemaining(previewDuration);

    const startTime = Date.now();
    previewTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const rem = Math.max(0, previewDuration - elapsed);
      setPreviewRemaining(Number(rem.toFixed(1)));

      if (rem <= 0) {
        clearInterval(previewTimerRef.current);
        // Vanish cards face down and enter playing mode!
        setGameState('playing');
        sounds.playTone(520, 0.15);
      }
    }, 100);
  };

  const skipPreview = () => {
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    setGameState('playing');
    sounds.playTone(520, 0.15);
  };

  const triggerPeek = () => {
    if (gameState !== 'playing' || peeking || matched.length === cards.length) return;
    sounds.playClick();
    setPeeking(true);
    setTimeout(() => {
      setPeeking(false);
    }, 2000);
  };

  // Timer while playing
  useEffect(() => {
    let interval: any;
    if (gameState === 'playing' && matched.length < cards.length) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, matched.length, cards.length]);

  const handleCardClick = (idx: number) => {
    if (gameState !== 'playing' || peeking || flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
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
            setGameState('won');
            confetti({ particleCount: 80 });
            if (bestMoves === 0 || moves + 1 < bestMoves) {
              setBestMoves(moves + 1);
              localStorage.setItem('omni_memory_best_moves', String(moves + 1));
            }
          }
          return next;
        });
        setFlipped([]);

        // Pick next target if target mode
        if (targetMode) {
          const remainingItems = THEMES[theme].filter(
            item => !cards.filter((c, i) => [...matched, first, second].includes(i)).includes(item)
          );
          if (remainingItems.length > 0) {
            setTargetItem(remainingItems[Math.floor(Math.random() * remainingItems.length)]);
          }
        }
      } else {
        setTimeout(() => setFlipped([]), 850);
      }
    }
  };

  const accuracy = moves > 0 ? Math.round(((matched.length / 2) / moves) * 100) : 100;
  const isWon = gameState === 'won';
  const stars = moves <= 10 ? 3 : moves <= 16 ? 2 : 1;

  return (
    <div className="max-w-md mx-auto space-y-4 text-center">
      {/* Theme & Options Header */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold">
          {(['Emojis', 'Animals', 'Tech'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              disabled={gameState === 'preview'}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                theme === t
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 font-bold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTargetMode(m => !m)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              targetMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800'
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            🎯 Target Mode
          </button>
          {gameState !== 'idle' && (
            <button
              onClick={handleStartGame}
              className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
          )}
        </div>
      </div>

      {/* START GAME BANNER & PREVIEW CONTROLS (Item 7 Request) */}
      {gameState === 'idle' && (
        <div className="p-5 rounded-3xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900/60 space-y-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-base font-black text-indigo-900 dark:text-indigo-200 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Memory Recall Challenge</span>
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-sm mx-auto">
              Press <strong>Start Game</strong> to reveal all cards for <strong>{previewDuration} seconds</strong>. Memorize their locations before they vanish face-down, then test your visual recall!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1 text-xs">
              <span className="font-semibold text-zinc-500">Preview Time:</span>
              {[
                { label: '2s', s: 2.0 },
                { label: '3.5s', s: 3.5 },
                { label: '5s', s: 5.0 },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setPreviewDuration(opt.s)}
                  className={`px-2 py-0.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    previewDuration === opt.s
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                      : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleStartGame}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Game</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE PREVIEW COUNTDOWN BANNER */}
      {gameState === 'preview' && (
        <div className="p-4 rounded-3xl bg-indigo-600 text-white shadow-lg flex items-center justify-between animate-pulse">
          <div className="text-left">
            <span className="font-black text-sm block flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Memorize Card Positions!
            </span>
            <span className="text-xs text-indigo-100 font-medium">
              Vanish & flip face-down in <strong className="font-mono text-amber-300 text-sm">{previewRemaining}s</strong>...
            </span>
          </div>
          <button
            onClick={skipPreview}
            className="px-4 py-1.5 rounded-xl bg-white text-indigo-900 font-extrabold text-xs hover:bg-indigo-50 cursor-pointer shadow-xs active:scale-95"
          >
            I'm Ready!
          </button>
        </div>
      )}

      {/* Target Item Prompt if Target Mode enabled */}
      {targetMode && targetItem && !isWon && (
        <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
          <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
            🎯 Target to Match: <span className="text-xl ml-1">{targetItem}</span>
          </span>
          <span className="text-[11px] text-amber-700 dark:text-amber-300">Remember where it was!</span>
        </div>
      )}

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
      <div className="grid grid-cols-4 gap-2.5 p-3.5 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-inner">
        {cards.map((item, idx) => {
          const isFlipped = flipped.includes(idx);
          const isMatched = matched.includes(idx);
          const isRevealed = gameState === 'preview' || peeking || isFlipped || isMatched;

          return (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              disabled={gameState === 'idle' || gameState === 'preview'}
              className={`h-20 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 border select-none active:scale-95 ${
                gameState === 'idle'
                  ? 'bg-zinc-200/80 dark:bg-zinc-800/60 border-zinc-300 dark:border-zinc-700 text-zinc-400 cursor-not-allowed opacity-75'
                  : isMatched
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-xs'
                  : isFlipped
                  ? 'bg-white dark:bg-zinc-800 border-indigo-400 dark:border-indigo-600 shadow-md scale-102 ring-2 ring-indigo-400/40'
                  : gameState === 'preview' || peeking
                  ? 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 shadow-sm'
                  : 'bg-zinc-900 text-transparent dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 border-transparent shadow-sm cursor-pointer'
              }`}
            >
              {isRevealed ? item : '✨'}
            </button>
          );
        })}
      </div>

      {/* Peek Hint Button while playing */}
      {gameState === 'playing' && !isWon && (
        <div className="flex justify-center pt-1">
          <button
            onClick={triggerPeek}
            disabled={peeking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer shadow-2xs disabled:opacity-40"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            <span>Peek Cards (2s Hint)</span>
          </button>
        </div>
      )}

      {/* Victory Card */}
      {isWon && (
        <div className="p-5 bg-emerald-600 text-white rounded-3xl text-sm font-bold shadow-md flex flex-col items-center justify-center gap-3">
          <div className="flex gap-1 text-amber-300">
            {Array.from({ length: stars }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-300" />
            ))}
          </div>
          <span className="text-base">Flawless Recall! All Pairs Matched in {moves} moves ({seconds}s)</span>
          <button
            onClick={handleStartGame}
            className="px-5 py-2 bg-white text-emerald-900 font-extrabold text-xs rounded-xl shadow-xs cursor-pointer hover:bg-emerald-50 active:scale-95 transition-all"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

// 4. Minesweeper Classic (Item 7: What Is It, How to Play & Professional Logic Deduction Suite)
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
  const [isTense, setIsTense] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [bestTime, setBestTime] = useState<number>(() => {
    return parseInt(localStorage.getItem(`omni_minesweeper_best_${size}`) || '0', 10);
  });

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
    setIsTense(false);
  };

  useEffect(() => {
    initGrid(size, numMines);
    setBestTime(parseInt(localStorage.getItem(`omni_minesweeper_best_${size}`) || '0', 10));
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

  // Handle cell click (and chord click if already revealed)
  const handleCellAction = (r: number, c: number) => {
    if (gameOver || gameWon) return;

    if (flagMode) {
      toggleFlag(r, c);
      return;
    }

    if (grid[r][c].flag) return;

    // Chord Clicking: if already revealed and number > 0, clicking checks flags and reveals safe neighbors
    if (grid[r][c].revealed) {
      if (grid[r][c].count > 0) {
        chordReveal(r, c);
      }
      return;
    }

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
      confetti({ particleCount: 70 });
      if (bestTime === 0 || timerSeconds < bestTime) {
        setBestTime(timerSeconds);
        localStorage.setItem(`omni_minesweeper_best_${size}`, String(timerSeconds));
      }
    }
  };

  // Chord click logic
  const chordReveal = (r: number, c: number) => {
    let adjacentFlags = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc].flag) {
          adjacentFlags++;
        }
      }
    }

    if (adjacentFlags === grid[r][c].count) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size && !grid[nr][nc].flag && !grid[nr][nc].revealed) {
            handleCellAction(nr, nc);
          }
        }
      }
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

  const smiley = gameOver ? '😵' : gameWon ? '😎' : isTense ? '😮' : '🙂';

  return (
    <div className="max-w-md mx-auto space-y-4 text-center">
      {/* Title & How to Play Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Minesweeper Classic Studio</h2>
            <button
              onClick={() => setShowHowTo(prev => !prev)}
              className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center gap-1 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{showHowTo ? 'Hide Guide' : 'What is this?'}</span>
            </button>
          </div>
          <span className="text-[10px] text-zinc-400">Pure logic deduction: clear safe tiles without detonating hidden mines</span>
        </div>

        {bestTime > 0 && (
          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Best: {bestTime}s
          </span>
        )}
      </div>

      {/* Comprehensive Professional Guide: What is it & How to Play */}
      {showHowTo && (
        <div className="p-4 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-left text-xs space-y-3 shadow-xs">
          <div>
            <span className="font-extrabold text-indigo-950 dark:text-indigo-200 block text-xs mb-0.5">
              🤔 What is Minesweeper?
            </span>
            <p className="text-zinc-600 dark:text-zinc-300 text-[11px] leading-relaxed">
              Minesweeper is the iconic logic deduction puzzle originally popularized by Windows in the 1990s. The objective is simple: <strong>uncover all safe squares</strong> on the minefield without detonating any hidden bombs.
            </p>
          </div>

          <div>
            <span className="font-extrabold text-indigo-950 dark:text-indigo-200 block text-xs mb-1">
              🎮 How to Play in 3 Simple Steps:
            </span>
            <ol className="text-zinc-600 dark:text-zinc-300 text-[11px] space-y-1 list-decimal list-inside leading-relaxed">
              <li>
                <strong className="text-zinc-900 dark:text-zinc-100">Click any tile to begin:</strong> Your very first click is <strong>guaranteed 100% safe</strong> and will open a safe clearing.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-100">Read the numbers:</strong> A revealed number (1 to 8) tells you <em>exactly how many mines</em> touch that tile in the 8 adjacent squares. If a tile says <span className="font-bold text-blue-600 dark:text-blue-400">"1"</span>, only 1 neighbor is a mine!
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-100">Flag the danger:</strong> Right-click (or toggle the <strong>Flag Mode</strong> button) to place a 🚩 flag on suspected mines so you don't accidentally click them.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-100">Chord Quick-Clear:</strong> Once you have flagged all mines touching a number, click that number again to instantly reveal all its remaining safe neighbors!
              </li>
            </ol>
          </div>

          {/* Quick Color Reference */}
          <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400 font-bold uppercase text-[9px]">Tile Clues:</span>
            <span className="text-blue-600 font-bold">1 = 1 Mine</span>
            <span className="text-emerald-600 font-bold">2 = 2 Mines</span>
            <span className="text-red-600 font-bold">3 = 3 Mines</span>
            <span className="text-indigo-700 dark:text-indigo-300 font-bold">4 = 4 Mines</span>
          </div>
        </div>
      )}

      {/* Controls Bar: Difficulties & Flag Toggle */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold">
          {[
            { label: '8x8 (10)', s: 8, m: 10 },
            { label: '10x10 (16)', s: 10, m: 16 },
            { label: '12x12 (24)', s: 12, m: 24 },
          ].map(d => (
            <button
              key={d.label}
              onClick={() => {
                setSize(d.s);
                setNumMines(d.m);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                size === d.s ? 'bg-white dark:bg-zinc-700 font-bold shadow-xs text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {d.label}
            </button>
          ))}
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
          <span>{flagMode ? 'Flag Mode' : 'Dig Mode'}</span>
        </button>
      </div>

      {/* Classic Windows Retro LED Dashboard */}
      <div className="p-3 rounded-2xl bg-zinc-900 dark:bg-zinc-950 border-2 border-zinc-700 flex justify-between items-center shadow-md">
        <div className="font-mono text-xl font-black bg-zinc-950 text-red-500 px-3 py-1 rounded-lg border border-zinc-800 tracking-widest shadow-inner">
          {String(minesLeft).padStart(3, '0')}
        </div>

        <button
          onClick={() => initGrid(size, numMines)}
          className="text-3xl p-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-transform active:scale-90 cursor-pointer shadow-sm border border-zinc-700"
          title="Restart game"
        >
          {smiley}
        </button>

        <div className="font-mono text-xl font-black bg-zinc-950 text-red-500 px-3 py-1 rounded-lg border border-zinc-800 tracking-widest shadow-inner">
          {String(Math.min(timerSeconds, 999)).padStart(3, '0')}
        </div>
      </div>

      {/* Minesweeper Grid */}
      <div className="overflow-x-auto pb-1 flex justify-center">
        <div
          className="p-3 bg-zinc-300 dark:bg-zinc-800 rounded-3xl select-none inline-grid gap-1.5 shadow-inner"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellAction(r, c)}
                onContextMenu={e => toggleFlag(r, c, e)}
                onMouseDown={() => !cell.revealed && setIsTense(true)}
                onMouseUp={() => setIsTense(false)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-sm font-mono transition-all cursor-pointer select-none active:scale-95 ${
                  cell.revealed
                    ? cell.isMine
                      ? 'bg-rose-500 text-white animate-bounce'
                      : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-2xs'
                    : 'bg-zinc-400 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 shadow-2xs'
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
      </div>

      {gameOver && <p className="text-xs font-bold text-rose-500">💥 Detonation! You hit a mine. Tap smiley to retry.</p>}
      {gameWon && <p className="text-xs font-bold text-emerald-500">🎉 Mission Accomplished! Minefield cleared in {timerSeconds}s!</p>}
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
