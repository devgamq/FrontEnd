import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreditacionDetalleComponent } from './acreditacion-detalle.component';

describe('AcreditacionDetalleComponent', () => {
  let component: AcreditacionDetalleComponent;
  let fixture: ComponentFixture<AcreditacionDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcreditacionDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcreditacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
