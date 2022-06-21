import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonDeporteAcreditacionComponent } from './boton-deporte-acreditacion.component';

describe('BotonDeporteAcreditacionComponent', () => {
  let component: BotonDeporteAcreditacionComponent;
  let fixture: ComponentFixture<BotonDeporteAcreditacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotonDeporteAcreditacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotonDeporteAcreditacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
