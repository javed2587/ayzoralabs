import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  menuOpen = signal(false);
  navLinks: NavLink[] = [
    {label: 'Home', path: '/'},
    {label: 'Courses', path: '/courses'},
    { label: 'About',   path: '/about'   },
    { label: 'Contact', path: '/contact' }
  ];

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
    // Close mobile menu when screen resizes to desktop
  @HostListener('window:resize', [])
  onResize(): void {
    if (window.innerWidth >= 992) {
      this.menuOpen.set(false);
    }
  }
}
