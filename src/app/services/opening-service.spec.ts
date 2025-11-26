import { TestBed } from '@angular/core/testing';

import { OpeningService } from './opening-service';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OpeningService', () => {
  let service: OpeningService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OpeningService,
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    service = TestBed.inject(OpeningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
