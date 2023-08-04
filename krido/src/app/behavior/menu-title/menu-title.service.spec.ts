import { TestBed } from '@angular/core/testing';

import { MenuTitleService } from './menu-title.service';

describe('MenuTitleService', () => {
  let service: MenuTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
