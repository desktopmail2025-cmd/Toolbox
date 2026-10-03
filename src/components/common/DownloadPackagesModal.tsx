import React from 'react';
import { Download, X, Globe, Smartphone, PackageCheck, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface DownloadPackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadPackagesModal: React.FC<DownloadPackagesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const packages = [
    {
      id: 'website',
      title: 'Full Website Bundle (.zip)',
      filename: 'omnitoolbox-website.zip',
      href: '/downloads/omnitoolbox-website.zip',
      size: '1.95 MB',
      icon: Globe,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
      description: 'Complete production web application ready to unzip and host on any static server, GitHub Pages, Netlify, Vercel, or Apache/Nginx.',
      features: ['Offline Service Worker included', 'Full assets & icons bundle', 'Web App Manifest configured'],
    },
    {
      id: 'apk',
      title: 'Android Package (.apk)',
      filename: 'omnitoolbox-release.apk',
      href: '/downloads/omnitoolbox-release.apk',
      size: '1.95 MB',
      icon: Smartphone,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      description: 'Direct Android installation package. Sideload directly to any Android smartphone or tablet without needing Google Play.',
      features: ['Full offline app capability', 'Camera & hardware access ready', 'Native launcher icons embedded'],
    },
    {
      id: 'aab',
      title: 'Android App Bundle (.aab)',
      filename: 'omnitoolbox-release.aab',
      href: '/downloads/omnitoolbox-release.aab',
      size: '1.95 MB',
      icon: PackageCheck,
      color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400',
      description: 'Official Google Play publishing format. Required format for publishing directly to the Google Play Store Console.',
      features: ['Google Play Console format', 'Dynamic feature delivery support', 'Optimized APK generation per device'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-0.5">
              <span>OmniToolbox Exports</span>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">Separate Production Files</span>
            </div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Download App Packages
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Package Download Cards */}
        <div className="space-y-4">
          {packages.map(pkg => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.id}
                className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 hover:bg-white dark:hover:bg-zinc-900 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${pkg.color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                        {pkg.title}
                      </h3>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {pkg.filename} ({pkg.size})
                      </span>
                    </div>
                  </div>

                  <a
                    href={pkg.href}
                    download={pkg.filename}
                    onClick={() => sounds.playClick()}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {pkg.id.toUpperCase()}</span>
                  </a>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500 font-medium pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60">
                  {pkg.features.map((feat, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/50 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
          <p className="font-bold text-zinc-700 dark:text-zinc-300">File Storage Locations:</p>
          <p className="font-mono text-[10px]">
            Root: /omnitoolbox-website.zip • /omnitoolbox-release.apk • /omnitoolbox-release.aab
          </p>
        </div>
      </div>
    </div>
  );
};
