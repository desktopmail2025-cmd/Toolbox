// Professional Web Audio API sound generator with bulletproof mobile/desktop reliability
class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private isUnlocked: boolean = false;
  private lastSoundTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('omni_sound_enabled');
      this.enabled = saved !== null ? saved === 'true' : true;
      this.setupUnlockListeners();
      this.setupGlobalAppSoundDelegation();
    }
  }

  // Pre-unlock audio on any initial interaction so mobile browsers (iOS & Android) don't silence audio
  private setupUnlockListeners() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.initCtx();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          this.isUnlocked = true;
        }).catch(() => {});
      } else if (this.ctx) {
        this.isUnlocked = true;
      }
    };

    const events = ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown'];
    events.forEach(evt => {
      window.addEventListener(evt, unlock, { passive: true });
    });
  }

  // Global sound delegation for the whole app: automatically plays a subtle click for interactive elements
  private setupGlobalAppSoundDelegation() {
    if (typeof window === 'undefined') return;

    const handleGlobalInteraction = (e: Event) => {
      if (!this.enabled) return;

      // Throttle rapid repeated sounds (e.g. within 60ms)
      const now = Date.now();
      if (now - this.lastSoundTime < 60) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if clicked element or its closest ancestor is an interactive button/link/tab
      const interactiveEl = target.closest(
        'button, a, [role="button"], [role="tab"], input[type="radio"], input[type="checkbox"], select'
      );

      if (interactiveEl) {
        this.lastSoundTime = now;
        this.playClick(650, 0.035);
      }
    };

    // Use capture phase so all clicks/taps across all components trigger reliably
    document.addEventListener('click', handleGlobalInteraction, { capture: true, passive: true });
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          return null;
        }
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('omni_sound_enabled', String(this.enabled));
    if (this.enabled) {
      this.playClick(750, 0.05);
    }
    return this.enabled;
  }

  public playClick(freq = 600, duration = 0.04) {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  public playPop(freq = 440, duration = 0.04) {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  public playSuccess() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(0.07, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.22);
      });
    } catch {
      // ignore
    }
  }

  public playError() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      [240, 180].forEach((freq, i) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.08, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.15);
      });
    } catch {
      // ignore
    }
  }

  public playTone(freq = 880, duration = 0.3) {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }
}

export const sounds = new SoundEngine();
