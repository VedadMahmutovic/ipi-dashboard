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

import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    HabitComponent,
    MoodComponent,
    SleepComponent,
    TasksComponent,
    WaterComponent,
    ReflectionComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  user: any;
  modules = [...DASHBOARD_MODULES];
  activeModules: string[] = [];

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
    if (!this.user) return;

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

  dropWindow(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.activeModules,
      event.previousIndex,
      event.currentIndex
    );

    this.auth.saveModules(this.user.id, this.activeModules);
  }

  getTitle(id: string): string {
    return this.modules.find(m => m.id === id)?.title ?? '';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
