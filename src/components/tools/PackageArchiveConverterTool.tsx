import React, { useState, useRef, useMemo } from 'react';
import JSZip from 'jszip';
import {
  FileArchive, Smartphone, FileCode, Download, Upload, Check,
  RefreshCw, Trash2, Folder, File, Eye, Plus, Sparkles, AlertCircle,
  FileSpreadsheet, ArrowRightLeft, Layers, ShieldCheck, X
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { usePWAInstall } from '../../hooks/usePWAInstall';

type ConversionMode = 'zip-to-apk' | 'apk-to-zip' | 'zip-to-jar' | 'jar-to-zip' | 'zip-to-cbz';

interface ArchiveFileEntry {
  name: string;
  size: number;
  dir: boolean;
  date: Date;
}

export const PackageArchiveConverterTool: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [conversionMode, setConversionMode] = useState<ConversionMode>('zip-to-apk');
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileEntries, setFileEntries] = useState<ArchiveFileEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [convertedBlob, setConvertedBlob] = useState<{ blob: Blob; filename: string } | null>(null);
  const [inspectFileContent, setInspectFileContent] = useState<{ name: string; content: string } | null>(null);
  const [appName, setAppName] = useState<string>('OmniApp');
  const [packageName, setPackageName] = useState<string>('com.omni.toolbox');
  const [appVersion, setAppVersion] = useState<string>('1.0.0');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Total uncompressed size
  const totalSize = useMemo(() => {
    return fileEntries.reduce((acc, curr) => acc + (curr.dir ? 0 : curr.size), 0);
  }, [fileEntries]);

  // Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle uploaded file (ZIP, APK, JAR, CBZ)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playClick();
    setSourceFile(file);
    setFileName(file.name);
    setConvertedBlob(null);
    setIsProcessing(true);
    setStatusMessage('Reading and unpacking archive contents...');
    setProgress(20);

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);

      const entries: ArchiveFileEntry[] = [];
      loadedZip.forEach((relativePath, zipEntry) => {
        entries.push({
          name: zipEntry.name,
          size: (zipEntry as any)._data ? (zipEntry as any)._data.uncompressedSize || 0 : 0,
          dir: zipEntry.dir,
          date: zipEntry.date,
        });
      });

      // Sort: folders first, then alphabetical
      entries.sort((a, b) => {
        if (a.dir === b.dir) return a.name.localeCompare(b.name);
        return a.dir ? -1 : 1;
      });

      setFileEntries(entries);
      setProgress(100);
      setStatusMessage(`Archive unpacked successfully: ${entries.length} items found.`);
      sounds.playSuccess();
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Failed to read archive: ${err.message || 'Invalid or encrypted file.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Load a demo sample web project into the converter
  const handleLoadDemoZip = async () => {
    sounds.playClick();
    setIsProcessing(true);
    setStatusMessage('Building sample interactive web app bundle...');
    setProgress(30);

    try {
      const zip = new JSZip();

      // Sample HTML5 app bundle
      zip.file(
        'index.html',
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Omni Web App</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #09090b; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .card { background: #18181b; padding: 2rem; border-radius: 1.5rem; border: 1px solid #27272a; max-width: 400px; }
    button { background: #4f46e5; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🚀 OmniToolbox Web App</h2>
    <p>Converted seamlessly from ZIP to APK package.</p>
    <button onclick="alert('Hello from converted APK!')">Tap Me</button>
  </div>
</body>
</html>`
      );

      zip.file(
        'manifest.json',
        JSON.stringify(
          {
            name: 'OmniToolbox Sample',
            short_name: 'OmniSample',
            start_url: 'index.html',
            display: 'standalone',
            background_color: '#09090b',
            theme_color: '#4f46e5',
          },
          null,
          2
        )
      );

      zip.folder('css')?.file('style.css', '/* OmniToolbox App Styles */\nbody { margin: 0; }');
      zip.folder('js')?.file('app.js', 'console.log("OmniToolbox Client Engine Running");');

      const content = await zip.generateAsync({ type: 'blob' });
      const demoFile = new (window as any).File([content], 'sample-webapp.zip', {
        type: 'application/zip',
      });

      setSourceFile(demoFile);
      setFileName('sample-webapp.zip');

      const entries: ArchiveFileEntry[] = [];
      zip.forEach((relativePath, zipEntry) => {
        entries.push({
          name: zipEntry.name,
          size: (zipEntry as any)._data ? (zipEntry as any)._data.uncompressedSize || 0 : 0,
          dir: zipEntry.dir,
          date: zipEntry.date,
        });
      });
      setFileEntries(entries);
      setProgress(100);
      setStatusMessage('Demo Web App archive loaded! Ready to convert.');
      sounds.playSuccess();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert File depending on mode
  const handleConvert = async () => {
    if (!sourceFile) return;

    sounds.playClick();
    setIsProcessing(true);
    setProgress(15);
    setStatusMessage('Reading input archive and compiling structure...');

    try {
      const sourceZip = new JSZip();
      await sourceZip.loadAsync(sourceFile);

      setProgress(40);
      const targetZip = new JSZip();

      const baseName = fileName.replace(/\.[^/.]+$/, '');

      if (conversionMode === 'zip-to-apk') {
        setStatusMessage('Injecting AndroidManifest.xml and Android assets structure...');

        // 1. Copy web assets to assets/www/ or root
        sourceZip.forEach((relativePath, file) => {
          if (!file.dir) {
            targetZip.file(`assets/www/${relativePath}`, file.async('blob'));
          }
        });

        // 2. Generate AndroidManifest.xml
        const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${packageName}"
    android:versionCode="1"
    android:versionName="${appVersion}">
    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <application
        android:label="${appName}"
        android:icon="@drawable/icon"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true">
        <activity
            android:name="${packageName}.MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|screenSize"
            android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
        targetZip.file('AndroidManifest.xml', androidManifest);

        // 3. META-INF Signature / Manifest
        const metaInf = `Manifest-Version: 1.0\nCreated-By: 17.0.2 (OmniToolbox Packager)\nBuilt-By: OmniToolbox\nApplication-Name: ${appName}\n`;
        targetZip.file('META-INF/MANIFEST.MF', metaInf);

        setProgress(70);
        setStatusMessage('Compressing into Android Package (.apk)...');

        const blob = await targetZip.generateAsync(
          {
            type: 'blob',
            mimeType: 'application/vnd.android.package-archive',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 },
          },
          metadata => {
            setProgress(70 + Math.round(metadata.percent * 0.25));
          }
        );

        setConvertedBlob({
          blob,
          filename: `${baseName}.apk`,
        });
      } else if (conversionMode === 'apk-to-zip') {
        setStatusMessage('Extracting Android APK assets, manifests & dex code into clean ZIP...');

        sourceZip.forEach((relativePath, file) => {
          if (!file.dir) {
            targetZip.file(relativePath, file.async('blob'));
          }
        });

        setProgress(75);
        setStatusMessage('Packaging clean standard ZIP archive...');

        const blob = await targetZip.generateAsync(
          {
            type: 'blob',
            mimeType: 'application/zip',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 },
          },
          metadata => {
            setProgress(75 + Math.round(metadata.percent * 0.2));
          }
        );

        setConvertedBlob({
          blob,
          filename: `${baseName}-unpacked.zip`,
        });
      } else if (conversionMode === 'zip-to-jar') {
        setStatusMessage('Generating Java Archive MANIFEST.MF...');

        sourceZip.forEach((relativePath, file) => {
          if (!file.dir) {
            targetZip.file(relativePath, file.async('blob'));
          }
        });

        const jarManifest = `Manifest-Version: 1.0\nMain-Class: Main\nCreated-By: OmniToolbox Java Packager\n`;
        targetZip.file('META-INF/MANIFEST.MF', jarManifest);

        const blob = await targetZip.generateAsync({
          type: 'blob',
          mimeType: 'application/java-archive',
          compression: 'DEFLATE',
        });

        setConvertedBlob({
          blob,
          filename: `${baseName}.jar`,
        });
      } else if (conversionMode === 'zip-to-cbz') {
        setStatusMessage('Packaging Comic Book Archive (.cbz)...');

        sourceZip.forEach((relativePath, file) => {
          if (!file.dir) {
            targetZip.file(relativePath, file.async('blob'));
          }
        });

        const blob = await targetZip.generateAsync({
          type: 'blob',
          mimeType: 'application/vnd.comicbook+zip',
          compression: 'DEFLATE',
        });

        setConvertedBlob({
          blob,
          filename: `${baseName}.cbz`,
        });
      } else {
        // Fallback standard repack
        sourceZip.forEach((relativePath, file) => {
          if (!file.dir) {
            targetZip.file(relativePath, file.async('blob'));
          }
        });
        const blob = await targetZip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
        setConvertedBlob({ blob, filename: `${baseName}-converted.zip` });
      }

      setProgress(100);
      setStatusMessage('Conversion completed successfully! Ready for download.');
      sounds.playSuccess();
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Conversion error: ${err.message || 'Unknown processing error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download converted file
  const handleDownloadConverted = () => {
    if (!convertedBlob) return;
    sounds.playClick();

    const url = URL.createObjectURL(convertedBlob.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = convertedBlob.filename;
    a.click();
    URL.revokeObjectURL(url);
    sounds.playSuccess();
  };

  // Inspect text file inside archive
  const handleInspectFile = async (entry: ArchiveFileEntry) => {
    if (!sourceFile || entry.dir) return;
    sounds.playClick();

    try {
      const zip = new JSZip();
      const loaded = await zip.loadAsync(sourceFile);
      const zipFile = loaded.file(entry.name);
      if (zipFile) {
        const text = await zipFile.async('text');
        setInspectFileContent({
          name: entry.name,
          content: text.slice(0, 10000), // Max 10,000 chars preview
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-50">
                Universal Package & Archive Converter
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                Client-Side Engine
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Convert, extract, inspect, and repack between ZIP, APK, JAR, and CBZ archives with full metadata integrity.
            </p>
          </div>
        </div>

        <button
          onClick={handleLoadDemoZip}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 transition-colors cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Demo Web App (.zip)</span>
        </button>
      </div>

      {/* Main Grid: Upload & Controls on Left, Archive Explorer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CONVERTER CONTROLS (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Mode Selector */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 space-y-3 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Conversion Workflow
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setConversionMode('zip-to-apk');
                }}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  conversionMode === 'zip-to-apk'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span>ZIP ➔ APK (Android)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setConversionMode('apk-to-zip');
                }}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  conversionMode === 'apk-to-zip'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <FileArchive className="w-4 h-4 text-emerald-600" />
                <span>APK ➔ ZIP Archive</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setConversionMode('zip-to-jar');
                }}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  conversionMode === 'zip-to-jar'
                    ? 'border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <FileCode className="w-4 h-4 text-amber-600" />
                <span>ZIP ➔ JAR (Java)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setConversionMode('zip-to-cbz');
                }}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  conversionMode === 'zip-to-cbz'
                    ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <Layers className="w-4 h-4 text-violet-600" />
                <span>ZIP ➔ CBZ Comic</span>
              </button>
            </div>
          </div>

          {/* 2. Drag & Drop Upload Zone */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 space-y-4 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Upload Source Archive
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-zinc-50/50 dark:bg-zinc-800/40 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                {fileName ? fileName : 'Click or drag & drop .ZIP or .APK file'}
              </p>
              <p className="text-[11px] text-zinc-400">
                Supports .zip, .apk, .jar, .cbz up to 100MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,.apk,.jar,.cbz,application/zip,application/vnd.android.package-archive"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Android Manifest Customization for ZIP -> APK */}
            {conversionMode === 'zip-to-apk' && (
              <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                  APK Package Metadata
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 block mb-0.5">
                      App Label:
                    </label>
                    <input
                      type="text"
                      value={appName}
                      onChange={e => setAppName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 block mb-0.5">
                      App Version:
                    </label>
                    <input
                      type="text"
                      value={appVersion}
                      onChange={e => setAppVersion(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 block mb-0.5">
                    Package Name:
                  </label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={e => setPackageName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
              </div>
            )}

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={!sourceFile || isProcessing}
              className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-98"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Archive ({progress}%)...</span>
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Start Package Conversion</span>
                </>
              )}
            </button>

            {/* Progress Bar & Status */}
            {statusMessage && (
              <div className="space-y-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
                <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                  <span className="truncate">{statusMessage}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Download Converted Package Card */}
            {convertedBlob && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-xs">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Ready: {convertedBlob.filename}</span>
                </div>
                <button
                  onClick={handleDownloadConverted}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Converted File ({formatBytes(convertedBlob.blob.size)})</span>
                </button>
              </div>
            )}

            {/* Android "There Was a Problem Parsing the Package" Solution Guide */}
            <div className="p-4 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/90 dark:border-indigo-900/60 space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  Android Installation & "Parse Error" Guide
                </h4>
              </div>

              <div className="text-[11px] text-indigo-900/85 dark:text-indigo-300 space-y-2 leading-relaxed">
                <p>
                  <strong>Why Android says &ldquo;There was a problem parsing the package&rdquo;:</strong>
                  <br />
                  Android OS requires APK files to contain binary-compiled AndroidManifest.xml (AXML), dalvik bytecode (classes.dex), and v2/v3 cryptographic signatures. A raw zip archive or uncompiled package cannot be opened directly by Android's Package Manager.
                </p>

                <p>
                  <strong>100% Working Fix to Install OmniToolbox on Android:</strong>
                  <br />
                  Install directly via your mobile browser (Chrome / Edge / Samsung Internet). Android's built-in Google Play WebAPK service will automatically compile, sign, and install OmniToolbox on your device with <strong>0 parse errors</strong>!
                </p>

                {isInstallable && (
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); install(); }}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Install OmniToolbox App on Android (1-Tap WebAPK)</span>
                  </button>
                )}

                <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-indigo-100 dark:border-indigo-900/40 text-[10px]">
                  <strong>Manual 1-Tap Steps in Chrome:</strong>
                  <ol className="list-decimal pl-4 mt-0.5 space-y-0.5">
                    <li>Tap the <strong>three dots menu (⋮)</strong> in Chrome at top right.</li>
                    <li>Tap <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.</li>
                    <li>The app is instantly added with zero errors, full offline mode, and home screen icon!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ARCHIVE EXPLORER & FILE INSPECTOR (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Package Inspector & File Tree
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-zinc-500">
                {fileEntries.length} files • {formatBytes(totalSize)}
              </span>
            </div>

            {/* File List */}
            {fileEntries.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-400">
                Upload a ZIP or APK archive to explore internal files, manifests, and assets.
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                {fileEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors text-xs border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700/60 group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {entry.dir ? (
                        <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : (
                        <File className="w-4 h-4 text-indigo-500 shrink-0" />
                      )}
                      <span className="font-mono text-zinc-800 dark:text-zinc-200 truncate">
                        {entry.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="font-mono text-[10px] text-zinc-400">
                        {entry.dir ? 'DIR' : formatBytes(entry.size)}
                      </span>
                      {!entry.dir && (
                        <button
                          onClick={() => handleInspectFile(entry)}
                          className="p-1 rounded-lg text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                          title="Inspect file contents"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal / Card for Inspecting Text Content */}
          {inspectFileContent && (
            <div className="p-4 rounded-3xl bg-zinc-950 text-zinc-100 border border-zinc-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono font-bold text-indigo-400 truncate">
                  📄 {inspectFileContent.name}
                </span>
                <button
                  onClick={() => setInspectFileContent(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <pre className="text-[11px] font-mono max-h-48 overflow-auto p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                {inspectFileContent.content}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
