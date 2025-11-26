import { TestBed } from '@angular/core/testing';

import { PopupDialogService } from './popup-dialog-service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('PopupDialogService', () => {
  let service: PopupDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopupDialogService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(PopupDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
