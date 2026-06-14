import { Review } from "./review";
import { SyllabusWeek } from "./syllabus-week";

export interface CourseDetail {
     id:            number;
  title:         string;
  subtitle:      string;
  description:   string;
  teacher:       string;
  teacherAvatar: string;
  teacherBio:    string;
  teacherCourses: number;
  teacherStudents: number;
  teacherRating:  number;
  duration:      string;
  sessions:      number;
  level:         string;
  category:      string;
  price:         number;
  originalPrice: number;
  rating:        number;
  students:      number;
  language:      string;
  badge?:        string;
  color:         string;
  icon:          string;
  videoUrl:      string;
  whatYouLearn:  string[];
  requirements:  string[];
  syllabus:      SyllabusWeek[];
  reviews:       Review[];
}
