import { TestBed } from '@angular/core/testing';

import { OpenAIService } from './openai.service';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OpenaiService', () => {
  let service: OpenAIService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(withInterceptorsFromDi()),
      OpenAIService, provideZonelessChangeDetection()] });
    service = TestBed.inject(OpenAIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
