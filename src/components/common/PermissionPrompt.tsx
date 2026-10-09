import React, { useState } from 'react';
import {
  Camera, Mic, MapPin, Bell, ShieldCheck,
  Check, X, Lock, Settings, Smartphone, Monitor, ChevronDown, ChevronUp
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export type PermissionType = 'camera' | 'microphone' | 'geolocation' | 'notifications';

interface PermissionPromptProps {
  type: PermissionType;
  title?: string;
  reason?: string;
  onGranted: () => void;
  onDenied?: () => void;
  onCancel?: () => void;
  inline?: boolean;
  initialDenied?: boolean;
}

const PERMISSION_CONFIG: Record<
  PermissionType,
  {
    icon: React.ElementType;
    displayName: string;
    defaultTitle: string;
    defaultReason: string;
    color: string;
    bgColor: string;
    privacyNote: string;
  }
> = {
  camera: {
    icon: Camera,
    displayName: 'Camera',
    defaultTitle: 'Camera Permission Needed',
    defaultReason:
      'OmniToolbox uses your camera for live QR code scanning, barcode detection, and document capture. Video frames are processed 100% locally on your device and are never sent to any server.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900',
    privacyNote: 'Zero cloud upload. Processed entirely in device memory.',
  },
  microphone: {
    icon: Mic,
    displayName: 'Microphone & Recording',
    defaultTitle: 'Microphone Access Needed',
    defaultReason:
      'OmniToolbox uses your microphone for real-time instrument pitch tuning and live decibel sound measurement. Audio stays strictly local on your hardware.',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50/80 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900',
    privacyNote: 'No audio recordings ever leave your phone or computer.',
  },
  geolocation: {
    icon: MapPin,
    displayName: 'Location',
    defaultTitle: 'Location Access Needed',
    defaultReason:
      'OmniToolbox uses your location to calculate real-time speedometer readings, digital compass orientation, and hyper-local weather radar updates.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
    privacyNote: 'Location is only accessed while the tool is actively open.',
  },
  notifications: {
    icon: Bell,
    displayName: 'Notifications & Alerts',
    defaultTitle: 'Notification Permission Needed',
    defaultReason:
      'OmniToolbox sends timely alerts for medicine reminder schedules, pill doses, and countdown deadlines so you never miss an important milestone.',
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50/80 dark:bg-violet-950/60 border-violet-200 dark:border-violet-900',
    privacyNote: 'Private local alerts. You can customize or silence anytime.',
  },
};

export const PermissionPrompt: React.FC<PermissionPromptProps> = ({
  type,
  title,
  reason,
  onGranted,
  onDenied,
  onCancel,
  inline = false,
  initialDenied = false,
}) => {
  const [requesting, setRequesting] = useState(false);
  const [denied, setDenied] = useState(initialDenied);
  const [showSettingsGuide, setShowSettingsGuide] = useState(initialDenied);

  const config = PERMISSION_CONFIG[type];
  const Icon = config.icon;

  const handleRequest = async () => {
    sounds.playClick();
    setRequesting(true);

    try {
      if (type === 'camera') {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        stream.getTracks().forEach(t => t.stop());
        sounds.playSuccess();
        setDenied(false);
        onGranted();
      } else if (type === 'microphone') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        sounds.playSuccess();
        setDenied(false);
        onGranted();
      } else if (type === 'geolocation') {
        await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        });
        sounds.playSuccess();
        setDenied(false);
        onGranted();
      } else if (type === 'notifications') {
        if ('Notification' in window) {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            sounds.playSuccess();
            setDenied(false);
            onGranted();
          } else {
            setDenied(true);
            setShowSettingsGuide(true);
            onDenied?.();
          }
        } else {
          onGranted();
        }
      }
    } catch {
      setDenied(true);
      setShowSettingsGuide(true);
      onDenied?.();
    } finally {
      setRequesting(false);
    }
  };

  const content = (
    <div className={`p-6 rounded-3xl border ${config.bgColor} space-y-4 text-left transition-all shadow-xs`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs shrink-0">
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              <Lock className="w-3 h-3" />
              <span>Permission Settings</span>
            </div>
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              {title || config.defaultTitle}
            </h3>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={() => {
              sounds.playClick();
              onCancel();
            }}
            aria-label="Close"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
        {reason || config.defaultReason}
      </p>

      {/* Privacy Guarantee Note */}
      <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-white/70 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/60">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>{config.privacyNote}</span>
      </div>

      {/* Settings Guide Callout */}
      <div className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800 p-3.5 space-y-2">
        <button
          type="button"
          onClick={() => setShowSettingsGuide(prev => !prev)}
          className="w-full flex items-center justify-between text-left text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-zinc-500" />
            <span>How to allow in device settings</span>
          </div>
          {showSettingsGuide ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          )}
        </button>

        {showSettingsGuide && (
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2.5 text-[11px] text-zinc-600 dark:text-zinc-400">
            <div className="flex items-start gap-2">
              <Smartphone className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">On Mobile (Android / iOS): </span>
                Open <strong className="text-zinc-800 dark:text-zinc-200">Settings</strong> &rarr; <strong className="text-zinc-800 dark:text-zinc-200">Apps</strong> &rarr; <strong className="text-zinc-800 dark:text-zinc-200">OmniToolbox</strong> &rarr; <strong className="text-zinc-800 dark:text-zinc-200">Permissions</strong> (or tap the 🔒 / ⚙️ icon in the address bar), and enable <strong className="text-emerald-600 dark:text-emerald-400">{config.displayName}</strong>.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Monitor className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">On Computer: </span>
                Click the lock/settings icon 🔒 next to the site address, switch <strong className="text-zinc-800 dark:text-zinc-200">{config.displayName}</strong> to <strong className="text-emerald-600 dark:text-emerald-400">Allow</strong>, then tap <strong className="text-zinc-800 dark:text-zinc-200">Try Again</strong>.
              </div>
            </div>

            {type === 'notifications' && (
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                💡 Tip: Make sure notifications are allowed in your device System Settings.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <button
            onClick={() => {
              sounds.playClick();
              onCancel();
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-white/80 dark:hover:bg-zinc-800/80 cursor-pointer"
          >
            Not Now
          </button>
        )}
        <button
          onClick={handleRequest}
          disabled={requesting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {requesting ? (
            <span>Requesting access...</span>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{denied ? 'Allow in Settings & Retry' : 'Allow Access'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
        {content}
      </div>
    </div>
  );
};
