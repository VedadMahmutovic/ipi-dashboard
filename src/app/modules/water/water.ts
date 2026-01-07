import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth';
import { WaterEntry } from './water.model';

@Component({
  selector: 'app-water',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './water.html',
  styleUrl: './water.scss'
})
export class WaterComponent implements OnInit {

  today = this.formatDate(new Date());
  glasses = 0;
  goal = 8;
  max = 12;
  glassSize = 250; 
  recommended = 2000; 


  userId!: string;
  history: WaterEntry[] = [];

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.userId = user.uid;
    this.history = this.load();

    const todayEntry = this.history.find(e => e.date === this.today);
    if (todayEntry) {
      this.glasses = todayEntry.glasses;
    }
  }

  add(): void {
    if (this.glasses >= this.max) return;
    this.glasses++;
    this.save();
  }

  remove(): void {
    if (this.glasses <= 0) return;
    this.glasses--;
    this.save();
  }

  get progress(): number {
    return Math.min((this.glasses / this.goal) * 100, 100);
  }

  formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private save(): void {
    const existing = this.history.find(e => e.date === this.today);

    if (existing) {
      existing.glasses = this.glasses;
    } else {
      this.history.push({
        date: this.today,
        glasses: this.glasses
      });
    }

    localStorage.setItem(
      `water_${this.userId}`,
      JSON.stringify(this.history)
    );
  }

  private load(): WaterEntry[] {
    return JSON.parse(
      localStorage.getItem(`water_${this.userId}`) || '[]'
    );
  }

  get totalMl(): number {
    return this.glasses * this.glassSize;
  }

  get totalLiters(): string {
    return (this.totalMl / 1000).toFixed(1);
  }

}
