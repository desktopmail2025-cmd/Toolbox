import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Trophy, CheckCircle2, Award, Target, ChevronRight, Gift, Clock } from 'lucide-react';
import { StreakState, recordStreakVisit, claimDailyBoost, getWeeklyActivity, getStreakMilestoneInfo } from '../../utils/streak';
import { admobService } from '../../services/admobService';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';

export const DrawerStreakWidget: React.FC = () => {
  const [streak, setStreak] = useState<StreakState>(() => recordStreakVisit());
  const [weekDays, setWeekDays] = useState(() => getWeeklyActivity());

  useEffect(() => {
    const updated = recordStreakVisit();
    setStreak(updated);
    setWeekDays(getWeeklyActivity());
  }, []);

  const todayStr = (() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  })();

  const isBoostClaimed = streak.claimedBoostDate === todayStr;

  const hoursUntilMidnight = (() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.max(1, Math.round((midnight.getTime() - now.getTime()) / (1000 * 60 * 60)));
  })();

  const handleClaim = () => {
    if (isBoostClaimed) return;
    const next = claimDailyBoost();
    setStreak(next);
  };

  const handleWatchBonusAd = () => {
    sounds.playClick();
    admobService.showRewardedAd(
      () => {
        sounds.playSuccess();
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#10b981', '#6366f1'],
          });
        } catch {}
      },
      { type: 'Streak Shield & Bonus Perk', amount: 1 }
    );
  };

  const streakDays = streak.currentStreak || 1;
  const milestone = getStreakMilestoneInfo(streakDays);

  return (
    <div className="p-3.5 mx-3 my-2 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-500/15 dark:via-orange-500/15 dark:to-rose-500/15 border border-amber-300/40 dark:border-amber-700/50 shadow-xs space-y-3">
      {/* Top Streak Header with Flame */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Animated Glowing Flame */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 blur-xs opacity-75 animate-pulse" />
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
              <Flame className="w-5 h-5 animate-[bounce_2s_infinite]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                {streakDays} Day{streakDays === 1 ? '' : 's'} Streak
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                Active
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
              Daily OmniToolbox Habit
            </span>
          </div>
        </div>

        {/* Best Record Badge */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
          <Trophy className="w-3 h-3 text-amber-500" />
          <span>Best: {streak.bestStreak || streakDays}</span>
        </div>
      </div>

      {/* Earned Title Banner & Encouragement */}
      <div className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-amber-200/70 dark:border-amber-800/60 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-[11px] font-extrabold text-amber-900 dark:text-amber-200 tracking-tight">
              {milestone.title}
            </span>
          </div>
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {milestone.badge}
          </span>
        </div>

        {/* Milestone Goal Progress Bar */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3 text-indigo-500" />
              <span>Goal: {milestone.nextGoalTitle}</span>
            </span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {streakDays}/{milestone.nextGoalDays}d
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${milestone.tierColor}`}
              style={{ width: `${milestone.progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] text-zinc-400">
            <span>{milestone.daysRemaining > 0 ? `${milestone.daysRemaining} days until next milestone` : 'Milestone Achieved! 🎉'}</span>
            <span>{milestone.progressPercent}%</span>
          </div>
        </div>

        {/* Unlocked Perk Tag */}
        <p className="text-[10px] text-zinc-600 dark:text-zinc-300 pt-0.5 leading-tight font-medium">
          {milestone.unlockedPerk}
        </p>
      </div>

      {/* 7-Day Week Indicator Bar */}
      <div className="space-y-1">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div
              key={day.dayName}
              className={`flex flex-col items-center justify-center py-1 rounded-lg text-center transition-all ${
                day.isActive
                  ? 'bg-amber-500 text-white font-black shadow-xs shadow-amber-500/30 scale-[1.02]'
                  : day.isToday
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-400/60'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 font-medium'
              }`}
            >
              <span className="text-[9px] uppercase leading-none">{day.dayName.slice(0, 1)}</span>
              <span className="text-[10px] mt-0.5 leading-none">
                {day.isActive ? '🔥' : '•'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Action Section: Show Claim Button ONLY 1 Time a Day */}
      {!isBoostClaimed ? (
        <button
          type="button"
          onClick={handleClaim}
          className="w-full py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-orange-500/25 active:scale-95 animate-pulse"
        >
          <Sparkles className="w-4 h-4" />
          <span>Claim Daily Streak Boost (1/Day)</span>
        </button>
      ) : (
        <div className="space-y-2">
          {/* Claimed Status Badge (replaces the claim button once claimed today) */}
          <div className="p-2.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-emerald-900 dark:text-emerald-200 block text-xs leading-none">
                  Streak Claimed for Today!
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                  Next claim in ~{hoursUntilMidnight}h
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shrink-0">
              1/1 Claimed
            </span>
          </div>

          {/* Optional Opt-In Rewarded Ad for Extra Shield / Bonus (100% Non-Annoying) */}
          <button
            type="button"
            onClick={handleWatchBonusAd}
            className="w-full p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-amber-300/70 dark:border-amber-700/60 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer flex items-center justify-between text-left group shadow-2xs"
            title="Watch a short test ad to earn a Streak Shield"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Gift className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-extrabold text-zinc-900 dark:text-zinc-100 block leading-tight truncate">
                  Bonus: Streak Shield Perk
                </span>
                <span className="text-[9.5px] text-zinc-500 dark:text-zinc-400 truncate block">
                  Watch 5s test ad to earn a free shield
                </span>
              </div>
            </div>
            <span className="px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9.5px] font-extrabold shadow-2xs group-hover:brightness-105 transition-all shrink-0 ml-1">
              Watch Ad
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
