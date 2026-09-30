import React, { useState } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const TextWritingTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'text-analyzer':
      return <TextAnalyzerView />;
    case 'case-converter':
      return <CaseConverterView />;
    case 'text-cleaner':
      return <TextCleanerView />;
    case 'find-replace':
      return <FindReplaceView />;
    case 'text-repeater':
      return <TextRepeaterView />;
    case 'fancy-text':
      return <FancyTextView />;
    case 'text-encoders':
      return <TextEncodersView />;
    default:
      return <TextAnalyzerView />;
  }
};

// 1. Text Analyzer & Live Word Counter
const TextAnalyzerView: React.FC = () => {
  const [text, setText] = useState(
    'OmniToolbox brings together the essential utility tools you need every day. From quick math calculations and finance estimators to unit conversions, student study aids, image optimizers, and mini-games, everything runs entirely inside your browser with zero bloat.'
  );

  const charCount = text.length;
  const charNoSpaces = text.replace(/\s+/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (text.trim() ? 1 : 0) : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
  const readingTimeMin = (words / 200).toFixed(1); // 200 wpm
  const speakingTimeMin = (words / 130).toFixed(1); // 130 wpm

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Live Text Editor & Statistics
          </label>
          <button
            onClick={() => { sounds.playClick(); setText(''); }}
            className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            Clear Text
          </button>
        </div>
        <textarea
          rows={6}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full border rounded-xl p-3 text-sm font-sans bg-white dark:bg-zinc-950 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="Word Count" value={words} highlight />
        <ResultCard label="Characters" value={charCount} subtext={`${charNoSpaces} without spaces`} />
        <ResultCard label="Sentences" value={sentences} />
        <ResultCard label="Paragraphs" value={paragraphs} />
        <ResultCard label="Reading Time" value={`${readingTimeMin} min`} subtext="~200 WPM avg" />
        <ResultCard label="Speaking Time" value={`${speakingTimeMin} min`} subtext="~130 WPM speech" />
        <ResultCard label="Avg Word Length" value={words > 0 ? (charNoSpaces / words).toFixed(1) : '0'} />
        <ResultCard label="Unique Words" value={new Set(text.toLowerCase().match(/\b[a-z0-9]+\b/g) || []).size} />
      </div>
    </div>
  );
};

// 2. Text Case Converter
const CaseConverterView: React.FC = () => {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog');

  const toUpper = text.toUpperCase();
  const toLower = text.toLowerCase();
  const toTitle = text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  const toSentence = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  const toCamel = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  const toKebab = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-');
  const toSnake = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_');

  const copyVal = (val: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(val);
  };

  const cases = [
    { label: 'UPPERCASE', val: toUpper },
    { label: 'lowercase', val: toLower },
    { label: 'Title Case', val: toTitle },
    { label: 'Sentence case', val: toSentence },
    { label: 'camelCase', val: toCamel },
    { label: 'kebab-case', val: toKebab },
    { label: 'snake_case', val: toSnake },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
          Input Text
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full border rounded-xl p-3 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
        />
      </div>

      <div className="space-y-2">
        {cases.map(c => (
          <div
            key={c.label}
            className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div>
              <span className="text-[11px] font-semibold uppercase text-zinc-400 block">{c.label}</span>
              <p className="font-mono text-sm text-zinc-800 dark:text-zinc-200 truncate max-w-lg">{c.val}</p>
            </div>
            <button
              onClick={() => copyVal(c.val)}
              className="p-1.5 rounded-lg border text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              title="Copy"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Text Cleaner & Line Tools
const TextCleanerView: React.FC = () => {
  const [text, setText] = useState('  Banana  \n  Apple  \n  Orange  \n  Apple  \n\n  Grape  ');

  const cleanSpaces = () => {
    sounds.playClick();
    setText(text.replace(/[ \t]+/g, ' ').trim());
  };

  const removeBlankLines = () => {
    sounds.playClick();
    setText(text.split('\n').filter(line => line.trim().length > 0).join('\n'));
  };

  const deduplicateLines = () => {
    sounds.playClick();
    const lines = text.split('\n');
    setText(Array.from(new Set(lines)).join('\n'));
  };

  const sortLinesAZ = () => {
    sounds.playClick();
    const lines = text.split('\n');
    lines.sort((a, b) => a.localeCompare(b));
    setText(lines.join('\n'));
  };

  const reverseLines = () => {
    sounds.playClick();
    setText(text.split('\n').reverse().join('\n'));
  };

  const numberLines = () => {
    sounds.playClick();
    const lines = text.split('\n');
    setText(lines.map((l, i) => `${i + 1}. ${l}`).join('\n'));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={cleanSpaces} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 rounded-lg text-xs font-medium">
          Trim Extra Spaces
        </button>
        <button onClick={removeBlankLines} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 rounded-lg text-xs font-medium">
          Remove Blank Lines
        </button>
        <button onClick={deduplicateLines} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 rounded-lg text-xs font-medium">
          Remove Duplicate Lines
        </button>
        <button onClick={sortLinesAZ} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 rounded-lg text-xs font-medium">
          Sort A → Z
        </button>
        <button onClick={reverseLines} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 rounded-lg text-xs font-medium">
          Reverse Lines
        </button>
        <button onClick={numberLines} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 rounded-lg text-xs font-medium">
          Add Line Numbers
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <textarea
          rows={8}
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full border rounded-xl p-3 text-sm font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
        />
      </div>
    </div>
  );
};

// 4. Find & Replace
const FindReplaceView: React.FC = () => {
  const [content, setContent] = useState('The cat sat on the mat. Another cat looked at that cat.');
  const [findStr, setFindStr] = useState('cat');
  const [replaceStr, setReplaceStr] = useState('dog');
  const [matchCase, setMatchCase] = useState(false);

  const handleReplace = () => {
    sounds.playClick();
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(findStr, flags);
    setContent(content.replace(regex, replaceStr));
  };

  const countMatches = () => {
    if (!findStr) return 0;
    const flags = matchCase ? 'g' : 'gi';
    try {
      const matches = content.match(new RegExp(findStr, flags));
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Find</label>
            <input
              type="text"
              value={findStr}
              onChange={e => setFindStr(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Replace With</label>
            <input
              type="text"
              value={replaceStr}
              onChange={e => setReplaceStr(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={e => setMatchCase(e.target.checked)}
              className="rounded"
            />
            <span>Match Case</span>
          </label>
          <span className="text-xs text-zinc-500">Found {countMatches()} matches</span>
        </div>

        <button
          onClick={handleReplace}
          className="w-full py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-xl hover:opacity-90"
        >
          Replace All Occurrences
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <textarea
          rows={6}
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full border rounded-xl p-3 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
        />
      </div>
    </div>
  );
};

// 5. Text Repeater
const TextRepeaterView: React.FC = () => {
  const [repeatText, setRepeatText] = useState('Hello World! ');
  const [times, setTimes] = useState(5);
  const [separator, setSeparator] = useState<'none' | 'space' | 'newline' | 'comma'>('newline');
  const [copied, setCopied] = useState(false);

  const sepChar = separator === 'space' ? ' ' : separator === 'newline' ? '\n' : separator === 'comma' ? ', ' : '';
  const result = Array.from({ length: Math.min(times, 1000) }, () => repeatText).join(sepChar);

  const handleCopy = () => {
    sounds.playClick();
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Text to Repeat</label>
          <input
            type="text"
            value={repeatText}
            onChange={e => setRepeatText(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Repetitions (Max 1000)</label>
            <input
              type="number"
              min={1}
              max={1000}
              value={times}
              onChange={e => setTimes(parseInt(e.target.value) || 1)}
              className="w-full border rounded-xl p-2 font-mono text-center bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Separator</label>
            <select
              value={separator}
              onChange={e => setSeparator(e.target.value as any)}
              className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
            >
              <option value="newline">New Line (\n)</option>
              <option value="space">Space</option>
              <option value="comma">Comma (,)</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-zinc-500">Repeated Output</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 rounded-lg"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <textarea
          rows={6}
          readOnly
          value={result}
          className="w-full border rounded-xl p-3 text-xs font-mono bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800"
        />
      </div>
    </div>
  );
};

// 6. Fancy Text Generator
const FancyTextView: React.FC = () => {
  const [input, setInput] = useState('Modern Creative Design');

  // Unicode mappings
  const toSmallCaps = (s: string) => {
    const map: Record<string, string> = {
      a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ',
      n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
    };
    return s.toLowerCase().split('').map(ch => map[ch] || ch).join('');
  };

  const toUpsideDown = (s: string) => {
    const map: Record<string, string> = {
      a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ',
      n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
    };
    return s.toLowerCase().split('').reverse().map(ch => map[ch] || ch).join('');
  };

  const toLeet = (s: string) => {
    return s.toUpperCase().replace(/A/g, '4').replace(/E/g, '3').replace(/I/g, '1').replace(/O/g, '0').replace(/T/g, '7').replace(/S/g, '5');
  };

  const copyVal = (val: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(val);
  };

  const styles = [
    { name: 'Small Caps', res: toSmallCaps(input) },
    { name: 'Upside-Down', res: toUpsideDown(input) },
    { name: 'Leet / 1337', res: toLeet(input) },
    { name: 'Spaced Out', res: input.split('').join(' ') },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
          Enter Words to Transform
        </label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full border rounded-xl p-3 text-base bg-white dark:bg-zinc-950 dark:border-zinc-700 font-semibold"
        />
      </div>

      <div className="space-y-3">
        {styles.map(st => (
          <div key={st.name} className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 block">{st.name}</span>
              <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">{st.res}</p>
            </div>
            <button
              onClick={() => copyVal(st.res)}
              className="p-2 border rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. Text Encoders & Decoders
const TextEncodersView: React.FC = () => {
  const [text, setText] = useState('Toolbox 2026');
  const [mode, setMode] = useState<'binary' | 'base64' | 'hex' | 'url'>('base64');

  const toBinary = (str: string) =>
    str.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');

  const toHex = (str: string) =>
    str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');

  const toBase64 = (str: string) => {
    try {
      return btoa(str);
    } catch {
      return 'Encoding error';
    }
  };

  const toUrl = (str: string) => encodeURIComponent(str);

  let output = '';
  if (mode === 'binary') output = toBinary(text);
  else if (mode === 'base64') output = toBase64(text);
  else if (mode === 'hex') output = toHex(text);
  else if (mode === 'url') output = toUrl(text);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold">
        {(['base64', 'binary', 'hex', 'url'] as const).map(m => (
          <button
            key={m}
            onClick={() => { sounds.playClick(); setMode(m); }}
            className={`flex-1 py-1.5 rounded-lg uppercase ${mode === m ? 'bg-white dark:bg-zinc-700 shadow-xs font-bold' : 'text-zinc-500'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
        <label className="block text-xs font-semibold text-zinc-500">Input Plain Text</label>
        <textarea
          rows={3}
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full border rounded-xl p-3 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
        />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-zinc-500 uppercase">{mode} Encoded Output</label>
          <button
            onClick={() => {
              sounds.playClick();
              navigator.clipboard.writeText(output);
            }}
            className="text-xs flex items-center gap-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>
        <textarea
          rows={4}
          readOnly
          value={output}
          className="w-full border rounded-xl p-3 text-sm font-mono bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 break-all"
        />
      </div>
    </div>
  );
};
