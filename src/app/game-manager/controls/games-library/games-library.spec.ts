import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesLibrary } from './games-library';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GamesLibrary', () => {
  let component: GamesLibrary;
  let fixture: ComponentFixture<GamesLibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesLibrary],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesLibrary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
