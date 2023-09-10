import { TestBed } from '@angular/core/testing';

import { RegularlyService } from './regularly.service';

describe('RegularlyService', () => {
  let service: RegularlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegularlyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
