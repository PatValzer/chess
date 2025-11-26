import { TestBed } from '@angular/core/testing';

import { StockfishService } from './stockfish';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Stockfish', () => {
  let service: StockfishService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[StockfishService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(StockfishService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
