import { Component, signal, computed, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface Notification {
  id:        number;
  type:      NotifType;
  title:     string;
  message:   string;
  time:      string;
  timeAgo:   string;
  read:      boolean;
  actionUrl?: string;
  actionLabel?: string;
  icon:      string;
  avatar?:   string;
}

interface NotifGroup {
  label:         string;
  notifications: Notification[];
}

type NotifType   = 'class' | 'assignment' | 'fee' | 'result' | 'general' | 'achievement';
type NotifView   = 'all' | 'unread';
type NotifFilter = 'all' | 'class' | 'assignment' | 'fee' | 'result' | 'achievement';

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector:    'app-notifications',
  standalone:  true,
  imports:     [RouterLink],
  templateUrl: './notifications.component.html',
  styleUrl:    './notifications.component.css'
})
export class NotificationsComponent {

  // ── UI State ────────────────────────────────────────────────────────────────
  dropdownOpen   = signal<boolean>(false);
  activeView     = signal<NotifView>('all');
  activeFilter   = signal<NotifFilter>('all');
  showDeleteConfirm = signal<number | null>(null);

  // ── Notifications Signal ────────────────────────────────────────────────────
  notifications = signal<Notification[]>([
    {
      id:          1,
      type:        'class',
      title:       'Class Starting in 30 Minutes',
      message:     'Your Python for Kids class with Ustad Javed starts at 4:00 PM today. Join on Zoom.',
      time:        'Today, 3:30 PM',
      timeAgo:     '30 min ago',
      read:        false,
      actionUrl:   '/learn/1',
      actionLabel: 'Join Class',
      icon:        '📅',
      avatar:      'UJ'
    },
    {
      id:          2,
      type:        'assignment',
      title:       'Assignment Due Tomorrow',
      message:     'Python Functions Exercise is due tomorrow at 11:59 PM. You have not submitted yet.',
      time:        'Today, 2:00 PM',
      timeAgo:     '2 hours ago',
      read:        false,
      actionUrl:   '/assignments',
      actionLabel: 'View Assignment',
      icon:        '📝',
      avatar:      'UJ'
    },
    {
      id:          3,
      type:        'result',
      title:       'Assignment Graded',
      message:     'Your Variables and Data Types Quiz has been graded. You scored 18/20. Excellent work!',
      time:        'Today, 10:00 AM',
      timeAgo:     '6 hours ago',
      read:        false,
      actionUrl:   '/assignments',
      actionLabel: 'View Grade',
      icon:        '🏆',
      avatar:      'UJ'
    },
    {
      id:          4,
      type:        'achievement',
      title:       'Badge Earned — Fast Learner!',
      message:     'Congratulations! You completed 5 lectures in one week and earned the Fast Learner badge.',
      time:        'Yesterday, 8:00 PM',
      timeAgo:     'Yesterday',
      read:        false,
      actionUrl:   '/student',
      actionLabel: 'View Badge',
      icon:        '🥇'
    },
    {
      id:          5,
      type:        'fee',
      title:       'Fee Payment Reminder',
      message:     'Your monthly fee of Rs. 4,500 for Python for Kids is due on June 30, 2025. Please pay on time.',
      time:        'Yesterday, 9:00 AM',
      timeAgo:     'Yesterday',
      read:        true,
      actionUrl:   '/fees',
      actionLabel: 'Pay Now',
      icon:        '💰'
    },
    {
      id:          6,
      type:        'class',
      title:       'Class Rescheduled',
      message:     'AI Tools Masterclass on Thursday June 19 has been moved to Friday June 20 at 5:00 PM.',
      time:        'Jun 17, 9:00 AM',
      timeAgo:     '2 days ago',
      read:        true,
      icon:        '🔄',
      avatar:      'SA'
    },
    {
      id:          7,
      type:        'assignment',
      title:       'New Assignment Posted',
      message:     'Sir Ahmad has posted a new assignment — ChatGPT Prompt Challenge. Due June 22, 2025.',
      time:        'Jun 16, 2:00 PM',
      timeAgo:     '3 days ago',
      read:        true,
      actionUrl:   '/assignments',
      actionLabel: 'View Assignment',
      icon:        '📋',
      avatar:      'SA'
    },
    {
      id:          8,
      type:        'result',
      title:       'AI Image Project Graded',
      message:     'Your AI Image Creation Project has been graded. You scored 24/25. Outstanding creativity!',
      time:        'Jun 15, 11:00 AM',
      timeAgo:     '4 days ago',
      read:        true,
      actionUrl:   '/assignments',
      actionLabel: 'View Feedback',
      icon:        '⭐',
      avatar:      'SA'
    },
    {
      id:          9,
      type:        'general',
      title:       'New Course Available',
      message:     'Roblox Game Development advanced level is now open for enrollment. Limited seats available!',
      time:        'Jun 14, 10:00 AM',
      timeAgo:     '5 days ago',
      read:        true,
      actionUrl:   '/courses',
      actionLabel: 'Enroll Now',
      icon:        '🎮'
    },
    {
      id:          10,
      type:        'achievement',
      title:       'Course Completed — Scratch Coding',
      message:     'You have successfully completed the Scratch Coding course! Your certificate is ready to download.',
      time:        'Jun 10, 4:00 PM',
      timeAgo:     '9 days ago',
      read:        true,
      actionUrl:   '/student',
      actionLabel: 'Download Certificate',
      icon:        '🎓'
    },
    {
      id:          11,
      type:        'fee',
      title:       'Payment Received',
      message:     'Your fee payment of Rs. 4,500 for May 2025 has been received and confirmed. Thank you!',
      time:        'Jun 1, 2:00 PM',
      timeAgo:     '18 days ago',
      read:        true,
      icon:        '✅'
    },
    {
      id:          12,
      type:        'class',
      title:       'Holiday Notice',
      message:     'There will be no classes on June 5 due to the national holiday. Classes resume June 6.',
      time:        'Jun 3, 9:00 AM',
      timeAgo:     '16 days ago',
      read:        true,
      icon:        '📢'
    }
  ]);

  // ── Computed — unread count ─────────────────────────────────────────────────
  unreadCount = computed<number>(() =>
    this.notifications().filter(n => !n.read).length
  );

  // ── Computed — filtered for full page view ──────────────────────────────────
  filteredNotifications = computed<Notification[]>(() => {
    let result = this.notifications();

    // Filter by read/unread tab
    if (this.activeView() === 'unread') {
      result = result.filter(n => !n.read);
    }

    // Filter by type
    if (this.activeFilter() !== 'all') {
      result = result.filter(n => n.type === this.activeFilter());
    }

    return result;
  });

  // ── Computed — grouped by time for full page ────────────────────────────────
  groupedNotifications = computed<NotifGroup[]>(() => {
    const items = this.filteredNotifications();

    const today     = items.filter(n => n.timeAgo.includes('min') || n.timeAgo.includes('hour'));
    const yesterday = items.filter(n => n.timeAgo === 'Yesterday');
    const older     = items.filter(n =>
      !n.timeAgo.includes('min')  &&
      !n.timeAgo.includes('hour') &&
      n.timeAgo !== 'Yesterday'
    );

    const groups: NotifGroup[] = [];
    if (today.length)     groups.push({ label: 'Today',     notifications: today     });
    if (yesterday.length) groups.push({ label: 'Yesterday', notifications: yesterday });
    if (older.length)     groups.push({ label: 'Earlier',   notifications: older     });

    return groups;
  });

  // ── Computed — recent 5 for dropdown ───────────────────────────────────────
  recentNotifications = computed<Notification[]>(() =>
    this.notifications().slice(0, 5)
  );

  // ── Computed — type counts ──────────────────────────────────────────────────
  typeCounts = computed(() => ({
    all:         this.notifications().length,
    class:       this.notifications().filter(n => n.type === 'class').length,
    assignment:  this.notifications().filter(n => n.type === 'assignment').length,
    fee:         this.notifications().filter(n => n.type === 'fee').length,
    result:      this.notifications().filter(n => n.type === 'result').length,
    achievement: this.notifications().filter(n => n.type === 'achievement').length
  }));

  // ── Methods ──────────────────────────────────────────────────────────────────

  toggleDropdown(): void {
    this.dropdownOpen.update(v => !v);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notif-bell-wrapper')) {
      this.dropdownOpen.set(false);
    }
  }

  markAsRead(id: number): void {
    this.notifications.update(current =>
      current.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllRead(): void {
    this.notifications.update(current =>
      current.map(n => ({ ...n, read: true }))
    );
  }

  deleteNotification(id: number): void {
    this.notifications.update(current =>
      current.filter(n => n.id !== id)
    );
    this.showDeleteConfirm.set(null);
  }

  clearAll(): void {
    this.notifications.update(current =>
      current.filter(n => !n.read)
    );
  }

  setView(view: NotifView): void {
    this.activeView.set(view);
  }

  setFilter(filter: NotifFilter): void {
    this.activeFilter.set(filter);
  }

  onNotifClick(notif: Notification): void {
    this.markAsRead(notif.id);
    this.closeDropdown();
  }

  typeIcon(type: NotifType): string {
    const icons: Record<NotifType, string> = {
      class:       '📅',
      assignment:  '📝',
      fee:         '💰',
      result:      '🏆',
      general:     '📢',
      achievement: '🥇'
    };
    return icons[type];
  }

  typeLabel(type: NotifType): string {
    const labels: Record<NotifType, string> = {
      class:       'Class',
      assignment:  'Assignment',
      fee:         'Fee',
      result:      'Result',
      general:     'General',
      achievement: 'Achievement'
    };
    return labels[type];
  }

  typeColor(type: NotifType): string {
    const colors: Record<NotifType, string> = {
      class:       'type-class',
      assignment:  'type-assignment',
      fee:         'type-fee',
      result:      'type-result',
      general:     'type-general',
      achievement: 'type-achievement'
    };
    return colors[type];
  }
}