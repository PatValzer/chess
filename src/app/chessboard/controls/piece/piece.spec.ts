import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceComponent } from './piece';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Piece', () => {
  let component: PieceComponent;
  let fixture: ComponentFixture<PieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceComponent],
      providers: [
        
        provideZonelessChangeDetection()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PieceComponent);
    
    component = fixture.componentInstance;
    // fixture.setInput('piece', { type: 'pawn', color: 'white' });
    // fixture.setInput('selected', true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
