import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBudgetContentComponent } from './show-budget-content.component';

describe('EditBudgetContentComponent', () => {
  let component: ShowBudgetContentComponent;
  let fixture: ComponentFixture<ShowBudgetContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowBudgetContentComponent]
    });
    fixture = TestBed.createComponent(ShowBudgetContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
