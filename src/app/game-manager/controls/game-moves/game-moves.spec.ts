import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMoves } from './game-moves';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GameMoves', () => {
  let component: GameMoves;
  let fixture: ComponentFixture<GameMoves>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameMoves],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameMoves);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
