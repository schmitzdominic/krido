import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularlyComponent } from './regularly.component';

describe('RegularlyComponent', () => {
  let component: RegularlyComponent;
  let fixture: ComponentFixture<RegularlyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegularlyComponent]
    });
    fixture = TestBed.createComponent(RegularlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
