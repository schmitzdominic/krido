import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListEntryComponent } from './account-list-entry.component';

describe('AccountListEntryComponent', () => {
  let component: AccountListEntryComponent;
  let fixture: ComponentFixture<AccountListEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountListEntryComponent]
    });
    fixture = TestBed.createComponent(AccountListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
