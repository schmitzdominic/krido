import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularlyListComponent } from './regularly-list.component';

describe('RegularlyListComponent', () => {
  let component: RegularlyListComponent;
  let fixture: ComponentFixture<RegularlyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegularlyListComponent]
    });
    fixture = TestBed.createComponent(RegularlyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
