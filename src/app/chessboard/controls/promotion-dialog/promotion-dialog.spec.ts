import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionDialog } from './promotion-dialog';
import { provideZonelessChangeDetection } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('PromotionDialog', () => {
  let component: PromotionDialog;
  let fixture: ComponentFixture<PromotionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionDialog],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PromotionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
