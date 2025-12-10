import { TestBed } from '@angular/core/testing';

import { ChessboardService } from './chessboard.service';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Piece } from '../chessboard/models/Piece';

describe('ChessboardService', () => {
  let service: ChessboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        ChessboardService,
        provideZonelessChangeDetection()
      ]
    });
    service = TestBed.inject(ChessboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize the board with 8 rows and 8 columns', () => {
    expect(service.cells.length).toBe(8);
    service.cells.forEach(row => {
      expect(row.length).toBe(8);
    });
  });

  it('should set white piece color correctly', () => {
    const newColor = '#123456';
    service.setPiecesColor('w', newColor);
    expect(service.whitePieceColor()).toBe(newColor);
  });

  it('should set black piece color correctly', () => {
    const newColor = '#654321';
    service.setPiecesColor('b', newColor);
    expect(service.blackPieceColor()).toBe(newColor);
  });

  it('should flip the board', () => {
    // Initial state check (assuming init is standard)
    const initialFirstRow = service.cells[0];
    const initialLastRow = service.cells[7];

    service.flipBoard();

    expect(service.cells[0]).toBe(initialLastRow);
    expect(service.cells[7]).toBe(initialFirstRow);

    // Flip back to restore for other tests if needed, though beforeEach resets service
    service.flipBoard();
  });

  it('should parse FEN and populate board correctly', () => {
    // Starting position FEN
    const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    service.displayFenPosition(startFen);

    // Check a black rook at a8 (0,0) assuming board orientation
    // Note: implementation stores rows logical 1-8? logic seems to reverse rows in init.
    // Let's check specific coordinate based on implementation details:
    // parseFEN iterates rows from input (rank 8 down to 1).
    // The service implementation of initializeChessboard reverses [1..8] to [8..1].
    // cells[0] corresponds to row 8.

    // Check cell at a8 (row 0, col 0)
    const a8 = service.cells[0][0]();
    expect(a8.coordinates.row).toBe(8);
    expect(a8.coordinates.column).toBe('a');
    expect(a8.piece()?.pieceSymbol).toBe('r');
    expect(a8.piece()?.pieceColor).toBe('b');

    // Check cell at e4 (row 4, col 4) - should be empty in start position
    const e4 = service.cells[4][4]();
    expect(e4.coordinates.row).toBe(4);
    expect(e4.coordinates.column).toBe('e');
    expect(e4.piece()).toBeNull();

    // Check cell at e1 (row 7, col 4) - white king
    const e1 = service.cells[7][4]();
    expect(e1.coordinates.row).toBe(1);
    expect(e1.coordinates.column).toBe('e');
    expect(e1.piece()?.pieceSymbol).toBe('k');
    expect(e1.piece()?.pieceColor).toBe('w');
  });

  it('should handle complex FEN with partial pieces', () => {
    // FEN with specific setup: White Rook on a1, Black King on h8
    const customFen = '7k/8/8/8/8/8/8/R7 w - - 0 1';
    service.displayFenPosition(customFen);

    // h8 (row 0, col 7)
    const h8 = service.cells[0][7]();
    expect(h8.piece()?.pieceSymbol).toBe('k');
    expect(h8.piece()?.pieceColor).toBe('b');

    // a1 (row 7, col 0)
    const a1 = service.cells[7][0]();
    expect(a1.piece()?.pieceSymbol).toBe('r');
    expect(a1.piece()?.pieceColor).toBe('w');

    // confirm middle is empty
    const d4 = service.cells[4][3]();
    expect(d4.piece()).toBeNull();
  });
});
