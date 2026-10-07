import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents,
  AdmobConsentStatus,
} from '@capacitor-community/admob';

export const ADMOB_CONFIG = {
  BANNER_ID: 'ca-app-pub-3940256099942544/9214589741',
  INTERSTITIAL_ID: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED_ID: 'ca-app-pub-3940256099942544/5224354917',
  MIN_INTERSTITIAL_INTERVAL_MS: 180000, // 3 minutes between automatic interstitials to avoid annoying users
};

export interface AdPerformanceMetrics {
  impressions: {
    banner: number;
    interstitial: number;
    rewarded: number;
    total: number;
  };
  clicks: {
    banner: number;
    interstitial: number;
    rewarded: number;
    total: number;
  };
  rewardsClaimed: number;
  estimatedRevenueUsd: number;
  lastInterstitialTimestamp: number;
}

export interface AdEventLog {
  id: string;
  timestamp: number;
  adType: 'banner' | 'interstitial' | 'rewarded';
  adUnitId: string;
  event: 'loaded' | 'impression' | 'clicked' | 'dismissed' | 'reward_earned' | 'failed';
  details?: string;
}

type MetricsListener = (metrics: AdPerformanceMetrics) => void;
type LogsListener = (logs: AdEventLog[]) => void;
type ModalStateListener = (state: { showInterstitial: boolean; showRewarded: boolean; rewardedReward?: { type: string; amount: number } }) => void;

class AdMobService {
  private isInitialized = false;
  private isNative = false;
  private metrics: AdPerformanceMetrics;
  private logs: AdEventLog[] = [];
  private metricsSubscribers = new Set<MetricsListener>();
  private logsSubscribers = new Set<LogsListener>();
  private modalSubscribers = new Set<ModalStateListener>();

  private modalState: {
    showInterstitial: boolean;
    showRewarded: boolean;
    rewardedReward?: { type: string; amount: number };
  } = {
    showInterstitial: false,
    showRewarded: false,
  };

  private pendingRewardCallback?: (reward: { type: string; amount: number }) => void;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.metrics = this.loadMetrics();
    this.logs = this.loadLogs();
  }

  private loadMetrics(): AdPerformanceMetrics {
    try {
      const saved = localStorage.getItem('omnitoolbox_admob_metrics');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {
      impressions: { banner: 0, interstitial: 0, rewarded: 0, total: 0 },
      clicks: { banner: 0, interstitial: 0, rewarded: 0, total: 0 },
      rewardsClaimed: 0,
      estimatedRevenueUsd: 0,
      lastInterstitialTimestamp: 0,
    };
  }

  private loadLogs(): AdEventLog[] {
    try {
      const saved = localStorage.getItem('omnitoolbox_admob_logs');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [];
  }

  private saveMetrics() {
    try {
      localStorage.setItem('omnitoolbox_admob_metrics', JSON.stringify(this.metrics));
    } catch {}
    this.notifyMetrics();
  }

  private saveLogs() {
    try {
      // Keep last 50 logs for performance
      if (this.logs.length > 50) {
        this.logs = this.logs.slice(-50);
      }
      localStorage.setItem('omnitoolbox_admob_logs', JSON.stringify(this.logs));
    } catch {}
    this.notifyLogs();
  }

  private notifyMetrics() {
    this.metricsSubscribers.forEach(cb => cb({ ...this.metrics }));
  }

  private notifyLogs() {
    this.logsSubscribers.forEach(cb => cb([...this.logs]));
  }

  private notifyModalState() {
    this.modalSubscribers.forEach(cb => cb({ ...this.modalState }));
  }

  public subscribeMetrics(cb: MetricsListener): () => void {
    this.metricsSubscribers.add(cb);
    cb({ ...this.metrics });
    return () => this.metricsSubscribers.delete(cb);
  }

  public subscribeLogs(cb: LogsListener): () => void {
    this.logsSubscribers.add(cb);
    cb([...this.logs]);
    return () => this.logsSubscribers.delete(cb);
  }

  public subscribeModalState(cb: ModalStateListener): () => void {
    this.modalSubscribers.add(cb);
    cb({ ...this.modalState });
    return () => this.modalSubscribers.delete(cb);
  }

  public logEvent(
    adType: 'banner' | 'interstitial' | 'rewarded',
    adUnitId: string,
    event: 'loaded' | 'impression' | 'clicked' | 'dismissed' | 'reward_earned' | 'failed',
    details?: string
  ) {
    const entry: AdEventLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      adType,
      adUnitId,
      event,
      details,
    };
    this.logs.unshift(entry);
    this.saveLogs();
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (this.isNative) {
      try {
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          testingDevices: ['EMULATOR', '2077ef9a63d2b398840261c8221a0c9b'],
          initializeForTesting: true,
        });

        // Register native AdMob listeners
        AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
          this.logEvent('banner', ADMOB_CONFIG.BANNER_ID, 'loaded', 'Native banner loaded');
        });
        AdMob.addListener(BannerAdPluginEvents.Impression, () => {
          this.recordImpression('banner');
        });
        AdMob.addListener(BannerAdPluginEvents.Clicked, () => {
          this.recordClick('banner');
        });

        AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
          this.logEvent('interstitial', ADMOB_CONFIG.INTERSTITIAL_ID, 'loaded', 'Native interstitial ready');
        });
        AdMob.addListener(InterstitialAdPluginEvents.Impression, () => {
          this.recordImpression('interstitial');
        });
        AdMob.addListener(InterstitialAdPluginEvents.Clicked, () => {
          this.recordClick('interstitial');
        });
        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
          this.logEvent('interstitial', ADMOB_CONFIG.INTERSTITIAL_ID, 'dismissed', 'Native interstitial closed');
        });

        AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
          this.logEvent('rewarded', ADMOB_CONFIG.REWARDED_ID, 'loaded', 'Native rewarded video ready');
        });
        AdMob.addListener(RewardAdPluginEvents.Impression, () => {
          this.recordImpression('rewarded');
        });
        AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
          this.recordRewardEarned({ type: reward.type || 'points', amount: reward.amount || 1 });
        });

        this.logEvent('banner', ADMOB_CONFIG.BANNER_ID, 'loaded', 'Native AdMob SDK initialized successfully');
      } catch (err: any) {
        console.warn('Native AdMob initialization notice:', err?.message || err);
      }
    } else {
      // In web/preview environment
      this.logEvent('banner', ADMOB_CONFIG.BANNER_ID, 'loaded', 'Web AdMob Simulator & Diagnostics initialized');
    }

    this.isInitialized = true;
  }

  public recordImpression(type: 'banner' | 'interstitial' | 'rewarded') {
    this.metrics.impressions[type] += 1;
    this.metrics.impressions.total += 1;

    // Estimate realistic eCPM: Banner $0.50 CPM ($0.0005/imp), Interstitial $5.00 CPM ($0.005/imp), Rewarded $15.00 CPM ($0.015/imp)
    const cpmRate = type === 'banner' ? 0.0005 : type === 'interstitial' ? 0.005 : 0.015;
    this.metrics.estimatedRevenueUsd = Number((this.metrics.estimatedRevenueUsd + cpmRate).toFixed(4));

    const unitId =
      type === 'banner'
        ? ADMOB_CONFIG.BANNER_ID
        : type === 'interstitial'
        ? ADMOB_CONFIG.INTERSTITIAL_ID
        : ADMOB_CONFIG.REWARDED_ID;

    this.logEvent(type, unitId, 'impression', `Impression #${this.metrics.impressions[type]}`);
    this.saveMetrics();
  }

  public recordClick(type: 'banner' | 'interstitial' | 'rewarded') {
    this.metrics.clicks[type] += 1;
    this.metrics.clicks.total += 1;

    const unitId =
      type === 'banner'
        ? ADMOB_CONFIG.BANNER_ID
        : type === 'interstitial'
        ? ADMOB_CONFIG.INTERSTITIAL_ID
        : ADMOB_CONFIG.REWARDED_ID;

    this.logEvent(type, unitId, 'clicked', `Click registered on ${type}`);
    this.saveMetrics();
  }

  public recordRewardEarned(reward: { type: string; amount: number }) {
    this.metrics.rewardsClaimed += 1;
    this.logEvent('rewarded', ADMOB_CONFIG.REWARDED_ID, 'reward_earned', `Granted ${reward.amount} ${reward.type}`);
    this.saveMetrics();

    if (this.pendingRewardCallback) {
      this.pendingRewardCallback(reward);
      this.pendingRewardCallback = undefined;
    }
  }

  // Suitable & non-annoying Interstitial triggering
  // Allows testing on demand or at natural milestones (with interval cap)
  public async showInterstitial(options: { force?: boolean; context?: string } = {}): Promise<boolean> {
    const now = Date.now();
    const timeSinceLast = now - this.metrics.lastInterstitialTimestamp;

    // Check frequency cap unless explicitly forced (e.g. testing)
    if (!options.force && timeSinceLast < ADMOB_CONFIG.MIN_INTERSTITIAL_INTERVAL_MS) {
      this.logEvent(
        'interstitial',
        ADMOB_CONFIG.INTERSTITIAL_ID,
        'failed',
        `Capped to protect user experience (next allowed in ${Math.round((ADMOB_CONFIG.MIN_INTERSTITIAL_INTERVAL_MS - timeSinceLast) / 1000)}s)`
      );
      return false;
    }

    this.metrics.lastInterstitialTimestamp = now;
    this.saveMetrics();

    if (this.isNative) {
      try {
        await AdMob.prepareInterstitial({
          adId: ADMOB_CONFIG.INTERSTITIAL_ID,
          isTesting: true,
        });
        await AdMob.showInterstitial();
        this.recordImpression('interstitial');
        return true;
      } catch (err: any) {
        console.warn('Native interstitial failed, falling back to UI simulation:', err);
      }
    }

    // UI Simulation for Web/Preview & test inspection
    this.modalState = {
      ...this.modalState,
      showInterstitial: true,
    };
    this.notifyModalState();
    this.recordImpression('interstitial');
    return true;
  }

  public dismissInterstitial() {
    this.modalState = {
      ...this.modalState,
      showInterstitial: false,
    };
    this.notifyModalState();
    this.logEvent('interstitial', ADMOB_CONFIG.INTERSTITIAL_ID, 'dismissed', 'User dismissed interstitial ad');
  }

  // Suitable & user-friendly Rewarded Video triggering (always opt-in)
  public async showRewardedAd(
    onReward: (reward: { type: string; amount: number }) => void,
    rewardDetails: { type: string; amount: number } = { type: 'Pro Daily Pass', amount: 1 }
  ): Promise<boolean> {
    this.pendingRewardCallback = onReward;

    if (this.isNative) {
      try {
        await AdMob.prepareRewardVideoAd({
          adId: ADMOB_CONFIG.REWARDED_ID,
          isTesting: true,
        });
        await AdMob.showRewardVideoAd();
        this.recordImpression('rewarded');
        return true;
      } catch (err: any) {
        console.warn('Native rewarded failed, falling back to UI simulation:', err);
      }
    }

    // UI Simulation for Web/Preview & test inspection
    this.modalState = {
      ...this.modalState,
      showRewarded: true,
      rewardedReward: rewardDetails,
    };
    this.notifyModalState();
    this.recordImpression('rewarded');
    return true;
  }

  public dismissRewarded(completed: boolean) {
    if (completed && this.modalState.rewardedReward) {
      this.recordRewardEarned(this.modalState.rewardedReward);
    } else {
      this.logEvent('rewarded', ADMOB_CONFIG.REWARDED_ID, 'dismissed', 'Rewarded video skipped before completion');
      this.pendingRewardCallback = undefined;
    }

    this.modalState = {
      ...this.modalState,
      showRewarded: false,
      rewardedReward: undefined,
    };
    this.notifyModalState();
  }

  public resetMetrics() {
    this.metrics = {
      impressions: { banner: 0, interstitial: 0, rewarded: 0, total: 0 },
      clicks: { banner: 0, interstitial: 0, rewarded: 0, total: 0 },
      rewardsClaimed: 0,
      estimatedRevenueUsd: 0,
      lastInterstitialTimestamp: 0,
    };
    this.logs = [];
    this.saveMetrics();
    this.saveLogs();
    this.logEvent('banner', ADMOB_CONFIG.BANNER_ID, 'loaded', 'Ad metrics and event log reset');
  }

  public getMetrics(): AdPerformanceMetrics {
    return { ...this.metrics };
  }

  public getLogs(): AdEventLog[] {
    return [...this.logs];
  }
}

export const admobService = new AdMobService();
