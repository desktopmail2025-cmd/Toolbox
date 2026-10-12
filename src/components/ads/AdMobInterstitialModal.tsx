import React from 'react';

interface AdMobInterstitialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// In production, real interstitial ads are rendered exclusively by Google Play Services Mobile Ads SDK natively on Android/iOS,
// and by Google AdSense Auto Ads vignettes on Web. No dummy or placeholder dialogs are displayed.
export const AdMobInterstitialModal: React.FC<AdMobInterstitialModalProps> = () => {
  return null;
};

