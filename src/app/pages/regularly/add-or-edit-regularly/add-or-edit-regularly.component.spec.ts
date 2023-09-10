import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditRegularlyComponent } from './add-or-edit-regularly.component';

describe('AddOrEditRegularlyComponent', () => {
  let component: AddOrEditRegularlyComponent;
  let fixture: ComponentFixture<AddOrEditRegularlyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrEditRegularlyComponent]
    });
    fixture = TestBed.createComponent(AddOrEditRegularlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
