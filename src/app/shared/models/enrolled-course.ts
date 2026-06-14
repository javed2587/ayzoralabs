export interface EnrolledCourse {
     id:          number;
  title:       string;
  teacher:     string;
  icon:        string;
  color:       string;
  progress:    number;   // 0–100
  nextClass:   string;
  totalSessions: number;
  completedSessions: number;
  status:      'active' | 'completed' | 'paused';
}
