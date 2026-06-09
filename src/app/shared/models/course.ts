export interface Course {
    id: number;
    title: string;
    description: string;
    teacherName: string;
    teacherAvatar: string;
    duration: string;
    sessions:    number;
    level:       'Beginner' | 'Intermediate' | 'Advanced';
    category:    string;
    price: number;
    imageUrl: string;
    rating:      number;
    students:    number;
    badge?:      string;  // optional — only some courses have a badge
    color:       string;
    icon:        string;
}
