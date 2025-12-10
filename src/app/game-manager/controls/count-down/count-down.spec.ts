import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountDownComponent } from './count-down';
import { GameManagerService } from '../../../services/game-manager-service';
import { CountdownService } from '../../../services/countdown-service';
import { signal } from '@angular/core';
import { CountDownFormatPipePipe } from '../../../pipes/count-down-format-pipe';
import { By } from '@angular/platform-browser';

class MockGameManagerService {
  currentMoveIndex = signal(0);
  reviewMode = signal(false);
  currentTurn = signal('w');
}

class MockCountdownService {
  timeWhite = signal(300000); // 5 mins
  timeBlack = signal(300000);
  stop() { }
  start() { }
  reset() { }
  activePlayer = signal('w');
}

describe('CountDown', () => {
  let component: CountDownComponent;
  let fixture: ComponentFixture<CountDownComponent>;
  let countdownService: MockCountdownService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountDownComponent, CountDownFormatPipePipe],
      providers: [
        { provide: GameManagerService, useClass: MockGameManagerService },
        { provide: CountdownService, useClass: MockCountdownService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CountDownComponent);
    countdownService = TestBed.inject(CountdownService) as unknown as MockCountdownService;
    fixture.componentRef.setInput('countDownColor', 'w');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display time from service for white', () => {
    // Assuming template uses format pipe to show 5:00
    // We need to check the exact format logic, but usually 300000ms -> 05:00
    const text = fixture.nativeElement.textContent.trim();
    expect(text).toContain('05:00');
  });

  it('should update display when service updates time', () => {
    countdownService.timeWhite.set(299000); // 04:59
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent.trim();
    expect(text).toContain('04:59');
  });
});
