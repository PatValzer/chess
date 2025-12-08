import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieceComponent } from './piece';
import { provideZonelessChangeDetection } from '@angular/core';

import { Piece } from '../../models/Piece';

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
    fixture.componentRef.setInput('piece', new Piece('w', 'p'));
    fixture.componentRef.setInput('selected', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
