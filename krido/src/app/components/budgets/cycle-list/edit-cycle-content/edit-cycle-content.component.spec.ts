import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCycleContentComponent } from './edit-cycle-content.component';

describe('EditCycleContentComponent', () => {
  let component: EditCycleContentComponent;
  let fixture: ComponentFixture<EditCycleContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCycleContentComponent]
    });
    fixture = TestBed.createComponent(EditCycleContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
