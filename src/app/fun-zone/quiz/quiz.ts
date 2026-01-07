import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../core/pdf.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss'
})
export class QuizComponent {

  @ViewChild('quizContent') quizContent!: ElementRef<HTMLElement>;

  score: number | null = null;
  submitted = false;

  results: Record<string, 'correct' | 'wrong' | null> = {};

  answers = {
    q1: 0,
    q2: [0, 1, 2],
    q3: 1,
    q4: [0, 1, 3],
    q5: 1,
    q6: 1,
    q7: [0, 1, 3],
    q8: 0,
    q9: [0, 1, 2],
    q10: 0
  };

  constructor(private pdf: PdfService) { }

  check(): void {
    let score = 0;
    this.results = {};
    this.submitted = true;

    Object.keys(this.answers).forEach(q => {
      const inputs = Array.from(
        document.querySelectorAll<HTMLInputElement>(`input[name="${q}"]`)
      );

      const correct = this.answers[q as keyof typeof this.answers];
      let isCorrect = false;

      if (Array.isArray(correct)) {
        const checked = inputs
          .map((i, idx) => i.checked ? idx : -1)
          .filter(i => i !== -1);

        isCorrect = JSON.stringify(checked) === JSON.stringify(correct);
      } else {
        isCorrect = inputs[correct]?.checked === true;
      }

      this.results[q] = isCorrect ? 'correct' : 'wrong';
      if (isCorrect) score++;
    });

    this.score = score;
  }

  downloadPdf(): void {
    this.pdf.download(this.quizContent.nativeElement, 'kviz.pdf');
  }
}
