import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth';
import { ReflectionEntry } from './reflection.model';

@Component({
  selector: 'app-reflection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reflection.html',
  styleUrl: './reflection.scss'
})
export class ReflectionComponent implements OnInit {

  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();

  selectedDate!: string;
  text = '';
  color = '#2e7d32';
  saved = false;
  showCalendar = false;

  userId!: string;
  entries: ReflectionEntry[] = [];

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.userId = user.uid;
    this.entries = this.load();

    this.selectDate(this.formatDate(this.today));
  }

  get daysInMonth(): Date[] {
    const days: Date[] = [];
    const date = new Date(this.currentYear, this.currentMonth, 1);

    while (date.getMonth() === this.currentMonth) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  }

  selectDate(date: string): void {
    this.selectedDate = date;
    const entry = this.entries.find(e => e.date === date);
    this.text = entry ? entry.text : '';
    this.color = entry ? entry.color : '#2e7d32';
  }

  hasEntry(date: string): ReflectionEntry | undefined {
    return this.entries.find(e => e.date === date);
  }

  save(): void {
    if (!this.text.trim()) return;

    const existing = this.entries.find(e => e.date === this.selectedDate);

    if (existing) {
      existing.text = this.text;
      existing.color = this.color;
    } else {
      this.entries.push({
        date: this.selectedDate,
        text: this.text,
        color: this.color
      });
    }

    this.persist();

    this.saved = true;
    setTimeout(() => this.saved = false, 2000);
  }


  formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  private persist(): void {
    localStorage.setItem(
      `reflection_${this.userId}`,
      JSON.stringify(this.entries)
    );
  }

  private load(): ReflectionEntry[] {
    return JSON.parse(
      localStorage.getItem(`reflection_${this.userId}`) || '[]'
    );
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }
  get calendarDays(): (Date | null)[] {
    const days: (Date | null)[] = [];

    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; 

    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    const date = new Date(this.currentYear, this.currentMonth, 1);
    while (date.getMonth() === this.currentMonth) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  }

}
