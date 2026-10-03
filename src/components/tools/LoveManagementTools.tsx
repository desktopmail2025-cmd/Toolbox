import React, { useState, useEffect } from 'react';
import {
  Heart, HeartHandshake, Calendar, Clock, MapPin, Sparkles, Plus,
  Trash2, Edit2, Check, Copy, Share2, Gift,
  CalendarHeart, Star, Award, Compass, RefreshCw, User, CheckCircle2
} from 'lucide-react';
import { sounds } from '../../utils/audio';

interface ToolComponentProps {
  toolId: string;
}

// Helper: Parse YYYY-MM-DD reliably in user's local timezone (prevents UTC day shift bug)
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

export const formatLocalDate = (dateStr: string, options?: Intl.DateTimeFormatOptions): string => {
  try {
    const d = parseLocalDate(dateStr);
    return d.toLocaleDateString([], options || { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

export const LoveManagementTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  return (
    <div className="space-y-6">
      {toolId === 'love-relationship-goals' ? (
        <RelationshipGoalsView />
      ) : toolId === 'love-important-days' ? (
        <ImportantDaysView />
      ) : toolId === 'love-meetup-tracker' ? (
        <MeetupTrackerView />
      ) : (
        <LoveDayCounterView />
      )}
    </div>
  );
};

/* =========================================================================
   1. LOVE DAY COUNTER & ANNIVERSARY GUIDE
   ========================================================================= */

interface CustomMilestone {
  id: string;
  targetDays: number;
  label: string;
}

const DEFAULT_MILESTONES: CustomMilestone[] = [
  { id: 'm-100', targetDays: 100, label: '100 Days of Love' },
  { id: 'm-365', targetDays: 365, label: '1 Year Anniversary (365 Days)' },
  { id: 'm-500', targetDays: 500, label: '500 Days Milestone' },
  { id: 'm-730', targetDays: 730, label: '2 Years Anniversary' },
  { id: 'm-1000', targetDays: 1000, label: '1,000 Days Milestone' },
  { id: 'm-1825', targetDays: 1825, label: '5 Years of Love' },
];

const LoveDayCounterView: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('omni_love_start_date');
      if (saved) return saved;
    } catch {}
    return '2024-02-14';
  });

  const [partnerNames, setPartnerNames] = useState<{ user: string; partner: string }>(() => {
    try {
      const saved = localStorage.getItem('omni_love_partner_names');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { user: 'You', partner: 'Partner' };
  });

  const [milestones, setMilestones] = useState<CustomMilestone[]>(() => {
    try {
      const saved = localStorage.getItem('omni_love_milestones');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MILESTONES;
  });

  const [isEditNamesOpen, setIsEditNamesOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [userNameInput, setUserNameInput] = useState(partnerNames.user);
  const [partnerNameInput, setPartnerNameInput] = useState(partnerNames.partner);
  const [newMilestoneDays, setNewMilestoneDays] = useState<number>(200);
  const [newMilestoneLabel, setNewMilestoneLabel] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('omni_love_start_date', startDate);
      localStorage.setItem('omni_love_partner_names', JSON.stringify(partnerNames));
      localStorage.setItem('omni_love_milestones', JSON.stringify(milestones));
    } catch {}
  }, [startDate, partnerNames, milestones]);

  // Compute stats in local time
  const now = new Date();
  const start = parseLocalDate(startDate);
  const diffMs = Math.max(0, now.getTime() - start.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = Math.floor(totalDays / 30.4375);
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Compute days until next yearly anniversary
  const currentYear = now.getFullYear();
  let nextAnniversary = new Date(currentYear, start.getMonth(), start.getDate());
  if (nextAnniversary.getTime() < now.getTime()) {
    nextAnniversary = new Date(currentYear + 1, start.getMonth(), start.getDate());
  }
  const daysUntilNextAnniversary = Math.ceil((nextAnniversary.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const yearsTogether = Math.floor(totalDays / 365.25);

  const handleSaveNames = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    setPartnerNames({
      user: userNameInput.trim() || 'You',
      partner: partnerNameInput.trim() || 'Partner',
    });
    setIsEditNamesOpen(false);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneLabel.trim() || !newMilestoneDays) return;
    sounds.playSuccess();
    const item: CustomMilestone = {
      id: `ms-${Date.now()}`,
      targetDays: Number(newMilestoneDays),
      label: newMilestoneLabel.trim(),
    };
    setMilestones(prev => [...prev, item].sort((a, b) => a.targetDays - b.targetDays));
    setNewMilestoneLabel('');
    setIsAddMilestoneOpen(false);
  };

  const handleDeleteMilestone = (id: string) => {
    sounds.playClick();
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Relationship Counter</span>
            <span aria-hidden="true">·</span>
            <span>Cherish Every Single Day</span>
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-0.5">
            Love Day Counter & Anniversary Milestones
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Track days, weeks, months together, countdown to your next anniversary, and celebrate milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              setUserNameInput(partnerNames.user);
              setPartnerNameInput(partnerNames.partner);
              setIsEditNamesOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 cursor-pointer shadow-2xs"
          >
            <User className="w-3.5 h-3.5" />
            <span>Edit Names</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
            <span className="text-[11px] font-bold text-zinc-400">Since:</span>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Hero Love Display Banner */}
      <div className="bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 text-white rounded-3xl p-6 sm:p-10 shadow-xl text-center relative overflow-hidden space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{partnerNames.user} & {partnerNames.partner}</span>
        </div>

        <div>
          <div className="font-mono font-black text-6xl sm:text-8xl tabular-nums drop-shadow-md">
            {totalDays.toLocaleString()}
          </div>
          <div className="text-sm sm:text-base font-extrabold tracking-wider uppercase opacity-95 mt-1">
            Days of Love & Togetherness
          </div>
        </div>

        {/* Detailed Times Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto pt-4 border-t border-white/20 text-xs font-bold">
          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
            <div className="text-xl font-mono font-black">{totalMonths}</div>
            <div className="opacity-80 text-[11px]">Months</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
            <div className="text-xl font-mono font-black">{totalWeeks}</div>
            <div className="opacity-80 text-[11px]">Weeks</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
            <div className="text-xl font-mono font-black">{totalHours.toLocaleString()}</div>
            <div className="opacity-80 text-[11px]">Hours</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
            <div className="text-xl font-mono font-black">{daysUntilNextAnniversary}</div>
            <div className="opacity-80 text-[11px]">Days to Next Anniv</div>
          </div>
        </div>
      </div>

      {/* Next Anniversary Countdown Card */}
      <div className="bg-rose-50/70 dark:bg-rose-950/30 rounded-3xl border border-rose-200/80 dark:border-rose-900/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CalendarHeart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              Next Anniversary: Year {yearsTogether + 1}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Celebrating on {nextAnniversary.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="text-right self-end sm:self-center">
          <span className="text-2xl font-mono font-black text-rose-600 dark:text-rose-400">
            {daysUntilNextAnniversary === 0 ? 'TODAY! 🎉' : `${daysUntilNextAnniversary} days away`}
          </span>
        </div>
      </div>

      {/* Upcoming Milestones */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Relationship Milestones ({milestones.length})</span>
          </h3>

          <button
            onClick={() => {
              sounds.playClick();
              setIsAddMilestoneOpen(true);
            }}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Milestone</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestones.map(m => {
            const isPassed = totalDays >= m.targetDays;
            const remaining = m.targetDays - totalDays;

            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isPassed
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{m.label}</span>
                    {isPassed ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500 text-white">
                        REACHED ✓
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] font-bold text-rose-500">
                        In {remaining}d
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {isPassed ? 'Accomplished milestone!' : `Target: ${m.targetDays.toLocaleString()} days`}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteMilestone(m.id)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-rose-600 cursor-pointer"
                  title="Delete milestone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traditional & Modern Anniversary Gift Guide */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Gift className="w-4 h-4 text-rose-500" />
          <span>Anniversary Gift Inspirations</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
            <span className="font-bold text-rose-600 dark:text-rose-400 block text-xs">1st Year</span>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 mt-1">Paper / Clocks</div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Love letter, travel tickets, framed photo album</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
            <span className="font-bold text-rose-600 dark:text-rose-400 block text-xs">2nd Year</span>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 mt-1">Cotton / China</div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Cozy matching loungewear, custom mugs, ceramic decor</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
            <span className="font-bold text-rose-600 dark:text-rose-400 block text-xs">3rd Year</span>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 mt-1">Leather / Crystal</div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Embossed wallet, passport covers, perfume, glassware</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
            <span className="font-bold text-rose-600 dark:text-rose-400 block text-xs">5th Year</span>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 mt-1">Wood / Silverware</div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Engraved wooden board, watch, timeless silverware</p>
          </div>
        </div>
      </div>

      {/* Edit Names Modal */}
      {isEditNamesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
              Personalize Couple Names
            </h3>
            <form onSubmit={handleSaveNames} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={userNameInput}
                  onChange={e => setUserNameInput(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Partner's Name</label>
                <input
                  type="text"
                  required
                  value={partnerNameInput}
                  onChange={e => setPartnerNameInput(e.target.value)}
                  placeholder="e.g. Jordan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditNamesOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Save Names
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Milestone Modal */}
      {isAddMilestoneOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
              Add Custom Milestone
            </h3>
            <form onSubmit={handleAddMilestone} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Milestone Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Moving in together, 200 Days of Love"
                  value={newMilestoneLabel}
                  onChange={e => setNewMilestoneLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Target Days from Start *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newMilestoneDays}
                  onChange={e => setNewMilestoneDays(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMilestoneOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Save Milestone
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
   2. RELATIONSHIP GOALS & BUCKET LIST
   ========================================================================= */

interface RelationshipGoal {
  id: string;
  title: string;
  category: 'Romantic' | 'Travel' | 'Habits' | 'Future' | 'Home';
  targetDate?: string;
  completed: boolean;
  notes?: string;
  priority: 'High' | 'Medium' | 'Normal';
  createdAt: string;
}

const DEFAULT_GOALS: RelationshipGoal[] = [
  {
    id: 'g-1',
    title: 'Weekend cozy cabin getaway with no work devices',
    category: 'Romantic',
    targetDate: '2026-11-15',
    completed: false,
    priority: 'High',
    notes: 'Book a cozy fireplace Airbnb and stargaze together.',
    createdAt: '2026-10-01',
  },
  {
    id: 'g-2',
    title: 'Cook a 3-course candlelight dinner together',
    category: 'Habits',
    targetDate: '2026-10-25',
    completed: true,
    priority: 'Normal',
    notes: 'Homemade pasta from scratch and tiramisu dessert.',
    createdAt: '2026-09-15',
  },
  {
    id: 'g-3',
    title: 'First international beach vacation',
    category: 'Travel',
    targetDate: '2027-02-14',
    completed: false,
    priority: 'High',
    notes: 'Bali or Maldives trip savings fund.',
    createdAt: '2026-10-01',
  },
  {
    id: 'g-4',
    title: 'Weekly Sunday breakfast & morning walk ritual',
    category: 'Habits',
    completed: true,
    priority: 'Normal',
    notes: 'Visit local farmers market and bakeries every weekend.',
    createdAt: '2026-08-10',
  },
];

const RelationshipGoalsView: React.FC = () => {
  const [goals, setGoals] = useState<RelationshipGoal[]>(() => {
    try {
      const saved = localStorage.getItem('omni_love_goals');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_GOALS;
  });

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<RelationshipGoal | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RelationshipGoal['category']>('Romantic');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<RelationshipGoal['priority']>('High');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('omni_love_goals', JSON.stringify(goals));
    } catch {}
  }, [goals]);

  const handleToggleComplete = (id: string) => {
    sounds.playClick();
    setGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleDeleteGoal = (id: string) => {
    sounds.playClick();
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleOpenAdd = () => {
    sounds.playClick();
    setEditingGoal(null);
    setTitle('');
    setCategory('Romantic');
    setTargetDate('');
    setPriority('High');
    setNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (goal: RelationshipGoal) => {
    sounds.playClick();
    setEditingGoal(goal);
    setTitle(goal.title);
    setCategory(goal.category);
    setTargetDate(goal.targetDate || '');
    setPriority(goal.priority);
    setNotes(goal.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    sounds.playSuccess();

    if (editingGoal) {
      setGoals(prev =>
        prev.map(g =>
          g.id === editingGoal.id
            ? {
                ...g,
                title: title.trim(),
                category,
                targetDate: targetDate || undefined,
                priority,
                notes: notes.trim() || undefined,
              }
            : g
        )
      );
    } else {
      const newGoal: RelationshipGoal = {
        id: `goal-${Date.now()}`,
        title: title.trim(),
        category,
        targetDate: targetDate || undefined,
        priority,
        notes: notes.trim() || undefined,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setGoals(prev => [newGoal, ...prev]);
    }
    setIsAddModalOpen(false);
  };

  const handleAddPreset = (presetTitle: string, presetCat: RelationshipGoal['category']) => {
    sounds.playClick();
    const newGoal: RelationshipGoal = {
      id: `goal-${Date.now()}`,
      title: presetTitle,
      category: presetCat,
      completed: false,
      priority: 'Normal',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progressPercent = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  const filteredGoals = goals.filter(g => {
    if (filterCategory === 'All') return true;
    if (filterCategory === 'Completed') return g.completed;
    if (filterCategory === 'Pending') return !g.completed;
    return g.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Progress */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <HeartHandshake className="w-4 h-4 text-rose-500" />
            <span>Couple Aspirations</span>
            <span aria-hidden="true">·</span>
            <span>Shared Bucket List</span>
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            Relationship Goals & Couple Bucket List
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
            Set and track romantic trips, cozy habits, and joint life milestones with complete add, edit, and delete support.
          </p>
        </div>

        <div className="flex items-center gap-4 self-end md:self-center shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-zinc-400">Goals Achieved</div>
            <div className="text-2xl font-black font-mono tabular-nums text-rose-600 dark:text-rose-400">
              {completedCount} / {goals.length} ({progressPercent}%)
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-4 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-semibold mb-2 text-zinc-600 dark:text-zinc-400">
          <span>Overall Couple Journey Progress</span>
          <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quick Add Presets Carousel */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block px-1">
          Inspiration Presets (Tap to Add Instantly)
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {[
            { t: 'Watch both sunrise & sunset together', c: 'Romantic' as const },
            { t: 'Read the same book and discuss weekly', c: 'Habits' as const },
            { t: 'Spontaneous road trip with no map', c: 'Travel' as const },
            { t: 'Cook a 5-star dinner from YouTube tutorial', c: 'Habits' as const },
            { t: 'Create a scrapbook of our flight & ticket stubs', c: 'Romantic' as const },
            { t: 'Surprise sunset picnic in the park', c: 'Romantic' as const },
          ].map(p => (
            <button
              key={p.t}
              onClick={() => handleAddPreset(p.t, p.c)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-rose-400 hover:text-rose-600 whitespace-nowrap cursor-pointer transition-all active:scale-95 shadow-2xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-rose-500" />
              <span>{p.t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
        {['All', 'Romantic', 'Travel', 'Habits', 'Future', 'Home', 'Completed', 'Pending'].map(cat => (
          <button
            key={cat}
            onClick={() => {
              sounds.playClick();
              setFilterCategory(cat);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              filterCategory === cat
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {filteredGoals.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-2">
            <HeartHandshake className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="font-bold text-zinc-700 dark:text-zinc-300">No goals found under this filter.</p>
            <p className="text-[11px] text-zinc-400">Tap "Add Goal" above to create your couple dream.</p>
          </div>
        ) : (
          filteredGoals.map(goal => (
            <div
              key={goal.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                goal.completed
                  ? 'bg-zinc-50/70 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 opacity-80'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  onClick={() => handleToggleComplete(goal.id)}
                  className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer shrink-0 active:scale-90 ${
                    goal.completed
                      ? 'bg-rose-500 border-rose-500 text-white'
                      : 'border-zinc-300 dark:border-zinc-700 hover:border-rose-400'
                  }`}
                  title={goal.completed ? 'Mark pending' : 'Mark completed'}
                >
                  {goal.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-bold text-zinc-900 dark:text-zinc-100 ${
                        goal.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
                      }`}
                    >
                      {goal.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60">
                      {goal.category}
                    </span>
                    {goal.priority === 'High' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60">
                        Priority
                      </span>
                    )}
                  </div>

                  {goal.notes && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{goal.notes}</p>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                    {goal.targetDate && (
                      <span>Target: {formatLocalDate(goal.targetDate)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit and Delete */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleOpenEdit(goal)}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer active:scale-95 transition-all shadow-2xs"
                  title="Edit Goal"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer active:scale-95 transition-all shadow-2xs"
                  title="Delete Goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                {editingGoal ? 'Edit Relationship Goal' : 'New Relationship Goal'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stargazing road trip, Save for joint vacation"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer text-xs"
                  >
                    <option value="Romantic">Romantic</option>
                    <option value="Travel">Travel</option>
                    <option value="Habits">Habits</option>
                    <option value="Future">Future</option>
                    <option value="Home">Home</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer text-xs"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Target Date (Optional)</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Special Notes / Details</label>
                <textarea
                  rows={2}
                  placeholder="Notes, ideas, budget, or surprises..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
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
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-md"
                >
                  Save Goal
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
   3. IMPORTANT DAYS & ANNIVERSARIES TRACKER
   ========================================================================= */

interface ImportantDayItem {
  id: string;
  title: string;
  type: 'Birthday' | 'Anniversary' | 'First Date' | 'Proposal' | 'Milestone' | 'Holiday';
  date: string; // YYYY-MM-DD
  isYearly: boolean;
  notes?: string;
  giftIdeas?: string;
}

const DEFAULT_DAYS: ImportantDayItem[] = [
  {
    id: 'day-1',
    title: "Partner's Birthday 🎂",
    type: 'Birthday',
    date: '2026-11-20',
    isYearly: true,
    notes: 'Surprise dinner & bespoke watch gift.',
    giftIdeas: 'Aesthetic photo book, favorite perfume, handmade card',
  },
  {
    id: 'day-2',
    title: 'Our Official Anniversary 💍',
    type: 'Anniversary',
    date: '2026-12-05',
    isYearly: true,
    notes: 'Celebrating the day we made it official!',
    giftIdeas: 'Weekend trip reservation, romantic letter',
  },
  {
    id: 'day-3',
    title: 'First Date Coffee & Walk ☕',
    type: 'First Date',
    date: '2026-03-14',
    isYearly: true,
    notes: 'The day we sat at the corner cafe for 4 hours nonstop.',
  },
];

const ImportantDaysView: React.FC = () => {
  const [days, setDays] = useState<ImportantDayItem[]>(() => {
    try {
      const saved = localStorage.getItem('omni_love_days');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DAYS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<ImportantDayItem | null>(null);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ImportantDayItem['type']>('Birthday');
  const [date, setDate] = useState('');
  const [isYearly, setIsYearly] = useState(true);
  const [notes, setNotes] = useState('');
  const [giftIdeas, setGiftIdeas] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('omni_love_days', JSON.stringify(days));
    } catch {}
  }, [days]);

  const handleDeleteDay = (id: string) => {
    sounds.playClick();
    setDays(prev => prev.filter(d => d.id !== id));
  };

  const handleOpenAdd = () => {
    sounds.playClick();
    setEditingDay(null);
    setTitle('');
    setType('Birthday');
    setDate('');
    setIsYearly(true);
    setNotes('');
    setGiftIdeas('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ImportantDayItem) => {
    sounds.playClick();
    setEditingDay(item);
    setTitle(item.title);
    setType(item.type);
    setDate(item.date);
    setIsYearly(item.isYearly);
    setNotes(item.notes || '');
    setGiftIdeas(item.giftIdeas || '');
    setIsModalOpen(true);
  };

  const handleSaveDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    sounds.playSuccess();

    if (editingDay) {
      setDays(prev =>
        prev.map(d =>
          d.id === editingDay.id
            ? {
                ...d,
                title: title.trim(),
                type,
                date,
                isYearly,
                notes: notes.trim() || undefined,
                giftIdeas: giftIdeas.trim() || undefined,
              }
            : d
        )
      );
    } else {
      const newDay: ImportantDayItem = {
        id: `day-${Date.now()}`,
        title: title.trim(),
        type,
        date,
        isYearly,
        notes: notes.trim() || undefined,
        giftIdeas: giftIdeas.trim() || undefined,
      };
      setDays(prev => [...prev, newDay]);
    }
    setIsModalOpen(false);
  };

  // Accurate countdown in local time
  const getDaysDiff = (dateStr: string, isYearly: boolean) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = parseLocalDate(dateStr);
    target.setHours(0, 0, 0, 0);

    if (isYearly) {
      const currentYear = today.getFullYear();
      let nextDate = new Date(currentYear, target.getMonth(), target.getDate());
      if (nextDate.getTime() < today.getTime()) {
        nextDate = new Date(currentYear + 1, target.getMonth(), target.getDate());
      }
      const diffMs = nextDate.getTime() - today.getTime();
      return Math.round(diffMs / (1000 * 60 * 60 * 24));
    } else {
      const diffMs = target.getTime() - today.getTime();
      return Math.round(diffMs / (1000 * 60 * 60 * 24));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <CalendarHeart className="w-4 h-4 text-rose-500" />
            <span>Anniversary & Birthday Hub</span>
            <span aria-hidden="true">·</span>
            <span>Never Miss an Important Date</span>
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-0.5">
            Important Days & Birthday Tracker
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Log partner birthdays, first meetings, anniversaries, proposals, and gift ideas with live countdowns.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer self-end md:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Important Day</span>
        </button>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {days.map(item => {
          const daysLeft = getDaysDiff(item.date, item.isYearly);
          const isToday = daysLeft === 0;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isToday
                  ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 shadow-md ring-2 ring-rose-500/20'
                  : 'border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {item.type}
                  </span>

                  {isToday ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white animate-pulse">
                      TODAY! 🎉
                    </span>
                  ) : (
                    <span className="font-mono text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200/60 dark:border-rose-900/60">
                      {daysLeft > 0 ? `In ${daysLeft} day${daysLeft === 1 ? '' : 's'}` : `${Math.abs(daysLeft)} days ago`}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Date: {formatLocalDate(item.date, { month: 'long', day: 'numeric', year: 'numeric' })}
                  {item.isYearly && ' · Recur yearly'}
                </p>

                {item.notes && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    {item.notes}
                  </p>
                )}

                {item.giftIdeas && (
                  <div className="mt-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2">
                    <Gift className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span><strong>Gift Ideas:</strong> {item.giftIdeas}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Edit and Delete */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">Special Event</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer active:scale-95 transition-all"
                    title="Edit important day"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDay(item.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer active:scale-95 transition-all"
                    title="Delete important day"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
                {editingDay ? 'Edit Important Day' : 'Add Important Day / Birthday'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDay} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Event Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Partner's Birthday, Anniversary, Proposal"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Event Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer text-xs"
                  >
                    <option value="Birthday">Birthday 🎂</option>
                    <option value="Anniversary">Anniversary 💍</option>
                    <option value="First Date">First Date ☕</option>
                    <option value="Proposal">Proposal 💖</option>
                    <option value="Milestone">Milestone 🌟</option>
                    <option value="Holiday">Holiday 🌹</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isYearly}
                  onChange={e => setIsYearly(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                />
                <span className="text-zinc-700 dark:text-zinc-300 text-xs">
                  Repeats annually (yearly birthday/anniversary)
                </span>
              </label>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Gift Ideas & Wishlist</label>
                <input
                  type="text"
                  placeholder="e.g. Watch, dinner, flowers, perfume"
                  value={giftIdeas}
                  onChange={e => setGiftIdeas(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Celebration Notes</label>
                <textarea
                  rows={2}
                  placeholder="Surprise plans, restaurant details..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
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
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-md"
                >
                  Save Event
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
   4. MEET-UP & LAST MEETING PLANNER
   ========================================================================= */

interface MeetupLog {
  id: string;
  title: string;
  date: string;
  location: string;
  activity: string;
  highlights?: string;
  rating?: number;
}

const DEFAULT_PAST_MEETINGS: MeetupLog[] = [
  {
    id: 'm-1',
    title: 'Sunset Beach Walk & Seafood Dinner',
    date: '2026-09-28',
    location: 'Marina Boardwalk',
    activity: 'Walked along the coastline and watched the sunset.',
    highlights: 'Talked about our future travels for 3 hours straight.',
    rating: 5,
  },
  {
    id: 'm-2',
    title: 'Weekend Museum Exhibit & Coffee',
    date: '2026-09-14',
    location: 'Modern Art Gallery & Bean Cafe',
    activity: 'Viewed modern art photography and had iced lattes.',
    highlights: 'Bought matching souvenir pins.',
    rating: 5,
  },
];

const MeetupTrackerView: React.FC = () => {
  const [nextMeetup, setNextMeetup] = useState<{
    date: string;
    time: string;
    location: string;
    activity: string;
    notes?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('omni_love_next_meetup');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      date: '2026-10-10',
      time: '18:30',
      location: 'Little Italy Trattoria',
      activity: 'Candlelight dinner and late evening walk',
      notes: 'Remember to pick up her favorite dark chocolate pralines.',
    };
  });

  const [pastMeetings, setPastMeetings] = useState<MeetupLog[]>(() => {
    try {
      const saved = localStorage.getItem('omni_love_past_meetings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PAST_MEETINGS;
  });

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newHighlights, setNewHighlights] = useState('');

  const [isEditingNext, setIsEditingNext] = useState(false);
  const [editDate, setEditDate] = useState(nextMeetup.date);
  const [editTime, setEditTime] = useState(nextMeetup.time);
  const [editLocation, setEditLocation] = useState(nextMeetup.location);
  const [editActivity, setEditActivity] = useState(nextMeetup.activity);
  const [editNotes, setEditNotes] = useState(nextMeetup.notes || '');

  useEffect(() => {
    try {
      localStorage.setItem('omni_love_next_meetup', JSON.stringify(nextMeetup));
    } catch {}
  }, [nextMeetup]);

  useEffect(() => {
    try {
      localStorage.setItem('omni_love_past_meetings', JSON.stringify(pastMeetings));
    } catch {}
  }, [pastMeetings]);

  const handleSaveNextMeetup = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    setNextMeetup({
      date: editDate,
      time: editTime,
      location: editLocation,
      activity: editActivity,
      notes: editNotes,
    });
    setIsEditingNext(false);
  };

  const handleDeleteMeetingLog = (id: string) => {
    sounds.playClick();
    setPastMeetings(prev => prev.filter(m => m.id !== id));
  };

  const handleAddPastMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;
    sounds.playSuccess();

    const newLog: MeetupLog = {
      id: `m-${Date.now()}`,
      title: newTitle.trim(),
      date: newDate,
      location: newLocation.trim() || 'Cozy Spot',
      activity: newActivity.trim() || 'Spent time together',
      highlights: newHighlights.trim() || undefined,
      rating: 5,
    };

    setPastMeetings(prev => [newLog, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setNewTitle('');
    setNewDate('');
    setNewLocation('');
    setNewActivity('');
    setNewHighlights('');
    setIsLogModalOpen(false);
  };

  // 1-Click: Mark next meet-up as met and convert directly into a memory
  const handleMarkNextMet = () => {
    sounds.playSuccess();
    const newLog: MeetupLog = {
      id: `m-${Date.now()}`,
      title: nextMeetup.activity,
      date: nextMeetup.date,
      location: nextMeetup.location,
      activity: nextMeetup.activity,
      highlights: nextMeetup.notes || 'Had an amazing date together!',
      rating: 5,
    };
    setPastMeetings(prev => [newLog, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    // Set next meetup placeholder to 1 week out
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateStr = nextWeek.toISOString().split('T')[0];
    setNextMeetup({
      date: dateStr,
      time: '19:00',
      location: 'Favorite Cafe',
      activity: 'Next date & coffee talk',
      notes: '',
    });
  };

  // Sort past meetings chronologically descending
  const sortedMeetings = [...pastMeetings].sort((a, b) => parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime());
  const lastMeeting = sortedMeetings[0];
  const daysSinceLastMeeting = lastMeeting
    ? Math.max(0, Math.floor((Date.now() - parseLocalDate(lastMeeting.date).getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  // Days until next meetup
  const daysUntilNext = nextMeetup.date
    ? Math.ceil((new Date(`${nextMeetup.date}T${nextMeetup.time || '00:00'}`).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <Compass className="w-4 h-4 text-rose-500" />
            <span>Meet-Up & Date Hub</span>
            <span aria-hidden="true">·</span>
            <span>Cherished Encounters</span>
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-0.5">
            Meet-Up & Last Meeting Planner
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Plan your next date, count down the hours, and keep a timestamped memory log of every time you meet.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setIsLogModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer self-end md:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Past Meeting</span>
        </button>
      </div>

      {/* Two Highlight Cards: Next Meetup vs Last Met */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Next Planned Meet-Up */}
        <div className="bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent rounded-3xl border border-rose-200 dark:border-rose-900/60 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-500 text-white flex items-center gap-1.5 shadow-xs">
                <Calendar className="w-3.5 h-3.5" />
                Next Planned Meet-Up
              </span>

              {daysUntilNext !== null && (
                <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400 bg-white dark:bg-zinc-800 px-3 py-1 rounded-xl shadow-2xs border border-rose-200/50 dark:border-rose-900/50">
                  {daysUntilNext > 0 ? `In ${daysUntilNext} days` : daysUntilNext === 0 ? 'TODAY!' : 'Meeting time passed'}
                </span>
              )}
            </div>

            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
              {nextMeetup.activity}
            </h3>

            <div className="space-y-1.5 mt-3 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="font-mono font-bold">
                  {formatLocalDate(nextMeetup.date, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })} at {nextMeetup.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{nextMeetup.location}</span>
              </div>
              {nextMeetup.notes && (
                <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-xs italic bg-white/70 dark:bg-zinc-800/70 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/40">
                  "{nextMeetup.notes}"
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-rose-200/60 dark:border-rose-900/60 flex items-center justify-between gap-2">
            <button
              onClick={handleMarkNextMet}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>We Met! Save Memory</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setEditDate(nextMeetup.date);
                setEditTime(nextMeetup.time);
                setEditLocation(nextMeetup.location);
                setEditActivity(nextMeetup.activity);
                setEditNotes(nextMeetup.notes || '');
                setIsEditingNext(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-rose-50 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 cursor-pointer shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Date</span>
            </button>
          </div>
        </div>

        {/* Last Meeting Memory & Days Elapsed */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                Last Meeting Memory
              </span>

              {daysSinceLastMeeting !== null && (
                <span className="font-mono text-xs font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-xl">
                  {daysSinceLastMeeting === 0 ? 'Met today! ❤️' : `${daysSinceLastMeeting} days since last meeting`}
                </span>
              )}
            </div>

            {lastMeeting ? (
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                  {lastMeeting.title}
                </h3>
                <p className="text-xs text-zinc-500 font-mono">
                  {formatLocalDate(lastMeeting.date, { month: 'long', day: 'numeric', year: 'numeric' })} · {lastMeeting.location}
                </p>
                {lastMeeting.highlights && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    "{lastMeeting.highlights}"
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 py-6 text-center">
                No past meetings recorded yet. Tap "Log Past Meeting" to record memories.
              </p>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
            <span>Cherish every encounter</span>
            <span className="text-rose-500 font-bold">♥ Always Together</span>
          </div>
        </div>
      </div>

      {/* Chronological History of Past Meetings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-400 px-1">
          <span>Memories & Past Date History ({sortedMeetings.length})</span>
          <span>Chronological Log</span>
        </div>

        {sortedMeetings.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6">
            No memories logged yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedMeetings.map(item => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-400">
                      ({formatLocalDate(item.date)})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {item.location}
                    </span>
                    <span>· {item.activity}</span>
                  </div>
                  {item.highlights && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                      "{item.highlights}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteMeetingLog(item.id)}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer active:scale-95 transition-all shadow-2xs self-end sm:self-center shrink-0"
                  title="Delete memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Next Meetup Modal */}
      {isEditingNext && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                Plan Next Meet-Up
              </h3>
              <button
                onClick={() => setIsEditingNext(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNextMeetup} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Planned Activity / Title *</label>
                <input
                  type="text"
                  required
                  value={editActivity}
                  onChange={e => setEditActivity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Time</label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={e => setEditTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Location / Venue</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Sweet Notes / Reminders</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingNext(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-md"
                >
                  Save Meet-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Past Meeting Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                Log Past Meeting Memory
              </h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPastMeeting} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset beach walk, Cozy cafe brunch"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Cafe, Park, Downtown"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">What did you do?</label>
                <input
                  type="text"
                  placeholder="Dinner, movie, ice skating, long conversations..."
                  value={newActivity}
                  onChange={e => setNewActivity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1">Sweet Highlights / Memories</label>
                <textarea
                  rows={2}
                  placeholder="Most memorable moment, funny story..."
                  value={newHighlights}
                  onChange={e => setNewHighlights(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-md"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
