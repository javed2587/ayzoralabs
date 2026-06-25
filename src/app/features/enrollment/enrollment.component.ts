import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EnrollmentService } from '../../shared/services/enrollment.service';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css'
})
export class EnrollmentComponent {

  // ── SERVICES (inject instead of constructor — modern Angular 17+ way) ──
  private enrollmentService = inject(EnrollmentService);
  private sanitizer          = inject(DomSanitizer);

  // ── SIGNALS (reactive variables — when they change, HTML auto-updates) ──

  // Stores the page heading text
  pageTitle = signal<string>('Student Enrollment');

  // Tracks whether the iframe is still loading
  // true  = show "Loading..." message
  // false = iframe is ready, hide the message
  isLoading = signal<boolean>(true);

  // ── GOOGLE FORM URL ──

  // Step 1: get the raw URL string from the service
  // Step 2: wrap it with sanitizer so Angular allows it inside [src]
  // Without sanitizer → Angular blocks the iframe with a security error
  safeFormUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    this.enrollmentService.googleFormUrl
  );

  // ── METHODS ──

  // Called by (load) event on the iframe when Google Form finishes loading
  // Sets isLoading to false → hides the "Loading..." spinner in HTML
  onFormLoaded(): void {
    this.isLoading.set(false);
  }

  // 🔄 FUTURE (when Spring Boot backend is ready):
  // You will add a submitEnrollment() method here
  // that calls this.enrollmentService.submitEnrollment(formData)
  // The service, signals, and HTML structure stay exactly the same
}