import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Fade out after 650ms for a swift, professional launch
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 250);
    }, 650);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white select-none transition-opacity duration-400 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center text-center p-6 space-y-4 max-w-sm">
        {/* Glowing Logo Icon */}
        <div className="relative">
          <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-indigo-500/40 border border-white/20">
            <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Wordmark Name Only */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            OmniToolbox
          </h1>
        </div>
      </div>
    </div>
  );
};

