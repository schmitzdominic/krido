import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryListEntryComponent } from './entry-list-entry.component';

describe('EntryListEntryComponent', () => {
  let component: EntryListEntryComponent;
  let fixture: ComponentFixture<EntryListEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntryListEntryComponent]
    });
    fixture = TestBed.createComponent(EntryListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
