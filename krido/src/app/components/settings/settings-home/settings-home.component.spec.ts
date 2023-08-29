import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsHomeComponent } from './settings-home.component';

describe('SettingsHomeComponent', () => {
  let component: SettingsHomeComponent;
  let fixture: ComponentFixture<SettingsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsHomeComponent]
    });
    fixture = TestBed.createComponent(SettingsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
