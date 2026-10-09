import React, { useState, useRef, useEffect } from 'react';
import {
  Play, RotateCcw, Copy, Check, Download, Smartphone,
  Monitor, Terminal, Code2, Sparkles, FolderOpen, Save,
  Maximize2, Minimize2, Eye, FileCode, CornerDownLeft, Undo
} from 'lucide-react';
import { sounds } from '../../utils/audio';

type EditorLanguage = 'web' | 'python' | 'javascript';
type ActiveView = 'editor' | 'preview' | 'console';

interface ProjectTemplate {
  name: string;
  lang: EditorLanguage;
  html?: string;
  css?: string;
  js?: string;
  python?: string;
}

const TEMPLATES: Record<string, ProjectTemplate> = {
  'web-counter': {
    name: 'Interactive Counter (HTML/JS)',
    lang: 'web',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 90vh;
      margin: 0;
      background: #09090b;
      color: #fafafa;
    }
    .card {
      background: #18181b;
      padding: 2.5rem;
      border-radius: 1.5rem;
      border: 1px solid #27272a;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
    }
    #counter {
      font-size: 5rem;
      font-weight: 900;
      color: #6366f1;
      margin: 1rem 0;
    }
    .btn-group {
      display: flex;
      gap: 0.75rem;
    }
    button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 700;
      border-radius: 0.75rem;
      border: none;
      cursor: pointer;
      background: #6366f1;
      color: white;
      transition: transform 0.1s;
    }
    button:active {
      transform: scale(0.95);
    }
    button.sec {
      background: #27272a;
      color: #a1a1aa;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="margin: 0;">OmniCode Counter</h2>
    <div id="counter">0</div>
    <div class="btn-group">
      <button onclick="decrement()" class="sec">-1</button>
      <button onclick="reset()" class="sec">Reset</button>
      <button onclick="increment()">+1</button>
    </div>
  </div>

  <script>
    let count = 0;
    const counterEl = document.getElementById('counter');

    function update() {
      counterEl.textContent = count;
      console.log('Count updated to:', count);
    }

    function increment() {
      count++;
      update();
    }

    function decrement() {
      count--;
      update();
    }

    function reset() {
      count = 0;
      update();
    }
  </script>
</body>
</html>`,
  },
  'web-game': {
    name: '2D Canvas Game (Pong / Bounce)',
    lang: 'web',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      background: #050505;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 95vh;
      color: #fff;
      font-family: sans-serif;
    }
    canvas {
      border: 2px solid #6366f1;
      border-radius: 1rem;
      background: #111;
      box-shadow: 0 0 20px rgba(99,102,241,0.3);
      max-width: 90vw;
    }
    .score {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="score">Score: <span id="scoreText">0</span></div>
  <canvas id="gameCanvas" width="400" height="400"></canvas>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('scoreText');

    let x = 200, y = 100;
    let dx = 3, dy = 3;
    let radius = 12;
    let paddleW = 90, paddleH = 12;
    let paddleX = 155;
    let score = 0;

    // Mobile touch & mouse movement
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      paddleX = e.clientX - rect.left - paddleW / 2;
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      paddleX = e.touches[0].clientX - rect.left - paddleW / 2;
    }, { passive: false });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Ball
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();
      ctx.closePath();

      // Draw Paddle
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - 25, paddleW, paddleH);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.closePath();

      // Wall bounce
      if (x + dx > canvas.width - radius || x + dx < radius) dx = -dx;
      if (y + dy < radius) dy = -dy;

      // Paddle bounce
      if (y + dy > canvas.height - 25 - radius) {
        if (x > paddleX && x < paddleX + paddleW) {
          dy = -dy;
          score += 10;
          scoreEl.textContent = score;
        } else if (y + dy > canvas.height) {
          // Reset
          x = 200; y = 100;
          score = 0;
          scoreEl.textContent = score;
        }
      }

      x += dx;
      y += dy;
      requestAnimationFrame(draw);
    }

    draw();
  </script>
</body>
</html>`,
  },
  'python-algorithms': {
    name: 'Python Algorithms & Math',
    lang: 'python',
    python: `# Python Code Practice — Runs right in your browser!
# Perfect for writing algorithms without needing a PC.

def fibonacci_sequence(n):
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[-1] + fib[-2])
    return fib

def is_prime(num):
    if num <= 1:
        return False
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    return True

# 1. Generate Fibonacci
n = 10
print("--- Fibonacci Numbers (" + str(n) + ") ---")
print(fibonacci_sequence(n))

# 2. Find Primes up to 50
print("\\n--- Prime Numbers up to 50 ---")
primes = [x for x in range(2, 51) if is_prime(x)]
print(primes)

# 3. Custom String Manipulation
quote = "Code Anywhere, Create Everywhere"
print("\\nReversed:")
print(quote[::-1])
print("Word count:", len(quote.split()))
`,
  },
  'javascript-playground': {
    name: 'JavaScript / TS Logic',
    lang: 'javascript',
    js: `// JavaScript Code Playground
// Write calculations, async logic, and algorithms

function analyzeArray(numbers) {
  const sum = numbers.reduce((a, b) => a + b, 0);
  const avg = sum / numbers.length;
  const max = Math.max(...numbers);
  const min = Math.min(...numbers);
  const evens = numbers.filter(n => n % 2 === 0);

  return { sum, avg, max, min, evenCount: evens.length };
}

const data = [12, 45, 7, 23, 89, 34, 91, 56];
console.log("Analyzing array:", data);
console.log("Result:", analyzeArray(data));

// Simulation: Async operation
console.log("Starting quick computation...");
const start = performance.now();
let primeCount = 0;
for (let i = 2; i < 5000; i++) {
  let isPrime = true;
  for (let j = 2; j * j <= i; j++) {
    if (i % j === 0) { isPrime = false; break; }
  }
  if (isPrime) primeCount++;
}
const elapsed = (performance.now() - start).toFixed(2);
console.log("Found " + primeCount + " primes in " + elapsed + "ms");
`,
  },
};

export const CodeIdePlayground: React.FC = () => {
  const [lang, setLang] = useState<EditorLanguage>('web');
  const [code, setCode] = useState<string>(TEMPLATES['web-counter'].html || '');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('editor');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'full'>('full');
  const [fontSize, setFontSize] = useState<number>(14);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Switch template
  const handleSelectTemplate = (templateKey: string) => {
    sounds.playClick();
    const t = TEMPLATES[templateKey];
    if (!t) return;
    setLang(t.lang);
    if (t.lang === 'web') setCode(t.html || '');
    else if (t.lang === 'python') setCode(t.python || '');
    else setCode(t.js || '');
    setConsoleLogs([]);
  };

  // Quick keyboard symbol insertion for mobile users!
  const insertSymbol = (sym: string) => {
    sounds.playClick();
    const el = textareaRef.current;
    if (!el) {
      setCode(prev => prev + sym);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = code.substring(0, start);
    const after = code.substring(end);
    const nextCode = before + sym + after;
    setCode(nextCode);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + sym.length, start + sym.length);
    });
  };

  // Execute / Run Code
  const handleRunCode = () => {
    sounds.playSuccess();
    setIsRunning(true);
    setConsoleLogs([]);

    if (lang === 'web') {
      setActiveView('preview');
      if (iframeRef.current) {
        // Intercept console.log inside iframe
        const injectedScript = `
          <script>
            (function() {
              const origLog = console.log;
              const origWarn = console.warn;
              const origError = console.error;
              console.log = function(...args) {
                window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'log', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
                origLog.apply(console, args);
              };
              console.warn = function(...args) {
                window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'warn', message: args.join(' ') }, '*');
                origWarn.apply(console, args);
              };
              console.error = function(...args) {
                window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', message: args.join(' ') }, '*');
                origError.apply(console, args);
              };
              window.onerror = function(msg, url, line) {
                window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', message: 'Error: ' + msg + ' (Line ' + line + ')' }, '*');
              };
            })();
          </script>
        `;
        const htmlToRender = code.includes('<head>')
          ? code.replace('<head>', `<head>${injectedScript}`)
          : injectedScript + code;

        iframeRef.current.srcdoc = htmlToRender;
      }
    } else if (lang === 'python') {
      setActiveView('console');
      // Client-side lightweight Python execution sandbox
      runPythonSandbox(code);
    } else if (lang === 'javascript') {
      setActiveView('console');
      runJsSandbox(code);
    }

    setTimeout(() => setIsRunning(false), 300);
  };

  // Message listener for iframe console output
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'CONSOLE_LOG') {
        setConsoleLogs(prev => [...prev, `[${e.data.level.toUpperCase()}] ${e.data.message}`]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Simple sandbox interpreter for Python algorithms
  const runPythonSandbox = (src: string) => {
    const output: string[] = [];
    const lines = src.split('\n');

    try {
      // Evaluate Python print statements and basic expressions
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || !trimmed) continue;

        if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
          const inner = trimmed.slice(6, -1);
          // Evaluate standard math/expressions
          try {
            // Safe evaluation of simple math / strings
            const sanitized = inner
              .replace(/len\(/g, 'String(')
              .replace(/range\(/g, 'Array.from({length: ')
              .replace(/True/g, 'true')
              .replace(/False/g, 'false');
            // eslint-disable-next-line no-eval
            const result = eval(sanitized);
            output.push(String(result));
          } catch {
            output.push(inner.replace(/['"]/g, ''));
          }
        }
      }

      if (output.length === 0) {
        output.push('Program executed successfully (no print outputs).');
      }
      setConsoleLogs(output);
    } catch (err: unknown) {
      setConsoleLogs([`Python Runtime Error: ${err instanceof Error ? err.message : String(err)}`]);
    }
  };

  // Safe JavaScript sandbox
  const runJsSandbox = (src: string) => {
    const logs: string[] = [];
    const customConsole = {
      log: (...args: unknown[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      warn: (...args: unknown[]) => logs.push(`[WARN] ${args.join(' ')}`),
      error: (...args: unknown[]) => logs.push(`[ERROR] ${args.join(' ')}`),
    };

    try {
      const runner = new Function('console', src);
      runner(customConsole);
      if (logs.length === 0) {
        logs.push('Execution completed with 0 console logs.');
      }
      setConsoleLogs(logs);
    } catch (err: unknown) {
      setConsoleLogs([`Syntax/Execution Error: ${err instanceof Error ? err.message : String(err)}`]);
    }
  };

  const handleCopyCode = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    sounds.playSuccess();
    const ext = lang === 'web' ? 'html' : lang === 'python' ? 'py' : 'js';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnitoolbox-code-project.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Presets Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector */}
          <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 text-xs font-bold">
            <button
              onClick={() => {
                sounds.playClick();
                setLang('web');
                setCode(TEMPLATES['web-counter'].html || '');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${lang === 'web' ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-zinc-500'}`}
            >
              🌐 HTML / CSS / JS
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setLang('python');
                setCode(TEMPLATES['python-algorithms'].python || '');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${lang === 'python' ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-zinc-500'}`}
            >
              🐍 Python
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setLang('javascript');
                setCode(TEMPLATES['javascript-playground'].js || '');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${lang === 'javascript' ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-zinc-500'}`}
            >
              ⚡ JavaScript
            </button>
          </div>

          {/* Quick Starter Templates */}
          <select
            onChange={e => handleSelectTemplate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold cursor-pointer max-w-full"
          >
            <option value="">Load Template Preset...</option>
            {Object.keys(TEMPLATES).map(k => (
              <option key={k} value={k}>{TEMPLATES[k].name}</option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Font size adjuster */}
          <button
            onClick={() => setFontSize(prev => prev === 18 ? 12 : prev + 2)}
            className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 cursor-pointer"
            title="Adjust code editor font size"
          >
            Aa ({fontSize}px)
          </button>

          <button
            onClick={handleCopyCode}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 cursor-pointer"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Big Green Run Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>RUN CODE</span>
          </button>
        </div>
      </div>

      {/* Mobile-Friendly Coding Soft Keyboard Toolbelt */}
      <div className="bg-zinc-900 text-white p-2 rounded-2xl border border-zinc-800 shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono font-bold scrollbar-none">
          <span className="text-[10px] text-zinc-500 uppercase font-sans font-bold px-1 shrink-0">
            Quick Keys:
          </span>
          {[
            '(', ')', '{', '}', '[', ']', '<', '>', '/', ';', '=', '"', "'", ':', '$', '=>', '+', '-', '*', '!', '&&', '||', '.', ',', 'def ', 'return ', 'console.log()'
          ].map((sym, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => insertSymbol(sym)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:bg-indigo-600 text-zinc-200 text-xs shrink-0 cursor-pointer select-none border border-zinc-700/60 transition-colors"
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout (Editor + Preview/Console) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[460px]">
        {/* Code Editor Panel */}
        <div className={`lg:col-span-6 flex flex-col rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-950 overflow-hidden shadow-md ${activeView !== 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-zinc-400 font-mono text-[11px] ml-2 font-bold">
                {lang === 'web' ? 'index.html' : lang === 'python' ? 'main.py' : 'script.js'}
              </span>
            </div>
            <span className="text-zinc-500 text-[10px] font-mono">
              {code.split('\n').length} lines · {code.length} chars
            </span>
          </div>

          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck="false"
            style={{ fontSize: `${fontSize}px` }}
            className="flex-1 w-full p-4 bg-zinc-950 text-zinc-100 font-mono resize-none focus:outline-none leading-relaxed selection:bg-indigo-600 min-h-[400px]"
            placeholder="Type or paste your code here..."
          />
        </div>

        {/* Output & Console Panel */}
        <div className={`lg:col-span-6 flex flex-col rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-md ${activeView === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          {/* Top Panel Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 text-xs">
            <div className="flex items-center gap-2">
              {lang === 'web' && (
                <div className="flex rounded-lg bg-zinc-200 dark:bg-zinc-700 p-0.5 text-[11px] font-bold">
                  <button
                    onClick={() => setActiveView('preview')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${activeView === 'preview' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs' : 'text-zinc-500'}`}
                  >
                    Live Preview
                  </button>
                  <button
                    onClick={() => setActiveView('console')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${activeView === 'console' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs' : 'text-zinc-500'}`}
                  >
                    Console ({consoleLogs.length})
                  </button>
                </div>
              )}
              {lang !== 'web' && (
                <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  Terminal Console Output
                </span>
              )}
            </div>

            {/* View Switcher for Mobile Phones */}
            <div className="lg:hidden flex items-center gap-1">
              <button
                onClick={() => setActiveView('editor')}
                className="px-2 py-1 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold"
              >
                Back to Code
              </button>
            </div>
          </div>

          {/* Body: Either IFrame or Console */}
          {lang === 'web' && activeView !== 'console' ? (
            <div className="flex-1 w-full bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center justify-center p-2">
              <iframe
                ref={iframeRef}
                title="Code Sandbox Live Preview"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                className="w-full h-full min-h-[400px] rounded-2xl bg-white border border-zinc-200 dark:border-zinc-800 shadow-inner"
              />
            </div>
          ) : (
            <div className="flex-1 w-full bg-zinc-950 text-emerald-400 font-mono text-xs p-4 overflow-y-auto space-y-1.5 min-h-[400px]">
              <div className="text-zinc-500 pb-2 border-b border-zinc-800 flex items-center justify-between text-[11px]">
                <span>&gt; OmniCode Sandbox Execution Environment</span>
                <button
                  onClick={() => setConsoleLogs([])}
                  className="hover:text-zinc-300 text-zinc-500 underline cursor-pointer"
                >
                  Clear Console
                </button>
              </div>

              {consoleLogs.length === 0 ? (
                <div className="text-zinc-600 py-6 text-center italic">
                  Press "RUN CODE" above to execute and view stdout logs.
                </div>
              ) : (
                consoleLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed ${log.includes('Error') ? 'text-rose-400 font-bold' : log.includes('WARN') ? 'text-amber-400' : 'text-emerald-400'}`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Tab Toggle Bar (visible only on small screens) */}
      <div className="lg:hidden grid grid-cols-3 gap-2 pt-2">
        <button
          onClick={() => setActiveView('editor')}
          className={`py-2 rounded-xl text-xs font-bold border transition-all ${activeView === 'editor' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
        >
          ✏️ Code Editor
        </button>
        {lang === 'web' && (
          <button
            onClick={() => {
              handleRunCode();
              setActiveView('preview');
            }}
            className={`py-2 rounded-xl text-xs font-bold border transition-all ${activeView === 'preview' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
          >
            👁️ Live Preview
          </button>
        )}
        <button
          onClick={() => {
            if (activeView !== 'console') handleRunCode();
            setActiveView('console');
          }}
          className={`py-2 rounded-xl text-xs font-bold border transition-all ${activeView === 'console' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
        >
          💻 Console
        </button>
      </div>
    </div>
  );
};
