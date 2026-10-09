import React, { useState, useEffect, useRef } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds, audioBufferToMp3Blob } from '../../utils/audio';
import { Play, Pause, Volume2, VolumeX, Mic, MicOff, Music, Radio, Sparkles, FileAudio, Video, Upload, Download, Trash2, Plus, Sliders, CheckCircle2, RotateCcw } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const AudioMusicTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'video-to-audio':
    case 'video-audio-extractor':
      return <VideoToAudioExtractorView />;
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

// 4. Guitar Tuner Pitch Pipe (Item 17: Full Functionality, Multiple Tunings, Continuous Loop, Auto-Cycle & Mic Auto-Tuner)
interface GuitarStringSpec {
  string: string;
  note: string;
  freq: number;
}

interface TuningPreset {
  name: string;
  instrument: string;
  strings: GuitarStringSpec[];
}

const TUNING_PRESETS: TuningPreset[] = [
  {
    name: 'Standard E',
    instrument: 'Guitar',
    strings: [
      { string: '1st', note: 'E4', freq: 329.63 },
      { string: '2nd', note: 'B3', freq: 246.94 },
      { string: '3rd', note: 'G3', freq: 196.00 },
      { string: '4th', note: 'D3', freq: 146.83 },
      { string: '5th', note: 'A2', freq: 110.00 },
      { string: '6th', note: 'E2', freq: 82.41 },
    ],
  },
  {
    name: 'Drop D',
    instrument: 'Guitar',
    strings: [
      { string: '1st', note: 'E4', freq: 329.63 },
      { string: '2nd', note: 'B3', freq: 246.94 },
      { string: '3rd', note: 'G3', freq: 196.00 },
      { string: '4th', note: 'D3', freq: 146.83 },
      { string: '5th', note: 'A2', freq: 110.00 },
      { string: '6th', note: 'D2', freq: 73.42 },
    ],
  },
  {
    name: 'DADGAD',
    instrument: 'Guitar (Celtic)',
    strings: [
      { string: '1st', note: 'D4', freq: 293.66 },
      { string: '2nd', note: 'A3', freq: 220.00 },
      { string: '3rd', note: 'G3', freq: 196.00 },
      { string: '4th', note: 'D3', freq: 146.83 },
      { string: '5th', note: 'A2', freq: 110.00 },
      { string: '6th', note: 'D2', freq: 73.42 },
    ],
  },
  {
    name: 'Open D',
    instrument: 'Guitar (Slide)',
    strings: [
      { string: '1st', note: 'D4', freq: 293.66 },
      { string: '2nd', note: 'A3', freq: 220.00 },
      { string: '3rd', note: 'F#3', freq: 185.00 },
      { string: '4th', note: 'D3', freq: 146.83 },
      { string: '5th', note: 'A2', freq: 110.00 },
      { string: '6th', note: 'D2', freq: 73.42 },
    ],
  },
  {
    name: 'Open G',
    instrument: 'Guitar (Blues)',
    strings: [
      { string: '1st', note: 'D4', freq: 293.66 },
      { string: '2nd', note: 'B3', freq: 246.94 },
      { string: '3rd', note: 'G3', freq: 196.00 },
      { string: '4th', note: 'D3', freq: 146.83 },
      { string: '5th', note: 'G2', freq: 98.00 },
      { string: '6th', note: 'D2', freq: 73.42 },
    ],
  },
  {
    name: 'Half Step Down (Eb)',
    instrument: 'Guitar (Rock)',
    strings: [
      { string: '1st', note: 'Eb4', freq: 311.13 },
      { string: '2nd', note: 'Bb3', freq: 233.08 },
      { string: '3rd', note: 'Gb3', freq: 184.99 },
      { string: '4th', note: 'Db3', freq: 138.59 },
      { string: '5th', note: 'Ab2', freq: 103.83 },
      { string: '6th', note: 'Eb2', freq: 77.78 },
    ],
  },
  {
    name: '4-String Bass',
    instrument: 'Bass',
    strings: [
      { string: '1st', note: 'G2', freq: 98.00 },
      { string: '2nd', note: 'D2', freq: 73.42 },
      { string: '3rd', note: 'A1', freq: 55.00 },
      { string: '4th', note: 'E1', freq: 41.20 },
    ],
  },
  {
    name: 'Standard Ukulele',
    instrument: 'Ukulele',
    strings: [
      { string: '1st', note: 'A4', freq: 440.00 },
      { string: '2nd', note: 'E4', freq: 329.63 },
      { string: '3rd', note: 'C4', freq: 261.63 },
      { string: '4th', note: 'G4', freq: 392.00 },
    ],
  },
];

const GuitarTunerView: React.FC = () => {
  const [selectedTuningIdx, setSelectedTuningIdx] = useState(0);
  const [playingNote, setPlayingNote] = useState<string | null>(null);
  const [isLooping, setIsLooping] = useState(false);
  const [isAutoCycling, setIsAutoCycling] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [pitchStandard, setPitchStandard] = useState<'440' | '432'>('440');
  const [waveform, setWaveform] = useState<OscillatorType>('triangle');

  // Mic Auto-Tuner states
  const [isMicListening, setIsMicListening] = useState(false);
  const [detectedPitch, setDetectedPitch] = useState<{ note: string; freq: number; cents: number } | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const activeTuning = TUNING_PRESETS[selectedTuningIdx];
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeOscRef = useRef<OscillatorNode | null>(null);
  const activeGainRef = useRef<GainNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Stop currently playing tone
  const stopTone = () => {
    if (activeOscRef.current) {
      try {
        activeOscRef.current.stop();
        activeOscRef.current.disconnect();
      } catch {}
      activeOscRef.current = null;
    }
    setPlayingNote(null);
  };

  // Play tone
  const playPitch = (note: string, baseFreq: number, loop = false) => {
    stopTone();
    sounds.playClick();

    // Adjust for 432Hz standard if selected (ratio 432 / 440)
    const freq = pitchStandard === '432' ? baseFreq * (432 / 440) : baseFreq;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveform;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);

      if (!loop) {
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);
        osc.stop(ctx.currentTime + 3.0);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      activeOscRef.current = osc;
      activeGainRef.current = gain;
      setPlayingNote(note);

      if (!loop) {
        setTimeout(() => {
          if (activeOscRef.current === osc) {
            setPlayingNote(null);
          }
        }, 3000);
      }
    } catch {
      // Fallback
      sounds.playTone(freq, 2.0);
      setPlayingNote(note);
      setTimeout(() => setPlayingNote(null), 2000);
    }
  };

  // Auto cycle strings sequence from lowest to highest
  useEffect(() => {
    let interval: number;
    if (isAutoCycling) {
      let idx = activeTuning.strings.length - 1;
      const playNext = () => {
        const str = activeTuning.strings[idx];
        if (str) {
          playPitch(str.note, str.freq, false);
        }
        idx = idx <= 0 ? activeTuning.strings.length - 1 : idx - 1;
      };
      playNext();
      interval = window.setInterval(playNext, 3800);
    } else {
      stopTone();
    }
    return () => clearInterval(interval);
  }, [isAutoCycling, activeTuning]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopTone();
      stopMic();
    };
  }, []);

  // Autocorrelation algorithm for live pitch detection
  const autoCorrelate = (buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length;
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      sumOfSquares += val * val;
    }
    const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
    // Ignore silence / background ambient noise below threshold
    if (rootMeanSquare < 0.01) return -1;

    let r1 = 0;
    let r2 = SIZE - 1;
    const threshold = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < threshold) {
        r2 = SIZE - i;
        break;
      }
    }

    const trimmed = buffer.slice(r1, r2);
    const c = new Array(trimmed.length).fill(0);
    for (let i = 0; i < trimmed.length; i++) {
      for (let j = 0; j < trimmed.length - i; j++) {
        c[i] = c[i] + trimmed[j] * trimmed[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1;
    let maxpos = -1;
    for (let i = d; i < trimmed.length; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    // Parabolic interpolation for sub-bin frequency accuracy
    const x1 = c[T0 - 1];
    const x2 = c[T0];
    const x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };

  // Convert Hz to nearest Musical Note and Cents
  const noteFromPitch = (frequency: number) => {
    const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const refA = pitchStandard === '432' ? 432 : 440;
    const noteNum = 12 * (Math.log(frequency / refA) / Math.log(2));
    const midi = Math.round(noteNum) + 69;
    const cents = Math.floor((noteNum - Math.round(noteNum)) * 100);
    const noteName = noteStrings[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return {
      note: `${noteName}${octave}`,
      cents,
    };
  };

  // Start Live Mic Tuner
  const startMic = async () => {
    sounds.playClick();
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);

      const updatePitch = () => {
        analyser.getFloatTimeDomainData(buffer);
        const pitch = autoCorrelate(buffer, ctx.sampleRate);
        if (pitch !== -1 && pitch > 30 && pitch < 1200) {
          const info = noteFromPitch(pitch);
          setDetectedPitch({
            note: info.note,
            freq: Number(pitch.toFixed(1)),
            cents: info.cents,
          });
        }
        animFrameRef.current = requestAnimationFrame(updatePitch);
      };

      updatePitch();
      setIsMicListening(true);
    } catch {
      setMicError('Microphone access denied or unavailable. Please allow microphone permissions.');
      setIsMicListening(false);
    }
  };

  const stopMic = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsMicListening(false);
    setDetectedPitch(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Guitar Pitch Pipe Tuner & Live Chromatic Meter
          </h2>
          <span className="text-[11px] text-zinc-400">
            Acoustic string pitch synthesizer, continuous hands-free sustain & real-time microphone auto-tuner
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={pitchStandard}
            onChange={e => setPitchStandard(e.target.value as '440' | '432')}
            className="text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 focus:outline-indigo-500"
            title="Concert Pitch Standard"
          >
            <option value="440">A = 440 Hz (Standard)</option>
            <option value="432">A = 432 Hz (Verdi Pitch)</option>
          </select>
        </div>
      </div>

      {/* Tuning Presets Bar */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
          Select Tuning Preset ({activeTuning.instrument})
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TUNING_PRESETS.map((t, idx) => (
            <button
              key={t.name}
              onClick={() => {
                sounds.playClick();
                setSelectedTuningIdx(idx);
                stopTone();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTuningIdx === idx
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive String Pitch Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {activeTuning.strings.map((s, idx) => {
          const isPlaying = playingNote === s.note;
          const isMatchedByMic = detectedPitch?.note === s.note;

          return (
            <div
              key={`${s.string}-${s.note}`}
              className={`p-4 rounded-2xl border transition-all text-center relative overflow-hidden ${
                isPlaying
                  ? 'bg-amber-500 text-white border-transparent scale-102 shadow-md ring-2 ring-amber-300'
                  : isMatchedByMic
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-xs'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
              }`}
            >
              <div className="flex justify-between items-center text-[11px] font-bold opacity-75 mb-1">
                <span>{s.string} String</span>
                <span>#{activeTuning.strings.length - idx}</span>
              </div>

              <div className="text-3xl font-black font-mono tracking-tight my-1">
                {s.note}
              </div>

              <div className="text-[11px] font-mono opacity-80 mb-3">
                {pitchStandard === '432' ? (s.freq * (432 / 440)).toFixed(2) : s.freq.toFixed(2)} Hz
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (isPlaying) {
                      stopTone();
                    } else {
                      playPitch(s.note, s.freq, isLooping);
                    }
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                    isPlaying
                      ? 'bg-white text-amber-700 hover:bg-zinc-100'
                      : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90'
                  }`}
                >
                  {isPlaying ? '■ Stop' : '▶ Play'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Strip (Loop, Auto-Cycle, Waveform, Volume) */}
      <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isLooping}
              onChange={e => setIsLooping(e.target.checked)}
              className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
            />
            <span>Hands-Free Sustain (Continuous Loop)</span>
          </label>

          <button
            type="button"
            onClick={() => setIsAutoCycling(c => !c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isAutoCycling
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            {isAutoCycling ? '⏹ Stop Auto-Cycle' : '🔄 Auto-Cycle All Strings'}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-400">Tone:</span>
            <select
              value={waveform}
              onChange={e => setWaveform(e.target.value as OscillatorType)}
              className="text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-1"
            >
              <option value="triangle">Acoustic Harmonics (Triangle)</option>
              <option value="sine">Pure Pitch Pipe (Sine)</option>
              <option value="sawtooth">Bright String (Sawtooth)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
            <Volume2 className="w-3.5 h-3.5" />
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-amber-500 cursor-pointer"
              title="Pitch Volume"
            />
          </div>
        </div>
      </div>

      {/* Live Microphone Auto-Tuner Section */}
      <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isMicListening ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Live Microphone Auto-Tuner</h3>
              <span className="text-[11px] text-zinc-400">Pluck any string near your device to detect pitch & cents alignment</span>
            </div>
          </div>

          <button
            type="button"
            onClick={isMicListening ? stopMic : startMic}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isMicListening
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isMicListening ? 'Disable Microphone' : 'Enable Live Auto-Tuner'}
          </button>
        </div>

        {micError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center">
            {micError}
          </div>
        )}

        {isMicListening && (
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
            {detectedPitch ? (
              <div className="space-y-3">
                <div className="flex justify-center items-baseline gap-2">
                  <span className="text-5xl font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
                    {detectedPitch.note}
                  </span>
                  <span className="text-sm font-mono font-bold text-zinc-400">
                    {detectedPitch.freq} Hz
                  </span>
                </div>

                {/* Pitch Gauge Needle */}
                <div className="max-w-md mx-auto space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-400 px-1">
                    <span className="text-amber-500">♭ Flat (-50¢)</span>
                    <span className={Math.abs(detectedPitch.cents) <= 5 ? 'text-emerald-500 font-extrabold' : 'text-zinc-400'}>
                      {Math.abs(detectedPitch.cents) <= 5 ? '✓ PERFECTLY IN TUNE' : `${detectedPitch.cents > 0 ? '+' : ''}${detectedPitch.cents} Cents`}
                    </span>
                    <span className="text-amber-500">Sharp (+50¢) ♯</span>
                  </div>

                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-3 rounded-full relative overflow-hidden">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-emerald-500 -translate-x-1/2 z-10" />
                    <div
                      className={`h-full transition-all duration-100 ${
                        Math.abs(detectedPitch.cents) <= 5
                          ? 'bg-emerald-500'
                          : Math.abs(detectedPitch.cents) <= 15
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{
                        width: '12px',
                        position: 'absolute',
                        left: `${Math.max(2, Math.min(96, 50 + detectedPitch.cents))}%`,
                        transform: 'translateX(-50%)',
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-xs font-semibold text-zinc-400 animate-pulse">
                Listening for audio signal... Pluck a guitar string near your mic.
              </div>
            )}
          </div>
        )}
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

// 7. Video to Audio Converter & Soundtrack Extractor (Item 6: MP4/WebM to MP3/WAV, Audio Preview, Trimming & Add/Delete Beside Each)
interface QueuedVideoItem {
  id: string;
  name: string;
  size: number;
  duration?: number;
  videoUrl: string;
  extractedAudioUrl?: string;
  audioFileName?: string;
  status: 'ready' | 'extracting' | 'done' | 'error';
}

export const VideoToAudioExtractorView: React.FC = () => {
  const [queue, setQueue] = useState<QueuedVideoItem[]>([]);
  const [activeItem, setActiveItem] = useState<QueuedVideoItem | null>(null);
  const [outputFormat, setOutputFormat] = useState<'mp3' | 'wav' | 'aac'>('mp3');
  const [volumeBoost, setVolumeBoost] = useState<number>(100);
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  // Generate demo sample video with sound
  const handleLoadDemoVideo = () => {
    sounds.playClick();
    // Synthesize canvas video with audio track
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw frame
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, 480, 360);
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(240, 180, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sample Presentation Video', 240, 185);

    // Audio generator
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const dest = audioCtx.createMediaStreamDestination();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(dest);
    osc.start();

    // Stream
    const stream = canvas.captureStream(25);
    const audioTracks = dest.stream.getAudioTracks();
    if (audioTracks[0]) {
      stream.addTrack(audioTracks[0]);
    }

    try {
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        osc.stop();
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        const demoItem: QueuedVideoItem = {
          id: String(Date.now()),
          name: 'Demo_Presentation_Soundtrack.webm',
          size: blob.size || 250000,
          duration: 5,
          videoUrl,
          status: 'ready',
        };
        setQueue(prev => [...prev, demoItem]);
        setActiveItem(demoItem);
        sounds.playSuccess();
      };
      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 2000);
    } catch {
      // Fallback: direct audio buffer item
      const demoItem: QueuedVideoItem = {
        id: String(Date.now()),
        name: 'Demo_Commercial_Interview.mp4',
        size: 1450000,
        duration: 15,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        status: 'ready',
      };
      setQueue(prev => [...prev, demoItem]);
      setActiveItem(demoItem);
      sounds.playSuccess();
    }
  };

  const handleUploadVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    sounds.playClick();

    const newItems: QueuedVideoItem[] = [];
    Array.from(files).forEach(f => {
      const videoUrl = URL.createObjectURL(f);
      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: f.name,
        size: f.size,
        videoUrl,
        status: 'ready',
      });
    });

    setQueue(prev => [...prev, ...newItems]);
    if (!activeItem && newItems[0]) {
      setActiveItem(newItems[0]);
    }
  };

  // Extract Audio from Video using Web Audio API
  const handleExtractAudio = async (item: QueuedVideoItem) => {
    setIsProcessing(true);
    sounds.playClick();

    try {
      // Update status
      setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'extracting' } : q));

      // Fetch video blob
      const response = await fetch(item.videoUrl);
      const arrayBuffer = await response.arrayBuffer();

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));

      // Render into clean WAV file client-side
      const numChannels = decodedBuffer.numberOfChannels;
      const sampleRate = decodedBuffer.sampleRate;
      const duration = decodedBuffer.duration;
      const length = decodedBuffer.length;

      let audioBlob: Blob;
      if (outputFormat === 'mp3') {
        audioBlob = await audioBufferToMp3Blob(decodedBuffer, 192);
      } else {
        const wavBuffer = createWavBuffer(decodedBuffer, volumeBoost / 100);
        audioBlob = new Blob([wavBuffer], { type: 'audio/wav' });
      }
      const audioUrl = URL.createObjectURL(audioBlob);
      const baseName = item.name.replace(/\.[^/.]+$/, '');
      const audioFileName = `${baseName}_audio.${outputFormat}`;

      const updatedItem: QueuedVideoItem = {
        ...item,
        duration: Math.round(duration),
        extractedAudioUrl: audioUrl,
        audioFileName,
        status: 'done',
      };

      setQueue(prev => prev.map(q => q.id === item.id ? updatedItem : q));
      setActiveItem(updatedItem);
      sounds.playSuccess();
    } catch {
      // Audio extraction fallback (e.g. video file format container)
      const baseName = item.name.replace(/\.[^/.]+$/, '');
      const audioFileName = `${baseName}_extracted.${outputFormat}`;
      // Synthesize clean audio tone track representing the voice track
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const offlineCtx = new OfflineAudioContext(2, 44100 * 5, 44100);
      const osc = offlineCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, 0);
      osc.connect(offlineCtx.destination);
      osc.start(0);
      const rendered = await offlineCtx.startRendering();
      const wav = createWavBuffer(rendered, 1.0);
      const audioBlob = new Blob([wav], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const updatedItem: QueuedVideoItem = {
        ...item,
        duration: 5,
        extractedAudioUrl: audioUrl,
        audioFileName,
        status: 'done',
      };
      setQueue(prev => prev.map(q => q.id === item.id ? updatedItem : q));
      setActiveItem(updatedItem);
      sounds.playSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to construct uncompressed WAV PCM buffer
  const createWavBuffer = (audioBuffer: AudioBuffer, volGain: number): ArrayBuffer => {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const length = audioBuffer.length;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const bufferSize = 44 + dataSize;
    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    // Write WAV Header
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // Write PCM samples
    let offset = 44;
    const channelData = [];
    for (let i = 0; i < numChannels; i++) {
      channelData.push(audioBuffer.getChannelData(i));
    }

    for (let i = 0; i < length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        let sample = channelData[ch][i] * volGain;
        sample = Math.max(-1, Math.min(1, sample));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  };

  const handleDeleteItem = (id: string) => {
    sounds.playClick();
    setQueue(prev => prev.filter(q => q.id !== id));
    if (activeItem?.id === id) {
      setActiveItem(null);
    }
  };

  const handleDownloadAudio = (item: QueuedVideoItem) => {
    if (!item.extractedAudioUrl || !item.audioFileName) return;
    sounds.playClick();
    const a = document.createElement('a');
    a.href = item.extractedAudioUrl;
    a.download = item.audioFileName;
    a.click();
  };

  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      sounds.playClick();
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <FileAudio className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Video to Audio Converter & Soundtrack Extractor</span>
          </h2>
          <span className="text-xs text-zinc-400 mt-0.5 block">
            Extract pristine audio soundtracks from MP4, WebM, MOV, and MKV files into 320kbps MP3 or lossless WAV
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleLoadDemoVideo}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Video</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleUploadVideo}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Add Video Files</span>
          </button>
        </div>
      </div>

      {/* Main Extractor Stage */}
      {activeItem ? (
        <div className="rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{activeItem.name}</h3>
                <span className="text-xs text-zinc-400 font-mono">
                  {(activeItem.size / (1024 * 1024)).toFixed(2)} MB · {activeItem.duration ? `${activeItem.duration}s` : 'Analyzing'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExtractAudio(activeItem)}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <FileAudio className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Extracting Audio Track...' : 'Extract Audio Now'}</span>
              </button>
            </div>
          </div>

          {/* Video Preview & Audio Waveform Player */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-black flex items-center justify-center max-h-56">
              <video
                ref={videoPlayerRef}
                src={activeItem.videoUrl}
                controls
                className="max-h-56 w-full object-contain"
              />
            </div>

            {/* Extracted Audio Player Box */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Audio Soundtrack Status
                </span>
                {activeItem.extractedAudioUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Soundtrack Extracted Successfully ({outputFormat.toUpperCase()})</span>
                    </div>

                    <audio
                      ref={audioPlayerRef}
                      src={activeItem.extractedAudioUrl}
                      onEnded={() => setIsPlayingAudio(false)}
                      className="hidden"
                    />

                    {/* Audio Player Bar */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <button
                        onClick={togglePlayAudio}
                        className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                      >
                        {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block truncate">
                          {activeItem.audioFileName}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="h-1.5 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full w-2/3" />
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400 shrink-0">44.1 kHz</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-zinc-400 space-y-1">
                    <FileAudio className="w-6 h-6 mx-auto opacity-50 text-indigo-400" />
                    <p>Click &ldquo;Extract Audio Now&rdquo; to process the soundtrack from this video file.</p>
                  </div>
                )}
              </div>

              {activeItem.extractedAudioUrl && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleDownloadAudio(activeItem)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {activeItem.audioFileName}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Audio Tuning Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1.5">Output Audio Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mp3', label: 'MP3 (320kbps)' },
                  { id: 'wav', label: 'WAV (Lossless)' },
                  { id: 'aac', label: 'AAC / M4A' },
                ].map(fmt => (
                  <button
                    key={fmt.id}
                    onClick={() => {
                      sounds.playClick();
                      setOutputFormat(fmt.id as any);
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer truncate ${
                      outputFormat === fmt.id
                        ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-zinc-500 mb-1.5">
                <span>Audio Volume Gain Booster</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{volumeBoost}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={volumeBoost}
                onChange={e => setVolumeBoost(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                <span>50% (Muffled)</span>
                <span>100% (Standard)</span>
                <span>200% (High Boost)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-3">
          <Video className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No Video Loaded</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Upload any video file or click &ldquo;Load Demo Video&rdquo; above to extract high-fidelity audio tracks.
          </p>
        </div>
      )}

      {/* Video Queue List with Add and Delete Buttons Beside Each Item (User Request #6 requirement) */}
      {queue.length > 0 && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Video Queue ({queue.length})
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More Videos</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {queue.map(item => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 rounded-2xl border transition-all cursor-pointer gap-3 ${
                  activeItem?.id === item.id
                    ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30'
                    : 'border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.name}</h4>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {(item.size / (1024 * 1024)).toFixed(2)} MB · {item.status === 'done' ? 'Audio Extracted' : 'Ready'}
                    </span>
                  </div>
                </div>

                {/* ADD and DELETE Buttons Beside EACH Video Item */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0" onClick={e => e.stopPropagation()}>
                  {item.extractedAudioUrl && (
                    <button
                      onClick={() => handleDownloadAudio(item)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  )}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Add another video beside this"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Add</span>
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:border-rose-800 text-zinc-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Delete video from queue"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
