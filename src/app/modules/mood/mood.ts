import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth';
import { MoodEntry } from './mood.model';

@Component({
  selector: 'app-mood',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mood.html',
  styleUrl: './mood.scss'
})
export class MoodComponent implements OnInit {
  mood = 3;
  today = new Date().toISOString().slice(0, 10);
  userId!: string;
  history: MoodEntry[] = [];

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.userId = user.uid;
    this.history = this.load();

    const todayEntry = this.history.find(h => h.date === this.today);
    if (todayEntry) {
      this.mood = todayEntry.value;
    }
  }

  save(): void {
    const existing = this.history.find(h => h.date === this.today);

    if (existing) {
      existing.value = this.mood;
    } else {
      this.history.push({
        date: this.today,
        value: this.mood
      });
    }

    this.persist();
  }

  emoji(): string {
    return ['😢', '🙁', '😐', '🙂', '😁'][this.mood - 1];
  }

  private persist(): void {
    localStorage.setItem(
      `moods_${this.userId}`,
      JSON.stringify(this.history)
    );
  }

  private load(): MoodEntry[] {
    return JSON.parse(
      localStorage.getItem(`moods_${this.userId}`) || '[]'
    );
  }
}
