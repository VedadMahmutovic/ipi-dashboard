import { Injectable } from '@angular/core';
import { Habit, HabitLog } from './habit.model';
import { AuthService } from '../../core/auth';

@Injectable({ providedIn: 'root' })
export class HabitService {

  constructor(private auth: AuthService) { }

  private get userId(): string {
    return this.auth.getCurrentUser()?.id ?? '';
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private habitsKey() {
    return `habits_${this.userId}`;
  }

  private logsKey() {
    return `habit_logs_${this.userId}`;
  }

  getHabits(): Habit[] {
    return JSON.parse(localStorage.getItem(this.habitsKey()) || '[]');
  }

  addHabit(name: string, color: string): void {
    const habits = this.getHabits();

    habits.push({
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem(this.habitsKey(), JSON.stringify(habits));
  }

  deleteHabit(id: string): void {
    const habits = this.getHabits().filter(h => h.id !== id);
    localStorage.setItem(this.habitsKey(), JSON.stringify(habits));

    const logs = this.getLogs().filter(l => l.habitId !== id);
    localStorage.setItem(this.logsKey(), JSON.stringify(logs));
  }

  getLogs(): HabitLog[] {
    return JSON.parse(localStorage.getItem(this.logsKey()) || '[]');
  }

  isCompletedToday(habitId: string): boolean {
    return this.getLogs().some(
      l => l.habitId === habitId && l.date === this.today() && l.completed
    );
  }

  toggleToday(habitId: string): void {
    const logs = this.getLogs();
    const today = this.today();

    const log = logs.find(l => l.habitId === habitId && l.date === today);

    if (log) {
      log.completed = !log.completed;
    } else {
      logs.push({ habitId, date: today, completed: true });
    }

    localStorage.setItem(this.logsKey(), JSON.stringify(logs));
  }
}
