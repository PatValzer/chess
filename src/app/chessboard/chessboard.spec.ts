import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chessboard } from './chessboard';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Chessboard', () => {
  let component: Chessboard;
  let fixture: ComponentFixture<Chessboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chessboard],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chessboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
