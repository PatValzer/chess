import { TestBed } from '@angular/core/testing';
import { BreakpointService } from './breakpoint-service';

describe('BreakpointService', () => {
  let service: BreakpointService;
  let matchMediaSpy: jasmine.Spy;

  beforeEach(() => {
    // Mock matchMedia
    matchMediaSpy = jasmine.createSpy('matchMedia').and.callFake((query: string) => {
      return {
        matches: query === '(max-width: 639.99px)', // Default to xs for test
        media: query,
        onchange: null,
        addListener: jasmine.createSpy('addListener'), // Deprecated
        removeListener: jasmine.createSpy('removeListener'), // Deprecated
        addEventListener: jasmine.createSpy('addEventListener'),
        removeEventListener: jasmine.createSpy('removeEventListener'),
        dispatchEvent: jasmine.createSpy('dispatchEvent'),
      };
    });
    window.matchMedia = matchMediaSpy;

    TestBed.configureTestingModule({
      providers: [BreakpointService]
    });
    service = TestBed.inject(BreakpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect initial breakpoint', () => {
    // Based on our mock returning true for xs query
    expect(service.current()).toBe('xs');
    expect(service.is('xs')).toBeTrue();
  });

  it('should identify mobile devices correctly', () => {
    // xs is mobile
    expect(service.isMobile()).toBeTrue();
    expect(service.isTablet()).toBeFalse();
  });
});
