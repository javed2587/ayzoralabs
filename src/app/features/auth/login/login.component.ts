import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private router = inject(Router);

   // UI state signals
  showPassword  = signal(false);
  isLoading     = signal(false);
  errorMessage  = signal('');

   // Typed reactive form
  loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false]
  });

   // Shortcut getters — so HTML stays clean
  get email()    { return this.loginForm.get('email');    }
  get password() { return this.loginForm.get('password'); }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
   onSubmit(): void {
    // Mark all fields as touched to show validation errors
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Simulate API call — replace with real AuthService later
    setTimeout(() => {
      const { email, password } = this.loginForm.value;
      if (email === 'admin@ayzatech.com' && password === '123456') {
        this.router.navigate(['/student']);
      } else {
        this.errorMessage.set('Invalid email or password. Please try again.');
      }
      this.isLoading.set(false);
    }, 1500);
  }

}
