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
  path: 'courses/:id',
  loadComponent: () =>
    import('./features/courses/course-details/course-details.component')
      .then(m => m.CourseDetailComponent)
},
  {
    path: 'student',
    loadComponent: () =>
      import('./features/student/student-dashboard/student-dashboard.component')
    .then(m => m.StudentDashboardComponent)
  },
  {
    path: 'student/register',
    loadComponent: () => 
      import('./features/student/student-registration/student-registration.component')
    .then(m => m.StudentRegistrationComponent)
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin/admin.component').then(m => m.AdminComponent)
  },
  {
  path: 'enrollment',
  loadComponent: () =>
    import('./features/enrollment/enrollment.component')
      .then(m => m.EnrollmentComponent)
},
  {
    path: '**',
    redirectTo: ''   // redirect unknown URLs to home
  }

];
