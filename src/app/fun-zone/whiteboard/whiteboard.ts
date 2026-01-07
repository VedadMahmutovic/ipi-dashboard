import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-whiteboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './whiteboard.html',
  styleUrl: './whiteboard.scss'
})
export class WhiteboardComponent implements AfterViewInit {

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  color = '#000000';
  brushSize = 3;
  drawing = false;
  isErasing = false;

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.ctx.lineCap = 'round';
  }

  // ======= EVENTS =======

  startDraw(e: MouseEvent | TouchEvent) {
    this.drawing = true;
    this.draw(e);
  }

  endDraw() {
    this.drawing = false;
    this.ctx.beginPath();
  }

  draw(e: MouseEvent | TouchEvent) {
    if (!this.drawing) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    this.ctx.strokeStyle = this.isErasing ? '#ffffff' : this.color;
    this.ctx.lineWidth = this.brushSize;

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  toggleEraser() {
    this.isErasing = !this.isErasing;
  }

  clear() {
    this.ctx.clearRect(
      0,
      0,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height
    );
  }

  save() {
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.click();
  }
}
