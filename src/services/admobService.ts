import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';

export const ADMOB_CONFIG = {
  // Real Google AdMob Ad Unit IDs configured as requested
  BANNER_ID: 'ca-app-pub-9097792601837119/3759988398',
  INTERSTITIAL_ID: 'ca-app-pub-9097792601837119/6010747218',
  REWARDED_ID: 'ca-app-pub-9097792601837119/2867552435',
  // Non-annoying natural interval: 60 seconds cooldown ensures ads never spam users back-to-back,
  // while ensuring mobile users on normal browsing journeys naturally see interstitials at transitions.
  MIN_INTERSTITIAL_INTERVAL_MS: 60000,
  // At least 2 natural view transitions/actions between automatic interstitials
  MIN_TRANSITIONS_REQUIRED: 2,
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
type AdFreeListener = (adFreeRemainingSeconds: number) => void;

class AdMobService {
  private isInitialized = false;
  private isNative = false;
  private isNativeBannerShowing = false;
  private isInterstitialPreloaded = false;
  private isRewardedPreloaded = false;
  private transitionCounter = 0;
  private adFreeUntilTimestamp = 0;

  private metrics: AdPerformanceMetrics;
  private logs: AdEventLog[] = [];
  private metricsSubscribers = new Set<MetricsListener>();
  private logsSubscribers = new Set<LogsListener>();
  private modalSubscribers = new Set<ModalStateListener>();
  private adFreeSubscribers = new Set<AdFreeListener>();

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
    this.loadAdFreeState();
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

  private loadAdFreeState() {
    try {
      const saved = localStorage.getItem('omnitoolbox_ad_free_until');
      if (saved) {
        this.adFreeUntilTimestamp = Number(saved) || 0;
      }
    } catch {}
  }

  private saveMetrics() {
    try {
      localStorage.setItem('omnitoolbox_admob_metrics', JSON.stringify(this.metrics));
    } catch {}
    this.notifyMetrics();
  }

  private saveLogs() {
    try {
      if (this.logs.length > 60) {
        this.logs = this.logs.slice(-60);
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

  private notifyAdFreeState() {
    const remaining = this.getAdFreeRemainingSeconds();
    this.adFreeSubscribers.forEach(cb => cb(remaining));
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

  public subscribeAdFreeState(cb: AdFreeListener): () => void {
    this.adFreeSubscribers.add(cb);
    cb(this.getAdFreeRemainingSeconds());
    return () => this.adFreeSubscribers.delete(cb);
  }

  public isAdFreeActive(): boolean {
    return Date.now() < this.adFreeUntilTimestamp;
  }

  public getAdFreeRemainingSeconds(): number {
    return Math.max(0, Math.floor((this.adFreeUntilTimestamp - Date.now()) / 1000));
  }

  public grantAdFreePass(minutes: number = 30) {
    this.adFreeUntilTimestamp = Date.now() + minutes * 60 * 1000;
    try {
      localStorage.setItem('omnitoolbox_ad_free_until', String(this.adFreeUntilTimestamp));
    } catch {}
    this.notifyAdFreeState();
    this.logEvent('rewarded', ADMOB_CONFIG.REWARDED_ID, 'reward_earned', `Unlocked ${minutes}m 100% Ad-Free Pass`);
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
          testingDevices: [],
          initializeForTesting: false,
        });

        // Register native AdMob event listeners
        AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
          this.logEvent('banner', ADMOB_CONFIG.BANNER_ID, 'loaded', 'Native banner loaded');
        });
        AdMob.addListener(BannerAdPluginEvents.AdImpression, () => {
          this.recordImpression('banner');
        });
        AdMob.addListener(BannerAdPluginEvents.Opened, () => {
          this.recordClick('banner');
        });

        AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
          this.isInterstitialPreloaded = true;
          this.logEvent('interstitial', ADMOB_CONFIG.INTERSTITIAL_ID, 'loaded', 'Native interstitial ready in background');
        });
        AdMob.addListener(InterstitialAdPluginEvents.AdImpression, () => {
          this.recordImpression('interstitial');
        });
        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
          this.isInterstitialPreloaded = false;
          this.logEvent('interstitial', ADMOB_CONFIG.INTERSTITIAL_ID, 'dismissed', 'Native interstitial closed');
          // Immediately pre-cache next interstitial for zero-latency mobile delivery
          this.preloadInterstitial();
        });
        AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (err) => {
          this.isInterstitialPreloaded = false;
          this.logEvent('interstitial', ADMOB_CONFIG.INTERSTITIAL_ID, 'failed', `Interstitial load notice: ${err?.message || ''}`);
        });

        AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
          this.isRewardedPreloaded = true;
          this.logEvent('rewarded', ADMOB_CONFIG.REWARDED_ID, 'loaded', 'Native rewarded ad ready in background');
        });
        AdMob.addListener(RewardAdPluginEvents.AdImpression, () => {
          this.recordImpression('rewarded');
        });
        AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
          this.recordRewardEarned({ type: reward.type || 'points', amount: reward.amount || 1 });
        });
        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          this.isRewardedPreloaded = false;
          this.preloadRewarded();
        });

        this.logEvent('banner', ADMOB_CONFIG.BANNER_ID, 'loaded', 'Native AdMob initialized with real Ad Unit IDs');

        // Preload interstitial and rewarded in background on native mobile launch
        this.preloadInterstitial();
        this.preloadRewarded();
        this.showNativeBanner();
      } catch (err: any) {
        console.warn('Native AdMob initialization notice:', err?.message || err);
      }
    } else {
      // In web/preview environment
      this.logEvent('banner', ADMOB_CONFIG.BANNER_ID, 'loaded', `Web AdMob Engine ready (Unit: ${ADMOB_CONFIG.BANNER_ID})`);
    }

    this.isInitialized = true;
  }

  public async preloadInterstitial(): Promise<void> {
    if (!this.isNative) return;
    try {
      await AdMob.prepareInterstitial({
        adId: ADMOB_CONFIG.INTERSTITIAL_ID,
        isTesting: false,
      });
      this.isInterstitialPreloaded = true;
    } catch (e: any) {
      this.isInterstitialPreloaded = false;
    }
  }

  public async preloadRewarded(): Promise<void> {
    if (!this.isNative) return;
    try {
      await AdMob.prepareRewardVideoAd({
        adId: ADMOB_CONFIG.REWARDED_ID,
        isTesting: false,
      });
      this.isRewardedPreloaded = true;
    } catch (e: any) {
      this.isRewardedPreloaded = false;
    }
  }

  public async showNativeBanner(): Promise<void> {
    if (!this.isNative || this.isNativeBannerShowing) return;
    try {
      await AdMob.showBanner({
        adId: ADMOB_CONFIG.BANNER_ID,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false,
      });
      this.isNativeBannerShowing = true;
    } catch (e) {
      // ignore
    }
  }

  public recordImpression(type: 'banner' | 'interstitial' | 'rewarded') {
    this.metrics.impressions[type] += 1;
    this.metrics.impressions.total += 1;

    // Realistic eCPM: Banner $0.50 CPM ($0.0005/imp), Interstitial $5.00 CPM ($0.005/imp), Rewarded $15.00 CPM ($0.015/imp)
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

    // Watching a rewarded ad grants 30 minutes 100% Ad-Free pass
    this.grantAdFreePass(30);

    if (this.pendingRewardCallback) {
      this.pendingRewardCallback(reward);
      this.pendingRewardCallback = undefined;
    }
  }

  /**
   * Smart transition trigger: Call this whenever the user naturally completes a tool,
   * switches a tab, or finishes a game.
   * Ensures an ad is shown at a rate users will NOT feel annoyed at any cost:
   * 1. If Ad-Free Pass is active -> never shows.
   * 2. Must satisfy 60s cooldown.
   * 3. Must have had at least 2 view actions/transitions.
   */
  public async checkAndTriggerTransitionInterstitial(context: string = 'View transition'): Promise<boolean> {
    this.transitionCounter += 1;

    if (this.isAdFreeActive()) {
      return false;
    }

    const now = Date.now();
    const timeSinceLast = now - this.metrics.lastInterstitialTimestamp;

    if (
      timeSinceLast >= ADMOB_CONFIG.MIN_INTERSTITIAL_INTERVAL_MS &&
      this.transitionCounter >= ADMOB_CONFIG.MIN_TRANSITIONS_REQUIRED
    ) {
      this.transitionCounter = 0;
      return this.showInterstitial({ force: false, context });
    }

    return false;
  }

  public async showInterstitial(options: { force?: boolean; context?: string } = {}): Promise<boolean> {
    const now = Date.now();
    const timeSinceLast = now - this.metrics.lastInterstitialTimestamp;

    // Respect Ad-Free VIP Pass
    if (!options.force && this.isAdFreeActive()) {
      this.logEvent(
        'interstitial',
        ADMOB_CONFIG.INTERSTITIAL_ID,
        'failed',
        `Ad suppressed: VIP Ad-Free pass active (${this.getAdFreeRemainingSeconds()}s left)`
      );
      return false;
    }

    // Check frequency cap unless explicitly forced
    if (!options.force && timeSinceLast < ADMOB_CONFIG.MIN_INTERSTITIAL_INTERVAL_MS) {
      const waitSec = Math.round((ADMOB_CONFIG.MIN_INTERSTITIAL_INTERVAL_MS - timeSinceLast) / 1000);
      this.logEvent(
        'interstitial',
        ADMOB_CONFIG.INTERSTITIAL_ID,
        'failed',
        `Capped to protect user experience (next allowed in ${waitSec}s)`
      );
      return false;
    }

    this.metrics.lastInterstitialTimestamp = now;
    this.saveMetrics();

    // Native mobile attempt
    if (this.isNative) {
      try {
        if (this.isInterstitialPreloaded) {
          await AdMob.showInterstitial();
          this.isInterstitialPreloaded = false;
          this.recordImpression('interstitial');
          this.preloadInterstitial();
          return true;
        } else {
          await AdMob.prepareInterstitial({
            adId: ADMOB_CONFIG.INTERSTITIAL_ID,
            isTesting: false,
          });
          await AdMob.showInterstitial();
          this.recordImpression('interstitial');
          this.preloadInterstitial();
          return true;
        }
      } catch (err: any) {
        console.warn('Native interstitial notice:', err);
      }
    }

    // UI Presentation for Web
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

    if (this.isNative) {
      this.preloadInterstitial();
    }
  }

  public async showRewardedAd(
    onReward: (reward: { type: string; amount: number }) => void,
    rewardDetails: { type: string; amount: number } = { type: '30-Minute Ad-Free Pass', amount: 1 }
  ): Promise<boolean> {
    this.pendingRewardCallback = onReward;

    if (this.isNative) {
      try {
        if (this.isRewardedPreloaded) {
          await AdMob.showRewardVideoAd();
          this.isRewardedPreloaded = false;
          this.recordImpression('rewarded');
          this.preloadRewarded();
          return true;
        } else {
          await AdMob.prepareRewardVideoAd({
            adId: ADMOB_CONFIG.REWARDED_ID,
            isTesting: false,
          });
          await AdMob.showRewardVideoAd();
          this.recordImpression('rewarded');
          this.preloadRewarded();
          return true;
        }
      } catch (err: any) {
        console.warn('Native rewarded notice:', err);
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

    if (this.isNative) {
      this.preloadRewarded();
    }
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
    this.transitionCounter = 0;
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
