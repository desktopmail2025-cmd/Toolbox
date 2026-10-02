import React, { useState, useEffect } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { PerfectPrimeCalculatorView } from './PerfectPrimeCalculator';
import { Delete, Trash2, X } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const GeneralCalculators: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'prime-checker':
    case 'prime-calculator':
      return <PerfectPrimeCalculatorView />;
    case 'basic-calc':
      return <BasicCalcView />;
    case 'scientific-calc':
      return <ScientificCalcView />;
    case 'percentage-calc':
      return <PercentageCalcView />;
    case 'fraction-calc':
      return <FractionCalcView />;
    case 'ratio-calc':
      return <RatioCalcView />;
    case 'average-calc':
      return <AverageCalcView />;
    case 'date-calc':
      return <DateCalcView />;
    case 'duration-calc':
      return <DurationCalcView />;
    case 'age-calc':
      return <AgeCalcView />;
    case 'discount-calc':
      return <DiscountCalcView />;
    case 'tip-calc':
      return <TipCalcView />;
    case 'unit-price-calc':
      return <UnitPriceCalcView />;
    default:
      return <BasicCalcView />;
  }
};

// 1. Basic Calculator
const BasicCalcView: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // History is stored in localStorage so Reset never erases it!
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('omni_basic_calc_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('omni_basic_calc_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const handleDigit = (digit: string) => {
    sounds.playClick();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    sounds.playClick();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOp: string) => {
    sounds.playClick();
    const inputValue = parseFloat(display);

    if (prevVal === null) {
      setPrevVal(inputValue);
    } else if (operator) {
      const currentVal = prevVal || 0;
      let result = 0;
      if (operator === '+') result = currentVal + inputValue;
      else if (operator === '-') result = currentVal - inputValue;
      else if (operator === '×') result = currentVal * inputValue;
      else if (operator === '÷') result = inputValue !== 0 ? currentVal / inputValue : 0;

      setPrevVal(result);
      setDisplay(String(Number(result.toFixed(8))));
    }

    setWaitingForOperand(true);
    setOperator(nextOp);
  };

  const handleEqual = () => {
    if (!operator || prevVal === null) return;
    sounds.playSuccess();
    const inputValue = parseFloat(display);
    let result = 0;
    if (operator === '+') result = prevVal + inputValue;
    else if (operator === '-') result = prevVal - inputValue;
    else if (operator === '×') result = prevVal * inputValue;
    else if (operator === '÷') result = inputValue !== 0 ? prevVal / inputValue : 0;

    const formatted = String(Number(result.toFixed(8)));
    setHistory(prev => [`${prevVal} ${operator} ${inputValue} = ${formatted}`, ...prev.slice(0, 19)]);
    setDisplay(formatted);
    setPrevVal(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  // Reset calculator to zero - DOES NOT delete history!
  const handleResetToZero = () => {
    sounds.playClick();
    setDisplay('0');
    setPrevVal(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  // Delete history ONLY when user explicitly clicks the delete sign
  const handleDeleteAllHistory = () => {
    sounds.playClick();
    setHistory([]);
    try {
      localStorage.removeItem('omni_basic_calc_history');
    } catch {
      // ignore
    }
  };

  const handleDeleteSingleHistory = (indexToDelete: number) => {
    sounds.playClick();
    setHistory(prev => prev.filter((_, idx) => idx !== indexToDelete));
  };

  const handleBackspace = () => {
    sounds.playClick();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handlePercent = () => {
    sounds.playClick();
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const handlePlusMinus = () => {
    sounds.playClick();
    const val = parseFloat(display);
    setDisplay(String(val * -1));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Screen Display */}
        <div className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-right dark:border-zinc-800 dark:bg-zinc-950">
          <div className="h-5 text-xs text-zinc-500 font-mono">
            {prevVal !== null && operator ? `${prevVal} ${operator}` : ''}
          </div>
          <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50 truncate mt-1">
            {display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={handleResetToZero}
            className="h-12 sm:h-14 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all"
            title="Clear display to 0"
          >
            C
          </button>
          <button
            onClick={handlePlusMinus}
            className="h-12 sm:h-14 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all"
          >
            ±
          </button>
          <button
            onClick={handlePercent}
            className="h-12 sm:h-14 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all"
          >
            %
          </button>
          <button
            onClick={() => handleOperator('÷')}
            className="h-12 sm:h-14 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 font-medium text-lg cursor-pointer active:scale-95 transition-all"
          >
            ÷
          </button>

          {['7', '8', '9'].map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="h-12 sm:h-14 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 font-medium text-lg text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 dark:text-zinc-100 cursor-pointer active:scale-95 transition-all"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => handleOperator('×')}
            className="h-12 sm:h-14 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 font-medium text-lg cursor-pointer active:scale-95 transition-all"
          >
            ×
          </button>

          {['4', '5', '6'].map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="h-12 sm:h-14 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 font-medium text-lg text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 dark:text-zinc-100 cursor-pointer active:scale-95 transition-all"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => handleOperator('-')}
            className="h-12 sm:h-14 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 font-medium text-lg cursor-pointer active:scale-95 transition-all"
          >
            -
          </button>

          {['1', '2', '3'].map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="h-12 sm:h-14 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 font-medium text-lg text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 dark:text-zinc-100 cursor-pointer active:scale-95 transition-all"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => handleOperator('+')}
            className="h-12 sm:h-14 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 font-medium text-lg cursor-pointer active:scale-95 transition-all"
          >
            +
          </button>

          <button
            onClick={() => handleDigit('0')}
            className="h-12 sm:h-14 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 font-medium text-lg text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 dark:text-zinc-100 cursor-pointer active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            className="h-12 sm:h-14 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 font-medium text-lg text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 dark:text-zinc-100 cursor-pointer active:scale-95 transition-all"
          >
            .
          </button>
          <button
            onClick={handleBackspace}
            className="h-12 sm:h-14 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 cursor-pointer active:scale-95 transition-all"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={handleEqual}
            className="h-12 sm:h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xl shadow-xs transition-colors cursor-pointer active:scale-95"
          >
            =
          </button>
        </div>
      </div>

      {/* Tape History with Separate Dedicated Delete Sign */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Tape History
            </span>
            {history.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                {history.length}
              </span>
            )}
          </div>

          {/* Dedicated Delete Sign - ONLY this removes history */}
          {history.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAllHistory}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 hover:bg-rose-100/70 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 transition-all cursor-pointer active:scale-95"
              title="Delete all calculation history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-xs text-zinc-400 py-10 text-center">
            <span>No calculation history</span>
            <span className="text-[11px] text-zinc-400/80 mt-1">Calculations will be saved here automatically</span>
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-72 pr-1">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-100 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="font-mono text-xs text-zinc-800 dark:text-zinc-200 truncate pr-2">
                  {item}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteSingleHistory(idx)}
                  className="opacity-60 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-all cursor-pointer"
                  title="Delete this entry"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Scientific Calculator
const ScientificCalcView: React.FC = () => {
  const [val, setVal] = useState('0');
  const [isRad, setIsRad] = useState(true);

  const applyFn = (fnName: string) => {
    sounds.playClick();
    const num = parseFloat(val);
    let res = 0;
    switch (fnName) {
      case 'sin':
        res = Math.sin(isRad ? num : (num * Math.PI) / 180);
        break;
      case 'cos':
        res = Math.cos(isRad ? num : (num * Math.PI) / 180);
        break;
      case 'tan':
        res = Math.tan(isRad ? num : (num * Math.PI) / 180);
        break;
      case 'sqrt':
        res = Math.sqrt(num);
        break;
      case 'sqr':
        res = Math.pow(num, 2);
        break;
      case 'cube':
        res = Math.pow(num, 3);
        break;
      case 'ln':
        res = Math.log(num);
        break;
      case 'log10':
        res = Math.log10(num);
        break;
      case '1/x':
        res = num !== 0 ? 1 / num : 0;
        break;
      case 'fact': {
        let f = 1;
        for (let i = 2; i <= Math.min(Math.floor(num), 120); i++) f *= i;
        res = f;
        break;
      }
      case 'pi':
        res = Math.PI;
        break;
      case 'e':
        res = Math.E;
        break;
      default:
        break;
    }
    setVal(String(Number(res.toFixed(8))));
  };

  return (
    <div className="max-w-xl mx-auto rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-medium">
          <button
            onClick={() => { sounds.playClick(); setIsRad(true); }}
            className={`px-3 py-1 rounded-md transition-colors ${isRad ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-xs' : 'text-zinc-500'}`}
          >
            RAD
          </button>
          <button
            onClick={() => { sounds.playClick(); setIsRad(false); }}
            className={`px-3 py-1 rounded-md transition-colors ${!isRad ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-xs' : 'text-zinc-500'}`}
          >
            DEG
          </button>
        </div>
        <span className="text-xs text-zinc-400 font-mono">Scientific Precision</span>
      </div>

      <div className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-right dark:border-zinc-800 dark:bg-zinc-950 font-mono text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50 truncate">
        {val}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 text-sm font-medium">
        {[
          { label: 'sin', fn: 'sin' },
          { label: 'cos', fn: 'cos' },
          { label: 'tan', fn: 'tan' },
          { label: '√x', fn: 'sqrt' },
          { label: 'x²', fn: 'sqr' },
          { label: 'x³', fn: 'cube' },
          { label: 'ln', fn: 'ln' },
          { label: 'log₁₀', fn: 'log10' },
          { label: '1/x', fn: '1/x' },
          { label: 'x!', fn: 'fact' },
          { label: 'π', fn: 'pi' },
          { label: 'e', fn: 'e' },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => applyFn(item.fn)}
            className="h-11 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => { sounds.playClick(); setVal('0'); }}
          className="h-11 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold transition-colors cursor-pointer"
          title="Clear to 0"
        >
          C
        </button>
        <input
          type="number"
          value={val}
          onChange={e => setVal(e.target.value)}
          className="h-11 col-span-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 bg-white dark:bg-zinc-950 font-mono text-right"
          placeholder="Input number"
        />
      </div>
    </div>
  );
};

// 3. Percentage Calculator (3 modes)
const PercentageCalcView: React.FC = () => {
  const [val1, setVal1] = useState(0);
  const [val2, setVal2] = useState(0);

  const [val3, setVal3] = useState(0);
  const [val4, setVal4] = useState(0);

  const [fromVal, setFromVal] = useState(0);
  const [toVal, setToVal] = useState(0);

  const res1 = (val1 * val2) / 100;
  const res2 = val4 !== 0 ? (val3 / val4) * 100 : 0;
  const change = fromVal !== 0 ? ((toVal - fromVal) / fromVal) * 100 : 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Percentage Calculators</h2>
      </div>

      {/* Mode 1 */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          1. What is X% of Y?
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <span>What is</span>
            <input
              type="number"
              value={val1}
              onChange={e => setVal1(parseFloat(e.target.value) || 0)}
              className="w-20 rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1.5 bg-white dark:bg-zinc-950 font-mono text-center"
            />
            <span>% of</span>
            <input
              type="number"
              value={val2}
              onChange={e => setVal2(parseFloat(e.target.value) || 0)}
              className="w-24 rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1.5 bg-white dark:bg-zinc-950 font-mono text-center"
            />
            <span>?</span>
          </div>
        </div>
        <div className="mt-4">
          <ResultCard label="Result" value={Number(res1.toFixed(4))} highlight />
        </div>
      </div>

      {/* Mode 2 */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          2. X is what % of Y?
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={val3}
              onChange={e => setVal3(parseFloat(e.target.value) || 0)}
              className="w-20 rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1.5 bg-white dark:bg-zinc-950 font-mono text-center"
            />
            <span>is what % of</span>
            <input
              type="number"
              value={val4}
              onChange={e => setVal4(parseFloat(e.target.value) || 0)}
              className="w-24 rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1.5 bg-white dark:bg-zinc-950 font-mono text-center"
            />
            <span>?</span>
          </div>
        </div>
        <div className="mt-4">
          <ResultCard label="Percentage" value={`${Number(res2.toFixed(2))}%`} />
        </div>
      </div>

      {/* Mode 3 */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          3. Percentage Increase / Decrease
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span>From</span>
            <input
              type="number"
              value={fromVal}
              onChange={e => setFromVal(parseFloat(e.target.value) || 0)}
              className="w-24 rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1.5 bg-white dark:bg-zinc-950 font-mono text-center"
            />
            <span>to</span>
            <input
              type="number"
              value={toVal}
              onChange={e => setToVal(parseFloat(e.target.value) || 0)}
              className="w-24 rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1.5 bg-white dark:bg-zinc-950 font-mono text-center"
            />
          </div>
        </div>
        <div className="mt-4">
          <ResultCard
            label="Percentage Change"
            value={`${change >= 0 ? '+' : ''}${Number(change.toFixed(2))}%`}
            subtext={change >= 0 ? 'Increase' : 'Decrease'}
          />
        </div>
      </div>
    </div>
  );
};

// 4. Fraction Calculator
const FractionCalcView: React.FC = () => {
  const [n1, setN1] = useState(0);
  const [d1, setD1] = useState(1);
  const [op, setOp] = useState<'+' | '-' | '×' | '÷'>('+');
  const [n2, setN2] = useState(0);
  const [d2, setD2] = useState(1);

  const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

  let resNum = 0;
  let resDen = d1 * d2 || 1;

  if (op === '+') {
    resNum = n1 * d2 + n2 * d1;
  } else if (op === '-') {
    resNum = n1 * d2 - n2 * d1;
  } else if (op === '×') {
    resNum = n1 * n2;
    resDen = d1 * d2;
  } else if (op === '÷') {
    resNum = n1 * d2;
    resDen = d1 * n2;
  }

  const divisor = gcd(resNum, resDen) || 1;
  const simNum = resNum / divisor;
  const simDen = resDen / divisor;

  const whole = Math.floor(Math.abs(simNum) / simDen) * (simNum < 0 ? -1 : 1);
  const remNum = Math.abs(simNum) % simDen;
  const decimalVal = resDen !== 0 ? (resNum / resDen).toFixed(4) : '0';

  return (
    <div className="max-w-xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Fraction Solver</h2>
      </div>

      <div className="flex items-center justify-center gap-4 py-4 flex-wrap">
        {/* Fraction 1 */}
        <div className="flex flex-col items-center w-16">
          <input
            type="number"
            value={n1}
            onChange={e => setN1(parseInt(e.target.value) || 0)}
            className="w-full text-center border border-zinc-300 dark:border-zinc-700 rounded-md py-1 font-mono text-base bg-white dark:bg-zinc-950"
          />
          <div className="w-full h-0.5 bg-zinc-800 dark:bg-zinc-200 my-1" />
          <input
            type="number"
            value={d1}
            onChange={e => setD1(parseInt(e.target.value) || 1)}
            className="w-full text-center border border-zinc-300 dark:border-zinc-700 rounded-md py-1 font-mono text-base bg-white dark:bg-zinc-950"
          />
        </div>

        {/* Operator */}
        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          {(['+', '-', '×', '÷'] as const).map(o => (
            <button
              key={o}
              onClick={() => { sounds.playClick(); setOp(o); }}
              className={`w-9 h-9 rounded-md font-bold transition-colors ${op === o ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-zinc-500'}`}
            >
              {o}
            </button>
          ))}
        </div>

        {/* Fraction 2 */}
        <div className="flex flex-col items-center w-16">
          <input
            type="number"
            value={n2}
            onChange={e => setN2(parseInt(e.target.value) || 0)}
            className="w-full text-center border border-zinc-300 dark:border-zinc-700 rounded-md py-1 font-mono text-base bg-white dark:bg-zinc-950"
          />
          <div className="w-full h-0.5 bg-zinc-800 dark:bg-zinc-200 my-1" />
          <input
            type="number"
            value={d2}
            onChange={e => setD2(parseInt(e.target.value) || 1)}
            className="w-full text-center border border-zinc-300 dark:border-zinc-700 rounded-md py-1 font-mono text-base bg-white dark:bg-zinc-950"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        <ResultCard label="Simplified Fraction" value={`${simNum} / ${simDen}`} highlight />
        <ResultCard
          label="Mixed Fraction"
          value={Math.abs(whole) > 0 && remNum > 0 ? `${whole} ${remNum}/${simDen}` : `${simNum} / ${simDen}`}
        />
        <ResultCard label="Decimal Value" value={decimalVal} />
      </div>
    </div>
  );
};

// 5. Ratio Calculator
const RatioCalcView: React.FC = () => {
  const [a, setA] = useState<string>('0');
  const [b, setB] = useState<string>('0');
  const [c, setC] = useState<string>('0');
  const [d, setD] = useState<string>('');

  const solveProportion = () => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    const nc = parseFloat(c);
    const nd = parseFloat(d);

    if (!d && na && nb && nc) return ((nb * nc) / na).toFixed(2);
    if (!c && na && nb && nd) return ((na * nd) / nb).toFixed(2);
    if (!b && na && nc && nd) return ((na * nd) / nc).toFixed(2);
    if (!a && nb && nc && nd) return ((nb * nc) / nd).toFixed(2);
    return '0';
  };

  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  const simDiv = gcd(parseFloat(a) || 1, parseFloat(b) || 1);
  const simRatio = `${(parseFloat(a) || 0) / simDiv} : ${(parseFloat(b) || 0) / simDiv}`;

  return (
    <div className="max-w-xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-6">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="text-sm font-semibold">Proportion Solver (A : B = C : D)</h3>
        <p className="text-xs text-zinc-500">Leave one field empty to calculate its value</p>
      </div>

      <div className="flex items-center justify-center gap-2">
          <input
            type="number"
            placeholder="A"
            value={a}
            onChange={e => setA(e.target.value)}
            className="w-16 text-center border rounded-lg py-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
          <span className="font-bold text-lg">:</span>
          <input
            type="number"
            placeholder="B"
            value={b}
            onChange={e => setB(e.target.value)}
            className="w-16 text-center border rounded-lg py-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
          <span className="font-bold text-lg mx-2">=</span>
          <input
            type="number"
            placeholder="C"
            value={c}
            onChange={e => setC(e.target.value)}
            className="w-16 text-center border rounded-lg py-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
          <span className="font-bold text-lg">:</span>
          <input
            type="number"
            placeholder="D (empty)"
            value={d}
            onChange={e => setD(e.target.value)}
            className="w-20 text-center border border-dashed border-emerald-500 rounded-lg py-2 font-mono bg-emerald-50/50 dark:bg-emerald-950/30"
          />
        </div>

      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Missing Value Result" value={solveProportion()} highlight />
        <ResultCard label="Simplified A : B" value={simRatio} />
      </div>
    </div>
  );
};

// 6. Average & Statistics Calculator
const AverageCalcView: React.FC = () => {
  const [inputStr, setInputStr] = useState('');

  const numbers = inputStr
    .split(/[\s,]+/)
    .map(Number)
    .filter(n => !isNaN(n));

  const count = numbers.length;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  const mean = count > 0 ? sum / count : 0;

  const sorted = [...numbers].sort((x, y) => x - y);
  const min = sorted.length ? sorted[0] : 0;
  const max = sorted.length ? sorted[sorted.length - 1] : 0;
  const range = max - min;

  // Median
  let median = 0;
  if (sorted.length > 0) {
    const mid = Math.floor(sorted.length / 2);
    median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  // Std Dev
  const variance = count > 1 ? numbers.reduce((acc, n) => acc + Math.pow(n - mean, 2), 0) / (count - 1) : 0;
  const stdDev = Math.sqrt(variance);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-2">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Enter numbers (separated by comma, space or newline)
          </label>
        </div>
        <textarea
          rows={3}
          value={inputStr}
          onChange={e => setInputStr(e.target.value)}
          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          placeholder="e.g. 10, 20, 30.5, 40"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="Mean (Average)" value={mean.toFixed(2)} highlight />
        <ResultCard label="Median" value={median.toFixed(2)} />
        <ResultCard label="Sum" value={sum.toFixed(2)} />
        <ResultCard label="Count" value={count} />
        <ResultCard label="Minimum" value={min} />
        <ResultCard label="Maximum" value={max} />
        <ResultCard label="Range" value={range} />
        <ResultCard label="Std Deviation" value={stdDev.toFixed(2)} />
      </div>
    </div>
  );
};

// 7. Date Difference & Add Days Calculator
const DateCalcView: React.FC = () => {
  const [d1, setD1] = useState(new Date().toISOString().split('T')[0]);
  const [d2, setD2] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().split('T')[0];
  });
  const [addDays, setAddDays] = useState(30);

  const dateA = new Date(d1);
  const dateB = new Date(d2);
  const diffTime = Math.abs(dateB.getTime() - dateA.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = (diffDays / 7).toFixed(1);

  const addedDate = new Date(dateA);
  addedDate.setDate(addedDate.getDate() + Number(addDays));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <h3 className="text-sm font-semibold">1. Days Between Two Dates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Start Date</label>
            <input
              type="date"
              value={d1}
              onChange={e => setD1(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">End Date</label>
            <input
              type="date"
              value={d2}
              onChange={e => setD2(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <ResultCard label="Total Days" value={`${diffDays} days`} highlight />
          <ResultCard label="Equivalent Weeks" value={`${diffWeeks} weeks`} />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <h3 className="text-sm font-semibold">2. Add or Subtract Days</h3>
        <div className="flex items-center gap-3">
          <span>Add</span>
          <input
            type="number"
            value={addDays}
            onChange={e => setAddDays(parseInt(e.target.value) || 0)}
            className="w-24 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm bg-white dark:bg-zinc-950 text-center font-mono"
          />
          <span>days to Start Date</span>
        </div>
        <ResultCard label="Target Date" value={addedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
      </div>
    </div>
  );
};

// 8. Time Duration Calculator
const DurationCalcView: React.FC = () => {
  const [h1, setH1] = useState(2);
  const [m1, setM1] = useState(45);
  const [h2, setH2] = useState(3);
  const [m2, setM2] = useState(30);

  const totalMin = h1 * 60 + m1 + (h2 * 60 + m2);
  const resH = Math.floor(totalMin / 60);
  const resM = totalMin % 60;

  const diffMin = Math.abs(h1 * 60 + m1 - (h2 * 60 + m2));
  const diffH = Math.floor(diffMin / 60);
  const diffM = diffMin % 60;

  return (
    <div className="max-w-xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-2">Time 1</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={h1}
              onChange={e => setH1(parseInt(e.target.value) || 0)}
              className="w-full text-center border rounded-lg py-2 bg-white dark:bg-zinc-950 dark:border-zinc-700"
              placeholder="Hrs"
            />
            <input
              type="number"
              value={m1}
              onChange={e => setM1(parseInt(e.target.value) || 0)}
              className="w-full text-center border rounded-lg py-2 bg-white dark:bg-zinc-950 dark:border-zinc-700"
              placeholder="Min"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-2">Time 2</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={h2}
              onChange={e => setH2(parseInt(e.target.value) || 0)}
              className="w-full text-center border rounded-lg py-2 bg-white dark:bg-zinc-950 dark:border-zinc-700"
              placeholder="Hrs"
            />
            <input
              type="number"
              value={m2}
              onChange={e => setM2(parseInt(e.target.value) || 0)}
              className="w-full text-center border rounded-lg py-2 bg-white dark:bg-zinc-950 dark:border-zinc-700"
              placeholder="Min"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Combined Total" value={`${resH}h ${resM}m`} highlight />
        <ResultCard label="Difference" value={`${diffH}h ${diffM}m`} />
      </div>
    </div>
  );
};

// 9. Age Calculator
const AgeCalcView: React.FC = () => {
  const [birthDate, setBirthDate] = useState('2000-01-15');

  const bDate = new Date(birthDate);
  const now = new Date();

  let years = now.getFullYear() - bDate.getFullYear();
  let months = now.getMonth() - bDate.getMonth();
  let days = now.getDate() - bDate.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((now.getTime() - bDate.getTime()) / (1000 * 60 * 60 * 24));

  // Next birthday countdown
  const nextBirthday = new Date(now.getFullYear(), bDate.getMonth(), bDate.getDate());
  if (nextBirthday < now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }
  const daysUntilNext = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="block text-xs font-semibold text-zinc-500 mb-2">Select Your Date of Birth</label>
        <input
          type="date"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-base font-medium"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Exact Age" value={`${years} yrs, ${months} mos`} subtext={`${days} days`} highlight />
        <ResultCard label="Total Days Lived" value={totalDays.toLocaleString()} />
        <ResultCard label="Next Birthday in" value={`${daysUntilNext} days`} />
      </div>
    </div>
  );
};

// 10. Discount & Final Price Calculator
const DiscountCalcView: React.FC = () => {
  const [price, setPrice] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [extraCoupon, setExtraCoupon] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  const firstDiscount = (price * discountPercent) / 100;
  const afterFirst = price - firstDiscount;
  const secondDiscount = (afterFirst * extraCoupon) / 100;
  const afterSecond = afterFirst - secondDiscount;
  const tax = (afterSecond * taxPercent) / 100;
  const finalPrice = afterSecond + tax;
  const totalSavings = price - afterSecond;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Discount & Tax Calculator</h2>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Original Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2 font-mono text-base"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Primary Discount (%)</label>
          <input
            type="number"
            value={discountPercent}
            onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2 font-mono text-base"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Additional Coupon (%)</label>
          <input
            type="number"
            value={extraCoupon}
            onChange={e => setExtraCoupon(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2 font-mono text-base"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Sales Tax (%)</label>
          <input
            type="number"
            value={taxPercent}
            onChange={e => setTaxPercent(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2 font-mono text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Final Total to Pay" value={`$${finalPrice.toFixed(2)}`} highlight />
        <ResultCard label="Total Saved" value={`$${totalSavings.toFixed(2)}`} />
        <ResultCard label="Tax Amount" value={`$${tax.toFixed(2)}`} />
      </div>
    </div>
  );
};

// 11. Tip & Bill Split Calculator
const TipCalcView: React.FC = () => {
  const [bill, setBill] = useState(0);
  const [tipPercent, setTipPercent] = useState(0);
  const [people, setPeople] = useState(1);

  const tipAmount = (bill * tipPercent) / 100;
  const totalBill = bill + tipAmount;
  const perPerson = people > 0 ? totalBill / people : totalBill;
  const tipPerPerson = people > 0 ? tipAmount / people : tipAmount;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tip & Bill Split</h2>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Bill Amount ($)</label>
          <input
            type="number"
            value={bill}
            onChange={e => setBill(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2.5 font-mono text-lg"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span>Tip Percentage</span>
            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{tipPercent}%</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[10, 15, 18, 20, 25].map(tp => (
              <button
                key={tp}
                onClick={() => { sounds.playClick(); setTipPercent(tp); }}
                className={`py-2 rounded-lg font-medium text-xs transition-colors ${tipPercent === tp ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200'}`}
              >
                {tp}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1">Split Between Persons</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPeople(Math.max(1, people - 1))}
              className="w-10 h-10 rounded-lg border bg-zinc-50 dark:bg-zinc-800 font-bold cursor-pointer"
            >
              -
            </button>
            <span className="text-xl font-mono font-bold w-12 text-center">{people}</span>
            <button
              onClick={() => setPeople(people + 1)}
              className="w-10 h-10 rounded-lg border bg-zinc-50 dark:bg-zinc-800 font-bold cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Per Person Total" value={`$${perPerson.toFixed(2)}`} highlight />
        <ResultCard label="Total Tip" value={`$${tipAmount.toFixed(2)}`} subtext={`$${tipPerPerson.toFixed(2)} each`} />
        <ResultCard label="Grand Total" value={`$${totalBill.toFixed(2)}`} />
      </div>
    </div>
  );
};

// 12. Unit Price Comparison
const UnitPriceCalcView: React.FC = () => {
  const [p1, setP1] = useState(0);
  const [q1, setQ1] = useState(0);
  const [p2, setP2] = useState(0);
  const [q2, setQ2] = useState(0);

  const unitPrice1 = q1 > 0 ? p1 / q1 : 0;
  const unitPrice2 = q2 > 0 ? p2 / q2 : 0;
  const deal1 = unitPrice1 > 0 && (unitPrice2 === 0 || unitPrice1 < unitPrice2);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Unit Price Comparison</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-5 rounded-2xl border transition-all ${deal1 ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Option A</h4>
            {deal1 && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">BEST VALUE</span>}
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Price ($)</label>
              <input
                type="number"
                value={p1}
                onChange={e => setP1(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-lg p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Quantity (oz/g/items)</label>
              <input
                type="number"
                value={q1}
                onChange={e => setQ1(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-lg p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
            <div className="pt-2">
              <span className="text-xs text-zinc-500">Unit Price: </span>
              <span className="font-mono font-bold text-lg">${unitPrice1.toFixed(4)} / unit</span>
            </div>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${!deal1 && unitPrice2 > 0 ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Option B</h4>
            {!deal1 && unitPrice2 > 0 && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">BEST VALUE</span>}
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Price ($)</label>
              <input
                type="number"
                value={p2}
                onChange={e => setP2(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-lg p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Quantity (oz/g/items)</label>
              <input
                type="number"
                value={q2}
                onChange={e => setQ2(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-lg p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
            <div className="pt-2">
              <span className="text-xs text-zinc-500">Unit Price: </span>
              <span className="font-mono font-bold text-lg">${unitPrice2.toFixed(4)} / unit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
