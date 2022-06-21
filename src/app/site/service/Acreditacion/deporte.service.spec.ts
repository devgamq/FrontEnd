import { TestBed, inject } from '@angular/core/testing';

import { DeporteService } from './deporte.service';

describe('DeporteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeporteService]
    });
  });

  it('should be created', inject([DeporteService], (service: DeporteService) => {
    expect(service).toBeTruthy();
  }));
});
