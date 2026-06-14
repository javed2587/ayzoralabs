import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

// ── Types ────────────────────────────────────────────────────────────────────

type SectionType = 'dashboard' | 'courses' | 'attendance' | 'assignments' | 'notifications' | 'profile';
type StatusType  = 'active' | 'completed' | 'paused';
type AttendType  = 'present' | 'absent' | 'late';
type NotifType   = 'class' | 'assignment' | 'fee' | 'result' | 'general';
type AssignType  = 'pending' | 'submitted' | 'graded';

// ── Interfaces ───────────────────────────────────────────────────────────────

interface EnrolledCourse {
  id:                number;
  title:             string;
  teacher:           string;
  icon:              string;
  color:             string;
  progress:          number;
  nextClass:         string;
  totalSessions:     number;
  completedSessions: number;
  status:            StatusType;
}

interface AttendanceRecord {
  date:   string;
  course: string;
  status: AttendType;
}

interface UpcomingClass {
  id:       number;
  course:   string;
  teacher:  string;
  icon:     string;
  day:      string;
  time:     string;
  duration: string;
  platform: string;
  color:    string;
}

interface Notification {
  id:      number;
  type:    NotifType;
  title:   string;
  message: string;
  time:    string;
  read:    boolean;
}

interface Assignment {
  id:      number;
  title:   string;
  course:  string;
  dueDate: string;
  status:  AssignType;
  grade?:  string;
}

interface Student {
  name:       string;
  email:      string;
  avatar:     string;
  enrolledOn: string;
  parentName: string;
  phone:      string;
  level:      string;
}

// ── Component ────────────────────────────────────────────────────────────────

@Component({
  selector:    'app-student-dashboard',
  standalone:  true,
  imports:     [RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrl:    './student-dashboard.component.css'
})
export class StudentDashboardComponent {

  // ── UI State ──────────────────────────────────────────────────────────────
  activeSection = signal<SectionType>('dashboard');
  sidebarOpen   = signal<boolean>(false);

  // ── Student ───────────────────────────────────────────────────────────────
  student = signal<Student>({
    name:       'Ali Hassan',
    email:      'ali.hassan@gmail.com',
    avatar:     'AH',
    enrolledOn: 'September 2024',
    parentName: 'Hassan Ahmed',
    phone:      '0300-1234567',
    level:      'Intermediate'
  });

  // ── Enrolled Courses ──────────────────────────────────────────────────────
  enrolledCourses = signal<EnrolledCourse[]>([
    {
      id:                1,
      title:             'Python for Kids',
      teacher:           'Ustad Javed',
      icon:              '🐍',
      color:             'color-blue',
      progress:          65,
      nextClass:         'Tomorrow, 4:00 PM',
      totalSessions:     24,
      completedSessions: 15,
      status:            'active'
    },
    {
      id:                2,
      title:             'AI Tools Masterclass',
      teacher:           'Sir Ahmad',
      icon:              '🤖',
      color:             'color-purple',
      progress:          30,
      nextClass:         'Wednesday, 5:00 PM',
      totalSessions:     16,
      completedSessions: 5,
      status:            'active'
    },
    {
      id:                3,
      title:             'Scratch Coding',
      teacher:           'Miss Sara',
      icon:              '🎨',
      color:             'color-orange',
      progress:          100,
      nextClass:         'Completed',
      totalSessions:     12,
      completedSessions: 12,
      status:            'completed'
    }
  ]);

  // ── Attendance ────────────────────────────────────────────────────────────
  attendanceRecords = signal<AttendanceRecord[]>([
    { date: 'Mon, Jun 10', course: 'Python for Kids', status: 'present' },
    { date: 'Tue, Jun 11', course: 'AI Tools',        status: 'present' },
    { date: 'Wed, Jun 12', course: 'Python for Kids', status: 'late'    },
    { date: 'Thu, Jun 13', course: 'AI Tools',        status: 'absent'  },
    { date: 'Fri, Jun 14', course: 'Python for Kids', status: 'present' },
    { date: 'Mon, Jun 17', course: 'AI Tools',        status: 'present' },
    { date: 'Tue, Jun 18', course: 'Python for Kids', status: 'present' },
    { date: 'Wed, Jun 19', course: 'AI Tools',        status: 'present' }
  ]);

  // ── Upcoming Classes ──────────────────────────────────────────────────────
  upcomingClasses = signal<UpcomingClass[]>([
    {
      id:       1,
      course:   'Python for Kids',
      teacher:  'Ustad Javed',
      icon:     '🐍',
      day:      'Tomorrow',
      time:     '4:00 PM – 5:00 PM',
      duration: '1 hour',
      platform: 'Zoom',
      color:    'color-blue'
    },
    {
      id:       2,
      course:   'AI Tools Masterclass',
      teacher:  'Sir Ahmad',
      icon:     '🤖',
      day:      'Wednesday',
      time:     '5:00 PM – 6:00 PM',
      duration: '1 hour',
      platform: 'Google Meet',
      color:    'color-purple'
    },
    {
      id:       3,
      course:   'Python for Kids',
      teacher:  'Ustad Javed',
      icon:     '🐍',
      day:      'Friday',
      time:     '4:00 PM – 5:00 PM',
      duration: '1 hour',
      platform: 'Zoom',
      color:    'color-blue'
    }
  ]);

  // ── Notifications ─────────────────────────────────────────────────────────
  notifications = signal<Notification[]>([
    { id: 1, type: 'class',      title: 'Class Reminder',      message: 'Python for Kids class starts in 1 hour. Join on Zoom.',            time: '1 hour ago',  read: false },
    { id: 2, type: 'assignment', title: 'Assignment Due',       message: 'Your Python Functions assignment is due tomorrow at 11:59 PM.',     time: '3 hours ago', read: false },
    { id: 3, type: 'result',     title: 'Grade Posted',         message: 'Your Variables Quiz has been graded. You scored 18/20. Well done!', time: 'Yesterday',   read: false },
    { id: 4, type: 'fee',        title: 'Fee Reminder',         message: 'Monthly fee of Rs. 4,500 is due on June 30, 2024.',                 time: '2 days ago',  read: true  },
    { id: 5, type: 'general',    title: 'New Course Available', message: 'Roblox Game Development is now open for enrollment.',               time: '3 days ago',  read: true  },
    { id: 6, type: 'class',      title: 'Class Rescheduled',    message: 'AI Tools class on Thursday has been moved to Friday 5 PM.',         time: '4 days ago',  read: true  }
  ]);

  // ── Assignments ───────────────────────────────────────────────────────────
  assignments = signal<Assignment[]>([
    { id: 1, title: 'Python Functions Exercise',   course: 'Python for Kids', dueDate: 'Jun 20, 2024', status: 'pending'                },
    { id: 2, title: 'Variables & Data Types Quiz', course: 'Python for Kids', dueDate: 'Jun 15, 2024', status: 'graded',   grade: '18/20' },
    { id: 3, title: 'ChatGPT Prompt Challenge',    course: 'AI Tools',        dueDate: 'Jun 22, 2024', status: 'submitted'               },
    { id: 4, title: 'Loops Practice Set',          course: 'Python for Kids', dueDate: 'Jun 25, 2024', status: 'pending'                },
    { id: 5, title: 'AI Image Creation Project',   course: 'AI Tools',        dueDate: 'Jun 18, 2024', status: 'graded',   grade: '20/20' }
  ]);

  // ── Computed Values ───────────────────────────────────────────────────────

  totalPresent = computed<number>(() =>
    this.attendanceRecords().filter(r => r.status === 'present').length
  );

  attendancePercent = computed<number>(() => {
    const total = this.attendanceRecords().length;
    return total === 0 ? 0 : Math.round((this.totalPresent() / total) * 100);
  });

  unreadCount = computed<number>(() =>
    this.notifications().filter(n => !n.read).length
  );

  completedCourses = computed<number>(() =>
    this.enrolledCourses().filter(c => c.status === 'completed').length
  );

  pendingAssignments = computed<number>(() =>
    this.assignments().filter(a => a.status === 'pending').length
  );

  absentCount = computed<number>(() =>
    this.attendanceRecords().filter(r => r.status === 'absent').length
  );

  lateCount = computed<number>(() =>
    this.attendanceRecords().filter(r => r.status === 'late').length
  );

  // ── Methods ───────────────────────────────────────────────────────────────

  setSection(section: SectionType): void {
    this.activeSection.set(section);
    this.sidebarOpen.set(false);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  markAsRead(id: number): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllRead(): void {
    this.notifications.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
  }

  notifIcon(type: NotifType): string {
    const icons: Record<NotifType, string> = {
      class:      '📅',
      assignment: '📝',
      fee:        '💰',
      result:     '🏆',
      general:    '📢'
    };
    return icons[type];
  }

  getFirstName(): string {
    return this.student().name.split(' ')[0];
  }
}