import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth';
import { SleepEntry } from './sleep.model';

@Component({
  selector: 'app-sleep',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sleep.html',
  styleUrl: './sleep.scss'
})
export class SleepComponent implements OnInit {

  today = this.formatDate(new Date());
  hours = 7;

  userId!: string;
  history: SleepEntry[] = [];

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.userId = user.id;
    this.history = this.load();

    const todayEntry = this.history.find(e => e.date === this.today);
    if (todayEntry) {
      this.hours = todayEntry.hours;
    }
  }

  save(): void {
    const existing = this.history.find(e => e.date === this.today);

    if (existing) {
      existing.hours = this.hours;
    } else {
      this.history.push({
        date: this.today,
        hours: this.hours
      });
    }

    this.persist();
  }


  get progress(): number {
    return Math.min((this.hours / 8) * 100, 100);
  }

  get status(): 'low' | 'optimal' | 'high' {
    if (this.hours < 6) return 'low';
    if (this.hours <= 9) return 'optimal';
    return 'high';
  }

  get statusText(): string {
    if (this.hours < 6) return '⚠ Premalo sna';
    if (this.hours <= 7) return '😐 Može bolje';
    if (this.hours <= 9) return '😊 Optimalan san';
    return '⚠ Previše sna';
  }

  get progressColor(): string {
    if (this.hours < 6) return '#e74c3c';     
    if (this.hours <= 9) return '#2ecc71';   
    return '#f1c40f';                          
  }


  formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private persist(): void {
    localStorage.setItem(
      `sleep_${this.userId}`,
      JSON.stringify(this.history)
    );
  }

  private load(): SleepEntry[] {
    return JSON.parse(
      localStorage.getItem(`sleep_${this.userId}`) || '[]'
    );
  }
}
