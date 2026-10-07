import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';
import {
  Sparkles, Zap, ShieldCheck, BookOpen, Heart, Flame,
  Check, ArrowRight, ArrowLeft, X, Lock, Keyboard, Bookmark, Laptop,
  Calculator, Binary, Bell, Trophy, Terminal
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OnboardingSlide {
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  features: string[];
}

const SLIDES: OnboardingSlide[] = [
  {
    icon: Sparkles,
    badge: 'Welcome to OmniToolbox',
    badgeColor: 'text-indigo-600 dark:text-indigo-400',
    title: 'Your Ultimate Offline & Live Utility Suite',
    subtitle: 'Over 100+ lightning-fast calculators, solvers, converters & text tools.',
    features: [
      '1-Tap native PWA install for Android, iOS & PC with full offline capability',
      'Zero server latency: 100% private, client-side real-time execution',
      'Unified search across 24 specialized categories and 180+ tools',
    ],
  },
  {
    icon: BookOpen,
    badge: 'Academic Powerhouse',
    badgeColor: 'text-emerald-600 dark:text-emerald-400',
    title: 'Subject Formulas & Academic Study Hub',
    subtitle: 'Interactive STEM equations with live derivation calculators.',
    features: [
      'Covers 7 fields: Math, Physics, Chemistry, Biology, Economics & CS',
      'Adjust custom variables with instant step-by-step mathematical output',
      'Study timetable organizer & custom bookshelf reading tracker',
    ],
  },
  {
    icon: Binary,
    badge: 'Number Theory Engine',
    badgeColor: 'text-amber-600 dark:text-amber-400',
    title: 'Perfect Prime Calculator & Analyzer',
    subtitle: 'Prime factorization tree, Sieve of Eratosthenes & divisor engine.',
    features: [
      'Deterministic 6k±1 primality verification for integers up to 14 digits',
      'Canonical factor tree ladders with standard exponent notation',
      'Goldbach conjecture partition explorer and divisor analytics',
    ],
  },
  {
    icon: Lock,
    badge: 'Security & Health Reminders',
    badgeColor: 'text-rose-600 dark:text-rose-400',
    title: 'Encrypted Vault & Health Reminders',
    subtitle: 'Private notes lock, pill audio reminders & curated hot news.',
    features: [
      'Encrypted Private Vault: forgot-PIN protection safeguards confidential notes',
      'Medicine & Pill Reminder: audio alerts so you never miss a schedule',
      'Today\'s Hot Picks: direct curated headlines from Forbes, BBC & CNN',
    ],
  },
  {
    icon: Trophy,
    badge: 'Live Sports Center',
    badgeColor: 'text-emerald-600 dark:text-emerald-400',
    title: 'World Sports Center & Tactics Board',
    subtitle: 'Track live scores across global leagues & design formations.',
    features: [
      'Live football, cricket & basketball score updates and league standings',
      'Interactive Tactics Pitch: 4-3-3, 4-2-3-1 formations with squad exporter',
      'Match Scorecard Maker with foul timer and printable match report',
    ],
  },
  {
    icon: Terminal,
    badge: 'Code Anywhere (No PC Needed)',
    badgeColor: 'text-cyan-600 dark:text-cyan-400',
    title: 'Mobile & Desktop Code Playground',
    subtitle: 'Code in HTML, CSS, JavaScript & Python without needing a PC.',
    features: [
      'Mobile soft-key bar: 1-tap insert for (), {}, [], quotes & operators',
      'Live sandboxed web preview with console logging & DOM debugger',
      'Interactive Python runner with preloaded algorithm presets',
    ],
  },
  {
    icon: Keyboard,
    badge: 'Pro Shortcuts & Speed',
    badgeColor: 'text-purple-600 dark:text-purple-400',
    title: 'Pro Shortcuts & Speed Dial Navigation',
    subtitle: 'Master the suite with high-efficiency navigation & favorites.',
    features: [
      'Cmd+K / Ctrl+K — Open universal search bar instantly from any screen',
      'Floating Speed Dial — 1-tap jump to Home, Starred Tools, or Notes',
      'Offline Arcade — Enjoy 2048, Tic-Tac-Toe AI, Minesweeper & Reflex Test',
    ],
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Always restart onboarding from the beginning when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
      setSlideDirection('next');
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleComplete();
      } else if (e.key === 'ArrowRight') {
        if (currentSlide < SLIDES.length - 1) {
          sounds.playClick();
          setSlideDirection('next');
          setCurrentSlide(prev => prev + 1);
        } else {
          handleComplete();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentSlide > 0) {
          sounds.playClick();
          setSlideDirection('prev');
          setCurrentSlide(prev => prev - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  const handleComplete = () => {
    sounds.playSuccess();
    try {
      localStorage.setItem('omni_onboarded', 'true');
    } catch {}
    onClose();
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentSlide === SLIDES.length - 1) {
      handleComplete();
    } else {
      setSlideDirection('next');
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    sounds.playClick();
    setSlideDirection('prev');
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;

    // Detect intentional horizontal swipe gesture
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Swiped left -> Next
        handleNext();
      } else {
        // Swiped right -> Prev
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!isOpen) return null;

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;
  const isLast = currentSlide === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in select-none">
      {/* Uniform, strictly identical size dialog card across all devices & slides */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 w-full max-w-[480px] h-[510px] min-h-[510px] max-h-[92vh] relative flex flex-col justify-between overflow-hidden shadow-2xl"
      >
        {/* Top Header Bar (Fixed 32px height) */}
        <div className="h-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className={slide.badgeColor}>{slide.badge}</span>
            <span aria-hidden="true" className="text-zinc-400">·</span>
            <span className="font-mono text-zinc-400">
              {currentSlide + 1} of {SLIDES.length}
            </span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              handleComplete();
            }}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Content with fixed, consistent vertical slot sizes across all slides */}
        <div className="flex-1 flex flex-col justify-start overflow-hidden py-2 my-auto">
          <div
            key={currentSlide}
            className={`space-y-3 ${
              slideDirection === 'next' ? 'animate-onboarding-next' : 'animate-onboarding-prev'
            }`}
          >
            {/* Icon (Fixed 48px height) */}
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-900/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs shrink-0">
              <Icon className="w-6 h-6" />
            </div>

            {/* Title & Subtitle container with guaranteed fixed height */}
            <div className="h-[74px] sm:h-[80px] flex flex-col justify-center">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50 line-clamp-2 leading-snug">
                {slide.title}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {slide.subtitle}
              </p>
            </div>

            {/* Key Bullet Highlights with uniform height slot */}
            <div className="space-y-2.5 h-[148px] flex flex-col justify-start pt-1">
              {slide.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    ✓
                  </span>
                  <span className="leading-snug line-clamp-2">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions & Dots (Fixed 52px height) */}
        <div className="h-13 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          {/* Pagination Dots */}
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.playClick();
                  setSlideDirection(idx > currentSlide ? 'next' : 'prev');
                  setCurrentSlide(idx);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide
                    ? 'w-6 bg-indigo-600 dark:bg-indigo-400'
                    : 'w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next / Back Controls */}
          <div className="flex items-center gap-2">
            {currentSlide > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer active:scale-95 transition-all"
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer transition-all"
            >
              <span>{isLast ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
