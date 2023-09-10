import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularlyListEntryComponent } from './regularly-list-entry.component';

describe('RegularlyListEntryComponent', () => {
  let component: RegularlyListEntryComponent;
  let fixture: ComponentFixture<RegularlyListEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegularlyListEntryComponent]
    });
    fixture = TestBed.createComponent(RegularlyListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
