import React, { useState, useEffect } from 'react';
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
    subtitle: 'Over 100+ lightning-fast calculators, scientific solvers, measurement tools, and document suites for mobile, tablet, and desktop.',
    features: [
      'Install to Android / iOS home screen via "Install App" or browser menu for 1-tap offline native app experience',
      'Zero server lag — all calculations and processing execute 100% client-side',
      'Unified searchable directory across 20+ specialized domain categories',
    ],
  },
  {
    icon: BookOpen,
    badge: 'Academic Powerhouse',
    badgeColor: 'text-emerald-600 dark:text-emerald-400',
    title: 'Subject Formulas & Solver + Study Hub',
    subtitle: 'Comprehensive mathematical, scientific, engineering, and financial equations organized by subject and grade level.',
    features: [
      'Coverage across 7 disciplines: Math, Physics, Chemistry, Biology, Economics, CS & Earth Sciences',
      'Interactive solvers: adjust custom variables with live step-by-step mathematical derivations',
      'Timetable Scheduler & Book Lovers\' Reading Shelf with custom cover photo uploads',
    ],
  },
  {
    icon: Binary,
    badge: 'Number Theory Engine',
    badgeColor: 'text-amber-600 dark:text-amber-400',
    title: 'Perfect Prime Calculator & Analyzer',
    subtitle: 'No basic shortcuts — full prime factorization tree, Sieve of Eratosthenes, and divisor analytics.',
    features: [
      'Deterministic 6k±1 primality verification for integers up to 14 digits',
      'Canonical factor tree ladders with exponent notation (e.g. 2³ × 3² × 5)',
      'Goldbach\'s conjecture partition explorer and Sieve range density statistics',
    ],
  },
  {
    icon: Lock,
    badge: 'Security & Health Reminders',
    badgeColor: 'text-rose-600 dark:text-rose-400',
    title: 'Encrypted Vault & Audio Notifications',
    subtitle: 'Confidential encrypted notes vault with strict reset protections and pill reminder alerts.',
    features: [
      'Encrypted Private Notes Vault: forgot PIN permanently wipes previous notes to safeguard privacy',
      'Medicine & Pill Reminder: browser audio alarms so you never miss a dose',
      'Today\'s Hot Picks: direct curated journalism from BBC, Forbes, CNN & The Guardian',
    ],
  },
  {
    icon: Trophy,
    badge: 'Live Sports Center',
    badgeColor: 'text-emerald-600 dark:text-emerald-400',
    title: 'World Sports Scores & Tactics',
    subtitle: 'Track live scores across global football leagues, cricket, NBA, and design tactical lineups.',
    features: [
      'Live football scores with goal alerts, stats, and real-time standings across top leagues',
      'Interactive Tactical Pitch: 4-3-3, 4-2-3-1 formations, substitute swaps and squad exporter',
      'Universal Match Scorecard Maker with timer, foul log, and printable official match report',
    ],
  },
  {
    icon: Terminal,
    badge: 'Code Anywhere (No PC Needed)',
    badgeColor: 'text-cyan-600 dark:text-cyan-400',
    title: 'Mobile & PC Code Playground',
    subtitle: 'Practice programming in HTML/CSS/JS, Python & algorithms right from your smartphone or desktop.',
    features: [
      'Mobile-optimized soft-key toolbar: 1-tap insert for (), {}, [], <>, ;, quotes and operators',
      'Live sandboxed web preview with iframe DOM rendering and console message interception',
      'Interactive Python runner with preloaded algorithm presets and local project storage',
    ],
  },
  {
    icon: Keyboard,
    badge: 'Pro Shortcuts & Speed',
    badgeColor: 'text-purple-600 dark:text-purple-400',
    title: 'Speed & Tactile Productivity',
    subtitle: 'Master the suite with high-efficiency keyboard shortcuts and hot picks.',
    features: [
      'Cmd+K / Ctrl+K — Open universal search bar instantly from any screen',
      'Cmd+J / Ctrl+J — Jump directly into quick scratchpad notes',
      'Starred Favorites — Bookmark your most used daily tools for 1-click access',
    ],
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Always restart onboarding from the beginning when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
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
          setCurrentSlide(prev => prev + 1);
        } else {
          handleComplete();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentSlide > 0) {
          sounds.playClick();
          setCurrentSlide(prev => prev - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  if (!isOpen) return null;

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;
  const isLast = currentSlide === SLIDES.length - 1;

  const handleNext = () => {
    sounds.playClick();
    if (isLast) {
      handleComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    sounds.playClick();
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleComplete = () => {
    sounds.playSuccess();
    try {
      localStorage.setItem('omni_onboarded', 'true');
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative flex flex-col justify-between min-h-[460px]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
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

        {/* Slide Content */}
        <div className="space-y-4 my-auto animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-md">
            <Icon className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              {slide.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
              {slide.subtitle}
            </p>
          </div>

          {/* Key Bullet Highlights */}
          <div className="space-y-2 pt-2">
            {slide.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions & Dots */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
          {/* Pagination Dots */}
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.playClick();
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
                className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
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
