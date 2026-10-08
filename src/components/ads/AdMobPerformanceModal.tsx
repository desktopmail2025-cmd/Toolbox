import React, { useState, useEffect } from 'react';
import {
  X,
  BarChart3,
  Copy,
  Check,
  Play,
  Gift,
  RefreshCw,
  Trash2,
  ShieldCheck,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { admobService, ADMOB_CONFIG, AdPerformanceMetrics, AdEventLog } from '../../services/admobService';
import { sounds } from '../../utils/audio';

interface AdMobPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdMobPerformanceModal: React.FC<AdMobPerformanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [metrics, setMetrics] = useState<AdPerformanceMetrics>(admobService.getMetrics());
  const [logs, setLogs] = useState<AdEventLog[]>(admobService.getLogs());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'units' | 'logs'>('overview');

  useEffect(() => {
    if (!isOpen) return;

    const unsubMetrics = admobService.subscribeMetrics((m) => setMetrics(m));
    const unsubLogs = admobService.subscribeLogs((l) => setLogs(l));

    return () => {
      unsubMetrics();
      unsubLogs();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      sounds.playClick();
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const handleTestInterstitial = async () => {
    sounds.playClick();
    await admobService.showInterstitial({ force: true, context: 'Diagnostics Test Station' });
  };

  const handleTestRewarded = async () => {
    sounds.playClick();
    await admobService.showRewardedAd(
      (reward) => {
        // Callback executed
      },
      { type: 'Pro Daily Pass', amount: 1 }
    );
  };

  const handleTestBanner = () => {
    sounds.playClick();
    admobService.recordImpression('banner');
  };

  const handleReset = () => {
    sounds.playClick();
    if (confirm('Reset all AdMob test metrics and logs?')) {
      admobService.resetMetrics();
    }
  };

  const ctrPercent = metrics.impressions.total > 0
    ? ((metrics.clicks.total / metrics.impressions.total) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-50">
                  AdMob Live Performance & Inspector
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Monitor live impressions, CTR, rewards & test ad units in real-time
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            title="Close AdMob Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-5 bg-white dark:bg-zinc-900 gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('units')}
            className={`py-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'units'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            Ad Units & Test IDs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`py-2.5 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <span>Live Event Stream</span>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px]">
              {logs.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'overview' && (
            <>
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Impressions</span>
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                    {metrics.impressions.total}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    B:{metrics.impressions.banner} · I:{metrics.impressions.interstitial} · R:{metrics.impressions.rewarded}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Clicks & CTR</span>
                    <Activity className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                    {metrics.clicks.total} <span className="text-xs font-semibold text-zinc-400">({ctrPercent}%)</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    Fill Rate: 100% Test
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Rewards Claimed</span>
                    <Gift className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {metrics.rewardsClaimed}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    100% user-consented
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Est. Test Revenue</span>
                    <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                    ${metrics.estimatedRevenueUsd.toFixed(3)}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    Based on market eCPM
                  </div>
                </div>
              </div>

              {/* One-Click Live Test Station */}
              <div className="p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200">
                      Live Test Actions (Verify Running Status)
                    </h4>
                    <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400/80">
                      Instantly fire test ads to verify presentation, timing, animations, and callbacks:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={handleTestInterstitial}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Test Interstitial Ad</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTestRewarded}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Test Rewarded Ad</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTestBanner}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Banner (Impression)</span>
                  </button>
                </div>
              </div>

              {/* Non-Annoying Architecture & Placement Policy */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-850/40 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Non-Intrusive Placement Architecture</span>
                </div>
                <ul className="text-zinc-600 dark:text-zinc-400 text-[11px] space-y-1 list-disc list-inside leading-relaxed">
                  <li><strong>Banner:</strong> Docked at the bottom with a minimize/expand toggle. Never blocks inputs or tools.</li>
                  <li><strong>Interstitial:</strong> Frequency-capped to a minimum of 3 minutes. Never interrupts calculations or typing.</li>
                  <li><strong>Rewarded:</strong> 100% opt-in for bonus arcade perks or daily passes. Never pops up unexpectedly.</li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'units' && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Official Google AdMob Application ID & Ad Unit IDs configured in this application:
              </div>

              {/* Application ID */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">
                      APP ID
                    </span>
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Google AdMob App ID</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(ADMOB_CONFIG.APP_ID, 'appid')}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    {copiedId === 'appid' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'appid' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 break-all select-all">
                  {ADMOB_CONFIG.APP_ID}
                </div>
                <div className="text-[10px] text-zinc-500">
                  Configured in AndroidManifest.xml, strings.xml, and Capacitor configuration.
                </div>
              </div>

              {/* Interstitial ID */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px]">
                      INTERSTITIAL
                    </span>
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Full-Screen Transition</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(ADMOB_CONFIG.INTERSTITIAL_ID, 'interstitial')}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                  >
                    {copiedId === 'interstitial' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'interstitial' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 break-all select-all">
                  {ADMOB_CONFIG.INTERSTITIAL_ID}
                </div>
                <div className="text-[10px] text-zinc-500">
                  Triggers at natural exit milestones and in the test station. 5-second countdown with skip.
                </div>
              </div>

              {/* Rewarded ID */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">
                      REWARDED
                    </span>
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Opt-In Video Reward</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(ADMOB_CONFIG.REWARDED_ID, 'rewarded')}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    {copiedId === 'rewarded' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'rewarded' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 break-all select-all">
                  {ADMOB_CONFIG.REWARDED_ID}
                </div>
                <div className="text-[10px] text-zinc-500">
                  Offers in-game extra lives or utility day passes. Rewarded callback triggered on completion.
                </div>
              </div>

              {/* Banner ID */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-sky-400 font-extrabold text-[10px]">
                      BANNER
                    </span>
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Standard 320x50 / Adaptive</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(ADMOB_CONFIG.BANNER_ID, 'banner')}
                    className="flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                  >
                    {copiedId === 'banner' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'banner' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 break-all select-all">
                  {ADMOB_CONFIG.BANNER_ID}
                </div>
                <div className="text-[10px] text-zinc-500">
                  Docked smoothly at the footer and overview with a minimize pill toggle.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Real-time AdMob event audit trail (latest first)</span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-rose-500 hover:text-rose-600 cursor-pointer font-semibold text-[11px]"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Logs</span>
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-10 text-zinc-400 text-xs">
                  No ad events recorded yet. Trigger a test action above to see events!
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                  {logs.map((log) => {
                    const time = new Date(log.timestamp).toLocaleTimeString();
                    const badgeColor =
                      log.event === 'impression'
                        ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                        : log.event === 'clicked'
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        : log.event === 'reward_earned'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';

                    return (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/60 flex items-center justify-between text-[11px] gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${badgeColor}`}>
                            {log.event}
                          </span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                            {log.adType.toUpperCase()}
                          </span>
                          {log.details && (
                            <span className="text-zinc-400 truncate hidden xs:inline">
                              · {log.details}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                          {time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between text-xs">
          <span className="text-zinc-400 text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Ready for Google AdMob production deployment</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold hover:opacity-90 transition-opacity cursor-pointer text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
