import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarCompetidorComponent } from './buscar-competidor.component';

describe('BuscarCompetidorComponent', () => {
  let component: BuscarCompetidorComponent;
  let fixture: ComponentFixture<BuscarCompetidorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarCompetidorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarCompetidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
