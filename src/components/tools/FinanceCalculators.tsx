import React, { useState, useEffect } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Plus, Trash2, ArrowRight, RefreshCw, Globe, Copy, Check } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const FinanceCalculators: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'loan-emi-calc':
      return <LoanEmiCalcView />;
    case 'simple-interest-calc':
      return <SimpleInterestCalcView />;
    case 'compound-interest-calc':
      return <CompoundInterestCalcView />;
    case 'savings-goal-calc':
      return <SavingsGoalCalcView />;
    case 'profit-loss-calc':
      return <ProfitLossCalcView />;
    case 'investment-roi-calc':
      return <RoiCagrCalcView />;
    case 'salary-calc':
      return <SalaryCalcView />;
    case 'vat-tax-calc':
      return <VatTaxCalcView />;
    case 'currency-converter':
      return <CurrencyConverterView />;
    case 'expense-splitter':
      return <ExpenseSplitterView />;
    case 'budget-calc':
      return <BudgetCalcView />;
    case 'bogo-calc':
      return <BogoCalcView />;
    default:
      return <LoanEmiCalcView />;
  }
};

// 1. EMI / Loan Calculator
const LoanEmiCalcView: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [tenureYears, setTenureYears] = useState(0);

  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let emi = 0;
  if (monthlyRate > 0) {
    emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else {
    emi = loanAmount / (totalMonths || 1);
  }

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">EMI & Loan Terms</h2>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Loan Amount ($)</label>
          <input
            type="number"
            value={loanAmount}
            onChange={e => setLoanAmount(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2.5 font-mono text-base"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Annual Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={e => setInterestRate(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2.5 font-mono text-base"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Tenure (Years)</label>
          <input
            type="number"
            value={tenureYears}
            onChange={e => setTenureYears(parseInt(e.target.value) || 1)}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2.5 font-mono text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Monthly EMI" value={`$${emi.toFixed(2)}`} highlight />
        <ResultCard label="Total Interest" value={`$${totalInterest.toFixed(2)}`} />
        <ResultCard label="Total Payment" value={`$${totalPayment.toFixed(2)}`} />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Principal vs Interest Ratio</h4>
        <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${(loanAmount / (totalPayment || 1)) * 100}%` }}
            className="bg-zinc-900 dark:bg-zinc-100 transition-all"
            title="Principal"
          />
          <div
            style={{ width: `${(totalInterest / (totalPayment || 1)) * 100}%` }}
            className="bg-amber-500 transition-all"
            title="Interest"
          />
        </div>
        <div className="flex justify-between items-center text-xs mt-2 text-zinc-500 font-mono">
          <span>Principal: {((loanAmount / (totalPayment || 1)) * 100).toFixed(1)}%</span>
          <span>Interest: {((totalInterest / (totalPayment || 1)) * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

// 2. Simple Interest Calculator
const SimpleInterestCalcView: React.FC = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(3);

  const interest = (principal * rate * years) / 100;
  const total = principal + interest;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Principal ($)</label>
          <input
            type="number"
            value={principal}
            onChange={e => setPrincipal(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Rate (% / year)</label>
          <input
            type="number"
            value={rate}
            onChange={e => setRate(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Time (Years)</label>
          <input
            type="number"
            value={years}
            onChange={e => setYears(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Accrued" value={`$${total.toFixed(2)}`} highlight />
        <ResultCard label="Total Interest" value={`$${interest.toFixed(2)}`} />
      </div>
    </div>
  );
};

// 3. Compound Interest Calculator
const CompoundInterestCalcView: React.FC = () => {
  const [principal, setPrincipal] = useState(5000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [monthlyDeposit, setMonthlyDeposit] = useState(100);
  const [frequency, setFrequency] = useState(12); // monthly

  const r = rate / 100;
  const n = frequency;
  const t = years;

  // Future value of principal: P * (1 + r/n)^(n*t)
  const fvPrincipal = principal * Math.pow(1 + r / n, n * t);

  // Future value of monthly deposits (ordinary annuity compounded n times per year, monthly payments)
  const totalMonths = t * 12;
  const monthlyR = r / 12;
  const fvDeposits = monthlyR > 0
    ? monthlyDeposit * ((Math.pow(1 + monthlyR, totalMonths) - 1) / monthlyR)
    : monthlyDeposit * totalMonths;

  const totalFutureValue = fvPrincipal + fvDeposits;
  const totalInvested = principal + monthlyDeposit * totalMonths;
  const totalInterestEarned = totalFutureValue - totalInvested;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Initial Principal ($)</label>
          <input
            type="number"
            value={principal}
            onChange={e => setPrincipal(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Monthly Deposit ($)</label>
          <input
            type="number"
            value={monthlyDeposit}
            onChange={e => setMonthlyDeposit(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Annual Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={e => setRate(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Horizon (Years)</label>
          <input
            type="number"
            value={years}
            onChange={e => setYears(parseInt(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Projected Future Value" value={`$${totalFutureValue.toFixed(2)}`} highlight />
        <ResultCard label="Total Principal Invested" value={`$${totalInvested.toFixed(2)}`} />
        <ResultCard label="Total Interest Earned" value={`$${totalInterestEarned.toFixed(2)}`} />
      </div>
    </div>
  );
};

// 4. Savings Goal Calculator
const SavingsGoalCalcView: React.FC = () => {
  const [targetAmount, setTargetAmount] = useState(20000);
  const [currentSavings, setCurrentSavings] = useState(3000);
  const [months, setMonths] = useState(24);
  const [annualRate, setAnnualRate] = useState(4);

  const needed = Math.max(0, targetAmount - currentSavings);
  const monthlyRate = annualRate / 12 / 100;
  let requiredMonthly = needed / (months || 1);

  if (monthlyRate > 0) {
    requiredMonthly = (needed * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Target Savings ($)</label>
          <input
            type="number"
            value={targetAmount}
            onChange={e => setTargetAmount(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Current Balance ($)</label>
          <input
            type="number"
            value={currentSavings}
            onChange={e => setCurrentSavings(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Time Horizon (Months)</label>
          <input
            type="number"
            value={months}
            onChange={e => setMonths(parseInt(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Estimated APY Interest (%)</label>
          <input
            type="number"
            value={annualRate}
            onChange={e => setAnnualRate(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly Saving Needed" value={`$${requiredMonthly.toFixed(2)}`} highlight />
        <ResultCard label="Total Remaining to Save" value={`$${needed.toFixed(2)}`} />
      </div>
    </div>
  );
};

// 5. Profit & Loss & Margin
const ProfitLossCalcView: React.FC = () => {
  const [costPrice, setCostPrice] = useState(70);
  const [sellingPrice, setSellingPrice] = useState(100);

  const profit = sellingPrice - costPrice;
  const marginPercent = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  const markupPercent = costPrice > 0 ? (profit / costPrice) * 100 : 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Cost Price ($)</label>
          <input
            type="number"
            value={costPrice}
            onChange={e => setCostPrice(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Selling Price ($)</label>
          <input
            type="number"
            value={sellingPrice}
            onChange={e => setSellingPrice(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard
          label="Net Profit / Loss"
          value={`$${profit.toFixed(2)}`}
          subtext={profit >= 0 ? 'Profit' : 'Loss'}
          highlight={profit >= 0}
        />
        <ResultCard label="Profit Margin" value={`${marginPercent.toFixed(2)}%`} />
        <ResultCard label="Markup Percentage" value={`${markupPercent.toFixed(2)}%`} />
      </div>
    </div>
  );
};

// 6. ROI & CAGR Calculator
const RoiCagrCalcView: React.FC = () => {
  const [initialInv, setInitialInv] = useState(10000);
  const [finalVal, setFinalVal] = useState(25000);
  const [years, setYears] = useState(5);

  const gain = finalVal - initialInv;
  const roi = initialInv > 0 ? (gain / initialInv) * 100 : 0;
  const cagr = (initialInv > 0 && years > 0) ? (Math.pow(finalVal / initialInv, 1 / years) - 1) * 100 : 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Initial ($)</label>
          <input
            type="number"
            value={initialInv}
            onChange={e => setInitialInv(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Final ($)</label>
          <input
            type="number"
            value={finalVal}
            onChange={e => setFinalVal(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Years</label>
          <input
            type="number"
            value={years}
            onChange={e => setYears(parseFloat(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Total ROI" value={`${roi.toFixed(2)}%`} highlight />
        <ResultCard label="CAGR (Annual Growth)" value={`${cagr.toFixed(2)}%`} />
        <ResultCard label="Net Total Gain" value={`$${gain.toFixed(2)}`} />
      </div>
    </div>
  );
};

// 7. Salary & Take-Home Calculator
const SalaryCalcView: React.FC = () => {
  const [annualSalary, setAnnualSalary] = useState(75000);
  const [estimatedTax, setEstimatedTax] = useState(22);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);

  const netAnnual = annualSalary * (1 - estimatedTax / 100);
  const monthly = netAnnual / 12;
  const biweekly = netAnnual / 26;
  const weekly = netAnnual / 52;
  const hourly = netAnnual / (52 * hoursPerWeek);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Gross Annual Salary ($)</label>
          <input
            type="number"
            value={annualSalary}
            onChange={e => setAnnualSalary(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Estimated Tax & Deductions (%)</label>
          <input
            type="number"
            value={estimatedTax}
            onChange={e => setEstimatedTax(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Work Hours / Week</label>
          <input
            type="number"
            value={hoursPerWeek}
            onChange={e => setHoursPerWeek(parseInt(e.target.value) || 40)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="Monthly Take-Home" value={`$${monthly.toFixed(2)}`} highlight />
        <ResultCard label="Bi-Weekly" value={`$${biweekly.toFixed(2)}`} />
        <ResultCard label="Weekly" value={`$${weekly.toFixed(2)}`} />
        <ResultCard label="Net Hourly Wage" value={`$${hourly.toFixed(2)}`} />
      </div>
    </div>
  );
};

// 8. VAT & Sales Tax Calculator
const VatTaxCalcView: React.FC = () => {
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [amount, setAmount] = useState(150);
  const [taxRate, setTaxRate] = useState(20);

  let net = 0;
  let tax = 0;
  let gross = 0;

  if (mode === 'add') {
    net = amount;
    tax = (amount * taxRate) / 100;
    gross = net + tax;
  } else {
    gross = amount;
    net = gross / (1 + taxRate / 100);
    tax = gross - net;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-medium">
          <button
            onClick={() => { sounds.playClick(); setMode('add'); }}
            className={`flex-1 py-1.5 rounded-md transition-colors ${mode === 'add' ? 'bg-white dark:bg-zinc-700 shadow-xs font-semibold' : 'text-zinc-500'}`}
          >
            Add Tax (Net → Gross)
          </button>
          <button
            onClick={() => { sounds.playClick(); setMode('remove'); }}
            className={`flex-1 py-1.5 rounded-md transition-colors ${mode === 'remove' ? 'bg-white dark:bg-zinc-700 shadow-xs font-semibold' : 'text-zinc-500'}`}
          >
            Extract Tax (Gross → Net)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">{mode === 'add' ? 'Net Amount ($)' : 'Gross Total ($)'}</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Tax / VAT Rate (%)</label>
            <input
              type="number"
              value={taxRate}
              onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Gross Total" value={`$${gross.toFixed(2)}`} highlight />
        <ResultCard label="Tax Amount" value={`$${tax.toFixed(2)}`} />
        <ResultCard label="Net Amount" value={`$${net.toFixed(2)}`} />
      </div>
    </div>
  );
};

// 9. Real-Time Currency Converter (Live Open Exchange API)
const VERIFIED_FALLBACK_RATES: Record<string, { rate: number; name: string; symbol: string; flag: string }> = {
  USD: { rate: 1.0, name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { rate: 0.922, name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { rate: 0.772, name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  JPY: { rate: 153.25, name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  CAD: { rate: 1.385, name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  AUD: { rate: 1.515, name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  CHF: { rate: 0.865, name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  INR: { rate: 84.15, name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  CNY: { rate: 7.125, name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  SGD: { rate: 1.325, name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  AED: { rate: 3.673, name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  BRL: { rate: 5.75, name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  MXN: { rate: 19.85, name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  KRW: { rate: 1375.0, name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  NZD: { rate: 1.665, name: 'New Zealand Dollar', symbol: '$', flag: '🇳🇿' },
  SEK: { rate: 10.65, name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  NOK: { rate: 10.95, name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  ZAR: { rate: 17.65, name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  TRY: { rate: 34.30, name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  SAR: { rate: 3.75, name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  HKD: { rate: 7.77, name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  THB: { rate: 33.75, name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  IDR: { rate: 15600.0, name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  PLN: { rate: 4.02, name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  ILS: { rate: 3.72, name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
  DKK: { rate: 6.88, name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  MYR: { rate: 4.38, name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  PHP: { rate: 58.20, name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  PKR: { rate: 277.8, name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
  BDT: { rate: 119.5, name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩' },
  EGP: { rate: 49.0, name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  VND: { rate: 25300.0, name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  NGN: { rate: 1650.0, name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
};

const CurrencyConverterView: React.FC = () => {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    Object.entries(VERIFIED_FALLBACK_RATES).forEach(([code, data]) => {
      initial[code] = data.rate;
    });
    return initial;
  });
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Standard Rates');
  const [copied, setCopied] = useState(false);

  // Fetch live exchange rates from Open Exchange API
  const fetchLiveRates = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('Live API unreachable');
      const data = await res.json();
      if (data && data.rates) {
        setRates(prev => ({
          ...prev,
          ...data.rates,
        }));
        setIsLive(true);
        const dateStr = data.time_last_update_utc ? new Date(data.time_last_update_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastUpdated(`Live at ${dateStr}`);
        sounds.playSuccess();
      }
    } catch {
      setIsLive(false);
      setLastUpdated('Offline (Verified Base Rates)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRates();
  }, []);

  const currencies = Object.keys(VERIFIED_FALLBACK_RATES);

  // Exchange calculation relative to USD base
  const fromRate = rates[fromCurr] || VERIFIED_FALLBACK_RATES[fromCurr]?.rate || 1;
  const toRate = rates[toCurr] || VERIFIED_FALLBACK_RATES[toCurr]?.rate || 1;

  // Formula: Amount in USD = Amount / fromRate; Converted Amount = Amount in USD * toRate
  const converted = fromRate > 0 ? (amount / fromRate) * toRate : 0;
  const singleUnitConverted = fromRate > 0 ? (1 / fromRate) * toRate : 0;
  const inverseUnitConverted = toRate > 0 ? (1 / toRate) * fromRate : 0;

  const handleSwap = () => {
    sounds.playClick();
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  const copyResult = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(`${converted.toFixed(2)} ${toCurr}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const presetAmounts = [10, 50, 100, 500, 1000, 5000];

  const popularMatrix = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR', 'AED', 'SGD', 'CNY'].filter(c => c !== fromCurr);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Live Status Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            Global Currency Exchange
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isLive
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
            {isLive ? 'Live Open API' : 'Cached Baseline'}
          </span>
        </div>

        <button
          onClick={fetchLiveRates}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer active:scale-95 transition-all shadow-2xs"
          title="Refresh live exchange rates"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
          <span className="hidden sm:inline">{loading ? 'Fetching...' : 'Update Rates'}</span>
        </button>
      </div>

      {/* Main Converter Card */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 dark:border-zinc-800/90 dark:bg-zinc-900 space-y-5 shadow-xs">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Amount to Convert
            </label>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {VERIFIED_FALLBACK_RATES[fromCurr]?.symbol} {fromCurr}
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 font-mono text-2xl font-bold bg-zinc-50/50 dark:bg-zinc-950/60 focus:outline-indigo-500 text-zinc-950 dark:text-zinc-50 transition-all"
            />
          </div>

          {/* Quick Amount Presets */}
          <div className="flex gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
            {presetAmounts.map(val => (
              <button
                key={val}
                onClick={() => {
                  sounds.playClick();
                  setAmount(val);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  amount === val
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-400'
                }`}
              >
                ${val.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Currency Pair Selectors with Swap */}
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 sm:gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              From Currency
            </label>
            <select
              value={fromCurr}
              onChange={e => {
                sounds.playClick();
                setFromCurr(e.target.value);
              }}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 bg-white dark:bg-zinc-950 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-50 focus:outline-indigo-500 cursor-pointer"
            >
              {currencies.map(code => {
                const info = VERIFIED_FALLBACK_RATES[code];
                return (
                  <option key={code} value={code}>
                    {info.flag} {code} - {info.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex justify-center pt-5">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 active:scale-90 transition-all cursor-pointer shadow-2xs text-zinc-700 dark:text-zinc-300"
              title="Swap currencies"
              aria-label="Swap currencies"
            >
              ⇄
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              To Currency
            </label>
            <select
              value={toCurr}
              onChange={e => {
                sounds.playClick();
                setToCurr(e.target.value);
              }}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 bg-white dark:bg-zinc-950 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-50 focus:outline-indigo-500 cursor-pointer"
            >
              {currencies.map(code => {
                const info = VERIFIED_FALLBACK_RATES[code];
                return (
                  <option key={code} value={code}>
                    {info.flag} {code} - {info.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Result Card with 1-Click Copy and Inverse Rate */}
      <div className="relative">
        <ResultCard
          label="Accurate Converted Value"
          value={`${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${toCurr}`}
          subtext={`1 ${fromCurr} = ${singleUnitConverted.toFixed(4)} ${toCurr} · 1 ${toCurr} = ${inverseUnitConverted.toFixed(4)} ${fromCurr}`}
          highlight
        />
        <button
          onClick={copyResult}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 cursor-pointer active:scale-90 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
          title="Copy converted sum"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Live Popular Rates Matrix for Selected Base Currency */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
          <span>Global Matrix: 1 {fromCurr} Equals</span>
          <span className="text-[10px] lowercase font-normal">{lastUpdated}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {popularMatrix.map(code => {
            const targetRate = rates[code] || VERIFIED_FALLBACK_RATES[code]?.rate || 1;
            const singleVal = fromRate > 0 ? (1 / fromRate) * targetRate : 0;
            const info = VERIFIED_FALLBACK_RATES[code];
            return (
              <button
                key={code}
                onClick={() => {
                  sounds.playClick();
                  setToCurr(code);
                }}
                className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/70 hover:bg-indigo-50/60 dark:bg-zinc-950/60 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {info?.flag} {code}
                  </span>
                  <span className="text-[10px] text-zinc-400">{info?.name?.split(' ')[0]}</span>
                </div>
                <div className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  {singleVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 10. Group Expense Splitter
interface ExpenseItem {
  id: string;
  payer: string;
  amount: number;
  description: string;
}

const ExpenseSplitterView: React.FC = () => {
  const [members, setMembers] = useState<string[]>(['Alice', 'Bob', 'Charlie']);
  const [newMember, setNewMember] = useState('');
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', payer: 'Alice', amount: 120, description: 'Groceries' },
    { id: '2', payer: 'Bob', amount: 60, description: 'Snacks & drinks' },
  ]);

  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [payer, setPayer] = useState('Alice');

  const addExpense = () => {
    if (!amt || parseFloat(amt) <= 0) return;
    sounds.playClick();
    setExpenses([
      ...expenses,
      {
        id: String(Date.now()),
        payer: payer || members[0],
        amount: parseFloat(amt),
        description: desc || 'Expense',
      },
    ]);
    setDesc('');
    setAmt('');
  };

  const removeExpense = (id: string) => {
    sounds.playClick();
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const addMember = () => {
    if (!newMember.trim() || members.includes(newMember.trim())) return;
    sounds.playClick();
    setMembers([...members, newMember.trim()]);
    setNewMember('');
  };

  // Balance calculation
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const sharePerPerson = members.length > 0 ? total / members.length : 0;

  const balances: Record<string, number> = {};
  members.forEach(m => (balances[m] = -sharePerPerson));
  expenses.forEach(e => {
    if (balances[e.payer] !== undefined) {
      balances[e.payer] += e.amount;
    }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* People */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Group Members</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {members.map(m => (
            <span key={m} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-medium">
              {m}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add person name..."
            value={newMember}
            onChange={e => setNewMember(e.target.value)}
            className="flex-1 border rounded-xl px-3 py-1.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
          <button
            onClick={addMember}
            className="px-4 py-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-medium rounded-xl hover:opacity-90"
          >
            Add
          </button>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Record An Expense</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Description (e.g. Dinner)"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="sm:col-span-2 border rounded-xl px-3 py-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
          <input
            type="number"
            placeholder="Amount ($)"
            value={amt}
            onChange={e => setAmt(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
          <select
            value={payer}
            onChange={e => setPayer(e.target.value)}
            className="border rounded-xl px-2 py-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          >
            {members.map(m => (
              <option key={m} value={m}>{m} paid</option>
            ))}
          </select>
        </div>
        <button
          onClick={addExpense}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {/* Expense List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Expenses ({expenses.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {expenses.map(e => (
              <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-xs">
                <div>
                  <span className="font-semibold">{e.payer}</span> paid <span className="font-mono font-bold">${e.amount.toFixed(2)}</span>
                  <p className="text-zinc-500 text-[11px]">{e.description}</p>
                </div>
                <button onClick={() => removeExpense(e.id)} className="text-zinc-400 hover:text-red-500 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Settlements */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Individual Net Balance</h4>
          <div className="space-y-2">
            {members.map(m => {
              const bal = balances[m] || 0;
              return (
                <div key={m} className="flex justify-between items-center text-xs p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950">
                  <span className="font-medium">{m}</span>
                  <span className={`font-mono font-bold ${bal >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                    {bal >= 0 ? `+ $${bal.toFixed(2)}` : `- $${Math.abs(bal).toFixed(2)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// 11. 50/30/20 Budget Calculator
const BudgetCalcView: React.FC = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(4500);

  const needs = monthlyIncome * 0.5;
  const wants = monthlyIncome * 0.3;
  const savings = monthlyIncome * 0.2;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="block text-xs text-zinc-500 mb-1">Monthly After-Tax Income ($)</label>
        <input
          type="number"
          value={monthlyIncome}
          onChange={e => setMonthlyIncome(parseFloat(e.target.value) || 0)}
          className="w-full border rounded-xl p-3 font-mono text-xl bg-white dark:bg-zinc-950 dark:border-zinc-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Needs (50%)" value={`$${needs.toFixed(2)}`} subtext="Rent, food, utilities, health" highlight />
        <ResultCard label="Wants (30%)" value={`$${wants.toFixed(2)}`} subtext="Dining, travel, hobbies" />
        <ResultCard label="Savings & Debt (20%)" value={`$${savings.toFixed(2)}`} subtext="Investments, emergency fund" />
      </div>
    </div>
  );
};

// 12. BOGO & Multi-Buy Calculator
const BogoCalcView: React.FC = () => {
  const [itemPrice, setItemPrice] = useState(30);
  const [buyQty, setBuyQty] = useState(1);
  const [getQty, setGetQty] = useState(1);
  const [discountPercentOnGet, setDiscountPercentOnGet] = useState(100); // 100 = Free

  const totalItems = buyQty + getQty;
  const fullPriceItems = buyQty * itemPrice;
  const discountedItems = getQty * (itemPrice * (1 - discountPercentOnGet / 100));
  const totalPricePaid = fullPriceItems + discountedItems;
  const effectiveUnitPrice = totalItems > 0 ? totalPricePaid / totalItems : itemPrice;
  const totalSaved = totalItems * itemPrice - totalPricePaid;
  const effectiveDiscountPercent = totalItems > 0 ? (totalSaved / (totalItems * itemPrice)) * 100 : 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Individual Price ($)</label>
          <input
            type="number"
            value={itemPrice}
            onChange={e => setItemPrice(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Buy Quantity</label>
          <input
            type="number"
            value={buyQty}
            onChange={e => setBuyQty(parseInt(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Get Quantity</label>
          <input
            type="number"
            value={getQty}
            onChange={e => setGetQty(parseInt(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">% Off on Additional</label>
          <input
            type="number"
            value={discountPercentOnGet}
            onChange={e => setDiscountPercentOnGet(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Effective Unit Price" value={`$${effectiveUnitPrice.toFixed(2)}`} highlight />
        <ResultCard label="Effective Discount" value={`${effectiveDiscountPercent.toFixed(1)}%`} />
        <ResultCard label="Total Saved" value={`$${totalSaved.toFixed(2)}`} />
      </div>
    </div>
  );
};
