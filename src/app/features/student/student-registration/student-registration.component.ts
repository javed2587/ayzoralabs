import { Component, signal, inject, computed } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseOption } from '../../../shared/models/course-option';

// ── Custom Validator — age must be between 7 and 17 ──────────────────────────
function ageRangeValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const today    = new Date();
  const birthDate = new Date(control.value);
  const age      = today.getFullYear() - birthDate.getFullYear();

  if (age < 7 || age > 17) {
    return { ageRange: true };
  }
  return null;
}

// ── Custom Validator — Pakistan phone number ──────────────────────────────────
function pakistanPhoneValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const phoneRegex = /^(03)[0-9]{9}$/;
  return phoneRegex.test(control.value) ? null : { invalidPhone: true };
}

type StepType = 1 | 2 | 3;

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector:    'app-student-registration',
  standalone:  true,
  imports:     [ReactiveFormsModule, RouterLink],
  templateUrl: './student-registration.component.html',
  styleUrl:    './student-registration.component.css'
})
export class StudentRegistrationComponent {

  private fb     = inject(FormBuilder);
  private router = inject(Router);

  // ── UI State ────────────────────────────────────────────────────────────────
  currentStep     = signal<StepType>(1);
  isLoading       = signal<boolean>(false);
  submitSuccess   = signal<boolean>(false);
  photoPreview    = signal<string | null>(null);
  selectedCourse  = signal<CourseOption | null>(null);

  // ── Available Courses ───────────────────────────────────────────────────────
  courses: CourseOption[] = [
    { id: 1, title: 'Python for Kids',      icon: '🐍', duration: '3 months', price: 4500 },
    { id: 2, title: 'AI Tools Masterclass', icon: '🤖', duration: '2 months', price: 3500 },
    { id: 3, title: 'Roblox Game Dev',      icon: '🎮', duration: '2.5 months', price: 5000 },
    { id: 4, title: 'Scratch Coding',       icon: '🎨', duration: '1.5 months', price: 2500 },
    { id: 5, title: 'Web Design',           icon: '🌐', duration: '2 months', price: 4000 },
    { id: 6, title: 'Unity Game Dev',       icon: '🕹️', duration: '4 months', price: 7000 },
  ];

  // ── Gender options ──────────────────────────────────────────────────────────
  genders = ['Male', 'Female', 'Prefer not to say'];

  // ── The main form ───────────────────────────────────────────────────────────
  // All 3 steps live in ONE FormGroup — same pattern as Register page
  registrationForm = this.fb.group({

    // Step 1 — Student Info
    fullName:    ['', [Validators.required, Validators.minLength(3)]],
    dateOfBirth: ['', [Validators.required, ageRangeValidator]],
    gender:      ['', Validators.required],
    email:       ['', [Validators.required, Validators.email]],
    phone:       ['', [Validators.required, pakistanPhoneValidator]],

    // Step 2 — Parent & Address Info
    parentName:  ['', [Validators.required, Validators.minLength(3)]],
    parentPhone: ['', [Validators.required, pakistanPhoneValidator]],
    parentEmail: ['', [Validators.required, Validators.email]],
    city:        ['', Validators.required],
    address:     ['', [Validators.required, Validators.minLength(10)]],

    // Step 3 — Course Selection
    courseId:    ['', Validators.required],
    experience:  ['beginner'],
    goals:       ['', [Validators.required, Validators.minLength(20)]],
    terms:       [false, Validators.requiredTrue]
  });

  // ── Getters — keeps HTML clean ──────────────────────────────────────────────
  get fullName()    { return this.registrationForm.get('fullName');    }
  get dateOfBirth() { return this.registrationForm.get('dateOfBirth'); }
  get gender()      { return this.registrationForm.get('gender');      }
  get email()       { return this.registrationForm.get('email');       }
  get phone()       { return this.registrationForm.get('phone');       }
  get parentName()  { return this.registrationForm.get('parentName');  }
  get parentPhone() { return this.registrationForm.get('parentPhone'); }
  get parentEmail() { return this.registrationForm.get('parentEmail'); }
  get city()        { return this.registrationForm.get('city');        }
  get address()     { return this.registrationForm.get('address');     }
  get courseId()    { return this.registrationForm.get('courseId');    }
  get goals()       { return this.registrationForm.get('goals');       }
  get terms()       { return this.registrationForm.get('terms');       }

  // ── Step progress percentage ────────────────────────────────────────────────
  progressPercent = computed<number>(() => {
    const map: Record<StepType, number> = { 1: 33, 2: 66, 3: 100 };
    return map[this.currentStep()];
  });

  // ── Step 1 fields validation check ─────────────────────────────────────────
  isStep1Valid(): boolean {
    return !!(
      this.fullName?.valid &&
      this.dateOfBirth?.valid &&
      this.gender?.valid &&
      this.email?.valid &&
      this.phone?.valid
    );
  }

  // ── Step 2 fields validation check ─────────────────────────────────────────
  isStep2Valid(): boolean {
    return !!(
      this.parentName?.valid &&
      this.parentPhone?.valid &&
      this.parentEmail?.valid &&
      this.city?.valid &&
      this.address?.valid
    );
  }

  // ── Navigate steps ──────────────────────────────────────────────────────────
  goToStep(step: StepType): void {
    this.currentStep.set(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextStep(): void {
    if (this.currentStep() === 1) {
      // Mark step 1 fields touched to show errors
      ['fullName','dateOfBirth','gender','email','phone']
        .forEach(f => this.registrationForm.get(f)?.markAsTouched());

      if (this.isStep1Valid()) this.goToStep(2);
    } else if (this.currentStep() === 2) {
      // Mark step 2 fields touched
      ['parentName','parentPhone','parentEmail','city','address']
        .forEach(f => this.registrationForm.get(f)?.markAsTouched());

      if (this.isStep2Valid()) this.goToStep(3);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.goToStep((this.currentStep() - 1) as StepType);
    }
  }

  // ── Course selection ────────────────────────────────────────────────────────
  selectCourse(course: CourseOption): void {
    this.courseId?.setValue(String(course.id));
    this.courseId?.markAsTouched();
    this.selectedCourse.set(course);
  }

  // ── Photo upload ────────────────────────────────────────────────────────────
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];

    if (!file) return;

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG or WebP image.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2MB.');
      return;
    }

    // Read file and show preview using FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      this.photoPreview.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.photoPreview.set(null);
  }

  // ── Final submit ────────────────────────────────────────────────────────────
  onSubmit(): void {
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.invalid) return;

    this.isLoading.set(true);

    // Simulate API call — replace with real HTTP call after backend
    setTimeout(() => {
      console.log('Registration data:', this.registrationForm.value);
      this.isLoading.set(false);
      this.submitSuccess.set(true);
    }, 2000);
  }

  goToDashboard(): void {
    this.router.navigate(['/student']);
  }

  formatPrice(price: number): string {
    return `Rs. ${price.toLocaleString()}/month`;
  }
  // Add this method to your component class
isCourseSelected(courseId: number): boolean {
  return this.courseId?.value === String(courseId);
}
}