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

  it('should update white cell color', () => {
    const newColor = '#123456';
    service.setChessboardCellsColor('w', newColor);
    expect(service.whiteCellColor()).toBe(newColor);
  });

  it('should update black cell color', () => {
    const newColor = '#654321';
    service.setChessboardCellsColor('b', newColor);
    expect(service.blackCellColor()).toBe(newColor);
  });
});
