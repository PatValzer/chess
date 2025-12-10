import { TestBed } from '@angular/core/testing';
import { CountdownConfig, CountdownService } from './countdown-service';

describe('CountdownService', () => {
  let service: CountdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountdownService]
    });
    service = TestBed.inject(CountdownService);
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with config', () => {
    const config = { initial: 60000, increment: 0, delay: 0 };
    service.init(config);
    expect(service.timeWhite()).toBe(60000);
    expect(service.timeBlack()).toBe(60000);
    expect(service.activePlayer()).toBe('w');
    expect(service.isRunning()).toBe(false);
  });

  it('should decrease time for active player (White) when running', () => {
    service.init({ initial: 10000 });
    service.start();

    // Fast forward 1 second
    jasmine.clock().tick(1000);

    // First tick happens at 1000ms.
    expect(service.timeWhite()).toBe(9000);
    expect(service.timeBlack()).toBe(10000); // Black shouldn't change

    service.stop();
  });

  it('should switch turn and apply increment', () => {
    service.init({ initial: 10000, increment: 2000 });
    service.activePlayer.set('w');

    service.switchTurn();
    expect(service.timeWhite()).toBe(12000);
  });
});
