import React, { useState, useEffect } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Plus, Trash2, ArrowRight, RefreshCw, Globe, Copy, Check, Edit2, X, Bookmark, Save } from 'lucide-react';
import { RetirementPlannerView, CryptoMiningCalcView } from './ExtendedUtilities';

interface ToolComponentProps {
  toolId: string;
}

export const FinanceCalculators: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'loan-emi-calc':
      return <LoanEmiCalcView />;
    case 'retirement-planner':
      return <RetirementPlannerView />;
    case 'crypto-mining-calc':
      return <CryptoMiningCalcView />;
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
    case 'freelance-rate-calc':
      return <SalaryFreelanceCalcView />;
    case 'car-lease-buy-calc':
      return <CarLeaseBuyCalcView />;
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

// 7. Salary, Hourly & Freelance Billing Rate Calculator (Unified)
const SalaryFreelanceCalcView: React.FC = () => {
  const [tab, setTab] = useState<'salary' | 'freelance'>('salary');

  // Salary mode state
  const [annualSalary, setAnnualSalary] = useState(75000);
  const [estimatedTax, setEstimatedTax] = useState(22);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);

  // Freelance mode state
  const [desiredAnnualNet, setDesiredAnnualNet] = useState(85000);
  const [annualOverhead, setAnnualOverhead] = useState(12000); // software, hardware, accounting
  const [weeksVacation, setWeeksVacation] = useState(4);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState(25);
  const [taxRateFreelance, setTaxRateFreelance] = useState(28); // self-employment tax
  const [profitMargin, setProfitMargin] = useState(15); // % business buffer

  // Calculations for Salary
  const netAnnual = annualSalary * (1 - estimatedTax / 100);
  const monthly = netAnnual / 12;
  const biweekly = netAnnual / 26;
  const weekly = netAnnual / 52;
  const hourly = hoursPerWeek > 0 ? netAnnual / (52 * hoursPerWeek) : 0;
  const grossHourly = hoursPerWeek > 0 ? annualSalary / (52 * hoursPerWeek) : 0;

  // Calculations for Freelance
  const grossTargetIncome = (desiredAnnualNet / (1 - taxRateFreelance / 100)) + annualOverhead;
  const totalTargetWithMargin = grossTargetIncome * (1 + profitMargin / 100);
  const workingWeeks = Math.max(1, 52 - weeksVacation);
  const annualBillableHours = workingWeeks * billableHoursPerWeek;
  const targetHourlyRate = annualBillableHours > 0 ? totalTargetWithMargin / annualBillableHours : 0;
  const targetDayRate = targetHourlyRate * (billableHoursPerWeek / 5);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Mode Switcher */}
      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl max-w-sm mx-auto">
        <button
          onClick={() => { sounds.playClick(); setTab('salary'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            tab === 'salary'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          💼 Salary ⇄ Hourly Wage
        </button>
        <button
          onClick={() => { sounds.playClick(); setTab('freelance'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            tab === 'freelance'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          ⚡ Freelance Hourly Rate
        </button>
      </div>

      {tab === 'salary' ? (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Gross Annual Salary ($)</label>
              <input
                type="number"
                value={annualSalary}
                onChange={e => setAnnualSalary(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Tax & Deductions (%)</label>
              <input
                type="number"
                value={estimatedTax}
                onChange={e => setEstimatedTax(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Work Hours / Week</label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={e => setHoursPerWeek(parseInt(e.target.value) || 40)}
                className="w-full border rounded-xl p-2.5 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label="Monthly Take-Home" value={`$${monthly.toFixed(2)}`} highlight />
            <ResultCard label="Bi-Weekly Paycheck" value={`$${biweekly.toFixed(2)}`} />
            <ResultCard label="Net Hourly Wage" value={`$${hourly.toFixed(2)}`} />
            <ResultCard label="Gross Hourly Rate" value={`$${grossHourly.toFixed(2)}`} />
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Desired Net Income ($/yr)</label>
              <input
                type="number"
                value={desiredAnnualNet}
                onChange={e => setDesiredAnnualNet(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Annual Business Expenses ($)</label>
              <input
                type="number"
                value={annualOverhead}
                onChange={e => setAnnualOverhead(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Self-Employment Tax (%)</label>
              <input
                type="number"
                value={taxRateFreelance}
                onChange={e => setTaxRateFreelance(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Billable Hours / Week</label>
              <input
                type="number"
                value={billableHoursPerWeek}
                onChange={e => setBillableHoursPerWeek(parseInt(e.target.value) || 20)}
                className="w-full border rounded-xl p-2.5 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
              <span className="text-[10px] text-zinc-400">Excludes admin, emails, marketing</span>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Vacation Weeks / Year</label>
              <input
                type="number"
                value={weeksVacation}
                onChange={e => setWeeksVacation(parseInt(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Profit Buffer / Margin (%)</label>
              <input
                type="number"
                value={profitMargin}
                onChange={e => setProfitMargin(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard label="Recommended Hourly Rate" value={`$${targetHourlyRate.toFixed(2)} / hr`} highlight />
            <ResultCard label="Day Rate (Equiv.)" value={`$${targetDayRate.toFixed(0)} / day`} />
            <ResultCard label="Gross Target Invoiced" value={`$${totalTargetWithMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })} / yr`} />
          </div>
        </div>
      )}
    </div>
  );
};

// Vehicle Lease vs. Buy Calculator
const CarLeaseBuyCalcView: React.FC = () => {
  const [carPrice, setCarPrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(4000);
  const [loanInterestRate, setLoanInterestRate] = useState(6.5);
  const [leaseMonthlyPayment, setLeaseMonthlyPayment] = useState(420);
  const [leaseDownPayment, setLeaseDownPayment] = useState(2500);
  const [termMonths] = useState(36); // standard 3-year term
  const [estimatedResaleValue, setEstimatedResaleValue] = useState(21000); // 60% after 3 yrs

  // Purchase loan calculation
  const loanPrincipal = Math.max(0, carPrice - downPayment);
  const monthlyLoanRate = (loanInterestRate / 100) / 12;
  const loanMonthlyPayment = monthlyLoanRate > 0
    ? (loanPrincipal * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, termMonths)) / (Math.pow(1 + monthlyLoanRate, termMonths) - 1)
    : loanPrincipal / termMonths;

  const totalBuyCost = downPayment + (loanMonthlyPayment * termMonths);
  const netBuyCostAfterEquity = totalBuyCost - estimatedResaleValue;

  // Lease calculation
  const totalLeaseCost = leaseDownPayment + (leaseMonthlyPayment * termMonths);

  const buyIsBetter = netBuyCostAfterEquity < totalLeaseCost;
  const savings = Math.abs(netBuyCostAfterEquity - totalLeaseCost);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Purchase Parameters */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Vehicle Purchase (Buy)
          </h4>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Vehicle Price ($)</label>
            <input
              type="number"
              value={carPrice}
              onChange={e => setCarPrice(parseFloat(e.target.value) || 0)}
              className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Down Payment ($)</label>
            <input
              type="number"
              value={downPayment}
              onChange={e => setDownPayment(parseFloat(e.target.value) || 0)}
              className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Auto Loan Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={loanInterestRate}
              onChange={e => setLoanInterestRate(parseFloat(e.target.value) || 0)}
              className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Estimated 3-Yr Resale / Equity ($)</label>
            <input
              type="number"
              value={estimatedResaleValue}
              onChange={e => setEstimatedResaleValue(parseFloat(e.target.value) || 0)}
              className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
        </div>

        {/* Lease Parameters */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Vehicle Lease
          </h4>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Monthly Lease Payment ($)</label>
            <input
              type="number"
              value={leaseMonthlyPayment}
              onChange={e => setLeaseMonthlyPayment(parseFloat(e.target.value) || 0)}
              className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Lease Down Payment / Drive-Off ($)</label>
            <input
              type="number"
              value={leaseDownPayment}
              onChange={e => setLeaseDownPayment(parseFloat(e.target.value) || 0)}
              className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Lease Tenure (Fixed 36 Months)</label>
            <input
              type="text"
              readOnly
              value="36 Months (3 Years)"
              className="w-full border rounded-xl p-2 font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Comparison Verdict */}
      <div className={`p-4 rounded-2xl border text-center ${
        buyIsBetter
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-900 dark:text-emerald-200'
          : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 text-indigo-900 dark:text-indigo-200'
      }`}>
        <span className="font-bold text-sm block">
          Verdict: {buyIsBetter ? 'Buying is Financially Cheaper' : 'Leasing is Financially Cheaper'}
        </span>
        <span className="text-xs opacity-90">
          After 3 years factoring retained equity, {buyIsBetter ? 'buying' : 'leasing'} saves approx ${savings.toFixed(0)}.
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="Loan Monthly" value={`$${loanMonthlyPayment.toFixed(2)}`} />
        <ResultCard label="Lease Monthly" value={`$${leaseMonthlyPayment.toFixed(2)}`} />
        <ResultCard label="Net 3-Yr Buy Cost" value={`$${netBuyCostAfterEquity.toFixed(0)}`} highlight={buyIsBetter} />
        <ResultCard label="Total 3-Yr Lease Cost" value={`$${totalLeaseCost.toFixed(0)}`} highlight={!buyIsBetter} />
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

  // Fetch live exchange rates directly from primary currency API matching Google Finance / ECB
  const fetchLiveRates = async (base: string = fromCurr) => {
    setLoading(true);
    try {
      // 1. Try fawazahmed0 currency-api (mirrors Google Finance & ECB daily/hourly)
      const res = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base.toLowerCase()}.json`);
      if (!res.ok) throw new Error('CDN unavailable');
      const data = await res.json();
      const rawRates = data[base.toLowerCase()];
      if (rawRates) {
        const uppercaseRates: Record<string, number> = {};
        Object.entries(rawRates).forEach(([k, v]) => {
          uppercaseRates[k.toUpperCase()] = v as number;
        });
        setRates(uppercaseRates);
        setIsLive(true);
        setLastUpdated(`Live (Google/ECB source · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
        sounds.playSuccess();
        return;
      }
    } catch {
      // 2. Fallback to open.er-api.com with base currency
      try {
        const res2 = await fetch(`https://open.er-api.com/v6/latest/${base}`);
        if (!res2.ok) throw new Error('Fallback failed');
        const data2 = await res2.json();
        if (data2 && data2.rates) {
          setRates(data2.rates);
          setIsLive(true);
          setLastUpdated(`Live (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
          sounds.playSuccess();
          return;
        }
      } catch {
        setIsLive(false);
        setLastUpdated('Cached baseline');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRates(fromCurr);
  }, [fromCurr]);

  const currencies = Object.keys(VERIFIED_FALLBACK_RATES);

  // Direct accurate conversion
  const directRate = rates[toCurr] || (rates[toCurr.toLowerCase()] as number) || (VERIFIED_FALLBACK_RATES[toCurr]?.rate / (VERIFIED_FALLBACK_RATES[fromCurr]?.rate || 1)) || 1;
  const converted = amount * directRate;
  const singleUnitConverted = directRate;
  const inverseUnitConverted = directRate > 0 ? 1 / directRate : 0;

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
          onClick={() => fetchLiveRates()}
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
            const singleVal = rates[code] || (rates[code.toLowerCase()] as number) || (VERIFIED_FALLBACK_RATES[code]?.rate / (VERIFIED_FALLBACK_RATES[fromCurr]?.rate || 1)) || 1;
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

  // Edit Expense State (beside divided expenses name holder)
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editAmt, setEditAmt] = useState('');
  const [editPayer, setEditPayer] = useState('');

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
    if (editingExpenseId === id) setEditingExpenseId(null);
  };

  const startEditExpense = (item: ExpenseItem) => {
    sounds.playClick();
    setEditingExpenseId(item.id);
    setEditDesc(item.description);
    setEditAmt(String(item.amount));
    setEditPayer(item.payer);
  };

  const saveEditExpense = (id: string) => {
    const parsedAmt = parseFloat(editAmt);
    if (!parsedAmt || parsedAmt <= 0) return;
    sounds.playClick();
    setExpenses(expenses.map(e => e.id === id ? {
      ...e,
      description: editDesc.trim() || 'Expense',
      amount: parsedAmt,
      payer: editPayer || members[0]
    } : e));
    setEditingExpenseId(null);
  };

  const addMember = () => {
    if (!newMember.trim() || members.includes(newMember.trim())) return;
    sounds.playClick();
    setMembers([...members, newMember.trim()]);
    setNewMember('');
  };

  const removeMember = (name: string) => {
    if (members.length <= 1) return;
    sounds.playClick();
    const updated = members.filter(m => m !== name);
    setMembers(updated);
    if (payer === name && updated.length > 0) {
      setPayer(updated[0]);
    }
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
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Group Members ({members.length})</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {members.map(m => (
            <span key={m} className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-2xs">
              <span>{m}</span>
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(m)}
                  className="text-zinc-400 hover:text-red-500 rounded p-0.5 transition-colors cursor-pointer"
                  title={`Remove ${m}`}
                  aria-label={`Remove ${m}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
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
            className="px-4 py-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-medium rounded-xl hover:opacity-90 cursor-pointer"
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
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {/* Expense List with Edit Button beside each divided expense name holder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Expenses ({expenses.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {expenses.map(e => (
              <div key={e.id} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-xs border border-zinc-100 dark:border-zinc-800/80">
                {editingExpenseId === e.id ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={editDesc}
                        onChange={ev => setEditDesc(ev.target.value)}
                        placeholder="Description"
                        className="px-2 py-1 border rounded-lg bg-white dark:bg-zinc-900 text-xs"
                      />
                      <input
                        type="number"
                        value={editAmt}
                        onChange={ev => setEditAmt(ev.target.value)}
                        placeholder="Amount"
                        className="px-2 py-1 border rounded-lg bg-white dark:bg-zinc-900 text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-1.5">
                      <select
                        value={editPayer}
                        onChange={ev => setEditPayer(ev.target.value)}
                        className="px-2 py-1 border rounded-lg bg-white dark:bg-zinc-900 text-xs flex-1"
                      >
                        {members.map(m => (
                          <option key={m} value={m}>{m} paid</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => saveEditExpense(e.id)}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingExpenseId(null)}
                        className="p-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{e.payer}</span> paid{' '}
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">${e.amount.toFixed(2)}</span>
                      <p className="text-zinc-500 text-[11px] truncate max-w-[170px]">{e.description}</p>
                    </div>
                    {/* Edit button beside the divided expenses name holder! */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEditExpense(e)}
                        className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-md transition-colors cursor-pointer"
                        title="Edit this expense"
                        aria-label="Edit this expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExpense(e.id)}
                        className="text-zinc-400 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
                        title="Delete expense"
                        aria-label="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
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

// 11. 50/30/20 Budget Calculator (With Individual Selection & Custom Input Options)
interface BudgetPreset {
  id: string;
  name: string;
  needs: number;
  wants: number;
  savings: number;
  description: string;
}

const BUDGET_PRESETS: BudgetPreset[] = [
  { id: 'standard', name: '50/30/20 Standard', needs: 50, wants: 30, savings: 20, description: 'Classic balanced formula for sustainable wealth' },
  { id: 'high-cost', name: '60/20/20 High Cost', needs: 60, wants: 20, savings: 20, description: 'Urban areas with high rent and living costs' },
  { id: 'tight-margin', name: '70/20/10 Tight Margin', needs: 70, wants: 20, savings: 10, description: 'Debt paydown or high mandatory expenses' },
  { id: 'simple-80-20', name: '80/20 Simple Plan', needs: 50, wants: 30, savings: 20, description: '80% Living & Lifestyle / 20% Automated Savings' },
  { id: 'fire-saver', name: '40/30/30 FIRE Saver', needs: 40, wants: 30, savings: 30, description: 'Aggressive early retirement accumulation' },
];

const BudgetCalcView: React.FC = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(4500);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('standard');
  const [allocationMode, setAllocationMode] = useState<'preset' | 'custom'>('preset');
  const [needsPct, setNeedsPct] = useState(50);
  const [wantsPct, setWantsPct] = useState(30);
  const [savingsPct, setSavingsPct] = useState(20);

  const totalPct = needsPct + wantsPct + savingsPct;
  const needs = (monthlyIncome * needsPct) / 100;
  const wants = (monthlyIncome * wantsPct) / 100;
  const savings = (monthlyIncome * savingsPct) / 100;

  const handleSelectPreset = (preset: BudgetPreset) => {
    sounds.playClick();
    setSelectedPresetId(preset.id);
    setAllocationMode('preset');
    setNeedsPct(preset.needs);
    setWantsPct(preset.wants);
    setSavingsPct(preset.savings);
  };

  const handleCustomNeeds = (val: number) => {
    setAllocationMode('custom');
    setSelectedPresetId('custom');
    setNeedsPct(Math.max(0, Math.min(100, val)));
  };

  const handleCustomWants = (val: number) => {
    setAllocationMode('custom');
    setSelectedPresetId('custom');
    setWantsPct(Math.max(0, Math.min(100, val)));
  };

  const handleCustomSavings = (val: number) => {
    setAllocationMode('custom');
    setSelectedPresetId('custom');
    setSavingsPct(Math.max(0, Math.min(100, val)));
  };

  const selectedPreset = BUDGET_PRESETS.find(p => p.id === selectedPresetId);

  return (
    <div className="max-w-xl mx-auto space-y-6 select-none">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">
            Monthly After-Tax Income ($)
          </label>
          <input
            type="number"
            value={monthlyIncome}
            onChange={e => setMonthlyIncome(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-3 font-mono text-xl bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>

        {/* Mode Selector: Individual Presets vs Custom Input Option */}
        <div className="flex rounded-xl p-1 bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setAllocationMode('preset');
              if (selectedPreset) {
                setNeedsPct(selectedPreset.needs);
                setWantsPct(selectedPreset.wants);
                setSavingsPct(selectedPreset.savings);
              }
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              allocationMode === 'preset'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Individual Presets Selection
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setAllocationMode('custom');
              setSelectedPresetId('custom');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              allocationMode === 'custom'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Custom Input Option
          </button>
        </div>

        {/* Individual Preset Selection Cards */}
        {allocationMode === 'preset' && (
          <div className="space-y-2.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Select Preset Allocation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BUDGET_PRESETS.map(preset => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:border-indigo-500 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {preset.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {preset.needs}/{preset.wants}/{preset.savings}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Input Option: Individual sliders & number inputs */}
        <div className="space-y-3 pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {allocationMode === 'custom' ? 'Custom Allocation Inputs' : 'Fine-Tune Split'}
            </span>
            <span className={`text-xs font-mono font-bold ${totalPct === 100 ? 'text-emerald-600' : 'text-amber-500'}`}>
              Total: {totalPct}%
            </span>
          </div>

          <div className="space-y-3">
            {/* Needs */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Needs (Essentials)</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{needsPct}% · ${(monthlyIncome * needsPct / 100).toFixed(0)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={needsPct}
                onChange={e => handleCustomNeeds(parseInt(e.target.value) || 0)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Wants */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Wants (Lifestyle)</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{wantsPct}% · ${(monthlyIncome * wantsPct / 100).toFixed(0)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={wantsPct}
                onChange={e => handleCustomWants(parseInt(e.target.value) || 0)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Savings */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Savings & Debt Payoff</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{savingsPct}% · ${(monthlyIncome * savingsPct / 100).toFixed(0)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={savingsPct}
                onChange={e => handleCustomSavings(parseInt(e.target.value) || 0)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Direct Number Inputs */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 mb-0.5">Needs %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={needsPct}
                onChange={e => handleCustomNeeds(parseInt(e.target.value) || 0)}
                className="w-full border rounded-xl p-2 font-mono text-center text-sm font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 mb-0.5">Wants %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={wantsPct}
                onChange={e => handleCustomWants(parseInt(e.target.value) || 0)}
                className="w-full border rounded-xl p-2 font-mono text-center text-sm font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 mb-0.5">Savings %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={savingsPct}
                onChange={e => handleCustomSavings(parseInt(e.target.value) || 0)}
                className="w-full border rounded-xl p-2 font-mono text-center text-sm font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
          </div>

          {totalPct !== 100 && (
            <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl text-center">
              Total allocation is {totalPct}%. (Adjust so percentages sum to 100% for a balanced budget)
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <ResultCard label={`Needs (${needsPct}%)`} value={`$${needs.toFixed(2)}`} subtext="Rent, food, utilities, health" highlight />
        <ResultCard label={`Wants (${wantsPct}%)`} value={`$${wants.toFixed(2)}`} subtext="Dining, travel, hobbies" />
        <ResultCard label={`Savings & Debt (${savingsPct}%)`} value={`$${savings.toFixed(2)}`} subtext="Investments, emergency fund" />
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
