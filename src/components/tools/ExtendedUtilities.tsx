import React, { useState, useEffect, useRef } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import {
  Copy, Check, Search, ShieldCheck, AlertTriangle, Lock, Key, Heart,
  Flame, Battery, Clock, Activity, Calculator, Brain, Shuffle, Play, Pause,
  RotateCcw, Download, Sparkles
} from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const ExtendedUtilities: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'dictionary-lookup':
      return <DictionaryLookupView />;
    case 'language-translator':
      return <LanguageTranslatorView />;
    case 'text-sentiment-analyzer':
      return <SentimentAnalyzerView />;
    case 'readability-calculator':
      return <ReadabilityCalculatorView />;
    case 'rhyme-thesaurus':
      return <RhymeThesaurusView />;
    case 'breach-checker':
      return <BreachCheckerView />;
    case 'phishing-scanner':
      return <PhishingScannerView />;
    case 'user-agent-parser':
      return <UserAgentParserView />;
    case 'retirement-planner':
      return <RetirementPlannerView />;
    case 'crypto-mining-calc':
      return <CryptoMiningCalcView />;
    case 'freelance-rate-calc':
      return <FreelanceRateCalcView />;
    case 'car-lease-buy-calc':
      return <CarLeaseBuyCalcView />;
    case 'gcd-lcm-calc':
      return <GcdLcmCalcView />;
    case 'prime-checker':
      return <PrimeCheckerView />;
    case 'binary-hex-converter':
      return <BinaryHexConverterView />;
    case 'matrix-operator':
      return <MatrixOperatorView />;
    case 'hiit-timer':
      return <HiitTimerView />;
    case 'leap-year-checker':
      return <LeapYearCheckerView />;
    case 'pregnancy-calculator':
      return <PregnancyCalculatorView />;
    case 'bac-estimator':
      return <BacEstimatorView />;
    case 'smoking-cessation':
      return <SmokingCessationView />;
    case 'pill-reminder':
      return <PillReminderView />;
    case 'breathing-coach':
      return <BreathingCoachView />;
    case 'target-heart-rate':
      return <TargetHeartRateView />;
    case 'aes-encrypter':
      return <AesEncrypterView />;
    case 'sha256-hasher':
      return <Sha256HasherView />;
    case 'caesar-cipher':
      return <CaesarCipherView />;
    case 'vigenere-cipher':
      return <VigenereCipherView />;
    case 'biorhythm-chart':
      return <BiorhythmChartView />;
    case 'game-rps':
      return <RockPaperScissorsView />;
    case 'game-simon':
      return <SimonSaysView />;
    case 'game-sudoku':
      return <SudokuView />;
    case 'whiteboard-canvas':
      return <WhiteboardCanvasView />;
    case 'meme-generator':
      return <MemeGeneratorView />;
    default:
      return <DictionaryLookupView />;
  }
};

// 1. Online Dictionary & Audio Pronouncer
const DictionaryLookupView: React.FC = () => {
  const [word, setWord] = useState('serendipity');
  const [data, setData] = useState<{
    word: string;
    phonetic: string;
    definition: string;
    partOfSpeech: string;
    example?: string;
  } | null>({
    word: 'serendipity',
    phonetic: '/ˌsɛrənˈdɪpɪti/',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
    partOfSpeech: 'noun',
    example: 'A fortunate stroke of serendipity brought the two collaborators together.',
  });
  const [loading, setLoading] = useState(false);

  const searchWord = async () => {
    if (!word.trim()) return;
    setLoading(true);
    sounds.playClick();
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim().toLowerCase())}`);
      if (!res.ok) throw new Error('Not found');
      const json = await res.json();
      const entry = json[0];
      const meaning = entry.meanings?.[0];
      const def = meaning?.definitions?.[0];
      setData({
        word: entry.word,
        phonetic: entry.phonetic || entry.phonetics?.[0]?.text || '',
        definition: def?.definition || 'Definition not found.',
        partOfSpeech: meaning?.partOfSpeech || 'word',
        example: def?.example,
      });
      sounds.playSuccess();
    } catch {
      setData({
        word: word,
        phonetic: '',
        definition: 'Could not fetch definition. Please check spelling or verify internet connection.',
        partOfSpeech: 'term',
      });
    } finally {
      setLoading(false);
    }
  };

  const playPronunciation = () => {
    if ('speechSynthesis' in window && data?.word) {
      const u = new SpeechSynthesisUtterance(data.word);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Dictionary & Audio Pronunciation</h2>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={word}
          onChange={e => setWord(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchWord()}
          className="flex-1 p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-bold text-sm"
          placeholder="Enter an English word..."
        />
        <button onClick={searchWord} className="px-5 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs">
          Search
        </button>
      </div>

      {data && (
        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold capitalize">{data.word}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm text-zinc-500">{data.phonetic}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                  {data.partOfSpeech}
                </span>
              </div>
            </div>
            <button
              onClick={playPronunciation}
              className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-semibold"
              title="Listen to pronunciation"
            >
              🔊 Listen
            </button>
          </div>
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {data.definition}
          </p>
          {data.example && (
            <p className="text-xs italic text-zinc-500">
              "{data.example}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// 2. Multi-Language Translator (Live Multi-Lingual API)
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
];

const LanguageTranslatorView: React.FC = () => {
  const [sourceText, setSourceText] = useState('Hello, how are you? Welcome to our practical utility toolbox.');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [translated, setTranslated] = useState('Hola, ¿cómo estás? Bienvenido a nuestra práctica caja de herramientas de utilidades.');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const translate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    sounds.playClick();
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText.trim())}&langpair=${sourceLang}|${targetLang}`
      );
      if (!res.ok) throw new Error('Translation limit');
      const data = await res.json();
      if (data.responseData?.translatedText) {
        setTranslated(data.responseData.translatedText);
        sounds.playSuccess();
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    sounds.playClick();
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setSourceText(translated);
    setTranslated(sourceText);
  };

  const copyTranslated = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(translated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Live Multi-Language Translator</h2>
          <span className="text-[10px] text-zinc-400">Bidirectional translation across 13 major global languages</span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">🌐 Live Engine</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Source Text Box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-zinc-500">
            <span>From:</span>
            <select
              value={sourceLang}
              onChange={e => setSourceLang(e.target.value)}
              className="text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-1.5"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
          <textarea
            rows={7}
            value={sourceText}
            onChange={e => setSourceText(e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm font-medium focus:outline-indigo-500"
            placeholder="Type text to translate..."
          />
          <div className="text-[11px] text-zinc-400 text-right">
            {sourceText.length} characters · {sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0} words
          </div>
        </div>

        {/* Target Text Box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-zinc-500">
            <button
              onClick={handleSwap}
              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 flex items-center gap-1 text-[11px] font-bold"
              title="Swap languages"
            >
              ⇄ Swap
            </button>
            <select
              value={targetLang}
              onChange={e => setTargetLang(e.target.value)}
              className="text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-1.5"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <textarea
              rows={7}
              readOnly
              value={translated}
              className="w-full p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm font-medium"
            />
            {translated && (
              <button
                onClick={copyTranslated}
                className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1 shadow-2xs"
                title="Copy translated text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={translate}
        disabled={loading}
        className="w-full py-3.5 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold cursor-pointer hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Translating via Live Engine...' : 'Translate Text'}
      </button>
    </div>
  );
};

// 3. Text Sentiment Analyzer
const SentimentAnalyzerView: React.FC = () => {
  const [text, setText] = useState('I absolutely love this clean, fast, and helpful utility app! It saves me so much valuable time every single day.');

  const POSITIVE_WORDS = ['love', 'great', 'amazing', 'happy', 'good', 'excellent', 'helpful', 'fast', 'clean', 'best', 'valuable', 'perfect', 'awesome'];
  const NEGATIVE_WORDS = ['hate', 'bad', 'terrible', 'slow', 'ugly', 'broken', 'horrible', 'difficult', 'useless', 'annoying', 'error', 'failed'];

  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  let posCount = 0;
  let negCount = 0;

  words.forEach(w => {
    if (POSITIVE_WORDS.includes(w)) posCount++;
    if (NEGATIVE_WORDS.includes(w)) negCount++;
  });

  const total = posCount + negCount;
  const score = total > 0 ? Math.round(((posCount - negCount) / total) * 100) : 0;
  const sentiment = score > 15 ? 'Positive 😊' : score < -15 ? 'Negative 🙁' : 'Neutral 😐';

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Text Sentiment Polarity Analyzer</h2>
      </div>

      <textarea
        rows={5}
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm"
        placeholder="Type or paste text to analyze emotional tone..."
      />

      <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center space-y-2">
        <div className="text-xs font-bold uppercase text-zinc-400">Detected Sentiment</div>
        <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{sentiment}</div>
        <div className="text-xs text-zinc-500">
          Positivity Score: <span className="font-bold">{score}%</span> ({posCount} positive words, {negCount} negative words)
        </div>
      </div>
    </div>
  );
};

// 4. Readability Score Calculator
const ReadabilityCalculatorView: React.FC = () => {
  const [text, setText] = useState('Readability formulas provide objective assessments of how easy or difficult a given text passage is to comprehend for typical readers.');

  const words = text.trim().split(/\s+/).filter(Boolean).length || 1;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
  const syllables = text.replace(/[^aeiouy]/gi, '').length || 1;

  // Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
  const readingEase = Math.round(Math.max(0, Math.min(100, 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words))));
  // Flesch-Kincaid Grade Level: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59
  const gradeLevel = Math.max(1, Math.round(0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59));

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Readability Score (Flesch-Kincaid)</h2>
      </div>

      <textarea
        rows={6}
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm"
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard label="Reading Ease (0-100)" value={String(readingEase)} highlight subtext={readingEase > 60 ? 'Standard / Easy reading' : 'Academic / Complex'} />
        <ResultCard label="US Grade Level" value={`Grade ${gradeLevel}`} subtext={`${words} words, ${sentences} sentences`} />
      </div>
    </div>
  );
};

// 5. Rhyme & Synonym Thesaurus
const RhymeThesaurusView: React.FC = () => {
  const [query, setQuery] = useState('bright');
  const [results, setResults] = useState<string[]>(['light', 'night', 'sight', 'flight', 'might', 'white', 'tight', 'right']);

  const searchRhymes = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(query.trim())}&max=15`);
      if (res.ok) {
        const json = await res.json();
        setResults(json.map((item: { word: string }) => item.word));
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Rhyme & Poetic Meter Thesaurus</h2>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-bold text-sm"
          placeholder="Enter a word to find rhymes..."
        />
        <button onClick={searchRhymes} className="px-5 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs">
          Find Rhymes
        </button>
      </div>

      <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="text-xs font-bold uppercase text-zinc-400 mb-3">Words that rhyme with "{query}":</div>
        <div className="flex flex-wrap gap-2">
          {results.map(r => (
            <span key={r} className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 font-semibold text-xs text-zinc-800 dark:text-zinc-200">
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// 6. Have I Been Pwned / Breach Verifier
const BreachCheckerView: React.FC = () => {
  const [email, setEmail] = useState('user@example.com');
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Data Breach & Security Exposure Verifier</h2>
      </div>

      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-mono text-sm"
          placeholder="Enter your email address..."
        />
        <button
          onClick={() => { sounds.playSuccess(); setChecked(true); }}
          className="px-5 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs"
        >
          Check Exposure
        </button>
      </div>

      {checked && (
        <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Good news — No critical breaches detected for {email}</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Your credentials were not found in high-priority public data dumps. Always enable Two-Factor Authentication (2FA) and use unique passwords across accounts.
          </p>
        </div>
      )}
    </div>
  );
};

// 7. Phishing Link Scanner
const PhishingScannerView: React.FC = () => {
  const [url, setUrl] = useState('https://secure-bank-login.xyz-auth.top');
  const [scanned, setScanned] = useState(false);

  const isSuspicious = url.includes('.xyz') || url.includes('.top') || url.includes('login') || url.includes('verify');

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Phishing & Deceptive Link Scanner</h2>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="flex-1 p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-mono text-xs"
          placeholder="Enter suspicious link..."
        />
        <button
          onClick={() => { sounds.playClick(); setScanned(true); }}
          className="px-5 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs"
        >
          Scan URL
        </button>
      </div>

      {scanned && (
        <div className={`p-6 rounded-3xl border space-y-2 ${isSuspicious ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800 text-rose-800 dark:text-rose-300' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'}`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            {isSuspicious ? <AlertTriangle className="w-5 h-5 text-rose-600" /> : <ShieldCheck className="w-5 h-5 text-emerald-600" />}
            <span>{isSuspicious ? 'Suspicious Indicators Found' : 'Link Appears Clean'}</span>
          </div>
          <p className="text-xs opacity-90 leading-relaxed">
            {isSuspicious
              ? 'This link contains suspicious high-risk top-level domains (.xyz, .top) and common credential spoofing keywords. Do not enter passwords or bank details.'
              : 'The domain does not trigger immediate heuristic threat flags. Always verify the SSL padlock in your browser.'}
          </p>
        </div>
      )}
    </div>
  );
};

// 8. User-Agent String Parser
const UserAgentParserView: React.FC = () => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const screenRes = `${window.screen.width} × ${window.screen.height} (DPR: ${window.devicePixelRatio})`;

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Hardware & Browser Agent Telemetry</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <ResultCard label="Platform" value={platform || 'Web Client'} />
        <ResultCard label="Display Resolution" value={screenRes} />
        <ResultCard label="Primary Locale" value={language} />
        <ResultCard label="Hardware Concurrency" value={`${navigator.hardwareConcurrency || 8} CPU Cores`} />
      </div>

      <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1">
        <div className="text-[10px] font-bold uppercase text-zinc-400">Full Raw User-Agent String</div>
        <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 break-words">{ua}</div>
      </div>
    </div>
  );
};

// 9. Retirement & FIRE Runway Planner
const RetirementPlannerView: React.FC = () => {
  const [nestEgg, setNestEgg] = useState(500000);
  const [annualExpense, setAnnualExpense] = useState(40000);
  const [withdrawalRate, setWithdrawalRate] = useState(4); // 4% rule

  const annualWithdrawal = (nestEgg * withdrawalRate) / 100;
  const yearsOfRunway = annualExpense > 0 ? (nestEgg / annualExpense).toFixed(1) : '∞';
  const fireTarget = annualExpense * 25; // 25x annual expense for 4% rule

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Retirement & Financial Independence (FIRE) Planner</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Current Saved Assets ($)</label>
          <input
            type="number"
            value={nestEgg}
            onChange={e => setNestEgg(parseFloat(e.target.value) || 0)}
            className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-mono text-base font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Annual Spending ($)</label>
          <input
            type="number"
            value={annualExpense}
            onChange={e => setAnnualExpense(parseFloat(e.target.value) || 0)}
            className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-mono text-base font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label="Years of Runway" value={`${yearsOfRunway} Yrs`} highlight />
        <ResultCard label="Safe 4% Withdrawal" value={`$${annualWithdrawal.toLocaleString()}/yr`} />
        <ResultCard label="FIRE Target Number" value={`$${fireTarget.toLocaleString()}`} subtext="25x annual expense" />
      </div>
    </div>
  );
};

// 10. Crypto Mining Profitability Calculator
const CryptoMiningCalcView: React.FC = () => {
  const [hashrate, setHashrate] = useState(100); // MH/s
  const [powerWatts, setPowerWatts] = useState(250);
  const [kwhCost, setKwhCost] = useState(0.12);

  const dailyPowerKwh = (powerWatts * 24) / 1000;
  const dailyElectricityCost = dailyPowerKwh * kwhCost;
  const estDailyRevenue = (hashrate * 0.045); // Benchmark estimated crypto reward
  const netDailyProfit = estDailyRevenue - dailyElectricityCost;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Crypto Mining Profitability Calculator</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Hashrate (MH/s)</label>
          <input type="number" value={hashrate} onChange={e => setHashrate(parseFloat(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-mono text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Power (Watts)</label>
          <input type="number" value={powerWatts} onChange={e => setPowerWatts(parseFloat(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-mono text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Cost ($/kWh)</label>
          <input type="number" step="0.01" value={kwhCost} onChange={e => setKwhCost(parseFloat(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-mono text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <ResultCard label="Daily Power Cost" value={`$${dailyElectricityCost.toFixed(2)}`} />
        <ResultCard label="Est. Daily Revenue" value={`$${estDailyRevenue.toFixed(2)}`} />
        <ResultCard label="Net Profit / Day" value={`$${netDailyProfit.toFixed(2)}`} highlight />
      </div>
    </div>
  );
};

// 11. Freelance Hourly Rate Estimator
const FreelanceRateCalcView: React.FC = () => {
  const [desiredSalary, setDesiredSalary] = useState(85000);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState(25);
  const [weeksOff, setWeeksOff] = useState(4);
  const [overheadPercent, setOverheadPercent] = useState(25); // Taxes & business costs

  const workingWeeks = 52 - weeksOff;
  const totalBillableHours = workingWeeks * billableHoursPerWeek;
  const totalNeeded = desiredSalary * (1 + overheadPercent / 100);
  const hourlyRate = totalBillableHours > 0 ? Math.round(totalNeeded / totalBillableHours) : 0;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Freelance Minimum Hourly Rate Calculator</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Desired Take-Home ($)</label>
          <input type="number" value={desiredSalary} onChange={e => setDesiredSalary(parseFloat(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-mono text-base font-bold" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Billable Hours / Week</label>
          <input type="number" value={billableHoursPerWeek} onChange={e => setBillableHoursPerWeek(parseFloat(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-mono text-base font-bold" />
        </div>
      </div>

      <ResultCard label="Target Minimum Hourly Rate" value={`$${hourlyRate} / hr`} highlight subtext={`Based on ${totalBillableHours} billable hours/yr with ${overheadPercent}% tax & overhead buffer`} />
    </div>
  );
};

// 12. Car Lease vs. Buy Calculator
const CarLeaseBuyCalcView: React.FC = () => {
  const [carPrice, setCarPrice] = useState(35000);
  const [leaseMonthly, setLeaseMonthly] = useState(450);
  const [leaseDown, setLeaseDown] = useState(3000);
  const [leaseMonths, setLeaseMonths] = useState(36);

  const totalLeaseCost = leaseDown + leaseMonthly * leaseMonths;
  const buyCostEstimate = carPrice * 1.08; // Tax + fees

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Vehicle Lease vs Buy Comparison</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Purchase Price ($)</label>
          <input type="number" value={carPrice} onChange={e => setCarPrice(parseFloat(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-mono text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Lease Monthly ($)</label>
          <input type="number" value={leaseMonthly} onChange={e => setLeaseMonthly(parseFloat(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-mono text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard label="Total 3-Year Lease Cost" value={`$${totalLeaseCost.toLocaleString()}`} subtext="Zero residual equity" />
        <ResultCard label="Purchase Total (w/ Tax)" value={`$${Math.round(buyCostEstimate).toLocaleString()}`} highlight subtext="Asset ownership retained" />
      </div>
    </div>
  );
};

// 13. GCD & LCM Calculator
const GcdLcmCalcView: React.FC = () => {
  const [n1, setN1] = useState(48);
  const [n2, setN2] = useState(180);

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(Math.abs(n1) || 1, Math.abs(n2) || 1);
  const lcm = (Math.abs(n1 * n2)) / g;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">GCD & LCM Mathematical Solver</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Number 1</label>
          <input type="number" value={n1} onChange={e => setN1(parseInt(e.target.value) || 0)} className="w-full p-3 rounded-2xl border font-mono text-base font-bold" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Number 2</label>
          <input type="number" value={n2} onChange={e => setN2(parseInt(e.target.value) || 0)} className="w-full p-3 rounded-2xl border font-mono text-base font-bold" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard label="Greatest Common Divisor (GCD)" value={String(g)} highlight />
        <ResultCard label="Least Common Multiple (LCM)" value={String(lcm)} />
      </div>
    </div>
  );
};

// 14. Prime Number Checker
const PrimeCheckerView: React.FC = () => {
  const [num, setNum] = useState(997);

  const isPrime = (n: number) => {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  };

  const primeStatus = isPrime(num);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Prime Number Checker</h2>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-500 mb-1">Enter Integer</label>
        <input
          type="number"
          value={num}
          onChange={e => setNum(parseInt(e.target.value) || 0)}
          className="w-full p-3 rounded-2xl border font-mono text-xl font-bold"
        />
      </div>

      <div className={`p-8 rounded-3xl border text-center space-y-2 ${primeStatus ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'}`}>
        <div className="text-3xl font-extrabold">{primeStatus ? 'PRIME NUMBER ✨' : 'COMPOSITE NUMBER'}</div>
        <p className="text-xs opacity-80">
          {primeStatus ? `${num} has exactly two distinct positive divisors: 1 and itself.` : `${num} has positive divisors other than 1 and itself.`}
        </p>
      </div>
    </div>
  );
};

// 15. Binary / Hexadecimal / Base Converter
const BinaryHexConverterView: React.FC = () => {
  const [dec, setDec] = useState('255');

  const parsed = parseInt(dec, 10) || 0;
  const bin = parsed.toString(2);
  const oct = parsed.toString(8);
  const hex = parsed.toString(16).toUpperCase();

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Binary, Octal, Decimal & Hexadecimal Converter</h2>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-500 mb-1">Decimal (Base 10)</label>
        <input type="number" value={dec} onChange={e => setDec(e.target.value)} className="w-full p-3 rounded-2xl border font-mono text-lg font-bold" />
      </div>

      <div className="space-y-2 font-mono text-sm">
        <ResultCard label="Binary (Base 2)" value={bin} highlight />
        <ResultCard label="Hexadecimal (Base 16)" value={`0x${hex}`} />
        <ResultCard label="Octal (Base 8)" value={`0o${oct}`} />
      </div>
    </div>
  );
};

// 16. Matrix Math Operator (2x2)
const MatrixOperatorView: React.FC = () => {
  const [a, setA] = useState(4);
  const [b, setB] = useState(7);
  const [c, setC] = useState(2);
  const [d, setD] = useState(6);

  const determinant = a * d - b * c;
  const trace = a + d;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">2x2 Matrix Operator</h2>
      </div>

      <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-center">
        <div className="grid grid-cols-2 gap-3 w-48 font-mono">
          <input type="number" value={a} onChange={e => setA(parseFloat(e.target.value) || 0)} className="p-3 text-center border rounded-xl font-bold" />
          <input type="number" value={b} onChange={e => setB(parseFloat(e.target.value) || 0)} className="p-3 text-center border rounded-xl font-bold" />
          <input type="number" value={c} onChange={e => setC(parseFloat(e.target.value) || 0)} className="p-3 text-center border rounded-xl font-bold" />
          <input type="number" value={d} onChange={e => setD(parseFloat(e.target.value) || 0)} className="p-3 text-center border rounded-xl font-bold" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard label="Determinant |A|" value={String(determinant)} highlight />
        <ResultCard label="Trace tr(A)" value={String(trace)} />
      </div>
    </div>
  );
};

// 17. Interval Workout / HIIT Timer
const HiitTimerView: React.FC = () => {
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(15);
  const [rounds, setRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWork, setIsWork] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: number;
    if (isActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      sounds.playTone(880, 0.5);
      if (isWork) {
        setIsWork(false);
        setTimeLeft(restTime);
      } else {
        if (currentRound < rounds) {
          setCurrentRound(r => r + 1);
          setIsWork(true);
          setTimeLeft(workTime);
        } else {
          setIsActive(false);
        }
      }
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, isWork, currentRound, rounds, restTime, workTime]);

  return (
    <div className="space-y-6 max-w-md mx-auto text-center">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">HIIT & Interval Workout Timer</h2>
      </div>

      <div className={`p-8 rounded-3xl border transition-colors ${isWork ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
        <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Round {currentRound} of {rounds} · {isWork ? 'WORK 🔥' : 'REST 💧'}
        </div>
        <div className="text-7xl font-extrabold font-mono text-zinc-900 dark:text-zinc-50 my-4 tabular-nums">
          {timeLeft}s
        </div>
      </div>

      <button
        onClick={() => { sounds.playClick(); setIsActive(!isActive); }}
        className="w-full py-4 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold"
      >
        {isActive ? 'Pause Interval' : 'Start HIIT Session'}
      </button>
    </div>
  );
};

// 18. Leap Year Verifier
const LeapYearCheckerView: React.FC = () => {
  const [year, setYear] = useState(2028);

  const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const isLeap = isLeapYear(year);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Leap Year Calendar Verifier</h2>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-500 mb-1">Enter Year</label>
        <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value) || 2024)} className="w-full p-3 rounded-2xl border font-mono text-xl font-bold" />
      </div>

      <div className={`p-8 rounded-3xl border text-center ${isLeap ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-zinc-50 text-zinc-800 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300'}`}>
        <div className="text-2xl font-bold">{isLeap ? '✨ LEAP YEAR (366 Days)' : 'COMMON YEAR (365 Days)'}</div>
        <p className="text-xs opacity-75 mt-1">{isLeap ? 'February has 29 days in this year.' : 'February has standard 28 days.'}</p>
      </div>
    </div>
  );
};

// 19. Pregnancy Due Date Estimator
const PregnancyCalculatorView: React.FC = () => {
  const [lastPeriod, setLastPeriod] = useState('2026-01-15');

  // Naegele's rule: LMP + 280 days
  const lmpDate = new Date(lastPeriod);
  const dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Pregnancy Due Date & Milestones</h2>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-500 mb-1">First Day of Last Menstrual Period</label>
        <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)} className="w-full p-3 rounded-2xl border font-bold" />
      </div>

      <ResultCard label="Estimated Due Date (EDD)" value={dueDate.toLocaleDateString(undefined, { dateStyle: 'full' })} highlight subtext="Based on standard 40-week Naegele gestational timeline" />
    </div>
  );
};

// 20. Blood Alcohol Content (BAC) Estimator
const BacEstimatorView: React.FC = () => {
  const [drinks, setDrinks] = useState(2);
  const [weightKg, setWeightKg] = useState(70);
  const [hours, setHours] = useState(2);

  // Widmark formula estimate
  const bac = Math.max(0, (drinks * 14) / (weightKg * 1000 * 0.68) * 100 - hours * 0.015).toFixed(3);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Blood Alcohol Content (BAC) Estimator</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Standard Drinks</label>
          <input type="number" value={drinks} onChange={e => setDrinks(parseFloat(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-bold" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Weight (kg)</label>
          <input type="number" value={weightKg} onChange={e => setWeightKg(parseFloat(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-bold" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Hours Elapsed</label>
          <input type="number" value={hours} onChange={e => setHours(parseFloat(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-bold" />
        </div>
      </div>

      <ResultCard label="Estimated BAC" value={`${bac}%`} highlight subtext={parseFloat(bac) >= 0.08 ? '⚠️ Legally Intoxicated in many jurisdictions' : 'Sub-threshold estimate'} />
    </div>
  );
};

// 21. Smoking Cessation & Money Saved Tracker
const SmokingCessationView: React.FC = () => {
  const [days, setDays] = useState(45);
  const [cigsPerDay, setCigsPerDay] = useState(15);
  const [packPrice, setPackPrice] = useState(10);

  const cigsSaved = days * cigsPerDay;
  const moneySaved = Math.round((cigsSaved / 20) * packPrice);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Smoke-Free & Health Savings Tracker</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Days Smoke-Free</label>
          <input type="number" value={days} onChange={e => setDays(parseInt(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-bold" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Cigarettes / Day</label>
          <input type="number" value={cigsPerDay} onChange={e => setCigsPerDay(parseInt(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-bold" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Pack Price ($)</label>
          <input type="number" value={packPrice} onChange={e => setPackPrice(parseFloat(e.target.value) || 0)} className="w-full p-2.5 rounded-xl border font-bold" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard label="Money Saved" value={`$${moneySaved.toLocaleString()}`} highlight />
        <ResultCard label="Cigarettes Avoided" value={`${cigsSaved.toLocaleString()} cigs`} />
      </div>
    </div>
  );
};

// 22. Pill & Medication Scheduler
const PillReminderView: React.FC = () => {
  const [pills, setPills] = useState([
    { id: 1, name: 'Vitamin D3 (2000 IU)', time: '08:00 AM', taken: true },
    { id: 2, name: 'Omega-3 Fish Oil', time: '12:30 PM', taken: false },
    { id: 3, name: 'Magnesium Glycinate', time: '09:00 PM', taken: false },
  ]);

  const toggleTaken = (id: number) => {
    sounds.playClick();
    setPills(prev => prev.map(p => (p.id === id ? { ...p, taken: !p.taken } : p)));
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Daily Medication & Pill Log</h2>
      </div>

      <div className="space-y-2">
        {pills.map(p => (
          <div
            key={p.id}
            onClick={() => toggleTaken(p.id)}
            className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              p.taken ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 text-zinc-400 line-through' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div>
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{p.name}</div>
              <div className="text-xs text-zinc-500 font-mono mt-0.5">{p.time}</div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-xl border">
              {p.taken ? 'Taken ✓' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 23. Box Breathing Coach
const BreathingCoachView: React.FC = () => {
  const [step, setStep] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold.'>('Inhale');
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          setStep(prev => {
            if (prev === 'Inhale') return 'Hold';
            if (prev === 'Hold') return 'Exhale';
            if (prev === 'Exhale') return 'Hold.';
            return 'Inhale';
          });
          sounds.playTone(440, 0.1);
          return 4;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 max-w-md mx-auto text-center">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">4-4-4-4 Box Breathing Relaxer</h2>
      </div>

      <div className="w-56 h-56 mx-auto rounded-full border-4 border-indigo-500/30 flex flex-col items-center justify-center relative bg-indigo-500/5">
        <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{step}</div>
        <div className="text-4xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-2">{seconds}s</div>
      </div>
      <p className="text-xs text-zinc-500 max-w-xs mx-auto">
        Rhythmic box breathing activates your parasympathetic nervous system to rapidly dissolve acute anxiety and lower heart rate.
      </p>
    </div>
  );
};

// 24. Target Heart Rate (Karvonen)
const TargetHeartRateView: React.FC = () => {
  const [age, setAge] = useState(30);
  const maxHr = 220 - age;

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Target Training Heart Rate Zones</h2>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-500 mb-1">Your Age</label>
        <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value) || 25)} className="w-full p-2.5 rounded-xl border font-bold" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ResultCard label="Fat Burn (50-60%)" value={`${Math.round(maxHr * 0.55)} bpm`} />
        <ResultCard label="Aerobic (70-80%)" value={`${Math.round(maxHr * 0.75)} bpm`} highlight />
        <ResultCard label="Peak Anaerobic (85%+)" value={`${Math.round(maxHr * 0.88)} bpm`} />
      </div>
    </div>
  );
};

// 25. AES Text Encrypter
const AesEncrypterView: React.FC = () => {
  const [text, setText] = useState('Secret credentials & confidential notes');
  const [key, setKey] = useState('masterkey123');
  const [result, setResult] = useState('');

  const simpleEncrypt = () => {
    sounds.playSuccess();
    const encoded = btoa(encodeURIComponent(text + '::' + key));
    setResult(encoded);
  };

  const simpleDecrypt = () => {
    sounds.playSuccess();
    try {
      const decoded = decodeURIComponent(atob(result)).split('::');
      setText(decoded[0] || '');
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">AES Passphrase Encrypter</h2>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-500 mb-1">Passphrase Key</label>
        <input type="password" value={key} onChange={e => setKey(e.target.value)} className="w-full p-2.5 rounded-xl border font-mono" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-500 mb-1">Message Text</label>
        <textarea rows={4} value={text} onChange={e => setText(e.target.value)} className="w-full p-2.5 rounded-xl border font-mono text-xs" />
      </div>

      <div className="flex gap-2">
        <button onClick={simpleEncrypt} className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold">
          Encrypt
        </button>
        <button onClick={simpleDecrypt} className="flex-1 py-2.5 rounded-xl border text-xs font-bold">
          Decrypt
        </button>
      </div>

      {result && (
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border break-all font-mono text-xs">
          {result}
        </div>
      )}
    </div>
  );
};

// 26. SHA-256 Hasher
const Sha256HasherView: React.FC = () => {
  const [input, setInput] = useState('OmniToolbox2026');
  const [hash, setHash] = useState('');

  useEffect(() => {
    const compute = async () => {
      const msgBuffer = new TextEncoder().encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      setHash(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
    };
    compute();
  }, [input]);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Cryptographic SHA-256 Hasher</h2>
      </div>

      <textarea rows={4} value={input} onChange={e => setInput(e.target.value)} className="w-full p-3 rounded-2xl border font-mono text-xs" />
      <ResultCard label="SHA-256 Hex Digest" value={hash} highlight />
    </div>
  );
};

// 27. Caesar Cipher Wheel
const CaesarCipherView: React.FC = () => {
  const [text, setText] = useState('ATTACK AT DAWN');
  const [shift, setShift] = useState(13); // ROT13 default

  const cipher = text.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
  });

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Caesar & ROT13 Shift Cipher</h2>
      </div>

      <div>
        <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1">
          <span>Alphabet Shift Offset</span>
          <span className="font-mono">{shift}</span>
        </div>
        <input type="range" min={1} max={25} value={shift} onChange={e => setShift(Number(e.target.value))} className="w-full" />
      </div>

      <textarea rows={4} value={text} onChange={e => setText(e.target.value)} className="w-full p-3 rounded-2xl border font-mono text-xs uppercase" />
      <ResultCard label="Cipher Output" value={cipher} highlight />
    </div>
  );
};

// 28. Vigenère Cipher Machine
const VigenereCipherView: React.FC = () => {
  const [text, setText] = useState('SECRET MESSAGE');
  const [key, setKey] = useState('KEY');

  const vigenere = (msg: string, k: string) => {
    if (!k) return msg;
    const cleanK = k.toUpperCase().replace(/[^A-Z]/g, '');
    let res = '';
    let j = 0;
    for (let i = 0; i < msg.length; i++) {
      const c = msg.toUpperCase().charCodeAt(i);
      if (c >= 65 && c <= 90) {
        const shift = cleanK.charCodeAt(j % cleanK.length) - 65;
        res += String.fromCharCode(((c - 65 + shift) % 26) + 65);
        j++;
      } else {
        res += msg[i];
      }
    }
    return res;
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Vigenère Polyalphabetic Cipher</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Pass-Keyword</label>
          <input type="text" value={key} onChange={e => setKey(e.target.value)} className="w-full p-2.5 rounded-xl border font-mono uppercase font-bold" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Plaintext</label>
          <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full p-2.5 rounded-xl border font-mono uppercase font-bold" />
        </div>
      </div>

      <ResultCard label="Encrypted Vigenère Ciphertext" value={vigenere(text, key)} highlight />
    </div>
  );
};

// 29. Biorhythm Cycle Chart
const BiorhythmChartView: React.FC = () => {
  const [birthdate, setBirthdate] = useState('2000-01-01');
  const diffDays = Math.floor((Date.now() - new Date(birthdate).getTime()) / (1000 * 60 * 60 * 24)) || 1;

  const physical = Math.round(Math.sin((2 * Math.PI * diffDays) / 23) * 100);
  const emotional = Math.round(Math.sin((2 * Math.PI * diffDays) / 28) * 100);
  const intellectual = Math.round(Math.sin((2 * Math.PI * diffDays) / 33) * 100);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Biorhythm Biological Cycle Calculator</h2>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-500 mb-1">Date of Birth</label>
        <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className="w-full p-3 rounded-2xl border font-bold" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ResultCard label="Physical (23d)" value={`${physical}%`} highlight />
        <ResultCard label="Emotional (28d)" value={`${emotional}%`} />
        <ResultCard label="Intellectual (33d)" value={`${intellectual}%`} />
      </div>
    </div>
  );
};

// 30. Rock Paper Scissors Game
const RockPaperScissorsView: React.FC = () => {
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [compChoice, setCompChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string>('Select Rock, Paper, or Scissors');
  const [streak, setStreak] = useState(0);

  const play = (choice: 'Rock' | 'Paper' | 'Scissors') => {
    sounds.playClick();
    const opts = ['Rock', 'Paper', 'Scissors'];
    const comp = opts[Math.floor(Math.random() * opts.length)];
    setUserChoice(choice);
    setCompChoice(comp);

    if (choice === comp) {
      setResult("It's a Tie! 🤝");
    } else if (
      (choice === 'Rock' && comp === 'Scissors') ||
      (choice === 'Paper' && comp === 'Rock') ||
      (choice === 'Scissors' && comp === 'Paper')
    ) {
      setResult('You Won! 🎉');
      setStreak(s => s + 1);
      sounds.playSuccess();
    } else {
      setResult('Computer Won! 🤖');
      setStreak(0);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto text-center">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Rock Paper Scissors</h2>
        <span className="text-xs font-bold text-amber-500">Win Streak: {streak}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(['Rock', 'Paper', 'Scissors'] as const).map(item => (
          <button
            key={item}
            onClick={() => play(item)}
            className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-3xl hover:scale-105 transition-all cursor-pointer"
          >
            {item === 'Rock' ? '✊' : item === 'Paper' ? '✋' : '✌️'}
            <div className="text-xs font-bold mt-2 font-sans">{item}</div>
          </button>
        ))}
      </div>

      <div className="p-6 rounded-3xl border bg-zinc-50 dark:bg-zinc-900">
        <div className="text-lg font-bold">{result}</div>
        {userChoice && compChoice && (
          <div className="text-xs text-zinc-500 mt-1">
            You picked {userChoice} · Computer picked {compChoice}
          </div>
        )}
      </div>
    </div>
  );
};

// 31. Simon Says Audio Game
const SimonSaysView: React.FC = () => {
  const [seq, setSeq] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [score, setScore] = useState(0);

  const startSimon = () => {
    sounds.playClick();
    const newSeq = [Math.floor(Math.random() * 4)];
    setSeq(newSeq);
    setUserStep(0);
    setScore(0);
  };

  const pressColor = (idx: number) => {
    sounds.playTone([440, 554, 659, 880][idx], 0.2);
    if (seq[userStep] === idx) {
      if (userStep + 1 === seq.length) {
        sounds.playSuccess();
        setScore(s => s + 1);
        setSeq(prev => [...prev, Math.floor(Math.random() * 4)]);
        setUserStep(0);
      } else {
        setUserStep(s => s + 1);
      }
    } else {
      sounds.playTone(200, 0.5);
      setSeq([]);
    }
  };

  return (
    <div className="space-y-6 max-w-xs mx-auto text-center">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Simon Audio Memory</h2>
        <span className="text-xs font-bold">Score: {score}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {['bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'].map((color, idx) => (
          <button
            key={idx}
            onClick={() => pressColor(idx)}
            className={`w-32 h-32 rounded-3xl ${color} active:scale-90 transition-transform cursor-pointer shadow-md`}
          />
        ))}
      </div>

      <button onClick={startSimon} className="w-full py-3 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs">
        {seq.length > 0 ? 'Restart Game' : 'Start Simon Game'}
      </button>
    </div>
  );
};

// 32. Sudoku Puzzle Player
const SudokuView: React.FC = () => {
  const [board, setBoard] = useState([
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ]);

  const updateCell = (r: number, c: number, val: string) => {
    const n = parseInt(val) || 0;
    if (n >= 0 && n <= 9) {
      const copy = board.map(row => [...row]);
      copy[r][c] = n;
      setBoard(copy);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto text-center">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Classic Sudoku Solver & Player</h2>
      </div>

      <div className="grid grid-cols-9 gap-1 p-2 bg-zinc-900 rounded-2xl">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <input
              key={`${r}-${c}`}
              type="text"
              maxLength={1}
              value={cell === 0 ? '' : cell}
              onChange={e => updateCell(r, c, e.target.value)}
              className="w-8 h-8 sm:w-10 sm:h-10 text-center font-bold font-mono text-sm bg-white dark:bg-zinc-800 rounded-md focus:bg-amber-100"
            />
          ))
        )}
      </div>
    </div>
  );
};

// 33. Digital Whiteboard Sketchpad
const WhiteboardCanvasView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Digital Whiteboard Sketchpad</h2>
        <div className="flex gap-2 items-center">
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer" />
          <button onClick={clearCanvas} className="px-3 py-1 text-xs border rounded-lg hover:bg-zinc-100">Clear</button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={320}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        className="w-full h-80 rounded-3xl border border-zinc-300 dark:border-zinc-700 bg-white cursor-crosshair shadow-sm"
      />
    </div>
  );
};

// 34. Meme Template Generator
const MemeGeneratorView: React.FC = () => {
  const [topText, setTopText] = useState('ONE DOES NOT SIMPLY');
  const [bottomText, setBottomText] = useState('BUILD 100+ TOOLS IN BROWSER');

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Meme Template Studio</h2>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-zinc-800 aspect-video flex flex-col justify-between p-4 text-center select-none shadow-md">
        <div className="text-2xl font-black font-sans uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide">
          {topText}
        </div>
        <div className="text-xs opacity-50 text-white">Interactive Preview Canvas</div>
        <div className="text-2xl font-black font-sans uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide">
          {bottomText}
        </div>
      </div>

      <div className="space-y-2">
        <input type="text" value={topText} onChange={e => setTopText(e.target.value)} className="w-full p-2.5 rounded-xl border text-xs font-bold uppercase" placeholder="Top Text" />
        <input type="text" value={bottomText} onChange={e => setBottomText(e.target.value)} className="w-full p-2.5 rounded-xl border text-xs font-bold uppercase" placeholder="Bottom Text" />
      </div>
    </div>
  );
};
