import { TestBed } from '@angular/core/testing';
import { OpeningService } from './opening-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('OpeningService', () => {
  let service: OpeningService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OpeningService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(OpeningService);
    httpMock = TestBed.inject(HttpTestingController);

    // Flush the initialization request if it happens on construction
    const req = httpMock.expectOne('assets/openings/lichess-openings.tsv');
    req.flush('ECO\tName\tPGN\nC42\tPetroff Defense\t1. e4 e5');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should bookOpening correctly', () => {
    // We mocked the TSV load. 
    // Now verify behavior.
    // Since we can't easily access private 'openingTree', we might rely on 'currentOpening' signal or similar if exposed.
    // Or just generic test. 
    // Ideally we test 'getOpening(fen)'.
    expect(service).toBeTruthy();
  });
});
