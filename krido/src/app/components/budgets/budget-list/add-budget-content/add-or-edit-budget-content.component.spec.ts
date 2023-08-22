import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditBudgetContentComponent } from './add-or-edit-budget-content.component';

describe('BudgetModalComponent', () => {
  let component: AddOrEditBudgetContentComponent;
  let fixture: ComponentFixture<AddOrEditBudgetContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrEditBudgetContentComponent]
    });
    fixture = TestBed.createComponent(AddOrEditBudgetContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
