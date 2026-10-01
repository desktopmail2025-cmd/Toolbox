import React, { useState, useEffect } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Globe, Search, Clock, Sun, Moon, Sparkles } from 'lucide-react';
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
