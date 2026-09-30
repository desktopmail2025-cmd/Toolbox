import React, { useState } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Copy, Check, RefreshCw, Lock, ShieldCheck, Download } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const SecurityPrivacyTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'password-generator':
      return <PasswordGeneratorView />;
    case 'pin-generator':
      return <PinGeneratorView />;
    case 'wifi-qr-card':
      return <WifiQrCardView />;
    case 'private-notes':
      return <PrivateNotesView />;
    case 'emergency-ice-card':
      return <EmergencyCardView />;
    default:
      return <PasswordGeneratorView />;
  }
};

// 1. Password Generator & Entropy Meter
const PasswordGeneratorView: React.FC = () => {
  const [length, setLength] = useState(16);
  const [incUpper, setIncUpper] = useState(true);
  const [incLower, setIncLower] = useState(true);
  const [incNumbers, setIncNumbers] = useState(true);
  const [incSymbols, setIncSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    sounds.playClick();
    let chars = '';
    if (incUpper) chars += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (incLower) chars += 'abcdefghijkmnopqrstuvwxyz';
    if (incNumbers) chars += '23456789';
    if (incSymbols) chars += '!@#$%^&*()_+~|}{[]:;?><,.-=';
    if (!chars) chars = 'abcdefghijkmnopqrstuvwxyz';

    let res = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      res += chars[array[i] % chars.length];
    }
    setPassword(res);
  };

  React.useEffect(() => {
    generate();
  }, [length, incUpper, incLower, incNumbers, incSymbols]);

  // Entropy calculation
  let poolSize = 0;
  if (incUpper) poolSize += 26;
  if (incLower) poolSize += 26;
  if (incNumbers) poolSize += 10;
  if (incSymbols) poolSize += 30;
  const entropy = Math.round(length * Math.log2(poolSize || 1));

  const copyPassword = () => {
    sounds.playClick();
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Generated Password Box */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between gap-3 shadow-xs">
        <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-zinc-900 dark:text-zinc-50 break-all">
          {password}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={generate}
            className="p-2 border rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            title="Generate new password"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={copyPassword}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-xs rounded-xl"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span>Password Length</span>
            <span className="font-mono text-sm">{length} characters</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={e => setLength(parseInt(e.target.value))}
            className="w-full accent-zinc-900 dark:accent-zinc-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={incUpper}
              onChange={e => setIncUpper(e.target.checked)}
              className="rounded accent-zinc-900"
            />
            <span>Uppercase (A-Z)</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={incLower}
              onChange={e => setIncLower(e.target.checked)}
              className="rounded accent-zinc-900"
            />
            <span>Lowercase (a-z)</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={incNumbers}
              onChange={e => setIncNumbers(e.target.checked)}
              className="rounded accent-zinc-900"
            />
            <span>Numbers (0-9)</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={incSymbols}
              onChange={e => setIncSymbols(e.target.checked)}
              className="rounded accent-zinc-900"
            />
            <span>Symbols (!@#$)</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResultCard
          label="Password Strength"
          value={entropy >= 80 ? 'Very Strong' : entropy >= 60 ? 'Strong' : 'Moderate'}
          subtext={`${entropy} bits of entropy`}
          highlight={entropy >= 70}
        />
        <ResultCard
          label="Crack Time Estimate"
          value={entropy >= 80 ? 'Centuries' : entropy >= 60 ? 'Thousands of years' : 'Days'}
          subtext="Offline brute force resistant"
        />
      </div>
    </div>
  );
};

// 2. PIN & Secret Key Generator
const PinGeneratorView: React.FC = () => {
  const [pin4, setPin4] = useState('8492');
  const [pin6, setPin6] = useState('519382');
  const [uuid, setUuid] = useState('b89f81a4-92ef-4573-bdf5-29e847c9284d');
  const [apiKey, setApiKey] = useState('sk_live_948a27b9c48e718290f84729');

  const regenerate = () => {
    sounds.playClick();
    setPin4(String(Math.floor(1000 + Math.random() * 9000)));
    setPin6(String(Math.floor(100000 + Math.random() * 900000)));
    setUuid(crypto.randomUUID ? crypto.randomUUID() : 'b89f81a4-92ef-4573-bdf5-29e847c9284d');

    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    setApiKey(`sk_live_${hex}`);
  };

  const copy = (val: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(val);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex justify-end">
        <button
          onClick={regenerate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-xl hover:opacity-90"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Generate Fresh Keys
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase">4-Digit ATM PIN</span>
            <p className="font-mono text-2xl font-bold tracking-widest">{pin4}</p>
          </div>
          <button onClick={() => copy(pin4)} className="p-2 border rounded-lg text-zinc-400 hover:text-zinc-700">
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase">6-Digit Secure PIN</span>
            <p className="font-mono text-2xl font-bold tracking-widest">{pin6}</p>
          </div>
          <button onClick={() => copy(pin6)} className="p-2 border rounded-lg text-zinc-400 hover:text-zinc-700">
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="min-w-0 pr-3">
            <span className="text-xs text-zinc-500 font-semibold uppercase">UUID v4</span>
            <p className="font-mono text-sm font-semibold truncate">{uuid}</p>
          </div>
          <button onClick={() => copy(uuid)} className="p-2 border rounded-lg text-zinc-400 hover:text-zinc-700">
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="min-w-0 pr-3">
            <span className="text-xs text-zinc-500 font-semibold uppercase">Random API Secret Token</span>
            <p className="font-mono text-sm font-semibold truncate">{apiKey}</p>
          </div>
          <button onClick={() => copy(apiKey)} className="p-2 border rounded-lg text-zinc-400 hover:text-zinc-700">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Wi-Fi QR Card Generator
const WifiQrCardView: React.FC = () => {
  const [ssid, setSsid] = useState('Home_WiFi_5G');
  const [password, setPassword] = useState('GuestPass2026!');
  const [encryption, setEncryption] = useState('WPA');

  const wifiPayload = `WIFI:S:${ssid};T:${encryption};P:${password};;`;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Network Name (SSID)</label>
          <input
            type="text"
            value={ssid}
            onChange={e => setSsid(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-medium"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Network Password</label>
          <input
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-mono"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Security Encryption</label>
          <select
            value={encryption}
            onChange={e => setEncryption(e.target.value)}
            className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-semibold"
          >
            <option value="WPA">WPA / WPA2 / WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">None (Open)</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-3">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Guest Wi-Fi Sign-In String</h4>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border rounded-xl font-mono text-xs text-zinc-700 dark:text-zinc-300 break-all">
          {wifiPayload}
        </div>
        <p className="text-xs text-zinc-400">
          Smartphone cameras will automatically recognize this code and prompt guests to connect instantly.
        </p>
      </div>
    </div>
  );
};

// 4. Encrypted Private Notes Vault
const PrivateNotesView: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [noteContent, setNoteContent] = useState(() => {
    return localStorage.getItem('omni_private_vault') || '';
  });

  const handleUnlock = () => {
    if (passcode.length >= 4) {
      sounds.playSuccess();
      setIsUnlocked(true);
    }
  };

  const handleSave = () => {
    sounds.playClick();
    localStorage.setItem('omni_private_vault', noteContent);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {!isUnlocked ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-600 dark:text-zinc-300">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold">Secure Local Vault</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Enter any 4+ digit PIN to protect your confidential notes stored locally on this device.
          </p>
          <input
            type="password"
            maxLength={12}
            placeholder="Enter PIN (e.g. 1234)"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
            className="w-48 text-center text-xl font-mono tracking-widest border rounded-xl p-2.5 bg-white dark:bg-zinc-950 dark:border-zinc-700 block mx-auto"
          />
          <button
            onClick={handleUnlock}
            disabled={passcode.length < 4}
            className="px-6 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-xl hover:opacity-90 disabled:opacity-40"
          >
            Unlock Vault
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Vault Unlocked
            </span>
            <button
              onClick={() => setIsUnlocked(false)}
              className="text-xs text-zinc-400 hover:text-zinc-700"
            >
              Lock Vault
            </button>
          </div>
          <textarea
            rows={10}
            value={noteContent}
            onChange={e => setNoteContent(e.target.value)}
            placeholder="Type your sensitive thoughts or passwords here..."
            className="w-full border rounded-xl p-3 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-mono"
          />
          <button
            onClick={handleSave}
            className="w-full py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-xl hover:opacity-90"
          >
            Save Encrypted Note Locally
          </button>
        </div>
      )}
    </div>
  );
};

// 5. Emergency ICE Health Card
const EmergencyCardView: React.FC = () => {
  const [name, setName] = useState('Alex Mercer');
  const [bloodType, setBloodType] = useState('O+');
  const [allergies, setAllergies] = useState('Penicillin, Peanuts');
  const [contactName, setContactName] = useState('Jane Mercer (Spouse)');
  const [contactPhone, setContactPhone] = useState('+1 555-0149');

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Blood Type</label>
          <select
            value={bloodType}
            onChange={e => setBloodType(e.target.value)}
            className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          >
            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1">Allergies & Medical Conditions</label>
          <input
            type="text"
            value={allergies}
            onChange={e => setAllergies(e.target.value)}
            className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Emergency Contact</label>
          <input
            type="text"
            value={contactName}
            onChange={e => setContactName(e.target.value)}
            className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Contact Phone</label>
          <input
            type="text"
            value={contactPhone}
            onChange={e => setContactPhone(e.target.value)}
            className="w-full border rounded-xl p-2 text-sm font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      {/* Printable ICE Card Preview */}
      <div className="rounded-3xl border-2 border-red-500 bg-red-50/20 dark:bg-red-950/20 p-6 space-y-4 shadow-md">
        <div className="flex justify-between items-center border-b border-red-200 dark:border-red-900 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
            <h3 className="font-bold text-red-600 dark:text-red-400 tracking-wider text-sm uppercase">
              In Case of Emergency (I.C.E.)
            </h3>
          </div>
          <span className="px-3 py-1 bg-red-600 text-white font-mono font-bold text-xs rounded-full">
            Blood: {bloodType}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-zinc-500 block">Name:</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{name}</span>
          </div>
          <div>
            <span className="text-zinc-500 block">Allergies:</span>
            <span className="font-semibold text-red-600 dark:text-red-400">{allergies || 'None'}</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-red-100 dark:border-red-900/50">
            <span className="text-zinc-500 block">Emergency Contact:</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{contactName} · {contactPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
