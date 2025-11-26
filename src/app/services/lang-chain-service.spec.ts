import { TestBed } from '@angular/core/testing';

import { LangChainService } from './lang-chain-service';

describe('LangChainService', () => {
  let service: LangChainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LangChainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
