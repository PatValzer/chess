import { TestBed } from '@angular/core/testing';
import { PieceColorPipe } from './piece-color-pipe';
import { ChessboardService } from '../services/chessboard.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('PieceColorPipe', () => {
  let pipe: PieceColorPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        PieceColorPipe,       // ← provide the pipe itself
        ChessboardService    // ← required dependency
      ]
    });

    pipe = TestBed.inject(PieceColorPipe);  // ← Angular creates it in DI context
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});