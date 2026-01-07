import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from '../core/auth';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss'
})
export class StatisticsComponent implements OnInit {

  userId!: string;

  avgSleep = 0;
  avgMood = 0;
  tasksDone = 0;

  sleepData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Sati sna',
      backgroundColor: 'rgba(100,120,255,0.6)'
    }]
  };

  moodData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Raspoloženje',
      borderColor: '#6a6aff',
      tension: 0.35,
      fill: false
    }]
  };

  taskData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Završeni', 'Nezavršeni'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4caf50', '#e0e0e0']
    }]
  };

  barOptions = { responsive: true };
  lineOptions = { responsive: true };
  pieOptions = { responsive: true };

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.userId = user.id;
    this.loadSleep();
    this.loadMood();
    this.loadTasks();
  }

  private loadSleep(): void {
    const data = JSON.parse(localStorage.getItem(`sleep_${this.userId}`) || '[]');

    this.sleepData.labels = data.map((d: any) => d.date);
    this.sleepData.datasets[0].data = data.map((d: any) => d.hours);

    if (data.length) {
      this.avgSleep = Math.round(
        data.reduce((a: any, b: any) => a + b.hours, 0) / data.length
      );
    }
  }

  private loadMood(): void {
    const data = JSON.parse(localStorage.getItem(`moods_${this.userId}`) || '[]');

    this.moodData.labels = data.map((d: any) => d.date);
    this.moodData.datasets[0].data = data.map((d: any) => d.value);

    if (data.length) {
      this.avgMood = Math.round(
        data.reduce((a: any, b: any) => a + b.value, 0) / data.length
      );
    }
  }

  private loadTasks(): void {
    const tasks = JSON.parse(localStorage.getItem(`tasks_${this.userId}`) || '[]');

    const done = tasks.filter((t: any) => t.done).length;
    const total = tasks.length || 1;

    this.tasksDone = Math.round((done / total) * 100);
    this.taskData.datasets[0].data = [done, total - done];
  }
}
