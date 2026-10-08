import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.omnitoolbox.app',
  appName: 'OmniToolbox',
  webDir: 'dist',
  android: {
    backgroundColor: '#09090b',
  },
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-9097792601837119~1722736588',
    },
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: '#09090b',
    },
  },
};

export default config;
