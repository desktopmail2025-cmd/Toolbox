import React from 'react';

export const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'h-3.5 w-auto' }) => (
  <svg viewBox="0 0 74 24" fill="none" className={className} aria-label="Google">
    {/* Clean Google Sans wordmark in white/neutral or colored */}
    <path
      d="M9.24 18.28c-5.1 0-9.24-4.14-9.24-9.24S4.14-.2 9.24-.2c2.81 0 4.82 1.1 6.34 2.54l-1.78 1.78c-1.08-1.01-2.54-1.8-4.56-1.8-3.73 0-6.66 3.03-6.66 6.72s2.93 6.72 6.66 6.72c2.42 0 3.8-.97 4.69-1.86.72-.72 1.19-1.76 1.36-3.18H9.24V8.32h8.04c.08.43.12.94.12 1.51 0 1.8-.49 4.02-2.1 5.63-1.57 1.63-3.58 2.82-6.06 2.82z"
      fill="#4285F4"
    />
    <path
      d="M23.95 12.39c0 3.51-2.73 6.01-6.1 6.01s-6.1-2.5-6.1-6.01c0-3.53 2.73-6.01 6.1-6.01s6.1 2.48 6.1 6.01zm-2.67 0c0-2.18-1.57-3.69-3.43-3.69s-3.43 1.51-3.43 3.69c0 2.16 1.57 3.69 3.43 3.69s3.43-1.53 3.43-3.69z"
      fill="#EA4335"
    />
    <path
      d="M37.38 12.39c0 3.51-2.73 6.01-6.1 6.01s-6.1-2.5-6.1-6.01c0-3.53 2.73-6.01 6.1-6.01s6.1 2.48 6.1 6.01zm-2.67 0c0-2.18-1.57-3.69-3.43-3.69s-3.43 1.51-3.43 3.69c0 2.16 1.57 3.69 3.43 3.69s3.43-1.53 3.43-3.69z"
      fill="#FBBC05"
    />
    <path
      d="M50.15 6.67v11.19c0 4.6-2.71 6.48-5.91 6.48-3.01 0-4.82-2.02-5.51-3.68l2.33-.97c.41 1 1.42 2.17 3.18 2.17 2.07 0 3.35-1.28 3.35-3.69v-.91h-.09c-.62.77-1.81 1.45-3.32 1.45-3.15 0-6.03-2.75-6.03-6.15 0-3.42 2.88-6.13 6.03-6.13 1.51 0 2.7 1.05 3.32 1.83h.09V6.67h2.56zm-2.45 5.74c0-2.15-1.42-3.71-3.26-3.71-1.87 0-3.37 1.56-3.37 3.71 0 2.12 1.5 3.69 3.37 3.69 1.84 0 3.26-1.57 3.26-3.69z"
      fill="#4285F4"
    />
    <path d="M54.19.4h2.67v17.44h-2.67V.4z" fill="#34A853" />
    <path
      d="M65.7 14.43l2.12 1.41c-.69 1.02-2.36 2.82-5.18 2.82-4.38 0-6.22-3.4-6.22-5.99 0-3.64 2.5-6.01 5.91-6.01 3.55 0 5.29 2.44 5.72 3.82l.28.7-8.8 3.64c.67 1.33 1.72 2.01 3.22 2.01s2.4-1.02 2.95-2.4zm-6.49-2.25l5.88-2.43c-.32-.82-1.29-1.39-2.38-1.39-1.48 0-3.55 1.31-3.5 3.82z"
      fill="#EA4335"
    />
  </svg>
);

export const GoogleAdChoicesBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <a
    href="https://adssettings.google.com/whythisad"
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-zinc-400 hover:text-white transition-colors cursor-pointer group ${className}`}
    title="Why this ad? Powered by Google AdMob & AdChoices"
  >
    <svg viewBox="0 0 16 16" width="12" height="12" className="text-sky-400 group-hover:scale-110 transition-transform">
      <path
        d="M0 0h16v16H0z"
        fill="transparent"
      />
      <path
        d="M1 14.5L8.5 1.5 16 14.5H1z"
        fill="#00a4e4"
      />
      <circle cx="8.5" cy="11.5" r="1" fill="#ffffff" />
      <path d="M8 6h1v4H8V6z" fill="#ffffff" />
    </svg>
    <span className="text-[9px] font-medium tracking-tight text-zinc-400 group-hover:text-zinc-200">AdChoices</span>
  </a>
);

export const GooglePlayLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      d="M3.609 1.814L13.792 12 3.61 22.186c-.37-.37-.61-.926-.61-1.586V3.4c0-.66.24-1.216.61-1.586z"
      fill="#00E676"
    />
    <path
      d="M17.18 8.613l-3.388 3.387 3.388 3.387 3.83-2.183c.79-.45.79-1.954 0-2.408l-3.83-2.183z"
      fill="#FFD600"
    />
    <path
      d="M3.609 1.814l10.183 10.186 3.388-3.387L6.643.513c-.933-.53-2.174-.01-3.034 1.301z"
      fill="#00B0FF"
    />
    <path
      d="M3.609 22.186l3.034 1.301c.933.53 2.174.01 3.034-1.301l7.503-7.8-3.388-3.386L3.609 22.186z"
      fill="#FF3D00"
    />
  </svg>
);

export const GoogleAppIcon: React.FC<{ type: string; className?: string }> = ({ type, className = 'w-12 h-12' }) => {
  switch (type) {
    case 'chrome':
      return (
        <div className={`${className} rounded-2xl bg-white p-2 shadow-md flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800`}>
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <path fill="#4caf50" d="M24,4C14.52,4,6.6,10.54,4.48,19.42L14.77,25.36C15.39,19.89,20.02,15.65,25.66,15.65H43.52C39.69,8.71,32.41,4,24,4z" />
            <path fill="#fbc02d" d="M43.52,15.65C44.47,18.23,45,21.05,45,24c0,9.94-7.06,18.23-16.48,19.82l-5.69-9.86C27.93,33.96,32.35,30.08,32.35,24.65c0-1.74-0.45-3.36-1.22-4.78L43.52,15.65z" />
            <path fill="#e53935" d="M22.83,33.96L12.54,43.82C15.93,45.22,19.85,46,24,46c4.15,0,8.07-0.78,11.46-2.18L29.77,33.96H22.83z" />
            <path fill="#039be5" d="M4.48,19.42C3.53,22,3,24.82,3,27.77c0,8.68,5.4,16.08,13.06,19.05l7.22-12.86C17.72,33.96,13.74,29.98,13.74,24.65c0-1.84,0.5-3.56,1.38-5.04L4.48,19.42z" />
            <circle cx="24" cy="24" r="8.5" fill="#ffffff" />
            <circle cx="24" cy="24" r="6.8" fill="#1976d2" />
          </svg>
        </div>
      );
    case 'drive':
      return (
        <div className={`${className} rounded-2xl bg-white p-2 shadow-md flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800`}>
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <path fill="#FFC107" d="M17 6L31 6 45 30 31 30z" />
            <path fill="#0066DA" d="M3 30L10 42 38 42 31 30z" />
            <path fill="#00AC47" d="M3 30L17 6 24 18 10 42z" />
          </svg>
        </div>
      );
    case 'maps':
      return (
        <div className={`${className} rounded-2xl bg-white p-2 shadow-md flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800`}>
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <path fill="#4CAF50" d="M24 4C14.06 4 6 12.06 6 22c0 13.56 18 22 18 22s18-8.44 18-22c0-9.94-8.06-18-18-18z" />
            <path fill="#FFF" d="M24 14c-4.42 0-8 3.58-8 8 0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.42-3.58-8-8-8z" />
            <circle cx="24" cy="22" r="4.5" fill="#1E88E5" />
          </svg>
        </div>
      );
    case 'gemini':
    default:
      return (
        <div className={`${className} rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-2 shadow-md flex items-center justify-center shrink-0 text-white`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
        </div>
      );
  }
};
