import { TestBed, inject } from '@angular/core/testing';

import { AcreditacionPersonaService } from './acreditacion-persona.service';

describe('AcreditacionPersonaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AcreditacionPersonaService]
    });
  });

  it('should be created', inject([AcreditacionPersonaService], (service: AcreditacionPersonaService) => {
    expect(service).toBeTruthy();
  }));
});
