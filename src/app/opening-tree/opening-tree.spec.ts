import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningTreeComponent } from './opening-tree';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OpeningService } from '../services/opening-service';
import { GameManagerService } from '../services/game-manager-service';

class MockOpeningService {
  openings = signal([]);
  currentOpening = signal(null);
}

class MockGameManagerService {
  reset() { }
  move(move: any) { }
}

describe('OpeningTree', () => {
  let component: OpeningTreeComponent;
  let fixture: ComponentFixture<OpeningTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpeningTreeComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection(),
        { provide: OpeningService, useClass: MockOpeningService },
        { provide: GameManagerService, useClass: MockGameManagerService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OpeningTreeComponent);
    fixture.componentRef.setInput('openings', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
