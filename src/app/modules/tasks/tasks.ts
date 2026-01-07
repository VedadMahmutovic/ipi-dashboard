import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth';
import { Task } from './task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  newTask = '';
  priority: 'low' | 'medium' | 'high' = 'medium';

  userId!: string;

  private draggedTaskId: string | null = null;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.userId = user.uid;
    this.tasks = this.load();
  }

  add(): void {
    if (!this.newTask.trim()) return;

    this.tasks.unshift({
      id: crypto.randomUUID(),
      title: this.newTask,
      done: false,
      createdAt: new Date().toISOString(),
      priority: this.priority
    });

    this.newTask = '';
    this.priority = 'medium';
    this.persist();
  }

  complete(task: Task): void {
    task.done = true;
    this.persist();
  }

  undo(task: Task): void {
    task.done = false;
    this.persist();
  }

  remove(id: string): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.persist();
  }

  onDragStart(task: Task): void {
    this.draggedTaskId = task.id;
  }

  onDrop(targetTask: Task): void {
    if (!this.draggedTaskId || this.draggedTaskId === targetTask.id) return;

    const fromIndex = this.tasks.findIndex(t => t.id === this.draggedTaskId);
    const toIndex = this.tasks.findIndex(t => t.id === targetTask.id);

    const [moved] = this.tasks.splice(fromIndex, 1);
    this.tasks.splice(toIndex, 0, moved);

    this.draggedTaskId = null;
    this.persist();
  }


  get todo(): Task[] {
    return this.tasks.filter(t => !t.done);
  }

  get done(): Task[] {
    return this.tasks.filter(t => t.done);
  }

  private persist(): void {
    localStorage.setItem(
      `tasks_${this.userId}`,
      JSON.stringify(this.tasks)
    );
  }

  private load(): Task[] {
    return JSON.parse(
      localStorage.getItem(`tasks_${this.userId}`) || '[]'
    );
  }
}
