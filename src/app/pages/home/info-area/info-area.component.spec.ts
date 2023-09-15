import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAreaComponent } from './info-area.component';

describe('InfoAreaComponent', () => {
  let component: InfoAreaComponent;
  let fixture: ComponentFixture<InfoAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoAreaComponent]
    });
    fixture = TestBed.createComponent(InfoAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
