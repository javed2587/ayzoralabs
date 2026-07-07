import { Component, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

// ── Local Interfaces ──────────────────────────────────────────────────────────

interface FeeRecord {
  id:            number;
  studentName:   string;
  studentAvatar: string;
  course:        string;
  monthlyFee:    number;
  month:         string;
  status:        'paid' | 'unpaid' | 'overdue';
  paidOn?:       string;
  paidAmount?:   number;
  method?:       'cash' | 'bank' | 'easypaisa' | 'jazzcash';
  dueDate:       string;
  notes?:        string;
}

interface MonthlyStats {
  month:       string;
  totalBilled: number;
  collected:   number;
  pending:     number;
  overdue:     number;
  count:       number;
}

interface PaymentMethod {
  value: string;
  label: string;
  icon:  string;
}

type FeeView   = 'list' | 'add-payment' | 'history';
type FeeFilter = 'all' | 'paid' | 'unpaid' | 'overdue';

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector:    'app-fee',
  standalone:  true,
  imports:     [ReactiveFormsModule, RouterLink],
  templateUrl: './fee.component.html',
  styleUrl:    './fee.component.css'
})
export class FeeComponent {

  private fb = inject(FormBuilder);

  // ── UI State ────────────────────────────────────────────────────────────────
  activeView    = signal<FeeView>('list');
  activeFilter  = signal<FeeFilter>('all');
  searchQuery   = signal<string>('');
  submitSuccess = signal<boolean>(false);
  isLoading     = signal<boolean>(false);
  selectedMonth = signal<string>('June 2025');

  // ── Payment Methods ─────────────────────────────────────────────────────────
  paymentMethods: PaymentMethod[] = [
    { value: 'cash',       label: 'Cash',       icon: '💵' },
    { value: 'bank',       label: 'Bank Transfer', icon: '🏦' },
    { value: 'easypaisa',  label: 'EasyPaisa',  icon: '📱' },
    { value: 'jazzcash',   label: 'JazzCash',   icon: '📲' },
    { value: 'Sadapay',   label: 'Sadapay',   icon: '💳' }
  ];

  // ── Available Months ────────────────────────────────────────────────────────
  months: string[] = [
    'June 2025', 'May 2025', 'April 2025',
    'March 2025', 'February 2025', 'January 2025'
  ];

  // ── Fee Records Mock Data ───────────────────────────────────────────────────
  feeRecords: FeeRecord[] = [
    {
      id: 1, studentName: 'Ali Hassan',    studentAvatar: 'AH',
      course: 'Python for Kids',      monthlyFee: 4500,
      month: 'June 2025',  status: 'paid',
      paidOn: 'Jun 3, 2025',  paidAmount: 4500,
      method: 'cash', dueDate: 'Jun 10, 2025'
    },
    {
      id: 2, studentName: 'Sara Ahmed',    studentAvatar: 'SA',
      course: 'AI Tools Masterclass', monthlyFee: 3500,
      month: 'June 2025',  status: 'unpaid',
      dueDate: 'Jun 10, 2025'
    },
    {
      id: 3, studentName: 'Omar Bilal',    studentAvatar: 'OB',
      course: 'Scratch Coding',       monthlyFee: 2500,
      month: 'June 2025',  status: 'paid',
      paidOn: 'Jun 1, 2025',  paidAmount: 2500,
      method: 'easypaisa', dueDate: 'Jun 10, 2025'
    },
    {
      id: 4, studentName: 'Fatima Khan',   studentAvatar: 'FK',
      course: 'Roblox Game Dev',      monthlyFee: 5000,
      month: 'June 2025',  status: 'overdue',
      dueDate: 'Jun 10, 2025',
      notes: 'Student not responding to messages'
    },
    {
      id: 5, studentName: 'Zain Malik',    studentAvatar: 'ZM',
      course: 'Python for Kids',      monthlyFee: 4500,
      month: 'June 2025',  status: 'paid',
      paidOn: 'Jun 5, 2025',  paidAmount: 4500,
      method: 'bank', dueDate: 'Jun 10, 2025'
    },
    {
      id: 6, studentName: 'Hira Tariq',    studentAvatar: 'HT',
      course: 'Web Design',           monthlyFee: 4000,
      month: 'June 2025',  status: 'unpaid',
      dueDate: 'Jun 10, 2025'
    },
    {
      id: 7, studentName: 'Bilal Qureshi', studentAvatar: 'BQ',
      course: 'AI Tools Masterclass', monthlyFee: 3500,
      month: 'June 2025',  status: 'paid',
      paidOn: 'Jun 2, 2025',  paidAmount: 3500,
      method: 'jazzcash', dueDate: 'Jun 10, 2025'
    },
    {
      id: 8, studentName: 'Nadia Awan',    studentAvatar: 'NA',
      course: 'Scratch Coding',       monthlyFee: 2500,
      month: 'June 2025',  status: 'overdue',
      dueDate: 'Jun 10, 2025',
      notes: 'Promised to pay by end of month'
    },
    {
      id: 9, studentName: 'Usman Tariq',   studentAvatar: 'UT',
      course: 'Unity Game Dev',       monthlyFee: 7000,
      month: 'June 2025',  status: 'paid',
      paidOn: 'Jun 4, 2025',  paidAmount: 7000,
      method: 'bank', dueDate: 'Jun 10, 2025'
    },
    {
      id: 10, studentName: 'Ayesha Baig',  studentAvatar: 'AB',
      course: 'Python for Kids',      monthlyFee: 4500,
      month: 'June 2025',  status: 'unpaid',
      dueDate: 'Jun 10, 2025'
    },
      {
      id: 11, studentName: 'Kamran Shah',  studentAvatar: 'AB',
      course: 'Unity Game Development',      monthlyFee: 7000,
      month: 'June 2025',  status: 'overdue',
      dueDate: 'Jun 10, 2025'
    }
  ];

  // ── Monthly Stats Mock ──────────────────────────────────────────────────────
  monthlyStats: MonthlyStats[] = [
    { month: 'June 2025',     totalBilled: 41500, collected: 22000, pending: 12000, overdue: 7500,  count: 10 },
    { month: 'May 2025',      totalBilled: 39000, collected: 35500, pending: 0,     overdue: 3500,  count: 10 },
    { month: 'April 2025',    totalBilled: 39000, collected: 39000, pending: 0,     overdue: 0,     count: 10 },
    { month: 'March 2025',    totalBilled: 37500, collected: 34000, pending: 0,     overdue: 3500,  count: 9  },
    { month: 'February 2025', totalBilled: 37500, collected: 37500, pending: 0,     overdue: 0,     count: 9  },
    { month: 'January 2025',  totalBilled: 35000, collected: 35000, pending: 0,     overdue: 0,     count: 9  }
  ];

  // ── Student Names for dropdown ──────────────────────────────────────────────
  studentNames: string[] = [
    'Ali Hassan', 'Sara Ahmed', 'Omar Bilal',
    'Fatima Khan', 'Zain Malik', 'Hira Tariq',
    'Bilal Qureshi', 'Nadia Awan', 'Usman Tariq', 'Ayesha Baig'
  ];

  // ── Payment Form ────────────────────────────────────────────────────────────
  paymentForm = this.fb.group({
    studentName: ['',      Validators.required],
    course:      ['',      Validators.required],
    amount:      [null,    [Validators.required, Validators.min(100)]],
    month:       ['June 2025', Validators.required],
    method:      ['cash',  Validators.required],
    paidOn:      ['',      Validators.required],
    notes:       ['']
  });

  // Getters
  get studentName() { return this.paymentForm.get('studentName'); }
  get course()      { return this.paymentForm.get('course');      }
  get amount()      { return this.paymentForm.get('amount');      }
  get month()       { return this.paymentForm.get('month');       }
  get method()      { return this.paymentForm.get('method');      }
  get paidOn()      { return this.paymentForm.get('paidOn');      }

  // ── Computed — filtered records ─────────────────────────────────────────────
  filteredRecords = computed(() => {
    let result = this.feeRecords;

    // Filter by status tab
    if (this.activeFilter() !== 'all') {
      result = result.filter(r => r.status === this.activeFilter());
    }

    // Filter by search query
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      result = result.filter(r =>
        r.studentName.toLowerCase().includes(q) ||
        r.course.toLowerCase().includes(q)
      );
    }

    return result;
  });

  // ── Computed — summary numbers ──────────────────────────────────────────────
  totalBilled = computed(() =>
    this.feeRecords.reduce((s, r) => s + r.monthlyFee, 0)
  );

  totalCollected = computed(() =>
    this.feeRecords
      .filter(r => r.status === 'paid')
      .reduce((s, r) => s + (r.paidAmount ?? 0), 0)
  );

  totalPending = computed(() =>
    this.feeRecords
      .filter(r => r.status === 'unpaid')
      .reduce((s, r) => s + r.monthlyFee, 0)
  );

  totalOverdue = computed(() =>
    this.feeRecords
      .filter(r => r.status === 'overdue')
      .reduce((s, r) => s + r.monthlyFee, 0)
  );

  paidCount    = computed(() => this.feeRecords.filter(r => r.status === 'paid').length);
  unpaidCount  = computed(() => this.feeRecords.filter(r => r.status === 'unpaid').length);
  overdueCount = computed(() => this.feeRecords.filter(r => r.status === 'overdue').length);

  collectionRate = computed(() =>
    Math.round((this.totalCollected() / this.totalBilled()) * 100)
  );

  // ── Methods ─────────────────────────────────────────────────────────────────
  setView(view: FeeView): void {
    this.activeView.set(view);
    this.submitSuccess.set(false);
  }

  setFilter(filter: FeeFilter): void {
    this.activeFilter.set(filter);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  // Mark a fee as paid directly from the table
  markAsPaid(record: FeeRecord): void {
    record.status    = 'paid';
    record.paidOn    = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    record.paidAmount = record.monthlyFee;
    record.method    = 'cash';
  }

  onSubmit(): void {
    this.paymentForm.markAllAsTouched();
    if (this.paymentForm.invalid) return;

    this.isLoading.set(true);

    // Simulate API call — replace with real HTTP call after backend
    setTimeout(() => {
      console.log('Payment recorded:', this.paymentForm.value);
      this.isLoading.set(false);
      this.submitSuccess.set(true);
      this.paymentForm.reset({ method: 'cash', month: 'June 2025' });
    }, 1500);
  }

  formatAmount(amount: number): string {
    return `Rs. ${amount.toLocaleString()}`;
  }

  getMethodIcon(method?: string): string {
    return this.paymentMethods.find(m => m.value === method)?.icon ?? '💵';
  }

  getCollectionPercent(stat: MonthlyStats): number {
    return stat.totalBilled
      ? Math.round((stat.collected / stat.totalBilled) * 100)
      : 0;
  }
}