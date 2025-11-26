import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNavigator } from './game-navigator';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GameNavigator', () => {
  let component: GameNavigator;
  let fixture: ComponentFixture<GameNavigator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameNavigator],
      providers: [  provideHttpClient(withInterceptorsFromDi()),provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameNavigator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
