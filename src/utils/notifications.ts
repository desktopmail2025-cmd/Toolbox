// Browser Notification & Alert Utility
import { sounds } from './audio';

export interface AppNotificationOptions {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  try {
    if (Notification.permission === 'granted') {
      return true;
    }
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch {
    return false;
  }
};

export const getNotificationPermissionStatus = (): NotificationPermission | 'unsupported' => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

export const triggerAppNotification = async (options: AppNotificationOptions): Promise<boolean> => {
  // Play alert chime
  sounds.playTone(587.33, 0.15); // D5
  setTimeout(() => sounds.playTone(880, 0.25), 120); // A5

  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(options.title, {
          body: options.body,
          tag: options.tag || 'omni-alert',
          badge: '/favicon.ico',
        });
        return true;
      } catch {
        // Fallback handled below
      }
    } else if (Notification.permission !== 'denied') {
      const granted = await requestNotificationPermission();
      if (granted) {
        try {
          new Notification(options.title, {
            body: options.body,
            tag: options.tag || 'omni-alert',
          });
          return true;
        } catch {}
      }
    }
  }

  return false;
};
