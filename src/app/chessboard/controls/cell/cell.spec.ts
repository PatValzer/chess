import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellComponent } from './cell';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Square } from '../../models/Square';

describe('Cell', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideZonelessChangeDetection()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CellComponent);
    // fixture.setInput('cell', { file: 'a', rank: 1 });
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cell', new Square('a', 1));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
