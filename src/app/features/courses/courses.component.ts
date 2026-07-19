import { Component, computed, signal } from '@angular/core';
import { Course } from '../../shared/models/course';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [RouterLink],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
   // All available filter categories
  categories = ['All', 'Coding', 'AI Tools', 'Game Dev', 'Design'];

  // Active filter — signals keep UI in sync automatically
  activeCategory = signal('All');
  searchQuery    = signal('');

   // Full mock data array — replace with API call later
  allCourses: Course[] = [
    {
      id: 1,
      title: 'Python for Kids',
      description: 'Learn Python programming from scratch with fun projects, games, and real-world examples.',
      teacherName: 'Miss Umima khan',
      teacherAvatar: 'UJ',
      duration: '3 months',
      sessions: 24,
      level: 'Beginner',
      category: 'Coding',
      price: 4500,
      rating: 4.9,
      students: 1240,
      badge: 'Most Popular',
      color: 'color-blue',
      icon: '🐍',
      imageUrl: ''
    },
    {
      id: 2,
      title: 'AI Tools Masterclass',
      description: 'Master ChatGPT, DeepSeek, and other AI tools to create amazing content and automate tasks.',
      teacherName: 'Sir Muhmmad Arhum',
      teacherAvatar: 'SA',
      duration: '2 months',
      sessions: 16,
      level: 'Beginner',
      category: 'AI Tools',
      price: 5500,
      rating: 4.8,
      students: 98,
      badge: 'Trending',
      color: 'color-purple',
      icon: '🤖',
      imageUrl: ''
    },
    {
      id: 3,
      title: 'Roblox Game Development',
      description: 'Build and publish your own 3D Roblox games using Lua scripting and Studio tools.',
      teacherName: 'Sir Bilal',
      teacherAvatar: 'SB',
      duration: '2.5 months',
      sessions: 20,
      level: 'Beginner',
      category: 'Game Dev',
      price: 5000,
      rating: 4.1,
      students: 76,
      color: 'color-green',
      icon: '🎮',
      imageUrl: ''
    },
    {
      id: 4,
      title: 'Scratch Coding for Kids',
      description: 'Perfect introduction to coding for young learners. Build interactive stories and games visually.',
      teacherName: 'Miss Areeba',
      teacherAvatar: 'MS',
      duration: '1.5 months',
      sessions: 12,
      level: 'Beginner',
      category: 'Coding',
      price: 3500,
      rating: 4.9,
      students: 210,
      badge: 'Best for Beginners',
      color: 'color-orange',
      icon: '🎨',
      imageUrl: ''
    },
    {
      id: 5,
      title: 'Web Design with HTML & CSS',
      description: 'Create beautiful, responsive websites from scratch. Learn modern web design fundamentals.',
      teacherName: 'Miss Iman Khan',
      teacherAvatar: 'SK',
      duration: '2 months',
      sessions: 18,
      level: 'Intermediate',
      category: 'Design',
      price: 4500,
      rating: 4.6,
      students: 40,
      color: 'color-pink',
      icon: '🌐',
      imageUrl: ''
    },
    {
      id: 6,
      title: 'Advanced Python & Projects',
      description: 'Take Python to the next level with APIs, databases, automation, and real project building.',
      teacherName: 'Miss Umima khan',
      teacherAvatar: 'UJ',
      duration: '3 months',
      sessions: 24,
      level: 'Advanced',
      category: 'Coding',
      price: 6000,
      rating: 4.8,
      students: 32,
      color: 'color-teal',
      icon: '⚡',
      imageUrl: ''
    },
    {
      id: 7,
      title: 'ChatGPT for Students',
      description: 'Use ChatGPT effectively for studying, writing, research, and creative projects at school.',
      teacherName: 'Sir Atif',
      teacherAvatar: 'SA',
      duration: '1 month',
      sessions: 8,
      level: 'Beginner',
      category: 'AI Tools',
      price: 2500,
      rating: 4.7,
      students: 280,
      badge: 'New',
      color: 'color-indigo',
      icon: '💬',
      imageUrl: ''
    },
    {
      id: 8,
      title: 'Unity Game Development',
      description: 'Build 2D and 3D games with Unity engine. Learn C# scripting and game physics.',
      teacherName: 'Sir Bilal',
      teacherAvatar: 'SB',
      duration: '4 months',
      sessions: 32,
      level: 'Intermediate',
      category: 'Game Dev',
      price: 9000,
      rating: 4.6,
      students: 23,
      color: 'color-red',
      icon: '🕹️',
      imageUrl: ''
    },
    {
      id: 9,
      title: 'Roblox Game Development',
      description: 'Build 2D and 3D games with Unity engine. Learn Lua scripting and game physics.',
      teacherName: 'Sir Fasih-ur-Rehman',
      teacherAvatar: 'SB',
      duration: '4 months',
      sessions: 32,
      level: 'Intermediate',
      category: 'Game Dev',
      price: 6500,
      rating: 4.6,
      students: 28,
      color: 'color-red',
      icon: '🕹️',
      imageUrl: ''
    }
  ];
  // computed() automatically recalculates when activeCategory or searchQuery changes
  filteredCourses = computed(() => {
    let result = this.allCourses;

    // Filter by category
    if (this.activeCategory() !== 'All') {
      result = result.filter(c => c.category === this.activeCategory());
    }

    // Filter by search query (case-insensitive)
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.teacherName.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }

    return result;
  });

   setCategory(cat: string): void {
    this.activeCategory.set(cat);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

   // Generate star display string from rating number
  getStars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  }
  // Format price in Pakistani Rupees
  formatPrice(price: number): string {
    return price === 0 ? 'Free' : `Rs. ${price.toLocaleString()}`;
  }

}
