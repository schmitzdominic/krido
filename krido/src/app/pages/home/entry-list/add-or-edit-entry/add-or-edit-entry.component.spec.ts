import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditEntryComponent } from './add-or-edit-entry.component';

describe('AddOrEditEntryComponent', () => {
  let component: AddOrEditEntryComponent;
  let fixture: ComponentFixture<AddOrEditEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrEditEntryComponent]
    });
    fixture = TestBed.createComponent(AddOrEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
