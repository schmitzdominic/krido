import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsUserComponent } from './settings-user.component';

describe('SettingsUserComponent', () => {
  let component: SettingsUserComponent;
  let fixture: ComponentFixture<SettingsUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsUserComponent]
    });
    fixture = TestBed.createComponent(SettingsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
