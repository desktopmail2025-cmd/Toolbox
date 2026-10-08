import React, { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    // Fast, responsive splash fade-out (180ms + 120ms fade) for an instant app launch
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 180);

    const finishTimer = setTimeout(() => {
      onFinishRef.current();
    }, 300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b] text-white select-none transition-opacity duration-150 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center text-center p-6 space-y-4 max-w-sm">
        {/* Glowing Logo Icon */}
        <div className="relative">
          <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
          <img
            src="/icon.svg"
            alt="OmniToolbox"
            className="relative w-20 h-20 rounded-3xl object-contain shadow-2xl border border-white/20"
          />
        </div>

        {/* Wordmark Name */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            OmniToolbox
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-medium">
            Universal Utility Suite
          </p>
        </div>
      </div>
    </div>
  );
};

