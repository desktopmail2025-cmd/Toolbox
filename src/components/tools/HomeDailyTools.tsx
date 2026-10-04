import React, { useState, useEffect, useRef } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Edit2,
  Check,
  X,
  Zap,
  Droplets,
  Flame,
  Fuel,
  Monitor,
} from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const HomeDailyTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'smart-lists':
      return <SmartListsView />;
    case 'home-inventory':
      return <HomeInventoryView />;
    case 'room-area-calc':
      return <RoomAreaCalcView />;
    case 'electricity-cost-calc':
      return <ElectricityCostCalcView />;
    case 'kitchen-timer':
      return <KitchenTimerView />;
    case 'recipe-scaler':
      return <RecipeScalerView />;
    default:
      return <SmartListsView />;
  }
};

// 1. Smart Lists (Grocery, To-Do, Packing, Shopping)
interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

const SmartListsView: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'grocery' | 'todo' | 'packing' | 'shopping'>('grocery');
  const [items, setItems] = useState<ListItem[]>(() => {
    try {
      const raw = localStorage.getItem('omni_smart_lists');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [
      { id: '1', text: 'Whole milk & Greek yogurt', completed: false, category: 'grocery' },
      { id: '2', text: 'Fresh bananas and apples', completed: true, category: 'grocery' },
      { id: '3', text: 'Review quarterly electric bill', completed: false, category: 'todo' },
      { id: '4', text: 'Passport & international adapter', completed: false, category: 'packing' },
    ];
  });

  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    localStorage.setItem('omni_smart_lists', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!inputVal.trim()) return;
    sounds.playClick();
    setItems([
      ...items,
      { id: String(Date.now()), text: inputVal.trim(), completed: false, category: currentTab },
    ]);
    setInputVal('');
  };

  const toggleItem = (id: string) => {
    sounds.playClick();
    setItems(items.map(it => (it.id === id ? { ...it, completed: !it.completed } : it)));
  };

  const removeItem = (id: string) => {
    sounds.playClick();
    setItems(items.filter(it => it.id !== id));
  };

  const clearCompleted = () => {
    sounds.playClick();
    setItems(items.filter(it => !(it.category === currentTab && it.completed)));
  };

  const currentItems = items.filter(it => it.category === currentTab);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold">
        {(['grocery', 'shopping', 'todo', 'packing'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { sounds.playClick(); setCurrentTab(tab); }}
            className={`flex-1 py-1.5 rounded-lg capitalize transition-colors ${
              currentTab === tab ? 'bg-white dark:bg-zinc-700 shadow-xs font-bold text-zinc-950 dark:text-white' : 'text-zinc-500'
            }`}
          >
            {tab === 'grocery' ? '🛒 Grocery' : tab === 'shopping' ? '🛍️ Shopping' : tab === 'todo' ? '✅ To-Do' : '🧳 Packing'}
          </button>
        ))}
      </div>

      {/* Add input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          placeholder={`Add item to ${currentTab} list...`}
          className="flex-1 border rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        />
        <button
          onClick={addItem}
          className="px-4 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold rounded-xl text-xs hover:opacity-90 transition-opacity"
        >
          Add
        </button>
      </div>

      {/* List content */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
          <span>{currentItems.filter(i => i.completed).length} of {currentItems.length} checked</span>
          {currentItems.some(i => i.completed) && (
            <button onClick={clearCompleted} className="text-zinc-400 hover:text-red-500">
              Clear Completed
            </button>
          )}
        </div>

        {currentItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">
            No items in this list yet. Add one above!
          </div>
        ) : (
          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {currentItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                  )}
                  <span className={`text-sm ${item.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {item.text}
                  </span>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    removeItem(item.id);
                  }}
                  className="p-1 text-zinc-300 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Home Inventory Tracker
interface InventoryItem {
  id: string;
  name: string;
  room: string;
  value: number;
}

const HomeInventoryView: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([
    { id: '1', name: 'Living Room 65" OLED TV', room: 'Living Room', value: 1800 },
    { id: '2', name: 'Espresso Coffee Machine', room: 'Kitchen', value: 750 },
    { id: '3', name: 'Ergonomic Work Desk', room: 'Office', value: 500 },
  ]);

  const [name, setName] = useState('');
  const [room, setRoom] = useState('Living Room');
  const [value, setValue] = useState('');

  const addItem = () => {
    if (!name.trim()) return;
    sounds.playClick();
    setItems([
      ...items,
      { id: String(Date.now()), name: name.trim(), room, value: parseFloat(value) || 0 },
    ]);
    setName('');
    setValue('');
  };

  const removeItem = (id: string) => {
    sounds.playClick();
    setItems(items.filter(i => i.id !== id));
  };

  const totalValue = items.reduce((sum, i) => sum + i.value, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Record New Asset</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Item (e.g. Laptop)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="sm:col-span-2 border rounded-xl px-3 py-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
          <select
            value={room}
            onChange={e => setRoom(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          >
            {['Living Room', 'Kitchen', 'Bedroom', 'Office', 'Garage', 'Basement'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Value ($)"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <button
          onClick={addItem}
          className="w-full py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-xl hover:opacity-90"
        >
          Add to Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard label="Total Insured Value" value={`$${totalValue.toLocaleString()}`} highlight />
        <ResultCard label="Cataloged Assets" value={`${items.length} items`} />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Itemized Records</h4>
        {items.map(it => (
          <div key={it.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-xs">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{it.name}</span>
              <p className="text-[11px] text-zinc-500">{it.room}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold">${it.value.toLocaleString()}</span>
              <button onClick={() => removeItem(it.id)} className="text-zinc-400 hover:text-red-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Room Area & Floor Dimension Calculator
const RoomAreaCalcView: React.FC = () => {
  const [length, setLength] = useState(15);
  const [width, setWidth] = useState(12);
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');

  const area = length * width;
  const perimeter = 2 * (length + width);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex gap-2">
          {(['ft', 'm'] as const).map(u => (
            <button
              key={u}
              onClick={() => { sounds.playClick(); setUnit(u); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${unit === u ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}
            >
              {u === 'ft' ? 'Feet (ft)' : 'Meters (m)'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Room Length ({unit})</label>
            <input
              type="number"
              value={length}
              onChange={e => setLength(parseFloat(e.target.value) || 0)}
              className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Room Width ({unit})</label>
            <input
              type="number"
              value={width}
              onChange={e => setWidth(parseFloat(e.target.value) || 0)}
              className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Floor Area" value={`${area.toFixed(2)} sq ${unit}`} highlight />
        <ResultCard label="Perimeter (Baseboards)" value={`${perimeter.toFixed(2)} ${unit}`} />
      </div>
    </div>
  );
};

// 4. Comprehensive Cost Calculator Suite (Electricity, Water, Natural Gas, Vehicle Commute & Subscriptions)
type CostTab = 'electricity' | 'water' | 'gas' | 'commute' | 'subscriptions';

const APPLIANCE_PRESETS = [
  { name: 'Central Air Conditioner', watts: 3500, defaultHours: 8 },
  { name: 'Electric Space Heater', watts: 1500, defaultHours: 6 },
  { name: 'Gaming Desktop PC', watts: 550, defaultHours: 5 },
  { name: 'Refrigerator / Freezer', watts: 180, defaultHours: 24 },
  { name: 'Electric Oven / Stove', watts: 2400, defaultHours: 1.5 },
  { name: 'Level 2 EV Home Charger', watts: 7680, defaultHours: 3 },
  { name: 'Clothes Dryer', watts: 3000, defaultHours: 1 },
  { name: 'Washing Machine', watts: 500, defaultHours: 1 },
  { name: 'Microwave Oven', watts: 1200, defaultHours: 0.5 },
  { name: 'Home Entertainment / TV', watts: 150, defaultHours: 6 },
];

const ElectricityCostCalcView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CostTab>('electricity');

  // 1. Electricity & Appliance State
  const [wattage, setWattage] = useState(1500);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [ratePerKwh, setRatePerKwh] = useState(0.16); // $0.16/kWh
  const [selectedAppliance, setSelectedAppliance] = useState('Electric Space Heater');

  const dailyKwh = (wattage * hoursPerDay) / 1000;
  const dailyCost = dailyKwh * ratePerKwh;
  const monthlyCost = dailyCost * 30;
  const yearlyCost = dailyCost * 365;

  const handleSelectAppliance = (preset: typeof APPLIANCE_PRESETS[0]) => {
    sounds.playClick();
    setSelectedAppliance(preset.name);
    setWattage(preset.watts);
    setHoursPerDay(preset.defaultHours);
  };

  // 2. Water Utility Bill State
  const [householdPeople, setHouseholdPeople] = useState(3);
  const [showerMinutes, setShowerMinutes] = useState(10);
  const [showerHeadGpm, setShowerHeadGpm] = useState(2.0); // 2.0 gal/min
  const [flushesPerPerson, setFlushesPerPerson] = useState(5);
  const [toiletGpf, setToiletGpf] = useState(1.6); // 1.6 gal/flush
  const [laundryLoadsWeek, setLaundryLoadsWeek] = useState(4);
  const [waterRatePerThousandGal, setWaterRatePerThousandGal] = useState(7.5); // $7.50 per 1,000 gal

  const dailyShowerGal = householdPeople * showerMinutes * showerHeadGpm;
  const dailyToiletGal = householdPeople * flushesPerPerson * toiletGpf;
  const dailyLaundryGal = (laundryLoadsWeek * 25) / 7; // ~25 gal per load
  const dailyMiscGal = householdPeople * 10; // sink, dishwasher, cooking ~10 gal/person
  const totalDailyGal = dailyShowerGal + dailyToiletGal + dailyLaundryGal + dailyMiscGal;
  const monthlyWaterGal = totalDailyGal * 30;
  const monthlyWaterCost = (monthlyWaterGal / 1000) * waterRatePerThousandGal;
  const yearlyWaterCost = monthlyWaterCost * 12;

  // 3. Natural Gas & Heating State
  const [furnaceBtu, setFurnaceBtu] = useState(80000); // 80,000 BTU/hr furnace
  const [furnaceAfue, setFurnaceAfue] = useState(92); // 92% high efficiency
  const [heatHoursPerDay, setHeatHoursPerDay] = useState(6);
  const [gasRatePerTherm, setGasRatePerTherm] = useState(1.45); // $1.45/therm
  const [heatingMonths, setHeatingMonths] = useState(5); // 5 winter months

  // 1 therm = 100,000 BTU input
  const thermsPerHour = furnaceBtu / 100000;
  const dailyTherms = thermsPerHour * heatHoursPerDay;
  const monthlyTherms = dailyTherms * 30;
  const monthlyGasCost = monthlyTherms * gasRatePerTherm;
  const seasonGasCost = monthlyGasCost * heatingMonths;

  // 4. Vehicle Commute (Gas vs EV) State
  const [dailyCommuteMiles, setDailyCommuteMiles] = useState(35);
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState(22);
  const [gasPricePerGallon, setGasPricePerGallon] = useState(3.65);
  const [gasCarMpg, setGasCarMpg] = useState(28);
  const [evKwhPer100Miles, setEvKwhPer100Miles] = useState(30); // 30 kWh / 100 mi
  const [evElectricRate, setEvElectricRate] = useState(0.16);

  const monthlyMiles = dailyCommuteMiles * workDaysPerMonth;
  const gasGallonsMonth = monthlyMiles / (gasCarMpg || 1);
  const monthlyGasCarCost = gasGallonsMonth * gasPricePerGallon;
  const evKwhMonth = (monthlyMiles / 100) * evKwhPer100Miles;
  const monthlyEvCost = evKwhMonth * evElectricRate;
  const monthlySavings = monthlyGasCarCost - monthlyEvCost;
  const annualSavings = monthlySavings * 12;

  // 5. Monthly Subscriptions & Internet TCO
  const [internetCost, setInternetCost] = useState(70);
  const [mobilePhoneCost, setMobilePhoneCost] = useState(85);
  const [streamingServices, setStreamingServices] = useState(45);
  const [cloudSoftware, setCloudSoftware] = useState(25);
  const [gymFitness, setGymFitness] = useState(40);

  const totalMonthlySubs = internetCost + mobilePhoneCost + streamingServices + cloudSoftware + gymFitness;
  const totalAnnualSubs = totalMonthlySubs * 12;
  const fiveYearSubsCost = totalAnnualSubs * 5;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Household & Utility Cost Calculator Suite
        </h2>
        <span className="text-xs text-zinc-400">
          Accurate cost modeling for electric appliances, municipal water, winter gas heating, EV vs gas commute & recurring subscriptions
        </span>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-xs font-bold gap-1 overflow-x-auto">
        {[
          { id: 'electricity', label: 'Electricity & Appliances', icon: Zap },
          { id: 'water', label: 'Water Utility Bill', icon: Droplets },
          { id: 'gas', label: 'Gas & Winter Heating', icon: Flame },
          { id: 'commute', label: 'Gas vs. EV Commute', icon: Fuel },
          { id: 'subscriptions', label: 'Recurring Subscriptions', icon: Monitor },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id as CostTab);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-extrabold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ELECTRICITY */}
      {activeTab === 'electricity' && (
        <div className="space-y-5">
          {/* Appliance Quick Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Quick Appliance Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {APPLIANCE_PRESETS.map(p => (
                <button
                  key={p.name}
                  onClick={() => handleSelectAppliance(p)}
                  className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                    selectedAppliance === p.name
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                  }`}
                >
                  <div className="truncate font-semibold">{p.name}</div>
                  <div className="font-mono text-[10px] text-zinc-400 mt-0.5">{p.watts}W · {p.defaultHours}h/d</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Power Consumption (Watts)</label>
              <input
                type="number"
                value={wattage}
                onChange={e => setWattage(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Operating Hours / Day</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={hoursPerDay}
                onChange={e => setHoursPerDay(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Electricity Rate ($/kWh)</label>
              <input
                type="number"
                step="0.01"
                value={ratePerKwh}
                onChange={e => setRatePerKwh(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard label="Monthly Cost" value={`$${monthlyCost.toFixed(2)}`} subtext="Based on 30-day billing" highlight />
            <ResultCard label="Daily Cost" value={`$${dailyCost.toFixed(2)}`} subtext={`${dailyKwh.toFixed(2)} kWh / day`} />
            <ResultCard label="Estimated Annual Cost" value={`$${yearlyCost.toFixed(2)}`} subtext={`${(dailyKwh * 365).toFixed(0)} kWh / year`} />
          </div>
        </div>
      )}

      {/* TAB 2: WATER UTILITY BILL */}
      {activeTab === 'water' && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Household Members</label>
              <input
                type="number"
                min="1"
                value={householdPeople}
                onChange={e => setHouseholdPeople(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Avg Shower Minutes / Person</label>
              <input
                type="number"
                min="1"
                value={showerMinutes}
                onChange={e => setShowerMinutes(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Showerhead Flow (GPM)</label>
              <input
                type="number"
                step="0.5"
                value={showerHeadGpm}
                onChange={e => setShowerHeadGpm(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Toilet Flushes / Person / Day</label>
              <input
                type="number"
                value={flushesPerPerson}
                onChange={e => setFlushesPerPerson(parseInt(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Laundry Loads / Week</label>
              <input
                type="number"
                value={laundryLoadsWeek}
                onChange={e => setLaundryLoadsWeek(parseInt(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Rate ($ per 1,000 Gallons)</label>
              <input
                type="number"
                step="0.5"
                value={waterRatePerThousandGal}
                onChange={e => setWaterRatePerThousandGal(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard label="Estimated Monthly Bill" value={`$${monthlyWaterCost.toFixed(2)}`} subtext={`${Math.round(monthlyWaterGal).toLocaleString()} gal / month`} highlight />
            <ResultCard label="Daily Water Consumption" value={`${Math.round(totalDailyGal)} gallons`} subtext={`${(totalDailyGal * 3.785).toFixed(0)} Liters / day`} />
            <ResultCard label="Estimated Annual Cost" value={`$${yearlyWaterCost.toFixed(2)}`} subtext={`${Math.round(monthlyWaterGal * 12 / 1000)} kGal / year`} />
          </div>
        </div>
      )}

      {/* TAB 3: GAS & WINTER HEATING */}
      {activeTab === 'gas' && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Furnace Rating (BTU / Hr)</label>
              <input
                type="number"
                step="10000"
                value={furnaceBtu}
                onChange={e => setFurnaceBtu(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">AFUE Efficiency (%)</label>
              <input
                type="number"
                value={furnaceAfue}
                onChange={e => setFurnaceAfue(parseFloat(e.target.value) || 80)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Burner Run Hours / Day</label>
              <input
                type="number"
                step="0.5"
                value={heatHoursPerDay}
                onChange={e => setHeatHoursPerDay(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Gas Rate ($ / Therm)</label>
              <input
                type="number"
                step="0.05"
                value={gasRatePerTherm}
                onChange={e => setGasRatePerTherm(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Winter Heating Season (Months)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={heatingMonths}
                onChange={e => setHeatingMonths(parseInt(e.target.value) || 1)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard label="Monthly Heating Cost" value={`$${monthlyGasCost.toFixed(2)}`} subtext={`${monthlyTherms.toFixed(1)} therms / month`} highlight />
            <ResultCard label="Full Season Heating Cost" value={`$${seasonGasCost.toFixed(2)}`} subtext={`Over ${heatingMonths} winter months`} />
            <ResultCard label="Daily Fuel Cost" value={`$${(monthlyGasCost / 30).toFixed(2)}`} subtext={`${dailyTherms.toFixed(2)} therms / day`} />
          </div>
        </div>
      )}

      {/* TAB 4: GAS VS EV COMMUTE */}
      {activeTab === 'commute' && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Daily Roundtrip Miles</label>
              <input
                type="number"
                value={dailyCommuteMiles}
                onChange={e => setDailyCommuteMiles(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Commute Days / Month</label>
              <input
                type="number"
                value={workDaysPerMonth}
                onChange={e => setWorkDaysPerMonth(parseInt(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Gasoline Price ($ / gal)</label>
              <input
                type="number"
                step="0.05"
                value={gasPricePerGallon}
                onChange={e => setGasPricePerGallon(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Gas Car Fuel Economy (MPG)</label>
              <input
                type="number"
                value={gasCarMpg}
                onChange={e => setGasCarMpg(parseFloat(e.target.value) || 1)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">EV Efficiency (kWh / 100 mi)</label>
              <input
                type="number"
                value={evKwhPer100Miles}
                onChange={e => setEvKwhPer100Miles(parseFloat(e.target.value) || 1)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">EV Home Charging ($ / kWh)</label>
              <input
                type="number"
                step="0.01"
                value={evElectricRate}
                onChange={e => setEvElectricRate(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <ResultCard label="Monthly Gas Vehicle Cost" value={`$${monthlyGasCarCost.toFixed(2)}`} subtext={`${gasGallonsMonth.toFixed(1)} gallons fuel`} />
            <ResultCard label="Monthly Electric EV Cost" value={`$${monthlyEvCost.toFixed(2)}`} subtext={`${evKwhMonth.toFixed(1)} kWh charging`} />
            <ResultCard label="Monthly Net Savings" value={`$${Math.max(0, monthlySavings).toFixed(2)}`} subtext="Keeping in your pocket" highlight />
            <ResultCard label="Annual EV Commute Savings" value={`$${Math.max(0, annualSavings).toFixed(2)}`} subtext={`Over ${monthlyMiles * 12} miles/year`} />
          </div>
        </div>
      )}

      {/* TAB 5: SUBSCRIPTIONS & INTERNET */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Home Broadband Internet ($/mo)</label>
              <input
                type="number"
                value={internetCost}
                onChange={e => setInternetCost(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Mobile Phone Plan ($/mo)</label>
              <input
                type="number"
                value={mobilePhoneCost}
                onChange={e => setMobilePhoneCost(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Streaming Services Total ($/mo)</label>
              <input
                type="number"
                value={streamingServices}
                onChange={e => setStreamingServices(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Cloud / Software / Apps ($/mo)</label>
              <input
                type="number"
                value={cloudSoftware}
                onChange={e => setCloudSoftware(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Gym / Fitness / Memberships ($/mo)</label>
              <input
                type="number"
                value={gymFitness}
                onChange={e => setGymFitness(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard label="Total Monthly Outflow" value={`$${totalMonthlySubs.toFixed(2)}`} subtext="Fixed recurring bills" highlight />
            <ResultCard label="Total Annual Outlay" value={`$${totalAnnualSubs.toFixed(2)}`} subtext="12 months recurring" />
            <ResultCard label="5-Year Cumulative TCO" value={`$${fiveYearSubsCost.toFixed(2)}`} subtext="True long-term impact" />
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Kitchen & Cooking Timer with Custom Add, Edit, and Delete Options
interface KitchenPreset {
  id: string;
  name: string;
  time: number; // in seconds
}

const DEFAULT_KITCHEN_PRESETS: KitchenPreset[] = [
  { id: '1', name: 'Soft Boiled Egg', time: 6 * 60 },
  { id: '2', name: 'Hard Boiled Egg', time: 10 * 60 },
  { id: '3', name: 'Al Dente Pasta', time: 9 * 60 },
  { id: '4', name: 'Steep Green Tea', time: 3 * 60 },
  { id: '5', name: 'Baking Cookies', time: 12 * 60 },
  { id: '6', name: 'Steak Rest', time: 5 * 60 },
  { id: '7', name: 'French Press Coffee', time: 4 * 60 },
  { id: '8', name: 'Steamed Rice', time: 18 * 60 },
];

const KitchenTimerView: React.FC = () => {
  const [presets, setPresets] = useState<KitchenPreset[]>(() => {
    try {
      const saved = localStorage.getItem('omni_kitchen_presets');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_KITCHEN_PRESETS;
  });

  const [activePresetId, setActivePresetId] = useState<string>(presets[0]?.id || '1');
  const [secondsLeft, setSecondsLeft] = useState<number>(presets[0]?.time || 360);
  const [initialSeconds, setInitialSeconds] = useState<number>(presets[0]?.time || 360);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Custom addition form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetMins, setNewPresetMins] = useState('5');
  const [newPresetSecs, setNewPresetSecs] = useState('0');

  // Edit preset form state
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editMins, setEditMins] = useState('5');
  const [editSecs, setEditSecs] = useState('0');

  // Save presets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('omni_kitchen_presets', JSON.stringify(presets));
    } catch {}
  }, [presets]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            sounds.playSuccess();
            sounds.playTone(880, 1.2);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const selectPreset = (preset: KitchenPreset) => {
    sounds.playClick();
    setIsRunning(false);
    setActivePresetId(preset.id);
    setSecondsLeft(preset.time);
    setInitialSeconds(preset.time);
  };

  const handleAddPreset = () => {
    const mins = parseInt(newPresetMins, 10) || 0;
    const secs = parseInt(newPresetSecs, 10) || 0;
    const total = mins * 60 + secs;
    if (!newPresetName.trim() || total <= 0) return;

    sounds.playClick();
    const newPreset: KitchenPreset = {
      id: String(Date.now()),
      name: newPresetName.trim(),
      time: total,
    };
    setPresets(prev => [...prev, newPreset]);
    selectPreset(newPreset);
    setNewPresetName('');
    setNewPresetMins('5');
    setNewPresetSecs('0');
    setShowAddModal(false);
  };

  const startEditPreset = (e: React.MouseEvent, p: KitchenPreset) => {
    e.stopPropagation();
    sounds.playClick();
    setEditingPresetId(p.id);
    setEditName(p.name);
    setEditMins(String(Math.floor(p.time / 60)));
    setEditSecs(String(p.time % 60));
  };

  const handleSaveEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const mins = parseInt(editMins, 10) || 0;
    const secs = parseInt(editSecs, 10) || 0;
    const total = mins * 60 + secs;
    if (!editName.trim() || total <= 0) return;

    sounds.playClick();
    setPresets(prev =>
      prev.map(p => (p.id === id ? { ...p, name: editName.trim(), time: total } : p))
    );
    if (activePresetId === id) {
      setSecondsLeft(total);
      setInitialSeconds(total);
    }
    setEditingPresetId(null);
  };

  const handleDeletePreset = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sounds.playClick();
    setPresets(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (filtered.length > 0 && activePresetId === id) {
        selectPreset(filtered[0]);
      }
      return filtered;
    });
  };

  const addTime = (additionalSeconds: number) => {
    sounds.playClick();
    setSecondsLeft(prev => prev + additionalSeconds);
    setInitialSeconds(prev => prev + additionalSeconds);
  };

  const resetTimer = () => {
    sounds.playClick();
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progressPercent = initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Kitchen & Culinary Cooking Timer
          </h2>
          <span className="text-xs text-zinc-400">
            Precision countdowns with custom timer creator, edit & delete capabilities
          </span>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            setShowAddModal(prev => !prev);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Timer</span>
        </button>
      </div>

      {/* Custom Timer Creation Panel */}
      {showAddModal && (
        <div className="rounded-3xl border border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
              Create New Cooking Preset
            </span>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Timer Name (e.g. Sourdough Bake)"
              value={newPresetName}
              onChange={e => setNewPresetName(e.target.value)}
              className="sm:col-span-1 border rounded-xl px-3 py-2 text-xs font-bold bg-white dark:bg-zinc-900 dark:border-zinc-700"
            />
            <div className="flex gap-1.5 sm:col-span-2">
              <input
                type="number"
                min="0"
                placeholder="Minutes"
                value={newPresetMins}
                onChange={e => setNewPresetMins(e.target.value)}
                className="w-1/2 border rounded-xl px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-zinc-900 dark:border-zinc-700"
              />
              <input
                type="number"
                min="0"
                max="59"
                placeholder="Seconds"
                value={newPresetSecs}
                onChange={e => setNewPresetSecs(e.target.value)}
                className="w-1/2 border rounded-xl px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-zinc-900 dark:border-zinc-700"
              />
              <button
                onClick={handleAddPreset}
                className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-all active:scale-95"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Presets Grid with Edit and Delete options */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
          Preset Timers ({presets.length})
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map(p => {
            const isEditing = editingPresetId === p.id;
            const isSelected = activePresetId === p.id;
            const pMins = Math.floor(p.time / 60);
            const pSecs = p.time % 60;

            if (isEditing) {
              return (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl border border-indigo-400 bg-white dark:bg-zinc-900 dark:border-indigo-600 shadow-md space-y-2"
                >
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full text-xs font-bold p-1.5 border rounded-lg dark:bg-zinc-950 dark:border-zinc-700"
                    placeholder="Timer Name"
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={editMins}
                      onChange={e => setEditMins(e.target.value)}
                      className="w-16 text-xs font-mono font-bold p-1.5 border rounded-lg dark:bg-zinc-950 dark:border-zinc-700"
                      placeholder="M"
                    />
                    <span className="text-xs text-zinc-400 font-bold">:</span>
                    <input
                      type="number"
                      value={editSecs}
                      onChange={e => setEditSecs(e.target.value)}
                      className="w-16 text-xs font-mono font-bold p-1.5 border rounded-lg dark:bg-zinc-950 dark:border-zinc-700"
                      placeholder="S"
                    />
                    <button
                      onClick={e => handleSaveEdit(e, p.id)}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer ml-auto"
                      title="Save Changes"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setEditingPresetId(null);
                      }}
                      className="p-1.5 rounded-lg border text-zinc-400 hover:text-zinc-600 cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={p.id}
                onClick={() => selectPreset(p)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <span className={`text-xs font-bold block truncate ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {p.name}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                    {pMins}m {pSecs > 0 ? `${pSecs}s` : ''}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={e => startEditPreset(e, p)}
                    className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
                    title={`Edit ${p.name}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={e => handleDeletePreset(e, p.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                    title={`Delete ${p.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Countdown Display */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 shadow-md text-center space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums drop-shadow-xs">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Add Buttons */}
        <div className="flex justify-center gap-2">
          {[
            { label: '+30s', secs: 30 },
            { label: '+1m', secs: 60 },
            { label: '+5m', secs: 300 },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={() => addTime(btn.secs)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:border-indigo-400 cursor-pointer transition-all"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Timer Control Action Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              setIsRunning(!isRunning);
            }}
            className={`h-12 px-8 rounded-2xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
          </button>
          <button
            onClick={resetTimer}
            className="h-12 px-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 cursor-pointer shadow-xs active:scale-95 transition-all"
            title="Reset to Initial Duration"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 6. Recipe Portion Scaler with Add, Delete, and Inline Edit Support
interface Ingredient {
  id: string;
  name: string;
  qty: number;
  unit: string;
}

const RecipeScalerView: React.FC = () => {
  const [baseServings, setBaseServings] = useState(4);
  const [targetServings, setTargetServings] = useState(6);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'All-Purpose Flour', qty: 250, unit: 'g' },
    { id: '2', name: 'Granulated Sugar', qty: 100, unit: 'g' },
    { id: '3', name: 'Large Eggs', qty: 2, unit: 'whole' },
    { id: '4', name: 'Whole Milk', qty: 1.5, unit: 'cups' },
    { id: '5', name: 'Pure Vanilla Extract', qty: 1, unit: 'tsp' },
    { id: '6', name: 'Baking Powder', qty: 2, unit: 'tsp' },
  ]);

  // New ingredient form states
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newUnit, setNewUnit] = useState('g');

  // Inline edit state
  const [editingIngId, setEditingIngId] = useState<string | null>(null);
  const [editIngName, setEditIngName] = useState('');
  const [editIngQty, setEditIngQty] = useState('');
  const [editIngUnit, setEditIngUnit] = useState('');

  const ratio = baseServings > 0 ? targetServings / baseServings : 1;

  const handleAddIngredient = () => {
    if (!newName.trim() || !newQty || parseFloat(newQty) <= 0) return;
    sounds.playClick();
    setIngredients(prev => [
      ...prev,
      {
        id: String(Date.now()),
        name: newName.trim(),
        qty: parseFloat(newQty),
        unit: newUnit.trim() || 'g',
      },
    ]);
    setNewName('');
    setNewQty('');
  };

  const startEditIngredient = (ing: Ingredient) => {
    sounds.playClick();
    setEditingIngId(ing.id);
    setEditIngName(ing.name);
    setEditIngQty(String(ing.qty));
    setEditIngUnit(ing.unit);
  };

  const saveEditIngredient = (id: string) => {
    if (!editIngName.trim() || !editIngQty || parseFloat(editIngQty) <= 0) return;
    sounds.playClick();
    setIngredients(prev =>
      prev.map(ing =>
        ing.id === id
          ? {
              ...ing,
              name: editIngName.trim(),
              qty: parseFloat(editIngQty),
              unit: editIngUnit.trim() || 'g',
            }
          : ing
      )
    );
    setEditingIngId(null);
  };

  const cancelEditIngredient = () => {
    sounds.playClick();
    setEditingIngId(null);
  };

  const handleDeleteIngredient = (id: string) => {
    sounds.playClick();
    setIngredients(prev => prev.filter(ing => ing.id !== id));
    if (editingIngId === id) setEditingIngId(null);
  };

  const quickScale = (multiplier: number) => {
    sounds.playClick();
    setTargetServings(Math.max(1, Math.round(baseServings * multiplier)));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Servings Configuration */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Original Recipe Servings</label>
          <input
            type="number"
            min={1}
            value={baseServings}
            onChange={e => setBaseServings(Math.max(1, parseFloat(e.target.value) || 1))}
            className="w-full border rounded-xl p-2.5 font-mono text-center text-lg bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Target Servings Desired</label>
          <input
            type="number"
            min={1}
            value={targetServings}
            onChange={e => setTargetServings(Math.max(1, parseFloat(e.target.value) || 1))}
            className="w-full border rounded-xl p-2.5 font-mono text-center text-lg bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold text-indigo-600 dark:text-indigo-400"
          />
        </div>

        {/* Quick multipliers */}
        <div className="col-span-2 flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-[11px] font-bold text-zinc-400 uppercase">Quick Multiplier Presets:</span>
          <div className="flex gap-1.5">
            {[
              { label: '½× Half', m: 0.5 },
              { label: '2× Double', m: 2 },
              { label: '3× Triple', m: 3 },
            ].map(b => (
              <button
                key={b.label}
                type="button"
                onClick={() => quickScale(b.m)}
                className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold hover:border-indigo-400 text-zinc-600 dark:text-zinc-300 cursor-pointer"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Ingredient Module */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Add Ingredient to Recipe
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Ingredient (e.g. Butter)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="sm:col-span-2 border rounded-xl px-3 py-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-medium"
          />
          <input
            type="number"
            placeholder="Base Qty"
            value={newQty}
            onChange={e => setNewQty(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
          <input
            type="text"
            placeholder="Unit (g, cups, tbsp)"
            value={newUnit}
            onChange={e => setNewUnit(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <button
          onClick={handleAddIngredient}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-95 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Ingredient</span>
        </button>
      </div>

      {/* Scaled Ingredients List with Edit and Delete Buttons */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Scaled Ingredients ({ratio.toFixed(2)}× Multiplier)
          </h4>
          <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
            {ingredients.length} items
          </span>
        </div>

        <div className="space-y-2">
          {ingredients.map(ing => {
            const scaledQty = ing.qty * ratio;
            const isEditing = editingIngId === ing.id;

            if (isEditing) {
              return (
                <div
                  key={ing.id}
                  className="p-3 rounded-2xl border border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/30 dark:border-indigo-600 space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={editIngName}
                      onChange={e => setEditIngName(e.target.value)}
                      className="sm:col-span-2 border rounded-xl px-3 py-1.5 text-xs font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
                    />
                    <input
                      type="number"
                      value={editIngQty}
                      onChange={e => setEditIngQty(e.target.value)}
                      className="border rounded-xl px-3 py-1.5 text-xs font-mono font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
                    />
                    <input
                      type="text"
                      value={editIngUnit}
                      onChange={e => setEditIngUnit(e.target.value)}
                      className="border rounded-xl px-3 py-1.5 text-xs font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
                    />
                  </div>
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => saveEditIngredient(ing.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={cancelEditIngredient}
                      className="px-3 py-1 border border-zinc-300 dark:border-zinc-700 text-zinc-500 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={ing.id}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-100 dark:border-zinc-800 text-xs group hover:border-zinc-300 transition-colors"
              >
                <div className="min-w-0 pr-3">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block truncate">
                    {ing.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Base: {ing.qty} {ing.unit}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400 mr-1">
                    {Number(scaledQty.toFixed(2))} {ing.unit}
                  </span>

                  {/* Edit button beside delete button */}
                  <button
                    type="button"
                    onClick={() => startEditIngredient(ing)}
                    className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors cursor-pointer"
                    title={`Edit ${ing.name}`}
                    aria-label={`Edit ${ing.name}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteIngredient(ing.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                    title={`Delete ${ing.name}`}
                    aria-label={`Delete ${ing.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
