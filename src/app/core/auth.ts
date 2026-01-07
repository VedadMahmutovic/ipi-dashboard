import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  theme: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly DEFAULT_THEME = 'blue';

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  loggedIn = signal<boolean>(false);
  userProfile = signal<UserProfile | null>(null);

  constructor() {
    if (!this.isBrowser) return;

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.loggedIn.set(true);
        await this.loadUserProfile(user);
      } else {
        this.loggedIn.set(false);
        this.userProfile.set(null);
        this.setTheme(this.DEFAULT_THEME);
      }
    });
  }

  async register(
    name: string,
    email: string,
    password: string,
    theme: string
  ): Promise<void> {

    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const profile: UserProfile = {
      uid: cred.user.uid,
      name,
      email,
      theme
    };

    await setDoc(doc(db, 'users', cred.user.uid), profile);
    this.userProfile.set(profile);
    this.setTheme(theme);
  }

  async login(email: string, password: string): Promise<void> {
    const cred = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    await this.loadUserProfile(cred.user);
  }

  async logout(): Promise<void> {
    await signOut(auth);
    this.userProfile.set(null);
    this.loggedIn.set(false);
    this.setTheme(this.DEFAULT_THEME);
  }

  private async loadUserProfile(user: FirebaseUser): Promise<void> {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (!snap.exists()) return;

    const profile = snap.data() as UserProfile;
    this.userProfile.set(profile);
    this.setTheme(profile.theme || this.DEFAULT_THEME);
  }

  getCurrentUser(): UserProfile | null {
    return this.userProfile();
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  setTheme(theme: string): void {
    if (!this.isBrowser) return;

    const themes = ['blue', 'spring', 'summer', 'autumn', 'winter'];

    themes.forEach(t =>
      document.body.classList.remove(`${t}-theme`)
    );

    document.body.classList.add(`${theme}-theme`);

    const user = this.userProfile();
    if (user) {
      this.userProfile.set({ ...user, theme });
    }
  }

  saveModules(userId: string, modules: string[]): void {
    localStorage.setItem(`modules_${userId}`, JSON.stringify(modules));
  }

  getModules(userId: string): string[] {
    return JSON.parse(localStorage.getItem(`modules_${userId}`) || '[]');
  }

  saveModuleOrder(userId: string, order: string[]): void {
    localStorage.setItem(`module_order_${userId}`, JSON.stringify(order));
  }

  getModuleOrder(userId: string): string[] {
    return JSON.parse(localStorage.getItem(`module_order_${userId}`) || '[]');
  }
}
