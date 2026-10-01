import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { Play, Pause, RotateCcw, Plus, Minus, Disc, Trophy, Trash2, Clock, Sparkles, Check } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const EverydayQuickTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'quick-stopwatch':
      return <StopwatchView />;
    case 'quick-timer':
      return <MultiTimerView />;
    case 'quick-coin-toss':
      return <CoinTossView />;
    case 'quick-dice-roller':
      return <DiceRollerView />;
    case 'quick-random-number':
      return <RandomNumberView />;
    case 'quick-decision-wheel':
      return <DecisionMakerView />;
    case 'quick-tally-counter':
      return <TallyCounterView />;
    default:
      return <StopwatchView />;
  }
};

// 1. Stopwatch with Dynamic Colored Lap Effects (Item 33)
const StopwatchView: React.FC = () => {
  const [timeMs, setTimeMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const requestRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startRef.current = performance.now() - timeMs;
      const update = () => {
        setTimeMs(performance.now() - startRef.current);
        requestRef.current = requestAnimationFrame(update);
      };
      requestRef.current = requestAnimationFrame(update);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning]);

  const toggle = () => {
    sounds.playClick();
    setIsRunning(!isRunning);
  };

  const reset = () => {
    sounds.playClick();
    setIsRunning(false);
    setTimeMs(0);
    setLaps([]);
  };

  const lap = () => {
    if (!isRunning) return;
    sounds.playClick();
    setLaps(prev => [timeMs, ...prev]);
  };

  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  const ms = Math.floor((timeMs % 1000) / 10);

  const formatLap = (msVal: number) => {
    const m = Math.floor(msVal / 60000);
    const s = Math.floor((msVal % 60000) / 1000);
    const centis = Math.floor((msVal % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
  };

  // Compute lap splits (time between this lap and previous lap)
  const splits = laps.map((curr, idx) => {
    const prev = laps[idx + 1] ?? 0;
    return curr - prev;
  });

  const minSplit = splits.length > 1 ? Math.min(...splits) : null;
  const maxSplit = splits.length > 1 ? Math.max(...splits) : null;

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div className="py-7 rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-2">
        <div className="text-6xl font-mono font-black tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          <span className="text-3xl text-indigo-500 font-bold">.{String(ms).padStart(2, '0')}</span>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={toggle}
            className={`h-12 px-7 rounded-2xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-xs ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:opacity-90'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Stop' : 'Start'}</span>
          </button>
          <button
            onClick={lap}
            disabled={!isRunning}
            className="h-12 px-5 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold disabled:opacity-40 cursor-pointer transition-all shadow-2xs"
          >
            + Lap
          </button>
          <button
            onClick={reset}
            className="h-12 w-12 rounded-2xl border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 cursor-pointer shadow-2xs transition-all"
            title="Reset stopwatch"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Laps List with Dynamic Vibrant Color Effects (Item 33) */}
      {laps.length > 0 && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 max-h-64 overflow-y-auto space-y-2 text-left shadow-xs">
          <div className="flex justify-between items-center px-1 pb-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            <span>Lap Number</span>
            <span>Split Delta · Total</span>
          </div>

          {laps.map((l, i) => {
            const split = splits[i];
            const isFastest = minSplit !== null && split === minSplit;
            const isSlowest = maxSplit !== null && split === maxSplit && minSplit !== maxSplit;

            return (
              <div
                key={i}
                className={`flex justify-between items-center p-3 rounded-2xl border transition-all text-xs font-mono font-bold ${
                  isFastest
                    ? 'border-emerald-300 bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-2xs'
                    : isSlowest
                    ? 'border-rose-300 bg-gradient-to-r from-rose-500/15 to-rose-500/5 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                    : 'border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/60 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isFastest
                        ? 'bg-emerald-500 text-white shadow-2xs'
                        : isSlowest
                        ? 'bg-rose-500 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {laps.length - i}
                  </span>
                  <span className="font-sans font-semibold">
                    Lap {laps.length - i}
                  </span>
                  {isFastest && (
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-sans font-bold flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Fastest
                    </span>
                  )}
                  {isSlowest && (
                    <span className="px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-[10px] font-sans font-semibold">
                      Slowest
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="block text-zinc-900 dark:text-zinc-50 font-bold">
                    +{formatLap(split)}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-normal">
                    {formatLap(l)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 2. Multi-Timer & Countdown (Item 32: True Concurrent Multi-Timers)
interface CountdownTimer {
  id: string;
  name: string;
  totalSecs: number;
  remainingSecs: number;
  isRunning: boolean;
}

const MultiTimerView: React.FC = () => {
  const [timers, setTimers] = useState<CountdownTimer[]>([
    { id: '1', name: 'Pomodoro Focus', totalSecs: 1500, remainingSecs: 1500, isRunning: false },
    { id: '2', name: 'Coffee / Tea Brew', totalSecs: 240, remainingSecs: 240, isRunning: false },
    { id: '3', name: 'Workout Rest', totalSecs: 60, remainingSecs: 60, isRunning: false },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newMins, setNewMins] = useState('10');
  const [newSecs, setNewSecs] = useState('0');

  // Master ticking loop for all running countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev =>
        prev.map(t => {
          if (!t.isRunning) return t;
          if (t.remainingSecs <= 1) {
            sounds.playSuccess();
            return { ...t, remainingSecs: 0, isRunning: false };
          }
          return { ...t, remainingSecs: t.remainingSecs - 1 };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTimer = (id: string) => {
    sounds.playClick();
    setTimers(prev =>
      prev.map(t => (t.id === id ? { ...t, isRunning: !t.isRunning } : t))
    );
  };

  const resetTimer = (id: string) => {
    sounds.playClick();
    setTimers(prev =>
      prev.map(t => (t.id === id ? { ...t, remainingSecs: t.totalSecs, isRunning: false } : t))
    );
  };

  const deleteTimer = (id: string) => {
    sounds.playClick();
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const addTimer = () => {
    const m = parseInt(newMins, 10) || 0;
    const s = parseInt(newSecs, 10) || 0;
    const total = m * 60 + s;
    if (total <= 0) return;

    sounds.playSuccess();
    setTimers(prev => [
      ...prev,
      {
        id: String(Date.now()),
        name: newTitle.trim() || `Timer (${m}m ${s}s)`,
        totalSecs: total,
        remainingSecs: total,
        isRunning: false,
      },
    ]);
    setNewTitle('');
  };

  const formatRemaining = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex justify-between items-center pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Multi-Timer & Concurrent Countdowns
          </h2>
          <span className="text-[11px] text-zinc-400">
            Run multiple named timers simultaneously with audio chimes
          </span>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
          {timers.length} active timers
        </span>
      </div>

      {/* Add New Timer Bar */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Create New Countdown Timer
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Timer Label (e.g. Pasta, Nap)..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="sm:col-span-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs font-medium focus:outline-indigo-500"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={0}
              placeholder="Mins"
              value={newMins}
              onChange={e => setNewMins(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs font-mono font-bold text-center"
            />
            <span className="text-xs text-zinc-400 font-semibold">m</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={0}
              max={59}
              placeholder="Secs"
              value={newSecs}
              onChange={e => setNewSecs(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs font-mono font-bold text-center"
            />
            <span className="text-xs text-zinc-400 font-semibold">s</span>
          </div>
        </div>
        <button
          onClick={addTimer}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Countdown Timer</span>
        </button>
      </div>

      {/* Concurrent Running Timers Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {timers.map(t => {
          const progressPct = t.totalSecs > 0 ? (t.remainingSecs / t.totalSecs) * 100 : 0;
          const isDone = t.remainingSecs === 0;

          return (
            <div
              key={t.id}
              className={`p-5 rounded-3xl border transition-all shadow-2xs space-y-3 ${
                isDone
                  ? 'border-emerald-400 bg-emerald-50/40 dark:border-emerald-700 dark:bg-emerald-950/20'
                  : t.isRunning
                  ? 'border-indigo-400/80 bg-white dark:border-indigo-700/80 dark:bg-zinc-900'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{t.name}</h4>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Total: {formatRemaining(t.totalSecs)}
                  </span>
                </div>
                <button
                  onClick={() => deleteTimer(t.id)}
                  className="text-zinc-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                  title="Delete timer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Countdown Digits */}
              <div className="text-4xl font-mono font-black tracking-tight text-center tabular-nums text-zinc-900 dark:text-zinc-50 py-1">
                {formatRemaining(t.remainingSecs)}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isDone ? 'bg-emerald-500' : t.isRunning ? 'bg-indigo-600' : 'bg-zinc-400'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => toggleTimer(t.id)}
                  disabled={isDone}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    t.isRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90'
                  }`}
                >
                  {t.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isDone ? 'Completed' : t.isRunning ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  onClick={() => resetTimer(t.id)}
                  className="p-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 rounded-xl cursor-pointer"
                  title="Reset to start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. Animated 3D Coin Toss
const CoinTossView: React.FC = () => {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<'HEADS' | 'TAILS'>('HEADS');
  const [history, setHistory] = useState<string[]>([]);

  const flipCoin = () => {
    if (flipping) return;
    sounds.playClick(900, 0.08);
    setFlipping(true);

    const outcome: 'HEADS' | 'TAILS' = Math.random() < 0.5 ? 'HEADS' : 'TAILS';

    setTimeout(() => {
      sounds.playSuccess();
      setResult(outcome);
      setHistory(prev => [outcome, ...prev.slice(0, 7)]);
      setFlipping(false);
    }, 1000);
  };

  return (
    <div className="max-w-sm mx-auto space-y-6 text-center">
      {/* 3D Coin representation */}
      <div className="py-8 flex justify-center">
        <div
          onClick={flipCoin}
          className={`w-40 h-40 rounded-full border-4 border-amber-400 bg-amber-300 dark:bg-amber-500 shadow-2xl flex items-center justify-center text-zinc-900 font-bold font-mono text-2xl cursor-pointer select-none transition-transform duration-1000 ${
            flipping ? 'rotate-[720deg] scale-90' : 'hover:scale-105 active:scale-95'
          }`}
        >
          {flipping ? '...' : result}
        </div>
      </div>

      <button
        onClick={flipCoin}
        disabled={flipping}
        className="px-6 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-xs rounded-xl hover:opacity-90 disabled:opacity-50"
      >
        Flip Coin
      </button>

      {history.length > 0 && (
        <div className="flex justify-center gap-1.5 pt-2">
          {history.map((h, i) => (
            <span
              key={i}
              className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                h === 'HEADS' ? 'bg-amber-100 text-amber-900' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
              }`}
            >
              {h[0]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// 4. Interactive Dice Roller
const DiceRollerView: React.FC = () => {
  const [diceCount, setDiceCount] = useState(2);
  const [diceValues, setDiceValues] = useState<number[]>([4, 6]);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    sounds.playClick(700, 0.06);
    setIsRolling(true);

    setTimeout(() => {
      sounds.playSuccess();
      const newVals = Array.from({ length: diceCount }, () => Math.floor(1 + Math.random() * 6));
      setDiceValues(newVals);
      setIsRolling(false);
    }, 400);
  };

  const total = diceValues.reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div className="flex justify-center items-center gap-2">
        <span className="text-xs text-zinc-500 font-semibold">Number of Dice:</span>
        {[1, 2, 3, 4].map(n => (
          <button
            key={n}
            onClick={() => {
              sounds.playClick();
              setDiceCount(n);
              setDiceValues(Array.from({ length: n }, () => Math.floor(1 + Math.random() * 6)));
            }}
            className={`w-8 h-8 rounded-lg text-xs font-semibold ${diceCount === n ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-800'}`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3 py-4 flex-wrap">
        {diceValues.map((v, i) => (
          <div
            key={i}
            className={`w-20 h-20 rounded-2xl border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md flex items-center justify-center text-4xl font-bold font-mono transition-transform duration-300 ${
              isRolling ? 'rotate-180 scale-90' : ''
            }`}
          >
            {v}
          </div>
        ))}
      </div>

      <div className="font-mono text-2xl font-bold">
        Total: <span className="text-emerald-600 dark:text-emerald-400">{total}</span>
      </div>

      <button
        onClick={rollDice}
        disabled={isRolling}
        className="px-6 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-xs rounded-xl hover:opacity-90"
      >
        Roll Dice 🎲
      </button>
    </div>
  );
};

// 5. Random Number Generator
const RandomNumberView: React.FC = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [unique, setUnique] = useState(true);
  const [results, setResults] = useState<number[]>([42]);

  const generate = () => {
    sounds.playClick();
    if (unique && quantity > max - min + 1) {
      alert('Range is smaller than requested quantity of unique numbers.');
      return;
    }

    const set = new Set<number>();
    const res: number[] = [];
    while (res.length < quantity) {
      const val = Math.floor(min + Math.random() * (max - min + 1));
      if (unique) {
        if (!set.has(val)) {
          set.add(val);
          res.push(val);
        }
      } else {
        res.push(val);
      }
    }
    setResults(res);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Minimum</label>
          <input
            type="number"
            value={min}
            onChange={e => setMin(parseInt(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono text-center bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Maximum</label>
          <input
            type="number"
            value={max}
            onChange={e => setMax(parseInt(e.target.value) || 100)}
            className="w-full border rounded-xl p-2 font-mono text-center bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            max={50}
            value={quantity}
            onChange={e => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono text-center bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div className="col-span-3 pt-1 flex justify-between items-center">
          <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={unique}
              onChange={e => setUnique(e.target.checked)}
              className="rounded accent-zinc-900"
            />
            <span>Unique Numbers (No Duplicates)</span>
          </label>
          <button
            onClick={generate}
            className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-xs rounded-xl"
          >
            Generate
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 text-center">
        <span className="text-xs text-zinc-500 block mb-2 font-semibold uppercase">Generated Numbers</span>
        <div className="flex flex-wrap justify-center gap-2">
          {results.map((r, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 font-mono font-bold text-xl text-zinc-900 dark:text-zinc-50"
            >
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// 6. Decision Maker & Picker
const DecisionMakerView: React.FC = () => {
  const [optionsText, setOptionsText] = useState('Sushi, Pizza, Tacos, Salad, Burger, Thai Curry');
  const [picked, setPicked] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const pickOne = () => {
    const list = optionsText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    if (list.length === 0) return;

    sounds.playClick();
    setIsSpinning(true);
    setPicked(null);

    let counter = 0;
    const interval = setInterval(() => {
      setPicked(list[Math.floor(Math.random() * list.length)]);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        sounds.playSuccess();
        const finalChoice = list[Math.floor(Math.random() * list.length)];
        setPicked(finalChoice);
        setIsSpinning(false);
        confetti({ particleCount: 40 });
      }
    }, 70);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 text-left">
          Enter Choices (comma separated)
        </label>
        <textarea
          rows={3}
          value={optionsText}
          onChange={e => setOptionsText(e.target.value)}
          className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
        />
        <button
          onClick={pickOne}
          disabled={isSpinning}
          className="w-full py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5"
        >
          <Disc className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>Pick for Me</span>
        </button>
      </div>

      {picked && (
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
          <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Selected Decision</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{picked}</span>
        </div>
      )}
    </div>
  );
};

// 7. Multi Tally Counter
const TallyCounterView: React.FC = () => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = () => {
    sounds.playClick(600, 0.03);
    setCount(c => c + step);
  };

  const decrement = () => {
    sounds.playClick(400, 0.03);
    setCount(c => Math.max(0, c - step));
  };

  const reset = () => {
    sounds.playClick();
    setCount(0);
  };

  return (
    <div className="max-w-xs mx-auto rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-6 shadow-sm">
      <div className="flex justify-between items-center text-xs">
        <span className="text-zinc-500">Step: {step}</span>
        <button onClick={reset} className="p-1 border rounded hover:bg-zinc-100 text-zinc-500">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="text-7xl font-mono font-bold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
        {count}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={decrement}
          className="h-16 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 flex items-center justify-center text-2xl font-bold"
        >
          <Minus className="w-6 h-6" />
        </button>
        <button
          onClick={increment}
          className="h-16 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center text-2xl font-bold hover:opacity-90 shadow-sm"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
