import { TestBed } from '@angular/core/testing';

import { PgnService } from './pgn-service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('PgnService', () => {
  let service: PgnService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PgnService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(PgnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
