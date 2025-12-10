import { TestBed } from '@angular/core/testing';
import { StockfishService } from './stockfish-service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('StockfishService', () => {
  let service: StockfishService;
  let mockWorker: jasmine.SpyObj<Worker>;

  beforeEach(() => {
    // Mock Worker globally
    mockWorker = jasmine.createSpyObj('Worker', ['postMessage', 'terminate', 'onmessage']);

    // We need to spy on the global Worker constructor if possible.
    // Since 'Worker' is not easily mockable as a global constructor in all environments without 
    // touching globalThis, and the service instantiates it repeatedly in constructor,
    // we might need to rely on the fact that we can replace window.Worker.
    // However, it's safer to just let it try to create one or failing that, 
    // we can use a factory if the service allowed it.
    // But the user code has `new Worker(...)`.

    // Strategy: Spy on window.Worker
    const mockWorkerFactory = jasmine.createSpy('Worker').and.returnValue(mockWorker);
    (window as any).Worker = mockWorkerFactory;

    TestBed.configureTestingModule({
      providers: [
        StockfishService,
        provideZonelessChangeDetection()
      ]
    });
    service = TestBed.inject(StockfishService);
  });

  it('should be created and initialize worker', () => {
    expect(service).toBeTruthy();
    expect((window as any).Worker).toHaveBeenCalled();
    expect(mockWorker.postMessage).toHaveBeenCalledWith('Threads 1');
  });

  it('should send position to engine', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    service.setPosition(fen);
    expect(mockWorker.postMessage).toHaveBeenCalledWith(`position fen ${fen}`);
  });

  it('should send go command to engine', () => {
    service.go(10);
    expect(mockWorker.postMessage).toHaveBeenCalledWith('go depth 10');
  });

  it('should handle evaluation messages from engine', () => {
    // Simulate worker message
    const message = { data: 'info depth 10 score cp 50 nodes 1000' };

    // We need to access the onmessage handler.
    // The service assigns this.engine.onmessage = this.stockfishMessageHandler
    // So we can trigger it:
    if (mockWorker.onmessage) {
      // Handle type safety for onmessage
      (mockWorker.onmessage as Function)(message);
    }

    // Since signal updates are synchronous in zoneless (usually) or effect based?
    // Signals update immediately.
    // Logic: `this.result().cp = currentTurn == 'w' ? cp / 100 ...`
    // Default turn is 'w'.
    // cp 50 -> 0.5
    expect(service.result().cp).toBe(0.5);
  });

  it('should parse mate score', () => {
    const message = { data: 'info depth 10 score mate 5 ' };
    (mockWorker.onmessage as Function)(message);
    expect(service.result().mate).toBe(5);
  });

  it('should parse best move', () => {
    const message = { data: 'bestmove e2e4' };
    (mockWorker.onmessage as Function)(message);
    expect(service.result().bestMove()).toBe('e2e4');
  });
});
