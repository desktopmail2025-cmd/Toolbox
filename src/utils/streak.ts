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
