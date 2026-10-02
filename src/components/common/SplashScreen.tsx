import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Fade out after 1.1s
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 400);
    }, 1100);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white select-none transition-opacity duration-400 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center text-center p-6 space-y-6 max-w-sm">
        {/* Glowing Logo Icon */}
        <div className="relative">
          <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-indigo-500/40 border border-white/20">
            <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Wordmark */}
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-tight text-white">
            OmniToolbox
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            All-in-One Utility Suite
          </p>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
          100+ High-Performance Calculators, Scientific Solvers, Converters & Creative Utilities.
        </p>

        {/* Loading Progress Bar */}
        <div className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-[progress_1s_ease-in-out_infinite]" />
        </div>

        {/* Quick skip */}
        <button
          onClick={() => {
            setFading(true);
            setTimeout(onFinish, 200);
          }}
          className="text-[11px] text-zinc-500 hover:text-zinc-300 font-semibold cursor-pointer pt-2"
        >
          Skip Intro →
        </button>
      </div>
    </div>
  );
};
