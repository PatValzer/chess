import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameNavigator } from './game-navigator';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { GameManagerService } from '../../../services/game-manager-service';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockGameManagerService {
  currentMoveIndex = signal(1);
  moves = signal([{}, {}, {}]); // 3 moves
  chess = { moveNumber: signal(1) };
  prevMove = jasmine.createSpy('prevMove');
  nextMove = jasmine.createSpy('nextMove');
  goToMove = jasmine.createSpy('goToMove');
}

describe('GameNavigator', () => {
  let component: GameNavigator;
  let fixture: ComponentFixture<GameNavigator>;
  let gameManagerService: MockGameManagerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameNavigator, MatIconModule, MatButtonModule, MatInputModule, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: GameManagerService, useClass: MockGameManagerService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameNavigator);
    component = fixture.componentInstance;
    gameManagerService = TestBed.inject(GameManagerService) as unknown as MockGameManagerService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call prevMove on previous button click', () => {
    // Buttons: [FastRewind, Undo, Next, FastForward]
    // 2nd button is Undo/Prev
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[1].nativeElement.click();
    expect(gameManagerService.prevMove).toHaveBeenCalled();
  });

  it('should call nextMove on next button click', () => {
    // 3rd button is Redo/Next
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[2].nativeElement.click();
    expect(gameManagerService.nextMove).toHaveBeenCalled();
  });

  it('should disable prev button at start', () => {
    gameManagerService.currentMoveIndex.set(0);
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[1].nativeElement.disabled).toBeTrue();
  });
});
