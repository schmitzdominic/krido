import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditAccountContentComponent } from './add-or-edit-account-content.component';

describe('AddOrEditAccountContentComponent', () => {
  let component: AddOrEditAccountContentComponent;
  let fixture: ComponentFixture<AddOrEditAccountContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrEditAccountContentComponent]
    });
    fixture = TestBed.createComponent(AddOrEditAccountContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
