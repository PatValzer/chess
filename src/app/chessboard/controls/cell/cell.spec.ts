import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CellComponent } from './cell';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ChessboardService } from '../../../services/chessboard.service';
import { GameManagerService } from '../../../services/game-manager-service';
import { Square } from '../../models/Square';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';

class MockChessboardService {
  selectedSquare = signal<Square | null>(null);
  cells = [[signal(new Square('a', 1))]]; // 2D array of signals
}

class MockGameManagerService {
  currentMoveIndex = signal(0);
  moves = signal([]);
  allowedDestinationCellsForSelectedPiece = signal<Square[]>([]);
  movePiece = jasmine.createSpy('movePiece');
}

describe('CellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;
  let chessboardService: MockChessboardService;
  let gameManagerService: MockGameManagerService;
  let testSquare: Square;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        { provide: ChessboardService, useClass: MockChessboardService },
        { provide: GameManagerService, useClass: MockGameManagerService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CellComponent);
    component = fixture.componentInstance;
    chessboardService = TestBed.inject(ChessboardService) as unknown as MockChessboardService;
    gameManagerService = TestBed.inject(GameManagerService) as unknown as MockGameManagerService;

    testSquare = new Square('e', 4); // White square
    fixture.componentRef.setInput('cell', testSquare);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select square on click if has piece', () => {
    // Setup piece on square
    testSquare.piece.set({ pieceSymbol: 'p', pieceColor: 'w' } as any);

    // Simulate click
    // Note: cellClick event binding in template: (click)="cellClick($event)"
    const el = fixture.debugElement.query(By.css('.cell-content'));
    // .cell-content is likely inside cell.html. I need to check template or just trigger on host if listener is there.
    // cell.ts has `cellClick($event)`.
    // Let's call method directly to test logic regardless of template binding specifics first?
    // Or try clicking root.

    component.cellClick({} as PointerEvent);
    expect(chessboardService.selectedSquare()).toBe(testSquare);
  });

  it('should move piece if valid destination', () => {
    // Select another square first
    const fromSquare = new Square('e', 2);
    fromSquare.piece.set({ pieceSymbol: 'p', pieceColor: 'w' } as any);
    chessboardService.selectedSquare.set(fromSquare);

    // Make this cell a valid destination
    gameManagerService.allowedDestinationCellsForSelectedPiece.set([testSquare]);

    component.cellClick({} as PointerEvent);

    expect(gameManagerService.movePiece).toHaveBeenCalledWith(fromSquare, testSquare);
  });

  it('should calculate opacity based on state', () => {
    // Default opacity for white cell
    expect(component.opacity()).toBe(1); // 'w' cell

    // Make it a valid destination
    gameManagerService.allowedDestinationCellsForSelectedPiece.set([testSquare]);
    expect(component.opacity()).toBe(0.7); // Highlighted destination
  });
});
