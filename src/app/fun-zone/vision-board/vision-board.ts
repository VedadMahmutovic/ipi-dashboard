import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface BoardItem {
  type: 'note' | 'quote' | 'image';
  className: string;
  html: string;
  left: string;
  top: string;
}

@Component({
  selector: 'app-vision-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vision-board.html',
  styleUrl: './vision-board.scss'
})
export class VisionBoardComponent implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  @ViewChild('board', { static: true })
  board!: ElementRef<HTMLDivElement>;

  private isBrowser = false;

  private colors = ['color1', 'color2', 'color3', 'color4', 'color5', 'color6'];

  private images = [
    '/assets/vision/slika1.png',
    '/assets/vision/slika2.png',
    '/assets/vision/slika3.png',
    '/assets/vision/slika4.png'
  ];



  private quotes = [
    '“Svaka dovoljno napredna tehnologija jednaka je magiji.” – Arthur C. Clarke',
    '“Tehnologija je riječ koja opisuje nešto što još ne funkcionira.” – Douglas Adams',
    '“Ne osnivate zajednice. Zajednice već postoje.” – Mark Zuckerberg'
  ];

  ngAfterViewInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser) return;

    this.loadBoard();
  }

  addNote(): void {
    const note = document.createElement('div');
    note.className = `note ${this.randomColor()}`;
    note.contentEditable = 'true';
    note.textContent = 'Napiši nešto...';
    this.randomPosition(note);
    this.makeDraggable(note);
    this.board.nativeElement.appendChild(note);
  }

  addImage(): void {
    const wrap = document.createElement('div');
    wrap.className = 'pinned-img';

    const img = document.createElement('img');
    img.src = this.randomFrom(this.images);

    wrap.appendChild(img);
    this.randomPosition(wrap);
    this.makeDraggable(wrap);
    this.board.nativeElement.appendChild(wrap);
  }

  addQuote(): void {
    const q = document.createElement('div');
    q.className = 'quote';
    q.contentEditable = 'true';
    q.textContent = this.randomFrom(this.quotes);
    this.randomPosition(q);
    this.makeDraggable(q);
    this.board.nativeElement.appendChild(q);
  }

  saveBoard(): void {
    const items: BoardItem[] = [];

    this.board.nativeElement.querySelectorAll<HTMLElement>(':scope > div').forEach(el => {
      items.push({
        type: el.classList.contains('note')
          ? 'note'
          : el.classList.contains('quote')
            ? 'quote'
            : 'image',
        className: el.className,
        html: el.innerHTML,
        left: el.style.left,
        top: el.style.top
      });
    });

    localStorage.setItem('visionBoardItems', JSON.stringify(items));
    alert('Board saved!');
  }

  clearBoard(): void {
    if (!confirm('Očistiti ploču?')) return;
    this.board.nativeElement.innerHTML = '';
    localStorage.removeItem('visionBoardItems');
  }

  private loadBoard(): void {
    const raw = localStorage.getItem('visionBoardItems');
    if (!raw) return;

    const items: BoardItem[] = JSON.parse(raw);

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = item.className;
      el.innerHTML = item.html;
      el.style.left = item.left;
      el.style.top = item.top;

      if (item.type !== 'image') {
        el.contentEditable = 'true';
      }

      this.makeDraggable(el);
      this.board.nativeElement.appendChild(el);
    });
  }

  private makeDraggable(el: HTMLElement): void {
    let offsetX = 0;
    let offsetY = 0;

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '📌';
    el.appendChild(del);

    del.addEventListener('click', e => {
      e.stopPropagation();
      el.remove();
    });

    del.addEventListener('mousedown', e => e.stopPropagation());


    el.addEventListener('mousedown', (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // ⛔ ne draguj ako klikamo delete dugme ili editujemo tekst
      if (target.classList.contains('delete-btn') || target.isContentEditable) {
        return;
      }

      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;

      const move = (ev: MouseEvent) => {
        el.style.left = ev.clientX - offsetX + 'px';
        el.style.top = ev.clientY - offsetY + 'px';
      };

      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });


  }

  private randomColor(): string {
    return this.randomFrom(this.colors);
  }

  private randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private randomPosition(el: HTMLElement): void {
    el.style.left = Math.random() * 400 + 'px';
    el.style.top = Math.random() * 250 + 'px';
  }
}
