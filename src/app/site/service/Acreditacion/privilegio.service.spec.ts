import { TestBed, inject } from '@angular/core/testing';

import { PrivilegioService } from './privilegio.service';

describe('PrivilegioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivilegioService]
    });
  });

  it('should be created', inject([PrivilegioService], (service: PrivilegioService) => {
    expect(service).toBeTruthy();
  }));
});
