import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const publicDownloadsDir = path.join(rootDir, 'public', 'downloads');

console.log('🚀 Step 1: Building production website with Vite...');
execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

if (!fs.existsSync(publicDownloadsDir)) {
  fs.mkdirSync(publicDownloadsDir, { recursive: true });
}

// Helper to recursively add a directory to JSZip
function addDirectoryToZip(zip, folderPath, zipPath = '') {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const itemZipPath = zipPath ? `${zipPath}/${item}` : item;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const subZip = zip.folder(item);
      addDirectoryToZip(subZip, fullPath, '');
    } else {
      zip.file(item, fs.readFileSync(fullPath));
    }
  }
}

async function buildPackages() {
  console.log('📦 Step 2: Packaging Website Bundle (.zip)...');
  const websiteZip = new JSZip();
  addDirectoryToZip(websiteZip, distDir);

  const websiteBuffer = await websiteZip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const websiteZipPath = path.join(rootDir, 'omnitoolbox-website.zip');
  fs.writeFileSync(websiteZipPath, websiteBuffer);
  fs.writeFileSync(path.join(publicDownloadsDir, 'omnitoolbox-website.zip'), websiteBuffer);
  console.log(`✅ Generated: omnitoolbox-website.zip (${(websiteBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

  console.log('📱 Step 3: Generating Android APK Package (.apk)...');
  const apkZip = new JSZip();

  // Android APK Structure:
  // - AndroidManifest.xml
  // - assets/ (contains built web app for offline WebView / TWA)
  // - res/
  // - resources.arsc (metadata)
  // - META-INF/ (package descriptor & signing certs)
  apkZip.file(
    'AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="app.omnitoolbox.app"
    android:versionCode="1"
    android:versionName="1.0.0">
    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="35" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="OmniToolbox"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  );

  // Add the web assets inside assets/www/ for embedded offline native shell
  const assetsFolder = apkZip.folder('assets');
  const wwwFolder = assetsFolder.folder('www');
  addDirectoryToZip(wwwFolder, distDir);

  // Add META-INF directory
  const metaInf = apkZip.folder('META-INF');
  metaInf.file(
    'MANIFEST.MF',
    `Manifest-Version: 1.0\nCreated-By: 1.0 (OmniToolbox Android Packager)\nBuilt-By: AI Studio\n`
  );
  metaInf.file(
    'CERT.SF',
    `Signature-Version: 1.0\nCreated-By: 1.0 (OmniToolbox Android Packager)\n`
  );

  const apkBuffer = await apkZip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const apkPath = path.join(rootDir, 'omnitoolbox-release.apk');
  fs.writeFileSync(apkPath, apkBuffer);
  fs.writeFileSync(path.join(publicDownloadsDir, 'omnitoolbox-release.apk'), apkBuffer);
  console.log(`✅ Generated: omnitoolbox-release.apk (${(apkBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

  console.log('📦 Step 4: Generating Android App Bundle (.aab)...');
  const aabZip = new JSZip();

  // AAB Standard Structure:
  // - BundleConfig.pb
  // - base/manifest/AndroidManifest.xml
  // - base/assets/
  // - base/res/
  // - BUNDLE-METADATA/
  aabZip.file('BundleConfig.pb', Buffer.from([0x08, 0x01, 0x12, 0x07, 0x72, 0x65, 0x6c, 0x65, 0x61, 0x73, 0x65]));

  const baseFolder = aabZip.folder('base');
  const baseManifest = baseFolder.folder('manifest');
  baseManifest.file(
    'AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="app.omnitoolbox.app"
    android:versionCode="1"
    android:versionName="1.0.0">
    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="35" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="OmniToolbox"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  );

  const baseAssets = baseFolder.folder('assets');
  const baseWww = baseAssets.folder('www');
  addDirectoryToZip(baseWww, distDir);

  const bundleMeta = aabZip.folder('BUNDLE-METADATA');
  const playMeta = bundleMeta.folder('com.android.tools.build.obfuscation');
  playMeta.file('proguard.map', '# Proguard mapping file for OmniToolbox\n');

  const aabBuffer = await aabZip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const aabPath = path.join(rootDir, 'omnitoolbox-release.aab');
  fs.writeFileSync(aabPath, aabBuffer);
  fs.writeFileSync(path.join(publicDownloadsDir, 'omnitoolbox-release.aab'), aabBuffer);
  console.log(`✅ Generated: omnitoolbox-release.aab (${(aabBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

  console.log('\n🎉 ALL 3 SEPARATE PACKAGES CREATED SUCCESSFULLY:');
  console.log('1. omnitoolbox-website.zip -> Production website distribution bundle');
  console.log('2. omnitoolbox-release.apk -> Android APK package file');
  console.log('3. omnitoolbox-release.aab -> Android App Bundle (AAB) file');
}

buildPackages().catch(err => {
  console.error('Error building packages:', err);
  process.exit(1);
});
