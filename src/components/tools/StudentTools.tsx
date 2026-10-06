import React, { useState, useEffect, useRef } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { triggerAppNotification } from '../../utils/notifications';
import { SubjectFormulasView } from './SubjectFormulasTool';
import { PdfDocumentTools } from './PdfDocumentTools';
import {
  Plus, Trash2, Play, Pause, RotateCcw, Shuffle, Copy, Check,
  Download, Undo2, Redo2, Square, Circle, Minus, ArrowRight,
  Eraser, Highlighter, Pen, Grid, Type, Paintbrush, Edit2, X, Move, StickyNote, Maximize2,
  BookOpen, Bookmark, Star, Calendar, Clock, MapPin, CheckCircle2, Heart, Sparkles, Bell, ExternalLink, Filter,
  Image as ImageIcon, Upload, Camera, Eye
} from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const StudentTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'study-formulas':
    case 'subject-formulas':
      return <SubjectFormulasView />;
    case 'pdf-converter-suite':
    case 'pdf-interchange-studio':
    case 'pdf-doc-converter':
      return <PdfDocumentTools toolId={toolId} />;
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
    case 'student-whiteboard':
      return <StudyWhiteboardView />;
    case 'book-reading-list':
    case 'book-lover-list':
      return <BookReadingListView />;
    case 'work-study-scheduler':
    case 'scheduler':
      return <WorkStudySchedulerView />;
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

// 2. Target Grade & Final Exam Calculator (Comprehensive Suite)
interface CourseComponent {
  id: string;
  name: string;
  weight: number;
  score: number;
}

const GRADE_PRESETS = [
  { letter: 'A', percent: 93, color: 'bg-emerald-500 text-white' },
  { letter: 'A-', percent: 90, color: 'bg-emerald-400 text-white' },
  { letter: 'B+', percent: 87, color: 'bg-blue-500 text-white' },
  { letter: 'B', percent: 83, color: 'bg-blue-400 text-white' },
  { letter: 'B-', percent: 80, color: 'bg-sky-500 text-white' },
  { letter: 'C+', percent: 77, color: 'bg-amber-500 text-white' },
  { letter: 'C', percent: 73, color: 'bg-amber-400 text-white' },
  { letter: 'Pass', percent: 60, color: 'bg-zinc-600 text-white' },
];

const getLetterForScore = (score: number) => {
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 60) return 'D';
  return 'F';
};

const TargetGradeCalcView: React.FC = () => {
  const [mode, setMode] = useState<'simple' | 'components'>('simple');
  const [currentGrade, setCurrentGrade] = useState(82);
  const [targetGrade, setTargetGrade] = useState(85);
  const [finalExamWeight, setFinalExamWeight] = useState(30);
  const [passingThreshold, setPassingThreshold] = useState(60);
  const [extraCredit, setExtraCredit] = useState(0);

  // Components breakdown mode
  const [components, setComponents] = useState<CourseComponent[]>([
    { id: '1', name: 'Assignments / Homework', weight: 20, score: 92 },
    { id: '2', name: 'Quizzes & Labs', weight: 15, score: 85 },
    { id: '3', name: 'Midterm Exam', weight: 25, score: 78 },
  ]);
  const [finalWeightInComponents, setFinalWeightInComponents] = useState(40);

  // Calculations for Simple Mode
  const w = Math.max(0.001, finalExamWeight / 100);
  // (Target - Current * (1 - w)) / w
  const effectiveTarget = targetGrade - extraCredit;
  const neededScore = (effectiveTarget - currentGrade * (1 - w)) / w;

  // Passing score calculation
  const passingNeeded = (passingThreshold - currentGrade * (1 - w)) / w;

  // Scenario Simulator
  const scenarioScores = [50, 60, 70, 80, 90, 100];
  const scenarios = scenarioScores.map(score => {
    const finalCourseGrade = currentGrade * (1 - w) + (score + extraCredit) * w;
    return {
      examScore: score,
      finalGrade: finalCourseGrade,
      letter: getLetterForScore(finalCourseGrade),
    };
  });

  // Calculations for Components Mode
  const totalCompletedWeight = components.reduce((acc, c) => acc + c.weight, 0);
  const weightedSum = components.reduce((acc, c) => acc + (c.score * c.weight) / 100, 0);
  const compCurrentGrade = totalCompletedWeight > 0 ? (weightedSum / totalCompletedWeight) * 100 : 0;
  const compFinalWeight = Math.max(1, 100 - totalCompletedWeight);
  const compNeeded = ((effectiveTarget - weightedSum) / compFinalWeight) * 100;

  const handleAddComponent = () => {
    sounds.playClick();
    const newComp: CourseComponent = {
      id: String(Date.now()),
      name: `Component ${components.length + 1}`,
      weight: 10,
      score: 85,
    };
    setComponents([...components, newComp]);
  };

  const handleRemoveComponent = (id: string) => {
    sounds.playClick();
    setComponents(components.filter(c => c.id !== id));
  };

  const handleUpdateComponent = (id: string, field: 'name' | 'weight' | 'score', value: any) => {
    setComponents(components.map(c => (c.id === id ? { ...c, [field]: value } : c)));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Mode Switcher */}
      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
        <button
          type="button"
          onClick={() => { sounds.playClick(); setMode('simple'); }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'simple'
              ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Simple Target & Final Exam
        </button>
        <button
          type="button"
          onClick={() => { sounds.playClick(); setMode('components'); }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'components'
              ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Weighted Syllabus Breakdown ({components.length} Items)
        </button>
      </div>

      {/* Target Letter Grade Quick Presets */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Target Grade Goal: {targetGrade}% ({getLetterForScore(targetGrade)})
          </span>
          <span className="text-[11px] text-zinc-400">Click any preset to apply</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {GRADE_PRESETS.map(p => (
            <button
              key={p.letter}
              type="button"
              onClick={() => {
                sounds.playClick();
                setTargetGrade(p.percent);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 ${
                targetGrade === p.percent
                  ? `${p.color} ring-2 ring-indigo-500/40 scale-105`
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {p.letter} ({p.percent}%)
            </button>
          ))}
        </div>
      </div>

      {mode === 'simple' ? (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Course Performance Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Current Grade (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={currentGrade}
                onChange={e => setCurrentGrade(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-base font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">Current Letter: {getLetterForScore(currentGrade)}</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Target Desired Grade (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={targetGrade}
                onChange={e => setTargetGrade(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-base font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">Target Letter: {getLetterForScore(targetGrade)}</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Final Exam Weight (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={finalExamWeight}
                onChange={e => setFinalExamWeight(parseFloat(e.target.value) || 1)}
                className="w-full border rounded-xl p-2.5 font-mono text-base font-bold bg-white dark:bg-zinc-950 dark:border-zinc-700"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">Worth {finalExamWeight}% of overall grade</span>
            </div>
          </div>

          {/* Extra Credit & Passing Threshold */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Anticipated Extra Credit (%)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={extraCredit}
                onChange={e => setExtraCredit(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 5"
                className="w-full border rounded-xl p-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700"
              />
              <span className="text-[10px] text-zinc-400">Bonus points added directly to final grade</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Minimum Passing Threshold (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={passingThreshold}
                onChange={e => setPassingThreshold(parseFloat(e.target.value) || 60)}
                className="w-full border rounded-xl p-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700"
              />
              <span className="text-[10px] text-zinc-400">Score required to maintain passing status (C or D)</span>
            </div>
          </div>
        </div>
      ) : (
        /* Components Breakdown Mode */
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Syllabus Components Breakdown
              </h3>
              <p className="text-xs text-zinc-400">
                Current weighted score: <strong className="text-zinc-900 dark:text-zinc-100">{compCurrentGrade.toFixed(1)}%</strong> ({getLetterForScore(compCurrentGrade)})
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddComponent}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="space-y-2.5">
            {components.map(c => (
              <div key={c.id} className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                <input
                  type="text"
                  value={c.name}
                  onChange={e => handleUpdateComponent(c.id, 'name', e.target.value)}
                  className="flex-1 text-xs font-semibold bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
                />
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-[11px] text-zinc-400">Weight:</span>
                  <input
                    type="number"
                    value={c.weight}
                    onChange={e => handleUpdateComponent(c.id, 'weight', parseFloat(e.target.value) || 0)}
                    className="w-14 p-1 rounded-lg border text-center font-mono font-bold bg-white dark:bg-zinc-900 dark:border-zinc-700"
                  />
                  <span className="text-zinc-400">%</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-[11px] text-zinc-400">Score:</span>
                  <input
                    type="number"
                    value={c.score}
                    onChange={e => handleUpdateComponent(c.id, 'score', parseFloat(e.target.value) || 0)}
                    className="w-14 p-1 rounded-lg border text-center font-mono font-bold bg-white dark:bg-zinc-900 dark:border-zinc-700"
                  />
                  <span className="text-zinc-400">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveComponent(c.id)}
                  className="p-1 text-zinc-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs flex justify-between items-center">
            <span className="font-semibold text-indigo-900 dark:text-indigo-200">
              Remaining Weight Assigned to Final Exam:
            </span>
            <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
              {compFinalWeight}%
            </span>
          </div>
        </div>
      )}

      {/* Primary Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          label={`Score Needed for Target ${targetGrade}% (${getLetterForScore(targetGrade)})`}
          value={`${(mode === 'simple' ? neededScore : compNeeded).toFixed(1)}%`}
          subtext={
            (mode === 'simple' ? neededScore : compNeeded) > 100
              ? 'Impossible without extra credit'
              : (mode === 'simple' ? neededScore : compNeeded) <= 0
              ? 'Target already guaranteed even with 0%!'
              : (mode === 'simple' ? neededScore : compNeeded) > 90
              ? 'Demanding: High study focus needed'
              : 'Very achievable with standard prep'
          }
          highlight
        />

        <ResultCard
          label={`Minimum Score to Pass Course (${passingThreshold}%)`}
          value={`${Math.max(0, passingNeeded).toFixed(1)}%`}
          subtext={
            passingNeeded <= 0
              ? 'Passing is already 100% mathematically locked in!'
              : `Must score at least ${passingNeeded.toFixed(1)}% to avoid retaking`
          }
        />
      </div>

      {/* Scenario Simulator Matrix */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Final Exam Outcome Simulator Matrix
          </h4>
          <span className="text-[11px] text-zinc-400">What if scenarios</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center">
          {scenarios.map(s => {
            const isTargetMet = s.finalGrade >= targetGrade;
            return (
              <div
                key={s.examScore}
                className={`p-3 rounded-2xl border transition-all ${
                  isTargetMet
                    ? 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40'
                }`}
              >
                <span className="text-[10px] font-bold text-zinc-400 block uppercase">
                  If you score
                </span>
                <span className="font-mono text-base font-extrabold text-zinc-900 dark:text-zinc-50 block">
                  {s.examScore}%
                </span>
                <div className="mt-1 pt-1 border-t border-zinc-200/60 dark:border-zinc-800">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                    {s.finalGrade.toFixed(1)}%
                  </span>
                  <span className={`text-[10px] font-extrabold ${isTargetMet ? 'text-emerald-600' : 'text-zinc-400'}`}>
                    Grade: {s.letter}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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
  const [exams, setExams] = useState<ExamItem[]>(() => {
    try {
      const saved = localStorage.getItem('omni_student_exams');
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'Calculus Final Exam', date: '2026-10-15T09:00' },
        { id: '2', name: 'Software Project Deadline', date: '2026-10-25T23:59' },
      ];
    } catch {
      return [
        { id: '1', name: 'Calculus Final Exam', date: '2026-10-15T09:00' },
        { id: '2', name: 'Software Project Deadline', date: '2026-10-25T23:59' },
      ];
    }
  });

  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('2026-11-01T10:00');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');

  const saveExamsToStorage = (updated: ExamItem[]) => {
    setExams(updated);
    try {
      localStorage.setItem('omni_student_exams', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const addExam = () => {
    if (!newName.trim() || !newDate) return;
    sounds.playSuccess();
    const updated = [...exams, { id: String(Date.now()), name: newName.trim(), date: newDate }];
    saveExamsToStorage(updated);
    setNewName('');
  };

  const removeExam = (id: string) => {
    sounds.playClick();
    const updated = exams.filter(e => e.id !== id);
    saveExamsToStorage(updated);
    if (editingId === id) setEditingId(null);
  };

  const startEdit = (e: ExamItem) => {
    sounds.playClick();
    setEditingId(e.id);
    setEditName(e.name);
    setEditDate(e.date);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim() || !editDate) return;
    sounds.playSuccess();
    const updated = exams.map(e => (e.id === id ? { ...e, name: editName.trim(), date: editDate } : e));
    saveExamsToStorage(updated);
    setEditingId(null);
  };

  const cancelEdit = () => {
    sounds.playClick();
    setEditingId(null);
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
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3 shadow-xs">
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
            className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-xl hover:opacity-90 cursor-pointer shadow-xs active:scale-95"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {exams.map(e => {
          const isEditing = editingId === e.id;
          return (
            <div key={e.id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 transition-all shadow-xs">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
                    <span>Edit Exam Countdown</span>
                    <button onClick={cancelEdit} className="text-zinc-400 hover:text-zinc-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={ev => setEditName(ev.target.value)}
                      className="flex-1 border rounded-xl px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 font-semibold"
                    />
                    <input
                      type="datetime-local"
                      value={editDate}
                      onChange={ev => setEditDate(ev.target.value)}
                      className="border rounded-xl px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 font-mono"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(e.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{e.name}</h4>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">{new Date(e.date).toLocaleString()}</p>
                    <span className="inline-block mt-1 font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      {getRemainingTime(e.date)}
                    </span>
                  </div>
                  {/* Edit button beside delete button! */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(e)}
                      className="p-2 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit exam details"
                      aria-label="Edit exam details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExam(e.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete exam"
                      aria-label="Delete exam"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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

// 8. Interactive Study Whiteboard (Item 19: Full Whiteboard with Drawing, Shapes, Highlighter, Grids & Export)
type WhiteboardTool = 'select' | 'pen' | 'highlighter' | 'eraser' | 'line' | 'arrow' | 'rect' | 'circle' | 'text' | 'sticky';
type GridStyle = 'plain' | 'dots' | 'ruled' | 'grid' | 'blackboard';

interface MovableObject {
  id: string;
  type: 'text' | 'sticky' | 'rect' | 'circle';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 5-90
  height: number; // percentage 5-90
  text?: string;
  color: string;
  bg?: string;
  strokeWidth?: number;
  isEditing?: boolean;
}

const PRESET_COLORS = [
  '#0f172a', // Slate / Black
  '#2563eb', // Royal Blue
  '#dc2626', // Crimson Red
  '#16a34a', // Forest Green
  '#d97706', // Amber Gold
  '#9333ea', // Purple
  '#0891b2', // Teal / Cyan
  '#e11d48', // Rose Pink
  '#ffffff', // Chalk White
];

const StudyWhiteboardView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tool, setTool] = useState<WhiteboardTool>('pen');
  const [color, setColor] = useState('#2563eb');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [gridStyle, setGridStyle] = useState<GridStyle>('grid');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Movable and Resizable Objects State
  const [objects, setObjects] = useState<MovableObject[]>([
    {
      id: '1',
      type: 'sticky',
      x: 8,
      y: 10,
      width: 22,
      height: 24,
      text: '📌 Formula:\nE = mc²\nF = ma',
      color: '#854d0e',
      bg: '#fef08a',
    },
    {
      id: '2',
      type: 'text',
      x: 35,
      y: 10,
      width: 26,
      height: 14,
      text: 'Final Exam Review Topics',
      color: '#2563eb',
    },
    {
      id: '3',
      type: 'rect',
      x: 65,
      y: 10,
      width: 26,
      height: 32,
      text: 'Architecture Block',
      color: '#2563eb',
      bg: 'rgba(37, 99, 235, 0.08)',
      strokeWidth: 3,
    },
    {
      id: '4',
      type: 'circle',
      x: 35,
      y: 40,
      width: 22,
      height: 32,
      text: 'Core Concept',
      color: '#dc2626',
      bg: 'rgba(220, 38, 38, 0.08)',
      strokeWidth: 3,
    },
  ]);

  // Object dragging & resizing state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number; objX: number; objY: number } | null>(null);
  const resizeStartRef = useRef<{ clientX: number; clientY: number; startW: number; startH: number } | null>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1000;
    const height = 620;
    canvas.width = width;
    canvas.height = height;

    redrawBackground(ctx, width, height, gridStyle);

    const initialSnap = ctx.getImageData(0, 0, width, height);
    setHistory([initialSnap]);
    setHistoryIndex(0);
  }, []);

  // Update background when grid style changes
  const redrawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, style: GridStyle) => {
    if (style === 'blackboard') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#334155';
      for (let x = 20; x < width; x += 25) {
        for (let y = 20; y < height; y += 25) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }
      return;
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    if (style === 'dots') {
      ctx.fillStyle = '#cbd5e1';
      for (let x = 20; x < width; x += 25) {
        for (let y = 20; y < height; y += 25) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }
    } else if (style === 'ruled') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let y = 35; y < height; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.lineTo(60, height);
      ctx.stroke();
    } else if (style === 'grid') {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 20; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 20; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const saveHistoryStep = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const currentSnap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const updated = history.slice(0, historyIndex + 1);
    updated.push(currentSnap);
    if (updated.length > 25) updated.shift();
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (tool === 'select') return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    const rect = container.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const relX = Math.min(85, Math.max(5, ((clientX - rect.left) / rect.width) * 100));
    const relY = Math.min(85, Math.max(5, ((clientY - rect.top) / rect.height) * 100));

    // Handle Text, Sticky note, Rect or Circle creation directly
    if (tool === 'text') {
      sounds.playClick();
      const newObj: MovableObject = {
        id: String(Date.now()),
        type: 'text',
        x: relX,
        y: relY,
        width: 25,
        height: 14,
        text: 'Type note here...',
        color: gridStyle === 'blackboard' && color === '#0f172a' ? '#ffffff' : color,
        isEditing: true,
      };
      setObjects(prev => [...prev, newObj]);
      setTool('select');
      return;
    }

    if (tool === 'sticky') {
      sounds.playClick();
      const newObj: MovableObject = {
        id: String(Date.now()),
        type: 'sticky',
        x: relX,
        y: relY,
        width: 24,
        height: 24,
        text: 'Sticky Note\n- Important concept\n- Drag anywhere!',
        color: '#854d0e',
        bg: '#fef08a',
        isEditing: true,
      };
      setObjects(prev => [...prev, newObj]);
      setTool('select');
      return;
    }

    if (tool === 'rect') {
      sounds.playClick();
      const newObj: MovableObject = {
        id: String(Date.now()),
        type: 'rect',
        x: relX,
        y: relY,
        width: 24,
        height: 28,
        text: 'Rectangle',
        color: gridStyle === 'blackboard' && color === '#0f172a' ? '#ffffff' : color,
        bg: 'rgba(99, 102, 241, 0.08)',
        strokeWidth,
      };
      setObjects(prev => [...prev, newObj]);
      setTool('select');
      return;
    }

    if (tool === 'circle') {
      sounds.playClick();
      const newObj: MovableObject = {
        id: String(Date.now()),
        type: 'circle',
        x: relX,
        y: relY,
        width: 24,
        height: 30,
        text: 'Circle',
        color: gridStyle === 'blackboard' && color === '#0f172a' ? '#ffffff' : color,
        bg: 'rgba(99, 102, 241, 0.08)',
        strokeWidth,
      };
      setObjects(prev => [...prev, newObj]);
      setTool('select');
      return;
    }

    setIsDrawing(true);
    setStartPos(coords);
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (tool === 'pen' || tool === 'highlighter' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);

    if (tool === 'pen') {
      ctx.strokeStyle = gridStyle === 'blackboard' && color === '#0f172a' ? '#ffffff' : color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1.0;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = color === '#0f172a' ? '#facc15' : color;
      ctx.lineWidth = strokeWidth * 4;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'miter';
      ctx.globalAlpha = 0.35;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.strokeStyle = gridStyle === 'blackboard' ? '#0f172a' : '#ffffff';
      ctx.lineWidth = strokeWidth * 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1.0;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (snapshot) {
      ctx.putImageData(snapshot, 0, 0);
      ctx.strokeStyle = gridStyle === 'blackboard' && color === '#0f172a' ? '#ffffff' : color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 1.0;

      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (tool === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();

        const angle = Math.atan2(coords.y - startPos.y, coords.x - startPos.x);
        const headLen = Math.max(10, strokeWidth * 3);
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        ctx.lineTo(coords.x - headLen * Math.cos(angle - Math.PI / 6), coords.y - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(coords.x, coords.y);
        ctx.lineTo(coords.x - headLen * Math.cos(angle + Math.PI / 6), coords.y - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.beginPath();
        ctx.strokeRect(startPos.x, startPos.y, coords.x - startPos.x, coords.y - startPos.y);
      } else if (tool === 'circle') {
        const radiusX = Math.abs(coords.x - startPos.x) / 2;
        const radiusY = Math.abs(coords.y - startPos.y) / 2;
        const centerX = Math.min(startPos.x, coords.x) + radiusX;
        const centerY = Math.min(startPos.y, coords.y) + radiusY;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  const handleEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStartPos(null);
    setSnapshot(null);
    saveHistoryStep();
  };

  // Object Drag Handlers with Mouse & Touch
  const handleObjectDragStart = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const obj = objects.find(o => o.id === id);
    if (!obj) return;

    setDraggingId(id);
    dragStartRef.current = {
      clientX,
      clientY,
      objX: obj.x,
      objY: obj.y,
    };
  };

  // Object Resize Handlers (Mouse & Touch on bottom-right corner)
  const handleObjectResizeStart = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const obj = objects.find(o => o.id === id);
    if (!obj) return;

    setResizingId(id);
    resizeStartRef.current = {
      clientX,
      clientY,
      startW: obj.width,
      startH: obj.height,
    };
  };

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;

      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const rect = containerRef.current.getBoundingClientRect();

      // Handle Resizing
      if (resizingId && resizeStartRef.current) {
        const deltaW = ((clientX - resizeStartRef.current.clientX) / rect.width) * 100;
        const deltaH = ((clientY - resizeStartRef.current.clientY) / rect.height) * 100;

        const newW = Math.min(85, Math.max(8, resizeStartRef.current.startW + deltaW));
        const newH = Math.min(85, Math.max(8, resizeStartRef.current.startH + deltaH));

        setObjects(prev =>
          prev.map(o => (o.id === resizingId ? { ...o, width: newW, height: newH } : o))
        );
        return;
      }

      // Handle Dragging
      if (draggingId && dragStartRef.current) {
        const deltaX = ((clientX - dragStartRef.current.clientX) / rect.width) * 100;
        const deltaY = ((clientY - dragStartRef.current.clientY) / rect.height) * 100;

        const newX = Math.min(92, Math.max(0, dragStartRef.current.objX + deltaX));
        const newY = Math.min(92, Math.max(0, dragStartRef.current.objY + deltaY));

        setObjects(prev =>
          prev.map(o => (o.id === draggingId ? { ...o, x: newX, y: newY } : o))
        );
      }
    };

    const handlePointerUp = () => {
      if (draggingId) {
        setDraggingId(null);
        dragStartRef.current = null;
      }
      if (resizingId) {
        setResizingId(null);
        resizeStartRef.current = null;
      }
    };

    if (draggingId || resizingId) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [draggingId, resizingId]);

  const handleUpdateObjectText = (id: string, text: string) => {
    setObjects(prev => prev.map(o => (o.id === id ? { ...o, text } : o)));
  };

  const handleRemoveObject = (id: string) => {
    sounds.playClick();
    setObjects(prev => prev.filter(o => o.id !== id));
  };

  const handleAddStickyQuick = () => {
    sounds.playClick();
    const newObj: MovableObject = {
      id: String(Date.now()),
      type: 'sticky',
      x: 35 + Math.random() * 20,
      y: 30 + Math.random() * 20,
      width: 24,
      height: 24,
      text: 'New Sticky Note',
      color: '#854d0e',
      bg: '#fef08a',
      isEditing: true,
    };
    setObjects(prev => [...prev, newObj]);
  };

  const handleAddTextQuick = () => {
    sounds.playClick();
    const newObj: MovableObject = {
      id: String(Date.now()),
      type: 'text',
      x: 35 + Math.random() * 20,
      y: 30 + Math.random() * 20,
      width: 25,
      height: 14,
      text: 'Key Exam Note',
      color: gridStyle === 'blackboard' && color === '#0f172a' ? '#ffffff' : color,
      isEditing: true,
    };
    setObjects(prev => [...prev, newObj]);
  };

  const handleAddRectQuick = () => {
    sounds.playClick();
    const newObj: MovableObject = {
      id: String(Date.now()),
      type: 'rect',
      x: 30 + Math.random() * 20,
      y: 25 + Math.random() * 20,
      width: 26,
      height: 30,
      text: 'Rectangle',
      color: gridStyle === 'blackboard' && color === '#0f172a' ? '#ffffff' : color,
      bg: 'rgba(99, 102, 241, 0.08)',
      strokeWidth,
    };
    setObjects(prev => [...prev, newObj]);
  };

  const handleAddCircleQuick = () => {
    sounds.playClick();
    const newObj: MovableObject = {
      id: String(Date.now()),
      type: 'circle',
      x: 30 + Math.random() * 20,
      y: 25 + Math.random() * 20,
      width: 24,
      height: 32,
      text: 'Circle',
      color: gridStyle === 'blackboard' && color === '#0f172a' ? '#ffffff' : color,
      bg: 'rgba(99, 102, 241, 0.08)',
      strokeWidth,
    };
    setObjects(prev => [...prev, newObj]);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      sounds.playClick();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const prev = history[historyIndex - 1];
      ctx.putImageData(prev, 0, 0);
      setHistoryIndex(i => i - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      sounds.playClick();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const next = history[historyIndex + 1];
      ctx.putImageData(next, 0, 0);
      setHistoryIndex(i => i + 1);
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear whiteboard drawings and movable notes?')) {
      sounds.playClick();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      redrawBackground(ctx, canvas.width, canvas.height, gridStyle);
      setObjects([]);
      saveHistoryStep();
    }
  };

  // Render combined high-res canvas with drawings AND movable objects
  const getCombinedCanvas = (): HTMLCanvasElement | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return null;

    // 1. Draw canvas background and strokes
    ctx.drawImage(canvas, 0, 0);

    // 2. Draw movable & resizable objects over the top
    objects.forEach(obj => {
      const pxX = (obj.x / 100) * exportCanvas.width;
      const pxY = (obj.y / 100) * exportCanvas.height;
      const pxW = (obj.width / 100) * exportCanvas.width;
      const pxH = (obj.height / 100) * exportCanvas.height;

      if (obj.type === 'rect') {
        if (obj.bg) {
          ctx.fillStyle = obj.bg;
          ctx.fillRect(pxX, pxY, pxW, pxH);
        }
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = obj.strokeWidth || 3;
        ctx.strokeRect(pxX, pxY, pxW, pxH);

        if (obj.text) {
          ctx.fillStyle = obj.color;
          ctx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
          ctx.fillText(obj.text, pxX + 12, pxY + 28);
        }
      } else if (obj.type === 'circle') {
        const radiusX = pxW / 2;
        const radiusY = pxH / 2;
        const centerX = pxX + radiusX;
        const centerY = pxY + radiusY;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        if (obj.bg) {
          ctx.fillStyle = obj.bg;
          ctx.fill();
        }
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = obj.strokeWidth || 3;
        ctx.stroke();

        if (obj.text) {
          ctx.fillStyle = obj.color;
          ctx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(obj.text, centerX, centerY + 5);
          ctx.textAlign = 'start';
        }
      } else if (obj.type === 'sticky') {
        ctx.fillStyle = obj.bg || '#fef08a';
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.fillRect(pxX, pxY, pxW, pxH);
        ctx.strokeRect(pxX, pxY, pxW, pxH);

        ctx.fillStyle = obj.color;
        ctx.font = 'bold 14px Plus Jakarta Sans, sans-serif';
        const lines = (obj.text || '').split('\n');
        lines.forEach((line, lIdx) => {
          ctx.fillText(line, pxX + 12, pxY + 24 + lIdx * 18);
        });
      } else {
        // text object
        ctx.fillStyle = obj.color;
        ctx.font = 'bold 16px Plus Jakarta Sans, sans-serif';
        const lines = (obj.text || '').split('\n');
        lines.forEach((line, lIdx) => {
          ctx.fillText(line, pxX + 10, pxY + 22 + lIdx * 20);
        });
      }
    });

    return exportCanvas;
  };

  const handleDownload = () => {
    sounds.playSuccess();
    const exportCanvas = getCombinedCanvas();
    if (!exportCanvas) return;
    const a = document.createElement('a');
    a.href = exportCanvas.toDataURL('image/png');
    a.download = `omnitoolbox-study-whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
  };

  const handleCopyImage = async () => {
    const exportCanvas = getCombinedCanvas();
    if (!exportCanvas) return;
    try {
      exportCanvas.toBlob(blob => {
        if (!blob) return;
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        sounds.playSuccess();
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 2000);
      });
    } catch {
      handleDownload();
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto select-none">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Interactive Study Whiteboard & Movable Scratchpad
          </h2>
          <span className="text-[11px] text-zinc-400">
            Drag movable notes & text anywhere with mouse or touch. Sketch freely with pens, highlighters & shapes.
          </span>
        </div>
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-30 cursor-pointer shadow-2xs"
            title="Undo stroke"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-30 cursor-pointer shadow-2xs"
            title="Redo stroke"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClear}
            className="px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="Clear all drawings"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
          <button
            onClick={handleCopyImage}
            className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="Copy whiteboard image"
          >
            {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSuccess ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
            title="Download full resolution image with notes"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Drawing & Object Tools */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl">
          <button
            onClick={() => { sounds.playClick(); setTool('select'); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              tool === 'select' ? 'bg-white dark:bg-zinc-950 text-indigo-600 dark:text-indigo-400 shadow-2xs ring-1 ring-indigo-500/30' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
            title="Move & Drag Objects (Mouse or Touch)"
          >
            <Move className="w-3.5 h-3.5" /> Move
          </button>
          <button
            onClick={() => { sounds.playClick(); setTool('pen'); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              tool === 'pen' ? 'bg-white dark:bg-zinc-950 text-indigo-600 dark:text-indigo-400 shadow-2xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
            title="Pen Tool"
          >
            <Pen className="w-3.5 h-3.5" /> Pen
          </button>
          <button
            onClick={() => { sounds.playClick(); setTool('highlighter'); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              tool === 'highlighter' ? 'bg-white dark:bg-zinc-950 text-amber-500 shadow-2xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
            title="Translucent Highlighter"
          >
            <Highlighter className="w-3.5 h-3.5" /> Highlight
          </button>
          <button
            onClick={() => { sounds.playClick(); setTool('eraser'); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              tool === 'eraser' ? 'bg-white dark:bg-zinc-950 text-rose-500 shadow-2xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
            title="Eraser Tool"
          >
            <Eraser className="w-3.5 h-3.5" /> Eraser
          </button>
          <button
            onClick={() => { sounds.playClick(); setTool('line'); }}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${tool === 'line' ? 'bg-white dark:bg-zinc-950 text-indigo-600 shadow-2xs' : 'text-zinc-500'}`}
            title="Straight Line"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { sounds.playClick(); setTool('arrow'); }}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${tool === 'arrow' ? 'bg-white dark:bg-zinc-950 text-indigo-600 shadow-2xs' : 'text-zinc-500'}`}
            title="Arrow"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { sounds.playClick(); setTool('rect'); }}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${tool === 'rect' ? 'bg-white dark:bg-zinc-950 text-indigo-600 shadow-2xs' : 'text-zinc-500'}`}
            title="Rectangle"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { sounds.playClick(); setTool('circle'); }}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${tool === 'circle' ? 'bg-white dark:bg-zinc-950 text-indigo-600 shadow-2xs' : 'text-zinc-500'}`}
            title="Circle"
          >
            <Circle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { sounds.playClick(); setTool('text'); }}
            className={`px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              tool === 'text' ? 'bg-white dark:bg-zinc-950 text-indigo-600 shadow-2xs ring-1 ring-indigo-500/40' : 'text-zinc-500 hover:text-zinc-900'
            }`}
            title="Click on canvas to add movable Text"
          >
            <Type className="w-3.5 h-3.5" /> Text
          </button>
          <button
            onClick={() => { sounds.playClick(); setTool('sticky'); }}
            className={`px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              tool === 'sticky' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 shadow-2xs ring-1 ring-amber-500/40' : 'text-zinc-500 hover:text-zinc-900'
            }`}
            title="Click on canvas to add movable Sticky Note"
          >
            <StickyNote className="w-3.5 h-3.5 text-amber-500" /> Sticky
          </button>
        </div>

        {/* Quick Add Buttons (Clean Icons with Tooltips) */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={handleAddTextQuick}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:border-indigo-400 cursor-pointer shadow-2xs transition-all active:scale-95"
            title="Add Movable & Resizable Text"
            aria-label="Add Text"
          >
            <Type className="w-3.5 h-3.5 text-indigo-500" />
          </button>
          <button
            type="button"
            onClick={handleAddStickyQuick}
            className="p-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 hover:border-amber-500 cursor-pointer shadow-2xs transition-all active:scale-95"
            title="Add Movable & Resizable Sticky Note"
            aria-label="Add Sticky Note"
          >
            <StickyNote className="w-3.5 h-3.5 text-amber-600" />
          </button>
          <button
            type="button"
            onClick={handleAddRectQuick}
            className="p-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 cursor-pointer shadow-2xs transition-all active:scale-95"
            title="Add Movable & Resizable Rectangle"
            aria-label="Add Rectangle"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleAddCircleQuick}
            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:border-rose-500 cursor-pointer shadow-2xs transition-all active:scale-95"
            title="Add Movable & Resizable Circle"
            aria-label="Add Circle"
          >
            <Circle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1.5">
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              onClick={() => { sounds.playClick(); setColor(c); }}
              className={`w-5 h-5 rounded-full border border-black/10 dark:border-white/10 transition-transform ${
                color === c ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-900' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="w-6 h-6 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
            title="Custom Color"
          />
        </div>

        {/* Stroke Width Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-zinc-400">Size:</span>
          {[2, 4, 8, 16].map(size => (
            <button
              key={size}
              onClick={() => setStrokeWidth(size)}
              className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                strokeWidth === size
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {size}px
            </button>
          ))}
        </div>

        {/* Background Grid Style */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-zinc-400">Board:</span>
          <select
            value={gridStyle}
            onChange={e => {
              const newStyle = e.target.value as GridStyle;
              setGridStyle(newStyle);
              const canvas = canvasRef.current;
              if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  redrawBackground(ctx, canvas.width, canvas.height, newStyle);
                  saveHistoryStep();
                }
              }
            }}
            className="text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-1.5 text-zinc-700 dark:text-zinc-300 focus:outline-indigo-500"
          >
            <option value="grid">Grid (Math/Engineering)</option>
            <option value="dots">Dotted Matrix</option>
            <option value="ruled">Ruled Lined Paper</option>
            <option value="plain">Clean Whiteboard</option>
            <option value="blackboard">Dark Blackboard</option>
          </select>
        </div>
      </div>

      {/* Main Canvas & Movable Interactive Objects Stage */}
      <div
        ref={containerRef}
        className="relative rounded-3xl border border-zinc-300 dark:border-zinc-800 overflow-hidden shadow-lg bg-zinc-100 dark:bg-zinc-950 flex justify-center items-center p-1 sm:p-2 select-none"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={e => {
            e.preventDefault();
            handleStart(e);
          }}
          onTouchMove={e => {
            e.preventDefault();
            handleMove(e);
          }}
          onTouchEnd={handleEnd}
          className={`w-full h-auto aspect-[1000/620] max-h-[640px] rounded-2xl shadow-inner touch-none ${
            tool === 'select' ? 'cursor-default' : 'cursor-crosshair'
          }`}
        />

        {/* Movable & Resizable Objects Overlay Layer (Movable & Resizable via Mouse or Touch) */}
        {objects.map(obj => {
          const isDraggingThis = draggingId === obj.id;
          const isResizingThis = resizingId === obj.id;
          const isShape = obj.type === 'rect' || obj.type === 'circle';

          return (
            <div
              key={obj.id}
              style={{
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                width: `${obj.width}%`,
                height: `${obj.height}%`,
                backgroundColor: obj.bg,
                borderColor: isShape ? obj.color : undefined,
                borderWidth: isShape ? `${obj.strokeWidth || 3}px` : undefined,
                borderRadius: obj.type === 'circle' ? '9999px' : obj.type === 'sticky' ? '1rem' : '0.75rem',
              }}
              onMouseDown={e => handleObjectDragStart(obj.id, e)}
              onTouchStart={e => handleObjectDragStart(obj.id, e)}
              className={`absolute group z-20 transition-shadow select-none flex flex-col justify-between overflow-hidden ${
                isDraggingThis || isResizingThis
                  ? 'scale-[1.01] shadow-2xl ring-2 ring-indigo-500 cursor-grabbing'
                  : 'cursor-grab'
              } ${
                obj.type === 'sticky'
                  ? 'p-2 border-2 border-amber-300/80 shadow-md'
                  : obj.type === 'text'
                  ? 'p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs border border-zinc-300 dark:border-zinc-700 shadow-sm'
                  : 'p-2 shadow-sm'
              }`}
            >
              {/* Top Handle Bar */}
              <div className="flex items-center justify-between gap-1 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
                <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-600 dark:text-zinc-300 bg-white/80 dark:bg-black/50 px-1 py-0.5 rounded-md">
                  <Move className="w-2.5 h-2.5" />
                  <span className="capitalize">{obj.type}</span>
                </div>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveObject(obj.id);
                  }}
                  className="p-1 rounded-full bg-white/80 dark:bg-black/50 text-zinc-400 hover:text-rose-600 cursor-pointer"
                  title="Remove this object"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Editable Text / Label Area */}
              <div className="flex-1 min-h-0 flex items-center justify-center p-0.5">
                <textarea
                  value={obj.text || ''}
                  onChange={e => handleUpdateObjectText(obj.id, e.target.value)}
                  className="w-full h-full bg-transparent resize-none border-0 p-0 text-center text-xs sm:text-sm font-semibold focus:outline-none leading-snug"
                  style={{ color: obj.color }}
                  placeholder={obj.type === 'rect' ? 'Rectangle Label...' : obj.type === 'circle' ? 'Circle Label...' : 'Type note...'}
                  onMouseDown={e => e.stopPropagation()}
                  onTouchStart={e => e.stopPropagation()}
                />
              </div>

              {/* Bottom Right Resize Handle */}
              <div
                onMouseDown={e => handleObjectResizeStart(obj.id, e)}
                onTouchStart={e => handleObjectResizeStart(obj.id, e)}
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-zinc-800/80 dark:bg-zinc-200/80 text-white dark:text-zinc-900 flex items-center justify-center cursor-se-resize shadow-md opacity-70 group-hover:opacity-100 transition-opacity z-30"
                title="Drag to resize this object"
              >
                <Maximize2 className="w-2.5 h-2.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Hint */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-400 px-2">
        <span>💡 Objects (<strong>Rectangle</strong>, <strong>Circle</strong>, <strong>Text</strong>, <strong>Sticky</strong>) are movable and resizable! Drag anywhere to move, or drag bottom-right corner to resize.</span>
        <span>Resolution: 1000 × 620 HD Canvas</span>
      </div>
    </div>
  );
};

// 9. Book Lover Reading List & Library Tracker (Item 3: Collect Books to Read Later, Reading Progress & Add/Delete Beside Each + Cover Image System)
export interface BookItem {
  id: string;
  title: string;
  author: string;
  genre: string;
  totalPages: number;
  currentPage: number;
  status: 'want-to-read' | 'reading' | 'finished';
  rating: number; // 0 to 5
  notes?: string;
  isFavorite: boolean;
  addedAt: string;
  coverImage?: string; // base64 data URL or external URL
  coverTheme?: 'indigo' | 'emerald' | 'amber' | 'ruby' | 'violet' | 'slate';
}

const DEFAULT_BOOK_PICKS: BookItem[] = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Improvement',
    totalPages: 320,
    currentPage: 215,
    status: 'reading',
    rating: 5,
    isFavorite: true,
    notes: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    addedAt: '2026-09-15',
    coverTheme: 'amber',
  },
  {
    id: '2',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Sci-Fi',
    totalPages: 680,
    currentPage: 0,
    status: 'want-to-read',
    rating: 0,
    isFavorite: false,
    notes: 'Epic science fiction classic exploring ecology, politics, and power.',
    addedAt: '2026-09-20',
    coverTheme: 'indigo',
  },
  {
    id: '3',
    title: 'Deep Work: Rules for Focused Success',
    author: 'Cal Newport',
    genre: 'Productivity',
    totalPages: 304,
    currentPage: 304,
    status: 'finished',
    rating: 5,
    isFavorite: true,
    notes: 'The ability to perform deep work is becoming increasingly rare and valuable in our economy.',
    addedAt: '2026-08-10',
    coverTheme: 'emerald',
  },
  {
    id: '4',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic Literature',
    totalPages: 336,
    currentPage: 0,
    status: 'want-to-read',
    rating: 0,
    isFavorite: false,
    addedAt: '2026-09-28',
    coverTheme: 'ruby',
  },
];

const POPULAR_RECOMMENDATIONS = [
  { title: '1984', author: 'George Orwell', genre: 'Dystopian', pages: 328, coverTheme: 'slate' as const },
  { title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'Finance', pages: 256, coverTheme: 'emerald' as const },
  { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', genre: 'History', pages: 464, coverTheme: 'amber' as const },
  { title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fiction', pages: 304, coverTheme: 'violet' as const },
];

const THEME_STYLES: Record<string, { bg: string; text: string; spine: string }> = {
  indigo: { bg: 'from-indigo-600 via-indigo-700 to-indigo-900', text: 'text-indigo-100', spine: 'bg-indigo-950' },
  emerald: { bg: 'from-emerald-600 via-emerald-700 to-emerald-900', text: 'text-emerald-100', spine: 'bg-emerald-950' },
  amber: { bg: 'from-amber-600 via-amber-700 to-amber-900', text: 'text-amber-100', spine: 'bg-amber-950' },
  ruby: { bg: 'from-rose-600 via-rose-700 to-rose-950', text: 'text-rose-100', spine: 'bg-rose-950' },
  violet: { bg: 'from-purple-600 via-purple-700 to-purple-950', text: 'text-purple-100', spine: 'bg-purple-950' },
  slate: { bg: 'from-zinc-700 via-zinc-800 to-zinc-950', text: 'text-zinc-200', spine: 'bg-black' },
};

const BookReadingListView: React.FC = () => {
  const [books, setBooks] = useState<BookItem[]>(() => {
    try {
      const saved = localStorage.getItem('omni_book_reading_list');
      return saved ? JSON.parse(saved) : DEFAULT_BOOK_PICKS;
    } catch {
      return DEFAULT_BOOK_PICKS;
    }
  });

  const [activeTab, setActiveTab] = useState<'all' | 'want-to-read' | 'reading' | 'finished'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Editing cover modal state
  const [editingCoverBookId, setEditingCoverBookId] = useState<string | null>(null);
  const [editCoverUrl, setEditCoverUrl] = useState('');
  const [zoomCoverUrl, setZoomCoverUrl] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [totalPages, setTotalPages] = useState('300');
  const [notes, setNotes] = useState('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [coverTheme, setCoverTheme] = useState<'indigo' | 'emerald' | 'amber' | 'ruby' | 'violet' | 'slate'>('indigo');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const saveBooks = (updated: BookItem[]) => {
    setBooks(updated);
    localStorage.setItem('omni_book_reading_list', JSON.stringify(updated));
  };

  // Handle local image file upload (converts to base64 for persistent localStorage)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (isEditing && editingCoverBookId) {
        handleSaveCover(editingCoverBookId, base64);
      } else {
        setCoverImage(base64);
      }
      sounds.playSuccess();
    };
    reader.readAsDataURL(file);
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playSuccess();
    const newBook: BookItem = {
      id: String(Date.now()),
      title: title.trim(),
      author: author.trim() || 'Unknown Author',
      genre,
      totalPages: parseInt(totalPages, 10) || 100,
      currentPage: 0,
      status: 'want-to-read',
      rating: 0,
      isFavorite: false,
      notes: notes.trim() || undefined,
      addedAt: new Date().toISOString().slice(0, 10),
      coverImage: coverImage.trim() || undefined,
      coverTheme,
    };

    saveBooks([newBook, ...books]);
    setTitle('');
    setAuthor('');
    setNotes('');
    setCoverImage('');
    setShowAddModal(false);
  };

  const handleDeleteBook = (id: string) => {
    sounds.playClick();
    const updated = books.filter(b => b.id !== id);
    saveBooks(updated);
  };

  const handleQuickAdd = (rec: { title: string; author: string; genre: string; pages: number; coverTheme: 'indigo' | 'emerald' | 'amber' | 'ruby' | 'violet' | 'slate' }) => {
    sounds.playSuccess();
    const newBook: BookItem = {
      id: String(Date.now()),
      title: rec.title,
      author: rec.author,
      genre: rec.genre,
      totalPages: rec.pages,
      currentPage: 0,
      status: 'want-to-read',
      rating: 0,
      isFavorite: false,
      addedAt: new Date().toISOString().slice(0, 10),
      coverTheme: rec.coverTheme,
    };
    saveBooks([newBook, ...books]);
  };

  const handleStatusChange = (id: string, newStatus: 'want-to-read' | 'reading' | 'finished') => {
    sounds.playClick();
    const updated = books.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: newStatus,
          currentPage: newStatus === 'finished' ? b.totalPages : newStatus === 'want-to-read' ? 0 : b.currentPage,
        };
      }
      return b;
    });
    saveBooks(updated);
  };

  const handleProgressStep = (id: string, delta: number) => {
    sounds.playClick();
    const updated = books.map(b => {
      if (b.id === id) {
        const next = Math.max(0, Math.min(b.totalPages, b.currentPage + delta));
        const nextStatus = next >= b.totalPages ? 'finished' : next > 0 ? 'reading' : b.status;
        return { ...b, currentPage: next, status: nextStatus };
      }
      return b;
    });
    saveBooks(updated);
  };

  const handleSaveCover = (bookId: string, newCoverUrl: string) => {
    sounds.playSuccess();
    const updated = books.map(b => {
      if (b.id === bookId) {
        return { ...b, coverImage: newCoverUrl || undefined };
      }
      return b;
    });
    saveBooks(updated);
    setEditingCoverBookId(null);
    setEditCoverUrl('');
  };

  const filteredBooks = books.filter(b => {
    const matchesTab = activeTab === 'all' || b.status === activeTab;
    const matchesQuery =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const wantToReadCount = books.filter(b => b.status === 'want-to-read').length;
  const readingCount = books.filter(b => b.status === 'reading').length;
  const finishedCount = books.filter(b => b.status === 'finished').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-0.5">
            <span>Reading Tracker</span>
            <span aria-hidden="true">·</span>
            <span>Custom Book Covers & Shelf</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Book Lovers' Reading Vault & Shelf
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Collect books to read later, upload custom cover art, track page progress, and log quotes.
          </p>
        </div>
        <button
          onClick={() => { sounds.playClick(); setShowAddModal(true); }}
          className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Recommended Quick-Add Classics Shelf */}
      <div className="p-4 rounded-3xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Popular Book Lover Picks (1-Click Add to Reading List)</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_RECOMMENDATIONS.map(rec => (
            <button
              key={rec.title}
              onClick={() => handleQuickAdd(rec)}
              className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
            >
              <Plus className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span>{rec.title}</span>
              <span className="text-[10px] text-zinc-400">by {rec.author}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Library Shelves Overview & Search */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {/* Shelf Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: `All Books (${books.length})` },
              { id: 'want-to-read', label: `To Read Later (${wantToReadCount})` },
              { id: 'reading', label: `Reading Now (${readingCount})` },
              { id: 'finished', label: `Finished (${finishedCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { sounds.playClick(); setActiveTab(tab.id as any); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <input
            type="text"
            placeholder="Search by title, author, genre..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium focus:outline-indigo-500"
          />
        </div>
      </div>

      {/* Add Book Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <form onSubmit={handleAddBook} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Add Book to Reading Shelf</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Cover Image Upload / Selection System */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Book Cover Image (Upload or URL)</span>
                  </span>
                  {coverImage && (
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="text-[10px] text-rose-500 hover:underline font-semibold cursor-pointer"
                    >
                      Remove Image
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Thumbnail Preview */}
                  <div className="w-16 h-22 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0 flex items-center justify-center relative shadow-xs">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${THEME_STYLES[coverTheme].bg} p-1 flex flex-col justify-between text-center`}>
                        <div className="text-[7px] font-bold text-white uppercase tracking-tighter truncate">
                          {title || 'Cover'}
                        </div>
                        <ImageIcon className="w-4 h-4 text-white/50 mx-auto" />
                        <div className="text-[6px] text-white/70 truncate">
                          {author || 'Author'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-2 flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, false)}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Upload className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        <span>Upload Photo</span>
                      </button>
                    </div>

                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={coverImage}
                      onChange={e => setCoverImage(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-zinc-900 dark:text-zinc-100 focus:outline-indigo-500"
                    />
                  </div>
                </div>

                {/* Theme Palette Picker (for stylized cover if no photo uploaded) */}
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Default Spine Theme:</span>
                  <div className="flex items-center gap-1.5">
                    {(['indigo', 'emerald', 'amber', 'ruby', 'violet', 'slate'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCoverTheme(t)}
                        className={`w-5 h-5 rounded-full bg-gradient-to-tr ${THEME_STYLES[t].bg} cursor-pointer transition-transform ${
                          coverTheme === t ? 'ring-2 ring-indigo-500 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                        title={t}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sapiens, The Alchemist, Dune"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs font-bold focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 mb-1">Author</label>
                  <input
                    type="text"
                    placeholder="Author name"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 mb-1">Genre</label>
                  <select
                    value={genre}
                    onChange={e => setGenre(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium focus:outline-indigo-500"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Sci-Fi">Sci-Fi & Fantasy</option>
                    <option value="Self-Improvement">Self-Improvement</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="History">History</option>
                    <option value="Tech">Technology</option>
                    <option value="Mystery">Mystery & Thriller</option>
                    <option value="Classic Literature">Classic Literature</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Total Page Count</label>
                <input
                  type="number"
                  value={totalPages}
                  onChange={e => setTotalPages(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono font-bold focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Favorite Quote / Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Memorable quote or reason you want to read this..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium focus:outline-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                Save to Shelf
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Book Cover Modal */}
      {editingCoverBookId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Update Book Cover</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingCoverBookId(null)}
                className="text-zinc-400 hover:text-zinc-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <input
                ref={editFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFileUpload(e, true)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => editFileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2 cursor-pointer bg-indigo-50/50 dark:bg-indigo-950/30 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Image from Device</span>
              </button>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-zinc-500">Or Paste Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.example.com/cover.jpg"
                  value={editCoverUrl}
                  onChange={e => setEditCoverUrl(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 font-mono focus:outline-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => handleSaveCover(editingCoverBookId, '')}
                className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
              >
                Clear Cover
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCoverBookId(null)}
                  className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold text-zinc-600 dark:text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCover(editingCoverBookId, editCoverUrl)}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                >
                  Save Cover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullsize Cover Zoom Modal */}
      {zoomCoverUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
          onClick={() => setZoomCoverUrl(null)}
        >
          <div className="relative max-w-sm max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <img src={zoomCoverUrl} alt="Cover preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>
      )}

      {/* Book Cards Grid with Cover Image & Add/Delete Beside Each Item */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBooks.map(book => {
          const progressPct = book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
          const theme = THEME_STYLES[book.coverTheme || 'indigo'] || THEME_STYLES.indigo;

          return (
            <div
              key={book.id}
              className="p-4 sm:p-5 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              {/* Top Section: Cover Image + Book Metadata */}
              <div className="flex gap-4 items-start">
                {/* Book Cover Thumbnail with Spine and Hover Action */}
                <div
                  className="w-20 sm:w-24 h-28 sm:h-32 shrink-0 rounded-2xl overflow-hidden relative shadow-md border border-zinc-200/80 dark:border-zinc-800/80 group cursor-pointer bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
                  onClick={() => {
                    if (book.coverImage) {
                      setZoomCoverUrl(book.coverImage);
                    } else {
                      setEditingCoverBookId(book.id);
                    }
                  }}
                  title="Click to view or edit cover"
                >
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-tr ${theme.bg} p-2 flex flex-col justify-between text-white text-center shadow-inner`}>
                      <div className="text-[8px] font-black uppercase tracking-tight line-clamp-2">
                        {book.title}
                      </div>
                      <BookOpen className="w-5 h-5 mx-auto opacity-70" />
                      <div className="text-[7px] opacity-80 truncate">
                        {book.author}
                      </div>
                    </div>
                  )}

                  {/* Hover Camera Overlay to Change Image */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Cover</span>
                  </div>
                </div>

                {/* Metadata & Progress */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex justify-between items-start gap-1">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate" title={book.title}>
                        {book.title}
                      </h3>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate">
                        by <span className="font-semibold text-zinc-700 dark:text-zinc-300">{book.author}</span> · {book.genre}
                      </div>
                    </div>

                    {/* Shelf Status Dropdown */}
                    <select
                      value={book.status}
                      onChange={e => handleStatusChange(book.id, e.target.value as any)}
                      className="text-[10px] font-bold px-2 py-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 cursor-pointer focus:outline-indigo-500 shrink-0"
                    >
                      <option value="want-to-read">To Read</option>
                      <option value="reading">Reading</option>
                      <option value="finished">Finished</option>
                    </select>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-zinc-400">
                        Page <strong className="text-zinc-800 dark:text-zinc-200">{book.currentPage}</strong> of {book.totalPages}
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {progressPct}% read
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {book.notes && (
                    <p className="text-xs italic text-zinc-600 dark:text-zinc-400 line-clamp-1">
                      "{book.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Action Bar: Page Steppers + Image Cover Button + Add/Delete Beside Each Item */}
              <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleProgressStep(book.id, 10)}
                    disabled={book.currentPage >= book.totalPages}
                    className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer active:scale-95"
                    title="Read 10 more pages"
                  >
                    +10p
                  </button>
                  <button
                    onClick={() => handleProgressStep(book.id, 50)}
                    disabled={book.currentPage >= book.totalPages}
                    className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer active:scale-95"
                    title="Read 50 more pages"
                  >
                    +50p
                  </button>

                  {/* Add / Edit Cover Button */}
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setEditingCoverBookId(book.id);
                      setEditCoverUrl(book.coverImage || '');
                    }}
                    className="px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-500 hover:text-indigo-600 hover:border-indigo-400 flex items-center gap-1 cursor-pointer"
                    title="Upload or change book cover image"
                  >
                    <Camera className="w-3 h-3 text-indigo-500" />
                    <span>{book.coverImage ? 'Cover' : '+Cover'}</span>
                  </button>
                </div>

                {/* ADD and DELETE Buttons Beside Each Book (Item 3 Requirement) */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setShowAddModal(true);
                      setGenre(book.genre);
                    }}
                    className="px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Add another book to shelf"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Add</span>
                  </button>

                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:border-rose-800 text-zinc-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Delete book from list"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredBooks.length === 0 && (
          <div className="col-span-full p-10 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400 space-y-2">
            <BookOpen className="w-8 h-8 text-zinc-400 mx-auto opacity-60" />
            <p className="font-bold text-zinc-700 dark:text-zinc-300">Your reading shelf is empty here.</p>
            <p>Click "Add New Book" or select from the popular picks above to build your reading list with custom covers.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 10. Work & Study Scheduler (Item 7: Tuition, Meetings, Classes with Full Functionality & Add/Delete Beside Each)
export interface ScheduleEvent {
  id: string;
  title: string;
  category: 'class' | 'tuition' | 'meeting' | 'study' | 'gym' | 'other';
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  location?: string;
  notes?: string;
  completed: boolean;
}

const CATEGORY_STYLES: Record<string, { label: string; badge: string; border: string; bg: string; icon: string }> = {
  class: { label: 'Classes & Lectures', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-800', bg: 'bg-blue-50/60 dark:bg-blue-950/20', icon: '🎓' },
  tuition: { label: 'Tuition & Coaching', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-800', bg: 'bg-emerald-50/60 dark:bg-emerald-950/20', icon: '📚' },
  meeting: { label: 'Work & Meetings', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-800', bg: 'bg-purple-50/60 dark:bg-purple-950/20', icon: '💼' },
  study: { label: 'Self Study / Lab', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-800', bg: 'bg-amber-50/60 dark:bg-amber-950/20', icon: '🔬' },
  gym: { label: 'Gym & Fitness', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300', border: 'border-rose-300 dark:border-rose-800', bg: 'bg-rose-50/60 dark:bg-rose-950/20', icon: '🏋️' },
  other: { label: 'Other Commitment', badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300', border: 'border-cyan-300 dark:border-cyan-800', bg: 'bg-cyan-50/60 dark:bg-cyan-950/20', icon: '⚡' },
};

const DEFAULT_SCHEDULE_EVENTS: ScheduleEvent[] = [
  { id: '1', title: 'Calculus III & Linear Algebra', category: 'class', day: 'Monday', startTime: '09:00 AM', endTime: '10:30 AM', location: 'Hall A - Room 304', completed: false },
  { id: '2', title: 'Advanced Physics Tuition with Sir John', category: 'tuition', day: 'Monday', startTime: '04:00 PM', endTime: '05:30 PM', location: 'Private Coaching Center', notes: 'Review electromagnetic wave problem set', completed: false },
  { id: '3', title: 'Weekly Product Sprint & Team Meeting', category: 'meeting', day: 'Tuesday', startTime: '10:00 AM', endTime: '11:00 AM', location: 'Zoom Conference Room', completed: false },
  { id: '4', title: 'Computer Algorithms Tuition', category: 'tuition', day: 'Wednesday', startTime: '05:00 PM', endTime: '06:30 PM', location: 'Online Lab', notes: 'Dynamic programming & graph traversal', completed: false },
  { id: '5', title: 'Strength Training & Cardio Workout', category: 'gym', day: 'Thursday', startTime: '06:30 PM', endTime: '07:30 PM', location: 'University Gym', completed: false },
  { id: '6', title: 'Chemistry Lab Exam Preparation', category: 'study', day: 'Friday', startTime: '02:00 PM', endTime: '04:00 PM', location: 'Main Library 2nd Floor', completed: false },
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const WorkStudySchedulerView: React.FC = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    try {
      const saved = localStorage.getItem('omni_work_study_schedule');
      return saved ? JSON.parse(saved) : DEFAULT_SCHEDULE_EVENTS;
    } catch {
      return DEFAULT_SCHEDULE_EVENTS;
    }
  });

  const [activeDayFilter, setActiveDayFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ScheduleEvent['category']>('tuition');
  const [day, setDay] = useState<ScheduleEvent['day']>('Monday');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:30 AM');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const saveEvents = (updated: ScheduleEvent[]) => {
    setEvents(updated);
    localStorage.setItem('omni_work_study_schedule', JSON.stringify(updated));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playSuccess();
    const newEvent: ScheduleEvent = {
      id: String(Date.now()),
      title: title.trim(),
      category,
      day,
      startTime,
      endTime,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      completed: false,
    };

    saveEvents([...events, newEvent]);
    setTitle('');
    setLocation('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    sounds.playClick();
    const updated = events.filter(e => e.id !== id);
    saveEvents(updated);
  };

  const handleToggleComplete = (id: string) => {
    sounds.playSuccess();
    const updated = events.map(e => (e.id === id ? { ...e, completed: !e.completed } : e));
    saveEvents(updated);
  };

  // Export to iCalendar (.ics) format
  const exportIcsCalendar = () => {
    sounds.playClick();
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//OmniKit Work Study Scheduler//EN\n";

    events.forEach(e => {
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `SUMMARY:${e.title} (${CATEGORY_STYLES[e.category].label})\n`;
      icsContent += `LOCATION:${e.location || 'Scheduled Event'}\n`;
      icsContent += `DESCRIPTION:${e.notes || ''} - Day: ${e.day}\n`;
      icsContent += `STATUS:${e.completed ? 'COMPLETED' : 'CONFIRMED'}\n`;
      icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnitoolbox-study-schedule-${new Date().toISOString().slice(0, 10)}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEvents = events.filter(e => {
    if (activeDayFilter === 'All') return true;
    return e.day === activeDayFilter;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Scheduler (Tuition, Meetings, Classes & Work)
          </h2>
          <span className="text-xs text-zinc-400">
            Interactive weekly schedule timetable, tuition & meeting organizers with iCal calendar export
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportIcsCalendar}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-zinc-100 shadow-2xs"
            title="Download .ics file for Google Calendar, Apple Calendar, Outlook"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Export iCal (.ics)</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setShowAddForm(v => !v); }}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Close Form' : 'Schedule Event'}</span>
          </button>
        </div>
      </div>

      {/* Day Filter Navigation */}
      <div className="flex flex-wrap gap-1.5 p-2 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        {['All', ...DAYS_OF_WEEK].map(d => (
          <button
            key={d}
            onClick={() => { sounds.playClick(); setActiveDayFilter(d); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDayFilter === d
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Add Schedule Item Form */}
      {showAddForm && (
        <form onSubmit={handleAddEvent} className="rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-5 space-y-3.5 shadow-xs animate-in fade-in">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Schedule New Tuition, Class or Meeting</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Event / Class Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Physics Tuition, Team Standup, Calculus Lecture"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Category Type</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium focus:outline-indigo-500"
              >
                <option value="tuition">📚 Tuition & Tutoring</option>
                <option value="class">🎓 Classes & Lectures</option>
                <option value="meeting">💼 Meetings & Work</option>
                <option value="study">🔬 Lab & Study Session</option>
                <option value="gym">🏋️ Gym & Fitness</option>
                <option value="other">⚡ Other Commitment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Day of Week</label>
              <select
                value={day}
                onChange={e => setDay(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium focus:outline-indigo-500"
              >
                {DAYS_OF_WEEK.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Start Time</label>
              <input
                type="text"
                placeholder="09:00 AM"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-bold focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">End Time</label>
              <input
                type="text"
                placeholder="10:30 AM"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-bold focus:outline-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Location / Online Link</label>
              <input
                type="text"
                placeholder="e.g. Room 302, Coaching Center, Zoom Link"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">Notes / Agenda</label>
              <input
                type="text"
                placeholder="Key focus, chapter numbers or prep instructions"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium focus:outline-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs"
            >
              Add to Schedule
            </button>
          </div>
        </form>
      )}

      {/* Scheduled Events List with Add and Delete Buttons Beside Each Item */}
      <div className="space-y-3">
        {filteredEvents.map(evt => {
          const style = CATEGORY_STYLES[evt.category] || CATEGORY_STYLES.other;

          return (
            <div
              key={evt.id}
              className={`p-4 rounded-3xl border transition-all ${
                evt.completed
                  ? 'border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-950 dark:bg-emerald-950/20 opacity-75'
                  : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-start gap-3">
                  {/* Complete check button */}
                  <button
                    onClick={() => handleToggleComplete(evt.id)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all cursor-pointer mt-0.5 ${
                      evt.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs'
                        : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-emerald-400 text-transparent hover:text-zinc-300'
                    }`}
                    title={evt.completed ? 'Mark as active' : 'Mark as completed'}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base">{style.icon}</span>
                      <h3 className={`text-sm font-bold ${evt.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-50'}`}>
                        {evt.title}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${style.badge}`}>
                        {style.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 mt-1 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{evt.day}</span>
                      <span>·</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {evt.startTime} – {evt.endTime}
                      </span>
                      {evt.location && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-zinc-400" />
                            {evt.location}
                          </span>
                        </>
                      )}
                    </div>

                    {evt.notes && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 italic">
                        {evt.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* NOTIFY, ADD and DELETE Buttons Beside Each Event */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      triggerAppNotification({
                        title: `🔔 Schedule Reminder: ${evt.title}`,
                        body: `${evt.day} at ${evt.startTime} - ${evt.location || CATEGORY_STYLES[evt.category]?.label || 'Scheduled'}`,
                      });
                    }}
                    className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-600 dark:text-zinc-300 text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Send test alert notification for this schedule"
                  >
                    <Bell className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Alert</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setShowAddForm(true);
                      setCategory(evt.category);
                      setDay(evt.day);
                    }}
                    className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Add another event on this day"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Add</span>
                  </button>

                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:border-rose-800 text-zinc-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Delete event from schedule"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="p-8 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
            No events scheduled for {activeDayFilter}. Click "Schedule Event" or "Add" to add tuition, classes, or meetings.
          </div>
        )}
      </div>
    </div>
  );
};
