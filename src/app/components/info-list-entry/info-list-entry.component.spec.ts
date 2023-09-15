import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoListEntryComponent } from './info-list-entry.component';

describe('InfoListEntryComponent', () => {
  let component: InfoListEntryComponent;
  let fixture: ComponentFixture<InfoListEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoListEntryComponent]
    });
    fixture = TestBed.createComponent(InfoListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
