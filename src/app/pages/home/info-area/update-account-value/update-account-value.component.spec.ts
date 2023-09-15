import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAccountValueComponent } from './update-account-value.component';

describe('UpdateAccountValueComponent', () => {
  let component: UpdateAccountValueComponent;
  let fixture: ComponentFixture<UpdateAccountValueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAccountValueComponent]
    });
    fixture = TestBed.createComponent(UpdateAccountValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
