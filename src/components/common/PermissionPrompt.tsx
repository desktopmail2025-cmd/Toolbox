import React, { useState } from 'react';
import {
  Camera, Mic, MapPin, Bell, Shield, ShieldCheck,
  AlertTriangle, Check, X, ArrowRight, Lock, ExternalLink
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
}

const PERMISSION_CONFIG: Record<
  PermissionType,
  {
    icon: React.ElementType;
    defaultTitle: string;
    defaultReason: string;
    color: string;
    bgColor: string;
    privacyNote: string;
  }
> = {
  camera: {
    icon: Camera,
    defaultTitle: 'Camera Access Needed',
    defaultReason:
      'OmniToolbox uses your camera for live QR and barcode scanning, document capture, and color picking. Video frames are processed 100% locally on your device and never uploaded.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900',
    privacyNote: 'Zero cloud upload. Processed entirely in browser memory.',
  },
  microphone: {
    icon: Mic,
    defaultTitle: 'Microphone Access Needed',
    defaultReason:
      'OmniToolbox uses your microphone for voice memos, sound level decibel measurement, and musical instrument tuning. Audio remains strictly local on your hardware.',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900',
    privacyNote: 'No audio recordings leave your device.',
  },
  geolocation: {
    icon: MapPin,
    defaultTitle: 'Location (GPS) Access Needed',
    defaultReason:
      'OmniToolbox uses your location to calculate real-time speedometer readings, digital compass orientation, and hyper-local weather radar updates.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
    privacyNote: 'Location is only used when the tool is open and active.',
  },
  notifications: {
    icon: Bell,
    defaultTitle: 'Notification Permission Needed',
    defaultReason:
      'OmniToolbox sends timely alerts for medicine reminder schedules, countdown deadlines, and live sports kickoff updates so you never miss a moment.',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
    privacyNote: 'You can customize or silence alerts anytime in settings.',
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
}) => {
  const [requesting, setRequesting] = useState(false);
  const [denied, setDenied] = useState(false);

  const config = PERMISSION_CONFIG[type];
  const Icon = config.icon;

  const handleRequest = async () => {
    sounds.playClick();
    setRequesting(true);
    setDenied(false);

    try {
      if (type === 'camera') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        // Stop stream immediately after test so caller can manage their own stream
        stream.getTracks().forEach(t => t.stop());
        sounds.playSuccess();
        onGranted();
      } else if (type === 'microphone') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        sounds.playSuccess();
        onGranted();
      } else if (type === 'geolocation') {
        await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        });
        sounds.playSuccess();
        onGranted();
      } else if (type === 'notifications') {
        if ('Notification' in window) {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            sounds.playSuccess();
            onGranted();
          } else {
            setDenied(true);
            onDenied?.();
          }
        } else {
          onGranted();
        }
      }
    } catch (err) {
      console.warn(`Permission request for ${type} was dismissed or denied:`, err);
      setDenied(true);
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
              <span>Device Permission</span>
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
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
        {reason || config.defaultReason}
      </p>

      {/* Privacy guarantee badge */}
      <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-white/70 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/60">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>{config.privacyNote}</span>
      </div>

      {denied && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs font-medium space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Permission Was Blocked or Dismissed</span>
          </div>
          <p className="text-[11px]">
            Please tap the lock icon in your browser address bar or check device settings to allow {type} access, then tap Try Again.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <button
            onClick={() => {
              sounds.playClick();
              onCancel();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-white/80 dark:hover:bg-zinc-800/80 cursor-pointer"
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
              <span>{denied ? 'Try Again' : 'Grant Permission'}</span>
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
