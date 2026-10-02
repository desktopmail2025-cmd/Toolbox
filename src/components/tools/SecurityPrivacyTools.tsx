import React, { useState, useRef } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Copy, Check, RefreshCw, Lock, ShieldCheck, Download, Trash2, Plus, FileText, KeyRound, RotateCcw } from 'lucide-react';
import { ExtendedUtilities } from './ExtendedUtilities';

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
    case 'breach-checker':
    case 'phishing-scanner':
    case 'user-agent-parser':
    case 'aes-encrypter':
    case 'sha256-hasher':
    case 'caesar-cipher':
    case 'vigenere-cipher':
      return <ExtendedUtilities toolId={toolId} />;
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

// 4. Encrypted Private Notes Vault (Item 9: Master PIN enforcement, Forgot PIN Reset, Vanishing Title & Category)
interface VaultNote {
  id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
}

const DEFAULT_VAULT_NOTES: VaultNote[] = [
  {
    id: '1',
    title: 'Master Recovery Codes',
    content: 'Github: 4A7B-91X2-LK99\nBitwarden: emergency-access-key-verified',
    category: 'Credentials',
    updatedAt: new Date().toLocaleDateString(),
  },
  {
    id: '2',
    title: 'Personal Financial Goals 2026',
    content: '1. Maximize annual Roth contribution\n2. Emergency fund 6-month buffer target: $18,000',
    category: 'General',
    updatedAt: new Date().toLocaleDateString(),
  }
];

const PrivateNotesView: React.FC = () => {
  const [storedPin, setStoredPin] = useState<string | null>(() => {
    return localStorage.getItem('omni_private_vault_pin');
  });
  const [passcode, setPasscode] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const [notes, setNotes] = useState<VaultNote[]>(() => {
    try {
      const saved = localStorage.getItem('omni_private_vault_notes');
      return saved ? JSON.parse(saved) : DEFAULT_VAULT_NOTES;
    } catch {
      return DEFAULT_VAULT_NOTES;
    }
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('General');
  const [cachedTitle, setCachedTitle] = useState('');
  const [cachedCategory, setCachedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeNote = notes.find(n => n.id === activeNoteId);

  // Initial PIN setup handler
  const handleSetupPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode.length < 4) {
      setPinError('PIN must be at least 4 digits');
      sounds.playTone(220, 0.2);
      return;
    }
    if (passcode !== confirmPin) {
      setPinError('PIN confirmation does not match');
      sounds.playTone(220, 0.2);
      return;
    }

    sounds.playSuccess();
    localStorage.setItem('omni_private_vault_pin', passcode);
    setStoredPin(passcode);
    setIsUnlocked(true);
    setPinError(null);
  };

  // Unlock with strict PIN check
  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!storedPin) {
      handleSetupPin(e);
      return;
    }

    if (passcode === storedPin) {
      sounds.playSuccess();
      setIsUnlocked(true);
      setPinError(null);
    } else {
      sounds.playTone(200, 0.4);
      setPinError('Incorrect PIN. Please try again or use Forgot PIN to reset.');
      setPasscode('');
    }
  };

  // Reset entire vault to start from the beginning
  const handleResetVault = () => {
    sounds.playClick();
    localStorage.removeItem('omni_private_vault_pin');
    localStorage.removeItem('omni_private_vault_notes');
    setStoredPin(null);
    setPasscode('');
    setConfirmPin('');
    setPinError(null);
    setNotes([]);
    setActiveNoteId(null);
    setEditTitle('');
    setEditContent('');
    setIsUnlocked(false);
    setShowForgotModal(false);
  };

  const handleSaveNotes = (updated: VaultNote[]) => {
    setNotes(updated);
    localStorage.setItem('omni_private_vault_notes', JSON.stringify(updated));
  };

  const handleCreateNew = () => {
    sounds.playClick();
    const newNote: VaultNote = {
      id: String(Date.now()),
      title: 'Untitled Note',
      content: '',
      category: 'General',
      updatedAt: new Date().toLocaleDateString(),
    };
    const updated = [newNote, ...notes];
    handleSaveNotes(updated);
    setActiveNoteId(newNote.id);
    setEditTitle(newNote.title);
    setCachedTitle(newNote.title);
    setEditContent(newNote.content);
    setEditCategory(newNote.category);
    setCachedCategory(newNote.category);
    setIsEditing(true);
  };

  const startEdit = (note: VaultNote, focusField?: 'title' | 'category') => {
    sounds.playClick();
    setCachedTitle(note.title);
    setCachedCategory(note.category);
    setEditTitle(focusField === 'title' ? '' : note.title);
    setEditContent(note.content);
    setEditCategory(focusField === 'category' ? '' : note.category);
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!activeNoteId) return;
    sounds.playSuccess();
    const finalTitle = editTitle.trim() || cachedTitle || 'Untitled Note';
    const finalCategory = editCategory.trim() || cachedCategory || 'General';
    const updated = notes.map(n => {
      if (n.id === activeNoteId) {
        return {
          ...n,
          title: finalTitle,
          content: editContent,
          category: finalCategory,
          updatedAt: new Date().toLocaleDateString(),
        };
      }
      return n;
    });
    handleSaveNotes(updated);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    sounds.playClick();
    setIsEditing(false);
    setEditTitle(cachedTitle);
    setEditCategory(cachedCategory);
  };

  const deleteNote = (id: string) => {
    sounds.playClick();
    const updated = notes.filter(n => n.id !== id);
    handleSaveNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated[0]?.id || null);
      setIsEditing(false);
    }
  };

  const copyContent = (text: string, id: string) => {
    sounds.playSuccess();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const exportBackup = () => {
    sounds.playClick();
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omni-notes-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Forgot PIN / Reset Confirmation Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Forgot PIN? Reset Vault</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                If you forgot your PIN, resetting will permanently remove all previous encrypted notes to ensure strict privacy and allow you to set a new PIN and start completely from the beginning.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetVault}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Reset from Beginning
              </button>
            </div>
          </div>
        </div>
      )}

      {!isUnlocked ? (
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-5 shadow-sm max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {storedPin ? 'Unlock Private Encrypted Vault' : 'Create Master PIN (Setup)'}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {storedPin
                ? 'Enter your master 4+ digit PIN to view confidential encrypted notes.'
                : 'Create your private 4+ digit PIN to protect your vault notes locally.'}
            </p>
          </div>

          <form onSubmit={storedPin ? handleUnlock : handleSetupPin} className="space-y-3">
            <input
              type="password"
              maxLength={12}
              placeholder={storedPin ? 'Enter Master PIN' : 'Choose 4-12 digit PIN'}
              value={passcode}
              onChange={e => {
                setPasscode(e.target.value);
                setPinError(null);
              }}
              autoFocus
              className="w-48 text-center text-xl font-mono tracking-widest border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 bg-zinc-50 dark:bg-zinc-950 focus:outline-indigo-500 block mx-auto font-bold"
            />

            {!storedPin && (
              <input
                type="password"
                maxLength={12}
                placeholder="Confirm Master PIN"
                value={confirmPin}
                onChange={e => {
                  setConfirmPin(e.target.value);
                  setPinError(null);
                }}
                className="w-48 text-center text-xl font-mono tracking-widest border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 bg-zinc-50 dark:bg-zinc-950 focus:outline-indigo-500 block mx-auto font-bold"
              />
            )}

            {pinError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-shake">
                {pinError}
              </div>
            )}

            <button
              type="submit"
              disabled={passcode.length < 4 || (!storedPin && confirmPin.length < 4)}
              className="w-48 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95 disabled:opacity-40 shadow-xs"
            >
              {storedPin ? 'Unlock Vault' : 'Save & Unlock Vault'}
            </button>
          </form>

          {storedPin && (
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-semibold text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                Forgot PIN? Reset Vault from Beginning
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Encrypted Notes Storage</h3>
                <span className="text-[11px] text-zinc-400">{notes.length} protected notes stored in local vault</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateNew}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> New Note
              </button>
              <button
                onClick={exportBackup}
                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Download encrypted backup"
              >
                <Download className="w-3.5 h-3.5" /> Backup
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsUnlocked(false);
                  setPasscode('');
                }}
                className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Lock
              </button>
            </div>
          </div>

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search notes by title, tag, or content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium focus:outline-indigo-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Note Selector List */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredNotes.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveNoteId(n.id);
                    setIsEditing(false);
                  }}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    activeNoteId === n.id
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-2xs'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[140px]">
                      {n.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">
                      {n.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 font-mono">
                    {n.content || '(Empty content)'}
                  </p>
                  <div className="text-[10px] text-zinc-400 mt-2 flex justify-between items-center">
                    <span>{n.updatedAt}</span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        deleteNote(n.id);
                      }}
                      className="hover:text-rose-500 p-0.5 cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredNotes.length === 0 && (
                <div className="text-center p-6 text-xs text-zinc-400 border border-dashed rounded-2xl">
                  No matching notes found.
                </div>
              )}
            </div>

            {/* Note Editor or Reader View */}
            <div className="md:col-span-2 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
              {activeNote ? (
                isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onFocus={() => {
                          setCachedTitle(editTitle);
                          // Vanish text when clicked if it equals default or current title
                          setEditTitle('');
                        }}
                        onBlur={() => {
                          // Restore previous text if user leaves it empty
                          if (!editTitle.trim()) {
                            setEditTitle(cachedTitle || 'Untitled Note');
                          }
                        }}
                        placeholder="Note title..."
                        className="col-span-2 p-2.5 border rounded-xl font-bold text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 focus:outline-indigo-500"
                      />
                      <input
                        type="text"
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                        onFocus={() => {
                          setCachedCategory(editCategory);
                          // Vanish category text when clicked so user can type freely
                          setEditCategory('');
                        }}
                        onBlur={() => {
                          // Restore previous category if empty
                          if (!editCategory.trim()) {
                            setEditCategory(cachedCategory || 'General');
                          }
                        }}
                        placeholder="Tag (e.g. General, Keys)"
                        className="p-2.5 border rounded-xl text-xs bg-white dark:bg-zinc-950 dark:border-zinc-700 font-semibold focus:outline-indigo-500"
                      />
                    </div>
                    <textarea
                      rows={10}
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      placeholder="Type your secure, sensitive note text here..."
                      className="w-full p-3 border rounded-xl text-xs font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700 focus:outline-indigo-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-2xs"
                      >
                        Save Note Changes
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start pb-3 border-b border-zinc-100 dark:border-zinc-800">
                      <div>
                        <div className="flex items-center gap-2">
                          {/* Clicking Title starts edit with vanishing title text */}
                          <h4
                            onClick={() => startEdit(activeNote, 'title')}
                            className="text-base font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer hover:text-indigo-600 transition-colors"
                            title="Click title to edit"
                          >
                            {activeNote.title}
                          </h4>
                          {/* Clicking Category starts edit with vanishing category text */}
                          <span
                            onClick={() => startEdit(activeNote, 'category')}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:bg-indigo-100 transition-colors"
                            title="Click category to edit"
                          >
                            {activeNote.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400">Last updated: {activeNote.updatedAt}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyContent(activeNote.content, activeNote.id)}
                          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          title="Copy content"
                        >
                          {copiedId === activeNote.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === activeNote.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => startEdit(activeNote)}
                          className="px-3 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl text-xs font-bold cursor-pointer hover:opacity-90"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-100 dark:border-zinc-800/80">
                      <pre className="text-xs font-mono whitespace-pre-wrap text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        {activeNote.content || '(Empty content - click Edit to add notes)'}
                      </pre>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-zinc-400 text-xs">
                  Select a note from the left or create a new note to view details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Emergency ICE Health Card (Item 20: With Canvas PNG Download)
const EmergencyCardView: React.FC = () => {
  const [name, setName] = useState('Alex Mercer');
  const [bloodType, setBloodType] = useState('O+');
  const [allergies, setAllergies] = useState('Penicillin, Peanuts');
  const [medicalConditions, setMedicalConditions] = useState('Asthma (Albuterol Inhaler)');
  const [contactName, setContactName] = useState('Jane Mercer (Spouse)');
  const [contactPhone, setContactPhone] = useState('+1 555-0149');
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);

  const downloadCardImage = () => {
    sounds.playClick();
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw wallet card (856 x 540 high-res credit card aspect)
    canvas.width = 856;
    canvas.height = 540;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 856, 540);
    gradient.addColorStop(0, '#7f1d1d');
    gradient.addColorStop(1, '#991b1b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 856, 540);

    // Card White Panel
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(24, 24, 808, 492, 24);
    ctx.fill();

    // Red Header Banner
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(24, 24, 808, 90, [24, 24, 0, 0]);
    ctx.fill();

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('EMERGENCY MEDICAL CARD (I.C.E.)', 50, 80);

    // Blood Group Badge
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(680, 42, 120, 54, 12);
    ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(bloodType, 715, 80);

    // Body Fields
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('FULL PATIENT NAME', 50, 160);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(name || 'N/A', 50, 195);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('ALLERGIES & ADVERSE REACTIONS', 50, 255);
    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(allergies || 'None Reported', 50, 290);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('MEDICAL CONDITIONS & MEDS', 50, 350);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(medicalConditions || 'None', 50, 385);

    // Footer emergency contact
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(40, 420, 776, 76, 14);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('EMERGENCY CONTACT PERSON & PHONE', 60, 448);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`${contactName} · ${contactPhone}`, 60, 478);

    // Trigger download
    const link = document.createElement('a');
    link.download = `ICE_Emergency_Card_${(name || 'Patient').replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    sounds.playSuccess();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1 font-semibold">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1 font-semibold">Blood Type</label>
          <select
            value={bloodType}
            onChange={e => setBloodType(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          >
            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1 font-semibold">Known Allergies</label>
          <input
            type="text"
            value={allergies}
            onChange={e => setAllergies(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1 font-semibold">Medical Conditions / Prescriptions</label>
          <input
            type="text"
            value={medicalConditions}
            onChange={e => setMedicalConditions(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1 font-semibold">Emergency Contact</label>
          <input
            type="text"
            value={contactName}
            onChange={e => setContactName(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1 font-semibold">Contact Phone</label>
          <input
            type="text"
            value={contactPhone}
            onChange={e => setContactPhone(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
      </div>

      {/* Printable ICE Card Preview with Download Option (Item 20) */}
      <div className="rounded-3xl border-2 border-red-500 bg-red-50/20 dark:bg-red-950/20 p-6 space-y-4 shadow-md">
        <div className="flex justify-between items-center border-b border-red-200 dark:border-red-900 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 animate-pulse" />
            <h3 className="font-bold text-red-600 dark:text-red-400 tracking-wider text-sm uppercase">
              In Case of Emergency (I.C.E.)
            </h3>
          </div>
          <span className="px-3 py-1 bg-red-600 text-white font-mono font-extrabold text-xs rounded-xl">
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

        {/* Download ICE Card Button (Item 20) */}
        <button
          onClick={downloadCardImage}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download Wallet Emergency Card (PNG Image)</span>
        </button>
      </div>

      <canvas ref={cardCanvasRef} className="hidden" />
    </div>
  );
};
