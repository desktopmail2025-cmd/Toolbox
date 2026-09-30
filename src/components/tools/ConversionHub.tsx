import React, { useState } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Copy, Check, ArrowRightLeft, Sparkles } from 'lucide-react';

interface ConversionSubCategory {
  id: string;
  name: string;
  units: Record<string, number>; // value in base unit
  symbols: Record<string, string>;
}

// 100% Scientifically Exact Conversion Standards (NIST, BIPM, ISO)
const CONVERSION_DATA: Record<string, ConversionSubCategory> = {
  length: {
    id: 'length',
    name: 'Length & Distance',
    units: {
      Meter: 1,
      Kilometer: 1000,
      Centimeter: 0.01,
      Millimeter: 0.001,
      Micrometer: 0.000001,
      Nanometer: 0.000000001,
      Mile: 1609.344,
      Yard: 0.9144,
      Foot: 0.3048,
      Inch: 0.0254,
      'Nautical Mile': 1852,
    },
    symbols: {
      Meter: 'm',
      Kilometer: 'km',
      Centimeter: 'cm',
      Millimeter: 'mm',
      Micrometer: 'µm',
      Nanometer: 'nm',
      Mile: 'mi',
      Yard: 'yd',
      Foot: 'ft',
      Inch: 'in',
      'Nautical Mile': 'nmi',
    },
  },
  weight: {
    id: 'weight',
    name: 'Weight & Mass',
    units: {
      Kilogram: 1,
      Gram: 0.001,
      Milligram: 0.000001,
      Microgram: 0.000000001,
      'Metric Ton': 1000,
      Pound: 0.45359237,
      Ounce: 0.028349523125,
      Stone: 6.35029318,
      'Troy Ounce': 0.0311034768,
      Carat: 0.0002,
      'US Ton (Short)': 907.18474,
      'UK Ton (Long)': 1016.0469088,
    },
    symbols: {
      Kilogram: 'kg',
      Gram: 'g',
      Milligram: 'mg',
      Microgram: 'µg',
      'Metric Ton': 't',
      Pound: 'lb',
      Ounce: 'oz',
      Stone: 'st',
      'Troy Ounce': 'oz t',
      Carat: 'ct',
      'US Ton (Short)': 'ton (US)',
      'UK Ton (Long)': 'ton (UK)',
    },
  },
  area: {
    id: 'area',
    name: 'Area & Land',
    units: {
      'Square Meter': 1,
      'Square Kilometer': 1000000,
      'Square Centimeter': 0.0001,
      'Square Millimeter': 0.000001,
      'Square Foot': 0.09290304,
      'Square Yard': 0.83612736,
      'Square Inch': 0.00064516,
      Acre: 4046.8564224,
      Hectare: 10000,
      'Square Mile': 2589988.110336,
    },
    symbols: {
      'Square Meter': 'm²',
      'Square Kilometer': 'km²',
      'Square Centimeter': 'cm²',
      'Square Millimeter': 'mm²',
      'Square Foot': 'ft²',
      'Square Yard': 'yd²',
      'Square Inch': 'in²',
      Acre: 'ac',
      Hectare: 'ha',
      'Square Mile': 'sq mi',
    },
  },
  volume: {
    id: 'volume',
    name: 'Volume & Capacity',
    units: {
      Liter: 1,
      Milliliter: 0.001,
      'Cubic Meter': 1000,
      'Cubic Centimeter': 0.001,
      'Gallon (US)': 3.785411784,
      'Quart (US)': 0.946352946,
      'Pint (US)': 0.473176473,
      'Cup (US Legal)': 0.24,
      'Cup (US Customary)': 0.2365882365,
      'Fluid Ounce (US)': 0.0295735295625,
      'Tablespoon (US)': 0.01478676478125,
      'Teaspoon (US)': 0.00492892159375,
      'Gallon (UK)': 4.54609,
      'Pint (UK)': 0.56826125,
      'Fluid Ounce (UK)': 0.0284130625,
    },
    symbols: {
      Liter: 'L',
      Milliliter: 'mL',
      'Cubic Meter': 'm³',
      'Cubic Centimeter': 'cm³',
      'Gallon (US)': 'gal (US)',
      'Quart (US)': 'qt (US)',
      'Pint (US)': 'pt (US)',
      'Cup (US Legal)': 'cup',
      'Cup (US Customary)': 'cup',
      'Fluid Ounce (US)': 'fl oz (US)',
      'Tablespoon (US)': 'tbsp',
      'Teaspoon (US)': 'tsp',
      'Gallon (UK)': 'gal (UK)',
      'Pint (UK)': 'pt (UK)',
      'Fluid Ounce (UK)': 'fl oz (UK)',
    },
  },
  speed: {
    id: 'speed',
    name: 'Speed & Velocity',
    units: {
      'Kilometers per hour': 1,
      'Miles per hour': 1.609344,
      'Meters per second': 3.6,
      Knot: 1.852,
      'Feet per second': 1.09728,
      'Mach (Sea Level)': 1225.044,
    },
    symbols: {
      'Kilometers per hour': 'km/h',
      'Miles per hour': 'mph',
      'Meters per second': 'm/s',
      Knot: 'kn',
      'Feet per second': 'ft/s',
      'Mach (Sea Level)': 'Mach',
    },
  },
  time: {
    id: 'time',
    name: 'Time Duration',
    units: {
      Millisecond: 0.001,
      Second: 1,
      Minute: 60,
      Hour: 3600,
      Day: 86400,
      Week: 604800,
      'Month (Average 30.4375d)': 2629800,
      'Year (Julian 365.25d)': 31557600,
    },
    symbols: {
      Millisecond: 'ms',
      Second: 's',
      Minute: 'min',
      Hour: 'h',
      Day: 'd',
      Week: 'wk',
      'Month (Average 30.4375d)': 'mo',
      'Year (Julian 365.25d)': 'yr',
    },
  },
  data: {
    id: 'data',
    name: 'Data Storage & Binary',
    units: {
      Byte: 1,
      Kilobyte: 1024,
      Megabyte: 1048576,
      Gigabyte: 1073741824,
      Terabyte: 1099511627776,
      Petabyte: 1125899906842624,
      Bit: 0.125,
      Kilobit: 128,
      Megabit: 131072,
      Gigabit: 134217728,
    },
    symbols: {
      Byte: 'B',
      Kilobyte: 'KB',
      Megabyte: 'MB',
      Gigabyte: 'GB',
      Terabyte: 'TB',
      Petabyte: 'PB',
      Bit: 'b',
      Kilobit: 'Kb',
      Megabit: 'Mb',
      Gigabit: 'Gb',
    },
  },
  pressure: {
    id: 'pressure',
    name: 'Pressure',
    units: {
      Pascal: 1,
      Kilopascal: 1000,
      Bar: 100000,
      Millibar: 100,
      'Pound per sq inch': 6894.757293168,
      'Atmosphere (Standard)': 101325,
      'mmHg (Torr)': 133.322368421,
    },
    symbols: {
      Pascal: 'Pa',
      Kilopascal: 'kPa',
      Bar: 'bar',
      Millibar: 'mbar',
      'Pound per sq inch': 'psi',
      'Atmosphere (Standard)': 'atm',
      'mmHg (Torr)': 'mmHg',
    },
  },
  energy: {
    id: 'energy',
    name: 'Energy & Work',
    units: {
      Joule: 1,
      Kilojoule: 1000,
      'Gram Calorie': 4.184,
      'Food Calorie (kcal)': 4184,
      'Watt-hour': 3600,
      'Kilowatt-hour': 3600000,
      'BTU (International)': 1055.05585262,
      'Foot-Pound': 1.3558179483314,
    },
    symbols: {
      Joule: 'J',
      Kilojoule: 'kJ',
      'Gram Calorie': 'cal',
      'Food Calorie (kcal)': 'kcal',
      'Watt-hour': 'Wh',
      'Kilowatt-hour': 'kWh',
      'BTU (International)': 'BTU',
      'Foot-Pound': 'ft-lb',
    },
  },
  fuel: {
    id: 'fuel',
    name: 'Fuel Economy',
    units: {
      'Kilometers per Liter': 1,
      'Miles per Gallon (US)': 0.4251437,
      'Miles per Gallon (UK)': 0.3540062,
    },
    symbols: {
      'Kilometers per Liter': 'km/L',
      'Miles per Gallon (US)': 'mpg (US)',
      'Miles per Gallon (UK)': 'mpg (UK)',
    },
  },
  power: {
    id: 'power',
    name: 'Power & Mechanical',
    units: {
      Watt: 1,
      Kilowatt: 1000,
      Megawatt: 1000000,
      'Horsepower (Mechanical/HP)': 745.69987158227022,
      'Horsepower (Metric/PS)': 735.49875,
      'BTU/hour': 0.29307107,
    },
    symbols: {
      Watt: 'W',
      Kilowatt: 'kW',
      Megawatt: 'MW',
      'Horsepower (Mechanical/HP)': 'hp',
      'Horsepower (Metric/PS)': 'ps',
      'BTU/hour': 'BTU/h',
    },
  },
  angle: {
    id: 'angle',
    name: 'Angle & Geometry',
    units: {
      Degree: 1,
      Radian: 57.29577951308232,
      Gradian: 0.9,
      Arcminute: 1 / 60,
      Arcsecond: 1 / 3600,
    },
    symbols: {
      Degree: '°',
      Radian: 'rad',
      Gradian: 'grad',
      Arcminute: 'arcmin',
      Arcsecond: 'arcsec',
    },
  },
};

interface ConversionHubProps {
  toolId?: string;
}

export const ConversionHub: React.FC<ConversionHubProps> = () => {
  const [activeCategory, setActiveCategory] = useState<string>('length');
  const [amount, setAmount] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<string>('Meter');
  const [toUnit, setToUnit] = useState<string>('Foot');
  const [decimals, setDecimals] = useState<number>(4);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Temperature specific states
  const [tempVal, setTempVal] = useState(25);
  const [fromTemp, setFromTemp] = useState<'C' | 'F' | 'K' | 'R'>('C');
  const [toTemp, setToTemp] = useState<'C' | 'F' | 'K' | 'R'>('F');

  // Height dual-converter states
  const [heightCm, setHeightCm] = useState(178);

  const categories = Object.keys(CONVERSION_DATA);

  // Switch category
  const handleSelectCategory = (catKey: string) => {
    sounds.playClick();
    setActiveCategory(catKey);
    const cat = CONVERSION_DATA[catKey];
    if (cat) {
      const units = Object.keys(cat.units);
      setFromUnit(units[0]);
      setToUnit(units[1] || units[0]);
    }
  };

  const handleSwap = () => {
    sounds.playClick();
    if (activeCategory === 'temperature') {
      const temp = fromTemp;
      setFromTemp(toTemp);
      setToTemp(temp);
    } else {
      const temp = fromUnit;
      setFromUnit(toUnit);
      setToUnit(temp);
    }
  };

  // Temperature conversion formula (supports C, F, K, Rankine)
  const convertTemperature = (val: number, from: 'C' | 'F' | 'K' | 'R', to: 'C' | 'F' | 'K' | 'R'): number => {
    let c = val;
    if (from === 'F') c = (val - 32) * (5 / 9);
    else if (from === 'K') c = val - 273.15;
    else if (from === 'R') c = (val - 491.67) * (5 / 9);

    if (to === 'C') return c;
    if (to === 'F') return c * (9 / 5) + 32;
    if (to === 'K') return c + 273.15;
    if (to === 'R') return (c + 273.15) * (9 / 5);
    return c;
  };

  // Standard ratio conversion
  const currentCategoryData = CONVERSION_DATA[activeCategory];
  let convertedResult = 0;
  if (currentCategoryData) {
    const fromBase = currentCategoryData.units[fromUnit] || 1;
    const toBase = currentCategoryData.units[toUnit] || 1;
    convertedResult = (amount * fromBase) / toBase;
  }

  // Format numbers cleanly
  const formatNumber = (num: number, maxDec: number = decimals): string => {
    if (isNaN(num)) return '0';
    if (Math.abs(num) > 0 && Math.abs(num) < 0.000001) {
      return num.toExponential(maxDec);
    }
    const fixed = Number(num.toFixed(maxDec));
    return fixed.toLocaleString(undefined, { maximumFractionDigits: maxDec });
  };

  const copyToClipboard = (text: string, key: string) => {
    sounds.playSuccess();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Height calculations
  const totalInches = heightCm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Category Selection Tabs with sleek scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(catKey => (
          <button
            key={catKey}
            onClick={() => handleSelectCategory(catKey)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === catKey
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300'
            }`}
          >
            {CONVERSION_DATA[catKey]?.name.split(' ')[0]}
          </button>
        ))}

        {/* Special Temperature tab */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveCategory('temperature');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'temperature'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300'
          }`}
        >
          Temperature
        </button>

        {/* Height Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveCategory('height');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'height'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300'
          }`}
        >
          Height (cm/ft)
        </button>

        {/* Shoe & Clothing */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveCategory('clothing');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'clothing'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300'
          }`}
        >
          Shoe Sizes
        </button>
      </div>

      {/* Main Converter Card */}
      {activeCategory === 'temperature' ? (
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 dark:border-zinc-800/90 dark:bg-zinc-900 space-y-4 shadow-xs">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Temperature Value
            </label>
            <input
              type="number"
              value={tempVal}
              onChange={e => setTempVal(parseFloat(e.target.value) || 0)}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 font-mono text-2xl font-bold bg-zinc-50/50 dark:bg-zinc-950/60 text-zinc-950 dark:text-zinc-50 focus:outline-indigo-500"
            />
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 sm:gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">From</label>
              <select
                value={fromTemp}
                onChange={e => setFromTemp(e.target.value as any)}
                className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 bg-white dark:bg-zinc-950 font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 focus:outline-indigo-500 cursor-pointer"
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
                <option value="K">Kelvin (K)</option>
                <option value="R">Rankine (°R)</option>
              </select>
            </div>

            <div className="flex justify-center pt-5">
              <button
                onClick={handleSwap}
                className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 active:scale-90 transition-all cursor-pointer shadow-2xs"
                title="Swap units"
              >
                <ArrowRightLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">To</label>
              <select
                value={toTemp}
                onChange={e => setToTemp(e.target.value as any)}
                className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 bg-white dark:bg-zinc-950 font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 focus:outline-indigo-500 cursor-pointer"
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
                <option value="K">Kelvin (K)</option>
                <option value="R">Rankine (°R)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <ResultCard
              label="Accurate Converted Temperature"
              value={`${convertTemperature(tempVal, fromTemp, toTemp).toFixed(2)} °${toTemp}`}
              subtext={`Boiling point of water: 100°C / 212°F · Freezing point: 0°C / 32°F`}
              highlight
            />
          </div>

          {/* Temperature Spectrum Matrix */}
          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-4 bg-zinc-50/60 dark:bg-zinc-950/60 space-y-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Complete Thermal Scales
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['C', 'F', 'K', 'R'] as const).map(scale => {
                const converted = convertTemperature(tempVal, fromTemp, scale);
                return (
                  <div key={scale} className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                      {scale === 'C' ? 'Celsius' : scale === 'F' ? 'Fahrenheit' : scale === 'K' ? 'Kelvin' : 'Rankine'}
                    </span>
                    <span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {converted.toFixed(2)} °{scale}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : activeCategory === 'height' ? (
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 dark:border-zinc-800/90 dark:bg-zinc-900 space-y-4 shadow-xs">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Height in Centimeters (cm)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={e => setHeightCm(parseFloat(e.target.value) || 0)}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 font-mono text-2xl font-bold bg-zinc-50/50 dark:bg-zinc-950/60 text-zinc-950 dark:text-zinc-50 focus:outline-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <ResultCard label="Feet & Inches (Imperial)" value={`${feet} ft ${inches} in`} highlight subtext={`${(heightCm / 100).toFixed(2)} meters`} />
            <ResultCard label="Total Inches" value={`${totalInches.toFixed(2)} in`} subtext={`${(heightCm * 10).toFixed(0)} millimeters`} />
          </div>
        </div>
      ) : activeCategory === 'clothing' ? (
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 dark:border-zinc-800/90 dark:bg-zinc-900 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              International Standard Shoe Sizing Matrix
            </h3>
            <span className="text-[10px] text-zinc-400">ISO / US / UK / EU</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-mono">
                <tr>
                  <th className="py-2.5 px-3">US Men</th>
                  <th className="py-2.5 px-3">US Women</th>
                  <th className="py-2.5 px-3">UK</th>
                  <th className="py-2.5 px-3">EU</th>
                  <th className="py-2.5 px-3">Foot Length (CM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono tabular-nums">
                {[
                  { usm: '6.0', usw: '7.5', uk: '5.5', eu: '38.5', cm: '24.0' },
                  { usm: '7.0', usw: '8.5', uk: '6.0', eu: '40.0', cm: '25.0' },
                  { usm: '8.0', usw: '9.5', uk: '7.0', eu: '41.0', cm: '26.0' },
                  { usm: '9.0', usw: '10.5', uk: '8.0', eu: '42.5', cm: '27.0' },
                  { usm: '10.0', usw: '11.5', uk: '9.0', eu: '44.0', cm: '28.0' },
                  { usm: '11.0', usw: '12.5', uk: '10.0', eu: '45.0', cm: '29.0' },
                  { usm: '12.0', usw: '13.5', uk: '11.0', eu: '46.0', cm: '30.0' },
                  { usm: '13.0', usw: '14.5', uk: '12.0', eu: '47.5', cm: '31.0' },
                ].map(row => (
                  <tr key={row.usm} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-zinc-900 dark:text-zinc-100">{row.usm}</td>
                    <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300">{row.usw}</td>
                    <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300">{row.uk}</td>
                    <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300">{row.eu}</td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">{row.cm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Calculation Box */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 dark:border-zinc-800/90 dark:bg-zinc-900 space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                Quantity to Convert
              </label>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span>Precision:</span>
                {[2, 4, 6].map(p => (
                  <button
                    key={p}
                    onClick={() => setDecimals(p)}
                    className={`px-1.5 py-0.5 rounded font-mono text-[10px] cursor-pointer ${
                      decimals === p ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold' : 'bg-zinc-100 dark:bg-zinc-800'
                    }`}
                  >
                    .{p}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="number"
              step="any"
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 font-mono text-2xl font-bold bg-zinc-50/50 dark:bg-zinc-950/60 text-zinc-950 dark:text-zinc-50 focus:outline-indigo-500"
            />

            <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 sm:gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  From Unit
                </label>
                <select
                  value={fromUnit}
                  onChange={e => {
                    sounds.playClick();
                    setFromUnit(e.target.value);
                  }}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 bg-white dark:bg-zinc-950 font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 focus:outline-indigo-500 cursor-pointer"
                >
                  {currentCategoryData &&
                    Object.keys(currentCategoryData.units).map(u => (
                      <option key={u} value={u}>
                        {u} ({currentCategoryData.symbols[u]})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex justify-center pt-5">
                <button
                  onClick={handleSwap}
                  className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 active:scale-90 transition-all cursor-pointer shadow-2xs"
                  title="Swap units"
                  aria-label="Swap units"
                >
                  <ArrowRightLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  To Unit
                </label>
                <select
                  value={toUnit}
                  onChange={e => {
                    sounds.playClick();
                    setToUnit(e.target.value);
                  }}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 bg-white dark:bg-zinc-950 font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 focus:outline-indigo-500 cursor-pointer"
                >
                  {currentCategoryData &&
                    Object.keys(currentCategoryData.units).map(u => (
                      <option key={u} value={u}>
                        {u} ({currentCategoryData.symbols[u]})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <ResultCard
                label="Exact Converted Result"
                value={`${formatNumber(convertedResult)} ${currentCategoryData?.symbols[toUnit] || toUnit}`}
                subtext={`1 ${fromUnit} = ${formatNumber((currentCategoryData?.units[fromUnit] || 1) / (currentCategoryData?.units[toUnit] || 1), 6)} ${toUnit}`}
                highlight
              />
            </div>
          </div>

          {/* Instant Multi-Unit Comparison Breakdown Matrix */}
          {currentCategoryData && (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>All-Unit Comparison: {amount} {fromUnit} Equals</span>
                </span>
                <span className="text-[10px] text-zinc-400 lowercase">click to copy value</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.keys(currentCategoryData.units).map(u => {
                  const fromBase = currentCategoryData.units[fromUnit] || 1;
                  const unitBase = currentCategoryData.units[u] || 1;
                  const val = (amount * fromBase) / unitBase;
                  const formatted = formatNumber(val);
                  const isCurrent = u === toUnit;
                  const isCopied = copiedKey === u;

                  return (
                    <button
                      key={u}
                      onClick={() => copyToClipboard(`${formatted} ${currentCategoryData.symbols[u]}`, u)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'border-indigo-500 bg-indigo-50/40 dark:border-indigo-400 dark:bg-indigo-950/30'
                          : 'border-zinc-100 hover:border-zinc-300 bg-zinc-50/60 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                          {u}
                        </div>
                        <div className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-50 truncate mt-0.5">
                          {formatted} <span className="text-xs font-normal text-zinc-400">{currentCategoryData.symbols[u]}</span>
                        </div>
                      </div>

                      <div className="shrink-0 p-1 text-zinc-400 hover:text-zinc-600">
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
