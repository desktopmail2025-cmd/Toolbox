import React, { useState, useEffect, useRef } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Plus, Trash2, CheckCircle2, Circle, Play, Pause, RotateCcw } from 'lucide-react';

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

// 4. Electricity Cost Calculator
const ElectricityCostCalcView: React.FC = () => {
  const [wattage, setWattage] = useState(1500); // 1500W space heater / AC
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [ratePerKwh, setRatePerKwh] = useState(0.16); // $0.16/kWh

  const dailyKwh = (wattage * hoursPerDay) / 1000;
  const dailyCost = dailyKwh * ratePerKwh;
  const monthlyCost = dailyCost * 30;
  const yearlyCost = dailyCost * 365;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Wattage (Watts)</label>
          <input
            type="number"
            value={wattage}
            onChange={e => setWattage(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Hours Used / Day</label>
          <input
            type="number"
            value={hoursPerDay}
            onChange={e => setHoursPerDay(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Cost / kWh ($)</label>
          <input
            type="number"
            step="0.01"
            value={ratePerKwh}
            onChange={e => setRatePerKwh(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Monthly Cost" value={`$${monthlyCost.toFixed(2)}`} highlight />
        <ResultCard label="Daily Energy Cost" value={`$${dailyCost.toFixed(2)}`} subtext={`${dailyKwh.toFixed(2)} kWh / day`} />
        <ResultCard label="Estimated Annual Cost" value={`$${yearlyCost.toFixed(2)}`} />
      </div>
    </div>
  );
};

// 5. Kitchen & Cooking Timer
const KITCHEN_PRESETS = [
  { name: 'Soft Boiled Egg', time: 6 * 60 },
  { name: 'Hard Boiled Egg', time: 10 * 60 },
  { name: 'Al Dente Pasta', time: 9 * 60 },
  { name: 'Steep Green Tea', time: 3 * 60 },
  { name: 'Baking Cookies', time: 12 * 60 },
  { name: 'Steak Rest', time: 5 * 60 },
];

const KitchenTimerView: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(KITCHEN_PRESETS[0].time);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
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

  const selectPreset = (secs: number) => {
    sounds.playClick();
    setIsRunning(false);
    setSecondsLeft(secs);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="max-w-md mx-auto rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm text-center space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {KITCHEN_PRESETS.map(p => (
          <button
            key={p.name}
            onClick={() => selectPreset(p.time)}
            className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-left text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {p.name} ({Math.round(p.time / 60)}m)
          </button>
        ))}
      </div>

      <div className="text-6xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => { sounds.playClick(); setIsRunning(!isRunning); }}
          className="h-12 px-6 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold flex items-center gap-2 hover:opacity-90"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
        </button>
        <button
          onClick={() => { sounds.playClick(); setIsRunning(false); setSecondsLeft(KITCHEN_PRESETS[0].time); }}
          className="h-12 w-12 rounded-xl border flex items-center justify-center text-zinc-600 dark:text-zinc-400"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 6. Recipe Portion Scaler
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
    { id: '1', name: 'Flour', qty: 250, unit: 'g' },
    { id: '2', name: 'Granulated Sugar', qty: 100, unit: 'g' },
    { id: '3', name: 'Eggs', qty: 2, unit: 'whole' },
    { id: '4', name: 'Milk', qty: 1.5, unit: 'cups' },
    { id: '5', name: 'Vanilla Extract', qty: 1, unit: 'tsp' },
  ]);

  const ratio = baseServings > 0 ? targetServings / baseServings : 1;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Original Recipe Servings</label>
          <input
            type="number"
            value={baseServings}
            onChange={e => setBaseServings(parseFloat(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono text-center text-lg bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Desired Servings</label>
          <input
            type="number"
            value={targetServings}
            onChange={e => setTargetServings(parseFloat(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono text-center text-lg bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Scaled Ingredients ({ratio.toFixed(2)}× multiplier)</h4>
        <div className="space-y-1.5">
          {ingredients.map(ing => {
            const scaledQty = ing.qty * ratio;
            return (
              <div key={ing.id} className="flex justify-between items-center p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-xs">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{ing.name}</span>
                <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {Number(scaledQty.toFixed(2))} {ing.unit}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
