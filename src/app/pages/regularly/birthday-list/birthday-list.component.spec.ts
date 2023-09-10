import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayListComponent } from './birthday-list.component';

describe('BirthdayListComponent', () => {
  let component: BirthdayListComponent;
  let fixture: ComponentFixture<BirthdayListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BirthdayListComponent]
    });
    fixture = TestBed.createComponent(BirthdayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
