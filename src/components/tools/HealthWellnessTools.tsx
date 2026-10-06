import React, { useState, useEffect, useRef } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import {
  Heart, Droplets, Flame, Moon, Footprints, Play, Pause, RotateCcw,
  Activity, Baby, Wine, Cigarette, HeartPulse, Wind, Download, Check, Copy, Calendar, Sparkles, ShieldAlert,
  Plus, Trash2, Bell, Clock, AlertTriangle, Pill, RefreshCw
} from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const HealthWellnessTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'bmi-calc':
      return <BmiCalcView />;
    case 'water-calc':
      return <WaterCalcView />;
    case 'calorie-tdee-calc':
      return <CalorieTdeeView />;
    case 'sleep-calc':
      return <SleepCycleView />;
    case 'step-distance-calc':
      return <StepDistanceView />;
    case 'hiit-timer':
      return <HiitWorkoutTimerView />;
    case 'pregnancy-due-calc':
    case 'pregnancy-calculator':
      return <PregnancyMilestonesView />;
    case 'bac-estimator':
      return <BacEstimatorView />;
    case 'smoke-free-tracker':
    case 'smoking-cessation':
      return <SmokeFreeSavingsView />;
    case 'target-hr-zones':
    case 'target-heart-rate':
      return <TargetHeartRateView />;
    case 'box-breathing-relaxer':
    case 'breathing-coach':
      return <BoxBreathingRelaxerView />;
    case 'biorhythm-calc':
    case 'biorhythm-chart':
      return <BiorhythmCalculatorView />;
    case 'pill-reminder':
    case 'medicine-reminder':
      return <MedicineReminderView />;
    case 'emergency-ice-card':
      return <EmergencyIceCardView />;
    default:
      return <BmiCalcView />;
  }
};

// 1. BMI & Ideal Weight Calculator
const BmiCalcView: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('70');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');
  const [weightLbs, setWeightLbs] = useState('155');

  let bmi = 0;
  let idealMin = 0;
  let idealMax = 0;

  if (unit === 'metric') {
    const h = parseFloat(heightCm) / 100;
    const w = parseFloat(weightKg);
    if (h > 0 && w > 0) {
      bmi = w / (h * h);
      idealMin = 18.5 * h * h;
      idealMax = 24.9 * h * h;
    }
  } else {
    const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
    const w = parseFloat(weightLbs);
    if (totalInches > 0 && w > 0) {
      bmi = (w / (totalInches * totalInches)) * 703;
      idealMin = (18.5 * totalInches * totalInches) / 703;
      idealMax = (24.9 * totalInches * totalInches) / 703;
    }
  }

  const getBmiStatus = (val: number) => {
    if (val <= 0) return { label: 'Enter details', color: 'text-zinc-500', bar: 0 };
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500', bar: 20 };
    if (val < 25) return { label: 'Normal / Healthy Weight', color: 'text-emerald-500', bar: 50 };
    if (val < 30) return { label: 'Overweight', color: 'text-amber-500', bar: 75 };
    return { label: 'Obese Range', color: 'text-rose-500', bar: 95 };
  };

  const status = getBmiStatus(bmi);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <Heart className="w-5 h-5 text-rose-500" />
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          Body Mass Index (BMI) & Ideal Range
        </h2>
      </div>

      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl max-w-xs">
        <button
          onClick={() => {
            sounds.playClick();
            setUnit('metric');
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            unit === 'metric'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500'
          }`}
        >
          Metric (cm / kg)
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            setUnit('imperial');
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            unit === 'imperial'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500'
          }`}
        >
          Imperial (ft, in / lbs)
        </button>
      </div>

      {unit === 'metric' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={e => setHeightCm(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weightKg}
              onChange={e => setWeightKg(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Height (feet)
            </label>
            <input
              type="number"
              value={heightFt}
              onChange={e => setHeightFt(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Height (inches)
            </label>
            <input
              type="number"
              value={heightIn}
              onChange={e => setHeightIn(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Weight (lbs)
            </label>
            <input
              type="number"
              value={weightLbs}
              onChange={e => setWeightLbs(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
        </div>
      )}

      {/* Visual BMI Gauge */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-5 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Your BMI Score</span>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-mono mt-0.5">
              {bmi > 0 ? bmi.toFixed(1) : '--'}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Classification</span>
            <div className={`text-base font-bold ${status.color} mt-0.5`}>
              {status.label}
            </div>
          </div>
        </div>

        {/* Bar */}
        <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
          <div className="w-[18.5%] bg-blue-400" title="Underweight (<18.5)" />
          <div className="w-[26.5%] bg-emerald-400" title="Normal (18.5 - 24.9)" />
          <div className="w-[25%] bg-amber-400" title="Overweight (25 - 29.9)" />
          <div className="w-[30%] bg-rose-400" title="Obese (>=30)" />
        </div>

        <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
          <span>&lt; 18.5 (Under)</span>
          <span>18.5 - 24.9 (Normal)</span>
          <span>25 - 29.9 (Over)</span>
          <span>30+ (Obese)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          label="Healthy Weight Target"
          value={
            unit === 'metric'
              ? `${idealMin.toFixed(1)} – ${idealMax.toFixed(1)} kg`
              : `${idealMin.toFixed(1)} – ${idealMax.toFixed(1)} lbs`
          }
          subtext="Based on standard WHO recommended BMI 18.5–24.9"
        />
        <ResultCard
          label="Prime Fitness Target"
          value={
            unit === 'metric'
              ? `${((idealMin + idealMax) / 2).toFixed(1)} kg`
              : `${((idealMin + idealMax) / 2).toFixed(1)} lbs`
          }
          subtext="Median target for BMI 21.7"
        />
      </div>
    </div>
  );
};

// 2. Daily Water Intake Calculator
const WaterCalcView: React.FC = () => {
  const [weightKg, setWeightKg] = useState('70');
  const [activityMins, setActivityMins] = useState('45');
  const [climate, setClimate] = useState<'moderate' | 'hot'>('moderate');

  const w = parseFloat(weightKg) || 0;
  const act = parseFloat(activityMins) || 0;

  // Base: ~35ml per kg of body weight + 350ml per 30 mins workout + climate boost
  let baseMl = w * 35;
  let workoutMl = (act / 30) * 350;
  let climateMultiplier = climate === 'hot' ? 1.2 : 1.0;
  let totalMl = Math.round((baseMl + workoutMl) * climateMultiplier);
  let totalLiters = (totalMl / 1000).toFixed(2);
  let glasses = Math.round(totalMl / 250); // 250ml glass

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <Droplets className="w-5 h-5 text-sky-500" />
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          Daily Water Intake & Hydration Guide
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Body Weight (kg)
          </label>
          <input
            type="number"
            value={weightKg}
            onChange={e => setWeightKg(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Daily Exercise (Minutes)
          </label>
          <input
            type="number"
            value={activityMins}
            onChange={e => setActivityMins(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Weather / Climate
          </label>
          <select
            value={climate}
            onChange={e => setClimate(e.target.value as 'moderate' | 'hot')}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          >
            <option value="moderate">Moderate / Indoors</option>
            <option value="hot">Hot / Summer / Humid (+20%)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          label="Recommended Daily Water"
          value={`${totalLiters} Liters`}
          subtext={`Approximately ${totalMl} ml total hydration`}
          highlight
        />
        <ResultCard
          label="Standard Glasses (250ml)"
          value={`${glasses} Glasses`}
          subtext="Evenly spread from morning to evening"
        />
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Suggested Daily Hydration Schedule
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <span className="font-bold text-sky-600 dark:text-sky-400 block">Morning Wake-up</span>
            <span className="text-zinc-600 dark:text-zinc-300">2 glasses (500ml)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <span className="font-bold text-sky-600 dark:text-sky-400 block">Mid-Morning</span>
            <span className="text-zinc-600 dark:text-zinc-300">2 glasses (500ml)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <span className="font-bold text-sky-600 dark:text-sky-400 block">Afternoon / Workout</span>
            <span className="text-zinc-600 dark:text-zinc-300">2–3 glasses</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <span className="font-bold text-sky-600 dark:text-sky-400 block">Evening Dinner</span>
            <span className="text-zinc-600 dark:text-zinc-300">1–2 glasses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Calorie & TDEE Calculator
const CalorieTdeeView: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('28');
  const [weightKg, setWeightKg] = useState('72');
  const [heightCm, setHeightCm] = useState('175');
  const [activity, setActivity] = useState('1.375'); // light

  const a = parseFloat(age) || 25;
  const w = parseFloat(weightKg) || 70;
  const h = parseFloat(heightCm) || 175;
  const mult = parseFloat(activity) || 1.375;

  // Mifflin-St Jeor formula
  let bmr = 10 * w + 6.25 * h - 5 * a + (gender === 'male' ? 5 : -161);
  let tdee = Math.round(bmr * mult);
  let mildDeficit = Math.max(1200, Math.round(tdee - 300));
  let weightLoss = Math.max(1200, Math.round(tdee - 500));
  let muscleGain = Math.round(tdee + 350);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <Flame className="w-5 h-5 text-amber-500" />
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          Calorie & TDEE Daily Energy Needs
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={e => setGender(e.target.value as 'male' | 'female')}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Age (years)
          </label>
          <input
            type="number"
            value={age}
            onChange={e => setAge(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weightKg}
            onChange={e => setWeightKg(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            value={heightCm}
            onChange={e => setHeightCm(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
          Activity Level
        </label>
        <select
          value={activity}
          onChange={e => setActivity(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold"
        >
          <option value="1.2">Sedentary (Desk job, little to no exercise)</option>
          <option value="1.375">Lightly Active (Exercise 1–3 times/week)</option>
          <option value="1.55">Moderately Active (Exercise 3–5 times/week)</option>
          <option value="1.725">Very Active (Intense exercise 6–7 times/week)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          label="Maintenance Calories (TDEE)"
          value={`${tdee} kcal / day`}
          subtext="To maintain current body weight exactly"
          highlight
        />
        <ResultCard
          label="Basal Metabolic Rate (BMR)"
          value={`${Math.round(bmr)} kcal`}
          subtext="Calories burned by body completely at rest"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
          <span className="text-xs font-medium text-zinc-500">Fat Loss Target</span>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {weightLoss} kcal
          </div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">-500 kcal deficit (~0.5kg/wk)</span>
        </div>
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
          <span className="text-xs font-medium text-zinc-500">Mild Deficit</span>
          <div className="text-lg font-bold text-sky-600 dark:text-sky-400 mt-1">
            {mildDeficit} kcal
          </div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">Easy sustainable cut</span>
        </div>
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
          <span className="text-xs font-medium text-zinc-500">Lean Muscle Gain</span>
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">
            {muscleGain} kcal
          </div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">+350 kcal clean surplus</span>
        </div>
      </div>
    </div>
  );
};

// 4. Sleep Cycle & Bedtime Wake-Up Calculator (Professional Suite)
const SleepCycleView: React.FC = () => {
  const [mode, setMode] = useState<'wake' | 'bed' | 'now'>('wake');
  const [targetTime, setTargetTime] = useState('07:00');
  const [copiedTime, setCopiedTime] = useState<string | null>(null);

  // Helper to format minutes past midnight to 12-hr time string
  const formatMinutes = (totalMins: number) => {
    const norm = (totalMins + 1440 * 2) % 1440;
    const h = Math.floor(norm / 60);
    const m = norm % 60;
    return `${h % 12 || 12}:${m < 10 ? '0' : ''}${m} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  // 90 minute sleep cycles + 14 minutes average sleep latency
  const calculateCycles = () => {
    let baseMinutes = 0;
    if (mode === 'now') {
      const now = new Date();
      baseMinutes = now.getHours() * 60 + now.getMinutes();
    } else {
      const [h, m] = targetTime.split(':').map(Number);
      baseMinutes = h * 60 + m;
    }

    if (mode === 'wake') {
      // User specifies when they need to wake up. Calculate when to go to bed.
      // Cycles: 6 cycles (9h), 5 cycles (7.5h), 4 cycles (6h), 3 cycles (4.5h)
      return [6, 5, 4, 3].map(cycles => {
        const sleepDuration = cycles * 90 + 14;
        const bedMinutes = baseMinutes - sleepDuration;
        return {
          cycles,
          hours: (cycles * 1.5).toFixed(1),
          time: formatMinutes(bedMinutes),
          tier: cycles === 5 || cycles === 6 ? 'optimal' : cycles === 4 ? 'moderate' : 'short',
          desc: cycles === 6 ? '9.0 hrs · Peak Muscle & Cognitive Repair' : cycles === 5 ? '7.5 hrs · Recommended for Most Adults' : cycles === 4 ? '6.0 hrs · Minimum Sustainable Buffer' : '4.5 hrs · Short Nap / Emergency Sprint',
        };
      });
    } else {
      // mode === 'bed' or mode === 'now'
      // Calculate optimal wake up times from bedtime
      return [3, 4, 5, 6].map(cycles => {
        const sleepDuration = cycles * 90 + 14;
        const wakeMinutes = baseMinutes + sleepDuration;
        return {
          cycles,
          hours: (cycles * 1.5).toFixed(1),
          time: formatMinutes(wakeMinutes),
          tier: cycles === 5 || cycles === 6 ? 'optimal' : cycles === 4 ? 'moderate' : 'short',
          desc: cycles === 6 ? '9.0 hrs · Complete REM Restoration' : cycles === 5 ? '7.5 hrs · Standard Recommended Awakening' : cycles === 4 ? '6.0 hrs · Light Alarm Awakening' : '4.5 hrs · Fast Power Rest Cycle',
        };
      });
    }
  };

  const results = calculateCycles();

  const handleCopy = (timeStr: string) => {
    sounds.playSuccess();
    navigator.clipboard.writeText(timeStr);
    setCopiedTime(timeStr);
    setTimeout(() => setCopiedTime(null), 1500);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto select-none">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            Sleep Cycle & Optimal Bedtime Planner
          </h2>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">90-min REM Intervals</span>
      </div>

      {/* 3-Way Mode Switcher: Wake At / Bed At / Sleep Right Now */}
      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
        <button
          onClick={() => { sounds.playClick(); setMode('wake'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            mode === 'wake'
              ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          I have to wake up at...
        </button>
        <button
          onClick={() => { sounds.playClick(); setMode('bed'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            mode === 'bed'
              ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          I am going to bed at...
        </button>
        <button
          onClick={() => { sounds.playClick(); setMode('now'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            mode === 'now'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700'
          }`}
        >
          💤 Sleep Right Now!
        </button>
      </div>

      {/* Time Picker (Hidden if Sleep Right Now) */}
      {mode !== 'now' ? (
        <div className="p-5 rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              {mode === 'wake' ? 'Target Wake-Up Time' : 'Planned Bedtime'}
            </label>
            <p className="text-xs text-zinc-400">
              {mode === 'wake'
                ? 'We calculate backward so you wake up between sleep cycles, feeling energized.'
                : 'We calculate forward to identify natural awakening windows.'}
            </p>
          </div>
          <input
            type="time"
            value={targetTime}
            onChange={e => setTargetTime(e.target.value)}
            className="w-full sm:w-44 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-lg font-black font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌙</span>
            <div>
              <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                Heading to bed right now?
              </div>
              <div className="text-[11px] text-indigo-700 dark:text-indigo-300">
                Current Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Factoring 14m latency to fall asleep.
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">Live</span>
        </div>
      )}

      {/* Sleep Results Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            {mode === 'wake' ? 'Suggested Bedtimes (Fall Asleep At):' : 'Suggested Alarm Times (Wake Up Fresh):'}
          </h3>
          <span className="text-[11px] text-zinc-400">Avoid mid-cycle grogginess</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.map((r, i) => {
            const isOptimal = r.tier === 'optimal';
            const isModerate = r.tier === 'moderate';
            return (
              <div
                key={i}
                className={`p-4 rounded-3xl border transition-all shadow-xs ${
                  isOptimal
                    ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20'
                    : isModerate
                    ? 'border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {r.cycles} Cycles · {r.hours} Hours
                  </span>
                  {isOptimal ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      Recommended
                    </span>
                  ) : isModerate ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                      Moderate
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      Short Buffer
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-3xl font-black font-mono text-zinc-950 dark:text-zinc-50 tracking-tight">
                    {r.time}
                  </div>
                  <button
                    onClick={() => handleCopy(r.time)}
                    className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                    title="Copy time"
                  >
                    {copiedTime === r.time ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 font-medium">
                  {r.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Science Explanation Box */}
      <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-xs text-zinc-500 dark:text-zinc-400 space-y-1.5 leading-relaxed">
        <strong className="text-zinc-900 dark:text-zinc-100 block">🧠 Why do sleep cycles matter?</strong>
        <p>
          A full sleep cycle takes approximately 90 minutes, cycling through Light Sleep, Deep Slow-Wave Sleep, and REM Dreaming. Waking up <em>in the middle</em> of a deep cycle triggers <strong>sleep inertia</strong>, causing hours of grogginess. Waking up at the end of a cycle lets you feel fresh and alert immediately.
        </p>
      </div>
    </div>
  );
};

// 5. Steps to Distance & Calories
const StepDistanceView: React.FC = () => {
  const [steps, setSteps] = useState('8000');
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('70');
  const [pace, setPace] = useState<'normal' | 'brisk'>('normal');

  const s = parseFloat(steps) || 0;
  const h = parseFloat(heightCm) || 175;
  const w = parseFloat(weightKg) || 70;

  // Stride length ~ 0.414 * height (cm)
  const strideMeters = (0.414 * h) / 100;
  const totalMeters = s * strideMeters;
  const distanceKm = (totalMeters / 1000).toFixed(2);
  const distanceMiles = (totalMeters / 1609.34).toFixed(2);

  // Calories: MET ~ 3.5 for normal walk, 4.3 for brisk
  // kcal = MET * weight (kg) * hours
  // Speed ~ 4.8 km/h normal, 6.0 km/h brisk
  const speedKmh = pace === 'brisk' ? 6.0 : 4.8;
  const hours = parseFloat(distanceKm) / speedKmh;
  const met = pace === 'brisk' ? 4.3 : 3.5;
  const caloriesBurned = Math.round(met * w * hours);
  const durationMins = Math.round(hours * 60);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <Footprints className="w-5 h-5 text-emerald-500" />
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          Step Count to Distance & Calorie Converter
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Total Steps
          </label>
          <input
            type="number"
            value={steps}
            onChange={e => setSteps(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            value={heightCm}
            onChange={e => setHeightCm(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weightKg}
            onChange={e => setWeightKg(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Pace
          </label>
          <select
            value={pace}
            onChange={e => setPace(e.target.value as 'normal' | 'brisk')}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold"
          >
            <option value="normal">Normal (4.8 km/h)</option>
            <option value="brisk">Brisk (6.0 km/h)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard
          label="Distance Walked"
          value={`${distanceKm} km`}
          subtext={`Equal to ~${distanceMiles} miles`}
          highlight
        />
        <ResultCard
          label="Estimated Calories Burned"
          value={`${caloriesBurned} kcal`}
          subtext="Active expenditure based on weight & pace"
        />
        <ResultCard
          label="Walking Time Elapsed"
          value={`${durationMins} mins`}
          subtext={`Avg stride length: ${(strideMeters * 100).toFixed(0)} cm`}
        />
      </div>
    </div>
  );
};

// 6. HIIT & Workout Interval Timer (Professional Suite)
interface HiitPreset {
  id: string;
  name: string;
  work: number;
  rest: number;
  rounds: number;
  tag: string;
}

const HIIT_PRESETS: HiitPreset[] = [
  { id: 'tabata', name: 'Tabata Standard', work: 20, rest: 10, rounds: 8, tag: '4 min · High Burn' },
  { id: 'emom', name: 'EMOM Power', work: 50, rest: 10, rounds: 10, tag: '10 min · Endurance' },
  { id: 'gibala', name: 'Gibala Sprint', work: 30, rest: 60, rounds: 5, tag: '7.5 min · VO2 Max' },
  { id: 'boxing', name: 'Boxing 3-Min', work: 180, rest: 60, rounds: 3, tag: '12 min · Combat' },
  { id: 'custom', name: 'Custom Timer', work: 45, rest: 15, rounds: 6, tag: 'Custom Workout' },
];

const HiitWorkoutTimerView: React.FC = () => {
  const [timerMode, setTimerMode] = useState<'presets' | 'custom'>('presets');
  const [activePreset, setActivePreset] = useState<string>('tabata');
  const [workSecs, setWorkSecs] = useState(20);
  const [restSecs, setRestSecs] = useState(10);
  const [prepSecs, setPrepSecs] = useState(5);
  const [totalRounds, setTotalRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<'prepare' | 'work' | 'rest' | 'complete'>('prepare');
  const [timeLeft, setTimeLeft] = useState(5); // preparation
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Apply a preset
  const applyPreset = (preset: HiitPreset) => {
    sounds.playClick();
    setActivePreset(preset.id);
    setIsActive(false);
    setWorkSecs(preset.work);
    setRestSecs(preset.rest);
    setPrepSecs(5);
    setTotalRounds(preset.rounds);
    setPhase('prepare');
    setCurrentRound(1);
    setTimeLeft(5);
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            sounds.playSuccess();
            // Transition phase
            if (phase === 'prepare') {
              setPhase('work');
              return workSecs;
            } else if (phase === 'work') {
              if (currentRound >= totalRounds) {
                setPhase('complete');
                setIsActive(false);
                return 0;
              } else {
                setPhase('rest');
                return restSecs;
              }
            } else if (phase === 'rest') {
              setCurrentRound(r => r + 1);
              setPhase('work');
              return workSecs;
            }
            return 0;
          }
          if (t <= 4) {
            sounds.playTone(660, 0.08); // countdown tick
          }
          return t - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, phase, workSecs, restSecs, currentRound, totalRounds]);

  const toggleStart = () => {
    sounds.playClick();
    if (phase === 'complete') {
      setPhase('prepare');
      setCurrentRound(1);
      setTimeLeft(prepSecs);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    sounds.playClick();
    setIsActive(false);
    setPhase('prepare');
    setCurrentRound(1);
    setTimeLeft(prepSecs);
  };

  const totalWorkoutTimeSecs = prepSecs + (workSecs + restSecs) * totalRounds - restSecs;
  const totalMins = Math.floor(totalWorkoutTimeSecs / 60);
  const totalSecsRem = totalWorkoutTimeSecs % 60;

  // Approximate calorie burn for intense HIIT ~ 12-14 kcal/min
  const estCalories = Math.round((totalWorkoutTimeSecs / 60) * 12.5);

  const phaseMaxTime = phase === 'prepare' ? prepSecs : phase === 'work' ? workSecs : restSecs;
  const progressPercent = Math.max(0, Math.min(100, (1 - timeLeft / (phaseMaxTime || 1)) * 100));

  return (
    <div className="max-w-lg mx-auto space-y-5 text-center select-none">
      {/* Mode Switch: Popular Presets vs Custom Timer */}
      <div className="flex rounded-2xl p-1 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shadow-2xs">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setTimerMode('presets');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            timerMode === 'presets'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          Preset Protocols
        </button>
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setTimerMode('custom');
            setActivePreset('custom');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            timerMode === 'custom'
              ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs ring-1 ring-indigo-500/30'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          ⚡ Custom Timer Designer
        </button>
      </div>

      {/* Preset Routines Shelf */}
      {timerMode === 'presets' ? (
        <div className="rounded-3xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Workout Protocols
            </span>
            <span className="text-[11px] text-zinc-400">1-Tap Apply</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {HIIT_PRESETS.filter(p => p.id !== 'custom').map(preset => {
              const isSel = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSel
                      ? 'border-indigo-600 bg-indigo-50/70 dark:border-indigo-500 dark:bg-indigo-950/40 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 hover:border-zinc-300'
                  }`}
                >
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    {preset.work}s / {preset.rest}s × {preset.rounds}R
                  </div>
                  <span className="inline-block mt-1 text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {preset.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Custom Timer Controls Bar */
        <div className="rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Custom Interval Parameters
            </span>
            <span className="text-xs font-mono font-bold text-zinc-500">
              Total: {totalMins}m {totalSecsRem}s
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left">
            {/* Work */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 block mb-1">Work (sec)</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={5}
                  max={600}
                  step={5}
                  disabled={isActive}
                  value={workSecs}
                  onChange={e => {
                    setWorkSecs(Math.max(5, parseInt(e.target.value) || 20));
                    setActivePreset('custom');
                  }}
                  className="w-full font-mono text-center font-black text-sm bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700"
                />
              </div>
            </div>

            {/* Rest */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 block mb-1">Rest (sec)</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  max={600}
                  step={5}
                  disabled={isActive}
                  value={restSecs}
                  onChange={e => {
                    setRestSecs(Math.max(0, parseInt(e.target.value) || 10));
                    setActivePreset('custom');
                  }}
                  className="w-full font-mono text-center font-black text-sm bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700"
                />
              </div>
            </div>

            {/* Rounds */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 block mb-1">Rounds</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={50}
                  disabled={isActive}
                  value={totalRounds}
                  onChange={e => {
                    setTotalRounds(Math.max(1, Math.min(50, parseInt(e.target.value) || 8)));
                    setActivePreset('custom');
                  }}
                  className="w-full font-mono text-center font-black text-sm bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700"
                />
              </div>
            </div>

            {/* Prepare */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 block mb-1">Get Ready (s)</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={60}
                  disabled={isActive}
                  value={prepSecs}
                  onChange={e => {
                    const p = Math.max(1, parseInt(e.target.value) || 5);
                    setPrepSecs(p);
                    if (!isActive && phase === 'prepare') setTimeLeft(p);
                  }}
                  className="w-full font-mono text-center font-black text-sm bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700"
                />
              </div>
            </div>
          </div>

          {/* Quick Custom Interval Dials */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {[
              { label: '30s / 30s × 8R', w: 30, r: 30, rnds: 8 },
              { label: '45s / 15s × 6R', w: 45, r: 15, rnds: 6 },
              { label: '40s / 20s × 10R', w: 40, r: 20, rnds: 10 },
              { label: '60s / 30s × 5R', w: 60, r: 30, rnds: 5 },
            ].map(shortcut => (
              <button
                key={shortcut.label}
                type="button"
                disabled={isActive}
                onClick={() => {
                  sounds.playClick();
                  setWorkSecs(shortcut.w);
                  setRestSecs(shortcut.r);
                  setTotalRounds(shortcut.rnds);
                  setActivePreset('custom');
                  handleReset();
                }}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 cursor-pointer shadow-2xs transition-all"
              >
                {shortcut.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Round Indicators Shelf */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap px-2">
        {Array.from({ length: totalRounds }, (_, i) => {
          const rNum = i + 1;
          const isDone = rNum < currentRound || phase === 'complete';
          const isCurrent = rNum === currentRound && phase !== 'complete';
          return (
            <div
              key={rNum}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isDone
                  ? 'w-6 bg-emerald-500'
                  : isCurrent
                  ? 'w-10 bg-indigo-600 animate-pulse ring-2 ring-indigo-400/40'
                  : 'w-4 bg-zinc-200 dark:bg-zinc-800'
              }`}
              title={`Round ${rNum}`}
            />
          );
        })}
      </div>

      {/* Main Interval Stage Screen */}
      <div
        className={`relative overflow-hidden p-8 sm:p-10 rounded-3xl border transition-all duration-300 shadow-xl ${
          phase === 'work'
            ? 'bg-rose-500 text-white border-rose-600 shadow-rose-500/20'
            : phase === 'rest'
            ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20'
            : phase === 'complete'
            ? 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-600/20'
            : 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
        }`}
      >
        {/* Progress Fill Line */}
        <div
          className="absolute bottom-0 left-0 top-0 bg-black/10 transition-all duration-1000 ease-linear pointer-events-none"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="relative z-10 space-y-1">
          <span className="text-xs font-black uppercase tracking-widest block opacity-90">
            {phase === 'prepare'
              ? '⏳ GET READY'
              : phase === 'work'
              ? '🔥 WORK INTERVAL — GO HARD!'
              : phase === 'rest'
              ? '🌿 REST & DEEP BREATH'
              : '🏆 WORKOUT COMPLETED!'}
          </span>

          <div className="text-8xl font-mono font-black my-2 tracking-tight tabular-nums">
            {timeLeft}s
          </div>

          <div className="flex items-center justify-center gap-3 text-xs font-bold opacity-90 pt-1">
            <span>Round {currentRound} of {totalRounds}</span>
            <span>·</span>
            <span>Est. Burn: ~{estCalories} kcal</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={toggleStart}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm cursor-pointer shadow-lg active:scale-95 transition-all ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
              : 'bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'Pause Timer' : phase === 'complete' ? 'Restart Protocol' : 'Start HIIT Interval'}</span>
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-sm cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Customizable Interval & Timer Settings */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left shadow-xs">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] font-bold text-zinc-400">Work Interval (sec)</label>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={isActive}
                onClick={() => {
                  setActivePreset('custom');
                  setWorkSecs(w => Math.max(5, w - 5));
                }}
                className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 cursor-pointer disabled:opacity-40"
              >
                -5s
              </button>
              <button
                type="button"
                disabled={isActive}
                onClick={() => {
                  setActivePreset('custom');
                  setWorkSecs(w => w + 5);
                }}
                className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 cursor-pointer disabled:opacity-40"
              >
                +5s
              </button>
            </div>
          </div>
          <input
            type="number"
            disabled={isActive}
            value={workSecs}
            onChange={e => {
              setActivePreset('custom');
              setWorkSecs(Math.max(5, parseInt(e.target.value) || 20));
            }}
            className="w-full border rounded-xl p-2.5 font-mono text-center font-black bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 disabled:opacity-50 text-base"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] font-bold text-zinc-400">Rest Interval (sec)</label>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={isActive}
                onClick={() => {
                  setActivePreset('custom');
                  setRestSecs(r => Math.max(5, r - 5));
                }}
                className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 cursor-pointer disabled:opacity-40"
              >
                -5s
              </button>
              <button
                type="button"
                disabled={isActive}
                onClick={() => {
                  setActivePreset('custom');
                  setRestSecs(r => r + 5);
                }}
                className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 cursor-pointer disabled:opacity-40"
              >
                +5s
              </button>
            </div>
          </div>
          <input
            type="number"
            disabled={isActive}
            value={restSecs}
            onChange={e => {
              setActivePreset('custom');
              setRestSecs(Math.max(5, parseInt(e.target.value) || 10));
            }}
            className="w-full border rounded-xl p-2.5 font-mono text-center font-black bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 disabled:opacity-50 text-base"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] font-bold text-zinc-400">Total Rounds</label>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={isActive}
                onClick={() => {
                  setActivePreset('custom');
                  setTotalRounds(r => Math.max(1, r - 1));
                }}
                className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 cursor-pointer disabled:opacity-40"
              >
                -1
              </button>
              <button
                type="button"
                disabled={isActive}
                onClick={() => {
                  setActivePreset('custom');
                  setTotalRounds(r => r + 1);
                }}
                className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 cursor-pointer disabled:opacity-40"
              >
                +1
              </button>
            </div>
          </div>
          <input
            type="number"
            disabled={isActive}
            value={totalRounds}
            onChange={e => {
              setActivePreset('custom');
              setTotalRounds(Math.max(1, parseInt(e.target.value) || 8));
            }}
            className="w-full border rounded-xl p-2.5 font-mono text-center font-black bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 disabled:opacity-50 text-base"
          />
        </div>
      </div>

      {/* Summary Footer */}
      <div className="text-xs text-zinc-400 font-medium">
        Total Session Duration: <strong className="text-zinc-700 dark:text-zinc-300 font-mono">{totalMins}m {totalSecsRem}s</strong> · Automatic audio beeps on last 3 seconds
      </div>
    </div>
  );
};

// 7. Pregnancy Due Date & Milestones (Item 8 - Naegele's Rule)
const PregnancyMilestonesView: React.FC = () => {
  const [lmpDate, setLmpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 70); // 10 weeks ago default
    return d.toISOString().split('T')[0];
  });
  const [cycleDays, setCycleDays] = useState(28);

  const lmp = new Date(lmpDate);
  const cycleAdjustment = cycleDays - 28;
  const dueDate = new Date(lmp.getTime() + (280 + cycleAdjustment) * 24 * 60 * 60 * 1000);

  const now = new Date();
  const diffDays = Math.max(0, Math.floor((now.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24)));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  const currentTrimester = weeks < 13 ? '1st Trimester' : weeks < 27 ? '2nd Trimester' : '3rd Trimester';
  const progressPct = Math.min(100, Math.round((diffDays / 280) * 100));

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">
            First Day of Last Menstrual Period (LMP)
          </label>
          <input
            type="date"
            value={lmpDate}
            onChange={e => setLmpDate(e.target.value)}
            className="w-full border rounded-xl p-2.5 bg-white dark:bg-zinc-950 dark:border-zinc-700 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">
            Average Menstrual Cycle Length (Days)
          </label>
          <input
            type="number"
            min={21}
            max={40}
            value={cycleDays}
            onChange={e => setCycleDays(parseInt(e.target.value) || 28)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-pink-200 bg-pink-50/40 dark:border-pink-900/60 dark:bg-pink-950/20 p-6 text-center space-y-3 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
          Estimated Due Date (EDD)
        </span>
        <div className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
          {dueDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          Current Gestational Age: <span className="font-bold text-pink-600 dark:text-pink-400">{weeks} weeks, {days} days</span> ({currentTrimester})
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden mt-3">
          <div className="h-full bg-pink-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="text-[11px] text-zinc-400 block">{progressPct}% of 40-week term completed</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label="1st Trimester End" value={new Date(lmp.getTime() + 13 * 7 * 86400000).toLocaleDateString()} />
        <ResultCard label="2nd Trimester End" value={new Date(lmp.getTime() + 27 * 7 * 86400000).toLocaleDateString()} />
        <ResultCard label="Days Until Birth" value={`${Math.max(0, 280 - diffDays)} days`} highlight />
      </div>
    </div>
  );
};

// 8. Blood Alcohol Content (BAC) Estimator (Item 8 - Widmark Formula)
const BacEstimatorView: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightKg, setWeightKg] = useState(75);
  const [standardDrinks, setStandardDrinks] = useState(3); // 1 drink = 14g pure ethanol
  const [hoursDrinking, setHoursDrinking] = useState(2);

  // Widmark formula: BAC = [Alcohol consumed in grams / (Body weight in grams * r)] * 100 - (Beta * hours)
  // r = 0.68 for males, 0.55 for females
  // Beta = 0.015% per hour metabolic elimination rate
  const r = gender === 'male' ? 0.68 : 0.55;
  const alcoholGrams = standardDrinks * 14;
  const weightGrams = weightKg * 1000;
  const rawBac = (alcoholGrams / (weightGrams * r)) * 100;
  const elimination = hoursDrinking * 0.015;
  const bac = Math.max(0, Number((rawBac - elimination).toFixed(3)));

  const isOverLegalLimit = bac >= 0.08;
  const soberTimeHours = bac > 0 ? (bac / 0.015).toFixed(1) : '0';

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Biological Gender</label>
          <select
            value={gender}
            onChange={e => setGender(e.target.value as any)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          >
            <option value="male">Male (Body Water r = 0.68)</option>
            <option value="female">Female (Body Water r = 0.55)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Body Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={e => setWeightKg(parseFloat(e.target.value) || 1)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Standard Drinks Consumed</label>
          <input
            type="number"
            min={0}
            value={standardDrinks}
            onChange={e => setStandardDrinks(parseInt(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
          <span className="text-[10px] text-zinc-400">1 drink = 12oz beer / 5oz wine / 1.5oz shot</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Time Elapsed (Hours)</label>
          <input
            type="number"
            min={0}
            step="0.5"
            value={hoursDrinking}
            onChange={e => setHoursDrinking(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className={`p-6 rounded-3xl border text-center space-y-3 ${
        isOverLegalLimit
          ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 text-rose-900 dark:text-rose-200'
          : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
      }`}>
        <span className="text-xs font-bold uppercase tracking-wider block">Estimated Blood Alcohol Concentration</span>
        <div className="text-5xl font-mono font-extrabold">{bac.toFixed(3)}% BAC</div>
        <div className="font-bold text-sm">
          {isOverLegalLimit
            ? '⚠️ ILLEGAL TO DRIVE (Exceeds 0.08% Legal Limit)'
            : 'Within Typical 0.08% Legal Threshold'}
        </div>
        <p className="text-xs opacity-80 max-w-sm mx-auto">
          Widmark pharmacokinetic model. Always use a designated driver or taxi; individual metabolism and stomach contents vary.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard label="Estimated Time to 0.00% Sober" value={`~${soberTimeHours} hours`} highlight />
        <ResultCard label="Standard Pure Alcohol" value={`${alcoholGrams} grams`} />
      </div>
    </div>
  );
};

// 9. Smoke-Free & Health Savings Tracker (Item 8)
const SmokeFreeSavingsView: React.FC = () => {
  const [quitDateStr, setQuitDateStr] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30); // 30 days ago default
    return d.toISOString().split('T')[0];
  });
  const [cigsPerDay, setCigsPerDay] = useState(15);
  const [packPrice, setPackPrice] = useState(11.50);
  const [cigsPerPack] = useState(20);

  const quitDate = new Date(quitDateStr);
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - quitDate.getTime());
  const daysSmokeFree = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hoursSmokeFree = Math.floor(diffMs / (1000 * 60 * 60));

  const totalCigsAvoided = Math.round(daysSmokeFree * cigsPerDay);
  const totalPacksAvoided = totalCigsAvoided / cigsPerPack;
  const moneySaved = totalPacksAvoided * packPrice;
  const lifeRegainedHours = Math.round((totalCigsAvoided * 11) / 60); // 11 mins per cigarette

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Quit Date</label>
          <input
            type="date"
            value={quitDateStr}
            onChange={e => setQuitDateStr(e.target.value)}
            className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Cigarettes / Day</label>
          <input
            type="number"
            value={cigsPerDay}
            onChange={e => setCigsPerDay(parseInt(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Price per Pack ($)</label>
          <input
            type="number"
            step="0.5"
            value={packPrice}
            onChange={e => setPackPrice(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="Smoke-Free Days" value={`${daysSmokeFree} days`} highlight />
        <ResultCard label="Money Saved" value={`$${moneySaved.toFixed(2)}`} highlight />
        <ResultCard label="Cigarettes Avoided" value={`${totalCigsAvoided.toLocaleString()}`} />
        <ResultCard label="Life Regained" value={`~${lifeRegainedHours} hrs`} />
      </div>

      {/* Recovery Milestones */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          WHO Physiological Recovery Milestones
        </h4>
        <div className="space-y-2 text-xs">
          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${hoursSmokeFree >= 8 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300' : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-400'}`}>
            <span>8 Hours: Carbon monoxide in blood drops to normal levels</span>
            <span className="font-bold">{hoursSmokeFree >= 8 ? '✓ Reached' : 'Pending'}</span>
          </div>
          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${hoursSmokeFree >= 48 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300' : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-400'}`}>
            <span>48 Hours: Nerve endings start regrowing; taste & smell heighten</span>
            <span className="font-bold">{hoursSmokeFree >= 48 ? '✓ Reached' : 'Pending'}</span>
          </div>
          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${daysSmokeFree >= 14 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300' : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-400'}`}>
            <span>2 Weeks: Circulation and lung function improve by up to 30%</span>
            <span className="font-bold">{daysSmokeFree >= 14 ? '✓ Reached' : 'Pending'}</span>
          </div>
          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${daysSmokeFree >= 365 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300' : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-400'}`}>
            <span>1 Year: Excess risk of coronary heart disease cut in half</span>
            <span className="font-bold">{daysSmokeFree >= 365 ? '✓ Reached' : 'Pending'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 10. Target Training Heart Rate Zones (Item 8 - Karvonen Formula)
const TargetHeartRateView: React.FC = () => {
  const [age, setAge] = useState(30);
  const [restingHr, setRestingHr] = useState(65);

  // Tanaka Formula: Max HR = 208 - (0.7 * age)
  const maxHr = Math.round(208 - (0.7 * age));
  // Karvonen Heart Rate Reserve: HRR = Max HR - Resting HR
  const hrr = maxHr - restingHr;

  const zones = [
    { name: 'Zone 1: Active Recovery (50–60%)', min: Math.round(restingHr + hrr * 0.5), max: Math.round(restingHr + hrr * 0.6), color: 'text-blue-500', desc: 'Easy walking, warm-up & active recovery' },
    { name: 'Zone 2: Aerobic / Fat Burn (60–70%)', min: Math.round(restingHr + hrr * 0.6), max: Math.round(restingHr + hrr * 0.7), color: 'text-emerald-500', desc: 'Optimal metabolic fat oxidation & endurance building' },
    { name: 'Zone 3: Tempo / Aerobic Endurance (70–80%)', min: Math.round(restingHr + hrr * 0.7), max: Math.round(restingHr + hrr * 0.8), color: 'text-amber-500', desc: 'Cardiovascular efficiency & marathon pacing' },
    { name: 'Zone 4: Anaerobic Threshold (80–90%)', min: Math.round(restingHr + hrr * 0.8), max: Math.round(restingHr + hrr * 0.9), color: 'text-orange-500', desc: 'Lactate threshold & high-performance stamina' },
    { name: 'Zone 5: VO2 Max Peak Exertion (90–100%)', min: Math.round(restingHr + hrr * 0.9), max: maxHr, color: 'text-rose-500', desc: 'All-out sprint intervals & maximal anaerobic power' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Age (Years)</label>
          <input
            type="number"
            min={10}
            max={100}
            value={age}
            onChange={e => setAge(parseInt(e.target.value) || 20)}
            className="w-full border rounded-xl p-2.5 font-mono text-base bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Resting Heart Rate (BPM)</label>
          <input
            type="number"
            min={40}
            max={120}
            value={restingHr}
            onChange={e => setRestingHr(parseInt(e.target.value) || 60)}
            className="w-full border rounded-xl p-2.5 font-mono text-base bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <ResultCard label="Estimated Max Heart Rate" value={`${maxHr} BPM`} highlight />
        <ResultCard label="Heart Rate Reserve (HRR)" value={`${hrr} BPM`} />
        <ResultCard label="Target Fat-Burn Range" value={`${zones[1].min}–${zones[1].max} BPM`} />
      </div>

      {/* 5 Heart Rate Zones */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Karvonen Scientifically Calibrated Training Zones
        </h4>
        <div className="space-y-2">
          {zones.map((z, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 flex items-center justify-between">
              <div>
                <span className={`text-xs font-bold block ${z.color}`}>{z.name}</span>
                <span className="text-[11px] text-zinc-400">{z.desc}</span>
              </div>
              <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-50">
                {z.min} – {z.max} BPM
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 11. 4-4-4-4 Box Breathing Relaxer (Item 8)
const BoxBreathingRelaxerView: React.FC = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold In' | 'Exhale' | 'Hold Out'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let timer: number | null = null;
    if (isActive) {
      timer = window.setInterval(() => {
        setSecondsLeft(sec => {
          if (sec <= 1) {
            sounds.playTone(440, 0.1);
            setPhase(p => {
              if (p === 'Inhale') return 'Hold In';
              if (p === 'Hold In') return 'Exhale';
              if (p === 'Exhale') return 'Hold Out';
              setCycleCount(c => c + 1);
              return 'Inhale';
            });
            return 4;
          }
          return sec - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive]);

  const toggle = () => {
    sounds.playClick();
    setIsActive(!isActive);
  };

  const circleScale =
    phase === 'Inhale'
      ? 'scale-110 duration-[4000ms]'
      : phase === 'Hold In'
      ? 'scale-110 duration-0'
      : phase === 'Exhale'
      ? 'scale-75 duration-[4000ms]'
      : 'scale-75 duration-0';

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">4-4-4-4 Box Breathing Relaxer</h2>
        <span className="text-xs text-zinc-400">Navy SEAL autonomic nervous system regulator</span>
      </div>

      {/* Visual Breathing Ring */}
      <div className="h-64 flex items-center justify-center">
        <div
          className={`w-48 h-48 rounded-full border-4 border-indigo-500/80 bg-indigo-500/10 dark:bg-indigo-500/20 flex flex-col items-center justify-center transition-transform ease-linear shadow-xl ${
            isActive ? circleScale : 'scale-90'
          }`}
        >
          <span className="text-sm font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {isActive ? phase : 'Ready'}
          </span>
          <span className="text-5xl font-mono font-bold text-zinc-900 dark:text-zinc-50 mt-1">
            {isActive ? secondsLeft : '4'}
          </span>
          <span className="text-[10px] text-zinc-400 mt-1">{isActive ? 'seconds' : 'press start'}</span>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={toggle}
          className={`px-8 py-3 rounded-2xl font-bold text-sm cursor-pointer shadow-md transition-all active:scale-95 ${
            isActive
              ? 'bg-amber-500 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isActive ? 'Pause Session' : 'Start Box Breathing'}
        </button>
      </div>

      <div className="text-xs text-zinc-400">
        Cycles completed: <span className="font-bold text-zinc-700 dark:text-zinc-200">{cycleCount}</span> (Inhale 4s → Hold 4s → Exhale 4s → Hold 4s)
      </div>
    </div>
  );
};

// 12. Biorhythm Biological Cycle Calculator (Item 8)
const BiorhythmCalculatorView: React.FC = () => {
  const [birthDateStr, setBirthDateStr] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25);
    return d.toISOString().split('T')[0];
  });
  const [targetDateStr, setTargetDateStr] = useState(() => new Date().toISOString().split('T')[0]);

  const birthDate = new Date(birthDateStr);
  const targetDate = new Date(targetDateStr);
  const diffDays = Math.max(0, Math.floor((targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)));

  // Biorhythm cycle lengths:
  // Physical: 23 days (vitality, stamina, coordination)
  // Emotional: 28 days (mood, sensitivity, creativity)
  // Intellectual: 33 days (analytical logic, memory, alertness)
  // Intuitive: 38 days (gut feeling, unconscious insight)
  const calcCycle = (days: number, period: number) => {
    return Math.round(Math.sin((2 * Math.PI * days) / period) * 100);
  };

  const physical = calcCycle(diffDays, 23);
  const emotional = calcCycle(diffDays, 28);
  const intellectual = calcCycle(diffDays, 33);
  const intuitive = calcCycle(diffDays, 38);

  const getStatus = (val: number) => {
    if (Math.abs(val) <= 5) return { label: 'Critical / Crossover Day (Caution)', color: 'text-amber-500' };
    if (val > 0) return { label: `Peak High (${val}%)`, color: 'text-emerald-500' };
    return { label: `Recharge Low (${val}%)`, color: 'text-blue-500' };
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Date of Birth</label>
          <input
            type="date"
            value={birthDateStr}
            onChange={e => setBirthDateStr(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Target Analysis Date</label>
          <input
            type="date"
            value={targetDateStr}
            onChange={e => setTargetDateStr(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Biological Cycles for Day {diffDays.toLocaleString()} of Life
        </h4>

        <div className="space-y-3">
          {[
            { name: 'Physical (23-Day Cycle)', val: physical, desc: 'Coordination, stamina, strength' },
            { name: 'Emotional (28-Day Cycle)', val: emotional, desc: 'Mood, sensitivity, creativity' },
            { name: 'Intellectual (33-Day Cycle)', val: intellectual, desc: 'Memory, logic, alertness' },
            { name: 'Intuitive (38-Day Cycle)', val: intuitive, desc: 'Gut feeling & perception' },
          ].map(c => {
            const status = getStatus(c.val);
            return (
              <div key={c.name} className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-900 dark:text-zinc-100">{c.name}</span>
                  <span className={`font-mono ${status.color}`}>{status.label}</span>
                </div>
                {/* Sine gauge */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${c.val >= 0 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.abs(c.val)}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-400 block">{c.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 13. Emergency ICE Health Card (Item 20 - With Download Printable PNG Card)
const EmergencyIceCardView: React.FC = () => {
  const [name, setName] = useState('Alex Morgan');
  const [bloodType, setBloodType] = useState('O+');
  const [allergies, setAllergies] = useState('Penicillin, Peanuts');
  const [medicalConditions, setMedicalConditions] = useState('Asthma (Inhaler in backpack)');
  const [contactName, setContactName] = useState('Sarah Morgan (Spouse)');
  const [contactPhone, setContactPhone] = useState('+1 (555) 234-5678');
  const [donor, setDonor] = useState(true);
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);

  const downloadCardImage = () => {
    sounds.playSuccess();
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render high-res printable wallet card (600x360)
    canvas.width = 600;
    canvas.height = 360;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 360);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#fef2f2');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 360);

    // Border
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#dc2626';
    ctx.strokeRect(4, 4, 592, 352);

    // Header Red Bar
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(8, 8, 584, 55);

    // Header text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('EMERGENCY MEDICAL IDENTIFICATION (I.C.E.)', 24, 44);

    // Blood type badge
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(480, 16, 95, 38);
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(bloodType, 500, 42);

    // Fields
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('FULL NAME', 24, 90);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(name, 24, 115);

    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('ALLERGIES & DRUG REACTIONS', 24, 150);
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(allergies || 'No known drug allergies', 24, 172);

    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('MEDICAL CONDITIONS', 24, 208);
    ctx.fillStyle = '#111827';
    ctx.font = '15px sans-serif';
    ctx.fillText(medicalConditions || 'None', 24, 230);

    // Contact Box
    ctx.fillStyle = '#fee2e2';
    ctx.fillRect(24, 255, 552, 75);
    ctx.fillStyle = '#991b1b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('PRIMARY EMERGENCY CONTACT', 36, 275);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`${contactName}: ${contactPhone}`, 36, 305);

    // Download image
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `omnitoolbox-emergency-ice-card-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Full Legal Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Blood Type</label>
          <select
            value={bloodType}
            onChange={e => setBloodType(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          >
            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Known Allergies</label>
          <input
            type="text"
            value={allergies}
            onChange={e => setAllergies(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Medical Conditions / Meds</label>
          <input
            type="text"
            value={medicalConditions}
            onChange={e => setMedicalConditions(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Emergency Contact Person</label>
          <input
            type="text"
            value={contactName}
            onChange={e => setContactName(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Contact Phone</label>
          <input
            type="text"
            value={contactPhone}
            onChange={e => setContactPhone(e.target.value)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
      </div>

      {/* Visual ICE Card Preview */}
      <div className="rounded-3xl border-2 border-red-500 bg-red-50/20 dark:bg-red-950/20 p-6 space-y-4 shadow-lg">
        <div className="flex justify-between items-center border-b border-red-200 dark:border-red-900 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 animate-pulse" />
            <h3 className="font-bold text-red-600 dark:text-red-400 tracking-wider text-sm uppercase">
              Emergency Medical I.D. (I.C.E.)
            </h3>
          </div>
          <span className="px-3 py-1 bg-red-600 text-white font-mono font-extrabold text-sm rounded-xl">
            {bloodType}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-zinc-500 block text-[11px]">Patient Name:</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-base">{name}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[11px]">Allergies:</span>
            <span className="font-bold text-red-600 dark:text-red-400 text-sm">{allergies || 'None'}</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-red-100 dark:border-red-900/50">
            <span className="text-zinc-500 block text-[11px]">Medical Conditions:</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">{medicalConditions || 'None specified'}</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-red-100 dark:border-red-900/50">
            <span className="text-zinc-500 block text-[11px]">Primary Contact:</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{contactName} · {contactPhone}</span>
          </div>
        </div>

        {/* Download Button (Item 20) */}
        <button
          onClick={downloadCardImage}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download Emergency Wallet Card (PNG Image)</span>
        </button>
      </div>

      {/* Hidden Canvas for crisp rendering */}
      <canvas ref={cardCanvasRef} className="hidden" />
    </div>
  );
};

// 14. Medicine & Prescription Reminder (Item 1: Full Schedule, Refill Inventory, Sound Chime, Add/Delete Beside Each)
interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions: 'with_food' | 'before_food' | 'after_food' | 'empty_stomach' | 'anytime';
  category: 'Daily' | 'Supplement' | 'Prescription' | 'As Needed';
  remainingPills: number;
  totalPills: number;
  takenToday: boolean;
  lastTakenTime?: string;
}

const DEFAULT_MEDICATIONS: MedicationItem[] = [
  {
    id: '1',
    name: 'Amoxicillin Antibiotic',
    dosage: '500 mg (1 Capsule)',
    frequency: 'Every 8 Hours',
    time: '08:00 AM',
    instructions: 'with_food',
    category: 'Prescription',
    remainingPills: 14,
    totalPills: 30,
    takenToday: true,
    lastTakenTime: '08:05 AM',
  },
  {
    id: '2',
    name: 'Vitamin D3 + K2',
    dosage: '5,000 IU (1 Softgel)',
    frequency: 'Once Daily (Morning)',
    time: '09:00 AM',
    instructions: 'with_food',
    category: 'Supplement',
    remainingPills: 45,
    totalPills: 60,
    takenToday: false,
  },
  {
    id: '3',
    name: 'Blood Pressure / Lisinopril',
    dosage: '10 mg (1 Tablet)',
    frequency: 'Once Daily (Evening)',
    time: '07:00 PM',
    instructions: 'before_food',
    category: 'Prescription',
    remainingPills: 4, // Trigger low stock refill alert!
    totalPills: 30,
    takenToday: false,
  },
  {
    id: '4',
    name: 'Magnesium L-Threonate',
    dosage: '400 mg (2 Capsules)',
    frequency: 'Nightly (Bedtime)',
    time: '10:00 PM',
    instructions: 'after_food',
    category: 'Daily',
    remainingPills: 28,
    totalPills: 60,
    takenToday: false,
  },
];

const MedicineReminderView: React.FC = () => {
  const [meds, setMeds] = useState<MedicationItem[]>(() => {
    try {
      const saved = localStorage.getItem('omni_medicine_reminders');
      return saved ? JSON.parse(saved) : DEFAULT_MEDICATIONS;
    } catch {
      return DEFAULT_MEDICATIONS;
    }
  });

  const [filter, setFilter] = useState<'all' | 'pending' | 'taken'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [frequency, setFrequency] = useState('Once Daily');
  const [instructions, setInstructions] = useState<'with_food' | 'before_food' | 'after_food' | 'empty_stomach' | 'anytime'>('with_food');
  const [category, setCategory] = useState<'Daily' | 'Supplement' | 'Prescription' | 'As Needed'>('Prescription');
  const [totalPills, setTotalPills] = useState('30');

  const saveMeds = (updated: MedicationItem[]) => {
    setMeds(updated);
    localStorage.setItem('omni_medicine_reminders', JSON.stringify(updated));
  };

  const handleToggleTaken = (id: string) => {
    sounds.playSuccess();
    const updated = meds.map(m => {
      if (m.id === id) {
        const nextTaken = !m.takenToday;
        const nextRemaining = nextTaken ? Math.max(0, m.remainingPills - 1) : m.remainingPills + 1;
        return {
          ...m,
          takenToday: nextTaken,
          remainingPills: nextRemaining,
          lastTakenTime: nextTaken ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        };
      }
      return m;
    });
    saveMeds(updated);
  };

  const handleDelete = (id: string) => {
    sounds.playClick();
    const updated = meds.filter(m => m.id !== id);
    saveMeds(updated);
  };

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sounds.playSuccess();
    const parsedTotal = parseInt(totalPills, 10) || 30;
    const newMed: MedicationItem = {
      id: String(Date.now()),
      name: name.trim(),
      dosage: dosage.trim() || '1 Dose',
      time,
      frequency,
      instructions,
      category,
      remainingPills: parsedTotal,
      totalPills: parsedTotal,
      takenToday: false,
    };

    saveMeds([newMed, ...meds]);
    setName('');
    setDosage('');
    setShowAddForm(false);
  };

  const handleRefill = (id: string, count: number = 30) => {
    sounds.playSuccess();
    const updated = meds.map(m => {
      if (m.id === id) {
        return {
          ...m,
          remainingPills: m.remainingPills + count,
          totalPills: Math.max(m.totalPills, m.remainingPills + count),
        };
      }
      return m;
    });
    saveMeds(updated);
  };

  const playChimeAlert = () => {
    sounds.playClick();
    sounds.playTone(880, 0.25);
    setTimeout(() => sounds.playTone(1100, 0.35), 250);
  };

  const takenCount = meds.filter(m => m.takenToday).length;
  const adherencePct = meds.length > 0 ? Math.round((takenCount / meds.length) * 100) : 0;
  const lowSupplyCount = meds.filter(m => m.remainingPills <= 5).length;

  const filteredMeds = meds.filter(m => {
    if (filter === 'pending') return !m.takenToday;
    if (filter === 'taken') return m.takenToday;
    return true;
  });

  const getInstructionBadge = (inst: string) => {
    switch (inst) {
      case 'with_food': return '🍽️ Take with Meals';
      case 'before_food': return '⏰ 30m Before Food';
      case 'after_food': return '🥣 Take After Food';
      case 'empty_stomach': return '💧 On Empty Stomach';
      default: return '💊 Anytime';
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Medicine & Pill Reminder
          </h2>
          <span className="text-xs text-zinc-400">
            Scheduled doses, adherence tracking, refill alerts & audio chime notifications
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={playChimeAlert}
            className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-xs font-bold flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-2xs"
            title="Test reminder alarm chime"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>Test Chime</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setShowAddForm(v => !v); }}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Close Form' : 'Add Medication'}</span>
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowSupplyCount > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Refill Alert:</strong> {lowSupplyCount} prescription{lowSupplyCount > 1 ? 's have' : ' has'} 5 or fewer doses left in your cabinet!
            </span>
          </div>
        </div>
      )}

      {/* Adherence Overview Banner */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3.5 shadow-xs">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Today's Medication Compliance
            </span>
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50 font-mono mt-0.5">
              {adherencePct}% Complete
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
            {takenCount} of {meds.length} doses taken
          </span>
        </div>

        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${adherencePct}%` }}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 pt-1">
          {(['all', 'pending', 'taken'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { sounds.playClick(); setFilter(tab); }}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {tab === 'all' ? `All (${meds.length})` : tab === 'pending' ? `Pending (${meds.length - takenCount})` : `Taken (${takenCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Add Medication Form */}
      {showAddForm && (
        <form onSubmit={handleAddMed} className="rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-5 space-y-3.5 shadow-xs animate-in fade-in">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add New Prescription or Daily Supplement</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Medication Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Lisinopril, Metformin, Vitamin C"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Dosage & Form</label>
              <input
                type="text"
                placeholder="e.g. 500mg, 1 Capsule, 2 Drops"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium focus:outline-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Scheduled Time</label>
              <input
                type="text"
                placeholder="e.g. 08:00 AM"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-bold focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium focus:outline-indigo-500"
              >
                <option value="Once Daily">Once Daily</option>
                <option value="Twice Daily">Twice Daily (Morning & Night)</option>
                <option value="Every 8 Hours">Every 8 Hours</option>
                <option value="Every Other Day">Every Other Day</option>
                <option value="As Needed (PRN)">As Needed (PRN)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Meal Instructions</label>
              <select
                value={instructions}
                onChange={e => setInstructions(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium focus:outline-indigo-500"
              >
                <option value="with_food">With Meals</option>
                <option value="before_food">Before Food</option>
                <option value="after_food">After Food</option>
                <option value="empty_stomach">Empty Stomach</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium focus:outline-indigo-500"
              >
                <option value="Prescription">Prescription</option>
                <option value="Daily">Daily Medication</option>
                <option value="Supplement">Vitamin / Supplement</option>
                <option value="As Needed">As Needed</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Pill Bottle Supply Count</label>
              <input
                type="number"
                value={totalPills}
                onChange={e => setTotalPills(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-bold focus:outline-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs"
            >
              Save Medication
            </button>
          </div>
        </form>
      )}

      {/* Medication List */}
      <div className="space-y-3">
        {filteredMeds.map(med => {
          const isLow = med.remainingPills <= 5;

          return (
            <div
              key={med.id}
              className={`p-4.5 rounded-3xl border transition-all ${
                med.takenToday
                  ? 'border-emerald-200/90 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                  : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-start gap-3.5">
                  {/* Mark Taken Button */}
                  <button
                    onClick={() => handleToggleTaken(med.id)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all cursor-pointer mt-0.5 ${
                      med.takenToday
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs'
                        : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-emerald-400 text-transparent hover:text-zinc-300'
                    }`}
                    title={med.takenToday ? 'Mark as not taken' : 'Mark as taken'}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold ${med.takenToday ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                        {med.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {med.category}
                      </span>
                      {isLow && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                          Low: {med.remainingPills} left
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{med.dosage}</span>
                      <span>·</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {med.time}
                      </span>
                      <span>·</span>
                      <span className="text-[11px] text-zinc-400">{getInstructionBadge(med.instructions)}</span>
                    </div>

                    {med.takenToday && med.lastTakenTime && (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
                        ✓ Taken today at {med.lastTakenTime}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add / Delete / Refill Buttons Beside Every Item */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleRefill(med.id, 30)}
                    className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1 cursor-pointer"
                    title="Add 30 doses to pill inventory"
                  >
                    <Plus className="w-3 h-3" />
                    <span className="text-[11px]">Refill (+30)</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setShowAddForm(true);
                      setName(med.name);
                      setDosage(med.dosage);
                    }}
                    className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-600 dark:text-zinc-300 cursor-pointer"
                    title="Add another dose / duplicate"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:border-rose-800 text-zinc-400 cursor-pointer transition-colors"
                    title="Delete medication"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredMeds.length === 0 && (
          <div className="p-8 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
            No medications found for this view.
          </div>
        )}
      </div>
    </div>
  );
};

