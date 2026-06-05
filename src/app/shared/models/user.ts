export interface User {
     id: number;
     email: string;
     role: 'admin' | 'student' | 'teacher';
     token?: string;
}
