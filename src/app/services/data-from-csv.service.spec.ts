import { TestBed } from '@angular/core/testing';

import { DataFromCSVService } from './data-from-csv.service';

describe('DataFromCSVService', () => {
  let service: DataFromCSVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFromCSVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
