import React, { useState, useEffect } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Activity, Wifi, Radio } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const InternetTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'download-time-calc':
      return <DownloadTimeCalcView />;
    case 'data-usage-calc':
      return <DataUsageCalcView />;
    case 'network-info-ip':
      return <NetworkInfoView />;
    case 'latency-ping-tester':
      return <PingTesterView />;
    default:
      return <DownloadTimeCalcView />;
  }
};

// 1. Download & Upload Time Calculator
const DownloadTimeCalcView: React.FC = () => {
  const [fileSize, setFileSize] = useState(15); // GB
  const [sizeUnit, setSizeUnit] = useState<'MB' | 'GB' | 'TB'>('GB');
  const [speedMbps, setSpeedMbps] = useState(100); // 100 Mbps

  let totalMB = fileSize;
  if (sizeUnit === 'GB') totalMB = fileSize * 1024;
  if (sizeUnit === 'TB') totalMB = fileSize * 1024 * 1024;

  const totalBits = totalMB * 8 * 1024 * 1024;
  const speedBps = speedMbps * 1000 * 1000;
  const seconds = speedBps > 0 ? totalBits / speedBps : 0;

  const formatDuration = (sec: number) => {
    if (sec < 60) return `${Math.ceil(sec)} seconds`;
    const mins = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    if (mins < 60) return `${mins}m ${s}s`;
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hrs}h ${m}m ${s}s`;
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">File Size</label>
          <input
            type="number"
            value={fileSize}
            onChange={e => setFileSize(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Unit</label>
          <select
            value={sizeUnit}
            onChange={e => setSizeUnit(e.target.value as any)}
            className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-semibold"
          >
            <option value="MB">Megabytes (MB)</option>
            <option value="GB">Gigabytes (GB)</option>
            <option value="TB">Terabytes (TB)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Connection Speed (Mbps)</label>
          <input
            type="number"
            value={speedMbps}
            onChange={e => setSpeedMbps(parseFloat(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <ResultCard label="Estimated Transfer Time" value={formatDuration(seconds)} highlight />
    </div>
  );
};

// 2. Data Usage & Plan Estimator
const DataUsageCalcView: React.FC = () => {
  const [videoHours, setVideoHours] = useState(3); // HD streaming ~3 GB/hr
  const [musicHours, setMusicHours] = useState(2); // Music ~0.15 GB/hr
  const [browseHours, setBrowseHours] = useState(4); // Web ~0.1 GB/hr

  const dailyGB = videoHours * 2.5 + musicHours * 0.15 + browseHours * 0.1;
  const monthlyGB = dailyGB * 30;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Video Streaming (hrs/day)</label>
          <input
            type="number"
            value={videoHours}
            onChange={e => setVideoHours(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Music / Podcasts (hrs/day)</label>
          <input
            type="number"
            value={musicHours}
            onChange={e => setMusicHours(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Web & Social (hrs/day)</label>
          <input
            type="number"
            value={browseHours}
            onChange={e => setBrowseHours(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Recommended Monthly Plan" value={`${Math.ceil(monthlyGB)} GB`} subtext={`${monthlyGB.toFixed(1)} GB actual`} highlight />
        <ResultCard label="Daily Consumption" value={`${dailyGB.toFixed(2)} GB`} />
      </div>
    </div>
  );
};

// 3. Network & IP Diagnostics (Live IP & Geolocation API)
const NetworkInfoView: React.FC = () => {
  const [ipData, setIpData] = useState<{
    ip: string;
    city?: string;
    region?: string;
    country?: string;
    org?: string;
    timezone?: string;
  }>({
    ip: 'Detecting network address...',
  });
  const [loading, setLoading] = useState(false);

  const fetchNetworkDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://ipwho.is/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success !== false) {
          setIpData({
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country,
            org: data.connection?.isp || data.connection?.org,
            timezone: data.timezone?.id,
          });
          return;
        }
      }
      throw new Error('ipwho failed');
    } catch {
      try {
        const res2 = await fetch('https://api.ipify.org?format=json');
        const data2 = await res2.json();
        setIpData({
          ip: data2.ip,
          country: 'Connected Device',
        });
      } catch {
        setIpData({
          ip: 'Direct Network Route (Local)',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkDetails();
  }, []);

  const info: Record<string, string> = {
    'Public IP Address': ipData.ip,
    'Estimated Location': ipData.city && ipData.country ? `${ipData.city}, ${ipData.region ? `${ipData.region}, ` : ''}${ipData.country}` : 'Global Internet Route',
    'Internet Service Provider (ISP)': ipData.org || 'Local Network Carrier',
    'Time Zone': ipData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    'Online Network Interface': navigator.onLine ? 'Online (Connected)' : 'Offline (Disconnected)',
    'Screen Resolution': `${window.screen.width} × ${window.screen.height} (${window.devicePixelRatio}x DPR)`,
    'Viewport Dimensions': `${window.innerWidth} × ${window.innerHeight} px`,
    'Device Platform': navigator.platform || 'Modern Device',
    'Browser Language': navigator.language,
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-500" /> Active Connection Diagnostics
          </h4>
          <button
            onClick={fetchNetworkDetails}
            disabled={loading}
            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            {loading ? 'Refreshing...' : 'Refresh IP'}
          </button>
        </div>
        {Object.entries(info).map(([k, v]) => (
          <div key={k} className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-xs">
            <span className="text-zinc-500">{k}</span>
            <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 text-right truncate max-w-[220px]">
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Latency & Ping Tester
const PingTesterView: React.FC = () => {
  const [pings, setPings] = useState<number[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const runTest = async () => {
    sounds.playClick();
    setIsTesting(true);
    setPings([]);
    const results: number[] = [];

    for (let i = 0; i < 4; i++) {
      const start = performance.now();
      try {
        await fetch(`https://1.1.1.1/cdn-cgi/trace?cache=${Date.now()}`, { mode: 'no-cors' });
      } catch {
        // ignore
      }
      const duration = Math.round(performance.now() - start);
      results.push(duration);
      setPings([...results]);
      await new Promise(r => setTimeout(r, 400));
    }
    sounds.playSuccess();
    setIsTesting(false);
  };

  const avgPing = pings.length > 0 ? Math.round(pings.reduce((a, b) => a + b, 0) / pings.length) : null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-4">
        <button
          onClick={runTest}
          disabled={isTesting}
          className="px-6 py-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-sm rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isTesting ? 'Pinging Cloudflare Edge...' : 'Start HTTP Latency Test'}
        </button>

        {pings.length > 0 && (
          <div className="grid grid-cols-4 gap-2 pt-2">
            {pings.map((p, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 font-mono text-center">
                <span className="text-[10px] text-zinc-400 block">Ping #{idx + 1}</span>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{p} ms</span>
              </div>
            ))}
          </div>
        )}

        {avgPing !== null && (
          <ResultCard
            label="Average Edge Latency"
            value={`${avgPing} ms`}
            subtext={avgPing < 50 ? 'Ultra-low latency connection' : 'Good standard speed'}
            highlight
          />
        )}
      </div>
    </div>
  );
};
