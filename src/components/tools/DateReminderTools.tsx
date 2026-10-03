import React, { useState, useEffect } from 'react';
import {
  CalendarDays, Clock, Plus, Trash2, Check, Bell, BellRing,
  Search, Filter, Sparkles, Calendar, Edit2,
  CreditCard, DollarSign, BookOpen, AlertCircle, CheckCircle2,
  Tag, ShieldAlert, Award
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { triggerAppNotification, requestNotificationPermission, getNotificationPermissionStatus } from '../../utils/notifications';

interface ToolComponentProps {
  toolId: string;
}

// Local date helpers to avoid UTC day-shift
export const parseLocalDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d);
  }
  return new Date(dateStr);
};

export const getTodayStr = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const formatLocalDate = (dateStr: string, options?: Intl.DateTimeFormatOptions): string => {
  try {
    const d = parseLocalDate(dateStr);
    return d.toLocaleDateString([], options || { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

export const DateReminderTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  const [selectedTool, setSelectedTool] = useState<string>(toolId);

  useEffect(() => {
    setSelectedTool(toolId);
  }, [toolId]);

  const dateSubTools = [
    { id: 'date-reminder', name: 'Date Reminder Hub', icon: CalendarDays },
    { id: 'date-countdown-milestones', name: 'Event Countdowns', icon: Clock },
    { id: 'date-subscription-bills', name: 'Bills & Subscriptions', icon: CreditCard },
    { id: 'date-deadlines-planner', name: 'Deadlines & Tasks', icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      {/* Category Sub-Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80 scrollbar-none">
        {dateSubTools.map(sub => {
          const Icon = sub.icon;
          const isActive = selectedTool === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                sounds.playClick();
                setSelectedTool(sub.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/20'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/90 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-violet-500'}`} />
              <span>{sub.name}</span>
            </button>
          );
        })}
      </div>

      {selectedTool === 'date-reminder' && <DateReminderMasterView />}
      {selectedTool === 'date-countdown-milestones' && <CountdownMilestonesView />}
      {selectedTool === 'date-subscription-bills' && <SubscriptionBillsView />}
      {selectedTool === 'date-deadlines-planner' && <DeadlinesPlannerView />}
      {!['date-reminder', 'date-countdown-milestones', 'date-subscription-bills', 'date-deadlines-planner'].includes(selectedTool) && (
        <DateReminderMasterView />
      )}
    </div>
  );
};

/* =========================================================================
   1. DATE REMINDER HUB (MASTER TOOL)
   ========================================================================= */

interface DateReminderItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  category: 'Personal' | 'Work' | 'Bill' | 'Birthday' | 'Medical' | 'Exam' | 'Travel';
  priority: 'High' | 'Medium' | 'Normal';
  recurrence: 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  completed: boolean;
  notes?: string;
  createdAt: string;
}

const DEFAULT_REMINDERS: DateReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Dentist routine checkup & cleaning',
    date: '2026-10-18',
    time: '14:30',
    category: 'Medical',
    priority: 'High',
    recurrence: 'None',
    completed: false,
    notes: 'Dental clinic on 5th Ave, Dr. Smith.',
    createdAt: '2026-10-01',
  },
  {
    id: 'rem-2',
    title: 'Monthly apartment rent payment due',
    date: '2026-11-01',
    time: '09:00',
    category: 'Bill',
    priority: 'High',
    recurrence: 'Monthly',
    completed: false,
    notes: 'Transfer via online bank portal.',
    createdAt: '2026-10-01',
  },
  {
    id: 'rem-3',
    title: 'Quarterly team strategy review meeting',
    date: '2026-10-22',
    time: '10:00',
    category: 'Work',
    priority: 'Medium',
    recurrence: 'None',
    completed: false,
    notes: 'Prepare slide deck for Q4 metrics.',
    createdAt: '2026-09-28',
  },
  {
    id: 'rem-4',
    title: "Best friend's surprise birthday dinner",
    date: '2026-10-30',
    time: '19:00',
    category: 'Birthday',
    priority: 'High',
    recurrence: 'Yearly',
    completed: false,
    notes: 'Meet at the downtown Italian restaurant.',
    createdAt: '2026-09-25',
  },
];

const DateReminderMasterView: React.FC = () => {
  const [reminders, setReminders] = useState<DateReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem('omni_date_reminders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_REMINDERS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Upcoming' | 'Today' | 'Completed' | 'Overdue'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DateReminderItem | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [category, setCategory] = useState<DateReminderItem['category']>('Personal');
  const [priority, setPriority] = useState<DateReminderItem['priority']>('High');
  const [recurrence, setRecurrence] = useState<DateReminderItem['recurrence']>('None');
  const [notes, setNotes] = useState('');

  // Notification state
  const [notifPermission, setNotifPermission] = useState<string>('default');
  const [alertFeedback, setAlertFeedback] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('omni_date_reminders', JSON.stringify(reminders));
    } catch {}
  }, [reminders]);

  useEffect(() => {
    setNotifPermission(getNotificationPermissionStatus());
  }, []);

  const handleRequestNotif = async () => {
    sounds.playClick();
    const granted = await requestNotificationPermission();
    setNotifPermission(granted ? 'granted' : 'denied');
    if (granted) {
      triggerAppNotification({
        title: 'OmniToolbox Date Reminder Hub',
        body: 'Alerts enabled! You will receive timely date reminders.',
      });
      setAlertFeedback('Alerts enabled! Chime & notification ready.');
      setTimeout(() => setAlertFeedback(null), 3000);
    } else {
      setAlertFeedback('Notifications were not granted by browser.');
      setTimeout(() => setAlertFeedback(null), 3000);
    }
  };

  const handleToggleComplete = (id: string) => {
    sounds.playClick();
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    sounds.playClick();
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleOpenAdd = () => {
    sounds.playClick();
    setEditingItem(null);
    setTitle('');
    setDate(getTodayStr());
    setTime('09:00');
    setCategory('Personal');
    setPriority('High');
    setRecurrence('None');
    setNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: DateReminderItem) => {
    sounds.playClick();
    setEditingItem(item);
    setTitle(item.title);
    setDate(item.date);
    setTime(item.time || '09:00');
    setCategory(item.category);
    setPriority(item.priority);
    setRecurrence(item.recurrence);
    setNotes(item.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    sounds.playSuccess();

    if (editingItem) {
      setReminders(prev =>
        prev.map(r =>
          r.id === editingItem.id
            ? {
                ...r,
                title: title.trim(),
                date,
                time: time || undefined,
                category,
                priority,
                recurrence,
                notes: notes.trim() || undefined,
              }
            : r
        )
      );
    } else {
      const newReminder: DateReminderItem = {
        id: `rem-${Date.now()}`,
        title: title.trim(),
        date,
        time: time || undefined,
        category,
        priority,
        recurrence,
        completed: false,
        notes: notes.trim() || undefined,
        createdAt: getTodayStr(),
      };
      setReminders(prev => [newReminder, ...prev]);
    }
    setIsAddModalOpen(false);
  };

  // Helper to compute countdown in local time
  const getCountdownString = (dateStr: string, timeStr?: string) => {
    const targetDate = parseLocalDate(dateStr);
    if (timeStr) {
      const [h, m] = timeStr.split(':').map(Number);
      targetDate.setHours(h || 0, m || 0, 0, 0);
    } else {
      targetDate.setHours(23, 59, 59, 999);
    }

    const now = new Date();
    const todayStr = getTodayStr();

    if (dateStr === todayStr) {
      return { text: 'Today!', isToday: true, isOverdue: false };
    }

    const diffMs = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
      return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true, isToday: false };
    }
    return { text: `In ${diffDays} day${diffDays === 1 ? '' : 's'}`, isOverdue: false, isToday: false };
  };

  const todayDateStr = getTodayStr();

  const filteredReminders = reminders.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (filterCategory !== 'All' && r.category !== filterCategory) return false;

    if (filterStatus === 'Completed') return r.completed;
    if (filterStatus === 'Upcoming') return !r.completed && r.date >= todayDateStr;
    if (filterStatus === 'Today') return r.date === todayDateStr;
    if (filterStatus === 'Overdue') return !r.completed && r.date < todayDateStr;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
            <CalendarDays className="w-4 h-4 text-violet-500" />
            <span>Universal Date Reminders</span>
            <span aria-hidden="true">·</span>
            <span>Always on Schedule</span>
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-0.5">
            Universal Date Reminder Hub
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Create customizable date alerts, recurring schedules, appointments, and countdowns with add, edit & delete controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
          <button
            onClick={handleRequestNotif}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              notifPermission === 'granted'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100'
            }`}
          >
            {notifPermission === 'granted' ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
            <span>{notifPermission === 'granted' ? 'Alerts Enabled ✓' : 'Enable Alerts'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>
      </div>

      {alertFeedback && (
        <div className="p-3 bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-900/60 rounded-2xl text-xs font-semibold text-violet-700 dark:text-violet-300 animate-in fade-in">
          {alertFeedback}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search reminders or notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {(['All', 'Upcoming', 'Today', 'Overdue', 'Completed'] as const).map(s => (
            <button
              key={s}
              onClick={() => {
                sounds.playClick();
                setFilterStatus(s);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                filterStatus === s
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Personal', 'Work', 'Bill', 'Medical', 'Exam', 'Birthday', 'Travel'].map(cat => (
          <button
            key={cat}
            onClick={() => {
              sounds.playClick();
              setFilterCategory(cat);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterCategory === cat
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold'
                : 'bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-2">
            <CalendarDays className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="font-bold text-zinc-700 dark:text-zinc-300">No date reminders match this view.</p>
            <p className="text-[11px] text-zinc-400">Tap "Add Reminder" to schedule your alerts.</p>
          </div>
        ) : (
          filteredReminders.map(item => {
            const countdown = getCountdownString(item.date, item.time);

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.completed
                    ? 'bg-zinc-50/70 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 opacity-75'
                    : countdown.isOverdue
                    ? 'bg-white dark:bg-zinc-900 border-rose-300 dark:border-rose-900/60 shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <button
                    onClick={() => handleToggleComplete(item.id)}
                    className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer shrink-0 active:scale-90 ${
                      item.completed
                        ? 'bg-violet-600 border-violet-600 text-white'
                        : 'border-zinc-300 dark:border-zinc-700 hover:border-violet-500'
                    }`}
                    title={item.completed ? 'Mark pending' : 'Mark completed'}
                  >
                    {item.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-bold text-zinc-900 dark:text-zinc-100 ${
                          item.completed ? 'line-through text-zinc-400' : ''
                        }`}
                      >
                        {item.title}
                      </span>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {item.category}
                      </span>

                      {item.priority === 'High' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60">
                          High Priority
                        </span>
                      )}

                      {item.recurrence !== 'None' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                          {item.recurrence}
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.notes}</p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                      <span>Date: {formatLocalDate(item.date)}{item.time ? ` at ${item.time}` : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span
                    className={`font-mono text-xs font-bold px-3 py-1 rounded-xl ${
                      item.completed
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                        : countdown.isOverdue
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 font-black'
                        : countdown.isToday
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 font-black'
                        : 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                    }`}
                  >
                    {item.completed ? 'Done ✓' : countdown.text}
                  </span>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer active:scale-95 transition-all shadow-2xs"
                    title="Edit Reminder"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteReminder(item.id)}
                    className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer active:scale-95 transition-all shadow-2xs"
                    title="Delete Reminder"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-violet-600" />
                <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                  {editingItem ? 'Edit Date Reminder' : 'New Date Reminder'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReminder} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Reminder Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dentist appointment, Renew passport, Pay car insurance"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer text-xs"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Bill">Bill</option>
                    <option value="Medical">Medical</option>
                    <option value="Exam">Exam</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Travel">Travel</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer text-xs"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Recurrence</label>
                  <select
                    value={recurrence}
                    onChange={e => setRecurrence(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer text-xs"
                  >
                    <option value="None">Once</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Address, confirmation code, what to bring..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold cursor-pointer shadow-md"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   2. LIVE EVENT COUNTDOWNS & MILESTONES
   ========================================================================= */

interface CountdownEvent {
  id: string;
  name: string;
  targetDateTime: string; // YYYY-MM-DDTHH:MM
  category: string;
}

const DEFAULT_COUNTDOWNS: CountdownEvent[] = [
  { id: 'cd-1', name: 'New Year Celebrations 🎆', targetDateTime: '2027-01-01T00:00', category: 'Holiday' },
  { id: 'cd-2', name: 'Tropical Island Holiday Trip 🌴', targetDateTime: '2026-12-15T08:00', category: 'Vacation' },
  { id: 'cd-3', name: 'Next Tech Keynote Launch 🚀', targetDateTime: '2026-11-05T10:00', category: 'Event' },
];

const CountdownMilestonesView: React.FC = () => {
  const [events, setEvents] = useState<CountdownEvent[]>(() => {
    try {
      const saved = localStorage.getItem('omni_countdown_milestones');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_COUNTDOWNS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CountdownEvent | null>(null);
  const [name, setName] = useState('');
  const [targetDateTime, setTargetDateTime] = useState('');
  const [category, setCategory] = useState('Personal');
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    try {
      localStorage.setItem('omni_countdown_milestones', JSON.stringify(events));
    } catch {}
  }, [events]);

  // Live timer tick every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDelete = (id: string) => {
    sounds.playClick();
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleOpenAdd = () => {
    sounds.playClick();
    setEditingEvent(null);
    setName('');
    // Default to tomorrow 09:00
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setTargetDateTime(`${d.toISOString().slice(0, 10)}T09:00`);
    setCategory('Personal');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: CountdownEvent) => {
    sounds.playClick();
    setEditingEvent(ev);
    setName(ev.name);
    setTargetDateTime(ev.targetDateTime);
    setCategory(ev.category);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetDateTime) return;
    sounds.playSuccess();

    if (editingEvent) {
      setEvents(prev =>
        prev.map(e =>
          e.id === editingEvent.id
            ? { ...e, name: name.trim(), targetDateTime, category }
            : e
        )
      );
    } else {
      const newEvent: CountdownEvent = {
        id: `cd-${Date.now()}`,
        name: name.trim(),
        targetDateTime,
        category,
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setIsModalOpen(false);
  };

  const handleAddPreset = (presetName: string, daysAhead: number, presetCat: string) => {
    sounds.playClick();
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(9, 0, 0, 0);
    const dateStr = d.toISOString().slice(0, 16);
    const ev: CountdownEvent = {
      id: `cd-${Date.now()}`,
      name: presetName,
      targetDateTime: dateStr,
      category: presetCat,
    };
    setEvents(prev => [...prev, ev]);
  };

  const calculateRemaining = (targetStr: string) => {
    const targetMs = new Date(targetStr).getTime();
    if (isNaN(targetMs)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
    }
    const diff = targetMs - currentTime;

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isPassed: false };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
            <Clock className="w-4 h-4 text-violet-500" />
            <span>Precise Real-Time Clock</span>
            <span aria-hidden="true">·</span>
            <span>Live Seconds Ticker</span>
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-0.5">
            Live Event Countdowns & Milestones
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Create real-time visual counters for weddings, launches, vacations, exams, and milestones.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20 active:scale-95 transition-all cursor-pointer self-end md:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Countdown</span>
        </button>
      </div>

      {/* Quick Add Presets Carousel */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block px-1">
          Quick Countdown Presets (Tap to Add)
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {[
            { n: 'Weekend Chill Getaway 🏕️', d: 3, c: 'Weekend' },
            { n: 'Upcoming Project Deadline 📑', d: 14, c: 'Work' },
            { n: 'Spring Marathon / Fitness Goal 🏃', d: 30, c: 'Health' },
            { n: 'Birthday Celebration Party 🎂', d: 45, c: 'Celebration' },
          ].map(p => (
            <button
              key={p.n}
              onClick={() => handleAddPreset(p.n, p.d, p.c)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-violet-400 hover:text-violet-600 whitespace-nowrap cursor-pointer transition-all active:scale-95 shadow-2xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-violet-500" />
              <span>{p.n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Countdown Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(ev => {
          const rem = calculateRemaining(ev.targetDateTime);

          return (
            <div
              key={ev.id}
              className="p-5 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-zinc-400 text-[10px] uppercase tracking-wider">
                    {ev.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(ev)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                      title="Edit countdown"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ev.id)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-rose-600 cursor-pointer"
                      title="Delete countdown"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                  {ev.name}
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  {new Date(ev.targetDateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>

              {rem.isPassed ? (
                <div className="py-4 text-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  Event completed! 🎉
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center pt-2">
                  <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700/60">
                    <span className="font-mono font-black text-xl text-zinc-900 dark:text-zinc-50 block">
                      {rem.days}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Days</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700/60">
                    <span className="font-mono font-black text-xl text-zinc-900 dark:text-zinc-50 block">
                      {rem.hours}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Hours</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700/60">
                    <span className="font-mono font-black text-xl text-zinc-900 dark:text-zinc-50 block">
                      {rem.minutes}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Mins</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700/60">
                    <span className="font-mono font-black text-xl text-violet-600 dark:text-violet-400 block animate-pulse">
                      {rem.seconds}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Secs</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                {editingEvent ? 'Edit Event Countdown' : 'Create Event Countdown'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Event Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flight to Tokyo, College Graduation, Product Launch"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Target Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={targetDateTime}
                  onChange={e => setTargetDateTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Category</label>
                <input
                  type="text"
                  placeholder="Vacation, Holiday, Work, Personal"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold cursor-pointer shadow-md"
                >
                  Save Countdown
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   3. RECURRING SUBSCRIPTIONS & BILL REMINDER
   ========================================================================= */

interface SubscriptionItem {
  id: string;
  name: string;
  amount: number;
  currency: string;
  renewalDay: number; // 1-31
  billingCycle: 'Monthly' | 'Yearly';
  category: string;
  isPaidCurrentMonth?: boolean;
}

const DEFAULT_SUBS: SubscriptionItem[] = [
  { id: 'sub-1', name: 'Netflix Premium 4K', amount: 22.99, currency: '$', renewalDay: 12, billingCycle: 'Monthly', category: 'Entertainment', isPaidCurrentMonth: true },
  { id: 'sub-2', name: 'Spotify Duo Plan', amount: 14.99, currency: '$', renewalDay: 28, billingCycle: 'Monthly', category: 'Music', isPaidCurrentMonth: false },
  { id: 'sub-3', name: 'Cloud Storage & Backups', amount: 9.99, currency: '$', renewalDay: 5, billingCycle: 'Monthly', category: 'Productivity', isPaidCurrentMonth: false },
  { id: 'sub-4', name: 'Gym & Fitness Membership', amount: 49.00, currency: '$', renewalDay: 1, billingCycle: 'Monthly', category: 'Health', isPaidCurrentMonth: true },
];

const SubscriptionBillsView: React.FC = () => {
  const [subs, setSubs] = useState<SubscriptionItem[]>(() => {
    try {
      const saved = localStorage.getItem('omni_subscription_bills');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SUBS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubscriptionItem | null>(null);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState(9.99);
  const [currency, setCurrency] = useState('$');
  const [renewalDay, setRenewalDay] = useState(1);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [category, setCategory] = useState('Entertainment');

  useEffect(() => {
    try {
      localStorage.setItem('omni_subscription_bills', JSON.stringify(subs));
    } catch {}
  }, [subs]);

  const handleDelete = (id: string) => {
    sounds.playClick();
    setSubs(prev => prev.filter(s => s.id !== id));
  };

  const handleTogglePaid = (id: string) => {
    sounds.playClick();
    setSubs(prev =>
      prev.map(s => (s.id === id ? { ...s, isPaidCurrentMonth: !s.isPaidCurrentMonth } : s))
    );
  };

  const handleOpenAdd = () => {
    sounds.playClick();
    setEditingSub(null);
    setName('');
    setAmount(9.99);
    setCurrency('$');
    setRenewalDay(1);
    setBillingCycle('Monthly');
    setCategory('Entertainment');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: SubscriptionItem) => {
    sounds.playClick();
    setEditingSub(sub);
    setName(sub.name);
    setAmount(sub.amount);
    setCurrency(sub.currency || '$');
    setRenewalDay(sub.renewalDay);
    setBillingCycle(sub.billingCycle);
    setCategory(sub.category);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    sounds.playSuccess();

    if (editingSub) {
      setSubs(prev =>
        prev.map(s =>
          s.id === editingSub.id
            ? {
                ...s,
                name: name.trim(),
                amount: Number(amount) || 0,
                currency,
                renewalDay: Number(renewalDay) || 1,
                billingCycle,
                category,
              }
            : s
        )
      );
    } else {
      const newSub: SubscriptionItem = {
        id: `sub-${Date.now()}`,
        name: name.trim(),
        amount: Number(amount) || 0,
        currency,
        renewalDay: Number(renewalDay) || 1,
        billingCycle,
        category,
        isPaidCurrentMonth: false,
      };
      setSubs(prev => [...prev, newSub]);
    }
    setIsModalOpen(false);
  };

  const totalMonthly = subs.reduce((acc, curr) => {
    return acc + (curr.billingCycle === 'Monthly' ? curr.amount : curr.amount / 12);
  }, 0);

  // Compute days until renewal
  const getDaysUntilRenewal = (day: number) => {
    const now = new Date();
    const currentDay = now.getDate();
    if (day >= currentDay) {
      return day - currentDay;
    }
    const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return daysInCurrentMonth - currentDay + day;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
            <CreditCard className="w-4 h-4 text-violet-500" />
            <span>Recurring Expenses & Bills</span>
            <span aria-hidden="true">·</span>
            <span>Prevent Surprise Charges</span>
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-0.5">
            Subscription & Bill Reminder
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Track renewal dates for Netflix, rent, gym, cloud services, and utilities with total monthly summaries.
          </p>
        </div>

        <div className="flex items-center gap-4 self-end md:self-center shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-zinc-400">Monthly Total</div>
            <div className="text-xl font-black font-mono text-zinc-900 dark:text-zinc-100">
              ${totalMonthly.toFixed(2)}/mo
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subscription</span>
          </button>
        </div>
      </div>

      {/* Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subs.map(sub => {
          const daysLeft = getDaysUntilRenewal(sub.renewalDay);

          return (
            <div
              key={sub.id}
              className={`p-5 rounded-3xl border transition-all flex items-center justify-between gap-4 ${
                sub.isPaidCurrentMonth
                  ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-zinc-200/90 dark:border-zinc-800'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800 shadow-2xs'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                    {sub.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    {sub.category}
                  </span>
                  {sub.isPaidCurrentMonth && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                      Paid This Month ✓
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {sub.currency || '$'}{sub.amount.toFixed(2)} / {sub.billingCycle.toLowerCase()}
                  </span>
                  <span>· Renews day {sub.renewalDay}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`font-mono text-xs font-bold px-2.5 py-1 rounded-xl ${
                    daysLeft <= 3
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 font-black animate-pulse'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {daysLeft === 0 ? 'Today!' : `In ${daysLeft}d`}
                </span>

                <button
                  onClick={() => handleTogglePaid(sub.id)}
                  className={`p-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    sub.isPaidCurrentMonth
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-emerald-600'
                  }`}
                  title={sub.isPaidCurrentMonth ? 'Mark as Unpaid' : 'Mark as Paid this month'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleOpenEdit(sub)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                  title="Edit subscription"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(sub.id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                  title="Delete subscription"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Subscription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                {editingSub ? 'Edit Subscription / Bill' : 'Add Subscription / Bill'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Service / Bill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix, Spotify, Gym, Rent, Internet"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer text-xs font-mono"
                  >
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="¥">¥ (JPY)</option>
                    <option value="₹">₹ (INR)</option>
                    <option value="৳">৳ (BDT)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Cost Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Day of Month</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={renewalDay}
                    onChange={e => setRenewalDay(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Billing Cycle</label>
                  <select
                    value={billingCycle}
                    onChange={e => setBillingCycle(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer text-xs"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold cursor-pointer shadow-md"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   4. EXAM, PROJECT & TASK DEADLINE PLANNER
   ========================================================================= */

interface DeadlineItem {
  id: string;
  title: string;
  dueDate: string;
  courseOrProject: string;
  progress: number; // 0-100
  priority: 'High' | 'Medium' | 'Normal';
}

const DEFAULT_DEADLINES: DeadlineItem[] = [
  { id: 'dl-1', title: 'Calculus Final Exam', dueDate: '2026-11-12', courseOrProject: 'MATH 201', progress: 60, priority: 'High' },
  { id: 'dl-2', title: 'Q4 Product Roadmap Report', dueDate: '2026-10-24', courseOrProject: 'Work Deliverable', progress: 30, priority: 'High' },
  { id: 'dl-3', title: 'Annual Tax Filing Paperwork', dueDate: '2026-10-31', courseOrProject: 'Finance', progress: 10, priority: 'Medium' },
];

const DeadlinesPlannerView: React.FC = () => {
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(() => {
    try {
      const saved = localStorage.getItem('omni_deadlines_planner');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DEADLINES;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DeadlineItem | null>(null);

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [courseOrProject, setCourseOrProject] = useState('');
  const [priority, setPriority] = useState<DeadlineItem['priority']>('High');

  useEffect(() => {
    try {
      localStorage.setItem('omni_deadlines_planner', JSON.stringify(deadlines));
    } catch {}
  }, [deadlines]);

  const handleDelete = (id: string) => {
    sounds.playClick();
    setDeadlines(prev => prev.filter(d => d.id !== id));
  };

  const handleProgressChange = (id: string, delta: number) => {
    sounds.playClick();
    setDeadlines(prev =>
      prev.map(d => (d.id === id ? { ...d, progress: Math.min(100, Math.max(0, d.progress + delta)) } : d))
    );
  };

  const handleToggleDone = (id: string) => {
    sounds.playClick();
    setDeadlines(prev =>
      prev.map(d => (d.id === id ? { ...d, progress: d.progress === 100 ? 0 : 100 } : d))
    );
  };

  const handleOpenAdd = () => {
    sounds.playClick();
    setEditingItem(null);
    setTitle('');
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDueDate(d.toISOString().slice(0, 10));
    setCourseOrProject('Work/Study');
    setPriority('High');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: DeadlineItem) => {
    sounds.playClick();
    setEditingItem(item);
    setTitle(item.title);
    setDueDate(item.dueDate);
    setCourseOrProject(item.courseOrProject);
    setPriority(item.priority);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    sounds.playSuccess();

    if (editingItem) {
      setDeadlines(prev =>
        prev.map(d =>
          d.id === editingItem.id
            ? { ...d, title: title.trim(), dueDate, courseOrProject: courseOrProject.trim() || 'General', priority }
            : d
        )
      );
    } else {
      const newDl: DeadlineItem = {
        id: `dl-${Date.now()}`,
        title: title.trim(),
        dueDate,
        courseOrProject: courseOrProject.trim() || 'General',
        progress: 0,
        priority,
      };
      setDeadlines(prev => [...prev, newDl]);
    }
    setIsModalOpen(false);
  };

  const getDaysLeft = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = parseLocalDate(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffMs = target.getTime() - today.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
            <BookOpen className="w-4 h-4 text-violet-500" />
            <span>Academic & Project Deliverables</span>
            <span aria-hidden="true">·</span>
            <span>Zero Procrastination</span>
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-0.5">
            Exam, Project & Task Deadline Tracker
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Keep track of strict academic exams, client work deliverables, and project milestones with progress sliders.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20 active:scale-95 transition-all cursor-pointer self-end md:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Deadline</span>
        </button>
      </div>

      {/* Deadlines List */}
      <div className="space-y-3">
        {deadlines.map(item => {
          const daysLeft = getDaysLeft(item.dueDate);
          const isFinished = item.progress >= 100;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all space-y-3 ${
                isFinished
                  ? 'bg-zinc-50/70 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 opacity-80'
                  : daysLeft < 0
                  ? 'border-rose-300 dark:border-rose-900/60 bg-white dark:bg-zinc-900 shadow-2xs'
                  : 'border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleDone(item.id)}
                    className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer shrink-0 active:scale-90 ${
                      isFinished
                        ? 'bg-violet-600 border-violet-600 text-white'
                        : 'border-zinc-300 dark:border-zinc-700 hover:border-violet-500'
                    }`}
                    title={isFinished ? 'Reopen deadline' : 'Mark 100% complete'}
                  >
                    {isFinished && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-extrabold text-sm text-zinc-900 dark:text-zinc-100 ${isFinished ? 'line-through text-zinc-400' : ''}`}>
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                        {item.courseOrProject}
                      </span>
                      {item.priority === 'High' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                          Urgent
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">
                      Due: {formatLocalDate(item.dueDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  <span
                    className={`font-mono text-xs font-bold px-3 py-1 rounded-xl ${
                      isFinished
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : daysLeft < 0
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 font-black'
                        : daysLeft === 0
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-black'
                        : 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                    }`}
                  >
                    {isFinished ? 'Completed ✓' : daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due Today!' : `${daysLeft}d left`}
                  </span>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                    title="Edit deadline"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    title="Delete deadline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <span>Preparation / Progress: {item.progress}%</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleProgressChange(item.id, -10)}
                      className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-bold cursor-pointer hover:bg-zinc-200"
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => handleProgressChange(item.id, 10)}
                      className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-bold cursor-pointer hover:bg-zinc-200"
                    >
                      +10%
                    </button>
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                {editingItem ? 'Edit Deadline' : 'Add Exam or Project Deadline'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Deadline Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Midterm, Client Deliverable, Dissertation"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Course / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. CS 101, Work, Taxes"
                    value={courseOrProject}
                    onChange={e => setCourseOrProject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer text-xs"
                >
                  <option value="High">Urgent & Important</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold cursor-pointer shadow-md"
                >
                  Save Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
