import React, { useState } from 'react';
import { ResultCard } from '../common/ResultCard';

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

// 3. Speed, Distance & Time Solver
const SpeedDistTimeView: React.FC = () => {
  const [speed, setSpeed] = useState<string>('65');
  const [distance, setDistance] = useState<string>('260');
  const [timeHrs, setTimeHrs] = useState<string>('');

  const solve = () => {
    const s = parseFloat(speed);
    const d = parseFloat(distance);
    const t = parseFloat(timeHrs);

    if (s && d && !t) {
      const calcT = d / s;
      const h = Math.floor(calcT);
      const m = Math.round((calcT - h) * 60);
      return `${h}h ${m}m (${calcT.toFixed(2)} hrs)`;
    }
    if (s && t && !d) {
      return `${(s * t).toFixed(1)} miles / km`;
    }
    if (d && t && !s) {
      return `${(d / t).toFixed(1)} mph / km/h`;
    }
    return 'Provide any 2 values';
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Average Speed</label>
          <input
            type="number"
            placeholder="e.g. 65"
            value={speed}
            onChange={e => setSpeed(e.target.value)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Distance</label>
          <input
            type="number"
            placeholder="e.g. 260"
            value={distance}
            onChange={e => setDistance(e.target.value)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Time (Hours)</label>
          <input
            type="number"
            placeholder="Calculated"
            value={timeHrs}
            onChange={e => setTimeHrs(e.target.value)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <ResultCard label="Calculated Travel Output" value={solve()} highlight />
    </div>
  );
};

// 4. World Clock & Time Zones
const WorldClockView: React.FC = () => {
  const [sliderHour, setSliderHour] = useState(new Date().getUTCHours());

  const cities = [
    { name: 'London (UTC+0)', offset: 0 },
    { name: 'Paris / Berlin (UTC+1)', offset: 1 },
    { name: 'Dubai (UTC+4)', offset: 4 },
    { name: 'Tokyo (UTC+9)', offset: 9 },
    { name: 'Sydney (UTC+10)', offset: 10 },
    { name: 'New York (UTC-5)', offset: -5 },
    { name: 'San Francisco (UTC-8)', offset: -8 },
  ];

  const formatHour = (utcH: number, offset: number) => {
    let h = (utcH + offset) % 24;
    if (h < 0) h += 24;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:00 ${period}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span>UTC Time Horizon: {sliderHour}:00 UTC</span>
          <span className="text-zinc-400">Drag to test meetings</span>
        </div>
        <input
          type="range"
          min={0}
          max={23}
          value={sliderHour}
          onChange={e => setSliderHour(parseInt(e.target.value))}
          className="w-full accent-zinc-900 dark:accent-zinc-100"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cities.map(c => (
          <div
            key={c.name}
            className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{c.name}</span>
            <span className="font-mono font-bold text-base text-zinc-900 dark:text-zinc-50">
              {formatHour(sliderHour, c.offset)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
