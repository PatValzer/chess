import { TestBed } from '@angular/core/testing';

import { CellService } from './cell.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('CellService', () => {
  let service: CellService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CellService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(CellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
