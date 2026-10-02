import React, { useState, useMemo } from 'react';
import { sounds } from '../../utils/audio';
import {
  Binary, Copy, Check, Sparkles, Calculator, ListOrdered,
  Shuffle, ArrowRight, BookOpen, Layers, CheckCircle2, AlertCircle
} from 'lucide-react';

export const PerfectPrimeCalculatorView: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>('997');
  const [activeTab, setActiveTab] = useState<'primality' | 'factorization' | 'sieve' | 'goldbach' | 'divisors'>('primality');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Range Sieve states
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(100);

  // Goldbach state
  const [goldbachNum, setGoldbachNum] = useState<number>(100);

  const num = useMemo(() => {
    const parsed = parseInt(inputVal.replace(/,/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  }, [inputVal]);

  // Copy helper
  const copyToClipboard = (text: string, key: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. High-Performance Deterministic Primality Test
  const primalityResult = useMemo(() => {
    if (num <= 1) {
      return {
        isPrime: false,
        reason: `${num} is not prime because prime numbers must be strictly greater than 1.`,
        classification: num < 0 ? 'Negative Integer' : num === 0 ? 'Zero' : 'Unit (Neither Prime nor Composite)',
      };
    }
    if (num === 2 || num === 3) {
      return {
        isPrime: true,
        reason: `${num} is prime. It has exactly two positive divisors: 1 and ${num}.`,
        classification: num === 2 ? 'The Only Even Prime' : 'Smallest Odd Prime',
      };
    }
    if (num % 2 === 0) {
      return {
        isPrime: false,
        reason: `${num} is composite because it is even and divisible by 2 (${num} / 2 = ${num / 2}).`,
        classification: 'Even Composite Number',
      };
    }
    if (num % 3 === 0) {
      return {
        isPrime: false,
        reason: `${num} is composite because the sum of its digits is divisible by 3 (${num} / 3 = ${num / 3}).`,
        classification: 'Odd Composite Number',
      };
    }

    // 6k ± 1 trial division up to sqrt(num)
    const limit = Math.floor(Math.sqrt(num));
    for (let i = 5; i <= limit; i += 6) {
      if (num % i === 0) {
        return {
          isPrime: false,
          reason: `${num} is composite. Divisible by ${i} (${num} = ${i} × ${num / i}).`,
          classification: 'Composite Number',
        };
      }
      if (num % (i + 2) === 0) {
        const factor = i + 2;
        return {
          isPrime: false,
          reason: `${num} is composite. Divisible by ${factor} (${num} = ${factor} × ${num / factor}).`,
          classification: 'Composite Number',
        };
      }
    }

    // Special prime properties
    let specialNote = 'Standard Odd Prime';
    if (isTwinPrime(num)) specialNote = 'Twin Prime (has prime neighbor at ±2)';
    if (isSophieGermain(num)) specialNote = 'Sophie Germain Prime (2p + 1 is also prime)';

    return {
      isPrime: true,
      reason: `${num} is a verified Prime Number. It cannot be formed by multiplying two smaller positive integers.`,
      classification: specialNote,
    };
  }, [num]);

  // Check helper: is twin prime
  function isTwinPrime(p: number): boolean {
    if (p <= 2) return false;
    return testPrime(p - 2) || testPrime(p + 2);
  }

  // Check helper: Sophie Germain prime
  function isSophieGermain(p: number): boolean {
    return testPrime(2 * p + 1);
  }

  // Pure prime test function
  function testPrime(n: number): boolean {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  }

  // Next & Previous Primes
  const neighboringPrimes = useMemo(() => {
    if (num <= 2) return { prev: null, next: 2 };
    // Prev
    let prev: number | null = null;
    for (let p = num - 1; p >= 2; p--) {
      if (testPrime(p)) {
        prev = p;
        break;
      }
    }
    // Next
    let next = num + 1;
    while (!testPrime(next)) {
      next++;
    }
    return { prev, next };
  }, [num]);

  // 2. Prime Factorization & Division Steps
  const factorization = useMemo(() => {
    if (num <= 1) return null;
    let n = num;
    const factors: { prime: number; power: number }[] = [];
    const steps: { current: number; divisor: number; next: number }[] = [];

    // Count factor 2
    let count2 = 0;
    while (n % 2 === 0) {
      steps.push({ current: n, divisor: 2, next: n / 2 });
      count2++;
      n /= 2;
    }
    if (count2 > 0) factors.push({ prime: 2, power: count2 });

    // Odd factors
    let d = 3;
    while (d * d <= n) {
      let count = 0;
      while (n % d === 0) {
        steps.push({ current: n, divisor: d, next: n / d });
        count++;
        n /= d;
      }
      if (count > 0) factors.push({ prime: d, power: count });
      d += 2;
    }
    if (n > 1) {
      steps.push({ current: n, divisor: n, next: 1 });
      factors.push({ prime: n, power: 1 });
    }

    // Canonical representation string: e.g. 2³ × 3² × 5
    const canonical = factors
      .map(f => (f.power === 1 ? `${f.prime}` : `${f.prime}^${f.power}`))
      .join(' × ');

    return { factors, canonical, steps };
  }, [num]);

  // 3. Divisors & Properties
  const divisorsData = useMemo(() => {
    if (num <= 0 || num > 10000000) return null;
    const divs: number[] = [];
    for (let i = 1; i * i <= num; i++) {
      if (num % i === 0) {
        divs.push(i);
        if (i !== num / i) divs.push(num / i);
      }
    }
    divs.sort((a, b) => a - b);
    const sum = divs.reduce((acc, v) => acc + v, 0);
    const properSum = sum - num;
    let abundance = 'Deficient';
    if (properSum === num) abundance = 'Perfect Number';
    else if (properSum > num) abundance = 'Abundant Number';

    return {
      divisors: divs,
      count: divs.length,
      sum,
      properSum,
      abundance,
    };
  }, [num]);

  // 4. Sieve of Eratosthenes Range Generator
  const rangeSieve = useMemo(() => {
    const start = Math.max(2, rangeStart);
    const end = Math.min(10000, rangeEnd);
    if (start > end) return { primes: [], count: 0, sum: 0, density: '0.0' };

    const isP = new Uint8Array(end + 1);
    isP.fill(1);
    isP[0] = 0;
    isP[1] = 0;
    for (let p = 2; p * p <= end; p++) {
      if (isP[p]) {
        for (let i = p * p; i <= end; i += p) {
          isP[i] = 0;
        }
      }
    }

    const primes: number[] = [];
    let sum = 0;
    for (let i = start; i <= end; i++) {
      if (isP[i]) {
        primes.push(i);
        sum += i;
      }
    }

    const totalInRange = end - start + 1;
    const density = totalInRange > 0 ? ((primes.length / totalInRange) * 100).toFixed(1) : '0';

    return { primes, count: primes.length, sum, density };
  }, [rangeStart, rangeEnd]);

  // 5. Goldbach's Conjecture Partition
  const goldbachPairs = useMemo(() => {
    const val = goldbachNum % 2 !== 0 ? goldbachNum - 1 : goldbachNum;
    if (val <= 2) return [];
    const pairs: [number, number][] = [];
    for (let p = 2; p <= val / 2; p++) {
      if (testPrime(p) && testPrime(val - p)) {
        pairs.push([p, val - p]);
      }
    }
    return pairs;
  }, [goldbachNum]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Binary className="w-4 h-4" />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Perfect Prime Number Master Suite
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Deterministic Primality Test, Prime Factorization, Sieve of Eratosthenes, Divisors & Goldbach's Conjecture.
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase text-zinc-400">Presets:</span>
          {[97, 997, 1009, 7919, 65537].map(preset => (
            <button
              key={preset}
              onClick={() => {
                sounds.playClick();
                setInputVal(String(preset));
              }}
              className="px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-bold hover:bg-zinc-100 cursor-pointer shadow-2xs"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
          Enter Integer to Analyze (up to 14 Digits)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Type any positive number (e.g. 997, 1009, 8191)..."
            className="flex-1 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 font-mono text-xl font-bold focus:outline-emerald-500"
          />
          <button
            onClick={() => {
              sounds.playClick();
              // Pick random prime under 5000
              const randomPrimes = [199, 313, 541, 653, 997, 1069, 1777, 2477, 3571, 4999];
              const picked = randomPrimes[Math.floor(Math.random() * randomPrimes.length)];
              setInputVal(String(picked));
            }}
            className="px-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            title="Random Prime"
          >
            <Shuffle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Random</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        {[
          { id: 'primality', label: 'Primality Result', icon: CheckCircle2 },
          { id: 'factorization', label: 'Factor Tree & Exponents', icon: ListOrdered },
          { id: 'divisors', label: 'Divisors & Properties', icon: Layers },
          { id: 'sieve', label: 'Sieve Range Generator', icon: Calculator },
          { id: 'goldbach', label: "Goldbach's Conjecture", icon: Sparkles },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Primality Result */}
      {activeTab === 'primality' && (
        <div className="space-y-4">
          <div
            className={`p-8 rounded-3xl border text-center space-y-3 transition-all ${
              primalityResult.isPrime
                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className={`text-3xl font-black tracking-tight ${primalityResult.isPrime ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                {primalityResult.isPrime ? 'PRIME NUMBER ✨' : 'COMPOSITE NUMBER'}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium opacity-90 max-w-lg mx-auto leading-relaxed">
              {primalityResult.reason}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/70 dark:bg-zinc-800/80 border border-current/20 text-xs font-bold">
              <span>Classification:</span>
              <span className="font-semibold">{primalityResult.classification}</span>
            </div>
          </div>

          {/* Adjacent Primes Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Previous Prime Number
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-bold text-zinc-900 dark:text-zinc-50">
                  {neighboringPrimes.prev !== null ? neighboringPrimes.prev : 'None (Lowest is 2)'}
                </span>
                {neighboringPrimes.prev !== null && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setInputVal(String(neighboringPrimes.prev));
                    }}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Inspect →
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Next Prime Number
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-bold text-zinc-900 dark:text-zinc-50">
                  {neighboringPrimes.next}
                </span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setInputVal(String(neighboringPrimes.next));
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Inspect →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Prime Factorization */}
      {activeTab === 'factorization' && (
        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-5 shadow-2xs">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Canonical Prime Factorization
            </h3>
            {factorization && (
              <button
                onClick={() => copyToClipboard(factorization.canonical, 'fact')}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer"
              >
                {copiedKey === 'fact' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Notation</span>
              </button>
            )}
          </div>

          {factorization ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 block mb-1">Standard Prime Decomposition</span>
                <div className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                  {num} = {factorization.canonical}
                </div>
              </div>

              {/* Step by step division ladder */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Step-by-Step Division Ladder
                </span>
                <div className="space-y-1 font-mono text-xs">
                  {factorization.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/60 flex items-center justify-between"
                    >
                      <span className="text-zinc-600 dark:text-zinc-300">
                        {st.current} ÷ <strong className="text-emerald-600 dark:text-emerald-400">{st.divisor}</strong>
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-50">
                        = {st.next}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-400">Enter a number greater than 1 to see factorization.</p>
          )}
        </div>
      )}

      {/* Tab 3: Divisors & Properties */}
      {activeTab === 'divisors' && (
        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Divisors & Number Theory Metrics
            </h3>
            {divisorsData && (
              <span className="text-xs font-bold text-zinc-500">
                {divisorsData.count} Divisors Total
              </span>
            )}
          </div>

          {divisorsData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Divisor Count d(n)</span>
                  <span className="text-lg font-mono font-bold">{divisorsData.count}</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Divisor Sum σ(n)</span>
                  <span className="text-lg font-mono font-bold">{divisorsData.sum}</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Aliquot Sum s(n)</span>
                  <span className="text-lg font-mono font-bold">{divisorsData.properSum}</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Abundance</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{divisorsData.abundance}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                  All Positive Divisors
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono text-xs">
                  {divisorsData.divisors.map(d => (
                    <span
                      key={d}
                      className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-bold"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-400">Enter a number up to 10,000,000 to display divisors list.</p>
          )}
        </div>
      )}

      {/* Tab 4: Sieve Range Generator */}
      {activeTab === 'sieve' && (
        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Sieve of Eratosthenes Range Generator
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {rangeSieve.count} Primes in Range
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Range Start</label>
              <input
                type="number"
                min="1"
                value={rangeStart}
                onChange={e => setRangeStart(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Range End (max 10,000)</label>
              <input
                type="number"
                max="10000"
                value={rangeEnd}
                onChange={e => setRangeEnd(parseInt(e.target.value) || 100)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Prime Count π</span>
              <span className="text-base font-mono font-bold">{rangeSieve.count}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Sum of Primes</span>
              <span className="text-base font-mono font-bold">{rangeSieve.sum.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Prime Density</span>
              <span className="text-base font-mono font-bold">{rangeSieve.density}%</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono text-xs">
            {rangeSieve.primes.map(p => (
              <span
                key={p}
                onClick={() => {
                  sounds.playClick();
                  setInputVal(String(p));
                  setActiveTab('primality');
                }}
                className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-bold hover:border-emerald-400 hover:text-emerald-600 cursor-pointer transition-colors"
                title="Click to analyze"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Goldbach's Conjecture */}
      {activeTab === 'goldbach' && (
        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Goldbach's Conjecture Partition
              </h3>
              <p className="text-xs text-zinc-400">
                Every even integer greater than 2 can be expressed as the sum of two primes.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {goldbachPairs.length} Partitions
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 mb-1">Even Integer</label>
            <input
              type="number"
              min="4"
              step="2"
              value={goldbachNum}
              onChange={e => setGoldbachNum(parseInt(e.target.value) || 4)}
              className="w-48 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm font-mono font-bold"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {goldbachPairs.map(([p1, p2], idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span className="text-emerald-600 dark:text-emerald-400">{p1}</span>
                <span className="text-zinc-400">+</span>
                <span className="text-emerald-600 dark:text-emerald-400">{p2}</span>
                <span className="text-zinc-400">=</span>
                <span>{goldbachNum}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
