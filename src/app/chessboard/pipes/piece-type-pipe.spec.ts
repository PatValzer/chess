import { TestBed } from '@angular/core/testing';
import { PieceTypePipe } from './piece-type-pipe';
import { provideZonelessChangeDetection } from '@angular/core';



describe('PieceTypePipe', () => {
  let pipe: PieceTypePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        PieceTypePipe,       // ← provide the pipe itself
      ]
    });

    pipe = TestBed.inject(PieceTypePipe);  // ← Angular creates it in DI context
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
