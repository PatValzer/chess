import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountDownComponent } from './count-down';
import { GameManagerService } from '../../../services/game-manager-service';
import { CountdownService } from '../../../services/countdown-service';
import { signal } from '@angular/core';

class MockGameManagerService {
  currentMoveIndex = signal(0);
  reviewMode = signal(false);
  currentTurn = signal('w');
}

class MockCountdownService {
  timeWhite = signal(300);
  timeBlack = signal(300);
  stop() { }
  start() { }
  reset() { }
  activePlayer = signal('w');
}

describe('CountDown', () => {
  let component: CountDownComponent;
  let fixture: ComponentFixture<CountDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountDownComponent],
      providers: [
        { provide: GameManagerService, useClass: MockGameManagerService },
        { provide: CountdownService, useClass: MockCountdownService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CountDownComponent);
    fixture.componentRef.setInput('countDownColor', 'w');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
