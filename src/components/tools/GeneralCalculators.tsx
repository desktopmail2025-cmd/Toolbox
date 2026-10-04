import React, { useState, useEffect } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { PerfectPrimeCalculatorView } from './PerfectPrimeCalculator';
import { GcdLcmCalcView, MatrixOperatorView, LeapYearCheckerView } from './ExtendedUtilities';
import { Delete, Trash2, X, Calendar, Clock, Users, ArrowRightLeft, Sparkles, Percent, Check } from 'lucide-react';

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
    case 'gcd-lcm-calc':
      return <GcdLcmCalcView />;
    case 'matrix-operator':
      return <MatrixOperatorView />;
    case 'leap-year-checker':
      return <LeapYearCheckerView />;
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

// 2. Professional Scientific Calculator
const ScientificCalcView: React.FC = () => {
  const [expr, setExpr] = useState<string>('0');
  const [resultPreview, setResultPreview] = useState<string>('');
  const [isRad, setIsRad] = useState(true);
  const [isSecond, setIsSecond] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [ans, setAns] = useState<number>(0);
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('omni_scientific_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Evaluate expression safely
  const evaluateMath = (rawExpr: string, radMode: boolean, lastAns: number): { value: number | null; error?: string } => {
    try {
      let sanitized = rawExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, `${Math.PI}`)
        .replace(/\be\b/g, `${Math.E}`)
        .replace(/Ans/g, `${lastAns}`);

      // Handle factorial n!
      sanitized = sanitized.replace(/(\d+(\.\d+)?)!/g, (_, num) => {
        let n = parseInt(num, 10);
        if (n < 0 || n > 150) return 'NaN';
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        return String(f);
      });

      // Handle trigonometric functions with DEG/RAD awareness
      if (!radMode) {
        // DEG mode
        sanitized = sanitized
          .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)')
          .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)')
          .replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)')
          .replace(/asin\(([^)]+)\)/g, '(Math.asin($1) * 180 / Math.PI)')
          .replace(/acos\(([^)]+)\)/g, '(Math.acos($1) * 180 / Math.PI)')
          .replace(/atan\(([^)]+)\)/g, '(Math.atan($1) * 180 / Math.PI)');
      } else {
        // RAD mode
        sanitized = sanitized
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/asin\(/g, 'Math.asin(')
          .replace(/acos\(/g, 'Math.acos(')
          .replace(/atan\(/g, 'Math.atan(');
      }

      // Handle common scientific functions
      sanitized = sanitized
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/cbrt\(/g, 'Math.cbrt(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log10\(/g, 'Math.log10(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/\^/g, '**');

      // Only allow safe characters
      if (/[^0-9+\-*/().,MathPIE\s]/.test(sanitized)) {
        return { value: null, error: 'Invalid Syntax' };
      }

      // Evaluate safely
      const fn = new Function(`"use strict"; return (${sanitized});`);
      const val = fn();
      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        return { value: val };
      }
      return { value: null, error: 'Math Error' };
    } catch {
      return { value: null, error: 'Syntax Error' };
    }
  };

  // Update live preview when expr changes
  useEffect(() => {
    if (!expr || expr === '0') {
      setResultPreview('');
      return;
    }
    const evalRes = evaluateMath(expr, isRad, ans);
    if (evalRes.value !== null) {
      setResultPreview(String(Number(evalRes.value.toFixed(8))));
    } else {
      setResultPreview('');
    }
  }, [expr, isRad, ans]);

  const appendToken = (token: string) => {
    sounds.playClick();
    setExpr(prev => {
      if (prev === '0' || prev === 'Error') {
        return token;
      }
      return prev + token;
    });
  };

  const handleClear = () => {
    sounds.playClick();
    setExpr('0');
    setResultPreview('');
  };

  const handleBackspace = () => {
    sounds.playClick();
    setExpr(prev => {
      if (prev.length <= 1 || prev === 'Error') return '0';
      return prev.slice(0, -1);
    });
  };

  const handleEqual = () => {
    sounds.playClick();
    const evalRes = evaluateMath(expr, isRad, ans);
    if (evalRes.value !== null) {
      sounds.playSuccess();
      const formatted = String(Number(evalRes.value.toFixed(8)));
      const historyItem = `${expr} = ${formatted}`;
      const newHistory = [historyItem, ...history.slice(0, 24)];
      setHistory(newHistory);
      try {
        localStorage.setItem('omni_scientific_calc_history', JSON.stringify(newHistory));
      } catch {
        // ignore
      }
      setAns(evalRes.value);
      setExpr(formatted);
      setResultPreview('');
    } else {
      sounds.playTone(200, 0.2);
      setExpr('Error');
    }
  };

  // Memory keys
  const handleMemory = (op: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
    sounds.playClick();
    const currentNum = parseFloat(resultPreview || expr) || 0;
    if (op === 'MC') {
      setMemory(0);
    } else if (op === 'MR') {
      appendToken(String(memory));
    } else if (op === 'M+') {
      setMemory(m => m + currentNum);
    } else if (op === 'M-') {
      setMemory(m => m - currentNum);
    } else if (op === 'MS') {
      setMemory(currentNum);
    }
  };

  const handleClearHistory = () => {
    sounds.playClick();
    setHistory([]);
    try {
      localStorage.removeItem('omni_scientific_calc_history');
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-md space-y-4">
        {/* Top Header: RAD/DEG, 2nd, Memory Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { sounds.playClick(); setIsRad(true); }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  isRad ? 'bg-indigo-600 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                RAD
              </button>
              <button
                type="button"
                onClick={() => { sounds.playClick(); setIsRad(false); }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  !isRad ? 'bg-indigo-600 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                DEG
              </button>
            </div>

            <button
              type="button"
              onClick={() => { sounds.playClick(); setIsSecond(!isSecond); }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isSecond
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              2nd
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-zinc-400">
            {memory !== 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                M = {Number(memory.toFixed(4))}
              </span>
            )}
            <span className="text-zinc-400 uppercase tracking-wider text-[10px]">Scientific Pro</span>
          </div>
        </div>

        {/* Display Screen */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 p-4 text-right space-y-1">
          <div className="text-zinc-500 dark:text-zinc-400 font-mono text-sm sm:text-base overflow-x-auto whitespace-nowrap scrollbar-none min-h-[1.5rem]">
            {expr}
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 tabular-nums overflow-x-auto whitespace-nowrap scrollbar-none">
            {resultPreview || expr}
          </div>
        </div>

        {/* Memory Bar */}
        <div className="grid grid-cols-5 gap-1.5 text-xs font-semibold">
          {[
            { label: 'MC', op: 'MC' as const },
            { label: 'MR', op: 'MR' as const },
            { label: 'M+', op: 'M+' as const },
            { label: 'M-', op: 'M-' as const },
            { label: 'MS', op: 'MS' as const },
          ].map(m => (
            <button
              key={m.label}
              type="button"
              onClick={() => handleMemory(m.op)}
              className="py-1.5 rounded-xl border border-zinc-200/80 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Scientific & Standard Keypad Grid */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold">
          {/* Row 1: Sci Functions */}
          <button
            onClick={() => appendToken(isSecond ? 'asin(' : 'sin(')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all"
          >
            {isSecond ? 'sin⁻¹' : 'sin'}
          </button>
          <button
            onClick={() => appendToken(isSecond ? 'acos(' : 'cos(')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all"
          >
            {isSecond ? 'cos⁻¹' : 'cos'}
          </button>
          <button
            onClick={() => appendToken(isSecond ? 'atan(' : 'tan(')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all"
          >
            {isSecond ? 'tan⁻¹' : 'tan'}
          </button>
          <button
            onClick={() => appendToken('(')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all font-mono"
          >
            (
          </button>
          <button
            onClick={() => appendToken(')')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all font-mono"
          >
            )
          </button>

          {/* Row 2: Sci Functions + Constants */}
          <button
            onClick={() => appendToken(isSecond ? 'cbrt(' : 'sqrt(')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all"
          >
            {isSecond ? '∛x' : '√x'}
          </button>
          <button
            onClick={() => appendToken('^')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all"
          >
            xʸ
          </button>
          <button
            onClick={() => appendToken(isSecond ? '10^(' : 'log10(')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all"
          >
            {isSecond ? '10ˣ' : 'log'}
          </button>
          <button
            onClick={() => appendToken(isSecond ? '2.71828^(' : 'ln(')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all"
          >
            {isSecond ? 'eˣ' : 'ln'}
          </button>
          <button
            onClick={() => appendToken('!')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all font-mono"
          >
            x!
          </button>

          {/* Row 3: Clear, Numbers 7 8 9, Divide */}
          <button
            onClick={handleClear}
            className="h-11 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 dark:text-rose-300 font-bold cursor-pointer active:scale-95 transition-all"
          >
            AC
          </button>
          <button
            onClick={() => appendToken('7')}
            className="h-11 rounded-xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold text-base cursor-pointer active:scale-95 transition-all shadow-2xs"
          >
            7
          </button>
          <button
            onClick={() => appendToken('8')}
            className="h-11 rounded-xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold text-base cursor-pointer active:scale-95 transition-all shadow-2xs"
          >
            8
          </button>
          <button
            onClick={() => appendToken('9')}
            className="h-11 rounded-xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold text-base cursor-pointer active:scale-95 transition-all shadow-2xs"
          >
            9
          </button>
          <button
            onClick={() => appendToken('÷')}
            className="h-11 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 font-bold text-base cursor-pointer active:scale-95 transition-all"
          >
            ÷
          </button>

          {/* Row 4: Constants, Numbers 4 5 6, Multiply */}
          <button
            onClick={() => appendToken('π')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all font-serif"
          >
            π
          </button>
          <button
            onClick={() => appendToken('4')}
            className="h-11 rounded-xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold text-base cursor-pointer active:scale-95 transition-all shadow-2xs"
          >
            4
          </button>
          <button
            onClick={() => appendToken('5')}
            className="h-11 rounded-xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold text-base cursor-pointer active:scale-95 transition-all shadow-2xs"
          >
            5
          </button>
          <button
            onClick={() => appendToken('6')}
            className="h-11 rounded-xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold text-base cursor-pointer active:scale-95 transition-all shadow-2xs"
          >
            6
          </button>
          <button
            onClick={() => appendToken('×')}
            className="h-11 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 font-bold text-base cursor-pointer active:scale-95 transition-all"
          >
            ×
          </button>

          {/* Row 5: Constant e, Numbers 1 2 3, Subtract */}
          <button
            onClick={() => appendToken('e')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all font-serif"
          >
            e
          </button>
          <button
            onClick={() => appendToken('1')}
            className="h-11 rounded-xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold text-base cursor-pointer active:scale-95 transition-all shadow-2xs"
          >
            1
          </button>
          <button
            onClick={() => appendToken('2')}
            className="h-11 rounded-xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold text-base cursor-pointer active:scale-95 transition-all shadow-2xs"
          >
            2
          </button>
          <button
            onClick={() => appendToken('3')}
            className="h-11 rounded-xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold text-base cursor-pointer active:scale-95 transition-all shadow-2xs"
          >
            3
          </button>
          <button
            onClick={() => appendToken('-')}
            className="h-11 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 font-bold text-base cursor-pointer active:scale-95 transition-all"
          >
            −
          </button>

          {/* Row 6: Ans, Number 0, Decimal, Backspace, Add */}
          <button
            onClick={() => appendToken('Ans')}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold cursor-pointer active:scale-95 transition-all"
          >
            Ans
          </button>
          <button
            onClick={() => appendToken('0')}
            className="h-11 rounded-xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold text-base cursor-pointer active:scale-95 transition-all shadow-2xs"
          >
            0
          </button>
          <button
            onClick={() => appendToken('.')}
            className="h-11 rounded-xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold text-base cursor-pointer active:scale-95 transition-all shadow-2xs"
          >
            .
          </button>
          <button
            onClick={handleBackspace}
            className="h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
            title="Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={() => appendToken('+')}
            className="h-11 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 font-bold text-base cursor-pointer active:scale-95 transition-all"
          >
            +
          </button>
        </div>

        {/* Big Equal Action Button */}
        <button
          type="button"
          onClick={handleEqual}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-md hover:shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>=</span>
          <span className="text-xs font-semibold opacity-80">Calculate Result</span>
        </button>
      </div>

      {/* History Tape */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Calculation Tape History
            </span>
            {history.length > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold">
                {history.length}
              </span>
            )}
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-400 font-medium">
            Calculations and answers will be saved here automatically.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  sounds.playClick();
                  const parts = item.split(' = ');
                  if (parts[1]) setExpr(parts[1]);
                }}
                className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-850 font-mono text-xs text-zinc-700 dark:text-zinc-300 flex items-center justify-between cursor-pointer group transition-all"
                title="Click to reuse answer"
              >
                <span className="truncate">{item}</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 font-sans font-bold shrink-0 ml-2">
                  Reuse
                </span>
              </div>
            ))}
          </div>
        )}
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

// 8. Time Duration Calculator (With AM/PM and Auto-Vanish Default)
const DurationCalcView: React.FC = () => {
  const [calcMode, setCalcMode] = useState<'clock' | 'span'>('clock');

  // Clock Mode (12-hour with AM/PM)
  const [h1, setH1] = useState<string>('09');
  const [m1, setM1] = useState<string>('00');
  const [ampm1, setAmpm1] = useState<'AM' | 'PM'>('AM');

  const [h2, setH2] = useState<string>('05');
  const [m2, setM2] = useState<string>('30');
  const [ampm2, setAmpm2] = useState<'AM' | 'PM'>('PM');

  // Span Mode (Hours & Minutes arithmetic)
  const [spanH1, setSpanH1] = useState<string>('2');
  const [spanM1, setSpanM1] = useState<string>('45');
  const [spanH2, setSpanH2] = useState<string>('3');
  const [spanM2, setSpanM2] = useState<string>('30');

  // Helper for auto-vanish default
  const handleAutoClear = (e: React.FocusEvent<HTMLInputElement>, currentVal: string, setter: (val: string) => void) => {
    if (['0', '00', '09', '05', '2', '3', '30', '45'].includes(currentVal)) {
      setter('');
    }
  };

  // Calculate 12-hour AM/PM clock difference
  let elapsedMinutes = 0;
  if (calcMode === 'clock') {
    let hour1 = parseInt(h1, 10) || 0;
    const min1 = parseInt(m1, 10) || 0;
    if (ampm1 === 'PM' && hour1 < 12) hour1 += 12;
    if (ampm1 === 'AM' && hour1 === 12) hour1 = 0;

    let hour2 = parseInt(h2, 10) || 0;
    const min2 = parseInt(m2, 10) || 0;
    if (ampm2 === 'PM' && hour2 < 12) hour2 += 12;
    if (ampm2 === 'AM' && hour2 === 12) hour2 = 0;

    const totalMin1 = hour1 * 60 + min1;
    const totalMin2 = hour2 * 60 + min2;

    elapsedMinutes = totalMin2 - totalMin1;
    if (elapsedMinutes < 0) {
      elapsedMinutes += 24 * 60; // Overnight next day
    }
  }

  const clockHrs = Math.floor(elapsedMinutes / 60);
  const clockMins = elapsedMinutes % 60;
  const clockDecimal = (elapsedMinutes / 60).toFixed(2);
  const clockSeconds = elapsedMinutes * 60;

  // Span Mode calculations
  const totalMinSpan = ((parseInt(spanH1, 10) || 0) * 60 + (parseInt(spanM1, 10) || 0)) +
                       ((parseInt(spanH2, 10) || 0) * 60 + (parseInt(spanM2, 10) || 0));
  const diffMinSpan = Math.abs(((parseInt(spanH1, 10) || 0) * 60 + (parseInt(spanM1, 10) || 0)) -
                               ((parseInt(spanH2, 10) || 0) * 60 + (parseInt(spanM2, 10) || 0)));

  return (
    <div className="max-w-xl mx-auto rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-6 shadow-xs">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Time Duration Calculator
          </h2>
        </div>
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => { sounds.playClick(); setCalcMode('clock'); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              calcMode === 'clock'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Clock Times (AM/PM)
          </button>
          <button
            onClick={() => { sounds.playClick(); setCalcMode('span'); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              calcMode === 'span'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Hours + Mins Math
          </button>
        </div>
      </div>

      {calcMode === 'clock' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Time with AM/PM */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block">
                Start Time (Time 1)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={h1}
                  onFocus={e => handleAutoClear(e, h1, setH1)}
                  onBlur={() => { if (!h1) setH1('09'); }}
                  onChange={e => setH1(e.target.value)}
                  className="w-16 text-center border border-zinc-300 dark:border-zinc-700 rounded-xl py-2 font-mono font-bold text-base bg-white dark:bg-zinc-900"
                  placeholder="09"
                />
                <span className="font-bold text-zinc-400">:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={m1}
                  onFocus={e => handleAutoClear(e, m1, setM1)}
                  onBlur={() => { if (!m1) setM1('00'); }}
                  onChange={e => setM1(e.target.value)}
                  className="w-16 text-center border border-zinc-300 dark:border-zinc-700 rounded-xl py-2 font-mono font-bold text-base bg-white dark:bg-zinc-900"
                  placeholder="00"
                />

                {/* AM / PM Toggle */}
                <div className="flex rounded-xl border border-zinc-300 dark:border-zinc-700 overflow-hidden ml-auto">
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setAmpm1('AM'); }}
                    className={`px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      ampm1 === 'AM'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setAmpm1('PM'); }}
                    className={`px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      ampm1 === 'PM'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            {/* End Time with AM/PM */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block">
                End Time (Time 2)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={h2}
                  onFocus={e => handleAutoClear(e, h2, setH2)}
                  onBlur={() => { if (!h2) setH2('05'); }}
                  onChange={e => setH2(e.target.value)}
                  className="w-16 text-center border border-zinc-300 dark:border-zinc-700 rounded-xl py-2 font-mono font-bold text-base bg-white dark:bg-zinc-900"
                  placeholder="05"
                />
                <span className="font-bold text-zinc-400">:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={m2}
                  onFocus={e => handleAutoClear(e, m2, setM2)}
                  onBlur={() => { if (!m2) setM2('30'); }}
                  onChange={e => setM2(e.target.value)}
                  className="w-16 text-center border border-zinc-300 dark:border-zinc-700 rounded-xl py-2 font-mono font-bold text-base bg-white dark:bg-zinc-900"
                  placeholder="30"
                />

                {/* AM / PM Toggle */}
                <div className="flex rounded-xl border border-zinc-300 dark:border-zinc-700 overflow-hidden ml-auto">
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setAmpm2('AM'); }}
                    className={`px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      ampm2 === 'AM'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setAmpm2('PM'); }}
                    className={`px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      ampm2 === 'PM'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label="Elapsed Time" value={`${clockHrs}h ${clockMins}m`} highlight />
            <ResultCard label="Decimal Hours" value={`${clockDecimal} hrs`} />
            <ResultCard label="Total Minutes" value={`${elapsedMinutes.toLocaleString()} min`} />
            <ResultCard label="Total Seconds" value={`${clockSeconds.toLocaleString()} s`} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-2">Duration 1</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={spanH1}
                  onFocus={e => handleAutoClear(e, spanH1, setSpanH1)}
                  onBlur={() => { if (!spanH1) setSpanH1('0'); }}
                  onChange={e => setSpanH1(e.target.value)}
                  className="w-full text-center border rounded-xl py-2 bg-white dark:bg-zinc-950 dark:border-zinc-700 font-mono font-bold"
                  placeholder="Hrs"
                />
                <input
                  type="number"
                  value={spanM1}
                  onFocus={e => handleAutoClear(e, spanM1, setSpanM1)}
                  onBlur={() => { if (!spanM1) setSpanM1('0'); }}
                  onChange={e => setSpanM1(e.target.value)}
                  className="w-full text-center border rounded-xl py-2 bg-white dark:bg-zinc-950 dark:border-zinc-700 font-mono font-bold"
                  placeholder="Min"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-2">Duration 2</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={spanH2}
                  onFocus={e => handleAutoClear(e, spanH2, setSpanH2)}
                  onBlur={() => { if (!spanH2) setSpanH2('0'); }}
                  onChange={e => setSpanH2(e.target.value)}
                  className="w-full text-center border rounded-xl py-2 bg-white dark:bg-zinc-950 dark:border-zinc-700 font-mono font-bold"
                  placeholder="Hrs"
                />
                <input
                  type="number"
                  value={spanM2}
                  onFocus={e => handleAutoClear(e, spanM2, setSpanM2)}
                  onBlur={() => { if (!spanM2) setSpanM2('0'); }}
                  onChange={e => setSpanM2(e.target.value)}
                  className="w-full text-center border rounded-xl py-2 bg-white dark:bg-zinc-950 dark:border-zinc-700 font-mono font-bold"
                  placeholder="Min"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultCard label="Combined Total" value={`${Math.floor(totalMinSpan / 60)}h ${totalMinSpan % 60}m`} highlight />
            <ResultCard label="Difference" value={`${Math.floor(diffMinSpan / 60)}h ${diffMinSpan % 60}m`} />
          </div>
        </div>
      )}
    </div>
  );
};

// 9. Age Calculator (Detailed Weeks, Months, Minutes, Seconds + Compare Person Option)
const AgeCalcView: React.FC = () => {
  const [birthDate, setBirthDate] = useState('2000-01-15');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareBirthDate, setCompareBirthDate] = useState('1998-05-20');

  // Handle auto vanish on focus for date inputs
  const handleDateFocus = (e: React.FocusEvent<HTMLInputElement>, current: string, setter: (val: string) => void) => {
    if (current === '2000-01-15' || current === '1998-05-20') {
      setter('');
    }
  };

  const calculateAgeDetails = (dateStr: string) => {
    if (!dateStr) return null;
    const bDate = new Date(dateStr);
    if (isNaN(bDate.getTime())) return null;

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

    const diffMs = now.getTime() - bDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);

    // Next birthday countdown
    const nextBirthday = new Date(now.getFullYear(), bDate.getMonth(), bDate.getDate());
    if (nextBirthday < now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    const daysUntilNext = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const dayOfWeek = bDate.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      daysUntilNext,
      dayOfWeek,
      birthTime: bDate.getTime(),
    };
  };

  const person1 = calculateAgeDetails(birthDate);
  const person2 = calculateAgeDetails(compareBirthDate);

  // Compare diff
  let compareDiff = null;
  if (isCompareMode && person1 && person2) {
    const older = person1.birthTime < person2.birthTime ? 'Person 1' : 'Person 2';
    const msDiff = Math.abs(person1.birthTime - person2.birthTime);
    const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    const yearsDiff = (daysDiff / 365.25).toFixed(1);

    compareDiff = {
      older,
      daysDiff,
      yearsDiff,
    };
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Person 1 Date of Birth
          </label>
          <button
            onClick={() => { sounds.playClick(); setIsCompareMode(prev => !prev); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isCompareMode
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{isCompareMode ? 'Comparing with Person 2' : 'Compare with Another Person'}</span>
          </button>
        </div>

        <input
          type="date"
          value={birthDate}
          onFocus={e => handleDateFocus(e, birthDate, setBirthDate)}
          onBlur={() => { if (!birthDate) setBirthDate('2000-01-15'); }}
          onChange={e => setBirthDate(e.target.value)}
          className="w-full rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-base font-bold"
        />

        {/* Person 2 Date for Comparison */}
        {isCompareMode && (
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2 animate-in fade-in">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Person 2 Date of Birth
            </label>
            <input
              type="date"
              value={compareBirthDate}
              onFocus={e => handleDateFocus(e, compareBirthDate, setCompareBirthDate)}
              onBlur={() => { if (!compareBirthDate) setCompareBirthDate('1998-05-20'); }}
              onChange={e => setCompareBirthDate(e.target.value)}
              className="w-full rounded-2xl border border-indigo-300 dark:border-indigo-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-base font-bold"
            />
          </div>
        )}
      </div>

      {/* Comparison Result Banner */}
      {isCompareMode && compareDiff && (
        <div className="p-4 sm:p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 text-indigo-900 dark:text-indigo-100 space-y-2 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-extrabold text-sm">Age Comparison Analysis</h4>
          </div>
          <p className="text-xs leading-relaxed">
            <strong>{compareDiff.older}</strong> is older by <strong>{compareDiff.yearsDiff} years</strong> ({compareDiff.daysDiff.toLocaleString()} days difference).
          </p>
        </div>
      )}

      {/* Main Age Stats Breakdown */}
      {person1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultCard
              label="Exact Age"
              value={`${person1.years} yrs, ${person1.months} mos`}
              subtext={`${person1.days} days`}
              highlight
            />
            <ResultCard label="Born on a" value={person1.dayOfWeek} />
            <ResultCard label="Next Birthday In" value={`${person1.daysUntilNext} days`} />
          </div>

          <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Total Lifetime Elapsed Units
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">Total Months</span>
                <span className="font-mono font-bold text-base text-zinc-900 dark:text-zinc-100">{person1.totalMonths.toLocaleString()} mos</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">Total Weeks</span>
                <span className="font-mono font-bold text-base text-zinc-900 dark:text-zinc-100">{person1.totalWeeks.toLocaleString()} wks</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">Total Days</span>
                <span className="font-mono font-bold text-base text-zinc-900 dark:text-zinc-100">{person1.totalDays.toLocaleString()} days</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">Total Hours</span>
                <span className="font-mono font-bold text-base text-zinc-900 dark:text-zinc-100">{person1.totalHours.toLocaleString()} hrs</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">Total Minutes</span>
                <span className="font-mono font-bold text-base text-zinc-900 dark:text-zinc-100">{person1.totalMinutes.toLocaleString()} min</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">Total Seconds</span>
                <span className="font-mono font-bold text-base text-indigo-600 dark:text-indigo-400">{person1.totalSeconds.toLocaleString()} s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 10. Discount & Final Price Calculator
const DiscountCalcView: React.FC = () => {
  const [price, setPrice] = useState<number | string>(0);
  const [discountPercent, setDiscountPercent] = useState<number | string>(0);
  const [extraCoupon, setExtraCoupon] = useState<number | string>(0);
  const [taxPercent, setTaxPercent] = useState<number | string>(0);

  const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
  const numDisc = typeof discountPercent === 'number' ? discountPercent : parseFloat(discountPercent) || 0;
  const numCoupon = typeof extraCoupon === 'number' ? extraCoupon : parseFloat(extraCoupon) || 0;
  const numTax = typeof taxPercent === 'number' ? taxPercent : parseFloat(taxPercent) || 0;

  const firstDiscount = (numPrice * numDisc) / 100;
  const afterFirst = numPrice - firstDiscount;
  const secondDiscount = (afterFirst * numCoupon) / 100;
  const afterSecond = afterFirst - secondDiscount;
  const tax = (afterSecond * numTax) / 100;
  const finalPrice = afterSecond + tax;
  const totalSavings = numPrice - afterSecond;

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
            onFocus={() => { if (price === 0 || price === '0') setPrice(''); }}
            onBlur={() => { if (price === '') setPrice(0); }}
            onChange={e => setPrice(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2 font-mono text-base"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Primary Discount (%)</label>
          <input
            type="number"
            value={discountPercent}
            onFocus={() => { if (discountPercent === 0 || discountPercent === '0') setDiscountPercent(''); }}
            onBlur={() => { if (discountPercent === '') setDiscountPercent(0); }}
            onChange={e => setDiscountPercent(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2 font-mono text-base"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Additional Coupon (%)</label>
          <input
            type="number"
            value={extraCoupon}
            onFocus={() => { if (extraCoupon === 0 || extraCoupon === '0') setExtraCoupon(''); }}
            onBlur={() => { if (extraCoupon === '') setExtraCoupon(0); }}
            onChange={e => setExtraCoupon(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2 font-mono text-base"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Sales Tax (%)</label>
          <input
            type="number"
            value={taxPercent}
            onFocus={() => { if (taxPercent === 0 || taxPercent === '0') setTaxPercent(''); }}
            onBlur={() => { if (taxPercent === '') setTaxPercent(0); }}
            onChange={e => setTaxPercent(e.target.value)}
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

// 11. Tip & Bill Split Calculator (With Custom Tip % and Vanishing Default)
const TipCalcView: React.FC = () => {
  const [bill, setBill] = useState<number | string>(0);
  const [tipPercent, setTipPercent] = useState<number | string>(15);
  const [isCustomTip, setIsCustomTip] = useState<boolean>(false);
  const [customTipVal, setCustomTipVal] = useState<string>('18');
  const [people, setPeople] = useState<number>(1);

  const numBill = typeof bill === 'number' ? bill : parseFloat(bill) || 0;
  const activeTip = isCustomTip ? (parseFloat(customTipVal) || 0) : (typeof tipPercent === 'number' ? tipPercent : parseFloat(tipPercent) || 0);

  const tipAmount = (numBill * activeTip) / 100;
  const totalBill = numBill + tipAmount;
  const perPerson = people > 0 ? totalBill / people : totalBill;
  const tipPerPerson = people > 0 ? tipAmount / people : tipAmount;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tip & Bill Splitter</h2>
      </div>

      <div className="rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-zinc-500 mb-1">Bill Amount ($)</label>
          <input
            type="number"
            value={bill}
            onFocus={() => { if (bill === 0 || bill === '0') setBill(''); }}
            onBlur={() => { if (bill === '') setBill(0); }}
            onChange={e => setBill(e.target.value)}
            className="w-full rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 font-mono text-xl font-bold"
            placeholder="0"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
            <span className="font-bold">Tip Percentage</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {activeTip}%
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[10, 15, 18, 20, 25].map(tp => (
              <button
                key={tp}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsCustomTip(false);
                  setTipPercent(tp);
                }}
                className={`py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer border ${
                  !isCustomTip && tipPercent === tp
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                }`}
              >
                {tp}%
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsCustomTip(true);
              }}
              className={`py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer border ${
                isCustomTip
                  ? 'bg-indigo-600 text-white border-transparent shadow-xs'
                  : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              Custom %
            </button>
          </div>

          {/* Custom Tip Input */}
          {isCustomTip && (
            <div className="mt-2.5 flex items-center gap-2 p-2 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 animate-in fade-in">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Enter Custom Tip %:</span>
              <input
                type="number"
                min={0}
                max={100}
                value={customTipVal}
                onFocus={() => { if (customTipVal === '0') setCustomTipVal(''); }}
                onBlur={() => { if (!customTipVal) setCustomTipVal('0'); }}
                onChange={e => setCustomTipVal(e.target.value)}
                className="w-20 px-2 py-1 text-center font-mono font-bold text-xs border rounded-lg bg-white dark:bg-zinc-900"
                placeholder="0"
              />
              <span className="font-bold text-xs text-indigo-600">%</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 mb-1">Split Between Persons</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { sounds.playClick(); setPeople(Math.max(1, people - 1)); }}
              className="w-10 h-10 rounded-xl border bg-zinc-50 dark:bg-zinc-800 font-bold cursor-pointer text-base active:scale-95"
            >
              -
            </button>
            <span className="text-xl font-mono font-bold w-12 text-center">{people}</span>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setPeople(people + 1); }}
              className="w-10 h-10 rounded-xl border bg-zinc-50 dark:bg-zinc-800 font-bold cursor-pointer text-base active:scale-95"
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
