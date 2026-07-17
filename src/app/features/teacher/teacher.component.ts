import { Component, signal, computed }  from '@angular/core';

import { Teacher }                       from '../../shared/models/teacher';

// ── Local interfaces — only used in this component ────────────────────────────

interface TeacherDetail extends Teacher {
  phone:          string;
  joinedDate:     string;
  qualification:  string;
  experience:     string;
  bio:            string;
  rating:         number;
  totalClasses:   number;
  completedClasses: number;
  courses:        string[];
  students: number;
  city: string;
}

interface SalaryRecord {
  month:     string;
  amount:    number;
  status:    'paid' | 'pending';
  paidOn?:   string;
}

interface ClassSchedule {
  id:       number;
  course:   string;
  day:      string;
  time:     string;
  students: number;
  platform: string;
  icon:     string;
}

interface AttendanceSummary {
  month:   string;
  present: number;
  absent:  number;
  total:   number;
}

// View type
type TeacherView = 'list' | 'profile' | 'salary' | 'schedule' | 'attendance';

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector:    'app-teacher',
  standalone:  true,
  imports:     [],
  templateUrl: './teacher.component.html',
  styleUrl:    './teacher.component.css'
})
export class TeacherComponent {

  // ── UI State ──────────────────────────────────────────────────────────────
  activeView       = signal<TeacherView>('list');
  selectedTeacher  = signal<TeacherDetail | null>(null);
  activeTab        = signal<'overview' | 'schedule' | 'salary' | 'attendance'>('overview');
  searchQuery      = signal<string>('');

  // ── Teachers List ─────────────────────────────────────────────────────────
  teachers: TeacherDetail[] = [
    {
      id:               1,
      name:             'Javed Iqbal',
      email:            'javed@ayzatech.com',
      phone:            '0300-4637538',
      city:             'Lahore',
      subject:          'Full stck devloper',
      salary:           65000,
      status:           'active',
      avatar:           'UJ',
      students:         45,
      joinedDate:       'January 2022',
      qualification:    'MSc Computer Science',
      experience:       '8 years',
      bio:              'Expert Python and web developer with 8 years of experience teaching kids aged 10-17. Passionate about making coding fun and accessible for young learners.',
      rating:           4.9,
      totalClasses:     240,
      completedClasses: 228,
      courses:          ['Python for Kids', 'Advanced Python', 'Web Design']
    },
    {
      id:               2,
      name:             'Miss Umaima Khan',
      email:            'umaima@ayzatech.com',
      phone:            '0311-0000000',
         city:           'Rahim Yar Khan',
      subject:          'Scratch Junior',
      salary:           30000,
      status:           'active',
      avatar:           'SA',
      students:         5,
      joinedDate:       'March 2026',
      qualification:    'MS Information Technology',
      experience:       '1 years',
      bio:              'AI educator and content creator specializing in teaching modern AI tools to students and young learners in a fun, interactive way.',
      rating:           4.8,
      totalClasses:     160,
      completedClasses: 152,
      courses:          ['Scratch Coding', 'Python']
    },
    {
      id:               3,
      name:             'Miss Sehar Saeed',
      email:            'saher@ayzatech.com',
      phone:            '0333-5556666',
       city:           'Lahore',
      subject:          'Canva / Video Editing',
      salary:           32000,
      status:           'active',
      avatar:           'SB',
      students:         6,
      joinedDate:       'April 2026',
      qualification:    'BA',
      experience:       '1 years',
      bio:              'Game development expert teaching Roblox Studio, Unity, and game design principles to young creators.',
      rating:           4.7,
      totalClasses:     200,
      completedClasses: 188,
      courses:          ['Designing in Canva', 'Video Editing Mobile Skills']
    },
    {
      id:               4,
      name:             'Miss Areeba',
      email:            'areeba@ayzatech.com',
      phone:            '0345-7778888',
       city:           'Chakwal',
      subject:          'Scratch Junior',
      salary:           28000,
      status:           'active',
      avatar:           'MS',
      students:         28,
      joinedDate:       'June 2026',
      qualification:    'ICS Computer Science',
      experience:       '1 years',
      bio:              'Specialist in teaching beginner coders using Scratch and visual programming tools. Expert at making coding fun for kids aged 7-12.',
      rating:           4.9,
      totalClasses:     120,
      completedClasses: 118,
      courses:          ['Scratch Coding', 'Canva']
    },
    {
      id:               5,
      name:             'Sir Tanweer Atif',
      email:            'tanweer@ayzatech.com',
      phone:            '0321-1112222',
       city:           'Kasure',
      subject:          'Junior Blocks coding',
      salary:           25000,
      status:           'inactive',
      avatar:           'SK',
      students:         0,
      joinedDate:       'July 2026',
      qualification:    'BS Web Technologies',
      experience:       '1 years',
      bio:              'Web design specialist with expertise in HTML, CSS, and responsive design principles.',
      rating:           4.6,
      totalClasses:     140,
      completedClasses: 140,
      courses:          ['Kids Ai Skills, Excel']
    },
    {
      id: 6,
      name: 'Fasih-ur-Rehman',
      email: 'asifajavedslic@gmail.com',
      phone: '03211683152',
       city:           'Rahim Yar Khan',
      subject:          'Roblox Game Developer',
      salary:           25000,
      status:           'inactive',
      avatar:           'SK',
      students:         3,
      joinedDate:       'February 2023',
      qualification:    'Matriculation',
      experience:       '4 years',
      bio:              'Web design specialist with expertise in HTML, CSS, and responsive design principles.',
      rating:           4.6,
      totalClasses:     140,
      completedClasses: 140,
      courses:          ['Roblox Games Development', 'Designing in Canva']
    },
    {
       id: 7,
      name: 'Miss Iman Khan',
      email: 'iman@gmail.com',
      phone: '03211683152',
       city:           'Rahim Yar Khan',
      subject:          'C++ Programer',
      salary:           25000,
      status:           'inactive',
      avatar:           'SK',
      students:         3,
      joinedDate:       'February 2026',
      qualification:    'BScs Computer Science',
      experience:       '1 years',
      bio:              'Web design specialist with expertise in HTML, CSS, and responsive design principles.',
      rating:           4.6,
      totalClasses:     140,
      completedClasses: 140,
      courses:          ['Developer', 'Coloring skill for kids']
    },
     {
       id: 7,
      name: 'Muhmmad Arhum',
      email: 'arhum@gmail.com',
      phone: '03211683152',
       city:           'Lahore',
      subject:          'Scratch 3.0',
      salary:           25000,
      status:           'inactive',
      avatar:           'SK',
      students:         3,
      joinedDate:       'February 2023',
      qualification:    '8th',
      experience:       '4 years',
      bio:              'Web design specialist with expertise in HTML, CSS, and responsive design principles.',
      rating:           4.6,
      totalClasses:     140,
      completedClasses: 140,
      courses:          ['Python coding', 'Scratch blocks coding']
    }
  ];

  // ── Salary Records per teacher ─────────────────────────────────────────
  salaryRecords: Record<number, SalaryRecord[]> = {
    1: [
      { month: 'June 2025',     amount: 35000, status: 'pending'           },
      { month: 'May 2025',      amount: 35000, status: 'paid', paidOn: 'Jun 1, 2025'  },
      { month: 'April 2025',    amount: 35000, status: 'paid', paidOn: 'May 1, 2025'  },
      { month: 'March 2025',    amount: 32000, status: 'paid', paidOn: 'Apr 1, 2025'  },
      { month: 'February 2025', amount: 32000, status: 'paid', paidOn: 'Mar 1, 2025'  },
      { month: 'January 2025',  amount: 32000, status: 'paid', paidOn: 'Feb 1, 2025'  }
    ],
    2: [
      { month: 'June 2025',     amount: 30000, status: 'pending'           },
      { month: 'May 2025',      amount: 30000, status: 'paid', paidOn: 'Jun 1, 2025'  },
      { month: 'April 2025',    amount: 30000, status: 'paid', paidOn: 'May 1, 2025'  },
      { month: 'March 2025',    amount: 28000, status: 'paid', paidOn: 'Apr 1, 2025'  }
    ],
    3: [
      { month: 'June 2025',     amount: 32000, status: 'paid', paidOn: 'Jun 2, 2025'  },
      { month: 'May 2025',      amount: 32000, status: 'paid', paidOn: 'May 2, 2025'  },
      { month: 'April 2025',    amount: 32000, status: 'paid', paidOn: 'Apr 2, 2025'  }
    ],
    4: [
      { month: 'June 2025',     amount: 28000, status: 'pending'           },
      { month: 'May 2025',      amount: 28000, status: 'paid', paidOn: 'Jun 3, 2025'  },
      { month: 'April 2025',    amount: 25000, status: 'paid', paidOn: 'May 3, 2025'  }
    ],
    5: [
      { month: 'May 2025',      amount: 25000, status: 'paid', paidOn: 'Jun 1, 2025'  },
      { month: 'April 2025',    amount: 25000, status: 'paid', paidOn: 'May 1, 2025'  }
    ]
  };

  // ── Class Schedules per teacher ────────────────────────────────────────
  classSchedules: Record<number, ClassSchedule[]> = {
    1: [
      { id: 1, course: 'Python for Kids',  day: 'Monday',    time: '4:00 – 5:00 PM', students: 12, platform: 'Zoom',         icon: '🐍' },
      { id: 2, course: 'Python for Kids',  day: 'Wednesday', time: '4:00 – 5:00 PM', students: 12, platform: 'Zoom',         icon: '🐍' },
      { id: 3, course: 'Advanced Python',  day: 'Friday',    time: '5:00 – 6:00 PM', students: 8,  platform: 'Google Meet',  icon: '⚡' },
      { id: 4, course: 'Web Design',       day: 'Saturday',  time: '3:00 – 4:00 PM', students: 10, platform: 'Zoom',         icon: '🌐' }
    ],
    2: [
      { id: 1, course: 'AI Tools Masterclass', day: 'Tuesday',   time: '5:00 – 6:00 PM', students: 15, platform: 'Zoom',        icon: '🤖' },
      { id: 2, course: 'AI Tools Masterclass', day: 'Thursday',  time: '5:00 – 6:00 PM', students: 15, platform: 'Zoom',        icon: '🤖' },
      { id: 3, course: 'ChatGPT for Students', day: 'Saturday',  time: '2:00 – 3:00 PM', students: 20, platform: 'Google Meet', icon: '💬' }
    ],
    3: [
      { id: 1, course: 'Roblox Game Dev',      day: 'Monday',    time: '5:00 – 6:00 PM', students: 10, platform: 'Zoom',        icon: '🎮' },
      { id: 2, course: 'Unity Game Dev',        day: 'Wednesday', time: '6:00 – 7:00 PM', students: 8,  platform: 'Google Meet', icon: '🕹️' }
    ],
    4: [
      { id: 1, course: 'Scratch Coding',  day: 'Tuesday',  time: '4:00 – 5:00 PM', students: 14, platform: 'Zoom',        icon: '🎨' },
      { id: 2, course: 'Scratch Coding',  day: 'Thursday', time: '4:00 – 5:00 PM', students: 14, platform: 'Zoom',        icon: '🎨' }
    ],
    5: []
  };

  // ── Attendance per teacher ────────────────────────────────────────────
  attendanceSummary: Record<number, AttendanceSummary[]> = {
    1: [
      { month: 'June 2025',     present: 18, absent: 2, total: 20 },
      { month: 'May 2025',      present: 22, absent: 0, total: 22 },
      { month: 'April 2025',    present: 20, absent: 1, total: 21 },
      { month: 'March 2025',    present: 19, absent: 2, total: 21 }
    ],
    2: [
      { month: 'June 2025',     present: 16, absent: 1, total: 17 },
      { month: 'May 2025',      present: 18, absent: 0, total: 18 },
      { month: 'April 2025',    present: 17, absent: 1, total: 18 }
    ],
    3: [
      { month: 'June 2025',     present: 15, absent: 0, total: 15 },
      { month: 'May 2025',      present: 16, absent: 1, total: 17 }
    ],
    4: [
      { month: 'June 2025',     present: 14, absent: 0, total: 14 },
      { month: 'May 2025',      present: 15, absent: 0, total: 15 }
    ],
    5: []
  };

  // ── Computed — filtered teachers list ─────────────────────────────────
  filteredTeachers = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.teachers;
    return this.teachers.filter(t =>
      t.name.toLowerCase().includes(q)    ||
      t.subject.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q)
    );
  });

  // ── Computed — current teacher's salary records ───────────────────────
  currentSalary = computed(() => {
    const t = this.selectedTeacher();
    if (!t) return [];
    return this.salaryRecords[t.id] ?? [];
  });

  // ── Computed — current teacher's schedule ────────────────────────────
  currentSchedule = computed(() => {
    const t = this.selectedTeacher();
    if (!t) return [];
    return this.classSchedules[t.id] ?? [];
  });

  // ── Computed — current teacher's attendance ───────────────────────────
  currentAttendance = computed(() => {
    const t = this.selectedTeacher();
    if (!t) return [];
    return this.attendanceSummary[t.id] ?? [];
  });

  // ── Computed — attendance percentage ─────────────────────────────────
  attendancePercent = computed(() => {
    const records = this.currentAttendance();
    if (!records.length) return 0;
    const totalPresent = records.reduce((s, r) => s + r.present, 0);
    const totalClasses = records.reduce((s, r) => s + r.total,   0);
    return totalClasses ? Math.round((totalPresent / totalClasses) * 100) : 0;
  });

  // ── Computed — total salary paid ─────────────────────────────────────
  totalSalaryPaid = computed(() => {
    return this.currentSalary()
      .filter(s => s.status === 'paid')
      .reduce((sum, s) => sum + s.amount, 0);
  });

  // ── Computed — pending salary ─────────────────────────────────────────
  pendingSalary = computed(() => {
    return this.currentSalary()
      .filter(s => s.status === 'pending')
      .reduce((sum, s) => sum + s.amount, 0);
  });

  // ── Methods ──────────────────────────────────────────────────────────
  selectTeacher(teacher: TeacherDetail): void {
    this.selectedTeacher.set(teacher);
    this.activeView.set('profile');
    this.activeTab.set('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    this.selectedTeacher.set(null);
    this.activeView.set('list');
  }

  setTab(tab: 'overview' | 'schedule' | 'salary' | 'attendance'): void {
    this.activeTab.set(tab);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  getAttendancePct(record: AttendanceSummary): number {
    return record.total ? Math.round((record.present / record.total) * 100) : 0;
  }

  formatAmount(amount: number): string {
    return `Rs. ${amount.toLocaleString()}`;
  }

  getStars(rating: number): string {
    return '★'.repeat(Math.floor(rating));
  }
}