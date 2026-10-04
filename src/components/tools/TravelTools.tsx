import React, { useState, useEffect } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Globe, Search, Clock, Sun, Moon, Sparkles, Navigation } from 'lucide-react';
import { PublicHolidayDirectoryView } from './LiveDataTools';

interface ToolComponentProps {
  toolId: string;
}

export const TravelTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'fuel-cost-calc':
      return <FuelCostCalcView />;
    case 'trip-cost-calc':
      return <TripCostCalcView />;
    case 'speed-distance-time':
      return <SpeedDistTimeView />;
    case 'world-clock-tz':
      return <WorldClockView />;
    default:
      return <FuelCostCalcView />;
  }
};

// 1. Fuel Cost & Consumption Calculator
const FuelCostCalcView: React.FC = () => {
  const [distance, setDistance] = useState(350); // miles or km
  const [unit, setUnit] = useState<'miles' | 'km'>('miles');
  const [fuelEfficiency, setFuelEfficiency] = useState(28); // 28 MPG or 8.5 L/100km
  const [fuelPrice, setFuelPrice] = useState(3.45); // $3.45 / gallon or / liter

  let totalFuel = 0;
  let totalCost = 0;

  if (unit === 'miles') {
    totalFuel = fuelEfficiency > 0 ? distance / fuelEfficiency : 0; // gallons
    totalCost = totalFuel * fuelPrice;
  } else {
    // km and L/100km
    totalFuel = (distance * fuelEfficiency) / 100; // liters
    totalCost = totalFuel * fuelPrice;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Total Distance ({unit})</label>
          <input
            type="number"
            value={distance}
            onChange={e => setDistance(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Unit Mode</label>
          <select
            value={unit}
            onChange={e => {
              const u = e.target.value as 'miles' | 'km';
              setUnit(u);
              setFuelEfficiency(u === 'miles' ? 28 : 8.5);
            }}
            className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-semibold"
          >
            <option value="miles">Miles & MPG (US)</option>
            <option value="km">Kilometers & L/100km</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">
            Fuel Efficiency ({unit === 'miles' ? 'MPG' : 'L/100km'})
          </label>
          <input
            type="number"
            step="0.1"
            value={fuelEfficiency}
            onChange={e => setFuelEfficiency(parseFloat(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">
            Price per {unit === 'miles' ? 'Gallon ($)' : 'Liter ($)'}
          </label>
          <input
            type="number"
            step="0.01"
            value={fuelPrice}
            onChange={e => setFuelPrice(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Estimated Fuel Cost" value={`$${totalCost.toFixed(2)}`} highlight />
        <ResultCard
          label="Total Fuel Needed"
          value={`${totalFuel.toFixed(1)} ${unit === 'miles' ? 'gallons' : 'liters'}`}
        />
      </div>
    </div>
  );
};

// 2. Trip & Road Trip Cost Planner
const TripCostCalcView: React.FC = () => {
  const [fuelCost, setFuelCost] = useState(85);
  const [tolls, setTolls] = useState(25);
  const [lodging, setLodging] = useState(180);
  const [food, setFood] = useState(140);
  const [passengers, setPassengers] = useState(3);

  const grandTotal = fuelCost + tolls + lodging + food;
  const perPerson = passengers > 0 ? grandTotal / passengers : grandTotal;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Fuel / Gas ($)</label>
          <input
            type="number"
            value={fuelCost}
            onChange={e => setFuelCost(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Tolls & Parking ($)</label>
          <input
            type="number"
            value={tolls}
            onChange={e => setTolls(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Hotels / Lodging ($)</label>
          <input
            type="number"
            value={lodging}
            onChange={e => setLodging(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Food & Entertainment ($)</label>
          <input
            type="number"
            value={food}
            onChange={e => setFood(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-zinc-500 mb-1">Number of Passengers</label>
          <input
            type="number"
            min={1}
            value={passengers}
            onChange={e => setPassengers(parseInt(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Cost Per Person" value={`$${perPerson.toFixed(2)}`} highlight />
        <ResultCard label="Grand Total Trip Cost" value={`$${grandTotal.toFixed(2)}`} />
      </div>
    </div>
  );
};

// 3. Speed, Distance & Time Solver (Professional Physics & Kinematics Suite)
type SolveTarget = 'time' | 'speed' | 'distance';
type DistUnit = 'km' | 'miles' | 'meters' | 'feet' | 'nautical_miles';
type SpeedUnit = 'km/h' | 'mph' | 'm/s' | 'knots' | 'ft/s';
type TimeUnit = 'hours' | 'minutes' | 'seconds' | 'hms';

const DIST_TO_METERS: Record<DistUnit, number> = {
  km: 1000,
  miles: 1609.344,
  meters: 1,
  feet: 0.3048,
  nautical_miles: 1852,
};

const SPEED_TO_MPS: Record<SpeedUnit, number> = {
  'km/h': 1000 / 3600,
  mph: 1609.344 / 3600,
  'm/s': 1,
  knots: 1852 / 3600,
  'ft/s': 0.3048,
};

const SpeedDistTimeView: React.FC = () => {
  const [solveTarget, setSolveTarget] = useState<SolveTarget>('time');

  // Input states
  const [distanceVal, setDistanceVal] = useState<number | ''>(260);
  const [distUnit, setDistUnit] = useState<DistUnit>('miles');

  const [speedVal, setSpeedVal] = useState<number | ''>(65);
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('mph');

  const [timeHours, setTimeHours] = useState<number | ''>(4);
  const [timeMinutes, setTimeMinutes] = useState<number | ''>(0);
  const [timeSeconds, setTimeSeconds] = useState<number | ''>(0);

  // Conversion calculations
  const totalInputSeconds =
    (typeof timeHours === 'number' ? timeHours * 3600 : 0) +
    (typeof timeMinutes === 'number' ? timeMinutes * 60 : 0) +
    (typeof timeSeconds === 'number' ? timeSeconds : 0);

  const inputDistMeters =
    typeof distanceVal === 'number' ? distanceVal * DIST_TO_METERS[distUnit] : 0;

  const inputSpeedMps =
    typeof speedVal === 'number' ? speedVal * SPEED_TO_MPS[speedUnit] : 0;

  // Compute based on target
  let computedSeconds = 0;
  let computedDistMeters = 0;
  let computedSpeedMps = 0;

  if (solveTarget === 'time') {
    if (inputDistMeters > 0 && inputSpeedMps > 0) {
      computedSeconds = inputDistMeters / inputSpeedMps;
      computedDistMeters = inputDistMeters;
      computedSpeedMps = inputSpeedMps;
    }
  } else if (solveTarget === 'distance') {
    if (inputSpeedMps > 0 && totalInputSeconds > 0) {
      computedDistMeters = inputSpeedMps * totalInputSeconds;
      computedSeconds = totalInputSeconds;
      computedSpeedMps = inputSpeedMps;
    }
  } else if (solveTarget === 'speed') {
    if (inputDistMeters > 0 && totalInputSeconds > 0) {
      computedSpeedMps = inputDistMeters / totalInputSeconds;
      computedSeconds = totalInputSeconds;
      computedDistMeters = inputDistMeters;
    }
  }

  // Format Time Output
  const formatTimeHMS = (secs: number) => {
    if (!secs || isNaN(secs) || !isFinite(secs)) return '0s';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.round(secs % 60);
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || h > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return `${parts.join(' ')} (${(secs / 3600).toFixed(2)} hrs)`;
  };

  // Pace calculations (running / walking)
  const paceSecPerKm = computedSpeedMps > 0 ? 1000 / computedSpeedMps : 0;
  const paceSecPerMile = computedSpeedMps > 0 ? 1609.344 / computedSpeedMps : 0;

  const formatPace = (secs: number) => {
    if (!secs || isNaN(secs) || !isFinite(secs)) return '--:--';
    const m = Math.floor(secs / 60);
    const s = Math.round(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const applyPreset = (presetSpeedKmh: number, presetLabel: string) => {
    sounds.playClick();
    if (solveTarget === 'speed') {
      setSolveTarget('time');
    }
    setSpeedVal(presetSpeedKmh);
    setSpeedUnit('km/h');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Educational Header & What are we doing here banner */}
      <div className="rounded-3xl border border-indigo-200/80 bg-indigo-50/60 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/30 space-y-2.5">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
          <Navigation className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>What We Are Doing Here: Kinematic Motion Analysis</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          We use the fundamental kinematic equation of uniform motion{' '}
          <strong className="font-mono text-indigo-600 dark:text-indigo-400">Distance = Speed × Time</strong> ($d = v \cdot t$).
          All entered values are normalized into International System of Units (SI) meters and seconds,
          algebraically solved for your chosen unknown variable, and converted across imperial, metric, nautical,
          and athletic pace metrics.
        </p>
        <div className="flex flex-wrap gap-2 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 pt-1">
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800">
            Time Formula: t = d / v
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800">
            Distance Formula: d = v × t
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800">
            Speed Formula: v = d / t
          </span>
        </div>
      </div>

      {/* Target Selector Tabs */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-2 py-1 mb-1">
          Select Variable To Calculate:
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'time', label: '1. Calculate Time (t)', desc: 'From Distance & Speed' },
            { id: 'distance', label: '2. Calculate Distance (d)', desc: 'From Speed & Time' },
            { id: 'speed', label: '3. Calculate Speed (v)', desc: 'From Distance & Time' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setSolveTarget(tab.id as SolveTarget);
              }}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                solveTarget === tab.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100'
              }`}
            >
              <div className="text-xs font-bold">{tab.label}</div>
              <div className="text-[10px] opacity-75">{tab.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Section */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Enter Known Journey Parameters
        </h4>

        {/* Distance Input (if not solving for distance) */}
        {solveTarget !== 'distance' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Total Distance</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 260"
                value={distanceVal}
                onChange={e => setDistanceVal(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-base font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Unit</label>
              <select
                value={distUnit}
                onChange={e => setDistUnit(e.target.value as DistUnit)}
                className="w-full border rounded-xl p-2.5 text-sm font-semibold bg-white dark:bg-zinc-950 dark:border-zinc-700"
              >
                <option value="miles">Miles (mi)</option>
                <option value="km">Kilometers (km)</option>
                <option value="meters">Meters (m)</option>
                <option value="feet">Feet (ft)</option>
                <option value="nautical_miles">Nautical Miles (NM)</option>
              </select>
            </div>
          </div>
        )}

        {/* Speed Input (if not solving for speed) */}
        {solveTarget !== 'speed' && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Average Speed</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 65"
                  value={speedVal}
                  onChange={e => setSpeedVal(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                  className="w-full border rounded-xl p-2.5 font-mono text-base font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Unit</label>
                <select
                  value={speedUnit}
                  onChange={e => setSpeedUnit(e.target.value as SpeedUnit)}
                  className="w-full border rounded-xl p-2.5 text-sm font-semibold bg-white dark:bg-zinc-950 dark:border-zinc-700"
                >
                  <option value="mph">Miles per Hour (mph)</option>
                  <option value="km/h">Kilometers per Hour (km/h)</option>
                  <option value="m/s">Meters per Second (m/s)</option>
                  <option value="knots">Knots (kn)</option>
                  <option value="ft/s">Feet per Second (ft/s)</option>
                </select>
              </div>
            </div>

            {/* Quick Speed Benchmark Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 mr-1">Presets:</span>
              {[
                { label: 'Walk (5 km/h)', val: 5 },
                { label: 'Run (12 km/h)', val: 12 },
                { label: 'Bicycle (20 km/h)', val: 20 },
                { label: 'Car (100 km/h)', val: 100 },
                { label: 'Train (250 km/h)', val: 250 },
                { label: 'Airliner (900 km/h)', val: 900 },
              ].map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.val, p.label)}
                  className="px-2 py-0.5 rounded-lg border text-[11px] font-semibold bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time Input (if not solving for time) */}
        {solveTarget !== 'time' && (
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-500">Duration (Time Elapsed)</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="block text-[10px] text-zinc-400 mb-0.5">Hours</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={timeHours}
                  onChange={e => setTimeHours(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                  className="w-full border rounded-xl p-2 font-mono text-center font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
                />
              </div>
              <div>
                <span className="block text-[10px] text-zinc-400 mb-0.5">Minutes</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="0"
                  value={timeMinutes}
                  onChange={e => setTimeMinutes(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                  className="w-full border rounded-xl p-2 font-mono text-center font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
                />
              </div>
              <div>
                <span className="block text-[10px] text-zinc-400 mb-0.5">Seconds</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="0"
                  value={timeSeconds}
                  onChange={e => setTimeSeconds(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                  className="w-full border rounded-xl p-2 font-mono text-center font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Primary Solved Output Card */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-4 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
          <span>Primary Solution</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Physics Engine Output</span>
        </div>

        {solveTarget === 'time' && (
          <div className="text-center py-2">
            <span className="text-xs font-bold text-zinc-400 block mb-1">Total Travel Time Required</span>
            <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
              {formatTimeHMS(computedSeconds)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              At an average rate of {speedVal || 0} {speedUnit}, traversing {distanceVal || 0} {distUnit}.
            </p>
          </div>
        )}

        {solveTarget === 'distance' && (
          <div className="text-center py-2">
            <span className="text-xs font-bold text-zinc-400 block mb-1">Total Distance Traveled</span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
              {(computedDistMeters / 1000).toFixed(2)} km / {(computedDistMeters / 1609.344).toFixed(2)} mi
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Covered in {formatTimeHMS(totalInputSeconds)} at {speedVal || 0} {speedUnit}.
            </p>
          </div>
        )}

        {solveTarget === 'speed' && (
          <div className="text-center py-2">
            <span className="text-xs font-bold text-zinc-400 block mb-1">Required Average Speed</span>
            <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight">
              {(computedSpeedMps * 3.6).toFixed(1)} km/h / {(computedSpeedMps * 2.23694).toFixed(1)} mph
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              To cross {distanceVal || 0} {distUnit} within {formatTimeHMS(totalInputSeconds)}.
            </p>
          </div>
        )}

        {/* Step-by-Step Derivation Breakdown */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
          <span className="font-bold text-zinc-700 dark:text-zinc-300 block">
            Step-by-Step Solution Breakdown:
          </span>
          <div className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
            <div>
              1. Base Distance: {(computedDistMeters / 1000).toFixed(3)} km ({(computedDistMeters / 1609.344).toFixed(3)} miles = {Math.round(computedDistMeters).toLocaleString()} meters)
            </div>
            <div>
              2. Base Velocity: {(computedSpeedMps * 3.6).toFixed(2)} km/h ({(computedSpeedMps * 2.23694).toFixed(2)} mph = {computedSpeedMps.toFixed(3)} m/s)
            </div>
            <div>
              3. Kinematic Formula Applied:{' '}
              {solveTarget === 'time'
                ? `t = ${Math.round(computedDistMeters)}m / ${computedSpeedMps.toFixed(2)}m/s = ${Math.round(computedSeconds)} seconds`
                : solveTarget === 'distance'
                ? `d = ${computedSpeedMps.toFixed(2)}m/s × ${Math.round(computedSeconds)}s = ${Math.round(computedDistMeters)} meters`
                : `v = ${Math.round(computedDistMeters)}m / ${Math.round(computedSeconds)}s = ${computedSpeedMps.toFixed(2)} m/s`}
            </div>
          </div>
        </div>

        {/* Multi-Unit Comparative Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Speed (Knots)</span>
            <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {(computedSpeedMps * 1.94384).toFixed(2)} kn
            </span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Speed (ft/s)</span>
            <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {(computedSpeedMps * 3.28084).toFixed(2)} ft/s
            </span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Pace (/km)</span>
            <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {formatPace(paceSecPerKm)} min/km
            </span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Pace (/mile)</span>
            <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {formatPace(paceSecPerMile)} min/mi
            </span>
          </div>
        </div>

        {/* Journey Progress Milestones Bar */}
        {computedSeconds > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[11px] font-bold text-zinc-400">
              <span>Journey Milestones & Splits</span>
              <span>100% Arrival</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                <div className="font-bold">25% (1/4)</div>
                <div>{formatTimeHMS(computedSeconds * 0.25)}</div>
              </div>
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                <div className="font-bold">50% (Half)</div>
                <div>{formatTimeHMS(computedSeconds * 0.5)}</div>
              </div>
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                <div className="font-bold">75% (3/4)</div>
                <div>{formatTimeHMS(computedSeconds * 0.75)}</div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                <div className="font-bold">100% Goal</div>
                <div>{formatTimeHMS(computedSeconds)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// 4. World Clock & Time Zones (Item 26: Live Real-Time + Global World Capitals)
interface WorldCapital {
  city: string;
  country: string;
  continent: string;
  iana: string;
  flag: string;
}

const WORLD_CAPITALS: WorldCapital[] = [
  // Europe
  { city: 'London', country: 'United Kingdom', continent: 'Europe', iana: 'Europe/London', flag: '🇬🇧' },
  { city: 'Paris', country: 'France', continent: 'Europe', iana: 'Europe/Paris', flag: '🇫🇷' },
  { city: 'Berlin', country: 'Germany', continent: 'Europe', iana: 'Europe/Berlin', flag: '🇩🇪' },
  { city: 'Rome', country: 'Italy', continent: 'Europe', iana: 'Europe/Rome', flag: '🇮🇹' },
  { city: 'Madrid', country: 'Spain', continent: 'Europe', iana: 'Europe/Madrid', flag: '🇪🇸' },
  { city: 'Amsterdam', country: 'Netherlands', continent: 'Europe', iana: 'Europe/Amsterdam', flag: '🇳🇱' },
  { city: 'Brussels', country: 'Belgium', continent: 'Europe', iana: 'Europe/Brussels', flag: '🇧🇪' },
  { city: 'Bern', country: 'Switzerland', continent: 'Europe', iana: 'Europe/Zurich', flag: '🇨🇭' },
  { city: 'Vienna', country: 'Austria', continent: 'Europe', iana: 'Europe/Vienna', flag: '🇦🇹' },
  { city: 'Stockholm', country: 'Sweden', continent: 'Europe', iana: 'Europe/Stockholm', flag: '🇸🇪' },
  { city: 'Oslo', country: 'Norway', continent: 'Europe', iana: 'Europe/Oslo', flag: '🇳🇴' },
  { city: 'Helsinki', country: 'Finland', continent: 'Europe', iana: 'Europe/Helsinki', flag: '🇫🇮' },
  { city: 'Copenhagen', country: 'Denmark', continent: 'Europe', iana: 'Europe/Copenhagen', flag: '🇩🇰' },
  { city: 'Dublin', country: 'Ireland', continent: 'Europe', iana: 'Europe/Dublin', flag: '🇮🇪' },
  { city: 'Warsaw', country: 'Poland', continent: 'Europe', iana: 'Europe/Warsaw', flag: '🇵🇱' },
  { city: 'Lisbon', country: 'Portugal', continent: 'Europe', iana: 'Europe/Lisbon', flag: '🇵🇹' },
  { city: 'Athens', country: 'Greece', continent: 'Europe', iana: 'Europe/Athens', flag: '🇬🇷' },
  { city: 'Prague', country: 'Czechia', continent: 'Europe', iana: 'Europe/Prague', flag: '🇨🇿' },
  { city: 'Budapest', country: 'Hungary', continent: 'Europe', iana: 'Europe/Budapest', flag: '🇭🇺' },
  { city: 'Bucharest', country: 'Romania', continent: 'Europe', iana: 'Europe/Bucharest', flag: '🇷🇴' },

  // Americas
  { city: 'Washington, D.C.', country: 'United States', continent: 'Americas', iana: 'America/New_York', flag: '🇺🇸' },
  { city: 'Ottawa', country: 'Canada', continent: 'Americas', iana: 'America/Toronto', flag: '🇨🇦' },
  { city: 'Mexico City', country: 'Mexico', continent: 'Americas', iana: 'America/Mexico_City', flag: '🇲🇽' },
  { city: 'Brasília', country: 'Brazil', continent: 'Americas', iana: 'America/Sao_Paulo', flag: '🇧🇷' },
  { city: 'Buenos Aires', country: 'Argentina', continent: 'Americas', iana: 'America/Argentina/Buenos_Aires', flag: '🇦🇷' },
  { city: 'Santiago', country: 'Chile', continent: 'Americas', iana: 'America/Santiago', flag: '🇨🇱' },
  { city: 'Bogotá', country: 'Colombia', continent: 'Americas', iana: 'America/Bogota', flag: '🇨🇴' },
  { city: 'Lima', country: 'Peru', continent: 'Americas', iana: 'America/Lima', flag: '🇵🇪' },
  { city: 'Quito', country: 'Ecuador', continent: 'Americas', iana: 'America/Guayaquil', flag: '🇪🇨' },
  { city: 'Caracas', country: 'Venezuela', continent: 'Americas', iana: 'America/Caracas', flag: '🇻🇪' },
  { city: 'Montevideo', country: 'Uruguay', continent: 'Americas', iana: 'America/Montevideo', flag: '🇺🇾' },
  { city: 'San José', country: 'Costa Rica', continent: 'Americas', iana: 'America/Costa_Rica', flag: '🇨🇷' },
  { city: 'Panama City', country: 'Panama', continent: 'Americas', iana: 'America/Panama', flag: '🇵🇦' },

  // Asia
  { city: 'Tokyo', country: 'Japan', continent: 'Asia', iana: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: 'Beijing', country: 'China', continent: 'Asia', iana: 'Asia/Shanghai', flag: '🇨🇳' },
  { city: 'New Delhi', country: 'India', continent: 'Asia', iana: 'Asia/Kolkata', flag: '🇮🇳' },
  { city: 'Seoul', country: 'South Korea', continent: 'Asia', iana: 'Asia/Seoul', flag: '🇰🇷' },
  { city: 'Singapore', country: 'Singapore', continent: 'Asia', iana: 'Asia/Singapore', flag: '🇸🇬' },
  { city: 'Bangkok', country: 'Thailand', continent: 'Asia', iana: 'Asia/Bangkok', flag: '🇹🇭' },
  { city: 'Jakarta', country: 'Indonesia', continent: 'Asia', iana: 'Asia/Jakarta', flag: '🇮🇩' },
  { city: 'Kuala Lumpur', country: 'Malaysia', continent: 'Asia', iana: 'Asia/Kuala_Lumpur', flag: '🇲🇾' },
  { city: 'Manila', country: 'Philippines', continent: 'Asia', iana: 'Asia/Manila', flag: '🇵🇭' },
  { city: 'Hanoi', country: 'Vietnam', continent: 'Asia', iana: 'Asia/Ho_Chi_Minh', flag: '🇻🇳' },
  { city: 'Riyadh', country: 'Saudi Arabia', continent: 'Asia', iana: 'Asia/Riyadh', flag: '🇸🇦' },
  { city: 'Abu Dhabi', country: 'United Arab Emirates', continent: 'Asia', iana: 'Asia/Dubai', flag: '🇦🇪' },
  { city: 'Doha', country: 'Qatar', continent: 'Asia', iana: 'Asia/Qatar', flag: '🇶🇦' },
  { city: 'Jerusalem', country: 'Israel', continent: 'Asia', iana: 'Asia/Jerusalem', flag: '🇮🇱' },
  { city: 'Ankara', country: 'Turkey', continent: 'Asia', iana: 'Europe/Istanbul', flag: '🇹🇷' },
  { city: 'Islamabad', country: 'Pakistan', continent: 'Asia', iana: 'Asia/Karachi', flag: '🇵🇰' },
  { city: 'Dhaka', country: 'Bangladesh', continent: 'Asia', iana: 'Asia/Dhaka', flag: '🇧🇩' },

  // Oceania
  { city: 'Canberra', country: 'Australia', continent: 'Oceania', iana: 'Australia/Sydney', flag: '🇦🇺' },
  { city: 'Wellington', country: 'New Zealand', continent: 'Oceania', iana: 'Pacific/Auckland', flag: '🇳🇿' },
  { city: 'Suva', country: 'Fiji', continent: 'Oceania', iana: 'Pacific/Fiji', flag: '🇫🇯' },
  { city: 'Port Moresby', country: 'Papua New Guinea', continent: 'Oceania', iana: 'Pacific/Port_Moresby', flag: '🇵🇬' },

  // Africa
  { city: 'Cairo', country: 'Egypt', continent: 'Africa', iana: 'Africa/Cairo', flag: '🇪🇬' },
  { city: 'Pretoria', country: 'South Africa', continent: 'Africa', iana: 'Africa/Johannesburg', flag: '🇿🇦' },
  { city: 'Nairobi', country: 'Kenya', continent: 'Africa', iana: 'Africa/Nairobi', flag: '🇰🇪' },
  { city: 'Abuja', country: 'Nigeria', continent: 'Africa', iana: 'Africa/Lagos', flag: '🇳🇬' },
  { city: 'Addis Ababa', country: 'Ethiopia', continent: 'Africa', iana: 'Africa/Addis_Ababa', flag: '🇪🇹' },
  { city: 'Rabat', country: 'Morocco', continent: 'Africa', iana: 'Africa/Casablanca', flag: '🇲🇦' },
  { city: 'Accra', country: 'Ghana', continent: 'Africa', iana: 'Africa/Accra', flag: '🇬🇭' },
];

const WorldClockView: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [search, setSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [use24Hour, setUse24Hour] = useState(false);

  // Live real-time seconds ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCityTime = (iana: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: iana,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: !use24Hour,
      });

      const dayFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: iana,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      // Hour of day to determine day or night icon
      const hourPart = new Intl.DateTimeFormat('en-US', {
        timeZone: iana,
        hour: 'numeric',
        hourCycle: 'h23',
      }).format(now);
      const hour24 = parseInt(hourPart, 10);
      const isDaytime = hour24 >= 6 && hour24 < 18;

      return {
        timeStr: formatter.format(now),
        dateStr: dayFormatter.format(now),
        isDaytime,
      };
    } catch {
      return { timeStr: '--:--:--', dateStr: 'Invalid TZ', isDaytime: true };
    }
  };

  const continents = ['All', 'Europe', 'Americas', 'Asia', 'Oceania', 'Africa'];

  const filteredCapitals = WORLD_CAPITALS.filter(c => {
    const matchesContinent = selectedContinent === 'All' || c.continent === selectedContinent;
    const matchesQuery =
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase());
    return matchesContinent && matchesQuery;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Live Global World Clock & Time Zones
          </h2>
          <span className="text-[11px] text-zinc-400">
            Real-time live ticking clocks for world capitals across 6 continents
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUse24Hour(!use24Hour)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer shadow-2xs"
          >
            {use24Hour ? '24h Military' : '12h AM/PM'}
          </button>
        </div>
      </div>

      {/* Controls: Search & Continent Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search capital city or nation (e.g. Tokyo, Paris, Canada, Brazil)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium focus:outline-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {continents.map(c => (
            <button
              key={c}
              onClick={() => {
                sounds.playClick();
                setSelectedContinent(c);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedContinent === c
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto text-xs text-zinc-400 self-center font-mono">
            {filteredCapitals.length} capitals
          </span>
        </div>
      </div>

      {/* Capitals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredCapitals.map(item => {
          const { timeStr, dateStr, isDaytime } = formatCityTime(item.iana);
          return (
            <div
              key={item.city}
              className="p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{item.flag}</span>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{item.city}</h4>
                  </div>
                  <span className="text-[11px] text-zinc-500 truncate block max-w-[140px]">{item.country}</span>
                </div>

                <span
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-semibold ${
                    isDaytime
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                      : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  }`}
                  title={isDaytime ? 'Daytime' : 'Nighttime'}
                >
                  {isDaytime ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </span>
              </div>

              <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-between items-baseline">
                <span className="font-mono text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {timeStr}
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">{dateStr}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
