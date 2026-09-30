import React, { useState, useEffect, useRef } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Plus, Trash2, Play, Pause, RotateCcw, Shuffle, Copy, Check } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const StudentTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'gpa-calc':
      return <GpaCalcView />;
    case 'target-grade-calc':
      return <TargetGradeCalcView />;
    case 'attendance-calc':
      return <AttendanceCalcView />;
    case 'pomodoro-timer':
      return <PomodoroTimerView />;
    case 'exam-countdown':
      return <ExamCountdownView />;
    case 'citation-generator':
      return <CitationGeneratorView />;
    case 'group-generator':
      return <GroupGeneratorView />;
    default:
      return <GpaCalcView />;
  }
};

// 1. GPA & CGPA Calculator
interface CourseItem {
  id: string;
  name: string;
  credits: number;
  gradePoint: number;
}

const GpaCalcView: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([
    { id: '1', name: 'Computer Science', credits: 4, gradePoint: 4.0 },
    { id: '2', name: 'Mathematics', credits: 4, gradePoint: 3.7 },
    { id: '3', name: 'Physics', credits: 3, gradePoint: 3.3 },
    { id: '4', name: 'English Literature', credits: 2, gradePoint: 4.0 },
  ]);

  const addCourse = () => {
    sounds.playClick();
    setCourses([
      ...courses,
      { id: String(Date.now()), name: `Course ${courses.length + 1}`, credits: 3, gradePoint: 4.0 },
    ]);
  };

  const removeCourse = (id: string) => {
    sounds.playClick();
    setCourses(courses.filter(c => c.id !== id));
  };

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalPoints = courses.reduce((sum, c) => sum + c.credits * c.gradePoint, 0);
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Course List</h4>
          <button
            onClick={addCourse}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" /> Add Course
          </button>
        </div>

        <div className="space-y-2">
          {courses.map(c => (
            <div key={c.id} className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950">
              <input
                type="text"
                value={c.name}
                onChange={e => {
                  const val = e.target.value;
                  setCourses(courses.map(item => (item.id === c.id ? { ...item, name: val } : item)));
                }}
                className="col-span-5 border rounded-lg px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-900 dark:border-zinc-800"
                placeholder="Course title"
              />
              <div className="col-span-3">
                <input
                  type="number"
                  value={c.credits}
                  onChange={e => {
                    const val = parseFloat(e.target.value) || 0;
                    setCourses(courses.map(item => (item.id === c.id ? { ...item, credits: val } : item)));
                  }}
                  className="w-full border rounded-lg px-2 py-1.5 text-xs font-mono text-center bg-white dark:bg-zinc-900 dark:border-zinc-800"
                  placeholder="Credits"
                />
              </div>
              <div className="col-span-3">
                <select
                  value={c.gradePoint}
                  onChange={e => {
                    const val = parseFloat(e.target.value) || 0;
                    setCourses(courses.map(item => (item.id === c.id ? { ...item, gradePoint: val } : item)));
                  }}
                  className="w-full border rounded-lg px-2 py-1.5 text-xs font-semibold bg-white dark:bg-zinc-900 dark:border-zinc-800"
                >
                  <option value={4.0}>A / A+ (4.0)</option>
                  <option value={3.7}>A- (3.7)</option>
                  <option value={3.3}>B+ (3.3)</option>
                  <option value={3.0}>B (3.0)</option>
                  <option value={2.7}>B- (2.7)</option>
                  <option value={2.3}>C+ (2.3)</option>
                  <option value={2.0}>C (2.0)</option>
                  <option value={1.0}>D (1.0)</option>
                  <option value={0.0}>F (0.0)</option>
                </select>
              </div>
              <div className="col-span-1 text-center">
                <button
                  onClick={() => removeCourse(c.id)}
                  className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Semester GPA" value={gpa.toFixed(2)} subtext="Scale 4.0" highlight />
        <ResultCard label="Total Credits" value={totalCredits} />
        <ResultCard label="Honor Status" value={gpa >= 3.8 ? 'Summa Cum Laude' : gpa >= 3.5 ? 'Dean\'s List' : 'Good Standing'} />
      </div>
    </div>
  );
};

// 2. Target Grade & Final Exam Calculator
const TargetGradeCalcView: React.FC = () => {
  const [currentGrade, setCurrentGrade] = useState(82);
  const [targetGrade, setTargetGrade] = useState(85);
  const [finalExamWeight, setFinalExamWeight] = useState(30);

  // Target = Current * (1 - Weight) + Final * Weight
  // Final = (Target - Current * (1 - Weight)) / Weight
  const w = finalExamWeight / 100;
  const neededScore = (targetGrade - currentGrade * (1 - w)) / (w || 0.01);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Current Grade (%)</label>
          <input
            type="number"
            value={currentGrade}
            onChange={e => setCurrentGrade(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Desired Target (%)</label>
          <input
            type="number"
            value={targetGrade}
            onChange={e => setTargetGrade(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Final Exam Weight (%)</label>
          <input
            type="number"
            value={finalExamWeight}
            onChange={e => setFinalExamWeight(parseFloat(e.target.value) || 1)}
            className="w-full border rounded-xl p-2.5 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <ResultCard
        label="Score Required on Final Exam"
        value={`${neededScore.toFixed(1)}%`}
        subtext={neededScore > 100 ? 'Requires extra credit' : neededScore <= 0 ? 'Already guaranteed target!' : 'Achievable with study!'}
        highlight
      />
    </div>
  );
};

// 3. Attendance & Class Bunk Tracker
const AttendanceCalcView: React.FC = () => {
  const [attended, setAttended] = useState(38);
  const [totalClasses, setTotalClasses] = useState(48);
  const [targetPercent, setTargetPercent] = useState(75);

  const currentPercent = totalClasses > 0 ? (attended / totalClasses) * 100 : 0;

  // If below target: how many consecutive classes to attend?
  // (attended + x) / (total + x) >= target/100
  // attended + x >= 0.75 total + 0.75 x
  // 0.25 x >= 0.75 total - attended
  // x = (target * total - 100 * attended) / (100 - target)
  let neededClasses = 0;
  let canBunk = 0;

  if (currentPercent < targetPercent) {
    neededClasses = Math.ceil((targetPercent * totalClasses - 100 * attended) / (100 - targetPercent));
  } else {
    // If above target: how many classes can you miss?
    // attended / (total + y) >= target/100
    // total + y <= 100 * attended / target
    canBunk = Math.floor((100 * attended) / targetPercent - totalClasses);
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Attended Classes</label>
          <input
            type="number"
            value={attended}
            onChange={e => setAttended(parseInt(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Total Classes</label>
          <input
            type="number"
            value={totalClasses}
            onChange={e => setTotalClasses(parseInt(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Goal (%)</label>
          <input
            type="number"
            value={targetPercent}
            onChange={e => setTargetPercent(parseFloat(e.target.value) || 75)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          label="Current Attendance"
          value={`${currentPercent.toFixed(1)}%`}
          subtext={currentPercent >= targetPercent ? 'Above minimum requirement' : 'Deficit attendance!'}
          highlight
        />
        {currentPercent >= targetPercent ? (
          <ResultCard
            label="Safe Classes You Can Miss"
            value={`${canBunk} classes`}
            subtext={`Attendance remains >= ${targetPercent}%`}
          />
        ) : (
          <ResultCard
            label="Consecutive Classes to Attend"
            value={`${neededClasses} classes`}
            subtext={`Required to recover to ${targetPercent}%`}
          />
        )}
      </div>
    </div>
  );
};

// 4. Pomodoro Study Timer
const PomodoroTimerView: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const timerRef = useRef<number | null>(null);

  const durations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            sounds.playSuccess();
            setIsRunning(false);
            if (mode === 'work') {
              setSessionsCompleted(s => s + 1);
              setMode('shortBreak');
              return durations.shortBreak;
            } else {
              setMode('work');
              return durations.work;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    sounds.playClick();
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(durations[newMode]);
  };

  const resetTimer = () => {
    sounds.playClick();
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  return (
    <div className="max-w-md mx-auto rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm text-center space-y-6">
      <div className="flex justify-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-medium">
        <button
          onClick={() => switchMode('work')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${mode === 'work' ? 'bg-white dark:bg-zinc-700 shadow-xs font-bold' : 'text-zinc-500'}`}
        >
          Study (25m)
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${mode === 'shortBreak' ? 'bg-white dark:bg-zinc-700 shadow-xs font-bold' : 'text-zinc-500'}`}
        >
          Short Break (5m)
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${mode === 'longBreak' ? 'bg-white dark:bg-zinc-700 shadow-xs font-bold' : 'text-zinc-500'}`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Big Circular or Digital Timer Display */}
      <div className="py-4">
        <div className="text-6xl sm:text-7xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mt-6">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-emerald-500 transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            sounds.playClick();
            setIsRunning(!isRunning);
          }}
          className="h-12 px-6 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold flex items-center gap-2 hover:opacity-90 shadow-sm transition-opacity"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          onClick={resetTimer}
          className="h-12 w-12 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-zinc-500">
        Completed Focus Sessions Today: <span className="font-bold text-zinc-900 dark:text-zinc-100">{sessionsCompleted}</span>
      </div>
    </div>
  );
};

// 5. Exam Countdown
interface ExamItem {
  id: string;
  name: string;
  date: string;
}

const ExamCountdownView: React.FC = () => {
  const [exams, setExams] = useState<ExamItem[]>([
    { id: '1', name: 'Calculus Final Exam', date: '2026-10-15T09:00' },
    { id: '2', name: 'Software Project Deadline', date: '2026-10-25T23:59' },
  ]);

  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('2026-11-01T10:00');

  const addExam = () => {
    if (!newName.trim() || !newDate) return;
    sounds.playClick();
    setExams([...exams, { id: String(Date.now()), name: newName.trim(), date: newDate }]);
    setNewName('');
  };

  const removeExam = (id: string) => {
    sounds.playClick();
    setExams(exams.filter(e => e.id !== id));
  };

  const getRemainingTime = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return 'Passed / Completed';
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    return `${d}d ${h}h ${m}m remaining`;
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Add Upcoming Exam / Deadline</h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Exam title (e.g. Physics Midterm)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="flex-1 border rounded-xl px-3 py-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
          <input
            type="datetime-local"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
          <button
            onClick={addExam}
            className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-xl hover:opacity-90"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {exams.map(e => (
          <div key={e.id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{e.name}</h4>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">{new Date(e.date).toLocaleString()}</p>
              <span className="inline-block mt-1 font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                {getRemainingTime(e.date)}
              </span>
            </div>
            <button onClick={() => removeExam(e.id)} className="p-2 text-zinc-400 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. Citation Generator (APA, MLA, Chicago, Harvard)
const CitationGeneratorView: React.FC = () => {
  const [style, setStyle] = useState<'APA' | 'MLA' | 'Chicago' | 'Harvard'>('APA');
  const [author, setAuthor] = useState('Smith, John');
  const [title, setTitle] = useState('The Principles of Artificial Intelligence');
  const [year, setYear] = useState('2024');
  const [publisher, setPublisher] = useState('Academic Press');
  const [copied, setCopied] = useState(false);

  let formattedCitation = '';
  if (style === 'APA') {
    formattedCitation = `${author} (${year}). ${title}. ${publisher}.`;
  } else if (style === 'MLA') {
    formattedCitation = `${author}. ${title}. ${publisher}, ${year}.`;
  } else if (style === 'Chicago') {
    formattedCitation = `${author}. ${year}. ${title}. City: ${publisher}.`;
  } else {
    // Harvard
    formattedCitation = `${author}, ${year}. ${title}. ${publisher}.`;
  }

  const copyCitation = () => {
    sounds.playClick();
    navigator.clipboard.writeText(formattedCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold">
          {(['APA', 'MLA', 'Chicago', 'Harvard'] as const).map(s => (
            <button
              key={s}
              onClick={() => { sounds.playClick(); setStyle(s); }}
              className={`flex-1 py-1.5 rounded-md transition-colors ${style === s ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-zinc-500'}`}
            >
              {s} 7
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Author (Last, First)</label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Year</label>
            <input
              type="text"
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-zinc-500 mb-1">Book / Document Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-zinc-500 mb-1">Publisher</label>
            <input
              type="text"
              value={publisher}
              onChange={e => setPublisher(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-500">{style} Formatted Citation</span>
          <button
            onClick={copyCitation}
            className="flex items-center gap-1 text-xs px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl font-serif text-sm text-zinc-900 dark:text-zinc-100 italic">
          {formattedCitation}
        </div>
      </div>
    </div>
  );
};

// 7. Random Group / Team Generator
const GroupGeneratorView: React.FC = () => {
  const [namesText, setNamesText] = useState('Alex, Jordan, Taylor, Morgan, Casey, Riley, Sam, Jamie, Dakota, Avery');
  const [numGroups, setNumGroups] = useState(3);
  const [generatedGroups, setGeneratedGroups] = useState<string[][]>([]);

  const handleGenerate = () => {
    sounds.playSuccess();
    const list = namesText
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(Boolean);

    // Shuffle
    const shuffled = [...list].sort(() => Math.random() - 0.5);

    const groups: string[][] = Array.from({ length: numGroups }, () => []);
    shuffled.forEach((name, index) => {
      groups[index % numGroups].push(name);
    });

    setGeneratedGroups(groups);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Enter Participant Names (separated by comma or newline)
        </label>
        <textarea
          rows={3}
          value={namesText}
          onChange={e => setNamesText(e.target.value)}
          className="w-full border rounded-xl p-3 text-sm font-sans bg-white dark:bg-zinc-950 dark:border-zinc-700"
        />

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Number of Groups:</span>
            <input
              type="number"
              min={1}
              max={20}
              value={numGroups}
              onChange={e => setNumGroups(parseInt(e.target.value) || 1)}
              className="w-16 text-center border rounded-lg py-1 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Shuffle className="w-3.5 h-3.5" /> Randomize Groups
          </button>
        </div>
      </div>

      {generatedGroups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {generatedGroups.map((grp, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Team {i + 1} ({grp.length})
              </h4>
              <ul className="space-y-1 text-xs">
                {grp.map((person, j) => (
                  <li key={j} className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 font-medium">
                    {person}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
