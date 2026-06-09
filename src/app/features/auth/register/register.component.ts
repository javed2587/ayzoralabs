import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Custom validator — checks both passwords match
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password        = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

   private fb     = inject(FormBuilder);
  private router = inject(Router);

  showPassword        = signal(false);
  showConfirmPassword = signal(false);
  isLoading           = signal(false);
  errorMessage        = signal('');
  currentStep         = signal(1); // 2-step form
  
roles = ['Student', 'Parent', 'Teacher'];

  registerForm = this.fb.group({
    // Step 1
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.email]],
    role:     ['Student', Validators.required],
    // Step 2
    phone:    ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
    password:        ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    terms: [false, Validators.requiredTrue]
  }, { validators: passwordMatchValidator });

  // Getters
  get fullName()        { return this.registerForm.get('fullName');        }
  get email()           { return this.registerForm.get('email');           }
  get role()            { return this.registerForm.get('role');            }
  get phone()           { return this.registerForm.get('phone');           }
  get password()        { return this.registerForm.get('password');        }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get terms()           { return this.registerForm.get('terms');           }

  togglePassword():        void { this.showPassword.update(v => !v);        }
  toggleConfirmPassword(): void { this.showConfirmPassword.update(v => !v); }

 // Step 1 validation before moving to step 2
  goToStep2(): void {
    this.fullName?.markAsTouched();
    this.email?.markAsTouched();
    this.role?.markAsTouched();
    if (this.fullName?.valid && this.email?.valid && this.role?.valid) {
      this.currentStep.set(2);
    }
  }

   goToStep1(): void { this.currentStep.set(1); }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Simulate API call — replace with real AuthService later
    setTimeout(() => {
      console.log('Register data:', this.registerForm.value);
      this.router.navigate(['/login']);
      this.isLoading.set(false);
    }, 1500);
  }
}
