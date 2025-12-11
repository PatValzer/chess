import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PieceImageUrlPipe } from './piece-image-url-pipe';
import { PieceService } from '../services/piece-service';

describe('PieceImageUrlPipe', () => {
  let pipe: PieceImageUrlPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        PieceImageUrlPipe, // ← provide the pipe itself
        PieceService, // ← required dependency
      ],
    });

    pipe = TestBed.inject(PieceImageUrlPipe); // ← Angular creates it in DI context
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
