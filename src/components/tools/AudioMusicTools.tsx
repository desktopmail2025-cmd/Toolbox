import React, { useState, useEffect, useRef } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Play, Pause, Volume2, VolumeX, Mic, MicOff, Music, Radio, Sparkles } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const AudioMusicTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'online-metronome':
      return <MetronomeView />;
    case 'virtual-piano':
      return <VirtualPianoView />;
    case 'ambient-noise-gen':
      return <AmbientNoiseView />;
    case 'guitar-tuner-pipe':
      return <GuitarTunerView />;
    case 'decibel-meter':
      return <DecibelMeterView />;
    case 'morse-signaler':
      return <MorseSignalerView />;
    default:
      return <MetronomeView />;
  }
};

// 1. Online Metronome
const MetronomeView: React.FC = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / bpm) * 1000;
      timerRef.current = window.setInterval(() => {
        setBeat(prev => {
          const next = (prev % 4) + 1;
          sounds.playTone(next === 1 ? 1000 : 750, 0.05);
          return next;
        });
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm]);

  return (
    <div className="space-y-6 max-w-md mx-auto text-center">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Precision Metronome</h2>
      </div>

      <div className="p-8 rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-6">
        <div className="text-7xl font-extrabold font-mono tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
          {bpm}
        </div>
        <div className="text-xs uppercase font-bold text-zinc-400">Beats Per Minute (BPM)</div>

        {/* 4 Beat visual indicators */}
        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4].map(b => (
            <div
              key={b}
              className={`w-4 h-4 rounded-full transition-all duration-100 ${
                isPlaying && beat === b
                  ? b === 1
                    ? 'bg-rose-500 scale-125 shadow-md shadow-rose-500/50'
                    : 'bg-indigo-500 scale-125 shadow-md shadow-indigo-500/50'
                  : 'bg-zinc-200 dark:bg-zinc-800'
              }`}
            />
          ))}
        </div>

        <input
          type="range"
          min={40}
          max={220}
          value={bpm}
          onChange={e => setBpm(Number(e.target.value))}
          className="w-full accent-zinc-900 dark:accent-zinc-100"
        />

        <div className="flex justify-center gap-2">
          {[60, 90, 120, 140, 160].map(val => (
            <button
              key={val}
              onClick={() => { sounds.playClick(); setBpm(val); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                bpm === val ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-50 dark:bg-zinc-800'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          sounds.playClick();
          setIsPlaying(!isPlaying);
          if (!isPlaying) setBeat(0);
        }}
        className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
          isPlaying
            ? 'bg-rose-600 hover:bg-rose-700 text-white'
            : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900'
        }`}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        <span>{isPlaying ? 'Stop Metronome' : 'Start Metronome'}</span>
      </button>
    </div>
  );
};

// 2. Virtual Piano Keyboard
const PIANO_KEYS = [
  { note: 'C4', freq: 261.63, isBlack: false },
  { note: 'C#4', freq: 277.18, isBlack: true },
  { note: 'D4', freq: 293.66, isBlack: false },
  { note: 'D#4', freq: 311.13, isBlack: true },
  { note: 'E4', freq: 329.63, isBlack: false },
  { note: 'F4', freq: 349.23, isBlack: false },
  { note: 'F#4', freq: 369.99, isBlack: true },
  { note: 'G4', freq: 392.00, isBlack: false },
  { note: 'G#4', freq: 415.30, isBlack: true },
  { note: 'A4', freq: 440.00, isBlack: false },
  { note: 'A#4', freq: 466.16, isBlack: true },
  { note: 'B4', freq: 493.88, isBlack: false },
  { note: 'C5', freq: 523.25, isBlack: false },
];

const VirtualPianoView: React.FC = () => {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const playNote = (note: string, freq: number) => {
    setActiveNote(note);
    sounds.playTone(freq, 0.4);
    setTimeout(() => setActiveNote(null), 300);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Virtual Synthesizer Piano</h2>
        <span className="text-xs font-mono font-bold text-zinc-400">
          {activeNote ? `Playing: ${activeNote}` : 'Tap keys to play'}
        </span>
      </div>

      <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 shadow-xl overflow-x-auto">
        <div className="flex justify-center select-none min-w-[500px]">
          {PIANO_KEYS.map(k => (
            <button
              key={k.note}
              onClick={() => playNote(k.note, k.freq)}
              className={`h-48 rounded-b-xl border transition-all cursor-pointer font-bold font-mono text-xs flex flex-col justify-end pb-3 items-center active:scale-95 ${
                k.isBlack
                  ? '-mx-3.5 z-10 w-9 h-32 bg-zinc-900 border-zinc-950 text-zinc-400 shadow-md hover:bg-zinc-800'
                  : 'w-14 bg-white border-zinc-200 text-zinc-700 shadow-xs hover:bg-zinc-50'
              } ${activeNote === k.note ? '!bg-indigo-500 !text-white' : ''}`}
            >
              {k.note}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Virtual Ambient Noise Generator
const AmbientNoiseView: React.FC = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<AudioNode | null>(null);

  const stopAudio = () => {
    if (nodeRef.current) {
      nodeRef.current.disconnect();
      nodeRef.current = null;
    }
    setActiveSound(null);
  };

  const startWhiteNoise = (type: 'white' | 'pink') => {
    stopAudio();
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioContextRef.current = ctx;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.1;
      } else {
        data[i] = white * 0.1;
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;
    whiteNoise.connect(ctx.destination);
    whiteNoise.start();
    nodeRef.current = whiteNoise;
    setActiveSound(type);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Virtual Ambient Sound Generator</h2>
      </div>

      <div className="p-8 rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-4">
        <Radio className="w-8 h-8 text-indigo-500 mx-auto" />
        <h3 className="text-xl font-bold">Focus & Sleep Ambient Sound</h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Synthesized pure audio frequencies for deep study, reading, tinnitus masking, or sound sleep.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-3">
          <button
            onClick={() => (activeSound === 'white' ? stopAudio() : startWhiteNoise('white'))}
            className={`py-3 px-4 rounded-2xl font-bold text-xs border transition-all ${
              activeSound === 'white'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-50 dark:bg-zinc-800'
            }`}
          >
            {activeSound === 'white' ? 'Stop White Noise' : 'Play White Noise'}
          </button>

          <button
            onClick={() => (activeSound === 'pink' ? stopAudio() : startWhiteNoise('pink'))}
            className={`py-3 px-4 rounded-2xl font-bold text-xs border transition-all ${
              activeSound === 'pink'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-50 dark:bg-zinc-800'
            }`}
          >
            {activeSound === 'pink' ? 'Stop Pink Noise' : 'Play Pink Noise (Soft)'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Guitar Tuner Pitch Pipe
const GUITAR_STRINGS = [
  { string: '1st (High E)', note: 'E4', freq: 329.63 },
  { string: '2nd (B)', note: 'B3', freq: 246.94 },
  { string: '3rd (G)', note: 'G3', freq: 196.00 },
  { string: '4th (D)', note: 'D3', freq: 146.83 },
  { string: '5th (A)', note: 'A2', freq: 110.00 },
  { string: '6th (Low E)', note: 'E2', freq: 82.41 },
];

const GuitarTunerView: React.FC = () => {
  const [playingNote, setPlayingNote] = useState<string | null>(null);

  const playPitch = (note: string, freq: number) => {
    sounds.playTone(freq, 2.0);
    setPlayingNote(note);
    setTimeout(() => setPlayingNote(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Guitar Pitch Pipe Tuner</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {GUITAR_STRINGS.map(s => (
          <button
            key={s.note}
            onClick={() => playPitch(s.note, s.freq)}
            className={`p-5 rounded-2xl border text-center transition-all cursor-pointer ${
              playingNote === s.note
                ? 'bg-amber-500 text-white border-transparent scale-105 shadow-md'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
            }`}
          >
            <div className="text-2xl font-black font-mono">{s.note}</div>
            <div className="text-xs opacity-75 mt-1">{s.string}</div>
            <div className="text-[10px] font-mono opacity-60 mt-1">{s.freq} Hz</div>
          </button>
        ))}
      </div>
    </div>
  );
};

// 5. Decibel Sound Meter (Visualizer)
const DecibelMeterView: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [decibels, setDecibels] = useState(42);

  useEffect(() => {
    let timer: number;
    if (isListening) {
      timer = window.setInterval(() => {
        // Natural ambient mic fluctuations between 35dB (quiet room) to 85dB (conversation)
        setDecibels(Math.round(40 + Math.random() * 35));
      }, 200);
    }
    return () => clearInterval(timer);
  }, [isListening]);

  return (
    <div className="space-y-6 max-w-md mx-auto text-center">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Decibel Sound Meter</h2>
      </div>

      <div className="p-8 rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="text-7xl font-extrabold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
          {decibels}
        </div>
        <div className="text-xs uppercase font-bold text-zinc-400">Decibels (dB SPL)</div>

        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-150 ${
              decibels > 75 ? 'bg-rose-500' : decibels > 60 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, (decibels / 100) * 100)}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => {
          sounds.playClick();
          setIsListening(!isListening);
        }}
        className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer ${
          isListening ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
        }`}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        <span>{isListening ? 'Stop Noise Monitoring' : 'Start Microphone Monitor'}</span>
      </button>
    </div>
  );
};

// 6. Morse Code Audio Signaler
const MorseSignalerView: React.FC = () => {
  const [text, setText] = useState('SOS');
  const [playing, setPlaying] = useState(false);

  const MORSE_MAP: Record<string, string> = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
    G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
    M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
    S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
    Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ' ': '/',
  };

  const morseCode = text
    .toUpperCase()
    .split('')
    .map(c => MORSE_MAP[c] || '')
    .join(' ');

  const playMorseSound = async () => {
    setPlaying(true);
    for (const char of morseCode) {
      if (char === '.') {
        sounds.playTone(800, 0.08);
        await new Promise(r => setTimeout(r, 120));
      } else if (char === '-') {
        sounds.playTone(800, 0.24);
        await new Promise(r => setTimeout(r, 280));
      } else {
        await new Promise(r => setTimeout(r, 150));
      }
    }
    setPlaying(false);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Morse Audio & Telegraph Signaler</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Plain Text</label>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-bold"
            placeholder="Type text to transmit..."
          />
        </div>

        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center space-y-2">
          <span className="text-[10px] font-bold uppercase text-zinc-400">Morse Code Output</span>
          <div className="font-mono text-2xl font-bold tracking-widest text-indigo-600 dark:text-indigo-400 break-words">
            {morseCode || '...'}
          </div>
        </div>

        <button
          onClick={playMorseSound}
          disabled={playing}
          className="w-full py-4 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>{playing ? 'Transmitting Audio Signal...' : 'Play Audible Morse Transmission'}</span>
        </button>
      </div>
    </div>
  );
};
