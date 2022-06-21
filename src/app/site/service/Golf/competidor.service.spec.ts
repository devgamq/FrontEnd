import { TestBed, inject } from '@angular/core/testing';

import { CompetidorService } from './competidor.service';

describe('CompetidorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompetidorService]
    });
  });

  it('should be created', inject([CompetidorService], (service: CompetidorService) => {
    expect(service).toBeTruthy();
  }));
});
