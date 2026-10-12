import React from 'react';

interface AdMobRewardedModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardDetails?: { type: string; amount: number };
}

// In production, real rewarded ads are rendered exclusively by Google Play Services Mobile Ads SDK natively on Android/iOS.
// No dummy or placeholder dialogs are displayed.
export const AdMobRewardedModal: React.FC<AdMobRewardedModalProps> = () => {
  return null;
};

