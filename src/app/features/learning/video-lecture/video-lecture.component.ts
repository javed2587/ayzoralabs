import { Component, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule }                  from '@angular/forms';
import { RouterLink }                           from '@angular/router';
import { DomSanitizer, SafeResourceUrl }        from '@angular/platform-browser';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface Lecture {
  id:          number;
  title:       string;
  description: string;
  duration:    string;
  videoUrl:    string;
  thumbnail:   string;
  completed:   boolean;
  free:        boolean;
  resources:   string[];
}

interface Note {
  id:        number;
  text:      string;
  lecture:   string;
  timestamp: string;
}

type PlayerTab = 'description' | 'notes' | 'resources';

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector:    'app-video-lecture',
  standalone:  true,
  imports:     [ReactiveFormsModule, RouterLink],
  templateUrl: './video-lecture.component.html',
  styleUrl:    './video-lecture.component.css'
})
export class VideoLectureComponent {

  private sanitizer = inject(DomSanitizer);

  // ── UI State ────────────────────────────────────────────────────────────────
  activeTab     = signal<PlayerTab>('description');
  currentIndex  = signal<number>(0);
  videoLoaded   = signal<boolean>(false);
  sidebarOpen   = signal<boolean>(true);
  noteText      = signal<string>('');
  notes         = signal<Note[]>([]);
  editingNoteId = signal<number | null>(null);
  editText      = signal<string>('');

  // ── Course Info (plain object — not reactive, never changes) ────────────────
  playlist = {
    id:      1,
    title:   'Python for Kids',
    teacher: 'Ustad Javed',
    icon:    '🐍'
  };

  // ── Lectures as a SIGNAL — reactive, Angular tracks all changes ─────────────
  lectures = signal<Lecture[]>([
    {
      id:          1,
      title:       'Introduction to Python',
      description: 'Welcome to Python for Kids! In this lecture we cover what Python is, why it is one of the most popular programming languages in the world, and how to set up your development environment. By the end you will have Python and VS Code installed and ready to go.',
      duration:    '18:32',
      videoUrl:    'https://www.youtube.com/embed/rfscVS0vtbw',
      thumbnail:   '🐍',
      completed:   true,
      free:        true,
      resources:   ['Python Installation Guide.pdf', 'VS Code Setup Checklist.pdf']
    },
    {
      id:          2,
      title:       'Variables and Data Types',
      description: 'In this lecture we explore Python variables — how to create them, name them properly, and store different types of data. We cover strings, integers, floats, and booleans with hands-on examples.',
      duration:    '22:15',
      videoUrl:    'https://www.youtube.com/embed/kqtD5dpn9C8',
      thumbnail:   '📦',
      completed:   true,
      free:        true,
      resources:   ['Variables Cheat Sheet.pdf', 'Practice Exercises.py']
    },
    {
      id:          3,
      title:       'If / Else Conditions',
      description: 'Learn how to make your programs smart! We explore if, elif, and else statements to write code that makes decisions. Build a mini quiz game at the end of this lecture.',
      duration:    '25:44',
      videoUrl:    'https://www.youtube.com/embed/9Os0o3wzS_I',
      thumbnail:   '🔀',
      completed:   false,
      free:        false,
      resources:   ['Conditions Flowchart.pdf', 'Quiz Game Starter Code.py']
    },
    {
      id:          4,
      title:       'For Loops and While Loops',
      description: 'Repetition is the key to automation. This lecture teaches you how to use for loops and while loops to repeat actions, iterate over lists, and build a number guessing game.',
      duration:    '28:10',
      videoUrl:    'https://www.youtube.com/embed/W8KRzm-HUcc',
      thumbnail:   '🔄',
      completed:   false,
      free:        false,
      resources:   ['Loops Practice Problems.pdf']
    },
    {
      id:          5,
      title:       'Functions — Write Once Use Many Times',
      description: 'Functions are the building blocks of clean code. Learn how to define functions, pass parameters, return values, and why reusable code makes you a better programmer.',
      duration:    '30:22',
      videoUrl:    'https://www.youtube.com/embed/nrCAxXfRU28',
      thumbnail:   '⚙️',
      completed:   false,
      free:        false,
      resources:   ['Functions Reference Guide.pdf', 'Function Exercises.py']
    },
    {
      id:          6,
      title:       'Lists and Dictionaries',
      description: 'Store and organize collections of data using Python lists and dictionaries. We build a student grade tracker to apply these concepts in a real project.',
      duration:    '26:55',
      videoUrl:    'https://www.youtube.com/embed/JeznW_7DlB0',
      thumbnail:   '📋',
      completed:   false,
      free:        false,
      resources:   ['Data Structures Cheat Sheet.pdf']
    },
    {
      id:          7,
      title:       'Object Oriented Programming Basics',
      description: 'Enter the world of classes and objects — the foundation of modern software development. We build a simple bank account class step by step.',
      duration:    '35:18',
      videoUrl:    'https://www.youtube.com/embed/SgQhwtIoQ7o',
      thumbnail:   '🏛️',
      completed:   false,
      free:        false,
      resources:   ['OOP Concepts Diagram.pdf', 'Bank Account Starter.py']
    },
    {
      id:          8,
      title:       'Final Project — Build a Quiz App',
      description: 'Put everything you learned together! In this final lecture we plan, build, and test a complete command-line quiz application from scratch.',
      duration:    '45:00',
      videoUrl:    'https://www.youtube.com/embed/rfscVS0vtbw',
      thumbnail:   '🏆',
      completed:   false,
      free:        false,
      resources:   ['Quiz App Requirements.pdf', 'Final Project Rubric.pdf', 'Sample Solution.py']
    }
  ]);

  // ── Computed signals — auto recalculate when lectures() changes ─────────────

  currentLecture = computed<Lecture>(() =>
    this.lectures()[this.currentIndex()]
  );

  safeVideoUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      this.currentLecture().videoUrl + '?autoplay=0&rel=0'
    )
  );

  completedCount = computed<number>(() =>
    this.lectures().filter(l => l.completed).length
  );

  progressPercent = computed<number>(() =>
    Math.round((this.completedCount() / this.lectures().length) * 100)
  );

  isFirst = computed<boolean>(() =>
    this.currentIndex() === 0
  );

  isLast = computed<boolean>(() =>
    this.currentIndex() === this.lectures().length - 1
  );

  currentNotes = computed<Note[]>(() =>
    this.notes().filter(n => n.lecture === this.currentLecture().title)
  );

  // ── Navigation Methods ───────────────────────────────────────────────────────

  goToLecture(index: number): void {
    this.currentIndex.set(index);
    this.videoLoaded.set(false);
    this.activeTab.set('description');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextLecture(): void {
    if (!this.isLast()) {
      this.goToLecture(this.currentIndex() + 1);
    }
  }

  prevLecture(): void {
    if (!this.isFirst()) {
      this.goToLecture(this.currentIndex() - 1);
    }
  }

  // ── Mark Complete — uses signal.update() so UI reacts immediately ────────────
  markComplete(): void {
    const index = this.currentIndex();

    // Create a NEW array with the updated lecture object
    // Never mutate directly — always create new objects
    this.lectures.update(current =>
      current.map((lecture, i) =>
        i === index
          ? { ...lecture, completed: true }
          : lecture
      )
    );

    // Auto advance after short delay
    if (!this.isLast()) {
      setTimeout(() => this.nextLecture(), 800);
    }
  }

  setTab(tab: PlayerTab): void {
    this.activeTab.set(tab);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  onVideoLoad(): void {
    this.videoLoaded.set(true);
  }

  // ── Notes Methods ────────────────────────────────────────────────────────────

  onNoteInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.noteText.set(el.value);
  }

  addNote(): void {
    const text = this.noteText().trim();
    if (!text) return;

    const newNote: Note = {
      id:        Date.now(),
      text:      text,
      lecture:   this.currentLecture().title,
      timestamp: new Date().toLocaleString('en-US', {
        month:  'short',
        day:    'numeric',
        hour:   '2-digit',
        minute: '2-digit'
      })
    };

    this.notes.update(current => [newNote, ...current]);
    this.noteText.set('');
  }

  deleteNote(id: number): void {
    this.notes.update(current =>
      current.filter(n => n.id !== id)
    );
  }

  startEdit(note: Note): void {
    this.editingNoteId.set(note.id);
    this.editText.set(note.text);
  }

  onEditInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.editText.set(el.value);
  }

  saveEdit(id: number): void {
    const text = this.editText().trim();
    if (!text) return;

    this.notes.update(current =>
      current.map(n =>
        n.id === id ? { ...n, text } : n
      )
    );

    this.editingNoteId.set(null);
    this.editText.set('');
  }

  cancelEdit(): void {
    this.editingNoteId.set(null);
    this.editText.set('');
  }
}