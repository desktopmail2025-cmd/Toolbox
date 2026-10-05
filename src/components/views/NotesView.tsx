import React, { useState, useEffect } from 'react';
import {
  Plus,
  Pin,
  Trash2,
  Edit3,
  Copy,
  Check,
  Download,
  Search,
  FileText,
  Clock,
  Sparkles,
  X,
  Save,
  ArrowLeft,
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  tag: 'General' | 'Idea' | 'Todo' | 'Formula' | 'Draft';
  isPinned: boolean;
  updatedAt: number;
}

const STORAGE_KEY = 'omni_quick_notes_db';

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: '1',
    title: 'Project Ideas & Utility Shortcuts',
    content: 'Remember to check the Loan EMI ratio before meeting.\nKeep mortgage comparison formula at hand:\nEMI = [P x R x (1+R)^N]/[(1+R)^N-1]',
    tag: 'Idea',
    isPinned: true,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: '2',
    title: 'Room Repaint & DIY Measurements',
    content: 'Room dimensions for repaint: 20ft length, 8ft height, 2 doors deduction. Needs ~2.5 gallons with 2 coats.',
    tag: 'Formula',
    isPinned: false,
    updatedAt: Date.now() - 7200000,
  },
  {
    id: '3',
    title: 'Weekly Grocery & Prep List',
    content: '• Olive oil & balsamic vinegar\n• Greek yogurt (plain)\n• Fresh rosemary & garlic\n• Whole grain pasta',
    tag: 'Todo',
    isPinned: false,
    updatedAt: Date.now() - 14400000,
  },
];

interface NotesViewProps {
  onOpenNewNote?: () => void;
  onBackToHome?: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onBackToHome }) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_NOTES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Editor Modal State
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTag, setEditTag] = useState<'General' | 'Idea' | 'Todo' | 'Formula' | 'Draft'>('General');
  const [editIsPinned, setEditIsPinned] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  // Open Editor for new note
  const handleCreateNew = () => {
    sounds.playClick();
    const newNote: NoteItem = {
      id: String(Date.now()),
      title: 'Untitled Note',
      content: '',
      tag: 'General',
      isPinned: false,
      updatedAt: Date.now(),
    };
    setEditingNote(newNote);
    setEditTitle('Untitled Note');
    setEditContent('');
    setEditTag('General');
    setEditIsPinned(false);
    setSaveSuccess(false);
    setIsEditorOpen(true);
  };

  // Open Editor for existing note
  const handleEditNote = (note: NoteItem) => {
    sounds.playClick();
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTag(note.tag);
    setEditIsPinned(note.isPinned);
    setSaveSuccess(false);
    setIsEditorOpen(true);
  };

  // Explicit Save function
  const handleSaveNote = () => {
    if (!editingNote) return;
    sounds.playSuccess();

    const finalTitle = editTitle.trim() || 'Untitled Note';
    const updatedNote: NoteItem = {
      ...editingNote,
      title: finalTitle,
      content: editContent,
      tag: editTag,
      isPinned: editIsPinned,
      updatedAt: Date.now(),
    };

    setNotes(prev => {
      const exists = prev.some(n => n.id === updatedNote.id);
      if (exists) {
        return prev.map(n => (n.id === updatedNote.id ? updatedNote : n));
      } else {
        return [updatedNote, ...prev];
      }
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditorOpen(false);
    }, 600);
  };

  // Pin toggle directly from card
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  };

  // Delete directly from card
  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // Copy note text
  const handleCopyNote = (note: NoteItem, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filter & sort
  const filteredNotes = notes
    .filter(n => {
      const matchSearch =
        searchQuery.trim() === '' ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = selectedTag === 'All' || n.tag === selectedTag;
      return matchSearch && matchTag;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });

  // Handle click on title field: if text is "Untitled Note", clear it!
  const handleTitleFocus = () => {
    if (editTitle.trim().toLowerCase() === 'untitled note') {
      setEditTitle('');
    }
  };

  const wordCount = editContent.trim() ? editContent.trim().split(/\s+/).length : 0;
  const charCount = editContent.length;

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div className="flex items-start gap-3">
          {onBackToHome && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onBackToHome();
              }}
              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors shadow-xs cursor-pointer"
              title="Back to Home"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
              <span>Local Vault</span>
              <span aria-hidden="true">·</span>
              <span>{notes.length} Notes Stored Offline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
              <FileText className="w-7 h-7 text-zinc-800 dark:text-zinc-200" />
              My Notes & Scratchpad
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
              Clean recycler cards with quick options to pin, edit, and delete. All changes save directly to your device.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'General', 'Idea', 'Todo', 'Formula', 'Draft'].map(tag => (
            <button
              key={tag}
              onClick={() => {
                sounds.playClick();
                setSelectedTag(tag);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white pl-8 pr-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
        </div>
      </div>

      {/* Recycler Cards Grid */}
      {filteredNotes.length === 0 ? (
        <div className="py-20 text-center space-y-3 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <FileText className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {searchQuery ? 'No matching notes found' : 'No notes created yet'}
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {searchQuery
              ? 'Try changing your search keywords or tag filter.'
              : 'Create your first scratchpad note to save ideas, formulas, or to-dos.'}
          </p>
          <button
            onClick={handleCreateNew}
            className="mt-2 px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Create Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => {
            return (
              <div
                key={note.id}
                onClick={() => handleEditNote(note)}
                className={`group relative flex flex-col justify-between rounded-2xl border p-5 cursor-pointer select-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${
                  note.isPinned
                    ? 'border-amber-300/80 bg-amber-50/20 dark:border-amber-900/60 dark:bg-amber-950/20 shadow-xs'
                    : 'border-zinc-200/90 bg-white hover:border-zinc-300 dark:border-zinc-800/90 dark:bg-zinc-900 dark:hover:border-zinc-700'
                }`}
              >
                <div>
                  {/* Top Bar on Card: Tag + Action Options Beside Card */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                      {note.tag}
                    </span>

                    {/* Action buttons beside each note: PIN, EDIT, DELETE */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={e => handleTogglePin(note.id, e)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          note.isPinned
                            ? 'text-amber-500 bg-amber-100/60 dark:bg-amber-900/40'
                            : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                        }`}
                        title={note.isPinned ? 'Unpin note' : 'Pin to top'}
                      >
                        <Pin
                          className={`w-3.5 h-3.5 ${
                            note.isPinned ? 'fill-amber-500' : ''
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleEditNote(note);
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                        title="Edit note"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={e => handleCopyNote(note, e)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                        title="Copy note text"
                      >
                        {copiedId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={e => handleDeleteNote(note.id, e)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors line-clamp-1 mb-2">
                    {note.title || 'Untitled Note'}
                  </h3>

                  {/* Content Excerpt */}
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-4 leading-relaxed whitespace-pre-line font-sans">
                    {note.content || 'Empty note... Click edit to add content.'}
                  </p>
                </div>

                {/* Card Footer: Timestamp & Word count */}
                <div className="flex items-center justify-between pt-3 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(note.updatedAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span>
                    {note.content.trim() ? note.content.trim().split(/\s+/).length : 0} words
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Note Editor Modal with explicit Save Button & auto-clearing Untitled Note on click */}
      {isEditorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsEditorOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                  {editingNote?.id ? 'Edit Note' : 'Create Note'}
                </span>
                <span className="text-[11px] text-zinc-400">· Click Save when done</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Explicit SAVE Button */}
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer shadow-sm ${
                    saveSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:opacity-90 active:scale-95'
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Note</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tags & Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/20">
              <div className="flex items-center gap-1.5">
                {(['General', 'Idea', 'Todo', 'Formula', 'Draft'] as const).map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setEditTag(tag);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      editTag === tag
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setEditIsPinned(!editIsPinned);
                }}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                  editIsPinned
                    ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400'
                    : 'border-zinc-200 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400'
                }`}
              >
                <Pin className={`w-3.5 h-3.5 ${editIsPinned ? 'fill-amber-500' : ''}`} />
                <span>{editIsPinned ? 'Pinned' : 'Pin Note'}</span>
              </button>
            </div>

            {/* Note Title & Content Body */}
            <div className="flex-1 flex flex-col p-5 overflow-y-auto">
              {/* Title Input: When clicked, if it says "Untitled Note", it clears automatically! */}
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onFocus={handleTitleFocus}
                placeholder="Enter note title..."
                className="w-full text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 bg-transparent border-0 focus:outline-none mb-3 placeholder:text-zinc-400"
              />

              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                placeholder="Write your note, formulas, task list, or ideas here..."
                rows={10}
                className="flex-1 w-full bg-transparent border-0 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 focus:outline-none resize-none font-sans placeholder:text-zinc-400"
              />
            </div>

            {/* Footer with counts and bottom save button */}
            <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 text-[11px] text-zinc-400 flex items-center justify-between">
              <div className="flex items-center gap-3 font-mono">
                <span>{wordCount} words</span>
                <span>·</span>
                <span>{charCount} characters</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
