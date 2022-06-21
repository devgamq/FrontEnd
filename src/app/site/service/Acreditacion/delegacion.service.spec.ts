import { TestBed, inject } from '@angular/core/testing';

import { DelegacionService } from './delegacion.service';

describe('DelegacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DelegacionService]
    });
  });

  it('should be created', inject([DelegacionService], (service: DelegacionService) => {
    expect(service).toBeTruthy();
  }));
});
