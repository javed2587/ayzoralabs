import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
   stats = [
    { value: '12,000+', label: 'Students Enrolled' },
    { value: '200+',    label: 'Expert Mentors'     },
    { value: '50+',     label: 'Live Courses'        },
    { value: '98%',     label: 'Success Rate'        }
  ];

  features = [
    {
      icon: '🎯',
      title: 'Live 1-on-1 Classes',
      desc: 'Learn directly from expert mentors in real-time interactive sessions tailored to your pace.'
    },
    {
      icon: '🏆',
      title: 'Certified Courses',
      desc: 'Earn globally recognized certificates that boost your career and open new opportunities.'
    },
    {
      icon: '📱',
      title: 'Learn Anywhere',
      desc: 'Access all lessons, assignments, and live sessions from any device, anytime you want.'
    },
    {
      icon: '🤖',
      title: 'AI-Powered Learning',
      desc: 'Smart recommendations and personalized learning paths powered by artificial intelligence.'
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Parent Dashboard',
      desc: 'Track your child\'s progress, attendance, and performance all in one place.'
    },
    {
      icon: '💬',
      title: 'Community Support',
      desc: 'Join thousands of learners, share projects, and grow together in our active community.'
    }
  ];
  courses = [
    { title: 'Python for Kids',      age: '10–17 yrs', sessions: '24 sessions', color: 'card-blue',   icon: '🐍' },
    { title: 'AI Tools Masterclass', age: '7–14 yrs',  sessions: '16 sessions', color: 'card-purple', icon: '🤖' },
    { title: 'Roblox Game Dev',      age: '8–16 yrs',  sessions: '20 sessions', color: 'card-green',  icon: '🎮' },
    { title: 'Scratch Coding',       age: '7–12 yrs',  sessions: '12 sessions', color: 'card-orange', icon: '🎨' }
  ];
}
