import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameMoves } from './game-moves';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { GameManagerService } from '../../../services/game-manager-service';
import { By } from '@angular/platform-browser';

class MockGameManagerService {
  moves = signal([
    { san: 'e4' },
    { san: 'e5' }
  ]);
  currentMoveIndex = signal(0);
  goToMove = jasmine.createSpy('goToMove');
}

describe('GameMoves', () => {
  let component: GameMoves;
  let fixture: ComponentFixture<GameMoves>;
  let gameManagerService: MockGameManagerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameMoves],
      providers: [
        provideZonelessChangeDetection(),
        { provide: GameManagerService, useClass: MockGameManagerService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameMoves);
    component = fixture.componentInstance;
    gameManagerService = TestBed.inject(GameManagerService) as unknown as MockGameManagerService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render moves', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent.trim()).toBe('e4');
    expect(buttons[1].nativeElement.textContent.trim()).toBe('e5');
  });

  it('should call goToMove on click', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[0].nativeElement.click();
    expect(gameManagerService.goToMove).toHaveBeenCalledWith(0);
  });
});
