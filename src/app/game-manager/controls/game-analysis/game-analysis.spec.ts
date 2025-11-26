import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAnalysis } from './game-analysis';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GameAnalysis', () => {
  let component: GameAnalysis;
  let fixture: ComponentFixture<GameAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameAnalysis],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
