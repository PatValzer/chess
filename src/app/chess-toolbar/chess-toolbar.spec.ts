import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessToolbar } from './chess-toolbar';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ChessToolbar', () => {
  let component: ChessToolbar;
  let fixture: ComponentFixture<ChessToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChessToolbar],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChessToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
