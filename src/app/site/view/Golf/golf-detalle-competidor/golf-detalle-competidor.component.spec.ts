import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GolfDetalleCompetidorComponent } from './golf-detalle-competidor.component';

describe('GolfDetalleCompetidorComponent', () => {
  let component: GolfDetalleCompetidorComponent;
  let fixture: ComponentFixture<GolfDetalleCompetidorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GolfDetalleCompetidorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GolfDetalleCompetidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
