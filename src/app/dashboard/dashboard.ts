import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth';
import { DASHBOARD_MODULES } from './modules';
import { HabitComponent } from '../modules/habit/habit';
import { MoodComponent } from '../modules/mood/mood';
import { SleepComponent } from '../modules/sleep/sleep';
import { TasksComponent } from '../modules/tasks/tasks';
import { WaterComponent } from '../modules/water/water';
import { ReflectionComponent } from '../modules/reflection/reflection';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HabitComponent, MoodComponent, SleepComponent, TasksComponent, WaterComponent, ReflectionComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  user: any;
  modules = DASHBOARD_MODULES;
  activeModules: string[] = [];

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
    this.activeModules = this.auth.getModules(this.user.id);
  }

  toggle(id: string): void {
    if (this.activeModules.includes(id)) {
      this.activeModules = this.activeModules.filter(m => m !== id);
    } else {
      this.activeModules.push(id);
    }

    this.auth.saveModules(this.user.id, this.activeModules);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
