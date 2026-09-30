import React, { useState } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Heart, Droplets, Flame, Moon, Footprints } from 'lucide-react';

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

// 4. Sleep Cycle & Bedtime Wake-Up Calculator
const SleepCycleView: React.FC = () => {
  const [mode, setMode] = useState<'wake' | 'bed'>('wake');
  const [targetTime, setTargetTime] = useState('07:00');

  // 90 minute sleep cycles + 14 minutes average to fall asleep
  const calculateCycles = () => {
    const [h, m] = targetTime.split(':').map(Number);
    const targetMinutes = h * 60 + m;

    if (mode === 'wake') {
      // User specifies when they need to wake up. Calculate when to go to sleep.
      // Cycles: 6 cycles (9h), 5 cycles (7.5h), 4 cycles (6h), 3 cycles (4.5h)
      return [6, 5, 4, 3].map(cycles => {
        const sleepDuration = cycles * 90 + 14;
        let bedMinutes = (targetMinutes - sleepDuration + 1440 * 2) % 1440;
        const bh = Math.floor(bedMinutes / 60);
        const bm = bedMinutes % 60;
        const timeStr = `${bh % 12 || 12}:${bm < 10 ? '0' : ''}${bm} ${bh >= 12 ? 'PM' : 'AM'}`;
        return {
          cycles,
          hours: (cycles * 1.5).toFixed(1),
          time: timeStr,
          recommended: cycles === 5 || cycles === 6,
        };
      });
    } else {
      // User specifies when they go to bed. Calculate when to wake up.
      return [3, 4, 5, 6].map(cycles => {
        const sleepDuration = cycles * 90 + 14;
        let wakeMinutes = (targetMinutes + sleepDuration) % 1440;
        const wh = Math.floor(wakeMinutes / 60);
        const wm = wakeMinutes % 60;
        const timeStr = `${wh % 12 || 12}:${wm < 10 ? '0' : ''}${wm} ${wh >= 12 ? 'PM' : 'AM'}`;
        return {
          cycles,
          hours: (cycles * 1.5).toFixed(1),
          time: timeStr,
          recommended: cycles === 5 || cycles === 6,
        };
      });
    }
  };

  const results = calculateCycles();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <Moon className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          Sleep Cycle & Optimal Bedtime Planner
        </h2>
      </div>

      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl max-w-md">
        <button
          onClick={() => {
            sounds.playClick();
            setMode('wake');
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === 'wake'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500'
          }`}
        >
          I want to wake up at...
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            setMode('bed');
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === 'bed'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500'
          }`}
        >
          I am going to bed at...
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
          {mode === 'wake' ? 'Target Wake-Up Time' : 'Bedtime'}
        </label>
        <input
          type="time"
          value={targetTime}
          onChange={e => setTargetTime(e.target.value)}
          className="w-full sm:w-48 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-base font-bold font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          {mode === 'wake' ? 'Optimal Times to Fall Asleep:' : 'Optimal Times to Wake Up Refreshed:'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.map((r, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border transition-all ${
                r.recommended
                  ? 'border-indigo-300 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/20'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">
                  {r.cycles} REM Cycles ({r.hours} hours sleep)
                </span>
                {r.recommended && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                    Recommended
                  </span>
                )}
              </div>
              <div className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-50 mt-1">
                {r.time}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Includes ~14 mins natural time to drift into sleep.
              </p>
            </div>
          ))}
        </div>
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
