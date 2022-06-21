import { TestBed, inject } from '@angular/core/testing';

import { DeportistaService } from './deportista.service';

describe('DeportistaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeportistaService]
    });
  });

  it('should be created', inject([DeportistaService], (service: DeportistaService) => {
    expect(service).toBeTruthy();
  }));
});
