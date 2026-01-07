import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitService } from './habit.service';
import { Habit } from './habit.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-habit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habit.html',
  styleUrl: './habit.scss'
})
export class HabitComponent implements OnInit {

  habits: Habit[] = [];
  name = '';
  color = '#4caf50';

  constructor(private habitService: HabitService) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.habits = this.habitService.getHabits();
  }

  add(): void {
    if (!this.name.trim()) return;

    this.habitService.addHabit(this.name, this.color);
    this.name = '';
    this.load();
  }

  toggle(habitId: string): void {
    this.habitService.toggleToday(habitId);
  }

  isDone(habitId: string): boolean {
    return this.habitService.isCompletedToday(habitId);
  }

  remove(habitId: string): void {
    this.habitService.deleteHabit(habitId);
    this.load();
  }

  get completedCount(): number {
    return this.habits.filter(h => this.isDone(h.id)).length;
  }

  get progressPercent(): number {
    if (!this.habits.length) return 0;
    return Math.round((this.completedCount / this.habits.length) * 100);
  }

}
