import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningTreeComponent } from './opening-tree';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OpeningTree', () => {
  let component: OpeningTreeComponent;
  let fixture: ComponentFixture<OpeningTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpeningTreeComponent],
      providers: [provideHttpClient(withInterceptorsFromDi()),
      provideZonelessChangeDetection()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OpeningTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
