import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import {
  requestNotificationPermission, triggerAppNotification,
  getNotificationPermissionStatus
} from '../../utils/notifications';
import { PermissionPrompt } from '../common/PermissionPrompt';
import {
  Bell, Plus, Trash2, Check, Clock, AlertCircle, Sparkles,
  Pill, Heart, Volume2, ShieldCheck, CheckCircle2, RotateCcw
} from 'lucide-react';

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  timeSlot: string; // e.g. "08:00 AM"
  period: 'morning' | 'afternoon' | 'evening' | 'bedtime';
  instructions: string;
  takenToday: boolean;
  notifyEnabled: boolean;
}

const DEFAULT_MEDICINES: MedicineItem[] = [
  {
    id: '1',
    name: 'Vitamin D3 & K2',
    dosage: '5,000 IU (1 capsule)',
    timeSlot: '08:30 AM',
    period: 'morning',
    instructions: 'Take with breakfast and a glass of water',
    takenToday: false,
    notifyEnabled: true,
  },
  {
    id: '2',
    name: 'Omega-3 Fish Oil',
    dosage: '1,200 mg EPA/DHA',
    timeSlot: '01:00 PM',
    period: 'afternoon',
    instructions: 'Take right after lunch',
    takenToday: false,
    notifyEnabled: true,
  },
  {
    id: '3',
    name: 'Magnesium Glycinate',
    dosage: '400 mg (2 tablets)',
    timeSlot: '09:30 PM',
    period: 'bedtime',
    instructions: 'Take 30 minutes before sleep for relaxation',
    takenToday: false,
    notifyEnabled: true,
  },
];

export const MedicineReminderView: React.FC = () => {
  const [medicines, setMedicines] = useState<MedicineItem[]>(() => {
    try {
      const saved = localStorage.getItem('omni_medicine_schedule');
      return saved ? JSON.parse(saved) : DEFAULT_MEDICINES;
    } catch {
      return DEFAULT_MEDICINES;
    }
  });

  const [permStatus, setPermStatus] = useState<string>('default');
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timeSlot, setTimeSlot] = useState('08:00 AM');
  const [period, setPeriod] = useState<MedicineItem['period']>('morning');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    setPermStatus(getNotificationPermissionStatus());
  }, []);

  const saveMeds = (updated: MedicineItem[]) => {
    setMedicines(updated);
    try {
      localStorage.setItem('omni_medicine_schedule', JSON.stringify(updated));
    } catch {}
  };

  const handleRequestPermission = async () => {
    sounds.playClick();
    const granted = await requestNotificationPermission();
    setPermStatus(granted ? 'granted' : 'denied');
    if (granted) {
      sounds.playSuccess();
      triggerAppNotification({
        title: '🔔 Medicine Dose Alerts Enabled',
        body: 'You will receive timely alerts for your scheduled medicines and pills.',
      });
    } else {
      setShowNotifPrompt(true);
    }
  };

  const handleTestNotification = async (med?: MedicineItem) => {
    sounds.playClick();
    const title = med ? `⏰ Time to take ${med.name}` : '⏰ Medicine Dose Alert';
    const body = med ? `${med.dosage} (${med.timeSlot}) — ${med.instructions}` : 'Remember to take your prescribed morning medicine with water.';

    await triggerAppNotification({
      title,
      body,
      tag: 'med-alert',
    });

    setLastNotification(`Alert sent at ${new Date().toLocaleTimeString()}`);
    setTimeout(() => setLastNotification(null), 4000);
  };

  const handleToggleTaken = (id: string) => {
    sounds.playSuccess();
    const updated = medicines.map(m => (m.id === id ? { ...m, takenToday: !m.takenToday } : m));
    saveMeds(updated);
  };

  const handleDelete = (id: string) => {
    sounds.playClick();
    const updated = medicines.filter(m => m.id !== id);
    saveMeds(updated);
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sounds.playSuccess();
    const newMed: MedicineItem = {
      id: String(Date.now()),
      name: name.trim(),
      dosage: dosage.trim() || '1 standard dose',
      timeSlot,
      period,
      instructions: instructions.trim() || 'Take as advised with water',
      takenToday: false,
      notifyEnabled: true,
    };

    saveMeds([...medicines, newMed]);
    setName('');
    setDosage('');
    setInstructions('');
    setShowAddModal(false);
  };

  const handleResetToday = () => {
    sounds.playClick();
    const updated = medicines.map(m => ({ ...m, takenToday: false }));
    saveMeds(updated);
  };

  const takenCount = medicines.filter(m => m.takenToday).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <Heart className="w-4 h-4" />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Medicine & Pill Reminder Hub
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Never miss a dose with automated smart audio alerts, dosage instructions, and daily tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {permStatus !== 'granted' ? (
            <button
              onClick={handleRequestPermission}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Allow Notifications</span>
            </button>
          ) : (
            <button
              onClick={() => handleTestNotification()}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Volume2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Test Audio Alarm</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              setShowAddModal(v => !v);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Pill</span>
          </button>
        </div>
      </div>

      {/* Status banner */}
      {lastNotification && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{lastNotification}</span>
        </div>
      )}

      {showNotifPrompt && (
        <PermissionPrompt
          type="notifications"
          title="Medicine Dose Alerts"
          reason="OmniToolbox uses notifications to remind you of your scheduled pills and prescription times. Please allow notification permissions in your settings."
          initialDenied={permStatus === 'denied'}
          onGranted={() => {
            setShowNotifPrompt(false);
            setPermStatus('granted');
            triggerAppNotification({
              title: '🔔 Medicine Dose Alerts Enabled',
              body: 'You will receive timely alerts for your scheduled medicines and pills.',
            });
          }}
          onCancel={() => setShowNotifPrompt(false)}
        />
      )}

      {/* Progress tracker */}
      <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-zinc-600 dark:text-zinc-400">Today's Adherence</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-rose-600 dark:text-rose-400">
              {takenCount} of {medicines.length} Taken ({medicines.length > 0 ? Math.round((takenCount / medicines.length) * 100) : 0}%)
            </span>
            <button
              onClick={handleResetToday}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1 text-[11px] cursor-pointer"
              title="Reset today's checks"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-rose-500 h-full transition-all duration-500"
            style={{ width: `${medicines.length > 0 ? (takenCount / medicines.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Add Medicine Form Modal */}
      {showAddModal && (
        <form onSubmit={handleAddMedicine} className="p-5 rounded-3xl border border-rose-200 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/20 space-y-4 shadow-xs animate-in fade-in">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
            <Pill className="w-4 h-4" />
            <span>Add New Scheduled Medication</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Medication / Supplement Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Amoxicillin, Vitamin C, Metformin"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Dosage / Quantity</label>
              <input
                type="text"
                placeholder="e.g. 500 mg, 1 tablet, 10 ml"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Target Time</label>
              <input
                type="text"
                placeholder="08:00 AM"
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Time of Day</label>
              <select
                value={period}
                onChange={e => setPeriod(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium"
              >
                <option value="morning">🌅 Morning (Breakfast)</option>
                <option value="afternoon">☀️ Afternoon (Lunch)</option>
                <option value="evening">🌆 Evening (Dinner)</option>
                <option value="bedtime">🌙 Bedtime</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 mb-1">Instructions / Meal Guidance</label>
            <input
              type="text"
              placeholder="e.g. Take with food, drink 2 glasses of water"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Save Schedule
            </button>
          </div>
        </form>
      )}

      {/* Medicines list with Add and Delete buttons beside each */}
      <div className="space-y-3">
        {medicines.map(med => (
          <div
            key={med.id}
            className={`p-4 rounded-3xl border transition-all ${
              med.takenToday
                ? 'border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-950 dark:bg-emerald-950/20 opacity-75'
                : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-start gap-3">
                {/* Taken button */}
                <button
                  onClick={() => handleToggleTaken(med.id)}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all cursor-pointer mt-0.5 ${
                    med.takenToday
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs'
                      : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-emerald-400 text-transparent hover:text-zinc-300'
                  }`}
                  title={med.takenToday ? 'Mark as pending' : 'Mark as taken'}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm">💊</span>
                    <h3 className={`text-sm font-bold ${med.takenToday ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-50'}`}>
                      {med.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-zinc-500">
                      {med.dosage}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      {med.timeSlot}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {med.instructions}
                  </p>
                </div>
              </div>

              {/* Actions beside each item: Test Alarm, Add Another, Delete */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleTestNotification(med)}
                  className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-600 dark:text-zinc-300 text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Trigger alarm notification for this pill"
                >
                  <Bell className="w-3.5 h-3.5 text-rose-500" />
                  <span>Notify</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowAddModal(true);
                  }}
                  className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-600 dark:text-zinc-300 text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Add another medicine"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Add</span>
                </button>

                <button
                  onClick={() => handleDelete(med.id)}
                  className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:border-rose-800 text-zinc-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  title="Delete medication"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {medicines.length === 0 && (
          <div className="p-8 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
            No medications added. Click "Add Pill" to configure your schedule.
          </div>
        )}
      </div>
    </div>
  );
};
