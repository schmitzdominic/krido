import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCycleContentComponent } from './add-cycle-content.component';

describe('AddCycleContentComponent', () => {
  let component: AddCycleContentComponent;
  let fixture: ComponentFixture<AddCycleContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCycleContentComponent]
    });
    fixture = TestBed.createComponent(AddCycleContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
