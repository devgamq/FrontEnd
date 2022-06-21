import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreditacionDatosPersonalesComponent } from './acreditacion-datos-personales.component';

describe('AcreditacionDatosPersonalesComponent', () => {
  let component: AcreditacionDatosPersonalesComponent;
  let fixture: ComponentFixture<AcreditacionDatosPersonalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcreditacionDatosPersonalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcreditacionDatosPersonalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
