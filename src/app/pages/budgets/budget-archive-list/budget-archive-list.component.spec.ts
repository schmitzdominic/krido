import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetArchiveListComponent } from './budget-archive-list.component';

describe('BudgetArchiveListComponent', () => {
  let component: BudgetArchiveListComponent;
  let fixture: ComponentFixture<BudgetArchiveListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BudgetArchiveListComponent]
    });
    fixture = TestBed.createComponent(BudgetArchiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
