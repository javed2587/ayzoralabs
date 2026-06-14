export interface AttendanceRecord {
    date:    string;
  course:  string;
  status:  'present' | 'absent' | 'late';
}
