import React, { useState } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Copy, Check, Code2, Layers, Sliders, Eye, RefreshCw, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const DeveloperTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'css-gradient-gen':
      return <CssGradientGenView />;
    case 'json-validator':
      return <JsonValidatorView />;
    case 'diff-checker':
      return <DiffCheckerView />;
    case 'regex-tester':
      return <RegexTesterView />;
    case 'html-entity-encoder':
      return <HtmlEntityView />;
    case 'color-contrast-checker':
      return <ColorContrastView />;
    case 'css-box-shadow':
      return <CssBoxShadowView />;
    case 'pixel-to-rem':
      return <PixelToRemView />;
    case 'markdown-to-html':
      return <MarkdownToHtmlView />;
    case 'csv-to-json':
      return <CsvToJsonView />;
    default:
      return <CssGradientGenView />;
  }
};

// 1. CSS Gradient Generator
const CssGradientGenView: React.FC = () => {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState('#4f46e5');
  const [color2, setColor2] = useState('#06b6d4');
  const [copied, setCopied] = useState(false);

  const gradientCss =
    type === 'linear'
      ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
      : `radial-gradient(circle, ${color1}, ${color2})`;

  const cssRule = `background: ${gradientCss};`;

  const copyCss = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(cssRule);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">CSS Gradient Studio</h2>
      </div>

      <div
        className="w-full h-48 rounded-3xl shadow-lg border border-black/5 dark:border-white/10 transition-all duration-300"
        style={{ background: gradientCss }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-2">Gradient Style</label>
          <div className="flex gap-2">
            <button
              onClick={() => { sounds.playClick(); setType('linear'); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                type === 'linear'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
                  : 'bg-zinc-50 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => { sounds.playClick(); setType('radial'); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                type === 'radial'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
                  : 'bg-zinc-50 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
              }`}
            >
              Radial
            </button>
          </div>
        </div>

        {type === 'linear' && (
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-2">
              <span>Angle</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100">{angle}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={e => setAngle(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Color Stop 1</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color1}
              onChange={e => setColor1(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              value={color1}
              onChange={e => setColor1(e.target.value)}
              className="flex-1 font-mono text-xs p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Color Stop 2</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color2}
              onChange={e => setColor2(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              value={color2}
              onChange={e => setColor2(e.target.value)}
              className="flex-1 font-mono text-xs p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 uppercase"
            />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 flex items-center justify-between gap-4 font-mono text-xs">
        <code className="text-zinc-800 dark:text-zinc-200 truncate">{cssRule}</code>
        <button
          onClick={copyCss}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shrink-0 cursor-pointer active:scale-95 transition-all text-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy CSS'}</span>
        </button>
      </div>
    </div>
  );
};

// 2. JSON Syntax Validator & Formatter
const JsonValidatorView: React.FC = () => {
  const [jsonText, setJsonText] = useState('{\n  "status": "success",\n  "count": 42,\n  "data": [\n    { "id": 1, "name": "OmniTool" }\n  ]\n}');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string }>({
    valid: true,
    message: 'Valid JSON',
  });
  const [copied, setCopied] = useState(false);

  const handleValidate = () => {
    sounds.playClick();
    try {
      JSON.parse(jsonText);
      setValidationResult({ valid: true, message: 'JSON is 100% valid syntax!' });
      sounds.playSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON';
      setValidationResult({ valid: false, message: msg });
    }
  };

  const handleFormat = () => {
    sounds.playClick();
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setValidationResult({ valid: true, message: 'Formatted nicely (2 spaces)' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON';
      setValidationResult({ valid: false, message: msg });
    }
  };

  const handleMinify = () => {
    sounds.playClick();
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed));
      setValidationResult({ valid: true, message: 'Minified (compressed to single line)' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON';
      setValidationResult({ valid: false, message: msg });
    }
  };

  const handleCopy = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">JSON Validator & Formatter</h2>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleValidate}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer active:scale-95"
          >
            Validate
          </button>
          <button
            onClick={handleFormat}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
          >
            Beautify (Indent)
          </button>
          <button
            onClick={handleMinify}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
          >
            Minify
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <textarea
        rows={12}
        value={jsonText}
        onChange={e => {
          setJsonText(e.target.value);
          try {
            JSON.parse(e.target.value);
            setValidationResult({ valid: true, message: 'Valid JSON' });
          } catch {
            setValidationResult({ valid: false, message: 'Syntax error in JSON string' });
          }
        }}
        className="w-full font-mono text-xs p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        placeholder="Paste JSON here..."
      />

      <div
        className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
          validationResult.valid
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
            : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
        }`}
      >
        {validationResult.valid ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
        <span>{validationResult.message}</span>
      </div>
    </div>
  );
};

// 3. Side-by-Side Diff Checker
const DiffCheckerView: React.FC = () => {
  const [text1, setText1] = useState('const user = {\n  id: 101,\n  role: "member",\n  active: true\n};');
  const [text2, setText2] = useState('const user = {\n  id: 101,\n  role: "admin",\n  active: true,\n  verified: true\n};');

  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const maxLines = Math.max(lines1.length, lines2.length);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Text & Code Diff Checker</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Original Text</label>
          <textarea
            rows={8}
            value={text1}
            onChange={e => setText1(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Modified Text</label>
          <textarea
            rows={8}
            value={text2}
            onChange={e => setText2(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Line-by-Line Visual Comparison</h3>
        <div className="space-y-1 font-mono text-xs overflow-x-auto">
          {Array.from({ length: maxLines }).map((_, i) => {
            const l1 = lines1[i] ?? '';
            const l2 = lines2[i] ?? '';
            const isDiff = l1 !== l2;

            return (
              <div key={i} className={`flex items-start gap-2 p-1.5 rounded-lg ${isDiff ? 'bg-amber-500/10' : ''}`}>
                <span className="w-8 text-right text-zinc-400 select-none text-[10px] pt-0.5">{i + 1}</span>
                <div className="grid grid-cols-2 flex-1 gap-4">
                  <div className={`p-1 rounded ${l1 !== l2 && l1 ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300' : 'text-zinc-700 dark:text-zinc-300'}`}>
                    {l1 || <span className="opacity-20">·</span>}
                  </div>
                  <div className={`p-1 rounded ${l1 !== l2 && l2 ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' : 'text-zinc-700 dark:text-zinc-300'}`}>
                    {l2 || <span className="opacity-20">·</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 4. Interactive Regex Tester
const RegexTesterView: React.FC = () => {
  const [pattern, setPattern] = useState('[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}');
  const [flags, setFlags] = useState('gi');
  const [testString, setTestString] = useState('Contact our team at hello@example.com or support@company.org for assistance.');

  let matches: RegExpMatchArray[] = [];
  let error = '';

  try {
    const reg = new RegExp(pattern, flags);
    matches = [...testString.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Invalid regex pattern';
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Regular Expression Tester</h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        <div className="col-span-2 sm:col-span-3">
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Regex Pattern</label>
          <div className="flex items-center gap-1 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 bg-white dark:bg-zinc-950 font-mono text-sm">
            <span className="text-zinc-400">/</span>
            <input
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none"
              placeholder="e.g. \b[0-9]+\b"
            />
            <span className="text-zinc-400">/</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={e => setFlags(e.target.value)}
            className="w-full font-mono text-sm border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 bg-white dark:bg-zinc-950"
            placeholder="gi"
          />
        </div>
      </div>

      {error ? (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-mono">
          {error}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Found {matches.length} match{matches.length === 1 ? '' : 'es'}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-zinc-500 mb-1">Test String</label>
        <textarea
          rows={6}
          value={testString}
          onChange={e => setTestString(e.target.value)}
          className="w-full font-mono text-xs p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
          placeholder="Paste or type test string..."
        />
      </div>

      {matches.length > 0 && (
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <h4 className="text-xs font-bold uppercase text-zinc-500 mb-2">Match Results</h4>
          <div className="flex flex-wrap gap-2">
            {matches.map((m, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold"
              >
                {m[0]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 5. HTML Entity Encoder / Decoder
const HtmlEntityView: React.FC = () => {
  const [input, setInput] = useState('<h1>Hello & Welcome to "OmniToolbox" © 2026</h1>');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const encodeHtml = (str: string) =>
    str.replace(/[&<>"'©®™]/g, ch => {
      switch (ch) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        case '©': return '&copy;';
        case '®': return '&reg;';
        case '™': return '&trade;';
        default: return ch;
      }
    });

  const decodeHtml = (str: string) => {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent || '';
  };

  const output = mode === 'encode' ? encodeHtml(input) : decodeHtml(input);

  const copyResult = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">HTML Entity Encoder / Decoder</h2>
      </div>

      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl max-w-xs">
        <button
          onClick={() => { sounds.playClick(); setMode('encode'); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === 'encode' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs' : 'text-zinc-500'
          }`}
        >
          Encode to Entities
        </button>
        <button
          onClick={() => { sounds.playClick(); setMode('decode'); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === 'decode' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs' : 'text-zinc-500'
          }`}
        >
          Decode from Entities
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-500 mb-1">Input Text</label>
        <textarea
          rows={5}
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full font-mono text-xs p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-zinc-500">Result</label>
          <button
            onClick={copyResult}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <textarea
          rows={5}
          readOnly
          value={output}
          className="w-full font-mono text-xs p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
        />
      </div>
    </div>
  );
};

// 6. WCAG Color Contrast Ratio Checker
const ColorContrastView: React.FC = () => {
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');

  const getLuminance = (hex: string) => {
    const rgb = hex.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16) / 255) || [0, 0, 0];
    const a = rgb.map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const l1 = getLuminance(fgColor);
  const l2 = getLuminance(bgColor);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const roundedRatio = ratio.toFixed(2);

  const passesAANormal = ratio >= 4.5;
  const passesAALarge = ratio >= 3.0;
  const passesAAANormal = ratio >= 7.0;
  const passesAAALarge = ratio >= 4.5;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">WCAG Color Contrast Checker</h2>
      </div>

      {/* Live Preview Box */}
      <div
        className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center space-y-2 shadow-xs transition-colors"
        style={{ backgroundColor: bgColor, color: fgColor }}
      >
        <h3 className="text-2xl font-bold tracking-tight">The quick brown fox jumps over the lazy dog</h3>
        <p className="text-sm opacity-90">Design systems and accessible interfaces require readable typography.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <label className="block text-xs font-semibold text-zinc-500 mb-2">Foreground (Text)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={fgColor}
              onChange={e => setFgColor(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              value={fgColor}
              onChange={e => setFgColor(e.target.value)}
              className="w-full font-mono text-sm p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 uppercase"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <label className="block text-xs font-semibold text-zinc-500 mb-2">Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
              className="w-full font-mono text-sm p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 uppercase"
            />
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
        <div className="text-xs uppercase font-bold tracking-wider text-zinc-400 mb-1">Contrast Ratio</div>
        <div className="text-4xl font-extrabold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
          {roundedRatio} : 1
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className={`p-3 rounded-xl border ${passesAANormal ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'}`}>
            <div className="text-xs font-bold">AA Normal</div>
            <div className="text-[11px] font-semibold mt-0.5">{passesAANormal ? 'PASS (≥ 4.5)' : 'FAIL'}</div>
          </div>
          <div className={`p-3 rounded-xl border ${passesAALarge ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'}`}>
            <div className="text-xs font-bold">AA Large Text</div>
            <div className="text-[11px] font-semibold mt-0.5">{passesAALarge ? 'PASS (≥ 3.0)' : 'FAIL'}</div>
          </div>
          <div className={`p-3 rounded-xl border ${passesAAANormal ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'}`}>
            <div className="text-xs font-bold">AAA Normal</div>
            <div className="text-[11px] font-semibold mt-0.5">{passesAAANormal ? 'PASS (≥ 7.0)' : 'FAIL'}</div>
          </div>
          <div className={`p-3 rounded-xl border ${passesAAALarge ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'}`}>
            <div className="text-xs font-bold">AAA Large Text</div>
            <div className="text-[11px] font-semibold mt-0.5">{passesAAALarge ? 'PASS (≥ 4.5)' : 'FAIL'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. CSS Box Shadow Builder
const CssBoxShadowView: React.FC = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [opacity, setOpacity] = useState(15);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const shadowCss = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${(opacity / 100).toFixed(2)})`;
  const rule = `box-shadow: ${shadowCss};`;

  const copyRule = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(rule);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">CSS Box Shadow Generator</h2>
      </div>

      <div className="h-56 rounded-3xl bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-8">
        <div
          className="w-48 h-32 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300 transition-all duration-200"
          style={{ boxShadow: shadowCss }}
        >
          Preview Box
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
        <div>
          <div className="flex justify-between font-semibold text-zinc-500 mb-1">
            <span>X Offset</span>
            <span className="font-mono">{x}px</span>
          </div>
          <input type="range" min={-50} max={50} value={x} onChange={e => setX(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between font-semibold text-zinc-500 mb-1">
            <span>Y Offset</span>
            <span className="font-mono">{y}px</span>
          </div>
          <input type="range" min={-50} max={50} value={y} onChange={e => setY(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between font-semibold text-zinc-500 mb-1">
            <span>Blur Radius</span>
            <span className="font-mono">{blur}px</span>
          </div>
          <input type="range" min={0} max={100} value={blur} onChange={e => setBlur(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between font-semibold text-zinc-500 mb-1">
            <span>Spread Radius</span>
            <span className="font-mono">{spread}px</span>
          </div>
          <input type="range" min={-50} max={50} value={spread} onChange={e => setSpread(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between font-semibold text-zinc-500 mb-1">
            <span>Shadow Opacity</span>
            <span className="font-mono">{opacity}%</span>
          </div>
          <input type="range" min={0} max={100} value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-full" />
        </div>

        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id="insetCheck"
            checked={inset}
            onChange={e => setInset(e.target.checked)}
            className="w-4 h-4 rounded text-zinc-900"
          />
          <label htmlFor="insetCheck" className="font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
            Inset Shadow
          </label>
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 flex items-center justify-between gap-4 font-mono text-xs">
        <code className="text-zinc-800 dark:text-zinc-200 truncate">{rule}</code>
        <button
          onClick={copyRule}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shrink-0 cursor-pointer text-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy CSS'}</span>
        </button>
      </div>
    </div>
  );
};

// 8. Pixel to REM / EM Layout Converter
const PixelToRemView: React.FC = () => {
  const [baseSize, setBaseSize] = useState(16);
  const [pxValue, setPxValue] = useState(24);

  const remValue = baseSize > 0 ? (pxValue / baseSize).toFixed(4).replace(/\.?0+$/, '') : '0';
  const emValue = remValue;
  const ptValue = (pxValue * 0.75).toFixed(2).replace(/\.?0+$/, '');

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Pixel to REM & EM Scaler</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Base Font Size (px)</label>
          <input
            type="number"
            value={baseSize}
            onChange={e => setBaseSize(parseFloat(e.target.value) || 16)}
            className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-mono text-base font-bold"
          />
          <span className="text-[10px] text-zinc-400 mt-1 block">Default browser standard is 16px</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Target Pixel Size (px)</label>
          <input
            type="number"
            value={pxValue}
            onChange={e => setPxValue(parseFloat(e.target.value) || 0)}
            className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-mono text-base font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label="REM Value" value={`${remValue}rem`} highlight />
        <ResultCard label="EM Value" value={`${emValue}em`} />
        <ResultCard label="Points (PT)" value={`${ptValue}pt`} />
      </div>
    </div>
  );
};

// 9. Markdown to HTML Renderer
const MarkdownToHtmlView: React.FC = () => {
  const [md, setMd] = useState('# Hello World\n\nThis is a **Markdown to HTML** live renderer.\n\n- Zero latency\n- Clean HTML markup\n- Copy-ready code');
  const [copied, setCopied] = useState(false);

  const convertMdToHtml = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/\n$/gim, '<br />');
  };

  const html = convertMdToHtml(md);

  const copyHtml = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Markdown to HTML Renderer</h2>
        <button
          onClick={copyHtml}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold cursor-pointer active:scale-95"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied HTML' : 'Copy HTML'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Markdown Input</label>
          <textarea
            rows={10}
            value={md}
            onChange={e => setMd(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Live Rendered Preview</label>
          <div
            className="w-full h-[216px] p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs overflow-y-auto prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
};

// 10. CSV to JSON Formatter
const CsvToJsonView: React.FC = () => {
  const [csv, setCsv] = useState('id,name,role,department\n101,Alex Vance,Engineer,Tech\n102,Sam Fisher,Designer,Creative\n103,Elena Fisher,Manager,Ops');
  const [copied, setCopied] = useState(false);

  const convertCsvToJson = (csvStr: string) => {
    const lines = csvStr.trim().split('\n');
    if (lines.length < 2) return '[]';
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',').map(c => c.trim());
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = currentLine[index] ?? '';
      });
      result.push(obj);
    }
    return JSON.stringify(result, null, 2);
  };

  const jsonResult = convertCsvToJson(csv);

  const copyJson = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(jsonResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">CSV to JSON Data Parser</h2>
        <button
          onClick={copyJson}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold cursor-pointer active:scale-95"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">CSV (Comma-Separated)</label>
          <textarea
            rows={10}
            value={csv}
            onChange={e => setCsv(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">JSON Output</label>
          <textarea
            rows={10}
            readOnly
            value={jsonResult}
            className="w-full font-mono text-xs p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
          />
        </div>
      </div>
    </div>
  );
};
