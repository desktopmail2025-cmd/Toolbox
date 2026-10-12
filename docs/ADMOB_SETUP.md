# OmniToolbox AdMob setup

## Current integration

- Native plugin: `@capacitor-community/admob` 8.x, compatible with the repository's Capacitor 8.5.x dependencies.
- Consent: Google User Messaging Platform (UMP) consent info is requested before native ads; a required, available consent form is shown. Ads are not initialized/requested if `canRequestAds` is false.
- Development mode: `USE_TEST_ADS: true` in `src/services/admobService.ts` selects Google's official Android demo units.
- Android App ID: the app owner's App ID is configured in `capacitor.config.ts` and `android/app/src/main/res/values/strings.xml`.
- The Android GitHub Actions workflow builds and uploads `OmniToolbox-Android-debug`.

## Official Android demo ad units used for testing

- Banner: `ca-app-pub-3940256099942544/6300978111`
- Interstitial: `ca-app-pub-3940256099942544/1033173712`
- Rewarded: `ca-app-pub-3940256099942544/5224354917`

Keep test mode enabled while testing. Never click your own live ads.

## Before production

1. In `src/services/admobService.ts`, change `USE_TEST_ADS: true` to `false`. The existing `PRODUCTION_*` values then become active.
2. Verify each production ID in the AdMob console and confirm the app is registered with the same Android package ID: `com.omnitoolbox.app`.
3. In AdMob, publish/configure any consent messages that apply to your audience and provide a privacy policy in the app/store listing as required.
4. Push to `main`, wait for the **Build Android APK** workflow to finish, and install the new artifact on a test device.
5. Confirm test ads are no longer requested only when you intentionally switch to production IDs and are ready to release. Do not use live ads for routine testing.

## Production IDs currently configured

- App ID: `ca-app-pub-9097792601837119~1722736588`
- Banner unit: `ca-app-pub-9097792601837119/3759988398`
- Interstitial unit: `ca-app-pub-9097792601837119/6010747218`
- Rewarded unit: `ca-app-pub-9097792601837119/2867552435`

These identifiers are already in the repository. They are public AdMob identifiers, not passwords or API secrets. Confirm they belong to your app before switching test mode off.
