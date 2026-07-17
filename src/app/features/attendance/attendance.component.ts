import { Component, signal, computed } from '@angular/core';
//import { RouterLink }                   from '@angular/router';

// ── Local Interfaces ──────────────────────────────────────────────────────────

interface Student {
  id:     number;
  name:   string;
  avatar: string;
}

interface ClassSession {
  id:       number;
  name:     string;
  teacher:  string;
  icon:     string;
  color:    string;
  schedule: string;
  students: Student[];
}

interface AttendanceEntry {
  studentId: number;
  status:    AttendanceStatus;
}

interface MonthlyReport {
  studentId:   number;
  studentName: string;
  avatar:      string;
  present:     number;
  absent:      number;
  late:        number;
  total:       number;
}

interface DailyRecord {
  date:    string;
  entries: AttendanceEntry[];
}

// ── Types ─────────────────────────────────────────────────────────────────────
type AttendanceStatus = 'present' | 'absent' | 'late' | 'none';
type AttendanceView   = 'mark' | 'history' | 'report';

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector:    'app-attendance',
  standalone:  true,
  imports:     [],
  templateUrl: './attendance.component.html',
  styleUrl:    './attendance.component.css'
})
export class AttendanceComponent {

  // ── UI State ────────────────────────────────────────────────────────────────
  activeView    = signal<AttendanceView>('mark');
  selectedClass = signal<ClassSession | null>(null);
  selectedDate  = signal<string>(
    new Date().toISOString().split('T')[0]
  );
  saveSuccess   = signal<boolean>(false);

  // ── Today's attendance map — key is studentId, value is status ───────────
  // Record<number, AttendanceStatus> means: object with number keys and status values
  todayAttendance = signal<Record<number, AttendanceStatus>>({});

  // ── Class Sessions Mock Data ─────────────────────────────────────────────
  classes: ClassSession[] = [
    {
      id:       1,
      name:     'Python for Kids',
      teacher:  'Ustad Javed',
      icon:     '🐍',
      color:    'color-blue',
      schedule: 'Mon, Wed · 4:00 PM',
      students: [
        { id: 1, name: 'Ali Hassan',    avatar: 'AH' },
        { id: 2, name: 'Zain Malik',    avatar: 'ZM' },
        { id: 3, name: 'Ayesha Baig',   avatar: 'AB' },
        { id: 4, name: 'Omar Bilal',    avatar: 'OB' },
        { id: 5, name: 'Fatima Noor',   avatar: 'FN' },
        { id: 6, name: 'Hassan Raza',   avatar: 'HR' },
        { id: 7, name: 'Sana Tariq',    avatar: 'ST' },
        { id: 8, name: 'Bilal Ahmed',   avatar: 'BA' }
      ]
    },
    {
      id:       2,
      name:     'AI Tools Masterclass',
      teacher:  'Sir Ahmad',
      icon:     '🤖',
      color:    'color-purple',
      schedule: 'Tue, Thu · 5:00 PM',
      students: [
        { id: 9,  name: 'Sara Ahmed',    avatar: 'SA' },
        { id: 10, name: 'Hira Tariq',    avatar: 'HT' },
        { id: 11, name: 'Usman Tariq',   avatar: 'UT' },
        { id: 12, name: 'Bilal Qureshi', avatar: 'BQ' },
        { id: 13, name: 'Nadia Awan',    avatar: 'NA' },
        { id: 14, name: 'Kamran Shah',   avatar: 'KS' }
      ]
    },
    {
      id:       3,
      name:     'Scratch Coding',
      teacher:  'Miss Sara',
      icon:     '🎨',
      color:    'color-orange',
      schedule: 'Tue, Thu · 4:00 PM',
      students: [
        { id: 15, name: 'Ahmed Raza',    avatar: 'AR' },
        { id: 16, name: 'Layla Khan',    avatar: 'LK' },
        { id: 17, name: 'Imran Butt',    avatar: 'IB' },
        { id: 18, name: 'Maryam Ali',    avatar: 'MA' },
        { id: 19, name: 'Salman Iqbal',  avatar: 'SI' }
      ]
    },
    {
      id:       4,
      name:     'Roblox Game Dev',
      teacher:  'Sir Bilal',
      icon:     '🎮',
      color:    'color-green',
      schedule: 'Mon, Wed · 5:00 PM',
      students: [
        { id: 20, name: 'Tariq Mahmood', avatar: 'TM' },
        { id: 21, name: 'Rehan Sheikh',  avatar: 'RS' },
        { id: 22, name: 'Zara Hussain',  avatar: 'ZH' },
        { id: 23, name: 'Faisal Noon',   avatar: 'FN' }
      ]
    },
     {
      id:       5,
      name:     'Web Design',
      teacher:  'Sir Kamran',
      icon:     '🎮',
      color:    'purple',
      schedule: 'Mon, Wed · 5:00 PM',
      students: [
        { id: 24, name: 'Javed Mahmood', avatar: 'TM' },
        { id: 25, name: 'Yahya Sheikh',  avatar: 'RS' },
        { id: 26, name: 'Zohaib Khan',  avatar: 'ZH' },
        { id: 27, name: 'Hijaab Fatima',   avatar: 'FN' }
      ]
    }
  ];

  // ── Past attendance history (mock — 5 days) ───────────────────────────────
  attendanceHistory: Record<number, DailyRecord[]> = {
    1: [
      {
        date: '2025-06-16',
        entries: [
          { studentId: 1, status: 'present' },
          { studentId: 2, status: 'present' },
          { studentId: 3, status: 'absent'  },
          { studentId: 4, status: 'present' },
          { studentId: 5, status: 'late'    },
          { studentId: 6, status: 'present' },
          { studentId: 7, status: 'present' },
          { studentId: 8, status: 'absent'  }
        ]
      },
      {
        date: '2025-06-18',
        entries: [
          { studentId: 1, status: 'present' },
          { studentId: 2, status: 'late'    },
          { studentId: 3, status: 'present' },
          { studentId: 4, status: 'present' },
          { studentId: 5, status: 'present' },
          { studentId: 6, status: 'absent'  },
          { studentId: 7, status: 'present' },
          { studentId: 8, status: 'present' }
        ]
      },
      {
        date: '2025-06-11',
        entries: [
          { studentId: 1, status: 'present' },
          { studentId: 2, status: 'present' },
          { studentId: 3, status: 'present' },
          { studentId: 4, status: 'late'    },
          { studentId: 5, status: 'absent'  },
          { studentId: 6, status: 'present' },
          { studentId: 7, status: 'absent'  },
          { studentId: 8, status: 'present' }
        ]
      }
    ],
    2: [
      {
        date: '2025-06-17',
        entries: [
          { studentId: 9,  status: 'present' },
          { studentId: 10, status: 'present' },
          { studentId: 11, status: 'absent'  },
          { studentId: 12, status: 'present' },
          { studentId: 13, status: 'late'    },
          { studentId: 14, status: 'present' }
        ]
      },
      {
        date: '2025-06-12',
        entries: [
          { studentId: 9,  status: 'late'    },
          { studentId: 10, status: 'present' },
          { studentId: 11, status: 'present' },
          { studentId: 12, status: 'absent'  },
          { studentId: 13, status: 'present' },
          { studentId: 14, status: 'present' }
        ]
      }
    ],
    3: [
      {
        date: '2025-06-17',
        entries: [
          { studentId: 15, status: 'present' },
          { studentId: 16, status: 'present' },
          { studentId: 17, status: 'late'    },
          { studentId: 18, status: 'present' },
          { studentId: 19, status: 'absent'  }
        ]
      }
    ],
    4: [
      {
        date: '2025-06-16',
        entries: [
          { studentId: 20, status: 'present' },
          { studentId: 21, status: 'absent'  },
          { studentId: 22, status: 'present' },
          { studentId: 23, status: 'late'    }
        ]
      }
    ]
  };

  // ── Computed — monthly report for selected class ───────────────────────────
  monthlyReport = computed<MonthlyReport[]>(() => {
    const cls = this.selectedClass();
    if (!cls) return [];

    const history = this.attendanceHistory[cls.id] ?? [];

    // Build a report for each student
    return cls.students.map(student => {
      let present = 0;
      let absent  = 0;
      let late    = 0;
      const total = history.length;

      history.forEach(day => {
        const entry = day.entries.find(e => e.studentId === student.id);
        if (entry) {
          if (entry.status === 'present') present++;
          if (entry.status === 'absent')  absent++;
          if (entry.status === 'late')    late++;
        }
      });

      return {
        studentId:   student.id,
        studentName: student.name,
        avatar:      student.avatar,
        present,
        absent,
        late,
        total
      };
    });
  });

  // ── Computed — today's summary counts ────────────────────────────────────
  presentCount = computed(() =>
    Object.values(this.todayAttendance())
      .filter(s => s === 'present').length
  );

  absentCount = computed(() =>
    Object.values(this.todayAttendance())
      .filter(s => s === 'absent').length
  );

  lateCount = computed(() =>
    Object.values(this.todayAttendance())
      .filter(s => s === 'late').length
  );

  markedCount = computed(() =>
    Object.values(this.todayAttendance())
      .filter(s => s !== 'none').length
  );

  // ── Computed — history for selected class ────────────────────────────────
  classHistory = computed(() => {
    const cls = this.selectedClass();
    if (!cls) return [];
    return (this.attendanceHistory[cls.id] ?? [])
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  // ── Methods ──────────────────────────────────────────────────────────────

  selectClass(cls: ClassSession): void {
    this.selectedClass.set(cls);
    // Initialize all students with 'none' status
    const initial: Record<number, AttendanceStatus> = {};
    cls.students.forEach(s => initial[s.id] = 'none');
    this.todayAttendance.set(initial);
    this.saveSuccess.set(false);
  }

  setView(view: AttendanceView): void {
    this.activeView.set(view);
    this.saveSuccess.set(false);
  }

  // Mark attendance for one student
  markAttendance(studentId: number, status: AttendanceStatus): void {
    this.todayAttendance.update(current => ({
      ...current,         // spread existing entries
      [studentId]: status // update only this student
    }));
  }

  // Mark all students at once
  markAll(status: AttendanceStatus): void {
    const cls = this.selectedClass();
    if (!cls) return;
    const updated: Record<number, AttendanceStatus> = {};
    cls.students.forEach(s => updated[s.id] = status);
    this.todayAttendance.set(updated);
  }

  // Get current status for a student
  getStatus(studentId: number): AttendanceStatus {
    return this.todayAttendance()[studentId] ?? 'none';
  }

  // Save attendance record
  saveAttendance(): void {
    const cls = this.selectedClass();
    if (!cls) return;

    const total     = cls.students.length;
    const unmarked  = cls.students.filter(
      s => this.getStatus(s.id) === 'none'
    ).length;

    if (unmarked > 0) {
      alert(`Please mark attendance for all ${total} students. ${unmarked} still unmarked.`);
      return;
    }

    console.log('Saving attendance:', {
      classId: cls.id,
      date:    this.selectedDate(),
      entries: Object.entries(this.todayAttendance())
        .map(([id, status]) => ({ studentId: Number(id), status }))
    });

    this.saveSuccess.set(true);
  }

  // Helper — attendance percentage
  getPercent(present: number, total: number): number {
    return total ? Math.round((present / total) * 100) : 0;
  }

  // Helper — format date for display
  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month:   'short',
      day:     'numeric',
      year:    'numeric'
    });
  }

  // Helper — get status icon
  statusIcon(status: AttendanceStatus): string {
    const icons: Record<AttendanceStatus, string> = {
      present: '✅',
      absent:  '❌',
      late:    '⚠️',
      none:    '⬜'
    };
    return icons[status];
  }

  // Overall attendance percent across all classes
  overallPercent = computed(() => {
    let totalPresent = 0;
    let totalEntries = 0;
    Object.values(this.attendanceHistory).forEach(days => {
      days.forEach(day => {
        day.entries.forEach(e => {
          totalEntries++;
          if (e.status === 'present') totalPresent++;
        });
      });
    });
    return totalEntries ? Math.round((totalPresent / totalEntries) * 100) : 0;
  });
  getTotalStudents(): number {
  return this.classes.reduce((acc, c) => acc + c.students.length, 0);
}

getTotalSessions(): number {
  return this.classes.reduce(
    (acc, c) => acc + (this.attendanceHistory[c.id]?.length ?? 0), 0
  );
}
}