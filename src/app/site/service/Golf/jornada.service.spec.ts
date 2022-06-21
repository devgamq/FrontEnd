import { TestBed, inject } from '@angular/core/testing';

import { JornadaService } from './jornada.service';

describe('JornadaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JornadaService]
    });
  });

  it('should ...', inject([JornadaService], (service: JornadaService) => {
    expect(service).toBeTruthy();
  }));
});
