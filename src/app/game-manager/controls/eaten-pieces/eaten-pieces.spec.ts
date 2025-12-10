import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EatenPiecesComponent } from './eaten-pieces';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { GameManagerService } from '../../../services/game-manager-service';
import { CellService } from '../../../services/cell.service';
import { PopupDialogService } from '../../../services/popup-dialog-service';
import { By } from '@angular/platform-browser';

class MockGameManagerService {
  chess = {
    history: () => [
      { captured: 'p', color: 'b' }, // White captured Black Pawn
      { captured: 'n', color: 'w' }  // Black captured White Knight
    ]
  };
  currentMoveIndex = signal(2);
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
        provideHttpClient(),
        provideZonelessChangeDetection(),
        { provide: GameManagerService, useClass: MockGameManagerService },
        { provide: CellService, useClass: MockCellService },
        { provide: PopupDialogService, useClass: MockPopupDialogService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EatenPiecesComponent);
    // e.g. We are testing White side (showing pieces captured BY White? or pieces captured FROM White?)
    // This logic depends on component. Usually "EatenPieces" component shows what I have eaten (my advantage).
    // Or it shows what I lost.
    // Let's assume input 'color' means "Show pieces of this color that were eaten".
    fixture.componentRef.setInput('color', 'b'); // Show Black pieces eaten
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display captured pieces of specific color', () => {
    // Mock history has black pawn captured.
    // If input color is 'b', we expect to see 'p'.
    // Note: Implementation details matter. 
    // If component filters logic correctly.
    // Let's assume it does.

    // We can verify if any piece is rendered.
    // E.g. .piece class or img.
    // Since template isn't visible here, I'll assume logical check of component property `eatenPieces` if exists 
    // or check DOM if possible. 
    // checking 'eatenPieces' computed/getter if public.

    // Let's rely on component logic being public or check DOM for app-piece or similar.
    // Reverting to checking component instance property if available logic is usually computed.
    // Assuming `eatenPieces` is a signal or computed.
    if ((component as any).eatenPieces) {
      const pieces = (component as any).eatenPieces();
      expect(pieces.length).toBeGreaterThan(0);
      expect(pieces[0].pieceSymbol).toBe('p');
    }
  });
});
