import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreditacionInscripcionEventoComponent } from './acreditacion-inscripcion-evento.component';

describe('AcreditacionInscripcionEventoComponent', () => {
  let component: AcreditacionInscripcionEventoComponent;
  let fixture: ComponentFixture<AcreditacionInscripcionEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcreditacionInscripcionEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcreditacionInscripcionEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
