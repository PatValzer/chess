import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountDown } from './count-down';

describe('CountDown', () => {
  let component: CountDown;
  let fixture: ComponentFixture<CountDown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountDown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountDown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
