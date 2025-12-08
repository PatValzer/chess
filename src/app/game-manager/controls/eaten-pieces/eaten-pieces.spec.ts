import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EatenPiecesComponent } from './eaten-pieces';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GameManagerService } from '../../../services/game-manager-service';
import { CellService } from '../../../services/cell.service';
import { PopupDialogService } from '../../../services/popup-dialog-service';

class MockGameManagerService {
  chess = {
    history: () => []
  };
  currentMoveIndex = signal(0);
}

class MockCellService {
  whiteCellColor = signal('white');
  blackCellColor = signal('black');
  setChessboardCellsColor() { }
}

class MockPopupDialogService {
  startDialog() { }
}

describe('EatenPieces', () => {
  let component: EatenPiecesComponent;
  let fixture: ComponentFixture<EatenPiecesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EatenPiecesComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection(),
        { provide: GameManagerService, useClass: MockGameManagerService },
        { provide: CellService, useClass: MockCellService },
        { provide: PopupDialogService, useClass: MockPopupDialogService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EatenPiecesComponent);
    fixture.componentRef.setInput('color', 'w');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
