import React, { useState } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Copy, Check, Sparkles, RefreshCw, Wand2, ArrowDownAZ, ListOrdered, AlignLeft, Scissors } from 'lucide-react';
import { ExtendedUtilities } from './ExtendedUtilities';

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
    case 'dictionary-lookup':
    case 'language-translator':
    case 'text-sentiment-analyzer':
    case 'readability-calculator':
    case 'rhyme-thesaurus':
      return <ExtendedUtilities toolId={toolId} />;
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

// 2. Text Case Converter (Item 4: 20+ Diverse Case & Fancy Typography Formats)
const CaseConverterView: React.FC = () => {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog');
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const toUpper = text.toUpperCase();
  const toLower = text.toLowerCase();
  const toTitle = text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  const toSentence = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  const toCamel = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  const toPascal = text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
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
  const toConstant = text
    .toUpperCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_');
  const toDot = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '.');
  const toPath = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '/');
  const toTrain = text
    .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
    .replace(/[\s_]+/g, '-');
  const toCobol = toKebab.toUpperCase();
  const toFlat = text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  const toUpperFlat = text.toUpperCase().replace(/[^a-zA-Z0-9]/g, '');
  const toAlternating = text
    .split('')
    .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
    .join('');
  const toInvertedAlternating = text
    .split('')
    .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
    .join('');
  const toReverse = text.split('').reverse().join('');
  const toSpaced = text.split('').join(' ');
  const toVapor = text
    .split('')
    .map(ch => {
      const code = ch.charCodeAt(0);
      return code >= 33 && code <= 126 ? String.fromCharCode(code + 65248) : ch;
    })
    .join('');

  const copyVal = (val: string, label: string) => {
    sounds.playSuccess();
    navigator.clipboard.writeText(val);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 1800);
  };

  const cases = [
    { label: 'UPPERCASE', val: toUpper, styleClass: 'font-sans font-black tracking-widest text-zinc-900 dark:text-zinc-50 uppercase', fontDesc: 'Impact Black' },
    { label: 'lowercase', val: toLower, styleClass: 'font-sans font-medium lowercase tracking-normal text-zinc-700 dark:text-zinc-300', fontDesc: 'Geometric Sans' },
    { label: 'Title Case', val: toTitle, styleClass: 'font-serif font-bold tracking-tight text-indigo-900 dark:text-indigo-200 capitalize', fontDesc: 'Editorial Serif' },
    { label: 'Sentence case', val: toSentence, styleClass: 'font-sans font-normal text-zinc-800 dark:text-zinc-200', fontDesc: 'Modern Body' },
    { label: 'camelCase', val: toCamel, styleClass: 'font-mono font-semibold text-amber-600 dark:text-amber-400', fontDesc: 'JavaScript Standard' },
    { label: 'PascalCase', val: toPascal, styleClass: 'font-mono font-bold text-indigo-600 dark:text-indigo-400', fontDesc: 'Type / Class' },
    { label: 'snake_case', val: toSnake, styleClass: 'font-mono font-semibold text-emerald-600 dark:text-emerald-400', fontDesc: 'Python / Database' },
    { label: 'CONSTANT_CASE', val: toConstant, styleClass: 'font-mono font-black text-rose-600 dark:text-rose-400 tracking-wider', fontDesc: 'Global Constants' },
    { label: 'kebab-case', val: toKebab, styleClass: 'font-mono font-semibold text-cyan-600 dark:text-cyan-400', fontDesc: 'CSS / URL Slug' },
    { label: 'dot.case', val: toDot, styleClass: 'font-mono font-medium text-purple-600 dark:text-purple-400', fontDesc: 'Properties / Package' },
    { label: 'path/case', val: toPath, styleClass: 'font-mono font-medium text-teal-600 dark:text-teal-400', fontDesc: 'Unix File Path' },
    { label: 'Train-Case', val: toTrain, styleClass: 'font-mono font-bold text-blue-600 dark:text-blue-400', fontDesc: 'HTTP Headers' },
    { label: 'COBOL-CASE', val: toCobol, styleClass: 'font-mono font-extrabold text-orange-600 dark:text-orange-400', fontDesc: 'Mainframe Standard' },
    { label: 'flatcase', val: toFlat, styleClass: 'font-mono text-zinc-600 dark:text-zinc-400', fontDesc: 'Concatenated Lower' },
    { label: 'UPPERFLATCASE', val: toUpperFlat, styleClass: 'font-mono font-bold text-zinc-700 dark:text-zinc-300', fontDesc: 'Concatenated Upper' },
    { label: 'aLtErNaTiNg cAsE', val: toAlternating, styleClass: 'font-mono font-bold tracking-wider text-pink-600 dark:text-pink-400', fontDesc: 'Playful Glitch' },
    { label: 'AlTeRnAtInG CaSe', val: toInvertedAlternating, styleClass: 'font-mono font-bold tracking-wider text-fuchsia-600 dark:text-fuchsia-400', fontDesc: 'SpongeBob Meme' },
    { label: 'Reverse Text', val: toReverse, styleClass: 'font-mono font-semibold text-violet-600 dark:text-violet-400', fontDesc: 'Backwards Mirror' },
    { label: 'W i d e  S p a c e d', val: toSpaced, styleClass: 'font-sans font-bold tracking-widest text-zinc-800 dark:text-zinc-200', fontDesc: 'Aesthetic Spaced' },
    { label: 'Ｖａｐｏｒｗａｖｅ', val: toVapor, styleClass: 'font-serif font-black text-indigo-500 tracking-wider', fontDesc: 'Fullwidth Unicode' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Source Text to Convert ({cases.length} Distinct Styles)
          </label>
        </div>
        <textarea
          rows={3}
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm bg-zinc-50/50 dark:bg-zinc-950 dark:border-zinc-700 focus:outline-indigo-500 font-medium"
        />
      </div>

      <div className="space-y-2.5">
        {cases.map(c => (
          <div
            key={c.label}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-2xs group"
          >
            <div className="min-w-0 pr-3 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {c.label}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 font-mono">
                  {c.fontDesc}
                </span>
              </div>
              <p className={`text-sm truncate select-all ${c.styleClass}`}>{c.val}</p>
            </div>
            <button
              onClick={() => copyVal(c.val, c.label)}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              title={`Copy ${c.label}`}
            >
              {copiedLabel === c.label ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Text Cleaner & Line Tools (Item 12: High-Contrast Glowing Header & Fixed Logic)
const TextCleanerView: React.FC = () => {
  const [text, setText] = useState('  Banana  \n  Apple  \n  Orange  \n  Apple  \n\n  Grape  \n  <b>bold text</b>  ');
  const [copied, setCopied] = useState(false);

  const cleanSpaces = () => {
    sounds.playClick();
    const cleaned = text
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map(line => line.replace(/[ \t]+/g, ' ').trim())
      .join('\n');
    setText(cleaned);
  };

  const removeBlankLines = () => {
    sounds.playClick();
    const cleaned = text
      .replace(/\r\n/g, '\n')
      .split('\n')
      .filter(line => line.trim().length > 0)
      .join('\n');
    setText(cleaned);
  };

  const deduplicateLines = () => {
    sounds.playClick();
    const seen = new Set<string>();
    const out: string[] = [];
    text.replace(/\r\n/g, '\n').split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!seen.has(trimmed.toLowerCase())) {
        seen.add(trimmed.toLowerCase());
        out.push(line);
      }
    });
    setText(out.join('\n'));
  };

  const sortLinesAZ = () => {
    sounds.playClick();
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    lines.sort((a, b) => a.trim().localeCompare(b.trim()));
    setText(lines.join('\n'));
  };

  const reverseLines = () => {
    sounds.playClick();
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    setText(lines.reverse().join('\n'));
  };

  const numberLines = () => {
    sounds.playClick();
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    setText(lines.map((l, i) => `${i + 1}. ${l}`).join('\n'));
  };

  const bulletLines = () => {
    sounds.playClick();
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    setText(lines.map(l => (l.trim() ? `• ${l.trim()}` : l)).join('\n'));
  };

  const stripHtml = () => {
    sounds.playClick();
    setText(text.replace(/<[^>]*>/g, ''));
  };

  const copyResult = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* High-Contrast Dual Mode Header Banner (Item 12) */}
      <div className="rounded-3xl border-2 border-indigo-400/40 bg-gradient-to-r from-violet-500/15 via-indigo-500/15 to-emerald-500/15 dark:from-violet-950/60 dark:via-indigo-950/60 dark:to-emerald-950/60 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                Text Cleaner & Line Manipulation
              </h3>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                Instantly sanitize, deduplicate, format, and organize text datasets
              </p>
            </div>
          </div>

          <button
            onClick={copyResult}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy All'}</span>
          </button>
        </div>
      </div>

      {/* Action Button Strip */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={cleanSpaces}
          className="px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-2xs transition-all flex items-center gap-1.5"
        >
          <Scissors className="w-3.5 h-3.5 text-amber-500" /> Trim Extra Spaces
        </button>
        <button
          onClick={removeBlankLines}
          className="px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-2xs transition-all"
        >
          Remove Blank Lines
        </button>
        <button
          onClick={deduplicateLines}
          className="px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-2xs transition-all"
        >
          Deduplicate Lines
        </button>
        <button
          onClick={sortLinesAZ}
          className="px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-2xs transition-all flex items-center gap-1.5"
        >
          <ArrowDownAZ className="w-3.5 h-3.5 text-indigo-500" /> Sort A → Z
        </button>
        <button
          onClick={reverseLines}
          className="px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-2xs transition-all"
        >
          Reverse Lines
        </button>
        <button
          onClick={numberLines}
          className="px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-2xs transition-all flex items-center gap-1.5"
        >
          <ListOrdered className="w-3.5 h-3.5 text-emerald-500" /> 1. Line Numbers
        </button>
        <button
          onClick={bulletLines}
          className="px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-2xs transition-all"
        >
          • Add Bullets
        </button>
        <button
          onClick={stripHtml}
          className="px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-2xs transition-all"
        >
          Strip HTML Tags
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <textarea
          rows={9}
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm font-mono bg-zinc-50/50 dark:bg-zinc-950 focus:outline-indigo-500"
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

// 6. Fancy Fonts & Text Styler (Item 13: 20+ Fancy Styles & Unicode Mappings)
const FancyTextView: React.FC = () => {
  const [input, setInput] = useState('Creative Design');
  const [copiedName, setCopiedName] = useState<string | null>(null);

  // Unicode transformation helpers
  const mapAlphabet = (s: string, upperMap: string, lowerMap: string) => {
    return s.split('').map(ch => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        const idx = code - 65;
        return Array.from(upperMap)[idx] || ch;
      }
      if (code >= 97 && code <= 122) {
        const idx = code - 97;
        return Array.from(lowerMap)[idx] || ch;
      }
      return ch;
    }).join('');
  };

  const toFrakturBold = (s: string) =>
    mapAlphabet(s, '𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅', '𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟');

  const toFraktur = (s: string) =>
    mapAlphabet(s, '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ', '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷');

  const toScriptBold = (s: string) =>
    mapAlphabet(s, '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩', '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔩');

  const toScript = (s: string) =>
    mapAlphabet(s, '𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵', '𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏');

  const toDoubleStruck = (s: string) =>
    mapAlphabet(s, '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ', '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫');

  const toSansBold = (s: string) =>
    mapAlphabet(s, '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭', '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇');

  const toSansItalic = (s: string) =>
    mapAlphabet(s, '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡', '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻');

  const toSansBoldItalic = (s: string) =>
    mapAlphabet(s, '𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕', '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯');

  const toMonospace = (s: string) =>
    mapAlphabet(s, '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉', '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣');

  const toCircled = (s: string) =>
    mapAlphabet(s, 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ', 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ');

  const toDarkCircled = (s: string) =>
    mapAlphabet(s, '🅮🅯🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉', '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩');

  const toSquared = (s: string) =>
    mapAlphabet(s, '🅂🅀🅄🄰🅁🄴🄳🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉', '🅂🅀🅄🄰🅁🄴🄳🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉');

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

  const toFullwidth = (s: string) => {
    return s.split('').map(ch => {
      const code = ch.charCodeAt(0);
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(code + 65248);
      }
      return ch;
    }).join('');
  };

  const toSuperscript = (s: string) => {
    const map: Record<string, string> = {
      a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ',
      n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    return s.toLowerCase().split('').map(ch => map[ch] || ch).join('');
  };

  const toSubscript = (s: string) => {
    const map: Record<string, string> = {
      a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ', p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
    };
    return s.toLowerCase().split('').map(ch => map[ch] || ch).join('');
  };

  const toStrikethrough = (s: string) => s.split('').join('̶') + '̶';
  const toUnderline = (s: string) => s.split('').join('̲') + '̲';
  const toDoubleUnderline = (s: string) => s.split('').join('̳') + '̳';
  const toDottedUnderline = (s: string) => s.split('').join('̤') + '̤';
  const toWavy = (s: string) => s.split('').join('̃') + '̃';
  const toSlash = (s: string) => s.split('').join('̷') + '̷';
  const toCrossHatch = (s: string) => s.split('').join('̽') + '̽';
  const toLeet = (s: string) => s.toUpperCase().replace(/A/g, '4').replace(/E/g, '3').replace(/I/g, '1').replace(/O/g, '0').replace(/T/g, '7').replace(/S/g, '5');

  const copyVal = (val: string, name: string) => {
    sounds.playSuccess();
    navigator.clipboard.writeText(val);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 1800);
  };

  const styles = [
    { name: 'Gothic / Fraktur Bold', res: toFrakturBold(input) },
    { name: 'Fraktur Medieval Standard', res: toFraktur(input) },
    { name: 'Cursive Script Bold', res: toScriptBold(input) },
    { name: 'Cursive Calligraphy Italic', res: toScript(input) },
    { name: 'Double Struck (Blackboard Math)', res: toDoubleStruck(input) },
    { name: 'Bold Modern Sans-Serif', res: toSansBold(input) },
    { name: 'Italic Serif Style', res: toSansItalic(input) },
    { name: 'Bold Italic Sans-Serif', res: toSansBoldItalic(input) },
    { name: 'Monospace Terminal Code', res: toMonospace(input) },
    { name: 'Bubble / Circled Glyphs', res: toCircled(input) },
    { name: 'Dark Bubble Inverted', res: toDarkCircled(input) },
    { name: 'Squared Letters Boxed', res: toSquared(input) },
    { name: 'Small Capitals (ᴀʙᴄ)', res: toSmallCaps(input) },
    { name: 'Superscript Tiny (ᵃᵇᶜ)', res: toSuperscript(input) },
    { name: 'Subscript Tiny (ₐᵦ꜀)', res: toSubscript(input) },
    { name: 'Fullwidth Vaporwave (Ａｅｓｔｈｅｔｉｃ)', res: toFullwidth(input) },
    { name: 'Upside-Down Inverted', res: toUpsideDown(input) },
    { name: 'Reversed Mirror Backwards', res: input.split('').reverse().join('') },
    { name: 'Strikethrough Cross (a̶b̶c̶)', res: toStrikethrough(input) },
    { name: 'Underline Aesthetic (a̲b̲c̲)', res: toUnderline(input) },
    { name: 'Double Underline (a̳b̳c̳)', res: toDoubleUnderline(input) },
    { name: 'Dotted Underline (a̤b̤c̤)', res: toDottedUnderline(input) },
    { name: 'Wavy Overline Accent (ãb̃c̃)', res: toWavy(input) },
    { name: 'Slash Through (a̷b̷c̷)', res: toSlash(input) },
    { name: 'Cross-Hatched Star Accent', res: toCrossHatch(input) },
    { name: 'W i d e  S p a c e d', res: input.split('').join(' ') },
    { name: 'Double Spaced Aesthetic', res: input.split('').join('  ') },
    { name: 'Leet / 1337 Hacker Code', res: toLeet(input) },
    { name: 'Cute Sparkles Frame', res: `✨ ${input} ✨` },
    { name: 'Love Hearts Frame', res: `💖 ${input} 💖` },
    { name: 'Fire Flames Frame', res: `🔥 ${input} 🔥` },
    { name: 'Royal Crown Style', res: `👑 ${input} 👑` },
    { name: 'Cyber Japanese Brackets', res: `【 ${input} 】` },
    { name: 'Star Constellation Borders', res: `★ ${input} ★` },
    { name: 'Arrow Wing Accents', res: `»» ${input} ««` },
    { name: 'Geometric Diamond Shield', res: `◈ ${input} ◈` },
    { name: 'Parenthesized Tag', res: `(${input})` },
    { name: 'Crossed Daggers Frame', res: `⚔️ ${input} ⚔️` },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-2 shadow-xs">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Enter Text to Style (20+ Fancy Unicode Fonts)
          </label>
          <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
            {styles.length} Fonts
          </span>
        </div>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type any word or phrase..."
          className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-base bg-zinc-50/50 dark:bg-zinc-950 font-bold focus:outline-indigo-500"
        />
      </div>

      <div className="space-y-2.5">
        {styles.map(st => (
          <div
            key={st.name}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-2xs group"
          >
            <div className="min-w-0 pr-3 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-0.5">
                {st.name}
              </span>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50 truncate select-all">
                {st.res}
              </p>
            </div>
            <button
              onClick={() => copyVal(st.res, st.name)}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
              title={`Copy ${st.name}`}
            >
              {copiedName === st.name ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
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
