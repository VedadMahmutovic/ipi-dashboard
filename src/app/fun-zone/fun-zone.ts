import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BingoComponent } from './bingo/bingo';
import { KanbanComponent } from './kanban/kanban';
import { QuizComponent } from './quiz/quiz';
import { VisionBoardComponent } from './vision-board/vision-board';
import { WhiteboardComponent } from './whiteboard/whiteboard';

type FunModule = 'bingo' | 'kanban' | 'quiz' | 'vision' | 'whiteboard';

@Component({
  selector: 'app-fun-zone',
  standalone: true,
  imports: [CommonModule, BingoComponent, KanbanComponent, QuizComponent, VisionBoardComponent, WhiteboardComponent],
  templateUrl: './fun-zone.html',
  styleUrl: './fun-zone.scss'
})
export class FunZoneComponent {
active: FunModule | null = null;
}
