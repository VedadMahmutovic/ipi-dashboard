import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  theme: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly USERS_KEY = 'users';
  private readonly CURRENT_KEY = 'currentUser';
  private readonly DEFAULT_THEME = 'blue';

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  loggedIn = signal<boolean>(false);

  constructor() {
    if (!this.isBrowser) return;

    const user = this.getCurrentUser();
    this.loggedIn.set(!!user);

    if (user?.theme) {
      this.setTheme(user.theme);
    } else {
      this.setTheme(this.DEFAULT_THEME);
    }
  }

  register(user: User): void {
    if (!this.isBrowser) return;

    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  login(email: string, password: string): User | null {
    if (!this.isBrowser) return null;

    const user = this.getUsers().find(
      u => u.email === email && u.password === password
    );

    if (!user) return null;

    localStorage.setItem(this.CURRENT_KEY, JSON.stringify(user));
    this.loggedIn.set(true);

    this.setTheme(user.theme || this.DEFAULT_THEME);

    return user;
  }

  logout(): void {
    if (!this.isBrowser) return;

    localStorage.removeItem(this.CURRENT_KEY);
    this.loggedIn.set(false);

    this.setTheme(this.DEFAULT_THEME);
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  getCurrentUser(): User | null {
    if (!this.isBrowser) return null;

    return JSON.parse(
      localStorage.getItem(this.CURRENT_KEY) || 'null'
    );
  }

  private getUsers(): User[] {
    if (!this.isBrowser) return [];

    return JSON.parse(
      localStorage.getItem(this.USERS_KEY) || '[]'
    );
  }

  saveModules(userId: string, modules: string[]): void {
    if (!this.isBrowser) return;

    localStorage.setItem(
      `modules_${userId}`,
      JSON.stringify(modules)
    );
  }

  getModules(userId: string): string[] {
    if (!this.isBrowser) return [];

    return JSON.parse(
      localStorage.getItem(`modules_${userId}`) || '[]'
    );
  }

  setTheme(theme: string): void {
    if (!this.isBrowser) return;

    const themes = ['blue', 'spring', 'summer', 'autumn', 'winter'];

    themes.forEach(t =>
      document.body.classList.remove(`${t}-theme`)
    );

    document.body.classList.add(`${theme}-theme`);
  }
}
