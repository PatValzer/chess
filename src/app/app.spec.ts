// ...existing code...
import { provideZonelessChangeDetection, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection()
      ],
      // avoid needing to declare all nested components for shallow tests
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should expose the default title signal "chess"', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;
    // title is an Angular signal; call it to read the current value
    expect(typeof app.title).toBe('function');
    expect(app.title()).toBe('chess');
  });

  it('restart(reset) should increment resetGame signal', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;
    // initial value
    expect(app.resetGame()).toBe(0);
    app.restart(true);
    // update applies immediately in zoneless tests
    expect(app.resetGame()).toBe(1);
  });

  it('template should contain main child selectors', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-chessboard')).toBeTruthy();
    expect(el.querySelector('app-game-manager')).toBeTruthy();
    expect(el.querySelector('app-opening-tree')).toBeTruthy();
  });
});