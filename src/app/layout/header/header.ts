import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {

  themeMenuOpen = false;

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleThemeMenu(event: MouseEvent): void {
    event.stopPropagation(); 
    this.themeMenuOpen = !this.themeMenuOpen;
  }

  changeTheme(theme: string): void {
    this.auth.setTheme(theme);
    this.themeMenuOpen = false;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.themeMenuOpen = false;
  }
}
