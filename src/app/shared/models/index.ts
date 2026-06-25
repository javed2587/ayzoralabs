// Student enrollment model — same fields as your Google Form
// When backend is ready, just add: id, createdAt, status fields
export interface StudentEnrollment {
  name: string;
  guardianName: string;
  whatsapp: string;
  age: number;
  course: string;       // matches your course dropdown
  city: string;
  source: string;       // how did you hear about us
  email?: string;       // optional field
}