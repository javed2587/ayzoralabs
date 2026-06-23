import { Component, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive }  from '@angular/router';

// ── Types ─────────────────────────────────────────────────────────────────────
type AdminSection =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'courses'
  | 'attendance'
  | 'fees'
  | 'assignments'
  | 'notifications'
  | 'settings';

// ── Interfaces ────────────────────────────────────────────────────────────────
interface StatCard {
  title:  string;
  value:  string;
  change: string;
  trend:  'up' | 'down';
  icon:   string;
  color:  string;
}

interface Student {
  id:       number;
  name:     string;
  email:    string;
  course:   string;
  status:   'active' | 'inactive';
  joined:   string;
  avatar:   string;
  fee:      'paid' | 'pending' | 'overdue';
}

interface Teacher {
  id:       number;
  name:     string;
  email:    string;
  subject:  string;
  students: number;
  status:   'active' | 'inactive';
  avatar:   string;
  salary:   number;
}

interface RecentActivity {
  id:      number;
  type:    'enrollment' | 'payment' | 'class' | 'assignment';
  message: string;
  time:    string;
  icon:    string;
}

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector:    'app-admin',
  standalone:  true,
  imports:     [RouterLink, RouterLinkActive],
  templateUrl: './admin.component.html',
  styleUrl:    './admin.component.css'
})
export class AdminComponent {

  // ── UI State ──────────────────────────────────────────────────────────────
  activeSection = signal<AdminSection>('dashboard');
  sidebarOpen   = signal<boolean>(false);
  searchQuery   = signal<string>('');

  // ── Admin Info ────────────────────────────────────────────────────────────
  admin = {
    name:   'Javed Iqbal',
    role:   'Super Admin',
    avatar: 'JI',
    email:  'admin@ayzatech.com'
  };

  // ── Stats Cards ───────────────────────────────────────────────────────────
  stats: StatCard[] = [
    {
      title:  'Total Students',
      value:  '248',
      change: '+12 this month',
      trend:  'up',
      icon:   '👨‍🎓',
      color:  'stat-purple'
    },
    {
      title:  'Total Teachers',
      value:  '18',
      change: '+2 this month',
      trend:  'up',
      icon:   '👨‍🏫',
      color:  'stat-blue'
    },
    {
      title:  'Active Courses',
      value:  '24',
      change: '+3 this month',
      trend:  'up',
      icon:   '📚',
      color:  'stat-green'
    },
    {
      title:  'Monthly Revenue',
      value:  'Rs. 186,000',
      change: '+8% vs last month',
      trend:  'up',
      icon:   '💰',
      color:  'stat-orange'
    },
    {
      title:  'Attendance Rate',
      value:  '87%',
      change: '-2% vs last month',
      trend:  'down',
      icon:   '✅',
      color:  'stat-teal'
    },
    {
      title:  'Pending Fees',
      value:  'Rs. 42,000',
      change: '14 students pending',
      trend:  'down',
      icon:   '⚠️',
      color:  'stat-red'
    }
  ];

  // ── Students Mock Data ────────────────────────────────────────────────────
  students: Student[] = [
    { id: 1,  name: 'Ali Hassan',    email: 'ali@gmail.com',    course: 'Python for Kids',      status: 'active',   joined: 'Sep 2024', avatar: 'AH', fee: 'paid'    },
    { id: 2,  name: 'Sara Ahmed',    email: 'sara@gmail.com',   course: 'AI Tools Masterclass', status: 'active',   joined: 'Oct 2024', avatar: 'SA', fee: 'pending' },
    { id: 3,  name: 'Omar Bilal',    email: 'omar@gmail.com',   course: 'Scratch Coding',       status: 'active',   joined: 'Nov 2024', avatar: 'OB', fee: 'paid'    },
    { id: 4,  name: 'Fatima Khan',   email: 'fatima@gmail.com', course: 'Roblox Game Dev',      status: 'inactive', joined: 'Aug 2024', avatar: 'FK', fee: 'overdue' },
    { id: 5,  name: 'Zain Malik',    email: 'zain@gmail.com',   course: 'Python for Kids',      status: 'active',   joined: 'Dec 2024', avatar: 'ZM', fee: 'paid'    },
    { id: 6,  name: 'Hira Tariq',    email: 'hira@gmail.com',   course: 'Web Design',           status: 'active',   joined: 'Jan 2025', avatar: 'HT', fee: 'pending' },
    { id: 7,  name: 'Bilal Qureshi', email: 'bilal@gmail.com',  course: 'AI Tools Masterclass', status: 'active',   joined: 'Jan 2025', avatar: 'BQ', fee: 'paid'    },
    { id: 8,  name: 'Nadia Awan',    email: 'nadia@gmail.com',  course: 'Scratch Coding',       status: 'inactive', joined: 'Jul 2024', avatar: 'NA', fee: 'overdue' },
     { id: 9,  name: 'Ayzal Javed',    email: 'ayzalia@gmail.com',  course: 'Scratch Coding',       status: 'inactive', joined: 'Jul 2024', avatar: 'NA', fee: 'overdue' }
  ];

  // ── Teachers Mock Data ────────────────────────────────────────────────────
  teachers: Teacher[] = [
    { id: 1, name: 'Ustad Javed', email: 'javed@ayzatech.com',  subject: 'Python / Web Dev',  students: 45, status: 'active',   avatar: 'UJ', salary: 35000 },
    { id: 2, name: 'Sir Ahmad',   email: 'ahmad@ayzatech.com',  subject: 'AI Tools',           students: 38, status: 'active',   avatar: 'SA', salary: 30000 },
    { id: 3, name: 'Sir Bilal',   email: 'bilal@ayzatech.com',  subject: 'Game Development',   students: 32, status: 'active',   avatar: 'SB', salary: 32000 },
    { id: 4, name: 'Miss Sara',   email: 'sara@ayzatech.com',   subject: 'Scratch / Design',   students: 28, status: 'active',   avatar: 'MS', salary: 28000 },
    { id: 5, name: 'Sir Kamran',  email: 'kamran@ayzatech.com', subject: 'Web Design',         students: 20, status: 'inactive', avatar: 'SK', salary: 25000 }
  ];

  // ── Recent Activity ───────────────────────────────────────────────────────
  recentActivity: RecentActivity[] = [
    { id: 1, type: 'enrollment',  message: 'Ali Hassan enrolled in Python for Kids',         time: '5 min ago',   icon: '🎓' },
    { id: 2, type: 'payment',     message: 'Sara Ahmed paid monthly fee Rs. 3,500',          time: '12 min ago',  icon: '💰' },
    { id: 3, type: 'class',       message: 'Python for Kids class started by Ustad Javed',   time: '1 hour ago',  icon: '📅' },
    { id: 4, type: 'assignment',  message: 'New assignment added to AI Tools Masterclass',   time: '2 hours ago', icon: '📝' },
    { id: 5, type: 'enrollment',  message: 'Hira Tariq enrolled in Web Design course',       time: '3 hours ago', icon: '🎓' },
    { id: 6, type: 'payment',     message: 'Zain Malik paid monthly fee Rs. 4,500',          time: '5 hours ago', icon: '💰' },
    { id: 7, type: 'class',       message: 'AI Tools Masterclass completed by Sir Ahmad',    time: 'Yesterday',   icon: '✅' }
  ];

  // ── Sidebar Navigation Items ──────────────────────────────────────────────
  navItems = [
    { section: 'dashboard'     as AdminSection, label: 'Dashboard',     icon: '🏠', badge: null  },
    { section: 'students'      as AdminSection, label: 'Students',      icon: '👨‍🎓', badge: '248' },
    { section: 'teachers'      as AdminSection, label: 'Teachers',      icon: '👨‍🏫', badge: '18'  },
    { section: 'courses'       as AdminSection, label: 'Courses',       icon: '📚', badge: '24'  },
    { section: 'attendance'    as AdminSection, label: 'Attendance',    icon: '✅', badge: null  },
    { section: 'fees'          as AdminSection, label: 'Fee Management',icon: '💰', badge: '14'  },
    { section: 'assignments'   as AdminSection, label: 'Assignments',   icon: '📝', badge: null  },
    { section: 'notifications' as AdminSection, label: 'Notifications', icon: '🔔', badge: '5'   },
    { section: 'settings'      as AdminSection, label: 'Settings',      icon: '⚙️', badge: null  }
  ];

  // ── Computed — filtered students by search ────────────────────────────────
  filteredStudents = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.students;
    return this.students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q)
    );
  });

  // ── Computed — quick counts ───────────────────────────────────────────────
  activeStudents  = computed(() => this.students.filter(s => s.status  === 'active').length);
  activeTeachers  = computed(() => this.teachers.filter(t => t.status  === 'active').length);
  pendingFees     = computed(() => this.students.filter(s => s.fee     === 'pending' || s.fee === 'overdue').length);

  // ── Methods ───────────────────────────────────────────────────────────────
  setSection(section: AdminSection): void {
    this.activeSection.set(section);
    this.sidebarOpen.set(false);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  formatSalary(amount: number): string {
    return `Rs. ${amount.toLocaleString()}`;
  }

  // Total revenue from teachers salaries mock
  totalRevenue(): string {
    return 'Rs. 186,000';
  }
}