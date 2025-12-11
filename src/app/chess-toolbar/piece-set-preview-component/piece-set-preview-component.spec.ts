import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceSetPreviewComponent } from './piece-set-preview-component';

describe('PieceSetPreviewComponent', () => {
  let component: PieceSetPreviewComponent;
  let fixture: ComponentFixture<PieceSetPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceSetPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieceSetPreviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
