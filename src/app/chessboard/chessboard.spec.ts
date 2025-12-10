import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chessboard } from './chessboard';
import { provideZonelessChangeDetection, signal, WritableSignal } from '@angular/core';
import { ChessboardService, ColumnLetter } from '../services/chessboard.service';
import { GameManagerService } from '../services/game-manager-service';
import { Square } from '../chessboard/models/Square';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { CellComponent } from './controls/cell/cell';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cell',
  template: '',
  standalone: true
})
class MockCellComponent {
  @Input() cell: any;
}

class MockChessboardService {
  cells: WritableSignal<Square>[][] = [];
  columns: ColumnLetter[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  constructor() {
    // initialize 8x8 grid of signals
    for (let i = 0; i < 8; i++) {
      const row: WritableSignal<Square>[] = [];
      for (let j = 0; j < 8; j++) {
        row.push(signal(new Square(this.columns[j], (8 - i) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8)));
      }
      this.cells.push(row);
    }
  }
}

class MockGameManagerService {
}

describe('Chessboard', () => {
  let component: Chessboard;
  let fixture: ComponentFixture<Chessboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chessboard],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        { provide: ChessboardService, useClass: MockChessboardService },
        { provide: GameManagerService, useClass: MockGameManagerService }
      ]
    })
      .overrideComponent(Chessboard, {
        remove: { imports: [CellComponent] },
        add: { imports: [MockCellComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(Chessboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 8x8 grid of cells', () => {
    const cells = fixture.debugElement.queryAll(By.css('app-cell'));
    expect(cells.length).toBe(64);
  });

  it('should render row labels', () => {
    const rowLabels = fixture.debugElement.queryAll(By.css('.flex.items-center'));
    expect(rowLabels.length).toBe(8);
  });
});
