import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../core/pdf.service';
import { FormsModule } from '@angular/forms';

interface Task {
  id: string;
  text: string;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kanban.html',
  styleUrl: './kanban.scss'
})
export class KanbanComponent {

  @ViewChild('kanbanContent') kanbanContent!: ElementRef<HTMLElement>;

  showAddModal = false;
  newTaskText = '';

  todo: Task[] = [];
  progress: Task[] = [];
  done: Task[] = [];

  private draggedTask?: Task;
  private draggedFrom?: 'todo' | 'progress' | 'done';

  constructor(private pdf: PdfService) { }

  openAdd(): void {
    this.newTaskText = '';
    this.showAddModal = true;
  }

  addTask(): void {
    if (!this.newTaskText.trim()) return;

    this.todo.push({
      id: crypto.randomUUID(),
      text: this.newTaskText.trim()
    });

    this.showAddModal = false;
  }

  cancelAdd(): void {
    this.showAddModal = false;
  }

  clearBoard(): void {
    this.todo = [];
    this.progress = [];
    this.done = [];
  }

  startDrag(task: Task, from: 'todo' | 'progress' | 'done'): void {
    this.draggedTask = task;
    this.draggedFrom = from;
  }

  drop(to: 'todo' | 'progress' | 'done'): void {
    if (!this.draggedTask || !this.draggedFrom) return;

    this[this.draggedFrom] =
      this[this.draggedFrom].filter(t => t.id !== this.draggedTask!.id);

    this[to].push(this.draggedTask);

    this.draggedTask = undefined;
    this.draggedFrom = undefined;
  }

  downloadPdf(): void {
    this.pdf.download(this.kanbanContent.nativeElement, 'kanban-board.pdf');
  }
}
