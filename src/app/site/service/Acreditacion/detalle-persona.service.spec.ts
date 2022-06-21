import { TestBed, inject } from '@angular/core/testing';

import { DetallePersonaService } from './detalle-persona.service';

describe('DetallePersonaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetallePersonaService]
    });
  });

  it('should be created', inject([DetallePersonaService], (service: DetallePersonaService) => {
    expect(service).toBeTruthy();
  }));
});
