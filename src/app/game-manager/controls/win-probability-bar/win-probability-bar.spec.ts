import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinProbabilityBar } from './win-probability-bar';
import { provideZonelessChangeDetection } from '@angular/core';

describe('WinProbabilityBar', () => {
  let component: WinProbabilityBar;
  let fixture: ComponentFixture<WinProbabilityBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinProbabilityBar],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinProbabilityBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
