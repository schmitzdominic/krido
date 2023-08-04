import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualMonthComponent } from './actual-month.component';

describe('ActualMonthComponent', () => {
  let component: ActualMonthComponent;
  let fixture: ComponentFixture<ActualMonthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualMonthComponent]
    });
    fixture = TestBed.createComponent(ActualMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
