import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBudgetContentComponent } from './view-budget-content.component';

describe('EditBudgetContentComponent', () => {
  let component: ViewBudgetContentComponent;
  let fixture: ComponentFixture<ViewBudgetContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBudgetContentComponent]
    });
    fixture = TestBed.createComponent(ViewBudgetContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
