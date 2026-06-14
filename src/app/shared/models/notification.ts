export interface Notification {
     id:      number;
  type:    'class' | 'assignment' | 'fee' | 'result' | 'general';
  title:   string;
  message: string;
  time:    string;
  read:    boolean;
}
