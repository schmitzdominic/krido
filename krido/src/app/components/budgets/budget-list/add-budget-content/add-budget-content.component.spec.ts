import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBudgetContentComponent } from './add-budget-content.component';

describe('BudgetModalComponent', () => {
  let component: AddBudgetContentComponent;
  let fixture: ComponentFixture<AddBudgetContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBudgetContentComponent]
    });
    fixture = TestBed.createComponent(AddBudgetContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
