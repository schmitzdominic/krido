import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetListEntryComponent } from './budget-list-entry.component';

describe('BudgetListEntryComponent', () => {
  let component: BudgetListEntryComponent;
  let fixture: ComponentFixture<BudgetListEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BudgetListEntryComponent]
    });
    fixture = TestBed.createComponent(BudgetListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
