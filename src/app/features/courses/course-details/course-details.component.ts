
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink }           from '@angular/router';


// ── Interfaces ──────────────────────────────────────────────────────────────

interface SyllabusWeek {
  week:    number;
  title:   string;
  topics:  string[];
  duration: string;
}

interface Review {
  name:   string;
  avatar: string;
  rating: number;
  date:   string;
  text:   string;
}

interface CourseDetail {
  id:            number;
  title:         string;
  subtitle:      string;
  description:   string;
  teacher:       string;
  teacherAvatar: string;
  teacherBio:    string;
  teacherCourses: number;
  teacherStudents: number;
  teacherRating:  number;
  duration:      string;
  sessions:      number;
  level:         string;
  category:      string;
  price:         number;
  originalPrice: number;
  rating:        number;
  students:      number;
  language:      string;
  badge?:        string;
  color:         string;
  icon:          string;
  videoUrl:      string;
  whatYouLearn:  string[];
  requirements:  string[];
  syllabus:      SyllabusWeek[];
  reviews:       Review[];
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const COURSES_DATA: CourseDetail[] = [
  {
    id: 1,
    title: 'Python for Kids',
    subtitle: 'Learn Python programming from scratch with fun real-world projects',
    description: `This comprehensive Python course is designed specifically for young learners aged 10–17.
    Starting from the very basics, students will progress through variables, loops, functions,
    and object-oriented programming — all while building exciting projects like games, calculators,
    and mini web scrapers. No prior experience needed.`,
    teacher:         'Ustad Javed',
    teacherAvatar:   'UJ',
    teacherBio:      '8 years of software development experience. MSc in IT. Passionate about teaching kids to code and build real-world projects.',
    teacherCourses:  6,
    teacherStudents: 3200,
    teacherRating:   4.9,
    duration:   '3 months',
    sessions:   24,
    level:      'Beginner',
    category:   'Coding',
    price:      4500,
    originalPrice: 7000,
    rating:     4.9,
    students:   1240,
    language:   'Urdu / English',
    badge:      'Most Popular',
    color:      'color-blue',
    icon:       '🐍',
    videoUrl:   'https://www.youtube.com/embed/rfscVS0vtbw',
    whatYouLearn: [
      'Python syntax, variables, and data types',
      'Loops, conditions, and functions',
      'Object-Oriented Programming basics',
      'Build a calculator, quiz game, and todo app',
      'Work with files and basic APIs',
      'Problem solving with real coding challenges'
    ],
    requirements: [
      'A computer with internet connection',
      'No prior coding experience needed',
      'Age 10 and above recommended',
      'Curiosity and willingness to learn!'
    ],
    syllabus: [
      { week: 1, title: 'Getting Started with Python',   duration: '2 sessions', topics: ['What is Python?', 'Installing Python & VS Code', 'Your first program', 'Variables and data types'] },
      { week: 2, title: 'Control Flow',                  duration: '2 sessions', topics: ['If / else conditions', 'Comparison operators', 'Nested conditions', 'Mini quiz project'] },
      { week: 3, title: 'Loops & Repetition',            duration: '3 sessions', topics: ['For loops', 'While loops', 'Loop control (break, continue)', 'Number guessing game'] },
      { week: 4, title: 'Functions',                     duration: '3 sessions', topics: ['Defining functions', 'Parameters and return values', 'Scope', 'Reusable calculator'] },
      { week: 5, title: 'Lists & Dictionaries',          duration: '3 sessions', topics: ['Lists and indexing', 'Dictionary key-value pairs', 'Iterating collections', 'Student grade tracker'] },
      { week: 6, title: 'Object-Oriented Programming',   duration: '3 sessions', topics: ['Classes and objects', 'Methods and attributes', 'Inheritance basics', 'Mini bank account app'] },
      { week: 7, title: 'Files & Error Handling',        duration: '4 sessions', topics: ['Reading and writing files', 'Try/except blocks', 'Working with CSV data', 'File-based todo app'] },
      { week: 8, title: 'Final Project & Certificate',   duration: '4 sessions', topics: ['Project planning', 'Building full project', 'Code review session', 'Certificate ceremony'] }
    ],
    reviews: [
      { name: 'Ali Hassan',  avatar: 'AH', rating: 5, date: 'Dec 2024', text: 'My son loved every session. Ustad Javed explains everything so clearly. He built his first game in week 3!' },
      { name: 'Sara Ahmed',  avatar: 'SA', rating: 5, date: 'Nov 2024', text: 'Excellent teaching style. My daughter is 12 and she completed the whole course and got her certificate.' },
      { name: 'Bilal Khan',  avatar: 'BK', rating: 4, date: 'Oct 2024', text: 'Very well structured course. The projects are fun and practical. Highly recommended for beginners.' }
    ]
  },
  {
    id: 2,
    title: 'AI Tools Masterclass',
    subtitle: 'Master ChatGPT, DeepSeek and modern AI tools for creative work',
    description: `Discover how to use the latest AI tools to supercharge your creativity, productivity,
    and learning. This course covers ChatGPT, DeepSeek, image generation, and automation tools
    in a fun, hands-on way designed for young learners and beginners of all ages.`,
    teacher:         'Sir Ahmad',
    teacherAvatar:   'SA',
    teacherBio:      'AI educator and content creator with 5 years of experience teaching technology to kids and teens.',
    teacherCourses:  4,
    teacherStudents: 2100,
    teacherRating:   4.8,
    duration:   '2 months',
    sessions:   16,
    level:      'Beginner',
    category:   'AI Tools',
    price:      3500,
    originalPrice: 5500,
    rating:     4.8,
    students:   980,
    language:   'Urdu / English',
    badge:      'Trending',
    color:      'color-purple',
    icon:       '🤖',
    videoUrl:   'https://www.youtube.com/embed/JTxsNm9IdYU',
    whatYouLearn: [
      'What is AI and how it works',
      'ChatGPT prompting techniques',
      'DeepSeek for research and writing',
      'AI image generation tools',
      'Automate tasks with AI',
      'Build an AI-powered project'
    ],
    requirements: [
      'A computer or smartphone',
      'Free ChatGPT account (we guide you)',
      'No technical background needed',
      'Age 7 and above'
    ],
    syllabus: [
      { week: 1, title: 'Introduction to AI',        duration: '2 sessions', topics: ['What is AI?', 'AI in daily life', 'Tools overview', 'Setting up accounts'] },
      { week: 2, title: 'ChatGPT Fundamentals',      duration: '2 sessions', topics: ['What is ChatGPT?', 'Writing prompts', 'Getting better answers', 'Real use cases'] },
      { week: 3, title: 'Advanced Prompting',        duration: '2 sessions', topics: ['Prompt engineering', 'Role-based prompts', 'Chain prompting', 'Creative writing with AI'] },
      { week: 4, title: 'DeepSeek & Research',       duration: '2 sessions', topics: ['DeepSeek overview', 'Research assistance', 'Summarizing documents', 'Fact checking'] },
      { week: 5, title: 'AI Image Generation',       duration: '3 sessions', topics: ['Image AI tools', 'Writing image prompts', 'Editing and styles', 'Creating illustrations'] },
      { week: 6, title: 'Automation & Productivity', duration: '3 sessions', topics: ['AI for emails', 'Study assistance', 'Content creation', 'Task automation'] },
      { week: 7, title: 'Final AI Project',          duration: '2 sessions', topics: ['Project planning', 'Build and present', 'Peer feedback', 'Certificate'] }
    ],
    reviews: [
      { name: 'Hira Malik',  avatar: 'HM', rating: 5, date: 'Jan 2025', text: 'Amazing course! My kids use ChatGPT for their homework now in the right way. Very practical.' },
      { name: 'Usman Tariq', avatar: 'UT', rating: 5, date: 'Dec 2024', text: 'Sir Ahmad makes AI so easy to understand. Best investment for my child\'s future.' }
    ]
  }
];

// ── Component ────────────────────────────────────────────────────────────────

@Component({
  selector:    'app-course-detail',
  standalone:  true,
  imports:     [RouterLink],
  templateUrl: './course-details.component.html',
  styleUrl:    './course-details.component.css'
})
export class CourseDetailComponent implements OnInit {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  // UI state
  course          = signal<CourseDetail | null>(null);
  activeTab       = signal<'overview' | 'syllabus' | 'teacher' | 'reviews'>('overview');
  expandedWeek    = signal<number | null>(null);
  enrollSuccess   = signal(false);
  videoPlaying    = signal(false);

  // Derived — total topics count across all syllabus weeks
  totalTopics = computed(() =>
    this.course()?.syllabus.reduce((sum, w) => sum + w.topics.length, 0) ?? 0
  );

  // Discount percentage
  discount = computed(() => {
    const c = this.course();
    if (!c) return 0;
    return Math.round(((c.originalPrice - c.price) / c.originalPrice) * 100);
  });

  ngOnInit(): void {
    // Read the :id param from the URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = COURSES_DATA.find(c => c.id === id);

    if (found) {
      this.course.set(found);
    } else {
      // Course not found — redirect to courses list
      this.router.navigate(['/courses']);
    }
  }

  setTab(tab: 'overview' | 'syllabus' | 'teacher' | 'reviews'): void {
    this.activeTab.set(tab);
  }

  toggleWeek(week: number): void {
    this.expandedWeek.update(current => current === week ? null : week);
  }

  playVideo(): void {
    this.videoPlaying.set(true);
  }

  onEnroll(): void {
    this.enrollSuccess.set(true);
    setTimeout(() => this.router.navigate(['/register']), 1800);
  }

  getStars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  }

  formatPrice(price: number): string {
    return `Rs. ${price.toLocaleString()}`;
  }
}
