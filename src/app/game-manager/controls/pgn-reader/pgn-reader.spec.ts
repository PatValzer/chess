import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgnReader } from './pgn-reader';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PgnReader', () => {
  let component: PgnReader;
  let fixture: ComponentFixture<PgnReader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgnReader],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PgnReader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
