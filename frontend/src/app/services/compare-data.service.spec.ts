import { TestBed } from '@angular/core/testing';

import { CompareDataService } from './compare-data.service';

describe('CompareDataService', () => {
  let service: CompareDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompareDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
