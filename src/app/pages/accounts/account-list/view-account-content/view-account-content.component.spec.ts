import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccountContentComponent } from './view-account-content.component';

describe('ViewAccountContentComponent', () => {
  let component: ViewAccountContentComponent;
  let fixture: ComponentFixture<ViewAccountContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAccountContentComponent]
    });
    fixture = TestBed.createComponent(ViewAccountContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
