import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBudgetContentComponent } from './edit-budget-content.component';

describe('EditBudgetContentComponent', () => {
  let component: EditBudgetContentComponent;
  let fixture: ComponentFixture<EditBudgetContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBudgetContentComponent]
    });
    fixture = TestBed.createComponent(EditBudgetContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
