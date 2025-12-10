import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameAnalysis } from './game-analysis';
import { StockfishService } from '../../../services/stockfish-service';
import { GameManagerService } from '../../../services/game-manager-service';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

class MockStockfishService {
  result = signal({
    whiteWinProbability: 400, // 40%
    drawProbability: 200,    // 20%
    blackWinProbability: 400,// 40%
    cp: 0,
    mate: 0,
    bestMove: signal('')
  });
}

class MockGameManagerService {
}

describe('GameAnalysis', () => {
  let component: GameAnalysis;
  let fixture: ComponentFixture<GameAnalysis>;
  let stockfishService: MockStockfishService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameAnalysis],
      providers: [
        provideZonelessChangeDetection(),
        { provide: StockfishService, useClass: MockStockfishService },
        { provide: GameManagerService, useClass: MockGameManagerService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameAnalysis);
    component = fixture.componentInstance;
    stockfishService = TestBed.inject(StockfishService) as unknown as MockStockfishService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute position analysis correctly', () => {
    // Logic in component:
    // whiteWinProbability: (draw/2)/1000 + white/1000
    // draw: 200 -> 100/1000 = 0.1
    // white: 400 -> 400/1000 = 0.4
    // total = 0.5

    // Note: The logic seems to normalize 0-1000 range to 0-1?
    // Let's verify component logic: `(result.drawProbability / 2) / 1000 + result.whiteWinProbability / 1000`

    const analysis = component.positionAnalysis();
    expect(analysis.whiteWinProbability).toBeCloseTo(0.5);
    expect(analysis.blackWinProbability).toBeCloseTo(0.5);
  });
});
