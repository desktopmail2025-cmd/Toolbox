import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { Play, Pause, RotateCcw, Plus, Minus, Disc } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const EverydayQuickTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'quick-stopwatch':
      return <StopwatchView />;
    case 'quick-timer':
      return <QuickTimerView />;
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

// 1. Stopwatch with Laps
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
    setLaps([timeMs, ...laps]);
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

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div className="py-6 rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <div className="text-6xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          <span className="text-3xl text-zinc-400">.{String(ms).padStart(2, '0')}</span>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={toggle}
            className="h-12 px-6 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold flex items-center gap-2 hover:opacity-90"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Stop' : 'Start'}</span>
          </button>
          <button
            onClick={lap}
            disabled={!isRunning}
            className="h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 text-xs font-semibold disabled:opacity-40"
          >
            Lap
          </button>
          <button
            onClick={reset}
            className="h-12 w-12 rounded-xl border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 max-h-48 overflow-y-auto space-y-1.5">
          {laps.map((l, i) => (
            <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 font-mono">
              <span className="text-zinc-400 font-sans">Lap {laps.length - i}</span>
              <span className="font-bold">{formatLap(l)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 2. Multi-Timer & Countdown
const QuickTimerView: React.FC = () => {
  const [totalSecs, setTotalSecs] = useState(300); // 5 mins
  const [remaining, setRemaining] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      timerRef.current = window.setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            sounds.playTone(880, 1.5);
            setIsRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, remaining]);

  const setTime = (mins: number) => {
    sounds.playClick();
    setIsRunning(false);
    setTotalSecs(mins * 60);
    setRemaining(mins * 60);
  };

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div className="flex justify-center gap-2">
        {[1, 5, 10, 15, 30].map(mins => (
          <button
            key={mins}
            onClick={() => setTime(mins)}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            {mins}m
          </button>
        ))}
      </div>

      <div className="py-6 rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <div className="text-6xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
          {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => { sounds.playClick(); setIsRunning(!isRunning); }}
            className="h-12 px-6 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold flex items-center gap-2 hover:opacity-90"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setIsRunning(false); setRemaining(totalSecs); }}
            className="h-12 w-12 rounded-xl border flex items-center justify-center text-zinc-500"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
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
