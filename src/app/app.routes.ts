import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.components';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
     {
    path: '',
    loadComponent: () =>
     import('./features/home/home.components').then(m => m.HomeComponent)
  },
  { 
   path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/courses/course-list/course-list').then(m => m.CourseList)
  },
  {
    path: 'student',
    loadComponent: () =>
      import('./features/student/student-dashboard/student-dashboard').then(m => m.StudentDashboard)
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin/admin').then(m => m.Admin)
  },
  {
    path: '**',
    redirectTo: ''   // redirect unknown URLs to home
  }

];
