import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameManager } from './game-manager';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GameManager', () => {
  let component: GameManager;
  let fixture: ComponentFixture<GameManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameManager],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameManager);
    fixture.componentRef.setInput('resetGame', 0);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
