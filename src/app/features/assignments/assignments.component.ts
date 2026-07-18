import { Component, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface Assignment {
  id:           number;
  title:        string;
  course:       string;
  courseIcon:   string;
  teacher:      string;
  description:  string;
  instructions: string[];
  dueDate:      string;
  dueDateFull:  string;
  points:       number;
  status:       AssignmentStatus;
  grade?:       number;
  feedback?:    string;
  submittedOn?: string;
  fileName?:    string;
  attachments:  string[];
  type:         'file' | 'text' | 'quiz';
  priority:     'high' | 'medium' | 'low';
}

interface GradeStats {
  total:     number;
  submitted: number;
  graded:    number;
  pending:   number;
  avgGrade:  number;
}

type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'overdue';
type AssignmentView   = 'list' | 'detail' | 'submit';
type FilterType       = 'all' | 'pending' | 'submitted' | 'graded' | 'overdue';

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector:    'app-assignments',
  standalone:  true,
  imports:     [ReactiveFormsModule, RouterLink],
  templateUrl: './assignments.component.html',
  styleUrl:    './assignments.component.css'
})
export class AssignmentsComponent {
   Math = Math;
  private fb = inject(FormBuilder);

  // ── UI State ────────────────────────────────────────────────────────────────
  activeView         = signal<AssignmentView>('list');
  activeFilter       = signal<FilterType>('all');
  selectedAssignment = signal<Assignment | null>(null);
  uploadedFile       = signal<File | null>(null);
  submitSuccess      = signal<boolean>(false);
  isSubmitting       = signal<boolean>(false);
  searchQuery        = signal<string>('');

  // ── Text Submission Form ────────────────────────────────────────────────────
  textForm = this.fb.group({
    answer: ['', [Validators.required, Validators.minLength(50)]]
  });

  get answer() { return this.textForm.get('answer'); }

  // ── Assignments Mock Data ───────────────────────────────────────────────────
  assignments: Assignment[] = [
    {
      id:          1,
      title:       'Python Functions Exercise',
      course:      'Python for Kids',
      courseIcon:  '🐍',
      teacher:     'Ustad Javed',
      description: 'Complete the functions exercise sheet. Write 5 different Python functions demonstrating parameters, return values, and default arguments.',
      instructions: [
        'Write a function that calculates the area of a rectangle',
        'Write a function that checks if a number is even or odd',
        'Write a function that reverses a string',
        'Write a function with default parameters',
        'Write a recursive function to calculate factorial'
      ],
      dueDate:     'Jun 20, 2025',
      dueDateFull: '2025-06-20',
      points:      20,
      status:      'pending',
      attachments: ['Functions_Exercise_Sheet.pdf', 'Starter_Code.py'],
      type:        'file',
      priority:    'high'
    },
    {
      id:          2,
      title:       'Variables and Data Types Quiz',
      course:      'Python for Kids',
      courseIcon:  '🐍',
      teacher:     'Ustad Javed',
      description: 'Complete the online quiz covering variables, data types, and type conversion in Python.',
      instructions: [
        'Answer all 20 multiple choice questions',
        'You have 30 minutes to complete the quiz',
        'Each correct answer is worth 1 point',
        'No negative marking for wrong answers'
      ],
      dueDate:     'Jun 15, 2025',
      dueDateFull: '2025-06-15',
      points:      20,
      status:      'graded',
      grade:       18,
      feedback:    'Excellent work! You demonstrated a strong understanding of Python data types. Minor mistake on type conversion question 7. Review the int() and float() functions. Keep it up!',
      submittedOn: 'Jun 14, 2025',
      attachments: [],
      type:        'quiz',
      priority:    'low'
    },
    {
      id:          3,
      title:       'ChatGPT Prompt Challenge',
      course:      'AI Tools Masterclass',
      courseIcon:  '🤖',
      teacher:     'Sir Ahmad',
      description: 'Design 10 creative and effective ChatGPT prompts for different real-world use cases. Document each prompt and the result you got.',
      instructions: [
        'Create prompts for at least 5 different categories',
        'Screenshot and document the AI response for each prompt',
        'Explain why each prompt was effective',
        'Submit as a PDF or Word document',
        'Minimum 2 pages per prompt category'
      ],
      dueDate:     'Jun 22, 2025',
      dueDateFull: '2025-06-22',
      points:      30,
      status:      'submitted',
      submittedOn: 'Jun 21, 2025',
      fileName:    'ChatGPT_Prompts_MyWork.pdf',
      attachments: ['Prompt_Challenge_Guidelines.pdf', 'Example_Submissions.pdf'],
      type:        'file',
      priority:    'medium'
    },
    {
      id:          4,
      title:       'Loops Practice Set',
      course:      'Python for Kids',
      courseIcon:  '🐍',
      teacher:     'Ustad Javed',
      description: 'Complete all 8 loop exercises. Use for loops, while loops, nested loops, and loop control statements.',
      instructions: [
        'Complete all 8 exercises in the practice set',
        'Use comments to explain your code',
        'Test each solution before submitting',
        'Submit your .py file with all solutions'
      ],
      dueDate:     'Jun 10, 2025',
      dueDateFull: '2025-06-10',
      points:      15,
      status:      'overdue',
      attachments: ['Loops_Practice_Set.pdf'],
      type:        'file',
      priority:    'high'
    },
    {
      id:          5,
      title:       'AI Image Creation Project',
      course:      'AI Tools Masterclass',
      courseIcon:  '🤖',
      teacher:     'Sir Ahmad',
      description: 'Create a mini portfolio of 10 AI-generated images using any AI image tool. Write a brief description for each image explaining your prompt.',
      instructions: [
        'Use any AI image generation tool (DALL-E, Midjourney, etc.)',
        'Create exactly 10 unique images',
        'Write a 2-3 sentence description for each image',
        'Include the exact prompt you used',
        'Submit as a PDF portfolio'
      ],
      dueDate:     'Jun 18, 2025',
      dueDateFull: '2025-06-18',
      points:      25,
      status:      'graded',
      grade:       24,
      feedback:    'Outstanding creativity! Your prompts were very detailed and produced excellent results. The portfolio layout was professional. Just one image seemed off-topic. Excellent work overall!',
      submittedOn: 'Jun 17, 2025',
      fileName:    'AI_Portfolio_MyWork.pdf',
      attachments: ['AI_Image_Project_Brief.pdf'],
      type:        'file',
      priority:    'low'
    },
    {
      id:          6,
      title:       'Scratch Game Project',
      course:      'Scratch Coding',
      courseIcon:  '🎨',
      teacher:     'Miss Sara',
      description: 'Build a complete game in Scratch with at least 3 levels, a score system, and sound effects. Share the project link when done.',
      instructions: [
        'Game must have at least 3 playable levels',
        'Include a working score counter',
        'Add at least 3 different sound effects',
        'Game must have a start screen and game over screen',
        'Submit your Scratch project link'
      ],
      dueDate:     'Jun 25, 2025',
      dueDateFull: '2025-06-25',
      points:      40,
      status:      'pending',
      attachments: ['Scratch_Game_Requirements.pdf'],
      type:        'text',
      priority:    'medium'
    },
     {
      id:          7,
      title:       'OOP Class Project',
      course:      'Programming',
      courseIcon:  '🎨',
      teacher:     'Miss Iman',
      description: 'Build a complete game in Scratch with at least 3 levels, a score system, and sound effects. Share the project link when done.',
      instructions: [
        'Game must have at least 3 playable levels',
        'Include a working score counter',
        'Add at least 3 different sound effects',
        'Game must have a start screen and game over screen',
        'Submit your Scratch project link'
      ],
      dueDate:     'Jun 25, 2025',
      dueDateFull: '2025-06-25',
      points:      40,
      status:      'pending',
      attachments: ['OOP.pdf'],
      type:        'text',
      priority:    'high'
    }
  ];

  // ── Computed — filtered and searched assignments ─────────────────────────────
  filteredAssignments = computed(() => {
    let result = this.assignments;

    // Filter by status
    if (this.activeFilter() !== 'all') {
      result = result.filter(a => a.status === this.activeFilter());
    }

    // Filter by search
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      result = result.filter(a =>
        a.title.toLowerCase().includes(q)  ||
        a.course.toLowerCase().includes(q) ||
        a.teacher.toLowerCase().includes(q)
      );
    }

    return result;
  });

  // ── Computed — grade statistics ─────────────────────────────────────────────
  gradeStats = computed<GradeStats>(() => {
    const total     = this.assignments.length;
    const submitted = this.assignments.filter(a => a.status === 'submitted').length;
    const graded    = this.assignments.filter(a => a.status === 'graded').length;
    const pending   = this.assignments.filter(a => a.status === 'pending').length;

    const gradedItems = this.assignments.filter(a => a.status === 'graded' && a.grade !== undefined);
    const totalPoints = gradedItems.reduce((s, a) => s + a.points, 0);
    const earnedPoints = gradedItems.reduce((s, a) => s + (a.grade ?? 0), 0);
    const avgGrade = totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    return { total, submitted, graded, pending, avgGrade };
  });

  // ── Computed — counts per status ────────────────────────────────────────────
  pendingCount  = computed(() => this.assignments.filter(a => a.status === 'pending').length);
  overdueCount  = computed(() => this.assignments.filter(a => a.status === 'overdue').length);
  submittedCount= computed(() => this.assignments.filter(a => a.status === 'submitted').length);
  gradedCount   = computed(() => this.assignments.filter(a => a.status === 'graded').length);

  // ── Methods ──────────────────────────────────────────────────────────────────

  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  openDetail(assignment: Assignment): void {
    this.selectedAssignment.set(assignment);
    this.activeView.set('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openSubmit(assignment: Assignment): void {
    this.selectedAssignment.set(assignment);
    this.activeView.set('submit');
    this.uploadedFile.set(null);
    this.submitSuccess.set(false);
    this.textForm.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    this.activeView.set('list');
    this.selectedAssignment.set(null);
    this.uploadedFile.set(null);
    this.submitSuccess.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];

    if (!file) return;

    // Validate file size — 10MB max
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be smaller than 10MB.');
      return;
    }

    this.uploadedFile.set(file);
  }

  removeFile(): void {
    this.uploadedFile.set(null);
  }

  canSubmit(): boolean {
    const assignment = this.selectedAssignment();
    if (!assignment) return false;
    if (assignment.type === 'file') return this.uploadedFile() !== null;
    if (assignment.type === 'text') return this.answer?.valid ?? false;
    return false;
  }

  onSubmit(): void {
    const assignment = this.selectedAssignment();
    if (!assignment || !this.canSubmit()) return;

    this.isSubmitting.set(true);

    // Simulate API call
    setTimeout(() => {
      // Update assignment status using map — immutable update
      this.assignments = this.assignments.map(a =>
        a.id === assignment.id
          ? {
              ...a,
              status:      'submitted' as AssignmentStatus,
              submittedOn: new Date().toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              }),
              fileName: this.uploadedFile()?.name ?? 'Text Submission'
            }
          : a
      );

      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
    }, 2000);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024)        return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  getGradeColor(grade: number, points: number): string {
    const pct = (grade / points) * 100;
    if (pct >= 90) return 'grade-excellent';
    if (pct >= 75) return 'grade-good';
    if (pct >= 60) return 'grade-average';
    return 'grade-poor';
  }

  getDaysLeft(dueDateFull: string): number {
    const today   = new Date();
    const due     = new Date(dueDateFull);
    const diff    = due.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getDaysLeftLabel(dueDateFull: string, status: AssignmentStatus): string {
    if (status === 'submitted' || status === 'graded') return 'Submitted';
    if (status === 'overdue') return 'Overdue';
    const days = this.getDaysLeft(dueDateFull);
    if (days === 0) return 'Due today';
    if (days === 1) return '1 day left';
    if (days < 0)   return `${Math.abs(days)} days overdue`;
    return `${days} days left`;
  }

  getDaysLeftClass(dueDateFull: string, status: AssignmentStatus): string {
    if (status === 'submitted' || status === 'graded') return 'days-done';
    if (status === 'overdue') return 'days-overdue';
    const days = this.getDaysLeft(dueDateFull);
    if (days <= 1) return 'days-urgent';
    if (days <= 3) return 'days-soon';
    return 'days-ok';
  }
}