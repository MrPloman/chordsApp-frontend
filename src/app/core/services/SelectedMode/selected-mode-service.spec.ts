import { TestBed } from '@angular/core/testing';

import { SelectedModeService } from './selected-mode-service';

describe('SelectedModeService', () => {
  let service: SelectedModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
