import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChessToolbar } from './chess-toolbar';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { of } from 'rxjs';
import { ChessboardService } from '../services/chessboard.service';
import { GameManagerService } from '../services/game-manager-service';
import { OpeningService } from '../services/opening-service';
import { PopupDialogService } from '../services/popup-dialog-service';
import { OpenAIService } from '../services/openai.service';
import { BreakpointService } from '../services/breakpoint-service';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Mocks
class MockChessboardService {
  flipBoard = jasmine.createSpy('flipBoard');
  setPiecesColor = jasmine.createSpy('setPiecesColor');
  whitePieceColor = signal('white');
  blackPieceColor = signal('black');
}

class MockGameManagerService {
  chess = {
    fen: () => 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  };
  whitePcPlayerEnabled = signal(false);
  blackPcPlayerEnabled = signal(false);
  reset = jasmine.createSpy('reset');
  move = jasmine.createSpy('move');
  currentMoveIndex = signal(0);
  moves = signal([]);
  currentTurn = signal('w');
}

class MockOpeningService {
  currentOpening = signal({ name: 'Test Opening', moves: [] });
}

class MockPopupDialogService {
  startDialog = jasmine.createSpy('startDialog');
}

class MockOpenAIService {
  apiKey = signal('');
}

class MockBreakpointService {
  isMobile = () => false;
  isTablet = () => false;
}

describe('ChessToolbar', () => {
  let component: ChessToolbar;
  let fixture: ComponentFixture<ChessToolbar>;
  let chessboardService: MockChessboardService;
  let popupDialogService: MockPopupDialogService;
  let gameManagerService: MockGameManagerService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of(undefined));

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(mockDialogRef);

    await TestBed.configureTestingModule({
      imports: [ChessToolbar, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ChessboardService, useClass: MockChessboardService },
        { provide: GameManagerService, useClass: MockGameManagerService },
        { provide: OpeningService, useClass: MockOpeningService },
        { provide: PopupDialogService, useClass: MockPopupDialogService },
        { provide: OpenAIService, useClass: MockOpenAIService },
        { provide: BreakpointService, useClass: MockBreakpointService },
      ],
    })
      .overrideProvider(MatDialog, { useValue: dialogSpy })
      .compileComponents();

    fixture = TestBed.createComponent(ChessToolbar);
    component = fixture.componentInstance;
    chessboardService = TestBed.inject(ChessboardService) as unknown as MockChessboardService;
    popupDialogService = TestBed.inject(PopupDialogService) as unknown as MockPopupDialogService;
    gameManagerService = TestBed.inject(GameManagerService) as unknown as MockGameManagerService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call flipBoard on service when flipBoard is called', () => {
    component.flipBoard();
    expect(chessboardService.flipBoard).toHaveBeenCalled();
  });

  it('should open options dialog', () => {
    component.openOptions();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should emit importFen event', () => {
    spyOn(component.importFen, 'emit');
    component.emitImportFen('fen-string');
    expect(component.importFen.emit).toHaveBeenCalledWith('fen-string');
  });

  it('should toggle white PC player enabled', () => {
    component.toggleEnablePcPlayer('w');
    // Expect signal to be toggled
    // Initial was false (mock default)
    // Actually we can't easily check signal internal state if it acts on service directly
    // without spying on set.
    // Let's verify the logic:
    // this.gameManagerService.whitePcPlayerEnabled.set(!this.gameManagerService.whitePcPlayerEnabled())
    // Since we provided a real signal in Mock, we can check its value.
    expect(gameManagerService.whitePcPlayerEnabled()).toBe(true);
  });
});
