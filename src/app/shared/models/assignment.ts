export interface Assignment {
     id:       number;
  title:    string;
  course:   string;
  dueDate:  string;
  status:   'pending' | 'submitted' | 'graded';
  grade?:   string;
}
