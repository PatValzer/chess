import { TestBed } from '@angular/core/testing';

import { ChessboardService } from './chessboard.service';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Chessboard', () => {
  let service: ChessboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        ChessboardService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(ChessboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
