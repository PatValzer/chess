import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EatenPiecesComponent } from './eaten-pieces';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EatenPieces', () => {
  let component: EatenPiecesComponent;
  let fixture: ComponentFixture<EatenPiecesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EatenPiecesComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EatenPiecesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
