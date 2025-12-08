import { TestBed } from '@angular/core/testing';
import { GameManagerService } from './game-manager-service';
import { provideZonelessChangeDetection, signal, WritableSignal } from '@angular/core';
import { StockfishService } from './stockfish-service';
import { ChessboardService } from './chessboard.service';
import { OpeningService } from './opening-service';
import { PopupDialogService } from './popup-dialog-service';
import { CountdownService } from './countdown-service';
import { Square } from '../chessboard/models/Square';
import { Piece } from '../chessboard/models/Piece';
import { COLORS } from '../chessboard/COLORS';

// Mocks
class MockStockfishService {
  currentTurn = signal<COLORS>('w');
  setPosition(fen: string) { }
  go(depth: number) { }
}

class MockChessboardService {
  selectedSquare = signal<Square | null>(null);
  cells: WritableSignal<Square>[] = []; // Simplified for mock, or mock properly as 2D array if needed
  displayFenPosition(fen: string) { }
}

class MockOpeningService {
  openings = signal([]);
  currentOpening = signal(null);
}

class MockPopupDialogService {
  startDialog() { }
}

class MockCountdownService {
  activePlayer = signal<COLORS>('w');
  start() { }
  stop() { }
  reset() { }
}

describe('GameManagerService', () => {
  let service: GameManagerService;
  let stockfishService: MockStockfishService;
  let chessboardService: MockChessboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameManagerService,
        provideZonelessChangeDetection(),
        { provide: StockfishService, useClass: MockStockfishService },
        { provide: ChessboardService, useClass: MockChessboardService },
        { provide: OpeningService, useClass: MockOpeningService },
        { provide: PopupDialogService, useClass: MockPopupDialogService },
        { provide: CountdownService, useClass: MockCountdownService },
      ],
    });
    service = TestBed.inject(GameManagerService);
    stockfishService = TestBed.inject(StockfishService) as unknown as MockStockfishService;
    chessboardService = TestBed.inject(ChessboardService) as unknown as MockChessboardService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(service.currentMoveIndex()).toBe(0);
    expect(service.moves().length).toBe(0);
    expect(service.currentTurn()).toBe('w');
  });

  it('should reset the game properly', () => {
    // Modify state
    service.currentMoveIndex.set(5);
    service.moves.set([{ from: 'e2', to: 'e4' }] as any);

    // Act
    service.reset();

    // Assert
    expect(service.currentMoveIndex()).toBe(0);
    expect(service.moves().length).toBe(0);
    expect(service.chess.fen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  });

  it('should update state when a value move is made', () => {
    const previousFen = service.chess.fen();

    // Simulate a move (e2 to e4)
    service.move({ from: 'e2', to: 'e4' });

    expect(service.currentMoveIndex()).toBe(1);
    expect(service.moves().length).toBe(1);
    expect(service.chess.fen()).not.toBe(previousFen);
    expect(service.currentTurn()).toBe('b');
  });

  it('should not update state when an invalid move is made', () => {
    const previousFen = service.chess.fen();

    // Invalid move
    service.move({ from: 'e2', to: 'e5' }); // Pawn can't jump to e5 from e2

    expect(service.currentMoveIndex()).toBe(0);
    expect(service.moves().length).toBe(0);
    expect(service.chess.fen()).toBe(previousFen);
  });

  it('should handle undoMove correctly', () => {
    service.move({ from: 'e2', to: 'e4' });
    expect(service.currentMoveIndex()).toBe(1);

    service.undoMove();

    expect(service.currentMoveIndex()).toBe(0);
    expect(service.chess.history().length).toBe(0);
  });

  it('should call Stockfish on move', () => {
    spyOn(stockfishService, 'setPosition');
    spyOn(stockfishService, 'go');

    service.move({ from: 'd2', to: 'd4' });

    // Wait for effects to run? Tests with signals might need Flush or DetectChanges if component bound
    // But basic service logic might run synchronously or require manual flushing if using effects.
    // NOTE: Effects run asynchronously. In `provideZonelessChangeDetection`, they might need `TestBed.flushEffects()`.
    TestBed.flushEffects();

    expect(stockfishService.setPosition).toHaveBeenCalled();
    expect(stockfishService.go).toHaveBeenCalled();
  });

  it('should navigate history with goToMove', () => {
    // Make 2 moves
    service.move({ from: 'e2', to: 'e4' }); // Move 1
    service.move({ from: 'e7', to: 'e5' }); // Move 2
    expect(service.currentMoveIndex()).toBe(2);

    service.goToMove(0); // Go to after 1st move (index 0 in moves array) -> state index 1
    // Actually goToMove(index) goes to state after moves[index]. 
    // Implementation: for (let i = 0; i <= index; i++) ... moves()[i]
    // So goToMove(0) executes moves[0]. Resulting index is 0+1 = 1.

    expect(service.currentMoveIndex()).toBe(1);
    expect(service.chess.fen()).toContain('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR'); // After e4 only
  });

});
