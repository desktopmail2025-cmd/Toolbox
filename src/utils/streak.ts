import { sounds } from './audio';
import confetti from 'canvas-confetti';

export interface StreakState {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  claimedBoostDate: string; // 'YYYY-MM-DD'
  activeDates: string[]; // List of recent active dates 'YYYY-MM-DD'
}

const STORAGE_KEY = 'omni_daily_streak';

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getStoredStreak(): StreakState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    currentStreak: 1,
    bestStreak: 1,
    lastActiveDate: '',
    claimedBoostDate: '',
    activeDates: [],
  };
}

export function recordStreakVisit(): StreakState {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  const state = getStoredStreak();

  let updatedStreak = state.currentStreak;
  let updatedBest = state.bestStreak;

  if (state.lastActiveDate === today) {
    // Already logged today
    return state;
  } else if (state.lastActiveDate === yesterday) {
    // Visited yesterday, streak increments!
    updatedStreak = (state.currentStreak || 0) + 1;
  } else if (!state.lastActiveDate) {
    // First visit ever
    updatedStreak = 1;
  } else {
    // Missed a day
    updatedStreak = 1;
  }

  if (updatedStreak > updatedBest) {
    updatedBest = updatedStreak;
  }

  const updatedActiveDates = Array.from(new Set([...(state.activeDates || []), today])).slice(-30);

  const nextState: StreakState = {
    currentStreak: updatedStreak,
    bestStreak: updatedBest,
    lastActiveDate: today,
    claimedBoostDate: state.claimedBoostDate || '',
    activeDates: updatedActiveDates,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    // ignore
  }

  return nextState;
}

export function claimDailyBoost(): StreakState {
  const today = getTodayString();
  const state = getStoredStreak();

  const nextState: StreakState = {
    ...state,
    claimedBoostDate: today,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    // ignore
  }

  sounds.playSuccess();
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ef4444', '#6366f1', '#10b981'],
    });
  } catch {
    // ignore
  }

  return nextState;
}

export function getWeeklyActivity(): { dayName: string; isToday: boolean; isActive: boolean }[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  // Monday of the current week
  const dayOfWeek = (now.getDay() + 6) % 7; // 0 is Monday, 6 is Sunday
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek);

  const state = getStoredStreak();
  const activeSet = new Set(state.activeDates || []);
  const todayStr = getTodayString();

  return days.map((dayName, idx) => {
    const curDate = new Date(monday);
    curDate.setDate(monday.getDate() + idx);
    const y = curDate.getFullYear();
    const m = String(curDate.getMonth() + 1).padStart(2, '0');
    const d = String(curDate.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    return {
      dayName,
      isToday: dateStr === todayStr,
      isActive: activeSet.has(dateStr) || dateStr === todayStr,
    };
  });
}

export interface StreakMilestoneInfo {
  title: string;
  badge: string;
  tierColor: string;
  isOneWeekReached: boolean;
  isOneMonthReached: boolean;
  nextGoalDays: number;
  nextGoalTitle: string;
  progressPercent: number;
  daysRemaining: number;
  unlockedPerk: string;
  celebrationMessage: string;
}

export function getStreakMilestoneInfo(streakDays: number): StreakMilestoneInfo {
  const days = Math.max(1, streakDays || 1);

  if (days >= 30) {
    // 1 Month or more
    const nextTarget = days < 60 ? 60 : 100;
    const nextTargetTitle = days < 60 ? '60-Day Grandmaster' : '100-Day Century Immortal';
    const progress = Math.min(100, Math.round(((days - 30) / (nextTarget - 30)) * 100));
    return {
      title: '👑 30-Day Omni Legend',
      badge: '👑 Legendary Royalty',
      tierColor: 'from-amber-400 via-rose-500 to-purple-600',
      isOneWeekReached: true,
      isOneMonthReached: true,
      nextGoalDays: nextTarget,
      nextGoalTitle: nextTargetTitle,
      progressPercent: progress,
      daysRemaining: Math.max(0, nextTarget - days),
      unlockedPerk: '🏆 Month 1 Milestone Unlocked: Crown of Dedication & Legendary VIP Rank!',
      celebrationMessage: 'Unstoppable! You have built a month-long unbroken daily powerhouse habit.',
    };
  }

  if (days >= 14) {
    // 2 Weeks
    const progress = Math.min(100, Math.round(((days - 14) / 16) * 100));
    return {
      title: '🔥 2-Week Efficiency Titan',
      badge: '🔥 Productivity Titan',
      tierColor: 'from-orange-500 to-rose-600',
      isOneWeekReached: true,
      isOneMonthReached: false,
      nextGoalDays: 30,
      nextGoalTitle: '30-Day Omni Legend (1 Month)',
      progressPercent: progress,
      daysRemaining: 30 - days,
      unlockedPerk: '⚡ 2-Week Milestone Unlocked: Fire Titan Badge & Golden Efficiency Status!',
      celebrationMessage: 'Halfway to 1 Month! 14 days of unstoppable momentum.',
    };
  }

  if (days >= 7) {
    // 1 Week reached!
    const progress = Math.min(100, Math.round(((days - 7) / 7) * 100));
    return {
      title: '⚡ Week 1 Habit Champion',
      badge: '⚡ 7-Day Master',
      tierColor: 'from-amber-500 to-orange-500',
      isOneWeekReached: true,
      isOneMonthReached: false,
      nextGoalDays: 14,
      nextGoalTitle: '14-Day Efficiency Titan (2 Weeks)',
      progressPercent: progress,
      daysRemaining: 14 - days,
      unlockedPerk: '🎁 1-Week Milestone Unlocked: Golden Habit Spark badge & Champion Status!',
      celebrationMessage: '7-Day Milestone Unlocked! You have officially formed a rock-solid habit.',
    };
  }

  if (days >= 3) {
    const progress = Math.min(100, Math.round((days / 7) * 100));
    return {
      title: '✨ Habit Spark',
      badge: '✨ Rising Focus',
      tierColor: 'from-indigo-500 to-sky-500',
      isOneWeekReached: false,
      isOneMonthReached: false,
      nextGoalDays: 7,
      nextGoalTitle: '7-Day Habit Champion (1 Week)',
      progressPercent: progress,
      daysRemaining: 7 - days,
      unlockedPerk: 'Targeting 1-Week Champion: Reach day 7 to unlock Golden Habit Spark badge!',
      celebrationMessage: 'Consistency is clicking! 3+ days in a row.',
    };
  }

  // 1-2 days
  const progress = Math.min(100, Math.round((days / 7) * 100));
  return {
    title: '🌱 Tool Explorer',
    badge: '🌱 Novice',
    tierColor: 'from-emerald-500 to-teal-500',
    isOneWeekReached: false,
    isOneMonthReached: false,
    nextGoalDays: 7,
    nextGoalTitle: '7-Day Habit Champion (1 Week)',
    progressPercent: progress,
    daysRemaining: 7 - days,
    unlockedPerk: 'Targeting 1-Week Champion: Come back daily to reach 7 days and claim your first title!',
    celebrationMessage: 'Great start! Open OmniToolbox every day to build momentum.',
  };
}
