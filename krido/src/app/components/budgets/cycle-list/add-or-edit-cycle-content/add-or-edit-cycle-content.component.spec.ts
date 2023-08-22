import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditCycleContentComponent } from './add-or-edit-cycle-content.component';

describe('AddCycleContentComponent', () => {
  let component: AddOrEditCycleContentComponent;
  let fixture: ComponentFixture<AddOrEditCycleContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrEditCycleContentComponent]
    });
    fixture = TestBed.createComponent(AddOrEditCycleContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
