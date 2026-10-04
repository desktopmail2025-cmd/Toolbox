import React, { useState, useMemo } from 'react';
import {
  Shuffle, ArrowUpDown, Copy, Check, Download, RotateCcw,
  Sparkles, Filter, Hash, Calculator, HelpCircle, ArrowRight,
  Layers, CheckCircle2, ChevronLeft, ChevronRight, Share2
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export const NumberArrangementTool: React.FC = () => {
  // Input settings
  const [inputMode, setInputMode] = useState<'digits' | 'list'>('digits');
  const [inputValue, setInputValue] = useState<string>('1234');
  const [arrangementSize, setArrangementSize] = useState<number>(4);
  const [uniqueOnly, setUniqueOnly] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'generation'>('asc');
  const [filterType, setFilterType] = useState<'all' | 'even' | 'odd' | 'prime' | 'divisible'>('all');
  const [divisor, setDivisor] = useState<number>(3);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Pagination for smooth 60fps rendering
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 60;

  // Quick preset loader
  const loadPreset = (val: string, mode: 'digits' | 'list' = 'digits') => {
    sounds.playClick();
    setInputMode(mode);
    setInputValue(val);
    setCurrentPage(1);
  };

  // Parse elements
  const elements = useMemo(() => {
    if (inputMode === 'digits') {
      const clean = inputValue.replace(/\D/g, '');
      return clean.split('');
    } else {
      return inputValue
        .split(/[,\s]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
  }, [inputValue, inputMode]);

  // Max selectable length
  const n = elements.length;

  // Auto-adjust arrangement size if out of bounds
  React.useEffect(() => {
    if (n > 0 && arrangementSize > n) {
      setArrangementSize(n);
    } else if (n > 0 && arrangementSize <= 0) {
      setArrangementSize(Math.min(n, 4));
    }
  }, [n, arrangementSize]);

  // Deterministic prime checker helper for numbers
  const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  };

  // Compute theoretical count formula
  const analyticsFormula = useMemo(() => {
    if (n === 0) return { formula: '0', count: 0, distinctElements: 0, multisetFrequencies: {} };

    // Count frequencies for multiset permutation formula
    const freqs: Record<string, number> = {};
    elements.forEach(el => {
      freqs[el] = (freqs[el] || 0) + 1;
    });

    const factorial = (num: number): number => {
      let res = 1;
      for (let i = 2; i <= num; i++) res *= i;
      return res;
    };

    const k = Math.min(arrangementSize, n);

    let theoreticalCount = 0;
    let formulaStr = '';

    if (!uniqueOnly) {
      // Positional permutations P(n, k) = n! / (n - k)!
      const num = factorial(n);
      const den = factorial(n - k);
      theoreticalCount = Math.round(num / den);
      formulaStr = `P(${n}, ${k}) = ${n}! / (${n} - ${k})! = ${theoreticalCount.toLocaleString()}`;
    } else {
      if (k === n) {
        // Full multiset permutation: n! / (f1! * f2! * ...)
        let denom = 1;
        const denomTerms: string[] = [];
        Object.values(freqs).forEach(f => {
          if (f > 1) {
            denom *= factorial(f);
            denomTerms.push(`${f}!`);
          }
        });

        const num = factorial(n);
        theoreticalCount = Math.round(num / denom);
        if (denomTerms.length > 0) {
          formulaStr = `${n}! / (${denomTerms.join(' × ')}) = ${theoreticalCount.toLocaleString()}`;
        } else {
          formulaStr = `${n}! = ${theoreticalCount.toLocaleString()}`;
        }
      } else {
        formulaStr = `Permutations of length ${k} from ${n} elements (Unique Multiset)`;
      }
    }

    return {
      formula: formulaStr,
      count: theoreticalCount,
      distinctElements: Object.keys(freqs).length,
      multisetFrequencies: freqs,
    };
  }, [elements, arrangementSize, uniqueOnly, n]);

  // Generate permutations with safety bounds
  const rawArrangements = useMemo(() => {
    if (elements.length === 0) return [];
    const k = Math.min(arrangementSize, elements.length);
    if (k === 0) return [];

    // Safety limit to prevent memory locks on browser
    const MAX_LIMIT = 40000;
    const results: string[] = [];
    const seen = new Set<string>();

    const used = new Array(elements.length).fill(false);
    const current: string[] = [];

    const backtrack = () => {
      if (results.length >= MAX_LIMIT) return;

      if (current.length === k) {
        const joined = inputMode === 'digits' ? current.join('') : current.join(' ');
        if (uniqueOnly) {
          if (!seen.has(joined)) {
            seen.add(joined);
            results.push(joined);
          }
        } else {
          results.push(joined);
        }
        return;
      }

      for (let i = 0; i < elements.length; i++) {
        if (used[i]) continue;

        // Skip duplicates at same recursion depth if unique only is requested
        if (uniqueOnly && i > 0 && elements[i] === elements[i - 1] && !used[i - 1]) {
          continue;
        }

        used[i] = true;
        current.push(elements[i]);
        backtrack();
        current.pop();
        used[i] = false;
      }
    };

    // Pre-sort elements so backtrack duplicate check works seamlessly
    const sortedElements = [...elements].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    elements.splice(0, elements.length, ...sortedElements);

    backtrack();
    return results;
  }, [elements, arrangementSize, uniqueOnly, inputMode]);

  // Filter and sort results
  const filteredArrangements = useMemo(() => {
    let list = [...rawArrangements];

    // Apply numerical filters
    if (filterType !== 'all') {
      list = list.filter(item => {
        const num = parseInt(item.replace(/\s+/g, ''), 10);
        if (isNaN(num)) return true;

        if (filterType === 'even') return num % 2 === 0;
        if (filterType === 'odd') return num % 2 !== 0;
        if (filterType === 'prime') return isPrime(num);
        if (filterType === 'divisible') return divisor > 0 ? num % divisor === 0 : true;
        return true;
      });
    }

    // Apply search filter
    if (searchFilter.trim()) {
      const q = searchFilter.trim().toLowerCase();
      list = list.filter(item => item.toLowerCase().includes(q));
    }

    // Apply sorting
    if (sortOrder === 'asc') {
      list.sort((a, b) => {
        const numA = Number(a.replace(/\s+/g, ''));
        const numB = Number(b.replace(/\s+/g, ''));
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
      });
    } else if (sortOrder === 'desc') {
      list.sort((a, b) => {
        const numA = Number(a.replace(/\s+/g, ''));
        const numB = Number(b.replace(/\s+/g, ''));
        if (!isNaN(numA) && !isNaN(numB)) return numB - numA;
        return b.localeCompare(a);
      });
    }

    return list;
  }, [rawArrangements, filterType, divisor, searchFilter, sortOrder]);

  // Statistics
  const statistics = useMemo(() => {
    if (filteredArrangements.length === 0) return null;

    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    let validNumbersCount = 0;

    for (const item of filteredArrangements) {
      const num = Number(item.replace(/\s+/g, ''));
      if (!isNaN(num)) {
        if (num < min) min = num;
        if (num > max) max = num;
        sum += num;
        validNumbersCount++;
      }
    }

    if (validNumbersCount === 0) return null;

    return {
      min,
      max,
      sum,
      average: sum / validNumbersCount,
      validNumbersCount,
    };
  }, [filteredArrangements]);

  // Paginated items
  const totalPages = Math.max(1, Math.ceil(filteredArrangements.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArrangements.slice(start, start + itemsPerPage);
  }, [filteredArrangements, currentPage, itemsPerPage]);

  const handleCopySingle = (text: string, index: number) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleCopyAll = () => {
    sounds.playClick();
    const formatted = filteredArrangements.join('\n');
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadTxt = () => {
    sounds.playClick();
    const content = [
      `OmniToolbox — Number Arrangement Results`,
      `Input: ${inputValue} (${inputMode} mode)`,
      `Arrangement Length: ${arrangementSize}`,
      `Total Arrangements: ${filteredArrangements.length}`,
      `Generated: ${new Date().toLocaleString()}`,
      `------------------------------------------`,
      ...filteredArrangements.map((item, i) => `#${i + 1}: ${item}`),
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `omnitoolbox-number-arrangements-${inputValue.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Tool Introduction & Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-1">
            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
              <Shuffle className="w-3.5 h-3.5" />
              Combinatorics & Permutations
            </span>
            <span aria-hidden="true">·</span>
            <span>Step-by-Step Arrangement Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Number Arrangement
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Rearrange numbers and digits in every possible way with permutations, duplicates handling, ordering, length slicing, and mathematical breakdown.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-zinc-400">Presets:</span>
          <button
            onClick={() => loadPreset('123', 'digits')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer active:scale-95"
          >
            123 (6 Ways)
          </button>
          <button
            onClick={() => loadPreset('1123', 'digits')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer active:scale-95"
          >
            1123 (Multiset)
          </button>
          <button
            onClick={() => loadPreset('2026', 'digits')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer active:scale-95"
          >
            2026 Year
          </button>
          <button
            onClick={() => loadPreset('5, 10, 15, 20', 'list')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer active:scale-95"
          >
            Multi-digit List
          </button>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs space-y-6">
        {/* Input Mode Selector */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold">
            <button
              onClick={() => {
                sounds.playClick();
                setInputMode('digits');
                if (inputValue.includes(',')) setInputValue('1234');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                inputMode === 'digits'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Digits Mode (e.g. 1234)
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setInputMode('list');
                if (!inputValue.includes(',')) setInputValue('10, 20, 30');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                inputMode === 'list'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              List of Numbers (e.g. 7, 14, 21)
            </button>
          </div>

          {/* Unique Arrangements Toggle */}
          <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uniqueOnly}
              onChange={e => {
                sounds.playClick();
                setUniqueOnly(e.target.checked);
                setCurrentPage(1);
              }}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 rounded-sm"
            />
            <span>Unique Arrangements Only (Deduplicate)</span>
          </label>
        </div>

        {/* Primary Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main Input Text */}
          <div className="md:col-span-8 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              {inputMode === 'digits' ? 'Enter Digits or Number to Rearrange' : 'Enter Numbers (comma or space separated)'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={e => {
                  setInputValue(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={inputMode === 'digits' ? 'e.g. 12345' : 'e.g. 3, 9, 27, 81'}
                className="w-full px-4 py-3 text-lg font-mono font-bold rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-hidden text-zinc-900 dark:text-zinc-100"
              />
              <span className="absolute right-3.5 top-3.5 text-xs font-mono font-semibold text-zinc-400">
                {n} items
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {inputMode === 'digits'
                ? 'Rearranges each individual digit into every possible sequence.'
                : 'Treats each comma-separated value as a unit and generates full permutations.'}
            </p>
          </div>

          {/* Arrangement Length Slider (k of n) */}
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
              <span>Arrangement Length (k):</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                {Math.min(arrangementSize, n)} of {n}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={Math.max(1, n)}
              value={Math.min(arrangementSize, n)}
              onChange={e => {
                sounds.playClick();
                setArrangementSize(parseInt(e.target.value, 10));
                setCurrentPage(1);
              }}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>k = 1</span>
              <span>k = {n} (All)</span>
            </div>
          </div>
        </div>

        {/* Analytics & Formula Callout */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-indigo-950 dark:text-indigo-200">
              <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Theoretical Formula:</span>
              <span className="font-mono bg-white/80 dark:bg-zinc-900/80 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                {analyticsFormula.formula}
              </span>
            </div>
            <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80">
              Distinct items: {analyticsFormula.distinctElements} • Total theoretical arrangements: {analyticsFormula.count.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 block">Generated Count</span>
              <span className="text-lg font-black font-mono text-indigo-950 dark:text-indigo-100">
                {filteredArrangements.length.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Sort & Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Sort Order */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Sort Ordering</label>
            <select
              value={sortOrder}
              onChange={e => {
                sounds.playClick();
                setSortOrder(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200"
            >
              <option value="asc">Ascending (Smallest First)</option>
              <option value="desc">Descending (Largest First)</option>
              <option value="generation">Permutation Order</option>
            </select>
          </div>

          {/* Numerical Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Number Filter</label>
            <select
              value={filterType}
              onChange={e => {
                sounds.playClick();
                setFilterType(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200"
            >
              <option value="all">All Arrangements</option>
              <option value="even">Even Numbers Only</option>
              <option value="odd">Odd Numbers Only</option>
              <option value="prime">Prime Numbers Only</option>
              <option value="divisible">Divisible by X</option>
            </select>
          </div>

          {/* Divisor input if divisible selected */}
          {filterType === 'divisible' ? (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Divisible By (X)</label>
              <input
                type="number"
                min={1}
                max={999}
                value={divisor}
                onChange={e => {
                  setDivisor(Math.max(1, parseInt(e.target.value, 10) || 1));
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Search in Results</label>
              <input
                type="text"
                placeholder="Filter sequence..."
                value={searchFilter}
                onChange={e => {
                  setSearchFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200"
              />
            </div>
          )}

          {/* Actions: Copy All & Export TXT */}
          <div className="space-y-1 sm:col-span-2 lg:col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Export & Copy</label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAll}
                disabled={filteredArrangements.length === 0}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                title="Copy all arrangements to clipboard"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-indigo-500" />}
                <span>{copiedAll ? 'Copied!' : 'Copy All'}</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                disabled={filteredArrangements.length === 0}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-xs disabled:opacity-50"
                title="Download results as text file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Numerical Statistics Bar */}
      {statistics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800">
            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Smallest Formed</span>
            <span className="text-base font-black font-mono text-zinc-900 dark:text-zinc-100">
              {statistics.min.toLocaleString()}
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800">
            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Largest Formed</span>
            <span className="text-base font-black font-mono text-zinc-900 dark:text-zinc-100">
              {statistics.max.toLocaleString()}
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800">
            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Average Value</span>
            <span className="text-base font-black font-mono text-zinc-900 dark:text-zinc-100">
              {statistics.average.toFixed(1)}
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800">
            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Sum of All</span>
            <span className="text-base font-black font-mono text-zinc-900 dark:text-zinc-100 truncate block">
              {statistics.sum.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Results Grid Display */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Arrangements Output</span>
            <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-[11px]">
              {filteredArrangements.length} total
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-400">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setCurrentPage(p => Math.max(1, p - 1));
                  }}
                  disabled={currentPage <= 1}
                  className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                  }}
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {filteredArrangements.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-400 space-y-2">
            <Shuffle className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="font-bold text-zinc-700 dark:text-zinc-300">No arrangements match your current filters</p>
            <p className="text-[11px] text-zinc-400">Try changing the input value, increasing the arrangement length, or resetting filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {paginatedItems.map((item, idx) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + idx;
              const isCopied = copiedIndex === globalIndex;

              return (
                <div
                  key={`${item}-${globalIndex}`}
                  className="group relative flex items-center justify-between p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 hover:bg-white dark:hover:bg-zinc-900 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-2xs"
                >
                  <div className="space-y-0.5 truncate">
                    <span className="text-[10px] font-mono text-zinc-400 block">
                      #{globalIndex + 1}
                    </span>
                    <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight truncate block">
                      {item}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopySingle(item, globalIndex)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
                    title="Copy this arrangement"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentPage(p => Math.max(1, p - 1));
              }}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs font-mono text-zinc-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentPage(p => Math.min(totalPages, p + 1));
              }}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
