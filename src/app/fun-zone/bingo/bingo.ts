import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../core/pdf.service';

@Component({
  selector: 'app-bingo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bingo.html',
  styleUrl: './bingo.scss'
})
export class BingoComponent {

  @ViewChild('bingoContent', { static: false })
  content!: ElementRef<HTMLElement>;

  constructor(private pdf: PdfService) { }

  downloadPdf(): void {
    this.pdf.download(this.content.nativeElement, 'bingo.pdf');
  }
}
