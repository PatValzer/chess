import { TestBed } from '@angular/core/testing';

import { GameManagerService } from './game-manager-service';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GameManagerService', () => {
  let service: GameManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameManagerService, provideZonelessChangeDetection(), provideHttpClient(withInterceptorsFromDi())]
    });
    service = TestBed.inject(GameManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
