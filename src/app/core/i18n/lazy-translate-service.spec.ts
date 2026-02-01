import { TestBed } from '@angular/core/testing';

import { LazyTranslateService } from './lazy-translate-service';

describe('LazyTranslateService', () => {
  let service: LazyTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LazyTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
