import { Routes } from '@angular/router';

export const routes: Routes = [
     {
    path: '',
    loadComponent: () =>
     import('./features/home/home.component').then(m => m.HomeComponent)
  },
  { 
   path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/courses/courses.component').then(m => m.CoursesComponent)
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
