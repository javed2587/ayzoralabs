import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
     <div class="container mt-5 text-center">
      <h1>Welcome to Ayzatech</h1>
      <p class="text-muted">Your online learning platform is being built!</p>
    </div>
  `
})
export class HomeComponent {}